import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'cyber-phish-detector-sec-key-2026')
    DATABASE_PATH = os.environ.get('DATABASE_PATH', str(BASE_DIR / 'instance' / 'phishing_detector.db'))
    MODEL_DIR = BASE_DIR / 'models'
    MODEL_PATH = MODEL_DIR / 'phishing_classifier.joblib'
    VECTORIZER_PATH = MODEL_DIR / 'tfidf_vectorizer.joblib'
    DATA_DIR = BASE_DIR / 'data'
    SAMPLE_DATASET_PATH = DATA_DIR / 'dataset_sample.csv'
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() in ('true', '1', 't')
