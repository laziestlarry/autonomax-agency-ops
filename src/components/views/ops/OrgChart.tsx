import React, { useState, useEffect } from 'react';
import { Crown, Shield, Briefcase, Bot, ChevronRight, Users } from 'lucide-react';

const LEVEL_ICONS: Record<number, React.ReactNode> = {
  0: <Crown size={16} className="text-[#6F42C1]" />,
  1: <Shield size={16} className="text-[#0EA5E9]" />,
  2: <Briefcase size={16} className="text-[#10B981]" />,
  3: <Bot size={16} className="text-[#F59E0B]" />,
};

const LEVEL_COLORS: Record<number, string> = {
  0: '#6F42C1', 1: '#0EA5E9', 2: '#10B981', 3: '#F59E0B',
};

const LEVEL_NAMES: Record<number, string> = {
  0: 'Director — Strategy & Vision',
  1: 'Commander — Coordination & Execution',
  2: 'Manager — Domain Operations',
  3: 'Operator — Task Execution',
};

export const OrgChart: React.FC = () => {
  const [orgData, setOrgData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/ops/org/chart').then(r => r.json()).then(data => {
      setOrgData(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full text-[#78716c]">
      <Users size={32} className="animate-pulse" />
    </div>
  );

  const levels = orgData?.hierarchy || [];
  const members = orgData?.members || [];

  // Group members by level
  const byLevel = levels.map((lvl: any) => ({
    ...lvl,
    members: members.filter((m: any) => m.level === lvl.level),
  }));

  return (
    <div className="p-4 md:p-6 lg:p-8 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-[#fafaf9] flex items-center gap-2">
          <Users size={22} className="text-[#6F42C1]" />
          Organization
        </h1>
        <p className="text-[#78716c] text-sm mt-1">{orgData?.name || 'Autonoma-X Agency'}</p>
      </div>

      {/* Org Levels */}
      <div className="space-y-6">
        {byLevel.map((lvl: any) => (
          <div key={lvl.level}>
            <div className="flex items-center gap-2 mb-3">
              {LEVEL_ICONS[lvl.level]}
              <h2 className="text-sm font-semibold text-[#a8a29e] uppercase tracking-wider">
                Level {lvl.level}: {lvl.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lvl.members.length > 0 ? lvl.members.map((member: any) => (
                <div
                  key={member.id}
                  className="bg-[#1c1917] border border-[#44403c] rounded-lg p-4 hover:border-opacity-60 transition-colors"
                  style={{ borderColor: `${LEVEL_COLORS[lvl.level]}40` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-[#fafaf9]">{member.name}</div>
                      <div className="text-xs text-[#a8a29e]">{member.title}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      member.status === 'active' ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#78716c]">{member.email}</div>
                  {member.skills && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {JSON.parse(member.skills).map((skill: string) => (
                        <span key={skill} className="px-2 py-0.5 bg-[#292524] rounded text-xs text-[#d6d3d1]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )) : (
                <div className="text-[#78716c] text-sm py-3 col-span-3">
                  No members at this level yet
                </div>
              )}
            </div>

            {/* Connection to next level */}
            {lvl.level < 3 && lvl.members.length > 0 && (
              <div className="flex justify-center my-2">
                <ChevronRight size={16} className="text-[#44403c] rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="mt-8 p-4 bg-[#1c1917] border border-[#6F42C1]/30 rounded-lg">
        <div className="text-[#a8a29e] text-xs uppercase tracking-wider mb-1">Mission</div>
        <div className="text-[#d6d3d1] text-sm">{orgData?.mission}</div>
      </div>
    </div>
  );
};
