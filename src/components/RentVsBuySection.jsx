import React, { useState } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  Check,
  Zap,
  Percent,
  ArrowUpRight,
  Sliders,
  ExternalLink,
  Sparkles,
  TrendingUp,
  BarChart3,
  HelpCircle,
  Award,
  Clock,
  Tag,
  SlidersHorizontal
} from 'lucide-react';
import { RENT_VS_BUY_COMPARISON, formatINR } from '../data/rentoraData';
import { useRentora } from '../context/RentoraContext';
import { getLiveRetailComparison } from '../utils/pricingComparison';

export default function RentVsBuySection() {
  const { openProductDetail, openComparisonModal, openRazorpayCheckout } = useRentora();
  const [selectedItemIdx, setSelectedItemIdx] = useState(0);
  const [customDays, setCustomDays] = useState(7);
  const [isCustomSlider, setIsCustomSlider] = useState(false);
  const [selectedDurationIdx, setSelectedDurationIdx] = useState(1);

  const currentGear = RENT_VS_BUY_COMPARISON[selectedItemIdx] || RENT_VS_BUY_COMPARISON[0];
  const activeDays = isCustomSlider ? customDays : currentGear.durations[selectedDurationIdx].days;
  const activeLabel = isCustomSlider ? `${customDays}-Day Term` : currentGear.durations[selectedDurationIdx].label;

  // Run decision engine
  const comparison = getLiveRetailComparison(currentGear, activeDays);
  const {
    rentalCost: calculatedRentalCost,
    lowestRetail,
    lowestRetailPrice,
    breakEvenDays,
    verdict,
    retailOptions,
    priceHistory
  } = comparison;

  const savings = Math.max(0, lowestRetailPrice - calculatedRentalCost);
  const savingsPct = Math.round((savings / lowestRetailPrice) * 100);

  // Bar chart percentage
  const rentBarPct = Math.min(100, Math.max(8, Math.round((calculatedRentalCost / lowestRetailPrice) * 100)));

  return (
    <section id="rent-vs-buy" className="py-24 bg-[#F5F5EF] text-[#121512] relative overflow-hidden select-none border-t border-[#183D2B]/10">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[550px] h-[550px] bg-[#C9F36B]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#183D2B]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#183D2B] text-[#C9F36B] text-xs font-mono uppercase font-bold tracking-wider shadow-sm border border-[#C9F36B]/30">
            <Percent className="w-3.5 h-3.5 text-[#C9F36B]" />
            <span>04 // Smart Pricing & Decision Advisor</span>
          </div>
          <h2 className="font-serif font-black text-4xl sm:text-6xl text-[#121512] uppercase tracking-tight leading-tight">
            DON'T BUY BEFORE YOU COMPARE.
          </h2>
          <p className="text-base sm:text-lg text-[#121512]/75 font-medium max-w-2xl mx-auto">
            Live prices compared across Amazon, Flipkart & Croma. Input your required duration to see whether renting or purchasing is mathematically superior.
          </p>
        </div>

        {/* Product Selector Pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {RENT_VS_BUY_COMPARISON.map((gear, idx) => (
            <button
              key={gear.id}
              onClick={() => {
                setSelectedItemIdx(idx);
                setIsCustomSlider(false);
              }}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold font-mono transition-all cursor-pointer ${
                selectedItemIdx === idx
                  ? 'bg-[#183D2B] text-[#C9F36B] shadow-lg shadow-[#183D2B]/20'
                  : 'bg-white text-[#121512]/80 hover:text-[#121512] border border-[#183D2B]/15 hover:border-[#183D2B]/40'
              }`}
            >
              {gear.name}
            </button>
          ))}
        </div>

        {/* Dynamic Financial Verdict Banner based on active days */}
        <div
          className={`max-w-5xl mx-auto p-5 sm:p-6 rounded-3xl border-2 transition-all shadow-md space-y-3 ${
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
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold w-fit ${
                verdict.shouldRent ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
              }`}
            >
              For {activeDays} Days • Break-Even: {breakEvenDays} Days
            </span>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed font-sans">
            {verdict.explanation}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold">Lowest Retail Purchase:</span>
              <span className="font-mono font-black text-base">{formatINR(lowestRetailPrice)}</span>
              <span className="text-[11px] text-[#121512]/60">on {lowestRetail.shortName}</span>
            </div>

            <a
              href={lowestRetail.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#183D2B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View product link on {lowestRetail.shortName}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Visual Capital Allocation Comparison Bar */}
        <div className="max-w-4xl mx-auto bg-white p-5 sm:p-6 rounded-3xl border border-[#183D2B]/15 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[#183D2B] uppercase flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#183D2B]" />
              Capital Outflow Visual Comparison ({activeLabel})
            </span>
            <span className="text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
              {savingsPct}% Capital Preserved
            </span>
          </div>

          {/* Bar 1: Renting Cost Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="font-bold text-[#183D2B]">Rent Option ({activeLabel}):</span>
              <span className="font-black text-[#183D2B]">{formatINR(calculatedRentalCost)}</span>
            </div>
            <div className="w-full bg-[#F5F5EF] h-4 rounded-full overflow-hidden p-0.5 border border-[#183D2B]/10">
              <div
                className="bg-gradient-to-r from-[#183D2B] to-[#C9F36B] h-full rounded-full transition-all duration-500"
                style={{ width: `${rentBarPct}%` }}
              />
            </div>
          </div>

          {/* Bar 2: Outright Buy Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-[#121512]/70">Lowest Outright Retail Rate ({lowestRetail.shortName}):</span>
              <span className="font-black text-[#121512]">{formatINR(lowestRetailPrice)}</span>
            </div>
            <div className="w-full bg-[#F5F5EF] h-4 rounded-full overflow-hidden p-0.5 border border-[#183D2B]/10">
              <div className="bg-[#121512]/80 h-full rounded-full w-full" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[#121512]/60 pt-1 border-t border-[#183D2B]/10">
            <span>Break-Even Usage Threshold: <strong>{breakEvenDays} Days</strong></span>
            <span className="text-emerald-700 font-bold">100% Tax Deductible Operating Expense (OpEx)</span>
          </div>
        </div>

        {/* Main Interactive Comparison Stage */}
        <div className="bg-white rounded-3xl border border-[#183D2B]/15 shadow-xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: RENT Panel */}
          <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden bg-[#183D2B] text-white border border-[#C9F36B]/50 shadow-2xl ring-2 ring-[#C9F36B]/40">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest font-bold text-[#C9F36B]">
                OPTION A: RENT ON RENTORA
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono border bg-black/40 text-white/90 border-white/10">
                SafeShield Escrow
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs block text-white/70">
                Calculated Rental Cost:
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl sm:text-4xl font-black text-white">
                  {formatINR(calculatedRentalCost)}
                </span>
                <span className="text-xs font-mono font-bold text-[#C9F36B]">
                  ({savingsPct}% Saved)
                </span>
              </div>
              <p className="text-xs pt-1 text-white/70">
                For {activeLabel} • Includes 100% refundable security deposit
              </p>
            </div>

            {/* Rates Table (Daily, Weekly, Monthly) */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white/70">Daily Rate:</span>
                <span className="font-bold">{formatINR(currentGear.dailyRate)}/day</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white/70">Weekly Rate (8% Discount):</span>
                <span className="font-bold">{formatINR(currentGear.weeklyRate)}/week</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white/70">Monthly Rate (15% Discount):</span>
                <span className="font-bold">{formatINR(currentGear.monthlyRate)}/month</span>
              </div>
            </div>

            {/* Duration Selector Tabs */}
            <div className="space-y-2">
              <span className="text-xs font-mono block text-white/80">
                Select Project Duration:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {currentGear.durations.map((dur, dIdx) => (
                  <button
                    key={dIdx}
                    onClick={() => {
                      setIsCustomSlider(false);
                      setSelectedDurationIdx(dIdx);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-mono transition-all text-left cursor-pointer ${
                      !isCustomSlider && selectedDurationIdx === dIdx
                        ? 'bg-[#C9F36B] text-[#183D2B] font-bold shadow-sm'
                        : 'bg-black/30 hover:bg-black/50 text-white/80 border border-white/10'
                    }`}
                  >
                    <div>{dur.label}</div>
                    <div className="text-[10px] opacity-70">{formatINR(dur.rentCost)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Slider Toggle */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-mono mb-1 text-white/90">
                <span>Custom Duration (1 - 90 Days):</span>
                <span className="font-bold text-[#C9F36B]">
                  {customDays} Days
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="90"
                value={customDays}
                onChange={(e) => {
                  setIsCustomSlider(true);
                  setCustomDays(Number(e.target.value));
                }}
                className="w-full cursor-pointer accent-[#C9F36B]"
              />
            </div>

            {/* Action Buttons: Rent Options & Full Comparison */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => openProductDetail(currentGear, 'rent')}
                className="py-3 px-3 rounded-xl bg-[#C9F36B] hover:bg-[#b8e854] text-[#183D2B] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer font-mono"
              >
                <Sliders className="w-3.5 h-3.5 text-[#183D2B]" />
                <span>Rent Options</span>
              </button>

              <button
                type="button"
                onClick={() => openComparisonModal(currentGear)}
                className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer font-mono"
              >
                <Tag className="w-3.5 h-3.5 text-[#C9F36B]" />
                <span>Multi-App Matrix</span>
              </button>
            </div>
          </div>

          {/* Middle Column: Hardware Visual & Break-Even Metric */}
          <div className="lg:col-span-3 text-center space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#F5F5EF] border border-[#183D2B]/15 p-2 relative group">
              <img
                src={currentGear.image}
                alt={currentGear.name}
                className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur text-white text-[10px] font-mono font-bold">
                  Flagship
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F5EF] border border-[#183D2B]/15 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#183D2B] font-bold block">
                Calculated Break-Even
              </span>
              <div className="text-xl font-bold font-mono text-[#121512]">
                {breakEvenDays} Days of Rental
              </div>
              <p className="text-[11px] text-[#121512]/70">
                Renting is financially superior if you use the device for less than {breakEvenDays} days.
              </p>
            </div>
          </div>

          {/* Right Column: Multi-App BUY Panel with Lowest Rate & Links */}
          <div className="lg:col-span-4 rounded-3xl p-6 sm:p-8 space-y-5 bg-[#F5F5EF] text-[#121512] border border-[#183D2B]/15">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest font-bold text-[#183D2B]">
                OPTION B: BUY OUTRIGHT
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                🏆 Lowest Rate Found
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs block text-[#121512]/70">
                Lowest Market Purchase Rate:
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl sm:text-4xl font-black text-[#121512]">
                  {formatINR(lowestRetailPrice)}
                </span>
                <span className="text-xs font-mono font-bold text-[#183D2B]">
                  on {lowestRetail.shortName}
                </span>
              </div>
              <p className="text-xs text-[#121512]/60 pt-0.5">
                Brand-new sealed unit with manufacturer warranty
              </p>
            </div>

            {/* Live Indian Marketplace Parity Rows with Outbound Links */}
            <div className="space-y-2 text-xs font-mono">
              {retailOptions.map((opt) => {
                const isLowest = opt.id === lowestRetail.id;
                return (
                  <div
                    key={opt.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      isLowest
                        ? 'bg-white border-amber-400 shadow-sm'
                        : 'bg-white/60 border-[#183D2B]/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#121512]">{opt.shortName}</span>
                        {isLowest && (
                          <span className="text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                            Lowest
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#121512]/50 block">
                        {opt.delivery}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isLowest ? 'text-emerald-800' : 'text-[#121512]'}`}>
                        {formatINR(opt.price)}
                      </span>
                      <a
                        href={opt.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md bg-[#183D2B]/10 hover:bg-[#183D2B] hover:text-white transition text-[#183D2B]"
                        title={`View on ${opt.shortName}`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Direct Outbound Link to Buy at Lowest Price */}
            <a
              href={lowestRetail.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer bg-white hover:bg-black/5 text-[#121512] border border-[#183D2B]/20 font-mono"
            >
              <ExternalLink className="w-4 h-4 text-[#183D2B]" />
              <span>Buy on {lowestRetail.shortName} ({formatINR(lowestRetailPrice)})</span>
            </a>
          </div>
        </div>

        {/* 6-Month Historical Price Tracker Graph (Embedded Directly on Homepage) */}
        {priceHistory && (
          <div className="max-w-7xl mx-auto p-6 sm:p-8 bg-white rounded-3xl border border-[#183D2B]/15 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#183D2B]/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#183D2B] text-[#C9F36B] text-[10px] font-mono font-bold uppercase">
                    RENTORA SMARTPRICE™ TRACKER
                  </span>
                  <span className="text-xs font-mono text-emerald-800 font-bold">
                    6-Month Historical Price Trajectory
                  </span>
                </div>
                <h4 className="font-serif font-black text-xl sm:text-2xl text-[#121512] mt-1">
                  {currentGear.name} Price Tracking Across Amazon & Flipkart
                </h4>
              </div>

              <button
                type="button"
                onClick={() => openComparisonModal(currentGear)}
                className="px-4 py-2 rounded-xl bg-[#183D2B] text-[#C9F36B] font-mono text-xs font-bold transition hover:bg-[#121512] flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <span>Set Price Alert & Compare All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3.5 bg-[#F5F5EF] rounded-2xl border border-[#183D2B]/10 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Current Lowest Price</span>
                <div className="text-lg font-black text-[#183D2B]">{formatINR(priceHistory.currentPrice)}</div>
                <span className="text-[10px] text-emerald-700 font-bold">Verified Today</span>
              </div>

              <div className="p-3.5 bg-[#F5F5EF] rounded-2xl border border-[#183D2B]/10 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">All-Time Lowest Rate</span>
                <div className="text-lg font-black text-emerald-800">{formatINR(priceHistory.allTimeLow)}</div>
                <span className="text-[10px] text-slate-500">During Festive Sale</span>
              </div>

              <div className="p-3.5 bg-[#F5F5EF] rounded-2xl border border-[#183D2B]/10 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">All-Time Peak Price</span>
                <div className="text-lg font-black text-rose-700">{formatINR(priceHistory.allTimeHigh)}</div>
                <span className="text-[10px] text-slate-500">Launch Price</span>
              </div>

              <div className="p-3.5 bg-[#F5F5EF] rounded-2xl border border-[#183D2B]/10 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Price Drop from Peak</span>
                <div className="text-lg font-black text-emerald-700">-{priceHistory.priceDropPct}%</div>
                <span className="text-[10px] text-slate-500">Save {formatINR(priceHistory.priceDropFromHigh)}</span>
              </div>
            </div>

            {/* Visual Bar Columns */}
            <div className="pt-4">
              <div className="h-40 w-full flex items-end justify-between gap-3 px-4 border-b border-slate-200">
                {priceHistory.historyPoints.map((pt, pIdx) => {
                  const range = priceHistory.allTimeHigh - priceHistory.allTimeLow || 1;
                  const heightPct = Math.round(((pt.price - priceHistory.allTimeLow) / range) * 55) + 35;
                  const isCurrent = pIdx === priceHistory.historyPoints.length - 1;
                  const isMin = pt.price === priceHistory.allTimeLow;

                  return (
                    <div key={pIdx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#183D2B] text-[#C9F36B] text-[10px] font-mono font-bold py-0.5 px-2 rounded pointer-events-none whitespace-nowrap z-20 shadow-md">
                        {formatINR(pt.price)}
                      </div>

                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full max-w-[48px] rounded-t-lg transition-all ${
                          isCurrent
                            ? 'bg-gradient-to-t from-[#183D2B] to-[#C9F36B] shadow-md'
                            : isMin
                            ? 'bg-emerald-400'
                            : 'bg-[#183D2B]/25 hover:bg-[#183D2B]/50'
                        }`}
                      />

                      <span className="text-[11px] font-mono text-[#121512]/70 font-bold mt-1">
                        {pt.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 pt-2 px-2">
                <span>Month 1 (Launch)</span>
                <span className="font-bold text-emerald-700">Festive Dip: {formatINR(priceHistory.allTimeLow)}</span>
                <span className="font-bold text-[#183D2B]">Today: {formatINR(priceHistory.currentPrice)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
