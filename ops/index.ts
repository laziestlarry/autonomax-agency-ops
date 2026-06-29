import { Router } from 'express';
import organizationRouter from './organization';
import pipelineRouter from './pipeline';
import workflowsRouter from './workflows';
import analyticsRouter from './analytics';
import fulfillmentRouter from './fulfillment';

const router = Router();

// Mount all ops sub-routers
router.use(organizationRouter);
router.use(pipelineRouter);
router.use(workflowsRouter);
router.use(analyticsRouter);
router.use(fulfillmentRouter);

// GET /ops — Ops engine status
router.get('/', (_req, res) => {
  res.json({
    engine: 'Autonoma-X Operations Engine',
    version: '3.2.1',
    modules: ['organization', 'pipeline', 'workflows', 'analytics', 'fulfillment'],
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

export default router;
