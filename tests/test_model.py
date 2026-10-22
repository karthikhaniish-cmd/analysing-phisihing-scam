"""
Unit Tests for Machine Learning Preprocessing and Prediction
"""
import pytest
from services.preprocessing import clean_email_text, extract_urls, calculate_caps_ratio
from services.prediction import predict

def test_preprocessing_removes_stopwords_and_urls():
    raw = "URGENT: Click here https://phish-site.com/login to verify your account"
    cleaned = clean_email_text(raw)
    assert "url_token" in cleaned
    assert "https" not in cleaned
    assert "urgent" in cleaned

def test_extract_urls():
    text = "Check http://example.com/test and https://secure.portal.org/login"
    urls = extract_urls(text)
    assert len(urls) == 2
    assert "http://example.com/test" in urls

def test_caps_ratio():
    text = "PLEASE VERIFY YOUR ACCOUNT IMMEDIATELY"
    ratio = calculate_caps_ratio(text)
    assert ratio == 1.0

def test_prediction_heuristic_flag():
    res = predict(
        subject="URGENT: Suspended Account",
        sender="spoofed@gmail.com",
        body="Dear customer, PayPal requires password reset. Click http://bit.ly/fake",
        urls=["http://bit.ly/fake"]
    )
    assert res["classification"] == "PHISHING DETECTED"
    assert len(res["indicators"]) > 0
