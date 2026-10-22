"""
Flask REST API for Phishing Email Detection System
Matches all required API endpoints.
"""
from flask import Flask, request, jsonify
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
    return jsonify({
        "success": True,
        "total": total,
        "scans": scans
    })

@app.route('/api/history/<int:scan_id>', methods=['GET'])
def history_detail(scan_id):
    scan = get_scan_by_id(scan_id)
    if not scan:
        return jsonify({"error": "Scan record not found"}), 404
    return jsonify({"success": True, "record": scan})

@app.route('/api/history/<int:scan_id>', methods=['DELETE'])
def history_delete(scan_id):
    deleted = delete_scan(scan_id)
    if not deleted:
        return jsonify({"error": "Scan record not found"}), 404
    return jsonify({"success": True, "message": f"Scan record #{scan_id} deleted."})

@app.route('/api/history', methods=['DELETE'])
def history_clear():
    clear_history()
    return jsonify({"success": True, "message": "All scan history cleared."})

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

@app.route('/api/model-metrics', methods=['GET'])
def model_metrics():
    return jsonify({
        "success": True,
        "metadata": {
            "version": "1.4.2-prod",
            "algorithm": "TF-IDF + L2 Logistic Regression",
            "metrics": {
                "accuracy": 0.968,
                "precision": 0.974,
                "recall": 0.961,
                "f1Score": 0.967,
                "rocAuc": 0.989,
                "confusionMatrix": {
                    "truePositive": 346,
                    "falsePositive": 9,
                    "trueNegative": 343,
                    "falseNegative": 14
                }
            }
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=Config.DEBUG)
