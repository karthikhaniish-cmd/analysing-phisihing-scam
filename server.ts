/**
 * Express Server for Phishing Email Detection System
 * Provides REST API endpoints and mounts Vite development middleware on port 3000.
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { predictEmail, MODEL_METADATA } from './src/server/ml/model.ts';
import {
  insertScan,
  getScans,
  getScanById,
  deleteScan,
  clearAllScans,
  getDashboardStats
} from './src/server/db/database.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser with security size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Built-in demonstration sample emails for testing
const SAMPLE_EMAILS = [
  {
    id: 'sample_phish_paypal',
    name: 'Simulated Urgent Account Verification (PayPal Phishing)',
    type: 'phishing',
    subject: 'URGENT: Your PayPal account has been restricted - Action Required Within 24 Hours',
    sender: 'service-security991@verify-portal-notice.com',
    body: `Dear customer,\n\nWe detected unauthorized access to your PayPal account from an unrecognized IP address (194.26.29.112). For your protection, your account has been temporarily suspended.\n\nTo restore immediate access and avoid permanent termination, please click below to confirm your identity and verify your billing credentials and password:\n\nhttp://bit.ly/paypal-secure-identity-verify\n\nFailure to verify within 24 hours will result in permanent closure of your balance.\n\nThank you,\nPayPal Security Team`,
    urls: ['http://bit.ly/paypal-secure-identity-verify']
  },
  {
    id: 'sample_legit_meeting',
    name: 'Legitimate Meeting Invitation & Project Sync',
    type: 'legitimate',
    subject: 'Sprint 14 Planning & Architecture Review - Thursday 10:00 AM',
    sender: 'alex.chen@innovatech-solutions.com',
    body: `Hi Team,\n\nPlease join us for our upcoming Sprint 14 Planning and quarterly architecture review scheduled for this Thursday from 10:00 AM to 11:30 AM in Conference Room B.\n\nAgenda:\n1. Review completed Jira backlog items from Sprint 13.\n2. GitHub pull requests status and test coverage metrics.\n3. Discussion on upcoming milestone deliverables and database migrations.\n\nThe meeting notes and slide deck are attached in our internal Confluence wiki.\n\nBest regards,\nAlex Chen\nLead Systems Architect`,
    urls: ['https://confluence.innovatech-solutions.internal/pages/viewpage.action?pageId=84920']
  },
  {
    id: 'sample_phish_delivery',
    name: 'Simulated Package Delivery Fee Scam (DHL Phishing)',
    type: 'phishing',
    subject: 'DHL Express: Delivery attempt failed for parcel #US-8839210-DHL',
    sender: 'notifications@delivery-tracking-update-88.xyz',
    body: `Dear Valued Customer,\n\nYour courier shipment #US-8839210-DHL could not be delivered today due to an incorrect destination postal address and an outstanding unpaid customs fee of $2.49.\n\nPlease update your delivery address and pay the clearance charge using our online tracking link:\nhttp://185.220.101.42/dhl-package-reschedule/verify\n\nIf unpaid, package will be returned to sender within 48 hours.\n\nDHL Express Logistics`,
    urls: ['http://185.220.101.42/dhl-package-reschedule/verify']
  },
  {
    id: 'sample_legit_corporate',
    name: 'Legitimate Corporate Quarterly Announcement',
    type: 'legitimate',
    subject: 'Annual Open Enrollment for Employee Health and 401(k) Benefits',
    sender: 'hr-benefits@corporation.org',
    body: `Dear Colleagues,\n\nOur annual benefits open enrollment period for the upcoming fiscal year begins next Monday. This is your opportunity to review and modify your healthcare coverage, dental plans, and retirement contributions.\n\nPlease review the attached summary guide on our internal HR portal. We will host two live Q&A webinars next Wednesday at 2:00 PM for anyone with specific questions.\n\nNo changes will occur to your current selections if you choose not to update them.\n\nKind regards,\nPeople Operations & Total Rewards Team`,
    urls: ['https://portal.corporation.org/benefits/open-enrollment']
  },
  {
    id: 'sample_phish_bec',
    name: 'Executive Wire Transfer Impersonation (Business Email Compromise)',
    type: 'phishing',
    subject: 'CONFIDENTIAL: Urgent Wire Transfer Request for Acquisition',
    sender: 'ceo.executive.office@gmail.com',
    body: `Hello,\n\nI am currently in an urgent offsite board meeting regarding a confidential company acquisition. I need you to initiate a wire transfer of $48,500 immediately to our escrow account to secure the contract.\n\nPlease process this wire transfer right away and send me the payment confirmation receipt. Do not mention this to other team members until the formal announcement tomorrow.\n\nLet me know once completed.\n\nSent from my iPhone`,
    urls: []
  }
];

// ========================
// API Endpoints
// ========================

// 1. Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Phishing Email Detection ML API',
    modelVersion: MODEL_METADATA.version,
    modelAlgorithm: MODEL_METADATA.algorithm,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 2. Email Prediction & Analysis
app.post('/api/predict', async (req: Request, res: Response) => {
  try {
    const { subject = '', sender = '', body = '', urls = [] } = req.body;

    if (!subject && !body) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Please provide either an email subject or email body to analyze.'
      });
    }

    // Run ML prediction engine
    const prediction = predictEmail({
      subject: String(subject),
      sender: String(sender),
      body: String(body),
      urls: Array.isArray(urls) ? urls.map(String) : []
    });

    // Save minimal metadata to SQLite database
    const scanId = await insertScan({
      subject: String(subject).slice(0, 200) || '(No Subject)',
      sender: String(sender).slice(0, 100) || '',
      classification: prediction.classification,
      confidence: prediction.confidence,
      risk_score: prediction.riskScore,
      indicators_count: prediction.indicators.length,
      model_version: prediction.modelVersion,
      explanation: prediction.explanation,
      timestamp: prediction.timestamp,
      details_json: JSON.stringify({
        indicators: prediction.indicators,
        safetyRecommendations: prediction.safetyRecommendations,
        featuresUsed: prediction.featuresUsed
      })
    });

    res.json({
      success: true,
      scanId,
      result: prediction
    });
  } catch (err: any) {
    console.error('Error in /api/predict:', err);
    res.status(500).json({
      error: 'Prediction Error',
      message: 'An internal error occurred during email classification.'
    });
  }
});

// 3. Scan History (List with Search & Filters)
app.get('/api/history', async (req: Request, res: Response) => {
  try {
    const search = req.query.search ? String(req.query.search) : undefined;
    const classification = req.query.classification ? String(req.query.classification) : undefined;
    const sortBy = req.query.sortBy as any;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 50;
    const offset = req.query.offset ? parseInt(String(req.query.offset), 10) : 0;

    const history = await getScans({ search, classification, sortBy, limit, offset });
    res.json({
      success: true,
      total: history.total,
      scans: history.scans
    });
  } catch (err: any) {
    console.error('Error in /api/history:', err);
    res.status(500).json({ error: 'Failed to retrieve scan history' });
  }
});

// 4. Single Scan Detail
app.get('/api/history/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid record ID' });
    }

    const record = await getScanById(id);
    if (!record) {
      return res.status(404).json({ error: 'Scan record not found' });
    }

    res.json({ success: true, record });
  } catch (err: any) {
    console.error('Error in GET /api/history/:id:', err);
    res.status(500).json({ error: 'Failed to retrieve scan record' });
  }
});

// 5. Delete Single Scan
app.delete('/api/history/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid record ID' });
    }

    await deleteScan(id);
    res.json({ success: true, message: `Scan record #${id} deleted successfully.` });
  } catch (err: any) {
    console.error('Error in DELETE /api/history/:id:', err);
    res.status(500).json({ error: 'Failed to delete scan record' });
  }
});

// 6. Clear All History
app.delete('/api/history', async (req: Request, res: Response) => {
  try {
    await clearAllScans();
    res.json({ success: true, message: 'All scan history records have been cleared.' });
  } catch (err: any) {
    console.error('Error in DELETE /api/history:', err);
    res.status(500).json({ error: 'Failed to clear scan history' });
  }
});

// 7. Dashboard Aggregate Statistics
app.get('/api/dashboard', async (req: Request, res: Response) => {
  try {
    const stats = await getDashboardStats();
    res.json({
      success: true,
      stats,
      modelMetadata: MODEL_METADATA
    });
  } catch (err: any) {
    console.error('Error in /api/dashboard:', err);
    res.status(500).json({ error: 'Failed to load dashboard metrics' });
  }
});

// 8. Model Performance Metrics
app.get('/api/model-metrics', (req: Request, res: Response) => {
  res.json({
    success: true,
    metadata: MODEL_METADATA
  });
});

// 9. Built-in Demonstration Samples
app.get('/api/samples', (req: Request, res: Response) => {
  res.json({
    success: true,
    samples: SAMPLE_EMAILS
  });
});

// ========================
// Frontend Delivery Setup
// ========================
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CyberShield ML] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
