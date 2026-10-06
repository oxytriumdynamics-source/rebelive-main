'use client';
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Droplet, Leaf, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '../../data/products';
import { DottedChevronIcon } from '../ui/DottedArrow';

interface ProductDetailsProps {
  product: Product;
  products: Product[];
  selectedIndex: number;
  activeFeatureIndex: number;
  onPrevFlavor: () => void;
  onNextFlavor: () => void;
  onSelectFlavor: (index: number) => void;
  onOrderNow: () => void;
  onOpenSpecs: () => void;
  onSelectFeature?: (index: number) => void;
}

const ProductDetailsInner: React.FC<ProductDetailsProps> = ({
  product,
  products,
  selectedIndex,
  activeFeatureIndex,
  onPrevFlavor,
  onNextFlavor,
  onSelectFlavor,
  onOrderNow,
  onOpenSpecs,
  onSelectFeature,
}) => {
  // Local active index if user clicks an icon, or falls back to scroll progress
  const [manualFeatureIndex, setManualFeatureIndex] = useState<number | null>(null);

  // Sync with global section snapping
  React.useEffect(() => {
    setManualFeatureIndex(null);
  }, [activeFeatureIndex]);

  const scrollFeatureIndex = Math.max(0, Math.min(3, activeFeatureIndex < 0 ? 0 : activeFeatureIndex));
  const currentFeatureIdx = manualFeatureIndex !== null ? manualFeatureIndex : scrollFeatureIndex;

  const features = [
    {
      index: '01',
      icon: Zap,
      tag: 'ENERGY & FOCUS',
      titleLine1: 'ENERGY &',
      titleLine2: 'FOCUS',
      subhead: 'NATURAL CAFFEINE + L-THEANINE',
      description:
        '50 mg of natural caffeine paired with 75 mg of L-theanine, crafted for steady energy and sharper focus.',
    },
    {
      index: '02',
      icon: ShieldCheck,
      tag: 'STRESS RELIEF & RECOVERY',
      titleLine1: 'STRESS RELIEF',
      titleLine2: '& RECOVERY',
      subhead: '250 MG ASHWAGANDHA + MAGNESIUM',
      description:
        '250 mg of Ashwagandha with magnesium, thoughtfully formulated for calmer moments and everyday recovery.',
    },
    {
      index: '03',
      icon: Leaf,
      tag: 'GUT HEALTH & DIGESTIVE WELLNESS',
      titleLine1: 'GUT HEALTH &',
      titleLine2: 'DIGESTIVE WELLNESS',
      subhead: 'FOS PREBIOTICS + BACILLUS CLAUSII',
      description:
        'FOS prebiotics paired with Bacillus clausii UBBC-07, bringing together ingredients made for everyday gut and digestive wellness.',
    },
    {
      index: '04',
      icon: Droplet,
      tag: 'METABOLISM & ELECTROLYTE BALANCE',
      titleLine1: 'METABOLISM &',
      titleLine2: 'ELECTROLYTE BALANCE',
      subhead: 'VITAMINS B6, B9, B12 + POTASSIUM',
      description:
        'Vitamins B6, B9 and B12 with potassium, bringing together key nutrients for everyday metabolism and electrolyte balance.',
    },
  ];

  const currentFeature = features[currentFeatureIdx];

  const renderTitleWithPoppinsAmpersand = (text: string) => {
    if (!text.includes('&')) return text;
    const parts = text.split('&');
    return (
      <>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && (
              <span
                className="inline-block text-[0.94em] align-baseline mx-1 font-black text-white select-none not-italic "
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 850,
          
                }}
              >
                &amp;
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-25 flex items-center justify-between pointer-events-none select-none px-4 sm:px-6 md:px-10 lg:px-14">
      {/* ── Center Stage: Desktop side-by-side / Mobile details anchored at bottom ── */}
      <div className="flex-1 h-full max-w-7xl mx-auto flex items-end md:items-center justify-between px-2 md:px-4 pointer-events-none relative pb-16 sm:pb-20 md:pb-0">

        {/* DETAILS CARD: On mobile, anchored at bottom with sleek frosted glass; on desktop, spacious left column */}
        <div className="w-full md:w-[48%] lg:w-[44%] max-w-[540px] flex flex-col justify-center pointer-events-none pl-0 md:pl-4 mx-auto md:mx-0">
          <div
            key={currentFeature.index}
            className="relative pointer-events-auto rounded-2xl bg-neutral-950/80 backdrop-blur-xl border border-white/12 p-4 sm:p-5 shadow-[0_16px_45px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.12)] md:bg-transparent md:backdrop-blur-none md:border-0 md:p-2 sm:md:p-4 md:shadow-none animate-fadeIn transition-all duration-500 ease-out"
          >
            {/* Ambient soft glow behind headline on desktop */}
            <div
              className="hidden md:block absolute -top-12 -left-12 w-72 h-72 rounded-full pointer-events-none opacity-20 blur-3xl -z-10"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(251,191,36,0.12) 40%, transparent 70%)',
              }}
            />

            {/* Premium Eyebrow Badge: SUPPORTS */}
            <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3 select-none">
              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/[0.07] border border-white/15 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-white border border-white/10" />
                <span
                  className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-white/90"
                  style={{ fontFamily: "'Code Next', sans-serif" }}
                >
                  SUPPORTS
                </span>
              </div>
       
            </div>

            {/* Bold stacked title with Code Next font */}
            <h2
              className="font-black text-2xl sm:text-3xl md:text-4xl lg:text-[3.15rem] xl:text-[3.5rem] uppercase tracking-tight text-white leading-[0.93] mt-0.5 drop-shadow-[0_8px_30px_rgba(0,0,0,0.95)]"
              style={{
                fontFamily: "'Code Next', sans-serif",
              }}
            >
              <span className="block text-white">{renderTitleWithPoppinsAmpersand(currentFeature.titleLine1)}</span>
              <span className="block text-white/95">{renderTitleWithPoppinsAmpersand(currentFeature.titleLine2)}</span>
            </h2>

           

            {/* Clean short description (Poppins) */}
            <p
              className="text-[12px] sm:text-xs md:text-sm font-normal text-white/75 leading-relaxed mt-2.5 sm:mt-3 line-clamp-3 sm:line-clamp-none max-w-[480px]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {currentFeature.description}
            </p>
          </div>
        </div>

        {/* RIGHT AREA: spacious area for desktop can */}
        <div className="hidden md:block flex-1 h-full pointer-events-none min-w-[320px]" />
      </div>

      {/* ── Desktop Right Navigation: Minimal Transparent Dotted Arrow & Vertical Feature Rail ── */}
      <div className="hidden md:flex flex-col items-center gap-5 pointer-events-auto z-30 mr-2 md:mr-4">
        {/* Transparent frameless right arrow with dotted chevron design */}
        <button
          onClick={() => {
            setManualFeatureIndex(null);
            onNextFlavor();
          }}
          className="p-1.5 sm:p-2 bg-transparent hover:bg-transparent rounded-full flex items-center justify-center transition-all duration-300 hover:scale-115 active:scale-90 cursor-pointer group border-0 shadow-none text-white focus:outline-none"
          aria-label="Next flavor"
          title="Next flavor"
        >
          <DottedChevronIcon direction="right" className="group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Vertical Icon Rail with Translucent Glass */}
        <div className="flex flex-col items-center gap-2 py-2.5 px-1 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.12)]">
          {features.map((item, idx) => {
            const IconComp = item.icon;
            const isCurrent = idx === currentFeatureIdx;
            return (
              <button
                key={item.index}
                onClick={() => {
                  setManualFeatureIndex(idx);
                  onSelectFeature?.(idx);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  isCurrent
                    ? 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.7)] scale-105'
                    : 'text-white/40 hover:text-white hover:bg-white/10'
                }`}
                title={item.subhead}
                aria-label={item.subhead}
              >
                <IconComp className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Floating Quick Bar ── */}
      <div className="absolute bottom-3.5 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-4 pointer-events-auto z-30">
        {/* Flavor Selector Dots with Translucent Glass */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-neutral-950/50 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)]">
          {products.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                setManualFeatureIndex(null);
                onSelectFlavor(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === selectedIndex ? 'w-7 bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              title={p.name}
            />
          ))}
          <span
            className="text-[10px] text-white/80 tracking-wider font-semibold ml-1.5 uppercase"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {product.name}
          </span>
        </div>

        {/* Order button (Poppins) */}
        <button
          onClick={onOrderNow}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white text-black text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase hover:bg-neutral-200 hover:scale-105 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.35)]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <span>ORDER</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const ProductDetails = React.memo(
  ProductDetailsInner,
  (prev, next) =>
    prev.product.id === next.product.id &&
    prev.selectedIndex === next.selectedIndex &&
    prev.activeFeatureIndex === next.activeFeatureIndex
);
