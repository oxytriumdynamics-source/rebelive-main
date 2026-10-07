'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { ProductScene } from '@/components/product/ProductScene';
import { FlavorCarouselOverlay } from '@/components/hero/FlavorCarouselOverlay';
import { PodiumOverlays } from '@/components/hero/PodiumOverlays';
import { ProductDetails } from '@/components/product/ProductDetails';
import { StatementSection, StatementBackdrop } from '@/components/sections/StatementSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { SubFooter } from '@/components/sections/SubFooter';
import { FlavorNavigation } from '@/components/product/FlavorNavigation';
import { AtmosphericBackground } from '@/components/effects/AtmosphericBackground';
import { animationState, updateScrollProgress } from '@/lib/animationState';
import dynamic from 'next/dynamic';

const LoadingScreen = dynamic(() => import('@/components/ui/LoadingScreen').then((m) => m.LoadingScreen), {
  ssr: false,
});

const SpecsModal = dynamic(() => import('@/components/ui/SpecsModal').then((m) => m.SpecsModal), {
  ssr: false,
});

import { soundEngine } from '@/lib/audio';
import { hasIntroLoaded } from '@/lib/introState';
import { scrollToLenis } from '@/components/layout/SmoothScroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(500, 33);
}

/**
 * Scroll phase breakpoints - as fraction (0–1) of max scrollable distance.
 * Must stay in sync with the spacer heights defined in the JSX below and
 * with HERO_TO_DETAIL_START / HERO_TO_DETAIL_END in ProductScene.tsx.
 *
 * Spacer heights (viewport = 100vh):
 *   Hero spacer:      100vh   → hero exits at ~100/(490) ≈ 0.20
 *   Details spacer:   240vh   → 4 features × 60vh each
 *   Statement spacer:  80vh
 *   FAQ + Footer:    ~170vh   (actual content, non-spacer)
 *   ─────────────────────────
 *   Total page:       590vh
 *   maxScroll:        490vh
 */
const PHASES = {
  HERO_FADE_START: 0.03,    // Hero overlay begins fading
  HERO_FADE_END: 0.13,    // Hero overlay fully gone

  DETAILS_FADE_IN: 0.12,   // Details panel begins appearing
  DETAILS_FADE_OUT: 0.40,   // Details panel begins fading out
  DETAILS_GONE: 0.45,   // Details panel fully gone

  FEAT_1: 0.16,             // Feature 01 slides in
  FEAT_2: 0.23,             // Feature 02 slides in
  FEAT_3: 0.30,             // Feature 03 slides in
  FEAT_4: 0.37,             // Feature 04 slides in

  STATEMENT_IN: 0.43,     // Statement section fades in (100% solid before Break 5 at 0.49)
  STATEMENT_OUT: 0.82,    // Statement section stays solid through statement-2 (0.76)
  STATEMENT_GONE: 0.86,   // Statement section fully dissolved before SubFooter settles at 0.88
};

/** Discrete section targets for strict 1-section scroll snapping */
export const HOME_SECTIONS = [
  { id: 'hero', progress: 0.0, name: 'Hero' },
  { id: 'feature-1', progress: 0.18, name: 'Energy & Focus' },
  { id: 'feature-2', progress: 0.25, name: 'Stress Relief & Recovery' },
  { id: 'feature-3', progress: 0.32, name: 'Gut Health & Digestive Wellness' },
  { id: 'feature-4', progress: 0.38, name: 'Metabolism & Electrolyte Balance' },
  { id: 'statement-1', progress: 0.50, name: 'Zero Added Sugar' },
  { id: 'statement-2', progress: 0.76, name: 'No Artificial Colors' },
  { id: 'subfooter', progress: 0.88, name: 'Our First Rebels' },
  { id: 'footer', progress: 1.0, name: 'Brand Footer' },
];

/** Linear interpolation helper */
const lerpClamp = (val: number, inMin: number, inMax: number) =>
  Math.min(1, Math.max(0, (val - inMin) / (inMax - inMin)));

