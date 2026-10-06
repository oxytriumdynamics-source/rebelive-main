'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ArrowLeft,
  Check,
  Truck,
  ShieldCheck,
  Zap,
  Star,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Droplets,
  RotateCcw,
  ArrowRight,
  FlaskConical,
  Flame,
  Maximize2,
  X,
  Layers,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { LampContainer } from '@/components/ui/lamp';

const MenuDrawer = dynamic(() => import('@/components/ui/MenuDrawer').then((m) => m.MenuDrawer), {
  ssr: false,
});
const CartDrawer = dynamic(() => import('@/components/shop/CartDrawer').then((m) => m.CartDrawer), {
  ssr: false,
});

import { TestimonialsSection } from '@/components/sections/TestimonialsSection';

import {
  getProductById,
  ALL_PRODUCTS,
  PRODUCTS,
  Product,
  PRICES,
  PackSize,
} from '@/data/products';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart, openCart } from '@/store/slices/cartSlice';

const SANS = "'Poppins', sans-serif";
const MONO = "'Poppins', sans-serif";

interface NutritionFactRow {
  nutrient: string;
  per100ml: string;
  perServe: string;
  rda: string;
}

interface AdditionalInfoData {
  productName: string;
  servingSize: string;
  nutrients: NutritionFactRow[];
  notes: string[];
}

const PRODUCT_ADDITIONAL_INFO: Record<string, AdditionalInfoData> = {
  apex: {
    productName: 'APEX',
    servingSize: '250 ml',
    nutrients: [
      { nutrient: 'Energy (kCal)', per100ml: '9.33', perServe: '23.325', rda: '1.17%' },
      { nutrient: 'Total Fat (g)', per100ml: '0', perServe: '0', rda: '0' },
      { nutrient: 'Carbohydrates (g)', per100ml: '2.33', perServe: '5.825', rda: '10.79%' },
      { nutrient: 'Total Sugars (g)', per100ml: '1.9', perServe: '4.75', rda: '0' },
      { nutrient: 'Added Sugars (g)', per100ml: '0', perServe: '0', rda: '0' },
      { nutrient: 'Dietary Fiber (g)', per100ml: '1.48', perServe: '3.7', rda: '12.33%' },
      { nutrient: 'Protein (g)', per100ml: '0', perServe: '0', rda: '0' },
      { nutrient: 'Sodium (mg)', per100ml: '2.97', perServe: '7.425', rda: '0.37%' },
      { nutrient: 'Potassium (mg)', per100ml: '55.98', perServe: '139.95', rda: '4.00%' },
      { nutrient: 'Magnesium (mg)', per100ml: '49.77', perServe: '124.425', rda: '32.32%' },
      { nutrient: 'Caffeine (mg)', per100ml: '18', perServe: '45', rda: '15.00%' },
      { nutrient: 'Vitamin B6 (mg)', per100ml: '0.39', perServe: '0.975', rda: '40.63%' },
      { nutrient: 'Vitamin B9 (mcg)', per100ml: '36.39', perServe: '90.975', rda: '30.33%' },
      { nutrient: 'Vitamin B12 (mcg)', per100ml: '0.21', perServe: '0.525', rda: '21.00%' },
    ],
    notes: [
      '* Approximate Value',
      '** Based on 2000 kCal Diet',
    ],
  },
  capella: {
    productName: 'CAPELLA',
    servingSize: '250 ml',
    nutrients: [
      { nutrient: 'Energy (kCal)', per100ml: '10.78', perServe: '26.950', rda: '1.35%' },
      { nutrient: 'Total Fat (g)', per100ml: '0', perServe: '0', rda: '0' },
      { nutrient: 'Carbohydrates (g)', per100ml: '2.69', perServe: '6.725', rda: '12.45%' },
      { nutrient: 'Total Sugars (g)', per100ml: '1.8', perServe: '4.500', rda: '0' },
      { nutrient: 'Added Sugars (g)', per100ml: '0', perServe: '0', rda: '0' },
      { nutrient: 'Dietary Fiber (g)', per100ml: '1.56', perServe: '3.900', rda: '13.00%' },
      { nutrient: 'Protein (g)', per100ml: '0', perServe: '0', rda: '0' },
      { nutrient: 'Sodium (mg)', per100ml: '3.11', perServe: '7.775', rda: '0.39%' },
      { nutrient: 'Potassium (mg)', per100ml: '60.86', perServe: '152.150', rda: '4.35%' },
      { nutrient: 'Magnesium (mg)', per100ml: '53.33', perServe: '133.325', rda: '34.63%' },
      { nutrient: 'Caffeine (mg)', per100ml: '19', perServe: '47.500', rda: '15.83%' },
      { nutrient: 'Vitamin B6 (mg)', per100ml: '0.33', perServe: '0.825', rda: '34.38%' },
      { nutrient: 'Vitamin B9 (mcg)', per100ml: '45.79', perServe: '114.475', rda: '38.16%' },
      { nutrient: 'Vitamin B12 (mcg)', per100ml: '0.13', perServe: '0.325', rda: '13.00%' },
    ],
    notes: [
      '* Approximate Value',
      '** Based on 2000 kCal Diet',
    ],
  },
  aviva: {
    productName: 'AVIVA',
    servingSize: '250 ml',
    nutrients: [
      { nutrient: 'Energy (kCal)', per100ml: '9.63', perServe: '24.075', rda: '1.20%' },
      { nutrient: 'Total Fat (g)', per100ml: '0', perServe: '0', rda: '0' },
      { nutrient: 'Carbohydrates (g)', per100ml: '2.4', perServe: '6.000', rda: '11.10%' },
      { nutrient: 'Total Sugars (g)', per100ml: '1.79', perServe: '4.475', rda: '0' },
      { nutrient: 'Added Sugars (g)', per100ml: '0', perServe: '0', rda: '0' },
      { nutrient: 'Dietary Fiber (g)', per100ml: '1.52', perServe: '3.800', rda: '12.70%' },
      { nutrient: 'Protein (g)', per100ml: '0', perServe: '0', rda: '0' },
      { nutrient: 'Sodium (mg)', per100ml: '3.04', perServe: '7.600', rda: '0.40%' },
      { nutrient: 'Potassium (mg)', per100ml: '55.1', perServe: '137.750', rda: '3.90%' },
      { nutrient: 'Magnesium (mg)', per100ml: '48.92', perServe: '122.300', rda: '31.80%' },
      { nutrient: 'Caffeine (mg)', per100ml: '17', perServe: '42.500', rda: '14.20%' },
      { nutrient: 'Vitamin B6 (mg)', per100ml: '0.43', perServe: '1.075', rda: '44.80%' },
      { nutrient: 'Vitamin B9 (mcg)', per100ml: '33.25', perServe: '83.125', rda: '27.70%' },
      { nutrient: 'Vitamin B12 (mcg)', per100ml: '0.23', perServe: '0.575', rda: '23.00%' },
    ],
    notes: [
      '* Approximate Value',
      '** Based on 2000 kCal Diet',
    ],
  },
};

