'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, X, Plus, Minus, Check, Truck, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  closeCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from '@/store/slices/cartSlice';
import { launchFastrrCheckout, getVariantId, IS_INSTANT_CHECKOUT_PAUSED } from '@/lib/fastrrCheckout';

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.cart);
  const [isLaunching, setIsLaunching] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleInstantCheckout = async (e: React.MouseEvent) => {
    try {
      setCheckoutError(null);
      setIsLaunching(true);
      await launchFastrrCheckout(
        e,
        items.map((i) => ({
          productId: i.id,
          slug: i.id,
          variantId: getVariantId(i.id, i.packSize),
          name: i.name,
          flavor: i.flavor,
          packSize: i.packSize,
          quantity: i.quantity,
          unitPrice: i.pricePerUnit,
          image: i.image,
        }))
      );
      dispatch(closeCart());
    } catch (err: any) {
      setCheckoutError(err.message || 'Unable to open Fastrr checkout');
    } finally {
      setIsLaunching(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        dispatch(closeCart());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.pricePerUnit * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-[100] select-none">
      {/* Backdrop - background clearly visible with gentle dim */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity duration-300 cursor-pointer"
        onClick={() => dispatch(closeCart())}
      />

      {/* Slide-out drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#0e0e0ee5] backdrop-blur-xl border-l border-white/10 text-white p-6 sm:p-7 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.9)] z-10 animate-in slide-in-from-right duration-300"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                  YOUR CART
                </h3>
                <p className="text-[10px] text-white/50 tracking-wider font-mono">
                  {totalCount} {totalCount === 1 ? 'PACK IN YOUR CART' : 'PACKS IN YOUR CART'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                dispatch(closeCart());
              }}
              className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

      

          {/* Items List */}
          <div className="mt-4 space-y-3 max-h-[52vh] overflow-y-auto pr-1">
            {items.length === 0 ? (
              <div className="py-16 text-center text-white/50 text-xs tracking-wider uppercase flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-6 h-6 text-white/20" />
                </div>
                <p className="font-semibold text-white/80">YOUR CART IS EMPTY</p>
                <p className="text-[11px] text-white/40 mt-1 max-w-[260px] normal-case">
                  Choose your pack. Your next level starts here.
                </p>
                <Link
                  href="/shop"
                  onClick={() => dispatch(closeCart())}
                  className="mt-5 px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors uppercase tracking-wider inline-flex items-center gap-1.5"
                >
                  <span>Explore Shop</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.id}-${item.packSize}`}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3 group"
                >
                  {/* Can Thumbnail */}
                  <div className="w-12 h-16 relative shrink-0 bg-white/[0.02] rounded-lg border border-white/5 flex items-center justify-center p-1">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                        unoptimized={item.image.startsWith('http')}
                      />
                    ) : (
                      <span className="text-[9px] font-mono font-bold text-white/50 tracking-wider">
                        {item.name ? item.name.slice(0, 3).toUpperCase() : 'CAN'}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs uppercase truncate text-white">
                        {item.name}
                      </h4>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/70 font-mono">
                        {item.packSize} CANS
                      </span>
                    </div>
                    <div className="text-[10px] text-white/50 uppercase mt-0.5 truncate">
                      {item.flavor}
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xs font-bold text-white">
                        ₹{(item.pricePerUnit * item.quantity).toLocaleString('en-IN')}
                      </span>
                
                    </div>
                  </div>

                  {/* Stepper + Delete */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-center border border-white/15 rounded-lg bg-white/[0.06] px-1.5 py-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity > 1) {
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                packSize: item.packSize,
                                quantity: item.quantity - 1,
                              })
                            );
                          } else {
                            dispatch(
                              removeFromCart({
                                id: item.id,
                                packSize: item.packSize,
                              })
                            );
                          }
                        }}
                        className="p-1 text-white/60 hover:text-white cursor-pointer active:scale-90 transition-transform"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="w-5 text-center text-xs font-semibold text-white font-mono">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              packSize: item.packSize,
                              quantity: item.quantity + 1,
                            })
                          );
                        }}
                        className="p-1 text-white/60 hover:text-white cursor-pointer active:scale-90 transition-transform"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        dispatch(
                          removeFromCart({
                            id: item.id,
                            packSize: item.packSize,
                          })
                        );
                      }}
                      className="text-[10px] text-white/35 hover:text-red-400 transition-colors uppercase font-mono tracking-wider"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-3.5">
            <div className="space-y-1.5 text-xs tracking-wider">
              <div className="flex items-center justify-between text-white/60">
                <span>Subtotal</span>
                <span className="font-bold text-base text-white font-mono">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-emerald-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Pan-India Express Delivery
                </span>
                <span className="font-bold uppercase font-mono">FREE</span>
              </div>
              <div className="flex items-center justify-between text-white/45 text-[10px]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-white/50" /> Quality Verified & Sealed
                </span>
                <span>INCLUDED</span>
              </div>
            </div>

            {checkoutError && (
              <p className="text-[11px] text-red-400 font-mono text-center px-1">
                {checkoutError}
              </p>
            )}

            <button
              id="cart-fastrr-checkout-btn"
              disabled={isLaunching || IS_INSTANT_CHECKOUT_PAUSED}
              onClick={handleInstantCheckout}
              className={`w-full py-3.5 rounded-xl text-xs font-bold tracking-[0.18em] uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-white/10 ${
                IS_INSTANT_CHECKOUT_PAUSED
                  ? 'bg-white/10 text-white/40 border border-white/10 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-neutral-200 cursor-pointer active:scale-[0.98] disabled:opacity-60'
              }`}
            >
              <Zap className={`w-4 h-4 ${IS_INSTANT_CHECKOUT_PAUSED ? 'text-white/40 fill-white/40' : 'text-black fill-black'}`} />
              <span>
                {IS_INSTANT_CHECKOUT_PAUSED
                  ? 'Checkout Temporarily Paused'
                  : isLaunching
                  ? 'Connecting Fastrr...'
                  : `Instant Checkout • ₹${subtotal.toLocaleString('en-IN')}`}
              </span>
            </button>
            {IS_INSTANT_CHECKOUT_PAUSED ? (
              <p className="text-[10px] text-amber-400/80 font-mono text-center tracking-wider uppercase">
                Instant checkout is temporarily paused for maintenance
              </p>
            ) : (
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/50 font-mono tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>POWERED BY SHIPROCKET FASTRR 1-CLICK</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
