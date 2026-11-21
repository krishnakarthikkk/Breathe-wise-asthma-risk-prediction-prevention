import os
import math
from datetime import datetime, timezone
from functools import wraps
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv
from flask import Flask, g, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
from bson import ObjectId

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": [
    os.getenv("FRONTEND_ORIGIN", "http://localhost:5173"),
    r"^https?://(localhost|127\.0\.0\.1):517[0-9]$",
]}})

FEATURES = ["age", "bmi", "smoking", "family_history", "allergy", "wheezing",
            "night_symptoms", "exercise_trigger", "air_quality", "respiratory_infections"]
MODEL_NAMES = {"ensemble": "Combined model average", "random_forest": "Random Forest", "logistic_regression": "Logistic Regression", "xgboost": "XGBoost"}
MODELS = {}
METRICS = {}
EXPLANATION_MODE = "SHAP"
DATA_PATH = Path(__file__).parent / "data" / "asthma_synthetic.csv"
mongo = None
database = None
users = None
journals = None
mongo_error = None
JWT_SECRET = os.getenv("JWT_SECRET", "local-demo-secret-change-before-deployment")


def connect_db():
    global mongo, database, users, journals, mongo_error
    uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=10000)
        client.admin.command("ping")
        database = client[os.getenv("MONGODB_DB", "breathewise_demo")]
        mongo = database.predictions
        users = database.users
        journals = database.symptom_journal
        mongo_error = None
    except Exception as exc:
        mongo = None
        database = users = journals = None
        mongo_error = f"{type(exc).__name__}: {exc}"
        print(f"MongoDB connection failed ({type(exc).__name__}). Check backend/.env, Atlas IP access, and database credentials.")


def issue_token(user):
    return jwt.encode({"sub": str(user["_id"]), "exp": datetime.now(timezone.utc).timestamp() + 60 * 60 * 24 * 7}, JWT_SECRET, algorithm="HS256")


def login_required(handler):
    @wraps(handler)
    def wrapped(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        token = header.removeprefix("Bearer ")
        if not token:
            return jsonify({"error": "Please sign in to access this feature."}), 401
        try:
            g.user_id = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])["sub"]
        except jwt.InvalidTokenError:
            return jsonify({"error": "Your session expired. Please sign in again."}), 401
        if g.user_id != "demo" and users is None:
            return jsonify({"error": "Account storage is unavailable. Start MongoDB and restart the API."}), 503
        return handler(*args, **kwargs)
    return wrapped


def build_models():
    global MODELS, METRICS
    if MODELS:
        return
    if not DATA_PATH.exists():
        from generate_dataset import main
        main()
    df = pd.read_csv(DATA_PATH)
    x = df[FEATURES]
    y = df["asthma_label_synthetic"]
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.22, random_state=17, stratify=y)
    candidates = {
        "random_forest": RandomForestClassifier(n_estimators=180, min_samples_leaf=3, class_weight="balanced", random_state=17),
        "logistic_regression": Pipeline([("imputer", SimpleImputer()), ("scale", StandardScaler()),
                                          ("model", LogisticRegression(max_iter=1200, class_weight="balanced"))]),
    }
    try:
        from xgboost import XGBClassifier
        candidates["xgboost"] = XGBClassifier(n_estimators=140, max_depth=3, learning_rate=0.045,
                                                subsample=0.85, colsample_bytree=0.9,
                                                eval_metric="logloss", random_state=17)
    except ImportError:
        pass
    for key, model in candidates.items():
        model.fit(x_train, y_train)
        probs = model.predict_proba(x_test)[:, 1]
        METRICS[key] = {"accuracy": round(accuracy_score(y_test, probs >= 0.5), 3),
                        "auc": round(roc_auc_score(y_test, probs), 3),
                        "f1": round(f1_score(y_test, probs >= 0.5), 3)}
        MODELS[key] = model


def explain(model, values, model_key):
    global EXPLANATION_MODE
    try:
        import shap
        if model_key in ("random_forest", "xgboost"):
            explainer = shap.TreeExplainer(model)
            raw = explainer.shap_values(values)
        else:
            background = pd.read_csv(DATA_PATH)[FEATURES].sample(80, random_state=7)
            explainer = shap.LinearExplainer(model.named_steps["model"],
                                              model.named_steps["scale"].transform(background))
            raw = explainer.shap_values(model.named_steps["scale"].transform(values))
        if isinstance(raw, list):
            raw = raw[-1]
        if getattr(raw, "ndim", 0) == 3:
            raw = raw[0, :, -1]
        else:
            raw = raw[0]
        EXPLANATION_MODE = "SHAP"
        return [{"feature": name.replace("_", " ").title(), "value": round(float(score), 4),
                 "input": float(values.iloc[0][name])} for name, score in zip(FEATURES, raw)]
    except Exception:
        # Local perturbation fallback keeps demo usable if optional SHAP fails to load.
        EXPLANATION_MODE = "Median perturbation"
        base = float(model.predict_proba(values)[0, 1])
        output = []
        for feature in FEATURES:
            changed = values.copy()
            changed.loc[:, feature] = pd.read_csv(DATA_PATH)[feature].median()
            effect = base - float(model.predict_proba(changed)[0, 1])
            output.append({"feature": feature.replace("_", " ").title(), "value": round(effect, 4),
                           "input": float(values.iloc[0][feature])})
        return output


