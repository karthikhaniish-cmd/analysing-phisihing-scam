"""
Unit Tests for Database Operations
"""
import pytest
from database import init_db, insert_scan, get_scans, get_scan_by_id, delete_scan, clear_history

def setup_module(module):
    init_db()

def test_database_insert_and_retrieve():
    scan_id = insert_scan(
        subject="Test Phishing Subject",
        sender="attacker@evil.com",
        classification="PHISHING DETECTED",
        confidence=0.95,
        risk_score=94,
        indicators_count=2,
        model_version="1.4.2-prod",
        explanation="Test explanation",
        details={"test": True}
    )
    assert scan_id is not None
    assert scan_id > 0

    record = get_scan_by_id(scan_id)
    assert record is not None
    assert record["subject"] == "Test Phishing Subject"
    assert record["classification"] == "PHISHING DETECTED"

    delete_scan(scan_id)
    assert get_scan_by_id(scan_id) is None
