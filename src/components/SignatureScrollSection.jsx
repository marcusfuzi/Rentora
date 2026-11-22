import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SIGNATURE_SCROLL_SCENES } from '../data/rentoraData';
import { useRentora } from '../context/RentoraContext';
import { ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function SignatureScrollSection() {
  const { openRazorpayCheckout } = useRentora();
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);

  const activeScene = SIGNATURE_SCROLL_SCENES[activeSceneIdx] || SIGNATURE_SCROLL_SCENES[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pinning the section during scroll
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=2500',
        pin: stickyRef.current,
        scrub: 0.8,
        onUpdate: (self) => {
          const progress = self.progress;
          const totalScenes = SIGNATURE_SCROLL_SCENES.length;
          const idx = Math.min(
            totalScenes - 1,
            Math.floor(progress * totalScenes)
          );
          setActiveSceneIdx(idx);
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="signature-story"
      className="relative w-full bg-[#0A0D0B] text-[#F5F5EF] select-none"
    >
      <div
        ref={stickyRef}
        className="h-screen w-full flex flex-col justify-between py-12 px-4 sm:px-8 relative overflow-hidden"
      >
        {/* Dynamic Ambient Background Glow based on Scene */}
        <div className="absolute inset-0 pointer-events-none opacity-20 transition-all duration-1000 bg-[radial-gradient(circle_at_50%_50%,#C9F36B_0%,transparent_60%)]" />

        {/* Section Header */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C9F36B] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#C9F36B] font-bold">
              02 / SIGNATURE SCROLL FILM
            </span>
          </div>

          {/* Interactive Scene Nav Pills */}
          <div className="flex items-center gap-2">
            {SIGNATURE_SCROLL_SCENES.map((sc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveSceneIdx(i)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  activeSceneIdx === i
                    ? 'bg-[#C9F36B] text-[#0A0D0B] font-bold shadow-md shadow-[#C9F36B]/20'
                    : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                {sc.sceneNumber} — {sc.headline.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Central Stage: Centered Product with Changing Visuals & Surrounding Editorial Content */}
        <div className="max-w-7xl mx-auto w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: Scene Headlines & Narrative */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <div className="inline-block px-3 py-1 rounded-full bg-[#183D2B] border border-[#C9F36B]/30 text-[#C9F36B] font-mono text-xs">
              Scene {activeScene.sceneNumber} of 04
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] transition-all duration-500">
              {activeScene.headline}
            </h2>

            <p className="font-mono text-sm uppercase tracking-wider text-[#C9F36B]">
              {activeScene.subheadline}
            </p>

            <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-lg">
              {activeScene.body}
            </p>

            {/* Financial Metrics Pill */}
            <div className="p-4 rounded-2xl bg-[#141A16] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/50">{activeScene.rentPeriod}</span>
                <span className="text-emerald-400 font-bold">{activeScene.savingsPct}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
                  {activeScene.highlightCost}
                </span>
                <span className="text-xs text-white/50 line-through">
                  Retail: {activeScene.compareRetail}
                </span>
              </div>
            </div>

            {/* Direct Razorpay Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() =>
                  openRazorpayCheckout({
                    productName: activeScene.productName,
                    image: activeScene.image,
                    amount: 43500,
                    rentalCost: 28500,
                    securityDeposit: 15000,
                    mode: 'rent'
                  })
                }
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#C9F36B] hover:bg-[#b8e854] text-[#0A0D0B] font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#C9F36B]/20"
              >
                <span>Book This Rig via Razorpay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Visually Centered Hero Hardware with Ambient Tilt */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            {/* Visual Frame */}
            <div className="relative w-full aspect-[4/3] max-w-2xl rounded-3xl overflow-hidden bg-black/60 border border-white/15 shadow-2xl group">
              <img
                key={activeScene.image}
                src={activeScene.image}
                alt={activeScene.productName}
                className="w-full h-full object-cover transition-all duration-700 ease-out transform group-hover:scale-105 filter brightness-90 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

              {/* Bottom Overlay Label */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-[11px] font-mono tracking-widest text-[#C9F36B] uppercase block">
                    Verified Pelican Kit
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    {activeScene.productName}
                  </h4>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A0D0B]/80 border border-white/15 text-xs font-mono text-[#C9F36B]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>SafeShield Insured</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Progress Bar */}
        <div className="max-w-7xl mx-auto w-full pt-4 flex items-center justify-between text-xs font-mono text-white/50 border-t border-white/10 relative z-10">
          <span>SCROLL DOWN TO ADVANCE SCENES</span>
          <div className="flex items-center gap-1.5">
            {SIGNATURE_SCROLL_SCENES.map((_, dotIdx) => (
              <div
                key={dotIdx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  activeSceneIdx === dotIdx ? 'w-8 bg-[#C9F36B]' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
          <span>RENTORA CINEMATIC ENGINE</span>
        </div>
      </div>
    </section>
  );
}
