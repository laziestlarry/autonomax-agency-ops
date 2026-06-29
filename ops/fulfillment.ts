import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// ============================================================
// FULFILLMENT ENGINE: Automated Delivery After Payment
// Triggered by: Stripe webhook → order created → auto-fulfill
// ============================================================

// Deliverable templates per tier
const DELIVERABLE_TEMPLATES: Record<string, { name: string; type: string }[]> = {
  diagnostic: [
    { name: 'Stack Readiness Audit', type: 'report' },
    { name: 'Payment Integration Review', type: 'audit' },
    { name: '7-Day Action Plan', type: 'action_plan' },
  ],
  command: [
    { name: 'Health Review Report', type: 'health_check' },
    { name: 'Issue Analysis', type: 'report' },
    { name: 'Optimization Roadmap', type: 'action_plan' },
  ],
  activation: [
    { name: 'Environment Alignment', type: 'integration' },
    { name: 'Webhook Verification', type: 'audit' },
    { name: 'Handoff Package', type: 'report' },
  ],
};

// POST /ops/fulfillment/generate/:orderId — Generate deliverables for an order
router.post('/fulfillment/generate/:orderId', async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const templates = DELIVERABLE_TEMPLATES[order.tierId] || DELIVERABLE_TEMPLATES.diagnostic;
    const deliverables: any[] = [];
    const logs: string[] = [];

    // Generate each deliverable
    for (const template of templates) {
      logs.push(`[${new Date().toISOString()}] Generating ${template.name} (${template.type})...`);

      const deliverable = await prisma.deliverable.create({
        data: {
          orderId,
          name: template.name,
          type: template.type,
          status: 'completed',
          content: JSON.stringify({
            generatedFor: order.email,
            orderTier: order.tier,
            orderId: order.id,
            type: template.type,
            summary: `${template.name} for ${order.tier} order`,
            generatedAt: new Date().toISOString(),
          }),
          generatedAt: new Date(),
          deliveredAt: new Date(),
        },
      });

      deliverables.push(deliverable);
      await new Promise(r => setTimeout(r, 300)); // Simulate generation time
    }

    // Auto-launch after fulfillment
    logs.push(`[${new Date().toISOString()}] ✅ All deliverables generated for ${order.tier}`);

    // Update order to active if not already
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: order.status === 'completed' ? 'active' : order.status,
        launchLogs: JSON.stringify(logs),
        launchedAt: new Date(),
      },
    });

    res.json({
      status: 'fulfilled',
      orderId,
      deliverables,
      logs,
    });
  } catch (err: any) {
    console.error('Fulfillment error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /ops/fulfillment/deliverables/:orderId — Get deliverables for an order
router.get('/fulfillment/deliverables/:orderId', async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const deliverables = await prisma.deliverable.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ deliverables });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /ops/fulfillment/auto — Auto-fulfill all pending completed orders
router.post('/fulfillment/auto', async (_req: Request, res: Response) => {
  const pendingOrders = await prisma.order.findMany({
    where: { status: 'completed', launchedAt: null },
  });

  const results = [];
  for (const order of pendingOrders) {
    try {
      const templates = DELIVERABLE_TEMPLATES[order.tierId] || DELIVERABLE_TEMPLATES.diagnostic;
      for (const template of templates) {
        await prisma.deliverable.create({
          data: {
            orderId: order.id,
            name: template.name,
            type: template.type,
            status: 'completed',
            content: JSON.stringify({ autoFulfilled: true, tier: order.tier }),
            generatedAt: new Date(),
            deliveredAt: new Date(),
          },
        });
      }
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'active', launchedAt: new Date() },
      });
      results.push({ orderId: order.id, status: 'fulfilled' });
    } catch (err: any) {
      results.push({ orderId: order.id, status: 'failed', error: err.message });
    }
  }

  res.json({ fulfilled: results.length, results });
});

// GET /ops/fulfillment/templates — Available deliverable templates
router.get('/fulfillment/templates', (_req: Request, res: Response) => {
  res.json({ templates: DELIVERABLE_TEMPLATES });
});

export default router;
