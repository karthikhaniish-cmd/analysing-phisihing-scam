import React, { useState, useEffect } from 'react';
import { PageView, PredictionResult, SampleEmail } from '../types';
import { 
  Search, 
  Trash2, 
  FolderOpen, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  ExternalLink, 
  CheckCircle, 
  Copy, 
  ArrowRight,
  Sparkles,
  Link2,
  Mail,
  FileText,
  Clock,
  Cpu
} from 'lucide-react';

interface DetectPageProps {
  setCurrentPage: (page: PageView) => void;
}

export const DetectPage: React.FC<DetectPageProps> = ({ setCurrentPage }) => {
  const [subject, setSubject] = useState('');
  const [sender, setSender] = useState('');
  const [body, setBody] = useState('');
  const [urlInput, setUrlInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [samples, setSamples] = useState<SampleEmail[]>([]);
  const [copied, setCopied] = useState(false);

  // Fetch sample emails on mount
  useEffect(() => {
    fetch('/api/samples')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.samples) {
          setSamples(data.samples);
        }
      })
      .catch(err => console.error('Failed to load sample emails:', err));
  }, []);

  const handleLoadSample = (sample: SampleEmail) => {
    setSubject(sample.subject);
    setSender(sample.sender);
    setBody(sample.body);
    setUrlInput(sample.urls.join('\n'));
    setResult(null);
    setError(null);
  };

  const handleClear = () => {
    setSubject('');
    setSender('');
    setBody('');
    setUrlInput('');
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanSubject = subject.trim();
    const cleanBody = body.trim();

    if (!cleanSubject && !cleanBody) {
      setError('Please provide at least an email subject or email body to analyze.');
      return;
    }

    setLoading(true);
    setResult(null);

    const extractedUrls = urlInput
      .split(/[\n,]/)
      .map(u => u.trim())
      .filter(u => u.length > 0);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: cleanSubject,
          sender: sender.trim(),
          body: cleanBody,
          urls: extractedUrls
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Classification failed');
      }

      setResult(data.result);
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('analysis-result-panel')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while analyzing the email.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    const text = `--- CYBERSHIELD ML EMAIL SCAN REPORT ---
Verdict: ${result.classification}
Risk Score: ${result.riskScore}%
Model Confidence: ${(result.confidence * 100).toFixed(0)}%
Subject: ${subject || '(No subject)'}
Sender: ${sender || '(Unknown)'}
Date: ${new Date(result.timestamp).toLocaleString()}
Model: ${result.modelVersion} (${result.modelAlgorithm})

Explanation:
${result.explanation}

Suspicious Indicators Found (${result.indicators.length}):
${result.indicators.map((ind, i) => `${i + 1}. [${ind.severity.toUpperCase()}] ${ind.name} - ${ind.description}`).join('\n') || 'None detected.'}

Safety Recommendations:
${result.safetyRecommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>Interactive Machine Learning Classifier</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Analyze Email for Phishing Threats
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Enter email headers, body text, or suspicious links below. The model will extract TF-IDF linguistic features, score heuristic anomalies, and generate a calibrated safety verdict.
        </p>
      </div>

      {/* Sample Email Quick Loader Bar */}
      {samples.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-cyan-400" />
              Load Demonstration Samples:
            </span>
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              Pre-vetted for testing ML boundaries
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {samples.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleLoadSample(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                  s.type === 'phishing'
                    ? 'bg-rose-950/40 text-rose-300 border-rose-800/60 hover:bg-rose-900/50 hover:border-rose-700'
                    : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/50 hover:border-emerald-700'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${s.type === 'phishing' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Analysis Form */}
      <form onSubmit={handleAnalyze} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Subject */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              Email Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. URGENT: Your account requires immediate verification"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>

          {/* Sender Email Address */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-cyan-400" />
              Sender Address (Optional)
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g. security-alert@verify-account-notice.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
            />
          </div>
        </div>

        {/* Email Body */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              Email Body Content
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              {body.length} characters
            </span>
          </div>
          <textarea
            rows={7}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste raw email body text here. Phishing keywords, urgency phrases, links, and formatting will be preprocessed by the TF-IDF pipeline..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-xs sm:text-sm leading-relaxed"
          />
        </div>

        {/* Optional Extracted URLs */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-cyan-400" />
            Extracted Links / URLs (Optional, one per line)
          </label>
          <textarea
            rows={2}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="e.g. http://194.26.29.112/paypal-login&#10;http://bit.ly/secure-verify-link"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Preprocessing & Classifying...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze Email</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Input</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Privacy: Content analyzed in-memory; bodies discarded.
          </div>
        </div>
      </form>

      {/* Analysis Result Display */}
      {result && (
        <div id="analysis-result-panel" className="space-y-6 pt-4">
          {/* Main Verdict Card */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border transition-all ${
              result.classification === 'PHISHING DETECTED'
                ? 'bg-gradient-to-br from-rose-950/70 via-slate-900 to-slate-950 border-rose-600/80 shadow-2xl shadow-rose-950/40 danger-glow'
                : result.classification === 'LIKELY LEGITIMATE'
                ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border-emerald-600/80 shadow-2xl shadow-emerald-950/40 success-glow'
                : 'bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-950 border-amber-600/80 shadow-2xl shadow-amber-950/40'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
              {/* Verdict Header */}
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                    result.classification === 'PHISHING DETECTED'
                      ? 'bg-rose-500 text-white shadow-rose-500/30'
                      : result.classification === 'LIKELY LEGITIMATE'
                      ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                      : 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                  }`}
                >
                  {result.classification === 'PHISHING DETECTED' ? (
                    <ShieldAlert className="w-8 h-8" />
                  ) : result.classification === 'LIKELY LEGITIMATE' ? (
                    <ShieldCheck className="w-8 h-8" />
                  ) : (
                    <AlertTriangle className="w-8 h-8" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                        result.classification === 'PHISHING DETECTED'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : result.classification === 'LIKELY LEGITIMATE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {result.classification}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      v{result.modelVersion}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {result.classification === 'PHISHING DETECTED'
                      ? 'Adversarial Phishing Signature Found'
                      : result.classification === 'LIKELY LEGITIMATE'
                      ? 'No Malicious Intent Detected'
                      : 'Inconclusive / Insufficient Signals'}
                  </h2>
                </div>
              </div>

              {/* Confidence & Risk Meter */}
              <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="text-center px-3 border-r border-slate-800">
                  <div className="text-xs font-mono text-slate-400">Risk Score</div>
                  <div
                    className={`text-2xl font-extrabold font-mono ${
                      result.riskScore >= 60
                        ? 'text-rose-400'
                        : result.riskScore <= 35
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {result.riskScore}%
                  </div>
                </div>

                <div className="text-center px-3">
                  <div className="text-xs font-mono text-slate-400">Model Confidence</div>
                  <div className="text-2xl font-extrabold text-cyan-400 font-mono">
                    {Math.round(result.confidence * 100)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation text */}
            <div className="py-6 space-y-4">
              <h3 className="text-xs font-bold uppercase font-mono text-slate-300 tracking-wider">
                Model Evaluation Summary
              </h3>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                {result.explanation}
              </p>
            </div>

            {/* Suspicious Indicators Grid */}
            {result.indicators.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase font-mono text-rose-400 tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Detected Heuristic Risk Factors ({result.indicators.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.indicators.map((ind) => (
                    <div
                      key={ind.id}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          {ind.name}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded ${
                            ind.severity === 'critical'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : ind.severity === 'high'
                              ? 'bg-orange-950 text-orange-300 border border-orange-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {ind.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {ind.description}
                      </p>
                      {ind.matchedSnippet && (
                        <div className="text-[11px] font-mono text-rose-300 bg-rose-950/40 px-2 py-1 rounded border border-rose-900/60 inline-block">
                          Trigger: "{ind.matchedSnippet}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Contributing TF-IDF Features */}
            {result.featuresUsed?.topFeatures && result.featuresUsed.topFeatures.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold uppercase font-mono text-slate-400 tracking-wider">
                  Top TF-IDF Token Influences (Explainable AI)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.featuresUsed.topFeatures.map((f, i) => (
                    <span
                      key={i}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border flex items-center gap-1.5 ${
                        f.contribution === 'phishing'
                          ? 'bg-rose-950/40 text-rose-300 border-rose-800/60'
                          : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                      }`}
                    >
                      <span>{f.term}</span>
                      <span className="text-[10px] opacity-75">({f.weight > 0 ? `+${f.weight}` : f.weight})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Safety Actions */}
            <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
              <h4 className="text-xs font-bold uppercase font-mono text-cyan-400 tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Recommended Security Actions
              </h4>
              <ul className="space-y-2">
                {result.safetyRecommendations.map((rec, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60"
                  >
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Meta & Copy Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(result.timestamp).toLocaleTimeString()}
                </span>
                <span>•</span>
                <span>Algorithm: {result.modelAlgorithm}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied Report!' : 'Copy Summary'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage('history')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all cursor-pointer"
                >
                  <span>View in History →</span>
                </button>
              </div>
            </div>
          </div>

          {/* Academic Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs leading-relaxed flex items-center gap-3">
            <Info className="w-5 h-5 text-slate-500 flex-shrink-0" />
            <span>
              <strong>Academic Project Notice:</strong> Predictions are probabilistic statistical classifications produced by a machine learning model. Malicious emails can employ evasive techniques; always verify unexpected account actions out-of-band.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
