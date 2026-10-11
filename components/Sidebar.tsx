'use client';

import React from 'react';
import { Home, LayoutGrid, ShoppingCart, FolderOpen, User, Settings } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  cartCount: number;
  userInitials?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  cartCount,
  userInitials = 'G',
}) => {
  const navItems = [
    { id: 'storefront', label: 'Storefront', icon: Home },
    { id: 'orders', label: 'Orders & Tracking', icon: FolderOpen },
    { id: 'vendor', label: 'Vendor Dashboard', icon: LayoutGrid },
    { id: 'checkout', label: 'Cart & Checkout', icon: ShoppingCart, badge: cartCount },
    { id: 'admin', label: 'Admin Portal', icon: User },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex w-16 lg:w-20 min-h-screen bg-[#070a12]/90 border-r border-white/10 flex-col items-center py-5 justify-between select-none z-30 shrink-0">
      
      {/* Top Logo */}
      <div
        className="flex flex-col items-center gap-2 cursor-pointer group"
        onClick={() => onTabChange('storefront')}
        title="ShopSphere Storefront"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
          S
        </div>
      </div>

      {/* Nav Icon Rail */}
      <nav className="flex flex-col items-center gap-4 my-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={item.label}
              className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {item.badge}
                </span>
              ) : null}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-r-full shadow-sm shadow-blue-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile Quick Action */}
      <div
        onClick={() => onTabChange('profile')}
        className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:border-blue-500 transition-colors cursor-pointer"
        title="User Profile"
      >
        <span className="text-xs font-semibold">{userInitials}</span>
      </div>

    </aside>
  );
};
