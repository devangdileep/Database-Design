'use client';

import React, { useState, useEffect } from 'react';
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
import { OrdersPage } from '@/components/OrdersPage';
import {
  Product,
  Customer,
  Category,
  formatRupees,
  fetchProducts,
  fetchCategories,
  fetchCurrentCustomer,
  insertProduct,
} from '@/lib/supabase';
import { ChevronLeft, ChevronRight, Scale, X, Loader2 } from 'lucide-react';

export default function Home() {
  const [currentTab, setCurrentTab] = useState('storefront');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [comparingProduct, setComparingProduct] = useState<Product | null>(null);

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [productsData, categoriesData, customer] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchCurrentCustomer(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setCurrentCustomer(customer);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Reload products when needed
  const reloadProducts = async () => {
    const productsData = await fetchProducts();
    setProducts(productsData);
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.product_id === product.product_id);
      if (existing) {
        return prev.map((item) =>
          item.product.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.product_id === productId) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: Product; quantity: number }[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.product_id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleAddProduct = async (newProduct: {
    vendor_id: string;
    category_id: string | null;
    product_name: string;
    description?: string;
    brand?: string;
    price: number;
    stock_quantity: number;
    image_url?: string;
  }) => {
    await insertProduct(newProduct);
    await reloadProducts();
  };

  // Filtered Products (client-side search + category filter)
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      (p.category_name || '').toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.vendor_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const customerName = currentCustomer
    ? `${currentCustomer.first_name} ${currentCustomer.last_name.charAt(0)}.`
    : 'Guest';
  const customerInitials = currentCustomer
    ? `${currentCustomer.first_name.charAt(0)}${currentCustomer.last_name.charAt(0)}`
    : 'G';

  return (
    <div className="flex min-h-screen bg-[#070a12] text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Left Icon Rail Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        cartCount={cartCount}
        userInitials={customerInitials}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          cartCount={cartCount}
          currentRole={currentTab}
          onRoleChange={setCurrentTab}
          customerName={customerName}
          customerInitials={customerInitials}
        />

        {/* Content Body */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <span className="ml-3 text-slate-400 text-sm">Loading from database...</span>
            </div>
          ) : (
            <>
              {currentTab === 'storefront' && (
                <div className="space-y-5 sm:space-y-6">
                  
                  {/* Category Pills Bar */}
                  <CategoryPills
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />

                  {/* Section Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-100 tracking-tight">
                      Top Deals & Comparison
                    </h2>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0e1628] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0e1628] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Product Grid */}
                  {filteredProducts.length === 0 ? (
                    <div className="glass-card p-12 text-center text-slate-400 space-y-3">
                      <h3 className="font-heading font-bold text-lg text-slate-200">No Products Found</h3>
                      <p className="text-xs">Try a different category or search term.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.product_id}
                          product={product}
                          onAddToCart={handleAddToCart}
                          onCompareVendors={setComparingProduct}
                        />
                      ))}
                    </div>
                  )}

                </div>
              )}

              {currentTab === 'vendor' && (
                <VendorDashboard onAddProductClick={() => setIsAddModalOpen(true)} />
              )}

              {currentTab === 'admin' && <AdminPortal />}

              {currentTab === 'checkout' && (
                <AtomicCheckoutModal
                  cart={cart}
                  customerId={currentCustomer?.customer_id || ''}
                  onUpdateQty={handleUpdateQty}
                  onRemoveItem={handleRemoveItem}
                  onClearCart={handleClearCart}
                  onOrderComplete={reloadProducts}
                  onNavigateToOrders={() => setCurrentTab('orders')}
                  onNavigateToStorefront={() => setCurrentTab('storefront')}
                />
              )}

              {currentTab === 'orders' && (
                <OrdersPage onNavigateToStorefront={() => setCurrentTab('storefront')} />
              )}

              {(currentTab === 'wishlist' || currentTab === 'profile' || currentTab === 'settings') && (
                <div className="glass-card p-12 text-center text-slate-400 space-y-3 max-w-xl mx-auto">
                  <h3 className="font-heading font-bold text-xl text-slate-200 capitalize">{currentTab} Section</h3>
                  <p className="text-xs">Manage your personal settings, addresses, and account preferences.</p>
                  <button
                    onClick={() => setCurrentTab('storefront')}
                    className="gradient-btn px-4 py-2 rounded-xl text-xs font-semibold"
                  >
                    Return to Storefront
                  </button>
                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* Right Drawer */}
      <RightDrawer products={products} onSelectProduct={handleAddToCart} />

      {/* Bottom Floating Dock */}
      <BottomDock activeTab={currentTab} onTabChange={setCurrentTab} cartCount={cartCount} />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Vendor Comparison Modal */}
      {comparingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4">
          <div className="glass-card w-[94%] sm:w-full max-w-md p-5 sm:p-6 space-y-4 border border-blue-500/40 relative rounded-2xl">
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
              <div className="font-bold text-slate-200 text-sm">{comparingProduct.product_name}</div>
              
              <div className="bg-[#070d1a] p-3 rounded-xl border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-emerald-400 font-semibold">
                  <span>Vendor ({comparingProduct.vendor_name}):</span>
                  <span className="text-sm font-bold">{formatRupees(comparingProduct.price)}</span>
                </div>
                {comparingProduct.brand && (
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Brand: {comparingProduct.brand}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-slate-400">
                  <span>Stock Available:</span>
                  <span className="font-semibold text-slate-300">{comparingProduct.stock_quantity} units</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
