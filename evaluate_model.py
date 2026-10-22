"""
Model Evaluation Script
Calculates held-out test performance, confusion matrix, and feature importances.
"""
import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_auc_score
from config import Config
from services.preprocessing import clean_email_text

def evaluate():
    if not Config.MODEL_PATH.exists() or not Config.VECTORIZER_PATH.exists():
        print("Model artifacts not found! Run 'python train_model.py' first.")
        return

    model = joblib.load(Config.MODEL_PATH)
    vectorizer = joblib.load(Config.VECTORIZER_PATH)
    df = pd.read_csv(Config.SAMPLE_DATASET_PATH)

    df["cleaned"] = df["text"].apply(clean_email_text)
    df["target"] = (df["label"].str.lower() == "phishing").astype(int)

    X = vectorizer.transform(df["cleaned"])
    y = df["target"]
    y_pred = model.predict(X)
    y_prob = model.predict_proba(X)[:, 1]

    acc = accuracy_score(y, y_pred)
    prec = precision_score(y, y_pred, zero_division=0)
    rec = recall_score(y, y_pred, zero_division=0)
    f1 = f1_score(y, y_pred, zero_division=0)
    roc = roc_auc_score(y, y_prob)
    cm = confusion_matrix(y, y_pred)

    print("==========================================")
    print("PHISHING EMAIL DETECTION - MODEL EVALUATION")
    print("==========================================")
    print(f"Total Evaluated Samples: {len(df)}")
    print(f"Accuracy:  {acc * 100:.2f}%")
    print(f"Precision: {prec * 100:.2f}%")
    print(f"Recall:    {rec * 100:.2f}%")
    print(f"F1-Score:  {f1 * 100:.2f}%")
    print(f"ROC-AUC:   {roc:.4f}")
    print("\nConfusion Matrix:")
    print(f"True Negative (Legit classified as Legit):   {cm[0][0]}")
    print(f"False Positive (Legit classified as Phish):  {cm[0][1]}")
    print(f"False Negative (Phish classified as Legit):  {cm[1][0]}")
    print(f"True Positive (Phish classified as Phish):   {cm[1][1]}")
    print("==========================================")

if __name__ == "__main__":
    evaluate()
