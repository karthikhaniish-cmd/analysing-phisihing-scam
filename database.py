"""
Database module for Phishing Email Detection System (SQLite)
Stores minimal metadata to protect privacy (no raw email bodies stored).
"""
import sqlite3
import json
from pathlib import Path
from datetime import datetime
from config import Config

def get_db_connection():
    db_path = Path(Config.DATABASE_PATH)
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT NOT NULL,
            sender TEXT,
            classification TEXT NOT NULL,
            confidence REAL NOT NULL,
            risk_score INTEGER NOT NULL,
            indicators_count INTEGER NOT NULL,
            model_version TEXT NOT NULL,
            explanation TEXT,
            timestamp TEXT NOT NULL,
            details_json TEXT
        );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_scans_timestamp ON scans(timestamp);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_scans_classification ON scans(classification);")
    conn.commit()
    conn.close()

def insert_scan(subject, sender, classification, confidence, risk_score, indicators_count, model_version, explanation, details=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    timestamp = datetime.utcnow().isoformat() + "Z"
    details_str = json.dumps(details) if details else ""
    cursor.execute("""
        INSERT INTO scans (subject, sender, classification, confidence, risk_score, indicators_count, model_version, explanation, timestamp, details_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (subject[:200], sender[:100] if sender else "", classification, confidence, risk_score, indicators_count, model_version, explanation, timestamp, details_str))
    scan_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return scan_id

def get_scans(search=None, classification=None, sort_by="date_desc", limit=50, offset=0):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    where_clauses = []
    params = []
    
    if search:
        where_clauses.append("(subject LIKE ? OR sender LIKE ?)")
        params.extend([f"%{search}%", f"%{search}%"])
        
    if classification and classification != "ALL":
        where_clauses.append("classification = ?")
        params.append(classification)
        
    where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
    
    order_sql = "ORDER BY timestamp DESC"
    if sort_by == "date_asc":
        order_sql = "ORDER BY timestamp ASC"
    elif sort_by == "risk_desc":
        order_sql = "ORDER BY risk_score DESC"
    elif sort_by == "confidence_desc":
        order_sql = "ORDER BY confidence DESC"
        
    # Total count
    cursor.execute(f"SELECT COUNT(*) FROM scans {where_sql}", params)
    total = cursor.fetchone()[0]
    
    params.extend([limit, offset])
    query = f"SELECT * FROM scans {where_sql} {order_sql} LIMIT ? OFFSET ?"
    cursor.execute(query, params)
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rows, total

def get_scan_by_id(scan_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scans WHERE id = ?", (scan_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def delete_scan(scan_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM scans WHERE id = ?", (scan_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def clear_history():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM scans;")
    conn.commit()
    conn.close()
    return True

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
