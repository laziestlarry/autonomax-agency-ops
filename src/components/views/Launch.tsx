import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  CheckCircle2, 
  RefreshCw, 
  Terminal,
  Shield,
  Clock
} from 'lucide-react';

interface Order {
  id: string;
  tier: string;
  amount: number;
  status: string;
  email: string;
  date: string;
  sessionId?: string;
  createdAt?: string;
}

export const Launch: React.FC = () => {
  const params = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  );
  const sessionId = params.get('session_id');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [launchStatus, setLaunchStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/order-by-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.order) setOrder(data.order);
        })
        .catch(console.error);
    }
  }, [sessionId]);

  const handleLaunch = async () => {
    if (!order) return;
    setIsLaunching(true);
    setLaunchStatus('running');
    setLogs([]);

    try {
      const res = await fetch('/api/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setLogs(data.logs);
        setLaunchStatus('completed');
      } else {
        setLogs(data.logs || ['Launch failed']);
        setLaunchStatus('error');
      }
    } catch (error) {
      setLogs(['❌ Launch error: ' + error]);
      setLaunchStatus('error');
    }
    setIsLaunching(false);
  };

  if (!order && !sessionId) {
    return (
      <div className="flex items-center justify-center h-full text-[#78716c]">
        <div className="text-center">
          <Rocket size={48} className="mx-auto mb-4 opacity-30" />
          <p>No active launch session. Please purchase a tier first.</p>
          <a 
            href="/monetization"
            className="inline-block mt-4 px-5 py-2.5 bg-[#6F42C1] hover:bg-[#5a35a8] rounded-lg text-sm font-medium transition-colors"
          >
            View Pricing
          </a>
        </div>
      </div>
    );
  }

  if (!order && sessionId) {
    return (
      <div className="flex items-center justify-center h-full text-[#78716c]">
        <RefreshCw size={32} className="mx-auto mb-4 animate-spin" />
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#fafaf9]">Launch Activation</h1>
          <p className="text-[#a8a29e] text-sm">Service initiation for {order!.tier} — Order #{order!.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-[#292524] border border-[#44403c]">
            <span className="text-xs text-[#78716c]">Status</span>
            <p className="font-medium text-[#10b981]">
              {launchStatus === 'completed' ? '✅ Active' : 
               launchStatus === 'running' ? '🔄 Launching...' : 
               launchStatus === 'error' ? '❌ Error' : '⏸️ Ready'}
            </p>
          </div>
          <button
            onClick={handleLaunch}
            disabled={isLaunching || launchStatus === 'completed'}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#d97706] hover:bg-[#b86505] rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
          >
            {isLaunching ? <RefreshCw size={16} className="animate-spin" /> : <Rocket size={16} />}
            {isLaunching ? 'Launching...' : launchStatus === 'completed' ? 'Already Launched' : 'Launch Activation'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Terminal size={18} className="text-[#6F42C1]" />
              <span className="font-display font-semibold">Launch Logs (Propulse Logic)</span>
            </div>
            <div className="h-64 overflow-y-auto bg-[#0c0a09] rounded-lg p-4 border border-[#44403c] space-y-1 font-mono text-[11px]">
              {logs.length === 0 ? (
                <div className="text-[#78716c] text-center py-8">
                  Press "Launch Activation" to start the service.
                </div>
              ) : (
                logs.map((log, i) => {
                  const isSuccess = log.includes('✅') || log.includes('🎉');
                  const isRunning = log.includes('🔄') || log.includes('🔍') || log.includes('📋') || log.includes('⚡');
                  const isError = log.includes('❌');
                  return (
                    <div key={i} className={`log-line ${isSuccess ? 'level-success' : isRunning ? 'level-info' : isError ? 'level-error' : ''}`}>
                      {log}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} className="text-[#d97706]" />
              <span className="font-display font-semibold text-sm">Order Summary</span>
            </div>
            {order && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#78716c]">Tier</span>
                  <span className="text-[#fafaf9]">{order.tier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716c]">Amount</span>
                  <span className="text-[#d97706] font-bold">${order.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716c]">Email</span>
                  <span className="text-[#a8a29e] truncate">{order.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#78716c]">Date</span>
                  <span className="text-[#a8a29e]">{new Date(order.createdAt || order.date).toLocaleDateString()}</span>
                </div>
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-[#44403c]">
              <div className="flex items-center gap-2 text-xs text-[#78716c]">
                <div className={`w-1.5 h-1.5 rounded-full ${launchStatus === 'completed' ? 'bg-[#10b981]' : 'bg-[#d97706]'} animate-pulse`} />
                <span>{launchStatus === 'completed' ? 'Service active' : 'Awaiting launch'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
