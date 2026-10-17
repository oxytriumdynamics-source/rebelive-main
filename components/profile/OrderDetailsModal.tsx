"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  ExternalLink,
  MapPin,
  CreditCard,
  Ban,
  ShieldAlert,
} from "lucide-react";
import { Order, OrderStatus } from "@/lib/profileApi";
import { cancelOrderThunk } from "@/store/slices/profileSlice";
import { useAppDispatch } from "@/store/hooks";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated?: (updatedOrder: Order) => void;
  accentColor?: string;
}

const STATUS_STEPS: OrderStatus[] = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onOrderUpdated,
  accentColor = "#ffffff",
}: OrderDetailsModalProps) {
  const dispatch = useAppDispatch();
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState<string | null>(null);

  if (!isOpen || !order) return null;

  const isCancelled = order.status === "CANCELLED";
  const canCancel = ["PENDING", "CONFIRMED"].includes(order.status) && !isCancelled;

  // Determine timeline progress
  const currentStatusIndex = isCancelled
    ? -1
    : STATUS_STEPS.indexOf(order.status === "PENDING" ? "CONFIRMED" : order.status);

  async function handleCancelOrder() {
    if (!order) return;
    setCancelling(true);
    setCancelError(null);

    try {
      const res = await dispatch(
        cancelOrderThunk({
          orderId: order.id,
          reason: cancelReason.trim() || "Customer requested cancellation",
        })
      ).unwrap();

      if (onOrderUpdated) onOrderUpdated(res || { ...order, status: "CANCELLED" });
      setShowCancelConfirm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel order.";
      setCancelError(msg);
    } finally {
      setCancelling(false);
    }
  }

  function formatDate(iso?: string): string {
    if (!iso) return "Recently";
    try {
      return new Date(iso).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  function getStatusBadge(status: OrderStatus) {
    switch (status) {
      case "DELIVERED":
        return { text: "DELIVERED", bg: "bg-white", border: "border-white", color: "text-black" };
      case "SHIPPED":
        return { text: "IN TRANSIT", bg: "bg-white/20", border: "border-white/40", color: "text-white" };
      case "PROCESSING":
        return { text: "PROCESSING", bg: "bg-white/10", border: "border-white/25", color: "text-white/90" };
      case "CONFIRMED":
      case "PENDING":
        return { text: "CONFIRMED", bg: "bg-white/10", border: "border-white/20", color: "text-white/80" };
      case "CANCELLED":
      case "REFUNDED":
        return { text: status, bg: "bg-white/[0.04]", border: "border-white/10", color: "text-white/40" };
      default:
        return { text: status, bg: "bg-white/10", border: "border-white/20", color: "text-white" };
    }
  }

  const badge = getStatusBadge(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity cursor-pointer animate-in fade-in duration-200"
        onClick={() => {
          onClose();
        }}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-white/15 bg-[#0a0a0c] text-white shadow-2xl backdrop-blur-2xl z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:px-7 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-white">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-display text-lg font-bold tracking-tight uppercase">
                  {order.orderNumber}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold tracking-wider uppercase border ${badge.bg} ${badge.border} ${badge.color}`}
                >
                  {badge.text}
                </span>
              </div>
              <p className="font-mono text-[9.5px] uppercase tracking-wider text-white/50 mt-0.5">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
            }}
            className="rounded-full p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 [scrollbar-width:thin]">
          {/* Status Progression Timeline (if not cancelled) */}
          {!isCancelled ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 mb-3">
                Dispatch Lifecycle
              </p>
              <div className="grid grid-cols-4 gap-2 text-center relative">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  return (
                    <div key={step} className="flex flex-col items-center gap-1.5 relative z-10">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                          isDone
                            ? "bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                            : "bg-white/[0.05] text-white/40 border-white/10"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span className="font-mono text-[10px]">{idx + 1}</span>
                        )}
                      </div>
                      <span
                        className={`font-mono text-[8.5px] uppercase tracking-wider ${
                          isCurrent
                            ? "text-white font-bold"
                            : isDone
                            ? "text-white/80"
                            : "text-white/40"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/[0.04] p-4 text-white/90">
              <Ban className="h-6 w-6 shrink-0 text-white/60" />
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                  Order Cancelled
                </p>
                <p className="font-sans text-[11px] text-white/60 mt-0.5">
                  This allocation was cancelled. Any applicable charges have been credited back.
                </p>
              </div>
            </div>
          )}

          {/* Tracking Number Bar */}
          {order.trackingNumber && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white border border-white/20">
                  <Truck className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-mono text-[8.5px] uppercase tracking-widest text-white/50">
                    Carrier Tracking ID
                  </p>
                  <p className="font-mono text-xs font-bold text-white mt-0.5">
                    {order.trackingNumber}
                  </p>
                </div>
              </div>
              <Link
                href={`/track-order?id=${order.orderNumber}`}
                onClick={onClose}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <span>Track Live on Shiprocket</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          )}

          {/* Ordered Items List */}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 mb-3">
              Allocated Supplies ({order.items.length})
            </p>
            <div className="space-y-2.5">
              {order.items.map((item) => {
                const imgUrl =
                  item.product?.images?.[0]?.url ||
                  (item.productName.toLowerCase().includes("apex")
                    ? "/products/apex.webp"
                    : item.productName.toLowerCase().includes("capella")
                    ? "/products/capella.webp"
                    : "/products/aviva.webp");

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg bg-black/80 border border-white/10 overflow-hidden shrink-0">
                        <Image
                          src={imgUrl}
                          alt={item.productName}
                          fill
                          sizes="48px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <h4 className="font-display text-xs sm:text-sm font-bold uppercase text-white">
                          {item.productName}
                        </h4>
                        <p className="font-mono text-[9.5px] text-white/50 mt-0.5">
                          Qty: {item.quantity} · Unit: ₹{item.unitPrice}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs sm:text-sm font-bold text-white">
                        ₹{(item.quantity * item.unitPrice).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery & Payment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Delivery Address */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 mb-2 text-white/70">
                <MapPin className="h-3.5 w-3.5 text-white" />
                <span className="font-mono text-[9px] uppercase tracking-wider">
                  Delivery Destination
                </span>
              </div>
              {order.shippingAddress ? (
                <div className="font-sans text-xs text-white/80 space-y-0.5">
                  <p className="font-mono text-[10px] text-white font-semibold uppercase">
                    {(order.shippingAddress as any).fullName || (order.shippingAddress as any).shipping_customer_name || (order.shippingAddress as any).billing_customer_name || "Delivery Destination"}
                  </p>
                  <p>{(order.shippingAddress as any).line1 || (order.shippingAddress as any).shipping_address || (order.shippingAddress as any).billing_address}</p>
                  {((order.shippingAddress as any).line2 || (order.shippingAddress as any).shipping_address_2 || (order.shippingAddress as any).billing_address_2) && (
                    <p>{(order.shippingAddress as any).line2 || (order.shippingAddress as any).shipping_address_2 || (order.shippingAddress as any).billing_address_2}</p>
                  )}
                  <p>
                    {(order.shippingAddress as any).city || (order.shippingAddress as any).shipping_city || (order.shippingAddress as any).billing_city},{" "}
                    {(order.shippingAddress as any).state || (order.shippingAddress as any).shipping_state || (order.shippingAddress as any).billing_state} -{" "}
                    {(order.shippingAddress as any).pincode || (order.shippingAddress as any).postalCode || (order.shippingAddress as any).shipping_pincode || (order.shippingAddress as any).billing_pincode}
                  </p>
                  <p className="font-mono text-[9px] text-white/50 uppercase">
                    {(order.shippingAddress as any).country || (order.shippingAddress as any).shipping_country || (order.shippingAddress as any).billing_country || "India"}
                  </p>
                  {(order.shippingAddress as any).billing_address &&
                   (order.shippingAddress as any).billing_address !== (order.shippingAddress as any).line1 &&
                   (order.shippingAddress as any).billing_address !== (order.shippingAddress as any).shipping_address && (
                    <div className="pt-2 border-t border-white/5 mt-1.5 text-[11px] text-white/60">
                      <span className="font-mono text-[9px] text-white/40 uppercase block">Billing Address:</span>
                      <p>
                        {(order.shippingAddress as any).billing_address}
                        {(order.shippingAddress as any).billing_address_2 ? `, ${(order.shippingAddress as any).billing_address_2}` : ''}
                        {(order.shippingAddress as any).billing_city ? `, ${(order.shippingAddress as any).billing_city}` : ''}
                        {(order.shippingAddress as any).billing_pincode ? ` - ${(order.shippingAddress as any).billing_pincode}` : ''}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="font-mono text-xs text-white/50">
                  Standard Shipping Destination
                </p>
              )}
            </div>

            {/* Financial Breakdown */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 mb-2 text-white/70">
                <CreditCard className="h-3.5 w-3.5 text-white" />
                <span className="font-mono text-[9px] uppercase tracking-wider">
                  Payment Summary
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px] text-white/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-white/90">
                    <span>Discount</span>
                    <span>-₹{order.discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST / Tax</span>
                  <span>₹{order.taxAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dispatch Shipping</span>
                  <span>{order.shippingAmount === 0 ? "FREE" : `₹${order.shippingAmount}`}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-white text-xs">
                  <span>Total Amount</span>
                  <span className="text-white">₹{order.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cancel Order Section */}
          {canCancel && !showCancelConfirm && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowCancelConfirm(true);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/[0.04] px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <Ban className="h-3.5 w-3.5" />
                <span>Cancel Order</span>
              </button>
            </div>
          )}

          {/* Cancel Order Confirmation Prompt */}
          {showCancelConfirm && (
            <div className="rounded-xl border border-white/20 bg-white/[0.03] p-4 space-y-3">
              <div className="flex items-center gap-2 text-white">
                <ShieldAlert className="h-4 w-4" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  Confirm Allocation Cancellation
                </span>
              </div>
              <p className="font-sans text-xs text-white/70">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation (optional)"
                className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 font-sans text-xs text-white placeholder-white/30 focus:border-white/40 focus:outline-none"
              />
              {cancelError && (
                <p className="font-mono text-[10px] text-white/90">{cancelError}</p>
              )}
              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={cancelling}
                  className="rounded-lg border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase text-white/70 hover:bg-white/10 cursor-pointer"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="rounded-lg bg-white px-4 py-1.5 font-mono text-[10px] font-bold uppercase text-black hover:bg-neutral-200 disabled:opacity-50 cursor-pointer"
                >
                  {cancelling ? "Cancelling…" : "Yes, Cancel Order"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
