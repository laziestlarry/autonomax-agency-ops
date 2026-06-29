import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './components/views/HomePage';
import { Intelligence } from './components/views/Intelligence';
import { Synthesis } from './components/views/Synthesis';
import { Blueprints } from './components/views/Blueprints';
import { CommandCenter } from './components/views/CommandCenter';
import { Governance } from './components/views/Governance';
import { AppBlueprint } from './components/views/AppBlueprint';
import { Monetization } from './components/views/Monetization';
import { Launch } from './components/views/Launch';
import { OpsDashboard } from './components/views/ops/OpsDashboard';
import { PipelineView } from './components/views/ops/PipelineView';
import { OrgChart } from './components/views/ops/OrgChart';
import { AnalyticsView } from './components/views/ops/AnalyticsView';
import { ScheduleView } from './components/views/ops/ScheduleView';
import { PlaysView } from './components/views/ops/PlaysView';
import { Menu } from 'lucide-react';

function App() {
  const [activeView, setActiveView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderView = () => {
    switch (activeView) {
      // Public home / marketing
      case 'home':
        return <HomePage />;
      // App views
      case 'intelligence':
        return <Intelligence />;
      case 'synthesis':
        return <Synthesis />;
      case 'blueprints':
        return <Blueprints />;
      case 'command':
        return <CommandCenter />;
      case 'governance':
        return <Governance />;
      case 'blueprint':
        return <AppBlueprint />;
      case 'monetization':
        return <Monetization />;
      case 'launch':
        return <Launch />;
      // Ops views
      case 'ops_dashboard':
        return <OpsDashboard />;
      case 'ops_pipeline':
        return <PipelineView />;
      case 'ops_org':
        return <OrgChart />;
      case 'ops_analytics':
        return <AnalyticsView />;
      case 'ops_schedule':
        return <ScheduleView />;
      case 'ops_plays':
        return <PlaysView />;
      default:
        return <HomePage />;
    }
  };

  // The HomePage is a full standalone marketing page — hide sidebar chrome
  if (activeView === 'home') {
    return renderView();
  }

  return (
    <div className="flex h-screen bg-[#0c0a09] overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[#44403c] bg-[#0c0a09]">
          <button onClick={toggleSidebar} className="text-[#a8a29e] hover:text-[#fafaf9]">
            <Menu size={24} />
          </button>
          <span className="font-display font-semibold text-sm text-[#fafaf9]">Autonoma-X</span>
          <div className="w-6" />
        </header>

        <main className="flex-1 overflow-hidden bg-[#0c0a09]">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
