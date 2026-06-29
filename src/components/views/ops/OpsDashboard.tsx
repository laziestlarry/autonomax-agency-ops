import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, TrendingUp, DollarSign, Users, Target,
  Activity, Zap, Shield, Crown, GitBranch, AlertTriangle
} from 'lucide-react';

interface KpiCard {
  label: string; value: string | number; change?: string; icon: React.ReactNode; color: string;
}

interface Recommendation {
  text: string;
  type: 'critical' | 'warning' | 'info' | 'success';
}

export const OpsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/ops/analytics/dashboard').then(r => r.json()),
      fetch('/ops/org').then(r => r.json()),
    ]).then(([metricsData, orgData]) => {
      setMetrics(metricsData);
      setOrg(orgData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full text-[#78716c]">
      <Activity size={32} className="animate-pulse" />
    </div>
  );

  const kpis: KpiCard[] = metrics ? [
    { label: 'Total Revenue', value: `$${metrics.revenue.total.toLocaleString()}`, icon: <DollarSign size={18} />, color: '#22C55E' },
    { label: 'MRR', value: `$${metrics.revenue.mrr.toLocaleString()}`, icon: <TrendingUp size={18} />, color: '#6F42C1' },
    { label: 'Active Clients', value: metrics.revenue.activeClients, icon: <Users size={18} />, color: '#0EA5E9' },
    { label: 'Pipeline Value', value: `$${metrics.pipeline.pipelineValue.toLocaleString()}`, icon: <Target size={18} />, color: '#F59E0B' },
    { label: 'Weighted Pipeline', value: `$${metrics.pipeline.weightedPipeline.toLocaleString()}`, icon: <GitBranch size={18} />, color: '#10B981' },
    { label: 'Lead Conversion', value: metrics.leads.conversion, icon: <Zap size={18} />, color: '#EF4444' },
  ] : [];

  const recommendations: Recommendation[] = metrics?.recommendations?.map((r: string) => ({
    text: r,
    type: r.includes('🔴') ? 'critical' : r.includes('🟢') ? 'success' : r.includes('💡') ? 'info' : 'warning',
  })) || [];

  return (
    <div className="p-4 md:p-6 lg:p-8 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-[#fafaf9] flex items-center gap-2">
          <Crown size={24} className="text-[#6F42C1]" />
          Agency Command Center
        </h1>
        <p className="text-[#78716c] text-sm mt-1">
          {org?.mission || 'Real-time operations, pipeline, and revenue'}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-[#1c1917] border border-[#44403c] rounded-lg p-3 hover:border-[#6F42C1]/50 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: kpi.color }}>{kpi.icon}</span>
              <span className="text-[#a8a29e] text-xs">{kpi.label}</span>
            </div>
            <div className="text-lg font-bold text-[#fafaf9]">{kpi.value}</div>
            {kpi.change && <div className="text-xs text-[#22C55E]">{kpi.change}</div>}
          </div>
        ))}
      </div>

      {/* Tier Breakdown */}
      {metrics?.revenue?.tierBreakdown && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {Object.entries(metrics.revenue.tierBreakdown).map(([tier, data]: [string, any]) => (
            <div key={tier} className="bg-[#1c1917] border border-[#44403c] rounded-lg p-4">
              <div className="text-[#a8a29e] text-xs uppercase tracking-wider mb-1">{tier}</div>
              <div className="text-xl font-bold text-[#fafaf9]">${data.revenue.toLocaleString()}</div>
              <div className="text-xs text-[#78716c]">{data.count} order{data.count !== 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#a8a29e] uppercase tracking-wider mb-2">
            <AlertTriangle size={14} className="inline mr-1" />
            Intelligence & Recommendations
          </h2>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div key={i} className={`p-3 rounded-lg border text-sm ${
                rec.type === 'critical' ? 'bg-red-950/30 border-red-800/40 text-red-300' :
                rec.type === 'success' ? 'bg-green-950/30 border-green-800/40 text-green-300' :
                rec.type === 'info' ? 'bg-blue-950/30 border-blue-800/40 text-blue-300' :
                'bg-yellow-950/30 border-yellow-800/40 text-yellow-300'
              }`}>
                {rec.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Sources */}
      {metrics?.leads?.bySource && Object.keys(metrics.leads.bySource).length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[#a8a29e] uppercase tracking-wider mb-2">
            Lead Sources
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(metrics.leads.bySource).map(([source, count]: [string, any]) => (
              <div key={source} className="bg-[#292524] border border-[#44403c] rounded-full px-3 py-1 text-xs text-[#d6d3d1]">
                {source}: {count}
              </div>
            ))}
          </div>
        </div>
      )}

      {!metrics && (
        <div className="text-center text-[#78716c] py-12">
          <LayoutDashboard size={48} className="mx-auto mb-3 opacity-30" />
          <p>No data yet. Start by capturing leads and processing orders.</p>
        </div>
      )}
    </div>
  );
};
