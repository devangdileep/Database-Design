'use client';

import React, { useState } from 'react';
import { ShoppingBag, Ticket, CreditCard, Lock, CheckCircle2, Trash2 } from 'lucide-react';
import { Product, formatRupees } from '@/lib/supabase';

interface AtomicCheckoutModalProps {
  cart: { product: Product; quantity: number }[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const AtomicCheckoutModal: React.FC<AtomicCheckoutModalProps> = ({
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [paymentMode, setPaymentMode] = useState('Credit/Debit Card');
  const [isExecuting, setIsExecuting] = useState(false);
  const [sqlTerminal, setSqlTerminal] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const shippingFee = cart.length > 0 ? 150 : 0;
  const totalPayable = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'SAVE15' || code === 'COUPON: -10%') {
      setDiscountPercent(15);
      setCouponMsg('15% Discount Applied!');
    } else if (code === 'SAVE20' || code === 'COUPON: SAVE20') {
      setDiscountPercent(20);
      setCouponMsg('20% Discount Applied!');
    } else if (code === 'TVOFFER50') {
      setDiscountPercent(25);
      setCouponMsg('25% TV Special Discount Applied!');
    } else {
      setCouponMsg('Invalid Coupon Code. Try: SAVE15 or SAVE20');
      setDiscountPercent(0);
    }
  };

  const executeAtomicTransaction = () => {
    if (cart.length === 0) return;
    setIsExecuting(true);
    setSqlTerminal(['> BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;']);

    setTimeout(() => {
      setSqlTerminal((prev) => [
        ...prev,
        `> INSERT INTO orders (order_id, customer_id, total_amount, order_status)\n  VALUES ('ORD-${Math.floor(
          1000 + Math.random() * 9000
        )}', 'CUST-101', ${totalPayable}, 'Placed');`
      ]);
    }, 500);

    setTimeout(() => {
      setSqlTerminal((prev) => [
        ...prev,
        `> INSERT INTO payments (payment_id, payment_mode, payment_status)\n  VALUES ('PAY-${Math.floor(
          10000 + Math.random() * 90000
        )}', '${paymentMode}', 'Completed');`
      ]);
    }, 1000);

    setTimeout(() => {
      cart.forEach((item) => {
        setSqlTerminal((prev) => [
          ...prev,
          `> UPDATE inventory SET stock_quantity = stock_quantity - ${item.quantity}\n  WHERE product_id = '${item.product.id}';`
        ]);
      });
    }, 1500);

    setTimeout(() => {
      setSqlTerminal((prev) => [
        ...prev,
        '> COMMIT TRANSACTION; -- [OK] All Row Locks Released & ACID verified.'
      ]);
      setIsSuccess(true);
      onClearCart();
    }, 2200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="font-heading font-bold text-xl text-slate-100 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-blue-400" /> Multi-Vendor Cart & Atomic Checkout
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Items grouped by vendor, real-time database coupon validation, and simulated ACID SQL transaction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          
          {cart.length === 0 ? (
            <div className="glass-card p-12 text-center text-slate-400 space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-600 opacity-60" />
              <h3 className="font-heading font-bold text-lg text-slate-200">Your Shopping Cart is Empty</h3>
              <p className="text-xs">Browse the catalog to add multi-vendor items to your cart.</p>
            </div>
          ) : (
            <div className="glass-card p-4 space-y-4 border border-white/10">
              <h3 className="font-heading font-bold text-sm text-slate-200 border-b border-white/10 pb-2">
                Cart Items
              </h3>

              <div className="divide-y divide-white/5">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={product.imageUrl} alt={product.title} className="w-12 h-12 rounded-lg object-cover bg-slate-900" />
                      <div>
                        <div className="font-semibold text-xs text-slate-100">{product.title}</div>
                        <div className="text-[11px] text-slate-400">Vendor: {product.vendorName}</div>
                        <div className="text-xs font-bold text-blue-400">{formatRupees(product.price)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-slate-900 border border-white/10 rounded-lg overflow-hidden text-xs">
                        <button onClick={() => onUpdateQty(product.id, -1)} className="px-2 py-1 hover:bg-white/10 text-slate-300">-</button>
                        <span className="px-2 font-bold text-white">{quantity}</span>
                        <button onClick={() => onUpdateQty(product.id, 1)} className="px-2 py-1 hover:bg-white/10 text-slate-300">+</button>
                      </div>

                      <div className="font-heading font-bold text-xs text-slate-100 w-20 text-right">
                        {formatRupees(product.price * quantity)}
                      </div>

                      <button onClick={() => onRemoveItem(product.id)} className="text-rose-400 hover:text-rose-300 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coupon Box */}
          <div className="glass-card p-4 border border-white/10 space-y-3">
            <h4 className="font-heading font-bold text-xs text-slate-200 flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-purple-400" /> Apply Coupon Code
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="e.g. SAVE15 or SAVE20"
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-4 py-1.5 rounded-xl transition-all"
              >
                Apply
              </button>
            </div>
            {couponMsg && (
              <div className={`text-xs font-semibold ${discountPercent > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {couponMsg}
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Col: Summary & Atomic Checkout Button */}
        <div className="space-y-4">
          <div className="glass-card p-5 border border-white/10 space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-100 border-b border-white/10 pb-2">
              Order Breakdown
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupees(subtotal)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Coupon Discount</span>
                <span>-{formatRupees(discountAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{formatRupees(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-heading font-bold text-white pt-2 border-t border-white/10">
                <span>Total Payable</span>
                <span className="text-blue-400">{formatRupees(totalPayable)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-400">Payment Mode:</span>
              {['Credit/Debit Card', 'UPI / NetBanking', 'Cash on Delivery'].map((mode) => (
                <div
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                    paymentMode === mode
                      ? 'bg-blue-600/20 border-blue-500/60 text-blue-300'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>{mode}</span>
                </div>
              ))}
            </div>

            {/* Atomic Checkout Button */}
            <button
              disabled={cart.length === 0 || isExecuting}
              onClick={executeAtomicTransaction}
              className={`w-full py-3 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                cart.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'gradient-btn shadow-blue-500/25'
              }`}
            >
              <Lock className="w-4 h-4" /> Complete Order (Simulate DBMS Transaction)
            </button>
          </div>

          {/* Atomic SQL Terminal Log Window */}
          {sqlTerminal.length > 0 && (
            <div className="glass-card p-4 border border-blue-900/40 bg-[#04070d] space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-1 text-cyan-400 font-bold">
                <span>DBMS Transaction Isolation</span>
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <div className="text-cyan-300 space-y-1 max-h-48 overflow-y-auto">
                {sqlTerminal.map((line, idx) => (
                  <div key={idx} className="leading-snug">{line}</div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
