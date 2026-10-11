'use client';

import React, { useState } from 'react';
import { ShoppingBag, CreditCard, Lock, CheckCircle2, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { Product, formatRupees, createOrder } from '@/lib/supabase';

interface AtomicCheckoutModalProps {
  cart: { product: Product; quantity: number }[];
  customerId: string;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderComplete?: () => Promise<void>;
}

export const AtomicCheckoutModal: React.FC<AtomicCheckoutModalProps> = ({
  cart,
  customerId,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOrderComplete,
}) => {
  const [paymentMode, setPaymentMode] = useState('Credit/Debit Card');
  const [isExecuting, setIsExecuting] = useState(false);
  const [sqlTerminal, setSqlTerminal] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = cart.length > 0 ? 150 : 0;
  const totalPayable = subtotal + shippingFee;

  const executeAtomicTransaction = async () => {
    if (cart.length === 0 || !customerId) {
      if (!customerId) {
        setErrorMessage('No customer record available. Please ensure customers are seeded in the database.');
      }
      return;
    }

    setIsExecuting(true);
    setErrorMessage('');
    setIsSuccess(false);
    setSqlTerminal(['> Connecting to Supabase RDBMS...', '> Initiating Atomic Order Placement...']);

    try {
      const items = cart.map((item) => ({
        product_id: item.product.product_id,
        vendor_id: item.product.vendor_id,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      const { order, sqlLog } = await createOrder(customerId, items, totalPayable);

      setSqlTerminal((prev) => [...prev, ...sqlLog]);

      if (order) {
        setIsSuccess(true);
        if (onOrderComplete) {
          await onOrderComplete();
        }
        onClearCart();
      } else {
        setErrorMessage('Failed to place order. Check the database logs in the terminal.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Database error occurred during order execution.');
      setSqlTerminal((prev) => [
        ...prev,
        `> ERROR: ${err?.message || 'Transaction aborted.'}`,
        '> ROLLBACK TRANSACTION;',
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="font-heading font-bold text-xl text-slate-100 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-blue-400" /> Multi-Vendor Cart & Atomic Checkout
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Atomic ACID transaction executing real SQL queries against the Supabase database.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

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
                Cart Items ({cart.length})
              </h3>

              <div className="divide-y divide-white/5">
                {cart.map(({ product, quantity }) => (
                  <div key={product.product_id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.product_name} className="w-12 h-12 rounded-lg object-cover bg-slate-900" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 text-[10px]">
                          Item
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-xs text-slate-100">{product.product_name}</div>
                        <div className="text-[11px] text-slate-400">Vendor: {product.vendor_name || 'Vendor'}</div>
                        <div className="text-xs font-bold text-blue-400">{formatRupees(product.price)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-slate-900 border border-white/10 rounded-lg overflow-hidden text-xs">
                        <button onClick={() => onUpdateQty(product.product_id, -1)} className="px-2 py-1 hover:bg-white/10 text-slate-300">-</button>
                        <span className="px-2 font-bold text-white">{quantity}</span>
                        <button onClick={() => onUpdateQty(product.product_id, 1)} className="px-2 py-1 hover:bg-white/10 text-slate-300">+</button>
                      </div>

                      <div className="font-heading font-bold text-xs text-slate-100 w-20 text-right">
                        {formatRupees(product.price * quantity)}
                      </div>

                      <button onClick={() => onRemoveItem(product.product_id)} className="text-rose-400 hover:text-rose-300 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                cart.length === 0 || isExecuting
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'gradient-btn shadow-blue-500/25'
              }`}
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Committing Transaction...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Place Order (Atomic SQL Transaction)
                </>
              )}
            </button>
          </div>

          {/* Atomic SQL Terminal Log Window */}
          {sqlTerminal.length > 0 && (
            <div className="glass-card p-4 border border-blue-900/40 bg-[#04070d] space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-1 text-cyan-400 font-bold">
                <span>Live Supabase SQL Output</span>
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <div className="text-cyan-300 space-y-1 max-h-48 overflow-y-auto whitespace-pre-wrap">
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
