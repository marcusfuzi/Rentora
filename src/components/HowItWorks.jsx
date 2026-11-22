import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Calendar,
  Truck,
  RotateCcw,
  ShoppingBag,
  CreditCard,
  PackageCheck,
  ShieldCheck,
  Upload,
  Coins,
  CheckCircle2
} from 'lucide-react';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('rent'); // 'rent' | 'buy' | 'sell'

  const rentSteps = [
    {
      step: 'Step 1',
      title: 'Discover & Calculate',
      desc: 'Browse hundreds of verified items. Use our Rent vs Buy calculator to pick optimal duration.',
      icon: Search
    },
    {
      step: 'Step 2',
      title: 'Reserve & Escrow Deposit',
      desc: 'Select rental dates. Your refundable security deposit is safely locked in SafeShield Escrow.',
      icon: Calendar
    },
    {
      step: 'Step 3',
      title: 'Free Express Delivery',
      desc: 'Seller packages the sanitized equipment. Courier delivers straight to your doorstep.',
      icon: Truck
    },
    {
      step: 'Step 4',
      title: 'Return or Keep',
      desc: 'Request a 1-click doorstep pickup when done, or convert to purchase with 100% rental credit.',
      icon: RotateCcw
    }
  ];

  const buySteps = [
    {
      step: 'Step 1',
      title: 'Compare Online Retailers',
      desc: 'Review Buyhatke-style external comparison against Amazon, Flipkart, and Croma.',
      icon: Search
    },
    {
      step: 'Step 2',
      title: 'Order at Lowest Price',
      desc: 'Buy directly from authenticated sellers with verified GSTIN and serial verification.',
      icon: ShoppingBag
    },
    {
      step: 'Step 3',
      title: 'Simulated Secure Checkout',
      desc: 'Support for UPI, NetBanking, Cards, and wallet payment simulations.',
      icon: CreditCard
    },
    {
      step: 'Step 4',
      title: 'Guaranteed Authentic',
      desc: 'Brand warranty, verified serial check, and 7-day hassle-free replacement.',
      icon: PackageCheck
    }
  ];

  const sellSteps = [
    {
      step: 'Step 1',
      title: 'List Your Equipment',
      desc: 'Upload photos, set daily rental rate, sale price, or choose Rent & Sell dual listing.',
      icon: Upload
    },
    {
      step: 'Step 2',
      title: 'KYC & Listing Approval',
      desc: 'Quick business/ID verification gives your profile the Rentora Verified Seller badge.',
      icon: ShieldCheck
    },
    {
      step: 'Step 3',
      title: 'Accept Requests',
      desc: 'Review customer booking dates, verify courier pickup, and dispatch item safely.',
      icon: Truck
    },
    {
      step: 'Step 4',
      title: 'Earn Recurring Revenue',
      desc: 'Receive automated payouts on rental completion. Turn idle gear into monthly cashflow.',
      icon: Coins
    }
  ];

  const currentSteps = activeTab === 'rent' ? rentSteps : activeTab === 'buy' ? buySteps : sellSteps;

  return (
    <div className="w-full py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Seamless Marketplace Workflow</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          How <span className="text-gradient">Rentora</span> Works
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Designed for maximum transparency, speed, and safety for customers, renters, and sellers alike.
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 mt-6 shadow-xl">
          <button
            onClick={() => setActiveTab('rent')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rent'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            For Renters
          </button>
          <button
            onClick={() => setActiveTab('buy')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'buy'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            For Buyers
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sell'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            For Sellers & Owners
          </button>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentSteps.map((st, idx) => {
          const IconComp = st.icon;
          return (
            <motion.div
              key={`${activeTab}-${st.step}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="glass-card rounded-2xl p-6 border border-slate-800 relative flex flex-col justify-between group hover:border-cyan-500/30"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    {st.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{st.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
              </div>

              {/* Progress connector line */}
              <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>Phase 0{idx + 1}</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400/50" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
