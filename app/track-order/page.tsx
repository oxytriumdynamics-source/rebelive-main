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
import { trackShipment, TrackingResult } from '@/lib/shiprocketApi';

const MONO = "'JetBrains Mono', monospace";
const SANS = "'Poppins', sans-serif";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || searchParams.get('order') || searchParams.get('awb') || '';

  const [orderId, setOrderId] = useState(initialId);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingResult | null>(null);
  const [copiedAwb, setCopiedAwb] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const executeTrack = async (idToTrack: string) => {
    const cleanId = idToTrack.trim();
    if (!cleanId) return;

    setIsLoading(true);
    setErrorMessage('');
    try {
      const result = await trackShipment(cleanId);
      setTrackingData(result);
      setHasSearched(true);
    } catch (err: any) {
      console.error('Failed to track shipment:', err);
      setErrorMessage(err.message || 'Unable to locate tracking information. Please check your ID.');
      setHasSearched(true);
    } finally {
      setIsLoading(false);
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
          Enter your Order Number (e.g. RBL-20261010-4102) or Shiprocket AWB to view real-time cold-chain delivery status.
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
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider shrink-0">
                <Truck className="w-3.5 h-3.5" />
                <span>{trackingData.statusText}</span>
              </div>
            </div>

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
                {trackingData.activities.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4 relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        idx === 0
                          ? 'bg-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                          : 'bg-[#141414] border border-white/20 text-white/70'
                      }`}
                    >
                      {idx === 0 ? <Truck className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
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
                ))}
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
