'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Send,
  MapPin,
  Calendar,
  CreditCard,
  User,
  ShieldCheck,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/root/AdminLayoutShell';
import {
  fetchAdminOrder,
  updateOrderStatus,
  dispatchOrderToShiprocket,
  trackOrderShiprocket,
  AdminOrder,
} from '@/lib/adminApi';
import { showAdminToast } from '@/components/root/AdminToaster';

const MONO = "'JetBrains Mono', monospace";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [copiedAwb, setCopiedAwb] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [trackingScans, setTrackingScans] = useState<any | null>(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);

  const loadOrder = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAdminOrder(orderId);
      setOrder(data);
      if (data.trackingNumber) {
        loadTracking(data.id);
      }
    } catch (err: any) {
      console.error('Failed to load order details:', err);
      setError(err.message || 'Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTracking = async (id: string) => {
    setIsTrackingLoading(true);
    try {
      const trackData = await trackOrderShiprocket(id);
      setTrackingScans(trackData);
    } catch (err) {
      console.warn('Live tracking scans unavailable:', err);
    } finally {
      setIsTrackingLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    try {
      const updated = await updateOrderStatus(order.id, newStatus);
      setOrder((prev) => (prev ? { ...prev, status: updated.status } : updated));
      setActionSuccessMsg(`Order status updated to ${newStatus}`);
      showAdminToast(`Order status updated to ${newStatus}`, 'success', 'Order Updated');
      setTimeout(() => setActionSuccessMsg(''), 3000);
    } catch (err: any) {
      showAdminToast(err.message || 'Failed to update order status', 'error', 'Update Failed');
    }
  };

  const handleDispatch = async () => {
    if (!order) return;
    setIsDispatching(true);
    try {
      const res = await dispatchOrderToShiprocket(order.id);
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              status: 'SHIPPED',
              trackingNumber: res.awbCode,
            }
          : prev
      );
      setActionSuccessMsg('Consignment successfully dispatched to Shiprocket!');
      showAdminToast(`Dispatched to Shiprocket! AWB: ${res.awbCode}`, 'success', 'Order Dispatched');
      setTimeout(() => setActionSuccessMsg(''), 3000);
      loadTracking(order.id);
    } catch (err: any) {
      showAdminToast(err.message || 'Failed to dispatch to Shiprocket', 'error', 'Dispatch Error');
    } finally {
      setIsDispatching(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAwb(true);
    showAdminToast(`AWB ${text} copied to clipboard`, 'info', 'Copied');
    setTimeout(() => setCopiedAwb(false), 2000);
  };

  return (
    <AdminLayoutShell activeTab="orders" searchPlaceholder="Search this order..">
      <div className="space-y-6">
        {/* ─── Back Bar & Action Buttons ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/root?tab=orders"
            className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders List</span>
          </Link>

          {order && (
            <div className="flex items-center gap-2">
              <button
                onClick={loadOrder}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="Reload Order"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-mono border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          )}
        </div>

        {/* ─── Feedback Banner ─── */}
        {actionSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* ─── Loading State ─── */}
        {isLoading ? (
          <div className="p-16 rounded-2xl bg-[#0d0d0d] border border-white/10 text-center text-white/50 font-mono text-xs space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-white/40" />
            <p>Loading Order Dossier #{orderId}...</p>
          </div>
        ) : error || !order ? (
          <div className="p-12 rounded-2xl bg-[#0d0d0d] border border-white/10 text-center text-white space-y-3">
            <AlertCircle className="w-8 h-8 text-white/40 mx-auto" />
            <h3 className="text-base font-bold font-mono">Order Not Found</h3>
            <p className="text-xs text-white/50">{error || `Could not locate order with ID "${orderId}".`}</p>
            <Link
              href="/root?tab=orders"
              className="inline-block mt-2 px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold"
            >
              Return to Orders
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* ─── Top Order Header Card ─── */}
            <div className="p-5 sm:p-7 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                    CONSIGNMENT ORDER
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase bg-white text-black">
                    {order.status}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                  {order.orderNumber}
                </h2>
                <p className="text-xs text-white/50 font-mono">
                  Placed on {new Date(order.createdAt).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* Status Selector & Dispatch Button */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 uppercase block">Update Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase border border-white/20 bg-white/10 text-white cursor-pointer focus:outline-none"
                  >
                    <option value="PENDING" className="bg-[#111] text-white">PENDING</option>
                    <option value="CONFIRMED" className="bg-[#111] text-white">CONFIRMED</option>
                    <option value="PROCESSING" className="bg-[#111] text-white">PROCESSING</option>
                    <option value="SHIPPED" className="bg-[#111] text-white">SHIPPED</option>
                    <option value="DELIVERED" className="bg-[#111] text-white">DELIVERED</option>
                    <option value="CANCELLED" className="bg-[#111] text-white">CANCELLED</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 uppercase block">Shiprocket Engine</label>
                  <button
                    onClick={handleDispatch}
                    disabled={isDispatching}
                    className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-mono text-xs uppercase font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isDispatching ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Posting to Shiprocket...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-black" />
                        <span>{order.shiprocketOrderId ? 'Re-sync with Shiprocket' : 'Post to Shiprocket'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ─── Shiprocket Logistics Hub Card ─── */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Shiprocket Cold Chain Logistics
                    </h3>
                    <p className="text-[10px] text-white/40 font-mono">
                      Pickup Hub: Amritsar Central (143001) · Priority Express Air
                    </p>
                  </div>
                </div>

                {order.trackingNumber && (
                  <a
                    href={`/track-order?id=${order.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-white/60 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Public Tracker</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {order.trackingNumber ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] text-white/40 uppercase block">AWB Airway Bill</span>
                      <div className="flex items-center gap-1 font-bold text-white mt-0.5">
                        <span>{order.trackingNumber}</span>
                        <button
                          onClick={() => copyToClipboard(order.trackingNumber!)}
                          className="p-1 hover:text-white transition-colors cursor-pointer"
                          title="Copy AWB"
                        >
                          {copiedAwb ? (
                            <Check className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-white/40" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] text-white/40 uppercase block">Courier Partner</span>
                      <span className="font-bold text-white block mt-0.5">
                        {trackingScans?.courierName || 'BlueDart Express Cold'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] text-white/40 uppercase block">Current Scan</span>
                      <span className="font-bold text-white block mt-0.5">
                        {trackingScans?.statusText || 'In Transit (Cold Sealed)'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] text-white/40 uppercase block">Destination Hub</span>
                      <span className="font-bold text-white block mt-0.5">
                        {order.shippingAddress?.city || 'India'}
                      </span>
                    </div>
                  </div>

                  {/* Scans Timeline */}
                  {trackingScans?.activities && trackingScans.activities.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                        LIVE CARRIER SCANS TIMELINE
                      </span>
                      <div className="space-y-2.5 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                        {trackingScans.activities.map((act: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 relative text-xs">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                                idx === 0
                                  ? 'bg-white text-black font-bold'
                                  : 'bg-[#141414] border border-white/20 text-white/50'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white uppercase">{act.status}</span>
                                <span className="text-[10px] font-mono text-white/40">{act.date}</span>
                              </div>
                              <p className="text-white/70 text-[11px] mt-0.5">{act.activity}</p>
                              {act.location && (
                                <p className="text-[10px] text-white/50 font-mono mt-0.5">{act.location}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-medium text-white">Consignment Awaiting Shiprocket Manifest</p>
                    <p className="text-[10px] text-white/40 font-mono mt-0.5">
                      Push order to your Shiprocket merchant dashboard to generate live AWB and courier label.
                    </p>
                  </div>
                  <button
                    onClick={handleDispatch}
                    disabled={isDispatching}
                    className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95 disabled:opacity-50 shrink-0"
                  >
                    {isDispatching ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-black" />
                        <span>Post to Shiprocket</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* ─── Customer & Address Information Cards ─── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Dossier */}
              <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <User className="w-4 h-4 text-white" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Customer Information
                  </h4>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-white/40 block uppercase">Full Name</span>
                    <span className="font-bold text-white block">
                      {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest Customer'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-white/40 block uppercase">Email Address</span>
                    <span className="text-white/80 block">{order.user?.email || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-white/40 block uppercase">Phone Number</span>
                    <span className="text-white/80 block">{order.user?.phone || 'No phone provided'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-white/40 block uppercase">User Account ID</span>
                    <span className="text-white/40 block">{order.userId}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Destination */}
              <div className="p-5 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <MapPin className="w-4 h-4 text-white" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Delivery Address
                  </h4>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  {order.shippingAddress ? (
                    <>
                      <div>
                        <span className="text-[10px] text-white/40 block uppercase">Street Address</span>
                        <p className="text-white font-medium">{order.shippingAddress.line1}</p>
                        {order.shippingAddress.line2 && (
                          <p className="text-white/60">{order.shippingAddress.line2}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-white/40 block uppercase">City & State</span>
                          <span className="text-white/80 block">
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-white/40 block uppercase">Postal Code</span>
                          <span className="font-bold text-white block">{order.shippingAddress.postalCode}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-white/40 block uppercase">Country</span>
                        <span className="text-white/80 block">{order.shippingAddress.country || 'India'}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-white/40">Standard Pan-India Express Delivery</p>
                  )}
                </div>
              </div>
            </div>

            {/* ─── Ordered Items List & Financial Summary ─── */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Consignment Crate Items ({order.items.length})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
                      <th className="pb-3">Product Item</th>
                      <th className="pb-3">Pack & SKU</th>
                      <th className="pb-3 text-right">Unit Price</th>
                      <th className="pb-3 text-center">Qty</th>
                      <th className="pb-3 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {order.items.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02]">
                        <td className="py-3.5 pr-4">
                          <span className="font-bold text-white uppercase block">{item.productName}</span>
                          <span className="text-[10px] text-white/50">{item.variantName}</span>
                        </td>
                        <td className="py-3.5 pr-4 text-white/60">
                          {item.sku}
                        </td>
                        <td className="py-3.5 pr-4 text-right text-white/80">
                          ₹{item.unitPrice}
                        </td>
                        <td className="py-3.5 pr-4 text-center text-white font-bold">
                          {item.quantity}
                        </td>
                        <td className="py-3.5 text-right font-bold text-white">
                          ₹{item.totalPrice}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <div className="w-full sm:w-72 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal || order.total}</span>
                  </div>

                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-white/60">
                      <span>Discount</span>
                      <span>-₹{order.discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span>{order.shippingAmount === 0 ? 'FREE' : `₹${order.shippingAmount}`}</span>
                  </div>

                  {order.taxAmount > 0 && (
                    <div className="flex justify-between text-white/60">
                      <span>GST Taxes</span>
                      <span>₹{order.taxAmount}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-white text-sm">
                    <span>Grand Total</span>
                    <span>₹{order.total}</span>
                  </div>

                  <div className="pt-1 text-[11px] text-white/50">
                    <span>Payment Method: </span>
                    <span className="font-bold text-white uppercase">
                      {order.payments?.[0]?.method || 'PREPAID'}
                    </span>
                    {order.payments?.[0]?.transactionId && (
                      <span className="block text-[10px] text-white/40 truncate">
                        TXN: {order.payments[0].transactionId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Audit Log Timeline ─── */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-lg space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Audit & Status Timeline
                </h3>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {order.statusHistory.map((hist) => (
                    <div
                      key={hist.id}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <span className="font-bold text-white uppercase">{hist.status}</span>
                        <p className="text-[10px] text-white/50">{hist.note || 'Status updated'}</p>
                      </div>
                      <span className="text-[10px] text-white/40">
                        {new Date(hist.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayoutShell>
  );
}
