import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// ============================================================
// ANALYTICS ENGINE: Self-Improving Business Intelligence
// Every endpoint provides recommendations based on real data
// ============================================================

// GET /ops/analytics/dashboard — Main KPI dashboard
router.get('/analytics/dashboard', async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  const leads = await prisma.lead.findMany();
  const deals = await prisma.deal.findMany();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);

  // Revenue metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.amount, 0);
  const revenue30d = orders
    .filter(o => o.createdAt >= thirtyDaysAgo)
    .reduce((acc, o) => acc + o.amount, 0);
  const activeOrders = orders.filter(o => o.status === 'active');
  const mrr = activeOrders.reduce((acc, o) => acc + o.amount, 0); // recurring from active

  // Pipeline metrics
  const wonDeals = deals.filter(d => d.stage === 'closed_won');
  const activeDeals = deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage));
  const pipelineValue = activeDeals.reduce((acc, d) => acc + d.value, 0);
  const weightedPipeline = activeDeals.reduce((acc, d) => acc + (d.value * d.probability / 100), 0);

  // Lead metrics
  const leadConversion = leads.length > 0
    ? ((wonDeals.length / leads.length) * 100).toFixed(1)
    : '0';

  // Tier breakdown
  const tierBreakdown = orders.reduce((acc: Record<string, { count: number; revenue: number }>, o) => {
    if (!acc[o.tier]) acc[o.tier] = { count: 0, revenue: 0 };
    acc[o.tier].count += 1;
    acc[o.tier].revenue += o.amount;
    return acc;
  }, {});

  // Self-improving recommendations based on real data
  const recommendations: string[] = [];
  if (leads.length > 0 && wonDeals.length === 0) recommendations.push('🔴 Leads are not converting. Review qualification criteria and proposal quality.');
  if (activeDeals.length > 5 && pipelineValue > 5000) recommendations.push('🟢 Strong pipeline. Ensure fulfillment capacity is ready for incoming deals.');
  if (revenue30d === 0 && totalRevenue === 0) recommendations.push('💡 First revenue milestone: Focus on closing 1 Diagnostic ($497) deal this week.');
  if (revenue30d > 0 && orders.filter(o => o.tier === 'activation').length === 0) recommendations.push('📈 Activation upsell opportunity: Contact Diagnostic buyers about Activation upgrade ($2,497).');
  if (activeOrders.length > 0) recommendations.push('🔄 Retainer revenue active — maintain quality to prevent churn.');

  res.json({
    revenue: {
      total: totalRevenue,
      last30d: revenue30d,
      mrr,
      activeClients: activeOrders.length,
      tierBreakdown,
    },
    pipeline: {
      activeDeals: activeDeals.length,
      pipelineValue,
      weightedPipeline,
      wonDeals: wonDeals.length,
      totalDeals: deals.length,
    },
    leads: {
      total: leads.length,
      qualified: leads.filter(l => l.status === 'qualified').length,
      conversion: `${leadConversion}%`,
      bySource: leads.reduce((acc: Record<string, number>, l) => {
        acc[l.source] = (acc[l.source] || 0) + 1;
        return acc;
      }, {}),
    },
    recommendations,
    generatedAt: new Date().toISOString(),
  });
});

// GET /ops/analytics/revenue — Detailed revenue analytics
router.get('/analytics/revenue', async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'asc' } });

  // Revenue by month
  const monthlyRevenue = orders.reduce((acc: Record<string, number>, o) => {
    const month = o.createdAt.toISOString().slice(0, 7); // YYYY-MM
    acc[month] = (acc[month] || 0) + o.amount;
    return acc;
  }, {});

  // Running total
  let running = 0;
  const revenueOverTime = orders.map(o => {
    running += o.amount;
    return {
      date: o.createdAt.toISOString(),
      order: o.id,
      tier: o.tier,
      amount: o.amount,
      runningTotal: running,
    };
  });

  const totalRevenue = orders.reduce((acc, o) => acc + o.amount, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  res.json({
    summary: { totalRevenue, orderCount: orders.length, avgOrderValue },
    monthly: Object.entries(monthlyRevenue).map(([month, amount]) => ({ month, amount })),
    timeline: revenueOverTime,
  });
});

// GET /ops/analytics/leads — Lead source analytics
router.get('/analytics/leads', async (_req: Request, res: Response) => {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });

  const bySource = leads.reduce((acc: Record<string, number>, l) => {
    acc[l.source] = (acc[l.source] || 0) + 1;
    return acc;
  }, {});

  const byStatus = leads.reduce((acc: Record<string, number>, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  // Recommendations by source effectiveness
  const bestSource = Object.entries(bySource).sort((a, b) => b[1] - a[1])[0];
  const recommendations = bestSource
    ? [`📊 Best lead source: "${bestSource[0]}" (${bestSource[1]} leads). Double down on this channel.`]
    : ['💡 No leads yet. Activate first lead source: LinkedIn outreach or inbound capture.'];

  res.json({
    total: leads.length,
    bySource,
    byStatus,
    bestSource: bestSource?.[0] || null,
    recommendations,
    leads: leads.map(l => ({
      id: l.id, name: l.name, email: l.email, source: l.source,
      status: l.status, score: l.score, createdAt: l.createdAt.toISOString(),
    })),
  });
});

// GET /ops/analytics/forecast — AI-powered revenue forecast
router.get('/analytics/forecast', async (_req: Request, res: Response) => {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'asc' } });
  const deals = await prisma.deal.findMany();

  const totalRevenue = orders.reduce((acc, o) => acc + o.amount, 0);
  const pipelineValue = deals
    .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
    .reduce((acc, d) => acc + d.value, 0);
  const weightedPipeline = deals
    .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
    .reduce((acc, d) => acc + (d.value * d.probability / 100), 0);

  // Simple 90-day forecast
  const avgMonthlyRevenue = orders.length > 0
    ? totalRevenue / Math.max(1, Math.ceil((Date.now() - (orders[0]?.createdAt?.getTime() || Date.now())) / (30 * 86400000)))
    : 0;

  const forecast = [];
  for (let i = 1; i <= 3; i++) {
    forecast.push({
      month: `Month ${i}`,
      conservative: Math.round(avgMonthlyRevenue * i),
      expected: Math.round((avgMonthlyRevenue + pipelineValue * 0.3) * i),
      optimistic: Math.round((avgMonthlyRevenue + pipelineValue * 0.5) * i),
    });
  }

  res.json({
    currentRevenue: totalRevenue,
    pipelineValue,
    weightedPipeline,
    forecast,
    note: 'Forecast improves as pipeline data accumulates',
  });
});

export default router;
