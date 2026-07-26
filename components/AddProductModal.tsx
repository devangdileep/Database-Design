'use client';

import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { Product } from '@/lib/supabase';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (p: Product) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [vendorName, setVendorName] = useState('TechHub');
  const [price, setPrice] = useState('4999');
  const [stock, setStock] = useState('20');
  const [couponTag, setCouponTag] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: Product = {
      id: `prd-${Date.now()}`,
      title,
      category,
      rating: 5.0,
      reviewsCount: 1,
      isTopSeller: true,
      vendorName,
      price: parseFloat(price) || 4999,
      originalPrice: (parseFloat(price) || 4999) * 1.2,
      stock: parseInt(stock) || 10,
      couponTag: couponTag ? `COUPON: ${couponTag}` : undefined,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    };
    onAddProduct(newP);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="glass-card w-full max-w-lg p-6 space-y-4 border border-blue-500/40 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-heading font-bold text-lg text-slate-100 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-blue-400" /> Add Product to Multi-Vendor Catalog
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Product Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ultra Smartwatch Series 9"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Electronics">Electronics</option>
                <option value="Apparel">Apparel</option>
                <option value="Groceries">Groceries</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Beauty">Beauty</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Vendor Store</label>
              <select
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="TechHub">TechHub</option>
                <option value="SoundWaves">SoundWaves</option>
                <option value="GearOut">GearOut</option>
                <option value="FashionCraft">FashionCraft</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Base Price (₹)</label>
              <input
                type="number"
                step="1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Stock Quantity</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Coupon Tag (Optional)</label>
            <input
              type="text"
              value={couponTag}
              onChange={(e) => setCouponTag(e.target.value)}
              placeholder="e.g. SAVE15"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white uppercase focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="gradient-btn px-5 py-2 rounded-xl font-semibold shadow-lg shadow-blue-500/20"
            >
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
