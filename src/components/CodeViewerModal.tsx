import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode, Download } from 'lucide-react';

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ isOpen, onClose }) => {
  const [activeFile, setActiveFile] = useState('app.py');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const files: Record<string, { desc: string; code: string }> = {
    'app.py': {
      desc: 'Flask REST API implementation with all endpoints',
      code: `from flask import Flask, request, jsonify
from config import Config
from database import init_db, insert_scan, get_scans, get_scan_by_id, delete_scan, clear_history
from services.prediction import predict

app = Flask(__name__)
app.config.from_object(Config)

# Initialize SQLite database on startup
init_db()

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "service": "Phishing Email Detection Flask API",
        "modelVersion": "1.4.2-prod",
        "modelAlgorithm": "TF-IDF + L2 Logistic Regression"
    })

@app.route('/api/predict', methods=['POST'])
def predict_endpoint():
    data = request.get_json() or {}
    subject = data.get('subject', '')
    sender = data.get('sender', '')
    body = data.get('body', '')
    urls = data.get('urls', [])

    if not subject and not body:
        return jsonify({
            "error": "Validation Error",
            "message": "Subject or body text is required."
        }), 400

    result = predict(subject, sender, body, urls)

    scan_id = insert_scan(
        subject=subject or "(No Subject)",
        sender=sender,
        classification=result["classification"],
        confidence=result["confidence"],
        risk_score=result["riskScore"],
        indicators_count=len(result["indicators"]),
        model_version=result["modelVersion"],
        explanation=result["explanation"],
        details={
            "indicators": result["indicators"],
            "safetyRecommendations": result["safetyRecommendations"]
        }
    )

    return jsonify({
        "success": True,
        "scanId": scan_id,
        "result": result
    })

@app.route('/api/history', methods=['GET'])
def history_list():
    search = request.args.get('search')
    classification = request.args.get('classification')
    sort_by = request.args.get('sortBy', 'date_desc')
    limit = int(request.args.get('limit', 50))
    offset = int(request.args.get('offset', 0))

    scans, total = get_scans(search, classification, sort_by, limit, offset)
    return jsonify({"success": True, "total": total, "scans": scans})

@app.route('/api/dashboard', methods=['GET'])
def dashboard_stats():
    scans, total = get_scans(limit=1000)
    phish_count = sum(1 for s in scans if s["classification"] == "PHISHING DETECTED")
    legit_count = sum(1 for s in scans if s["classification"] == "LIKELY LEGITIMATE")
    inconcl_count = sum(1 for s in scans if s["classification"] == "INCONCLUSIVE")
    avg_conf = sum(s["confidence"] for s in scans) / total if total > 0 else 0.92

    return jsonify({
        "success": True,
        "stats": {
            "totalAnalyzed": total,
            "phishingCount": phish_count,
            "legitimateCount": legit_count,
            "inconclusiveCount": inconcl_count,
            "phishingPercentage": round((phish_count / total * 100)) if total > 0 else 0,
            "avgConfidence": round(avg_conf, 2),
            "recentScans": scans[:6]
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)`
    },
    'train_model.py': {
      desc: 'Machine learning training pipeline with TF-IDF and Logistic Regression',
      code: `import pandas as pd
import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from config import Config
from services.preprocessing import clean_email_text

def train():
    df = pd.read_csv(Config.SAMPLE_DATASET_PATH)
    print("Preprocessing text...")
    df["cleaned"] = df["text"].apply(clean_email_text)
    df["target"] = (df["label"].str.lower() == "phishing").astype(int)

    X = df["cleaned"]
    y = df["target"]

    # Stratified split to avoid leakage
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y
    )

    # Sublinear TF scaling TF-IDF Vectorizer
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=2500, sublinear_tf=True)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # Train L2 Logistic Regression
    clf = LogisticRegression(C=1.5, penalty='l2', max_iter=1000, random_state=42)
    clf.fit(X_train_vec, y_train)

    y_pred = clf.predict(X_test_vec)
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))

    joblib.dump(clf, Config.MODEL_PATH)
    joblib.dump(vectorizer, Config.VECTORIZER_PATH)
    print("Model artifacts saved to models/ directory.")

if __name__ == "__main__":
    train()`
    },
    'database.py': {
      desc: 'SQLite database connection, schema creation, and queries',
      code: `import sqlite3
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
    conn.commit()
    conn.close()`
    },
    'requirements.txt': {
      desc: 'Python pip dependency list',
      code: `Flask==3.0.3
scikit-learn==1.5.0
pandas==2.2.2
numpy==1.26.4
joblib==1.4.2
pytest==8.2.2
python-dotenv==1.0.1`
    },
    'README.md': {
      desc: 'Local execution commands for Windows PowerShell and Linux',
      code: `# Windows PowerShell Execution
python -m venv .venv
.venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
python train_model.py
python evaluate_model.py
python app.py

# Linux / macOS Bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python train_model.py
python app.py`
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(files[activeFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-4xl w-full h-[85vh] rounded-3xl bg-slate-900 border border-slate-700 flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Python ML Project Deliverables</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Ready for Viva
                </span>
              </h3>
              <p className="text-xs text-slate-400 hidden sm:block">
                View, inspect, and copy complete source files included in the project repository.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* File Tabs */}
        <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/60 flex items-center gap-2 overflow-x-auto">
          {Object.keys(files).map((fileName) => (
            <button
              key={fileName}
              onClick={() => setActiveFile(fileName)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all ${
                activeFile === fileName
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {fileName}
            </button>
          ))}
        </div>

        {/* File Description */}
        <div className="px-5 py-2.5 bg-slate-900/60 border-b border-slate-800 text-xs text-slate-400 font-mono">
          {files[activeFile].desc}
        </div>

        {/* Code Content */}
        <div className="flex-1 p-5 overflow-auto bg-[#070b14] font-mono text-xs sm:text-sm text-slate-200 leading-relaxed selection:bg-cyan-500/30">
          <pre>{files[activeFile].code}</pre>
        </div>
      </div>
    </div>
  );
};
