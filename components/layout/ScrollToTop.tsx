'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Universal ScrollToTop handler.
 * Automatically resets scroll position to the absolute top (0, 0) whenever
 * the user navigates to any new page or route.
 * Works seamlessly with native browser window, document body, documentElement,
 * and Lenis smooth momentum scrolling instances.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Force manual scroll restoration to prevent browser from restoring previous scroll offset
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const resetToTop = () => {
      // 1. Native Window and HTML/Body
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }

      // 2. Lenis smooth momentum scroller
      const lenis = (window as any).__lenis;
      if (lenis) {
        if (typeof lenis.scrollTo === 'function') {
          lenis.scrollTo(0, { immediate: true, force: true });
        }
        if (typeof lenis.reset === 'function') {
          lenis.reset();
        }
      }
    };

    // Trigger immediately on route transition
    resetToTop();

    // Multi-frame buffers to overcome React 19 concurrent transition / Next.js chunk mounting
    const r1 = requestAnimationFrame(resetToTop);
    const r2 = requestAnimationFrame(() => requestAnimationFrame(resetToTop));
    const t1 = setTimeout(resetToTop, 25);
    const t2 = setTimeout(resetToTop, 80);
    const t3 = setTimeout(resetToTop, 200);

    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname, searchParams]);

  return null;
}
