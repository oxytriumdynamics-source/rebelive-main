'use client';

import React, { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  Package,
  Layers,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import {
  trackShipmentThunk,
  selectTrackingResult,
  selectShippingLoading,
  selectShippingError,
} from '@/store/slices/shippingSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { showAdminToast } from '@/components/root/AdminToaster';

const MONO = "'JetBrains Mono', monospace";

export function RootShiprocketTab() {
  const dispatch = useAppDispatch();
  const trackingResult = useAppSelector(selectTrackingResult);
  const isSearching = useAppSelector(selectShippingLoading);
  const reduxError = useAppSelector(selectShippingError);

  const [searchAwb, setSearchAwb] = useState('');
  const [searchError, setSearchError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchAwb.trim()) return;

    setSearchError('');
    try {
      const res = await dispatch(trackShipmentThunk(searchAwb.trim())).unwrap();
      showAdminToast(`Tracking located for ${res.orderNumber} (${res.currentStatus})`, 'success', 'Shipment Found');
    } catch (err: any) {
      const errMsg = err || 'Tracking identifier not located.';
      setSearchError(errMsg);
      showAdminToast(errMsg, 'error', 'Lookup Failed');
    }
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-200">
      {/* Shiprocket Gateway Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">
                  SHIPROCKET FASTRR & DISPATCH HUB
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white text-black">
                  CONNECTED
                </span>
              </div>
              <p className="text-xs text-white/60 font-mono mt-0.5">
                oxytriumdynamics@gmail.com · Express Cold Logistics Fleet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/50 font-mono">FASTRR 1-CLICK CHECKOUT: ACTIVE</span>
          </div>
        </div>

        {/* Integration Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
            <span className="text-[9px] font-mono text-white/40 uppercase block">Pickup Location</span>
            <span className="font-bold text-white font-mono text-xs">Primary</span>
            <span className="text-[10px] text-white/60 font-mono block">PIN: 143001</span>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
            <span className="text-[9px] font-mono text-white/40 uppercase block">Packaging Profile</span>
            <span className="font-bold text-white font-mono text-xs">Cold Crate Box</span>
            <span className="text-[10px] text-white/50 font-mono block">18 x 15 x 12 cm</span>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
            <span className="text-[9px] font-mono text-white/40 uppercase block">Couriers</span>
            <span className="font-bold text-white font-mono text-xs">Priority Air</span>
            <span className="text-[10px] text-white/50 font-mono block">BlueDart / Delhivery</span>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
            <span className="text-[9px] font-mono text-white/40 uppercase block">Fastrr Checkout</span>
            <span className="font-bold text-white font-mono text-xs">Headless API</span>
            <span className="text-[10px] text-white/60 font-mono block">HMAC-SHA256</span>
          </div>
        </div>
      </div>

      {/* Manual Live AWB Tracker Tool */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0f0f0f] border border-white/10 space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            LIVE CONSIGNMENT AWB LOOKUP TOOL
          </h4>
          <p className="text-[11px] text-white/50 font-mono mt-0.5">
            Query real-time scan events directly through Shiprocket External Courier APIs
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              placeholder="Enter AWB Code or Order ID (e.g. SR-AWB-...)"
              value={searchAwb}
              onChange={(e) => setSearchAwb(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-white/30 font-mono focus:outline-none focus:border-white/50"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold font-mono text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
          >
            {isSearching ? 'Locating...' : 'Query'}
          </button>
        </form>

        {searchError && (
          <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-white text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-white/70" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Tracking Result View */}
        {trackingResult && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-5 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase block">IDENTIFIER</span>
                <span className="text-base font-bold font-mono text-white">{trackingResult.orderNumber}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white font-mono text-xs font-bold uppercase">
                <Truck className="w-3.5 h-3.5" />
                <span>{trackingResult.statusText}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <span className="text-[10px] text-white/40 block uppercase">Carrier Partner</span>
                <span className="font-bold text-white block">{trackingResult.courierName}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 block uppercase">AWB Code</span>
                <span className="font-bold text-white block">{trackingResult.trackingNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 block uppercase">Origin Terminal</span>
                <span className="text-white/80 block">{trackingResult.origin}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 block uppercase">Destination</span>
                <span className="text-white/80 block">{trackingResult.destination}</span>
              </div>
            </div>

            {/* Milestones Log */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">
                CARRIER SCANS TIMELINE
              </span>
              <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                {trackingResult.activities.map((act, idx) => (
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
                    <div className="flex-1 bg-white/[0.02] border border-white/5 p-3 rounded-xl space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white uppercase">{act.status}</span>
                        <span className="text-[10px] font-mono text-white/40">{act.date}</span>
                      </div>
                      <p className="text-white/70 text-[11px]">{act.activity}</p>
                      {act.location && (
                        <p className="text-[10px] text-white/50 font-mono">{act.location}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
