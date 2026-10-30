"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Truck,
  ShoppingBag,
  ArrowRight,
  Eye,
  FileText,
} from "lucide-react";
import { Order, OrderStatus } from "@/lib/profileApi";
import {
  fetchOrdersThunk,
  selectProfileOrders,
  selectOrdersLoading,
} from "@/store/slices/profileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import OrderDetailsModal from "./OrderDetailsModal";
import { TaxInvoiceModal } from "@/components/invoice/TaxInvoiceModal";

interface ProfileOrdersTabProps {
  accentColor?: string;
  onNotify?: (msg: string) => void;
}

type FilterType = "ALL" | "ACTIVE" | "DELIVERED" | "CANCELLED";

export default function ProfileOrdersTab({
  accentColor = "#ffffff",
  onNotify,
}: ProfileOrdersTabProps) {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectProfileOrders);
  const loading = useAppSelector(selectOrdersLoading);

  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOrdersThunk());
  }, [dispatch]);

  function handleViewDetails(order: Order) {
    setSelectedOrder(order);
    setIsModalOpen(true);
  }

  function handleOrderUpdated(updated: Order) {
    setSelectedOrder(updated);
    if (onNotify) onNotify(`Order ${updated.orderNumber} updated.`);
  }

  function formatDate(iso?: string): string {
    if (!iso) return "Recently";
    try {
      return new Date(iso).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
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

  const filteredOrders = orders.filter((o) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "ACTIVE") return ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED"].includes(o.status);
    if (activeFilter === "DELIVERED") return o.status === "DELIVERED";
    if (activeFilter === "CANCELLED") return ["CANCELLED", "REFUNDED"].includes(o.status);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight uppercase text-white">
            Order Dossier
          </h2>
          <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/50 mt-1">
            Allocated Energy Drinks Shipments & Live Dispatch Logs
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none]">
          {(["ALL", "ACTIVE", "DELIVERED", "CANCELLED"] as FilterType[]).map((f) => {
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setActiveFilter(f);
                }}
                className={`rounded-full px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-wider transition-all cursor-pointer ${isActive
                    ? "bg-white text-black font-bold shadow-md"
                    : "border border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08]"
                  }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl border border-white/10 bg-white/[0.02] animate-pulse p-5 space-y-3"
            >
              <div className="h-5 w-48 bg-white/10 rounded" />
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-8 w-32 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-10 sm:p-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-white/40 mb-3">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h3 className="font-display text-lg font-bold uppercase text-white">
            No Allocations Found
          </h3>
          <p className="font-sans text-xs text-white/50 max-w-sm mt-1 mb-5">
            {activeFilter === "ALL"
              ? "You haven't ordered any Rebelive energy supplies yet. Explore our cold-pressed and botanical lineup."
              : `No orders matching filter "${activeFilter}".`}
          </p>
          <Link
            href="/shop"
            className="flex items-center gap-2 rounded-full px-6 py-2.5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all hover:scale-105 shadow-lg"
          >
            <span>Explore Fuel Catalog</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            const totalItemsCount = order.items.reduce((acc, it) => acc + it.quantity, 0);

            return (
              <div
                key={order.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 transition-all hover:border-white/20 hover:bg-white/[0.04] shadow-sm"
              >
                {/* Top Row: Order Number + Status Badge + Date */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 text-white">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-display text-sm sm:text-base font-bold tracking-tight uppercase text-white">
                        {order.orderNumber}
                      </span>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-white/40 mt-0.5">
                        Ordered on {formatDate(order.createdAt)} · {totalItemsCount} Unit{totalItemsCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full font-mono text-[9.5px] font-bold tracking-wider uppercase border ${badge.bg} ${badge.border} ${badge.color}`}
                    >
                      {badge.text}
                    </span>
                  </div>
                </div>

                {/* Items Thumbnails Row */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    {order.items.slice(0, 3).map((item) => {
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
                          className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/40 px-3 py-2"
                        >
                          <div className="relative h-9 w-9 rounded-lg bg-black/80 overflow-hidden shrink-0 border border-white/10">
                            <Image
                              src={imgUrl}
                              alt={item.productName}
                              fill
                              sizes="36px"
                              className="object-contain p-0.5"
                            />
                          </div>
                          <div className="max-w-[140px] truncate">
                            <p className="font-display text-[11px] font-bold uppercase truncate text-white">
                              {item.productName}
                            </p>
                            <p className="font-mono text-[8.5px] text-white/50">
                              Qty: {item.quantity} · ₹{item.unitPrice}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {order.items.length > 3 && (
                      <span className="font-mono text-[10px] text-white/50">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Order Total Price */}
                  <div className="text-left sm:text-right shrink-0">
                    <p className="font-mono text-[8.5px] uppercase tracking-widest text-white/40">
                      Total Allocated
                    </p>
                    <p className="font-mono text-base sm:text-lg font-bold text-white mt-0.5">
                      ₹{order.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs">
                  {order.trackingNumber ? (
                    <Link
                      href={`/track-order?id=${order.orderNumber}`}
                      className="flex items-center gap-1.5 font-mono text-[9.5px] text-white/80 hover:text-white hover:underline transition-all"
                      title="Track Live on Shiprocket"
                    >
                      <Truck className="h-3.5 w-3.5 shrink-0" />
                      <span>{order.trackingNumber}</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/track-order?id=${order.orderNumber}`}
                      className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-white/40 hover:text-white transition-colors"
                    >
                      <Truck className="h-3 w-3 shrink-0" />
                      <span>Track Shipment</span>
                    </Link>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInvoiceOrder(order)}
                      className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white hover:bg-white/15 transition-all cursor-pointer"
                      title="View & Print Official Tax Invoice"
                    >
                      <FileText className="h-3 w-3" />
                      <span>Invoice</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleViewDetails(order)}
                      className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white hover:bg-white/15 transition-all cursor-pointer"
                    >
                      <Eye className="h-3 w-3" />
                      <span>View Details</span>
                    </button>

                    <Link
                      href="/shop"
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <ShoppingBag className="h-3 w-3" />
                      <span className="hidden sm:inline">Order Again</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOrderUpdated={handleOrderUpdated}
        accentColor={accentColor}
      />

      {/* Tax Invoice Modal */}
      <TaxInvoiceModal
        order={invoiceOrder}
        isOpen={Boolean(invoiceOrder)}
        onClose={() => setInvoiceOrder(null)}
      />
    </div>
  );
}
