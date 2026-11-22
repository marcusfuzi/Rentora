import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Sparkles, ShieldCheck, Zap, CheckCircle2, ChevronRight, Sliders, Play, Radio, MapPin, Tag } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HERO_PRODUCTS, formatINR } from '../data/rentoraData';
import { scrollToSection } from '../utils/smoothScroll';
import { useRentora } from '../context/RentoraContext';

gsap.registerPlugin(ScrollTrigger);

export default function CinematicHero() {
  const { openRazorpayCheckout, openProductDetail, openComparisonModal, addToCart, addToast } = useRentora();
  const heroRef = useRef(null);
  const headlineWordsRef = useRef([]);
  const stageRef = useRef(null);
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(3); // 1, 3, or 7 days

  const activeProduct = HERO_PRODUCTS[activeHeroIdx] || HERO_PRODUCTS[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Staggered headline reveal
      const words = headlineWordsRef.current.filter(Boolean);
      gsap.fromTo(
        words,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.15
        }
      );

      // 2. Sub-elements entry
      gsap.fromTo(
        '.hero-sub-element',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.4 }
      );

      // 3. Gentle stage scroll zoom
      if (stageRef.current) {
        gsap.to(stageRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          },
          scale: 1.03,
          y: -20,
          ease: 'power1.out'
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const headlineLines = [
    ["RENT", "LESS."],
    ["EXPERIENCE", "MORE."]
  ];

  const brandPartners = [
    "HASSELBLAD",
    "LEICA CINE",
    "APPLE PRO",
    "RED DIGITAL",
    "SONY FX",
    "PLAYSTATION",
    "FESTOOL",
    "DJI ENTERPRISE",
    "FOCAL HI-FI"
  ];

  // Calculated rental cost based on selected duration
  const baseRate = activeProduct.dailyRate;
  const calculatedRent = selectedDuration === 1
    ? baseRate
    : selectedDuration === 3
    ? baseRate * 3
    : Math.round(activeProduct.weeklyRate || baseRate * 7 * 0.9);
  
  const calculatedSavings = Math.max(0, activeProduct.amazonPrice - calculatedRent);
  const savingsPercent = Math.round((calculatedSavings / activeProduct.amazonPrice) * 100);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen w-full bg-[#F5F5EF] text-[#121512] flex flex-col justify-between pt-28 sm:pt-32 pb-8 overflow-hidden select-none"
    >
      {/* Ambient background soft glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-gradient-to-b from-[#C9F36B]/25 via-[#183D2B]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle architectural grid */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(to_right,#183D2B0D_1px,transparent_1px),linear-gradient(to_bottom,#183D2B0D_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 text-center space-y-7 my-auto">
        
        {/* Live Network & Guarantee Pill */}
        <div className="hero-sub-element inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#183D2B] text-white border border-[#C9F36B]/40 shadow-sm text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#C9F36B] animate-pulse" />
          <span className="uppercase tracking-widest text-[11px] font-bold text-[#C9F36B]">
            Premium Rental Marketplace • Razorpay Verified (₹)
          </span>
          <span className="text-white/40 hidden sm:inline">•</span>
          <span className="text-white/80 hidden sm:inline text-[11px]">
            100% SafeShield Escrow
          </span>
        </div>

        {/* Oversized Bold Editorial Headline */}
        <div className="overflow-hidden space-y-1 sm:space-y-2">
          {headlineLines.map((line, lineIdx) => (
            <div key={lineIdx} className="overflow-hidden flex flex-wrap justify-center gap-x-3 sm:gap-x-5">
              {line.map((word, wordIdx) => (
                <span
                  key={wordIdx}
                  ref={(el) => (headlineWordsRef.current[lineIdx * 2 + wordIdx] = el)}
                  className={`inline-block font-serif font-black text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[0.92] ${
                    word.includes("MORE") || word.includes("EXPERIENCE")
                      ? "text-[#183D2B]"
                      : "text-[#121512]"
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Subheadline */}
        <p className="hero-sub-element max-w-xl mx-auto text-base sm:text-xl text-[#121512]/75 font-medium tracking-tight">
          Everything you need. Nothing you need to own. World-class hardware on demand across India.
        </p>

        {/* Hero CTAs */}
        <div className="hero-sub-element flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-1">
          <button
            type="button"
            onClick={() => scrollToSection('marketplace')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#183D2B] hover:bg-[#121512] text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-[#183D2B]/15 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Explore Rentals</span>
            <ChevronRight className="w-4 h-4 text-[#C9F36B] transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('rent-vs-buy')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#121512] font-bold text-xs uppercase tracking-widest border border-[#183D2B]/15 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Rent vs Buy Calculator</span>
            <ArrowUpRight className="w-4 h-4 text-[#183D2B]" />
          </button>
        </div>

        {/* Central Interactive Hardware Stage (Flagship Switcher in ₹) */}
        <div ref={stageRef} className="hero-sub-element max-w-5xl mx-auto pt-3 pb-2">
          <div className="relative rounded-3xl bg-white border border-[#183D2B]/15 p-6 sm:p-8 shadow-2xl overflow-hidden group">
            
            {/* Top switcher tabs with category icons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pb-5 border-b border-[#183D2B]/10">
              {HERO_PRODUCTS.map((prod, idx) => (
                <button
                  key={prod.id}
                  onClick={() => {
                    setActiveHeroIdx(idx);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-2 ${
                    activeHeroIdx === idx
                      ? 'bg-[#183D2B] text-[#C9F36B] font-bold shadow-md'
                      : 'bg-[#F5F5EF] text-[#121512]/70 hover:text-[#121512] hover:bg-slate-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeHeroIdx === idx ? 'bg-[#C9F36B]' : 'bg-transparent'}`} />
                  <span>{prod.name}</span>
                </button>
              ))}
            </div>

            {/* Hardware stage layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center pt-6 text-left">
              {/* Product Visual Showcase */}
              <div className="md:col-span-7 relative">
                <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-[#F5F5EF] border border-[#183D2B]/10 relative group-hover:border-[#183D2B]/30 transition-colors shadow-inner">
                  <img
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Floating Specs Chips */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#C9F36B] border border-white/10 font-bold uppercase">
                      {activeProduct.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-[10px] font-mono text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      In Stock • Ready to Dispatch
                    </span>
                  </div>

                  {/* Bottom Image Overlay Bar */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-white">
                    <span className="text-[#C9F36B] font-bold truncate max-w-[200px] sm:max-w-none">
                      {activeProduct.tagline}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur text-[11px] text-white/90 border border-white/10 shrink-0">
                      Pelican Case Rigged
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Pricing & Interactive Duration Calculator */}
              <div className="md:col-span-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono tracking-widest text-[#183D2B] uppercase font-bold">
                      FLAGSHIP SPECIFICATION
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                      SafeShield Covered
                    </span>
                  </div>
                  <h3 className="font-serif font-black text-2xl sm:text-3xl text-[#121512] mt-0.5">
                    {activeProduct.name}
                  </h3>
                </div>

                {/* Specs Pill List */}
                <div className="space-y-1.5">
                  {activeProduct.specs.slice(0, 3).map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 text-xs text-[#121512]/75 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#183D2B] shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                {/* Interactive Duration Selector */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#121512]/70">
                    <span>Select Term:</span>
                    <span className="font-bold text-[#183D2B]">
                      {selectedDuration === 1 ? '1-Day Sprint' : selectedDuration === 3 ? '3-Day Production' : '7-Day Term'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[1, 3, 7].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setSelectedDuration(days)}
                        className={`py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                          selectedDuration === days
                            ? 'bg-[#183D2B] text-[#C9F36B] border-[#183D2B]'
                            : 'bg-[#F5F5EF] text-[#121512]/70 border-[#183D2B]/10 hover:border-[#183D2B]/30'
                        }`}
                      >
                        {days} {days === 1 ? 'Day' : 'Days'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing Box in Indian Rupee (₹) */}
                <div className="p-3.5 rounded-2xl bg-[#F5F5EF] border border-[#183D2B]/10 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-[#121512]/60 block font-mono">Rental Charge:</span>
                      <span className="font-mono text-2xl font-black text-[#183D2B]">
                        {formatINR(calculatedRent)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                        Save {savingsPercent}% vs Retail
                      </span>
                      <span className="block text-[11px] font-mono text-[#121512]/50 mt-0.5">
                        Retail: {formatINR(activeProduct.amazonPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Two Action Buttons: Rent Options & Compare with Amazon */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => openProductDetail(activeProduct, 'rent')}
                    className="py-3 px-3 rounded-xl bg-[#183D2B] hover:bg-[#121512] text-[#C9F36B] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer font-mono"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#C9F36B]" />
                    <span>Rent Options</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openComparisonModal(activeProduct)}
                    className="py-3 px-3 rounded-xl bg-white hover:bg-[#183D2B]/10 border border-[#183D2B]/20 text-[#121512] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer font-mono"
                  >
                    <Tag className="w-3.5 h-3.5 text-[#183D2B]" />
                    <span>Compare Price</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-[#121512]/70">
                  <button
                    type="button"
                    onClick={() => openProductDetail(activeProduct, 'rent')}
                    className="text-[#183D2B] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View dates & deposit breakdown</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(activeProduct, 'rent', selectedDuration);
                      addToast({ type: 'success', title: 'Added to Bag', message: `${activeProduct.name} added to your rental bag!` });
                    }}
                    className="text-[#183D2B] hover:underline font-bold cursor-pointer"
                  >
                    + Add to Bag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Partner Infinite Marquee */}
      <div className="w-full relative z-10 pt-6 pb-2 border-t border-[#183D2B]/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#183D2B]/60 uppercase tracking-widest mb-3">
            <span>Verified Fleet Ecosystem</span>
            <span>100% Genuine Serial Verification</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-75">
            {brandPartners.map((brand, bIdx) => (
              <span
                key={bIdx}
                className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#183D2B] hover:text-[#121512] transition-colors"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
