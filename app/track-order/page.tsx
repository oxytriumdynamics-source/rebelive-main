'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Package,
  CheckCircle2,
  Truck,
  Clock,
  AlertCircle,
  MessageSquare,
  Copy,
  Check,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import SubpageShell from '@/components/layout/SubpageShell';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  trackShipmentThunk,
  selectTrackingResult,
  selectShippingLoading,
  selectShippingError,
} from '@/store/slices/shippingSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const MONO = "'JetBrains Mono', monospace";
const SANS = "'Poppins', sans-serif";

function TrackOrderContent() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || searchParams.get('order') || searchParams.get('awb') || '';

  const trackingData = useAppSelector(selectTrackingResult);
  const isLoading = useAppSelector(selectShippingLoading);
  const reduxError = useAppSelector(selectShippingError);

  const [orderId, setOrderId] = useState(initialId);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedAwb, setCopiedAwb] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const executeTrack = async (idToTrack: string) => {
    const cleanId = idToTrack.trim();
    if (!cleanId) return;

    setErrorMessage('');
    try {
      await dispatch(trackShipmentThunk(cleanId)).unwrap();
      setHasSearched(true);
    } catch (err: any) {
      console.error('Failed to track shipment:', err);
      setErrorMessage(err || 'Unable to locate tracking information. Please check your ID.');
      setHasSearched(true);
    }
  };

  useEffect(() => {
    if (initialId) {
      setOrderId(initialId);
      executeTrack(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeTrack(orderId);
  };

  const handleCopyAwb = () => {
    if (!trackingData?.trackingNumber) return;
    navigator.clipboard.writeText(trackingData.trackingNumber);
    setCopiedAwb(true);
    setTimeout(() => setCopiedAwb(false), 2000);
  };

  return (
    <div style={{ fontFamily: SANS }}>
      {/* Hero */}
      <div className="border-b border-white/10 px-6 py-14 text-center sm:px-12 sm:py-20">
      
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase text-white leading-tight">
          TRACK YOUR CRATE
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-white/60 tracking-wider max-w-lg mx-auto">
          Enter your Order Number (e.g. RBL-20261015-3867) or Shiprocket AWB to view real-time cold-chain delivery status.
        </p>

        {/* Tracking Input Form */}
        <form onSubmit={handleSearch} className="mt-8 max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              placeholder="Enter Order ID or AWB number..."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/15 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors uppercase tracking-wider font-mono text-xs"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isLoading ? 'Locating...' : 'Track'}
          </button>
        </form>

        {/* Quick Sample Tracking Chips */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-white/40 font-mono">
          <span>Quick Track:</span>
          <button
            type="button"
            onClick={() => {
              setOrderId('RBL-20261015-3867');
              executeTrack('RBL-20261015-3867');
            }}
            className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white/80 border border-white/10 transition-colors cursor-pointer"
          >
            RBL-20261015-3867
          </button>
          <button
            type="button"
            onClick={() => {
              setOrderId('RBL-DELIVERED-TEST');
              executeTrack('RBL-DELIVERED-TEST');
            }}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Delivered Order Demo</span>
          </button>
        </div>
      </div>

      {/* Tracking Result View */}
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-12 sm:py-16">
        {isLoading ? (
          <div className="border border-white/10 rounded-2xl bg-[#0e0e0e] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="space-y-2">
                <Skeleton className="h-3 w-28 rounded" />
                <Skeleton className="h-6 w-40 rounded-lg" />
              </div>
              <Skeleton className="h-7 w-32 rounded-full" />
            </div>
            <div className="space-y-5 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48 rounded" />
                    <Skeleton className="h-3.5 w-64 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : hasSearched && trackingData ? (
          (() => {
            const isDelivered =
              trackingData.currentStatus === 'DELIVERED' ||
              trackingData.statusText.toLowerCase().includes('deliv') ||
              trackingData.activities.some((a) => a.status.toLowerCase().includes('deliv'));
            const isOutForDelivery =
              trackingData.currentStatus === 'OUT_FOR_DELIVERY' ||
              trackingData.statusText.toLowerCase().includes('out for delivery');

            return (
              <div className="border border-white/10 rounded-3xl bg-white/[0.02] p-6 sm:p-8 space-y-8 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                {/* Top Status Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block" style={{ fontFamily: MONO }}>
                      SHIPROCKET CONSIGNMENT
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-mono uppercase tracking-wider">
                      {trackingData.orderNumber}
                    </h3>
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ${
                      isDelivered
                        ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                        : isOutForDelivery
                        ? 'bg-amber-500/10 border border-amber-500/40 text-amber-300 animate-pulse'
                        : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    }`}
                  >
                    {isDelivered ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                    <span>{trackingData.statusText}</span>
                  </div>
                </div>

                {/* 4-Stage Visual Progress Stepper */}
                <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-white/60 uppercase tracking-wider">
                    <span>1. Confirmed</span>
                    <span>2. Cold Packed</span>
                    <span>3. In Transit</span>
                    <span className={isDelivered ? 'text-emerald-400 font-bold' : ''}>4. Delivered</span>
                  </div>
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 -z-0" />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700 -z-0"
                      style={{
                        width: isDelivered ? '100%' : isOutForDelivery ? '85%' : '65%',
                      }}
                    />
                    {/* Step 1 */}
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs z-10 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                      <Check className="w-4 h-4" />
                    </div>
                    {/* Step 2 */}
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs z-10 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                      <Package className="w-4 h-4" />
                    </div>
                    {/* Step 3 */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 ${
                        isDelivered || isOutForDelivery
                          ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500 animate-pulse'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                    </div>
                    {/* Step 4 */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 ${
                        isDelivered
                          ? 'bg-emerald-500 text-black shadow-[0_0_25px_rgba(16,185,129,0.8)] scale-110'
                          : 'bg-[#141414] border border-white/20 text-white/40'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Delivered Celebration Card */}
                {isDelivered && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent border border-emerald-500/40 flex items-center gap-4 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-black flex items-center justify-center font-black shrink-0 shadow-[0_0_25px_rgba(16,185,129,0.6)]">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">
                          Consignment Delivered · Cold Seal Verified
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold uppercase">
                          COMPLETE
                        </span>
                      </div>
                      <p className="text-xs text-white/70 mt-0.5">
                        Package successfully handed over to recipient. Sub-zero thermal insulation maintained at optimum chill throughout delivery.
                      </p>
                    </div>
                  </div>
                )}

                {/* Quick Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase font-mono block">Carrier Partner</span>
                    <span className="font-bold text-white truncate block">{trackingData.courierName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase font-mono block">AWB Code</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-white text-[11px]">
                      <span>{trackingData.trackingNumber}</span>
                      <button
                        onClick={handleCopyAwb}
                        className="p-1 hover:text-emerald-400 transition-colors cursor-pointer"
                        title="Copy AWB"
                      >
                        {copiedAwb ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/60" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase font-mono block">Origin Terminal</span>
                    <span className="font-semibold text-white/80 truncate block">{trackingData.origin}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase font-mono block">Destination</span>
                    <span className="font-semibold text-white/80 truncate block">{trackingData.destination}</span>
                  </div>
                </div>

                {/* Live Progress Scans Timeline */}
                <div className="space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 font-mono">
                    DISPATCH ACTIVITY LOG
                  </h4>

                  <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
                    {trackingData.activities.map((activity, idx) => {
                      const actDelivered = activity.status.toLowerCase().includes('deliv');
                      return (
                        <div key={idx} className="flex items-start gap-4 relative">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                              actDelivered
                                ? 'bg-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.7)]'
                                : idx === 0
                                ? 'bg-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                                : 'bg-[#141414] border border-white/20 text-white/70'
                            }`}
                          >
                            {actDelivered ? (
                              <ShieldCheck className="w-4 h-4" />
                            ) : idx === 0 ? (
                              <Truck className="w-4 h-4" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 bg-white/[0.02] border border-white/5 p-3.5 rounded-xl space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                                {activity.status}
                              </h5>
                              <span className="text-[10px] font-mono text-white/50">{activity.date}</span>
                            </div>
                            <p className="text-xs text-white/70">{activity.activity}</p>
                            <div className="inline-flex items-center gap-1 text-[10px] text-white/40 font-mono pt-1">
                              <MapPin className="w-3 h-3 text-emerald-400" />
                              <span>{activity.location}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Footer Info */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
                  <span className="font-mono">
                    Estimated Delivery: <strong className="text-emerald-400">{trackingData.estimatedDelivery}</strong>
                  </span>
                  <a
                    href="https://wa.me/message/CV56ETMKXMV5M1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Need express courier support on WhatsApp?</span>
                  </a>
                </div>
              </div>
            );
          })()
        ) : (
          /* Helpful Instructions Box */
          <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] text-center space-y-4">
            <AlertCircle className="w-8 h-8 text-white/30 mx-auto" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              {errorMessage ? 'Shipment Not Found' : 'Where do I find my Order ID?'}
            </h3>
            <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
              {errorMessage ||
                'Your Order ID was generated instantly via Shiprocket Fastrr checkout and sent to your email & SMS. It begins with "RBL-" followed by digits.'}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <a
                href="https://wa.me/message/CV56ETMKXMV5M1"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs uppercase tracking-wider text-white transition-colors inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Support via WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <>
      <style>{`
        html, body {
          position: static !important;
          overflow: auto !important;
          height: auto !important;
          inset: auto !important;
          overscroll-behavior: auto !important;
        }
      `}</style>

      <SubpageShell>
        <Suspense
          fallback={
            <div className="p-16 text-center text-white/50 font-mono text-xs">
              INITIALIZING SHIPROCKET TRACKING...
            </div>
          }
        >
          <TrackOrderContent />
        </Suspense>
      </SubpageShell>
    </>
  );
}