@app.post("/api/auth/signup")
def signup():
    if users is None:
        return jsonify({"error": "Account storage is unavailable. Check the Flask terminal for the MongoDB connection diagnostic."}), 503
    body = request.get_json(silent=True) or {}
    name = str(body.get("name", "")).strip()[:80]
    email = str(body.get("email", "")).strip().lower()[:254]
    password = str(body.get("password", ""))
    if len(name) < 2 or "@" not in email or len(password) < 8:
        return jsonify({"error": "Enter your name, a valid email, and a password with at least 8 characters."}), 400
    if users.find_one({"email": email}):
        return jsonify({"error": "An account with this email already exists. Sign in instead."}), 409
    user = {"name": name, "email": email, "password_hash": generate_password_hash(password),
            "created_at": datetime.now(timezone.utc).isoformat()}
    inserted = users.insert_one(user)
    user["_id"] = inserted.inserted_id
    return jsonify({"token": issue_token(user), "user": {"name": name, "email": email}}), 201


@app.post("/api/auth/login")
def login():
    if users is None:
        return jsonify({"error": "Account storage is unavailable. Start MongoDB, then restart the API."}), 503
    body = request.get_json(silent=True) or {}
    email = str(body.get("email", "")).strip().lower()[:254]
    user = users.find_one({"email": email})
    if not user or not check_password_hash(user["password_hash"], str(body.get("password", ""))):
        return jsonify({"error": "Email or password is incorrect."}), 401
    return jsonify({"token": issue_token(user), "user": {"name": user["name"], "email": user["email"]}})


@app.post("/api/auth/guest")
def guest_session():
    token = jwt.encode({"sub": "demo", "exp": datetime.now(timezone.utc).timestamp() + 60 * 60 * 8}, JWT_SECRET, algorithm="HS256")
    return jsonify({"token": token, "user": {"name": "Guest researcher", "email": "Temporary session", "is_guest": True}})


@app.get("/api/auth/me")
@login_required
def current_user():
    if g.user_id == "demo":
        return jsonify({"user": {"name": "Guest researcher", "email": "Temporary session", "is_guest": True}})
    user = users.find_one({"_id": ObjectId(g.user_id)}, {"name": 1, "email": 1})
    if not user:
        return jsonify({"error": "Account not found."}), 404
    return jsonify({"user": {"name": user["name"], "email": user["email"]}})


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "models_loaded": bool(MODELS), "mongodb_connected": mongo is not None,
                    "dataset": "synthetic demo data"})


@app.get("/api/overview")
def overview():
    build_models()
    return jsonify({"models": [{"id": key, "name": MODEL_NAMES[key], **METRICS[key]} for key in MODELS],
                    "dataset": {"rows": int(len(pd.read_csv(DATA_PATH))), "type": "synthetic",
                                "features": len(FEATURES)}, "features": FEATURES,
                    "notice": "Synthetic research demo only. Scores are not clinical risk estimates."})


@app.get("/api/data/trust")
def data_trust():
    """Return the generated sample and clearly labeled synthetic subgroup metrics."""
    build_models()
    df = pd.read_csv(DATA_PATH)
    x_train, x_test, y_train, y_test = train_test_split(
        df[FEATURES], df["asthma_label_synthetic"], test_size=0.22,
        random_state=17, stratify=df["asthma_label_synthetic"])
    test_rows = df.loc[x_test.index]
    slices = []
    definitions = [
        ("age_group", "Age band", [("18–39", test_rows["age"] < 40), ("40+", test_rows["age"] >= 40)]),
        ("smoking", "Smoking example", [("No", test_rows["smoking"] == 0), ("Yes", test_rows["smoking"] == 1)]),
        ("allergy", "Allergy example", [("No", test_rows["allergy"] == 0), ("Yes", test_rows["allergy"] == 1)]),
    ]
    for slice_id, label, groups in definitions:
        for group_label, mask in groups:
            indices = test_rows.index[mask]
            actual = y_test.loc[indices].astype(int)
            group_metrics = {}
            for model_key, fitted_model in MODELS.items():
                group_x = x_test.loc[indices]
                probabilities = fitted_model.predict_proba(group_x)[:, 1]
                predicted = probabilities >= 0.5
                group_metrics[model_key] = {
                    "accuracy": round(float(accuracy_score(actual, predicted)), 3),
                    "recall": round(float(recall_score(actual, predicted, zero_division=0)), 3),
                }
            slices.append({"slice": slice_id, "slice_label": label, "group": group_label,
                           "n": int(len(indices)), "models": group_metrics})
    corr = df[FEATURES + ["asthma_label_synthetic"]].corr(numeric_only=True)
    correlations = []
    columns = list(corr.columns)
    for i, left in enumerate(columns):
        for right in columns[i + 1:]:
            correlations.append({"left": left, "right": right, "value": round(float(corr.loc[left, right]), 3)})
    correlations.sort(key=lambda item: abs(item["value"]), reverse=True)
    labels = df["asthma_label_synthetic"].astype(int)
    return jsonify({
        "rows": df.to_dict(orient="records"),
        "row_count": int(len(df)),
        "class_balance": {"negative": int((labels == 0).sum()), "positive": int((labels == 1).sum())},
        "slices": slices,
        "correlations": correlations[:8],
        "target": "asthma_label_synthetic",
        "notice": "All rows and subgroup metrics are synthetic engineering examples, not clinical or fairness evidence.",
    })


