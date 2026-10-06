'use client';
import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../data/products';
import { HoverRollText } from '../ui/HoverRollText';
import { Premium3DButton } from '../ui/Premium3DButton';

interface FlavorCarouselOverlayProps {
  products: Product[];
  selectedIndex: number;
  scrollProgress: number;
  isPageReady?: boolean;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onPrevFlavor: () => void;
  onNextFlavor: () => void;
  onSelectFlavor: (index: number) => void;
  onOrderNow?: () => void;
}

function getFlavorHeadingStyles(productId: string) {
  switch (productId.toLowerCase()) {
    case 'apex':
      return {
        fontFamily: "'PF Fuel', 'PF Fuel Pro', var(--font-apex), sans-serif",
        className: 'text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] tracking-[0.18em] font-semibold not-italic text-white',
      };
    case 'capella':
      return {
        fontFamily: 'var(--font-capella)',
        className: 'text-xl sm:text-2xl md:text-3xl lg:text-[2.6rem] tracking-[0.18em] font-extrabold text-white',
      };
    case 'aviva':
      return {
        fontFamily: 'var(--font-aviva)',
        className: 'text-2xl sm:text-3xl md:text-4xl lg:text-[3.1rem] tracking-normal font-bold text-white',
      };
    default:
      return {
        fontFamily: "'PF Fuel', 'PF Fuel Pro', var(--font-apex), sans-serif",
        className: 'text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] tracking-[0.18em] font-semibold not-italic text-white',
      };
  }
}

function getCanName(product: Product): string {
  return product.name || product.displayTitle || 'APEX';
}

