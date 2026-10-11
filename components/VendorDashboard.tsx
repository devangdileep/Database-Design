'use client';

import React, { useState, useEffect } from 'react';
import { Package, Tag, AlertTriangle, Plus, PenSquare, CheckCircle2, Loader2 } from 'lucide-react';
import {
  Product,
  Order,
  formatRupees,
  fetchProducts,
  fetchOrders,
  updateProductStock,
  updateOrderStatus,
} from '@/lib/supabase';

interface VendorDashboardProps {
  onAddProductClick: () => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ onAddProductClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadDashboardData = async () => {
    setIsLoading(true);
    const [prods, ords] = await Promise.all([fetchProducts(), fetchOrders()]);
    setProducts(prods);
    setOrders(ords);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalRev = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
  const lowStockCount = products.filter((p) => p.stock_quantity <= 4).length;

  const handleUpdateStock = async (productId: string) => {
    setIsUpdating(true);
    const success = await updateProductStock(productId, newStockVal);
    if (success) {
      setProducts((prev) =>
        prev.map((p) => (p.product_id === productId ? { ...p, stock_quantity: newStockVal } : p))
      );
    }
    setEditingId(null);
    setIsUpdating(false);
  };

  const handleStatusChange = async (orderId: string, status: Order['order_status']) => {
    const success = await updateOrderStatus(orderId, status);
    if (success) {
      setOrders((prev) =>
        prev.map((o) => (o.order_id === orderId ? { ...o, order_status: status } : o))
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        <span className="ml-3 text-slate-400 text-sm">Loading vendor dashboard from database...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-heading font-bold text-xl text-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" /> Vendor Inventory & Sales Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage inventory levels, trigger low-stock alerts, and fulfill multi-vendor orders from Supabase RDBMS.
          </p>
        </div>
        <button
          onClick={onAddProductClick}
          className="gradient-btn px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
              ₹
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-slate-100">{formatRupees(totalRev)}</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Orders Processed</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-slate-100">{orders.length}</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Active Listings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-slate-100">{products.length}</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Low Stock Warnings</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-amber-400">{lowStockCount}</div>
        </div>
      </div>

      {/* Inventory Management Table */}
      <div className="glass-card overflow-hidden border border-white/10">
        <div className="p-4 border-b border-white/10">
          <h3 className="font-heading font-bold text-sm text-slate-200">Real-Time Inventory Table</h3>
        </div>
        <div className="overflow-x-auto touch-pan-x">
          <table className="w-full min-w-[620px] text-left text-xs text-slate-300">
            <thead className="bg-[#070d1a] text-slate-400 font-semibold uppercase border-b border-white/5">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Current Stock</th>
                <th className="p-3">Trigger Alert</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-slate-500">No products found in database</td>
                </tr>
              ) : (
                products.map((p) => {
                  const isLow = p.stock_quantity <= 4;
                  return (
                    <tr key={p.product_id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-semibold text-slate-100">{p.product_name}</td>
                      <td className="p-3 text-slate-400">{p.vendor_name || 'N/A'}</td>
                      <td className="p-3">
                        <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                          {p.category_name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="p-3 font-bold">{formatRupees(p.price)}</td>
                      <td className="p-3 font-extrabold text-slate-100">
                        {editingId === p.product_id ? (
                          <input
                            type="number"
                            value={newStockVal}
                            onChange={(e) => setNewStockVal(parseInt(e.target.value) || 0)}
                            className="w-16 bg-slate-900 border border-blue-500 rounded px-1 py-0.5 text-white"
                          />
                        ) : (
                          p.stock_quantity
                        )}
                      </td>
                      <td className="p-3">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 text-[10px] font-bold animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> LOW STOCK ALERT
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Optimal
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {editingId === p.product_id ? (
                          <button
                            onClick={() => handleUpdateStock(p.product_id)}
                            disabled={isUpdating}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-[11px] font-semibold"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(p.product_id);
                              setNewStockVal(p.stock_quantity);
                            }}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 border border-white/10"
                          >
                            <PenSquare className="w-3 h-3" /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Fulfillment Queue Table */}
      <div className="glass-card overflow-hidden border border-white/10">
        <div className="p-4 border-b border-white/10">
          <h3 className="font-heading font-bold text-sm text-slate-200">Order Fulfillment Queue</h3>
        </div>
        <div className="overflow-x-auto touch-pan-x">
          <table className="w-full min-w-[540px] text-left text-xs text-slate-300">
            <thead className="bg-[#070d1a] text-slate-400 font-semibold uppercase border-b border-white/5">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-500">No orders found in database</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.order_id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-mono font-bold text-blue-400 text-[11px]">
                      {o.order_id.slice(0, 8)}...
                    </td>
                    <td className="p-3 font-semibold text-slate-100">
                      {o.customer_first_name} {o.customer_last_name}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">
                      {new Date(o.order_date).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-bold">{formatRupees(o.total_amount)}</td>
                    <td className="p-3">
                      <select
                        value={o.order_status}
                        onChange={(e) => handleStatusChange(o.order_id, e.target.value as Order['order_status'])}
                        className="bg-slate-900 border border-white/10 rounded px-2 py-1 text-xs text-slate-200 font-semibold cursor-pointer"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
