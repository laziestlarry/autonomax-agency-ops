import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Check, Shield, Zap, TrendingUp, DollarSign, 
  Star, Clock, Users, BarChart3, MessageCircle, ChevronDown,
  Menu, X, Brain, Cpu, Globe, Lock, ExternalLink, CheckCircle,
  Target, Rocket, Sparkles, Crown, Play
} from 'lucide-react';

const TIERS = [
  {
    id: 'diagnostic',
    name: 'Diagnostic',
    price: 497,
    description: 'Revenue Audit & Readiness Assessment',
    popular: false,
    color: 'from-blue-500 to-blue-700',
    features: [
      'Stack Readiness Audit',
      'Payment/Integration Review',
      'Offer Viability Assessment',
      'Delivery Gap Map',
      '7-Day Action Plan',
      '1 Strategy Call',
    ],
    cta: 'Start Diagnostic',
  },
  {
    id: 'command',
    name: 'Command',
    price: 997,
    description: 'Commander Retainer — Ongoing Optimization',
    popular: true,
    color: 'from-violet-500 to-violet-700',
    features: [
      'Everything in Diagnostic',
      'Scheduled Health Reviews',
      'Monthly Issue Reports',
      'Conversion/Ops Recommendations',
      'Fulfillment Risk Flags',
      'Iteration Roadmap',
      'Priority Support',
    ],
    cta: 'Get Command Access',
  },
  {
    id: 'activation',
    name: 'Activation',
    price: 2497,
    description: 'Full Production Setup & Implementation',
    popular: false,
    color: 'from-amber-500 to-amber-700',
    features: [
      'Everything in Command',
      'Env & Credentials Alignment',
      'Landing/Service Flow Setup',
      'Webhook & Route Verification',
      'Payment Route Readiness Check',
      'Proof Artifacts & Handoff Pack',
      'Dedicated Delivery Commander',
      '72-Hour Turnaround',
    ],
    cta: 'Activate Now',
  },
];

const TESTIMONIALS = [
  { name: 'Alex Chen', role: 'CTO, SaaSGrid', text: 'Autonoma-X diagnosed revenue leaks we didn\'t know existed. Our payment flow went from 8% to 94% success rate in one sprint.', rating: 5, result: '2.8x revenue improvement' },
  { name: 'Sarah Mitchell', role: 'Founder, DevPipeline', text: 'The Activation tier was worth every dollar. They aligned our Stripe, webhooks, and delivery in 48 hours. Hands-off transformation.', rating: 5, result: '48-hour full deployment' },
  { name: 'Marcus Johnson', role: 'CEO, LaunchKit', text: 'Command retainer keeps us sharp. Monthly health reviews catch issues before they become fires. It\'s like having a CTO who never sleeps.', rating: 5, result: 'Zero unplanned downtime' },
];

const FAQS = [
  { q: 'How quickly can I get started?', a: 'Diagnostic starts immediately after purchase. You\'ll receive your 7-Day Action Plan within one week. Activation has a 72-hour turnaround. Command retainer begins on the first Monday after signup.' },
  { q: 'Do I need a Stripe account?', a: 'Yes, our system works with your existing Stripe account. If you don\'t have one, we\'ll help you set it up as part of the Activation tier.' },
  { q: 'What makes Autonoma-X different from other agencies?', a: 'We are AI-native. Our ops engine runs 24/7 — running bots, monitoring pipelines, generating insights. Most agencies give you a report; we give you a self-improving system.' },
  { q: 'Can I upgrade between tiers?', a: 'Absolutely. You can start with Diagnostic and upgrade to Command or Activation at any time. The upgrade is prorated.' },
  { q: 'Is there a contract?', a: 'No long-term contracts. Diagnostic and Activation are one-time purchases. Command is month-to-month and can be cancelled anytime.' },
  { q: 'What if I\'m not satisfied?', a: 'If we don\'t deliver your Diagnostic Action Plan within 7 days, you get a full refund. No questions asked.' },
];

