import React from 'react';
import {
  Camera,
  Laptop,
  Gamepad2,
  Tv,
  Headphones,
  Wrench,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Award,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useRentora } from '../context/RentoraContext';
import { scrollToSection } from '../utils/smoothScroll';

export default function CategoryQuickNav() {
  const { setSelectedCategory, selectedCategory } = useRentora();

  const categories = [
    {
      id: "Cameras & Photography",
      label: "Cameras & Cinema",
      icon: Camera,
      tag: "48 Rigs",
      color: "from-emerald-500/10 to-emerald-600/20"
    },
    {
      id: "Laptops & MacBooks",
      label: "Laptops & Macs",
      icon: Laptop,
      tag: "36 Units",
      color: "from-blue-500/10 to-blue-600/20"
    },
    {
      id: "Gaming Consoles",
      label: "Gaming Consoles",
      icon: Gamepad2,
      tag: "24 Bundles",
      color: "from-purple-500/10 to-purple-600/20"
    },
    {
      id: "Projectors",
      label: "4K Projectors",
      icon: Tv,
      tag: "18 Screens",
      color: "from-amber-500/10 to-amber-600/20"
    },
    {
      id: "Audio Equipment",
      label: "Pro Audio & Hi-Fi",
      icon: Headphones,
      tag: "32 Kits",
      color: "from-rose-500/10 to-rose-600/20"
    },
    {
      id: "Tools & Gadgets",
      label: "Studio Tools",
      icon: Wrench,
      tag: "29 Tools",
      color: "from-cyan-500/10 to-cyan-600/20"
    }
  ];

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    scrollToSection('marketplace');
  };

  return (
    <div className="w-full bg-white border-y border-[#183D2B]/10 py-6 select-none shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Top Category Chips Strip */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer shrink-0 min-w-[170px] ${
                  isSelected
                    ? 'bg-[#183D2B] text-white border-[#183D2B] shadow-lg ring-2 ring-[#C9F36B]/40'
                    : 'bg-[#F5F5EF] text-[#121512] border-[#183D2B]/10 hover:border-[#183D2B]/30 hover:bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-white/10 text-[#C9F36B]' : 'bg-white text-[#183D2B] shadow-xs'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block leading-tight">
                    {cat.label}
                  </span>
                  <span className={`text-[10px] font-mono ${
                    isSelected ? 'text-white/70' : 'text-[#121512]/50'
                  }`}>
                    {cat.tag}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 4 Core Rental Guarantees Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[#183D2B]/10 text-xs font-mono">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F5F5EF]/60">
            <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-[#121512] block text-[11px]">Free 24hr Delivery</span>
              <span className="text-[10px] text-slate-500">Across 5 Indian Metros</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F5F5EF]/60">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-[#121512] block text-[11px]">SafeShield Escrow</span>
              <span className="text-[10px] text-slate-500">100% Refundable Deposit</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F5F5EF]/60">
            <RotateCcw className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-[#121512] block text-[11px]">Free City Relocation</span>
              <span className="text-[10px] text-slate-500">Zero Moving Hassles</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F5F5EF]/60">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-[#121512] block text-[11px]">Damage Protection</span>
              <span className="text-[10px] text-slate-500">Zero Liability for Wear</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
