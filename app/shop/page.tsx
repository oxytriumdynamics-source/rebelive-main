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
import { PRICES, PackSize, Product } from '@/data/products';
import { fetchProducts, selectProducts, selectProductsLoading, selectProductsError } from '@/store/slices/productSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart, openCart } from '@/store/slices/cartSlice';
import { launchFastrrCheckout, getVariantId, IS_INSTANT_CHECKOUT_PAUSED } from '@/lib/fastrrCheckout';
import { NotFoundState } from '@/components/ui/NotFoundState';
import { ShopSkeleton } from '@/components/ui/Skeleton';
import { ProductCardImageCarousel } from '@/components/shop/ProductCardImageCarousel';

const CartDrawer = dynamic(() => import('@/components/shop/CartDrawer').then((m) => m.CartDrawer), {
  ssr: false,
});

const SANS = "'Poppins', sans-serif";
const MONO = "'Poppins', sans-serif";

export default function ShopPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'single' | 'bundle'>('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [isInstantBuying, setIsInstantBuying] = useState<boolean>(false);

  // Redux state from productSlice
  const productsList = useAppSelector(selectProducts);
  const reduxLoading = useAppSelector(selectProductsLoading);
  const reduxError = useAppSelector(selectProductsError);

  const isLoading = reduxLoading && productsList.length === 0;
  const isError = Boolean(reduxError) && productsList.length === 0;

  // Quick-Add Modal Popup State
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [modalPack, setModalPack] = useState<PackSize>(3);
  const [modalQty, setModalQty] = useState<number>(1);

  const cart = useAppSelector((state) => state.cart.items);
  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);

  // Load products via Redux dispatch
  React.useEffect(() => {
    dispatch(fetchProducts(false));
  }, [dispatch]);

  const handleRetry = async () => {
    setIsRetrying(true);
    await dispatch(fetchProducts(true));
    setIsRetrying(false);
  };

  const filteredProducts = productsList.filter((p) => {
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
    const variantMatch = (quickAddProduct.variants && quickAddProduct.variants.length > 0)
      ? quickAddProduct.variants.find((v) => {
          const pack = Number(modalPack);
          return (
            v.sizeMl === pack * 250 ||
            v.sizeMl === pack ||
            v.sku.toUpperCase().includes(`PACK-${pack}`) ||
            new RegExp(`\\b${pack}\\b`, 'i').test(v.name)
          );
        })
      : null;
    const finalPrice = variantMatch ? variantMatch.price : (PRICES[modalPack]?.price ?? 449);

    dispatch(
      addToCart({
        id: quickAddProduct.id,
        name: quickAddProduct.name,
        flavor: quickAddProduct.flavor,
        image: quickAddProduct.image || quickAddProduct.canImage,
        packSize: modalPack,
        quantity: modalQty,
        pricePerUnit: finalPrice,
      })
    );
    setQuickAddProduct(null);
    dispatch(openCart());
  };

  if (isLoading) {
    return <ShopSkeleton />;
  }

  if (isError || productsList.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-24 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto relative z-10 flex items-center justify-center">
        <NotFoundState
          code="404"
          badge="CATALOG_UNAVAILABLE"
          title="Products Unavailable"
          description="Unable to load products from the backend server. The database may be disconnected or undergoing updates. Please try again."
          onRetry={handleRetry}
          isRetrying={isRetrying}
          actionHref="/"
          actionLabel="Return Home"
          showHomeButton={false}
          isEmbedded={true}
        />
      </main>
    );
  }

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
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] max-w-[90vw] h-[550px] rounded-full blur-3xl pointer-events-none -z-10 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          }}
        />

        {/* ── Main Shop Content ── */}
        <main className="pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-10 xl:px-12 max-w-[1340px] mx-auto relative z-10">
          {/* ── Top Header / Breadcrumb ── */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase leading-tight">
                Shop REBELIVE
              </h1>
            </div>
          </div>

        

          {/* ── Compact Premium Product Grid (Pure Black & White Theme) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8">
            {filteredProducts.map((p) => {
              const isVariety = p.id === 'variety';

              return (
                <div
                  key={p.id}
                  className="group relative bg-[#0e0e0e] rounded-2xl border border-white/10 hover:border-white/30 flex flex-col justify-between transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.85)] hover:-translate-y-1 overflow-hidden transform-gpu will-change-transform [backface-visibility:hidden]"
                >
                  {/* Subtle top edge highlight in pure silver/white */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none z-20" />

                  {/* ── Upper Section: Full Image Showcase with bottom fade ── */}
                  <div className="relative">
                    {/* Can Showcase with Hover Image Carousel (Clickable to details) */}
                    <Link
                      href={`/shop/${p.id}`}
                      className="relative w-full aspect-square overflow-hidden block cursor-pointer bg-[#0e0e0e]"
                      title={`View ${p.name} Details`}
                    >
                      {/* Monochrome Silver/White Ambient Glow - positioned safely behind with z-0 */}
                      <div
                        className="absolute inset-x-0 top-0 bottom-6 opacity-15 group-hover:opacity-30 transition-opacity duration-500 blur-xl pointer-events-none z-0"
                        style={{
                          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
                        }}
                      />

                      {/* Dynamic Multi-Angle Image Carousel on Hover */}
                      <ProductCardImageCarousel product={p} priority={p.id === 'apex'} />
                    </Link>

                    {/* Title & Descriptor with 1px overlap & solid card background to eliminate subpixel gap */}
                    <div className="px-4 sm:px-5 pt-3 -mt-[1px] relative z-20 bg-[#0e0e0e]">
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
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3.5 mt-auto">
                    {(() => {
                      const startingVariant = (p.variants && p.variants.length > 0)
                        ? p.variants.reduce((min, v) => (v.price < min.price ? v : min), p.variants[0])
                        : null;
                      const startingPrice = startingVariant?.price ?? p.startingPrice ?? 0;
                      const startingMrp = startingVariant?.compareAtPrice ?? p.compareAtPrice ?? null;

                      const packNumbers = (p.variants && p.variants.length > 0)
                        ? p.variants.map((v) => {
                            const match = v.name.match(/\b(3|6|9|12)\b/) || v.sku.match(/(?:PACK|PK)[-_]?(\d+)/i) || (v.sizeMl ? [null, Math.round(v.sizeMl / 250)] : null);
                            return match ? Number(match[1]) : null;
                          }).filter(Boolean) as number[]
                        : [3, 6, 9, 12];
                      const uniquePacks = [...new Set(packNumbers)].sort((a, b) => a - b);
                      const packBadgeLabel = uniquePacks.length > 0 ? `PACK OF ${uniquePacks.join(', ')}` : 'PACK OF 3, 6, 9, 12';

                      return (
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <span className="text-[9.5px] text-white/40 uppercase font-mono block">
                              STARTING AT
                            </span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg font-bold text-white tracking-tight font-mono">
                                ₹{startingPrice.toLocaleString('en-IN')}
                              </span>
                              {startingMrp && startingMrp > startingPrice && (
                                <span className="text-[11px] text-white/35 line-through font-mono">
                                  ₹{startingMrp.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="text-[9.5px] text-white/70 font-mono font-medium px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10">
                            {packBadgeLabel}
                          </span>
                        </div>
                      );
                    })()}

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
                    <span className="text-emerald-400 font-bold">{PRICES[modalPack].discount}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {([3, 6, 9, 12] as PackSize[]).map((size) => {
                      const isSelected = modalPack === size;
                      const varMatch = (quickAddProduct.variants && quickAddProduct.variants.length > 0)
                        ? quickAddProduct.variants.find((v) => {
                            const pack = Number(size);
                            return (
                              v.sizeMl === pack * 250 ||
                              v.sizeMl === pack ||
                              v.sku.toUpperCase().includes(`PACK-${pack}`) ||
                              new RegExp(`\\b${pack}\\b`, 'i').test(v.name)
                            );
                          })
                        : null;
                      const displayPrice = varMatch?.price ?? PRICES[size]?.price ?? 449;
                      const displayMrp = varMatch?.compareAtPrice ?? PRICES[size]?.mrp ?? 499;

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
                              ₹{displayPrice}
                            </span>
                            {displayMrp && displayMrp > displayPrice && (
                              <span className={`text-[10px] line-through ml-1 font-mono ${isSelected ? 'text-black/50' : 'text-white/40'}`}>
                                ₹{displayMrp}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Confirm Add to Cart and Instant Checkout Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleConfirmAddToCart}
                    className="w-full py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/20 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    type="button"
                    disabled={isInstantBuying || IS_INSTANT_CHECKOUT_PAUSED}
                    onClick={async (e) => {
                      if (!quickAddProduct) return;
                      try {
                        setIsInstantBuying(true);
                        const varMatch = (quickAddProduct.variants && quickAddProduct.variants.length > 0)
                          ? quickAddProduct.variants.find((v) => {
                              const pack = Number(modalPack);
                              return (
                                v.sizeMl === pack * 250 ||
                                v.sizeMl === pack ||
                                v.sku.toUpperCase().includes(`PACK-${pack}`) ||
                                new RegExp(`\\b${pack}\\b`, 'i').test(v.name)
                              );
                            })
                          : null;
                        const finalPrice = varMatch ? varMatch.price : (PRICES[modalPack]?.price ?? 449);
                        const finalVarId = varMatch ? String(varMatch.id) : String(getVariantId(quickAddProduct.id, modalPack));

                        const itemToBuy = {
                          productId: quickAddProduct.id,
                          slug: quickAddProduct.id,
                          variantId: finalVarId,
                          name: quickAddProduct.name,
                          flavor: quickAddProduct.flavor,
                          packSize: modalPack,
                          quantity: 1,
                          unitPrice: finalPrice,
                          image: quickAddProduct.image || quickAddProduct.canImage,
                        };
                        setQuickAddProduct(null);
                        await launchFastrrCheckout(e, [itemToBuy]);
                      } catch (err: any) {
                        console.warn('Fastrr checkout error:', err);
                        dispatch(openCart());
                      } finally {
                        setIsInstantBuying(false);
                      }
                    }}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                      IS_INSTANT_CHECKOUT_PAUSED
                        ? 'bg-white/10 text-white/40 border border-white/10 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-neutral-200 cursor-pointer shadow-white/20 active:scale-[0.98] disabled:opacity-60'
                    }`}
                  >
                    <Zap className={`w-3.5 h-3.5 ${IS_INSTANT_CHECKOUT_PAUSED ? 'text-white/30 fill-white/30' : 'text-black fill-black'}`} />
                    <span>
                      {IS_INSTANT_CHECKOUT_PAUSED
                        ? 'Checkout Paused'
                        : isInstantBuying
                        ? 'Connecting Fastrr...'
                        : 'Instant Buy'}
                    </span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
