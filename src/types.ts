export type PageView = 'home' | 'detect' | 'dashboard' | 'history' | 'model-metrics' | 'about';

export interface SuspiciousIndicator {
  id: string;
  category: 'URGENCY' | 'CREDENTIAL_HARVESTING' | 'URL_ANOMALY' | 'SENDER_ANOMALY' | 'FINANCIAL' | 'CONTENT_ANOMALY';
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  matchedSnippet?: string;
}

export interface PredictionResult {
  classification: 'PHISHING DETECTED' | 'LIKELY LEGITIMATE' | 'INCONCLUSIVE';
  confidence: number;
  rawProbability: number;
  riskScore: number;
  explanation: string;
  indicators: SuspiciousIndicator[];
  safetyRecommendations: string[];
  modelVersion: string;
  modelAlgorithm: string;
  timestamp: string;
  featuresUsed?: {
    tokenCount: number;
    urlCount: number;
    urgencyWordCount: number;
    sensitiveWordCount: number;
    capsRatio: number;
    topFeatures: { term: string; weight: number; contribution: 'phishing' | 'legitimate' }[];
  };
}

export interface ScanRecord {
  id: number;
  subject: string;
  sender: string;
  classification: 'PHISHING DETECTED' | 'LIKELY LEGITIMATE' | 'INCONCLUSIVE';
  confidence: number;
  risk_score: number;
  indicators_count: number;
  model_version: string;
  explanation: string;
  timestamp: string;
  details_json?: string;
}

export interface DashboardStats {
  totalAnalyzed: number;
  phishingCount: number;
  legitimateCount: number;
  inconclusiveCount: number;
  phishingPercentage: number;
  avgConfidence: number;
  dailyTrend: { date: string; phishing: number; legitimate: number; inconclusive: number }[];
  categoryBreakdown: { name: string; count: number }[];
  topIndicators: { name: string; count: number }[];
  recentScans: ScanRecord[];
}

export interface SampleEmail {
  id: string;
  name: string;
  type: 'phishing' | 'legitimate';
  subject: string;
  sender: string;
  body: string;
  urls: string[];
}
