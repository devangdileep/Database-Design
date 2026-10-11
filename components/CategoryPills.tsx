'use client';

import React from 'react';
import { Tv, Shirt, ShoppingBag, Home, Sparkles, LayoutGrid } from 'lucide-react';
import { Category } from '@/lib/supabase';

// Map category names to icons (fallback to LayoutGrid)
const CATEGORY_ICONS: Record<string, any> = {
  'electronics': Tv,
  'apparel': Shirt,
  'groceries': ShoppingBag,
  'home & living': Home,
  'beauty': Sparkles,
};

interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  // Only show top-level categories (no parent)
  const topLevelCategories = categories.filter((c) => c.parent_category_id === null);

  return (
    <div className="w-full flex items-center justify-center gap-3 py-4 overflow-x-auto no-scrollbar">
      {topLevelCategories.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.category_name.toLowerCase()] || LayoutGrid;
        const isActive = selectedCategory === cat.category_name;

        return (
          <button
            key={cat.category_id}
            onClick={() => onSelectCategory(isActive ? 'ALL' : cat.category_name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap ${
              isActive
                ? 'bg-[#15233e] text-blue-400 border border-blue-500/60 shadow-lg shadow-blue-500/20 scale-105'
                : 'bg-[#0b1220]/80 text-slate-400 border border-white/5 hover:border-white/20 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
            <span>{cat.category_name}</span>
          </button>
        );
      })}
    </div>
  );
};
