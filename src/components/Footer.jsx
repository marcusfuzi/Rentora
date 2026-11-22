import React from 'react';
import { ShieldCheck, Sparkles, HeartHandshake, Lock, ArrowUpRight } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export default function Footer() {
  const { navigateTo } = useMarketplace();

  return (
    <footer className="w-full bg-[#05080f] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">SafeShield Escrow</div>
              <div className="text-[10px] text-slate-400">100% Refundable Deposits</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">Try Before You Buy</div>
              <div className="text-[10px] text-slate-400">Rental Fee Converted to Credit</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">Verified Sellers Only</div>
              <div className="text-[10px] text-slate-400">Rigorous KYC & Serial Checks</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white text-xs">Zero Risk Mediation</div>
              <div className="text-[10px] text-slate-400">24/7 Dispute Admin Resolution</div>
            </div>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1.5px]">
                <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center font-black text-cyan-400">
                  R
                </div>
              </div>
              <span className="text-xl font-black text-white tracking-wider">RENTORA</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The smart marketplace connecting equipment owners and customers. Rent high-end tech for flexible durations or purchase directly with verified external price transparency.
            </p>
            <div className="text-xs font-bold text-cyan-400">
              Tagline: Rent Smart. Buy Better. Live More.
            </div>
          </div>

          {/* Column 1: Marketplace */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Marketplace</h4>
            <ul className="space-y-2">
              {['Cameras', 'Laptops', 'Gaming Consoles', 'Drones', 'Projectors', 'Audio & Speakers'].map((c) => (
                <li key={c}>
                  <button
                    onClick={() => navigateTo('marketplace', { category: c })}
                    className="hover:text-cyan-400 transition-colors"
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Platform Features */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Features</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigateTo('calculator')} className="hover:text-cyan-400 transition-colors">
                  Rent vs Buy Intelligence
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigateTo('home');
                    setTimeout(() => {
                      const el = document.getElementById('price-comparison-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Buyhatke Price Compare
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigateTo('home');
                    setTimeout(() => {
                      const el = document.getElementById('try-before-buy-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Try Before You Buy Guarantee
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('seller-dashboard')} className="hover:text-cyan-400 transition-colors">
                  Seller Earnings Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Portals</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigateTo('customer-dashboard')} className="hover:text-cyan-400">
                  Customer Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('seller-dashboard')} className="hover:text-cyan-400">
                  Seller Control Panel
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin-dashboard')} className="hover:text-purple-400">
                  Admin Command Center
                </button>
              </li>
              <li>
                <span className="text-slate-500">SafeShield Escrow API v2.4</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} RENTORA Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Rental SafeShield Terms</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Dispute Resolution Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
