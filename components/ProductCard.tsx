'use client';

import React, { useState } from 'react';
import { Heart, Star, Store, Check, ShoppingCart } from 'lucide-react';
import { Product, formatRupees } from '@/lib/supabase';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onCompareVendors?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onCompareVendors,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="glass-card overflow-hidden flex flex-col justify-between p-4 relative group"
    >
      {/* Product Image & Wishlist Button */}
      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-900/80 mb-3.5 flex items-center justify-center">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md flex items-center justify-center border border-white/10 transition-colors ${
            isLiked ? 'text-pink-500 border-pink-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* Product Header */}
      <div>
        <h3 className="font-heading font-bold text-base text-slate-100 mb-1 leading-snug">
          {product.title}
        </h3>

        {/* Rating Row */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <div className="flex items-center gap-1 text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
          </div>
          <span>•</span>
          <span>{product.reviewsCount} revs</span>
        </div>

        {/* Vendor & Pricing Box */}
        <div className="bg-[#080d19]/90 border border-white/5 rounded-xl p-3 mb-3 text-xs">
          
          <div className="flex items-center justify-between text-slate-400 mb-1.5 font-medium">
            <span>{product.isTopSeller ? 'Top Seller' : 'Verified Vendor'}</span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <div className="w-4 h-4 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[9px]">
                <Store className="w-2.5 h-2.5" />
              </div>
              <span className="truncate max-w-[100px]">{product.vendorName}</span>
            </div>

            <div className="text-right">
              <div className="font-heading font-bold text-sm text-slate-100">
                {formatRupees(product.price)}
              </div>
              {product.originalPrice && (
                <div className="text-[10px] text-slate-500 line-through">
                  {formatRupees(product.originalPrice)}
                </div>
              )}
            </div>
          </div>

          {/* Stock & Coupon Details */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className={`font-semibold ${product.stock <= 5 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {product.stock} in Stock
              </span>
              {product.isLimited && (
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold tracking-wider">
                  LIMITED
                </span>
              )}
            </div>

            {product.couponTag && (
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight">
                {product.couponTag}
              </div>
            )}

            {product.altVendor && (
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
                <span>Alt: {product.altVendor}</span>
                <span className="font-semibold text-slate-300">{formatRupees(product.altPrice || 0)}</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <button
          onClick={() => onCompareVendors && onCompareVendors(product)}
          className="w-full py-2 px-2 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-slate-500 text-slate-300 font-semibold text-xs text-center transition-all"
        >
          Compare Vendors
        </button>

        <button
          onClick={handleAdd}
          className={`w-full py-2 px-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
            added
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/20'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
            </>
          )}
        </button>
      </div>

    </motion.div>
  );
};
