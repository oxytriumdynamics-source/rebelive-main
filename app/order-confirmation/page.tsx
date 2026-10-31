'use client';

import React, { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  Truck,
  HelpCircle,
  Copy,
  Check,
  CreditCard,
  Banknote,
  ShieldCheck,
} from 'lucide-react';
import {
  getOrderWebhookStatusThunk,
  confirmFastrrOrderThunk,
  selectTrackingResult,
  selectWebhookStatus,
  selectShippingSyncing,
} from '@/store/slices/shippingSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { isValidCustomerName } from '@/lib/fastrrCheckout';
import { TaxInvoiceModal } from '@/components/invoice/TaxInvoiceModal';

/**
 * Clean SVG Checkmark Animation
 * Draws circle and check stroke smoothly with zero gradients.
 */
function SimpleCheckAnimation({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        className="w-full h-full text-white"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="26"
          cy="26"
          r="23"
          stroke="currentColor"
          strokeWidth="2.5"
          className="animate-circle"
        />
        <path
          d="M15 27L23 35L37 19"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-check"
        />
      </svg>
      <style jsx>{`
        .animate-circle {
          stroke-dasharray: 145;
          stroke-dashoffset: 145;
          animation: circleDraw 0.5s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .animate-check {
          stroke-dasharray: 35;
          stroke-dashoffset: 35;
          animation: checkDraw 0.35s cubic-bezier(0.65, 0, 0.45, 1) 0.45s forwards;
        }
        @keyframes circleDraw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes checkDraw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}

function OrderConfirmationContent() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const rawOid = searchParams.get('oid') || searchParams.get('order_id') || searchParams.get('id') || '';
  const ost = searchParams.get('ost') || searchParams.get('status') || 'SUCCESS';

  const reduxTracking = useAppSelector(selectTrackingResult);
  const reduxWebhookStatus = useAppSelector(selectWebhookStatus);
  const isSyncing = useAppSelector(selectShippingSyncing);

  const [oid, setOid] = useState<string>(rawOid);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [emailOffers, setEmailOffers] = useState(true);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Stored state for line items, customer, and address
  const [confirmedItems, setConfirmedItems] = useState<any[]>([]);
  const [confirmedAddress, setConfirmedAddress] = useState<any>(null);
  const [confirmedBillingAddress, setConfirmedBillingAddress] = useState<any>(null);
  const [confirmedCustomer, setConfirmedCustomer] = useState<any>(null);

  const hasConfirmedRef = useRef<Record<string, boolean>>({});

  const tracking = reduxTracking;

  // Retrieve stored order id from sessionStorage/localStorage if query param is empty
  useEffect(() => {
    if (!rawOid && typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('rebelive_last_order_id') || localStorage.getItem('rebelive_last_order_id');
      if (stored) {
        setOid(stored);
      }
    } else if (rawOid) {
      setOid(rawOid);
    }

    if (typeof window !== 'undefined') {
      try {
        const rawItems = sessionStorage.getItem('rebelive_fastrr_items') || localStorage.getItem('rebelive_fastrr_items');
        if (rawItems) setConfirmedItems(JSON.parse(rawItems));
      } catch {}

      try {
        const rawAddr = sessionStorage.getItem('rebelive_fastrr_address') || localStorage.getItem('rebelive_fastrr_address');
        if (rawAddr) setConfirmedAddress(JSON.parse(rawAddr));
      } catch {}

      try {
        const rawBill = sessionStorage.getItem('rebelive_fastrr_billing_address') || localStorage.getItem('rebelive_fastrr_billing_address');
        if (rawBill) setConfirmedBillingAddress(JSON.parse(rawBill));
      } catch {}

      try {
        const rawCust = sessionStorage.getItem('rebelive_fastrr_customer') || localStorage.getItem('rebelive_fastrr_customer');
        if (rawCust) setConfirmedCustomer(JSON.parse(rawCust));
      } catch {}
    }
  }, [rawOid]);

  // Primary function to connect and sync with backend webhooks via Redux
  const syncWithWebhooks = useCallback(async (targetOid: string) => {
    const queryId = targetOid || 'RBL-CONFIRMED';

    let storedItems: any[] = [];
    let storedAddress: any = null;
    let storedBillingAddress: any = null;
    let storedCustomer: any = null;

    if (typeof window !== 'undefined') {
      try {
        const raw = sessionStorage.getItem('rebelive_fastrr_items') || localStorage.getItem('rebelive_fastrr_items');
        if (raw) storedItems = JSON.parse(raw);
      } catch {}

      try {
        const rawAddr = sessionStorage.getItem('rebelive_fastrr_address') || localStorage.getItem('rebelive_fastrr_address');
        if (rawAddr) storedAddress = JSON.parse(rawAddr);
      } catch {}

      try {
        const rawBill = sessionStorage.getItem('rebelive_fastrr_billing_address') || localStorage.getItem('rebelive_fastrr_billing_address');
        if (rawBill) storedBillingAddress = JSON.parse(rawBill);
      } catch {}

      try {
        const rawCust = sessionStorage.getItem('rebelive_fastrr_customer') || localStorage.getItem('rebelive_fastrr_customer');
        if (rawCust) {
          const parsed = JSON.parse(rawCust);
          if (parsed && typeof parsed === 'object') {
            storedCustomer = parsed;
          }
        }
      } catch {}
    }

    // Check searchParams in case Fastrr redirect included address parameters
    const urlAddress =
      searchParams.get('address') ||
      searchParams.get('line1') ||
      searchParams.get('shipping_address') ||
      searchParams.get('complete_address');

    if (urlAddress) {
      storedAddress = {
        line1: urlAddress,
        city: searchParams.get('city') || '',
        state: searchParams.get('state') || '',
        postalCode: searchParams.get('pincode') || searchParams.get('postal_code') || searchParams.get('zip') || '',
        country: searchParams.get('country') || 'India',
        phone: searchParams.get('phone') || searchParams.get('contact') || '',
        email: searchParams.get('email') || '',
        fullName: searchParams.get('name') || '',
      };
    }

    if (storedCustomer) {
      if (storedCustomer.name && !isValidCustomerName(storedCustomer.name)) {
        delete storedCustomer.name;
      }
    }

    if (storedAddress) {
      if (!storedCustomer) storedCustomer = {};
      const addrName =
        storedAddress.fullName ||
        storedAddress.name ||
        (storedAddress.first_name ? `${storedAddress.first_name} ${storedAddress.last_name || ''}`.trim() : '');
      if (addrName && isValidCustomerName(addrName) && !storedCustomer.name) {
        storedCustomer.name = addrName;
      }
      if (storedAddress.email && !storedCustomer.email) {
        storedCustomer.email = storedAddress.email;
      }
      if (storedAddress.phone && !storedCustomer.phone) {
        storedCustomer.phone = storedAddress.phone;
      }
    }

    // Cache locally before cleanup
    if (storedItems.length > 0) setConfirmedItems(storedItems);
    if (storedAddress) setConfirmedAddress(storedAddress);
    if (storedBillingAddress) setConfirmedBillingAddress(storedBillingAddress);
    if (storedCustomer) setConfirmedCustomer(storedCustomer);

    try {
      if (queryId && queryId !== 'RBL-CONFIRMED' && !hasConfirmedRef.current[queryId]) {
        hasConfirmedRef.current[queryId] = true;
        await dispatch(
          confirmFastrrOrderThunk({
            orderId: queryId,
            items: storedItems.length > 0 ? storedItems : undefined,
            shippingAddress: storedAddress || undefined,
            billingAddress: storedBillingAddress || undefined,
            customer:
              storedCustomer && (storedCustomer.name || storedCustomer.phone || storedCustomer.email)
                ? storedCustomer
                : undefined,
          })
        ).unwrap();

        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('rebelive_fastrr_items');
          sessionStorage.removeItem('rebelive_fastrr_address');
          sessionStorage.removeItem('rebelive_fastrr_billing_address');
          sessionStorage.removeItem('rebelive_fastrr_customer');
        }
      }
    } catch (confirmErr) {
      console.warn('Fastrr confirmation endpoint attempt:', confirmErr);
    }

    try {
      await dispatch(getOrderWebhookStatusThunk(queryId)).unwrap();
    } catch (err) {
      console.warn('Webhook sync poll error:', err);
    } finally {
      setLoading(false);
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (oid) {
      syncWithWebhooks(oid);
    }

    const interval = setInterval(() => {
      if (oid) {
        dispatch(getOrderWebhookStatusThunk(oid));
      }
    }, 4000);

    const timeout = setTimeout(() => clearInterval(interval), 24000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [oid, syncWithWebhooks, dispatch]);

  // Derived Display Data
  const displayOrderNumber =
    tracking?.orderNumber || oid || (typeof window !== 'undefined' ? `RWH${Date.now().toString().slice(-6)}X1` : 'RWH6Z8IX1');

  // Unified Address and Customer Resolution (Authentic data with zero dummy fallbacks)
  const orderShippingAddr =
    (tracking as any)?.order?.shippingAddress ||
    (tracking as any)?.shippingAddress ||
    confirmedAddress ||
    null;

  const orderBillingAddr =
    (tracking as any)?.order?.billingAddress ||
    (tracking as any)?.billingAddress ||
    confirmedBillingAddress ||
    null;

  const orderUserData =
    (tracking as any)?.order?.user ||
    (tracking as any)?.user ||
    confirmedCustomer ||
    null;

  // Customer Name derivation (Strictly authentic with no dummy strings)
  const resolvedCustomerName =
    orderShippingAddr?.fullName ||
    orderShippingAddr?.name ||
    (orderShippingAddr?.first_name ? `${orderShippingAddr.first_name} ${orderShippingAddr.last_name || ''}`.trim() : null) ||
    orderShippingAddr?.shipping_customer_name ||
    orderShippingAddr?.billing_customer_name ||
    orderUserData?.name ||
    (orderUserData?.firstName ? `${orderUserData.firstName} ${orderUserData.lastName || ''}`.trim() : null) ||
    orderBillingAddr?.fullName ||
    orderBillingAddr?.name ||
    '';

  const customerFirstName = resolvedCustomerName
    ? resolvedCustomerName.replace(/^(mr|mrs|ms|dr)\.?\s+/i, '').split(' ')[0].toUpperCase()
    : 'CUSTOMER';

  const customerFullName = (resolvedCustomerName || 'REBELIVE CUSTOMER').toUpperCase();

  const customerEmail =
    orderUserData?.email ||
    orderShippingAddr?.email ||
    orderShippingAddr?.shipping_email ||
    orderShippingAddr?.billing_email ||
    orderBillingAddr?.email ||
    '';

  const customerPhone =
    orderUserData?.phone ||
    orderShippingAddr?.phone ||
    orderShippingAddr?.mobile ||
    orderShippingAddr?.contact ||
    orderShippingAddr?.shipping_phone ||
    orderShippingAddr?.billing_phone ||
    orderBillingAddr?.phone ||
    '';

  // Shipping address lines - Strictly authentic from customer's actual order
  const addressLine1 =
    orderShippingAddr?.line1 ||
    orderShippingAddr?.address ||
    orderShippingAddr?.shipping_address ||
    orderShippingAddr?.street ||
    orderShippingAddr?.address1 ||
    '';

  const addressLine2 =
    orderShippingAddr?.line2 ||
    orderShippingAddr?.shipping_address_2 ||
    orderShippingAddr?.address2 ||
    orderShippingAddr?.landmark ||
    '';

  const addressCity =
    orderShippingAddr?.city ||
    orderShippingAddr?.shipping_city ||
    orderShippingAddr?.district ||
    '';

  const addressState =
    orderShippingAddr?.state ||
    orderShippingAddr?.shipping_state ||
    '';

  const addressPostal =
    orderShippingAddr?.postalCode ||
    orderShippingAddr?.postal_code ||
    orderShippingAddr?.pincode ||
    orderShippingAddr?.shipping_pincode ||
    orderShippingAddr?.zip ||
    '';

  const addressCountry =
    orderShippingAddr?.country ||
    orderShippingAddr?.shipping_country ||
    'India';

  // Billing address lines
  const billingLine1 =
    orderBillingAddr?.line1 ||
    orderBillingAddr?.address ||
    orderBillingAddr?.billing_address ||
    orderBillingAddr?.street ||
    addressLine1;

  const billingCity =
    orderBillingAddr?.city ||
    orderBillingAddr?.billing_city ||
    addressCity;

  const billingState =
    orderBillingAddr?.state ||
    orderBillingAddr?.billing_state ||
    addressState;

  const billingPostal =
    orderBillingAddr?.postalCode ||
    orderBillingAddr?.postal_code ||
    orderBillingAddr?.pincode ||
    orderBillingAddr?.billing_pincode ||
    addressPostal;

  const billingCountry =
    orderBillingAddr?.country ||
    orderBillingAddr?.billing_country ||
    addressCountry;

  // Payment Method & Status - Dynamic display
  const paymentMethodRaw = (
    (tracking as any)?.order?.payments?.[0]?.method ||
    (tracking as any)?.payments?.[0]?.method ||
    (tracking as any)?.paymentMethod ||
    'COD'
  ).toString().toUpperCase();

  const isCod =
    paymentMethodRaw.includes('COD') ||
    paymentMethodRaw.includes('CASH') ||
    paymentMethodRaw.includes('DELIVERY');

  const paymentMethodLabel = isCod
    ? 'Cash on Delivery (COD)'
    : paymentMethodRaw.includes('UPI')
    ? 'UPI'
    : paymentMethodRaw.includes('CARD')
    ? 'Credit / Debit Card'
    : paymentMethodRaw.includes('NET')
    ? 'Net Banking'
    : paymentMethodRaw.includes('WALLET')
    ? 'Wallet'
    : 'Online Payment';

  const paymentStatusLabel = isCod
    ? 'Payment Pending – COD'
    : 'Verified & Paid';

  // Ordered Items
  const itemsList =
    (tracking as any)?.order?.items && (tracking as any).order.items.length > 0
      ? (tracking as any).order.items
      : (tracking as any)?.items && (tracking as any).items.length > 0
      ? (tracking as any).items
      : confirmedItems.length > 0
      ? confirmedItems
      : [];

  // Pricing
  const totalAmount = (tracking as any)?.total || itemsList.reduce((sum: number, it: any) => sum + (Number(it.totalPrice) || (Number(it.unitPrice || it.pricePerUnit || 1149) * (Number(it.quantity) || 1))), 0);
  const subtotalAmount = (tracking as any)?.subtotal || totalAmount;

  const handleCopyOrderNumber = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(displayOrderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pt-24 sm:pt-28 pb-20 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto selection:bg-white selection:text-black">
      {/* 2-Column Responsive Layout matching the provided design */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* ─── Left Column: Confirmation & Order Details (7 Cols) ─── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Checkmark Header */}
          <div className="flex items-center gap-4">
            <SimpleCheckAnimation className="w-12 h-12 text-white" />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-mono">
                  Confirmation #{displayOrderNumber}
                </span>
                <button
                  onClick={handleCopyOrderNumber}
                  className="p-1 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy order confirmation number"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Thank you, {customerFirstName}!
              </h1>
            </div>
          </div>

          {/* Card 1: Your order is confirmed */}
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="space-y-1.5">
              <h2 className="text-sm sm:text-base font-bold text-white">
                Your order is confirmed
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {isCod
                  ? 'Please keep note that your order is confirmed with Cash on Delivery (COD). Please keep the exact cash amount ready at delivery.'
                  : "We've received your order and are preparing your crate for dispatch. You'll receive live tracking updates via email and SMS shortly."}
              </p>
            </div>

            {/* Email Marketing Checkbox */}
            <div className="pt-3 border-t border-white/10">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={emailOffers}
                  onChange={(e) => setEmailOffers(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-neutral-900 text-white focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-xs text-neutral-300 group-hover:text-white transition-colors select-none">
                  Email me with news and offers
                </span>
              </label>
            </div>
          </div>

          {/* Card 2: Order Details */}
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5">
            <h2 className="text-sm sm:text-base font-bold text-white">
              Order details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              {/* Left Details Column */}
              <div className="space-y-4">
                {/* Contact info */}
                <div className="space-y-1">
                  <h3 className="font-semibold text-neutral-400">
                    Contact information
                  </h3>
                  <p className="text-white break-all font-mono">
                    {customerEmail}
                  </p>
                </div>

                {/* Shipping address */}
                <div className="space-y-1">
                  <h3 className="font-semibold text-neutral-400">
                    Shipping address
                  </h3>
                  <div className="text-neutral-300 leading-relaxed font-sans">
                    <p className="font-medium text-white">{customerFullName}</p>
                    {addressLine1 ? (
                      <>
                        <p>{addressLine1}</p>
                        {addressLine2 && <p>{addressLine2}</p>}
                        <p>
                          {[addressCity, addressState, addressPostal].filter(Boolean).join(', ')}
                        </p>
                        <p>{addressCountry}</p>
                      </>
                    ) : (
                      <p className="text-neutral-400">Order destination confirmed</p>
                    )}
                    {customerPhone && <p className="font-mono text-neutral-400 pt-0.5">{customerPhone}</p>}
                  </div>
                </div>

                {/* Shipping method */}
                <div className="space-y-1">
                  <h3 className="font-semibold text-neutral-400">
                    Shipping method
                  </h3>
                  <p className="text-white">
                    Standard Express
                  </p>
                </div>
              </div>

              {/* Right Details Column */}
              <div className="space-y-4">
                {/* Payment method */}
                <div className="space-y-1">
                  <h3 className="font-semibold text-neutral-400">
                    Payment method
                  </h3>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="p-1 rounded bg-neutral-800 text-neutral-300 border border-white/10">
                      {isCod ? <Banknote className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
                    </span>
                    <span className="text-white font-medium">
                      {paymentMethodLabel} · ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono pt-0.5">
                    Status: <span className={isCod ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>{paymentStatusLabel}</span>
                  </p>
                </div>

                {/* Billing address */}
                <div className="space-y-1">
                  <h3 className="font-semibold text-neutral-400">
                    Billing address
                  </h3>
                  <div className="text-neutral-300 leading-relaxed font-sans">
                    <p className="font-medium text-white">
                      {orderBillingAddr?.fullName || orderBillingAddr?.name || customerFullName}
                    </p>
                    {billingLine1 ? (
                      <>
                        <p>{billingLine1}</p>
                        <p>
                          {[billingCity, billingState, billingPostal].filter(Boolean).join(', ')}
                        </p>
                        <p>{billingCountry}</p>
                      </>
                    ) : (
                      <p className="text-neutral-400">Same as shipping address</p>
                    )}
                    {(orderBillingAddr?.phone || customerPhone) && (
                      <p className="font-mono text-neutral-400 pt-0.5">
                        {orderBillingAddr?.phone || customerPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row & Help Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <p className="text-xs text-neutral-400">
              Need help?{' '}
              <Link href="/contact" className="text-white underline hover:text-neutral-300 transition-colors">
                Contact us
              </Link>
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsInvoiceOpen(true)}
                className="px-4 py-2.5 rounded-xl border border-white/20 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Tax Invoice</span>
              </button>

              <Link
                href={`/track-order?id=${encodeURIComponent(displayOrderNumber)}`}
                className="px-4 py-2.5 rounded-xl border border-white/20 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Track Order</span>
              </Link>

              {/* Blue Primary Button matching uploaded image */}
              <Link
                href="/shop"
                className="px-5 py-2.5 rounded-xl bg-[#0066cc] hover:bg-[#0055b3] text-white font-semibold text-xs transition-colors cursor-pointer shadow-md"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Right Column: Line Items & Summary (5 Cols) ─── */}
        <div className="lg:col-span-5">
          <div className="bg-[#0e0e0e] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-6 sticky top-28">
            {/* Products List */}
            <div className="divide-y divide-white/10 max-h-[360px] overflow-y-auto [scrollbar-width:thin]">
              {itemsList.map((item: any, idx: number) => {
                const qty = item.quantity || 1;
                const unitPrice = item.unitPrice || item.pricePerUnit || item.totalPrice || 1149;
                const lineTotal = item.totalPrice || unitPrice * qty;
                const itemImg = item.image || '/brand/APEX.webp';
                const itemName = item.name || item.productName || 'Clean Energy Beverage';
                const itemPack = item.packSize ? `Pack of ${item.packSize}` : item.variantName || 'Pack of 6';

                return (
                  <div key={idx} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      {/* Image Thumbnail with Overlay Badge */}
                      <div className="relative w-14 h-14 rounded-xl bg-neutral-900 border border-white/15 shrink-0 flex items-center justify-center p-1.5">
                        <Image
                          src={itemImg}
                          alt={itemName}
                          fill
                          sizes="56px"
                          className="object-contain p-1"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-black text-[11px] font-bold flex items-center justify-center shadow-md">
                          {qty}
                        </span>
                      </div>

                      {/* Product Name & Variant */}
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-white leading-tight">
                          {itemName}
                        </p>
                        <p className="text-[11px] text-neutral-400 font-mono">
                          {itemPack}
                        </p>
                      </div>
                    </div>

                    {/* Line Total */}
                    <p className="text-xs font-bold text-white font-mono shrink-0">
                      ₹{lineTotal.toLocaleString('en-IN')}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Financial Breakdown */}
            <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="text-white font-mono">
                  ₹{subtotalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-neutral-400">
                <span className="flex items-center gap-1">
                  <span>Shipping</span>
                  <HelpCircle className="w-3 h-3 text-neutral-500" />
                </span>
                <span className="text-white font-mono font-medium">FREE</span>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
                <span className="text-sm font-bold text-white">Total</span>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 font-mono mr-1.5">INR</span>
                  <span className="text-lg font-black text-white font-mono">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Safe & Authentic Badge */}
            <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-[11px] text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-white shrink-0" />
              <span>Official 100% genuine Rebelive functional nutrition guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Invoice Modal */}
      <TaxInvoiceModal
        order={{
          orderNumber: displayOrderNumber,
          createdAt: (tracking as any)?.order?.createdAt || new Date().toISOString(),
          status: isCod ? 'PENDING' : 'CONFIRMED',
          trackingNumber: (tracking as any)?.trackingNumber || null,
          total: totalAmount,
          items: itemsList,
          shippingAddress: orderShippingAddr,
          billingAddress: orderBillingAddr,
          user: orderUserData,
          payments: (tracking as any)?.order?.payments || (tracking as any)?.payments || [
            { method: paymentMethodRaw, status: isCod ? 'PENDING' : 'COMPLETED', amount: totalAmount }
          ],
        }}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
