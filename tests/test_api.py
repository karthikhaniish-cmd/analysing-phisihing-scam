"""
Unit and Integration Tests for Flask API Endpoints
"""
import pytest
from app import app
from database import init_db, clear_history

@pytest.fixture
def client():
    app.config['TESTING'] = True
    init_db()
    with app.test_client() as client:
        yield client
    clear_history()

def test_health_endpoint(client):
    rv = client.get('/api/health')
    assert rv.status_code == 200
    json_data = rv.get_json()
    assert json_data['status'] == 'ok'

def test_predict_phishing_sample(client):
    payload = {
        "subject": "URGENT: Your bank account is locked, verify password now",
        "sender": "alert@fake-bank-auth.com",
        "body": "Your account has been suspended due to unauthorized access. Click http://bit.ly/bank-reset to restore immediately.",
        "urls": ["http://bit.ly/bank-reset"]
    }
    rv = client.post('/api/predict', json=payload)
    assert rv.status_code == 200
    data = rv.get_json()
    assert data["success"] is True
    assert data["result"]["classification"] == "PHISHING DETECTED"
    assert data["result"]["confidence"] >= 0.70

def test_predict_legitimate_sample(client):
    payload = {
        "subject": "Sprint 14 Planning & Architecture Meeting Agenda",
        "sender": "manager@company.com",
        "body": "Hi team, please find attached the meeting agenda and slides for our weekly sprint review. See you in the conference room.",
        "urls": []
    }
    rv = client.post('/api/predict', json=payload)
    assert rv.status_code == 200
    data = rv.get_json()
    assert data["success"] is True
    assert data["result"]["classification"] == "LIKELY LEGITIMATE"

def test_predict_empty_validation(client):
    rv = client.post('/api/predict', json={})
    assert rv.status_code == 400

def test_dashboard_metrics(client):
    rv = client.get('/api/dashboard')
    assert rv.status_code == 200
    data = rv.get_json()
    assert "totalAnalyzed" in data["stats"]
