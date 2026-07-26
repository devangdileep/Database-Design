'use client';

import React from 'react';
import { Search, SlidersHorizontal, Bell, MessageSquare, ShoppingCart, UserCheck } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  currentRole: string;
  onRoleChange: (role: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  currentRole,
  onRoleChange,
}) => {
  return (
    <header className="w-full bg-[#070a12]/80 backdrop-blur-xl border-b border-white/10 px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-20">
      
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <h1 className="font-heading font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
          ShopSphere
        </h1>
      </div>

      {/* Centered Search Capsule */}
      <div className="flex-1 max-w-2xl flex items-center gap-2">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, brands, and categories..."
            className="w-full bg-[#0e1628] border border-blue-900/40 focus:border-blue-500/80 rounded-full py-2 px-5 pr-10 text-sm text-slate-200 placeholder-slate-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <button className="w-9 h-9 rounded-full bg-[#0e1628] border border-blue-900/40 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:border-blue-500/60 transition-all shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Right User Controls */}
      <div className="flex items-center gap-4">
        
        {/* Role Switcher */}
        <select
          value={currentRole}
          onChange={(e) => onRoleChange(e.target.value)}
          className="hidden lg:block bg-[#0e1628] border border-purple-900/50 text-slate-200 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
        >
          <option value="storefront">Storefront View</option>
          <option value="vendor">Vendor Dashboard</option>
          <option value="admin">Platform Admin</option>
          <option value="checkout">Cart & Atomic Checkout</option>
        </select>

        {/* Bell Icon */}
        <button className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-[#070a12]" />
        </button>

        {/* Message Icon */}
        <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 bg-[#0e1628] border border-white/10 rounded-full px-3 py-1 cursor-pointer hover:border-blue-500/40 transition-colors">
          <span className="text-xs font-medium text-slate-300">Sarah J.</span>
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
            SJ
          </div>
        </div>

        {/* Cart Icon with Counter Badge */}
        <button
          onClick={() => onRoleChange('checkout')}
          className="relative p-2 text-slate-300 hover:text-white bg-[#0e1628] border border-white/10 rounded-xl flex items-center justify-center transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
              {cartCount}
            </span>
          )}
        </button>

      </div>

    </header>
  );
};
