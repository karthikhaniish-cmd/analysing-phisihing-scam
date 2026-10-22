import React from 'react';
import { PageView } from '../types';
import { Shield, Lock, Database, Cpu, Terminal, ExternalLink } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: PageView) => void;
  onOpenCodeViewer: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage, onOpenCodeViewer }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#070b16] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Brand & Project */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Phishing Email Detection System
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
              A comprehensive machine learning and cybersecurity web platform designed to analyze email headers, text semantics, and URL features to detect adversarial phishing attempts with explainable heuristic validation.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2 py-1 rounded bg-slate-800/80 text-cyan-300 border border-slate-700">
                TF-IDF N-Grams
              </span>
              <span className="px-2 py-1 rounded bg-slate-800/80 text-cyan-300 border border-slate-700">
                Logistic Regression (96.8% Acc)
              </span>
              <span className="px-2 py-1 rounded bg-slate-800/80 text-cyan-300 border border-slate-700">
                SQLite Persistence
              </span>
              <span className="px-2 py-1 rounded bg-slate-800/80 text-cyan-300 border border-slate-700">
                Zero Body Retention
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-[11px] mb-3">
              Application Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setCurrentPage('detect')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Interactive Email Analyzer
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Analytics & Chart Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('history')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  SQLite Scan History
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('model-metrics')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Model Evaluation & Confusion Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('about')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Academic Architecture & Viva Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic / Source */}
          <div>
            <h4 className="text-slate-200 font-semibold uppercase tracking-wider text-[11px] mb-3">
              Project Deliverables
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenCodeViewer}
                  className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Python ML Code (app.py)</span>
                </button>
              </li>
              <li>
                <span className="text-slate-500">Python 3.10+ / Flask / scikit-learn</span>
              </li>
              <li>
                <span className="text-slate-500">Stratified Test Split: 712 Samples</span>
              </li>
              <li>
                <span className="text-slate-500">Pytest Automated Test Suite</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-slate-800/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cybersecurity Final Year / Capstone Mini-Project Demonstration</span>
          </div>
          <div>
            <span>Predictions are probabilistic. Always verify suspicious communications out-of-band.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