interface BenefitBoxItem {
  id: string;
  icons: string[];
  title: React.ReactNode;
  desc: React.ReactNode;
}

const BENEFIT_BOXES: BenefitBoxItem[] = [
  {
    id: 'caffeine-theanine',
    icons: [
      '/benifits/Rebelive Corporate Pilot (7).png',
      '/benifits/Rebelive Corporate Pilot (6).png',
    ],
    title: (
      <>
        <span className="block">Natural Caffeine</span>
        <span className="block text-white/50 font-normal my-0.5">&amp;</span>
        <span className="block">L-Theanine</span>
      </>
    ),
    desc: (
      <>
        50 mg of natural caffeine paired with 75 mg of L-theanine, crafted for steady energy and sharper focus.
      </>
    ),
  },
  {
    id: 'ashwagandha-magnesium',
    icons: [
      '/benifits/Rebelive Corporate Pilot (5).png',
      '/benifits/Rebelive Corporate Pilot (4).png',
    ],
    title: (
      <>
        <span className="block">Ashwagandha</span>
        <span className="block text-white/50 font-normal my-0.5">&amp;</span>
        <span className="block">Magnesium</span>
      </>
    ),
    desc: (
      <>
        250 mg of Ashwagandha with magnesium, thoughtfully formulated for calmer moments and everyday recovery.
      </>
    ),
  },
  {
    id: 'gut-health',
    icons: ['/benifits/Rebelive Corporate Pilot (3) (1).png'],
    title: (
      <>
        <span className="block">Prebiotics</span>
        <span className="block text-white/50 font-normal my-0.5">&amp;</span>
        <span className="block">Probiotics</span>
      </>
    ),
    desc: (
      <>
        FOS prebiotics paired with Bacillus clausii UBBC-07, bringing together ingredients made for everyday gut and digestive wellness.
      </>
    ),
  },
  {
    id: 'vitamins-potassium',
    icons: [
      '/benifits/Rebelive Corporate Pilot.png',
      '/benifits/Rebelive Corporate Pilot (1).png',
    ],
    title: (
      <>
        <span className="block">Vitamin B6, B9, B12</span>
        <span className="block text-white/50 font-normal my-0.5">&amp;</span>
        <span className="block">Potassium</span>
      </>
    ),
    desc: (
      <>
       Vitamins B6, B9 and B12 with potassium, bringing together key nutrients for everyday metabolism and electrolyte balance.
      </>
    ),
  },
  {
    id: 'zero-sugar',
    icons: ['/benifits/Rebelive Corporate Pilot (2).png'],
    title: (
      <>
        <div>
          <span className="font-black text-white">ZERO</span> added Sugar
        </div>
        <div className="mt-0.5">
          <span className="font-black text-white">NO</span> artificial colors
        </div>
      </>
    ),
    desc: (
      <>
        Naturally Sweetened with{' '}
        <strong className="font-bold text-white">Monkfruit</strong>
      </>
    ),
  },
];

