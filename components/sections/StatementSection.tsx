'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../data/products';

interface StatementSectionProps {
  product: Product;
  onOrderNow?: () => void;
}

interface StatementBackdropProps {
  opacity: number;
  scrollProgress?: number;
  isMobile?: boolean;
  isTablet?: boolean;
  mousePosition?: { x: number; y: number };
  product?: Product;
}

const STATEMENTS = [
  {
    id: 'sugar',
    index: '01',
    line1: 'ZERO ADDED',
    line2: 'SUGAR',
    line1Size: 'text-[11vw] sm:text-[11vw] md:text-[10vw] lg:text-[11.5vw] xl:text-[12.5vw] 2xl:text-[13.5vw]',
    line2Size: 'text-[11.5vw] sm:text-[11.5vw] md:text-[10.5vw] lg:text-[12vw] xl:text-[13vw] 2xl:text-[14vw]',
    line1Spacing: '0.015em',
    line2Spacing: '0.025em',
    line1WordSpacing: '0.14em',
  },
  {
    id: 'colors',
    index: '02',
    line1: 'NO ARTIFICIAL',
    line2: 'COLORS',
    line1Size: 'text-[9.2vw] sm:text-[9.2vw] md:text-[8.5vw] lg:text-[9.5vw] xl:text-[10.5vw] 2xl:text-[11.5vw]',
    line2Size: 'text-[10.5vw] sm:text-[10.5vw] md:text-[9.5vw] lg:text-[11vw] xl:text-[12vw] 2xl:text-[13vw]',
    line1Spacing: '0.015em',
    line2Spacing: '0.025em',
    line1WordSpacing: '0.14em',
  },
];

/**
 * AnimatedStatementWord:
 * Lightweight, hardware-accelerated line transition.
 * Crisp pure white typography with tight spacing and balanced scale.
 */
const AnimatedStatementWord: React.FC<{
  text: string;
  sizeClass: string;
  letterSpacing?: string;
  wordSpacing?: string;
  startDelay?: number;
  isMobile?: boolean;
}> = ({ text, sizeClass, letterSpacing = '0.02em', wordSpacing = '0.20em', startDelay = 0 }) => {
  return (
    <motion.div
      className="inline-flex items-center justify-center overflow-visible whitespace-nowrap select-none will-change-transform"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35, delay: startDelay, ease: [0.16, 1, 0.3, 1] }}
    >
      <span
        className={`inline-block font-display font-black leading-[0.88] uppercase whitespace-nowrap italic select-none overflow-visible ${sizeClass}`}
        style={{
          color: '#FFFFFF',
          WebkitTextFillColor: '#FFFFFF',
          letterSpacing,
          wordSpacing,
          textShadow: '0 0 32px rgba(255, 255, 255, 0.40), 0 10px 40px rgba(0, 0, 0, 0.95)',
        }}
      >
        {text}
      </span>
    </motion.div>
  );
};

const StatementBackdropInner: React.FC<StatementBackdropProps> = ({
  opacity,
  scrollProgress = 0,
  isMobile = false,
  isTablet = false,
}) => {
  if (opacity <= 0.005) return null;

  // Active statement selection:
  // Statement 01: ZERO ADDED SUGAR (around 0.50)
  // Statement 02: NO ARTIFICIAL COLORS (around 0.72)
  const activeIndex = scrollProgress < 0.62 ? 0 : 1;

  // Direct clean physical exit when transitioning to SubFooter (0.80 -> 0.96)
  const exitProgress = Math.min(1, Math.max(0, (scrollProgress - 0.80) / 0.16));
  const easeExit = exitProgress * exitProgress * (3 - 2 * exitProgress);
  const exitOffsetY = -easeExit * 14;
  const finalOpacity = opacity * Math.max(0, 1 - easeExit * 1.25);

  if (finalOpacity <= 0.005) return null;

  const current = STATEMENTS[activeIndex] || STATEMENTS[0];

  return (
    <div
      className="fixed inset-0 z-5 pointer-events-none select-none flex flex-col items-center justify-center bg-transparent overflow-hidden isolate"
      style={{
        opacity: finalOpacity,
      }}
    >
      <div
        className="relative text-center w-full px-4 flex flex-col items-center justify-center select-none z-10 min-h-[360px] sm:min-h-[440px] md:min-h-[500px] overflow-visible will-change-transform"
        style={{
          transform: `translate3d(0, ${exitOffsetY}vh, 0)`,
        }}
      >
        {/* On mobile and tablet screens, shift text down so it sits cleanly at bottom below the 3D can */}
        <div className="w-full flex flex-col items-center justify-center transition-transform duration-300 ease-out translate-y-[21vh] sm:translate-y-[22vh] lg:translate-y-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`statement-${current.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.20 }}
              className="flex flex-col items-center justify-center relative max-w-full px-2 overflow-visible"
            >
              {/* Line 1 (e.g. "ZERO ADDED", "NO ARTIFICIAL") */}
              <AnimatedStatementWord
                text={current.line1}
                sizeClass={current.line1Size}
                letterSpacing={current.line1Spacing}
                wordSpacing={current.line1WordSpacing}
                startDelay={0}
                isMobile={isMobile}
              />

              {/* Line 2 (e.g. "SUGAR", "COLORS") */}
              <div className="mt-2 sm:mt-3 md:mt-4 flex items-center justify-center overflow-visible">
                <AnimatedStatementWord
                  text={current.line2}
                  sizeClass={current.line2Size}
                  letterSpacing={current.line2Spacing}
                  startDelay={0.06}
                  isMobile={isMobile}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Step Indicator */}
      <div
        className="absolute bottom-8 sm:bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 pointer-events-none transition-opacity duration-200"
        style={{
          opacity: Math.max(0, 1 - easeExit * 2.0),
        }}
      >
        {STATEMENTS.map((s, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <div
              key={s.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'w-10 bg-white shadow-[0_0_14px_rgba(255,255,255,1)]'
                  : 'w-2 bg-white/20'
              }`}
            />
          );
        })}
      </div>

      {/* ── Top & Bottom Edge Gradients ── */}
      <div
        className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-20"
        style={{ opacity: Math.max(0, 1 - easeExit * 1.5) }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-20"
        style={{ opacity: Math.max(0, 1 - easeExit * 1.5) }}
      />
    </div>
  );
};

export const StatementBackdrop = React.memo(
  StatementBackdropInner,
  (prev, next) =>
    (prev.opacity <= 0.005 && next.opacity <= 0.005) ||
    (Math.abs(prev.opacity - next.opacity) < 0.004 &&
      Math.abs((prev.scrollProgress || 0) - (next.scrollProgress || 0)) < 0.002 &&
      prev.isMobile === next.isMobile &&
      prev.isTablet === next.isTablet)
);

export const StatementSection: React.FC<StatementSectionProps> = () => {
  return null;
};
