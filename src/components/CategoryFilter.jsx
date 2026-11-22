import React from 'react';
import { MARKETPLACE_CATEGORIES } from '../utils/helpers';
import {
  Sparkles,
  Cpu,
  Camera,
  Laptop,
  Gamepad2,
  Bike,
  Projector,
  Speaker,
  Plane,
  Wrench,
  Package
} from 'lucide-react';

const iconMap = {
  Sparkles,
  Cpu,
  Camera,
  Laptop,
  Gamepad2,
  Bike,
  Projector,
  Speaker,
  Plane,
  Wrench,
  Package
};

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2.5 min-w-max">
        {MARKETPLACE_CATEGORIES.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Sparkles;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <IconComponent
                className={`w-4 h-4 ${isSelected ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`}
              />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
