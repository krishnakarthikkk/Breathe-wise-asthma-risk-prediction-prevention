"""Generate a reproducible synthetic dataset for UI and pipeline development only."""
from pathlib import Path

import numpy as np
import pandas as pd

SEED = 42
ROWS = 1200
FEATURES = [
    "age", "bmi", "smoking", "family_history", "allergy", "wheezing",
    "night_symptoms", "exercise_trigger", "air_quality", "respiratory_infections",
]


def main():
    rng = np.random.default_rng(SEED)
    age = rng.integers(18, 81, ROWS)
    bmi = np.clip(rng.normal(26.5, 5.2, ROWS), 15, 48).round(1)
    smoking = rng.binomial(1, 0.23, ROWS)
    family = rng.binomial(1, 0.28, ROWS)
    allergy = rng.binomial(1, 0.31, ROWS)
    wheezing = rng.binomial(1, 0.22, ROWS)
    night = rng.binomial(1, 0.18, ROWS)
    exercise = rng.binomial(1, 0.24, ROWS)
    air = rng.choice([0, 1, 2, 3], ROWS, p=[0.2, 0.42, 0.28, 0.1])
    infections = rng.poisson(1.2, ROWS).clip(0, 5)
    logit = (-3.0 + 0.015 * (age - 40) + 0.045 * (bmi - 25) + 0.42 * smoking
             + 0.68 * family + 0.62 * allergy + 1.28 * wheezing
             + 0.78 * night + 0.52 * exercise + 0.27 * air + 0.20 * infections)
    probability = 1 / (1 + np.exp(-logit))
    label = rng.binomial(1, probability)
    data = pd.DataFrame(dict(zip(FEATURES, [age, bmi, smoking, family, allergy, wheezing,
                                            night, exercise, air, infections])))
    data["asthma_label_synthetic"] = label
    out = Path(__file__).parent / "data" / "asthma_synthetic.csv"
    out.parent.mkdir(parents=True, exist_ok=True)
    data.to_csv(out, index=False)
    print(f"Wrote {len(data)} synthetic rows to {out}")


if __name__ == "__main__":
    main()
