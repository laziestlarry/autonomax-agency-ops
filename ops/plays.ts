// ============================================================
// AUTONOMA-X GTM PLAYS ENGINE
// Automated outreach campaigns, pipeline tracking, zero-ad sales
// ============================================================

import { Router, Request, Response } from 'express';
import { generate, generateJSON, AI_PROVIDER_LABEL, AI_AVAILABLE } from './ai';

const router = Router();

// ============================================================
// Play Templates (from AGENTS.md plays)
// ============================================================

const PLAY_TEMPLATES = [
  {
    id: 'zero_ad_sales',
    name: 'Zero-Ad Sales Plan',
    description: 'Step-by-step plan to sell using personal network, Instagram & Canva — no paid ads',
    channel: 'Instagram / X.com / Personal Network',
    prompt: `Create a step-by-step zero-ad sales plan for Autonoma-X agency services.
Target audience: SaaS founders, CTOs, agency owners.
Product tiers: Diagnostic ($497), Command ($997), Activation ($2,497).
Generate: 7-day content calendar, DM outreach templates, Canva post ideas, conversion sequence.`,
    icon: 'target',
    active: true,
  },
  {
    id: 'partnership_power',
    name: 'Partnership Power Plays',
    description: 'Borrow audiences bigger than yours — 5 partnership types to drive traffic',
    channel: 'Partner Ecosystems',
    prompt: `Suggest 5 partnership types for Autonoma-X that can drive traffic, boost credibility & reach more customers fast.
Target: SaaS platforms, dev tool companies, digital agencies, startup accelerators, content creators.
For each: partner type, value prop for them, traffic potential, implementation steps.`,
    icon: 'handshake',
    active: true,
  },
  {
    id: 'hype_machine',
    name: '7-Day Hype Machine',
    description: 'From zero buzz to full-blown launch — pre-launch, launch day, post-launch',
    channel: 'Multi-channel',
    prompt: `Build a 7-day product launch plan for Autonoma-X targeting SaaS founders and CTOs.
Platforms: LinkedIn, X.com, email.
Include: pre-launch content (days 1-3), launch-day CTAs (days 4-5), post-launch nurture (days 6-7).
Product: AI-powered business automation agency with 3 tiers ($497/$997/$2,497).`,
    icon: 'zap',
    active: true,
  },
  {
    id: 'linkedin_authority',
    name: 'LinkedIn Authority Engine',
    description: 'Daily LinkedIn content system — build credibility, generate inbound leads',
    channel: 'LinkedIn',
    prompt: `Create a LinkedIn content strategy for Autonoma-X.
Goal: Position as the authority in AI business automation.
Content pillars: (1) AI ROI stories, (2) Business automation tips, (3) Founder insights.
Post types: carousels, text posts, document posts, engagement bait.
Hashtag strategy. Engagement routine. DM conversion flow.`,
    icon: 'linkedin',
    active: true,
  },
  {
    id: 'twitter_growth',
    name: 'X.com Growth Sprint',
    description: 'Build audience and drive traffic through X.com engagement',
    channel: 'X.com',
    prompt: `Build an X.com growth strategy for Autonoma-X.
Focus on: SaaS/build in public audience, AI tools community.
Content strategy: value threads, reply farming, quote posting.
Daily routine: 5 posts, 15 replies, 3 DMs.
Growth hooks, follower conversion to pipeline.`,
    icon: 'twitter',
    active: true,
  },
];

// ============================================================
// Mock campaign storage (in-memory — swap to Prisma/DB when needed)
// ============================================================

interface Campaign {
  id: string;
  playId: string;
  name: string;
  channel: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  metrics: {
    impressions: number;
    clicks: number;
    leads: number;
    deals: number;
    revenue: number;
  };
  content?: string;
  steps: CampaignStep[];
}

interface CampaignStep {
  id: string;
  day: number;
  title: string;
  content: string;
  status: 'pending' | 'done' | 'skipped';
  completedAt?: string;
}

const campaigns: Campaign[] = [];

// ============================================================
// Routes
// ============================================================

// GET /ops/plays — List all play templates
router.get('/plays', (_req: Request, res: Response) => {
  res.json({
    ai_available: AI_AVAILABLE,
    ai_provider: AI_PROVIDER_LABEL,
    plays: PLAY_TEMPLATES,
  });
});

// GET /ops/plays/campaigns — List active campaigns
router.get('/plays/campaigns', (_req: Request, res: Response) => {
  res.json({ campaigns });
});

