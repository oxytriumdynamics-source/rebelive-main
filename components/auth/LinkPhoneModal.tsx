'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Check, ArrowRight, X, ShieldCheck, Zap, Package } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { linkUserPhone } from '@/store/slices/authslice';
import { fetchOrders } from '@/lib/profileApi';

interface LinkPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (mergedOrdersCount: number) => void;
}

export default function LinkPhoneModal({ isOpen, onClose, onSuccess }: LinkPhoneModalProps) {
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((s) => s.auth.user);

  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mergedCount, setMergedCount] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhone(reduxUser?.phone || '');
      setError(null);
      setSuccess(false);
      setMergedCount(null);
    }
  }, [isOpen, reduxUser?.phone]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanDigits = phone.replace(/\D/g, '');
    const standard10 =
      cleanDigits.length === 12 && cleanDigits.startsWith('91')
        ? cleanDigits.slice(2)
        : cleanDigits.slice(-10);

    if (standard10.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resultAction = await dispatch(linkUserPhone(standard10));
      if (linkUserPhone.fulfilled.match(resultAction)) {
        const count = (resultAction.payload as any)?.mergedOrdersCount ?? 0;
        setMergedCount(count);
        setSuccess(true);
        // Refresh orders immediately
        try {
          await fetchOrders();
        } catch {}

        if (onSuccess) onSuccess(count);

        setTimeout(() => {
          onClose();
        }, 2200);
      } else {
        setError((resultAction.payload as string) || 'Could not link phone number. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  }

  function handleSkip() {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('rebelive_dismissed_phone_prompt', 'true');
    }
    onClose();
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleSkip}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-[#0a0a0a] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(255,255,255,0.08)] text-white select-none z-10"
        >
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.04] hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          {!success ? (
            <div className="space-y-6">
              {/* Header Icon */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/20 flex items-center justify-center text-white">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
                    FAST CHECKOUT &bull; ORDER SYNC
                  </span>
                  <h2 className="text-xl font-bold tracking-tight uppercase font-mono text-white">
                    Link Your Phone Number
                  </h2>
                </div>
              </div>

              <p className="text-xs text-white/60 leading-relaxed font-sans">
                Enter your mobile number to instantly sync all past orders placed via Fastrr and enable 1-Click Instant Checkout on all future crates.
              </p>

              {/* Value Props */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-white/80">
                  <Package className="w-3.5 h-3.5 text-white" />
                  <span>Sync all previous guest crates &amp; invoices</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Zap className="w-3.5 h-3.5 text-white" />
                  <span>1-Click Fastrr Instant Checkout (Zero typing)</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  <span>Live Shiprocket courier scan notifications</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-white/60 block">
                    Mobile Number (India / Global)
                  </label>
                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/15 focus-within:border-white transition-colors">
                    <span className="text-xs font-mono text-white/40 select-none font-bold">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="98765 43210"
                      maxLength={15}
                      autoFocus
                      className="w-full bg-transparent text-white placeholder-white/20 text-sm font-mono tracking-wider focus:outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-xs font-mono text-white/80 bg-white/10 p-2.5 rounded-lg border border-white/20">
                    ⚠️ {error}
                  </p>
                )}

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading ? 'Linking & Syncing…' : 'Link & Sync Past Orders'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleSkip}
                    className="w-full py-2.5 text-center text-xs font-mono text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    Skip for now
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.08] border border-white/30 flex items-center justify-center mx-auto text-white">
                <Check className="w-8 h-8 text-white stroke-[3]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold uppercase tracking-tight font-mono text-white">
                  Phone Number Linked!
                </h3>
                <p className="text-xs text-white/70 max-w-xs mx-auto">
                  {mergedCount && mergedCount > 0
                    ? `Successfully synced ${mergedCount} past order${mergedCount > 1 ? 's' : ''} to your account.`
                    : 'Your account is now ready for instant 1-click checkout and live order tracking.'}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-mono">
                <span>REBEL PROFILE UPDATED</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
