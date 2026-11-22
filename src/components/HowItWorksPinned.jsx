import React, { useState } from 'react';
import { Search, Calendar, Truck, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../data/rentoraData';
import { scrollToSection } from '../utils/smoothScroll';

export default function HowItWorksPinned() {
  const [activeStep, setActiveStep] = useState(0);

  const icons = [Search, Calendar, Truck];

  return (
    <section id="how-it-works" className="py-24 bg-[#183D2B] text-white relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#C9F36B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9F36B] text-xs font-mono uppercase font-bold tracking-wider">
            <span>07 / Seamless Logistics</span>
          </div>
          <h2 className="font-serif font-black text-4xl sm:text-6xl text-white uppercase tracking-tight">
            HOW RENTORA WORKS
          </h2>
          <p className="text-sm sm:text-base text-white/75 font-medium max-w-xl mx-auto">
            From checkout to your set in as little as 3 hours. Zero friction, zero depreciation, maximum output.
          </p>
        </div>

        {/* Step Selector Tabs */}
        <div className="flex justify-center gap-2 sm:gap-4 border-b border-white/10 pb-6">
          {HOW_IT_WORKS_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(idx)}
              className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeStep === idx
                  ? 'bg-[#C9F36B] text-[#183D2B] shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 text-white/70'
              }`}
            >
              <span className="font-mono">{s.step}</span>
              <span className="hidden sm:inline">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Active Step Feature Showcase Card */}
        {(() => {
          const stepData = HOW_IT_WORKS_STEPS[activeStep];
          const Icon = icons[activeStep];

          return (
            <div className="bg-[#121512] rounded-3xl border border-white/10 p-8 sm:p-14 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center transition-all duration-500">
              {/* Left Column: Number and Content */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="flex items-center gap-4">
                  <span className="font-serif font-black text-6xl sm:text-8xl text-[#C9F36B] leading-none">
                    {stepData.step}
                  </span>
                  <div>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-white/70 uppercase">
                      {stepData.badge}
                    </span>
                    <h3 className="font-serif font-black text-3xl sm:text-5xl text-white uppercase tracking-tight mt-1">
                      {stepData.title}
                    </h3>
                  </div>
                </div>

                <p className="text-lg sm:text-xl text-[#C9F36B] font-semibold">
                  {stepData.tagline}
                </p>

                <p className="text-sm sm:text-base text-white/75 leading-relaxed font-normal max-w-xl">
                  {stepData.desc}
                </p>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono text-white/80">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C9F36B]" />
                    {stepData.metric}
                  </span>
                  <span className="text-[#C9F36B]">Guaranteed Spec</span>
                </div>

                <div className="pt-2 flex items-center gap-4">
                  {activeStep < HOW_IT_WORKS_STEPS.length - 1 ? (
                    <button
                      onClick={() => setActiveStep(activeStep + 1)}
                      className="px-6 py-3 rounded-full bg-[#C9F36B] text-[#183D2B] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition cursor-pointer"
                    >
                      <span>Next: Step 0{activeStep + 2}</span>
                      <ArrowRight className="w-4 h-4 text-[#183D2B]" />
                    </button>
                  ) : (
                    <button
                      onClick={() => scrollToSection('marketplace')}
                      className="px-8 py-3.5 rounded-full bg-[#C9F36B] text-[#183D2B] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition cursor-pointer"
                    >
                      <span>Explore Gear Now</span>
                      <ArrowRight className="w-4 h-4 text-[#183D2B]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Visual Infographic Box */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-md bg-[#183D2B]/40 rounded-3xl p-8 border border-white/10 text-center space-y-6 relative overflow-hidden">
                  <div className="w-20 h-20 rounded-3xl bg-[#C9F36B] text-[#183D2B] flex items-center justify-center mx-auto shadow-xl">
                    <Icon className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white">
                      The Rentora Standard
                    </h4>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Every shipment includes sanitized hardware, spare batteries, high-speed cables, and prepaid return labels.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-left text-xs font-semibold text-white/90">
                    <div className="p-2.5 rounded-xl bg-white/5 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C9F36B] shrink-0" />
                      <span>Firmware Updated</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C9F36B] shrink-0" />
                      <span>Sensor Cleaned</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C9F36B] shrink-0" />
                      <span>SafeShield Insured</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C9F36B] shrink-0" />
                      <span>Same-Day Courier</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
