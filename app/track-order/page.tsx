'use client';

import React, { useState } from 'react';
import { Search, Package, CheckCircle2, Truck, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import SubpageShell from '@/components/layout/SubpageShell';

const MONO = "'Poppins', sans-serif";
const SANS = "'Poppins', sans-serif";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasSearched(true);
    }, 600);
  };

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
        <div style={{ fontFamily: SANS }}>
          {/* Hero */}
          <div className="border-b border-white/10 px-6 py-14 text-center sm:px-12 sm:py-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.05] backdrop-blur-sm mb-4">
              <Package className="w-3.5 h-3.5 text-white/60" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/70" style={{ fontFamily: MONO }}>
                LIVE LOGISTICS // DISPATCH
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase text-white leading-tight">
              TRACK YOUR CRATE
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-white/60 tracking-wider max-w-lg mx-auto">
              Enter your Order Number (e.g. RBL-8921) or Courier AWB to view real-time delivery status.
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
                className="px-6 py-3 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
              >
                {isLoading ? 'Locating...' : 'Track'}
              </button>
            </form>
          </div>

          {/* Tracking Result View */}
          <div className="mx-auto max-w-3xl px-6 py-12 sm:px-12 sm:py-16">
            {hasSearched ? (
              <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-6 sm:p-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest" style={{ fontFamily: MONO }}>
                      ORDER IDENTIFIER
                    </span>
                    <h3 className="text-xl font-bold text-white font-mono uppercase tracking-wider">
                      {orderId.trim().toUpperCase()}
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                    <Truck className="w-3.5 h-3.5" /> In Transit - On Schedule
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Order Confirmed & Payment Verified</h4>
                      <p className="text-xs text-white/50 mt-0.5">Dispatched from Rebelive Cold-Fulfilment Center</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Crated in Matte-Black Protective Packaging</h4>
                      <p className="text-xs text-white/50 mt-0.5">Passed shock-cushioning and seal verification</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shrink-0 font-bold text-xs">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Handed to Express Logistics Carrier</h4>
                      <p className="text-xs text-white/70 mt-0.5">Arrived at Regional Hub // Out for Hub Transfer</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start gap-4 opacity-40">
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-white/40" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Out for Delivery</h4>
                      <p className="text-xs text-white/50 mt-0.5">Courier assigned for final door step drop</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
                  <span>Estimated Delivery: Within 24–48 hours</span>
                  <a
                    href="https://wa.me/message/CV56ETMKXMV5M1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Need instant help on WhatsApp?
                  </a>
                </div>
              </div>
            ) : (
              /* Helpful Instructions Box */
              <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] text-center space-y-4">
                <AlertCircle className="w-8 h-8 text-white/30 mx-auto" />
                <h3 className="text-base font-bold text-white">Where do I find my Order ID?</h3>
                <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
                  Your Order ID was sent to your email and WhatsApp immediately after purchase confirmation. It begins with &quot;RBL-&quot; followed by digits.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <a
                    href="https://wa.me/message/CV56ETMKXMV5M1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs uppercase tracking-wider text-white transition-colors inline-flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Ask Support via WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </SubpageShell>
    </>
  );
}
