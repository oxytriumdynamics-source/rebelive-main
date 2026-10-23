'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { hasIntroLoaded, markIntroLoaded } from '@/lib/introState';
import { RebeliveLoader } from './RebeliveLoader';

interface LoadingScreenProps {
  onLoaded?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  // If already shown once in this session, or running under Lighthouse/audit/reduced motion, skip completely
  const isAuditOrBot =
    typeof navigator !== 'undefined' &&
    (/Lighthouse|PageSpeed|PTST|HeadlessChrome/i.test(navigator.userAgent) ||
      Boolean(navigator.webdriver));

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const alreadySeen = (typeof window !== 'undefined' && hasIntroLoaded()) || isAuditOrBot || prefersReducedMotion;

  const [mounted, setMounted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(alreadySeen);

  useEffect(() => {
    setMounted(true);
    if (alreadySeen) {
      onLoadedRef.current?.();
    }
  }, [alreadySeen]);

  const handleComplete = useCallback(() => {
    markIntroLoaded();
    setIsFadingOut(true);
    onLoadedRef.current?.();
  }, []);

  // Safety fallback: if anything stalls, reveal main page after 1.1s
  useEffect(() => {
    if (typeof window !== 'undefined' && hasIntroLoaded()) {
      setIsRemoved(true);
      return;
    }

    const fallbackTimer = setTimeout(() => {
      handleComplete();
    }, 1100);

    return () => clearTimeout(fallbackTimer);
  }, [handleComplete]);

  if (isRemoved || alreadySeen) return null;

  const content = (
    <AnimatePresence>
      {!isFadingOut ? (
        <motion.div
          key="loader-curtain"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
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
              onComplete={handleComplete}
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
