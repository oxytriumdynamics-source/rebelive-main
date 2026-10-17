"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  Briefcase,
  Building,
  MapPin,
  Plus,
  ShieldCheck,
  Edit3,
  Trash2,
} from "lucide-react";
import { Address } from "@/lib/profileApi";
import {
  fetchAddressesThunk,
  deleteAddressThunk,
  setDefaultAddressThunk,
  selectProfileAddresses,
  selectAddressesLoading,
} from "@/store/slices/profileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import AddressModal from "./AddressModal";

interface ProfileAddressesTabProps {
  accentColor?: string;
  onNotify?: (msg: string) => void;
}

export default function ProfileAddressesTab({
  accentColor = "#ffffff",
  onNotify,
}: ProfileAddressesTabProps) {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectProfileAddresses);
  const loading = useAppSelector(selectAddressesLoading);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAddressesThunk());
  }, [dispatch]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this delivery location?")) return;
    setActionLoadingId(id);
    try {
      await dispatch(deleteAddressThunk(id)).unwrap();
      if (onNotify) onNotify("Delivery location removed successfully.");
    } catch (e) {
      console.error("Failed to delete address:", e);
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleSetDefault(address: Address) {
    setActionLoadingId(address.id);
    try {
      await dispatch(setDefaultAddressThunk(address.id)).unwrap();
      if (onNotify) onNotify(`Set "${address.label || 'Address'}" as primary location.`);
    } catch (e) {
      console.error("Failed to set default address:", e);
    } finally {
      setActionLoadingId(null);
    }
  }

  function handleOpenAdd() {
    setEditingAddress(null);
    setIsModalOpen(true);
  }

  function handleOpenEdit(addr: Address) {
    setEditingAddress(addr);
    setIsModalOpen(true);
  }

  function handleModalSuccess(savedAddr: Address) {
    if (editingAddress) {
      if (onNotify) onNotify("Delivery location updated.");
    } else {
      if (onNotify) onNotify("New delivery location added.");
    }
  }

  function getIconForLabel(label?: string | null) {
    const l = (label || "").toLowerCase();
    if (l.includes("home")) return Home;
    if (l.includes("office") || l.includes("work")) return Briefcase;
    if (l.includes("bunker") || l.includes("hq") || l.includes("tower")) return Building;
    return MapPin;
  }

  return (
    <div className="space-y-6">
      {/* Tab Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight uppercase text-white">
            Delivery Locations
          </h2>
          <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-white/50 mt-1">
            Tactical Addresses & Rapid Drop Coordination
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 self-start sm:self-auto rounded-full px-4 py-2.5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl border border-white/10 bg-white/[0.02] animate-pulse p-5 space-y-3"
            >
              <div className="h-5 w-28 bg-white/10 rounded" />
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-3/4 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : addresses.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-white/40 mb-3">
            <MapPin className="h-7 w-7" />
          </div>
          <h3 className="font-display text-lg font-bold uppercase text-white">
            No Addresses Registered
          </h3>
          <p className="font-sans text-xs text-white/50 max-w-sm mt-1 mb-5">
            You don't have any saved shipping addresses yet. Add your preferred delivery bunker for instant crate ordering.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all hover:scale-105 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Delivery Address</span>
          </button>
        </div>
      ) : (
        /* Address Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => {
            const Icon = getIconForLabel(addr.label);
            const isActing = actionLoadingId === addr.id;

            return (
              <div
                key={addr.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                  addr.isDefault
                    ? "border-white/40 bg-white/[0.06] shadow-[0_4px_24px_rgba(255,255,255,0.05)]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
              >
                <div>
                  {/* Top: Icon + Label + Default Badge */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 text-white"
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-display text-sm font-bold tracking-tight uppercase text-white">
                        {addr.label || "Saved Location"}
                      </span>
                    </div>

                    {addr.isDefault ? (
                      <span className="flex items-center gap-1 rounded-full border border-white bg-white px-2.5 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-wider text-black">
                        <ShieldCheck className="h-3 w-3" />
                        DEFAULT
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(addr)}
                        disabled={isActing}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider text-white/50 hover:border-white/40 hover:text-white transition-colors cursor-pointer"
                        title="Make this default"
                      >
                        Set Default
                      </button>
                    )}
                  </div>

                  {/* Address Body */}
                  <div className="space-y-1 font-sans text-xs text-white/80">
                    <p className="font-medium text-white">{addr.line1}</p>
                    {addr.line2 && <p className="text-white/60">{addr.line2}</p>}
                    <p className="text-white/70">
                      {addr.city}, {addr.state} - <span className="font-mono">{addr.postalCode}</span>
                    </p>
                    <p className="font-mono text-[9px] uppercase text-white/40 tracking-wider">
                      {addr.country === "IN" ? "India" : addr.country}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(addr)}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-wider text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    disabled={isActing}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-wider text-white/50 hover:bg-white/15 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Address Edit/Add Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        addressToEdit={editingAddress}
        accentColor={accentColor}
      />
    </div>
  );
}
