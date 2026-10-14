'use client';
import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { hasIntroLoaded, markIntroLoaded } from '@/lib/introState';
import { RebeliveLoader } from './RebeliveLoader';

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
            className="fixed inset-0 z-[99999] bg-[#000000] flex flex-col items-center justify-center select-none pointer-events-auto"
          >
            <motion.div
              exit={{
                opacity: 0,
                scale: 0.98,
                y: -8,
                transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
              }}
              className="w-full flex items-center justify-center"
            >
              <RebeliveLoader
                progress={progress}
                phaseText={phase}
                fullScreen={false}
              />
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