// POST /ops/plays/generate — Generate campaign content from a play
router.post('/plays/generate', async (req: Request, res: Response) => {
  const { playId } = req.body;
  const template = PLAY_TEMPLATES.find(p => p.id === playId);
  if (!template) {
    return res.status(400).json({ error: `Unknown play: ${playId}` });
  }

  // Generate campaign using AI
  const content = await generate(
    `You are a GTM strategist for Autonoma-X, an AI-powered business automation agency. 
     Generate a detailed, actionable campaign plan. Include specific post ideas, timing, and CTAs.
     Format as structured text with clear sections.`,
    template.prompt,
    { temperature: 0.4, maxTokens: 2000 },
  );

  // Create campaign record
  const campaign: Campaign = {
    id: `cmp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    playId: template.id,
    name: template.name,
    channel: template.channel,
    status: 'draft',
    createdAt: new Date().toISOString(),
    metrics: { impressions: 0, clicks: 0, leads: 0, deals: 0, revenue: 0 },
    steps: [],
    content,
  };

  // Parse content into steps if possible
  const stepLines = content.split('\n').filter(l => l.trim().match(/^(Day|Step|\d+[\.\)])/i));
  campaign.steps = stepLines.map((line, i) => ({
    id: `step_${i + 1}`,
    day: i + 1,
    title: line.replace(/^(Day|Step)\s*\d+[\s:\.\)]*/i, '').trim().slice(0, 60) || `Step ${i + 1}`,
    content: line,
    status: 'pending',
  }));

  if (campaign.steps.length === 0) {
    // Fallback: create placeholder steps
    for (let i = 0; i < 5; i++) {
      campaign.steps.push({
        id: `step_${i + 1}`,
        day: i + 1,
        title: `Day ${i + 1} Action`,
        content: `Execute day ${i + 1} of the ${template.name} campaign`,
        status: 'pending',
      });
    }
  }

  campaigns.unshift(campaign);
  res.json({ campaign, content });
});

// POST /ops/plays/campaigns/:id/start — Launch a campaign
router.post('/plays/campaigns/:id/start', (req: Request, res: Response) => {
  const campaign = campaigns.find(c => c.id === req.params.id);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

  campaign.status = 'active';
  campaign.startedAt = new Date().toISOString();
  res.json({ campaign });
});

// POST /ops/plays/campaigns/:id/step/:stepId/complete — Mark step done
router.post('/plays/campaigns/:id/step/:stepId/complete', (req: Request, res: Response) => {
  const campaign = campaigns.find(c => c.id === req.params.id);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

  const step = campaign.steps.find(s => s.id === req.params.stepId);
  if (!step) return res.status(404).json({ error: 'Step not found' });

  step.status = 'done';
  step.completedAt = new Date().toISOString();

  // Check if all steps done
  const allDone = campaign.steps.every(s => s.status === 'done');
  if (allDone) {
    campaign.status = 'completed';
    campaign.completedAt = new Date().toISOString();
  }

  res.json({ campaign });
});

// POST /ops/plays/campaigns/:id/metrics — Update campaign metrics
router.post('/ops/plays/campaigns/:id/metrics', (req: Request, res: Response) => {
  const campaign = campaigns.find(c => c.id === req.params.id);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

  const { impressions, clicks, leads, deals, revenue } = req.body;
  if (impressions) campaign.metrics.impressions += impressions;
  if (clicks) campaign.metrics.clicks += clicks;
  if (leads) campaign.metrics.leads += leads;
  if (deals) campaign.metrics.deals += deals;
  if (revenue) campaign.metrics.revenue += revenue;

  res.json({ campaign });
});

// GET /ops/plays/analytics — GTM analytics summary
router.get('/plays/analytics', (_req: Request, res: Response) => {
  const totalImpressions = campaigns.reduce((a, c) => a + c.metrics.impressions, 0);
  const totalClicks = campaigns.reduce((a, c) => a + c.metrics.clicks, 0);
  const totalLeads = campaigns.reduce((a, c) => a + c.metrics.leads, 0);
  const totalDeals = campaigns.reduce((a, c) => a + c.metrics.deals, 0);
  const totalRevenue = campaigns.reduce((a, c) => a + c.metrics.revenue, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;

  res.json({
    campaigns: campaigns.length,
    activeCampaigns,
    completedCampaigns,
    metrics: {
      impressions: totalImpressions,
      clicks: totalClicks,
      leads: totalLeads,
      deals: totalDeals,
      revenue: totalRevenue,
    },
    conversionRate: totalImpressions > 0 ? ((totalLeads / totalImpressions) * 100).toFixed(1) : '0.0',
    dealRate: totalLeads > 0 ? ((totalDeals / totalLeads) * 100).toFixed(1) : '0.0',
  });
});

export default router;
