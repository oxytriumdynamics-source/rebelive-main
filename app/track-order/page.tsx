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
  AlertTriangle,
  RotateCcw,
  XCircle,
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

const MONO = "'Poppins', sans-serif";
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
          Enter your Order Number (e.g. RBL-20261015-3867) or AWB number to view real-time delivery status.
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
        ) : hasSearched && trackingData && trackingData.currentStatus !== 'NOT_FOUND' ? (
          (() => {
            const rawStatus = (trackingData.currentStatus || '').toUpperCase();
            const rawStatusText = (trackingData.statusText || '').toUpperCase();
            const rawActivities = trackingData.activities || [];
            const actStatuses = rawActivities.map((a) => (a.status || '').toUpperCase());
            const fullStatusUniverse = `${rawStatus} ${rawStatusText} ${actStatuses.join(' ')}`;

            // Exception Status Handlers (Separated from normal progression - Requirement 5)
            const isCancelled = fullStatusUniverse.includes('CANCEL');
            const isDeliveryFailed =
              fullStatusUniverse.includes('FAIL') ||
              fullStatusUniverse.includes('UNDELIVER') ||
              fullStatusUniverse.includes('UN-DELIVER') ||
              fullStatusUniverse.includes('NDR');
            const isRto = fullStatusUniverse.includes('RTO') || fullStatusUniverse.includes('RETURN_TO_ORIGIN');

            // 5 Dynamic Delivery Stages (Requirement 1)
            const isDelivered =
              !isCancelled &&
              !isRto &&
              (rawStatus.includes('DELIVER') ||
                rawStatusText.includes('DELIVER') ||
                actStatuses.some((s) => s.includes('DELIVER')));

            const isOutForDelivery =
              !isCancelled &&
              !isRto &&
              (isDelivered ||
                rawStatus.includes('OUT FOR DELIVERY') ||
                rawStatus.includes('OUT_FOR_DELIVERY') ||
                rawStatus === 'OFD' ||
                rawStatusText.includes('OUT FOR DELIVERY') ||
                actStatuses.some((s) => s.includes('OUT FOR DELIVERY') || s === 'OFD'));

            const isInTransit =
              !isCancelled &&
              !isRto &&
              (isOutForDelivery ||
                rawStatus.includes('IN TRANSIT') ||
                rawStatus.includes('IN_TRANSIT') ||
                rawStatus.includes('SHIPPED') ||
                rawStatus.includes('TRANSIT') ||
                rawStatusText.includes('TRANSIT') ||
                actStatuses.some((s) => s.includes('IN TRANSIT') || s.includes('SHIPPED') || s.includes('TRANSIT')));

            const isPickedUp =
              !isCancelled &&
              !isRto &&
              (isInTransit ||
                rawStatus.includes('PICKED') ||
                rawStatus.includes('PICKUP') ||
                rawStatusText.includes('PICKED') ||
                actStatuses.some((s) => s.includes('PICKED') || s.includes('PICKUP')));

            const isConfirmed = true;

            // 5-Stage Index: 0: CONFIRMED, 1: PICKED UP, 2: IN TRANSIT, 3: OUT FOR DELIVERY, 4: DELIVERED
            const stageIndex = isDelivered ? 4 : isOutForDelivery ? 3 : isInTransit ? 2 : isPickedUp ? 1 : 0;
            const progressWidth = `${stageIndex * 25}%`;

            // Customer Friendly Descriptions Mapping (Requirement 2)
            const FRIENDLY_DESCRIPTIONS: Record<string, string> = {
              CONFIRMED: 'Your order has been successfully confirmed.',
              PROCESSING: 'Your order is being prepared for dispatch.',
              'PICKED UP': 'Your shipment has been picked up by our delivery partner.',
              'IN TRANSIT': 'Your shipment is on its way to your delivery destination.',
              'OUT FOR DELIVERY': 'Your order is out for delivery. Get ready to receive it!',
              DELIVERED: 'Your order has been successfully delivered.',
              CANCELLED: 'This order has been cancelled.',
              'DELIVERY FAILED': 'Delivery could not be completed. Our delivery partner may attempt another delivery.',
              'RTO INITIATED': 'Your shipment is being returned to the fulfilment centre.',
            };

            const normalizeStatusKey = (sRaw: string): string => {
              const s = (sRaw || '').toUpperCase().trim();
              if (s.includes('RTO') || s.includes('RETURN_TO_ORIGIN')) return 'RTO INITIATED';
              if (s.includes('FAIL') || s.includes('UNDELIVER') || s.includes('UN-DELIVER') || s.includes('NDR')) return 'DELIVERY FAILED';
              if (s.includes('CANCEL')) return 'CANCELLED';
              if (s.includes('DELIVERED') || s.includes('DELIVERY COMPLETED') || s.includes('DELIVER')) return 'DELIVERED';
              if (s.includes('OUT FOR DELIVERY') || s.includes('OUT_FOR_DELIVERY') || s === 'OFD') return 'OUT FOR DELIVERY';
              if (s.includes('IN TRANSIT') || s.includes('IN_TRANSIT') || s.includes('SHIPPED') || s.includes('TRANSIT') || s.includes('REACHED')) return 'IN TRANSIT';
              if (s.includes('PICKED UP') || s.includes('PICKED_UP') || s.includes('PICKUP DONE') || s.includes('PICKED')) return 'PICKED UP';
              if (s.includes('PROCESSING') || s.includes('MANIFEST') || s.includes('READY') || s.includes('PACK') || s.includes('AWB')) return 'PROCESSING';
              return 'CONFIRMED';
            };

            // Carrier Partner: Actual assigned courier name or "Awaiting Courier Assignment" (Requirement 4)
            const courierDisplay =
              trackingData.courierName &&
              trackingData.courierName !== 'Shiprocket Express' &&
              trackingData.courierName !== 'Pending' &&
              !trackingData.courierName.includes('Awaiting')
                ? trackingData.courierName
                : 'Awaiting Courier Assignment';

            // Origin Terminal: Always "REBELIVE WAREHOUSE" (Requirement 4)
            const originDisplay = 'REBELIVE WAREHOUSE';

            // Actual Dynamic Estimated Delivery Date (Never displays "N/A")
            const displayEstimatedDelivery = (() => {
              if (isDelivered) return 'Delivered to Recipient';
              if (isCancelled) return 'Order Cancelled';
              const edd = trackingData.estimatedDelivery;
              if (edd && edd !== 'N/A' && edd !== 'Pending Courier Pickup' && !edd.includes('Available')) {
                const pDate = new Date(edd);
                if (!isNaN(pDate.getTime()) && edd.includes('-')) {
                  return pDate.toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  });
                }
                return edd;
              }
              const baseDate = trackingData.order?.createdAt ? new Date(trackingData.order.createdAt) : new Date();
              const fallback = new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000);
              return fallback.toLocaleDateString('en-IN', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
            })();

            // Chronological Dispatch Activities with Location Inheritance (Requirement 2 & 3)
            const chronologicalActivities = [...rawActivities].sort((a, b) => {
              const tsA = new Date(a.date).getTime() || 0;
              const tsB = new Date(b.date).getTime() || 0;
              return tsA - tsB;
            });

            // Fallback location inheritance
            let lastConfirmedLocation = 'REBELIVE DISPATCH CENTRE';
            const mappedActivities = chronologicalActivities.map((act) => {
              const statusKey = normalizeStatusKey(act.status);
              const friendlyDesc = FRIENDLY_DESCRIPTIONS[statusKey] || act.activity;
              let loc = act.location ? act.location.trim() : '';

              if (statusKey === 'CONFIRMED' || statusKey === 'PROCESSING') {
                loc = 'REBELIVE DISPATCH CENTRE';
                lastConfirmedLocation = 'REBELIVE DISPATCH CENTRE';
              } else if (loc && loc !== 'Hub' && loc !== 'Rebelive Fulfillment Center') {
                lastConfirmedLocation = loc;
              } else {
                loc = lastConfirmedLocation;
              }

              return {
                ...act,
                statusKey,
                friendlyDesc,
                location: loc,
              };
            });

            return (
              <div className="border border-white/10 rounded-3xl bg-white/[0.02] p-6 sm:p-8 space-y-8 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                {/* Top Status Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block" style={{ fontFamily: MONO }}>
                      ORDER CONSIGNMENT
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-mono uppercase tracking-wider">
                      {trackingData.orderNumber}
                    </h3>
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ${
                      isDelivered
                        ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                        : isCancelled
                        ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                        : isDeliveryFailed
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                        : isRto
                        ? 'bg-orange-500/20 border border-orange-500/40 text-orange-300'
                        : isOutForDelivery
                        ? 'bg-amber-500/10 border border-amber-500/40 text-amber-300 animate-pulse'
                        : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    }`}
                  >
                    {isDelivered ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : isCancelled ? (
                      <XCircle className="w-3.5 h-3.5" />
                    ) : isDeliveryFailed ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : isRto ? (
                      <RotateCcw className="w-3.5 h-3.5" />
                    ) : (
                      <Truck className="w-3.5 h-3.5" />
                    )}
                    <span>{trackingData.statusText}</span>
                  </div>
                </div>

                {/* 5-Stage Visual Progress Stepper (Requirement 1 & 5) */}
                {isCancelled ? (
                  <div className="p-5 sm:p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-4 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
                    <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
                      <XCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Order Cancelled</h4>
                      <p className="text-xs text-rose-200/80 mt-1">This order has been cancelled.</p>
                    </div>
                  </div>
                ) : isDeliveryFailed ? (
                  <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-start gap-4 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Delivery Attempt Failed</h4>
                      <p className="text-xs text-amber-200/80 mt-1">
                        Delivery could not be completed. Our delivery partner may attempt another delivery.
                      </p>
                    </div>
                  </div>
                ) : isRto ? (
                  <div className="p-5 sm:p-6 rounded-2xl bg-orange-500/10 border border-orange-500/40 flex items-start gap-4 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">RTO Initiated</h4>
                      <p className="text-xs text-orange-200/80 mt-1">
                        Your shipment is being returned to the fulfilment centre.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                    <div className="grid grid-cols-5 text-center text-[9px] sm:text-[11px] font-mono text-white/60 uppercase tracking-wider">
                      <span className={stageIndex >= 0 ? 'text-emerald-400 font-bold' : ''}>1. Confirmed</span>
                      <span className={stageIndex >= 1 ? 'text-emerald-400 font-bold' : ''}>2. Picked Up</span>
                      <span className={stageIndex >= 2 ? 'text-emerald-400 font-bold' : ''}>3. In Transit</span>
                      <span className={stageIndex >= 3 ? 'text-emerald-400 font-bold' : ''}>4. Out for Delivery</span>
                      <span className={stageIndex >= 4 ? 'text-emerald-400 font-bold' : ''}>5. Delivered</span>
                    </div>
                    <div className="relative flex items-center justify-between px-2">
                      <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-1 bg-white/10 -z-0" />
                      <div
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700 -z-0"
                        style={{ width: progressWidth }}
                      />
                      {/* Step 1: Confirmed */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all ${
                          stageIndex >= 0
                            ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                            : 'bg-[#141414] border border-white/20 text-white/40'
                        }`}
                        title="1. Confirmed"
                      >
                        <Check className="w-4 h-4" />
                      </div>
                      {/* Step 2: Picked Up */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all ${
                          stageIndex >= 1
                            ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                            : 'bg-[#141414] border border-white/20 text-white/40'
                        }`}
                        title="2. Picked Up"
                      >
                        <Package className="w-4 h-4" />
                      </div>
                      {/* Step 3: In Transit */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all ${
                          stageIndex > 2
                            ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                            : stageIndex === 2
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500 animate-pulse'
                            : 'bg-[#141414] border border-white/20 text-white/40'
                        }`}
                        title="3. In Transit"
                      >
                        <Truck className="w-4 h-4" />
                      </div>
                      {/* Step 4: Out for Delivery */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all ${
                          stageIndex > 3
                            ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                            : stageIndex === 3
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500 animate-pulse'
                            : 'bg-[#141414] border border-white/20 text-white/40'
                        }`}
                        title="4. Out for Delivery"
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                      {/* Step 5: Delivered */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all ${
                          isDelivered
                            ? 'bg-emerald-500 text-black shadow-[0_0_25px_rgba(16,185,129,0.8)] scale-110'
                            : 'bg-[#141414] border border-white/20 text-white/40'
                        }`}
                        title="5. Delivered"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                )}

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

                {/* Quick Metadata Grid (Requirement 4) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase font-mono block">Carrier Partner</span>
                    <span className="font-bold text-white truncate block">{courierDisplay}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase font-mono block">AWB Code</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-white text-[11px]">
                      <span>{trackingData.trackingNumber || 'Pending AWB'}</span>
                      {trackingData.trackingNumber && (
                        <button
                          onClick={handleCopyAwb}
                          className="p-1 hover:text-emerald-400 transition-colors cursor-pointer"
                          title="Copy AWB"
                        >
                          {copiedAwb ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white/60" />}
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase font-mono block">Origin Terminal</span>
                    <span className="font-semibold text-white/80 truncate block">{originDisplay}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 uppercase font-mono block">Destination</span>
                    <span className="font-semibold text-white/80 truncate block">{trackingData.destination || 'Delivery Address'}</span>
                  </div>
                </div>

                {/* Live Progress Scans Timeline (Chronological, Friendly Descriptions & Locations) */}
                <div className="space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 font-mono">
                    DISPATCH ACTIVITY LOG
                  </h4>

                  {mappedActivities.length > 0 ? (
                    <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
                      {mappedActivities.map((act, idx) => {
                        const isLatest = idx === mappedActivities.length - 1;
                        const actDelivered = act.statusKey === 'DELIVERED';
                        const actFailed = act.statusKey === 'DELIVERY FAILED' || act.statusKey === 'CANCELLED';
                        return (
                          <div key={idx} className="flex items-start gap-4 relative">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                                actDelivered
                                  ? 'bg-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.7)]'
                                  : actFailed
                                  ? 'bg-rose-500 text-white font-bold'
                                  : isLatest
                                  ? 'bg-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                                  : 'bg-[#141414] border border-white/20 text-white/70'
                              }`}
                            >
                              {actDelivered ? (
                                <ShieldCheck className="w-4 h-4" />
                              ) : actFailed ? (
                                <AlertCircle className="w-4 h-4" />
                              ) : act.statusKey === 'OUT FOR DELIVERY' ? (
                                <MapPin className="w-4 h-4" />
                              ) : act.statusKey === 'IN TRANSIT' ? (
                                <Truck className="w-4 h-4" />
                              ) : act.statusKey === 'PICKED UP' ? (
                                <Package className="w-4 h-4" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1 bg-white/[0.02] border border-white/5 p-3.5 rounded-xl space-y-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                                  {act.statusKey}
                                </h5>
                                <span className="text-[10px] font-mono text-white/50">{act.date}</span>
                              </div>
                              <p className="text-xs text-white/80">{act.friendlyDesc}</p>
                              {act.location && (
                                <div className="inline-flex items-center gap-1 text-[10px] text-white/50 font-mono pt-1">
                                  <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                                  <span>{act.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-xs text-white/50 font-mono">
                      Consignment registered. Live courier scans will populate once dispatched from our fulfillment hub.
                    </div>
                  )}
                </div>

                {/* Bottom Footer Info */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
                  <span className="font-mono">
                    Estimated Delivery: <strong className="text-emerald-400">{displayEstimatedDelivery}</strong>
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
              {errorMessage || (hasSearched ? 'Consignment Not Found' : 'Where do I find my Order ID?')}
            </h3>
            <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
              {errorMessage ||
                (hasSearched
                  ? 'No tracking information was found for this identifier. Please verify your Order ID (starts with "RBL-") or AWB number.'
                  : 'Your Order ID was generated instantly upon checkout and sent to your email & SMS. It begins with "RBL-" followed by digits.')}
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
              INITIALIZING ORDER TRACKING...
            </div>
          }
        >
          <TrackOrderContent />
        </Suspense>
      </SubpageShell>
    </>
  );
}
