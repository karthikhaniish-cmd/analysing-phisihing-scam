import React, { useState, useEffect } from 'react';
import { PageView, DashboardStats, ScanRecord } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Search, 
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Database,
  Calendar,
  CheckCircle2
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardPageProps {
  setCurrentPage: (page: PageView) => void;
  onSelectScan: (scan: ScanRecord) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setCurrentPage, onSelectScan }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load dashboard metrics');
      }
      setStats(data.stats);
    } catch (err: any) {
      setError(err.message || 'Error connecting to database analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto" />
        <p className="text-sm font-mono text-slate-400">Querying SQLite database & compiling metrics...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-6 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300">
          <p className="text-base font-semibold mb-2">Failed to load dashboard metrics</p>
          <p className="text-xs font-mono">{error}</p>
          <button
            onClick={fetchStats}
            className="mt-4 px-4 py-2 rounded-lg bg-rose-900 hover:bg-rose-800 text-white text-xs font-mono"
          >
            Retry Query
          </button>
        </div>
      </div>
    );
  }

  // --- Chart 1: Doughnut Classification Distribution ---
  const doughnutData = {
    labels: ['Phishing Detected', 'Likely Legitimate', 'Inconclusive'],
    datasets: [
      {
        data: [stats.phishingCount, stats.legitimateCount, stats.inconclusiveCount],
        backgroundColor: [
          'rgba(244, 63, 94, 0.85)',
          'rgba(16, 185, 129, 0.85)',
          'rgba(245, 158, 11, 0.85)'
        ],
        borderColor: [
          '#f43f5e',
          '#10b981',
          '#f59e0b'
        ],
        borderWidth: 1.5,
        hoverOffset: 6
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#94a3b8',
          font: { family: 'Plus Jakarta Sans', size: 12 },
          boxWidth: 14,
          padding: 16
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10
      }
    },
    cutout: '72%'
  };

  // --- Chart 2: Daily Scan Analysis (Bar Chart) ---
  const barData = {
    labels: stats.dailyTrend.map(d => d.date.slice(5)), // MM-DD
    datasets: [
      {
        label: 'Phishing',
        data: stats.dailyTrend.map(d => d.phishing),
        backgroundColor: 'rgba(244, 63, 94, 0.8)',
        borderRadius: 4
      },
      {
        label: 'Legitimate',
        data: stats.dailyTrend.map(d => d.legitimate),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 4
      },
      {
        label: 'Inconclusive',
        data: stats.dailyTrend.map(d => d.inconclusive),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderRadius: 4
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 11 } }
      },
      y: {
        stacked: true,
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 11 }, precision: 0 }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#94a3b8', boxWidth: 12 }
      }
    }
  };

  // --- Chart 3: Scan Activity Over Time (Line Chart) ---
  const lineData = {
    labels: stats.dailyTrend.map(d => d.date.slice(5)),
    datasets: [
      {
        label: 'Total Scans',
        data: stats.dailyTrend.map(d => d.phishing + d.legitimate + d.inconclusive),
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#38bdf8'
      },
      {
        label: 'Phishing Attacks',
        data: stats.dailyTrend.map(d => d.phishing),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.05)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#f43f5e'
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 11 } }
      },
      y: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 11 }, precision: 0 }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#94a3b8', boxWidth: 12 }
      }
    }
  };

  // --- Chart 4: Top Indicators Horizontal Bar ---
  const indicatorData = {
    labels: stats.topIndicators.map(i => i.name),
    datasets: [
      {
        label: 'Times Triggered',
        data: stats.topIndicators.map(i => i.count),
        backgroundColor: 'rgba(129, 140, 248, 0.75)',
        borderColor: '#818cf8',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const indicatorOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 11 }, precision: 0 }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#cbd5e1', font: { size: 11 } }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <LayoutDashboard className="w-4 h-4" />
            <span>SQLite Database Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Cybersecurity Threat Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Aggregated statistics and real-time visualization derived from database scan records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Refresh Stats</span>
          </button>

          <button
            onClick={() => setCurrentPage('detect')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* Aggregate Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Total */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Analyzed</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{stats.totalAnalyzed}</div>
          <div className="text-[11px] text-slate-500">Persisted in SQLite</div>
        </div>

        {/* Card 2: Phishing Count */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-900/50 space-y-1">
          <div className="flex items-center justify-between text-rose-300 text-xs font-medium">
            <span>Phishing Caught</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono">
            {stats.phishingCount}
          </div>
          <div className="text-[11px] text-rose-400/80 font-mono">
            {stats.phishingPercentage}% of total traffic
          </div>
        </div>

        {/* Card 3: Legitimate Count */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-900/50 space-y-1">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-medium">
            <span>Likely Legitimate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {stats.legitimateCount}
          </div>
          <div className="text-[11px] text-emerald-400/80 font-mono">
            {stats.totalAnalyzed > 0 ? Math.round((stats.legitimateCount / stats.totalAnalyzed) * 100) : 0}% verified safe
          </div>
        </div>

        {/* Card 4: Inconclusive & Confidence */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-900/50 space-y-1">
          <div className="flex items-center justify-between text-amber-300 text-xs font-medium">
            <span>Inconclusive</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            {stats.inconclusiveCount}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Avg Confidence: {(stats.avgConfidence * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Doughnut */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Classification Breakdown
            </h3>
            <span className="text-xs font-mono text-slate-500">Live SQLite Counts</span>
          </div>
          <div className="h-64 relative flex items-center justify-center">
            {stats.totalAnalyzed > 0 ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <div className="text-xs text-slate-500 font-mono">No scans recorded yet.</div>
            )}
          </div>
        </div>

        {/* Chart 2: Daily Analysis Stacked Bar */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Daily Email Analysis Volume
            </h3>
            <span className="text-xs font-mono text-slate-500">Past 7 Days</span>
          </div>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Chart 3: Trend Line */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Threat Activity & Risk Trend
            </h3>
            <span className="text-xs font-mono text-slate-500">Time Series</span>
          </div>
          <div className="h-64">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Chart 4: Top Indicators Horizontal Bar */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Top Triggered Threat Indicators
            </h3>
            <span className="text-xs font-mono text-slate-500">Frequency Ranking</span>
          </div>
          <div className="h-64">
            <Bar data={indicatorData} options={indicatorOptions} />
          </div>
        </div>
      </div>

      {/* Recent Scans Mini Table */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Email Analyses</h3>
            <p className="text-xs text-slate-400">Latest records processed by the machine learning pipeline.</p>
          </div>
          <button
            onClick={() => setCurrentPage('history')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3 hidden md:table-cell">Sender</th>
                <th className="py-2.5 px-3">Risk</th>
                <th className="py-2.5 px-3 hidden sm:table-cell">Time</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats.recentScans.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        s.classification === 'PHISHING DETECTED'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                          : s.classification === 'LIKELY LEGITIMATE'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {s.classification === 'PHISHING DETECTED' ? 'PHISH' : s.classification === 'LIKELY LEGITIMATE' ? 'LEGIT' : 'INCON'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-200 max-w-xs truncate">
                    {s.subject}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono hidden md:table-cell max-w-xs truncate">
                    {s.sender || '—'}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold">
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
                  <td className="py-2.5 px-3 text-slate-500 font-mono hidden sm:table-cell">
                    {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onSelectScan(s)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
