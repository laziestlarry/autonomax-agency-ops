import React, { useState, useEffect } from 'react';
import {
  Target, Users, DollarSign, ChevronRight, Plus, PhoneCall, Send, CheckCircle2, XCircle, Clock
} from 'lucide-react';

interface Deal {
  id: string; name: string; leadId: string; tier: string; value: number;
  stage: string; probability: number; assignedTo: string; createdAt: string;
  lead?: { name: string; email: string; company: string; source: string };
}

interface StageDef {
  id: string; name: string; probability: number; color: string;
}

export const PipelineView: React.FC = () => {
  const [pipeline, setPipeline] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddLead, setShowAddLead] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', company: '', source: 'direct' });

  const loadPipeline = () => {
    setLoading(true);
    fetch('/ops/pipeline').then(r => r.json()).then(data => {
      setPipeline(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadPipeline(); }, []);

  const handleAddLead = async () => {
    if (!leadForm.name || !leadForm.email) return;
    await fetch('/ops/pipeline/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadForm),
    });
    setShowAddLead(false);
    setLeadForm({ name: '', email: '', company: '', source: 'direct' });
    loadPipeline();
  };

  const handleStageChange = async (dealId: string, newStage: string) => {
    await fetch(`/ops/pipeline/deals/${dealId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stage: newStage,
        probability: pipeline.stages.find((s: StageDef) => s.id === newStage)?.probability || 50,
      }),
    });
    loadPipeline();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full text-[#78716c]">
      <Target size={32} className="animate-pulse" />
    </div>
  );

  const stages = pipeline?.stages || [];
  const deals = pipeline?.deals || [];
  const metrics = pipeline?.metrics || {};
  const stageBreakdown = pipeline?.stageBreakdown || [];

  return (
    <div className="p-4 md:p-6 lg:p-8 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#fafaf9] flex items-center gap-2">
            <Target size={22} className="text-[#0EA5E9]" />
            Revenue Pipeline
          </h1>
          <p className="text-[#78716c] text-sm mt-1">
            {metrics.leadCount} leads · {metrics.dealCount} deals · ${metrics.totalPipelineValue?.toLocaleString()} pipeline
          </p>
        </div>
        <button
          onClick={() => setShowAddLead(!showAddLead)}
          className="flex items-center gap-2 px-4 py-2 bg-[#6F42C1] hover:bg-[#5a35a8] rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Lead
        </button>
      </div>

      {/* Add Lead Form */}
      {showAddLead && (
        <div className="bg-[#1c1917] border border-[#44403c] rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <input
              placeholder="Name *" value={leadForm.name}
              onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
              className="bg-[#292524] border border-[#44403c] rounded-lg px-3 py-2 text-sm text-[#fafaf9] placeholder:text-[#78716c]"
            />
            <input
              placeholder="Email *" value={leadForm.email}
              onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
              className="bg-[#292524] border border-[#44403c] rounded-lg px-3 py-2 text-sm text-[#fafaf9] placeholder:text-[#78716c]"
            />
            <input
              placeholder="Company" value={leadForm.company}
              onChange={e => setLeadForm({ ...leadForm, company: e.target.value })}
              className="bg-[#292524] border border-[#44403c] rounded-lg px-3 py-2 text-sm text-[#fafaf9] placeholder:text-[#78716c]"
            />
            <select
              value={leadForm.source}
              onChange={e => setLeadForm({ ...leadForm, source: e.target.value })}
              className="bg-[#292524] border border-[#44403c] rounded-lg px-3 py-2 text-sm text-[#fafaf9]"
            >
              <option value="direct">Direct</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">X.com</option>
              <option value="referral">Referral</option>
              <option value="shopify">Shopify</option>
            </select>
          </div>
          <button onClick={handleAddLead} className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] rounded-lg text-sm font-medium transition-colors">
            Capture Lead
          </button>
        </div>
      )}

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-[#1c1917] border border-[#44403c] rounded-lg p-3">
          <div className="text-[#a8a29e] text-xs">Pipeline Value</div>
          <div className="text-lg font-bold text-[#fafaf9]">${metrics.totalPipelineValue?.toLocaleString()}</div>
        </div>
        <div className="bg-[#1c1917] border border-[#44403c] rounded-lg p-3">
          <div className="text-[#a8a29e] text-xs">Weighted</div>
          <div className="text-lg font-bold text-[#fafaf9]">${metrics.weightedPipelineValue?.toLocaleString()}</div>
        </div>
        <div className="bg-[#1c1917] border border-[#44403c] rounded-lg p-3">
          <div className="text-[#a8a29e] text-xs">Closed Won</div>
          <div className="text-lg font-bold text-[#22C55E]">${metrics.wonValue?.toLocaleString()}</div>
        </div>
        <div className="bg-[#1c1917] border border-[#44403c] rounded-lg p-3">
          <div className="text-[#a8a29e] text-xs">Win Rate</div>
          <div className="text-lg font-bold text-[#fafaf9]">{metrics.conversionRate}%</div>
        </div>
        <div className="bg-[#1c1917] border border-[#44403c] rounded-lg p-3">
          <div className="text-[#a8a29e] text-xs">Active Deals</div>
          <div className="text-lg font-bold text-[#fafaf9]">{metrics.dealCount}</div>
        </div>
      </div>

      {/* Stage Breakdown */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-[#a8a29e] uppercase tracking-wider mb-3">Stage Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2">
          {stageBreakdown.map((stage: any) => (
            <div key={stage.id} className="bg-[#1c1917] border border-[#44403c] rounded-lg p-3 text-center">
              <div className="text-xs text-[#a8a29e] mb-1">{stage.name}</div>
              <div className="text-lg font-bold text-[#fafaf9]">{stage.count}</div>
              <div className="text-xs text-[#78716c]">${stage.value.toLocaleString()}</div>
              <div className="w-full bg-[#292524] rounded-full h-1 mt-2">
                <div className="h-1 rounded-full" style={{ width: `${stage.probability}%`, backgroundColor: stage.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deals Table */}
      <div>
        <h2 className="text-sm font-semibold text-[#a8a29e] uppercase tracking-wider mb-3">Active Deals</h2>
        {deals.length === 0 ? (
          <div className="text-center text-[#78716c] py-8">
            <Users size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No deals yet. Add a lead and create a deal to start the pipeline.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {deals.map((deal: Deal) => {
              const stageDef = stages.find((s: StageDef) => s.id === deal.stage);
              return (
                <div key={deal.id} className="bg-[#1c1917] border border-[#44403c] rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <div className="font-medium text-[#fafaf9]">{deal.name}</div>
                    <div className="text-xs text-[#78716c]">
                      {deal.lead?.name || 'Unknown'} · {deal.lead?.company || ''} · {deal.lead?.source || ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#fafaf9]">${deal.value.toLocaleString()}</div>
                      <div className="text-xs text-[#78716c]">{deal.tier}</div>
                    </div>
                    <select
                      value={deal.stage}
                      onChange={e => handleStageChange(deal.id, e.target.value)}
                      className="bg-[#292524] border border-[#44403c] rounded-lg px-2 py-1 text-xs text-[#fafaf9]"
                    >
                      {stages.map((s: StageDef) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <div className="text-xs font-mono text-[#78716c] w-10 text-right">{deal.probability}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
