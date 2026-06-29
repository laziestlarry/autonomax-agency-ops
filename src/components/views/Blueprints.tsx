import React, { useState, useRef } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Download, 
  FileText,
  Zap,
  Shield,
  Rocket
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'safe',
    name: 'Safe Route',
    price: 97,
    description: 'Lifetime Access — Steady & Reliable',
    features: ['Full product access', 'Lifetime updates', 'Community support', 'Documentation'],
  },
  {
    id: 'fast',
    name: 'Fast Route',
    price: 197,
    description: 'Viral Launch — High Velocity',
    features: ['All Safe features', 'Priority support', 'Launch acceleration', 'Social tools'],
    isPopular: true,
  },
  {
    id: 'light',
    name: 'Light Route',
    price: 47,
    description: 'Beta Invite — Test & Validate',
    features: ['Beta access', 'Feedback loop', 'Early adopter badge', 'Limited features'],
  },
];

const mrrData = [
  { month: 'Jan', mrr: 4200, growth: 0 },
  { month: 'Feb', mrr: 5100, growth: 21.4 },
  { month: 'Mar', mrr: 6200, growth: 21.6 },
  { month: 'Apr', mrr: 7400, growth: 19.4 },
  { month: 'May', mrr: 8900, growth: 20.3 },
  { month: 'Jun', mrr: 10500, growth: 18.0 },
  { month: 'Jul', mrr: 12400, growth: 18.1 },
  { month: 'Aug', mrr: 14800, growth: 19.4 },
  { month: 'Sep', mrr: 17200, growth: 16.2 },
  { month: 'Oct', mrr: 19800, growth: 15.1 },
  { month: 'Nov', mrr: 22600, growth: 14.1 },
  { month: 'Dec', mrr: 25800, growth: 14.2 },
];

const metrics = [
  { label: 'MRR', value: '$25,800', change: '+14.2%', trend: 'up' },
  { label: 'CAC', value: '$342', change: '-5.2%', trend: 'down' },
  { label: 'LTV', value: '$7,200', change: '+8.7%', trend: 'up' },
  { label: 'Conversion', value: '14.2%', change: '+2.1%', trend: 'up' },
];

export const Blueprints: React.FC = () => {
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'csv' | null>(null);

  const exportCSV = () => {
    setExporting(true);
    setExportType('csv');
    
    try {
      const headers = ['Month', 'MRR', 'Growth'];
      const rows = mrrData.map(d => [d.month, d.mrr.toString(), d.growth.toString()]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(r => r.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'autonoma-x_mrr_data.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV export error:', error);
    }
    
    setExporting(false);
    setExportType(null);
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#fafaf9]">Revenue Blueprints</h1>
          <p className="text-[#a8a29e] text-sm">Monetization stacks, pricing, and growth trajectories</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportCSV}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-[#292524] hover:bg-[#44403c] border border-[#44403c] rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <FileText size={16} />
            CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#6F42C1] hover:bg-[#5a35a8] rounded-lg text-sm font-medium transition-colors">
            <Download size={16} />
            PDF
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="card">
            <p className="stat-label">{m.label}</p>
            <p className="stat-value text-xl">{m.value}</p>
            <p className={`text-xs font-medium ${m.trend === 'up' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
              {m.change}
            </p>
          </div>
        ))}
      </div>

      {/* MRR Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-[#d97706]" />
            <span className="font-display font-semibold">MRR Growth Trajectory</span>
          </div>
          <span className="text-xs text-[#78716c]">12-month forecast</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mrrData}>
              <defs>
                <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
              <XAxis dataKey="month" stroke="#78716c" fontSize={10} />
              <YAxis stroke="#78716c" fontSize={10} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c', borderRadius: '8px' }}
                labelStyle={{ color: '#a8a29e' }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'MRR']}
              />
              <ReferenceLine y={0} stroke="#44403c" />
              <Area 
                type="monotone" 
                dataKey="mrr" 
                stroke="#d97706" 
                strokeWidth={2}
                fill="url(#mrrGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pricingTiers.map((tier) => (
          <div 
            key={tier.id}
            className={`card relative ${tier.isPopular ? 'border-[#d97706]/50 ring-1 ring-[#d97706]/30' : ''}`}
          >
            {tier.isPopular && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#d97706] rounded-full text-[10px] font-semibold text-[#0c0a09]">
                POPULAR
              </div>
            )}
            <div className="text-center pt-2">
              <div className="text-sm font-medium text-[#78716c]">{tier.name}</div>
              <div className="mt-1 font-display text-3xl font-bold text-[#fafaf9]">
                ${tier.price}
                <span className="text-sm font-normal text-[#78716c]">/mo</span>
              </div>
              <p className="text-xs text-[#78716c] mt-1">{tier.description}</p>
            </div>
            <ul className="mt-4 space-y-2">
              {tier.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[#a8a29e]">
                  <Zap size={14} className="text-[#6F42C1] flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button className={`w-full mt-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              tier.isPopular 
                ? 'bg-[#d97706] hover:bg-[#b86505] text-[#0c0a09]' 
                : 'bg-[#292524] hover:bg-[#44403c] text-[#fafaf9]'
            }`}>
              Choose {tier.name}
            </button>
          </div>
        ))}
      </div>

      {/* Growth Milestones */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Rocket size={18} className="text-[#6F42C1]" />
          <span className="font-display font-semibold">Growth Milestones</span>
          <span className="text-xs text-[#78716c] ml-auto">10-week launch plan</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['Discovery', 'Validation', 'Build', 'Launch', 'Scale'].map((phase, i) => (
            <div key={i} className="text-center p-3 rounded-lg bg-[#292524]/50 border border-[#44403c]/50">
              <div className="text-xs font-medium text-[#78716c]">Week {i * 2 + 1}-{i * 2 + 2}</div>
              <div className="mt-1 text-sm font-medium text-[#fafaf9]">{phase}</div>
              <div className="mt-1 w-full h-1 rounded-full bg-[#292524] overflow-hidden">
                <div className="h-full rounded-full bg-[#6F42C1]" style={{ width: `${(i + 1) * 20}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