@app.post("/api/predict")
@login_required
def predict():
    build_models()
    body = request.get_json(silent=True) or {}
    model_key = body.get("model", "ensemble")
    if model_key != "ensemble" and model_key not in MODELS:
        return jsonify({"error": "Select an available model."}), 400
    raw = body.get("features", {})
    try:
        values = {name: float(raw[name]) for name in FEATURES}
    except (KeyError, TypeError, ValueError):
        return jsonify({"error": "Provide a numeric value for every required feature."}), 400
    if not 18 <= values["age"] <= 100 or not 10 <= values["bmi"] <= 70:
        return jsonify({"error": "Age or BMI is outside the demo input range."}), 400
    for key in ["smoking", "family_history", "allergy", "wheezing", "night_symptoms", "exercise_trigger"]:
        if values[key] not in (0, 1):
            return jsonify({"error": f"{key} must be 0 or 1."}), 400
    if values["air_quality"] not in (0, 1, 2, 3) or not 0 <= values["respiratory_infections"] <= 5:
        return jsonify({"error": "Air quality must be 0–3 and infections 0–5."}), 400
    frame = pd.DataFrame([values], columns=FEATURES)
    component_scores = None
    if model_key == "ensemble":
        required_models = ("random_forest", "logistic_regression", "xgboost")
        missing_models = [key for key in required_models if key not in MODELS]
        if missing_models:
            return jsonify({"error": "The combined score needs Random Forest, Logistic Regression, and XGBoost. Check the Flask terminal and installed model dependencies."}), 503
        component_scores = [{"model": key, "probability": float(MODELS[key].predict_proba(frame)[0, 1])}
                            for key in required_models]
        probability = sum(item["probability"] for item in component_scores) / len(component_scores)
        # Estimate average-model feature influence by replacing one input at a time
        # with its synthetic training-data median and recomputing the mean score.
        medians = pd.read_csv(DATA_PATH)[FEATURES].median()
        explanation = []
        for feature in FEATURES:
            changed = frame.copy()
            changed.loc[:, feature] = medians[feature]
            changed_probability = sum(float(MODELS[key].predict_proba(changed)[0, 1])
                                      for key in required_models) / len(required_models)
            explanation.append({"feature": feature.replace("_", " ").title(),
                                "value": round(probability - changed_probability, 4),
                                "input": float(frame.iloc[0][feature])})
        explanation_method = "Ensemble median perturbation"
        metrics = None
        component_scores = [{**item, "probability": round(item["probability"], 4)} for item in component_scores]
    else:
        model = MODELS[model_key]
        probability = float(model.predict_proba(frame)[0, 1])
        explanation = explain(model, frame, model_key)
        explanation_method = EXPLANATION_MODE
        metrics = METRICS[model_key]
    result = {"model": model_key, "probability": round(probability, 4), "explanations": explanation,
              "explanation_method": explanation_method, "metrics": metrics,
              "component_scores": component_scores, "created_at": datetime.now(timezone.utc).isoformat(),
              "disclaimer": "Synthetic model output for education only. Not a personal medical risk estimate."}
    if mongo is not None and g.user_id != "demo":
        try:
            mongo.insert_one({**result, "features": values, "user_id": g.user_id})
        except Exception:
            pass
    return jsonify(result)


