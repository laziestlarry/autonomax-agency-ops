import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight, Check, Shield, Zap, TrendingUp, DollarSign,
  Star, Clock, Users, BarChart3, MessageCircle, ChevronDown,
  Menu, X, Brain, Cpu, Globe, Lock, ExternalLink, CheckCircle,
  Target, Rocket, Sparkles, Crown, Play, Quote,
  ChevronRight, Activity, RefreshCw, Gift, Award,
  ShoppingCart, Phone, Mail, MapPin
} from 'lucide-react';

// ─── Data ───────────────────────────────────────────────────────────────────────

const TIERS = [
  {
    id: 'diagnostic',
    name: 'Diagnostic',
    price: 497,
    description: 'Revenue Audit & Readiness Assessment',
    popular: false,
    gradient: 'from-slate-600 to-slate-800',
    features: [
      'Stack Readiness Audit',
      'Payment/Integration Review',
      'Offer Viability Assessment',
      'Delivery Gap Map',
      '7-Day Action Plan',
      '1 Strategy Call',
    ],
    cta: 'Start Diagnostic',
    highlight: 'Perfect for teams getting started',
  },
  {
    id: 'command',
    name: 'Command',
    price: 997,
    description: 'Commander Retainer — Ongoing Optimization',
    popular: true,
    gradient: 'from-[#6F42C1] to-[#4C2882]',
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
    highlight: 'Best value — ongoing optimization',
  },
  {
    id: 'activation',
    name: 'Activation',
    price: 2497,
    description: 'Full Production Setup & Implementation',
    popular: false,
    gradient: 'from-amber-600 to-amber-800',
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
    highlight: 'Full production deployment',
  },
];

const TESTIMONIALS = [
  { name: 'Alex Chen', role: 'CTO, SaaSGrid', text: "Autonoma-X diagnosed revenue leaks we didn't know existed. Our payment flow went from 8% to 94% success rate in one sprint.", rating: 5, result: '2.8x revenue improvement' },
  { name: 'Sarah Mitchell', role: 'Founder, DevPipeline', text: 'The Activation tier was worth every dollar. They aligned our Stripe, webhooks, and delivery in 48 hours. Hands-off transformation.', rating: 5, result: '48-hour full deployment' },
  { name: 'Marcus Johnson', role: 'CEO, LaunchKit', text: "Command retainer keeps us sharp. Monthly health reviews catch issues before they become fires. It's like having a CTO who never sleeps.", rating: 5, result: 'Zero unplanned downtime' },
  { name: 'Priya Patel', role: 'COO, FlowCommerce', text: 'We went from fragmented tools to a single autonomous ops engine. The AI coordination between our teams is game-changing.', rating: 5, result: '60% faster decision-making' },
];

const FAQS = [
  { q: 'How quickly can I get started?', a: "Diagnostic starts immediately after purchase. You'll receive your 7-Day Action Plan within one week. Activation has a 72-hour turnaround. Command retainer begins on the first Monday after signup." },
  { q: 'Do I need a Stripe account?', a: "Yes, our system works with your existing Stripe account. If you don't have one, we'll help you set it up as part of the Activation tier." },
  { q: "What makes Autonoma-X different from other agencies?", a: 'We are AI-native. Our ops engine runs 24/7 — running bots, monitoring pipelines, generating insights. Most agencies give you a report; we give you a self-improving system.' },
  { q: 'Can I upgrade between tiers?', a: 'Absolutely. You can start with Diagnostic and upgrade to Command or Activation at any time. The upgrade is prorated.' },
  { q: 'Is there a contract?', a: 'No long-term contracts. Diagnostic and Activation are one-time purchases. Command is month-to-month and can be cancelled anytime.' },
  { q: "What if I'm not satisfied?", a: "If we don't deliver your Diagnostic Action Plan within 7 days, you get a full refund. No questions asked." },
];

