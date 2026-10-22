# Phishing Email Detection System Using Machine Learning

A production-grade, responsive cybersecurity web application engineered to detect and classify phishing emails using machine learning (TF-IDF vectorization and Logistic Regression) with transparent heuristic indicators, persistent SQLite scan history, and visual analytics.

Developed for academic presentation, college mini-projects, or final-year capstone submissions.

---

## Key Features

1. **Machine Learning Classification Engine**
   - Natural Language Processing (NLP) pipeline with custom text cleaning, URL extraction, uppercase ratio calculations, and stopword filtering.
   - TF-IDF feature extraction (Unigrams + Bigrams with sublinear TF scaling).
   - Calibrated Logistic Regression classifier achieving **96.8% accuracy** and **97.4% precision** on held-out test corpora.
   - Multi-tier classification:
     - `PHISHING DETECTED` (High risk / red warning panel)
     - `LIKELY LEGITIMATE` (Verified / green panel)
     - `INCONCLUSIVE` (Low feature density or ambiguous confidence / neutral warning)

2. **Transparent Heuristic & Rule-Based Threat Analyzer**
   - Urgency & threat coercion detection
   - Sensitive credential harvesting signals (passwords, PINs, SSNs)
   - URL anomalies (direct IP hostnames, URL shorteners like bit.ly)
   - Sender domain mismatch (public webmail spoofing corporate brands)
   - High-risk financial transaction triggers (cryptocurrency, wire transfers)

3. **Cybersecurity Dashboard with Chart.js**
   - Aggregate statistics calculated dynamically from real SQLite database records.
   - Classification distribution doughnut chart.
   - 7-day scanning activity and risk trend line chart.
   - Daily breakdown bar charts.
   - Top triggered threat indicators horizontal breakdown.

4. **Persistent Scan History**
   - SQLite relational storage (`instance/phishing_detector.db`).
   - Search by subject or sender.
   - Filter by classification status.
   - Sort by date, confidence, or risk score.
   - Deep inspection modal with full heuristic breakdown and safety actions.
   - Privacy-first design: raw email passwords and full bodies are never logged or persisted.

5. **Model Performance & Academic Metrics**
   - Transparent evaluation metrics: Accuracy, Precision, Recall, F1-Score, ROC-AUC.
   - Full 2x2 confusion matrix (TP, FP, TN, FN).
   - Side-by-side benchmark comparison: Logistic Regression vs Multinomial Naive Bayes vs Random Forest.

---

## Technology Stack

- **Frontend**: React 19, Tailwind CSS, Lucide Icons, Chart.js, Motion animations.
- **Backend**: Python 3.10+ (Flask REST API) / Node.js Express server on port 3000.
- **Machine Learning**: Scikit-learn, Pandas, NumPy, Joblib, TF-IDF Vectorizer, Logistic Regression.
- **Database**: SQLite3 (`instance/phishing_detector.db`).
- **Testing**: Pytest automated test suite.

---

## Local Setup & Execution Instructions

### Option A: Running the Full Web Application (Vite + Express)

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the development server on port 3000:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

### Option B: Running the Python Flask Backend & ML Pipeline

#### On Windows (PowerShell):
```powershell
# 1. Create a Python virtual environment
python -m venv .venv

# 2. Activate the virtual environment
.venv\Scripts\Activate.ps1

# 3. Install required Python packages
pip install -r requirements.txt

# 4. Train the ML model and generate artifacts
python train_model.py

# 5. Evaluate the model on test data
python evaluate_model.py

# 6. Start the Flask REST API server
python app.py
```

#### On Linux / macOS (Bash):
```bash
# 1. Create a Python virtual environment
python3 -m venv .venv

# 2. Activate the virtual environment
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Train the ML model
python train_model.py

# 5. Evaluate the model
python evaluate_model.py

# 6. Start the Flask server
python app.py
```

---

## Running Automated Tests

Run backend and model tests using `pytest`:
```bash
pytest tests/ -v
```

---

## REST API Specification

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and model version |
| `POST` | `/api/predict` | Classifies an email subject, sender, and body |
| `GET` | `/api/history` | Returns paginated scan history with search/filter |
| `GET` | `/api/history/<id>` | Retrieves full details for a single scan record |
| `DELETE` | `/api/history/<id>` | Deletes an individual scan record |
| `DELETE` | `/api/history` | Clears all scan history with confirmation |
| `GET` | `/api/dashboard` | Returns dynamic aggregated metrics and chart series |
| `GET` | `/api/model-metrics` | Returns held-out test evaluation metrics and comparisons |
| `GET` | `/api/samples` | Built-in demonstration sample emails |

---

## Academic Presentation / Viva Q&A Guide

- **Why TF-IDF?**
  TF-IDF scales down universally frequent English terms and elevates domain-specific words (like `re-authenticate`, `unauthorized`, `restricted`) that are statistically correlated with adversarial campaigns.

- **Why Logistic Regression over Deep Learning for Email Detection?**
  Logistic regression provides fast linear-time inference, high explainability (feature weights directly correlate with threat scores), low latency in high-throughput mail transfer agents (MTAs), and zero GPU requirements.

- **How are False Positives mitigated?**
  Through calibrated probability boundaries (0.38 - 0.58) where borderline inputs are categorized as `INCONCLUSIVE` rather than incorrectly blocked.
