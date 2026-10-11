'use client';

import React, { useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, formatRupees } from '@/lib/supabase';

interface RightDrawerProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
}

export const RightDrawer: React.FC<RightDrawerProps> = ({ products, onSelectProduct }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex items-center">
      
      {/* Vertical Toggle Handle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#0e1628] border border-r-0 border-blue-500/40 text-slate-300 rounded-l-2xl py-4 px-2 shadow-2xl flex flex-col items-center gap-3 hover:text-white hover:border-blue-400 transition-all select-none"
      >
        {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        
        <span className="[writing-mode:vertical-lr] text-xs font-semibold tracking-wider text-slate-300 uppercase rotate-180">
          Recommended For You
        </span>

        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
      </button>

      {/* Slide-out Drawer Panel */}
      {isOpen && (
        <div className="w-[85vw] max-w-xs sm:w-72 bg-[#090e1a]/95 backdrop-blur-2xl border border-white/10 rounded-l-2xl p-4 shadow-2xl space-y-3 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="font-heading font-bold text-sm text-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" /> Recommended
            </h3>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full">
              Personalized
            </span>
          </div>

          <div className="space-y-2.5">
            {products.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-4">No products available</div>
            ) : (
              products.slice(0, 4).map((p) => (
                <div
                  key={p.product_id}
                  onClick={() => onSelectProduct(p)}
                  className="flex items-center gap-3 bg-[#0d1527] border border-white/5 hover:border-blue-500/40 p-2.5 rounded-xl cursor-pointer transition-all hover:translate-x-1"
                >
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.product_name} className="w-12 h-12 rounded-lg object-cover bg-slate-900" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-600 text-[9px]">
                      N/A
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs text-slate-200 truncate">{p.product_name}</div>
                    <div className="text-[11px] text-blue-400 font-bold">{formatRupees(p.price)}</div>
                    <div className="text-[10px] text-slate-500">{p.vendor_name || 'Unknown'}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
