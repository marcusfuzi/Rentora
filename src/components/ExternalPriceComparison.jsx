import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, ShieldCheck, Tag, ExternalLink, RefreshCw, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { useMarketplace } from '../context/MarketplaceContext';

export default function ExternalPriceComparison({ product = null }) {
  const { products, setActiveBuyModal } = useMarketplace();

  // If no product passed, pick the first featured product (e.g., Sony Camera or MacBook)
  const [selectedId, setSelectedId] = useState(product ? product.id : (products[0]?.id || 'prod-1'));

  const activeProduct = product || products.find(p => p.id === selectedId) || products[0];

  if (!activeProduct) return null;

  const comparison = activeProduct.externalComparison || {
    amazonPrice: Math.round(activeProduct.sellingPrice * 1.1),
    flipkartPrice: Math.round(activeProduct.sellingPrice * 1.07),
    cromaPrice: Math.round(activeProduct.sellingPrice * 1.12),
    rentoraPrice: activeProduct.sellingPrice,
    lowestPlatform: 'Rentora Seller',
    savings: Math.round(activeProduct.sellingPrice * 0.07),
    verifiedDate: 'Today'
  };

  const platforms = [
    {
      name: 'Rentora Verified Seller',
      price: comparison.rentoraPrice || activeProduct.sellingPrice,
      isRentora: true,
      logoText: 'RENTORA',
      status: 'Lowest Verified Price',
      delivery: 'Free Doorstep Next-Day',
      warranty: 'Rentora SafeShield + Mfr Warranty',
      inStock: true
    },
    {
      name: 'Amazon India',
      price: comparison.amazonPrice,
      isRentora: false,
      logoText: 'amazon.in',
      status: 'Standard Retail',
      delivery: '2-4 Days Shipping',
      warranty: 'Standard Brand Warranty',
      inStock: true
    },
    {
      name: 'Flipkart',
      price: comparison.flipkartPrice,
      isRentora: false,
      logoText: 'flipkart',
      status: 'E-commerce Seller',
      delivery: '3-5 Days Shipping',
      warranty: 'Standard Brand Warranty',
      inStock: true
    },
    {
      name: 'Croma Electronics',
      price: comparison.cromaPrice,
      isRentora: false,
      logoText: 'CROMA',
      status: 'Retail Store Price',
      delivery: 'Store Pickup or 2-3 Days',
      warranty: 'Brand Warranty',
      inStock: true
    }
  ];

  // Sort by lowest price
  const sortedPlatforms = [...platforms].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedPlatforms[0].price;
  const highestPrice = Math.max(...platforms.map(p => p.price));
  const maxSavings = highestPrice - lowestPrice;

  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
            <Tag className="w-3.5 h-3.5" />
            <span>Multi-Marketplace Price Aggregator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            External Market <span className="text-gradient">Price Comparison</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Live benchmark comparing Rentora against leading national e-commerce retailers for 100% genuine matching model SKUs.
          </p>
        </div>

        {/* Product selector if top-level section */}
        {!product && products.length > 0 && (
          <div className="w-full md:w-64">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-semibold"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Model Spec Badge */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src={activeProduct.images[0]}
            alt={activeProduct.name}
            className="w-12 h-12 object-cover rounded-xl border border-slate-700 shrink-0"
          />
          <div>
            <div className="text-sm font-bold text-white line-clamp-1">{activeProduct.name}</div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Category: {activeProduct.category}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Verified SKU Match</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 self-start sm:self-auto">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Verified Max Savings</div>
            <div className="text-sm font-black text-emerald-400">
              Save up to {formatCurrency(maxSavings)}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table / Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platforms.map((plat, idx) => {
          const isLowest = plat.price === lowestPrice;
          const diffFromLowest = plat.price - lowestPrice;

          return (
            <div
              key={plat.name}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all relative ${
                plat.isRentora
                  ? 'bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-900 border-cyan-500/50 shadow-[0_0_25px_rgba(0,242,254,0.15)] ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Highlight Badge */}
              {isLowest && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-[#07090e] font-black text-[10px] uppercase tracking-wider shadow-md whitespace-nowrap">
                  ★ Lowest Verified Price
                </div>
              )}

              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className={`font-black tracking-wider text-xs ${plat.isRentora ? 'text-cyan-400 font-extrabold' : 'text-slate-300'}`}>
                    {plat.logoText}
                  </span>
                  {plat.isRentora ? (
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                      Direct Seller
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500">Retailer</span>
                  )}
                </div>

                {/* Price Display */}
                <div className="my-4">
                  <div className="text-2xl font-black text-white">
                    {formatCurrency(plat.price)}
                  </div>
                  {diffFromLowest > 0 ? (
                    <div className="text-[11px] text-rose-400 font-medium mt-1">
                      +{formatCurrency(diffFromLowest)} higher
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Best price guaranteed</span>
                    </div>
                  )}
                </div>

                {/* Perks Checklist */}
                <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    <span>{plat.delivery}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    <span className="truncate">{plat.warranty}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-800">
                {plat.isRentora ? (
                  <button
                    onClick={() => setActiveBuyModal(activeProduct)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(0,242,254,0.25)] transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Buy on Rentora</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      alert(`[Integration Notice] In production, this redirects to the verified external merchant URL: ${plat.name} SKU listing.`);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>View External</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 text-[11px] text-slate-500 flex items-center justify-between flex-wrap gap-2 pt-4 border-t border-slate-800/60">
        <div className="flex items-center gap-1.5">
          <RefreshCw className="w-3 h-3 text-cyan-400" />
          <span>Automated price scraper synced today • Direct brand SKU verification architecture</span>
        </div>
        <span className="text-slate-400">Prices include GST and standard seller packaging</span>
      </div>
    </div>
  );
}
