import React from 'react';
import { ShieldCheck, CheckCircle2, IndianRupee, Clock, Tag, Lock, Award, Sparkles } from 'lucide-react';
import { TRUST_STATS } from '../data/rentoraData';

export default function TrustSection() {
  const benefits = [
    {
      icon: IndianRupee,
      title: "Affordable Rentals",
      desc: "Save up to 98% compared to buying upfront. Pay only for the days you actually shoot or compute."
    },
    {
      icon: ShieldCheck,
      title: "Verified Owners & Rigs",
      desc: "Every item is flight-cased, cleaned, calibrated, and serial-verified by hardware technicians before delivery."
    },
    {
      icon: Clock,
      title: "Flexible Durations",
      desc: "From 24-hour burst shoots to 90-day multi-city tours, scale your lease duration with 1-click extensions."
    },
    {
      icon: Tag,
      title: "Smart Price Comparison",
      desc: "Real-time retail price benchmarking against Amazon.in and Flipkart shows your exact break-even point."
    },
    {
      icon: Lock,
      title: "Secure Transactions (Razorpay & Escrow)",
      desc: "Bank-grade payments with 100% refundable SafeShield escrow deposits released within 2 hours of return."
    }
  ];

  return (
    <section id="trust" className="py-24 bg-[#F5F5EF] text-[#121512] relative overflow-hidden select-none border-t border-[#183D2B]/10">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#C9F36B]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#183D2B] text-[#C9F36B] text-xs font-mono uppercase font-bold tracking-wider border border-[#C9F36B]/30 shadow-sm">
            <Award className="w-3.5 h-3.5" />
            <span>06 // The Rentora Standard</span>
          </div>
          <h2 className="font-serif font-black text-4xl sm:text-6xl text-[#121512] uppercase tracking-tight">
            MORE ACCESS. LESS SPENDING.
          </h2>
          <p className="text-sm sm:text-base text-[#121512]/75 font-medium max-w-xl mx-auto">
            Zero friction, zero depreciation, maximum output. The new benchmark for creative and computational hardware access in India.
          </p>
        </div>

        {/* 4 Big Animated Statistics in INR */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TRUST_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-[#183D2B]/15 text-center space-y-2 hover:border-[#183D2B] transition-colors shadow-sm"
            >
              <div className="font-serif font-black text-3xl sm:text-4xl text-[#183D2B]">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#121512] uppercase font-mono">
                {stat.label}
              </div>
              <p className="text-[11px] text-[#121512]/60 font-medium">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 5 Core Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#183D2B]/15 space-y-3 hover:border-[#183D2B] transition shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[#183D2B]/10 flex items-center justify-center text-[#183D2B]">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#121512]">
                  {b.title}
                </h4>
                <p className="text-xs text-[#121512]/70 leading-relaxed font-medium">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
