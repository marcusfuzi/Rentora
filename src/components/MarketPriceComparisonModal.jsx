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
  Award,
  Clock,
  ArrowUpRight,
  Check
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
    openRazorpayCheckout
  } = useRentora();

  const [simulatedDuration, setSimulatedDuration] = useState(7); // default 7 days

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
    lastSynced
  } = comparison;

  const quickDurationChips = [1, 3, 7, 14, 30, 60, 90];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in select-none">
      <div className="relative w-full max-w-4xl bg-[#F5F5EF] text-[#121512] rounded-3xl overflow-hidden shadow-2xl border border-[#183D2B]/15 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#183D2B]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#183D2B] flex items-center justify-center text-[#C9F36B] shadow-md">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#183D2B] font-bold">
                  MULTI-APP LIVE PRICING & DECISION ENGINE
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <h3 className="font-serif font-black text-xl sm:text-2xl text-[#121512]">
                Amazon, Flipkart & Croma Price Comparison
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

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Target Product Summary Card */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 rounded-2xl bg-white border border-[#183D2B]/15 shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-[#183D2B]/10 shrink-0"
            />
            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-mono text-[#183D2B] font-bold uppercase tracking-wider bg-[#183D2B]/5 px-2.5 py-0.5 rounded-md">
                  {product.category || 'Hardware'}
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                  Certified Pelican Rig
                </span>
              </div>
              <h4 className="font-serif font-black text-xl sm:text-2xl text-[#121512]">
                {product.name}
              </h4>
              <p className="text-xs text-[#121512]/70 leading-relaxed max-w-xl">
                Compare Rentora's insured lease against outright retail purchase prices across major Indian online stores.
              </p>
            </div>
            <div className="text-center sm:text-right font-mono shrink-0 bg-[#F5F5EF] p-3 rounded-xl border border-[#183D2B]/10">
              <span className="text-[11px] text-[#121512]/60 block">Rentora Base Daily:</span>
              <span className="font-black text-xl text-[#183D2B] block">
                {formatINR(dailyRate)}<span className="text-xs font-normal">/day</span>
              </span>
            </div>
          </div>

          {/* Interactive Duration Slider: "According to the days needed" */}
          <div className="p-5 rounded-2xl bg-white border border-[#183D2B]/15 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-[#183D2B] block">
                  STEP 1 // ENTER YOUR PROJECT / USAGE DURATION
                </span>
                <p className="text-xs text-[#121512]/70">
                  How many days do you need this device? Our engine calculates whether buying or renting saves more money.
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
                max="120"
                value={simulatedDuration}
                onChange={(e) => setSimulatedDuration(Number(e.target.value))}
                className="w-full accent-[#183D2B] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#121512]/50">
                <span>1 Day (Quick Shoot/Event)</span>
                <span>Break-Even: ~{breakEvenDays} Days</span>
                <span>120 Days (Long-term)</span>
              </div>
            </div>
          </div>

          {/* Smart Decision Engine: Should You Rent or Purchase? */}
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
                  Lowest Retail Price ({lowestRetail.shortName}):
                </span>
                <span className="font-black text-base text-[#121512]">{formatINR(lowestRetailPrice)}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/80 border border-black/10">
                <span className="text-[11px] text-[#121512]/60 block">Financial Difference:</span>
                <span className={`font-black text-base ${verdict.shouldRent ? 'text-emerald-700' : 'text-amber-800'}`}>
                  {verdict.shouldRent
                    ? `Save ${formatINR(verdict.savingsVsLowest)} (${verdict.savingsPct}%)`
                    : `Buy Outright Saves Long-term`}
                </span>
              </div>
            </div>
          </div>

          {/* Lowest Retail Rate Banner */}
          <div className="p-4 rounded-2xl bg-white border border-[#183D2B]/15 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                🏆
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-bold block">
                  LOWEST RETAIL RATE DETECTOR (INDIAN MARKET)
                </span>
                <span className="text-sm font-bold text-[#121512]">
                  Lowest Purchase Price: <span className="text-[#183D2B] font-mono">{formatINR(lowestRetailPrice)}</span> on {lowestRetail.name}
                </span>
              </div>
            </div>

            <a
              href={lowestRetail.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#183D2B] hover:bg-[#121512] text-[#C9F36B] font-mono text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <span>View Lowest Deal on {lowestRetail.shortName}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Multi-App Live Pricing Matrix Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#121512]/70 font-bold">
                Multi-Platform Live Pricing Matrix
              </span>
              <span className="text-[11px] font-mono text-[#121512]/50 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {lastSynced}
              </span>
            </div>

            <div className="space-y-2.5">
              
              {/* Row 1: Rentora Verified Fleet (Dual Mode: Rent & Buy) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#183D2B] text-white border border-[#183D2B] shadow-lg ring-2 ring-[#C9F36B]/40 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white">Rentora Verified Fleet</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase bg-[#C9F36B] text-[#183D2B]">
                        DUAL RENT + BUY
                      </span>
                    </div>
                    <p className="text-xs text-white/80 mt-1 flex flex-wrap items-center gap-2">
                      <span>⚡ Free Insured Metro Courier (Same-Day / 3-Hour Dispatch)</span>
                      <span>•</span>
                      <span>🛡️ SafeShield Escrow + Pelican Flight Case Included</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right font-mono">
                    <div className="text-[#C9F36B] font-black text-base sm:text-lg">
                      Rent: {formatINR(rentalCost)} <span className="text-xs text-white/70">({days}d)</span>
                    </div>
                    <div className="text-white/70 text-xs">
                      Buy Brand-New: {formatINR(rentoraBuyPrice)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10 text-xs font-mono">
                  <span className="text-[#C9F36B] font-bold">Rentora Exclusive Perks:</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[11px]">100% Tax Deductible (OpEx)</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[11px]">Zero Depreciation Risk</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[11px]">Free Transit Replacement</span>
                </div>
              </div>

              {/* Other Retail Rows: Flipkart, Amazon, Croma, Reliance Digital */}
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
                              <span>🏆</span> LOWEST BUY RATE
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

                        {/* Direct Link to Product on Flipkart / Amazon / Croma */}
                        <a
                          href={opt.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl border border-[#183D2B]/20 hover:bg-[#183D2B] hover:text-[#C9F36B] text-[#121512] text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span>View on {opt.shortName}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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
