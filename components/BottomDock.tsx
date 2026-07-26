'use client';

import React from 'react';
import { Home, LayoutGrid, Heart, User } from 'lucide-react';

interface BottomDockProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'storefront', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: LayoutGrid },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 select-none">
      <div className="bg-[#0e1628]/90 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 shadow-2xl flex items-center gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id === 'categories' ? 'storefront' : tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600/25 text-blue-400 border border-blue-500/40 shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
