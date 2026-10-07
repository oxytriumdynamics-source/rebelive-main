'use client';
import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { hasIntroLoaded, markIntroLoaded } from '@/lib/introState';

interface LoadingScreenProps {
  onLoaded?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  // If already shown once in this session, skip completely
  const alreadySeen = typeof window !== 'undefined' && hasIntroLoaded();

  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(12);
  const [phase, setPhase] = useState('CALIBRATING 3D SHADERS');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(alreadySeen);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && hasIntroLoaded()) {
      setIsRemoved(true);
      return;
    }

    const phases = [
      { p: 35, text: 'SYNCHRONIZING MONOCHROME PALETTES' },
      { p: 68, text: 'COMPUTING ALUMINUM SPECULAR HIGHLIGHTS' },
      { p: 92, text: 'INITIALIZING PRODUCT 023 // REBELIVE LABS' },
      { p: 100, text: 'SYSTEM READY' },
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < phases.length) {
        setProgress(phases[current].p);
        setPhase(phases[current].text);
        current++;
      } else {
        clearInterval(interval);
        // Short pause at 100% so user registers "SYSTEM READY"
        setTimeout(() => {
          markIntroLoaded();
          setIsFadingOut(true);
          onLoadedRef.current?.();
        }, 220);
      }
    }, 240);

    return () => clearInterval(interval);
  }, []);

  if (isRemoved || alreadySeen) return null;

  const content = (
    <AnimatePresence>
        {!isFadingOut ? (
          <motion.div
            key="loader-curtain"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
            }}
            onAnimationComplete={() => setIsRemoved(true)}
            className="fixed inset-0 z-[99999] bg-[#030303] flex flex-col items-center justify-center select-none pointer-events-auto"
          >
            <motion.div
              exit={{
                opacity: 0,
                scale: 0.96,
                y: -12,
                transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              }}
              className="w-full max-w-xs px-6 flex flex-col items-center"
            >
              {/* Brand Logo */}
              <div className="flex flex-col items-center gap-1 mb-6">
                <div className="relative" style={{ width: 150, height: 48 }}>
                  <Image
                    src="/brand/REBELIVE Logo Black.webp"
                    alt="REBELIVE"
                    fill
                    priority
                    sizes="150px"
                    className="object-contain"
                    style={{ filter: 'invert(1) brightness(1.15) drop-shadow(0 0 16px rgba(255,255,255,0.4))' }}
                  />
                </div>
                <span className="text-[9px] font-tech text-white/30 tracking-[0.3em] uppercase">ENERGY DRINKS</span>
              </div>

              {/* Progress Line */}
              <div className="w-full h-[1px] bg-white/15 relative overflow-hidden mb-4">
                <div
                  className="h-full bg-white shadow-[0_0_12px_#ffffff] transition-all duration-260 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Technical Status & Percentage */}
              <div className="w-full flex items-center justify-between text-[10px] font-tech text-white/50 tracking-widest uppercase">
                <span className="truncate pr-2">{phase}</span>
                <span className="font-mono text-white/80">{progress}%</span>
              </div>

              {/* Micro Specs */}
              <div className="mt-8 text-[9px] font-tech text-white/20 tracking-[0.25em] uppercase text-center">
                HIGH-VELOCITY BEVERAGE ARCHITECTURE
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );

    if (mounted && typeof document !== 'undefined') {
      return createPortal(content, document.body);
    }

    return content;
  };
