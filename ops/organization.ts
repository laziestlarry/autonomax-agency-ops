import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// ============================================================
// AUTONOMA-X ORG STRUCTURE
// Level 0: Directors — Strategy, vision, major decisions
// Level 1: Commanders — Coordinate execution, manage managers
// Level 2: Managers — Run specific domains, schedules, teams
// Level 3: Operators — Execute individual tasks, bots, workflows
// ============================================================

const DEFAULT_ORG = {
  name: 'Autonoma-X Agency',
  mission: 'Multiply enterprise value through AI-powered business automation',
  levels: [
    { level: 0, name: 'Director', color: '#6F42C1', icon: 'crown' },
    { level: 1, name: 'Commander', color: '#0EA5E9', icon: 'shield' },
    { level: 2, name: 'Manager', color: '#10B981', icon: 'briefcase' },
    { level: 3, name: 'Operator', color: '#F59E0B', icon: 'bot' },
  ],
  roles: {
    director_of_strategy: {
      title: 'Director of Strategy',
      level: 0,
      responsibilities: [
        'Set quarterly revenue targets and OKRs',
        'Approve pricing and offer strategy',
        'Define market positioning and brand',
        'Review pipeline health and make resource decisions',
      ],
    },
    director_of_operations: {
      title: 'Director of Operations',
      level: 0,
      responsibilities: [
        'Oversee delivery quality and SLAs',
        'Manage operational budget and costs',
        'Approve major workflow changes',
        'Ensure compliance and governance',
      ],
    },
    growth_commander: {
      title: 'Growth Commander',
      level: 1,
      reportsTo: 'director_of_strategy',
      responsibilities: [
        'Manage lead generation and pipeline',
        'Coordinate outreach campaigns',
        'Optimize conversion funnel',
        'Report on CAC, LTV, conversion metrics',
      ],
    },
    delivery_commander: {
      title: 'Delivery Commander',
      level: 1,
      reportsTo: 'director_of_operations',
      responsibilities: [
        'Orchestrate order fulfillment',
        'Manage bot execution and quality',
        'Schedule delivery milestones',
        'Handle escalation and blockers',
      ],
    },
    sales_manager: {
      title: 'Sales Manager',
      level: 2,
      reportsTo: 'growth_commander',
      responsibilities: [
        'Qualify leads and run discovery',
        'Prepare proposals and quotes',
        'Close deals and manage handoff',
        'Track pipeline and forecast',
      ],
    },
    fulfillment_manager: {
      title: 'Fulfillment Manager',
      level: 2,
      reportsTo: 'delivery_commander',
      responsibilities: [
        'Execute delivery workflows',
        'Generate reports and deliverables',
        'Manage bot assignments',
        'Quality check outputs',
      ],
    },
    bot_operators: {
      title: 'Bot Operators (x7)',
      level: 3,
      reportsTo: 'fulfillment_manager',
      responsibilities: [
        'Run micro-bot tasks',
        'Monitor execution logs',
        'Escalate failures',
        'Maintain bot documentation',
      ],
    },
  },
};

// GET /ops/org — Full organization structure
router.get('/org', (_req: Request, res: Response) => {
  res.json({
    ...DEFAULT_ORG,
    members: [], // In production, loaded from TeamMember table
    timestamp: new Date().toISOString(),
  });
});

// GET /ops/org/chart — Org hierarchy as flat list with parent references
router.get('/org/chart', async (_req: Request, res: Response) => {
  const members = await prisma.teamMember.findMany({ orderBy: { level: 'asc' } });
  res.json({
    hierarchy: DEFAULT_ORG.levels,
    members: members.length > 0 ? members : [
      // Default bootstrap team when no members exist
      { id: 'dir_strat', name: 'Strategy AI', email: 'strategy@autonomax.ai', role: 'director_of_strategy', title: 'Director of Strategy', level: 0, reportsTo: null, skills: '["strategy","vision","growth"]', status: 'active', createdAt: new Date(), updatedAt: new Date() },
      { id: 'dir_ops', name: 'Operations AI', email: 'ops@autonomax.ai', role: 'director_of_operations', title: 'Director of Operations', level: 0, reportsTo: null, skills: '["operations","quality","compliance"]', status: 'active', createdAt: new Date(), updatedAt: new Date() },
      { id: 'cmd_growth', name: 'Growth AI', email: 'growth@autonomax.ai', role: 'growth_commander', title: 'Growth Commander', level: 1, reportsTo: 'dir_strat', skills: '["growth","pipeline","outreach"]', status: 'active', createdAt: new Date(), updatedAt: new Date() },
      { id: 'cmd_delivery', name: 'Delivery AI', email: 'delivery@autonomax.ai', role: 'delivery_commander', title: 'Delivery Commander', level: 1, reportsTo: 'dir_ops', skills: '["fulfillment","orchestration","quality"]', status: 'active', createdAt: new Date(), updatedAt: new Date() },
      { id: 'mgr_sales', name: 'Sales AI', email: 'sales@autonomax.ai', role: 'sales_manager', title: 'Sales Manager', level: 2, reportsTo: 'cmd_growth', skills: '["sales","proposals","closing"]', status: 'active', createdAt: new Date(), updatedAt: new Date() },
      { id: 'mgr_fulfill', name: 'Fulfillment AI', email: 'fulfill@autonomax.ai', role: 'fulfillment_manager', title: 'Fulfillment Manager', level: 2, reportsTo: 'cmd_delivery', skills: '["delivery","bots","quality"]', status: 'active', createdAt: new Date(), updatedAt: new Date() },
    ],
  });
});

// GET /ops/org/roles — All defined roles
router.get('/org/roles', (_req: Request, res: Response) => {
  res.json({ roles: DEFAULT_ORG.roles });
});

// POST /ops/org/members — Add team member
router.post('/org/members', async (req: Request, res: Response) => {
  const { name, email, role, title, level, reportsTo, skills } = req.body;
  try {
    const member = await prisma.teamMember.create({
      data: { name, email, role, title, level, reportsTo, skills: JSON.stringify(skills || []) },
    });
    res.json(member);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
