import React, { useState } from 'react';
import { 
  Code2, 
  GitBranch, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileCode,
  Download,
  Share2,
  Users
} from 'lucide-react';

interface Step {
  id: string;
  label: string;
  status: 'idle' | 'active' | 'complete' | 'error';
  description: string;
}

export const Synthesis: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<Step[]>([
    { id: '1', label: 'Repository Intake', status: 'idle', description: 'Fetching and parsing codebase...' },
    { id: '2', label: 'AST Analysis', status: 'idle', description: 'Abstract syntax tree parsing...' },
    { id: '3', label: 'Feature Extraction', status: 'idle', description: 'Identifying core capabilities...' },
    { id: '4', label: 'Valuation & Scoring', status: 'idle', description: 'Calculating demand & resilience...' },
    { id: '5', label: 'Product Proposition', status: 'idle', description: 'Generating human-readable assets...' },
    { id: '6', label: 'GTM Artifact Generation', status: 'idle', description: 'Building marketing collateral...' },
  ]);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<{
    name: string;
    score: number;
    strategies: string[];
    communities: string[];
  } | null>(null);

  const simulateStep = async (stepIndex: number) => {
    setSteps(prev => prev.map((s, i) => 
      i === stepIndex ? { ...s, status: 'active' } : s
    ));
    setLogs(prev => [...prev, `[${new Date().toISOString()}] 🔄 ${steps[stepIndex].label}...`]);
    
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));
    
    setSteps(prev => prev.map((s, i) => 
      i === stepIndex ? { ...s, status: 'complete' } : s
    ));
    setLogs(prev => [...prev, `[${new Date().toISOString()}] ✅ ${steps[stepIndex].label} complete`]);
  };

  const handleProcess = async () => {
    if (!repoUrl.trim()) return;
    setIsProcessing(true);
    setLogs([]);
    setResult(null);

    setSteps(prev => prev.map(s => ({ ...s, status: 'idle' })));

    for (let i = 0; i < steps.length; i++) {
      await simulateStep(i);
    }

    const name = repoUrl.split('/').pop() || 'Unknown Project';
    setResult({
      name,
      score: 76 + Math.floor(Math.random() * 20),
      strategies: [
        'SaaS Subscription Model',
        'White-Label API Licensing',
        'Consulting & Implementation',
      ],
      communities: [
        'SaaS Founders Alliance (92% match)',
        'Open Source Contributors Network (85% match)',
        'Tech Entrepreneur Collective (78% match)',
      ],
    });

    setLogs(prev => [...prev, `[${new Date().toISOString()}] 🎉 Synthesis complete! Asset ready for monetization.`]);
    setIsProcessing(false);
  };

  const getStepIcon = (status: Step['status']) => {
    if (status === 'complete') return <CheckCircle2 size={16} className="text-[#10b981]" />;
    if (status === 'active') return <RefreshCw size={16} className="text-[#d97706] animate-spin" />;
    if (status === 'error') return <AlertCircle size={16} className="text-[#ef4444]" />;
    return <Clock size={16} className="text-[#78716c]" />;
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#fafaf9]">Creator Hub</h1>
        <p className="text-[#a8a29e] text-sm">Synthesize codebases into human-readable product propositions</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-[#6F42C1]/20 text-[#a78bfa]">
            <GitBranch size={18} />
          </div>
          <span className="font-display font-semibold text-[#fafaf9]">Repository Intake</span>
          <span className="text-xs text-[#78716c] ml-auto">GitHub URL or project description</span>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repo or describe your project..."
            className="flex-1 bg-[#292524] border border-[#44403c] rounded-lg px-4 py-2.5 text-[#fafaf9] placeholder:text-[#78716c] focus:border-[#6F42C1] focus:ring-1 focus:ring-[#6F42C1]/30 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
          />
          <button 
            onClick={handleProcess}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-[#6F42C1] hover:bg-[#5a35a8] rounded-lg font-medium text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Upload size={16} />}
            {isProcessing ? 'Synthesizing...' : 'Synthesize'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Code2 size={18} className="text-[#6F42C1]" />
              <span className="font-display font-semibold">Synthesis Pipeline</span>
              <span className="text-xs text-[#78716c] ml-auto">{steps.filter(s => s.status === 'complete').length}/{steps.length} complete</span>
            </div>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#292524]/30 border border-[#44403c]/40">
                  <div className="w-7 h-7 rounded-full bg-[#292524] flex items-center justify-center border border-[#44403c] flex-shrink-0">
                    {getStepIcon(step.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        step.status === 'complete' ? 'text-[#10b981]' : 
                        step.status === 'active' ? 'text-[#d97706]' : 
                        'text-[#78716c]'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#78716c] truncate">{step.description}</p>
                  </div>
                  {step.status === 'complete' && (
                    <CheckCircle2 size={16} className="text-[#10b981] flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 h-1.5 rounded-full bg-[#292524] overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#6F42C1] to-[#d97706] transition-all duration-500"
                style={{ width: `${(steps.filter(s => s.status === 'complete').length / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {result && (
            <div className="card border-[#6F42C1]/30">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={18} className="text-[#10b981]" />
                <span className="font-display font-semibold text-[#fafaf9]">Asset Ready for Monetization</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#78716c]">Project</p>
                  <p className="font-medium text-[#fafaf9] text-sm truncate">{result.name}</p>
                </div>
                <div>
                  <p className="text-xs text-[#78716c]">Valuation Score</p>
                  <p className="font-display text-xl font-bold text-[#d97706]">{result.score}/100</p>
                </div>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-[#292524] border border-[#44403c]">
                <p className="text-xs text-[#78716c] mb-1">Strategic Paths</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.strategies.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-[#4C2882]/30 text-[#a78bfa] border border-[#4C2882]/40">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-[#292524] border border-[#44403c]">
                <p className="text-xs text-[#78716c] mb-1">Community Matches</p>
                <div className="space-y-1">
                  {result.communities.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#a8a29e]">
                      <Users size={12} className="text-[#6F42C1]" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#6F42C1] hover:bg-[#5a35a8] rounded-lg text-sm font-medium transition-colors">
                  <Download size={16} />
                  Export Report
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#d97706] hover:bg-[#b86505] rounded-lg text-sm font-medium transition-colors">
                  <Share2 size={16} />
                  Share Asset
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card h-full">
            <div className="flex items-center gap-2 mb-3">
              <FileCode size={16} className="text-[#6F42C1]" />
              <span className="font-display font-semibold text-sm">System Logs</span>
              <span className="text-[10px] text-[#78716c] ml-auto">live</span>
            </div>
            <div className="h-64 overflow-y-auto bg-[#0c0a09] rounded-lg p-3 border border-[#44403c] space-y-1 font-mono text-[11px]">
              {logs.length === 0 ? (
                <div className="text-[#78716c] text-center py-4">Awaiting synthesis...</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="log-line text-[#a8a29e]">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
