import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, DollarSign, Calendar,
  Activity, ArrowUp, ArrowDown, Minus
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/ops/analytics/dashboard').then(r => r.json()),
      fetch('/ops/analytics/revenue').then(r => r.json()),
      fetch('/ops/analytics/forecast').then(r => r.json()),
    ]).then(([a, r, f]) => {
      setAnalytics(a);
      setRevenueData(r);
      setForecast(f);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full text-[#78716c]">
      <BarChart3 size={32} className="animate-pulse" />
    </div>
  );

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === 'up') return <ArrowUp size={14} className="text-[#22C55E]" />;
    if (trend === 'down') return <ArrowDown size={14} className="text-[#EF4444]" />;
    return <Minus size={14} className="text-[#a8a29e]" />;
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-[#fafaf9] flex items-center gap-2">
          <BarChart3 size={22} className="text-[#F59E0B]" />
          Business Intelligence
        </h1>
        <p className="text-[#78716c] text-sm mt-1">Revenue analytics, forecasts, and self-improving insights</p>
      </div>

      {/* Revenue Summary */}
      {revenueData?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-[#1c1917] border border-[#44403c] rounded-lg p-4">
            <div className="text-[#a8a29e] text-xs">Total Revenue</div>
            <div className="text-2xl font-bold text-[#fafaf9] mt-1">
              ${revenueData.summary.totalRevenue.toLocaleString()}
            </div>
          </div>
          <div className="bg-[#1c1917] border border-[#44403c] rounded-lg p-4">
            <div className="text-[#a8a29e] text-xs">Total Orders</div>
            <div className="text-2xl font-bold text-[#fafaf9] mt-1">{revenueData.summary.orderCount}</div>
          </div>
          <div className="bg-[#1c1917] border border-[#44403c] rounded-lg p-4">
            <div className="text-[#a8a29e] text-xs">Average Order Value</div>
            <div className="text-2xl font-bold text-[#fafaf9] mt-1">
              ${revenueData.summary.avgOrderValue.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Monthly Revenue Chart (simple bar) */}
      {revenueData?.monthly && revenueData.monthly.length > 0 && (
        <div className="bg-[#1c1917] border border-[#44403c] rounded-lg p-4 mb-6">
          <h2 className="text-sm font-semibold text-[#a8a29e] uppercase tracking-wider mb-4">
            <Calendar size={14} className="inline mr-1" /> Monthly Revenue
          </h2>
          <div className="flex items-end gap-2 h-32">
            {revenueData.monthly.map((m: any) => {
              const maxRevenue = Math.max(...revenueData.monthly.map((x: any) => x.amount), 1);
              const height = (m.amount / maxRevenue) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-xs text-[#22C55E] font-mono">${m.amount.toLocaleString()}</div>
                  <div
                    className="w-full rounded-t"
                    style={{ height: `${Math.max(height, 4)}%`, backgroundColor: '#6F42C1' }}
                  />
                  <div className="text-xs text-[#78716c]">{m.month.slice(5)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Forecast */}
      {forecast?.forecast && forecast.forecast.length > 0 && (
        <div className="bg-[#1c1917] border border-[#44403c] rounded-lg p-4 mb-6">
          <h2 className="text-sm font-semibold text-[#a8a29e] uppercase tracking-wider mb-4">
            <TrendingUp size={14} className="inline mr-1" /> 90-Day Revenue Forecast
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {forecast.forecast.map((f: any) => (
              <div key={f.month} className="bg-[#292524] rounded-lg p-3">
                <div className="text-xs text-[#a8a29e] mb-2">{f.month}</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#78716c]">Conservative</span>
                    <span className="text-[#d6d3d1]">${f.conservative.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78716c]">Expected</span>
                    <span className="text-[#0EA5E9]">${f.expected.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78716c]">Optimistic</span>
                    <span className="text-[#22C55E]">${f.optimistic.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No data state */}
      {(!revenueData || revenueData.summary.totalRevenue === 0) && (
        <div className="text-center text-[#78716c] py-12">
          <BarChart3 size={48} className="mx-auto mb-3 opacity-30" />
          <p>Revenue data will appear here once orders start flowing through Stripe.</p>
        </div>
      )}
    </div>
  );
};
