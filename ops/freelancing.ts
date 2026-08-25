import { Router } from 'express';
import { randomUUID } from 'crypto';
import { LIVE_FREELANCE_QUEUE } from './freelance-live-queue';

const router = Router();

type Stage =
  | 'discovered'
  | 'qualified'
  | 'approved'
  | 'proposed'
  | 'won'
  | 'delivering'
  | 'qa'
  | 'delivered'
  | 'paid'
  | 'lost';

type Lane = 'cad_3d' | 'business_strategy' | 'ai_automation' | 'remote_role' | 'other';

export interface FreelanceOpportunity {
  id: string;
  source: string;
  sourceUrl?: string;
  title: string;
  buyer?: string;
  lane: Lane;
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  geographyEligible: boolean;
  skillsEvidence: number;
  reusableAssetFit: number;
  speedToFirstMilestone: number;
  paymentConfidence: number;
  competitionRisk: number;
  regulatedRisk: number;
  notes?: string;
  stage: Stage;
  score: number;
  createdAt: string;
  updatedAt: string;
  proposal?: {
    firstMilestone: string;
    deliveryWindow: string;
    price?: number;
    currency?: string;
    bidText?: string;
    submittedAt?: string;
  };
  delivery?: {
    acceptanceCriteria: string[];
    qaChecks: string[];
    evidence: string[];
  };
  payment?: {
    amount: number;
    currency: string;
    provider?: string;
    evidenceId: string;
    verifiedAt: string;
  };
}

const opportunities = new Map<string, FreelanceOpportunity>();

function clamp(v: unknown, fallback = 0) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, n));
}

function scoreOpportunity(input: Partial<FreelanceOpportunity>) {
  if (input.geographyEligible === false) return 0;
  const evidence = clamp(input.skillsEvidence);
  const reuse = clamp(input.reusableAssetFit);
  const speed = clamp(input.speedToFirstMilestone);
  const pay = clamp(input.paymentConfidence);
  const competition = clamp(input.competitionRisk);
  const regulated = clamp(input.regulatedRisk);

  const positive = evidence * 0.28 + reuse * 0.24 + speed * 0.22 + pay * 0.18;
  const penalty = competition * 0.05 + regulated * 0.12;
  return Math.max(0, Math.min(100, Math.round(positive - penalty)));
}

function suggestLane(title = '', notes = ''): Lane {
  const text = `${title} ${notes}`.toLowerCase();
  if (/revit|autocad|cad|3d|sketchup|architect|drawing|bim|render/.test(text)) return 'cad_3d';
  if (/business plan|strategy|market research|feasibility|consult/.test(text)) return 'business_strategy';
  if (/automation|agent|ai |workflow|api|llm/.test(text)) return 'ai_automation';
  if (/role|job|full[- ]?time|part[- ]?time|employment/.test(text)) return 'remote_role';
  return 'other';
}

// Seed the first human-approved execution queue from fresh marketplace evidence.
// These are proposal-ready internally; external marketplace submission remains account-bound.
for (const seed of LIVE_FREELANCE_QUEUE) {
  const item: FreelanceOpportunity = {
    id: seed.id,
    source: seed.source,
    sourceUrl: seed.sourceUrl,
    title: seed.title,
    lane: seed.lane,
    budgetMin: seed.budgetMin,
    budgetMax: seed.budgetMax,
    currency: seed.currency,
    geographyEligible: seed.geographyEligible,
    skillsEvidence: seed.skillsEvidence,
    reusableAssetFit: seed.reusableAssetFit,
    speedToFirstMilestone: seed.speedToFirstMilestone,
    paymentConfidence: seed.paymentConfidence,
    competitionRisk: seed.competitionRisk,
    regulatedRisk: seed.regulatedRisk,
    notes: seed.notes,
    stage: seed.stage,
    score: 0,
    createdAt: seed.capturedAt,
    updatedAt: seed.capturedAt,
    proposal: {
      firstMilestone: seed.proposal.firstMilestone,
      deliveryWindow: seed.proposal.deliveryWindow,
      price: seed.proposal.price,
      currency: seed.proposal.currency,
      bidText: seed.proposal.bidText,
    },
  };
  item.score = scoreOpportunity(item);
  opportunities.set(item.id, item);
}

router.get('/freelance/status', (_req, res) => {
  const all = [...opportunities.values()];
  const counts = all.reduce<Record<string, number>>((acc, item) => {
    acc[item.stage] = (acc[item.stage] || 0) + 1;
    return acc;
  }, {});
  const verifiedRevenue = all
    .filter((x) => x.stage === 'paid' && x.payment)
    .reduce((sum, x) => sum + (x.payment?.amount || 0), 0);

  res.json({
    module: 'AutonomaX Freelance Revenue Ops',
    operatingRule: 'opportunity → qualification → human approval → proposal → milestone → QA → delivery → verified payment',
    opportunityCount: all.length,
    stages: counts,
    verifiedRevenue,
    revenueRecognition: 'payment evidence required',
    humanApprovalRequiredFor: ['external proposal submission', 'platform application', 'contract acceptance'],
  });
});

router.get('/freelance/opportunities', (req, res) => {
  const stage = typeof req.query.stage === 'string' ? req.query.stage : undefined;
  const lane = typeof req.query.lane === 'string' ? req.query.lane : undefined;
  const minScore = Number(req.query.minScore || 0);
  const rows = [...opportunities.values()]
    .filter((x) => !stage || x.stage === stage)
    .filter((x) => !lane || x.lane === lane)
    .filter((x) => x.score >= minScore)
    .sort((a, b) => b.score - a.score);
  res.json({ opportunities: rows });
});

