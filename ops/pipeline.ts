import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// ============================================================
// PIPELINE: Lead → Deal → Order → Revenue
// Self-improving: tracks conversion at every stage
// ============================================================

const PIPELINE_STAGES = [
  { id: 'new', name: 'New Lead', probability: 5, color: '#78716c' },
  { id: 'contacted', name: 'Contacted', probability: 10, color: '#0EA5E9' },
  { id: 'qualified', name: 'Qualified', probability: 25, color: '#10B981' },
  { id: 'proposal', name: 'Proposal Sent', probability: 50, color: '#6F42C1' },
  { id: 'negotiation', name: 'Negotiation', probability: 75, color: '#F59E0B' },
  { id: 'closed_won', name: 'Closed Won', probability: 100, color: '#22C55E' },
  { id: 'closed_lost', name: 'Closed Lost', probability: 0, color: '#EF4444' },
];

// GET /ops/pipeline — Full pipeline with leads, deals, and conversion data
router.get('/pipeline', async (req: Request, res: Response) => {
  const { stage } = req.query;

  const where = stage ? { status: stage as string } : {};
  const leads = await prisma.lead.findMany({
    where,
    include: { deals: true },
    orderBy: { createdAt: 'desc' },
  });

  const deals = await prisma.deal.findMany({
    include: { lead: true, steps: true },
    orderBy: { updatedAt: 'desc' },
  });

  // Calculate pipeline metrics
  const totalPipelineValue = deals
    .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
    .reduce((acc, d) => acc + d.value, 0);
  const weightedPipelineValue = deals
    .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
    .reduce((acc, d) => acc + (d.value * d.probability / 100), 0);
  const wonValue = deals
    .filter(d => d.stage === 'closed_won')
    .reduce((acc, d) => acc + d.value, 0);

  // Stage-by-stage counts
  const stageBreakdown = PIPELINE_STAGES.map(s => ({
    ...s,
    count: deals.filter(d => d.stage === s.id).length,
    value: deals.filter(d => d.stage === s.id).reduce((acc, d) => acc + d.value, 0),
  }));

  res.json({
    stages: PIPELINE_STAGES,
    leads,
    deals,
    metrics: {
      totalPipelineValue,
      weightedPipelineValue,
      wonValue,
      dealCount: deals.length,
      leadCount: leads.length,
      conversionRate: leads.length > 0
        ? (deals.filter(d => d.stage === 'closed_won').length / leads.length * 100).toFixed(1)
        : 0,
    },
    stageBreakdown,
  });
});

// POST /ops/pipeline/leads — Capture a new lead
router.post('/pipeline/leads', async (req: Request, res: Response) => {
  const { name, email, phone, company, source, estimatedValue, notes } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'name and email required' });

  try {
    const lead = await prisma.lead.create({
      data: {
        name, email, phone, company,
        source: source || 'direct',
        estimatedValue: estimatedValue || 0,
        notes,
        score: 10, // initial score
      },
    });
    console.log(`📋 New lead: ${lead.name} <${lead.email}> via ${lead.source}`);
    res.json(lead);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /ops/pipeline/leads/:id — Update lead status
router.put('/pipeline/leads/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const lead = await prisma.lead.update({ where: { id }, data: updates });
    res.json(lead);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /ops/pipeline/deals — Create a deal from a lead
router.post('/pipeline/deals', async (req: Request, res: Response) => {
  const { leadId, name, tier, value, notes } = req.body;
  if (!leadId || !name) return res.status(400).json({ error: 'leadId and name required' });

  try {
    const deal = await prisma.deal.create({
      data: {
        leadId, name,
        tier: tier || 'diagnostic',
        value: value || 497,
        stage: 'qualification',
        probability: 20,
        notes,
      },
    });

    // Auto-update lead status
    await prisma.lead.update({ where: { id: leadId }, data: { status: 'qualified' } });

    // Create initial pipeline step
    await prisma.pipelineStep.create({
      data: {
        dealId: deal.id,
        stage: 'qualification',
        action: 'Deal created from lead',
        status: 'completed',
        completedAt: new Date(),
      },
    });

    console.log(`📊 New deal: ${deal.name} — $${deal.value} (${deal.tier})`);
    res.json(deal);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /ops/pipeline/deals/:id — Update deal stage (move through pipeline)
router.put('/pipeline/deals/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { stage, probability, notes } = req.body;

  try {
    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) return res.status(404).json({ error: 'Deal not found' });

    const updateData: any = { stage };
    if (probability !== undefined) updateData.probability = probability;
    if (notes !== undefined) updateData.notes = notes;
    if (stage === 'closed_won') updateData.closedAt = new Date();

    const updated = await prisma.deal.update({ where: { id }, data: updateData });

    // Log the stage transition
    await prisma.pipelineStep.create({
      data: {
        dealId: id,
        stage,
        action: `Moved to ${stage}`,
        status: 'completed',
        assignedTo: req.body.assignedTo || 'system',
        completedAt: new Date(),
      },
    });

    // If won, auto-create order placeholder
    if (stage === 'closed_won') {
      console.log(`💰 DEAL WON: ${deal.name} — $${deal.value}`);
    }

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /ops/pipeline/metrics — Pipeline analytics snapshot
router.get('/pipeline/metrics', async (_req: Request, res: Response) => {
  const totalLeads = await prisma.lead.count();
  const qualifiedLeads = await prisma.lead.count({ where: { status: 'qualified' } });
  const activeDeals = await prisma.deal.count({ where: { stage: { notIn: ['closed_won', 'closed_lost'] } } });
  const wonDeals = await prisma.deal.count({ where: { stage: 'closed_won' } });
  const orders = await prisma.order.findMany();

  const totalRevenue = orders.reduce((acc, o) => acc + o.amount, 0);
  const activeRevenue = orders
    .filter(o => o.status === 'active')
    .reduce((acc, o) => acc + o.amount, 0);

  res.json({
    totalLeads,
    qualifiedLeads,
    activeDeals,
    wonDeals,
    totalRevenue,
    activeRevenue,
    leadToDealRate: totalLeads > 0 ? (activeDeals / totalLeads * 100).toFixed(1) : '0',
    dealToWonRate: (activeDeals + wonDeals) > 0 ? (wonDeals / (activeDeals + wonDeals) * 100).toFixed(1) : '0',
  });
});

export default router;
