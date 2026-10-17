'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  Eye,
  AlertCircle,
  Copy,
  Check,
  Send,
  X,
  MapPin,
  Calendar,
  CreditCard,
  User,
} from 'lucide-react';
import {
  fetchAdminOrders,
  updateOrderStatus,
  dispatchOrderToShiprocket,
  syncAllOrdersToShiprocket,
  trackOrderShiprocket,
  AdminOrder,
} from '@/lib/adminApi';
import { showAdminToast } from '@/components/root/AdminToaster';

const MONO = "'JetBrains Mono', monospace";

export function RootOrdersTab() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [trackingModalData, setTrackingModalData] = useState<any | null>(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);
  const [dispatchingOrderId, setDispatchingOrderId] = useState<string | null>(null);

  const [copiedAwb, setCopiedAwb] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const handleSyncAllShiprocket = async () => {
    setIsSyncingAll(true);
    try {
      const res = await syncAllOrdersToShiprocket();
      showAdminToast(
        res.message || `Processed ${res.syncedCount} orders to Shiprocket`,
        'success',
        'Shiprocket Sync'
      );
      setActionSuccessMsg(`Processed ${res.syncedCount} orders to Shiprocket`);
      setTimeout(() => setActionSuccessMsg(''), 4000);
      await loadOrders();
    } catch (err: any) {
      showAdminToast(
        err.message || 'Failed to sync orders to Shiprocket',
        'error',
        'Sync Failed'
      );
    } finally {
      setIsSyncingAll(false);
    }
  };

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminOrders({
        status: statusFilter,
        search: searchQuery || undefined,
      });
      setOrders(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  // Status Updater
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o)));
      setActionSuccessMsg(`Order status updated to ${newStatus}`);
      showAdminToast(`Order status updated to ${newStatus}`, 'success', 'Order Updated');
      setTimeout(() => setActionSuccessMsg(''), 3000);
    } catch (err: any) {
      showAdminToast(err.message || 'Failed to update order status', 'error', 'Update Failed');
    }
  };

  // Dispatch to Shiprocket
  const handleDispatchShiprocket = async (orderId: string) => {
    setDispatchingOrderId(orderId);
    try {
      const res = await dispatchOrderToShiprocket(orderId);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: 'SHIPPED',
                trackingNumber: res.awbCode,
                shiprocketOrderId: res.order.shiprocketOrderId,
              }
            : o
        )
      );
      setActionSuccessMsg(`Shiprocket consignment created! AWB assigned: ${res.awbCode}`);
      showAdminToast(`Consignment created! AWB: ${res.awbCode}`, 'success', 'Shipment Dispatched');
      setTimeout(() => setActionSuccessMsg(''), 3000);
    } catch (err: any) {
      showAdminToast(err.message || 'Failed to dispatch order to Shiprocket', 'error', 'Dispatch Error');
    } finally {
      setDispatchingOrderId(null);
    }
  };

  // Live Track on Shiprocket
  const handleOpenLiveTracking = async (order: AdminOrder) => {
    setIsTrackingLoading(true);
    setTrackingModalData({ orderNumber: order.orderNumber, trackingNumber: order.trackingNumber });
    try {
      const tracking = await trackOrderShiprocket(order.id);
      setTrackingModalData(tracking);
    } catch (err) {
      console.error('Tracking query error:', err);
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAwb(text);
    showAdminToast(`AWB ${text} copied to clipboard`, 'info', 'Copied');
    setTimeout(() => setCopiedAwb(null), 2000);
  };

  const STATUS_PILLS = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Controls: Search, Filter, Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Order Number, Customer, AWB..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 font-mono"
          />
        </form>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncAllShiprocket}
            disabled={isSyncingAll || isLoading}
            className="px-3.5 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
            title="Post all pending orders to Shiprocket dashboard"
          >
            <Send className={`w-3.5 h-3.5 text-black ${isSyncingAll ? 'animate-spin' : ''}`} />
            <span>{isSyncingAll ? 'Syncing with Shiprocket...' : 'Post All to Shiprocket'}</span>
          </button>

          <button
            onClick={loadOrders}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-white/10 bg-[#0f0f0f] hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {STATUS_PILLS.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl uppercase font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer shrink-0 border ${
              statusFilter === st
                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                : 'bg-white/[0.03] text-white/60 border-white/10 hover:border-white/20'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Success Notification */}
      {actionSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Orders Table Container */}
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/10 text-[10px] font-mono text-white/50 uppercase tracking-widest">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">ORDER & DATE</th>
                <th className="py-3.5 px-4">CUSTOMER</th>
                <th className="py-3.5 px-4">ITEMS</th>
                <th className="py-3.5 px-4">TOTAL</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4">SHIPROCKET DISPATCH</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-white/40 font-mono">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-white/30" />
                    <span>Loading Orders from Database...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-white/40 font-mono">
                    <Package className="w-6 h-6 mx-auto mb-2 opacity-30" />
                    <span>No orders found matching the filter.</span>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isShipped = order.status === 'SHIPPED' || Boolean(order.trackingNumber);
                  const isPending = order.status === 'PENDING' || order.status === 'PROCESSING' || order.status === 'CONFIRMED';

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Order Number & Date */}
                      <td className="py-4 px-4 sm:px-6 font-mono">
                        <Link
                          href={`/root/orders/${order.id}`}
                          className="font-bold text-white text-xs block hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                        <span className="text-[10px] text-white/40">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-white block truncate max-w-[150px]">
                          {order.user ? `${order.user.firstName} ${order.user.lastName}`.trim() : 'Guest'}
                        </span>
                        <span className="text-[10px] text-white/50 truncate block max-w-[150px] font-mono">
                          {order.user?.email || 'N/A'}
                        </span>
                        <span className="text-[9px] text-white/40 truncate block max-w-[150px]">
                          {order.shippingAddress?.city || 'India'}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4 font-mono text-[11px]">
                        <span className="text-white block font-medium">
                          {order.items.reduce((acc, i) => acc + i.quantity, 0)} Units
                        </span>
                        <span className="text-[10px] text-white/40 truncate block max-w-[140px]">
                          {order.items[0]?.productName || 'REBELIVE'}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4 font-mono">
                        <span className="font-bold text-white block">
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-white/50 block">
                          {order.payments?.[0]?.method || 'PREPAID'}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase border border-white/20 bg-white/10 text-white cursor-pointer focus:outline-none"
                        >
                          <option value="PENDING" className="bg-[#111] text-white">PENDING</option>
                          <option value="CONFIRMED" className="bg-[#111] text-white">CONFIRMED</option>
                          <option value="PROCESSING" className="bg-[#111] text-white">PROCESSING</option>
                          <option value="SHIPPED" className="bg-[#111] text-white">SHIPPED</option>
                          <option value="DELIVERED" className="bg-[#111] text-white">DELIVERED</option>
                          <option value="CANCELLED" className="bg-[#111] text-white">CANCELLED</option>
                        </select>
                      </td>

                      {/* Shiprocket Dispatch / Tracking */}
                      <td className="py-4 px-4">
                        {order.shiprocketOrderId ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-mono text-[10px] text-white font-bold">
                              <span>{order.trackingNumber || 'Manifested'}</span>
                              {order.trackingNumber && (
                                <button
                                  onClick={() => copyToClipboard(order.trackingNumber!)}
                                  className="p-0.5 hover:text-white transition-colors cursor-pointer"
                                  title="Copy AWB"
                                >
                                  {copiedAwb === order.trackingNumber ? (
                                    <Check className="w-3 h-3 text-white" />
                                  ) : (
                                    <Copy className="w-3 h-3 text-white/50" />
                                  )}
                                </button>
                              )}
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white font-mono border border-white/15">
                                SR #{order.shiprocketOrderId}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-mono">
                              <button
                                onClick={() => handleOpenLiveTracking(order)}
                                className="text-white/60 hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Truck className="w-3 h-3" /> Live Carrier Scan
                              </button>
                              <button
                                onClick={() => handleDispatchShiprocket(order.id)}
                                disabled={dispatchingOrderId === order.id}
                                className="text-white/40 hover:text-white hover:underline flex items-center gap-0.5 cursor-pointer disabled:opacity-50"
                                title="Re-post or refresh consignment in Shiprocket"
                              >
                                <RefreshCw className={`w-2.5 h-2.5 ${dispatchingOrderId === order.id ? 'animate-spin' : ''}`} />
                                <span>Re-sync</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <button
                              onClick={() => handleDispatchShiprocket(order.id)}
                              disabled={dispatchingOrderId === order.id}
                              className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 font-mono text-[10px] uppercase tracking-wider font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                              title="Post this order directly to Shiprocket dashboard"
                            >
                              {dispatchingOrderId === order.id ? (
                                <>
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                  <span>Posting to SR...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3 h-3 text-black" />
                                  <span>Post to Shiprocket</span>
                                </>
                              )}
                            </button>
                            {order.trackingNumber && (
                              <span className="text-[9px] text-white/40 font-mono block">
                                Temp Ref: {order.trackingNumber}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <Link
                          href={`/root/orders/${order.id}`}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px]"
                          title="View Order Dossier in Separate Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Details</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: Order Details Dossier ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#0e0e0e] border border-white/15 rounded-3xl p-6 sm:p-7 text-white max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                  ORDER DOSSIER
                </span>
                <h3 className="text-xl font-bold font-mono uppercase text-white">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs">
              <div>
                <span className="text-[10px] text-white/40 uppercase font-mono block">Current Status</span>
                <span className="font-bold text-white uppercase font-mono">{selectedOrder.status}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 uppercase font-mono block">Total Paid</span>
                <span className="font-bold text-white font-mono">₹{selectedOrder.total}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 uppercase font-mono block">Shiprocket AWB</span>
                <span className="font-bold text-white font-mono">{selectedOrder.trackingNumber || 'Unassigned'}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 uppercase font-mono block">Placed At</span>
                <span className="font-semibold text-white/80 font-mono text-[11px]">
                  {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider block flex items-center gap-1">
                  <User className="w-3 h-3 text-white/70" /> Customer Information
                </span>
                <p className="font-bold text-white">
                  {selectedOrder.user ? `${selectedOrder.user.firstName} ${selectedOrder.user.lastName}` : 'Guest User'}
                </p>
                <p className="text-white/60 font-mono">{selectedOrder.user?.email || 'N/A'}</p>
                <p className="text-white/60 font-mono">{selectedOrder.user?.phone || 'No phone provided'}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-white/70" /> Delivery Address
                </span>
                {selectedOrder.shippingAddress ? (
                  <>
                    <p className="text-white font-medium">{selectedOrder.shippingAddress.line1}</p>
                    {selectedOrder.shippingAddress.line2 && (
                      <p className="text-white/60">{selectedOrder.shippingAddress.line2}</p>
                    )}
                    <p className="text-white/70 font-mono">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{' '}
                      {selectedOrder.shippingAddress.postalCode}
                    </p>
                  </>
                ) : (
                  <p className="text-white/40">Standard Pan-India Express Address</p>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block">
                CONSIGNMENT CRATE ITEMS
              </span>
              <div className="divide-y divide-white/5 border border-white/10 rounded-xl bg-white/[0.02]">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-white uppercase">{item.productName}</h4>
                      <p className="text-[10px] text-white/50 font-mono">
                        {item.variantName} · SKU: {item.sku}
                      </p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-white block">
                        ₹{item.totalPrice}
                      </span>
                      <span className="text-[10px] text-white/40">
                        {item.quantity}x @ ₹{item.unitPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History */}
            {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block">
                  AUDIT & DISPATCH TIMELINE
                </span>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {selectedOrder.statusHistory.map((hist) => (
                    <div key={hist.id} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-white uppercase">{hist.status}</span>
                        <p className="text-[10px] text-white/50">{hist.note || 'Status updated'}</p>
                      </div>
                      <span className="text-[10px] font-mono text-white/40">
                        {new Date(hist.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions in Dossier */}
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              {selectedOrder.trackingNumber ? (
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    handleOpenLiveTracking(selectedOrder);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer font-bold border border-white/20"
                >
                  <Truck className="w-4 h-4" />
                  <span>Inspect Shiprocket Scans</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleDispatchShiprocket(selectedOrder.id);
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-mono text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer font-bold border border-white"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch Now to Shiprocket</span>
                </button>
              )}

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Live Shiprocket Tracking ── */}
      {trackingModalData && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl bg-[#0e0e0e] border border-white/15 rounded-3xl p-6 sm:p-7 text-white max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block">
                    LIVE SHIPROCKET COURIER SCAN
                  </span>
                  <h3 className="text-base font-bold font-mono text-white">
                    AWB: {trackingModalData.trackingNumber || 'Tracking...'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setTrackingModalData(null)}
                className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isTrackingLoading ? (
              <div className="py-12 text-center text-white/40 font-mono space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-white" />
                <p>Querying Shiprocket External Courier Network...</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase font-mono block">Courier Fleet</span>
                    <span className="font-bold text-white">{trackingModalData.courierName || 'Shiprocket Express'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-white/40 uppercase font-mono block">Status</span>
                    <span className="font-bold text-white uppercase font-mono">
                      {trackingModalData.statusText || 'In Transit'}
                    </span>
                  </div>
                </div>

                {/* Scans Log */}
                <div className="space-y-3">
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block">
                    TRANSIT MILESTONES
                  </span>
                  <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                    {(trackingModalData.activities || []).map((scan: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 relative text-xs">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                            idx === 0
                              ? 'bg-white text-black font-bold'
                              : 'bg-[#141414] border border-white/20 text-white/50'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 bg-white/[0.02] border border-white/5 p-2.5 rounded-lg space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white uppercase">{scan.status}</span>
                            <span className="text-[10px] font-mono text-white/40">{scan.date}</span>
                          </div>
                          <p className="text-white/70 text-[11px]">{scan.activity}</p>
                          {scan.location && (
                            <p className="text-[10px] text-white/50 font-mono">{scan.location}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <a
                    href={`/track-order?id=${trackingModalData.trackingNumber || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-white/60 hover:text-white underline inline-flex items-center gap-1"
                  >
                    <span>Open customer tracking view</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
