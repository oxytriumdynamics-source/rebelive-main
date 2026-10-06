'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(500, 33);
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

/**
 * Universal smooth scroll helper that coordinates with Lenis and GSAP ScrollTrigger.
 */
export const scrollToLenis = (
  target: number | string | HTMLElement,
  options?: { duration?: number; offset?: number; immediate?: boolean; easing?: (t: number) => number }
) => {
  if (typeof window === 'undefined') return;
  const lenis = (window as any).__lenis as Lenis | undefined;
  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(target, {
      duration: options?.duration ?? 1.2,
      offset: options?.offset ?? 0,
      immediate: options?.immediate ?? false,
      easing: options?.easing,
    });
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  } else if (typeof target === 'string') {
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  } else if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Automatically scroll to top whenever the route or pathname changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const resetToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;

      const lenis = (window as any).__lenis as Lenis | undefined;
      if (lenis) {
        if (typeof lenis.scrollTo === 'function') {
          lenis.scrollTo(0, { immediate: true, force: true } as any);
        }
        if (typeof (lenis as any).reset === 'function') {
          (lenis as any).reset();
        }
      }
    };

    resetToTop();
    const rafId = requestAnimationFrame(resetToTop);
    const t1 = setTimeout(resetToTop, 25);
    const t2 = setTimeout(resetToTop, 100);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 0.75,
      touchMultiplier: 0.85,
      infinite: false,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);

    // Filter out internal Three.js deprecation / ANGLE precision notices
    const originalWarn = console.warn;
    console.warn = (...args: any[]) => {
      const msg = args[0]?.toString() || '';
      if (
        msg.includes('THREE.Clock: This module has been deprecated') ||
        msg.includes('warning X4122')
      ) {
        return;
      }
      originalWarn.apply(console, args);
    };

    // Expose lenis instance globally
    (window as any).__lenis = lenis;

    return () => {
      console.warn = originalWarn;
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  return <>{children}</>;
};
