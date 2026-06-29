import React, { useState, useEffect } from 'react';
import { 
  DollarSign, ShoppingCart, Shield, Zap, TrendingUp, Package, Receipt, CheckCircle2, CreditCard
} from 'lucide-react';

interface ProductTier {
  id: string;
  name: string;
  price: number;
  description: string;
  deliverables: string[];
  icon: React.ReactNode;
}

const tiers: ProductTier[] = [
  {
    id: 'diagnostic',
    name: 'Diagnostic',
    price: 497,
    description: 'Revenue Audit & Readiness Assessment',
    deliverables: ['Stack Readiness Audit', 'Payment/Integration Review', '7-Day Action Plan'],
    icon: <Shield size={20} />,
  },
  {
    id: 'activation',
    name: 'Activation',
    price: 2497,
    description: 'Full Production Setup & Implementation',
    deliverables: ['Env & Credentials Alignment', 'Webhook Verification', 'Proof Artifacts'],
    icon: <Zap size={20} />,
  },
  {
    id: 'command',
    name: 'Command',
    price: 997,
    description: 'Commander Retainer — Ongoing Optimization',
    deliverables: ['Health Reviews', 'Issue Reports', 'Iteration Roadmap'],
    icon: <TrendingUp size={20} />,
  },
];

export const Monetization: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<ProductTier | null>(null);
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [orders, setOrders] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetch('/api/v1/orders')
      .then(res => res.json())
      .then(data => {
        if (data.orders) {
          setOrders(data.orders);
          const total = data.orders.reduce((acc: number, o: any) => acc + o.amount, 0);
          setTotalRevenue(total);
        }
      })
      .catch(console.error);
  }, []);

  const handlePurchase = async () => {
    if (!selectedTier || !email.trim()) return;
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId: selectedTier.id,
          tierName: selectedTier.name,
          price: selectedTier.price,
          email,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL');
      }
    } catch (error) {
      console.error(error);
      setPaymentStatus('error');
      setTimeout(() => setPaymentStatus('idle'), 3000);
    }
    setIsProcessing(false);
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#fafaf9]">Monetization</h1>
          <p className="text-[#a8a29e] text-sm">Product tiers & secure checkout</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-[#292524] border border-[#44403c]">
            <span className="text-xs text-[#78716c]">Revenue</span>
            <p className="font-display text-xl font-bold text-[#d97706]">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="px-4 py-2 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30">
            <span className="text-xs text-[#78716c]">Orders</span>
            <p className="font-display text-xl font-bold text-[#10b981]">{orders.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Package size={18} className="text-[#6F42C1]" />
              <span className="font-display font-semibold">Choose Your Product Tier</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedTier?.id === tier.id
                      ? 'border-[#6F42C1] bg-[#4C2882]/20 ring-1 ring-[#6F42C1]/30'
                      : 'border-[#44403c] bg-[#292524]/30 hover:border-[#6F42C1]/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {tier.icon}
                    <span className="font-display font-semibold text-[#fafaf9]">{tier.name}</span>
                  </div>
                  <div className="font-display text-2xl font-bold text-[#d97706]">${tier.price}</div>
                  <p className="text-xs text-[#78716c] mt-1">{tier.description}</p>
                  <ul className="mt-3 space-y-1">
                    {tier.deliverables.map((d, i) => (
                      <li key={i} className="text-xs text-[#a8a29e] flex items-start gap-1.5">
                        <CheckCircle2 size={12} className="text-[#10b981] flex-shrink-0 mt-0.5" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {selectedTier && (
            <div className="card border-[#6F42C1]/30">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard size={18} className="text-[#d97706]" />
                <span className="font-display font-semibold">Checkout — {selectedTier.name}</span>
                <span className="text-sm font-bold text-[#d97706] ml-auto">${selectedTier.price}</span>
              </div>
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-[#292524] border border-[#44403c] rounded-lg px-4 py-2.5 text-[#fafaf9] placeholder:text-[#78716c] focus:border-[#6F42C1] outline-none"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedTier(null)}
                    className="flex-1 py-2.5 bg-[#292524] hover:bg-[#44403c] rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePurchase}
                    disabled={isProcessing || !email.trim()}
                    className="flex-1 py-2.5 bg-[#d97706] hover:bg-[#b86505] rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? 'Processing...' : 'Purchase with Stripe'}
                  </button>
                </div>
                {paymentStatus === 'error' && (
                  <div className="flex items-center gap-2 text-[#ef4444] text-sm">
                    <Shield size={16} />
                    Payment failed. Please try again.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="card h-full">
            <div className="flex items-center gap-2 mb-4">
              <Receipt size={18} className="text-[#6F42C1]" />
              <span className="font-display font-semibold">Recent Orders</span>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-[#78716c]">
                  <ShoppingCart size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No orders yet</p>
                </div>
              ) : (
                orders.slice(0, 10).map((order: any) => (
                  <div key={order.id} className="p-3 rounded-lg bg-[#292524]/30 border border-[#44403c]/40">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#fafaf9]">{order.tier}</span>
                      <span className="font-mono text-sm font-semibold text-[#d97706]">${order.amount}</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#78716c] mt-1">
                      <span>{order.email}</span>
                      <span>{new Date(order.createdAt || order.date).toLocaleDateString()}</span>
                    </div>
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