interface ComparisonRow {
  feature: string;
  rebelive: {
    type: 'text' | 'check' | 'cross';
    value?: string;
    sub?: string;
  };
  energyDrink: {
    type: 'text' | 'check' | 'cross';
    value?: string;
  };
  coffee: {
    type: 'text' | 'check' | 'cross';
    value?: string;
  };
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: 'Natural Caffeine + L-Theanine',
    rebelive: {
      type: 'text',
      value: '50 mg + 75 mg',
    },
    energyDrink: {
      type: 'text',
      value: 'Caffeine only',
    },
    coffee: {
      type: 'text',
      value: 'Caffeine only',
    },
  },
  {
    feature: 'Zero Added Sugar',
    rebelive: {
      type: 'check',
    },
    energyDrink: {
      type: 'cross',
    },
    coffee: {
      type: 'cross',
    },
  },
  {
    feature: 'Artificial Colors',
    rebelive: {
      type: 'cross',
    },
    energyDrink: {
      type: 'check',
    },
    coffee: {
      type: 'cross',
    },
  },
  {
    feature: 'Artificial Sweeteners',
    rebelive: {
      type: 'cross',
    },
    energyDrink: {
      type: 'check',
    },
    coffee: {
      type: 'check',
    },
  },
  {
    feature: 'Naturally Sweetened with Monk Fruit',
    rebelive: {
      type: 'check',
    },
    energyDrink: {
      type: 'cross',
    },
    coffee: {
      type: 'cross',
    },
  },
  {
    feature: 'Stress Relief Support',
    rebelive: {
      type: 'check',
    },
    energyDrink: {
      type: 'cross',
    },
    coffee: {
      type: 'cross',
    },
  },
  {
    feature: 'Gut Support',
    rebelive: {
      type: 'check',
    },
    energyDrink: {
      type: 'cross',
    },
    coffee: {
      type: 'cross',
    },
  },
  {
    feature: 'Electrolytes',
    rebelive: {
      type: 'text',
      value: 'Potassium + Magnesium',
    },
    energyDrink: {
      type: 'cross',
    },
    coffee: {
      type: 'cross',
    },
  },
  {
    feature: 'Fatigue Recovery Support',
    rebelive: {
      type: 'check',
    },
    energyDrink: {
      type: 'cross',
    },
    coffee: {
      type: 'cross',
    },
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = (params?.id as string) || 'apex';

  const product = useMemo(() => {
    return getProductById(productId) || ALL_PRODUCTS[0];
  }, [productId]);

  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Pack size selection: Pack of 3, 6, 9, or 12 cans
  const [packSize, setPackSize] = useState<PackSize>(6);
  const [quantity, setQuantity] = useState<number>(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'nutrition' | 'shipping'>('specs');

  // ── Dropdown Accordions (Description & Additional Info) ──
  const [isDescOpen, setIsDescOpen] = useState<boolean>(false);
  const [isAdditionalInfoOpen, setIsAdditionalInfoOpen] = useState<boolean>(false);

  // ── Benefits Horizontal Carousel Ref ──
  const benefitsCarouselRef = useRef<HTMLDivElement>(null);

  // ── Photo Gallery State ──
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Reset photo index when product changes
  useEffect(() => {
    setSelectedPhotoIndex(0);
  }, [productId]);

  const galleryList = useMemo(() => {
    if (product.gallery && product.gallery.length > 0) {
      return product.gallery;
    }
    return [
      { id: 'render', label: '3D Studio Render', src: product.image || product.canImage, type: 'render' as const },
      { id: 'clean', label: 'Clean Silhouette', src: product.renderImage || product.image, type: 'render' as const },
      { id: 'wrap', label: '360° Can Wrap', src: product.canImage, type: 'wrap' as const },
      { id: 'logo', label: 'Brand Emblem', src: product.brandLogo, type: 'logo' as const },
      { id: 'mood', label: 'Atmosphere Visual', src: product.bgImage, type: 'mood' as const },
    ];
  }, [product]);

  const activePhoto = galleryList[selectedPhotoIndex] || galleryList[0];

  const handleNextPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev + 1) % galleryList.length);
  };

  const handlePrevPhoto = () => {
    setSelectedPhotoIndex((prev) => (prev - 1 + galleryList.length) % galleryList.length);
  };

  // Keyboard navigation for photo gallery / lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase() || '')) return;
      if (isLightboxOpen) {
        if (e.key === 'Escape') setIsLightboxOpen(false);
        if (e.key === 'ArrowRight') setSelectedPhotoIndex((prev) => (prev + 1) % galleryList.length);
        if (e.key === 'ArrowLeft') setSelectedPhotoIndex((prev) => (prev - 1 + galleryList.length) % galleryList.length);
      }
    };
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, galleryList.length]);

  const pricing = PRICES[packSize];
  const totalPrice = pricing.price * quantity;
  const isVariety = product.id === 'variety';

  // Other products for "Explore Other Flavors" section
  const otherProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((p) => p.id !== product.id);
  }, [product.id]);

  const handleAddToCart = () => {
    setIsAddedAnimation(true);
    setTimeout(() => setIsAddedAnimation(false), 1200);

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        flavor: product.flavor,
        image: product.image || product.canImage,
        packSize,
        quantity,
        pricePerUnit: pricing.price,
      })
    );
  };

  const handleQuickBuy = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        flavor: product.flavor,
        image: product.image || product.canImage,
        packSize,
        quantity,
        pricePerUnit: pricing.price,
      })
    );
    dispatch(openCart());
  };

  return (
    <>
      <style>{`
        html {
          position: static !important;
          overflow-x: clip !important;
          overflow-y: auto !important;
          height: auto !important;
        }
        body {
          position: static !important;
          overflow: visible !important;
          overflow-x: visible !important;
          overflow-y: visible !important;
          height: auto !important;
          inset: auto !important;
        }
      `}</style>

      <div className="min-h-screen bg-transparent text-white select-none relative">

        {/* Dynamic Atmospheric Ambient Glow */}
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[90vw] max-w-[850px] h-[350px] sm:h-[550px] rounded-full blur-3xl pointer-events-none -z-10 opacity-30 transition-all duration-700"
        />

        {/* ── Main PDP Container ── */}
        <main className="pt-20 sm:pt-28 md:pt-32 pb-16 sm:pb-24 px-3 sm:px-6 md:px-8 max-w-6xl mx-auto relative z-10">

          {/* ── Product Hero: Two Column Grid (side-by-side on tablet/desktop, stacked on mobile) ── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-12 mt-4 sm:mt-8 md:mt-10 items-start">
            {/* ── Left Column: Showcase & Photo Options (6 cols on tablet/desktop) ── */}
            <div className="md:col-span-6 flex flex-col items-center md:sticky md:top-24 md:z-20 self-start w-full">
              {/* Main Can Showcase Card */}
              <div className="relative w-full aspect-square sm:aspect-[4/4.2] md:aspect-square rounded-2xl sm:rounded-3xl bg-[#0e0e0e] border border-white/10 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center overflow-hidden group shadow-[0_12px_45px_rgba(0,0,0,0.7)]">
                {/* Edge Highlights */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

                {/* Backlight Halo in Monochrome Silver */}
                <div
                  className="absolute inset-4 sm:inset-8 rounded-full blur-3xl opacity-20 group-hover:opacity-35 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
                  }}
                />

                {/* Top Info Bar: Angle Badge + Fullscreen Lightbox Button */}
                <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-5 sm:right-5 flex items-center justify-between z-20 pointer-events-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      {selectedPhotoIndex + 1} / {galleryList.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white transition-all backdrop-blur-md flex items-center gap-1 text-[10px] sm:text-[11px] font-mono cursor-pointer"
                    title="Inspect High-Res Photo"
                  >
                    <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden xs:inline pr-1">Zoom</span>
                  </button>
                </div>

                {/* Navigation Chevrons: always touch-friendly on mobile/tablet */}
                {galleryList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevPhoto();
                      }}
                      className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-white/25 border border-white/15 text-white/90 hover:text-white transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 backdrop-blur-md cursor-pointer shadow-lg"
                      aria-label="Previous Photo"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextPhoto();
                      }}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-white/25 border border-white/15 text-white/90 hover:text-white transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 backdrop-blur-md cursor-pointer shadow-lg"
                      aria-label="Next Photo"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Interactive Center Stage Render / Photo */}
                <div
                  className="relative w-full h-[220px] xs:h-[260px] sm:h-[300px] md:h-[320px] lg:h-[340px] flex items-center justify-center z-10 cursor-zoom-in"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  {isVariety && selectedPhotoIndex === 0 ? (
                    /* Variety Pack: Trio Cluster */
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="relative w-24 xs:w-28 sm:w-36 h-36 xs:h-44 sm:h-56 -mr-8 xs:-mr-12 sm:-mr-16 -rotate-6 z-10 transition-transform duration-500 group-hover:-translate-x-3 group-hover:-rotate-12">
                        <Image
                          src="/products/aviva.png"
                          alt="AVIVA"
                          fill
                          sizes="(max-width: 640px) 120px, 180px"
                          className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
                        />
                      </div>
                      <div className="relative w-28 xs:w-34 sm:w-44 h-42 xs:h-50 sm:h-64 z-20 transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                        <Image
                          src="/products/apex.png"
                          alt="APEX"
                          fill
                          sizes="(max-width: 640px) 140px, 200px"
                          priority
                          className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)]"
                        />
                      </div>
                      <div className="relative w-24 xs:w-28 sm:w-36 h-36 xs:h-44 sm:h-56 -ml-8 xs:-ml-12 sm:-ml-16 rotate-6 z-10 transition-transform duration-500 group-hover:translate-x-3 group-hover:rotate-12">
                        <Image
                          src="/products/capella.png"
                          alt="CAPELLA"
                          fill
                          sizes="(max-width: 640px) 120px, 180px"
                          className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Selected Photo View */
                    <div className="relative w-36 xs:w-44 sm:w-56 md:w-56 lg:w-60 h-52 xs:h-60 sm:h-72 md:h-72 lg:h-76 transition-all duration-300 group-hover:scale-[1.03]">
                      <Image
                        key={activePhoto.src}
                        src={activePhoto.src}
                        alt={`${product.name} - ${activePhoto.label}`}
                        fill
                        sizes="(max-width: 640px) 220px, (max-width: 1024px) 300px, 400px"
                        priority
                        className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transition-all duration-300"
                      />
                    </div>
                  )}
                </div>

                {/* Bottom Core Specs Ticker (Monochrome) */}

              </div>

              {/* ── Photo Options Thumbnails Carousel ── */}
              <div className="w-full mt-3 sm:mt-4 flex flex-col gap-2">
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2 md:gap-2.5 w-full">
                  {galleryList.map((item, idx) => {
                    const isSelected = selectedPhotoIndex === idx;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={`group relative rounded-lg sm:rounded-xl aspect-square p-1 sm:p-1.5 flex flex-col items-center justify-center transition-all duration-200 overflow-hidden border cursor-pointer ${isSelected
                          ? 'bg-neutral-900 border-white scale-[1.02]'
                          : 'bg-neutral-950/70 border-white/10 hover:border-white/40 hover:bg-neutral-900/60 opacity-60 hover:opacity-100'
                          }`}
                        title={item.label}
                      >
                        <div className="relative w-full h-full flex items-center justify-center">
                          <Image
                            src={item.src}
                            alt={item.label}
                            fill
                            sizes="70px"
                            className="object-contain p-0.5 sm:p-1 group-hover:scale-105 transition-transform"
                          />
                        </div>

                        {/* Subtle Active Accent Dot */}
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white" />
                        )}

                        {/* Mini Label badge on hover */}
                        <div className="absolute inset-x-0 bottom-0 py-0.5 bg-black/85 backdrop-blur-sm text-[8px] font-mono text-center text-white/80 truncate px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Right Column: Specs, Pricing, Pack Selector & CTAs (6 cols on tablet/desktop) ── */}
            <div className="md:col-span-6 flex flex-col justify-between mt-4 md:mt-0 w-full">
              <div>
                {/* Big Title & Flavor / Category Tag */}
                <div className="mt-1 sm:mt-3">
                  <h1 className="text-3xl xs:text-4xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base font-semibold text-white/70 mt-1 uppercase tracking-wider font-mono">
                    {['apex', 'capella', 'aviva'].includes(product.id.toLowerCase())
                      ? 'FUNCTIONAL BEVERAGE'
                      : product.flavor}
                  </p>
                  <p className="text-xs sm:text-sm text-white/75 mt-2 font-light leading-relaxed max-w-xl">
                    {['apex', 'capella', 'aviva'].includes(product.id.toLowerCase())
                      ? 'Rebelive functional beverage is a zero-added-sugar functional beverage crafted to support sustained energy, focus, stress management, hydration, and gut health. Powered by natural caffeine, L-theanine, Ashwagandha, magnesium, electrolytes, vitamins, prebiotics, and probiotics, it’s designed to help you stay energized, balanced, and ready for whatever comes next.'
                      : product.description}
                  </p>
                </div>

                {/* Dynamic Price Display (Monochrome) */}
                <div className="mt-4 sm:mt-5 p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-baseline justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-baseline gap-2 sm:gap-2.5 flex-wrap">
                        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                          ₹{pricing.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs sm:text-sm text-white/40 line-through font-mono">
                          ₹{pricing.mrp.toLocaleString('en-IN')}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold tracking-wider uppercase border border-white/15 font-mono">
                          {pricing.discount}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-white/50 mt-0.5 font-mono">
                        Includes all taxes
                      </p>
                    </div>
                  </div>

                  {/* Pack Selector (Pack of 3, 6, 9, 12) */}
                  <div className="mt-3.5 sm:mt-4">
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-white/50 mb-2">
                      SELECT ALLOCATION SIZE
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                      {([3, 6, 9, 12] as PackSize[]).map((size) => {
                        const isSelected = packSize === size;
                        const info = PRICES[size];
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              setPackSize(size);
                            }}
                            className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${isSelected
                              ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                              : 'bg-white/[0.04] text-white/80 border-white/10 hover:border-white/25 hover:bg-white/[0.07]'
                              }`}
                          >
                            <div className="font-bold text-xs uppercase tracking-wider">
                              Pack of {size}
                            </div>
                            <div className="text-[11px] mt-1 font-semibold opacity-90 font-mono">
                              ₹{info.price.toLocaleString('en-IN')}
                            </div>
                            <div className="text-[9px] font-mono opacity-70 mt-0.5">
                              ₹{info.perCan}/can
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantity Stepper + Live Total */}
                  <div className="mt-3.5 sm:mt-4 pt-3 sm:pt-3.5 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span className="text-xs text-white/60 font-medium">Quantity:</span>
                      <div className="flex items-center border border-white/20 rounded-xl bg-white/[0.05] px-2 py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setQuantity((prev) => Math.max(1, prev - 1));
                          }}
                          className="p-1 text-white/60 hover:text-white cursor-pointer active:scale-90 transition-transform"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-white font-mono">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setQuantity((prev) => prev + 1);
                          }}
                          className="p-1 text-white/60 hover:text-white cursor-pointer active:scale-90 transition-transform"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-white/40 uppercase font-mono block">
                        TOTAL AMOUNT
                      </span>
                      <span className="text-base sm:text-lg font-bold text-white font-mono">
                        ₹{totalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-3.5 sm:mt-4">
                  {/* Add To Cart */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="py-3 sm:py-3.5 px-4 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-[0_4px_25px_rgba(255,255,255,0.25)] hover:shadow-[0_6px_30px_rgba(255,255,255,0.4)] active:scale-[0.98] flex items-center justify-center gap-2 group"
                  >
                    {isAddedAnimation ? (
                      <>
                        <Check className="w-4 h-4 text-black stroke-[3]" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  {/* Express Checkout */}
                  <button
                    type="button"
                    onClick={handleQuickBuy}
                    className="py-3 sm:py-3.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/20 hover:border-white/40 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span>Instant Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* ── Product Dropdowns: Description & Additional Information ── */}
                {(() => {
                  const currentKey = (product?.id || productId || 'apex').toLowerCase();
                  const currentInfo = PRODUCT_ADDITIONAL_INFO[currentKey] || PRODUCT_ADDITIONAL_INFO.apex;

                  return (
                    <div className="mt-5 space-y-2.5">
                      {/* 1. DESCRIPTION ACCORDION */}
                      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-200">
                        <button
                          type="button"
                          onClick={() => setIsDescOpen((prev) => !prev)}
                          className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors cursor-pointer"
                          aria-expanded={isDescOpen}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs sm:text-[13px] font-bold tracking-wider uppercase text-white font-mono">
                              DESCRIPTION
                            </span>
                            <span className="text-[10px] text-white/40 uppercase font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                              250 ml
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-white/60 transition-transform duration-300 ${isDescOpen ? 'rotate-180 text-white' : ''
                              }`}
                          />
                        </button>

                        {isDescOpen && (
                          <div className="px-3.5 sm:px-4 pb-4 pt-1 border-t border-white/5 space-y-3.5 text-xs text-white/80 animate-in fade-in duration-200">
                            {/* Net Quantity & Vegetarian Status */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
                              {/* Vegetarian Logo (Official Green Square & Circle) */}
                              <div
                                className="w-5 h-5 border-2 border-emerald-500 rounded-sm flex items-center justify-center p-0.5 bg-black/60 shadow-[0_0_12px_rgba(16,185,129,0.3)] shrink-0"
                                title="100% Vegetarian"
                              >
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] text-white/40 uppercase font-mono block">
                                  Net Quantity
                                </span>
                                <span className="text-xs font-bold text-white font-mono">
                                  250 ml
                                </span>
                              </div>
                            </div>

                            {/* Ingredients */}
                            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                              <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono block">
                                INGREDIENTS:
                              </span>
                              <p className="text-xs text-white/70 leading-relaxed font-light">
                                Carbonated Water, Fructo-oligosaccharides (FOS), Acidity Regulator (INS 345), Acidity Regulator (INS 332(ii)), Acidity Regulator (INS 330), Nature Identical Flavouring Substances, Ashwagandha (KSM-66®), Bacillus clausii, Monk Fruit Extract, L-Theanine, Natural Caffeine Extract, Preservative (INS 211), Vitamin Premix (B6, B9, B12).
                              </p>
                            </div>

                            {/* Nutrition Facts Table: 3 Columns (Nutrients, Per 100 ml, %RDA per serve) */}
                            <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                              <div className="p-3 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
                                <div>
                                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono block">
                                    Nutrition Facts
                                  </span>
                                  <span className="text-[10px] text-white/50 font-mono">
                                    1 serving per container (250 ml)
                                  </span>
                                </div>
                                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/80">
                                  {currentInfo.productName}
                                </span>
                              </div>

                              <div className="overflow-x-auto [scrollbar-width:thin] scrollbar-thin scrollbar-thumb-white/20">
                                <table className="w-full text-left text-[11px] sm:text-xs font-mono">
                                  <thead>
                                    <tr className="border-b border-white/10 text-[9px] sm:text-[10px] uppercase tracking-wider text-white/50 bg-white/[0.01]">
                                      <th className="py-2 px-2 sm:px-3 font-semibold text-white/70">Nutrients</th>
                                      <th className="py-2 px-2 sm:px-3 font-semibold text-white/70 text-center">Per 100 ml</th>
                                      <th className="py-2 px-2 sm:px-3 font-semibold text-white/70 text-right">%RDA per serve</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-white/5">
                                    {currentInfo.nutrients.map((item, idx) => (
                                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-1.5 sm:py-2 px-2 sm:px-3 text-white/85 font-medium">{item.nutrient}</td>
                                        <td className="py-1.5 sm:py-2 px-2 sm:px-3 text-white/70 text-center">{item.per100ml}</td>
                                        <td className="py-1.5 sm:py-2 px-2 sm:px-3 text-white/90 text-right font-semibold">
                                          {item.rda}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              <div className="p-2.5 border-t border-white/10 text-[10px] text-white/40 font-mono space-y-0.5 bg-white/[0.01]">
                                {currentInfo.notes.map((note, idx) => (
                                  <p key={idx}>{note}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 2. ADDITIONAL INFORMATION ACCORDION */}
                      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-200">
                        <button
                          type="button"
                          onClick={() => setIsAdditionalInfoOpen((prev) => !prev)}
                          className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors cursor-pointer"
                          aria-expanded={isAdditionalInfoOpen}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs sm:text-[13px] font-bold tracking-wider uppercase text-white font-mono">
                              ADDITIONAL INFORMATION
                            </span>
                            <span className="text-[10px] text-white/40 uppercase font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                              Usage &amp; Regulatory
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-white/60 transition-transform duration-300 ${isAdditionalInfoOpen ? 'rotate-180 text-white' : ''
                              }`}
                          />
                        </button>

                        {isAdditionalInfoOpen && (
                          <div className="px-3.5 sm:px-4 pb-4 pt-2 border-t border-white/5 space-y-3 text-xs text-white/80 animate-in fade-in duration-200 font-sans">
                            {/* Recommended Usage & Directions */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div className="p-3 rounded-xl bg-white/[0.025] border border-white/5 space-y-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block font-semibold">
                                  Recommended Usage
                                </span>
                                <p className="text-xs text-white/90 font-medium">
                                  Consume not more than 500 ml per day.
                                </p>
                              </div>

                              <div className="p-3 rounded-xl bg-white/[0.025] border border-white/5 space-y-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block font-semibold">
                                  Directions for Use
                                </span>
                                <p className="text-xs text-white/90 font-medium">
                                  Best served chilled.
                                </p>
                              </div>
                            </div>

                            {/* Storage */}
                            <div className="p-3 rounded-xl bg-white/[0.025] border border-white/5 space-y-1">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block font-semibold">
                                Storage
                              </span>
                              <p className="text-xs text-white/80 font-normal">
                                Store in a cool and dry place. Avoid direct sunlight.
                              </p>
                            </div>

                            {/* Disclaimer */}
                            <div className="p-3 rounded-xl bg-amber-500/[0.04] border border-amber-500/20 space-y-1">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80 block font-semibold">
                                Disclaimer
                              </span>
                              <p className="text-xs text-white/75 leading-relaxed font-normal">
                                Contains caffeine. Not recommended for children, pregnant or lactating women, or persons sensitive to caffeine. Not suitable for persons below 18 years of age. No medicinal or disease claims.
                              </p>
                            </div>

                            {/* Best Before & Country of Origin */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div className="p-3 rounded-xl bg-white/[0.025] border border-white/5 space-y-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block font-semibold">
                                  Best Before
                                </span>
                                <p className="text-xs text-white/90 font-medium">
                                  12 months from the date of manufacture
                                </p>
                              </div>

                              <div className="p-3 rounded-xl bg-white/[0.025] border border-white/5 space-y-1">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block font-semibold">
                                  Country of Origin
                                </span>
                                <p className="text-xs text-white/90 font-medium uppercase font-mono tracking-wider">
                                  INDIA
                                </p>
                              </div>
                            </div>

                            {/* Manufactured By & Marketed By */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div className="p-3 rounded-xl bg-white/[0.025] border border-white/5 space-y-1.5">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block font-semibold">
                                  Manufactured By
                                </span>
                                <p className="text-xs text-white/90 font-medium leading-relaxed">
                                  Patel Beverages Pvt. Ltd.<br />
                                  <span className="text-white/60 text-[11px] font-normal block mt-0.5">
                                    505/2-3-4, G.I.D.C Estate, Makarpura, Vadodara, Gujarat - 3900010
                                  </span>
                                </p>
                                <div className="pt-1.5 border-t border-white/5 flex items-center gap-1.5">
                                  <span className="text-[10px] font-mono text-white/40 uppercase">FSSAI Lic. No.</span>
                                  <span className="text-[11px] font-mono font-bold text-white/90">10013021000941</span>
                                </div>
                              </div>

                              <div className="p-3 rounded-xl bg-white/[0.025] border border-white/5 space-y-1.5">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block font-semibold">
                                  Marketed By
                                </span>
                                <p className="text-xs text-white/90 font-medium leading-relaxed">
                                  OXYTRIUM DYNAMICS PRIVATE LIMITED<br />
                                  <span className="text-white/60 text-[11px] font-normal block mt-0.5">
                                    2nd Floor, House No. 81, Ward No. 12, Manikpur, Keshopur, Rajpur, Buxar, Bihar, India, 802113
                                  </span>
                                </p>
                                <div className="pt-1.5 border-t border-white/5 flex items-center gap-1.5">
                                  <span className="text-[10px] font-mono text-white/40 uppercase">FSSAI Lic. No.</span>
                                  <span className="text-[11px] font-mono font-bold text-white/90">10013021000941</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* ── Section: Bio-Engineered Benefits (6 Boxes Matrix: 3 Up, 3 Down) ── */}
          <div className="mt-16 sm:mt-24 md:mt-28 pt-6 sm:pt-10 relative">
            {/* Header Area matching reference image */}
            <div className="relative text-center max-w-3xl mx-auto mb-10 sm:mb-14 px-4">
              {/* Soft Ambient Radial Light Halo */}
              <div
                className="absolute -top-10 left-1/2 -translate-x-1/2 w-[90vw] max-w-[540px] h-[200px] sm:h-[260px] rounded-full blur-3xl opacity-15 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.35) 0%, transparent 70%)',
                }}
              />

              {/* Top Subtle Glowing Accent Line */}
              <div className="w-32 sm:w-64 md:w-96 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent mx-auto mb-5 sm:mb-7 shadow-[0_0_16px_rgba(255,255,255,0.95)]" />

              {/* Main Heading */}
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white leading-tight">
                And we&apos;re{' '}
                <span className="relative inline-block text-white">
                  science-backed
                </span>
                , ofcourse.
              </h2>

              {/* Body Description */}
              <p className="text-xs sm:text-sm md:text-[14.5px] text-white/70 max-w-xl mx-auto leading-relaxed mt-3 sm:mt-5 font-normal tracking-wide">
                When your day demands more than just energy, a carefully crafted blend of functional ingredients delivers holistic support for{' '}
                <strong className="text-white font-semibold">focus</strong>,{' '}
                <strong className="text-white font-semibold">stress relief</strong>,{' '}
                <strong className="text-white font-semibold">hydration</strong>, and{' '}
                <strong className="text-white font-semibold">gut health</strong>-helping you feel ready for what&apos;s next.
              </p>
            </div>

            {/* Total 6 Boxes: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 relative z-10">
              {/* Box 1 (Top Left) */}
              <div className="rounded-2xl sm:rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 p-5 sm:p-6 md:p-7 flex flex-col items-center justify-between text-center transition-all duration-300 group shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_45px_rgba(255,255,255,0.06)] hover:-translate-y-1 relative min-h-[220px] sm:min-h-[240px] md:min-h-[250px]">
                <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4 sm:mb-5 w-full">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 relative flex items-center justify-center">
                    <Image
                      src={BENEFIT_BOXES[0].icons[0]}
                      alt="Natural Caffeine"
                      fill
                      sizes="60px"
                      className="object-contain invert"
                    />
                  </div>
                  <div className="w-11 h-11 sm:w-14 sm:h-14 relative flex items-center justify-center">
                    <Image
                      src={BENEFIT_BOXES[0].icons[1]}
                      alt="L-Theanine"
                      fill
                      sizes="60px"
                      className="object-contain invert"
                    />
                  </div>
                </div>
                <div className="text-sm sm:text-base md:text-[17px] font-bold text-white tracking-tight leading-snug">
                  {BENEFIT_BOXES[0].title}
                </div>
                <p className="text-xs sm:text-[13px] text-white/70 leading-relaxed font-light mt-3 sm:mt-4">
                  {BENEFIT_BOXES[0].desc}
                </p>
              </div>

              {/* Box 2 (Top Center) */}
              <div className="rounded-2xl sm:rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 p-5 sm:p-6 md:p-7 flex flex-col items-center justify-between text-center transition-all duration-300 group shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_45px_rgba(255,255,255,0.06)] hover:-translate-y-1 relative min-h-[220px] sm:min-h-[240px] md:min-h-[250px]">
                <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4 sm:mb-5 w-full">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 relative flex items-center justify-center">
                    <Image
                      src={BENEFIT_BOXES[1].icons[0]}
                      alt="Ashwagandha"
                      fill
                      sizes="60px"
                      className="object-contain invert"
                    />
                  </div>
                  <div className="w-11 h-11 sm:w-14 sm:h-14 relative flex items-center justify-center">
                    <Image
                      src={BENEFIT_BOXES[1].icons[1]}
                      alt="Magnesium"
                      fill
                      sizes="60px"
                      className="object-contain invert"
                    />
                  </div>
                </div>
                <div className="text-sm sm:text-base md:text-[17px] font-bold text-white tracking-tight leading-snug">
                  {BENEFIT_BOXES[1].title}
                </div>
                <p className="text-xs sm:text-[13px] text-white/70 leading-relaxed font-light mt-3 sm:mt-4">
                  {BENEFIT_BOXES[1].desc}
                </p>
              </div>

              {/* Box 3 (Top Right) */}
              <div className="rounded-2xl sm:rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 p-5 sm:p-6 md:p-7 flex flex-col items-center justify-between text-center transition-all duration-300 group shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_45px_rgba(255,255,255,0.06)] hover:-translate-y-1 relative min-h-[220px] sm:min-h-[240px] md:min-h-[250px]">
                <div className="flex items-center justify-center mb-4 sm:mb-5 w-full">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 relative flex items-center justify-center">
                    <Image
                      src={BENEFIT_BOXES[2].icons[0]}
                      alt="Prebiotics & Probiotics"
                      fill
                      sizes="60px"
                      className="object-contain invert"
                    />
                  </div>
                </div>
                <div className="text-sm sm:text-base md:text-[17px] font-bold text-white tracking-tight leading-snug">
                  {BENEFIT_BOXES[2].title}
                </div>
                <p className="text-xs sm:text-[13px] text-white/70 leading-relaxed font-light mt-3 sm:mt-4">
                  {BENEFIT_BOXES[2].desc}
                </p>
              </div>

              {/* Box 4 (Bottom Left) */}
              <div className="rounded-2xl sm:rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 p-5 sm:p-6 md:p-7 flex flex-col items-center justify-between text-center transition-all duration-300 group shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_45px_rgba(255,255,255,0.06)] hover:-translate-y-1 relative min-h-[220px] sm:min-h-[240px] md:min-h-[250px]">
                <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4 sm:mb-5 w-full">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 relative flex items-center justify-center">
                    <Image
                      src={BENEFIT_BOXES[3].icons[0]}
                      alt="Vitamin B6, B9, B12"
                      fill
                      sizes="60px"
                      className="object-contain invert"
                    />
                  </div>
                  <div className="w-11 h-11 sm:w-14 sm:h-14 relative flex items-center justify-center">
                    <Image
                      src={BENEFIT_BOXES[3].icons[1]}
                      alt="Potassium"
                      fill
                      sizes="60px"
                      className="object-contain invert"
                    />
                  </div>
                </div>
                <div className="text-sm sm:text-base md:text-[17px] font-bold text-white tracking-tight leading-snug">
                  {BENEFIT_BOXES[3].title}
                </div>
                <p className="text-xs sm:text-[13px] text-white/70 leading-relaxed font-light mt-3 sm:mt-4">
                  {BENEFIT_BOXES[3].desc}
                </p>
              </div>

              {/* Box 5 (Bottom Center: Product Can Showcase Card) */}
              <div className="rounded-2xl sm:rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden group shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 min-h-[220px] sm:min-h-[240px] md:min-h-[250px]">
                {/* Backlight Halo in Monochrome Silver */}
                <div
                  className="absolute inset-4 rounded-full blur-2xl opacity-20 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, transparent 70%)',
                  }}
                />
                <div className="relative w-28 xs:w-32 sm:w-40 md:w-44 h-40 xs:h-44 sm:h-52 md:h-56 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 z-10">
                  <Image
                    src={product.canImage || product.image || '/brand/apex-can.webp'}
                    alt={`${product.name} Can`}
                    fill
                    sizes="(max-width: 640px) 140px, 220px"
                    className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)]"
                  />
                </div>
              </div>

              {/* Box 6 (Bottom Right) */}
              <div className="rounded-2xl sm:rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 p-5 sm:p-6 md:p-7 flex flex-col items-center justify-between text-center transition-all duration-300 group shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_45px_rgba(255,255,255,0.06)] hover:-translate-y-1 relative min-h-[220px] sm:min-h-[240px] md:min-h-[250px]">
                <div className="flex items-center justify-center mb-4 sm:mb-5 w-full">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 relative flex items-center justify-center">
                    <Image
                      src={BENEFIT_BOXES[4].icons[0]}
                      alt="ZERO added Sugar"
                      fill
                      sizes="60px"
                      className="object-contain invert"
                    />
                  </div>
                </div>
                <div className="text-sm sm:text-base md:text-[17px] font-bold text-white tracking-tight leading-snug">
                  {BENEFIT_BOXES[4].title}
                </div>
                <p className="text-xs sm:text-[13px] text-white/70 leading-relaxed font-light mt-3 sm:mt-4">
                  {BENEFIT_BOXES[4].desc}
                </p>
              </div>
            </div>
          </div>

          {/* ── Section: Comparison Benchmark Matrix ── */}
          <div className="mt-16 sm:mt-24 pt-8 sm:pt-10 border-t border-white/10">
            {/* Header Area */}
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
              <div className="w-24 sm:w-36 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent mx-auto mb-4 sm:mb-5" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-white/50 uppercase block">
                BENCHMARK COMPARISON
              </span>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mt-1 leading-tight">
                How Rebelive Compares
              </h2>
              <p className="text-xs sm:text-sm text-white/60 mt-2 font-light max-w-lg mx-auto leading-relaxed">
                A functional formula crafted to outperform standard energy drinks and seasonal sweetened coffees.
              </p>
            </div>

            {/* Mobile swipe helper pill */}
            <div className="flex items-center justify-end md:hidden mb-2 px-1 text-[11px] font-mono text-white/50">
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-white/70">
                <span>Swipe to compare</span>
                <ArrowRight className="w-3 h-3 animate-pulse" />
              </span>
            </div>

            {/* Comparison Table Container (Horizontal Scroll on Mobile/Tablet with subtle scrollbar) */}
            <div className="overflow-x-auto [scrollbar-width:thin] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent -mx-3 px-3 sm:mx-0 sm:px-0 pt-6 sm:pt-10 pb-4">
              <div className="min-w-[580px] sm:min-w-[640px] md:min-w-full grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 items-start">
                {/* ── Column 1: Feature Labels ── */}
                <div className="flex flex-col gap-2 sm:gap-3">
                  {/* Header Spacer */}
                  <div className="h-24 sm:h-28 md:h-32 flex items-end pb-3 text-left">
                    <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-white/40 uppercase font-semibold">
                      FEATURE
                    </span>
                  </div>

                  {/* Row Pills */}
                  {COMPARISON_ROWS.map((row, idx) => (
                    <div
                      key={idx}
                      className="h-[64px] sm:h-[68px] md:h-20 flex items-center justify-center text-center px-2 sm:px-3 md:px-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10"
                    >
                      <span className="text-[11px] sm:text-xs md:text-[13px] font-semibold text-white/90 leading-tight">
                        {row.feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* ── Column 2: REBELIVE (Highlighted Elevated Column) ── */}
                <div className="flex flex-col relative z-10 -mt-5 sm:-mt-6 md:-mt-8">
                  {/* Projecting Top Header */}
                  <div className="h-[120px] sm:h-[142px] md:h-[166px] rounded-t-2xl sm:rounded-t-3xl bg-gradient-to-b from-white/[0.14] to-white/[0.08] border-t border-x border-white/30 px-2 sm:px-4 flex flex-col items-center justify-center text-center shadow-[0_-12px_35px_rgba(255,255,255,0.06)] relative">
                    <div className="relative w-32 xs:w-40 sm:w-48 md:w-56 h-8 sm:h-10 md:h-14 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] max-w-[90%]">
                      <Image
                        src="/brand/REBELIVE Logo Black.png"
                        alt="REBELIVE"
                        fill
                        className="object-contain invert"
                        priority
                      />
                    </div>
                  </div>

                  {/* Highlighted Body Rows */}
                  <div className="flex flex-col bg-white/[0.08] border-x border-white/30 rounded-b-2xl sm:rounded-b-3xl border-b shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(255,255,255,0.05)]">
                    {COMPARISON_ROWS.map((row, idx) => {
                      const isLast = idx === COMPARISON_ROWS.length - 1;
                      return (
                        <div
                          key={idx}
                          className={`h-[76px] sm:h-[80px] md:h-[92px] flex flex-col items-center justify-center text-center px-2 sm:px-3 border-t border-white/10 ${isLast ? 'rounded-b-2xl sm:rounded-b-3xl' : ''
                            }`}
                        >
                          {row.rebelive.type === 'check' ? (
                            <div className="flex flex-col items-center gap-1">
                              <div className="w-6 h-6 sm:w-7 md:w-8 sm:h-7 md:h-8 rounded-full border border-white/60 bg-white/20 flex items-center justify-center text-white shadow-[0_0_14px_rgba(255,255,255,0.35)]">
                                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                              </div>
                              {row.rebelive.value && (
                                <span className="text-[9px] sm:text-[10px] md:text-[11px] font-mono text-white/70 block">
                                  {row.rebelive.value}
                                </span>
                              )}
                            </div>
                          ) : row.rebelive.type === 'cross' ? (
                            <div className="w-6 h-6 sm:w-7 md:w-8 sm:h-7 md:h-8 rounded-full border border-white/20 bg-white/[0.06] flex items-center justify-center text-white/40">
                              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                            </div>
                          ) : (
                            <div className="px-1.5 sm:px-2">
                              <span className="text-[11px] sm:text-xs md:text-sm font-bold text-white font-mono block leading-snug">
                                {row.rebelive.value}
                              </span>
                              {row.rebelive.sub && (
                                <span className="text-[9px] sm:text-[10px] text-white/60 font-mono block mt-0.5">
                                  {row.rebelive.sub}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Column 3: Energy Drink* ── */}
                <div className="flex flex-col gap-2 sm:gap-3">
                  {/* Header */}
                  <div className="h-24 sm:h-28 md:h-32 flex flex-col items-center justify-end pb-3 text-center">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mb-1 text-white/60">
                      <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="7" y="4" width="10" height="16" rx="2" />
                        <line x1="9" y1="2" x2="15" y2="2" />
                        <line x1="12" y1="8" x2="12" y2="14" />
                        <polyline points="10 11 12 8 14 11" />
                      </svg>
                    </div>
                    <span className="text-[11px] sm:text-xs md:text-[13px] font-semibold text-white/80">
                      ENERGY DRINK*
                    </span>
                  </div>

                  {/* Row Pills */}
                  {COMPARISON_ROWS.map((row, idx) => (
                    <div
                      key={idx}
                      className="h-[64px] sm:h-[68px] md:h-20 flex items-center justify-center text-center px-2 sm:px-3 md:px-4 rounded-xl sm:rounded-2xl bg-white/[0.025] border border-white/5"
                    >
                      {row.energyDrink.type === 'check' ? (
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-white/70">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      ) : row.energyDrink.type === 'cross' ? (
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center text-white/30">
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      ) : (
                        <span className="text-[11px] sm:text-xs md:text-[13px] font-mono text-white/60">
                          {row.energyDrink.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* ── Column 4: Premium Coffee Drink** ── */}
                <div className="flex flex-col gap-2 sm:gap-3">
                  {/* Header */}
                  <div className="h-24 sm:h-28 md:h-32 flex flex-col items-center justify-end pb-3 text-center">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mb-1 text-white/60">
                      <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                        <line x1="6" y1="1" x2="6" y2="4" />
                        <line x1="10" y1="1" x2="10" y2="4" />
                        <line x1="14" y1="1" x2="14" y2="4" />
                      </svg>
                    </div>
                    <span className="text-[11px] sm:text-xs md:text-[13px] font-semibold text-white/80">
                      COFFEE DRINK **
                    </span>
                  </div>

                  {/* Row Pills */}
                  {COMPARISON_ROWS.map((row, idx) => (
                    <div
                      key={idx}
                      className="h-[64px] sm:h-[68px] md:h-20 flex items-center justify-center text-center px-2 sm:px-3 md:px-4 rounded-xl sm:rounded-2xl bg-white/[0.025] border border-white/5"
                    >
                      {row.coffee.type === 'check' ? (
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-white/70">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      ) : row.coffee.type === 'cross' ? (
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center text-white/30">
                          <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      ) : (
                        <span className="text-[11px] sm:text-xs md:text-[13px] font-mono text-white/60">
                          {row.coffee.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footnotes */}
            <div className="mt-4 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-white/40 flex-wrap gap-2 px-2">
              <p>*Based on leading commercial energy drinks</p>
              <p>**Based on leading commercial seasonal sweetened coffee drinks</p>
            </div>
          </div>

          {/* ── Section: Testimonials (Our First Rebels) ── */}
          <div className="mt-14 sm:mt-20 pt-8 sm:pt-12 border-t border-white/10 -mx-4 sm:-mx-6 md:-mx-8">
            <TestimonialsSection className="!pt-10 sm:!pt-14 !pb-10 sm:!pb-14" />
          </div>

          {/* ── Section: Explore Other Flagship Editions ── */}
          <div className="mt-14 sm:mt-20 md:mt-24 pt-10 sm:pt-12 border-t border-white/10">
            <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                  COMPLETE YOUR ALLOCATION
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight text-white mt-0.5">
                  You may also like
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs text-white/60 hover:text-white flex items-center gap-1 uppercase tracking-wider font-semibold transition-colors"
              >
                <span>View Full Store</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {otherProducts.map((other) => (
                <Link
                  key={other.id}
                  href={`/shop/${other.id}`}
                  className="p-4 sm:p-5 rounded-2xl bg-[#0e0e0e] border border-white/10 hover:border-white/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.8)] flex flex-col justify-between"
                >
                  <div>
                    <div className="relative w-full h-32 sm:h-36 my-2 sm:my-3 flex items-center justify-center">
                      <div className="relative w-24 sm:w-28 h-28 sm:h-32 transition-transform duration-300 group-hover:scale-105">
                        <Image
                          src={other.image || other.canImage}
                          alt={other.name}
                          fill
                          sizes="140px"
                          className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                        />
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold uppercase text-white tracking-tight">
                      {other.name}
                    </h3>
                    <p className="text-[11px] text-white/55 mt-0.5 line-clamp-1 font-light">
                      {other.tagline}
                    </p>
                    <div className="text-[10px] text-white/40 font-mono mt-1">
                      {other.volume}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-white font-mono">
                        ₹449
                      </span>
                      <span className="text-[10px] text-white/40 block">
                        Pack of 3, 6, 9, 12
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-white group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>

        {/* ── High-Resolution Photo Lightbox Modal ── */}
        {isLightboxOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-between p-3 sm:p-6 md:p-8 animate-in fade-in duration-200"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Bar with Title & Close */}
            <div className="w-full max-w-6xl flex items-center justify-between z-30 pointer-events-auto pt-2 sm:pt-4 px-2 sm:px-0">
              <div>
                <h3 className="text-white text-sm xs:text-base sm:text-xl font-bold uppercase tracking-wider font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {product.name}
                </h3>
                <p className="text-white/50 text-[10px] sm:text-xs font-mono mt-0.5">
                  Photo {selectedPhotoIndex + 1} of {galleryList.length} • Click anywhere to exit
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
                aria-label="Close Fullscreen View"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Main Stage with Center Image & Side Chevrons */}
            <div
              className="relative w-full max-w-4xl flex-1 flex items-center justify-center my-3 sm:my-4 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Navigation Chevrons */}
              {galleryList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevPhoto();
                    }}
                    className="absolute left-2 sm:left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/80 hover:bg-white/25 text-white border border-white/20 transition-all cursor-pointer backdrop-blur-md"
                    aria-label="Previous Photo"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextPhoto();
                    }}
                    className="absolute right-2 sm:right-4 lg:-right-12 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/80 hover:bg-white/25 text-white border border-white/20 transition-all cursor-pointer backdrop-blur-md"
                    aria-label="Next Photo"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}

              <div className="relative w-full h-[48vh] sm:h-[60vh] md:h-[65vh] flex items-center justify-center">
                <Image
                  key={activePhoto.src}
                  src={activePhoto.src}
                  alt={`${product.name} - ${activePhoto.label}`}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
                  priority
                />
              </div>
            </div>

            {/* Bottom Thumbnails Navigation in Lightbox */}
            <div
              className="w-full max-w-2xl flex items-center justify-start sm:justify-center gap-2 sm:gap-3 px-2 sm:px-4 z-30 pointer-events-auto overflow-x-auto py-2"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryList.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`relative w-11 sm:w-16 h-11 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden border p-1 transition-all cursor-pointer shrink-0 ${selectedPhotoIndex === idx
                    ? 'border-white bg-white/15 scale-105'
                    : 'border-white/20 bg-black/60 opacity-50 hover:opacity-100 hover:border-white/50'
                    }`}
                  title={item.label}
                >
                  <Image src={item.src} alt={item.label} fill sizes="64px" className="object-contain p-0.5 sm:p-1" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
