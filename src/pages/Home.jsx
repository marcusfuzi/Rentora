import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal,
  CheckCircle2,
  Star,
  Users,
  Award,
  Zap,
  Tag,
  Coins,
  Store
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import Hero3D from '../components/Hero3D';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import RentVsBuyCalculator from '../components/RentVsBuyCalculator';
import ExternalPriceComparison from '../components/ExternalPriceComparison';
import TryBeforeYouBuy from '../components/TryBeforeYouBuy';
import HowItWorks from '../components/HowItWorks';
import { formatCurrency } from '../utils/helpers';

export default function Home() {
  const { products, navigateTo } = useMarketplace();
  const { openAuth, user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterType, setFilterType] = useState('All'); // 'All' | 'Rent & Sell' | 'Rent Only' | 'Sell Only'

  // Filter products for trending section
  const trendingProducts = products
    .filter((p) => {
      if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (filterType !== 'All' && p.listingType !== filterType) {
        return false;
      }
      return true;
    })
    .slice(0, 8);

  const testimonials = [
    {
      id: 1,
      name: 'Aditya Sen',
      role: 'Cinematographer & Commercial Director',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      comment:
        'Rentora changed how our studio shoots. Renting a ₹3.2 Lakh Canon R5 kit for our 4-day shoot cost barely ₹7,600, and the escrow deposit was released straight back to my bank within 12 hours.',
      rating: 5,
      item: 'Canon EOS R5 Mirrorless'
    },
    {
      id: 2,
      name: 'Priyanka Ghosh',
      role: 'Indie Game Developer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      comment:
        'The Try Before You Buy feature is pure genius! I rented the MacBook M3 Max for a 1-week benchmark sprint. When I decided to keep it permanently, Rentora deducted 100% of my rental charges.',
      rating: 5,
      item: 'MacBook Pro 16" M3 Max'
    },
    {
      id: 3,
      name: 'Rajesh Nair',
      role: 'Verified Equipment Seller',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      comment:
        'I had two professional Sony bodies and lenses sitting idle on weekdays. Listing them on Rentora now generates over ₹65,000 every month in pure passive rental income with zero risk.',
      rating: 5,
      item: 'Apex Visuals Lab Partner'
    }
  ];

  return (
    <div className="w-full flex flex-col gap-16 sm:gap-24 overflow-hidden">
      {/* SECTION 1 & 2: HERO SECTION WITH 3D CANVAS */}
      <section className="relative pt-8 sm:pt-12 pb-12 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content (7 cols) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Top Banner Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-cyan-500/30 text-xs font-bold text-cyan-300 shadow-[0_0_20px_rgba(0,242,254,0.2)]">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Next-Gen Smart Rental & Buying Marketplace</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
                Rent It. Own It. <br />
                <span className="text-gradient">Choose Smarter.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
                Discover a smarter way to rent and buy the products you love. Compare external retail prices, calculate break-even timelines, and test high-end gear before committing.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={() => navigateTo('marketplace')}
                  className="px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-sm shadow-[0_0_30px_rgba(0,242,254,0.35)] transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Explore Marketplace</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => {
                    if (user?.role === 'seller') {
                      navigateTo('seller-dashboard');
                    } else {
                      openAuth('register', 'seller');
                    }
                  }}
                  className="px-7 py-4 rounded-2xl glass-card hover:bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Store className="w-4 h-4 text-emerald-400" />
                  <span>Start Selling & Renting Out</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">₹4.8 Cr+</div>
                  <div className="text-[11px] text-slate-400">Total Rental Volume</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-cyan-400">100%</div>
                  <div className="text-[11px] text-slate-400">Escrow Security</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-purple-400">1,200+</div>
                  <div className="text-[11px] text-slate-400">Verified Gadgets</div>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Interactive 3D Canvas (5 cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="lg:col-span-5 relative"
            >
              <Hero3D />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider mb-1">
              Browse by Department
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Featured Product <span className="text-gradient">Categories</span>
            </h2>
          </div>
          <button
            onClick={() => navigateTo('marketplace')}
            className="text-xs font-bold text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>View All in Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />
      </section>

      {/* SECTION 4: TRENDING PRODUCTS MARKETPLACE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase font-extrabold text-purple-400 tracking-wider mb-1">
              Top Rated & Most Booked
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Trending <span className="text-gradient">Equipment Listings</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start sm:self-auto">
            {['All', 'Rent & Sell', 'Rent Only', 'Sell Only'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === t
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => navigateTo('marketplace')}
            className="px-8 py-3.5 rounded-2xl glass-card hover:bg-slate-800 border border-slate-700 hover:border-cyan-400/50 text-white font-bold text-xs transition-all inline-flex items-center gap-2"
          >
            <span>Explore All {products.length} Marketplace Listings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SECTION 5: SMART RENT VS BUY CALCULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <RentVsBuyCalculator />
      </section>

      {/* SECTION 6: TRY BEFORE YOU BUY FEATURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <TryBeforeYouBuy />
      </section>

      {/* SECTION 7: HOW RENTORA WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <HowItWorks />
      </section>

      {/* SECTION 8: EXTERNAL PRICE COMPARISON (SMARTPRICE ENGINE) */}
      <section id="price-comparison-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <ExternalPriceComparison />
      </section>

      {/* SECTION 9: WHY CHOOSE RENTORA (VALUE PROPOSITIONS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Institutional Grade Trust & Security</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why Choose <span className="text-gradient">Rentora</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Combining modern consumer protection with intelligent peer-to-peer equipment sharing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">SafeShield Escrow Vault</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Security deposits are never held directly by sellers. Funds remain in RBI-compliant escrow until the item is returned and condition verified.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">100% Try & Buy Credit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unsure if an item fits your long-term workflow? Rent it for up to 14 days; if you decide to keep it, your rental fees convert into instant purchase credit.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Verified Commercial Sellers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every owner undergoes biometric and business verification. All gear is sanitized, tested for sensor cleanliness, and securely packaged.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs uppercase font-extrabold text-amber-400 tracking-wider mb-2">
            Verified Community Feedback
          </div>
          <h2 className="text-3xl font-black text-white">
            Loved by Creators, Studios & <span className="text-gradient">Renters</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center text-amber-400 gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic mb-6">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="text-xs font-bold text-white">{t.name}</div>
                  <div className="text-[10px] text-slate-400">{t.role}</div>
                  <div className="text-[10px] text-cyan-400 font-semibold mt-0.5">Item: {t.item}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 11: SELLER REGISTRATION CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8">
        <div className="relative glass-card rounded-3xl p-8 sm:p-12 border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(0,242,254,0.15)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
                <Coins className="w-4 h-4" />
                <span>Monetize Idle Gear</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Have Equipment Sitting Idle? <br />
                <span className="text-gradient">Earn up to ₹75,000 / month.</span>
              </h2>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                List cameras, laptops, drones, or tools. Set your daily rates, retain full ownership, and enjoy total escrow and insurance coverage on every rental.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  if (user?.role === 'seller') {
                    navigateTo('seller-dashboard');
                  } else {
                    openAuth('register', 'seller');
                  }
                }}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
              >
                <span>Register as a Seller</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
