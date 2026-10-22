"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  CheckCircle2,
  Trash2,
  Edit2,
  Phone,
  User,
  X,
  Loader2,
  ShieldCheck,
  Building,
} from "lucide-react";
import { Address, CreateAddressInput } from "@/lib/profileApi";
import {
  fetchAddressesThunk,
  createAddressThunk,
  updateAddressThunk,
  deleteAddressThunk,
  setDefaultAddressThunk,
  selectProfileAddresses,
  selectAddressesLoading,
} from "@/store/slices/profileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { AuthUser } from "@/store/slices/authslice";

const MONO = "JetBrains Mono, Courier New, monospace";
const DISPLAY = "'Code Next', Anton, 'Arial Narrow', sans-serif";

interface ProfileAddressesTabProps {
  user?: AuthUser | null;
  accentColor?: string;
  onNotify?: (msg: string) => void;
}

export default function ProfileAddressesTab({
  user,
  accentColor = "#ffffff",
  onNotify,
}: ProfileAddressesTabProps) {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectProfileAddresses);
  const loading = useAppSelector(selectAddressesLoading);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [label, setLabel] = useState("Home");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    dispatch(fetchAddressesThunk());
  }, [dispatch]);

  function resetForm() {
    setLabel("Home");
    setName(user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "");
    setPhone(user?.phone || "");
    setLine1("");
    setLine2("");
    setCity("");
    setState("");
    setPostalCode("");
    setCountry("India");
    setIsDefault(addresses.length === 0);
    setEditingAddress(null);
    setFormError(null);
  }

  function handleOpenAddModal() {
    resetForm();
    setIsModalOpen(true);
  }

  function handleOpenEditModal(addr: Address) {
    setEditingAddress(addr);
    setLabel(addr.label || "Home");
    setName(addr.name || (user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : ""));
    setPhone(addr.phone || user?.phone || "");
    setLine1(addr.line1 || "");
    setLine2(addr.line2 || "");
    setCity(addr.city || "");
    setState(addr.state || "");
    setPostalCode(addr.postalCode || "");
    setCountry(addr.country || "India");
    setIsDefault(addr.isDefault || false);
    setFormError(null);
    setIsModalOpen(true);
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!line1.trim()) {
      setFormError("Street Address Line 1 is required.");
      return;
    }
    if (!city.trim()) {
      setFormError("City is required.");
      return;
    }
    if (!state.trim()) {
      setFormError("State is required.");
      return;
    }
    const cleanPin = postalCode.replace(/\D/g, "");
    if (cleanPin.length < 5) {
      setFormError("A valid 6-digit postal code is required.");
      return;
    }

    setFormSubmitting(true);
    try {
      const payload: CreateAddressInput = {
        label: label.trim() || "Delivery Address",
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        line1: line1.trim(),
        line2: line2.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        postalCode: cleanPin,
        country: country.trim() || "India",
        isDefault,
      };

      if (editingAddress) {
        await dispatch(updateAddressThunk({ id: editingAddress.id, input: payload })).unwrap();
        if (onNotify) onNotify("Delivery address updated successfully.");
      } else {
        await dispatch(createAddressThunk(payload)).unwrap();
        if (onNotify) onNotify("New delivery address saved.");
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setFormError(err || "Failed to save address.");
    } finally {
      setFormSubmitting(false);
    }
  }

  async function handleSetDefault(id: string) {
    setSettingDefaultId(id);
    try {
      await dispatch(setDefaultAddressThunk(id)).unwrap();
      if (onNotify) onNotify("Default shipping address updated.");
    } catch (err: any) {
      if (onNotify) onNotify(err || "Failed to update default address.");
    } finally {
      setSettingDefaultId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to remove this delivery address?")) return;
    setDeletingId(id);
    try {
      await dispatch(deleteAddressThunk(id)).unwrap();
      if (onNotify) onNotify("Address removed.");
    } catch (err: any) {
      if (onNotify) onNotify(err || "Failed to remove address.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Top Header Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2
            className="text-2xl font-bold tracking-tight uppercase text-white"
            style={{ fontFamily: DISPLAY }}
          >
            SAVED DELIVERY ADDRESSES
          </h2>
          <p className="font-mono text-xs text-white/50 mt-1">
            Addresses from your orders and Fastrr 1-Click checkout are saved here for instant re-orders.
          </p>
        </div>

        <button
          type="button"
          id="btn-add-new-address"
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-white text-black hover:bg-neutral-200 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-white/5 hover:scale-[1.02] cursor-pointer shrink-0"
          style={{ fontFamily: MONO }}
        >
          <Plus className="h-4 w-4" />
          <span>Add Address</span>
        </button>
      </div>

      {/* ── Loading Skeleton ── */}
      {loading && addresses.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3 animate-pulse"
            >
              <div className="h-4 w-28 bg-white/10 rounded" />
              <div className="h-5 w-48 bg-white/15 rounded" />
              <div className="h-4 w-full bg-white/10 rounded" />
              <div className="h-4 w-2/3 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && addresses.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/60">
            <MapPin className="h-8 w-8" />
          </div>
          <div>
            <h3
              className="text-xl font-bold uppercase text-white tracking-tight"
              style={{ fontFamily: DISPLAY }}
            >
              NO SAVED DESTINATIONS FOUND
            </h3>
            <p className="font-mono text-xs text-white/50 max-w-md mx-auto mt-1 leading-relaxed">
              When you place an order with Fastrr or standard checkout, your shipping address will automatically appear here. You can also add one manually now.
            </p>
          </div>
          <button
            type="button"
            id="btn-empty-add-address"
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] hover:bg-white hover:text-black text-white px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer mt-2"
            style={{ fontFamily: MONO }}
          >
            <Plus className="h-4 w-4" />
            <span>Add Delivery Address</span>
          </button>
        </div>
      )}

      {/* ── Address Cards Grid ── */}
      {addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {addresses.map((addr) => {
            const isDef = Boolean(addr.isDefault);
            const isDeleting = deletingId === addr.id;
            const isSettingDefault = settingDefaultId === addr.id;

            return (
              <div
                key={addr.id}
                id={`address-card-${addr.id}`}
                className={`group relative rounded-2xl border transition-all p-5 sm:p-6 flex flex-col justify-between gap-4 ${isDef
                    ? "border-white/30 bg-white/[0.05] shadow-[0_4px_30px_rgba(255,255,255,0.04)] ring-1 ring-white/20"
                    : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
                  }`}
              >
                {/* Header row with Label & Default badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/15 bg-white/[0.05] text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                      <Building className="h-3 w-3 text-white/60" />
                      <span>{addr.label || (isDef ? "Default Shipping" : "Delivery Address")}</span>
                    </span>

                    {isDef && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[9px] font-bold uppercase tracking-wider">
                        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                        <span>DEFAULT</span>
                      </span>
                    )}
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Edit Address"
                      onClick={() => handleOpenEditModal(addr)}
                      className="p-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/15 text-white/60 hover:text-white transition-all cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Delete Address"
                      disabled={isDeleting}
                      onClick={() => handleDelete(addr.id)}
                      className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/[0.05] hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all cursor-pointer disabled:opacity-40"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Recipient Details & Street Address */}
                <div className="space-y-2">
                  {addr.name && (
                    <p className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <User className="h-3 w-3 text-white/40" />
                      <span>{addr.name}</span>
                    </p>
                  )}

                  <div className="font-sans text-xs sm:text-sm text-white/80 leading-relaxed space-y-0.5">
                    <p className="font-medium text-white">{addr.line1}</p>
                    {addr.line2 && <p className="text-white/60">{addr.line2}</p>}
                    <p className="font-mono text-xs text-white/70 pt-1">
                      {addr.city}, {addr.state} -{" "}
                      <strong className="text-white font-bold">{addr.postalCode}</strong>
                    </p>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
                      {addr.country || "India"}
                    </p>
                  </div>

                  {addr.phone && (
                    <div className="pt-1 flex items-center gap-1.5 font-mono text-[11px] text-white/60">
                      <Phone className="h-3 w-3 text-white/40" />
                      <span>+91 {addr.phone}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Footer: Set as Default button */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  {!isDef ? (
                    <button
                      type="button"
                      disabled={isSettingDefault}
                      onClick={() => handleSetDefault(addr.id)}
                      className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-white/50 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                      style={{ fontFamily: MONO }}
                    >
                      {isSettingDefault ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <ShieldCheck className="h-3 w-3 text-white/40" />
                      )}
                      <span>Set as Default Destination</span>
                    </button>
                  ) : (
                    <span className="font-mono text-[10px] text-emerald-400/80 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Primary Checkout Destination</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Address Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-neutral-950 p-6 sm:p-8 shadow-2xl text-white space-y-6 max-h-[90vh] overflow-y-auto [scrollbar-width:none]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3
                    className="text-lg sm:text-xl font-bold uppercase tracking-tight"
                    style={{ fontFamily: DISPLAY }}
                  >
                    {editingAddress ? "EDIT DELIVERY ADDRESS" : "ADD DELIVERY ADDRESS"}
                  </h3>
                  <p className="font-mono text-[10px] text-white/50">
                    Precision logistics destination for cold-dispatch consignments
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/20 text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 font-mono text-xs text-red-300">
                {formError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Label Selection Buttons */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                  Address Label
                </label>
                <div className="flex items-center gap-2">
                  {["Home", "Work", "Other"].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setLabel(lbl)}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${label === lbl
                          ? "bg-white text-black font-bold ring-1 ring-white"
                          : "border border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.07]"
                        }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 font-mono text-xs text-white placeholder:text-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                    Mobile Phone (10 digits)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 font-mono text-xs text-white placeholder:text-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>
              </div>

              {/* Address Line 1 */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                  Flat / House / Building / Street Line 1 *
                </label>
                <input
                  type="text"
                  required
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  placeholder="e.g. Flat 402, Apex Tower, High Street"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 font-sans text-xs text-white placeholder:text-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/40"
                />
              </div>

              {/* Address Line 2 */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                  Area / Sector / Landmark (Line 2 - Optional)
                </label>
                <input
                  type="text"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  placeholder="e.g. Near City Center Mall"
                  className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 font-sans text-xs text-white placeholder:text-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/40"
                />
              </div>

              {/* City, State, Postal Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Amritsar"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 font-mono text-xs text-white placeholder:text-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Punjab"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 font-mono text-xs text-white placeholder:text-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-white/50">
                    PIN Code (6 digits) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="e.g. 143001"
                    className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-3.5 py-2.5 font-mono text-xs text-white placeholder:text-white/30 focus:border-white focus:outline-none focus:ring-1 focus:ring-white/40"
                  />
                </div>
              </div>

              {/* Country & Default Checkbox */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/10 text-white focus:ring-0 focus:ring-offset-0 cursor-pointer accent-white"
                  />
                  <span className="font-mono text-xs text-white/80">
                    Set as default delivery address
                  </span>
                </label>

                <p className="font-mono text-[10px] text-white/40 uppercase">
                  Country: <strong className="text-white">India (Domestic)</strong>
                </p>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/10 font-mono text-xs text-white/70 hover:text-white uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-white/10 cursor-pointer disabled:opacity-50"
                >
                  {formSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingAddress ? "Update Destination" : "Save Address"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
