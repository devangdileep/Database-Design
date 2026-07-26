'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { CategoryPills } from '@/components/CategoryPills';
import { ProductCard } from '@/components/ProductCard';
import { RightDrawer } from '@/components/RightDrawer';
import { BottomDock } from '@/components/BottomDock';
import { VendorDashboard } from '@/components/VendorDashboard';
import { AdminPortal } from '@/components/AdminPortal';
import { AtomicCheckoutModal } from '@/components/AtomicCheckoutModal';
import { AddProductModal } from '@/components/AddProductModal';
import { INITIAL_PRODUCTS, Product, formatRupees } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, Scale, X } from 'lucide-react';

export default function Home() {
  const [currentTab, setCurrentTab] = useState('storefront'); // 'storefront' | 'vendor' | 'admin' | 'checkout' | 'orders' | 'settings' | 'wishlist' | 'profile'
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('Electronics');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([
    { product: INITIAL_PRODUCTS[0], quantity: 1 },
    { product: INITIAL_PRODUCTS[1], quantity: 1 },
    { product: INITIAL_PRODUCTS[2], quantity: 1 },
  ]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [comparingProduct, setComparingProduct] = useState<Product | null>(null);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: Product; quantity: number }[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'ALL' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex min-h-screen bg-[#070a12] text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Left Icon Rail Sidebar */}
      <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} cartCount={cartCount} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          cartCount={cartCount}
          currentRole={currentTab}
          onRoleChange={setCurrentTab}
        />

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto pb-24">
          
          {currentTab === 'storefront' && (
            <div className="space-y-6">
              
              {/* Category Pills Bar */}
              <CategoryPills
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {/* Section Header: Top Deals & Comparison */}
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-extrabold text-2xl text-slate-100 tracking-tight">
                  Top Deals & Comparison
                </h2>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full bg-[#0e1628] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-[#0e1628] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4-Column Product Grid (Matching Screenshot) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onCompareVendors={setComparingProduct}
                  />
                ))}
              </div>

            </div>
          )}

          {currentTab === 'vendor' && (
            <VendorDashboard onAddProductClick={() => setIsAddModalOpen(true)} />
          )}

          {currentTab === 'admin' && <AdminPortal />}

          {currentTab === 'checkout' && (
            <AtomicCheckoutModal
              cart={cart}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
            />
          )}

          {(currentTab === 'wishlist' || currentTab === 'profile' || currentTab === 'orders' || currentTab === 'settings') && (
            <div className="glass-card p-12 text-center text-slate-400 space-y-3 max-w-xl mx-auto">
              <h3 className="font-heading font-bold text-xl text-slate-200 capitalize">{currentTab} Section</h3>
              <p className="text-xs">Manage your personal settings, addresses, and order history.</p>
              <button
                onClick={() => setCurrentTab('storefront')}
                className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Return to Storefront
              </button>
            </div>
          )}

        </main>
      </div>

      {/* Right Drawer: Recommended For You */}
      <RightDrawer products={products} onSelectProduct={handleAddToCart} />

      {/* Bottom Floating Capsule Dock */}
      <BottomDock activeTab={currentTab} onTabChange={setCurrentTab} />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Vendor Comparison Modal */}
      {comparingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-card w-full max-w-md p-6 space-y-4 border border-blue-500/40 relative">
            <button
              onClick={() => setComparingProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-bold text-base text-slate-100 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-400" /> Multi-Vendor Price Comparison
            </h3>

            <div className="space-y-3 text-xs">
              <div className="font-bold text-slate-200 text-sm">{comparingProduct.title}</div>
              
              <div className="bg-[#070d1a] p-3 rounded-xl border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-emerald-400 font-semibold">
                  <span>Primary Vendor ({comparingProduct.vendorName}):</span>
                  <span className="text-sm font-bold">{formatRupees(comparingProduct.price)}</span>
                </div>
                {comparingProduct.altVendor && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Alternative ({comparingProduct.altVendor}):</span>
                    <span className="font-semibold">{formatRupees(comparingProduct.altPrice || 0)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-slate-400">
                  <span>Third-Party Direct:</span>
                  <span className="font-semibold">{formatRupees(comparingProduct.price * 1.05)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
