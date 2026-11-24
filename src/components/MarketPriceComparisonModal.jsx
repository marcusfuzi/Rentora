import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Tag,
  ArrowRight,
  ExternalLink,
  Percent,
  Sparkles,
  ShoppingBag,
  Zap,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  Award,
  Clock,
  ArrowUpRight,
  Check,
  Bell,
  LineChart,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useRentora } from '../context/RentoraContext';
import { formatINR } from '../data/rentoraData';
import { getLiveRetailComparison } from '../utils/pricingComparison';

export default function MarketPriceComparisonModal() {
  const {
    isComparisonModalOpen,
    comparisonProduct,
    closeComparisonModal,
    openProductDetail,
    openRazorpayCheckout,
    currentUser,
    addPriceAlert,
    setIsDashboardOpen,
    addToast
  } = useRentora();

  const [activeTab, setActiveTab] = useState('comparison'); // 'comparison' | 'history' | 'decision' | 'alert'
  const [simulatedDuration, setSimulatedDuration] = useState(7); // default 7 days
  const [targetAlertPrice, setTargetAlertPrice] = useState('');
  const [alertEmail, setAlertEmail] = useState(currentUser?.email || '');
  const [alertSet, setAlertSet] = useState(false);

  if (!isComparisonModalOpen || !comparisonProduct) return null;

  const comparison = getLiveRetailComparison(comparisonProduct, simulatedDuration);
  if (!comparison) return null;

  const {
    product,
    days,
    dailyRate,
    rentalCost,
    rentoraBuyPrice,
    retailOptions,
    lowestRetail,
    lowestRetailPrice,
    breakEvenDays,
    verdict,
    priceHistory,
    lastSynced
  } = comparison;

  const quickDurationChips = [1, 3, 7, 14, 30, 60, 90, 180];

  const handleSetAlert = (e) => {
    e.preventDefault();
    if (!alertEmail || !targetAlertPrice) {
      addToast({
        type: 'error',
        title: 'Missing Details',
        message: 'Please enter both your email and target alert price.'
      });
      return;
    }
    addPriceAlert({
      productId: product.id,
      productName: product.name,
      image: product.image,
      targetPrice: targetAlertPrice,
      currentLowest: lowestRetailPrice,
      store: lowestRetail?.shortName || 'Amazon India',
      email: alertEmail
    });
    setAlertSet(true);
    addToast({
      type: 'success',
      title: 'Price Drop Alert Active!',
      message: `You will be notified when ${product.name} drops below ${formatINR(targetAlertPrice)} across Amazon or Flipkart.`
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in select-none">
      <div className="relative w-full max-w-4xl bg-[#F5F5EF] text-[#121512] rounded-3xl overflow-hidden shadow-2xl border border-[#183D2B]/15 max-h-[94vh] flex flex-col">
        
        {/* Top Header Card */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#183D2B]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#183D2B] flex items-center justify-center text-[#C9F36B] shadow-md">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#183D2B] font-bold">
                  RENTORA SMARTPRICE™ LIVE COMPARISON & DECISION ENGINE
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Synchronized
                </span>
              </div>
              <h3 className="font-serif font-black text-xl sm:text-2xl text-[#121512]">
                Amazon, Flipkart, Croma & Reliance Price Intelligence
              </h3>
            </div>
          </div>

          <button
            onClick={closeComparisonModal}
            className="p-2 rounded-full hover:bg-black/5 text-[#121512]/50 hover:text-[#121512] transition cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Quick Bar */}
        <div className="px-5 py-3.5 bg-white border-b border-[#183D2B]/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 rounded-xl object-cover border border-[#183D2B]/10 shrink-0"
            />
            <div>
              <h4 className="font-bold text-sm text-[#121512] leading-tight line-clamp-1">
                {product.name}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#183D2B]/5 text-[#183D2B] font-bold">
                  {product.category}
                </span>
                <span className="text-[11px] font-mono text-emerald-800 font-bold">
                  Lowest Market Rate: <span className="underline">{formatINR(lowestRetailPrice)}</span> on {lowestRetail.shortName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={lowestRetail.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#F5F5EF] hover:bg-[#183D2B] hover:text-[#C9F36B] text-[#121512] text-xs font-mono font-bold border border-[#183D2B]/15 transition flex items-center gap-1.5"
            >
              <span>View Lowest on {lowestRetail.shortName}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="px-5 pt-3 bg-white border-b border-[#183D2B]/10 flex gap-2 sm:gap-4 overflow-x-auto text-xs font-mono font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('comparison')}
            className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'border-[#183D2B] text-[#183D2B] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Multi-App Live Prices</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('decision')}
            className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'decision'
                ? 'border-[#183D2B] text-[#183D2B] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Rent vs Buy Decision</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-[#183D2B] text-[#183D2B] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LineChart className="w-4 h-4" />
            <span>Price Tracker & Graph</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('alert')}
            className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'alert'
                ? 'border-[#183D2B] text-[#183D2B] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Price Drop Alert</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">

          {/* TAB 1: MULTI-APP LIVE PRICE COMPARISON MATRIX */}
          {activeTab === 'comparison' && (
            <div className="space-y-4">
              
              {/* Highlight Lowest Rate Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-lg">
                    🏆
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-900 font-bold block">
                      LOWEST ONLINE RETAIL RATE FOUND
                    </span>
                    <span className="text-sm font-bold text-[#121512]">
                      Buy outright for <span className="text-emerald-800 font-mono font-black">{formatINR(lowestRetailPrice)}</span> on {lowestRetail.name}
                    </span>
                  </div>
                </div>

                <a
                  href={lowestRetail.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#183D2B] hover:bg-[#121512] text-[#C9F36B] font-mono text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  <span>Go to Lowest Deal on {lowestRetail.shortName}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Multi-App Rows */}
              <div className="space-y-2.5">
                
                {/* RENTORA PROPRIETARY OPTION */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#183D2B] text-white border border-[#183D2B] shadow-lg ring-2 ring-[#C9F36B]/40 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-white">RENTORA Insured Equipment Fleet</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase bg-[#C9F36B] text-[#183D2B]">
                          FLEXIBLE RENT + BUY
                        </span>
                      </div>
                      <p className="text-xs text-white/80 mt-1 flex flex-wrap items-center gap-2">
                        <span>⚡ Free Doorstep Delivery & 24hr Dispatch in Indian Metros</span>
                        <span>•</span>
                        <span>🛡️ SafeShield Escrow + Zero Depreciation</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right font-mono">
                      <div className="text-[#C9F36B] font-black text-base sm:text-lg">
                        Rent: {formatINR(dailyRate)}/day
                      </div>
                      <div className="text-white/70 text-xs">
                        Buy Brand-New: {formatINR(rentoraBuyPrice)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10 text-xs font-mono">
                    <span className="text-[#C9F36B] font-bold">RENTORA Guarantee:</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-[11px]">100% Refundable Deposit</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-[11px]">Mint Condition Certified</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-[11px]">Convert 100% Rent to Purchase</span>
                  </div>
                </div>

                {/* External Platforms: Flipkart, Amazon, Croma, Reliance Digital, Vijay Sales */}
                {retailOptions.map((opt) => {
                  const isLowest = opt.id === lowestRetail.id;
                  return (
                    <div
                      key={opt.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isLowest
                          ? 'bg-white text-[#121512] border-amber-400 shadow-md ring-2 ring-amber-400/30'
                          : 'bg-white text-[#121512] border-[#183D2B]/15 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm sm:text-base text-[#121512]">{opt.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase bg-[#F5F5EF] text-[#121512]/80 border border-[#183D2B]/10">
                              {opt.badge}
                            </span>
                            {isLowest && (
                              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                <span>🏆</span> LOWEST RETAIL RATE
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#121512]/70 mt-1">
                            {opt.delivery} • {opt.tag}
                          </p>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                          <div className="text-left sm:text-right font-mono">
                            <div className="font-mono text-xs text-[#121512]/50">Retail Purchase:</div>
                            <div className={`font-black text-base ${isLowest ? 'text-emerald-700' : 'text-[#121512]'}`}>
                              {formatINR(opt.price)}
                            </div>
                          </div>

                          <a
                            href={opt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl border border-[#183D2B]/20 hover:bg-[#183D2B] hover:text-[#C9F36B] text-[#121512] text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <span>Open on {opt.shortName}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center text-[11px] font-mono text-[#121512]/50 pt-2 flex items-center justify-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{lastSynced} across Indian e-commerce APIs</span>
              </div>
            </div>
          )}

          {/* TAB 2: RENT VS BUY DECISION ENGINE */}
          {activeTab === 'decision' && (
            <div className="space-y-5">
              
              {/* Interactive Duration Slider: "According to the days needed" */}
              <div className="p-5 rounded-2xl bg-white border border-[#183D2B]/15 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-[#183D2B] block">
                      PROJECT & USAGE DURATION PLANNER
                    </span>
                    <p className="text-xs text-[#121512]/70">
                      Enter how many days you need this hardware. The engine checks if renting or buying is mathematically smarter.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-mono text-[#121512]/60 font-bold">Duration:</span>
                    <span className="px-3 py-1 rounded-xl bg-[#183D2B] text-[#C9F36B] font-mono font-black text-sm">
                      {simulatedDuration} {simulatedDuration === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                </div>

                {/* Quick Duration Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {quickDurationChips.map((chipDays) => (
                    <button
                      key={chipDays}
                      type="button"
                      onClick={() => setSimulatedDuration(chipDays)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        simulatedDuration === chipDays
                          ? 'bg-[#183D2B] text-[#C9F36B] shadow-sm'
                          : 'bg-[#F5F5EF] text-[#121512]/70 hover:bg-[#183D2B]/10 border border-[#183D2B]/10'
                      }`}
                    >
                      {chipDays} {chipDays === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>

                {/* Slider */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="1"
                    max="180"
                    value={simulatedDuration}
                    onChange={(e) => setSimulatedDuration(Number(e.target.value))}
                    className="w-full accent-[#183D2B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#121512]/50">
                    <span>1 Day (Quick Shoot/Event)</span>
                    <span>Break-Even Threshold: ~{breakEvenDays} Days</span>
                    <span>180 Days (Long-term)</span>
                  </div>
                </div>
              </div>

              {/* Verdict Card */}
              <div
                className={`p-5 rounded-2xl border-2 transition-all shadow-md space-y-3 ${
                  verdict.shouldRent
                    ? 'bg-emerald-50/90 border-emerald-500/80 text-emerald-950'
                    : 'bg-amber-50/90 border-amber-500/80 text-amber-950'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm uppercase tracking-wide flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      {verdict.title}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold w-fit ${
                    verdict.shouldRent ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                  }`}>
                    {verdict.badgeText}
                  </span>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed font-sans">
                  {verdict.explanation}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-white/80 border border-black/10">
                    <span className="text-[11px] text-[#121512]/60 block">Rentora Rental ({days}d):</span>
                    <span className="font-black text-base text-[#183D2B]">{formatINR(rentalCost)}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/80 border border-black/10">
                    <span className="text-[11px] text-[#121512]/60 block">
                      Lowest Retail ({lowestRetail.shortName}):
                    </span>
                    <span className="font-black text-base text-[#121512]">{formatINR(lowestRetailPrice)}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/80 border border-black/10">
                    <span className="text-[11px] text-[#121512]/60 block">Financial Difference:</span>
                    <span className={`font-black text-base ${verdict.shouldRent ? 'text-emerald-700' : 'text-amber-800'}`}>
                      {verdict.shouldRent
                        ? `Save ${formatINR(verdict.savingsVsLowest)} (${verdict.savingsPct}%)`
                        : `Buy Outright Saves More`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRICE TRACKER & 6-MONTH HISTORICAL GRAPH */}
          {activeTab === 'history' && priceHistory && (
            <div className="space-y-5">
              
              {/* Tracker Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-white rounded-2xl border border-[#183D2B]/15 shadow-sm space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#121512]/60 block">Current Lowest Price</span>
                  <div className="text-lg font-black font-mono text-[#183D2B]">{formatINR(priceHistory.currentPrice)}</div>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" /> Live Verified
                  </span>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-[#183D2B]/15 shadow-sm space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#121512]/60 block">All-Time Lowest Rate</span>
                  <div className="text-lg font-black font-mono text-emerald-800">{formatINR(priceHistory.allTimeLow)}</div>
                  <span className="text-[10px] text-slate-500 font-mono">During Festive Sale</span>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-[#183D2B]/15 shadow-sm space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#121512]/60 block">All-Time Peak Price</span>
                  <div className="text-lg font-black font-mono text-rose-700">{formatINR(priceHistory.allTimeHigh)}</div>
                  <span className="text-[10px] text-slate-500 font-mono">Launch Window</span>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-[#183D2B]/15 shadow-sm space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#121512]/60 block">Price Drop from Peak</span>
                  <div className="text-lg font-black font-mono text-emerald-700">-{priceHistory.priceDropPct}%</div>
                  <span className="text-[10px] text-slate-500 font-mono">Save {formatINR(priceHistory.priceDropFromHigh)}</span>
                </div>
              </div>

              {/* Visual SVG Price Trend Graph */}
              <div className="p-5 bg-white rounded-2xl border border-[#183D2B]/15 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-mono text-xs font-bold uppercase text-[#183D2B]">
                      6-Month Historical Price Trajectory (₹ / INR)
                    </h4>
                    <p className="text-xs text-[#121512]/60">
                      Tracking Amazon, Flipkart, and Croma price fluctuations over the last 180 days.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    {priceHistory.trendVerdict}
                  </span>
                </div>

                {/* SVG Sparkline Area Chart */}
                <div className="relative pt-6 pb-2">
                  <div className="h-44 w-full flex items-end justify-between gap-2 px-4 border-b border-slate-200">
                    {priceHistory.historyPoints.map((pt, pIdx) => {
                      const range = priceHistory.allTimeHigh - priceHistory.allTimeLow || 1;
                      const heightPct = Math.round(((pt.price - priceHistory.allTimeLow) / range) * 55) + 35;
                      const isMin = pt.price === priceHistory.allTimeLow;
                      const isCurrent = pIdx === priceHistory.historyPoints.length - 1;

                      return (
                        <div key={pIdx} className="flex-1 flex flex-col items-center gap-1 group relative">
                          {/* Tooltip on Hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#183D2B] text-[#C9F36B] text-[10px] font-mono font-bold py-0.5 px-2 rounded pointer-events-none whitespace-nowrap z-20 shadow-md">
                            {formatINR(pt.price)}
                          </div>

                          {/* Bar / Column Indicator */}
                          <div
                            style={{ height: `${heightPct}%` }}
                            className={`w-full max-w-[42px] rounded-t-lg transition-all ${
                              isCurrent
                                ? 'bg-gradient-to-t from-[#183D2B] to-[#C9F36B] shadow-md'
                                : isMin
                                ? 'bg-emerald-400'
                                : 'bg-[#183D2B]/30 hover:bg-[#183D2B]/60'
                            }`}
                          />

                          {/* Month Label */}
                          <span className="text-[10px] font-mono text-[#121512]/70 mt-1 font-bold">
                            {pt.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 pt-2 px-2">
                    <span>6 Months Ago</span>
                    <span className="font-bold text-emerald-700">Festive Dip: {formatINR(priceHistory.allTimeLow)}</span>
                    <span className="font-bold text-[#183D2B]">Today: {formatINR(priceHistory.currentPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRICE DROP ALERT */}
          {activeTab === 'alert' && (
            <div className="p-6 bg-white rounded-2xl border border-[#183D2B]/15 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#183D2B] text-[#C9F36B] flex items-center justify-center font-bold">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-[#121512]">
                    Set Automated Price Drop Notification
                  </h4>
                  <p className="text-xs text-[#121512]/70 mt-0.5">
                    We track Amazon, Flipkart, and Croma every 15 minutes. Enter your target price to get an instant email alert when it drops!
                  </p>
                </div>
              </div>

              {!alertSet ? (
                <form onSubmit={handleSetAlert} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-mono font-bold text-[#121512]/80 block mb-1">
                        Your Target Price (₹):
                      </label>
                      <input
                        type="number"
                        placeholder={`e.g. ${Math.round(lowestRetailPrice * 0.95)}`}
                        value={targetAlertPrice}
                        onChange={(e) => setTargetAlertPrice(e.target.value)}
                        className="w-full bg-[#F5F5EF] border border-[#183D2B]/20 rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#121512] focus:outline-none focus:border-[#183D2B]"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono font-bold text-[#121512]/80 block mb-1">
                        Notification Email:
                      </label>
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={alertEmail}
                        onChange={(e) => setAlertEmail(e.target.value)}
                        className="w-full bg-[#F5F5EF] border border-[#183D2B]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#121512] focus:outline-none focus:border-[#183D2B]"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#183D2B] hover:bg-[#121512] text-[#C9F36B] font-mono text-xs font-bold uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Bell className="w-4 h-4 text-[#C9F36B]" />
                    <span>Activate Live Price Watch Alert</span>
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono space-y-2">
                  <div className="font-bold flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-950">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Price Watch Active & Saved to Profile!</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        closeComparisonModal();
                        setIsDashboardOpen(true);
                      }}
                      className="text-[10px] uppercase font-bold text-[#183D2B] hover:underline"
                    >
                      View in Dashboard →
                    </button>
                  </div>
                  <p>
                    Target threshold: <span className="font-bold">{formatINR(targetAlertPrice)}</span>. You will receive an immediate notification at <span className="underline">{alertEmail}</span> as soon as any retail platform drops to this price.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                closeComparisonModal();
                openProductDetail(product, 'rent');
              }}
              className="flex-1 py-3.5 rounded-xl bg-[#183D2B] hover:bg-[#121512] text-[#C9F36B] font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C9F36B]" />
              <span>Customize Rental Dates & Options</span>
            </button>

            <a
              href={lowestRetail.url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-6 rounded-xl bg-white hover:bg-black/5 text-[#121512] border border-[#183D2B]/20 font-mono font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-[#183D2B]" />
              <span>Buy on {lowestRetail.shortName} ({formatINR(lowestRetailPrice)})</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
