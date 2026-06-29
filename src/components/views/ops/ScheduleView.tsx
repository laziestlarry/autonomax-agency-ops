import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, RefreshCw, CheckCircle2, Play, Activity
} from 'lucide-react';

interface ScheduleItem {
  id: string; name: string; type: string; time: string; day?: string;
  description: string; actions: string[];
}

export const ScheduleView: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/ops/workflows/schedules').then(r => r.json()),
      fetch('/ops/workflows/jobs').then(r => r.json()),
    ]).then(([s, j]) => {
      setSchedules(s.schedules || []);
      setJobs(j.jobs || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const typeColors: Record<string, string> = {
    daily: '#0EA5E9', weekly: '#6F42C1', monthly: '#F59E0B', continuous: '#10B981',
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full text-[#78716c]">
      <Calendar size={32} className="animate-pulse" />
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-[#fafaf9] flex items-center gap-2">
          <Calendar size={22} className="text-[#0EA5E9]" />
          Schedules & Workflows
        </h1>
        <p className="text-[#78716c] text-sm mt-1">Operating cadence: Daily → Weekly → Monthly → Continuous</p>
      </div>

      {/* Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {schedules.map(s => (
          <div key={s.id} className="bg-[#1c1917] border border-[#44403c] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: typeColors[s.type] || '#78716c' }} />
                <h3 className="font-medium text-[#fafaf9] text-sm">{s.name}</h3>
              </div>
              <span className="text-xs text-[#78716c] uppercase">{s.type}</span>
            </div>
            <p className="text-xs text-[#a8a29e] mb-2">{s.description}</p>
            <div className="flex items-center gap-2 text-xs text-[#78716c] mb-3">
              <Clock size={12} />
              {s.day ? `${s.day} at ${s.time}` : s.time ? s.time : 'Continuous'}
            </div>
            <div className="space-y-1">
              {s.actions.slice(0, 3).map((action, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-[#d6d3d1]">
                  <CheckCircle2 size={10} className="mt-0.5 text-[#10B981] shrink-0" />
                  <span>{action}</span>
                </div>
              ))}
              {s.actions.length > 3 && (
                <div className="text-xs text-[#78716c]">+{s.actions.length - 3} more</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Jobs */}
      <div>
        <h2 className="text-sm font-semibold text-[#a8a29e] uppercase tracking-wider mb-3">
          <Activity size={14} className="inline mr-1" /> Recent Workflow Jobs
        </h2>
        {jobs.length === 0 ? (
          <div className="text-center text-[#78716c] py-8">
            <RefreshCw size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No workflow jobs yet. Jobs appear when workflows execute.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {jobs.slice(0, 10).map((job: any) => (
              <div key={job.id} className="bg-[#1c1917] border border-[#44403c] rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#fafaf9]">{job.name}</div>
                  <div className="text-xs text-[#78716c]">{job.type} · {new Date(job.createdAt).toLocaleString()}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  job.status === 'completed' ? 'bg-green-900/40 text-green-400' :
                  job.status === 'running' ? 'bg-blue-900/40 text-blue-400' :
                  job.status === 'failed' ? 'bg-red-900/40 text-red-400' :
                  'bg-yellow-900/40 text-yellow-400'
                }`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
