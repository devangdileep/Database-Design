'use client';

import React from 'react';
import { Search, Bell, ShoppingCart } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  currentRole: string;
  onRoleChange: (role: string) => void;
  customerName?: string;
  customerInitials?: string;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  currentRole,
  onRoleChange,
  customerName = 'Guest',
  customerInitials = 'G',
}) => {
  return (
    <header className="w-full bg-[#070a12]/90 backdrop-blur-xl border-b border-white/10 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30">
      
      {/* Brand Title */}
      <div
        className="flex items-center gap-2 cursor-pointer shrink-0"
        onClick={() => onRoleChange('storefront')}
        title="Go to Storefront"
      >
        <div className="md:hidden w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
          S
        </div>
        <h1 className="font-heading font-extrabold text-lg sm:text-2xl tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent select-none">
          ShopSphere
        </h1>
      </div>

      {/* Centered Search Capsule */}
      <div className="flex-1 max-w-xl flex items-center gap-2 mx-1 sm:mx-2 min-w-0">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, brands..."
            className="w-full bg-[#0e1628] border border-blue-900/40 focus:border-blue-500/80 rounded-full py-1.5 sm:py-2 px-3.5 sm:px-5 pr-8 sm:pr-10 text-xs sm:text-sm text-slate-200 placeholder-slate-500 shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all truncate"
          />
          <Search className="absolute right-3 top-2 sm:top-2.5 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Right User Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        
        {/* Responsive Role Switcher Dropdown */}
        <select
          value={currentRole}
          onChange={(e) => onRoleChange(e.target.value)}
          className="bg-[#0e1628] border border-purple-900/50 text-slate-200 text-[11px] sm:text-xs font-semibold rounded-lg px-2 sm:px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer max-w-[105px] sm:max-w-none"
        >
          <option value="storefront">Storefront</option>
          <option value="orders">Orders</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
          <option value="checkout">Cart</option>
        </select>

        {/* User Profile Pill */}
        <div
          onClick={() => onRoleChange('profile')}
          className="flex items-center gap-1.5 sm:gap-2 bg-[#0e1628] border border-white/10 rounded-full py-1 px-1.5 sm:px-2.5 cursor-pointer hover:border-blue-500/40 transition-colors"
          title={`Signed in as ${customerName}`}
        >
          <span className="hidden sm:inline text-xs font-medium text-slate-300 max-w-[90px] truncate">
            {customerName}
          </span>
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm shrink-0">
            {customerInitials}
          </div>
        </div>

        {/* Cart Icon with Live Counter */}
        <button
          onClick={() => onRoleChange('checkout')}
          className="relative p-1.5 sm:p-2 text-slate-300 hover:text-white bg-[#0e1628] border border-white/10 rounded-xl flex items-center justify-center transition-colors"
          title="Shopping Cart"
        >
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md">
              {cartCount}
            </span>
          )}
        </button>

      </div>

    </header>
  );
};
