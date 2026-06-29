import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User,
  Calendar,
  Hash,
  Lock,
  Eye,
  Play,
  RefreshCw
} from 'lucide-react';

interface ApprovalItem {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestedAt: string;
  bot: string;
  approvedBy?: string;
  approvedAt?: string;
}

export const Governance: React.FC = () => {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    {
      id: 'a1',
      title: 'Deploy Shopify Integration',
      description: 'Push product listings to Shopify storefront with updated pricing',
      severity: 'high',
      status: 'pending',
      requestedBy: 'Commander Sarah',
      requestedAt: new Date(Date.now() - 3600000).toISOString(),
      bot: 'shopify_bot',
    },
    {
      id: 'a2',
      title: 'Launch Social Campaign',
      description: 'Execute scheduled social media content push across X and LinkedIn',
      severity: 'medium',
      status: 'pending',
      requestedBy: 'Commander Mike',
      requestedAt: new Date(Date.now() - 7200000).toISOString(),
      bot: 'social_pack_bot',
    },
    {
      id: 'a3',
      title: 'Update Pricing Model',
      description: 'Apply new pricing tiers to product catalog based on market analysis',
      severity: 'critical',
      status: 'pending',
      requestedBy: 'Commander Alex',
      requestedAt: new Date(Date.now() - 1800000).toISOString(),
      bot: 'pricing_bot',
    },
    {
      id: 'a4',
      title: 'Database Migration',
      description: 'Schema update for user analytics tracking',
      severity: 'critical',
      status: 'approved',
      requestedBy: 'Commander Jordan',
      requestedAt: new Date(Date.now() - 86400000).toISOString(),
      bot: 'audit_bot',
      approvedBy: 'Director Elena',
      approvedAt: new Date(Date.now() - 43200000).toISOString(),
    },
  ]);

  const [isAuthorizing, setIsAuthorizing] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const handleAuthorize = async (id: string) => {
    setIsAuthorizing(id);
    setLogs(prev => [...prev, `[${new Date().toISOString()}] 🔐 Director: Reviewing "${approvals.find(a => a.id === id)?.title}"...`]);

    await new Promise(resolve => setTimeout(resolve, 1200));

    setApprovals(prev => prev.map(a => 
      a.id === id 
        ? { ...a, status: 'approved', approvedBy: 'Director', approvedAt: new Date().toISOString() }
        : a
    ));

    setLogs(prev => [...prev, `[${new Date().toISOString()}] ✅ Authorized: ${approvals.find(a => a.id === id)?.title}`]);
    setIsAuthorizing(null);
  };

  const handleReject = async (id: string) => {
    setIsAuthorizing(id);
    setLogs(prev => [...prev, `[${new Date().toISOString()}] ⛔ Director: Rejecting "${approvals.find(a => a.id === id)?.title}"...`]);

    await new Promise(resolve => setTimeout(resolve, 800));

    setApprovals(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'rejected' } : a
    ));

    setLogs(prev => [...prev, `[${new Date().toISOString()}] ❌ Rejected: ${approvals.find(a => a.id === id)?.title}`]);
    setIsAuthorizing(null);
  };

  const getSeverityColor = (severity: ApprovalItem['severity']) => {
    const colors = {
      low: 'bg-[#78716c]/20 text-[#78716c] border-[#78716c]/30',
      medium: 'bg-[#d97706]/20 text-[#d97706] border-[#d97706]/30',
      high: 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30',
      critical: 'bg-[#b91c1c]/20 text-[#ef4444] border-[#ef4444]/40',
    };
    return colors[severity];
  };

  const pendingCount = approvals.filter(a => a.status === 'pending').length;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#fafaf9]">Governance</h1>
          <p className="text-[#a8a29e] text-sm">Compliance Guardian & Human-in-the-loop Approval Gates</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#292524] border border-[#44403c]">
            <Shield size={14} className="text-[#6F42C1]" />
            <span className="text-xs font-medium text-[#a8a29e]">Pending: <span className="text-[#d97706]">{pendingCount}</span></span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30">
            <Lock size={14} className="text-[#10b981]" />
            <span className="text-xs font-medium text-[#10b981]">Director Mode</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-[#d97706]" />
              <span className="font-display font-semibold">Approval Gates</span>
              <span className="text-xs text-[#78716c] ml-auto">Director authorization required</span>
            </div>
            <div className="space-y-3">
              {approvals.map((item) => (
                <div 
                  key={item.id}
                  className={`p-4 rounded-lg border ${
                    item.status === 'pending' ? 'bg-[#292524]/30 border-[#44403c]/50' :
                    item.status === 'approved' ? 'bg-[#10b981]/5 border-[#10b981]/20' :
                    'bg-[#ef4444]/5 border-[#ef4444]/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#fafaf9] text-sm">{item.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getSeverityColor(item.severity)}`}>
                          {item.severity}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          item.status === 'pending' ? 'bg-[#d97706]/20 text-[#d97706] border-[#d97706]/30' :
                          item.status === 'approved' ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30' :
                          'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#78716c] mt-1">{item.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-[#78716c]">
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {item.requestedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(item.requestedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Hash size={12} />
                          {item.bot}
                        </span>
                      </div>
                      {item.approvedBy && (
                        <div className="mt-1 text-xs text-[#10b981]">
                          ✅ Approved by {item.approvedBy} at {new Date(item.approvedAt!).toLocaleString()}
                        </div>
                      )}
                    </div>
                    {item.status === 'pending' && (
                      <div className="flex gap-2 ml-4 flex-shrink-0">
                        <button
                          onClick={() => handleReject(item.id)}
                          disabled={isAuthorizing === item.id}
                          className="px-3 py-1.5 bg-[#292524] hover:bg-[#44403c] border border-[#44403c] rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAuthorize(item.id)}
                          disabled={isAuthorizing === item.id}
                          className="px-3 py-1.5 bg-[#d97706] hover:bg-[#b86505] rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {isAuthorizing === item.id ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
                          Authorize
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Eye size={16} className="text-[#6F42C1]" />
              <span className="font-display font-semibold text-sm">Audit Trail</span>
              <span className="text-[10px] text-[#78716c] ml-auto">live</span>
            </div>
            <div className="h-48 overflow-y-auto bg-[#0c0a09] rounded-lg p-3 border border-[#44403c] space-y-1 font-mono text-[11px]">
              {logs.length === 0 ? (
                <div className="text-[#78716c] text-center py-4">No audit events yet</div>
              ) : (
                logs.map((log, i) => {
                  const isSuccess = log.includes('✅') || log.includes('🔐');
                  const isError = log.includes('❌') || log.includes('⛔');
                  return (
                    <div key={i} className={`log-line ${isSuccess ? 'level-success' : isError ? 'level-error' : ''}`}>
                      {log}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-[#d97706]" />
              <span className="font-display font-semibold text-sm">Compliance Overview</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#78716c]">Total Requests</span>
                <span className="text-[#fafaf9]">{approvals.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716c]">Pending</span>
                <span className="text-[#d97706]">{pendingCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716c]">Approved</span>
                <span className="text-[#10b981]">{approvals.filter(a => a.status === 'approved').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716c]">Rejected</span>
                <span className="text-[#ef4444]">{approvals.filter(a => a.status === 'rejected').length}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#44403c]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-xs text-[#78716c]">Compliance gate active — all sensitive actions require Director approval</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
