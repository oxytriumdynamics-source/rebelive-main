'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Check } from 'lucide-react';

interface PaymentConfirmationLockAnimationProps {
  size?: number;
  className?: string;
  onComplete?: () => void;
}

export default function PaymentConfirmationLockAnimation({
  size = 120,
  className = '',
  onComplete,
}: PaymentConfirmationLockAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let anim: any = null;
    let isCancelled = false;

    async function initLottie() {
      try {
        const lottieModule = await import('lottie-web');
        const lottie = lottieModule.default || lottieModule;

        // Try loading lock.json first, fallback to check.json
        let res = await fetch('/lock.json');
        if (!res.ok) {
          res = await fetch('/check.json');
        }
        if (!res.ok) {
          throw new Error('Failed to load lock.json or check.json');
        }

        const animData = await res.json();
        if (isCancelled || !containerRef.current) return;

        // Ensure strictly monochrome / pure white strokes for black-and-white theme
        const sanitizeToPureMonochrome = (obj: any) => {
          if (!obj || typeof obj !== 'object') return;
          if (Array.isArray(obj)) {
            obj.forEach(sanitizeToPureMonochrome);
            return;
          }
          // Shape Stroke color: enforce pure white [1, 1, 1, 1]
          if (obj.ty === 'st' && obj.c && Array.isArray(obj.c.k)) {
            obj.c.k = [1, 1, 1, 1];
          }
          // Shape Fill color: enforce pure white [1, 1, 1, 1]
          if (obj.ty === 'fl' && obj.c && Array.isArray(obj.c.k)) {
            obj.c.k = [1, 1, 1, 1];
          }
          for (const key of Object.keys(obj)) {
            if (typeof obj[key] === 'object') {
              sanitizeToPureMonochrome(obj[key]);
            }
          }
        };

        const clonedData = JSON.parse(JSON.stringify(animData));
        sanitizeToPureMonochrome(clonedData);

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          anim = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            animationData: clonedData,
          });

          anim.addEventListener('DOMLoaded', () => {
            if (!isCancelled) setLoaded(true);
          });

          anim.addEventListener('complete', () => {
            if (onComplete) onComplete();
          });
        }
      } catch (err) {
        console.warn('Lottie lock animation load issue, fallback active:', err);
        if (!isCancelled) setLoadError(true);
      }
    }

    initLottie();

    return () => {
      isCancelled = true;
      if (anim) {
        try {
          anim.destroy();
        } catch {}
      }
    };
  }, [onComplete]);

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-3xl bg-[#080808] border border-white/20 p-3 shadow-[0_0_50px_rgba(255,255,255,0.12)] ${className}`}
      style={{ width: size, height: size }}
      aria-label="Payment Confirmed Verification Badge"
    >
      {/* Decorative Monochrome Subtle Outer Rings */}
      <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none scale-105" />
      <div className="absolute inset-0 rounded-3xl border border-white/[0.04] pointer-events-none scale-110" />

      {/* Lottie SVG Container */}
      <div
        ref={containerRef}
        className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Fallback & Loading State in Pure Black and White */}
      {(!loaded || loadError) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center bg-white/5 animate-in zoom-in-75 duration-300">
            <Check className="w-6 h-6 text-white stroke-[2.5]" />
          </div>
        </div>
      )}
    </div>
  );
}