const FlavorCarouselOverlayInner: React.FC<FlavorCarouselOverlayProps> = ({
  products,
  selectedIndex,
  scrollProgress,
  isPageReady = true,
  soundEnabled = false,
  onToggleSound,
  onPrevFlavor,
  onNextFlavor,
  onSelectFlavor,
  onOrderNow,
}) => {
  const currentProduct = products[selectedIndex];
  const opacity = Math.max(0, 1 - scrollProgress * 2.2);
  const pointerEvents = opacity < 0.1 ? 'none' : 'auto';

  const sliderTrackRef = useRef<HTMLDivElement>(null);

  if (opacity <= 0.01) return null;

  const canName = getCanName(currentProduct);

  // Handle clicking on the slider track to select flavor
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderTrackRef.current) return;
    const rect = sliderTrackRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const fraction = clickX / rect.width;
    const targetIdx = Math.round(fraction * (products.length - 1));
    onSelectFlavor(targetIdx);
  };

  // Scrubber percentage position (0 to 100%)
  const scrubberPercent =
    products.length > 1
      ? (selectedIndex / (products.length - 1)) * 100
      : 50;

  return (
    <div
      className="absolute inset-0 z-20 select-none pointer-events-none transition-opacity duration-300"
      style={{ opacity, pointerEvents }}
    >
    
      <div className="absolute top-24 left-8 sm:left-12 pointer-events-none opacity-40">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M1 18V1H18" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Top Right Bracket */}
      <div className="absolute top-24 right-8 sm:right-12 pointer-events-none opacity-40">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M17 18V1H0" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Bottom Left Bracket */}
      <div className="absolute bottom-12 left-8 sm:left-12 pointer-events-none opacity-40">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M1 0V17H18" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Bottom Right Bracket */}
      <div className="absolute bottom-12 right-8 sm:right-12 pointer-events-none opacity-40">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M17 0V17H0" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Left Frame Markers: 'C', 'E', Downward Ticks */}
      <div className="hidden sm:flex absolute left-8 sm:left-12 top-1/2 -translate-y-1/2 flex-col items-center gap-6 pointer-events-none opacity-30 text-[9px] font-mono tracking-widest text-white">
        <span>C</span>
        <span>E</span>
        <div className="flex flex-col gap-1.5 opacity-60">
          <span>∨</span>
          <span>∨</span>
          <span>∨</span>
        </div>
      </div>

      {/* Right Frame Markers: Downward Ticks */}
      <div className="hidden sm:flex absolute right-8 sm:right-12 top-1/2 -translate-y-1/2 flex-col items-center gap-1.5 pointer-events-none opacity-25 text-[9px] font-mono text-white">
        <span>∨</span>
        <span>∨</span>
        <span>∨</span>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          1. FULL-SCREEN CLICK ZONES (Click anywhere left or right to switch flavors)
      ───────────────────────────────────────────────────────────────── */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onPrevFlavor();
        }}
        className="absolute inset-y-0 left-0 w-1/2 z-10 pointer-events-auto cursor-pointer"
        title="Click left to see previous flavor"
        aria-label="Previous flavor"
      />
      <div
        onClick={(e) => {
          e.stopPropagation();
          onNextFlavor();
        }}
        className="absolute inset-y-0 right-0 w-1/2 z-10 pointer-events-auto cursor-pointer"
        title="Click right to see next flavor"
        aria-label="Next flavor"
      />

      {/* ─────────────────────────────────────────────────────────────────
          2. UPGRADED NAVIGATION ARROWS (Transparent Multi-Chevron Flow matching design)
      ───────────────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes dotChevronPulse1 {
          0%, 100% { opacity: 0.35; transform: scale(0.92); }
          50% { opacity: 0.75; transform: scale(1.08); }
        }
        @keyframes dotChevronPulse2 {
          0%, 100% { opacity: 0.55; transform: scale(0.96); }
          50% { opacity: 0.90; transform: scale(1.06); }
        }
        @keyframes dotChevronPulse3 {
          0%, 100% { opacity: 0.80; transform: scale(1.0); }
          50% { opacity: 1.0; transform: scale(1.08); }
        }
        @keyframes arrowFloatLeft {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(-4px); }
        }
        @keyframes arrowFloatRight {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(4px); }
        }
        @keyframes heroEqBar1 {
          0%, 100% { height: 4px; }
          50% { height: 13px; }
        }
        @keyframes heroEqBar2 {
          0%, 100% { height: 16px; }
          50% { height: 6px; }
        }
        @keyframes heroEqBar3 {
          0%, 100% { height: 7px; }
          50% { height: 15px; }
        }
        @keyframes heroEqBar4 {
          0%, 100% { height: 14px; }
          50% { height: 5px; }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={isPageReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-[48%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-[290px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] flex items-center justify-between px-2 z-30 pointer-events-none"
      >
        {/* Left Arrow Button (Transparent Animated 5-Dot Chevron pointing left) */}
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrevFlavor();
          }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          className="p-1.5 sm:p-2 bg-transparent hover:bg-transparent rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer pointer-events-auto group focus:outline-none border-0 shadow-none"
          style={{ animation: 'arrowFloatLeft 2.4s ease-in-out infinite' }}
          aria-label="Previous can"
        >
          <svg
            viewBox="0 0 30 30"
            className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 transition-transform duration-300 group-hover:-translate-x-1"
            fill="white"
          >
            {/* Outer top dot */}
            <circle
              cx="21"
              cy="5"
              r="1.7"
              style={{ animation: 'dotChevronPulse1 2s ease-in-out infinite', animationDelay: '0s', transformOrigin: '21px 5px' }}
            />
            {/* Mid upper dot */}
            <circle
              cx="15"
              cy="10"
              r="2.1"
              style={{ animation: 'dotChevronPulse2 2s ease-in-out infinite', animationDelay: '0.2s', transformOrigin: '15px 10px' }}
            />
            {/* Tip leading dot */}
            <circle
              cx="9"
              cy="15"
              r="2.6"
              style={{ animation: 'dotChevronPulse3 2s ease-in-out infinite', animationDelay: '0.4s', transformOrigin: '9px 15px' }}
            />
            {/* Mid lower dot */}
            <circle
              cx="15"
              cy="20"
              r="2.1"
              style={{ animation: 'dotChevronPulse2 2s ease-in-out infinite', animationDelay: '0.2s', transformOrigin: '15px 20px' }}
            />
            {/* Outer bottom dot */}
            <circle
              cx="21"
              cy="25"
              r="1.7"
              style={{ animation: 'dotChevronPulse1 2s ease-in-out infinite', animationDelay: '0s', transformOrigin: '21px 25px' }}
            />
          </svg>
        </motion.button>

        {/* Right Arrow Button (Transparent Animated 5-Dot Chevron pointing right) */}
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNextFlavor();
          }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          className="p-1.5 sm:p-2 bg-transparent hover:bg-transparent rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer pointer-events-auto group focus:outline-none border-0 shadow-none"
          style={{ animation: 'arrowFloatRight 2.4s ease-in-out infinite' }}
          aria-label="Next can"
        >
          <svg
            viewBox="0 0 30 30"
            className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 transition-transform duration-300 group-hover:translate-x-1"
            fill="white"
          >
            {/* Outer top dot */}
            <circle
              cx="9"
              cy="5"
              r="1.7"
              style={{ animation: 'dotChevronPulse1 2s ease-in-out infinite', animationDelay: '0s', transformOrigin: '9px 5px' }}
            />
            {/* Mid upper dot */}
            <circle
              cx="15"
              cy="10"
              r="2.1"
              style={{ animation: 'dotChevronPulse2 2s ease-in-out infinite', animationDelay: '0.2s', transformOrigin: '15px 10px' }}
            />
            {/* Tip leading dot */}
            <circle
              cx="21"
              cy="15"
              r="2.6"
              style={{ animation: 'dotChevronPulse3 2s ease-in-out infinite', animationDelay: '0.4s', transformOrigin: '21px 15px' }}
            />
            {/* Mid lower dot */}
            <circle
              cx="15"
              cy="20"
              r="2.1"
              style={{ animation: 'dotChevronPulse2 2s ease-in-out infinite', animationDelay: '0.2s', transformOrigin: '15px 20px' }}
            />
            {/* Outer bottom dot */}
            <circle
              cx="9"
              cy="25"
              r="1.7"
              style={{ animation: 'dotChevronPulse1 2s ease-in-out infinite', animationDelay: '0s', transformOrigin: '9px 25px' }}
            />
          </svg>
        </motion.button>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────────
          3. BOTTOM SECTION: Selected Can Name + Slider + "ADD TO CART"
      ───────────────────────────────────────────────────────────────── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-8 sm:bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-center z-30 pointer-events-auto w-full max-w-[500px] px-4"
      >
        {/* Selected Can Name (Using authentic original font and optimized font size per flavour) */}
        {(() => {
          const headingStyle = getFlavorHeadingStyles(currentProduct.id);
          return (
            <div className="min-h-[48px] sm:min-h-[56px] md:min-h-[62px] flex items-center justify-center mb-3 sm:mb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`name-${currentProduct.id}`}
                  initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center select-none"
                >
                  <span
                    className={`uppercase text-white leading-none drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] drop-shadow-[0_0_24px_rgba(255,255,255,0.15)] ${headingStyle.className}`}
                    style={{
                      fontFamily: headingStyle.fontFamily,
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSynthesis: 'none',
                    }}
                  >
                    {canName}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          );
        })()}

        <div className="w-full max-w-[280px] sm:max-w-[360px] md:max-w-[420px] flex flex-col items-center mt-2 sm:mt-2.5">
          {/* Sleek 3D White Glass CTA Button with directional arrow */}
          <Premium3DButton
            text="ADD TO CART"
            size="md"
            theme="white"
            onClick={() => onOrderNow?.()}
            showArrow={true}
            className="shadow-[0_0_24px_rgba(255,255,255,0.3)] pointer-events-auto"
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          4. HERO SOUND ON/OFF EQUALIZER BUTTON (Matches User Spec)
      ───────────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-12 z-40 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSound?.();
          }}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/20 bg-black/60 hover:bg-white/10 hover:border-white/40 backdrop-blur-xl transition-all duration-300 cursor-pointer group active:scale-95 shadow-[0_4px_24px_rgba(0,0,0,0.7)]"
          aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          title={soundEnabled ? 'Sound is ON (Click to Mute)' : 'Sound is OFF (Click to Enable)'}
        >
          <span className="font-tech text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-white transition-colors duration-200">
            {soundEnabled ? 'ON' : 'OFF'}
          </span>

          {/* 4 Animated Vertical Equalizer Bars matching screenshot */}
          <div className="flex items-center gap-[3px] h-4 w-4 justify-center">
            <span
              className={`w-[2.5px] rounded-full transition-all duration-300 ${
                soundEnabled
                  ? 'bg-white animate-[heroEqBar1_0.9s_ease-in-out_infinite]'
                  : 'h-[3px] bg-white/40'
              }`}
            />
            <span
              className={`w-[2.5px] rounded-full transition-all duration-300 ${
                soundEnabled
                  ? 'bg-white animate-[heroEqBar2_0.8s_ease-in-out_infinite_0.15s]'
                  : 'h-[3px] bg-white/40'
              }`}
            />
            <span
              className={`w-[2.5px] rounded-full transition-all duration-300 ${
                soundEnabled
                  ? 'bg-white animate-[heroEqBar3_1.1s_ease-in-out_infinite_0.3s]'
                  : 'h-[3px] bg-white/40'
              }`}
            />
            <span
              className={`w-[2.5px] rounded-full transition-all duration-300 ${
                soundEnabled
                  ? 'bg-white animate-[heroEqBar4_0.85s_ease-in-out_infinite_0.1s]'
                  : 'h-[3px] bg-white/40'
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  );
};

export const FlavorCarouselOverlay = React.memo(
  FlavorCarouselOverlayInner,
  (prev, next) =>
    prev.selectedIndex === next.selectedIndex &&
    prev.isPageReady === next.isPageReady &&
    prev.soundEnabled === next.soundEnabled &&
    (prev.scrollProgress > 0.16 && next.scrollProgress > 0.16
      ? true
      : Math.abs(prev.scrollProgress - next.scrollProgress) < 0.002)
);
