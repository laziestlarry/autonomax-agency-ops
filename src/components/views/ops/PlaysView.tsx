import React, { useState, useEffect } from 'react';
import { Target, Zap, Linkedin, Twitter, Play, Plus, BarChart3, CheckCircle, Clock, TrendingUp, DollarSign, Users, ExternalLink, MessageCircle, Eye, MousePointer } from 'lucide-react';

type Play = {
  id: string;
  name: string;
  description: string;
  channel: string;
  icon: string;
  active: boolean;
};

type Campaign = {
  id: string;
  playId: string;
  name: string;
  channel: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  metrics: { impressions: number; clicks: number; leads: number; deals: number; revenue: number };
  content?: string;
  steps: Array<{ id: string; day: number; title: string; content: string; status: 'pending' | 'done' | 'skipped'; completedAt?: string }>;
};

const ICONS: Record<string, React.ElementType> = {
  target: Target, zap: Zap, handshake: Users,
  linkedin: Linkedin, twitter: Twitter,
};

const CHANNEL_COLORS: Record<string, string> = {
  'LinkedIn': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'X.com': 'bg-slate-500/10 text-slate-300 border-slate-500/20',
  'Instagram / X.com / Personal Network': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  'Partner Ecosystems': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Multi-channel': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
};

export const PlaysView: React.FC = () => {
  const [plays, setPlays] = useState<Play[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [aiStatus, setAiStatus] = useState<any>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [tab, setTab] = useState<'plays' | 'campaigns' | 'analytics'>('plays');

  useEffect(() => {
    fetchPlays();
    fetchCampaigns();
    fetchAnalytics();
    fetchAiStatus();
  }, []);

  const fetchPlays = async () => {
    try {
      const res = await fetch('/ops/plays');
      const data = await res.json();
      setPlays(data.plays);
      setAiStatus({ available: data.ai_available, provider: data.ai_provider });
    } catch { /* ignore */ }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/ops/plays/campaigns');
      const data = await res.json();
      setCampaigns(data.campaigns);
    } catch { /* ignore */ }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/ops/plays/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch { /* ignore */ }
  };

  const fetchAiStatus = async () => {
    try {
      const res = await fetch('/ops/ai/status');
      const data = await res.json();
      setAiStatus(data);
    } catch { /* ignore */ }
  };

  const generateCampaign = async (playId: string) => {
    setGenerating(playId);
    try {
      const res = await fetch('/ops/plays/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playId }),
      });
      const data = await res.json();
      await fetchCampaigns();
      await fetchAnalytics();
      setSelectedCampaign(data.campaign.id);
      setTab('campaigns');
    } catch (err) {
      console.error('Failed to generate campaign:', err);
    }
    setGenerating(null);
  };

  const startCampaign = async (campaignId: string) => {
    await fetch(`/ops/plays/campaigns/${campaignId}/start`, { method: 'POST' });
    await fetchCampaigns();
  };

  const completeStep = async (campaignId: string, stepId: string) => {
    await fetch(`/ops/plays/campaigns/${campaignId}/step/${stepId}/complete`, { method: 'POST' });
    await fetchCampaigns();
  };

  const selectedCampaignData = campaigns.find(c => c.id === selectedCampaign);

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#fafaf9]">GTM Plays</h1>
          <p className="text-sm text-[#a8a29e] mt-1">
            AI-powered Go-To-Market campaigns — generate, track, and optimize
          </p>
        </div>
        {aiStatus && (
          <div className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
            aiStatus.available
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {aiStatus.available ? `🧠 ${aiStatus.label}` : '⚙️ Simulation mode'}
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-[#1c1917] rounded-lg p-1 border border-[#44403c] w-fit">
        {[
          { id: 'plays', label: 'Play Templates', icon: Target },
          { id: 'campaigns', label: 'Active Campaigns', icon: Play },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                tab === t.id ? 'bg-[#6F42C1] text-white' : 'text-[#a8a29e] hover:text-[#fafaf9]'
              }`}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'plays' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {plays.map(play => {
            const Icon = ICONS[play.icon] || Target;
            const channelColor = CHANNEL_COLORS[play.channel] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
            return (
              <div key={play.id} className="card card-hover group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#292524] flex items-center justify-center">
                    <Icon size={20} className="text-[#6F42C1]" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${channelColor}`}>
                    {play.channel.split(' / ')[0]}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-[#fafaf9] mb-1">{play.name}</h3>
                <p className="text-xs text-[#a8a29e] mb-4 line-clamp-2">{play.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#78716c]">{play.channel}</span>
                  <button onClick={() => generateCampaign(play.id)} disabled={generating === play.id}
                    className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
                  >
                    {generating === play.id ? (
                      <>Generating...</>
                    ) : (
                      <><Plus size={14} /> Generate Campaign</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'campaigns' && (
        <div className="flex gap-6 flex-1 min-h-0">
          {/* Campaign list */}
          <div className="w-80 flex-shrink-0 space-y-2 overflow-y-auto">
            {campaigns.length === 0 && (
              <div className="card text-center py-12">
                <Target size={40} className="mx-auto text-[#44403c] mb-3" />
                <p className="text-sm text-[#a8a29e]">No campaigns yet</p>
                <p className="text-xs text-[#78716c] mt-1">Generate a campaign from a play template</p>
              </div>
            )}
            {campaigns.map(c => (
              <div key={c.id} onClick={() => setSelectedCampaign(c.id)}
                className={`card cursor-pointer transition-all ${
                  selectedCampaign === c.id ? 'border-[#6F42C1] ring-1 ring-[#6F42C1]/30' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-[#fafaf9]">{c.name}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                    c.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
                    c.status === 'paused' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-gray-500/10 text-gray-400'
                  }`}>{c.status}</span>
                </div>
                <p className="text-[10px] text-[#78716c]">{c.channel}</p>
                {c.metrics.leads > 0 && (
                  <div className="flex gap-3 mt-2 text-[10px] text-[#a8a29e]">
                    <span>👁 {c.metrics.impressions}</span>
                    <span>🖱 {c.metrics.clicks}</span>
                    <span>👤 {c.metrics.leads}</span>
                    {c.metrics.revenue > 0 && <span className="text-emerald-400">${c.metrics.revenue}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Campaign detail */}
          <div className="flex-1 overflow-y-auto">
            {selectedCampaignData ? (
              <div className="space-y-4">
                {/* Campaign header */}
                <div className="card">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-lg font-display font-semibold text-[#fafaf9]">{selectedCampaignData.name}</h2>
                      <p className="text-xs text-[#a8a29e] mt-0.5">{selectedCampaignData.channel}</p>
                    </div>
                    <div className="flex gap-2">
                      {selectedCampaignData.status === 'draft' && (
                        <button onClick={() => startCampaign(selectedCampaignData.id)} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
                          <Play size={14} /> Launch Campaign
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Metrics */}
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { label: 'Impressions', value: selectedCampaignData.metrics.impressions, icon: Eye, color: 'text-blue-400' },
                      { label: 'Clicks', value: selectedCampaignData.metrics.clicks, icon: MousePointer, color: 'text-violet-400' },
                      { label: 'Leads', value: selectedCampaignData.metrics.leads, icon: Users, color: 'text-emerald-400' },
                      { label: 'Deals', value: selectedCampaignData.metrics.deals, icon: DollarSign, color: 'text-amber-400' },
                      { label: 'Revenue', value: `$${selectedCampaignData.metrics.revenue}`, icon: TrendingUp, color: 'text-emerald-400' },
                    ].map(m => {
                      const Icon = m.icon;
                      return (
                        <div key={m.label} className="text-center p-2 rounded-lg bg-[#292524]/50">
                          <Icon size={16} className={`mx-auto mb-1 ${m.color}`} />
                          <div className="text-lg font-display font-bold text-[#fafaf9]">{m.value}</div>
                          <div className="text-[10px] text-[#78716c]">{m.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Steps / Timeline */}
                <div className="card">
                  <h3 className="section-title mb-4">Campaign Timeline</h3>
                  <div className="space-y-2">
                    {selectedCampaignData.steps.map((step, i) => (
                      <div key={step.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        step.status === 'done' ? 'bg-emerald-500/5 border-emerald-500/20' :
                        step.status === 'skipped' ? 'bg-gray-500/5 border-gray-500/20 opacity-50' :
                        'bg-[#292524]/30 border-[#44403c]'
                      }`}>
                        {/* Step number */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          step.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' :
                          'bg-[#292524] text-[#78716c]'
                        }`}>
                          {step.status === 'done' ? <CheckCircle size={16} /> : step.day}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-[#fafaf9]">{step.title}</span>
                            {step.status === 'done' && step.completedAt && (
                              <span className="text-[10px] text-[#78716c]">
                                <Clock size={10} className="inline mr-0.5" />
                                {new Date(step.completedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#a8a29e] mt-0.5 line-clamp-2">{step.content}</p>
                        </div>

                        {/* Action */}
                        {selectedCampaignData.status === 'active' && step.status === 'pending' && (
                          <button onClick={() => completeStep(selectedCampaignData.id, step.id)}
                            className="text-[10px] px-2.5 py-1 rounded-md bg-[#292524] text-[#a8a29e] hover:bg-[#6F42C1]/20 hover:text-[#a78bfa] transition-all flex-shrink-0"
                          >
                            Mark Done
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generated content */}
                {selectedCampaignData.content && (
                  <div className="card">
                    <h3 className="section-title mb-3">Generated Strategy</h3>
                    <div className="text-sm text-[#a8a29e] whitespace-pre-wrap font-mono text-xs leading-relaxed">
                      {selectedCampaignData.content}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card text-center py-16">
                <Target size={48} className="mx-auto text-[#44403c] mb-4" />
                <p className="text-[#a8a29e]">Select a campaign to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'analytics' && analytics && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Total Campaigns', value: analytics.campaigns, icon: Play, color: 'text-blue-400' },
              { label: 'Active', value: analytics.activeCampaigns, icon: Zap, color: 'text-emerald-400' },
              { label: 'Completed', value: analytics.completedCampaigns, icon: CheckCircle, color: 'text-violet-400' },
              { label: 'Total Leads', value: analytics.metrics.leads, icon: Users, color: 'text-amber-400' },
              { label: 'Revenue', value: `$${analytics.metrics.revenue}`, icon: TrendingUp, color: 'text-emerald-400' },
            ].map(m => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="card text-center">
                  <Icon size={20} className={`mx-auto mb-2 ${m.color}`} />
                  <div className="stat-value text-xl">{m.value}</div>
                  <div className="stat-label">{m.label}</div>
                </div>
              );
            })}
          </div>

          {/* Funnel metrics */}
          <div className="card">
            <h3 className="section-title mb-4">Conversion Funnel</h3>
            <div className="space-y-3">
              {[
                { label: 'Impressions → Clicks', from: analytics.metrics.impressions, to: analytics.metrics.clicks, rate: analytics.metrics.impressions > 0 ? ((analytics.metrics.clicks / analytics.metrics.impressions) * 100).toFixed(1) : '0.0' },
                { label: 'Clicks → Leads', from: analytics.metrics.clicks, to: analytics.metrics.leads, rate: analytics.metrics.clicks > 0 ? ((analytics.metrics.leads / analytics.metrics.clicks) * 100).toFixed(1) : '0.0' },
                { label: 'Leads → Deals', from: analytics.metrics.leads, to: analytics.metrics.deals, rate: analytics.metrics.deals > 0 ? ((analytics.metrics.deals / analytics.metrics.leads) * 100).toFixed(1) : '0.0' },
              ].map((f, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#a8a29e]">{f.label}</span>
                    <span className="text-[#fafaf9] font-medium">{f.rate}%</span>
                  </div>
                  <div className="h-2 bg-[#292524] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#6F42C1] to-[#a78bfa] transition-all"
                      style={{ width: `${Math.min(parseFloat(f.rate) * 5, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#78716c] mt-0.5">
                    <span>{f.from} → {f.to}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion rate highlight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card text-center">
              <div className="text-3xl font-display font-bold text-[#a78bfa]">{analytics.conversionRate}%</div>
              <div className="stat-label mt-1">Overall Conversion Rate</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-display font-bold text-[#34d399]">{analytics.dealRate}%</div>
              <div className="stat-label mt-1">Lead → Deal Rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaysView;
