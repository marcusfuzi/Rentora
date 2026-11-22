import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Check, ArrowRight, ShieldCheck, HeartHandshake, Zap } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export default function TryBeforeYouBuy() {
  const { navigateTo, setActiveRentModal, products } = useMarketplace();
  const sampleProduct = products[0] || null;

  const steps = [
    {
      num: '01',
      title: 'Rent & Test-Drive',
      desc: 'Book any eligible product for 3 to 14 days at our transparent daily rental rate. Put it through real-world paces.',
      icon: Calendar,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      num: '02',
      title: 'Experience Without Risk',
      desc: 'Take the camera on a shoot, play the console with friends, or benchmark the laptop for demanding studio renders.',
      icon: Zap,
      color: 'from-indigo-500 to-purple-600'
    },
    {
      num: '03',
      title: '100% Rental Fee Credit',
      desc: 'Love the equipment? Choose to buy it! We deduct up to 100% of your paid rental charges directly from the retail purchase price.',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-600'
    },
    {
      num: '04',
      title: 'Or Simply Return It',
      desc: 'Not the perfect fit? Schedule a free doorstep pickup. Your security deposit is released instantly from SafeShield Escrow.',
      icon: ShieldCheck,
      color: 'from-teal-500 to-emerald-600'
    }
  ];

  return (
    <div id="try-before-buy-section" className="w-full relative py-12">
      {/* Background neon ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-72 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 glass-card rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-slate-800">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-500/10 border border-purple-500/30 text-purple-400 mb-3">
              <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
              <span>Zero-Regret Commerce Innovation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Try Before You Buy. <br />
              <span className="text-gradient">Rent First, Decide Later.</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              Never gamble on expensive tech equipment again. Test the camera sensor, try the drone in your region, or feel the laptop keyboard. If you choose to keep it, your rental fee is converted into instant store purchase credit.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:shrink-0">
            <button
              onClick={() => navigateTo('marketplace', { type: 'Rent & Sell' })}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-sm shadow-[0_0_25px_rgba(0,242,254,0.3)] transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Try & Buy Items</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {sampleProduct && (
              <button
                onClick={() => setActiveRentModal({ ...sampleProduct, tryBeforeYouBuy: true })}
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Simulate 3-Day Trial</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Interactive Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
          {steps.map((st, i) => {
            const IconComponent = st.icon;
            return (
              <motion.div
                key={st.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-600 group-hover:text-cyan-400/80 transition-colors">
                      {st.num}
                    </span>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${st.color} p-[1px]`}>
                      <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-white">
                        <IconComponent className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{st.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400/90">
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Guaranteed by Rentora</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
