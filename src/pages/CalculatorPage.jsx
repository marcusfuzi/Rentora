import React from 'react';
import RentVsBuyCalculator from '../components/RentVsBuyCalculator';
import ExternalPriceComparison from '../components/ExternalPriceComparison';
import { Calculator, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export default function CalculatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Intelligent Financial Modeling</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Smart Rent vs Buy <span className="text-gradient">Calculator</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Compare cumulative rental expenses against outright retail purchase. Discover your break-even duration and make data-backed gear acquisition decisions.
        </p>
      </div>

      <RentVsBuyCalculator />

      <div className="pt-8 border-t border-slate-800">
        <ExternalPriceComparison />
      </div>
    </div>
  );
}
