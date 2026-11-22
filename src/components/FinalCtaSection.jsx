import React from 'react';
import { ArrowUpRight, Sparkles, ChevronRight, Zap, ShieldCheck, CreditCard } from 'lucide-react';
import { scrollToSection } from '../utils/smoothScroll';

export default function FinalCtaSection() {
  return (
    <section className="relative min-h-[90vh] bg-[#183D2B] text-white flex flex-col justify-between pt-28 pb-12 overflow-hidden select-none border-t border-[#C9F36B]/20">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#C9F36B]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating architectural silhouettes */}
      <div className="absolute inset-0 pointer-events-none opacity-15">
        <div className="absolute top-12 left-10 w-72 h-72 border border-white rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 border border-[#C9F36B] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 my-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#C9F36B]/30 text-xs font-mono text-[#C9F36B] uppercase tracking-widest shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C9F36B]" />
          <span>Non-Ownership Manifesto • BE SERIOUS Grade</span>
        </div>

        {/* The Requested Headline */}
        <h2 className="font-serif font-black text-5xl sm:text-7xl md:text-8xl text-white uppercase tracking-tight leading-[0.95]">
          WHY BUY IT, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5F5EF] to-[#C9F36B]">
            IF YOU CAN RENT IT?
          </span>
        </h2>

        <p className="text-base sm:text-xl text-white/80 font-medium max-w-xl mx-auto tracking-wide">
          GOOD GEAR. BETTER DECISIONS. Access more. Own less. Keep capital liquid and shoot with world-class gear.
        </p>

        {/* The Two Requested Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => scrollToSection('marketplace')}
            className="w-full sm:w-auto px-10 py-4 sm:py-5 rounded-full bg-[#C9F36B] hover:bg-[#b5e655] text-[#183D2B] font-serif font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-2xl hover:scale-105 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>START RENTING</span>
            <ChevronRight className="w-4 h-4 text-[#183D2B] group-hover:translate-x-1 transition duration-300" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('marketplace')}
            className="w-full sm:w-auto px-10 py-4 sm:py-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-serif font-bold text-sm uppercase tracking-widest border border-white/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>EXPLORE PRODUCTS</span>
            <ArrowUpRight className="w-4 h-4 text-[#C9F36B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 flex flex-wrap justify-center items-center gap-6 text-xs font-mono text-white/70">
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-[#C9F36B]" />
            Razorpay Live & Test Gateways
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#C9F36B]" />
            100% SafeShield Escrow Refund
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#C9F36B]" />
            Instant Doorstep Handover
          </span>
        </div>
      </div>

      {/* Premium Editorial Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-16 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs text-white/70">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-baseline gap-1">
              <span className="font-serif font-black text-2xl text-white tracking-tight">
                RENTORA
              </span>
              <span className="w-2 h-2 rounded-full bg-[#C9F36B]" />
            </div>
            <p className="max-w-xs text-white/70 leading-relaxed text-xs font-medium">
              The premier cinematic rental & equipment exchange platform for visionary creatives, developers, and studios in India.
            </p>
            <div className="pt-2 text-[11px] font-mono text-white/50">
              © 2026 RENTORA Technologies Inc. All rights reserved.
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-mono text-white font-bold uppercase tracking-wider text-[11px]">
              Platform Navigation
            </h4>
            <ul className="space-y-1.5 text-white/70">
              <li>
                <button onClick={() => scrollToSection('hero')} className="hover:text-white transition cursor-pointer">
                  Hero Showcase
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('story-scroll')} className="hover:text-white transition cursor-pointer">
                  Product Film
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('categories')} className="hover:text-white transition cursor-pointer">
                  Curated Disciplines
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('rent-vs-buy')} className="hover:text-white transition cursor-pointer">
                  Rent vs Buy Algorithm
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('marketplace')} className="hover:text-white transition cursor-pointer">
                  Trending Marketplace
                </button>
              </li>
            </ul>
          </div>

          {/* Academic Minor Project Credits */}
          <div className="md:col-span-4 space-y-2.5 bg-black/25 p-4 rounded-2xl border border-white/10 text-[11px]">
            <div className="flex items-center justify-between text-[#C9F36B] font-mono font-bold uppercase tracking-wider">
              <span>Minor Project • CSE Department</span>
              <span className="px-1.5 py-0.5 rounded bg-[#C9F36B]/20 text-[#C9F36B]">2026</span>
            </div>
            <p className="text-white font-semibold">
              Dr. A.P.J. Abdul Kalam Institute of Technology, Tanakpur
            </p>
            <p className="text-white/60">
              Affiliated to VMSB Uttarakhand Technical University, Dehradun
            </p>
            <div className="pt-1 border-t border-white/10 space-y-1">
              <p className="text-white/80">
                <strong className="text-white">Project Mentor:</strong> Ms. Neha Bisht (Asst. Prof, CSE)
              </p>
              <p className="text-white/80">
                <strong className="text-white">Team Members:</strong> Tushar Singh Bisht, Ayush Jha, Abhishek Kumar Arya
              </p>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