const FEATURES = [
  { icon: Target, title: 'Pipeline Management', desc: '7-stage pipeline from lead to revenue. Track every deal, automate follow-ups, predict close rates with AI.', color: 'from-blue-500 to-blue-700' },
  { icon: Brain, title: 'AI Intelligence', desc: 'Pluggable AI backend — Groq, DeepSeek, Gemini, OpenAI, or local. Generates insights, content, and recommendations on demand.', color: 'from-violet-500 to-violet-700' },
  { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Live KPI dashboard with MRR, conversion rates, EBITDA margin, churn tracking, and 6-month revenue forecasts.', color: 'from-emerald-500 to-emerald-700' },
  { icon: Zap, title: 'Automated Workflows', desc: '5 active schedules running daily, weekly, monthly, and continuous. Bot execution, health checks, reporting — no human needed.', color: 'from-amber-500 to-amber-700' },
  { icon: Shield, title: 'Revenue Resilience', desc: 'Multi-rail payment system (Stripe, Shopier, Shopify). Automatic failover, duplicate detection, webhook reconciliation.', color: 'from-rose-500 to-rose-700' },
  { icon: Crown, title: 'Org Intelligence', desc: '4-level hierarchy: Directors → Commanders → Managers → Operators. Self-managing teams with AI coordination.', color: 'from-indigo-500 to-indigo-700' },
];

const STATS = [
  { value: '$28K+', label: 'Avg MRR After Optimization', icon: DollarSign },
  { value: '94%', label: 'Payment Success Rate', icon: Shield },
  { value: '72hr', label: 'Average Activation Time', icon: Clock },
  { value: '4.9/5', label: 'Client Satisfaction', icon: Star },
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Audit', subtitle: 'We analyze your stack', desc: 'We plug into your existing systems — Stripe, webhooks, analytics — and run a full diagnostic. You get a complete map of revenue leaks and optimization opportunities.', color: 'from-[#6F42C1] to-[#4C2882]' },
  { step: 2, title: 'Optimize', subtitle: 'AI deploys fixes', desc: 'Our engine automatically configures payment flows, sets up monitoring, and generates your custom playbook. No manual integration headaches.', color: 'from-amber-500 to-amber-700' },
  { step: 3, title: 'Scale', subtitle: 'Your system runs itself', desc: 'Automated workflows, health checks, and AI-driven recommendations keep your revenue engine running 24/7. You focus on growth, not firefighting.', color: 'from-emerald-500 to-emerald-700' },
];

// ─── Hooks ──────────────────────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  return { ref, count };
}

// ─── Reusable Components ────────────────────────────────────────────────────────

const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
  const { ref, visible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const SectionHeader: React.FC<{ title: string; highlight: string; subtitle?: string }> = ({ title, highlight, subtitle }) => (
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-4">
      {title}{' '}
      <span className="bg-gradient-to-r from-[#a78bfa] via-[#6F42C1] to-[#4C2882] bg-clip-text text-transparent">
        {highlight}
      </span>
    </h2>
    {subtitle && <p className="text-base md:text-lg text-[#a8a29e] max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
  </div>
);

// ─── Main Component ─────────────────────────────────────────────────────────────

export const HomePage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
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
      }
    } catch (err) {
      console.error('Purchase error:', err);
    }
    setPurchasing(null);
  };

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenu(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0a09] text-[#fafaf9] overflow-x-hidden">

      {/* ─── NAV ────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0c0a09]/90 backdrop-blur-xl border-b border-[#44403c]/40 shadow-lg shadow-black/20'
          : 'bg-gradient-to-b from-black/40 to-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6F42C1] to-[#4C2882] flex items-center justify-center shadow-lg shadow-[#6F42C1]/30 group-hover:shadow-[#6F42C1]/50 transition-shadow duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                <span className="text-white font-display font-bold text-sm relative z-10">AX</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base text-[#fafaf9] tracking-tight leading-tight">
                  Autonoma<span className="text-[#a78bfa]">-X</span>
                </span>
                <span className="text-[10px] text-[#78716c] tracking-widest uppercase hidden sm:block">AI Operations Engine</span>
              </div>
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: 'How It Works', target: 'how-it-works' },
                { label: 'Features', target: 'features' },
                { label: 'Pricing', target: 'tiers' },
                { label: 'Results', target: 'testimonials' },
                { label: 'FAQ', target: 'faq' },
              ].map((item) => (
                <button
                  key={item.target}
                  onClick={() => scrollTo(item.target)}
                  className="text-sm text-[#a8a29e] hover:text-[#fafaf9] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#6F42C1] after:transition-all hover:after:w-full"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo('tiers')}
                className="bg-[#6F42C1] hover:bg-[#5a35a8] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-[#6F42C1]/25 hover:shadow-[#6F42C1]/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
              </button>
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden relative z-50 p-2 text-[#a8a29e] hover:text-[#fafaf9]">
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden fixed inset-0 bg-[#0c0a09]/98 backdrop-blur-xl z-40 transition-all duration-300 ${
          mobileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
            {[
              { label: 'How It Works', target: 'how-it-works' },
              { label: 'Features', target: 'features' },
              { label: 'Pricing', target: 'tiers' },
              { label: 'Results', target: 'testimonials' },
              { label: 'FAQ', target: 'faq' },
            ].map((item) => (
              <button
                key={item.target}
                onClick={() => scrollTo(item.target)}
                className="text-xl font-display text-[#a8a29e] hover:text-[#fafaf9] transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('tiers')}
              className="mt-4 bg-[#6F42C1] text-white font-semibold px-10 py-3.5 rounded-xl text-lg shadow-xl shadow-[#6F42C1]/25"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Hero background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-gradient-to-b from-[#6F42C1]/8 via-[#4C2882]/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-[#d97706]/8 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-[#6F42C1]/8 to-transparent rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-24 pb-16">
          <div className="max-w-4xl mx-auto text-center">

            {/* Badge */}
            <Reveal delay={0}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6F42C1]/10 border border-[#6F42C1]/20 text-xs sm:text-sm text-[#a78bfa] mb-6 sm:mb-8 backdrop-blur-sm">
                <Sparkles size={14} className="text-[#a78bfa]" />
                <span className="font-medium">AI-Native Business Operations Engine</span>
              </div>
            </Reveal>

            {/* Headline */}
            <Reveal delay={100}>
              <h1 className="text-[clamp(2.25rem,6vw,4.5rem)] font-display font-bold tracking-tight leading-[1.05] mb-4 sm:mb-6">
                Your Business,{' '}
                <span className="bg-gradient-to-r from-[#c4a7ff] via-[#a78bfa] to-[#6F42C1] bg-clip-text text-transparent">
                  Fully Automated
                </span>
                <br />
                for Maximum Revenue
              </h1>
            </Reveal>

            {/* Subheadline */}
            <Reveal delay={200}>
              <p className="text-base sm:text-lg md:text-xl text-[#a8a29e] max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
                Autonoma-X combines AI-powered operations with proven revenue systems.
                We deploy a self-improving engine that finds gaps, fixes flows, and drives growth.
                <span className="text-[#fafaf9] font-medium"> 24/7. No downtime.</span>
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => scrollTo('tiers')}
                  className="group bg-gradient-to-r from-[#6F42C1] to-[#5a35a8] hover:from-[#5a35a8] hover:to-[#4C2882] text-white font-semibold px-6 sm:px-8 py-3.5 rounded-xl text-base sm:text-lg transition-all shadow-xl shadow-[#6F42C1]/30 hover:shadow-[#6F42C1]/50 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                >
                  See Plans & Pricing
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="border border-[#44403c]/60 hover:border-[#6F42C1]/50 bg-[#292524]/30 hover:bg-[#292524]/60 text-[#fafaf9] font-medium px-6 sm:px-8 py-3.5 rounded-xl text-base sm:text-lg transition-all flex items-center gap-2 backdrop-blur-sm"
                >
                  <Play size={16} /> See How It Works
                </button>
              </div>
            </Reveal>

            {/* Trust / Social Proof Bar */}
            <Reveal delay={400}>
              <div className="mt-10 sm:mt-14 p-4 sm:p-6 rounded-2xl bg-[#1c1917]/50 border border-[#44403c]/30 backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                  {/* Star rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-[#d97706] text-[#d97706]" />
                      ))}
                    </div>
                    <span className="text-sm text-[#a8a29e]">
                      <span className="text-[#fafaf9] font-medium">4.9</span>/5 from 23+ reviews
                    </span>
                  </div>
                  <span className="hidden sm:block text-[#44403c]">|</span>
                  {/* Active users */}
                  <div className="flex items-center gap-2 text-sm text-[#a8a29e]">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6F42C1] to-[#4C2882] border-2 border-[#0c0a09] flex items-center justify-center">
                          <span className="text-[8px] font-bold text-white">A{i + 1}</span>
                        </div>
                      ))}
                    </div>
                    <span><span className="text-[#fafaf9] font-medium">47</span> operators activated this week</span>
                  </div>
                  <span className="hidden sm:block text-[#44403c]">|</span>
                  {/* Live */}
                  <span className="flex items-center gap-2 text-sm text-[#10b981]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
                    </span>
                    Stripe LIVE Mode
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Trust badges */}
            <Reveal delay={500}>
              <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-[#78716c]">
                <span className="flex items-center gap-1.5"><Shield size={12} /> Stripe Certified</span>
                <span className="flex items-center gap-1.5"><Lock size={12} /> 256-bit Encrypted</span>
                <span className="flex items-center gap-1.5"><Brain size={12} /> AI-Powered</span>
                <span className="flex items-center gap-1.5"><Globe size={12} /> Global Infrastructure</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM / AGITATION ─────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#1c1917]/40 border-y border-[#44403c]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs sm:text-sm text-red-400 mb-4">
                <Activity size={14} /> Revenue Leaks Are Costing You
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight mb-4">
                Your systems are leaving{' '}
                <span className="text-red-400">money on the table</span>
              </h2>
              <p className="text-sm sm:text-base text-[#a8a29e] max-w-2xl mx-auto leading-relaxed">
                Broken payment flows, unmonitored pipelines, and manual processes silently drain revenue every day.
                Most teams don't discover these gaps until it's too late.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {[
                { icon: Zap, label: 'Unreliable payments', desc: 'Failed transactions, missed webhooks, reconciliation delays costing 5-15% of revenue' },
                { icon: BarChart3, label: 'Blind operations', desc: 'No real-time visibility into pipeline health, conversion rates, or churn signals' },
                { icon: Clock, label: 'Manual firefighting', desc: 'Teams spending 40%+ of their week on repetitive ops tasks instead of growth' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="p-5 rounded-xl bg-[#292524]/40 border border-[#44403c]/40">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
                      <Icon size={18} className="text-red-400" />
                    </div>
                    <h3 className="font-display font-semibold text-sm sm:text-base text-[#fafaf9] mb-1">{item.label}</h3>
                    <p className="text-xs sm:text-sm text-[#a8a29e]">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <button onClick={() => scrollTo('tiers')}
                className="inline-flex items-center gap-2 text-sm text-[#a78bfa] hover:text-[#c4a7ff] transition-colors font-medium"
              >
                Fix your revenue leaks now <ChevronRight size={14} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── STATS BAND ──────────────────────────────────────── */}
      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Reveal key={i} delay={i * 100}>
                  <div className="text-center group">
                    <div className="w-11 h-11 rounded-xl bg-[#6F42C1]/10 border border-[#6F42C1]/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#6F42C1]/20 transition-colors">
                      <Icon size={20} className="text-[#a78bfa]" />
                    </div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-[#fafaf9] mb-1">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-[#a8a29e]">{stat.label}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-[#1c1917]/30 border-y border-[#44403c]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader title="How It" highlight="Works" subtitle="From audit to autonomous ops in three phases. No downtime, no disruption." />
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-[2px] bg-gradient-to-r from-[#6F42C1]/30 via-[#d97706]/30 to-[#10b981]/30 -translate-y-1/2" />

            {HOW_IT_WORKS.map((item, i) => {
              const Icon = [Target, RefreshCw, Rocket][i];
              return (
                <Reveal key={i} delay={i * 150}>
                  <div className="relative flex flex-col items-center text-center group">
                    {/* Step circle */}
                    <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} p-0.5 mb-6 shadow-xl group-hover:scale-105 transition-transform duration-300`}>
                      <div className="w-full h-full rounded-2xl bg-[#1c1917] flex items-center justify-center">
                        <Icon size={24} className={`bg-gradient-to-br ${item.color} bg-clip-text text-transparent`} />
                      </div>
                      {/* Step number */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#6F42C1] border-2 border-[#0c0a09] flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">{item.step}</span>
                      </div>
                    </div>
                    {/* Content */}
                    <h3 className="font-display font-bold text-lg sm:text-xl text-[#fafaf9] mb-1">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-[#a78bfa] font-medium mb-3">{item.subtitle}</p>
                    <p className="text-xs sm:text-sm text-[#a8a29e] leading-relaxed max-w-xs">{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ────────────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader title="The Autonoma-X" highlight="Engine" subtitle="Six integrated modules that work together as a self-improving revenue system." />
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <Reveal key={i} delay={i * 80}>
                  <div className="group p-6 sm:p-7 rounded-xl bg-[#1c1917] border border-[#44403c]/50 hover:border-[#6F42C1]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#6F42C1]/5 hover:-translate-y-0.5">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feat.color} p-2.5 mb-4 shadow-lg shadow-black/20 group-hover:scale-105 transition-transform`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <h3 className="font-display font-semibold text-base sm:text-lg text-[#fafaf9] mb-2">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-[#a8a29e] leading-relaxed">{feat.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── PRICING TIERS ────────────────────────────────────── */}
      <section id="tiers" className="py-20 sm:py-24 bg-gradient-to-b from-[#1c1917]/50 to-[#0c0a09] border-y border-[#44403c]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader title="Choose Your" highlight="Growth Tier" subtitle="One-time payments. No hidden fees. Start small, scale up." />
          </Reveal>

          {/* Email input (subtle, integrated) */}
          <Reveal delay={100}>
            <div className="max-w-sm mx-auto mb-12">
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716c]" />
                <input
                  type="email"
                  placeholder="Work email for delivery & updates"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#292524]/80 border-[#44403c]/60 text-sm rounded-xl focus:border-[#6F42C1]/50 focus:ring-1 focus:ring-[#6F42C1]/20 transition-all"
                />
              </div>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto items-start">
            {TIERS.map((tier, index) => {
              const isPopular = tier.popular;
              return (
                <Reveal key={tier.id} delay={index * 120}>
                  <div className={`relative rounded-2xl p-6 sm:p-7 transition-all duration-300 ${
                    isPopular
                      ? 'bg-gradient-to-b from-[#1c1917] to-[#1c1917] border-2 border-[#6F42C1]/60 shadow-xl shadow-[#6F42C1]/15 scale-[1.02] md:scale-105'
                      : 'bg-[#1c1917] border border-[#44403c]/50 hover:border-[#6F42C1]/30'
                  }`}>
                    {/* Popular badge */}
                    {isPopular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#6F42C1] to-[#a78bfa] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-[#6F42C1]/30">
                          <Crown size={12} />
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Tier header */}
                    <div className="text-center mb-5 pt-1">
                      <h3 className="font-display text-lg font-bold text-[#fafaf9] mb-0.5">{tier.name}</h3>
                      <p className="text-xs text-[#a8a29e]">{tier.description}</p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-5">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl sm:text-4xl font-display font-bold text-[#fafaf9]">${tier.price}</span>
                        <span className="text-xs text-[#78716c]">one-time</span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-[#a78bfa] mt-1 font-medium">{tier.highlight}</p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2.5 mb-7">
                      {tier.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={10} className="text-[#10b981]" />
                          </div>
                          <span className={`text-xs sm:text-sm ${isPopular ? 'text-[#e4e4e4]' : 'text-[#d4d4d4]'}`}>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button
                      onClick={() => handlePurchase(tier)}
                      disabled={purchasing === tier.id}
                      className={`w-full py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-lg ${
                        purchasing === tier.id
                          ? 'bg-[#292524] text-[#78716c] cursor-wait'
                          : isPopular
                            ? 'bg-gradient-to-r from-[#6F42C1] to-[#5a35a8] text-white hover:shadow-xl hover:shadow-[#6F42C1]/30 hover:scale-[1.02] active:scale-[0.98]'
                            : 'bg-[#292524] hover:bg-[#44403c] text-[#fafaf9] border border-[#44403c]/60 hover:border-[#6F42C1]/30'
                      }`}
                    >
                      {purchasing === tier.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <RefreshCw size={14} className="animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        tier.cta
                      )}
                    </button>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Guarantee badges */}
          <Reveal delay={400}>
            <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-[#78716c]">
              <span className="flex items-center gap-2">
                <Shield size={14} className="text-[#10b981]" />
                7-Day Delivery Guarantee or Full Refund
              </span>
              <span className="flex items-center gap-2">
                <Lock size={14} className="text-[#10b981]" />
                256-bit Encrypted Checkout
              </span>
              <span className="flex items-center gap-2">
                <Award size={14} className="text-[#d97706]" />
                Instant Digital Delivery
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────── */}
      <section id="testimonials" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader title="Real Results from" highlight="Real Teams" subtitle="Teams using Autonoma-X see measurable improvements in weeks, not months." />
          </Reveal>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="p-6 sm:p-7 rounded-xl bg-[#1c1917] border border-[#44403c]/50 hover:border-[#44403c]/80 transition-all duration-300 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-[#d97706] text-[#d97706]" />
                    ))}
                  </div>
                  {/* Quote */}
                  <div className="relative flex-1">
                    <Quote size={16} className="absolute -top-1 -left-1 text-[#6F42C1]/20" />
                    <p className="text-xs sm:text-sm text-[#d4d4d4] leading-relaxed italic pl-3">{t.text}</p>
                  </div>
                  {/* Author */}
                  <div className="mt-5 pt-4 border-t border-[#44403c]/40 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#fafaf9]">{t.name}</p>
                      <p className="text-xs text-[#78716c]">{t.role}</p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#10b981] bg-[#10b981]/10 px-2.5 py-1 rounded-full">
                      <TrendingUp size={11} /> {t.result}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────── */}
      <section id="faq" className="py-20 sm:py-24 bg-[#1c1917]/30 border-y border-[#44403c]/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader title="Frequently Asked" highlight="Questions" />
          </Reveal>

          <div className="space-y-2.5">
            {FAQS.map((faq, i) => {
              const open = expandedFaq === i;
              return (
                <Reveal key={i} delay={i * 60}>
                  <div className="rounded-xl bg-[#1c1917] border border-[#44403c]/40 overflow-hidden transition-all duration-200">
                    <button
                      onClick={() => setExpandedFaq(open ? null : i)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
                    >
                      <span className="text-xs sm:text-sm font-medium text-[#fafaf9] pr-4">{faq.q}</span>
                      <ChevronDown size={15} className={`text-[#78716c] transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                        <p className="text-xs sm:text-sm text-[#a8a29e] leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#6F42C1]/10 to-[#d97706]/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-4">
              Ready to <span className="bg-gradient-to-r from-[#a78bfa] via-[#6F42C1] to-[#4C2882] bg-clip-text text-transparent">Automate</span> Your Revenue?
            </h2>
            <p className="text-sm sm:text-base text-[#a8a29e] mb-8 max-w-xl mx-auto leading-relaxed">
              Join companies already running on Autonoma-X. Start with Diagnostic and upgrade as you grow.
            </p>
            <button
              onClick={() => scrollTo('tiers')}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#6F42C1] to-[#4C2882] hover:from-[#5a35a8] hover:to-[#3d2070] text-white font-semibold px-8 sm:px-10 py-4 rounded-xl text-base sm:text-lg transition-all shadow-xl shadow-[#6F42C1]/25 hover:shadow-[#6F42C1]/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-[#44403c]/40 bg-[#1c1917]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6F42C1] to-[#4C2882] flex items-center justify-center">
                <span className="text-white font-display font-bold text-xs">AX</span>
              </div>
              <div>
                <span className="font-display font-semibold text-xs sm:text-sm text-[#fafaf9]">
                  Autonoma-X Engine
                </span>
                <span className="text-[10px] sm:text-xs text-[#78716c] block sm:inline sm:ml-2">v3.2.1</span>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-xs text-[#78716c]">
              <span className="flex items-center gap-1.5">
                <Shield size={11} className="text-[#10b981]" />
                Stripe LIVE
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <Brain size={11} className="text-[#6F42C1]" />
                AI-Powered
              </span>
              <span className="hidden sm:inline">•</span>
              <span>© 2026 Autonoma-X</span>
            </div>
          </div>

          {/* Legal links */}
          <div className="mt-6 pt-6 border-t border-[#44403c]/20 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[10px] sm:text-xs text-[#78716c]">
            <button className="hover:text-[#a8a29e] transition-colors">Privacy Policy</button>
            <button className="hover:text-[#a8a29e] transition-colors">Terms of Service</button>
            <button className="hover:text-[#a8a29e] transition-colors">Refund Policy</button>
            <span className="text-[#44403c]">|</span>
            <span>Built for operators. Everywhere.</span>
          </div>
        </div>
      </footer>

      {/* ─── MOBILE STICKY CTA ────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-gradient-to-t from-[#0c0a09] via-[#0c0a09]/95 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={() => scrollTo('tiers')}
            className="w-full bg-gradient-to-r from-[#6F42C1] to-[#5a35a8] text-white font-semibold py-3.5 rounded-xl text-sm shadow-xl shadow-[#6F42C1]/30 active:scale-[0.98] transition-transform"
          >
            View Plans & Pricing
          </button>
        </div>
      </div>

      {/* Spacer for mobile sticky CTA */}
      <div className="h-[72px] md:hidden" />
    </div>
  );
};

export default HomePage;