@app.post("/api/model-sweep")
@login_required
def model_sweep():
    """Return per-model outputs across an input sweep without persisting predictions."""
    build_models()
    body = request.get_json(silent=True) or {}
    feature = body.get("feature")
    if feature not in FEATURES:
        return jsonify({"error": "Select a supported input feature."}), 400
    raw = body.get("features", {})
    try:
        values = {name: float(raw[name]) for name in FEATURES}
    except (KeyError, TypeError, ValueError):
        return jsonify({"error": "Provide a numeric value for every required feature."}), 400
    if not 18 <= values["age"] <= 100 or not 10 <= values["bmi"] <= 70:
        return jsonify({"error": "Age or BMI is outside the demo input range."}), 400
    for key in ["smoking", "family_history", "allergy", "wheezing", "night_symptoms", "exercise_trigger"]:
        if values[key] not in (0, 1):
            return jsonify({"error": f"{key} must be 0 or 1."}), 400
    if values["air_quality"] not in (0, 1, 2, 3) or not 0 <= values["respiratory_infections"] <= 5:
        return jsonify({"error": "Air quality must be 0–3 and infections 0–5."}), 400
    if feature in {"smoking", "family_history", "allergy", "wheezing", "night_symptoms", "exercise_trigger"}:
        sweep_values = [0, 1]
    elif feature == "air_quality":
        sweep_values = [0, 1, 2, 3]
    elif feature == "respiratory_infections":
        sweep_values = [0, 1, 2, 3, 4, 5]
    elif feature == "age":
        sweep_values = [20, 35, 50, 65, 80]
    else:
        sweep_values = [18, 22, 26, 30, 35, 40]
    frames = pd.DataFrame([{**values, feature: candidate} for candidate in sweep_values], columns=FEATURES)
    lines = []
    for model_key, fitted_model in MODELS.items():
        probabilities = fitted_model.predict_proba(frames)[:, 1]
        lines.append({"model": model_key,
                      "points": [{"value": candidate, "probability": round(float(probability), 4)}
                                 for candidate, probability in zip(sweep_values, probabilities)]})
    return jsonify({"feature": feature, "values": sweep_values, "models": lines,
                    "notice": "Synthetic model outputs for comparison only; not a causal or clinical effect."})


@app.get("/api/history")
@login_required
def history():
    if g.user_id == "demo":
        return jsonify({"items": [], "available": False})
    if mongo is None:
        return jsonify({"items": [], "available": False})
    try:
        items = list(mongo.find({"user_id": g.user_id}, {"_id": 0, "user_id": 0}).sort("created_at", -1).limit(8))
        return jsonify({"items": items, "available": True})
    except Exception:
        return jsonify({"items": [], "available": False})


@app.get("/api/journal")
@login_required
def get_journal():
    if g.user_id == "demo":
        return jsonify({"items": [], "available": False})
    if journals is None:
        return jsonify({"items": [], "available": False})
    items = list(journals.find({"user_id": g.user_id}, {"_id": 0, "user_id": 0}).sort("created_at", -1).limit(12))
    return jsonify({"items": items, "available": True})


@app.post("/api/journal")
@login_required
def add_journal_entry():
    if g.user_id == "demo":
        return jsonify({"error": "Guest journal entries stay in the current browser session."}), 403
    if journals is None:
        return jsonify({"error": "Journal storage is unavailable."}), 503
    body = request.get_json(silent=True) or {}
    entry = {"user_id": g.user_id,
             "symptom": str(body.get("symptom", "")).strip()[:40],
             "severity": body.get("severity"),
             "possible_trigger": str(body.get("possible_trigger", "None noted")).strip()[:80],
             "night_waking": str(body.get("night_waking", "Not recorded")).strip()[:20],
             "notes": str(body.get("notes", "")).strip()[:300],
             "created_at": datetime.now(timezone.utc).isoformat()}
    if entry["symptom"] not in {"Cough", "Wheezing", "Shortness of breath", "Chest tightness", "No symptoms"}:
        return jsonify({"error": "Select a symptom from the list."}), 400
    if entry["severity"] not in (0, 1, 2, 3):
        return jsonify({"error": "Severity must be 0–3."}), 400
    if entry["night_waking"] not in {"Yes", "No", "Not recorded"}:
        entry["night_waking"] = "Not recorded"
    air_context = body.get("air_quality_context")
    if isinstance(air_context, dict):
        def optional_measurement(key):
            value = air_context.get(key)
            try:
                number = float(value)
                return number if math.isfinite(number) else None
            except (TypeError, ValueError):
                return None
        entry["air_quality_context"] = {
            "location": str(air_context.get("location", "")).strip()[:160],
            "us_aqi": optional_measurement("us_aqi"),
            "pm2_5": optional_measurement("pm2_5"),
            "pm10": optional_measurement("pm10"),
            "report_time": str(air_context.get("report_time", "")).strip()[:60],
        }
    journals.insert_one(entry)
    entry.pop("user_id")
    return jsonify({"entry": entry}), 201


connect_db()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=True)
