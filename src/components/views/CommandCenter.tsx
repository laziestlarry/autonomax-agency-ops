import React, { useState } from 'react';
import { 
  Zap, 
  RefreshCw,
  BarChart3,
  DollarSign,
  Target,
  Activity,
  Shield,
  Play
} from 'lucide-react';

interface PipelineStage {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  progress: number;
  logs: string[];
}

interface ConversionPhase {
  id: string;
  name: string;
  channel: string;
  status: 'active' | 'paused' | 'completed';
  leads: number;
  conversions: number;
  rate: number;
}

export const CommandCenter: React.FC = () => {
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([
    { id: '1', name: 'Activation', status: 'idle', progress: 0, logs: [] },
    { id: '2', name: 'Structure', status: 'idle', progress: 0, logs: [] },
    { id: '3', name: 'Command', status: 'idle', progress: 0, logs: [] },
  ]);

  const [conversionPhases] = useState<ConversionPhase[]>([
    { id: 'c1', name: 'SaaS Founder Audit', channel: 'LinkedIn', status: 'active', leads: 124, conversions: 28, rate: 22.6 },
    { id: 'c2', name: 'Zero-Ad Sales', channel: 'X.com', status: 'active', leads: 86, conversions: 19, rate: 22.1 },
    { id: 'c3', name: 'Storefront Syndication', channel: 'Shopify', status: 'paused', leads: 42, conversions: 8, rate: 19.0 },
    { id: 'c4', name: 'Creator Alignments', channel: 'YouTube', status: 'active', leads: 67, conversions: 12, rate: 17.9 },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const runPipeline = async () => {
    setIsRunning(true);
    setLogs([]);

    for (let i = 0; i < pipelineStages.length; i++) {
      setPipelineStages(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'running', progress: 0 } : s
      ));
      setLogs(prev => [...prev, `[${new Date().toISOString()}] ▶️ Starting ${pipelineStages[i].name} phase...`]);

      for (let p = 0; p <= 100; p += 10 + Math.floor(Math.random() * 15)) {
        setPipelineStages(prev => prev.map((s, idx) => 
          idx === i ? { ...s, progress: Math.min(p, 100) } : s
        ));
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setPipelineStages(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'success', progress: 100 } : s
      ));
      setLogs(prev => [...prev, `[${new Date().toISOString()}] ✅ ${pipelineStages[i].name} complete`]);
    }

    setLogs(prev => [...prev, `[${new Date().toISOString()}] 🎉 Full pipeline execution complete!`]);
    setIsRunning(false);
  };

  const getStatusBadge = (status: PipelineStage['status']) => {
    const config = {
      idle: { color: 'bg-[#78716c]/20 text-[#78716c] border-[#78716c]/30', label: 'Idle' },
      running: { color: 'bg-[#d97706]/20 text-[#d97706] border-[#d97706]/30', label: 'Running' },
      success: { color: 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30', label: 'Complete' },
      failed: { color: 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30', label: 'Failed' },
    };
    return config[status] || config.idle;
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#fafaf9]">Command Center</h1>
          <p className="text-[#a8a29e] text-sm">Agency Core — Sales acquisition & pipeline orchestration</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-[#78716c]">EBITDA Potential</div>
            <div className="font-display text-xl font-bold text-[#10b981]">$38,600</div>
          </div>
          <button 
            onClick={runPipeline}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#d97706] hover:bg-[#b86505] rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
          >
            {isRunning ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
            {isRunning ? 'Executing...' : 'Run Golden Delivery'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={18} className="text-[#6F42C1]" />
              <span className="font-display font-semibold">Golden Delivery Pipeline</span>
              <span className="text-xs text-[#78716c] ml-auto">Activation → Structure → Command</span>
            </div>
            <div className="space-y-4">
              {pipelineStages.map((stage) => {
                const badge = getStatusBadge(stage.status);
                return (
                  <div key={stage.id} className="p-3 rounded-lg bg-[#292524]/30 border border-[#44403c]/40">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#fafaf9]">{stage.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <span className="text-xs text-[#78716c]">{stage.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#292524] overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          stage.status === 'success' ? 'bg-[#10b981]' :
                          stage.status === 'running' ? 'bg-[#d97706]' :
                          'bg-[#44403c]'
                        }`}
                        style={{ width: `${stage.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Target size={18} className="text-[#d97706]" />
              <span className="font-display font-semibold">Outbound Conversion Campaigns</span>
              <span className="text-xs text-[#78716c] ml-auto">live channels</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {conversionPhases.map((phase) => (
                <div key={phase.id} className="p-3 rounded-lg bg-[#292524]/30 border border-[#44403c]/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#fafaf9]">{phase.name}</p>
                      <p className="text-xs text-[#78716c]">{phase.channel}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      phase.status === 'active' 
                        ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30' 
                        : 'bg-[#78716c]/20 text-[#78716c] border-[#78716c]/30'
                    }`}>
                      {phase.status}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-[#78716c]">Leads: <span className="text-[#fafaf9] font-medium">{phase.leads}</span></span>
                    <span className="text-[#78716c]">Conv: <span className="text-[#fafaf9] font-medium">{phase.conversions}</span></span>
                    <span className="text-[#78716c]">Rate: <span className="text-[#d97706] font-medium">{phase.rate}%</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={16} className="text-[#6F42C1]" />
              <span className="font-display font-semibold text-sm">Execution Console</span>
              <span className="text-[10px] text-[#78716c] ml-auto">live</span>
            </div>
            <div className="h-64 overflow-y-auto bg-[#0c0a09] rounded-lg p-3 border border-[#44403c] space-y-1 font-mono text-[11px]">
              {logs.length === 0 ? (
                <div className="text-[#78716c] text-center py-4">Awaiting pipeline execution...</div>
              ) : (
                logs.map((log, i) => {
                  const isSuccess = log.includes('✅') || log.includes('🎉');
                  const isRunning = log.includes('▶️');
                  return (
                    <div key={i} className={`log-line ${isSuccess ? 'level-success' : isRunning ? 'level-info' : ''}`}>
                      {log}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 size={16} className="text-[#d97706]" />
              <span className="font-display font-semibold text-sm">System Health</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#78716c]">Pipeline Status</span>
                <span className={isRunning ? 'text-[#d97706]' : 'text-[#10b981]'}>
                  {isRunning ? 'Running' : 'Ready'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#78716c]">Active Campaigns</span>
                <span className="text-[#fafaf9]">{conversionPhases.filter(p => p.status === 'active').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#78716c]">Total Leads</span>
                <span className="text-[#fafaf9]">{conversionPhases.reduce((acc, p) => acc + p.leads, 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#78716c]">Avg Conversion</span>
                <span className="text-[#d97706]">{(conversionPhases.reduce((acc, p) => acc + p.rate, 0) / conversionPhases.length).toFixed(1)}%</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#44403c] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-xs text-[#78716c]">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
