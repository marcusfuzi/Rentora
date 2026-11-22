import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Sparkles, SlidersHorizontal, ChevronRight, ChevronLeft, ShieldCheck, Zap, Tag } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STORY_PRODUCTS, formatINR } from '../data/rentoraData';
import { useRentora } from '../context/RentoraContext';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollStoryHorizontal() {
  const { openProductDetail, addToCart, openRazorpayCheckout, openComparisonModal } = useRentora();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [storyDuration, setStoryDuration] = useState(3); // 1, 3, or 7 days

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        return track.scrollWidth - window.innerWidth;
      };

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollAmount() * 0.9}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.min(
              STORY_PRODUCTS.length - 1,
              Math.floor(self.progress * STORY_PRODUCTS.length)
            );
            setActiveStoryIdx(index);
          }
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleManualNav = (direction) => {
    if (direction === 'next' && activeStoryIdx < STORY_PRODUCTS.length - 1) {
      setActiveStoryIdx(prev => prev + 1);
    } else if (direction === 'prev' && activeStoryIdx > 0) {
      setActiveStoryIdx(prev => prev - 1);
    }
  };

  const currentTheme = STORY_PRODUCTS[activeStoryIdx] || STORY_PRODUCTS[0];

  return (
    <section
      id="story-scroll"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden transition-colors duration-700 select-none flex flex-col justify-between"
      style={{
        backgroundColor: currentTheme.bgTheme || '#F5F5EF',
        color: currentTheme.textColor || '#121512'
      }}
    >
      {/* Top Film Status Bar */}
      <div className="absolute top-6 left-0 right-0 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C9F36B] animate-pulse" />
          <span className="text-xs uppercase font-mono font-bold tracking-widest opacity-80">
            CINEMATIC HARDWARE FILM // 0{activeStoryIdx + 1} OF 0{STORY_PRODUCTS.length}
          </span>
        </div>

        {/* Story Progress Indicators & Quick Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            {STORY_PRODUCTS.map((prod, idx) => (
              <button
                key={prod.id}
                onClick={() => setActiveStoryIdx(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  activeStoryIdx === idx
                    ? 'w-10 bg-[#C9F36B]'
                    : 'w-3 bg-current opacity-25 hover:opacity-60'
                }`}
                aria-label={`Jump to ${prod.name}`}
              />
            ))}
          </div>

          {/* Quick Prev / Next Buttons */}
          <div className="flex items-center gap-1 bg-black/10 backdrop-blur-md p-1 rounded-full border border-current/10">
            <button
              onClick={() => handleManualNav('prev')}
              disabled={activeStoryIdx === 0}
              className="p-1.5 rounded-full hover:bg-current/15 transition disabled:opacity-30 cursor-pointer"
              aria-label="Previous hardware"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleManualNav('next')}
              disabled={activeStoryIdx === STORY_PRODUCTS.length - 1}
              className="p-1.5 rounded-full hover:bg-current/15 transition disabled:opacity-30 cursor-pointer"
              aria-label="Next hardware"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Moving Reel */}
      <div
        ref={trackRef}
        className="flex h-full items-center pl-6 sm:pl-16 lg:pl-28 will-change-transform my-auto"
        style={{ width: `${STORY_PRODUCTS.length * 90}vw` }}
      >
        {STORY_PRODUCTS.map((product, idx) => {
          const isActive = activeStoryIdx === idx;
          const cost = storyDuration === 1
            ? product.dailyRate
            : storyDuration === 3
            ? product.dailyRate * 3
            : product.weeklyRate || Math.round(product.dailyRate * 7 * 0.9);
          
          const savings = Math.max(0, product.buyPrice - cost);
          const savingsPct = Math.round((savings / product.buyPrice) * 100);

          return (
            <div
              key={product.id}
              className="w-[85vw] sm:w-[75vw] lg:w-[68vw] h-[80vh] flex-shrink-0 px-4 sm:px-8 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14"
            >
              {/* Product Film Hero Image */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-current/15 bg-black/40">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-[#C9F36B] border border-white/10 font-bold">
                    {product.category}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                    <div>
                      <span className="text-[11px] opacity-75 font-mono">Retail Purchase Value</span>
                      <p className="text-lg font-bold">{formatINR(product.buyPrice)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[#C9F36B] font-mono">Rent from</span>
                      <p className="text-2xl font-black text-[#C9F36B] font-mono">
                        {formatINR(product.dailyRate)}<span className="text-xs text-white">/day</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editorial Narrative & Specs */}
              <div className="w-full lg:w-1/2 space-y-4 sm:space-y-5 text-left">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono uppercase tracking-widest opacity-60">
                      {product.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C9F36B] text-[#183D2B]">
                      {savingsPct}% Cheaper Than Buying
                    </span>
                  </div>
                  <h2 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-none uppercase">
                    {product.name}
                  </h2>
                  <p className="text-sm sm:text-base opacity-85 mt-2.5 leading-relaxed font-medium max-w-lg">
                    {product.tagline}
                  </p>
                </div>

                {/* Key Spec Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {product.specs.map((spec, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-2.5 rounded-xl bg-current/5 backdrop-blur-sm border border-current/15 text-xs font-semibold flex items-center gap-2"
                    >
                      <Check className="w-3.5 h-3.5 text-[#C9F36B] shrink-0" />
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>

                {/* Term Selector Pills */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-mono opacity-60">Term:</span>
                  {[1, 3, 7].map((days) => (
                    <button
                      key={days}
                      onClick={() => setStoryDuration(days)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
                        storyDuration === days
                          ? 'bg-[#C9F36B] text-[#183D2B] border-[#C9F36B]'
                          : 'bg-current/5 text-current/70 border-current/15 hover:border-current/40'
                      }`}
                    >
                      {days} {days === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>

                {/* Pricing & Call to Action */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => openProductDetail(product, 'rent')}
                    className="px-7 py-3.5 rounded-full bg-[#C9F36B] hover:bg-[#b5e655] text-[#183D2B] font-bold text-xs sm:text-sm hover:scale-105 transition shadow-lg flex items-center gap-2 cursor-pointer font-mono uppercase tracking-wider"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#183D2B]" />
                    <span>Rent Options & Dates • {formatINR(cost)}</span>
                  </button>

                  <button
                    onClick={() => openComparisonModal(product)}
                    className="px-5 py-3.5 rounded-full bg-current/10 hover:bg-current/15 backdrop-blur border border-current/20 text-current font-bold text-xs sm:text-sm transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Compare Price</span>
                  </button>

                  <button
                    onClick={() => addToCart(product, 'rent', storyDuration)}
                    className="px-4 py-3.5 rounded-full bg-transparent hover:bg-current/5 text-current/80 font-bold text-xs sm:text-sm transition cursor-pointer"
                  >
                    + Bag
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-6 left-0 right-0 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-mono opacity-60 pointer-events-none">
        <span>Smooth film gallery // Scroll or click controls</span>
        <span>0{activeStoryIdx + 1} / 0{STORY_PRODUCTS.length}</span>
      </div>
    </section>
  );
}
