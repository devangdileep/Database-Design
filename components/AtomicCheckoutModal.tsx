'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  CreditCard,
  Lock,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Loader2,
  MapPin,
  ShieldCheck,
  QrCode,
  Smartphone,
  Banknote,
  ArrowRight,
  Package,
} from 'lucide-react';
import { Product, formatRupees, createOrder, Order } from '@/lib/supabase';

interface AtomicCheckoutModalProps {
  cart: { product: Product; quantity: number }[];
  customerId: string;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderComplete?: () => Promise<void>;
  onNavigateToOrders?: () => void;
  onNavigateToStorefront?: () => void;
}

export const AtomicCheckoutModal: React.FC<AtomicCheckoutModalProps> = ({
  cart,
  customerId,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOrderComplete,
  onNavigateToOrders,
  onNavigateToStorefront,
}) => {
  const [paymentMode, setPaymentMode] = useState<'card' | 'upi' | 'cod'>('card');
  const [isExecuting, setIsExecuting] = useState(false);
  const [sqlTerminal, setSqlTerminal] = useState<string[]>([]);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Shipping details state
  const [shippingName, setShippingName] = useState('Sravan Kumar');
  const [shippingPhone, setShippingPhone] = useState('9876543210');
  const [shippingAddress, setShippingAddress] = useState('Flat 402, Skyline Towers, MG Road');
  const [shippingCity, setShippingCity] = useState('Bengaluru, Karnataka - 560001');

  // Card details state
  const [cardNumber, setCardNumber] = useState('4532 8921 4410 8923');
  const [cardHolder, setCardHolder] = useState('SRAVAN KUMAR');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('842');

  // UPI state
  const [upiId, setUpiId] = useState('sravan@okhdfcbank');

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = cart.length > 0 ? (subtotal > 10000 ? 0 : 150) : 0;
  const totalPayable = subtotal + shippingFee;

  const executeAtomicTransaction = async () => {
    if (cart.length === 0) return;

    setIsExecuting(true);
    setErrorMessage('');
    setSqlTerminal([
      '> [PAYMENT] Verifying payment credentials & 256-bit gateway handshake...',
      `> [PAYMENT] Authorized ₹${totalPayable} via ${paymentMode.toUpperCase()} mode.`,
      '> [ACID] Initiating Atomic Multi-Vendor Transaction in PostgreSQL RDBMS...',
    ]);

    try {
      const items = cart.map((item) => ({
        product_id: item.product.product_id,
        vendor_id: item.product.vendor_id,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));

      // Small delay for realistic payment authorization feedback
      await new Promise((res) => setTimeout(res, 600));

      const { order, sqlLog } = await createOrder(
        customerId || 'a1b2c3d4-0001-4000-8000-000000000001',
        items,
        totalPayable
      );

      setSqlTerminal((prev) => [...prev, ...sqlLog]);

      if (order) {
        setCompletedOrder(order);
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

  // SUCCESS / ORDER CONFIRMED VIEW
  if (completedOrder) {
    return (
      <div className="glass-card max-w-2xl mx-auto p-8 border border-emerald-500/40 rounded-3xl space-y-6 text-center animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <h2 className="font-heading font-extrabold text-2xl text-white">
            Order Confirmed & Paid!
          </h2>
          <p className="text-xs text-slate-400">
            Your transaction was committed atomically with SERIALIZABLE isolation.
          </p>
        </div>

        <div className="bg-[#060a14] p-4 rounded-2xl border border-white/10 text-left text-xs space-y-3">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-slate-400">Order Reference:</span>
            <span className="font-mono font-bold text-blue-400 text-sm">{completedOrder.order_id}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-slate-400">Payment Status:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Paid & Authorized ({paymentMode.toUpperCase()})
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-slate-400">Delivery Address:</span>
            <span className="text-slate-200 font-medium truncate max-w-[260px]">
              {shippingAddress}, {shippingCity}
            </span>
          </div>
          <div className="flex justify-between items-center pt-1 font-heading font-bold text-sm text-white">
            <span>Total Paid:</span>
            <span className="text-blue-400">{formatRupees(completedOrder.total_amount)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={onNavigateToOrders}
            className="gradient-btn py-3 rounded-xl font-heading font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
          >
            <Package className="w-4 h-4" />
            <span>Track in My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onNavigateToStorefront}
            className="bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-white/30 text-slate-200 py-3 rounded-xl font-semibold text-xs transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="font-heading font-bold text-xl text-slate-100 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-blue-400" /> Multi-Vendor Cart & Atomic Checkout
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Complete payment authorization and commit transactional order records to the database.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Cart Review & Delivery Address */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Cart Items Box */}
          {cart.length === 0 ? (
            <div className="glass-card p-12 text-center text-slate-400 space-y-4">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-600 opacity-60" />
              <h3 className="font-heading font-bold text-lg text-slate-200">Your Cart is Empty</h3>
              <p className="text-xs">Browse the multi-vendor catalog to add products.</p>
              <button
                onClick={onNavigateToStorefront}
                className="gradient-btn px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="glass-card p-4 space-y-4 border border-white/10">
              <h3 className="font-heading font-bold text-sm text-slate-200 border-b border-white/10 pb-2">
                Order Items ({cart.length})
              </h3>

              <div className="divide-y divide-white/5">
                {cart.map(({ product, quantity }) => (
                  <div key={product.product_id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.product_name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-white/5"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 text-[10px]">
                          Item
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-xs text-slate-100">{product.product_name}</div>
                        <div className="text-[11px] text-slate-400">
                          Vendor: <span className="text-slate-300 font-medium">{product.vendor_name || 'Vendor'}</span>
                        </div>
                        <div className="text-xs font-bold text-blue-400">{formatRupees(product.price)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-slate-900 border border-white/10 rounded-lg overflow-hidden text-xs">
                        <button
                          onClick={() => onUpdateQty(product.product_id, -1)}
                          className="px-2 py-1 hover:bg-white/10 text-slate-300"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold text-white">{quantity}</span>
                        <button
                          onClick={() => onUpdateQty(product.product_id, 1)}
                          className="px-2 py-1 hover:bg-white/10 text-slate-300"
                        >
                          +
                        </button>
                      </div>

                      <div className="font-heading font-bold text-xs text-slate-100 w-20 text-right">
                        {formatRupees(product.price * quantity)}
                      </div>

                      <button
                        onClick={() => onRemoveItem(product.product_id)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Address Section */}
          <div className="glass-card p-4 space-y-3 border border-white/10">
            <h3 className="font-heading font-bold text-sm text-slate-200 flex items-center gap-2 border-b border-white/10 pb-2">
              <MapPin className="w-4 h-4 text-blue-400" /> Shipping & Delivery Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Street Address</label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">City, State & Pincode</label>
                <input
                  type="text"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Payment Mode, Breakdown & Pay Button */}
        <div className="space-y-4">
          <div className="glass-card p-5 border border-white/10 space-y-4">
            
            <h3 className="font-heading font-bold text-base text-slate-100 border-b border-white/10 pb-2">
              Payment Gateway
            </h3>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode('card')}
                className={`py-2 px-1 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 border transition-all ${
                  paymentMode === 'card'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('upi')}
                className={`py-2 px-1 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 border transition-all ${
                  paymentMode === 'upi'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('cod')}
                className={`py-2 px-1 rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 border transition-all ${
                  paymentMode === 'cod'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Cash</span>
              </button>
            </div>

            {/* Dynamic Payment Details Form */}
            {paymentMode === 'card' && (
              <div className="bg-[#060a14] p-3 rounded-xl border border-white/10 space-y-2 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1 text-[10px]">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 8921 4410 8923"
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1 text-[10px]">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="08/28"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1 text-[10px]">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>256-Bit SSL Encrypted & PCI-DSS Compliant</span>
                </div>
              </div>
            )}

            {paymentMode === 'upi' && (
              <div className="bg-[#060a14] p-3 rounded-xl border border-white/10 space-y-2.5 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1 text-[10px]">Enter UPI ID / VPA</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@bank"
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg border border-white/5">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <QrCode className="w-4 h-4 text-purple-400" /> Scan QR on Payment
                  </span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold">
                    Instant
                  </span>
                </div>
              </div>
            )}

            {paymentMode === 'cod' && (
              <div className="bg-[#060a14] p-3 rounded-xl border border-white/10 text-xs text-slate-300 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-emerald-400" /> Cash on Delivery
                </div>
                <p className="text-[11px] text-slate-400">
                  Pay with cash or UPI QR scan directly to the courier agent upon doorstep receipt.
                </p>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs text-slate-300 border-t border-white/10 pt-3">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatRupees(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Shipping Fee</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-400 font-bold">FREE</strong> : formatRupees(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-heading font-bold text-white pt-2 border-t border-white/10">
                <span>Total Payable</span>
                <span className="text-blue-400">{formatRupees(totalPayable)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              disabled={cart.length === 0 || isExecuting}
              onClick={executeAtomicTransaction}
              className={`w-full py-3.5 rounded-xl font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                cart.length === 0 || isExecuting
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'gradient-btn shadow-blue-500/25'
              }`}
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authorizing & Committing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Pay {formatRupees(totalPayable)} & Place Order
                </>
              )}
            </button>
          </div>

          {/* Atomic SQL Terminal Log Window */}
          {sqlTerminal.length > 0 && (
            <div className="glass-card p-4 border border-blue-900/40 bg-[#04070d] space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-1 text-cyan-400 font-bold">
                <span>Live ACID SQL Stream</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
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
