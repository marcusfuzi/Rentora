import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Heart, ArrowUpRight, Sparkles, Eye } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { useMarketplace } from '../context/MarketplaceContext';

export default function ProductCard({ product }) {
  const {
    savedProductIds,
    toggleSaveProduct,
    setActiveProductModal,
    setActiveRentModal,
    setActiveBuyModal
  } = useMarketplace();

  const isSaved = savedProductIds.includes(product.id);
  const canRent = product.listingType === 'Rent Only' || product.listingType === 'Rent & Sell';
  const canBuy = product.listingType === 'Sell Only' || product.listingType === 'Rent & Sell';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="glass-card rounded-2xl overflow-hidden flex flex-col group relative border border-slate-800/80 hover:border-cyan-500/40 shadow-xl"
    >
      {/* Image & Badges Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase backdrop-blur-md border ${
              product.listingType === 'Rent Only'
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                : product.listingType === 'Sell Only'
                ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {product.listingType}
          </span>
          <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-slate-900/80 text-slate-300 backdrop-blur-md border border-slate-700/60">
            {product.category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveProduct(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all z-10 ${
            isSaved
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-700/60'
          }`}
          title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Hover Quick View Overlay */}
        <div
          onClick={() => setActiveProductModal(product)}
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
        >
          <span className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 text-xs font-semibold text-white border border-cyan-500/50 shadow-lg">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Quick Specs & Details</span>
          </span>
        </div>

        {/* Availability Pill */}
        <div className="absolute bottom-2 left-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-900/80 text-slate-300 border border-slate-700/80 backdrop-blur-md">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                product.availability === 'In Stock' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            {product.availability}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Seller & Rating Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <div className="flex items-center gap-1 truncate max-w-[70%]">
              <span className="truncate">{product.seller?.name || 'Verified Seller'}</span>
              {product.seller?.verified && (
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" title="Verified Seller" />
              )}
            </div>
            <div className="flex items-center gap-1 text-amber-400 font-semibold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-500 text-[11px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => setActiveProductModal(product)}
            className="font-bold text-sm text-white line-clamp-2 hover:text-cyan-400 transition-colors cursor-pointer mb-3 leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Pricing Matrix */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="grid grid-cols-2 gap-2 mb-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
            {/* Rental Price */}
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                Rental Rate
              </div>
              {canRent ? (
                <div className="text-sm font-black text-cyan-400">
                  {formatCurrency(product.rentalPricePerDay)}
                  <span className="text-[11px] font-normal text-slate-400"> /day</span>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic mt-0.5">Not for rent</div>
              )}
            </div>

            {/* Buying Price */}
            <div className="border-l border-slate-800 pl-2">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                Purchase Price
              </div>
              {canBuy ? (
                <div className="text-sm font-black text-white">
                  {formatCurrency(product.sellingPrice)}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic mt-0.5">Rent only</div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {canRent ? (
              <button
                onClick={() => setActiveRentModal(product)}
                className="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(0,242,254,0.2)] transition-all flex items-center justify-center gap-1"
              >
                <span>Rent Now</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveProductModal(product)}
                className="w-full py-2 px-2.5 rounded-xl bg-slate-800 text-slate-400 font-semibold text-xs border border-slate-700"
              >
                Details
              </button>
            )}

            {canBuy ? (
              <button
                onClick={() => setActiveBuyModal(product)}
                className="w-full py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 text-white font-bold text-xs transition-all flex items-center justify-center gap-1"
              >
                <span>Buy Now</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveProductModal(product)}
                className="w-full py-2 px-2.5 rounded-xl bg-slate-800 text-slate-400 font-semibold text-xs border border-slate-700"
              >
                Inquire
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
