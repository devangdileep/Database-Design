'use client';

import React from 'react';
import { Tv, Shirt, ShoppingBag, Home, Sparkles, Tag } from 'lucide-react';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories = [
    { id: 'Electronics', label: 'Electronics', icon: Tv },
    { id: 'Apparel', label: 'Apparel', icon: Shirt },
    { id: 'Groceries', label: 'Groceries', icon: ShoppingBag },
    { id: 'Home & Living', label: 'Home & Living', icon: Home },
    { id: 'Beauty', label: 'Beauty', icon: Sparkles },
    { id: 'Offers', label: 'Offers', icon: Tag },
  ];

  return (
    <div className="w-full flex items-center justify-center gap-3 py-4 overflow-x-auto no-scrollbar">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(isActive ? 'ALL' : cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap ${
              isActive
                ? 'bg-[#15233e] text-blue-400 border border-blue-500/60 shadow-lg shadow-blue-500/20 scale-105'
                : 'bg-[#0b1220]/80 text-slate-400 border border-white/5 hover:border-white/20 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
