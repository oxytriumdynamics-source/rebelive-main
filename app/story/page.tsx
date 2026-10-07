'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [shopOpen, setShopOpen] = useState(false);

  // Transition locking refs
  const isAnimatingRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartXRef = useRef(0);

  const goToSection = useCallback((targetIdx: number) => {
    if (isAnimatingRef.current) return;
    const clamped = Math.max(0, Math.min(targetIdx, SECTIONS.length - 1));
    if (clamped === activeSection) return;

    isAnimatingRef.current = true;
    lastScrollTimeRef.current = Date.now();
    setActiveSection(clamped);

    // Duration of transition: 1100ms + 100ms buffer to absorb fast wheel/trackpad inertia
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 1200);
  }, [activeSection]);

  const goToNext = useCallback(() => {
    if (activeSection < SECTIONS.length - 1) {
      goToSection(activeSection + 1);
    }
  }, [activeSection, goToSection]);

  const goToPrev = useCallback(() => {
    if (activeSection > 0) {
      goToSection(activeSection - 1);
    }
  }, [activeSection, goToSection]);

  // ── Wheel Event Listener (Strict Section Snapping + Seamless Footer Return) ──
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (shopOpen) return;
      if ((e.target as HTMLElement)?.closest?.('[data-prevent-slide]')) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 18) return;

      // ── IF USER IS SCROLLED INTO THE FOOTER ZONE (window.scrollY > 15) ──
      // Let the browser and Lenis scroll freely! Do NOT preventDefault!
      if (window.scrollY > 15) {
        if (delta < 0 && window.scrollY <= 30) {
          // Re-engaging top story section
          setActiveSection(SECTIONS.length - 1);
        }
        return;
      }

      // ── AT LAST SECTION (MANIFESTO): SCROLLING DOWN TO FOOTER ──
      if (activeSection === SECTIONS.length - 1 && delta > 0) {
        const footerEl = document.querySelector('footer');
        if (footerEl) {
          e.preventDefault();
          footerEl.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      // ── WITHIN STORY SECTIONS (0 to 6): STRICT 1-SECTION SNAP ──
      e.preventDefault();
      e.stopPropagation();

      // If active section transition is running: absorb and discard wheel inertia
      if (isAnimatingRef.current) return;

      // Enforce minimum cooldown between discrete triggers
      const now = Date.now();
      if (now - lastScrollTimeRef.current < 1100) return;

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
  }, [shopOpen, activeSection, goToNext, goToPrev]);

  // ── Touch Swipe Gestures (Mobile) ──
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartYRef.current = e.touches[0].clientY;
      touchStartXRef.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (shopOpen) return;
      if (e.touches.length !== 1) return;
      if ((e.target as HTMLElement)?.closest?.('[data-prevent-slide]')) return;

      const deltaY = touchStartYRef.current - e.touches[0].clientY;
      const deltaX = touchStartXRef.current - e.touches[0].clientX;

      // Ignore horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) return;

      // In Footer zone: allow normal touch scrolling
      if (window.scrollY > 15) {
        return;
      }

      // At Manifesto slide: swiping down scrolls to footer
      if (activeSection === SECTIONS.length - 1 && deltaY > 30) {
        const footerEl = document.querySelector('footer');
        if (footerEl) {
          footerEl.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      if (Math.abs(deltaY) < 30) return;

      e.preventDefault();

      if (isAnimatingRef.current) return;
      const now = Date.now();
      if (now - lastScrollTimeRef.current < 1100) return;

      if (deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }
      touchStartYRef.current = e.touches[0].clientY;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [shopOpen, activeSection, goToNext, goToPrev]);

  // ── Keyboard Navigation (Arrow Keys / Page Keys / Space) ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (shopOpen) return;
      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement)?.tagName?.toLowerCase() || '')) return;

      if (window.scrollY > 15) {
        return; // Normal scroll in footer
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        if (activeSection === SECTIONS.length - 1) {
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
  }, [shopOpen, activeSection, goToNext, goToPrev, goToSection]);

  return (
    <div
      id="story-deck"
      style={{ fontFamily: SANS }}
      className="relative w-screen h-screen overflow-hidden text-white bg-black select-none"
    >
      {/* Large Ghost Background Watermark */}
      <div className="fixed top-28 left-1/2 -translate-x-1/2 select-none pointer-events-none text-[16vw] font-black uppercase text-white/[0.015] whitespace-nowrap tracking-tighter -z-10 leading-none">
        REBELIVE
      </div>

      {/* ── Discrete Slides Track with 60fps GPU Translate ── */}
      <div
        className="w-full h-full transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        style={{
          transform: `translate3d(0, -${activeSection * 100}%, 0)`,
        }}
      >
        {/* ══════════════════════════════════════════════════════════════
            SLIDE 0: HERO ("THE STORY OF REBELIVE.")
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="hero"
          className="w-full h-screen flex-shrink-0 flex items-center justify-center relative overflow-hidden pt-20 sm:pt-24 pb-14 px-4 sm:px-8 lg:px-16"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 0 ? 'visible' : 'hidden'}
            className="w-full max-w-7xl mx-auto flex flex-col justify-center items-start text-left"
          >
            <motion.h1
              variants={fadeUpSlow}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-black tracking-tight uppercase text-white leading-[0.92] text-left"
            >
              THE STORY OF <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400 drop-shadow-[0_15px_30px_rgba(255,255,255,0.2)]">
                REBELIVE.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUpItem}
              className="mt-6 sm:mt-8 text-base sm:text-xl md:text-2xl text-white/70 font-light max-w-2xl leading-relaxed text-left"
            >
              Born from two people who couldn’t keep their own life balanced. Built for everyone
              else who lives in the real world.
            </motion.p>

            {/* Scroll Trigger CTA */}
          
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SLIDE 1: APPLE MOMENT ("IT ALL STARTED WITH AN APPLE.")
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="apple-moment"
          className="w-full h-screen flex-shrink-0 flex items-center justify-center relative overflow-hidden pt-20 sm:pt-24 pb-14 px-4 sm:px-8 text-center"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 1 ? 'visible' : 'hidden'}
            className="w-full max-w-[96vw] 2xl:max-w-7xl mx-auto flex flex-col items-center justify-center space-y-6 sm:space-y-8 relative z-10"
          >
            <motion.h2
              variants={fadeUpSlow}
              className="w-full text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.8rem] 2xl:text-[7.5rem] font-black tracking-tight text-white uppercase leading-[0.92] select-none"
            >
              <div>IT ALL STARTED</div>
              <div>WITH AN APPLE.</div>
            </motion.h2>

            <motion.div
              variants={fadeUpItem}
              className="w-20 sm:w-28 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto my-1"
            />

            <motion.div variants={fadeUpItem} className="max-w-3xl lg:max-w-4xl mx-auto px-4">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/85 font-light leading-relaxed">
                There's a story about Newton sitting under a tree when an apple fell on his head.
                Instead of brushing it off, he asked a simple question:
              </p>
            </motion.div>

            <motion.button
              variants={fadeUpItem}
              onClick={() => goToSection(2)}
              className="mt-4 px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 text-white/80 hover:text-white font-mono text-xs uppercase tracking-wider backdrop-blur-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>NEXT: WHY DID IT FALL?</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SLIDE 2: OUR APPLE MOMENT ("WHY DID IT FALL?")
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="why-it-fell"
          className="w-full h-screen flex-shrink-0 flex items-center justify-center relative overflow-hidden pt-20 sm:pt-24 pb-14 px-4 sm:px-8 lg:px-14 xl:px-18"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 2 ? 'visible' : 'hidden'}
            className="w-full max-w-[96vw] 2xl:max-w-[92vw] mx-auto flex flex-col justify-center h-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center w-full">
              {/* Left: Panther */}
              <motion.div variants={visualReveal} className="md:col-span-5 flex items-center justify-center">
                <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-72 lg:h-72 xl:w-80 xl:h-80 select-none flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />
                  <Image
                    src="/brand/panther_white_icon-transparent.webp"
                    alt="Rebelive Panther"
                    fill
                    sizes="(max-width: 768px) 200px, (max-width: 1200px) 300px, 350px"
                    className="object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.08)]"
                    priority
                  />
                </div>
              </motion.div>

              {/* Right: Narrative */}
              <div className="md:col-span-7 flex flex-col justify-center space-y-3.5 sm:space-y-4 pr-2">
                <motion.h3
                  variants={fadeUpSlow}
                  className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight leading-[1.0]"
                >
                  Why did it fall?
                </motion.h3>

                <motion.div
                  variants={fadeUpItem}
                  className="space-y-3 text-sm sm:text-base md:text-lg text-white/80 leading-relaxed font-light"
                >
                  <p className="text-white font-semibold text-base sm:text-lg md:text-xl">
                    That question led to something much bigger.
                  </p>
                  <p>We weren't Newton. We were probably the seventeenth copy.</p>
                  <p className="text-white/70">Our apple moment was just a little less… scientific.</p>

                  <motion.div
                    variants={cardPop}
                    className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/15 shadow-2xl backdrop-blur-md"
                  >
                    <p className="text-white font-normal text-xs sm:text-sm md:text-base leading-relaxed">
                      It started with two people realizing that somewhere between ambition,
                      responsibilities and everyday life, taking care of ourselves had somehow become
                      optional.
                    </p>
                  </motion.div>

                  <p className="text-white/70 text-xs sm:text-sm md:text-base">
                    Meals were all over the place. Sleep was inconsistent. Energy was unpredictable.
                    And whenever life got busy, our own wellbeing was the first thing to get pushed aside.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SLIDE 3: THE HARD REALIZATION ("WHY THE HELL IS TAKING CARE...")
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="realization"
          className="w-full h-screen flex-shrink-0 flex items-center justify-center relative overflow-hidden pt-20 sm:pt-24 pb-14 px-4 sm:px-8 lg:px-14 xl:px-18"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 3 ? 'visible' : 'hidden'}
            className="w-full max-w-[96vw] 2xl:max-w-[92vw] mx-auto flex flex-col justify-center h-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center w-full">
              {/* Left: Panther */}
              <motion.div variants={visualReveal} className="md:col-span-5 flex items-center justify-center">
                <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-72 lg:h-72 xl:w-80 xl:h-80 select-none flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />
                  <Image
                    src="/brand/panther_white_icon-transparent.webp"
                    alt="Rebelive Panther"
                    fill
                    sizes="(max-width: 768px) 200px, (max-width: 1200px) 300px, 350px"
                    className="object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.08)]"
                    priority
                  />
                </div>
              </motion.div>

              {/* Right: Stage 2 Narrative */}
              <div className="md:col-span-7 flex flex-col justify-center space-y-3 sm:space-y-3.5 pr-2">
                <motion.h3
                  variants={fadeUpSlow}
                  className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-black uppercase text-white tracking-tight leading-[1.1]"
                >
                  Why the hell is taking care of yourself so difficult when life is already this
                  demanding?
                </motion.h3>

                <motion.div
                  variants={fadeUpItem}
                  className="space-y-2.5 text-xs sm:text-sm md:text-base text-white/80 leading-relaxed font-light"
                >
                  <p>
                    And once we started looking around, we realized we weren't the only ones. A lot
                    of people were living on packed schedules, random meals, broken sleep and sheer
                    determination.
                  </p>

                  <p className="text-white font-semibold text-xs sm:text-sm md:text-base">
                    So we started looking for an answer.
                  </p>

                  <div className="space-y-2 my-1.5">
                    {[
                      'What if something could fit into real life instead of asking people to completely change it?',
                      'What if supporting your everyday wellbeing could be simpler?',
                      'What if a drink could do more than just give you a temporary kick?',
                    ].map((q, i) => (
                      <motion.div
                        key={i}
                        variants={cardPop}
                        className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-colors backdrop-blur-md flex items-start gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white/60 mt-1.5 flex-shrink-0" />
                        <p className="text-xs sm:text-sm text-white font-normal leading-snug">{q}</p>
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-white/70 text-xs sm:text-sm">
                    We kept asking. Experimenting. Getting things wrong. Starting again.
                  </p>

                  <div className="pt-1">
                    <p className="text-white font-black text-sm sm:text-base md:text-lg">
                      And eventually, Rebelive happened.
                    </p>
                  </div>
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
          className="w-full h-screen flex-shrink-0 flex items-center justify-center relative overflow-hidden pt-16 sm:pt-20 pb-10 sm:pb-12 px-4 sm:px-6 md:px-8 lg:px-12"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 4 ? 'visible' : 'hidden'}
            className="w-full max-w-[96vw] 2xl:max-w-[92vw] mx-auto relative z-10"
          >
            <div className="w-full rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 lg:p-10 relative shadow-[0_-20px_60px_rgba(0,0,0,0.95)] max-h-[86vh] overflow-y-auto no-scrollbar">
              <motion.h2
                variants={fadeUpSlow}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight mb-3 sm:mb-5"
              >
                HI. I’M REBELIVE.
              </motion.h2>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
                {/* Left: Narrative copy */}
                <motion.div
                  variants={fadeUpItem}
                  className="lg:col-span-7 space-y-2.5 sm:space-y-3 md:space-y-3.5 text-xs sm:text-sm md:text-[15px] xl:text-base text-white/85 leading-relaxed font-light"
                >
                  {SECTION_5_PARAGRAPHS.map((para, idx) => {
                    const isCallout =
                      para.includes("I was built for when you can't.") ||
                      para.includes("That's where I come in.") ||
                      para.includes("I was built for when you can’t.") ||
                      para.includes("That’s where I come in.");

                    const isPunchy = para === "They weren’t. So they built me.";

                    return (
                      <div
                        key={idx}
                        className={
                          isCallout
                            ? 'border-l-2 border-white pl-4 sm:pl-5 py-1.5 my-2.5 bg-white/[0.03] rounded-r-xl'
                            : ''
                        }
                      >
                        <p
                          className={
                            isCallout
                              ? 'text-white font-bold text-sm sm:text-base md:text-lg'
                              : isPunchy
                              ? 'text-white font-medium text-xs sm:text-sm md:text-[15px] xl:text-base'
                              : ''
                          }
                        >
                          {para}
                        </p>
                      </div>
                    );
                  })}
                </motion.div>

                {/* Right: Rebelive Brand Logo on the right side */}
                <motion.div
                  variants={visualReveal}
                  className="lg:col-span-5 flex flex-col items-center justify-center py-4 lg:py-0"
                >
                  <div className="relative w-full max-w-[340px] flex flex-col items-center justify-center select-none group">
                    <div className="absolute inset-0 rounded-full bg-white/[0.04] blur-3xl pointer-events-none group-hover:bg-white/[0.08] transition-colors" />

                    <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 flex items-center justify-center">
                      <Image
                        src="/brand/panther_white_icon-transparent.webp"
                        alt="Rebelive Brand Panther"
                        fill
                        sizes="(max-width: 768px) 220px, 300px"
                        className="object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.12)] group-hover:scale-105 transition-transform duration-500"
                        priority
                      />
                    </div>

                    <div className="relative w-40 sm:w-52 h-10 mt-4 opacity-90 group-hover:opacity-100 transition-opacity">
                      <Image
                        src="/brand/rebelive-white.webp"
                        alt="REBELIVE Brand Logo"
                        fill
                        sizes="240px"
                        className="object-contain drop-shadow-[0_2px_14px_rgba(255,255,255,0.25)]"
                      />
                    </div>
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
          className="w-full h-screen flex-shrink-0 flex items-center justify-center relative overflow-hidden pt-20 sm:pt-24 pb-14 px-4 sm:px-8 lg:px-14 xl:px-18"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 5 ? 'visible' : 'hidden'}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 xl:gap-20 items-center w-full max-w-[96vw] 2xl:max-w-[92vw] mx-auto relative z-10"
          >
            {/* Left: Content */}
            <div className="md:col-span-7 space-y-3.5 sm:space-y-4 order-2 md:order-1">
              <motion.h3
                variants={fadeUpSlow}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase text-white tracking-tight leading-[0.98]"
              >
                WHY I EXIST
              </motion.h3>

              <motion.div
                variants={fadeUpItem}
                className="space-y-3 text-sm sm:text-base md:text-lg text-white/80 leading-relaxed font-light"
              >
                <p className="text-white font-medium text-base sm:text-lg md:text-xl">
                  Because my founders lived it. And they're definitely not the only ones.
                </p>
                <p>
                  People are building careers, businesses, relationships, ideas and futures while
                  navigating inconsistent meals, disrupted sleep and days that rarely go exactly as
                  planned.
                </p>
                <p className="italic text-white/90">
                  You don't need another person telling you to drink more water, sleep eight hours and
                  meditate every morning. You need things that actually work with the life you're already
                  living.
                </p>

                <motion.div
                  variants={cardPop}
                  className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/15 my-3 space-y-2 backdrop-blur-md"
                >
                  <p className="text-lg sm:text-xl md:text-2xl font-black uppercase text-white">
                    That's why I exist.
                  </p>
                  <p className="text-white/70 text-xs sm:text-sm">
                    Not to replace real food. Not to replace sleep. Not to replace taking care of
                    yourself.
                  </p>
                  <p className="text-white font-bold text-sm sm:text-base pt-1 border-t border-white/10">
                    But to become a functional part of the chaos.
                  </p>
                  <p className="text-white/80 text-xs sm:text-sm">
                    Something that fits into your day. Something that shows up when you need a little
                    more from yourself.
                  </p>
                </motion.div>
              </motion.div>
            </div>

            {/* Right: Panther Logo */}
            <motion.div
              variants={visualReveal}
              className="md:col-span-5 flex items-center justify-center order-1 md:order-2"
            >
              <div className="relative w-36 h-36 sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-72 lg:h-72 xl:w-80 xl:h-80 flex items-center justify-center select-none">
                <div className="absolute inset-0 rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />
                <Image
                  src="/brand/panther_white_icon-transparent.webp"
                  alt="Rebelive Panther"
                  fill
                  sizes="(max-width: 768px) 200px, (max-width: 1200px) 300px, 350px"
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
          className="w-full h-screen flex-shrink-0 flex items-center justify-center relative overflow-hidden pt-20 sm:pt-24 pb-14 px-4 sm:px-8 lg:px-14"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 6 ? 'visible' : 'hidden'}
            className="max-w-5xl 2xl:max-w-6xl mx-auto w-full space-y-4 sm:space-y-6 relative z-10"
          >
            <motion.h2
              variants={fadeUpSlow}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-black uppercase text-white tracking-tight leading-[0.95]"
            >
              BUILT BY TWO. <br />
              MADE FOR EVERYONE.
            </motion.h2>

            <motion.div
              variants={fadeUpItem}
              className="space-y-3 text-xs sm:text-sm md:text-base text-white/80 leading-relaxed font-light"
            >
              <p>
                We're still figuring things out. Still building. Still learning. Still occasionally
                wondering why we decided building a company was a good idea.
              </p>
              <p>
                But somewhere along the way, two ambitious people who weren't exactly experts at taking
                care of themselves decided to build something that could help others do it a little
                better.
              </p>
              <p className="text-white font-medium">
                And now, whenever we forget to take care of ourselves, there's a little reminder sitting
                right there. Me. Rebelive.
              </p>
            </motion.div>

            {/* Monumental Statement Glass Card */}
            <motion.div variants={cardPop} className="relative mt-6 sm:mt-8">
              <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-white/[0.08] via-white/[0.03] to-white/[0.08] blur-xl opacity-70 pointer-events-none" />

              <div className="relative p-6 sm:p-10 md:p-12 rounded-3xl border border-white/20 bg-neutral-950/70 backdrop-blur-2xl text-white text-center shadow-[0_30px_100px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.25)] overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.02] pointer-events-none" />

                <h3 className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight mb-4 text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.15)]">
                  You live your life. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
                    I'll help take care of the rest.
                  </span>
                </h3>

                <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  <button
                    onClick={() => setShopOpen(true)}
                    className="px-6 sm:px-8 py-3.5 bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer shadow-[0_0_35px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 inline-flex items-center gap-2"
                  >
                    <span>EXPLORE THE FLAVORS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      goToSection(0);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 hover:border-white/50 text-white font-mono text-xs uppercase tracking-wider rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center gap-2"
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

      {/* Product Flavor Drawer Modal */}
      <FlavorDrawer isOpen={shopOpen} onClose={() => setShopOpen(false)} />
    </div>
  );
}
