'use client';
import React from 'react';
import Image from 'next/image';
import { animationState } from '@/lib/animationState';
import { motion } from 'framer-motion';

interface PodiumOverlaysProps {
  scrollProgress: number;
  isMobile?: boolean;
  isPageReady?: boolean;
  mousePosition?: { x: number; y: number };
}

/**
 * Upper and Lower Podiums with buttery smooth incoming and outgoing animations:
 * - Incoming: Cinematic slide-in with soft blur resolution and spring damping on page load
 * - Outgoing: Hermite smoothstep scroll travel that glides podiums off-screen with gentle scaling and fade
 * - Interactive: Responsive mouse parallax inertia
 */
const PodiumOverlaysInner: React.FC<PodiumOverlaysProps> = ({
  scrollProgress,
  isMobile = false,
  isPageReady = true,
  mousePosition,
}) => {
  // Hermite smoothstep curve for velvet-smooth outgoing scroll transition (starts at 0.02, fully gone by 0.14)
  const tScroll = Math.min(1, Math.max(0, (scrollProgress - 0.02) / 0.11));
  const easeExit = tScroll * tScroll * (3 - 2 * tScroll);

  const scrollOpacity = Math.max(0, 1 - easeExit);
  const scrollScale = 1 - easeExit * 0.12;

  // Parallax translation on scroll: upper glides up, lower glides down
  const topScrollY = -easeExit * 190;
  const bottomScrollY = easeExit * 190;

  if (scrollOpacity <= 0.005) return null;

  // Mouse parallax read from shared state or prop (updates on scroll re-renders for lazy-follow effect)
  const mx = mousePosition ? mousePosition.x : animationState.mouseX;
  const my = mousePosition ? mousePosition.y : animationState.mouseY;
  const px = isMobile ? 0 : mx * 4.5;
  const py = isMobile ? 0 : -my * 3;

  return (
    <div
      className="fixed inset-0 pointer-events-none select-none z-[5] overflow-hidden"
      style={{
        opacity: scrollOpacity,
        // CSS blur on scroll is expensive on mobile compositing - skip it on phones
        filter: !isMobile && easeExit > 0.01 ? `blur(${easeExit * 4}px)` : 'none',
        transition: 'opacity 0.15s ease-out, filter 0.15s ease-out',
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. UPPER PODIUM: /brand/podup.png (Smooth In / Out)
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-x-0 top-[-8px] sm:top-[-10px] md:top-[-20px] flex flex-col items-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -80, scale: 0.92, filter: 'blur(8px)' }}
          animate={
            isPageReady
              ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
              : { opacity: 0, y: -65, scale: 0.92, filter: 'blur(8px)' }
          }
          transition={{
            duration: 1.25,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex flex-col items-center"
          style={{
            transform: `translateY(${topScrollY}px) scale(${scrollScale})`,
            transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="relative w-[165px] sm:w-[220px] md:w-[275px] lg:w-[320px] aspect-[16/9] flex items-center justify-center">
            <Image
              src="/brand/podup.png"
              alt="Upper Studio Lighting Fixture"
              fill
              priority
              className="object-contain opacity-95 brightness-[1.12] contrast-[1.12] drop-shadow-[0_16px_36px_rgba(0,0,0,0.95)]"
            />
          </div>
        </motion.div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. DOWN PODIUM: /brand/poddown.png (Smooth In / Out)
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-[-10px] sm:bottom-[-16px] md:bottom-[-22px] flex flex-col items-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 65, scale: 0.92, filter: 'blur(8px)' }}
          animate={
            isPageReady
              ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
              : { opacity: 0, y: 65, scale: 0.92, filter: 'blur(8px)' }
          }
          transition={{
            duration: 1.25,
            delay: 0.28,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex flex-col items-center"
          style={{
            transform: `translateY(${bottomScrollY}px) scale(${scrollScale})`,
            transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="relative w-[175px] sm:w-[235px] md:w-[295px] lg:w-[340px] aspect-[16/8] flex items-center justify-center">
            {/* Lighting Effect: Upward Turntable Surface Glow */}
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-[72%] h-14 rounded-full blur-[14px] pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center bottom, rgba(255, 255, 255, 0.70) 0%, rgba(255, 255, 255, 0.25) 45%, transparent 75%)',
              }}
            />

            <Image
              src="/brand/poddown.png"
              alt="Lower Studio Podium"
              fill
              priority
              className="object-contain opacity-55 brightness-[0.70] contrast-[1.1] drop-shadow-[0_-12px_28px_rgba(0,0,0,0.95)]"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const PodiumOverlays = React.memo(
  PodiumOverlaysInner,
  (prev, next) =>
    prev.isPageReady === next.isPageReady &&
    (prev.scrollProgress > 0.14 && next.scrollProgress > 0.14
      ? true
      : Math.abs(prev.scrollProgress - next.scrollProgress) < 0.002)
);
