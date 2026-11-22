import React, { useRef } from 'react';
import { ArrowUpRight, Sparkles, Sliders, ChevronRight, CheckCircle2 } from 'lucide-react';
import { CATEGORY_TAKEOVERS } from '../data/rentoraData';
import { useRentora } from '../context/RentoraContext';
import { scrollToSection } from '../utils/smoothScroll';

export default function CategoryTakeovers() {
  const containerRef = useRef(null);
  const { setSelectedCategory } = useRentora();

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    scrollToSection('marketplace');
  };

  const categorySubtags = {
    "Photography": ["Hasselblad X2D", "Sony FX3 Cine", "Leica SL2", "G Master Lenses"],
    "Work Setup": ["MacBook Pro M3 Max", "Studio Display", "CalDigit Docks", "Pro Keyboards"],
    "Gaming": ["PS5 Pro 2TB", "DualSense Edge", "4K 144Hz Rigs", "VR2 Spatial"],
    "Electronics": ["Focal Bathys Hi-Fi", "Leica Cine 1", "Dolby Atmos", "24-bit DACs"],
    "Tools & Equipment": ["Festool Track Saws", "Systainer Storage", "HEPA Extractors", "Rotary Hammers"]
  };

  return (
    <section id="categories" ref={containerRef} className="relative w-full bg-[#F5F5EF] text-[#121512] py-24 select-none">
      {/* Section Header */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#183D2B] text-[#C9F36B] text-xs font-mono uppercase font-bold tracking-wider mb-3 shadow-sm border border-[#C9F36B]/30">
          <Sparkles className="w-3.5 h-3.5 text-[#C9F36B]" />
          <span>03 / Curated Disciplines</span>
        </div>
        <h2 className="font-serif font-black text-4xl sm:text-6xl text-[#121512] uppercase tracking-tight">
          CURATED CATEGORIES
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#121512]/70 max-w-xl mx-auto font-medium">
          Five high-precision domains. Every rig is flight-cased, inspected, calibrated, and protected under SafeShield Escrow.
        </p>
      </div>

      {/* Grid of Curated Category Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORY_TAKEOVERS.map((cat, idx) => {
            const tags = categorySubtags[cat.name] || [];
            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name)}
                className="group relative h-[440px] rounded-3xl overflow-hidden bg-[#183D2B] text-white border border-[#183D2B]/15 hover:border-[#183D2B] hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between p-6 sm:p-8"
              >
                {/* Background Visual */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover filter brightness-75 contrast-105 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121512] via-[#183D2B]/65 to-black/30 opacity-90 group-hover:opacity-75 transition-opacity" />
                </div>

                {/* Top Tag & Count */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-mono tracking-wider text-[#C9F36B] uppercase font-bold">
                    {cat.itemCount}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#C9F36B] group-hover:text-[#183D2B] transition-all">
                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Bottom Editorial Content */}
                <div className="relative z-10 space-y-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#C9F36B] font-bold block">
                    {cat.tag}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 line-clamp-2 font-medium">
                    {cat.subtitle}
                  </p>

                  {/* Micro hardware tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.slice(0, 3).map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur text-[10px] font-mono text-white/90 border border-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-1 flex items-center gap-1.5 text-xs font-mono font-bold text-[#C9F36B] group-hover:underline">
                    <span>Explore Fleet</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick Custom Discipline Card */}
          <div
            onClick={() => {
              setSelectedCategory('All');
              scrollToSection('marketplace');
            }}
            className="group relative h-[440px] rounded-3xl overflow-hidden bg-white border border-[#183D2B]/15 hover:border-[#183D2B] transition-all duration-500 cursor-pointer shadow-md flex flex-col justify-between p-6 sm:p-8 text-[#121512]"
          >
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#183D2B] text-[#C9F36B] text-[11px] font-mono font-bold tracking-wider uppercase">
                COMPLETE VAULT
              </span>
              <div className="w-10 h-10 rounded-full bg-[#183D2B]/10 flex items-center justify-center text-[#183D2B] group-hover:bg-[#183D2B] group-hover:text-white transition-all">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#183D2B] font-bold block">
                06 / UNLIMITED INVENTORY
              </span>
              <h3 className="font-serif text-3xl font-black text-[#121512] tracking-tight">
                VIEW ALL HARDWARE
              </h3>
              <p className="text-sm text-[#121512]/70 font-medium">
                Browse our complete fleet of verified professional cinema bodies, Apple M3 workstations, gaming rigs, and sound equipment.
              </p>
              
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["Hasselblad", "Sony FX", "MacBook Pro", "PS5 Pro", "Festool"].map((brand, bIdx) => (
                  <span
                    key={bIdx}
                    className="px-2 py-0.5 rounded-full bg-[#183D2B]/5 text-[10px] font-mono text-[#183D2B] font-bold border border-[#183D2B]/10"
                  >
                    {brand}
                  </span>
                ))}
              </div>

              <div className="pt-2 inline-flex items-center gap-2 font-mono text-xs font-bold text-[#183D2B]">
                <span>Open Complete Marketplace</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
