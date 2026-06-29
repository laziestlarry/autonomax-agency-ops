import React, { useState } from 'react';
import { 
  BookOpen, 
  GitBranch, 
  Zap, 
  Shield, 
  CheckCircle2,
  ArrowRight,
  Bot,
  Terminal,
  BarChart3,
  Target,
  Network,
  Play,
  RefreshCw
} from 'lucide-react';

interface ExecutionStep {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'idle' | 'active' | 'complete';
  description: string;
}

interface BotSpec {
  id: string;
  name: string;
  description: string;
  input: string;
  output: string;
  status: 'ready' | 'busy' | 'idle';
}

const executionSteps: ExecutionStep[] = [
  { id: 'sense', name: 'Sense', icon: <Target size={16} />, status: 'idle', description: 'Signal ingestion & market monitoring' },
  { id: 'plan', name: 'Plan', icon: <BarChart3 size={16} />, status: 'idle', description: 'Strategy building & playbook generation' },
  { id: 'approve', name: 'Approve', icon: <Shield size={16} />, status: 'idle', description: 'Director review & compliance gate' },
  { id: 'execute', name: 'Execute', icon: <Zap size={16} />, status: 'idle', description: 'Campaign deployment & bot orchestration' },
  { id: 'debrie', name: 'Debrief', icon: <BarChart3 size={16} />, status: 'idle', description: 'Performance review & KPI update' },
];

const botSpecs: BotSpec[] = [
  { id: 'b1', name: 'copy_bot', description: 'Generates ad copy, email sequences, and social posts', input: 'Campaign brief & target audience', output: 'Copy variants & headlines', status: 'ready' },
  { id: 'b2', name: 'mockup_bot', description: 'Creates UI mockups and product prototypes', input: 'Design requirements & brand assets', output: 'Mockup files & style guides', status: 'idle' },
  { id: 'b3', name: 'audit_bot', description: 'Performs codebase and infrastructure audits', input: 'Repository URL or project files', output: 'Audit report & recommendations', status: 'ready' },
  { id: 'b4', name: 'shopify_bot', description: 'Manages product listings, inventory, and orders', input: 'Product data & store credentials', output: 'Synced catalog & order updates', status: 'idle' },
  { id: 'b5', name: 'social_pack_bot', description: 'Creates social media content calendars and posts', input: 'Content strategy & platform list', output: 'Post schedule & visual assets', status: 'ready' },
  { id: 'b6', name: 'pricing_bot', description: 'Optimizes pricing strategies based on market data', input: 'Market data & cost structure', output: 'Pricing tiers & elasticity model', status: 'idle' },
  { id: 'b7', name: 'intelligence_bot', description: 'Scrapes market data and processes signals', input: 'Search query or data source', output: 'Market signals & opportunities', status: 'ready' },
];

