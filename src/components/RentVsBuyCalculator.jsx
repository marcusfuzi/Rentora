import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, Sparkles, TrendingUp, CheckCircle, ShieldAlert, Sliders } from 'lucide-react';
import { formatCurrency, calculateRentVsBuy } from '../utils/helpers';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export default function RentVsBuyCalculator({ initialProduct = null }) {
  const { products, setActiveRentModal, setActiveBuyModal } = useMarketplace();

  // If initial product provided, use it; otherwise default to first camera/laptop
  const [selectedProductId, setSelectedProductId] = useState(
    initialProduct ? initialProduct.id : (products[0]?.id || 'prod-1')
  );
  const [customMode, setCustomMode] = useState(!initialProduct && products.length === 0);
  const [customDailyRate, setCustomDailyRate] = useState(1200);
  const [customBuyPrice, setCustomBuyPrice] = useState(195000);
  const [durationDays, setDurationDays] = useState(30);

  // Active product or custom values
  const activeProduct = useMemo(() => {
    if (customMode) return null;
    return products.find(p => p.id === selectedProductId) || products[0] || null;
  }, [selectedProductId, customMode, products]);

  const dailyRate = customMode ? customDailyRate : (activeProduct?.rentalPricePerDay || 1200);
  const purchasePrice = customMode ? customBuyPrice : (activeProduct?.sellingPrice || 195000);

  const metrics = useMemo(() => {
    return calculateRentVsBuy(dailyRate, purchasePrice, durationDays);
  }, [dailyRate, purchasePrice, durationDays]);

  // Generate chart data up to 1.5x break-even or 120 days
  const chartData = useMemo(() => {
    const maxDays = Math.max(90, Math.min(180, metrics.breakEvenDays * 1.4));
    const step = Math.max(1, Math.floor(maxDays / 12));
    const data = [];

    for (let day = 0; day <= maxDays; day += step) {
      data.push({
        day: `Day ${day}`,
        daysNum: day,
        rentalCost: day * dailyRate,
        buyCost: purchasePrice
      });
    }
    return data;
  }, [dailyRate, purchasePrice, metrics.breakEvenDays]);

  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Smart Financial Decision Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Rent vs Buy <span className="text-gradient">Intelligence</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Simulate your intended usage duration. Our algorithmic break-even analyzer identifies whether renting or buying delivers maximum capital efficiency.
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setCustomMode(false)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              !customMode
                ? 'bg-cyan-500 text-[#07090e] shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Catalog Item
          </button>
          <button
            onClick={() => setCustomMode(true)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              customMode
                ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Custom Input
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Controls (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Item Selector */}
          {!customMode ? (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Select Product from Marketplace
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 font-medium"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.name} ({formatCurrency(p.rentalPricePerDay)}/day vs {formatCurrency(p.sellingPrice)})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Daily Rental Rate
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={customDailyRate}
                    onChange={(e) => setCustomDailyRate(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Purchase Price
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={customBuyPrice}
                    onChange={(e) => setCustomBuyPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-400 font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Duration Slider */}
          <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Planned Rental Duration
              </span>
              <span className="text-lg font-black text-cyan-400">{durationDays} Days</span>
            </div>
            <input
              type="range"
              min="1"
              max="180"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
              <span>1 Day</span>
              <span>30 Days (1 Mo)</span>
              <span>90 Days (3 Mo)</span>
              <span>180 Days</span>
            </div>

            {/* Quick Presets */}
            <div className="flex gap-2 mt-3">
              {[3, 7, 14, 30, 60, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setDurationDays(d)}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    durationDays === d
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics Breakdown Card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-cyan-500/20">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                Total Rental Cost
              </div>
              <div className="text-xl font-black text-cyan-400 mt-0.5">
                {formatCurrency(metrics.totalRentCost)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {metrics.percentageOfPurchase}% of purchase price
              </div>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-purple-500/20">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                Outright Purchase Price
              </div>
              <div className="text-xl font-black text-white mt-0.5">
                {formatCurrency(metrics.purchasePrice)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">One-time capital outlay</div>
            </div>
          </div>

          {/* Break-even Indicator */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Break-Even Threshold</div>
                <div className="text-[11px] text-slate-400">Renting exceeds buying beyond this</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-black text-indigo-300">
                {metrics.breakEvenDays} Days
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {metrics.durationDays < metrics.breakEvenDays
                  ? `${metrics.breakEvenDays - metrics.durationDays} days remaining`
                  : 'Threshold crossed'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Graph & Recommendation (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5">
          {/* Recommendation Banner */}
          <motion.div
            key={metrics.recommendation}
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              metrics.recommendation === 'RENT'
                ? 'bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border-cyan-500/40 shadow-[0_0_25px_rgba(0,242,254,0.15)]'
                : 'bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.15)]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase ${
                    metrics.recommendation === 'RENT'
                      ? 'bg-cyan-400 text-[#07090e]'
                      : 'bg-purple-500 text-white'
                  }`}
                >
                  Recommendation: {metrics.recommendation}
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  {metrics.recommendation === 'RENT'
                    ? `Save ${formatCurrency(metrics.savings)}`
                    : `Saves ongoing fees`}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-md">
                {metrics.advice}
              </p>
            </div>

            {/* Direct CTA */}
            {activeProduct && (
              <div className="shrink-0">
                {metrics.recommendation === 'RENT' ? (
                  <button
                    onClick={() => setActiveRentModal(activeProduct)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <span>Rent for {durationDays}d</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveBuyModal(activeProduct)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <span>Buy Outright</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* Interactive Recharts Graph */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-300">
                Cumulative Rental Cost vs Flat Purchase Price
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  Rental Cumulative
                </span>
                <span className="flex items-center gap-1.5 text-purple-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  Buy Threshold
                </span>
              </div>
            </div>

            <div className="w-full h-52 sm:h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    stroke="#475569"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#475569"
                    fontSize={10}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d121f',
                      border: '1px solid #1e293b',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#fff'
                    }}
                    formatter={(val) => [formatCurrency(val), '']}
                  />
                  <ReferenceLine
                    y={purchasePrice}
                    stroke="#a855f7"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    label={{
                      value: `Purchase: ${formatCurrency(purchasePrice)}`,
                      fill: '#c084fc',
                      fontSize: 10,
                      position: 'insideTopRight'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rentalCost"
                    name="Rental Cost"
                    stroke="#00f2fe"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#rentGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[11px] text-slate-500 mt-2 text-center">
              The crossover point at <span className="text-indigo-400 font-semibold">{metrics.breakEvenDays} days</span> signifies where total rental spend matches the retail buying price.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