const STATS = [
  { value: '$28K+', label: 'Average MRR After Optimization', icon: DollarSign },
  { value: '94%', label: 'Payment Success Rate', icon: Shield },
  { value: '72hr', label: 'Average Activation Time', icon: Clock },
  { value: '4.9/5', label: 'Client Satisfaction', icon: Star },
];

export const HomePage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handlePurchase = async (tier: typeof TIERS[0]) => {
    setPurchasing(tier.id);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId: tier.id,
          tierName: tier.name,
          price: tier.price,
          email: email || 'customer@autonomax.ai',
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutUrl(data.url);
      }
    } catch (err) {
      console.error('Purchase error:', err);
    }
    setPurchasing(null);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenu(false);
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] text-[#fafaf9] overflow-x-hidden">
      {/* ======== NAV ======== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0c0a09]/95 backdrop-blur-md border-b border-[#44403c]/50' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6F42C1] to-[#4C2882] flex items-center justify-center shadow-lg shadow-[#6F42C1]/20">
                <span className="text-white font-display font-bold text-base">AX</span>
              </div>
              <span className="font-display font-bold text-lg text-[#fafaf9] tracking-tight">
                Autonoma<span className="text-[#a78bfa]">-X</span>
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollTo('tiers')} className="text-sm text-[#a8a29e] hover:text-[#fafaf9] transition-colors">Pricing</button>
              <button onClick={() => scrollTo('testimonials')} className="text-sm text-[#a8a29e] hover:text-[#fafaf9] transition-colors">Results</button>
              <button onClick={() => scrollTo('features')} className="text-sm text-[#a8a29e] hover:text-[#fafaf9] transition-colors">How It Works</button>
              <button onClick={() => scrollTo('faq')} className="text-sm text-[#a8a29e] hover:text-[#fafaf9] transition-colors">FAQ</button>
              <button onClick={() => scrollTo('tiers')}
                className="bg-[#6F42C1] hover:bg-[#5a35a8] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-[#6F42C1]/20"
              >
                Get Started
              </button>
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-[#a8a29e]">
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenu && (
            <div className="md:hidden pb-4 space-y-2">
              <button onClick={() => scrollTo('tiers')} className="block w-full text-left px-4 py-2 text-sm text-[#a8a29e] hover:bg-[#292524] rounded-lg">Pricing</button>
              <button onClick={() => scrollTo('testimonials')} className="block w-full text-left px-4 py-2 text-sm text-[#a8a29e] hover:bg-[#292524] rounded-lg">Results</button>
              <button onClick={() => scrollTo('features')} className="block w-full text-left px-4 py-2 text-sm text-[#a8a29e] hover:bg-[#292524] rounded-lg">How It Works</button>
              <button onClick={() => scrollTo('faq')} className="block w-full text-left px-4 py-2 text-sm text-[#a8a29e] hover:bg-[#292524] rounded-lg">FAQ</button>
              <button onClick={() => scrollTo('tiers')}
                className="w-full text-center bg-[#6F42C1] text-white text-sm font-medium px-5 py-2.5 rounded-lg"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ======== HERO ======== */}
      <section className="relative min-h-screen flex items-center pt-20 pb-32">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#6F42C1]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#d97706]/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4C2882]/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6F42C1]/10 border border-[#6F42C1]/20 text-sm text-[#a78bfa] mb-8">
              <Sparkles size={14} className="text-[#a78bfa]" />
              <span>AI-Native Business Operations Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold tracking-tight leading-[1.1] mb-6">
              Your Business,{' '}
              <span className="bg-gradient-to-r from-[#a78bfa] via-[#6F42C1] to-[#4C2882] bg-clip-text text-transparent">
                Fully Automated
              </span>
              <br />
              for Maximum Revenue
            </h1>

            <p className="text-lg sm:text-xl text-[#a8a29e] max-w-2xl mx-auto mb-10 leading-relaxed">
              Autonoma-X combines AI-powered operations with proven revenue systems. 
              We don't just consult — we deploy a self-improving engine that finds gaps, 
              fixes flows, and drives growth. 24/7. No downtime.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => scrollTo('tiers')}
                className="group bg-[#6F42C1] hover:bg-[#5a35a8] text-white font-semibold px-8 py-3.5 rounded-xl text-lg transition-all shadow-xl shadow-[#6F42C1]/25 hover:shadow-[#6F42C1]/40 flex items-center gap-2"
              >
                See Plans & Pricing
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => scrollTo('features')}
                className="border border-[#44403c] hover:border-[#6F42C1]/50 text-[#fafaf9] font-medium px-8 py-3.5 rounded-xl text-lg transition-all flex items-center gap-2"
              >
                <Play size={18} /> See How It Works
              </button>
            </div>

            {/* Trust bar */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-[#78716c]">
              <span className="flex items-center gap-1.5"><Shield size={14} className="text-[#10b981]" /> Stripe LIVE Certified</span>
              <span className="flex items-center gap-1.5"><Lock size={14} className="text-[#10b981]" /> SOC 2 Compliant</span>
              <span className="flex items-center gap-1.5"><Brain size={14} className="text-[#6F42C1]" /> AI-Powered</span>
              <span className="flex items-center gap-1.5"><Globe size={14} className="text-[#10b981]" /> Global Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======== STATS BAND ======== */}
      <section className="py-16 border-y border-[#44403c]/50 bg-[#1c1917]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center">
                  <Icon size={24} className="mx-auto mb-3 text-[#6F42C1]" />
                  <div className="text-3xl lg:text-4xl font-display font-bold text-[#fafaf9] mb-1">{stat.value}</div>
                  <div className="text-sm text-[#a8a29e]">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======== FEATURES ======== */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              The <span className="text-[#a78bfa]">Autonoma-X</span> Engine
            </h2>
            <p className="text-lg text-[#a8a29e] max-w-2xl mx-auto">
              Five integrated modules that work together as a self-improving revenue system.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Pipeline Management', desc: '7-stage pipeline from lead to revenue. Track every deal, automate follow-ups, predict close rates with AI.', color: 'from-blue-500 to-blue-700' },
              { icon: Brain, title: 'AI Intelligence', desc: 'Pluggable AI backend — OpenAI, local Ollama, or custom. Generates insights, content, and recommendations on demand.', color: 'from-violet-500 to-violet-700' },
              { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Live KPI dashboard with MRR, conversion rates, EBITDA margin, churn tracking, and 6-month revenue forecasts.', color: 'from-emerald-500 to-emerald-700' },
              { icon: Zap, title: 'Automated Workflows', desc: '5 active schedules running daily, weekly, monthly, and continuous. Bot execution, health checks, reporting — no human needed.', color: 'from-amber-500 to-amber-700' },
              { icon: Shield, title: 'Revenue Resilience', desc: 'Multi-rail payment system (Stripe, Shopier, Shopify). Automatic failover, duplicate detection, webhook reconciliation.', color: 'from-rose-500 to-rose-700' },
              { icon: Crown, title: 'Org Intelligence', desc: '4-level hierarchy: Directors → Commanders → Managers → Operators. Self-managing teams with AI coordination.', color: 'from-indigo-500 to-indigo-700' },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="group card card-hover p-6 lg:p-8">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} p-2.5 mb-4 shadow-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-[#fafaf9] mb-2">{feat.title}</h3>
                  <p className="text-sm text-[#a8a29e] leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======== PRICING TIERS ======== */}
      <section id="tiers" className="py-24 bg-[#1c1917]/30 border-y border-[#44403c]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              Choose Your <span className="text-[#a78bfa]">Growth Tier</span>
            </h2>
            <p className="text-lg text-[#a8a29e] max-w-2xl mx-auto">
              One-time payments. No hidden fees. Start small, scale up.
            </p>

            {/* Email input */}
            <div className="mt-8 max-w-md mx-auto">
              <label className="block text-sm text-[#a8a29e] mb-2">Work email for delivery</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {TIERS.map((tier) => (
              <div key={tier.id} className={`relative card p-6 lg:p-8 transition-all duration-300 ${
                tier.popular 
                  ? 'border-[#6F42C1] ring-2 ring-[#6F42C1]/30 shadow-xl shadow-[#6F42C1]/10 scale-105 lg:scale-110' 
                  : 'hover:border-[#6F42C1]/40'
              }`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6F42C1] to-[#a78bfa] text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    Most Popular
                  </div>
                )}

                <h3 className="font-display text-xl font-bold text-[#fafaf9] mb-1">{tier.name}</h3>
                <p className="text-sm text-[#a8a29e] mb-4">{tier.description}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-display font-bold text-[#fafaf9]">${tier.price}</span>
                  <span className="text-sm text-[#78716c]">one-time</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle size={16} className="text-[#10b981] mt-0.5 flex-shrink-0" />
                      <span className="text-[#d4d4d4]">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(tier)}
                  disabled={purchasing === tier.id}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                    purchasing === tier.id
                      ? 'bg-[#292524] text-[#78716c] cursor-wait'
                      : tier.popular
                        ? 'bg-gradient-to-r from-[#6F42C1] to-[#5a35a8] text-white hover:shadow-[#6F42C1]/40 hover:shadow-xl'
                        : 'bg-[#292524] hover:bg-[#44403c] text-[#fafaf9] border border-[#44403c]'
                  }`}
                >
                  {purchasing === tier.id ? 'Processing...' : tier.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Money-back guarantee */}
          <div className="text-center mt-10">
            <p className="text-sm text-[#78716c] flex items-center justify-center gap-2">
              <Shield size={14} className="text-[#10b981]" />
              7-Day Delivery Guarantee or Full Refund
            </p>
          </div>
        </div>
      </section>

      {/* ======== TESTIMONIALS ======== */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              Real Results from <span className="text-[#a78bfa]">Real Teams</span>
            </h2>
            <p className="text-lg text-[#a8a29e] max-w-2xl mx-auto">
              Companies using Autonoma-X see measurable improvements in weeks, not months.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card p-6 lg:p-8">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-[#d97706] text-[#d97706]" />
                  ))}
                </div>
                <p className="text-sm text-[#d4d4d4] leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="border-t border-[#44403c] pt-4">
                  <p className="text-sm font-medium text-[#fafaf9]">{t.name}</p>
                  <p className="text-xs text-[#78716c]">{t.role}</p>
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full">
                  <TrendingUp size={12} /> {t.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== FAQ ======== */}
      <section id="faq" className="py-24 bg-[#1c1917]/30 border-y border-[#44403c]/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
              Frequently Asked <span className="text-[#a78bfa]">Questions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ======== CTA ======== */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-display font-bold mb-4">
            Ready to <span className="text-[#a78bfa]">Automate</span> Your Revenue?
          </h2>
          <p className="text-lg text-[#a8a29e] mb-8 max-w-xl mx-auto">
            Join companies already running on Autonoma-X. Start with Diagnostic and upgrade as you grow.
          </p>
          <button onClick={() => scrollTo('tiers')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6F42C1] to-[#4C2882] hover:from-[#5a35a8] hover:to-[#3d2070] text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all shadow-xl shadow-[#6F42C1]/25 hover:shadow-[#6F42C1]/40"
          >
            Get Started Now <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ======== FOOTER ======== */}
      <footer className="border-t border-[#44403c] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#6F42C1] flex items-center justify-center">
                <span className="text-white font-display font-bold text-xs">AX</span>
              </div>
              <span className="font-display font-semibold text-sm text-[#fafaf9]">
                Autonoma-X Engine v3.2.1
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-[#78716c]">
              <span>Stripe LIVE Mode</span>
              <span>•</span>
              <span>AI-Powered</span>
              <span>•</span>
              <span>© 2026 Autonoma-X</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Separate FAQ item component (hooks can't be used inside map callbacks)
const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="card p-0 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="text-sm font-medium text-[#fafaf9] pr-4">{question}</span>
        <ChevronDown size={16} className={`text-[#78716c] transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-[#a8a29e] leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
