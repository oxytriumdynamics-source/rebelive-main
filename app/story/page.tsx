'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Sparkles, Zap, Shield, Heart, X, ArrowUp } from 'lucide-react';

const MONO = "'JetBrains Mono', 'Poppins', monospace";
const SANS = "'Poppins', sans-serif";

const SECTIONS = [
  { id: 'hero', tag: '01 // ORIGIN', title: 'THE STORY OF REBELIVE' },
  { id: 'apple-moment', tag: '02 // THE SPARK', title: 'IT ALL STARTED WITH AN APPLE' },
  { id: 'why-it-fell', tag: '03 // OUR MOMENT', title: 'WHY DID IT FALL?' },
  { id: 'realization', tag: '04 // REALIZATION', title: 'THE HARD REALIZATION' },
  { id: 'identity', tag: '05 // VOICE', title: "HI. I'M REBELIVE" },
  { id: 'why-i-exist', tag: '06 // PURPOSE', title: 'WHY I EXIST' },
  { id: 'manifesto', tag: '07 // MANIFESTO', title: 'BUILT BY TWO' },
];

const LUX_EASE = [0.22, 1, 0.36, 1] as const;

// ── Motion Animation Variants for Smooth Staggered Reveals ──
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.75,
      ease: LUX_EASE,
    },
  },
};

const fadeUpSlow = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      ease: LUX_EASE,
    },
  },
};

const visualReveal = {
  hidden: { opacity: 0, scale: 0.92, y: 25 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: LUX_EASE,
      delay: 0.15,
    },
  },
};

const cardPop = {
  hidden: { opacity: 0, scale: 0.96, y: 24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: LUX_EASE,
    },
  },
};

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactive Product Flavor Drawer (No Sound)
 * ─────────────────────────────────────────────────────────────────────────────
 */
const FLAVORS = [
  {
    name: 'REBELIVE CLARITY',
    tagline: 'L-Theanine + Lion’s Mane + Clean Green Tea Caffeine',
    desc: 'Laser focus without the jittery crash. Smooth sustained mental edge for deep work and marathon days.',
    color: 'from-amber-500/20 to-neutral-900',
    border: 'border-amber-500/30',
    icon: Sparkles,
  },
  {
    name: 'REBELIVE FLOW',
    tagline: 'Ashwagandha + Magnesium L-Threonate + Rhodiola',
    desc: 'Unclench the nervous system while staying sharp and composed in high-pressure situations.',
    color: 'from-sky-500/20 to-neutral-900',
    border: 'border-sky-500/30',
    icon: Shield,
  },
  {
    name: 'REBELIVE SURGE',
    tagline: 'Electrolytes + B-Complex + CoQ10 + Cordyceps',
    desc: 'Cellular hydration and natural vitality when the day demands more than you slept for.',
    color: 'from-emerald-500/20 to-neutral-900',
    border: 'border-emerald-500/30',
    icon: Zap,
  },
  {
    name: 'REBELIVE REPAIR',
    tagline: 'Tart Cherry + Glycine + Zinc + Reishi',
    desc: 'Evening restore to wind down an overstimulated brain and wake up refreshed.',
    color: 'from-purple-500/20 to-neutral-900',
    border: 'border-purple-500/30',
    icon: Heart,
  },
];

function FlavorDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div
      data-prevent-slide
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/20 rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(255,255,255,0.15)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-white/50">
              REBELIVE LINEUP
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
              THE FUNCTIONAL FORMULAS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Flavors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {FLAVORS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl bg-gradient-to-br ${item.color} border ${item.border} flex flex-col justify-between hover:scale-[1.01] transition-transform`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-white/60">
                      FORMULA 0{idx + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-xl font-black uppercase text-white mb-1">{item.name}</h4>
                  <p className="font-mono text-xs text-white/80 mb-3">{item.tagline}</p>
                  <p className="text-sm text-white/70 font-light leading-relaxed">{item.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-white/50">ZERO SUGAR • ADAPTOGENS</span>
                  <button
                    onClick={onClose}
                    className="px-4 py-1.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    SELECT
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Notice */}
        <div className="mt-8 p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
          <p className="text-xs font-mono text-white/60">
            Crafted for modern chaos. Clean ingredients, scientifically dosed, 100% transparent label.
          </p>
        </div>
      </div>
    </div>
  );
}

const SECTION_5_PARAGRAPHS = [
  "Yep. That’s me. I exist because my founders were two absolute idiots who couldn’t keep their own shit together.",
  "They couldn’t always eat on time. They couldn’t always sleep on time. They were constantly balancing work, ambition, responsibilities and everything else life decided to throw at them.",
  "At some point, they looked at each other and thought, “Surely we’re not the only ones screwing this up.”",
  "They weren’t. So they built me.",
  "I’m not here to tell you to wake up at 5 AM or hand you another perfect morning routine. Life isn’t perfectly balanced. Some days lunch becomes dinner. Some nights sleep gets pushed way too far. Some mornings demand more than you were ready to give.",
  "That’s where I come in.",
  "I’m a functional beverage built for people whose lives don’t fit neatly into a wellness routine. With functional ingredients to support energy, focus, calm, gut health and everyday wellbeing, I’m here to make taking care of yourself a little easier.",
  "I don’t expect you to slow down. I was built for when you can’t.",
];

export default function StoryPage() {
  const [activeSection, setActiveSection] = useState(0);
  const activeSectionRef = useRef(0);
  const [shopOpen, setShopOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Transition locking & trackpad inertia absorber refs
  const isAnimatingRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);
  const wheelDecayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const unlockTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartYRef = useRef(0);
  const touchStartXRef = useRef(0);
  const touchTriggeredInSwipeRef = useRef(false);

  const TRANSITION_DURATION = 750;

  // Pause Lenis smooth-scroll so it never fights deck transitions
  useEffect(() => {
    const lenis = (window as any).__lenis;
    if (lenis && typeof lenis.stop === 'function') {
      lenis.stop();
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });

    return () => {
      const len = (window as any).__lenis;
      if (len && typeof len.start === 'function') {
        len.start();
      }
    };
  }, []);

  // Keep documentElement scrollable on story page without Lenis overflow:clip interference
  useEffect(() => {
    document.documentElement.classList.add('story-page-active');
    return () => {
      document.documentElement.classList.remove('story-page-active');
    };
  }, []);

  const goToSection = useCallback((targetIdx: number) => {
    // If currently scrolled down into footer, always scroll window smoothly back to top!
    if (window.scrollY > 10) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const clamped = Math.max(0, Math.min(targetIdx, SECTIONS.length - 1));
    if (clamped === activeSectionRef.current) return;

    isAnimatingRef.current = true;
    lastScrollTimeRef.current = Date.now();
    accumulatedDeltaRef.current = 0;
    activeSectionRef.current = clamped;
    setActiveSection(clamped);

    if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = setTimeout(() => {
      isAnimatingRef.current = false;
      accumulatedDeltaRef.current = 0;
    }, TRANSITION_DURATION);
  }, []);

  const goToNext = useCallback(() => {
    if (activeSectionRef.current < SECTIONS.length - 1) {
      goToSection(activeSectionRef.current + 1);
    }
  }, [goToSection]);

  const goToPrev = useCallback(() => {
    if (activeSectionRef.current > 0) {
      goToSection(activeSectionRef.current - 1);
    }
  }, [goToSection]);

  // ── Bulletproof Touchpad & Mouse Wheel Scroll Engine (Strict 1-Section Snapping + Seamless Footer Return) ──
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (shopOpen) return;
      if ((e.target as HTMLElement)?.closest?.('[data-prevent-slide]')) return;

      const now = Date.now();

      // Normalize delta across deltaModes (0 = pixels, 1 = lines, 2 = pages)
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 24;
      else if (e.deltaMode === 2) delta *= 100;

      // Ignore resting finger micro-noise on touchpads (< 1.5px)
      if (Math.abs(delta) < 1.5) return;

      // Ignore pure horizontal swipe gestures
      if (Math.abs(e.deltaX) > Math.abs(delta) * 1.8) return;

      // Reset accumulator on significant direction reversal
      if (
        (accumulatedDeltaRef.current > 0 && delta < -4) ||
        (accumulatedDeltaRef.current < 0 && delta > 4)
      ) {
        accumulatedDeltaRef.current = 0;
      }

      accumulatedDeltaRef.current += delta;

      // Decay accumulator if user pauses gesture for 140ms
      if (wheelDecayTimerRef.current) {
        clearTimeout(wheelDecayTimerRef.current);
      }
      wheelDecayTimerRef.current = setTimeout(() => {
        accumulatedDeltaRef.current = 0;
      }, 140);

      // ── CHECK IF USER IS SCROLLED DOWN INTO FOOTER ──
      const isInFooter = window.scrollY > 20;

      if (isInFooter) {
        // When user scrolls UP while in footer: smoothly transition back up to Manifesto (Slide 6)
        if (delta < -12 || accumulatedDeltaRef.current < -18) {
          e.preventDefault();
          e.stopPropagation();

          if (isAnimatingRef.current || now - lastScrollTimeRef.current < 350) {
            accumulatedDeltaRef.current = 0;
            return;
          }

          isAnimatingRef.current = true;
          lastScrollTimeRef.current = now;
          accumulatedDeltaRef.current = 0;

          window.scrollTo({ top: 0, behavior: 'smooth' });
          activeSectionRef.current = SECTIONS.length - 1;
          setActiveSection(SECTIONS.length - 1);

          setTimeout(() => {
            isAnimatingRef.current = false;
            accumulatedDeltaRef.current = 0;
          }, TRANSITION_DURATION);
        }
        return;
      }

      // ── WITHIN STORY DECK: CONTROL SECTION SCROLL ──
      e.preventDefault();
      e.stopPropagation();

      // While slide transition is actively animating or in cooldown:
      // discard inertia events and keep accumulator at zero
      if (isAnimatingRef.current || now - lastScrollTimeRef.current < TRANSITION_DURATION) {
        accumulatedDeltaRef.current = 0;
        return;
      }

      // If at last section (Manifesto) and user deliberately scrolls down:
      if (activeSectionRef.current === SECTIONS.length - 1 && (accumulatedDeltaRef.current > 24 || delta > 20)) {
        const footerEl = document.querySelector('footer');
        if (footerEl) {
          isAnimatingRef.current = true;
          lastScrollTimeRef.current = now;
          accumulatedDeltaRef.current = 0;

          footerEl.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            isAnimatingRef.current = false;
            accumulatedDeltaRef.current = 0;
          }, TRANSITION_DURATION);
        }
        return;
      }

      // Sensitivity threshold for deliberate swipe initiation
      const THRESHOLD = 22;
      if (Math.abs(accumulatedDeltaRef.current) < THRESHOLD && Math.abs(delta) < THRESHOLD) {
        return;
      }

      // If at top slide and scrolling up, do nothing and do not lock
      const isDown = accumulatedDeltaRef.current > 0 || delta > 0;
      if (!isDown && activeSectionRef.current === 0) {
        accumulatedDeltaRef.current = 0;
        return;
      }

      // ── TRIGGER 1 SECTION JUMP ──
      accumulatedDeltaRef.current = 0;
      isAnimatingRef.current = true;
      lastScrollTimeRef.current = now;

      if (isDown) {
        goToNext();
      } else {
        goToPrev();
      }

      setTimeout(() => {
        isAnimatingRef.current = false;
        accumulatedDeltaRef.current = 0;
      }, TRANSITION_DURATION);
    };

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true });
      if (wheelDecayTimerRef.current) clearTimeout(wheelDecayTimerRef.current);
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    };
  }, [shopOpen, goToNext, goToPrev]);

  // ── Touch Swipe Gestures (Mobile, Tablet, and Desktop Touch) ──
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartYRef.current = e.touches[0].clientY;
      touchStartXRef.current = e.touches[0].clientX;
      touchTriggeredInSwipeRef.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (shopOpen) return;
      if (e.touches.length !== 1) return;

      const target = e.target as HTMLElement;
      // Allow natural scrolling inside elements with data-prevent-slide
      const scrollable = target?.closest?.('[data-prevent-slide]') as HTMLElement | null;
      if (scrollable) {
        const deltaY = touchStartYRef.current - e.touches[0].clientY;
        const canScrollDown = scrollable.scrollTop + scrollable.clientHeight < scrollable.scrollHeight - 4;
        const canScrollUp = scrollable.scrollTop > 4;
        if ((deltaY > 0 && canScrollDown) || (deltaY < 0 && canScrollUp)) {
          return;
        }
      }

      const deltaY = touchStartYRef.current - e.touches[0].clientY;
      const deltaX = touchStartXRef.current - e.touches[0].clientX;

      // Ignore predominantly horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.3) return;

      // In Footer zone: swiping downwards (finger moves down = scrolling up) returns to deck
      if (window.scrollY > 20) {
        if (deltaY < -20) {
          e.preventDefault();
          if (isAnimatingRef.current || touchTriggeredInSwipeRef.current) return;
          const now = Date.now();
          if (now - lastScrollTimeRef.current < 400) return;

          touchTriggeredInSwipeRef.current = true;
          isAnimatingRef.current = true;
          lastScrollTimeRef.current = now;

          window.scrollTo({ top: 0, behavior: 'smooth' });
          activeSectionRef.current = SECTIONS.length - 1;
          setActiveSection(SECTIONS.length - 1);

          setTimeout(() => {
            isAnimatingRef.current = false;
          }, TRANSITION_DURATION);
        }
        return;
      }

      // At Manifesto slide: swiping up (finger moves up, deltaY > 0) scrolls to footer
      if (activeSectionRef.current === SECTIONS.length - 1 && deltaY > 30) {
        const footerEl = document.querySelector('footer');
        if (footerEl) {
          e.preventDefault();
          if (isAnimatingRef.current || touchTriggeredInSwipeRef.current) return;
          touchTriggeredInSwipeRef.current = true;
          isAnimatingRef.current = true;
          lastScrollTimeRef.current = Date.now();

          footerEl.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            isAnimatingRef.current = false;
          }, TRANSITION_DURATION);
        }
        return;
      }

      // If at top slide and swiping down, do nothing
      if (activeSectionRef.current === 0 && deltaY < 0) {
        return;
      }

      if (Math.abs(deltaY) < 30) return;

      e.preventDefault();

      if (isAnimatingRef.current || touchTriggeredInSwipeRef.current) return;
      const now = Date.now();
      if (now - lastScrollTimeRef.current < TRANSITION_DURATION) return;

      touchTriggeredInSwipeRef.current = true;
      if (deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    };

    const handleTouchEnd = () => {
      touchTriggeredInSwipeRef.current = false;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [shopOpen, goToNext, goToPrev]);

  // ── Keyboard Navigation (Arrow Keys / Page Keys / Space) ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (shopOpen) return;
      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement)?.tagName?.toLowerCase() || '')) return;

      // In Footer zone: allow ArrowUp / PageUp / Shift+Space / Home to scroll back to deck
      if (window.scrollY > 20) {
        if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
          e.preventDefault();
          if (isAnimatingRef.current) return;
          isAnimatingRef.current = true;
          lastScrollTimeRef.current = Date.now();

          window.scrollTo({ top: 0, behavior: 'smooth' });
          activeSectionRef.current = SECTIONS.length - 1;
          setActiveSection(SECTIONS.length - 1);

          setTimeout(() => {
            isAnimatingRef.current = false;
          }, TRANSITION_DURATION);
        } else if (e.key === 'Home') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          goToSection(0);
        }
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        if (activeSectionRef.current === SECTIONS.length - 1) {
          const footerEl = document.querySelector('footer');
          if (footerEl) {
            e.preventDefault();
            footerEl.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        }
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSection(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shopOpen, goToNext, goToPrev, goToSection]);

  return (
    <div
      id="story-deck"
      style={{ fontFamily: SANS }}
      className="relative w-full h-[100dvh] w-screen text-white bg-black select-none overflow-hidden"
    >
      {/* Large Ghost Background Watermark */}
      <div className="fixed top-24 sm:top-28 left-1/2 -translate-x-1/2 select-none pointer-events-none text-[18vw] sm:text-[16vw] font-black uppercase text-white/[0.015] whitespace-nowrap tracking-tighter -z-10 leading-none">
        REBELIVE
      </div>

      {/* ── Slides Track: Discrete 60fps GPU Track on both Mobile and Desktop ── */}
      <div
        className="w-full h-full flex flex-col transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
        style={{ transform: `translate3d(0, -${activeSection * 100}%, 0)` }}
      >

        {/* ══════════════════════════════════════════════════════════════
            SLIDE 0: HERO (ORIGIN)
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="hero"
          className="w-full h-[100dvh] min-h-[100dvh] flex-shrink-0 flex items-center justify-center relative px-4 sm:px-8 lg:px-16 pt-12 sm:pt-0 overflow-hidden"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 0 ? 'visible' : 'hidden'}
            className="w-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-14 items-center justify-center text-center lg:text-left"
          >
            {/* Heading and Narrative */}
            <div className="lg:col-span-7 flex flex-col justify-center items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
              <motion.h1
                variants={fadeUpSlow}
                className="text-3xl sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.8rem] font-black tracking-tight uppercase text-white leading-[0.92]"
              >
                THE STORY OF <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400 drop-shadow-[0_15px_30px_rgba(255,255,255,0.2)]">
                  REBELIVE.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUpItem}
                className="mt-3 sm:mt-7 text-xs sm:text-base md:text-xl text-white/70 font-light max-w-xs sm:max-w-xl leading-relaxed"
              >
                Born from two people who couldn’t keep their own life balanced. Built for everyone
                else who lives in the real world.
              </motion.p>
            </div>

            {/* Founders Image (8137) */}
            <motion.div
              variants={visualReveal}
              className="lg:col-span-5 flex items-center justify-center order-1 lg:order-2"
            >
              <div className="relative w-full max-w-[150px] sm:max-w-[280px] lg:max-w-[390px] aspect-[2/3] max-h-[26vh] sm:max-h-[50vh] lg:max-h-[64vh] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-neutral-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.9)] group">
                <div className="absolute -inset-1 rounded-3xl bg-white/[0.05] blur-2xl pointer-events-none group-hover:bg-white/[0.1] transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent z-10 pointer-events-none" />
                <Image
                  src="/brand/founders-8137.webp"
                  alt="Rebelive Founders (8137)"
                  fill
                  sizes="(max-width: 768px) 180px, (max-width: 1200px) 400px, 440px"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Subtle Mobile Swipe Cue */}
          <div className="sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 text-white/40 pointer-events-none">
            <span className="font-mono text-[8px] uppercase tracking-widest">SWIPE UP</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SLIDE 1: APPLE MOMENT
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="apple-moment"
          className="w-full h-[100dvh] min-h-[100dvh] flex-shrink-0 flex items-center justify-center relative px-4 sm:px-8 pt-12 sm:pt-0 overflow-hidden text-center"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 1 ? 'visible' : 'hidden'}
            className="w-full max-w-[96vw] 2xl:max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4 sm:space-y-8 relative z-10"
          >
            <motion.h2
              variants={fadeUpSlow}
              className="w-full text-3xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.8rem] 2xl:text-[7.5rem] font-black tracking-tight text-white uppercase leading-[0.92] select-none"
            >
              <div>IT ALL STARTED</div>
              <div>WITH AN APPLE.</div>
            </motion.h2>

            <motion.div
              variants={fadeUpItem}
              className="w-16 sm:w-28 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto my-1"
            />

            <motion.div variants={fadeUpItem} className="max-w-xs sm:max-w-3xl lg:max-w-4xl mx-auto px-2 sm:px-4">
              <p className="text-sm sm:text-2xl md:text-3xl lg:text-4xl text-white/85 font-light leading-relaxed">
                There's a story about Newton sitting under a tree when an apple fell on his head.
                Instead of brushing it off, he asked a simple question:
              </p>
            </motion.div>

            <motion.button
              variants={fadeUpItem}
              onClick={() => goToSection(2)}
              className="mt-2 sm:mt-4 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 text-white/80 hover:text-white font-mono text-xs uppercase tracking-wider backdrop-blur-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>NEXT: WHY DID IT FALL?</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SLIDE 2: WHY IT FELL
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="why-it-fell"
          className="w-full h-[100dvh] min-h-[100dvh] flex-shrink-0 flex items-center justify-center relative px-4 sm:px-8 lg:px-14 xl:px-18 pt-12 sm:pt-0 overflow-hidden"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 2 ? 'visible' : 'hidden'}
            className="w-full max-w-[96vw] 2xl:max-w-[92vw] mx-auto flex flex-col justify-center"
          >
            <div className="flex flex-col md:grid md:grid-cols-12 gap-3 sm:gap-8 md:gap-12 lg:gap-16 items-center w-full">
              {/* Apple Fall Illustration */}
              <motion.div variants={visualReveal} className="md:col-span-5 flex items-center justify-center">
                <div className="relative w-24 h-24 sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-80 lg:h-80 select-none flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-white/[0.04] blur-2xl pointer-events-none" />
                  <Image
                    src="/brand/why-did-it-fall.png"
                    alt="Why did it fall - Apple moment illustration"
                    fill
                    sizes="(max-width: 768px) 140px, (max-width: 1200px) 350px, 420px"
                    className="object-contain mix-blend-screen"
                    priority
                  />
                </div>
              </motion.div>

              {/* Narrative */}
              <div className="md:col-span-7 flex flex-col justify-center space-y-2 sm:space-y-4 pr-0 md:pr-2 text-center md:text-left">
                <motion.h3
                  variants={fadeUpSlow}
                  className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight leading-[1.0]"
                >
                  Why did it fall?
                </motion.h3>

                <motion.div
                  variants={fadeUpItem}
                  className="space-y-2 sm:space-y-3 text-xs sm:text-base md:text-lg text-white/80 leading-relaxed font-light"
                >
                  <p className="text-white font-semibold text-xs sm:text-lg md:text-xl">
                    That question led to something much bigger.
                  </p>
                  <p className="text-white/70 text-[11px] sm:text-sm md:text-base">
                    We weren't Newton. We were probably the seventeenth copy. Our apple moment was just a little less… scientific.
                  </p>

                  <motion.div
                    variants={cardPop}
                    className="p-2.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/15 shadow-xl backdrop-blur-md text-left"
                  >
                    <p className="text-white font-normal text-[11px] sm:text-sm md:text-base leading-relaxed">
                      It started with two people realizing that somewhere between ambition,
                      responsibilities and everyday life, taking care of ourselves had somehow become
                      optional.
                    </p>
                  </motion.div>

                  <p className="text-white/70 text-[11px] sm:text-xs md:text-base">
                    Meals were all over the place. Sleep was inconsistent. Energy was unpredictable. And whenever life got busy, our own wellbeing was the first thing to get pushed aside.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SLIDE 3: REALIZATION
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="realization"
          className="w-full h-[100dvh] min-h-[100dvh] flex-shrink-0 flex items-center justify-center relative px-4 sm:px-8 lg:px-14 xl:px-18 pt-12 sm:pt-0 overflow-hidden"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 3 ? 'visible' : 'hidden'}
            className="w-full max-w-[96vw] 2xl:max-w-[92vw] mx-auto flex flex-col justify-center"
          >
            <div className="flex flex-col md:grid md:grid-cols-12 gap-3 sm:gap-8 md:gap-12 lg:gap-16 items-center w-full">
              {/* Lightbulb Illustration */}
              <motion.div variants={visualReveal} className="md:col-span-5 flex items-center justify-center">
                <div className="relative w-20 h-20 sm:w-48 sm:h-48 md:w-72 md:h-72 lg:w-80 lg:h-80 select-none flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-white/[0.04] blur-2xl pointer-events-none" />
                  <Image
                    src="/brand/why-the-hell.png"
                    alt="Why the hell is taking care of yourself so difficult"
                    fill
                    sizes="(max-width: 768px) 140px, (max-width: 1200px) 350px, 420px"
                    className="object-contain mix-blend-screen"
                    priority
                  />
                </div>
              </motion.div>

              {/* Narrative */}
              <div className="md:col-span-7 flex flex-col justify-center space-y-2 sm:space-y-3.5 pr-0 md:pr-2 text-center md:text-left">
                <motion.h3
                  variants={fadeUpSlow}
                  className="text-base sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-black uppercase text-white tracking-tight leading-snug"
                >
                  Why the hell is taking care of yourself so difficult when life is already this demanding?
                </motion.h3>

                <motion.div
                  variants={fadeUpItem}
                  className="space-y-2 sm:space-y-2.5 text-[11px] sm:text-sm md:text-base text-white/80 leading-relaxed font-light text-left"
                >
                  <p className="text-white/80 text-[11px] sm:text-sm">
                    A lot of people were living on packed schedules, random meals, broken sleep and sheer determination.
                  </p>

                  <div className="space-y-1.5 sm:space-y-2 my-1">
                    {[
                      'What if something could fit into real life instead of asking people to completely change it?',
                      'What if supporting your everyday wellbeing could be simpler?',
                      'What if a drink could do more than just give you a temporary kick?',
                    ].map((q, i) => (
                      <motion.div
                        key={i}
                        variants={cardPop}
                        className="px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-colors backdrop-blur-md flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1 flex-shrink-0" />
                        <p className="text-[11px] sm:text-sm text-white font-normal leading-snug">{q}</p>
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-white font-black text-xs sm:text-base md:text-lg pt-0.5">
                    And eventually, Rebelive happened.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SLIDE 4: HI. I’M REBELIVE.
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="identity"
          className="w-full h-[100dvh] min-h-[100dvh] flex-shrink-0 flex items-center justify-center relative px-3 sm:px-6 md:px-8 lg:px-12 pt-12 sm:pt-0 overflow-hidden"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 4 ? 'visible' : 'hidden'}
            className="w-full max-w-[96vw] 2xl:max-w-[92vw] mx-auto relative z-10"
          >
            <div
              data-prevent-slide
              className="w-full rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 md:p-8 lg:p-10 relative shadow-[0_-20px_60px_rgba(0,0,0,0.95)] max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain no-scrollbar"
            >
              {/* Header: Title and small mobile badge */}
              <div className="flex items-center justify-between gap-3 mb-2 sm:mb-5">
                <motion.h2
                  variants={fadeUpSlow}
                  className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight flex flex-nowrap items-baseline gap-2 sm:gap-4 leading-none whitespace-nowrap"
                >
                  <span className="leading-none">HI. I’M</span>
                  <span
                    className="relative inline-block flex-shrink-0 self-baseline"
                    style={{ height: '0.92em', width: '3.89em' }}
                  >
                    <Image
                      src="/brand/rebelive-white.webp"
                      alt="REBELIVE"
                      fill
                      sizes="(max-width: 768px) 180px, 400px"
                      className="object-contain object-left-bottom drop-shadow-[0_2px_18px_rgba(255,255,255,0.3)]"
                      priority
                    />
                  </span>
                </motion.h2>

                {/* Small mobile badge photo */}
                <div className="lg:hidden relative w-11 h-14 sm:w-16 sm:h-20 rounded-xl overflow-hidden border border-white/20 shrink-0">
                  <Image
                    src="/brand/founders-8117.webp"
                    alt="Rebelive Founders (8117)"
                    fill
                    sizes="80px"
                    className="object-cover object-top"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10 items-start">
                {/* Narrative copy */}
                <motion.div
                  variants={fadeUpItem}
                  className="lg:col-span-7 space-y-2 sm:space-y-3 text-[11px] sm:text-sm md:text-[15px] xl:text-base text-white/85 leading-relaxed font-light"
                >
                  {SECTION_5_PARAGRAPHS.map((para, idx) => {
                    const isCallout =
                      para.includes("I was built for when you can't.") ||
                      para.includes("That's where I come in.") ||
                      para.includes("I was built for when you can’t.") ||
                      para.includes("That’s where I come in.");

                    const isPunchy = para === "They weren’t. So they built me.";
                    const hasTwoIdiots = para.includes("two absolute idiots");

                    return (
                      <div
                        key={idx}
                        className={
                          isCallout
                            ? 'border-l-2 border-white pl-3 sm:pl-5 py-1 my-1.5 sm:my-2.5 bg-white/[0.03] rounded-r-xl'
                            : ''
                        }
                      >
                        <p
                          className={
                            isCallout
                              ? 'text-white font-bold text-xs sm:text-base md:text-lg'
                              : isPunchy
                                ? 'text-white font-medium text-[11px] sm:text-sm md:text-[15px] xl:text-base'
                                : ''
                          }
                        >
                          {hasTwoIdiots ? (
                            <>
                              Yep. That’s me. I exist because my founders were{' '}
                              <span className="font-['Permanent_Marker'] font-normal text-amber-300 text-xs sm:text-base md:text-lg tracking-wider px-1.5 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/35 inline-block rotate-[-2deg] mx-1 shadow-[0_0_20px_rgba(251,191,36,0.2)] select-none">
                                two absolute idiots
                              </span>{' '}
                              who couldn’t keep their own shit together.
                            </>
                          ) : (
                            para
                          )}
                        </p>
                      </div>
                    );
                  })}
                </motion.div>

                {/* Desktop Founders 8117 Portrait Photo */}
                <motion.div
                  variants={visualReveal}
                  className="hidden lg:flex lg:col-span-5 flex-col items-center justify-start py-0 w-full"
                >
                  <div
                    className="relative rounded-3xl overflow-hidden border border-white/20 bg-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.9)] group"
                    style={{
                      height: 'min(490px, calc(100dvh - 190px), 65vh)',
                      width: 'calc(min(490px, calc(100dvh - 190px), 69vh) * 2 / 3)',
                      maxWidth: '100%',
                      aspectRatio: '2 / 3',
                    }}
                  >
                    <div className="absolute -inset-1 rounded-3xl bg-white/[0.06] blur-2xl pointer-events-none group-hover:bg-white/[0.1] transition-colors" />
                    <Image
                      src="/brand/founders-8117.webp"
                      alt="Rebelive Founders (8117)"
                      fill
                      sizes="360px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SLIDE 5: WHY I EXIST
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="why-i-exist"
          className="w-full h-[100dvh] min-h-[100dvh] flex-shrink-0 flex items-center justify-center relative px-4 sm:px-8 lg:px-14 xl:px-18 pt-12 sm:pt-0 overflow-hidden"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 5 ? 'visible' : 'hidden'}
            className="flex flex-col md:grid md:grid-cols-12 gap-3 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center w-full max-w-[96vw] 2xl:max-w-[92vw] mx-auto relative z-10"
          >
            {/* Content */}
            <div className="md:col-span-7 space-y-2 sm:space-y-4 order-2 md:order-1 text-center md:text-left">
              <motion.h3
                variants={fadeUpSlow}
                className="text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase text-white tracking-tight leading-[0.98]"
              >
                WHY I EXIST
              </motion.h3>

              <motion.div
                variants={fadeUpItem}
                className="space-y-2 sm:space-y-3 text-xs sm:text-base md:text-lg text-white/80 leading-relaxed font-light text-left"
              >
                <p className="text-white font-medium text-xs sm:text-lg md:text-xl">
                  Because my founders lived it. And they're definitely not the only ones.
                </p>
                <p className="text-white/70 text-[11px] sm:text-sm md:text-base">
                  People are building careers, businesses, relationships, ideas and futures while navigating inconsistent meals, disrupted sleep and unpredictable days.
                </p>

                <motion.div
                  variants={cardPop}
                  className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/15 my-1.5 sm:my-3 space-y-1 sm:space-y-2 backdrop-blur-md"
                >
                  <p className="text-sm sm:text-xl md:text-2xl font-black uppercase text-white">
                    That's why I exist.
                  </p>
                  <p className="text-white/70 text-[11px] sm:text-sm">
                    Not to replace real food. Not to replace sleep. Not to replace taking care of yourself.
                  </p>
                  <p className="text-white font-bold text-xs sm:text-base pt-1 border-t border-white/10">
                    But to become a functional part of the chaos.
                  </p>
                </motion.div>
              </motion.div>
            </div>

            {/* Panther Logo */}
            <motion.div
              variants={visualReveal}
              className="md:col-span-5 flex items-center justify-center order-1 md:order-2"
            >
              <div className="relative w-20 h-20 sm:w-44 sm:h-44 md:w-60 md:h-60 lg:w-72 lg:h-72 xl:w-80 xl:h-80 flex items-center justify-center select-none">
                <div className="absolute inset-0 rounded-full bg-white/[0.04] blur-2xl pointer-events-none" />
                <Image
                  src="/brand/panther_white_icon-transparent.webp"
                  alt="Rebelive Panther"
                  fill
                  sizes="(max-width: 768px) 140px, (max-width: 1200px) 300px, 350px"
                  className="object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.08)]"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SLIDE 6: MANIFESTO & FINALE
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="manifesto"
          className="w-full h-[100dvh] min-h-[100dvh] flex-shrink-0 flex items-center justify-center relative px-4 sm:px-8 lg:px-14 pt-12 sm:pt-0 overflow-hidden"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 6 ? 'visible' : 'hidden'}
            className="max-w-5xl 2xl:max-w-6xl mx-auto w-full space-y-2.5 sm:space-y-6 relative z-10 text-center md:text-left"
          >
            <motion.h2
              variants={fadeUpSlow}
              className="text-xl sm:text-3xl md:text-5xl lg:text-6xl 2xl:text-7xl font-black uppercase text-white tracking-tight leading-[0.95]"
            >
              BUILT BY TWO. <br />
              MADE FOR EVERYONE.
            </motion.h2>

            <motion.div
              variants={fadeUpItem}
              className="space-y-1.5 sm:space-y-3 text-[11px] sm:text-sm md:text-base text-white/80 leading-relaxed font-light text-left"
            >
              <p>
                We're still figuring things out. Still building. Still learning. Somewhere along the way, two ambitious people who weren't experts at taking care of themselves decided to build something that could help others do it a little better.
              </p>
              <p className="text-white font-medium">
                And now, whenever we forget to take care of ourselves, there's a little reminder sitting right there. Me. Rebelive.
              </p>
            </motion.div>

            {/* Monumental Statement Glass Card */}
            <motion.div variants={cardPop} className="relative mt-2 sm:mt-6">
              <div className="absolute -inset-1 rounded-2xl sm:rounded-[32px] bg-gradient-to-r from-white/[0.08] via-white/[0.03] to-white/[0.08] blur-xl opacity-70 pointer-events-none" />

              <div className="relative p-4 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-white/20 bg-neutral-950/70 backdrop-blur-2xl text-white text-center shadow-[0_30px_100px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.25)] overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                <h3 className="relative z-10 text-base sm:text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight mb-3 text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.15)]">
                  You live your life. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
                    I'll help take care of the rest.
                  </span>
                </h3>

                <div className="relative z-10 mt-3 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                  <Link href='/shop'>
                    <button className="px-5 sm:px-8 py-2.5 sm:py-3.5 bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer shadow-[0_0_35px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 inline-flex items-center gap-2">
                      <span>EXPLORE THE FLAVORS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>

                  <button
                    onClick={() => {
                      goToSection(0);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 sm:px-5 py-2 sm:py-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 hover:border-white/50 text-white font-mono text-xs uppercase tracking-wider rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer flex items-center gap-2"
                  >
                    <span>READ FROM TOP</span>
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* Navigation Dots (Desktop & Mobile) */}
      <div className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 sm:gap-3 pointer-events-auto">
        {SECTIONS.map((sec, i) => (
          <button
            key={sec.id}
            onClick={() => goToSection(i)}
            aria-label={sec.title}
            className="group relative flex items-center justify-end p-1.5 focus:outline-none cursor-pointer"
          >
            {/* Tooltip on hover (desktop only) */}
            <span className="hidden md:block pointer-events-none absolute right-8 whitespace-nowrap rounded-md bg-black/80 border border-white/15 px-2.5 py-1 font-mono text-[10px] uppercase text-white/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
              {sec.tag}
            </span>
            <span
              className={`rounded-full transition-all duration-300 ${
                activeSection === i
                  ? 'h-5 sm:h-6 w-1.5 sm:w-2 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]'
                  : 'h-1.5 sm:h-2 w-1.5 sm:w-2 bg-white/30 hover:bg-white/60 active:scale-125'
              }`}
            />
          </button>
        ))}
      </div>

    </div>
  );
}