export default function App() {
  const router = useRouter();

  // ── Core State ───────────────────────────────────────────────────────
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [targetOffset, setTargetOffset] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [rotationVelocity, setRotationVelocity] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Sync sound status with SoundEngine singleton
  useEffect(() => {
    const unsub = soundEngine.subscribe((enabled) => {
      setSoundEnabled(enabled);
    });
    return unsub;
  }, []);

  const handleToggleSound = useCallback(() => {
    const nextState = soundEngine.toggleAmbient();
    setSoundEnabled(nextState);
    if (nextState) {
      soundEngine.playClick(900);
    }
  }, []);

  // Modals
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const handleOrderNow = useCallback(() => {
    router.push('/shop');
  }, [router]);

  // Page entrance animation state - starts false for deterministic SSR/hydration, synced in useEffect
  const [isPageReady, setIsPageReady] = useState(false);

  const handlePageLoaded = useCallback(() => {
    setIsPageReady(true);
  }, []);

  // Sync entrance readiness safely post-hydration on client
  useEffect(() => {
    if (hasIntroLoaded()) {
      setIsPageReady(true);
      return;
    }
    const timer = setTimeout(() => setIsPageReady(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Guarantee manual scroll restoration so page always starts cleanly at top
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }
  }, []);

  // Refs
  const scrollProgressRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastScrollTime = useRef(0);
  const handleNextFlavorRef = useRef<() => void>(() => { });
  const handlePrevFlavorRef = useRef<() => void>(() => { });
  const prevCanStageRef = useRef<'hero' | 'details' | 'statement' | 'footer'>('hero');
  const prevFeatureIdxRef = useRef<number>(-1);
  const prevStmtIdxRef = useRef<number>(-1);

  // ── Resize / mobile & tablet (debounced to avoid layout thrashing on mobile browser bar resize) ────
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const updateDimensions = () => {
      const w = window.innerWidth;
      const mobile = w < 500;
      const tablet = w >= 500 && w < 1024;
      setIsMobile(mobile);
      setIsTablet(tablet);
      animationState.isMobile = mobile;
      animationState.isTablet = tablet;
    };
    const onResize = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(updateDimensions, 120);
    };
    updateDimensions();
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // ── Mouse parallax (RAF throttled) ──────────────────────────────────
  useEffect(() => {
    let ticking = false;
    let rafId: number | null = null;
    const onMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      if (!ticking) {
        ticking = true;
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        rafId = requestAnimationFrame(() => {
          setMousePosition({ x, y });
          animationState.mouseX = x;
          animationState.mouseY = y;
          ticking = false;
        });
      }
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  // ── Section-by-Section Snapping Engine (GSAP Hardware Accelerated) ───
  const [activeSection, setActiveSection] = useState(0);
  const activeSectionRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  const activeTweenRef = useRef<gsap.core.Tween | null>(null);
  const lastRenderedProgressRef = useRef<number>(0);
  const progressLineRef = useRef<HTMLDivElement>(null);

  const goToSection = useCallback((targetIdx: number) => {
    if (isAnimatingRef.current) return;
    const clamped = Math.max(0, Math.min(targetIdx, HOME_SECTIONS.length - 1));
    if (clamped === activeSectionRef.current) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const prevIdx = activeSectionRef.current;
    isAnimatingRef.current = true;
    lastScrollTimeRef.current = Date.now();
    activeSectionRef.current = clamped;
    setActiveSection(clamped);

    // On-scroll sound: tactile detent sound exclusively when stepping into/through product details features (1-4)
    if (clamped >= 1 && clamped <= 4 && prevFeatureIdxRef.current !== clamped) {
      prevFeatureIdxRef.current = clamped;
      soundEngine.playFeatureTransition(clamped - 1);
    }

    const startP = scrollProgressRef.current;
    const targetP = HOME_SECTIONS[clamped].progress;
    const isStatementTransition =
      (clamped === 5 && prevIdx === 6) ||
      (clamped === 6 && prevIdx === 5);
    const isSubFooterTransition =
      (clamped === 6 && prevIdx === 7) ||
      (clamped === 7 && prevIdx === 6);
    const isFooterTransition =
      (clamped === 7 && prevIdx === 8) ||
      (clamped === 8 && prevIdx === 7);
    const duration = prefersReducedMotion
      ? 0.05
      : isStatementTransition
        ? 0.85
        : (isSubFooterTransition || isFooterTransition)
          ? 0.65
          : (clamped === 0 ? 0.80 : 0.65);

    // Direct smooth scroll to section anchor using Lenis
    if (clamped === 7) {
      // Target: SubFooter
      const subfooterEl = document.getElementById('home-subfooter');
      const targetScrollY = subfooterEl ? subfooterEl.offsetTop : (typeof window !== 'undefined' ? window.innerHeight : 0);
      scrollToLenis(targetScrollY, { duration: 0.65 });
    } else if (clamped === 8) {
      // Target: Main Footer
      const footerEl = document.getElementById('main-footer') || document.querySelector('footer');
      const subfooterEl = document.getElementById('home-subfooter');
      const targetScrollY = footerEl
        ? footerEl.offsetTop
        : (subfooterEl ? subfooterEl.offsetTop + subfooterEl.offsetHeight : (typeof window !== 'undefined' ? window.innerHeight * 2 : 0));
      scrollToLenis(targetScrollY, { duration: 0.80 });
    } else if (clamped <= 6) {
      // Target: 3D stage (Hero, Details, Statement)
      scrollToLenis(0, { duration: 0.65 });
    }

    if (activeTweenRef.current) {
      activeTweenRef.current.kill();
    }

    const proxy = { val: startP };

    activeTweenRef.current = gsap.to(proxy, {
      val: targetP,
      duration,
      ease: prefersReducedMotion ? 'none' : 'power2.out',
      onUpdate: () => {
        const currentP = proxy.val;
        scrollProgressRef.current = currentP;
        updateScrollProgress(currentP);

        // Hardware-accelerated direct GPU update for top progress line (0 React re-renders)
        if (progressLineRef.current) {
          progressLineRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, currentP))})`;
        }

        // Homepage Scroll Sound: Curtain Slide Air Effect
        let currentStage: 'hero' | 'details' | 'other' = 'hero';
        if (currentP < 0.08) currentStage = 'hero';
        else if (currentP < 0.43) currentStage = 'details';
        else currentStage = 'other';

        if (prevCanStageRef.current !== (currentStage as any)) {
          const prevStage = prevCanStageRef.current;
          prevCanStageRef.current = currentStage as any;
          if ((prevStage === 'hero' && currentStage === 'details') || (prevStage === 'details' && currentStage === 'hero')) {
            soundEngine.playCurtainSlide();
          }
        }

        // Throttle React state updates to avoid continuous 120Hz React tree reconciliations
        if (Math.abs(currentP - lastRenderedProgressRef.current) >= 0.012) {
          lastRenderedProgressRef.current = currentP;
          setScrollProgress(currentP);
        }
      },
      onComplete: () => {
        scrollProgressRef.current = targetP;
        updateScrollProgress(targetP);
        lastRenderedProgressRef.current = targetP;
        setScrollProgress(targetP);

        if (progressLineRef.current) {
          progressLineRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, targetP))})`;
        }

        if (clamped <= 6) {
          if (typeof window !== 'undefined' && window.scrollY > 20) {
            window.scrollTo({ top: 0, behavior: 'instant' as any });
          }
        }
        setTimeout(() => {
          isAnimatingRef.current = false;
        }, 80);
      },
    });
  }, []);

  const goToNext = useCallback(() => {
    if (activeSectionRef.current < HOME_SECTIONS.length - 1) {
      goToSection(activeSectionRef.current + 1);
    }
  }, [goToSection]);

  const goToPrev = useCallback(() => {
    if (activeSectionRef.current > 0) {
      goToSection(activeSectionRef.current - 1);
    }
  }, [goToSection]);

  // ── Sync scroll position with activeSection & scrollProgress in SubFooter / Footer zone ──
  useEffect(() => {
    const handleScrollSync = () => {
      const subfooterEl = document.getElementById('home-subfooter');
      const footerEl = document.getElementById('main-footer') || document.querySelector('footer');
      if (!subfooterEl) return;

      const subfooterTop = subfooterEl.offsetTop;
      const footerTop = footerEl ? footerEl.offsetTop : subfooterTop + subfooterEl.offsetHeight;
      const scrollY = window.scrollY;

      // In or past the SubFooter zone
      if (scrollY >= subfooterTop - 60) {
        if (scrollY >= footerTop - 80) {
          if (activeSectionRef.current !== 8 && !isAnimatingRef.current) {
            activeSectionRef.current = 8;
            setActiveSection(8);
          }
          // Compute smooth progress through the footer
          const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
          const footerScrollDist = Math.max(1, maxScroll - footerTop);
          const footerProgress = Math.min(1, Math.max(0, (scrollY - footerTop) / footerScrollDist));
          const p = 0.88 + footerProgress * 0.12;

          scrollProgressRef.current = p;
          updateScrollProgress(p);
          if (progressLineRef.current) {
            progressLineRef.current.style.transform = `scaleX(${Math.min(1, p)})`;
          }
          setScrollProgress(p);
        } else {
          if (activeSectionRef.current !== 7 && !isAnimatingRef.current) {
            activeSectionRef.current = 7;
            setActiveSection(7);
          }
          const p = 0.88;
          scrollProgressRef.current = p;
          updateScrollProgress(p);
          if (progressLineRef.current) {
            progressLineRef.current.style.transform = `scaleX(${p})`;
          }
          setScrollProgress(p);
        }
      }
    };

    window.addEventListener('scroll', handleScrollSync, { passive: true });

    let lenisUnsub: (() => void) | null = null;
    const lenis = (window as any).__lenis;
    if (lenis && typeof lenis.on === 'function') {
      lenis.on('scroll', handleScrollSync);
      lenisUnsub = () => lenis.off('scroll', handleScrollSync);
    }

    return () => {
      window.removeEventListener('scroll', handleScrollSync);
      if (lenisUnsub) lenisUnsub();
    };
  }, []);

  // ── Wheel Event Listener (Smooth Footer & Section Snapping) ───────────
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isSpecsOpen || isMenuOpen || isContactOpen || isOrderOpen) return;
      if ((e.target as HTMLElement)?.closest?.('[role="dialog"], .modal')) return;

      // Ignore horizontal swipes (preserved for flavor switching)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.5 && Math.abs(e.deltaX) > 25) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 14) return;

      // CRITICAL: Block wheel inputs while transition is running so Lenis is NEVER interrupted or stopped in the middle
      if (isAnimatingRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const subfooterEl = document.getElementById('home-subfooter');
      const subfooterTop = subfooterEl ? subfooterEl.offsetTop : (typeof window !== 'undefined' ? window.innerHeight : 800);
      const isAtOrPastSubfooter = typeof window !== 'undefined' && window.scrollY >= subfooterTop - 20;

      // In the SubFooter and Footer zone: allow natural, buttery-smooth Lenis scrolling
      if (isAtOrPastSubfooter) {
        if (delta > 0) {
          // Scrolling down: let Lenis smoothly scroll through subfooter and footer without interruption
          return;
        } else {
          // Scrolling up:
          // If we haven't reached the top of SubFooter yet, allow smooth scrolling upward
          if (window.scrollY > subfooterTop + 20) {
            return;
          }
          // If user reached the very top of SubFooter and scrolls up further,
          // smoothly transition back to 3D stage Section 6 (Statement)
          e.preventDefault();
          e.stopPropagation();
          const now = Date.now();
          if (now - lastScrollTimeRef.current < 450) return;
          goToSection(6);
          return;
        }
      }

      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastScrollTimeRef.current < 650) return;

      if (delta > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, [isSpecsOpen, isMenuOpen, isContactOpen, isOrderOpen, goToNext, goToPrev, goToSection]);

  // ── Touch Swipe Gestures (Mobile Smooth Scroll & Pull-to-Refresh Guard) ────
  useEffect(() => {
    let touchStartY = 0;
    let touchStartX = 0;
    let touchStartTime = 0;
    let hasSwipedInCurrentGesture = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
      hasSwipedInCurrentGesture = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isSpecsOpen || isMenuOpen || isContactOpen || isOrderOpen) return;
      if (e.touches.length !== 1) return;
      if ((e.target as HTMLElement)?.closest?.('[role="dialog"], .modal, input, textarea')) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = touchStartY - currentY;
      const deltaX = touchStartX - currentX;
      const absDeltaY = Math.abs(deltaY);
      const absDeltaX = Math.abs(deltaX);

      const subfooterEl = document.getElementById('home-subfooter');
      const subfooterTop = subfooterEl ? subfooterEl.offsetTop : (typeof window !== 'undefined' ? window.innerHeight : 800);
      const isAtOrPastSubfooter = typeof window !== 'undefined' && window.scrollY >= subfooterTop - 20;

      // In the SubFooter and Footer zone: allow natural smooth Lenis scrolling
      if (isAtOrPastSubfooter) {
        if (deltaY > 0) {
          // Swiping up (scrolling down): let Lenis scroll naturally
          return;
        } else {
          // Swiping down (scrolling up):
          if (window.scrollY > subfooterTop + 15) {
            return;
          }
          if (e.cancelable) e.preventDefault();
          if (hasSwipedInCurrentGesture) return;
          const now = Date.now();
          if (now - lastScrollTimeRef.current < 450) return;
          hasSwipedInCurrentGesture = true;
          goToSection(6);
          return;
        }
      }

      // CRITICAL FOR MOBILE: Inside 3D Stage (Sections 0-6),
      // Prevent browser default pull-to-refresh on vertical drag immediately on the very first frame!
      if (absDeltaY > 3 && absDeltaY >= absDeltaX * 0.75) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }

      // Ignore horizontal swipes (preserved for horizontal flavor navigation)
      if (absDeltaX > absDeltaY * 1.3) return;

      // Prevent multi-triggering while finger is still moving
      if (hasSwipedInCurrentGesture || isAnimatingRef.current) {
        return;
      }

      // Calibrated threshold for intentional, smooth section stepping
      const SWIPE_THRESHOLD = 45;
      if (absDeltaY >= SWIPE_THRESHOLD) {
        const now = Date.now();
        if (now - lastScrollTimeRef.current < 500) return;

        hasSwipedInCurrentGesture = true;
        if (deltaY > 0) {
          goToNext();
        } else {
          goToPrev();
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (hasSwipedInCurrentGesture) {
        hasSwipedInCurrentGesture = false;
        return;
      }

      if (isSpecsOpen || isMenuOpen || isContactOpen || isOrderOpen) return;
      if (isAnimatingRef.current) return;

      const subfooterEl = document.getElementById('home-subfooter');
      const subfooterTop = subfooterEl ? subfooterEl.offsetTop : (typeof window !== 'undefined' ? window.innerHeight : 800);
      const isAtOrPastSubfooter = typeof window !== 'undefined' && window.scrollY >= subfooterTop - 20;
      if (isAtOrPastSubfooter) return;

      // Check for quick flick gesture
      const changedTouch = e.changedTouches[0];
      if (!changedTouch) return;

      const deltaY = touchStartY - changedTouch.clientY;
      const deltaX = touchStartX - changedTouch.clientX;
      const absDeltaY = Math.abs(deltaY);
      const absDeltaX = Math.abs(deltaX);
      const elapsed = Date.now() - touchStartTime;

      if (elapsed < 300 && absDeltaY >= 25 && absDeltaY > absDeltaX * 1.2) {
        const now = Date.now();
        if (now - lastScrollTimeRef.current >= 450) {
          if (deltaY > 0) {
            goToNext();
          } else {
            goToPrev();
          }
        }
      }

      hasSwipedInCurrentGesture = false;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isSpecsOpen, isMenuOpen, isContactOpen, isOrderOpen, goToNext, goToPrev, goToSection]);

  // ── Keyboard Arrows Navigation ───────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSpecsOpen || isMenuOpen || isContactOpen || isOrderOpen) return;
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      if (['ArrowDown', 'PageDown'].includes(e.key)) {
        if (activeSectionRef.current >= 7) return; // Allow natural smooth scroll in footer
        e.preventDefault();
        goToNext();
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        if (activeSectionRef.current >= 7) {
          const subfooterEl = document.getElementById('home-subfooter');
          const subfooterTop = subfooterEl ? subfooterEl.offsetTop : (typeof window !== 'undefined' ? window.innerHeight : 800);
          if (window.scrollY > subfooterTop + 25) {
            return; // Allow natural smooth scroll upward in footer
          }
          e.preventDefault();
          goToSection(6);
          return;
        }
        if (activeSectionRef.current === 0) return;
        e.preventDefault();
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpecsOpen, isMenuOpen, isContactOpen, isOrderOpen, goToNext, goToPrev, goToSection]);

  // ── Horizontal trackpad wheel → flavor switching ─────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // Only in hero phase (before it fades out)
      if (scrollProgressRef.current > PHASES.HERO_FADE_END) return;
      if (isContactOpen || isMenuOpen) return;
      const now = Date.now();
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.5 && Math.abs(e.deltaX) > 30;
      if (isHorizontal && now - lastScrollTime.current > 380) {
        lastScrollTime.current = now;
        if (e.deltaX > 0) handleNextFlavorRef.current();
        else handlePrevFlavorRef.current();
      }
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [isContactOpen, isMenuOpen]);

  // ── Flavor handlers ──────────────────────────────────────────────────
  const handleSelectFlavor = useCallback((index: number) => {
    setSelectedIndex(index);
    setTargetOffset(index);
    setRotationVelocity(2.8);
    soundEngine.playClick();
  }, []);

  const handleNextFlavor = useCallback(() => {
    const next = (selectedIndex + 1) % PRODUCTS.length;
    setSelectedIndex(next);
    setTargetOffset((p) => p + 1);
    setRotationVelocity(1.8);
    setTimeout(() => setRotationVelocity(0), 350);
    soundEngine.playClick();
  }, [selectedIndex]);

  const handlePrevFlavor = useCallback(() => {
    const prev = (selectedIndex - 1 + PRODUCTS.length) % PRODUCTS.length;
    setSelectedIndex(prev);
    setTargetOffset((p) => p - 1);
    setRotationVelocity(-1.8);
    setTimeout(() => setRotationVelocity(0), 350);
    soundEngine.playClick();
  }, [selectedIndex]);

  // Keep refs current so the wheel handler (empty-dep effect) can call the latest version
  useEffect(() => { handleNextFlavorRef.current = handleNextFlavor; }, [handleNextFlavor]);
  useEffect(() => { handlePrevFlavorRef.current = handlePrevFlavor; }, [handlePrevFlavor]);

  // ── Derived state ────────────────────────────────────────────────────
  const currentProduct = PRODUCTS[selectedIndex];

  // Panel opacities (all clamped 0–1)
  const heroOpacity = 1 - lerpClamp(scrollProgress, PHASES.HERO_FADE_START, PHASES.HERO_FADE_END);

  const detailsIn = lerpClamp(scrollProgress, PHASES.DETAILS_FADE_IN, PHASES.DETAILS_FADE_IN + 0.05);
  const detailsOut = lerpClamp(scrollProgress, PHASES.DETAILS_FADE_OUT, PHASES.DETAILS_GONE);
  const detailsOpacity = detailsIn * (1 - detailsOut);

  const stmtIn = lerpClamp(scrollProgress, PHASES.STATEMENT_IN, PHASES.STATEMENT_IN + 0.05);
  const stmtOut = lerpClamp(scrollProgress, PHASES.STATEMENT_OUT, PHASES.STATEMENT_GONE);
  const statementOpacity = stmtIn * (1 - stmtOut);

  const isSubFooterVisible = activeSection >= 7 || scrollProgress >= 0.76;
  const subFooterOpacity =
    activeSection >= 7 && typeof window !== 'undefined' && window.scrollY >= 40
      ? 1
      : lerpClamp(scrollProgress, 0.76, 0.88);


  const activeFeatureIndex =
    scrollProgress < PHASES.FEAT_1 ? -1 :
      scrollProgress < PHASES.FEAT_2 ? 0 :
        scrollProgress < PHASES.FEAT_3 ? 1 :
          scrollProgress < PHASES.FEAT_4 ? 2 : 3;

 
  const isDarkHeader = (scrollProgress >= 0.45 && scrollProgress <= 0.90) || scrollProgress >= 0.96;

  return (
    <div className="relative w-full min-h-screen bg-black text-white select-none overflow-x-hidden">
      <LoadingScreen onLoaded={handlePageLoaded} />

      {/* ── Butter-Smooth Momentum Scroll Progress Hairline with Break Notches (z-50) ── */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none bg-white/10">
        <div
          ref={progressLineRef}
          className="h-full w-full bg-gradient-to-r from-neutral-600 via-white to-amber-400 shadow-[0_0_12px_rgba(255,255,255,0.7)] origin-left will-change-transform"
          style={{ transform: `scaleX(${Math.min(1, Math.max(0, scrollProgress))})` }}
        />
        {/* Subtle break milestone notch marks */}
        {[0.16, 0.23, 0.30, 0.37, 0.49, 0.62, 0.75, 0.88].map((pct, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-[1px] bg-white/25 pointer-events-none"
            style={{ left: `${pct * 100}%` }}
          />
        ))}
      </div>

      {/* ── Fixed 3D Background Layers (z-0) ──────────────────────── */}
      <motion.div
        initial={false}
        animate={isPageReady ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        <AtmosphericBackground
          currentProduct={currentProduct}
          isMobile={isMobile}
        />
      </motion.div>


      <StatementBackdrop
        opacity={statementOpacity}
        scrollProgress={scrollProgress}
        mousePosition={mousePosition}
        product={currentProduct}
        isMobile={isMobile}
        isTablet={isTablet}
      />

      {/* ── Fixed Podium Overlays (Top & Down Podiums with Black Gradients) ── */}
      <PodiumOverlays
        scrollProgress={scrollProgress}
        mousePosition={mousePosition}
        isMobile={isMobile}
        isPageReady={isPageReady}
      />

      {/* ── Details Section Full-Page Translucent Glass Backdrop (z-5, behind 3D can) ── */}
      <div
        className="fixed inset-0 z-5 pointer-events-none transition-opacity duration-300 ease-out"
        style={{
          opacity: detailsOpacity,
          visibility: detailsOpacity > 0.005 ? 'visible' : 'hidden',
        }}
      >
        {/* High-performance dark atmospheric veil without full-screen GPU blur penalty */}
        <div className="absolute inset-0 bg-neutral-950/40 bg-gradient-to-b from-black/25 via-neutral-950/50 to-black/35" />

        {/* Subtle diagonal ambient glass sheen reflection */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 45%, rgba(255,255,255,0.02) 70%, transparent 100%)',
          }}
        />
      </div>

      {/* ── 3D Product Scene (z-10, can sits in front of ZERO BULLSHIT text) ── */}
      <ProductScene
        products={PRODUCTS}
        selectedIndex={selectedIndex}
        carouselOffset={targetOffset}
        scrollProgress={scrollProgress}
        rotationVelocity={rotationVelocity}
        mousePosition={mousePosition}
        isMobile={isMobile}
        isTablet={isTablet}
        isPageReady={isPageReady}
        onSelectFlavor={handleSelectFlavor}
      />

      {/* ── Fixed Panel: HERO (z-30) ──────────────────────────────── */}
      <div
        className="fixed inset-0 z-30 transition-[visibility] duration-150"
        style={{
          opacity: heroOpacity,
          pointerEvents: heroOpacity > 0.08 ? 'auto' : 'none',
          visibility: heroOpacity > 0.005 ? 'visible' : 'hidden',
        }}
      >
        <FlavorCarouselOverlay
          products={PRODUCTS}
          selectedIndex={selectedIndex}
          scrollProgress={scrollProgress}
          isPageReady={isPageReady}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onPrevFlavor={handlePrevFlavor}
          onNextFlavor={handleNextFlavor}
          onSelectFlavor={handleSelectFlavor}
          onOrderNow={handleOrderNow}
        />
      </div>

      {/* ── Fixed Panel: PRODUCT DETAILS (z-25) ───────────────────── */}
      <div
        className="fixed inset-0 z-25 transition-[visibility] duration-150"
        style={{
          opacity: detailsOpacity,
          pointerEvents: detailsOpacity > 0.08 ? 'auto' : 'none',
          visibility: detailsOpacity > 0.005 ? 'visible' : 'hidden',
        }}
      >
        <ProductDetails
          product={currentProduct}
          products={PRODUCTS}
          selectedIndex={selectedIndex}
          activeFeatureIndex={activeFeatureIndex}
          onPrevFlavor={handlePrevFlavor}
          onNextFlavor={handleNextFlavor}
          onSelectFlavor={handleSelectFlavor}
          onOrderNow={handleOrderNow}
          onOpenSpecs={() => setIsSpecsOpen(true)}
          onSelectFeature={(idx) => goToSection(idx + 1)}
        />
      </div>

      {/* ── Fixed Panel: STATEMENT (z-25) ─────────────────────────── */}
      <div
        className="fixed inset-0 z-25 pointer-events-none transition-[visibility] duration-150"
        style={{
          opacity: statementOpacity,
          visibility: statementOpacity > 0.005 ? 'visible' : 'hidden',
        }}
      >
        <StatementSection
          product={currentProduct}
          onOrderNow={handleOrderNow}
        />
      </div>

      {/* ── Fixed Floating Quick Bar (Flavor Dots + Order CTA) across Details & Statement phases (z-30) ── */}
      <AnimatePresence>
        {scrollProgress >= 0.12 && scrollProgress <= 0.82 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-3.5 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-4 pointer-events-auto z-30 select-none"
          >
            {/* Flavor Selector Dots with Translucent Glass */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-neutral-950/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)]">
              {PRODUCTS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectFlavor(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === selectedIndex
                      ? 'w-7 bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  title={p.name}
                  aria-label={p.name}
                />
              ))}
              <span
                className="text-[10px] text-white/80 tracking-wider font-semibold ml-1.5 uppercase"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {currentProduct.name}
              </span>
            </div>

            {/* Order button (Poppins) */}
            <button
              onClick={handleOrderNow}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white text-black text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase hover:bg-neutral-200 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.35)]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
              aria-label="Order Rebelive"
            >
              <span>ORDER</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3D Stage Anchor (100vh): contains Hero, Details, and Statement stages ── */}
      <div className="relative pointer-events-none h-screen w-full" aria-hidden="true" />

      {/* ── Post-Statement Experience (Testimonials & Nutrition SubFooter) ── */}
      <div
        id="home-subfooter"
        className="relative z-20 w-full min-h-screen flex flex-col items-center justify-start pt-10 sm:pt-14 pb-12 transition-opacity duration-300 ease-out"
        style={{
          visibility: isSubFooterVisible ? 'visible' : 'hidden',
          opacity: subFooterOpacity,
          pointerEvents: isSubFooterVisible ? 'auto' : 'none',
        }}
      >
        <TestimonialsSection className="!pt-8 sm:!pt-12 !pb-8 sm:!pb-12" />
        <SubFooter />
      </div>

      <SpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
        product={currentProduct}
      />


    </div>
  );
}

