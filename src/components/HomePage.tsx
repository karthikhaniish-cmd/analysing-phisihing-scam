import React from 'react';
import { PageView } from '../types';
import { 
  ShieldAlert, 
  Search, 
  LayoutDashboard, 
  Cpu, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Zap, 
  Lock, 
  ArrowRight, 
  Layers, 
  FileCheck,
  Eye,
  Activity
} from 'lucide-react';

interface HomePageProps {
  setCurrentPage: (page: PageView) => void;
  onOpenCodeViewer: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentPage, onOpenCodeViewer }) => {
  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Cybersecurity Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-xs font-mono font-medium shadow-inner shadow-cyan-900/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>MACHINE LEARNING CYBERSECURITY PLATFORM</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">SCIKIT-LEARN & TF-IDF</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Phishing Email Detection System <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Using Machine Learning
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Protect organizations and users against deceptive social engineering attacks. Our dual-engine pipeline leverages <strong>TF-IDF text vectorization</strong> and <strong>calibrated Logistic Regression</strong> alongside transparent heuristic rules to identify malicious emails in milliseconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setCurrentPage('detect')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-700 hover:from-cyan-400 hover:to-blue-600 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Search className="w-5 h-5" />
                <span>Analyze Email Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage('dashboard')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <LayoutDashboard className="w-5 h-5 text-cyan-400" />
                <span>View Live Dashboard</span>
              </button>

              <button
                onClick={onOpenCodeViewer}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-mono text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-all cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Python ML Code</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">96.8%</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Model Accuracy</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">97.4%</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Precision Score</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">&lt; 45ms</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Inference Latency</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/90 text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">SQLite</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Scan Persistence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Comprehensive Threat Detection Architecture
          </h2>
          <p className="text-sm text-slate-400">
            Engineered with modern machine learning and cybersecurity defense principles to mitigate both overt and subtle adversarial techniques.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all hover:shadow-lg hover:shadow-cyan-500/5 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
              TF-IDF Feature Extraction
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Transforms raw email subject and body into unigram and bigram numerical vectors using sublinear term-frequency scaling and scikit-learn standard IDF weighting.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all hover:shadow-lg hover:shadow-emerald-500/5 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
              Calibrated Classification
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Produces three distinct, safe operational states: <strong>Phishing Detected</strong>, <strong>Likely Legitimate</strong>, and <strong>Inconclusive</strong> to prevent false confidence on sparse inputs.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-rose-500/40 transition-all hover:shadow-lg hover:shadow-rose-500/5 group">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">
              Transparent Heuristic Checks
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Flags high-risk attack vectors independently: direct IP addresses in URLs, link shorteners, urgent coercion words, and public webmail sender mismatches.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all hover:shadow-lg hover:shadow-amber-500/5 group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
              SQLite Audit & History
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automatically logs classification outcomes, timestamps, confidence scores, and indicator counts to a local relational SQLite database for historical reporting.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition-all hover:shadow-lg hover:shadow-blue-500/5 group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
              Zero Body Retention
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Strict privacy architecture: full email bodies, passwords, and sensitive customer texts are analyzed in-memory and discarded. Only minimal metadata is stored.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/5 group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
              Actionable Security Advice
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Provides step-by-step guidance tailored to the threat severity: out-of-band identity verification, SOC alert protocols, and phishing link handling best practices.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-mono mb-3">
              MACHINE LEARNING PIPELINE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              End-to-End Analysis Workflow
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              From raw email input to calibrated statistical prediction in five modular stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h4 className="text-sm font-bold text-white">Email Ingestion</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                User enters subject, sender address, body text, and optional extracted URLs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h4 className="text-sm font-bold text-white">Text Preprocessing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                URL tokenization, email masking, currency normalization, stopword filtering, and caps ratio analysis.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h4 className="text-sm font-bold text-white">TF-IDF Vectorizer</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates sublinear term frequency and inverse document frequency weights for unigram/bigram n-grams.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-sm">
                04
              </div>
              <h4 className="text-sm font-bold text-white">Model Classification</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Logistic Regression predicts class probability, fused with transparent heuristic anomaly scores.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-sm">
                05
              </div>
              <h4 className="text-sm font-bold text-white">Verdict & SQLite Audit</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Displays calibrated verdict with confidence score, detected indicators, and persists scan record in SQLite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-cyan-950/60 border border-cyan-800/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-bold text-white">
              Ready to test an email sample?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Choose from built-in sample emails (simulated PayPal scams, meeting invites, delivery frauds) or paste your own message for immediate classification.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('detect')}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all font-mono text-sm whitespace-nowrap cursor-pointer"
          >
            Open Detection Console →
          </button>
        </div>
      </section>
    </div>
  );
};
