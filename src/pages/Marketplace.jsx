import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  Sparkles,
  X,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { MARKETPLACE_CATEGORIES, formatCurrency } from '../utils/helpers';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';

export default function Marketplace() {
  const {
    products,
    marketplaceCategory,
    setMarketplaceCategory,
    marketplaceSearch,
    setMarketplaceSearch,
    loading
  } = useMarketplace();

  // Filter states
  const [selectedType, setSelectedType] = useState('All'); // 'All' | 'Rent & Sell' | 'Rent Only' | 'Sell Only'
  const [maxPrice, setMaxPrice] = useState(400000);
  const [sortOption, setSortOption] = useState('featured'); // 'featured' | 'price-low' | 'price-high' | 'rating'
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filtered & Sorted list
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (
          marketplaceCategory !== 'All' &&
          p.category.toLowerCase() !== marketplaceCategory.toLowerCase()
        ) {
          return false;
        }
        // Listing Type
        if (selectedType !== 'All' && p.listingType !== selectedType) {
          return false;
        }
        // Price ceiling
        const itemPrice = p.sellingPrice || p.rentalPricePerDay * 30;
        if (itemPrice > maxPrice) {
          return false;
        }
        // Stock
        if (inStockOnly && p.availability !== 'In Stock') {
          return false;
        }
        // Search
        if (marketplaceSearch.trim()) {
          const q = marketplaceSearch.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q);
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'price-low') {
          return (a.rentalPricePerDay || a.sellingPrice) - (b.rentalPricePerDay || b.sellingPrice);
        }
        if (sortOption === 'price-high') {
          return (b.rentalPricePerDay || b.sellingPrice) - (a.rentalPricePerDay || a.sellingPrice);
        }
        if (sortOption === 'rating') {
          return b.rating - a.rating;
        }
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    products,
    marketplaceCategory,
    selectedType,
    maxPrice,
    inStockOnly,
    marketplaceSearch,
    sortOption
  ]);

  const clearAllFilters = () => {
    setMarketplaceCategory('All');
    setSelectedType('All');
    setMaxPrice(400000);
    setMarketplaceSearch('');
    setInStockOnly(false);
    setSortOption('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Discover & Book Equipment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Rentora <span className="text-gradient">Marketplace</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Choose from authentic, inspected cameras, laptops, drones, consoles, and specialized gear available for short-term rental or permanent purchase.
          </p>
        </div>

        {/* Search bar & filter toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={marketplaceSearch}
              onChange={(e) => setMarketplaceSearch(e.target.value)}
              placeholder="Search equipment..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
            />
            {marketplaceSearch && (
              <button
                onClick={() => setMarketplaceSearch('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Category Strip */}
      <div className="py-6 border-b border-slate-800/80">
        <CategoryFilter
          selectedCategory={marketplaceCategory}
          onSelectCategory={(cat) => setMarketplaceCategory(cat)}
        />
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Desktop Sidebar (3 cols) */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                <span>Filters</span>
              </span>
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Listing Type Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Listing Type
              </label>
              <div className="space-y-1.5">
                {['All', 'Rent & Sell', 'Rent Only', 'Sell Only'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      selectedType === t
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Budget Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-bold text-slate-300 uppercase tracking-wider">
                  Price Limit
                </span>
                <span className="font-bold text-cyan-400">{formatCurrency(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="400000"
                step="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* In-Stock Toggle */}
            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>In Stock & Ready for Immediate Dispatch</span>
              </label>
            </div>
          </div>
        </div>

        {/* Product Grid Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Sort and Results Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400">
              Showing <span className="font-bold text-white">{filteredProducts.length}</span> verified equipment items
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort:</span>
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass-card rounded-3xl border border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No matching products found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try widening your price filter, changing category, or resetting search keywords.
              </p>
              <button
                onClick={clearAllFilters}
                className="py-2.5 px-5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
