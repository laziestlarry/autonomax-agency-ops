import React, { useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  BarChart3, 
  Zap, 
  Search, 
  RefreshCw,
  ChevronRight,
  Activity
} from 'lucide-react';
import { SentimentChart } from './SentimentChart';
import { microBotRoster } from '../../agents/MicroBotRoster';

interface Opportunity {
  id: string;
  title: string;
  sector: string;
  confidence: number;
  potential: 'high' | 'medium' | 'low';
  signal: string;
  valency: number;
}

export const Intelligence: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [query, setQuery] = useState('');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    { id: '1', title: 'AI-Powered Dev Tooling Suite', sector: 'AI Dev Tools', confidence: 92, potential: 'high', signal: 'Strong growth in autonomous agent adoption', valency: 4.8 },
    { id: '2', title: 'Micro-SaaS for Remote Teams', sector: 'Micro-SaaS', confidence: 88, potential: 'high', signal: 'Rising demand for no-code workflow automation', valency: 4.5 },
    { id: '3', title: 'FinTech Lending Platform', sector: 'FinTech', confidence: 76, potential: 'medium', signal: 'Increasing SME lending gaps', valency: 3.9 },
    { id: '4', title: 'HealthTech Patient Engagement', sector: 'HealthTech', confidence: 82, potential: 'high', signal: 'Telehealth integration accelerating', valency: 4.2 },
    { id: '5', title: 'GreenTech Supply Chain', sector: 'GreenTech', confidence: 79, potential: 'medium', signal: 'ESG compliance driving demand', valency: 4.0 },
  ]);
  const [botLogs, setBotLogs] = useState<string[]>([]);
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [advisoryQuery, setAdvisoryQuery] = useState('');
  const [advisoryResponse, setAdvisoryResponse] = useState('');

  const handleSense = async () => {
    if (!query.trim()) return;
    setIsAnalyzing(true);
    setBotLogs([]);

    try {
      const result = await microBotRoster.runBot('intelligence_bot', { query });
      setBotLogs(result.logs);

      const newOpps: Opportunity[] = [
        { id: Date.now().toString(), title: `Market Signal: ${query.slice(0, 30)}...`, sector: 'Emerging', confidence: 73, potential: 'medium', signal: 'Detected from market analysis', valency: 3.6 },
        { id: (Date.now() + 1).toString(), title: 'Adjacent Opportunity Found', sector: 'Tech', confidence: 68, potential: 'low', signal: 'Related sector overlap identified', valency: 3.2 },
      ];
      setOpportunities(prev => [...prev, ...newOpps]);
    } catch (error) {
      console.error('Intelligence bot error:', error);
    }

    setIsAnalyzing(false);
  };

  const handleAdvisoryQuery = async () => {
    if (!advisoryQuery.trim()) return;
    setAdvisoryResponse('Analyzing strategic implications...');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAdvisoryResponse(
        `Strategic Advisory: Based on current market signals, the ${advisoryQuery} sector shows strong momentum with an estimated CAGR of 24%. \n\nRecommendation: Enter via a targeted diagnostic offer at $497 to capture early adopters, then upsell to activation at $2,497. \n\nRisk: Moderate — competitor density is increasing but differentiation is achievable through specialized vertical focus.`
      );
    } catch (error) {
      setAdvisoryResponse('Error processing advisory request. Please try again.');
    }
  };

  const runIntelligenceBot = async () => {
    setIsBotRunning(true);
    setBotLogs([]);
    try {
      const result = await microBotRoster.runBot('intelligence_bot');
      setBotLogs(result.logs);
    } catch (error) {
      console.error('Bot error:', error);
    }
    setIsBotRunning(false);
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#fafaf9]">Market Intelligence</h1>
          <p className="text-[#a8a29e] text-sm">AI-powered opportunity discovery & trend analysis</p>
        </div>
        <button 
          onClick={runIntelligenceBot}
          disabled={isBotRunning}
          className="flex items-center gap-2 px-4 py-2 bg-[#6F42C1] hover:bg-[#5a35a8] rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={isBotRunning ? 'animate-spin' : ''} />
          {isBotRunning ? 'Scraping...' : 'Run Intelligence'}
        </button>
      </div>

      {/* Sense Input */}
      <div className="card">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-[#6F42C1]/20 text-[#a78bfa]">
            <Brain size={18} />
          </div>
          <span className="font-display font-semibold text-[#fafaf9]">Sense Phase</span>
          <span className="text-xs text-[#78716c] ml-auto">Signal ingestion</span>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Paste GitHub URL, market trend, or product idea..."
            className="flex-1 bg-[#292524] border border-[#44403c] rounded-lg px-4 py-2.5 text-[#fafaf9] placeholder:text-[#78716c] focus:border-[#6F42C1] focus:ring-1 focus:ring-[#6F42C1]/30 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleSense()}
          />
          <button 
            onClick={handleSense}
            disabled={isAnalyzing}
            className="px-5 py-2.5 bg-[#d97706] hover:bg-[#b86505] rounded-lg font-medium text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isAnalyzing ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
            {isAnalyzing ? 'Analyzing...' : 'Sense'}
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Opportunities - 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-[#d97706]" />
                <span className="font-display font-semibold">Detected Ventures (BizOp Navigator)</span>
              </div>
              <span className="text-xs text-[#78716c]">{opportunities.length} opportunities</span>
            </div>
            <div className="space-y-3">
              {opportunities.map((opp) => (
                <div key={opp.id} className="flex items-center justify-between p-3 rounded-lg bg-[#292524]/50 border border-[#44403c]/50 hover:border-[#6F42C1]/30 transition-all group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#fafaf9] text-sm truncate">{opp.title}</span>
                      <span className={`
                        text-[10px] px-2 py-0.5 rounded-full font-medium
                        ${opp.potential === 'high' ? 'bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30' :
                          opp.potential === 'medium' ? 'bg-[#d97706]/20 text-[#fbbf24] border border-[#d97706]/30' :
                          'bg-[#78716c]/20 text-[#a8a29e] border border-[#78716c]/30'}
                      `}>
                        {opp.potential}
                      </span>
                    </div>
                    <p className="text-xs text-[#78716c] truncate">{opp.signal}</p>
                  </div>
                  <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-mono text-[#fafaf9]">{opp.confidence}%</div>
                      <div className="text-[10px] text-[#78716c]">confidence</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono text-[#d97706]">{opp.valency.toFixed(1)}</div>
                      <div className="text-[10px] text-[#78716c]">valency</div>
                    </div>
                    <ChevronRight size={16} className="text-[#44403c] group-hover:text-[#6F42C1] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-[#6F42C1]" />
                <span className="font-display font-semibold">Market Sentiment Intensity</span>
              </div>
              <span className="text-xs text-[#78716c]">D3.js real-time</span>
            </div>
            <SentimentChart />
          </div>
        </div>

        {/* Right column - Advisory & Logs */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Strategic Advisory */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-[#d97706]/20 text-[#d97706]">
                <Zap size={16} />
              </div>
              <span className="font-display font-semibold text-sm">AI Strategic Advisory</span>
            </div>
            <div className="space-y-3">
              <textarea
                value={advisoryQuery}
                onChange={(e) => setAdvisoryQuery(e.target.value)}
                placeholder="Ask about market strategy, positioning, or execution..."
                className="w-full bg-[#292524] border border-[#44403c] rounded-lg px-3 py-2 text-[#fafaf9] text-sm placeholder:text-[#78716c] focus:border-[#6F42C1] focus:ring-1 focus:ring-[#6F42C1]/30 outline-none resize-none h-20"
              />
              <button 
                onClick={handleAdvisoryQuery}
                className="w-full py-2 bg-[#6F42C1] hover:bg-[#5a35a8] rounded-lg text-sm font-medium transition-colors"
              >
                Get Strategic Insight
              </button>
              {advisoryResponse && (
                <div className="mt-3 p-3 rounded-lg bg-[#292524] border border-[#44403c]">
                  <p className="text-xs text-[#a8a29e] whitespace-pre-wrap leading-relaxed">{advisoryResponse}</p>
                </div>
              )}
            </div>
          </div>

          {/* Bot Logs */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={16} className="text-[#6F42C1]" />
              <span className="font-display font-semibold text-sm">Intelligence Bot Logs</span>
              <span className="text-[10px] text-[#78716c] ml-auto">live</span>
            </div>
            <div className="h-48 overflow-y-auto bg-[#0c0a09] rounded-lg p-3 border border-[#44403c] space-y-1 font-mono text-[11px]">
              {botLogs.length === 0 ? (
                <div className="text-[#78716c] text-center py-4">Run the intelligence bot to see live logs...</div>
              ) : (
                botLogs.map((log, i) => {
                  const isInfo = log.includes('🧠') || log.includes('🌐') || log.includes('📡');
                  const isSuccess = log.includes('✅');
                  const isWarn = log.includes('⚠️');
                  return (
                    <div key={i} className={`log-line ${isSuccess ? 'level-success' : isWarn ? 'level-warn' : isInfo ? 'level-info' : ''}`}>
                      {log}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
