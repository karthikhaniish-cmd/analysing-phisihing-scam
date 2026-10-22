import React from 'react';
import { PageView } from '../types';
import { 
  BookOpen, 
  ShieldAlert, 
  Target, 
  FileWarning, 
  CheckCircle, 
  Layers, 
  Cpu, 
  Terminal, 
  ArrowRight,
  Zap,
  Lock,
  GitBranch,
  Shield,
  Lightbulb
} from 'lucide-react';

interface AboutPageProps {
  setCurrentPage: (page: PageView) => void;
  onOpenCodeViewer: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentPage, onOpenCodeViewer }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Academic Project Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Phishing Email Detection System Using Machine Learning
        </h1>
        <p className="text-sm text-slate-400">
          College Mini-Project & Final-Year Engineering Architecture Specification
        </p>
      </div>

      {/* 1. Introduction & Problem Statement */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          1. Introduction to Phishing Attacks & Problem Statement
        </h2>
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            <strong>Phishing</strong> remains the predominant initial attack vector in modern cybersecurity breaches, accounting for over 80% of reported enterprise security incidents. Threat actors craft deceptive electronic mail communications mimicking trusted institutions (financial institutions, cloud providers, human resource departments) to induce victims into disclosing sensitive credentials, downloading remote-access trojans, or authorizing fraudulent wire transfers.
          </p>
          <p>
            <strong>Problem Statement:</strong> Traditional email perimeter defenses primarily rely on static IP/domain blacklists and keyword regular expressions. Adversaries circumvent these rule-based barriers by utilizing newly registered domains, URL redirect shorteners, obfuscated homoglyphs, and polymorphic text that bypass conventional pattern-matching systems.
          </p>
        </div>
      </section>

      {/* 2. Existing Systems vs Proposed Solution */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          2. Existing Systems vs. Proposed Machine Learning Approach
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          {/* Existing */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-rose-950/80 space-y-3">
            <h3 className="font-bold text-rose-400 text-base flex items-center gap-2">
              <FileWarning className="w-4 h-4" />
              Existing Systems (Rule-Based)
            </h3>
            <ul className="space-y-2 text-slate-400">
              <li>• <strong>Static Domain Blacklists:</strong> Fails against zero-day campaigns and domains registered minutes prior to attack.</li>
              <li>• <strong>Literal Regex Keyword Matching:</strong> High false-positive rate on legitimate words like "invoice" or "bank". Easily bypassed via spacing tricks.</li>
              <li>• <strong>Strict SPF/DKIM/DMARC:</strong> Authenticates sending server integrity, but cannot prevent attacks from compromised legitimate accounts or lookalike domains.</li>
              <li>• <strong>High Administrative Overhead:</strong> Constant manual rule maintenance.</li>
            </ul>
          </div>

          {/* Proposed */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-emerald-950/80 space-y-3">
            <h3 className="font-bold text-emerald-400 text-base flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Proposed Machine Learning Solution
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li>• <strong>Statistical NLP Representation:</strong> TF-IDF n-grams capture linguistic semantics and contextual associations across words.</li>
              <li>• <strong>Supervised Classification:</strong> Calibrated Logistic Regression balances precision and recall on held-out distributions.</li>
              <li>• <strong>Hybrid Heuristic Scoring:</strong> Augments ML with transparent structural analysis (IP links, shorteners, urgent coercion words).</li>
              <li>• <strong>Tri-State Verdict:</strong> Incorporates an "Inconclusive" state to acknowledge uncertainty rather than outputting misleading verdicts.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. System Architecture Diagram */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-400" />
          3. System Architecture & Information Flow
        </h2>
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-cyan-400 font-bold block">1. Ingestion</span>
              <span className="text-slate-400 text-[11px]">Subject, Sender, Body, URLs</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-cyan-400 font-bold block">2. Text NLP</span>
              <span className="text-slate-400 text-[11px]">Tokenize, Masking, Stopwords</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-cyan-400 font-bold block">3. TF-IDF Matrix</span>
              <span className="text-slate-400 text-[11px]">Unigrams & Bigrams (2,500 features)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-cyan-400 font-bold block">4. Logistic Reg</span>
              <span className="text-slate-400 text-[11px]">Decision logit + Sigmoid calibration</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-cyan-400 font-bold block">5. SQLite DB</span>
              <span className="text-slate-400 text-[11px]">Audit log & Dashboard aggregates</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The frontend securely transmits user-submitted email text over JSON to the backend REST API (<code className="text-cyan-300 font-mono">POST /api/predict</code>). The backend pipeline tokenizes text, normalizes special tokens (<code className="text-cyan-300 font-mono">[URL]</code>, <code className="text-cyan-300 font-mono">[EMAIL]</code>, <code className="text-cyan-300 font-mono">[CURRENCY]</code>), extracts TF-IDF vector features, executes the classifier, writes audit records to SQLite, and streams back the verdict with transparent explanations.
          </p>
        </div>
      </section>

      {/* 4. Objectives, Advantages & Limitations */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Key Advantages of the System
          </h3>
          <ul className="space-y-2 text-slate-300 leading-relaxed">
            <li>• <strong>High Throughput & Low Latency:</strong> Linear model inference completes in sub-50ms without GPU hardware acceleration.</li>
            <li>• <strong>Explainable Decisions:</strong> Unlike black-box neural networks, every prediction exposes the top contributing vocabulary tokens and heuristic indicators.</li>
            <li>• <strong>Zero Email Body Retention:</strong> High-confidentiality architecture safeguards personal data and organizational secrets.</li>
            <li>• <strong>Offline Operability:</strong> Operates locally on SQLite and embedded model weights without third-party cloud API dependencies.</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-blue-400" />
            Future Enhancements & Research Scope
          </h3>
          <ul className="space-y-2 text-slate-300 leading-relaxed">
            <li>• <strong>Fine-Tuned Transformer Models:</strong> Incorporating distilled BERT models (DistilBERT or RoBERTa) for deep contextual semantic understanding.</li>
            <li>• <strong>Live DNS Reputation Queries:</strong> Active lookup of WHOIS domain age and DMARC/SPF DNS records during analysis.</li>
            <li>• <strong>OCR & Attachment Sandbox:</strong> Extracting text from embedded images and scanning PDF attachments for malicious macros.</li>
            <li>• <strong>Browser Extension Integration:</strong> Real-time scanning inside webmail clients (Gmail, Outlook Online).</li>
          </ul>
        </div>
      </section>

      {/* 5. College Viva Readiness Checklist */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 border border-cyan-800/60 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            Academic Viva Presentation Readiness
          </h3>
          <button
            onClick={onOpenCodeViewer}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-cyan-500 text-slate-950 hover:bg-cyan-400 cursor-pointer"
          >
            Open Source Code Viewer
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-emerald-400 font-bold block">Formula: TF-IDF</span>
            <span className="text-slate-400">tf(t, d) = 1 + log(count); idf(t) = log((1 + N)/(1 + df)) + 1</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block">Formula: Logistic Sigmoid</span>
            <span className="text-slate-400">P(y = 1 | x) = 1 / (1 + exp(-(w^T · x + b)))</span>
          </div>
        </div>
      </section>
    </div>
  );
};
