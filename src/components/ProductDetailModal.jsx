import React, { useState } from 'react';
import {
  X,
  Check,
  Star,
  ShieldCheck,
  MapPin,
  Calendar,
  ArrowRight,
  Zap,
  RefreshCw,
  Tag,
  Sliders,
  CheckCircle2,
  ChevronRight,
  Clock,
  Box,
  Award,
  ExternalLink,
  Truck,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useRentora } from '../context/RentoraContext';
import { formatINR } from '../data/rentoraData';
import { getLiveRetailComparison, getTenurePricing } from '../utils/pricingComparison';

export default function ProductDetailModal() {
  const {
    selectedProduct,
    closeProductDetail,
    addToCart,
    openComparisonModal,
    openRazorpayCheckout,
    addToast
  } = useRentora();

  const [mode, setMode] = useState(selectedProduct?.initialMode || 'rent');
  const [rentalPlanType, setRentalPlanType] = useState('tenure'); // 'tenure' (monthly) | 'daily' (short-term)
  const [selectedTenureMonths, setSelectedTenureMonths] = useState(3); // 1, 3, 6, 12 months
  const [rentalDays, setRentalDays] = useState(7); // for daily plan
  const [includeDamageWaiver, setIncludeDamageWaiver] = useState(true);
  const [pincode, setPincode] = useState('400050');
  const [pincodeChecked, setPincodeChecked] = useState(true);

  // Dates for daily plan
  const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0];
  const defaultReturn = new Date(Date.now() + (7 + 1) * 24 * 3600 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(tomorrow);
  const [returnDate, setReturnDate] = useState(defaultReturn);

  if (!selectedProduct) return null;

  const buy = Number(selectedProduct.buyPrice) || 100000;
  const daily = Number(selectedProduct.dailyRate) || Math.round(buy * 0.02);
  const tenureData = getTenurePricing(selectedProduct);

  // Tenure calculations
  const currentTenure = tenureData.tenures.find(t => t.months === selectedTenureMonths) || tenureData.tenures[1];
  const monthlyRent = currentTenure.monthlyRate;
  const refundableDeposit = tenureData.refundableDeposit;
  const waiverFee = includeDamageWaiver ? 499 : 0;

  // Daily calculations
  const discountRate = rentalDays >= 30 ? 0.85 : rentalDays >= 7 ? 0.92 : 1;
  const dailyRentalBase = Math.round(daily * rentalDays * discountRate);

  // Total computation
  const isMonthly = rentalPlanType === 'tenure';
  const effectiveRentalCost = isMonthly ? (monthlyRent * selectedTenureMonths) : dailyRentalBase;
  const initialDueAmount = isMonthly
    ? (monthlyRent + refundableDeposit + waiverFee)
    : (dailyRentalBase + refundableDeposit + waiverFee);
  const grandTotal = mode === 'rent' ? initialDueAmount : buy;

  const handleDurationPreset = (days) => {
    setRentalDays(days);
    const startObj = new Date(startDate);
    const endObj = new Date(startObj.getTime() + days * 24 * 3600 * 1000);
    setReturnDate(endObj.toISOString().split('T')[0]);
  };

  const handleStartDateChange = (val) => {
    setStartDate(val);
    const startObj = new Date(val);
    const endObj = new Date(startObj.getTime() + rentalDays * 24 * 3600 * 1000);
    setReturnDate(endObj.toISOString().split('T')[0]);
  };

  const comparisonDays = isMonthly ? (selectedTenureMonths * 30) : rentalDays;
  const marketComparison = getLiveRetailComparison(selectedProduct, comparisonDays);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-4xl bg-[#F5F5EF] text-[#121512] rounded-3xl overflow-hidden shadow-2xl border border-[#183D2B]/15 max-h-[94vh] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-white border-b border-[#183D2B]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#183D2B] animate-pulse" />
            <span className="text-xs font-mono uppercase font-bold text-[#183D2B] tracking-wider">
              RENTORA EQUIPMENT LEASE & DURATION CUSTOMIZER (₹ / INR)
            </span>
          </div>

          <button
            onClick={closeProductDetail}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#121512]/60 hover:text-[#121512] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Product Visual, Specs & Multi-Store Benchmark */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black/5 border border-[#183D2B]/10 shadow-sm relative group">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-[#183D2B] text-[#C9F36B] px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase border border-[#C9F36B]/30 shadow-sm">
                  {selectedProduct.category}
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-[#183D2B] flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-[#183D2B] text-[#183D2B]" />
                  <span>{selectedProduct.rating || '4.95'}</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur text-white px-2.5 py-1 rounded-lg text-[11px] font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{selectedProduct.location || 'Mumbai, MH'} • In Stock</span>
                </div>
              </div>

              {/* Hardware Highlights */}
              <div className="p-4 bg-white rounded-2xl border border-[#183D2B]/10 space-y-2">
                <span className="text-[11px] font-mono text-[#183D2B] uppercase font-bold block">
                  Mint Condition Verified Specifications
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedProduct.specs?.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-1.5 text-[#121512]/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multi-Store Comparison Callout & Outbound Parity */}
              {marketComparison && (
                <div className="p-4 rounded-2xl bg-white border border-[#183D2B]/15 space-y-2 text-xs font-mono shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#121512]/70 font-bold flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>Lowest Market Buy Rate:</span>
                    </span>
                    <span className="font-bold text-[#183D2B]">
                      {formatINR(marketComparison.lowestRetailPrice)} on {marketComparison.lowestRetail.shortName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-emerald-900 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                    <span>For your {comparisonDays}-day plan, renting saves:</span>
                    <span className="font-black text-emerald-950">
                      {formatINR(marketComparison.verdict.savingsVsLowest)} ({marketComparison.verdict.savingsPct}%)
                    </span>
                  </div>

                  {/* Multi-App Price Comparison Launcher */}
                  <button
                    type="button"
                    onClick={() => openComparisonModal(selectedProduct)}
                    className="w-full mt-1 py-2.5 px-3 bg-[#183D2B] hover:bg-[#121512] text-[#C9F36B] rounded-xl text-xs font-mono font-bold flex items-center justify-between transition cursor-pointer shadow-xs"
                  >
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#C9F36B]" />
                      <span>Compare Amazon, Flipkart, Croma & Reliance</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span>View Live Matrix →</span>
                    </span>
                  </button>
                </div>
              )}

              {/* RENTORA Rental Inclusions Strip */}
              <div className="p-4 rounded-2xl bg-white border border-[#183D2B]/10 space-y-2 text-xs">
                <span className="text-[11px] font-mono text-[#183D2B] uppercase font-bold block">
                  Rental Advantage & Inclusions
                </span>
                <div className="space-y-1.5 text-[#121512]/75">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Free doorstep delivery & installation in Indian metros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>SafeShield Damage Waiver: Zero liability for normal wear & tear</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Free annual relocation & hassle-free doorstep pickup</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Comprehensive Rental Tenure Options */}
            <div className="md:col-span-6 space-y-5 text-left">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-[#183D2B] uppercase font-bold">
                  EQUIPMENT LEASE & TENURE PLANNER
                </span>
                <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#121512] mt-0.5">
                  {selectedProduct.name}
                </h3>
                <p className="text-xs text-[#121512]/70 mt-1 leading-relaxed">
                  {selectedProduct.description || "Production-tested, sensor-cleaned, and sanitized gear with zero downtime commitment."}
                </p>
              </div>

              {/* Rent vs Buy Mode Switcher */}
              <div className="flex bg-white p-1 rounded-full text-xs font-bold border border-[#183D2B]/15 font-mono shadow-sm">
                <button
                  type="button"
                  onClick={() => setMode('rent')}
                  className={`flex-1 py-2 rounded-full transition cursor-pointer ${
                    mode === 'rent'
                      ? 'bg-[#183D2B] text-[#C9F36B] font-black shadow-md'
                      : 'text-[#121512]/70 hover:text-[#121512]'
                  }`}
                >
                  Rent ({formatINR(monthlyRent)}/mo)
                </button>
                <button
                  type="button"
                  onClick={() => setMode('buy')}
                  className={`flex-1 py-2 rounded-full transition cursor-pointer ${
                    mode === 'buy'
                      ? 'bg-[#183D2B] text-white font-black shadow-md'
                      : 'text-[#121512]/70 hover:text-[#121512]'
                  }`}
                >
                  Buy Outright ({formatINR(buy)})
                </button>
              </div>

              {/* RENTAL TENURE & OPTIONS */}
              {mode === 'rent' && (
                <div className="space-y-4 p-5 bg-white rounded-3xl border border-[#183D2B]/15 shadow-sm">
                  
                  {/* Plan Switcher: Monthly Tenure vs Daily */}
                  <div className="flex items-center justify-between border-b border-[#183D2B]/10 pb-3">
                    <span className="text-xs font-mono font-bold uppercase text-[#183D2B]">
                      Rental Plan Structure
                    </span>
                    <div className="flex bg-[#F5F5EF] p-0.5 rounded-lg text-[11px] font-mono">
                      <button
                        type="button"
                        onClick={() => setRentalPlanType('tenure')}
                        className={`px-3 py-1 rounded-md transition ${
                          isMonthly ? 'bg-[#183D2B] text-[#C9F36B] font-bold' : 'text-[#121512]/60'
                        }`}
                      >
                        Monthly Tenure
                      </button>
                      <button
                        type="button"
                        onClick={() => setRentalPlanType('daily')}
                        className={`px-3 py-1 rounded-md transition ${
                          !isMonthly ? 'bg-[#183D2B] text-[#C9F36B] font-bold' : 'text-[#121512]/60'
                        }`}
                      >
                        Short-Term Days
                      </button>
                    </div>
                  </div>

                  {/* TENURE OPTION 1: MONTHLY TENURE SELECTION (1M, 3M, 6M, 12M) */}
                  {isMonthly ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#121512]/70 font-bold">Select Tenure Duration:</span>
                        <span className="text-emerald-800 font-bold">Higher tenure = Lower monthly rent</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {tenureData.tenures.map((t) => {
                          const isSelected = selectedTenureMonths === t.months;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setSelectedTenureMonths(t.months)}
                              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                                isSelected
                                  ? 'bg-[#183D2B] text-white border-[#183D2B] shadow-md ring-2 ring-[#C9F36B]/40'
                                  : 'bg-[#F5F5EF] text-[#121512] border-[#183D2B]/15 hover:border-[#183D2B]/40'
                              }`}
                            >
                              {t.popular && (
                                <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded bg-[#C9F36B] text-[#183D2B] text-[9px] font-mono font-bold uppercase">
                                  Popular
                                </span>
                              )}
                              <div className="text-xs font-bold">{t.label}</div>
                              <div className={`text-sm font-black font-mono mt-1 ${isSelected ? 'text-[#C9F36B]' : 'text-[#183D2B]'}`}>
                                {formatINR(t.monthlyRate)}<span className="text-[10px] font-normal">/mo</span>
                              </div>
                              {t.savingsPct > 0 && (
                                <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-white/80' : 'text-emerald-700 font-bold'}`}>
                                  Save {t.savingsPct}%
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* TENURE OPTION 2: SHORT-TERM DAILY PLAN */
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-mono text-[#121512]/70 font-bold block mb-1">
                            Start Date:
                          </label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => handleStartDateChange(e.target.value)}
                            className="w-full bg-[#F5F5EF] border border-[#183D2B]/15 rounded-xl px-3 py-2 text-xs font-mono text-[#121512] focus:outline-none focus:border-[#183D2B]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-mono text-[#121512]/70 font-bold block mb-1">
                            Return Date:
                          </label>
                          <input
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            className="w-full bg-[#F5F5EF] border border-[#183D2B]/15 rounded-xl px-3 py-2 text-xs font-mono text-[#121512] focus:outline-none focus:border-[#183D2B]"
                          />
                        </div>
                      </div>

                      {/* Quick Day Chips */}
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { label: '3 Days', days: 3 },
                          { label: '7 Days', days: 7 },
                          { label: '14 Days', days: 14 },
                          { label: '30 Days', days: 30 }
                        ].map((item) => (
                          <button
                            key={item.days}
                            type="button"
                            onClick={() => handleDurationPreset(item.days)}
                            className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition text-center cursor-pointer border ${
                              rentalDays === item.days
                                ? 'bg-[#183D2B] text-[#C9F36B] border-[#183D2B]'
                                : 'bg-[#F5F5EF] text-[#121512]/80 border-[#183D2B]/10 hover:border-[#183D2B]/30'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delivery Location & Pincode Checker */}
                  <div className="p-3 rounded-2xl bg-[#F5F5EF] border border-[#183D2B]/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Delivery in <strong>{selectedProduct.location || 'Mumbai, MH'}</strong></span>
                    </div>
                    <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      Delivered within 24-48 hrs
                    </span>
                  </div>

                  {/* SafeShield Damage Waiver Toggle */}
                  <div className="pt-1 border-t border-[#183D2B]/10 flex items-center justify-between text-xs font-mono">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeDamageWaiver}
                        onChange={(e) => setIncludeDamageWaiver(e.target.checked)}
                        className="rounded accent-[#183D2B] cursor-pointer"
                      />
                      <span>SafeShield Damage Waiver (+₹499)</span>
                    </label>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      Zero Liability
                    </span>
                  </div>

                  {/* Transparent Cost Breakdown */}
                  <div className="pt-2 border-t border-[#183D2B]/10 space-y-1.5 text-xs font-mono">
                    {isMonthly ? (
                      <div className="flex justify-between">
                        <span className="text-[#121512]/70">Monthly Rent ({selectedTenureMonths}m Plan):</span>
                        <span className="font-bold">{formatINR(monthlyRent)}/mo</span>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-[#121512]/70">Daily Base ({rentalDays}d × {formatINR(daily)}):</span>
                        <span className="font-bold">{formatINR(dailyRentalBase)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-emerald-800">
                      <span>100% Refundable Security Deposit:</span>
                      <span className="font-bold">{formatINR(refundableDeposit)}</span>
                    </div>

                    {includeDamageWaiver && (
                      <div className="flex justify-between">
                        <span className="text-[#121512]/70">SafeShield Damage Protection:</span>
                        <span className="font-bold">₹499</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-bold text-[#183D2B] pt-1.5 border-t border-[#183D2B]/10">
                      <span>Total Due Today:</span>
                      <span className="text-base font-black">{formatINR(initialDueAmount)}</span>
                    </div>
                  </div>

                </div>
              )}

              {/* Action Buttons: Add to Bag & Proceed to Razorpay */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    closeProductDetail();
                    openRazorpayCheckout({
                      productName: selectedProduct.name,
                      image: selectedProduct.image,
                      amount: grandTotal,
                      rentalCost: mode === 'rent' ? (isMonthly ? monthlyRent : dailyRentalBase) : buy,
                      securityDeposit: mode === 'rent' ? refundableDeposit : 0,
                      durationDays: isMonthly ? (selectedTenureMonths * 30) : rentalDays,
                      mode: mode
                    });
                  }}
                  className="w-full py-4 rounded-2xl bg-[#183D2B] hover:bg-[#121512] text-[#C9F36B] font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Zap className="w-4 h-4 fill-current text-[#C9F36B]" />
                  <span>Proceed to Payment ({formatINR(grandTotal)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(selectedProduct, mode, isMonthly ? (selectedTenureMonths * 30) : rentalDays);
                    closeProductDetail();
                    addToast({
                      type: 'success',
                      title: 'Added to Bag',
                      message: `${selectedProduct.name} added for ${isMonthly ? `${selectedTenureMonths} months tenure` : `${rentalDays} days rental`}!`
                    });
                  }}
                  className="w-full py-3 rounded-2xl bg-white hover:bg-black/5 text-[#121512] border border-[#183D2B]/15 font-mono text-xs font-bold transition cursor-pointer"
                >
                  + Add to Rental Bag
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
