<<<<<<< HEAD
# breathewise-asthma-risk-prediction-and-prevention
breathewise is a machine learning based project designed to predict an individual risk of developing asthma based on their health related information 
=======
# BreatheWise — asthma risk research demo

A local research/education prototype with a React + Vite dashboard, Flask API, MongoDB persistence, and Random Forest, Logistic Regression, and XGBoost models. SHAP explanations are returned per prediction when the optional SHAP dependency is installed.

> **Not for diagnosis, triage, treatment, or prevention decisions.** This project ships with a clearly labeled synthetic dataset. Its model scores are not clinically validated and must not be interpreted as an individual's medical risk. For real symptoms or care decisions, consult a licensed clinician. The demo prevention panel shares general, non-personalized education only.

## Run locally

1. Start MongoDB locally, or set `MONGODB_URI` to a MongoDB connection string. MongoDB is needed for persistent accounts, journals, and prediction history. Guest mode can explore models without MongoDB; guest notes remain only in the current browser session.
2. API: `cd backend`; create/activate a virtual environment; install `pip install -r requirements.txt`; run `python app.py`.
3. UI: `cd frontend`; run `npm install` and `npm run dev`.

The UI runs at `http://localhost:5173`; the API defaults to `http://localhost:5000`. `VITE_API_URL` can override the API URL. Model training is lazy and uses `backend/data/asthma_synthetic.csv`. Run `python generate_dataset.py` to regenerate the demo data. Set a long random `JWT_SECRET` in `backend/.env` for any deployment beyond a local demo.

## Google Calendar reminders

In **Care toolkit → Medicine reminders**, click **Google Calendar** beside a reminder. This opens a prefilled Google Calendar event with a daily recurrence; review it and click **Save** in Google Calendar. Google Calendar then sends its normal calendar alerts, including while BreatheWise is closed. The reminder label is included in the event, and Google may sync it to the signed-in account. The link uses Google Calendar's event template and standard daily recurrence format ([Google Calendar recurring events](https://developers.google.com/workspace/calendar/api/concepts/events-calendars)).

## Data and model notes

The included CSV is generated synthetic data for software demonstration, not a clinical cohort. Do not upload identifiable health data. To study real population-level prevalence, see CDC's public BRFSS asthma resources and follow their survey documentation and data-use terms: [CDC BRFSS asthma questions and prevalence data](https://www.cdc.gov/asthma/data-analysis-guidance/brfss-core-asthma-questions.htm). The included feature schema is not a validated instrument, and its target is synthetic.

The API compares held-out accuracy, ROC AUC, and F1 as engineering diagnostics. These are not evidence of clinical performance. SHAP values describe model behavior for the supplied inputs; they do not establish causation. Signed-in account data is stored in MongoDB. Guest predictions are temporary, and guest journal entries stay in browser memory for the current session.

## API

- `GET /api/health` — service and model status
- `GET /api/overview` — demo dataset metadata and model metrics
- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/guest` — create an account, sign in, or start a temporary research session
- `POST /api/predict` — `{ "model": "random_forest|logistic_regression|xgboost", "features": { ... } }` (requires a bearer token)
- `GET /api/history`, `GET/POST /api/journal` — account-scoped history and symptom notes (MongoDB accounts only)

Expected feature keys: `age`, `bmi`, `smoking`, `family_history`, `allergy`, `wheezing`, `night_symptoms`, `exercise_trigger`, `air_quality`, and `respiratory_infections`. Binary fields accept 0/1. `air_quality` is a demo ordinal input (0–3); all scores are educational outputs only.
>>>>>>> c703819 (Initial commit)
