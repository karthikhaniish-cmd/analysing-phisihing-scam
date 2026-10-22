import React, { useState, useEffect } from 'react';
import { PageView, ScanRecord } from '../types';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  ArrowUpDown, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  X, 
  Eye, 
  ExternalLink,
  Lock,
  Download,
  AlertCircle
} from 'lucide-react';

interface HistoryPageProps {
  setCurrentPage: (page: PageView) => void;
  selectedScan: ScanRecord | null;
  setSelectedScan: (scan: ScanRecord | null) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  setCurrentPage,
  selectedScan,
  setSelectedScan
}) => {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'risk_desc' | 'confidence_desc'>('date_desc');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [inspectModal, setInspectModal] = useState<ScanRecord | null>(selectedScan);

  useEffect(() => {
    if (selectedScan) {
      setInspectModal(selectedScan);
    }
  }, [selectedScan]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (classificationFilter !== 'ALL') params.set('classification', classificationFilter);
      params.set('sortBy', sortBy);

      const res = await fetch(`/api/history?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setScans(data.scans || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load scan history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadHistory();
    }, 200);
    return () => clearTimeout(timeout);
  }, [searchTerm, classificationFilter, sortBy]);

  const handleDeleteScan = async (id: number) => {
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setScans(prev => prev.filter(s => s.id !== id));
        setTotal(prev => Math.max(0, prev - 1));
        if (inspectModal?.id === id) setInspectModal(null);
      }
    } catch (err) {
      console.error('Failed to delete scan record:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await fetch('/api/history', { method: 'DELETE' });
      if (res.ok) {
        setScans([]);
        setTotal(0);
        setShowClearConfirm(false);
        setInspectModal(null);
      }
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const exportAsCsv = () => {
    if (scans.length === 0) return;
    const headers = ['ID', 'Date', 'Classification', 'Confidence', 'Risk Score', 'Indicators', 'Subject', 'Sender'];
    const rows = scans.map(s => [
      s.id,
      s.timestamp,
      s.classification,
      s.confidence,
      s.risk_score,
      s.indicators_count,
      `"${s.subject.replace(/"/g, '""')}"`,
      `"${(s.sender || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `phishing_email_scans_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to parse details_json
  const parsedDetails = inspectModal?.details_json ? (() => {
    try {
      return JSON.parse(inspectModal.details_json);
    } catch {
      return null;
    }
  })() : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <History className="w-4 h-4" />
            <span>Relational SQLite Audit Trail</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Email Scan History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse, filter, and inspect previous email scans stored persistently in SQLite.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportAsCsv}
            disabled={scans.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={scans.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium text-rose-300 bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900/50 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Data Retention & Privacy Notice: </span>
          Full email bodies, passwords, or personal attachments are intentionally omitted from persistence to protect confidentiality. Only subject metadata, timestamps, risk scores, and identified heuristic categories are stored.
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by subject or sender..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Classification Filter */}
        <div className="relative">
          <select
            value={classificationFilter}
            onChange={(e) => setClassificationFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Classifications ({total})</option>
            <option value="PHISHING DETECTED">Phishing Detected Only</option>
            <option value="LIKELY LEGITIMATE">Likely Legitimate Only</option>
            <option value="INCONCLUSIVE">Inconclusive Only</option>
          </select>
        </div>

        {/* Sort Options */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="date_desc">Newest Scans First</option>
            <option value="date_asc">Oldest Scans First</option>
            <option value="risk_desc">Highest Risk First</option>
            <option value="confidence_desc">Highest Confidence First</option>
          </select>
        </div>
      </div>

      {/* Scans Table */}
      <div className="rounded-3xl bg-slate-900/70 border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs font-mono text-slate-500">
            Loading scan history records...
          </div>
        ) : scans.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <History className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400">No email scan records match your filter criteria.</p>
            <button
              onClick={() => setCurrentPage('detect')}
              className="text-xs font-mono text-cyan-400 hover:underline"
            >
              Analyze an email to generate a new record →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-3 px-4">#ID</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4 hidden md:table-cell">Sender Address</th>
                  <th className="py-3 px-4 text-center">Risk</th>
                  <th className="py-3 px-4 text-center hidden sm:table-cell">Confidence</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {scans.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">#{s.id}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          s.classification === 'PHISHING DETECTED'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                            : s.classification === 'LIKELY LEGITIMATE'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {s.classification === 'PHISHING DETECTED' ? (
                          <ShieldAlert className="w-3 h-3 text-rose-400" />
                        ) : s.classification === 'LIKELY LEGITIMATE' ? (
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                        )}
                        <span>{s.classification}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200 max-w-xs truncate">
                      {s.subject}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono hidden md:table-cell max-w-xs truncate">
                      {s.sender || '—'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      <span
                        className={
                          s.risk_score >= 60
                            ? 'text-rose-400'
                            : s.risk_score <= 35
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }
                      >
                        {s.risk_score}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-300 hidden sm:table-cell">
                      {Math.round(s.confidence * 100)}%
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] hidden lg:table-cell">
                      {new Date(s.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setInspectModal(s)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
                          title="View Analysis Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={() => handleDeleteScan(s.id)}
                          className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-700 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Clear Scan History?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This action will permanently delete all {total} email scan records from the SQLite database. This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Detail Modal */}
      {inspectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700 space-y-6 my-8">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-500">Record #{inspectModal.id}</span>
                  <span className="text-slate-600">•</span>
                  <span className="font-mono text-xs text-cyan-400">Model {inspectModal.model_version}</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  Analysis Detail Inspection
                </h3>
              </div>
              <button
                onClick={() => {
                  setInspectModal(null);
                  setSelectedScan(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verdict summary */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-xs text-slate-400">Classification</span>
                <div
                  className={`text-lg font-bold font-mono mt-0.5 ${
                    inspectModal.classification === 'PHISHING DETECTED'
                      ? 'text-rose-400'
                      : inspectModal.classification === 'LIKELY LEGITIMATE'
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  {inspectModal.classification}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Risk / Confidence</span>
                <div className="text-lg font-mono font-bold text-white mt-0.5">
                  {inspectModal.risk_score}% / {Math.round(inspectModal.confidence * 100)}%
                </div>
              </div>
            </div>

            {/* Email Metadata */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 font-mono block mb-1">Subject</span>
                <span className="text-white font-medium">{inspectModal.subject}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 font-mono block mb-1">Sender</span>
                <span className="text-slate-300 font-mono">{inspectModal.sender || '(None specified)'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 font-mono block mb-1">Timestamp</span>
                <span className="text-slate-300 font-mono">{new Date(inspectModal.timestamp).toUTCString()}</span>
              </div>
            </div>

            {/* Explanation */}
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase">
                Model Explanation
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                {inspectModal.explanation}
              </p>
            </div>

            {/* Detected Indicators */}
            {parsedDetails?.indicators && parsedDetails.indicators.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-semibold text-rose-400 uppercase">
                  Flagged Indicators ({parsedDetails.indicators.length})
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {parsedDetails.indicators.map((ind: any, i: number) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{ind.name}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300">
                          {ind.severity}
                        </span>
                      </div>
                      <p className="text-slate-400 mt-1">{ind.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => {
                  setInspectModal(null);
                  setSelectedScan(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-mono bg-slate-800 hover:bg-slate-700 text-white"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
