'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  Search,
  FileText,
  MapPin,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  X,
  Printer,
} from 'lucide-react';
import {
  Order,
  formatRupees,
  fetchOrders,
  updateOrderStatus,
} from '@/lib/supabase';

interface OrdersPageProps {
  onNavigateToStorefront: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigateToStorefront }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Modals state
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    const data = await fetchOrders();
    setOrders(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order? This will release reserved inventory.')) {
      return;
    }
    setCancellingId(orderId);
    const success = await updateOrderStatus(orderId, 'Cancelled');
    if (success) {
      setOrders((prev) =>
        prev.map((o) => (o.order_id === orderId ? { ...o, order_status: 'Cancelled' } : o))
      );
    }
    setCancellingId(null);
  };

  // Filter & Search
  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && ['Placed', 'Packed', 'Shipped'].includes(o.order_status)) ||
      o.order_status.toUpperCase() === filterStatus.toUpperCase();

    const matchesSearch =
      o.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.items &&
        o.items.some(
          (i) =>
            i.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.vendor_name?.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    return matchesFilter && (searchQuery ? matchesSearch : true);
  });

  const totalSpent = orders
    .filter((o) => o.order_status !== 'Cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const activeOrdersCount = orders.filter((o) =>
    ['Placed', 'Packed', 'Shipped'].includes(o.order_status)
  ).length;

  const deliveredCount = orders.filter((o) => o.order_status === 'Delivered').length;

  const getStatusBadge = (status: Order['order_status']) => {
    switch (status) {
      case 'Placed':
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Order Placed
          </span>
        );
      case 'Packed':
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Packed & Ready
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">
            <Truck className="w-3.5 h-3.5" />
            Out for Delivery
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
    }
  };

  const getStepIndex = (status: Order['order_status']) => {
    switch (status) {
      case 'Placed':
        return 0;
      case 'Packed':
        return 1;
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return -1;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-100 flex items-center gap-2.5">
            <Package className="w-6 h-6 text-blue-400" /> My Orders & Fulfillment Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-vendor order tracking, status timeline, and downloadable tax invoices.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="bg-slate-900 border border-white/10 hover:border-blue-500 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-slate-100">{orders.length}</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">In-Transit Orders</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-amber-400">{activeOrdersCount}</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Delivered</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-emerald-400">{deliveredCount}</div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Spent</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
              ₹
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-slate-100">{formatRupees(totalSpent)}</div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-[#090e1a] rounded-xl border border-white/5">
          {[
            { id: 'ALL', label: 'All Orders' },
            { id: 'ACTIVE', label: 'In-Transit' },
            { id: 'DELIVERED', label: 'Delivered' },
            { id: 'CANCELLED', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search order ID or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#090e1a] border border-white/10 focus:border-blue-500 rounded-xl px-3.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
          <Search className="absolute right-3 top-2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400 space-y-4 max-w-lg mx-auto">
          <Package className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="font-heading font-bold text-lg text-slate-200">No Orders Found</h3>
          <p className="text-xs">
            {searchQuery || filterStatus !== 'ALL'
              ? 'Try adjusting your search filters or status criteria.'
              : 'You have not placed any orders yet. Explore the marketplace catalog!'}
          </p>
          <button
            onClick={onNavigateToStorefront}
            className="gradient-btn px-5 py-2.5 rounded-xl font-heading font-semibold text-xs shadow-lg shadow-blue-500/20"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const stepIndex = getStepIndex(order.order_status);
            const isCancelled = order.order_status === 'Cancelled';

            return (
              <div
                key={order.order_id}
                className="glass-card border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all space-y-4 p-5"
              >
                {/* Order Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono font-bold text-sm text-blue-400">
                        {order.order_id}
                      </span>
                      <span className="text-slate-500 text-xs">•</span>
                      <span className="text-xs text-slate-400">
                        {new Date(order.order_date).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </span>
                      {getStatusBadge(order.order_status)}
                    </div>
                    <div className="text-xs text-slate-400">
                      Placed by{' '}
                      <span className="text-slate-200 font-semibold">
                        {order.customer_first_name} {order.customer_last_name}
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:self-center">
                    <div className="text-xs text-slate-400">Total Payable</div>
                    <div className="font-heading font-extrabold text-lg text-emerald-400">
                      {formatRupees(order.total_amount)}
                    </div>
                  </div>
                </div>

                {/* Tracking Progress Bar (If not cancelled) */}
                {!isCancelled && (
                  <div className="bg-[#050811] p-3.5 rounded-xl border border-white/5 space-y-2">
                    <div className="flex justify-between text-[11px] text-slate-400 font-semibold mb-1">
                      <span className={stepIndex >= 0 ? 'text-blue-400 font-bold' : ''}>1. Placed</span>
                      <span className={stepIndex >= 1 ? 'text-blue-400 font-bold' : ''}>2. Packed</span>
                      <span className={stepIndex >= 2 ? 'text-blue-400 font-bold' : ''}>3. Shipped</span>
                      <span className={stepIndex >= 3 ? 'text-emerald-400 font-bold' : ''}>4. Delivered</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full transition-all duration-500 ${
                          order.order_status === 'Delivered'
                            ? 'bg-emerald-500 w-full'
                            : stepIndex === 2
                            ? 'bg-purple-500 w-3/4'
                            : stepIndex === 1
                            ? 'bg-amber-500 w-1/2'
                            : 'bg-blue-500 w-1/4'
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Line Items List */}
                <div className="divide-y divide-white/5">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.product_name}
                              className="w-11 h-11 rounded-lg object-cover bg-slate-900 border border-white/5 shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 text-[10px] shrink-0">
                              Item
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-xs text-slate-200 truncate">
                              {item.product_name}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2">
                              <span>Vendor: <strong className="text-slate-300">{item.vendor_name || 'Vendor'}</strong></span>
                              <span>•</span>
                              <span>Qty: <strong className="text-slate-300">{item.quantity}</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="font-heading font-bold text-xs text-slate-100 text-right whitespace-nowrap">
                          {formatRupees(item.unit_price * item.quantity)}
                          <div className="text-[10px] text-slate-500 font-normal">
                            ({formatRupees(item.unit_price)} each)
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-2 text-xs text-slate-400 italic">
                      Multi-vendor order items verified and stored in database.
                    </div>
                  )}
                </div>

                {/* Order Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/5 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTrackingOrder(order)}
                      className="bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-blue-500/50 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>Track Package</span>
                    </button>

                    <button
                      onClick={() => setInvoiceOrder(order)}
                      className="bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-purple-500/50 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      <span>View Invoice</span>
                    </button>
                  </div>

                  {['Placed', 'Packed'].includes(order.order_status) && (
                    <button
                      disabled={cancellingId === order.order_id}
                      onClick={() => handleCancelOrder(order.order_id)}
                      className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>{cancellingId === order.order_id ? 'Cancelling...' : 'Cancel Order'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Package Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-card w-full max-w-md p-6 space-y-4 border border-blue-500/40 relative">
            <button
              onClick={() => setTrackingOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-bold text-base text-slate-100 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-400" /> Live Shipment Tracking
            </h3>

            <div className="bg-[#070d1a] p-3 rounded-xl border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono font-bold text-blue-400">{trackingOrder.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Carrier Partner:</span>
                <span className="font-semibold text-slate-200">BlueDart Express (Air Logistics)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AWB Tracking No:</span>
                <span className="font-mono text-slate-300">BD-{trackingOrder.order_id.replace(/\D/g, '') || '948271'}IN</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Delivery:</span>
                <span className="font-semibold text-emerald-400">
                  {new Date(Date.now() + 3600000 * 48).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shadow-sm shadow-blue-500" />
                <div>
                  <div className="font-semibold text-slate-200">Order Verified & Inventory Reserved</div>
                  <div className="text-[11px] text-slate-400">ACID serializable transaction committed to database.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-2.5 h-2.5 rounded-full mt-1 ${['Packed', 'Shipped', 'Delivered'].includes(trackingOrder.order_status) ? 'bg-blue-500' : 'bg-slate-700'}`} />
                <div>
                  <div className="font-semibold text-slate-200">Vendor Fulfillment & Quality Check</div>
                  <div className="text-[11px] text-slate-400">Dispatched from regional multi-vendor hub.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-2.5 h-2.5 rounded-full mt-1 ${['Shipped', 'Delivered'].includes(trackingOrder.order_status) ? 'bg-blue-500' : 'bg-slate-700'}`} />
                <div>
                  <div className="font-semibold text-slate-200">Out for Local Delivery</div>
                  <div className="text-[11px] text-slate-400">Courier assigned for contact-free doorstep arrival.</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setTrackingOrder(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-xs mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Tax Invoice Modal */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#0b101d] border border-white/20 rounded-2xl w-full max-w-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto text-slate-200 relative text-xs">
            <button
              onClick={() => setInvoiceOrder(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Invoice Top */}
            <div className="flex justify-between items-start border-b border-white/10 pb-3">
              <div>
                <h2 className="font-heading font-extrabold text-xl text-white">SHOPSPHERE RETAIL</h2>
                <p className="text-[11px] text-slate-400">Official Commercial Tax Invoice</p>
                <p className="text-[10px] text-slate-500 font-mono">GSTIN: 29AABCU9603R1ZX</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm text-blue-400">{invoiceOrder.order_id}</span>
                <p className="text-[10px] text-slate-400">{new Date(invoiceOrder.order_date).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-2 gap-4 bg-[#060a14] p-3 rounded-xl border border-white/5">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Billed To:</span>
                <p className="font-semibold text-white mt-0.5">
                  {invoiceOrder.customer_first_name} {invoiceOrder.customer_last_name}
                </p>
                <p className="text-[11px] text-slate-400">Registered Customer Account</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Payment Status:</span>
                <p className="text-emerald-400 font-bold mt-0.5">PAID & AUTHORIZED</p>
                <p className="text-[11px] text-slate-400">Fulfillment: Verified</p>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-left text-[11px]">
              <thead className="border-b border-white/10 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoiceOrder.items && invoiceOrder.items.length > 0 ? (
                  invoiceOrder.items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-2">
                        <div className="font-semibold text-white">{item.product_name}</div>
                        <div className="text-[10px] text-slate-500">Fulfilled by {item.vendor_name}</div>
                      </td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-right">{formatRupees(item.unit_price)}</td>
                      <td className="py-2 text-right font-semibold text-slate-100">
                        {formatRupees(item.unit_price * item.quantity)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-2 text-center text-slate-500 italic">
                      Multi-vendor catalog transaction
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Invoice Total */}
            <div className="border-t border-white/10 pt-3 space-y-1.5 text-right">
              <div className="flex justify-between text-slate-400">
                <span>Gross Amount:</span>
                <span>{formatRupees(invoiceOrder.total_amount - 150)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping & Handling:</span>
                <span>₹150</span>
              </div>
              <div className="flex justify-between font-heading font-extrabold text-sm text-white pt-1 border-t border-white/5">
                <span>Total Invoice Value:</span>
                <span className="text-blue-400">{formatRupees(invoiceOrder.total_amount)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 text-xs shadow-md shadow-blue-500/20"
              >
                <Printer className="w-3.5 h-3.5" /> Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
