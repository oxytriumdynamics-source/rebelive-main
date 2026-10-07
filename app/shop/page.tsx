'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Zap,
  ArrowRight,
  X,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_PRODUCTS, PRODUCTS, PRICES, PackSize, Product } from '@/data/products';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart, openCart } from '@/store/slices/cartSlice';

const CartDrawer = dynamic(() => import('@/components/shop/CartDrawer').then((m) => m.CartDrawer), {
  ssr: false,
});

const SANS = "'Poppins', sans-serif";
const MONO = "'Poppins', sans-serif";

export default function ShopPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'single' | 'bundle'>('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Quick-Add Modal Popup State
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [modalPack, setModalPack] = useState<PackSize>(3);
  const [modalQty, setModalQty] = useState<number>(1);

  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.items);
  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);

  const filteredProducts = ALL_PRODUCTS.filter((p) => {
    if (selectedCategory === 'single') return p.id !== 'variety';
    if (selectedCategory === 'bundle') return p.id === 'variety';
    return true;
  });

  const handleOpenQuickAdd = (product: Product, defaultPack: PackSize = 3) => {
    setQuickAddProduct(product);
    setModalPack(defaultPack);
    setModalQty(1);
  };

  const handleConfirmAddToCart = () => {
    if (!quickAddProduct) return;
    dispatch(
      addToCart({
        id: quickAddProduct.id,
        name: quickAddProduct.name,
        flavor: quickAddProduct.flavor,
        image: quickAddProduct.image || quickAddProduct.canImage,
        packSize: modalPack,
        quantity: modalQty,
        pricePerUnit: PRICES[modalPack].price,
      })
    );
    setQuickAddProduct(null);
    dispatch(openCart());
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

      <div className="min-h-screen bg-transparent text-white select-none relative overflow-x-hidden">

        {/* Subtle ambient light in pure monochrome */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[450px] rounded-full blur-3xl pointer-events-none -z-10 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          }}
        />

        {/* ── Main Shop Content ── */}
        <main className="pt-24 sm:pt-32 pb-24 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto relative z-10">
          {/* ── Top Header / Breadcrumb ── */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase leading-tight">
                Shop REBELIVE
              </h1>
            </div>
          </div>

        

          {/* ── Compact Premium Product Grid (Pure Black & White Theme) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mt-8">
            {filteredProducts.map((p) => {
              const isVariety = p.id === 'variety';

              return (
                <div
                  key={p.id}
                  className="group relative bg-[#0e0e0e] rounded-2xl border border-white/10 hover:border-white/30 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.85)] hover:-translate-y-1 overflow-hidden"
                >
                  {/* Subtle top edge highlight in pure silver/white */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                  {/* ── Upper Section: Header Tag & Can Graphic ── */}
                  <div>


                    {/* Can Showcase (Clickable to details) */}
                    <Link
                      href={`/shop/${p.id}`}
                      className="relative h-44 sm:h-48 w-full flex items-center justify-center my-2 cursor-pointer block"
                      title={`View ${p.name} Details`}
                    >
                      {/* Monochrome Silver/White Ambient Glow */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-15 group-hover:opacity-30 transition-opacity duration-500 blur-xl pointer-events-none"
                        style={{
                          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
                        }}
                      />

                      {/* Display authentic Can Render */}
                      {isVariety ? (
                        /* Variety Pack: Trio of Cans */
                        <div className="relative w-full h-full flex items-center justify-center">
                          <div className="relative w-24 h-36 -mr-10 -rotate-6 z-10 transition-transform duration-500 group-hover:-translate-x-2 group-hover:-rotate-12">
                            <Image
                              src="/products/aviva.webp"
                              alt="AVIVA"
                              fill
                              sizes="120px"
                              className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]"
                            />
                          </div>
                          <div className="relative w-28 h-40 z-20 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
                            <Image
                              src="/products/apex.webp"
                              alt="APEX"
                              fill
                              sizes="140px"
                              className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)]"
                            />
                          </div>
                          <div className="relative w-24 h-36 -ml-10 rotate-6 z-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:rotate-12">
                            <Image
                              src="/products/capella.webp"
                              alt="CAPELLA"
                              fill
                              sizes="120px"
                              className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.85)]"
                            />
                          </div>
                        </div>
                      ) : (
                        /* Single Flagship Can Render */
                        <div className="relative w-36 sm:w-40 h-40 sm:h-44 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
                          <Image
                            src={p.image || p.canImage}
                            alt={p.name}
                            fill
                            sizes="180px"
                            className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]"
                            priority={p.id === 'apex'}
                          />
                        </div>
                      )}
                    </Link>

                    {/* Title & Descriptor */}
                    <div className="mt-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <Link
                          href={`/shop/${p.id}`}
                          className="hover:underline"
                        >
                          <h2 className="text-xl font-bold tracking-tight text-white uppercase flex items-center gap-1.5">
                            <span>{p.name}</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-white" />
                          </h2>
                        </Link>
                    
                      </div>

                      <p className="text-[11px] text-white/55 mt-0.5 truncate font-light">
                        {p.tagline || p.description}
                      </p>

                      {/* Clean Monochrome specs line */}
                      <div className="flex items-center gap-1.5 text-[10px] text-white/45 mt-1.5 pb-2.5 border-b border-white/10">
                        <span className="text-white/80 font-mono">
                          {p.volume}
                        </span>
                   
                        <Link
                          href={`/shop/${p.id}`}
                          className="ml-auto text-[9.5px] text-white/40 uppercase font-mono hover:text-white transition-colors"
                        >
                          Details →
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* ── Lower Area: Starting Price + ADD TO CART Button ── */}
                  <div className="mt-3.5">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-[9.5px] text-white/40 uppercase font-mono block">
                          STARTING AT
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold text-white tracking-tight font-mono">
                            ₹449
                          </span>
                          <span className="text-[11px] text-white/35 line-through font-mono">
                            ₹499
                          </span>
                        </div>
                      </div>

                      <span className="text-[9.5px] text-white/70 font-mono font-medium px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10">
                        PACK OF 3, 6, 9, 12
                      </span>
                    </div>

                    {/* Action Button: Click to Open Quick-Add Popup */}
                    <button
                      type="button"
                      onClick={() => handleOpenQuickAdd(p, 3)}
                      className="w-full py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-[0_2px_15px_rgba(255,255,255,0.2)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.35)] active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* ── Quick-Add Modal Popup (Pure Black & White Aesthetic) ── */}
        <AnimatePresence>
          {quickAddProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Dimmed backdrop - background clearly visible */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setQuickAddProduct(null)}
                className="absolute inset-0 bg-black/40 transition-opacity duration-200 cursor-pointer"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="relative w-full max-w-md bg-[#0a0a0ae5] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden text-white z-10"
              >
                {/* Specular hairline top glow */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                {/* Header: Name & Close */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-mono text-xl font-bold uppercase tracking-tight text-white">
                      {quickAddProduct.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-white/80">
                      {quickAddProduct.flavor}
                    </span>
                  </div>

                  <button
                    onClick={() => setQuickAddProduct(null)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Pack Selection (3, 6, 9, 12) */}
                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center justify-between text-xs font-mono text-white/50 uppercase">
                    <span>Choose Pack Size:</span>
                    <span className="text-white/80">{PRICES[modalPack].discount}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {([3, 6, 9, 12] as PackSize[]).map((size) => {
                      const isSelected = modalPack === size;
                      const info = PRICES[size];
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setModalPack(size);
                          }}
                          className={`p-3.5 rounded-2xl text-center transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] ring-2 ring-white scale-[1.02]'
                              : 'bg-white/[0.04] text-white/80 hover:bg-white/[0.08] hover:text-white border border-white/10'
                          }`}
                        >
                          <div className="font-mono text-xs font-bold uppercase">
                            Pack of {size}
                          </div>
                          <div className="my-1.5">
                            <span className="font-mono text-base font-black">
                              ₹{info.price}
                            </span>
                            <span className={`text-[10px] line-through ml-1 font-mono ${isSelected ? 'text-black/50' : 'text-white/40'}`}>
                              ₹{info.mrp}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Confirm Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleConfirmAddToCart}
                  className="w-full py-4 rounded-2xl bg-white text-black hover:bg-neutral-200 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Confirm &amp; Add to Cart • ₹{PRICES[modalPack].price}</span>
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}