export const AppBlueprint: React.FC = () => {
  const [steps, setSteps] = useState<ExecutionStep[]>(executionSteps);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeBot, setActiveBot] = useState<string | null>(null);

  const runExecution = async () => {
    setIsRunning(true);
    setLogs([]);

    for (let i = 0; i < steps.length; i++) {
      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'active' } : s
      ));
      setLogs(prev => [...prev, `[${new Date().toISOString()}] 🔄 ${steps[i].name}: ${steps[i].description}`]);

      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));

      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: 'complete' } : s
      ));
      setLogs(prev => [...prev, `[${new Date().toISOString()}] ✅ ${steps[i].name} complete`]);

      if (i === 3) {
        const bot = botSpecs[Math.floor(Math.random() * botSpecs.length)];
        setActiveBot(bot.id);
        setLogs(prev => [...prev, `[${new Date().toISOString()}] 🤖 ${bot.name} executing...`]);
        await new Promise(resolve => setTimeout(resolve, 500));
        setLogs(prev => [...prev, `[${new Date().toISOString()}] ✅ ${bot.name} finished`]);
        setActiveBot(null);
      }
    }

    setLogs(prev => [...prev, `[${new Date().toISOString()}] 🎉 Full Propulse Logic cycle complete!`]);
    setIsRunning(false);
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#fafaf9]">App Blueprint</h1>
          <p className="text-[#a8a29e] text-sm">Operational manual — Propulse Logic & Micro-Bot Roster</p>
        </div>
        <button 
          onClick={runExecution}
          disabled={isRunning}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#6F42C1] hover:bg-[#5a35a8] rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
        >
          {isRunning ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
          {isRunning ? 'Running...' : 'Run Propulse Cycle'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <GitBranch size={18} className="text-[#d97706]" />
              <span className="font-display font-semibold">Propulse Logic — Sense → Plan → Approve → Execute → Debrief</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border transition-all ${
                    step.status === 'complete' ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]' :
                    step.status === 'active' ? 'bg-[#d97706]/10 border-[#d97706]/30 text-[#d97706] animate-pulse' :
                    'bg-[#292524]/50 border-[#44403c]/50 text-[#78716c]'
                  }`}>
                    {step.icon}
                    <span className="text-sm font-medium">{step.name}</span>
                    {step.status === 'complete' && <CheckCircle2 size={14} className="text-[#10b981]" />}
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight size={14} className="text-[#44403c] flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Bot size={18} className="text-[#6F42C1]" />
              <span className="font-display font-semibold">Micro-Bot Roster</span>
              <span className="text-xs text-[#78716c] ml-auto">{botSpecs.length} deterministic bots</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {botSpecs.map((bot) => (
                <div 
                  key={bot.id}
                  className={`p-3 rounded-lg border transition-all ${
                    activeBot === bot.id ? 'border-[#d97706] bg-[#d97706]/5' :
                    bot.status === 'ready' ? 'border-[#10b981]/30 bg-[#10b981]/5' :
                    'border-[#44403c]/50 bg-[#292524]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot size={14} className={activeBot === bot.id ? 'text-[#d97706]' : 'text-[#6F42C1]'} />
                      <span className="text-sm font-medium text-[#fafaf9]">{bot.name}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      bot.status === 'ready' ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30' :
                      bot.status === 'busy' ? 'bg-[#d97706]/20 text-[#d97706] border-[#d97706]/30' :
                      'bg-[#78716c]/20 text-[#78716c] border-[#78716c]/30'
                    }`}>
                      {bot.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#78716c] mt-1">{bot.description}</p>
                  <div className="flex gap-3 mt-1.5 text-[10px] text-[#78716c]">
                    <span>Input: {bot.input}</span>
                    <span>→ Output: {bot.output}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Terminal size={16} className="text-[#6F42C1]" />
              <span className="font-display font-semibold text-sm">Execution Logs</span>
              <span className="text-[10px] text-[#78716c] ml-auto">live</span>
            </div>
            <div className="h-48 overflow-y-auto bg-[#0c0a09] rounded-lg p-3 border border-[#44403c] space-y-1 font-mono text-[11px]">
              {logs.length === 0 ? (
                <div className="text-[#78716c] text-center py-4">Run the Propulse cycle to see logs...</div>
              ) : (
                logs.map((log, i) => {
                  const isSuccess = log.includes('✅') || log.includes('🎉');
                  const isRunning = log.includes('🔄') || log.includes('🤖');
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
              <Network size={16} className="text-[#d97706]" />
              <span className="font-display font-semibold text-sm">Go-to-Market Channels</span>
            </div>
            <div className="space-y-2">
              {[
                { name: 'Shopify', status: 'Active' as const },
                { name: 'Fiverr', status: 'Active' as const },
                { name: 'YouTube', status: 'Ready' as const },
                { name: 'X.com', status: 'Active' as const },
                { name: 'LinkedIn', status: 'Active' as const },
              ].map((ch, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#292524]/50 border border-[#44403c]/50">
                  <span className="text-sm text-[#a8a29e]">{ch.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    ch.status === 'Active' ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30' :
                    'bg-[#d97706]/20 text-[#d97706] border border-[#d97706]/30'
                  }`}>{ch.status}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[#44403c]">
              <div className="flex items-center gap-2 text-xs text-[#78716c]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <span>Multi-channel deployment ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
