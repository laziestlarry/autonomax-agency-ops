import { Router } from 'express';
import organizationRouter from './organization';
import pipelineRouter from './pipeline';
import workflowsRouter from './workflows';
import analyticsRouter from './analytics';
import fulfillmentRouter from './fulfillment';
import playsRouter from './plays';
import { getProviderStatus, checkOllama } from './ai';

const router = Router();

// Mount all ops sub-routers
router.use(organizationRouter);
router.use(pipelineRouter);
router.use(workflowsRouter);
router.use(analyticsRouter);
router.use(fulfillmentRouter);
router.use(playsRouter);

// GET /ops — Ops engine status
router.get('/', (_req, res) => {
  res.json({
    engine: 'Autonoma-X Operations Engine',
    version: '3.2.1',
    modules: ['organization', 'pipeline', 'workflows', 'analytics', 'fulfillment', 'plays', 'ai'],
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

// GET /ops/ai/status — AI provider status
router.get('/ai/status', async (_req, res) => {
  const status = getProviderStatus();
  // If no providers configured, try to auto-detect Ollama
  if (status.totalConfigured === 0) {
    const ollamaFound = await checkOllama();
    if (ollamaFound) {
      res.json({
        ...status,
        available: true,
        primaryProvider: 'ollama',
        primaryLabel: 'Ollama (auto-detected)',
        model: process.env.OLLAMA_MODEL || 'llama3',
        configuredProviders: [{ id: 'ollama', label: 'Ollama (auto-detected)', model: process.env.OLLAMA_MODEL || 'llama3' }],
        totalConfigured: 1,
      });
      return;
    }
  }
  res.json(status);
});

export default router;
