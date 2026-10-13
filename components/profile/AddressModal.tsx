"use client";

import React, { useState, useEffect } from "react";
import { X, MapPin, Building, Home, Briefcase, Compass, Check, AlertCircle } from "lucide-react";
import { Address, CreateAddressInput, createAddress, updateAddress } from "@/lib/profileApi";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (address: Address) => void;
  addressToEdit?: Address | null;
  accentColor?: string;
}

const PRESET_LABELS = [
  { name: "Home", icon: Home },
  { name: "Office", icon: Briefcase },
  { name: "Bunker HQ", icon: Building },
  { name: "Field Ops", icon: Compass },
];

export default function AddressModal({
  isOpen,
  onClose,
  onSuccess,
  addressToEdit,
  accentColor = "#ffffff",
}: AddressModalProps) {
  const [label, setLabel] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("IN");
  const [isDefault, setIsDefault] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (addressToEdit) {
      setLabel(addressToEdit.label || "Home");
      setLine1(addressToEdit.line1 || "");
      setLine2(addressToEdit.line2 || "");
      setCity(addressToEdit.city || "");
      setState(addressToEdit.state || "");
      setPostalCode(addressToEdit.postalCode || "");
      setCountry(addressToEdit.country || "IN");
      setIsDefault(addressToEdit.isDefault || false);
    } else {
      setLabel("Home");
      setLine1("");
      setLine2("");
      setCity("");
      setState("");
      setPostalCode("");
      setCountry("IN");
      setIsDefault(false);
    }
    setError(null);
  }, [addressToEdit, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!line1.trim()) {
      setError("Street address is required.");
      return;
    }
    if (!city.trim()) {
      setError("City is required.");
      return;
    }
    if (!state.trim()) {
      setError("State / Province is required.");
      return;
    }
    if (!postalCode.trim()) {
      setError("Postal / PIN code is required.");
      return;
    }

    setLoading(true);
    try {
      const payload: CreateAddressInput = {
        label: label.trim() || "Saved Location",
        line1: line1.trim(),
        line2: line2.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim() || "IN",
        isDefault,
      };

      let result: Address;
      if (addressToEdit) {
        result = await updateAddress(addressToEdit.id, payload);
      } else {
        result = await createAddress(payload);
      }

      onSuccess(result);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save address.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

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
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-white/15 bg-[#0a0a0c] text-white shadow-2xl backdrop-blur-2xl z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-white">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold tracking-tight uppercase">
                {addressToEdit ? "Edit Delivery Address" : "Add Delivery Address"}
              </h3>
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/50">
                Logistics & Dispatch Coordination
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

        {/* Error Alert */}
        {error && (
          <div className="mx-5 mt-4 flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] p-3 text-xs text-white/90">
            <AlertCircle className="h-4 w-4 shrink-0 text-white" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 [scrollbar-width:thin]">
          {/* Label selector */}
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 mb-2">
              Address Label / Preset
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_LABELS.map((preset) => {
                const Icon = preset.icon;
                const isSelected = label.toLowerCase() === preset.name.toLowerCase();
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setLabel(preset.name);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      isSelected
                        ? "border-white bg-white text-black font-bold shadow-md"
                        : "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{preset.name}</span>
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Or enter custom label (e.g. Vacation Villa)"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 font-sans text-xs text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
            />
          </div>

          {/* Street Address Line 1 */}
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 mb-1.5">
              Street Address / Flat / Floor <span className="text-white/40">*</span>
            </label>
            <input
              type="text"
              required
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              placeholder="e.g. 402 High-Altitude Apex Tower, Floor 14"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 font-sans text-xs text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
            />
          </div>

          {/* Line 2 (Optional) */}
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 mb-1.5">
              Apartment / Suite / Landmark <span className="text-white/40">(Optional)</span>
            </label>
            <input
              type="text"
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              placeholder="e.g. Near Outer Ring Road, Cyber Gateway"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 font-sans text-xs text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
            />
          </div>

          {/* City & State Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 mb-1.5">
                City <span className="text-white/40">*</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bengaluru"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 font-sans text-xs text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 mb-1.5">
                State <span className="text-white/40">*</span>
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Karnataka"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 font-sans text-xs text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
              />
            </div>
          </div>

          {/* Postal Code & Country */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 mb-1.5">
                Postal / PIN Code <span className="text-white/40">*</span>
              </label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="e.g. 560001"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 font-sans text-xs text-white placeholder-white/30 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
              />
            </div>
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 mb-1.5">
                Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#16161c] px-3 py-2.5 font-sans text-xs text-white focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40 cursor-pointer"
              >
                <option value="IN">India (IN)</option>
                <option value="US">United States (US)</option>
                <option value="UK">United Kingdom (UK)</option>
                <option value="UAE">United Arab Emirates (UAE)</option>
                <option value="SG">Singapore (SG)</option>
              </select>
            </div>
          </div>

          {/* Default Address Checkbox */}
          <label className="flex items-center gap-3 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/10 text-white focus:ring-white accent-white cursor-pointer"
            />
            <span className="font-mono text-xs text-white/80">
              Set as primary dispatch address
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                onClose();
              }}
              disabled={loading}
              className="rounded-full border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-full px-5 py-2 font-mono text-[10.5px] font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg"
            >
              {loading ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              <span>{addressToEdit ? "Update Address" : "Save Address"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
