'use client';

import React from 'react';
import { Home, LayoutGrid, ShoppingCart, FolderOpen, User } from 'lucide-react';

interface BottomDockProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartCount?: number;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  activeTab,
  onTabChange,
  cartCount = 0,
}) => {
  const tabs = [
    { id: 'storefront', label: 'Home', icon: Home },
    { id: 'orders', label: 'Orders', icon: FolderOpen },
    { id: 'checkout', label: 'Cart', icon: ShoppingCart, badge: cartCount },
    { id: 'vendor', label: 'Vendor', icon: LayoutGrid },
    { id: 'admin', label: 'Admin', icon: User },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 select-none w-[94%] max-w-sm md:hidden">
      <div className="bg-[#0a101f]/95 backdrop-blur-2xl border border-white/15 rounded-2xl px-2 py-1.5 shadow-2xl shadow-black/80 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center py-1.5 px-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-blue-400 bg-blue-500/15 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-md">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