router.post('/freelance/opportunities', (req, res) => {
  const body = req.body || {};
  if (!body.source || !body.title) {
    res.status(400).json({ error: 'source and title are required' });
    return;
  }

  const now = new Date().toISOString();
  const item: FreelanceOpportunity = {
    id: randomUUID(),
    source: String(body.source),
    sourceUrl: body.sourceUrl ? String(body.sourceUrl) : undefined,
    title: String(body.title),
    buyer: body.buyer ? String(body.buyer) : undefined,
    lane: body.lane || suggestLane(body.title, body.notes),
    budgetMin: Number.isFinite(Number(body.budgetMin)) ? Number(body.budgetMin) : undefined,
    budgetMax: Number.isFinite(Number(body.budgetMax)) ? Number(body.budgetMax) : undefined,
    currency: body.currency ? String(body.currency) : undefined,
    geographyEligible: body.geographyEligible !== false,
    skillsEvidence: clamp(body.skillsEvidence),
    reusableAssetFit: clamp(body.reusableAssetFit),
    speedToFirstMilestone: clamp(body.speedToFirstMilestone),
    paymentConfidence: clamp(body.paymentConfidence),
    competitionRisk: clamp(body.competitionRisk),
    regulatedRisk: clamp(body.regulatedRisk),
    notes: body.notes ? String(body.notes) : undefined,
    stage: 'discovered',
    score: 0,
    createdAt: now,
    updatedAt: now,
  };
  item.score = scoreOpportunity(item);
  if (item.score >= 65) item.stage = 'qualified';
  opportunities.set(item.id, item);
  res.status(201).json(item);
});

router.post('/freelance/opportunities/:id/approve', (req, res) => {
  const item = opportunities.get(req.params.id);
  if (!item) return res.status(404).json({ error: 'opportunity not found' });
  if (item.stage !== 'qualified' && item.stage !== 'discovered') {
    return res.status(409).json({ error: `cannot approve from stage ${item.stage}` });
  }
  item.stage = 'approved';
  item.updatedAt = new Date().toISOString();
  res.json(item);
});

router.post('/freelance/opportunities/:id/proposal', (req, res) => {
  const item = opportunities.get(req.params.id);
  if (!item) return res.status(404).json({ error: 'opportunity not found' });
  if (item.stage !== 'approved') {
    return res.status(409).json({ error: 'human approval is required before proposal preparation' });
  }
  const { firstMilestone, deliveryWindow, price, currency, bidText } = req.body || {};
  if (!firstMilestone || !deliveryWindow) {
    return res.status(400).json({ error: 'firstMilestone and deliveryWindow are required' });
  }
  item.proposal = {
    firstMilestone: String(firstMilestone),
    deliveryWindow: String(deliveryWindow),
    price: Number.isFinite(Number(price)) ? Number(price) : undefined,
    currency: currency ? String(currency) : item.currency,
    bidText: bidText ? String(bidText) : item.proposal?.bidText,
  };
  item.stage = 'proposed';
  item.updatedAt = new Date().toISOString();
  res.json({
    ...item,
    externalSubmission: 'not automated; submit through the authenticated marketplace/account after review',
  });
});

router.post('/freelance/opportunities/:id/won', (req, res) => {
  const item = opportunities.get(req.params.id);
  if (!item) return res.status(404).json({ error: 'opportunity not found' });
  item.stage = 'won';
  item.updatedAt = new Date().toISOString();
  res.json(item);
});

router.post('/freelance/opportunities/:id/delivery', (req, res) => {
  const item = opportunities.get(req.params.id);
  if (!item) return res.status(404).json({ error: 'opportunity not found' });
  const { acceptanceCriteria, qaChecks, evidence } = req.body || {};
  item.delivery = {
    acceptanceCriteria: Array.isArray(acceptanceCriteria) ? acceptanceCriteria.map(String) : [],
    qaChecks: Array.isArray(qaChecks) ? qaChecks.map(String) : [],
    evidence: Array.isArray(evidence) ? evidence.map(String) : [],
  };
  item.stage = 'qa';
  item.updatedAt = new Date().toISOString();
  res.json(item);
});

router.post('/freelance/opportunities/:id/delivered', (req, res) => {
  const item = opportunities.get(req.params.id);
  if (!item) return res.status(404).json({ error: 'opportunity not found' });
  if (!item.delivery || item.delivery.qaChecks.length === 0) {
    return res.status(409).json({ error: 'QA evidence is required before delivery can be marked complete' });
  }
  item.stage = 'delivered';
  item.updatedAt = new Date().toISOString();
  res.json(item);
});

router.post('/freelance/opportunities/:id/payment', (req, res) => {
  const item = opportunities.get(req.params.id);
  if (!item) return res.status(404).json({ error: 'opportunity not found' });
  const { amount, currency, provider, evidenceId } = req.body || {};
  if (!(Number(amount) > 0) || !currency || !evidenceId) {
    return res.status(400).json({ error: 'positive amount, currency and evidenceId are required' });
  }
  item.payment = {
    amount: Number(amount),
    currency: String(currency),
    provider: provider ? String(provider) : undefined,
    evidenceId: String(evidenceId),
    verifiedAt: new Date().toISOString(),
  };
  item.stage = 'paid';
  item.updatedAt = new Date().toISOString();
  res.json(item);
});

router.post('/freelance/opportunities/:id/lost', (req, res) => {
  const item = opportunities.get(req.params.id);
  if (!item) return res.status(404).json({ error: 'opportunity not found' });
  item.stage = 'lost';
  item.updatedAt = new Date().toISOString();
  res.json(item);
});

export default router;
