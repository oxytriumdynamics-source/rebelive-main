'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  ShieldCheck,
  Zap,
  Truck,
  CheckCircle2,
  Lock,
  Smartphone,
  MapPin,
  CreditCard,
  QrCode,
  ArrowRight,
  ChevronRight,
  Package,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCart, closeCart } from '@/store/slices/cartSlice';
import {
  initiateFastrrCheckout,
  completeFastrrCheckout,
  FastrrCheckoutItemInput,
  FastrrInitiateResponse,
  FastrrCompleteResponse,
} from '@/lib/shiprocketApi';

interface FastrrCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  directItem?: FastrrCheckoutItemInput | null;
}

const MONO = "'Poppins', sans-serif";
const SANS = "'Poppins', sans-serif";

export function FastrrCheckoutModal({ isOpen, onClose, directItem }: FastrrCheckoutModalProps) {
  const dispatch = useAppDispatch();
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Flow State: 'form' | 'processing' | 'success'
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [processingStatus, setProcessingStatus] = useState('Initiating Fastrr 1-Click Checkout...');

  // Customer Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Address Form
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [selectedSavedAddrId, setSelectedSavedAddrId] = useState<string | null>(null);

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CREDIT_CARD' | 'NET_BANKING' | 'COD'>('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Session & Pricing
  const [sessionData, setSessionData] = useState<FastrrInitiateResponse | null>(null);
  const [completedOrder, setCompletedOrder] = useState<FastrrCompleteResponse | null>(null);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');

  // Items to checkout: either direct item or cart items
  const itemsToCheckout: FastrrCheckoutItemInput[] = React.useMemo(() => {
    if (directItem) return [directItem];
    return cartItems.map((c) => ({
      productId: c.id,
      slug: c.id,
      name: c.name,
      flavor: c.flavor,
      packSize: c.packSize,
      quantity: c.quantity,
      unitPrice: c.pricePerUnit,
      image: c.image,
    }));
  }, [directItem, cartItems]);

  // Autofill from user profile if logged in
  useEffect(() => {
    if (user) {
      if (user.firstName) {
        setName(`${user.firstName} ${user.lastName || ''}`.trim());
      }
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Initialize Fastrr Session when modal opens
  useEffect(() => {
    if (!isOpen || itemsToCheckout.length === 0) return;

    setStep('form');
    setErrorBanner('');

    initiateFastrrCheckout({
      items: itemsToCheckout,
      customer: {
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
      },
      couponCode: appliedCoupon?.code,
    }).then((res) => {
      setSessionData(res);
      if (res.savedAddresses && res.savedAddresses.length > 0 && !line1) {
        const def = res.savedAddresses.find((a) => a.isDefault) || res.savedAddresses[0];
        setSelectedSavedAddrId(def.id);
        setLine1(def.line1);
        setLine2(def.line2 || '');
        setCity(def.city);
        setState(def.state);
        setPostalCode(def.postalCode);
      }
    });
  }, [isOpen, itemsToCheckout, appliedCoupon?.code]);

  if (!isOpen) return null;

  // Pricing calculations
  const rawSubtotal = itemsToCheckout.reduce(
    (sum, item) => sum + (item.unitPrice || 499) * (item.quantity || 1),
    0
  );
  const discount = appliedCoupon?.discountAmount || 0;
  const shipping = rawSubtotal >= 500 ? 0 : 60;
  const total = Math.max(0, rawSubtotal - discount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'REBEL10' || code === 'FIRSTCRATE' || code === 'COLD100') {
      const discountVal = code === 'COLD100' ? 100 : Math.round(rawSubtotal * 0.1);
      setAppliedCoupon({ code, discountAmount: discountVal });
    } else {
      setCouponError('Invalid coupon code. Try REBEL10 for 10% off.');
    }
  };

  const handleCompleteOrder = async () => {
    setErrorBanner('Online orders are temporarily disabled. Please check back later.');
    return;
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorBanner('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorBanner('Please enter a valid email address');
      return;
    }
    if (!line1.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      setErrorBanner('Please provide complete delivery address with PIN code');
      return;
    }

    setStep('processing');
    setProcessingStatus('Verifying Fastrr 1-Click Credentials...');

    setTimeout(() => {
      setProcessingStatus('Creating Cold Consignment in Shiprocket...');
    }, 700);

    setTimeout(() => {
      setProcessingStatus('Assigning Fastrr Express AWB & Scheduling Pickup...');
    }, 1400);

    try {
      const names = name.trim().split(' ');
      const firstName = names[0];
      const lastName = names.slice(1).join(' ') || 'Customer';

      const response = await completeFastrrCheckout({
        sessionId: sessionData?.sessionId,
        customer: {
          firstName,
          lastName,
          email: email.trim(),
          phone: phone.trim(),
        },
        shippingAddress: {
          line1: line1.trim(),
          line2: line2.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          country: 'India',
        },
        payment: {
          method: paymentMethod,
          amount: total,
          transactionId: `FASTRR-${Date.now()}-${Math.floor(Math.random() * 89999 + 10000)}`,
        },
        items: itemsToCheckout,
        couponCode: appliedCoupon?.code,
      });

      setCompletedOrder(response);

      if (!directItem) {
        dispatch(clearCart());
        dispatch(closeCart());
      }

      setStep('success');
    } catch (err: any) {
      console.error('Error completing Fastrr checkout:', err);
      setStep('form');
      setErrorBanner(err.message || 'Payment initiation failed. Please verify your details.');
    }
  };

  const handleCopyTracking = () => {
    if (!completedOrder?.trackingNumber) return;
    navigator.clipboard.writeText(completedOrder.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4">
      {/* Dark Neutral Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={() => {
          if (step !== 'processing') onClose();
        }}
      />

      {/* Modal Dialog Container - Compact & Monochrome */}
      <div
        style={{ fontFamily: SANS }}
        className="relative w-full max-w-4xl bg-[#090909] border border-white/15 rounded-2xl text-white shadow-[0_20px_60px_rgba(0,0,0,0.95)] z-10 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Header - Monochrome & Minimal */}
        <div className="px-3.5 sm:px-5 py-2.5 bg-[#0f0f0f] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <Zap className="w-3 h-3 fill-white text-white" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-xs tracking-wider uppercase text-white font-mono">
                SHIPROCKET FASTRR
              </span>
              <span className="px-1.5 py-0.2 rounded text-[8.5px] font-mono font-semibold bg-white/10 text-white border border-white/20 uppercase tracking-wider">
                1-CLICK CHECKOUT
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 text-[9.5px] text-white/50 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-white/70" />
              <span>256-BIT ENCRYPTED</span>
            </div>
            <button
              onClick={() => {
                if (step !== 'processing') onClose();
              }}
              className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-3 sm:p-4 overflow-y-auto [scrollbar-width:thin] scrollbar-thin scrollbar-thumb-white/20">
          {errorBanner && (
            <div className="mb-2.5 p-2 rounded-lg bg-white/5 border border-white/20 text-white text-xs flex items-center gap-2 animate-in fade-in font-mono">
              <AlertCircle className="w-3.5 h-3.5 text-white/80 shrink-0" />
              <span className="text-[11px]">{errorBanner}</span>
            </div>
          )}

          {step === 'processing' ? (
            /* Processing Screen - Monochrome */
            <div className="py-12 sm:py-16 text-center space-y-5 flex flex-col items-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                  Processing Instant Order
                </h3>
                <p className="text-[11px] text-white/60 font-mono tracking-wide">
                  {processingStatus}
                </p>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] text-white/50 flex items-center gap-1.5 font-mono">
                <Lock className="w-3 h-3 text-white/70" />
                <span>Encrypted Fastrr Payment Channel Active</span>
              </div>
            </div>
          ) : step === 'success' && completedOrder ? (
            /* Order Placed Success View - Monochrome */
            <div className="py-4 text-center space-y-4 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/60">
                  PAYMENT CAPTURED // DISPATCH SCHEDULED
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight font-mono">
                  CRATE RESERVED &amp; DISPATCHED
                </h3>
                <p className="text-xs text-white/60">
                  Thank you! Your cold-chain energy crate has been created in Shiprocket.
                </p>
              </div>

              {/* Order & Shiprocket Info Card */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div>
                    <span className="text-[9.5px] text-white/40 uppercase font-mono block">Order ID</span>
                    <span className="font-bold text-white font-mono text-xs tracking-wider">
                      {completedOrder.orderNumber}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9.5px] text-white/40 uppercase font-mono block">Status</span>
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-white font-mono">
                      <Truck className="w-3 h-3" /> Shiprocket Manifested
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <div>
                    <span className="text-[9.5px] text-white/40 uppercase font-mono block">AWB Tracking Code</span>
                    <span className="font-bold text-white font-mono text-xs tracking-wider">
                      {completedOrder.trackingNumber}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyTracking}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedTracking ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedTracking ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="pt-1.5 border-t border-white/5 text-[10.5px] text-white/60 flex items-center justify-between font-mono">
                  <span>Carrier: {completedOrder.courierName || 'Shiprocket Express'}</span>
                  <span className="text-white font-medium">Arrival: 24–48 Hours</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Link
                  href={`/track-order?id=${completedOrder.orderNumber}`}
                  onClick={onClose}
                  className="py-2.5 px-3 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Track Order</span>
                </Link>

                <Link
                  href="/profile?tab=orders"
                  onClick={onClose}
                  className="py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>View in Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            /* Form View: 2-Column Compact Layout to fit on one screen */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-start">
              {/* ── LEFT COLUMN: Customer, Shipping & Payment (md:col-span-7) ── */}
              <div className="md:col-span-7 space-y-2.5">
                {/* 1. Customer Details */}
                <div className="space-y-1.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] sm:text-[10.5px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Smartphone className="w-3 h-3 text-white/70" />
                      <span>1. Customer Details</span>
                    </label>
                    {isAuthenticated && (
                      <span className="text-[9px] text-white/50 font-mono px-1.5 py-0.2 rounded bg-white/5 border border-white/10">
                        LOGGED IN
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit Mobile"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors font-mono"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>
                </div>

                {/* 2. Delivery Address */}
                <div className="space-y-1.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] sm:text-[10.5px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <MapPin className="w-3 h-3 text-white/70" />
                      <span>2. Delivery Address</span>
                    </label>
                    {sessionData?.savedAddresses && sessionData.savedAddresses.length > 0 && (
                      <span className="text-[9px] text-white/40 font-mono">
                        {sessionData.savedAddresses.length} saved
                      </span>
                    )}
                  </div>

                  {/* Saved Address Pills if available */}
                  {sessionData?.savedAddresses && sessionData.savedAddresses.length > 0 && (
                    <div className="flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none]">
                      {sessionData.savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => {
                            setSelectedSavedAddrId(addr.id);
                            setLine1(addr.line1);
                            setLine2(addr.line2 || '');
                            setCity(addr.city);
                            setState(addr.state);
                            setPostalCode(addr.postalCode);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono border shrink-0 transition-all cursor-pointer ${
                            selectedSavedAddrId === addr.id
                              ? 'bg-white text-black font-bold border-white'
                              : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white'
                          }`}
                        >
                          {addr.label || addr.city}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <input
                      type="text"
                      required
                      placeholder="Street Address, Flat / Unit"
                      value={line1}
                      onChange={(e) => {
                        setLine1(e.target.value);
                        setSelectedSavedAddrId(null);
                      }}
                      className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                    />
                    <div className="grid grid-cols-3 gap-1.5">
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                      />
                      <input
                        type="text"
                        required
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors"
                      />
                      <input
                        type="text"
                        required
                        placeholder="PIN Code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Instant Payment Method */}
                <div className="space-y-1.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <label className="text-[10px] sm:text-[10.5px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <CreditCard className="w-3 h-3 text-white/70" />
                    <span>3. Payment Method</span>
                  </label>

                  <div className="grid grid-cols-4 gap-1.5">
                    {/* Instant UPI */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        paymentMethod === 'UPI'
                          ? 'bg-white text-black font-semibold border-white shadow-sm'
                          : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <QrCode className="w-3.5 h-3.5" />
                        {paymentMethod === 'UPI' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <div className="text-[11px] font-bold leading-tight">UPI</div>
                      <div className={`text-[8.5px] ${paymentMethod === 'UPI' ? 'text-black/60' : 'text-white/40'} truncate font-mono`}>
                        Instant
                      </div>
                    </button>

                    {/* Cards */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CREDIT_CARD')}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        paymentMethod === 'CREDIT_CARD'
                          ? 'bg-white text-black font-semibold border-white shadow-sm'
                          : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <CreditCard className="w-3.5 h-3.5" />
                        {paymentMethod === 'CREDIT_CARD' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <div className="text-[11px] font-bold leading-tight">Cards</div>
                      <div className={`text-[8.5px] ${paymentMethod === 'CREDIT_CARD' ? 'text-black/60' : 'text-white/40'} truncate font-mono`}>
                        Debit/Credit
                      </div>
                    </button>

                    {/* NetBanking */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('NET_BANKING')}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        paymentMethod === 'NET_BANKING'
                          ? 'bg-white text-black font-semibold border-white shadow-sm'
                          : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <Lock className="w-3.5 h-3.5" />
                        {paymentMethod === 'NET_BANKING' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <div className="text-[11px] font-bold leading-tight">NetBanking</div>
                      <div className={`text-[8.5px] ${paymentMethod === 'NET_BANKING' ? 'text-black/60' : 'text-white/40'} truncate font-mono`}>
                        All Banks
                      </div>
                    </button>

                    {/* COD */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        paymentMethod === 'COD'
                          ? 'bg-white text-black font-semibold border-white shadow-sm'
                          : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <Truck className="w-3.5 h-3.5" />
                        {paymentMethod === 'COD' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <div className="text-[11px] font-bold leading-tight">COD</div>
                      <div className={`text-[8.5px] ${paymentMethod === 'COD' ? 'text-black/60' : 'text-white/40'} truncate font-mono`}>
                        Doorstep
                      </div>
                    </button>
                  </div>

                  {/* Sub UPI Picker */}
                  {paymentMethod === 'UPI' && (
                    <div className="pt-1 flex items-center justify-between text-xs">
                      <span className="text-[9.5px] text-white/50 font-mono">Provider:</span>
                      <div className="flex gap-1">
                        {(['gpay', 'phonepe', 'paytm', 'qr'] as const).map((app) => (
                          <button
                            key={app}
                            type="button"
                            onClick={() => setSelectedUpiApp(app)}
                            className={`px-2 py-0.5 rounded text-[9.5px] font-mono uppercase transition-colors cursor-pointer ${
                              selectedUpiApp === app
                                ? 'bg-white text-black font-bold'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                          >
                            {app}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── RIGHT COLUMN: Order Summary, Pricing & Pay (md:col-span-5) ── */}
              <div className="md:col-span-5 space-y-2.5 flex flex-col justify-between">
                {/* Crate Items Summary */}
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs pb-1.5 border-b border-white/10">
                    <span className="text-[9.5px] font-mono text-white/50 uppercase tracking-wider">
                      CRATE SUMMARY ({itemsToCheckout.reduce((acc, i) => acc + (i.quantity || 1), 0)} CANS)
                    </span>
                    <span className="text-[11px] font-bold text-white font-mono">
                      ₹{rawSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1 [scrollbar-width:thin] scrollbar-thin scrollbar-thumb-white/20">
                    {itemsToCheckout.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {item.image && (
                            <div className="w-6 h-8 relative shrink-0 bg-white/[0.03] rounded border border-white/10 p-0.5">
                              <Image src={item.image} alt={item.name || ''} fill className="object-contain" />
                            </div>
                          )}
                          <div className="truncate">
                            <p className="font-bold text-white text-[11px] truncate uppercase leading-tight">{item.name}</p>
                            <p className="text-[9.5px] text-white/40 font-mono">
                              {item.quantity}x • {item.packSize || 12} Cans
                            </p>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-semibold text-white shrink-0">
                          ₹{((item.unitPrice || 499) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code Inline Input */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-1.5 pt-1.5 border-t border-white/5">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. REBEL10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-xs text-white placeholder-white/30 uppercase tracking-wider font-mono focus:outline-none focus:border-white/40 text-[10.5px]"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer font-mono"
                    >
                      Apply
                    </button>
                  </form>
                  {couponError && <p className="text-[9.5px] text-white/60 font-mono">{couponError}</p>}
                  {appliedCoupon && (
                    <div className="text-[10px] text-white flex items-center justify-between font-mono bg-white/10 px-2 py-1 rounded border border-white/20">
                      <span>COUPON {appliedCoupon.code}</span>
                      <span>-₹{appliedCoupon.discountAmount}</span>
                    </div>
                  )}
                </div>

                {/* Final Cost Breakdown & Pay Button */}
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="space-y-1 text-xs text-white/60 font-mono">
                    <div className="flex items-center justify-between text-[11px]">
                      <span>Subtotal</span>
                      <span className="text-white">₹{rawSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex items-center justify-between text-[11px] text-white">
                        <span>Discount</span>
                        <span>-₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 text-white/70">
                        <Truck className="w-3 h-3 text-white/70" /> Shipping
                      </span>
                      <span className="text-white font-semibold">FREE</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-white/10 text-white font-bold text-xs sm:text-sm">
                      <span>Total Payable</span>
                      <span className="font-mono text-sm sm:text-base text-white">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Primary Pay Button */}
                  <button
                    type="button"
                    disabled
                    className="w-full py-2.5 sm:py-3 rounded-xl bg-white/10 text-white/40 border border-white/10 font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-not-allowed select-none"
                    title="Ordering is currently disabled"
                  >
                    <Zap className="w-3.5 h-3.5 text-white/30 fill-white/30" />
                    <span>Orders Temporarily Disabled</span>
                  </button>

                  <div className="text-center pt-0.5">
                    <span className="text-[9px] text-white/40 tracking-wider font-mono">
                      Shiprocket Fastrr • 256-Bit SSL Encrypted
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
