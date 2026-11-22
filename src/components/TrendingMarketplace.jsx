import React, { useState } from 'react';
import { Search, Star, MapPin, ArrowUpRight, ShoppingBag, Filter, CheckCircle2, Clock, Tag, ArrowUpDown, ShieldCheck, Zap, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useRentora } from '../context/RentoraContext';
import { formatINR } from '../data/rentoraData';

export default function TrendingMarketplace() {
  const {
    activeMode,
    setActiveMode,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedLocation,
    setSelectedLocation,
    products,
    addToCart,
    openProductDetail,
    openComparisonModal,
    openRazorpayCheckout,
    addToast
  } = useRentora();

  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-low' | 'price-high' | 'rating'
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under-2k' | '2k-5k' | 'above-5k'

  const categories = [
    "All",
    "Cameras & Photography",
    "Laptops & MacBooks",
    "Gaming Consoles",
    "Projectors",
    "Audio Equipment",
    "Tools & Gadgets"
  ];

  const locations = [
    "All Locations",
    "Mumbai, MH",
    "Bengaluru, KA",
    "Delhi NCR",
    "Hyderabad, TS",
    "Pune, MH"
  ];

  // Filtering products
  let filteredProducts = (products || []).filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.specs && product.specs.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesLocation = selectedLocation === "All Locations" || (product.location && product.location.includes(selectedLocation.split(',')[0]));
    
    // Price tier filtering
    let matchesPrice = true;
    if (priceFilter === 'under-2k') {
      matchesPrice = product.dailyRate < 2000;
    } else if (priceFilter === '2k-5k') {
      matchesPrice = product.dailyRate >= 2000 && product.dailyRate <= 5000;
    } else if (priceFilter === 'above-5k') {
      matchesPrice = product.dailyRate > 5000;
    }

    return matchesCategory && matchesSearch && matchesLocation && matchesPrice;
  });

  // Sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') {
      const priceA = activeMode === 'rent' ? a.dailyRate : a.buyPrice;
      const priceB = activeMode === 'rent' ? b.dailyRate : b.buyPrice;
      return priceA - priceB;
    }
    if (sortBy === 'price-high') {
      const priceA = activeMode === 'rent' ? a.dailyRate : a.buyPrice;
      const priceB = activeMode === 'rent' ? b.dailyRate : b.buyPrice;
      return priceB - priceA;
    }
    if (sortBy === 'rating') {
      return (b.rating || 5) - (a.rating || 5);
    }
    return 0; // featured default
  });

  return (
    <section id="marketplace" className="py-24 bg-[#F5F5EF] text-[#121512] relative select-none border-t border-[#183D2B]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Marketplace Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-[#183D2B]/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#183D2B] text-[#C9F36B] text-xs font-mono uppercase font-bold tracking-wider mb-2 border border-[#C9F36B]/30 shadow-sm">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>05 / Verified Hardware Exchange</span>
            </div>
            <h2 className="font-serif font-black text-4xl sm:text-6xl text-[#121512] uppercase tracking-tight">
              TRENDING MARKETPLACE
            </h2>
            <p className="text-sm sm:text-base text-[#121512]/75 mt-2 font-medium max-w-xl">
              Flight-cased camera packages, mobile 8K suites, and industrial grade gear. Compare live with Amazon & Flipkart in Indian Rupee (₹).
            </p>
          </div>

          {/* Mode Switcher Pill */}
          <div className="flex items-center bg-white p-1.5 rounded-full border border-[#183D2B]/15 text-xs font-bold shadow-sm">
            <button
              onClick={() => setActiveMode('rent')}
              className={`px-6 py-2.5 rounded-full transition-all cursor-pointer font-mono ${
                activeMode === 'rent'
                  ? 'bg-[#183D2B] text-[#C9F36B] font-bold shadow-md'
                  : 'text-[#121512]/70 hover:text-[#121512]'
              }`}
            >
              Rent Equipment
            </button>
            <button
              onClick={() => setActiveMode('buy')}
              className={`px-6 py-2.5 rounded-full transition-all cursor-pointer font-mono ${
                activeMode === 'buy'
                  ? 'bg-[#183D2B] text-white font-bold shadow-md'
                  : 'text-[#121512]/70 hover:text-[#121512]'
              }`}
            >
              Buy Outright
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#183D2B]/15 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#121512]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search camera, laptop, PS5 Pro, lens, audio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5F5EF] border border-[#183D2B]/15 text-sm text-[#121512] placeholder-[#121512]/40 focus:outline-none focus:border-[#183D2B]"
              />
            </div>

            {/* City Location Filter */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#183D2B] shrink-0" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="py-2.5 px-3 rounded-xl bg-[#F5F5EF] border border-[#183D2B]/15 text-xs text-[#121512] font-mono focus:outline-none focus:border-[#183D2B]"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc} className="bg-white text-[#121512]">
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Tier Filter */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#183D2B] shrink-0" />
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="py-2.5 px-3 rounded-xl bg-[#F5F5EF] border border-[#183D2B]/15 text-xs text-[#121512] font-mono focus:outline-none focus:border-[#183D2B]"
              >
                <option value="all">All Daily Rates</option>
                <option value="under-2k">Under ₹2,000 / day</option>
                <option value="2k-5k">₹2,000 - ₹5,000 / day</option>
                <option value="above-5k">₹5,000+ / day</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-[#121512]/50 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2.5 px-3 rounded-xl bg-[#F5F5EF] border border-[#183D2B]/15 text-xs text-[#121512] font-mono focus:outline-none focus:border-[#183D2B]"
              >
                <option value="featured">Featured Rig</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Category Horizontal Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#183D2B] text-[#C9F36B] font-bold shadow-md'
                    : 'bg-[#F5F5EF] text-[#121512]/70 hover:text-[#121512] hover:bg-[#183D2B]/10 border border-[#183D2B]/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const rentPrice = product.dailyRate;
            const buyPrice = product.buyPrice;
            const savingsVsBuy = Math.max(0, (product.amazonPrice || buyPrice) - (rentPrice * 3));
            const savingsPct = Math.round((savingsVsBuy / (product.amazonPrice || buyPrice)) * 100);

            return (
              <div
                key={product.id}
                className="group bg-white rounded-3xl border border-[#183D2B]/15 hover:border-[#183D2B] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/10">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#183D2B] text-[#C9F36B] text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm border border-[#C9F36B]/30">
                        {product.badge || 'Verified Rig'}
                      </span>
                      {product.savingsText && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#C9F36B] text-[#183D2B] text-[10px] font-bold uppercase tracking-tight shadow-sm flex items-center gap-1 font-mono">
                          <Tag className="w-3 h-3" />
                          <span>{product.savingsText}</span>
                        </span>
                      )}
                    </div>

                    {/* Rating Pill */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-white flex items-center gap-1 border border-white/10">
                      <Star className="w-3.5 h-3.5 fill-[#C9F36B] text-[#C9F36B]" />
                      <span>{product.rating || '4.9'}</span>
                    </div>

                    {/* Location Badge */}
                    <div className="absolute bottom-3 left-3 text-[10px] font-mono text-white bg-black/70 backdrop-blur px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-white/10">
                      <MapPin className="w-3 h-3 text-[#C9F36B]" />
                      <span>{product.location || 'Mumbai, MH'}</span>
                    </div>

                    {/* Savings Tag on Rent */}
                    <div className="absolute bottom-3 right-3 text-[10px] font-mono text-[#183D2B] bg-[#C9F36B] font-bold px-2 py-0.5 rounded-md shadow">
                      Save {savingsPct}%
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#121512]/60 uppercase">
                      <span>{product.category}</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        In Stock
                      </span>
                    </div>

                    <h3
                      onClick={() => openProductDetail(product, activeMode)}
                      className="font-serif font-bold text-lg sm:text-xl text-[#121512] tracking-tight group-hover:text-[#183D2B] transition cursor-pointer"
                    >
                      {product.name}
                    </h3>

                    {/* Specs Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.specs?.slice(0, 2).map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="px-2 py-0.5 rounded bg-[#F5F5EF] border border-[#183D2B]/10 text-[10px] font-mono text-[#121512]/80"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>

                    {/* Quick Market Price Benchmark button (Amazon & Flipkart) */}
                    <button
                      type="button"
                      onClick={() => openComparisonModal(product)}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-[#F5F5EF] hover:bg-[#183D2B]/10 border border-[#183D2B]/15 text-[#121512] text-[11px] font-mono flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#183D2B]" />
                        <span>Compare Amazon & Flipkart</span>
                      </span>
                      <span className="text-xs font-bold text-[#183D2B]">Live Parity →</span>
                    </button>
                  </div>
                </div>

                {/* Card Footer: Pricing & Razorpay Actions */}
                <div className="p-5 bg-[#F5F5EF] border-t border-[#183D2B]/10 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#121512]/60 block">
                        {activeMode === 'rent' ? 'Daily Rental' : 'Outright Buy'}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl sm:text-2xl font-black text-[#121512] font-mono">
                          {formatINR(activeMode === 'rent' ? rentPrice : buyPrice)}
                        </span>
                        {activeMode === 'rent' && (
                          <span className="text-xs text-[#121512]/60 font-mono">/day</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => openProductDetail(product, activeMode)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#183D2B]/10 border border-[#183D2B]/15 text-xs font-mono text-[#121512]/80 transition cursor-pointer"
                    >
                      Specs
                    </button>
                  </div>

                  {/* Action Buttons: Rent Options & Add to Bag */}
                  <div className="grid grid-cols-12 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => openProductDetail(product, activeMode)}
                      className="col-span-8 py-2.5 px-3 rounded-xl bg-[#183D2B] hover:bg-[#121512] text-[#C9F36B] font-mono text-xs font-bold uppercase transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9F36B]" />
                      <span>{activeMode === 'rent' ? 'Rent Options & Dates' : 'Buy Options'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        addToCart(product, activeMode, 3);
                        addToast({ type: 'success', title: 'Added to Bag', message: `Added "${product.name}" to your rental bag!` });
                      }}
                      className="col-span-4 py-2.5 rounded-xl bg-white hover:bg-black/5 text-[#121512] font-mono text-xs font-bold uppercase transition flex items-center justify-center gap-1 border border-[#183D2B]/15 cursor-pointer shadow-sm active:scale-95"
                    >
                      <span>+ Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state if no products match filter */}
        {filteredProducts.length === 0 && (
          <div className="py-16 text-center bg-white rounded-3xl border border-[#183D2B]/15 p-8 max-w-lg mx-auto space-y-3">
            <span className="text-3xl">🔍</span>
            <h3 className="font-serif font-bold text-xl text-[#121512]">No Equipment Found</h3>
            <p className="text-sm text-[#121512]/60">
              No rigs matched your current filter criteria. Try adjusting your search query or price tier.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setPriceFilter('all');
                setSelectedLocation('All Locations');
              }}
              className="px-5 py-2 rounded-full bg-[#183D2B] text-[#C9F36B] font-mono text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
