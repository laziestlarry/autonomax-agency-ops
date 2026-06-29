export enum FileStatus {
  UNPROCESSED = 'Unprocessed',
  CATALOGED = 'Cataloged',
  ANALYZED = 'Analyzed',
  MONETIZED = 'Monetized',
  TRIAGE = 'In Triage',
}

export enum PotentialUse {
  INSPIRATION = 'Inspiration',
  DIRECT_USE = 'Direct Use',
  LEARNING = 'Learning Resource',
  ACTION = 'Action Basis',
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export interface GenesisEntry {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  status: FileStatus;
  tags: string[];
  collection: string;
  copyright: string;
  potentialUse: PotentialUse;
}

export interface RepoAnalysis {
  id: string;
  name: string;
  url: string;
  scores: {
    demand: number;
    resilience: number;
    sustainability: number;
    bi: number;
    mi: number;
    si: number;
    competitiveness: number;
    trendiness: number;
    modernization: number;
    innovation: number;
    grades: {
      infraAndFacing: string;
      opsFlow: string;
      journey: string;
      modellingSystem: string;
      tailLogicAndMethodBuild: string;
      operationalCompleteness: string;
      outcomeFavorability: string;
      multiplier: number;
    };
    ranking: 'Demand-Trendy' | 'Niche-Fit' | 'Pain-Killer';
    analysis: {
      keyLibs: string[];
      strategies: string;
      coreSystem: string;
      organization: string;
      orchestration: string;
      cultureAndIntelligence: string;
      totalInspectionOverview: string;
    };
    strategicPaths: {
      reportRoute: string;
      bestUseCase: string;
      caseOutput: string;
    }[];
  };
}

export interface BusinessModel {
  id: string;
  name: string;
  description: string;
  revenueStream: string;
  capex: number;
  opex: number;
  projectedRevenue: number;
  ebitda: number;
  roi: number;
  breakevenMonths: number;
  isOptimal: boolean;
}

export interface FunnelSegment {
  id: string;
  target: string;
  trafficShare: number;
  conversionRate: number;
  cac: number;
  ltv: number;
  lifecycleSupport: string;
}

export interface PipelineStageData {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  logs: string[];
  duration?: string;
}

export interface OfferTier {
  id: string;
  name: string;
  price: number;
  description: string;
  deliverables: string[];
  commercialRole: string;
}

export interface KPI {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface MRRDataPoint {
  month: string;
  mrr: number;
  growth: number;
}

export interface SentimentData {
  sector: string;
  intensity: number;
  volume: number;
  trend: 'rising' | 'stable' | 'declining';
}

export interface BotTask {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  logs: string[];
  startedAt?: string;
  completedAt?: string;
}

export interface ApprovalRequest {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  bot: string;
}

export interface RevenueForecast {
  month: number;
  audits: number;
  activations: number;
  retainers: number;
  totalMRR: number;
  ebitda: number;
  cumulativeRevenue: number;
}

export interface GenesisState {
  entries: GenesisEntry[];
  analyses: RepoAnalysis[];
  businessModels: BusinessModel[];
  funnelSegments: FunnelSegment[];
  pipelineStages: PipelineStageData[];
  offers: OfferTier[];
  kpis: KPI[];
  mrrHistory: MRRDataPoint[];
  sentimentData: SentimentData[];
  botTasks: BotTask[];
  approvals: ApprovalRequest[];
  forecasts: RevenueForecast[];
}

export const DEFAULT_STATE: GenesisState = {
  entries: [],
  analyses: [],
  businessModels: [
    {
      id: 'bm1',
      name: 'Enterprise Perpetual',
      description: 'One-time license with annual support',
      revenueStream: 'Perpetual License + Maintenance',
      capex: 150000,
      opex: 45000,
      projectedRevenue: 350000,
      ebitda: 155000,
      roi: 103,
      breakevenMonths: 8,
      isOptimal: false,
    },
    {
      id: 'bm2',
      name: 'Top-Seller SaaS',
      description: 'Monthly subscription with tiered pricing',
      revenueStream: 'Recurring Subscription',
      capex: 80000,
      opex: 25000,
      projectedRevenue: 420000,
      ebitda: 315000,
      roi: 293,
      breakevenMonths: 4,
      isOptimal: true,
    },
    {
      id: 'bm3',
      name: 'White-Label API',
      description: 'API licensing with revenue share',
      revenueStream: 'API Calls + Revenue Share',
      capex: 60000,
      opex: 18000,
      projectedRevenue: 280000,
      ebitda: 202000,
      roi: 236,
      breakevenMonths: 3,
      isOptimal: false,
    },
  ],
  funnelSegments: [
    {
      id: 'f1',
      target: 'CTOs & Tech Leaders',
      trafficShare: 35,
      conversionRate: 8.5,
      cac: 420,
      ltv: 8400,
      lifecycleSupport: 'Technical Validation & ROI Framing',
    },
    {
      id: 'f2',
      target: 'Innovation Leads',
      trafficShare: 28,
      conversionRate: 12.0,
      cac: 380,
      ltv: 7200,
      lifecycleSupport: 'Pilot Programs & Case Studies',
    },
    {
      id: 'f3',
      target: 'Startup Founders',
      trafficShare: 22,
      conversionRate: 15.5,
      cac: 290,
      ltv: 5600,
      lifecycleSupport: 'Rapid Deployment & Mentorship',
    },
    {
      id: 'f4',
      target: 'Agency Owners',
      trafficShare: 15,
      conversionRate: 18.0,
      cac: 340,
      ltv: 9200,
      lifecycleSupport: 'White-Label & Partnership',
    },
  ],
  pipelineStages: [
    { id: 'p1', name: 'Discovery', status: 'idle', logs: [] },
    { id: 'p2', name: 'Validation', status: 'idle', logs: [] },
    { id: 'p3', name: 'Build', status: 'idle', logs: [] },
    { id: 'p4', name: 'Review', status: 'idle', logs: [] },
    { id: 'p5', name: 'Deploy', status: 'idle', logs: [] },
    { id: 'p6', name: 'Monitor', status: 'idle', logs: [] },
  ],
  offers: [
    {
      id: 't1',
      name: 'Diagnostic',
      price: 497,
      description: 'Revenue Audit & Readiness Assessment',
      deliverables: [
        'Stack Readiness Audit',
        'Payment/Integration Review',
        'Offer Viability Review',
        'Delivery Gap Map',
        '7-Day Action Plan',
      ],
      commercialRole: 'Fastest first sale, lead qualifier',
    },
    {
      id: 't2',
      name: 'Activation',
      price: 2497,
      description: 'Full Production Setup & Implementation',
      deliverables: [
        'Env & Credentials Alignment',
        'Landing/Service Flow Setup',
        'Webhook & Route Verification',
        'Payment Route Readiness Check',
        'Proof Artifacts & Handoff Pack',
      ],
      commercialRole: 'Core implementation revenue, upsell foundation',
    },
    {
      id: 't3',
      name: 'Command',
      price: 997,
      description: 'Commander Retainer — Ongoing Optimization',
      deliverables: [
        'Scheduled Health Reviews',
        'Monthly Issue Reports',
        'Conversion/Ops Recommendations',
        'Fulfillment Risk Flags',
        'Iteration Roadmap',
      ],
      commercialRole: 'Recurring revenue, cumulative intelligence',
    },
  ],
  kpis: [
    { id: 'k1', name: 'MRR', value: 28450, unit: '$', change: 12.4, trend: 'up' },
    { id: 'k2', name: 'CAC', value: 342, unit: '$', change: -5.2, trend: 'down' },
    { id: 'k3', name: 'LTV', value: 7200, unit: '$', change: 8.7, trend: 'up' },
    { id: 'k4', name: 'Conversion Rate', value: 14.2, unit: '%', change: 2.1, trend: 'up' },
    { id: 'k5', name: 'EBITDA Margin', value: 38.6, unit: '%', change: 4.3, trend: 'up' },
    { id: 'k6', name: 'Churn Rate', value: 2.8, unit: '%', change: -0.6, trend: 'down' },
  ],
  mrrHistory: [
    { month: 'Jan', mrr: 14200, growth: 0 },
    { month: 'Feb', mrr: 15800, growth: 11.3 },
    { month: 'Mar', mrr: 17600, growth: 11.4 },
    { month: 'Apr', mrr: 19200, growth: 9.1 },
    { month: 'May', mrr: 21500, growth: 12.0 },
    { month: 'Jun', mrr: 23800, growth: 10.7 },
    { month: 'Jul', mrr: 25600, growth: 7.6 },
    { month: 'Aug', mrr: 28450, growth: 11.1 },
  ],
  sentimentData: [
    { sector: 'AI Dev Tools', intensity: 92, volume: 85, trend: 'rising' },
    { sector: 'Micro-SaaS', intensity: 88, volume: 78, trend: 'rising' },
    { sector: 'FinTech', intensity: 76, volume: 62, trend: 'stable' },
    { sector: 'HealthTech', intensity: 82, volume: 70, trend: 'rising' },
    { sector: 'EdTech', intensity: 68, volume: 55, trend: 'declining' },
    { sector: 'GreenTech', intensity: 79, volume: 68, trend: 'rising' },
    { sector: 'Web3/Blockchain', intensity: 56, volume: 42, trend: 'declining' },
    { sector: 'No-Code Platforms', intensity: 84, volume: 74, trend: 'rising' },
  ],
  botTasks: [
    { id: 'b1', name: 'copy_bot', status: 'idle', logs: [] },
    { id: 'b2', name: 'mockup_bot', status: 'idle', logs: [] },
    { id: 'b3', name: 'audit_bot', status: 'idle', logs: [] },
    { id: 'b4', name: 'shopify_bot', status: 'idle', logs: [] },
    { id: 'b5', name: 'social_pack_bot', status: 'idle', logs: [] },
    { id: 'b6', name: 'pricing_bot', status: 'idle', logs: [] },
    { id: 'b7', name: 'intelligence_bot', status: 'idle', logs: [] },
  ],
  approvals: [
    {
      id: 'a1',
      title: 'Deploy Shopify Integration',
      description: 'Push product listings to Shopify storefront',
      severity: 'high',
      status: 'pending',
      requestedBy: 'Commander',
      requestedAt: new Date().toISOString(),
      bot: 'shopify_bot',
    },
    {
      id: 'a2',
      title: 'Launch Social Campaign',
      description: 'Execute scheduled social media content push',
      severity: 'medium',
      status: 'pending',
      requestedBy: 'Commander',
      requestedAt: new Date().toISOString(),
      bot: 'social_pack_bot',
    },
    {
      id: 'a3',
      title: 'Update Pricing Model',
      description: 'Apply new pricing tiers to product catalog',
      severity: 'critical',
      status: 'pending',
      requestedBy: 'Commander',
      requestedAt: new Date().toISOString(),
      bot: 'pricing_bot',
    },
  ],
  forecasts: [
    { month: 1, audits: 8, activations: 3, retainers: 1, totalMRR: 4970, ebitda: 1800, cumulativeRevenue: 4970 },
    { month: 2, audits: 10, activations: 4, retainers: 2, totalMRR: 6970, ebitda: 2600, cumulativeRevenue: 11940 },
    { month: 3, audits: 12, activations: 5, retainers: 3, totalMRR: 8970, ebitda: 3400, cumulativeRevenue: 20910 },
    { month: 4, audits: 14, activations: 6, retainers: 4, totalMRR: 10970, ebitda: 4200, cumulativeRevenue: 31880 },
    { month: 5, audits: 16, activations: 7, retainers: 5, totalMRR: 12970, ebitda: 5000, cumulativeRevenue: 44850 },
    { month: 6, audits: 18, activations: 8, retainers: 6, totalMRR: 14970, ebitda: 5800, cumulativeRevenue: 59820 },
  ],
};
