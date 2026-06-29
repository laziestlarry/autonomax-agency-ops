import React from 'react';
import { 
  LayoutDashboard, 
  Brain, 
  Code2, 
  TrendingUp, 
  Shield, 
  BookOpen,
  Network,
  Zap,
  Menu,
  X,
  DollarSign,
  Rocket,
  Target,
  BarChart3,
  Calendar,
  Users,
  Crown,
  Megaphone,
  Home
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'intelligence', label: 'Intelligence', icon: Brain },
  { id: 'synthesis', label: 'Synthesis', icon: Code2 },
  { id: 'blueprints', label: 'Blueprints', icon: TrendingUp },
  { id: 'command', label: 'Command Center', icon: Zap },
  // Operations Agency
  { id: 'ops_dashboard', label: 'Ops Dashboard', icon: Crown, section: 'Operations' },
  { id: 'ops_pipeline', label: 'Pipeline', icon: Target },
  { id: 'ops_schedule', label: 'Schedules', icon: Calendar },
  { id: 'ops_org', label: 'Organization', icon: Users },
  { id: 'ops_analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'ops_plays', label: 'GTM Plays', icon: Megaphone },
  // Core
  { id: 'governance', label: 'Governance', icon: Shield },
  { id: 'monetization', label: 'Monetization', icon: DollarSign },
  { id: 'launch', label: 'Launch', icon: Rocket },
  { id: 'blueprint', label: 'App Blueprint', icon: BookOpen },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside 
        className={`
          fixed top-0 left-0 h-full w-[260px] bg-[#0c0a09] border-r border-[#44403c] z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
          flex flex-col
        `}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-[#44403c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6F42C1] flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">AX</span>
            </div>
            <span className="font-display font-semibold text-[#fafaf9] text-sm tracking-tight">
              Autonoma-X
            </span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-[#a8a29e] hover:text-[#fafaf9]">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {(() => {
            let lastSection = '';
            return navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              const showSection = item.section && item.section !== lastSection;
              lastSection = item.section || lastSection;
              return (
                <React.Fragment key={item.id}>
                  {showSection && (
                    <div className="pt-4 pb-1.5 px-1">
                      <div className="text-[10px] font-semibold text-[#6F42C1] uppercase tracking-widest">
                        {item.section}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setActiveView(item.id);
                      if (window.innerWidth < 1024) toggleSidebar();
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${isActive 
                        ? 'bg-[#4C2882]/30 text-[#fafaf9] border border-[#6F42C1]/30 shadow-[0_0_20px_rgba(79,42,130,0.15)]' 
                        : 'text-[#a8a29e] hover:text-[#fafaf9] hover:bg-[#292524]'
                      }
                    `}
                  >
                    <Icon size={18} className={isActive ? 'text-[#a78bfa]' : 'text-[#78716c]'} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#6F42C1] animate-pulse" />
                    )}
                  </button>
                </React.Fragment>
              );
            });
          })()}
        </nav>

        <div className="border-t border-[#44403c] p-4">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-[#292524]/50">
            <div className="w-8 h-8 rounded-full bg-[#d97706]/20 border border-[#d97706]/30 flex items-center justify-center">
              <span className="text-[#d97706] text-xs font-bold">D</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#fafaf9]">Director</p>
              <p className="text-[10px] text-[#78716c]">v3.2.1 • Active</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          </div>
        </div>
      </aside>
    </>
  );
};
