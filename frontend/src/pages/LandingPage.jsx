import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Globe, 
  Lock, 
  BarChart3, 
  ChevronRight,
  Headphones,
  Sparkles,
  Star,
  Users,
  Layers,
  Clock,
  ArrowUpRight,
  Check,
  Phone,
  Mail,
  MapPin,
  Sliders,
  DollarSign,
  Briefcase,
  ExternalLink
} from 'lucide-react';

export default function LandingPage({ onNavigate, onOpenDeposit }) {
  const { prices } = useTrading();
  const { user } = useAuth();
  const [activeMarketTab, setActiveMarketTab] = useState('all');

  // Interactive Live Symbol for the Hero Card
  const [selectedHeroSymbol, setSelectedHeroSymbol] = useState('EUR/USD');
  const heroQuote = prices[selectedHeroSymbol] || {
    symbol: selectedHeroSymbol,
    bid: 1.0854,
    ask: 1.08555,
    spread: 0.00015,
    change24h: '+0.42',
    high: 1.0890,
    low: 1.0820
  };

  const marketAssets = [
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', cat: 'forex', spread: '0.1 pips', leverage: '1:500', popular: true },
    { symbol: 'GBP/USD', name: 'British Pound / USD', cat: 'forex', spread: '0.2 pips', leverage: '1:500', popular: false },
    { symbol: 'USD/JPY', name: 'US Dollar / Yen', cat: 'forex', spread: '0.2 pips', leverage: '1:500', popular: false },
    { symbol: 'XAU/USD', name: 'Gold / US Dollar', cat: 'commodities', spread: '0.35 pips', leverage: '1:200', popular: true },
    { symbol: 'USOIL', name: 'WTI Crude Oil', cat: 'commodities', spread: '0.05 pips', leverage: '1:100', popular: false },
    { symbol: 'BTC/USDT', name: 'Bitcoin / Tether', cat: 'crypto', spread: '12.00', leverage: '1:100', popular: true },
    { symbol: 'ETH/USDT', name: 'Ethereum / Tether', cat: 'crypto', spread: '1.20', leverage: '1:100', popular: false },
    { symbol: 'US30', name: 'Dow Jones 30', cat: 'indices', spread: '2.5 pts', leverage: '1:200', popular: true },
    { symbol: 'NAS100', name: 'Nasdaq 100', cat: 'indices', spread: '1.8 pts', leverage: '1:200', popular: true }
  ];

  const filteredAssets = activeMarketTab === 'all' 
    ? marketAssets 
    : marketAssets.filter(item => item.cat === activeMarketTab);

  const testimonials = [
    {
      name: 'Alexander Wright',
      role: 'Full-Time Algorithmic Trader',
      location: 'London, United Kingdom',
      flag: '🇬🇧',
      rating: 5,
      comment: 'Aventra FX has the fastest execution speeds I have tested in the industry. The 0.0 pip raw spreads on EUR/USD and Gold save me thousands in slippage every month.',
      pnl: '+$48,250 YTD',
      verified: true
    },
    {
      name: 'Tariq Al-Mansoor',
      role: 'Private Portfolio Manager',
      location: 'Dubai, United Arab Emirates',
      flag: '🇦🇪',
      rating: 5,
      comment: 'The WebTrader interface with TradingView integration is phenomenal. Instant deposits via USDT TRC20 and priority wire withdrawals make fund management effortless.',
      pnl: '+$92,100 YTD',
      verified: true
    },
    {
      name: 'Rahul Sharma',
      role: 'Intraday FX & Crypto Trader',
      location: 'Mumbai, India',
      flag: '🇮🇳',
      rating: 5,
      comment: 'Customer support answered in less than 30 seconds when I needed assistance. The leverage, negative balance protection, and zero deposit fees make Aventra FX my top broker.',
      pnl: '+$19,400 YTD',
      verified: true
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 px-4 bg-gradient-to-b from-blue-50/60 via-slate-50/40 to-white border-b border-slate-200/80 overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-br from-blue-400/10 via-indigo-300/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-[-100px] w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="text-blue-700 text-xs font-bold tracking-wide">
                Next-Gen Multi-Asset Broker Platform
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 text-xs font-medium">Raw Spreads from 0.0 Pips</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
              Trade Global Markets with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
                Aventra FX
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl">
              Access over 100+ global financial instruments across <strong className="text-slate-800 font-semibold">Forex, Gold, Oil, Crypto & US Indices</strong> with institutional liquidity, ultra-low latency execution, and up to <strong className="text-slate-800 font-semibold">1:500 leverage</strong>.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={() => onNavigate(user ? 'trade' : 'register')}
                className="flex items-center space-x-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base px-8 py-4 rounded-xl shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>{user ? 'Launch WebTrader Terminal' : 'Open Live Trading Account'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => onNavigate('trade')}
                className="flex items-center space-x-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-base px-7 py-4 rounded-xl shadow-sm hover:border-slate-400 transition-all"
              >
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Try Free Demo Terminal</span>
              </button>
            </div>

            {/* Key Trust Checkmarks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs text-slate-600 font-medium">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tier-1 Segregated Funds</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>0% Deposit Fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Negative Balance Protection</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24/7 Priority Support</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Tech Interactive Trading Terminal Card */}
          <div className="lg:col-span-5 relative">
            
            {/* Decorative Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>

            <div className="relative bg-white border border-slate-200/90 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-6">
              
              {/* Header of the Terminal Widget */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                    {selectedHeroSymbol.split('/')[0]}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{selectedHeroSymbol}</h3>
                    <span className="text-xs text-slate-500 font-medium">Real-Time Market Quote</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Spread {(heroQuote.spread || 0.00015).toString()}</span>
                </div>
              </div>

              {/* Symbol Quick Selectors */}
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {['EUR/USD', 'XAU/USD', 'BTC/USDT', 'US30'].map((sym) => (
                  <button
                    key={sym}
                    onClick={() => setSelectedHeroSymbol(sym)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      selectedHeroSymbol === sym
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>

              {/* Live Bid & Ask Quote Display */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center transition-all hover:border-rose-300">
                  <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">SELL / BID</span>
                  <div className="text-2xl font-black text-rose-600 font-mono mt-0.5">
                    {heroQuote.bid ? heroQuote.bid.toFixed(selectedHeroSymbol.includes('JPY') ? 3 : selectedHeroSymbol.includes('USD') && !selectedHeroSymbol.includes('XAU') ? 5 : 2) : '1.08540'}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Low: {heroQuote.low || '1.0820'}</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center transition-all hover:border-emerald-300">
                  <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">BUY / ASK</span>
                  <div className="text-2xl font-black text-emerald-600 font-mono mt-0.5">
                    {heroQuote.ask ? heroQuote.ask.toFixed(selectedHeroSymbol.includes('JPY') ? 3 : selectedHeroSymbol.includes('USD') && !selectedHeroSymbol.includes('XAU') ? 5 : 2) : '1.08555'}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">High: {heroQuote.high || '1.0890'}</span>
                </div>
              </div>

              {/* Live Execution Callout */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-500 font-medium block">Default Leverage</span>
                  <span className="text-slate-900 font-extrabold text-sm">1:500 ECN Liquidity</span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-slate-500 font-medium block">Execution Latency</span>
                  <span className="text-emerald-700 font-extrabold text-sm flex items-center gap-1 justify-end">
                    <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" /> &lt;12ms
                  </span>
                </div>
              </div>

              {/* One Click WebTrader CTA */}
              <button
                onClick={() => onNavigate('trade')}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <span>Launch Live Terminal with {selectedHeroSymbol}</span>
                <ArrowUpRight className="w-4 h-4 text-blue-400" />
              </button>

              {/* Floating Verified Badge */}
              <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-500 font-medium pt-1">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>SSL 256-bit Encrypted Banking Grade Security</span>
              </div>

            </div>
          </div>

        </div>

        {/* Global Key Metrics / Stats Counter Bar */}
        <div className="max-w-7xl mx-auto mt-16 pt-10 border-t border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-3xl lg:text-4xl font-black text-slate-900 font-mono tracking-tight">$18.4B+</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Monthly Trading Volume</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-3xl lg:text-4xl font-black text-blue-600 font-mono tracking-tight">140,000+</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Active Global Traders</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-3xl lg:text-4xl font-black text-emerald-600 font-mono tracking-tight">0.0 Pips</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Raw Interbank Spreads</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-3xl lg:text-4xl font-black text-slate-900 font-mono tracking-tight">&lt; 12ms</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Ultra-Fast Execution</div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
              <div className="text-3xl lg:text-4xl font-black text-amber-500 font-mono tracking-tight">0% Fee</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Deposits & Withdrawals</div>
            </div>

          </div>
        </div>

      </section>

      {/* 2. WHY TRADE WITH AVENTRA FX / ADVANTAGES */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
            Institutional Standards
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Why Trade With <span className="text-blue-600">Aventra FX</span>
          </h2>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            Engineered for high-volume traders, scalpers, and institutional investors who demand zero compromises on speed, transparency, and liquidity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-blue-100/70 text-blue-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Ultra-Fast ECN Execution</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Equinix NY4 and LD4 cross-connected fiber-optic server networks ensure average execution speeds of under 12ms with zero requotes and minimal slippage.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">True 0.0 Pips Raw Spreads</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Direct access to top-tier global liquidity providers including Tier-1 banks, non-bank market makers, and dark pools with raw spreads starting from 0.0 pips.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100/70 text-indigo-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Tier-1 Segregated Accounts</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Client capital is held in segregated accounts at AAA-rated financial institutions. Your trading funds are never used for operational expenses or broker hedging.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-amber-100/70 text-amber-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sliders className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Dynamic Leverage up to 1:500</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Empower your portfolio with flexible leverage up to 1:500 on Forex pairs, 1:200 on Gold, and 1:100 on Crypto with customizable margin limits.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-rose-100/70 text-rose-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Negative Balance Protection</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Automated smart liquidation engine prevents account balances from going below zero during extreme flash crashes or high-impact economic news releases.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-cyan-100/70 text-cyan-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Headphones className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">24/7 Dedicated Support</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Connect immediately with our multilingual trading support specialists via live chat, telephone, and email for instant assistance at any hour.
            </p>
          </div>

        </div>
      </section>

      {/* 3. MULTI-ASSET MARKETS OVERVIEW */}
      <section className="py-20 px-4 bg-slate-50/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                100+ Global Markets
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                Trade Across Multiple Asset Classes
              </h2>
              <p className="text-slate-600 text-sm max-w-xl">
                Explore major, minor and exotic currencies, commodities, world indices, and top cryptocurrencies with tight spreads.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-2 bg-white border border-slate-200 p-1.5 rounded-xl shadow-xs self-start md:self-auto overflow-x-auto">
              {[
                { id: 'all', label: 'All Instruments' },
                { id: 'forex', label: 'Forex' },
                { id: 'commodities', label: 'Commodities' },
                { id: 'crypto', label: 'Crypto' },
                { id: 'indices', label: 'Indices' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMarketTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeMarketTab === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table / Grid of Assets */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Instrument</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Live Bid Price</th>
                    <th className="px-6 py-4">Live Ask Price</th>
                    <th className="px-6 py-4">Typical Spread</th>
                    <th className="px-6 py-4">Max Leverage</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredAssets.map((asset) => {
                    const quote = prices[asset.symbol];
                    const bid = quote ? quote.bid.toFixed(asset.symbol.includes('JPY') ? 3 : asset.symbol.includes('USD') && !asset.symbol.includes('XAU') ? 5 : 2) : '—';
                    const ask = quote ? quote.ask.toFixed(asset.symbol.includes('JPY') ? 3 : asset.symbol.includes('USD') && !asset.symbol.includes('XAU') ? 5 : 2) : '—';

                    return (
                      <tr key={asset.symbol} className="hover:bg-blue-50/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-xs text-blue-700">
                              {asset.symbol.slice(0, 3)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{asset.symbol}</span>
                              <span className="text-xs text-slate-400">{asset.name}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="capitalize px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                            {asset.cat}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-rose-600">
                          {bid}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-emerald-600">
                          {ask}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-blue-600">{asset.spread}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-700 font-bold">
                          {asset.leverage}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => onNavigate('trade')}
                            className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold transition-all"
                          >
                            <span>Trade</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SERVICES OFFERED & ACCOUNT TYPES */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
            Tailored Accounts
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Transparent Accounts For Every Trader
          </h2>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            Choose the account type tailored to your trading volume, style, and capital requirements with zero hidden markups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Plan 1: Standard Account */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-blue-700 uppercase tracking-wider px-3 py-1 rounded-md bg-blue-50">
                  BEGINNER FRIENDLY
                </span>
                <span className="text-xs text-slate-400 font-medium">Standard MT/Web</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900">Standard Account</h3>
              <p className="text-sm text-slate-500 mt-2">
                Designed for retail and developing traders who want simplicity with $0 commissions.
              </p>

              <div className="my-6 pt-6 border-t border-slate-100 space-y-4 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Minimum Deposit:</span>
                  <span className="font-extrabold text-slate-900">$100</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Spreads From:</span>
                  <span className="font-extrabold text-blue-600">0.8 Pips</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Trading Commission:</span>
                  <span className="font-extrabold text-emerald-600">$0 / Zero</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Leverage:</span>
                  <span className="font-extrabold text-slate-900">Up to 1:500</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Execution:</span>
                  <span className="font-extrabold text-slate-900">Market Execution</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Negative Balance Protection:</span>
                  <span className="font-extrabold text-emerald-600">Included</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('register')}
              className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-sm rounded-xl transition-colors mt-6"
            >
              Open Standard Account
            </button>
          </div>

          {/* Plan 2: Pro ECN (Most Popular) */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-blue-50/50 to-white border-2 border-blue-600 shadow-xl shadow-blue-600/10 flex flex-col justify-between relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
              MOST POPULAR CHOICE
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 pt-1">
                <span className="text-xs font-black text-emerald-700 uppercase tracking-wider px-3 py-1 rounded-md bg-emerald-50">
                  ACTIVE TRADERS
                </span>
                <span className="text-xs text-blue-600 font-bold">Ultra Low Cost</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900">Pro ECN Account</h3>
              <p className="text-sm text-slate-500 mt-2">
                Direct interbank liquidity and tightest spreads for active intraday scalpers and EA algorithms.
              </p>

              <div className="my-6 pt-6 border-t border-slate-200/80 space-y-4 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Minimum Deposit:</span>
                  <span className="font-extrabold text-slate-900">$500</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Spreads From:</span>
                  <span className="font-extrabold text-blue-600">0.1 Pips Raw</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Trading Commission:</span>
                  <span className="font-extrabold text-emerald-600">$0 Commission</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Leverage:</span>
                  <span className="font-extrabold text-slate-900">Up to 1:500</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Priority Withdrawals:</span>
                  <span className="font-extrabold text-emerald-600">Instant Approved</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">TradingView Pro Tools:</span>
                  <span className="font-extrabold text-emerald-600">Enabled</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('register')}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] mt-6"
            >
              Open Pro ECN Account
            </button>
          </div>

          {/* Plan 3: VIP Institutional */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-amber-700 uppercase tracking-wider px-3 py-1 rounded-md bg-amber-50">
                  HIGH NET WORTH
                </span>
                <span className="text-xs text-slate-400 font-medium">Bespoke Liquidity</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900">VIP Institutional</h3>
              <p className="text-sm text-slate-500 mt-2">
                Unrestricted institutional execution with deep order book visibility and dedicated account manager.
              </p>

              <div className="my-6 pt-6 border-t border-slate-100 space-y-4 text-sm">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Minimum Deposit:</span>
                  <span className="font-extrabold text-slate-900">$5,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Spreads From:</span>
                  <span className="font-extrabold text-blue-600">0.0 Pips Absolute</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Trading Commission:</span>
                  <span className="font-extrabold text-slate-900">$2.00 / lot</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Dedicated Account Manager:</span>
                  <span className="font-extrabold text-emerald-600">24/7 Dedicated</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Free NY4 VPS Server:</span>
                  <span className="font-extrabold text-emerald-600">Included</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Custom Liquidity Feed:</span>
                  <span className="font-extrabold text-slate-900">Available</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('register')}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-xl transition-colors mt-6"
            >
              Open VIP Institutional
            </button>
          </div>

        </div>
      </section>

      {/* 5. HOW TO GET STARTED (3 SIMPLE STEPS) */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
              Quick Onboarding
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Start Trading in <span className="text-blue-600">3 Easy Steps</span>
            </h2>
            <p className="text-slate-600 text-base max-w-xl mx-auto">
              Get your live account configured and funded within minutes with our streamlined registration process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative space-y-5 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/30">
                1
              </div>
              <h3 className="text-xl font-black text-slate-900">Register in 60 Seconds</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Fill in basic credentials to create your secure trader profile. Your live dashboard is provisioned instantly with $10,000 demo practice balance.
              </p>
              <div className="pt-2 text-xs font-bold text-blue-600 flex items-center gap-1">
                <span>Fast & Paperless</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative space-y-5 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/30">
                2
              </div>
              <h3 className="text-xl font-black text-slate-900">Verify KYC & Fund Wallet</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Submit your verification document for instant compliance approval. Deposit funds via USDT TRC20, Bank Wire, or instant UPI with 0% fees.
              </p>
              <div className="pt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
                <span>0% Commission Deposit</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative space-y-5 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/30">
                3
              </div>
              <h3 className="text-xl font-black text-slate-900">Execute on WebTrader</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Open the institutional WebTrader terminal directly in your web browser. Place Buy/Sell orders, configure Stop Loss & Take Profit, and profit.
              </p>
              <div className="pt-2 text-xs font-bold text-blue-600 flex items-center gap-1">
                <span>Immediate Live Market Access</span>
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

          {/* CTA Banner inside Get Started */}
          <div className="mt-14 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-2xl font-black">Ready to elevate your trading experience?</h4>
              <p className="text-blue-100 text-sm">Join over 140,000+ traders globally on the Aventra FX platform.</p>
            </div>
            <button
              onClick={() => onNavigate(user ? 'trade' : 'register')}
              className="bg-white text-blue-700 hover:bg-blue-50 font-black text-sm px-8 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105 shrink-0"
            >
              Get Started Now
            </button>
          </div>

        </div>
      </section>

      {/* 6. OUR CLIENT REVIEWS / TESTIMONIALS */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center space-x-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs font-extrabold text-slate-700 ml-2">4.9 / 5.0 Rating (12,000+ Reviews)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Trusted by Professional Traders Worldwide
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto">
            Discover why retail and institutional traders choose Aventra FX for day trading, scalping, and portfolio growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 space-x-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                    {item.pnl}
                  </span>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center space-x-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                  {item.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-slate-900 text-sm">{item.name}</span>
                    <span>{item.flag}</span>
                  </div>
                  <span className="text-xs text-slate-500 block">{item.role}</span>
                  <span className="text-[11px] text-blue-600 font-medium">{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CONTACT US & GLOBAL SUPPORT SECTION */}
      <section className="py-20 px-4 bg-slate-50/60 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                24/7 Global Desk
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                We’re Here to Support Your Trading Journey
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Have questions regarding deposits, custom leverage, or corporate institutional accounts? Our dedicated trading specialists are on standby around the clock.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Direct Broker Email</span>
                    <span className="text-sm font-bold text-slate-800">support@aventrafx.com</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Global Trading Hotline</span>
                    <span className="text-sm font-bold text-slate-800">+44 20 7946 0912 / +971 4 319 8200</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Registered Global Headquarters</span>
                    <span className="text-sm font-bold text-slate-800">One Canada Square, Canary Wharf, London, E14 5AA, UK</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Inquiry Card */}
            <div className="lg:col-span-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-5">
              <h3 className="text-xl font-black text-slate-900">Request Broker Consultation</h3>
              <p className="text-xs text-slate-500">
                Leave your query below and our institutional account manager will contact you within 15 minutes.
              </p>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm shadow-xs transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="trader@domain.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm shadow-xs transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Estimated Deposit</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm shadow-xs transition-all cursor-pointer">
                      <option className="bg-white text-slate-900" value="100-1000">$100 - $1,000</option>
                      <option className="bg-white text-slate-900" value="1000-10000">$1,000 - $10,000</option>
                      <option className="bg-white text-slate-900" value="10000-50000">$10,000 - $50,000</option>
                      <option className="bg-white text-slate-900" value="50000+">$50,000+ (VIP Institutional)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Message / Requirements</label>
                  <textarea 
                    rows={3} 
                    placeholder="Tell us about your trading style or requirements..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm resize-none shadow-xs transition-all"
                  ></textarea>
                </div>

                <button
                  type="button"
                  onClick={() => alert('Thank you! An Aventra FX account manager will contact you shortly.')}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01]"
                >
                  Submit Inquiry
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. REVAMPED LIGHT THEME COMPREHENSIVE FOOTER */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 px-4 text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
                A
              </div>
              <span className="text-xl font-black text-white tracking-wider">
                AVENTRA<span className="text-blue-400">FX</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Aventra FX is a premier global multi-asset CFD and Forex broker providing interbank raw liquidity, negative balance protection, and institutional WebTrader access to traders in over 120 countries.
            </p>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div>Global Offices: London • Dubai • Singapore • Sydney</div>
              <div>License & Regulation: Tier-1 Segregated Accounts Verified</div>
            </div>
          </div>

          {/* Col 2: Trading Markets */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Trading Markets</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('trade')}>Forex Currencies (EUR/USD)</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('trade')}>Precious Metals (Gold & Silver)</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('trade')}>Crude Oil & Energy (WTI)</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('trade')}>Crypto CFDs (BTC, ETH, SOL)</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('trade')}>Global Indices (US30, NAS100)</li>
            </ul>
          </div>

          {/* Col 3: Platforms & Tools */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Platforms & Tools</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('trade')}>WebTrader Terminal</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('trade')}>TradingView Charting</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate(user ? 'dashboard' : 'login')}>Client Portal & Wallet</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('register')}>Free $10,000 Demo Account</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate(user && user.role === 'admin' ? 'admin' : 'login')}>Broker Backoffice CRM</li>
            </ul>
          </div>

          {/* Col 4: Account & Safety */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4">Account Safety</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>Segregated Bank Accounts</li>
              <li>Negative Balance Guarantee</li>
              <li>AML & KYC Verification</li>
              <li>SSL 256-bit Encryption</li>
              <li>Instant TRC20 Deposits</li>
            </ul>
          </div>

        </div>

        {/* Regulatory Risk Disclaimer */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-slate-400 text-[11px] leading-relaxed space-y-3">
          <p>
            <strong className="text-slate-300">High Risk Investment Notice:</strong> Trading Contracts for Difference (CFDs) and foreign exchange (Forex) on margin carries a high level of risk, and may not be suitable for all investors. High leverage can work against you as well as for you. Before deciding to trade CFDs with Aventra FX, you should carefully consider your investment objectives, level of experience, and risk appetite. There is a possibility that you could sustain a loss of some or all of your invested funds.
          </p>
          <p>
            Aventra FX does not provide services for residents of certain jurisdictions including the United States, North Korea, and Iran.
          </p>
        </div>

        {/* Copyright & Legal Links */}
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © 2026 Aventra FX Global Ltd. All Rights Reserved.
          </div>
          <div className="flex space-x-6 text-slate-400">
            <span className="hover:text-white cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Risk Disclosure</span>
            <span className="hover:text-white cursor-pointer">Security & KYC</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
