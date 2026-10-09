'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  ArrowUp,
  Compass,
  Zap,
  Shield,
  Layers,
} from 'lucide-react';

const MONO = "'JetBrains Mono', 'Poppins', monospace";
const SANS = "'Poppins', sans-serif";

const ABOUT_SECTIONS = [
  { id: 'founders', label: '01 // FOUNDERS', title: 'OUR FOUNDERS' },
  { id: 'rebelive', label: '02 // REBELIVE', title: 'PHILOSOPHY' },
  { id: 'oxytrium', label: '03 // OXYTRIUM', title: 'INNOVATION LAB' },
  { id: 'pathways', label: '04 // PATHWAYS', title: 'JOIN THE REVOLUTION' },
];

const LUX_EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: LUX_EASE,
    },
  },
};

const scaleInItem = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: LUX_EASE,
    },
  },
};

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState(0);

  // Transition locking & inertial cooldown refs
  const isAnimatingRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartXRef = useRef(0);

  // Strict discrete section jump
  const goToSection = useCallback((targetIdx: number) => {
    if (isAnimatingRef.current) return;
    const clamped = Math.max(0, Math.min(targetIdx, ABOUT_SECTIONS.length - 1));
    if (clamped === activeSection) return;

    isAnimatingRef.current = true;
    lastScrollTimeRef.current = Date.now();
    setActiveSection(clamped);

    // 1000ms transition duration + 150ms buffer to absorb fast wheel / trackpad momentum
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 1150);
  }, [activeSection]);

  const goToNext = useCallback(() => {
    if (activeSection < ABOUT_SECTIONS.length - 1) {
      goToSection(activeSection + 1);
    }
  }, [activeSection, goToSection]);

  const goToPrev = useCallback(() => {
    if (activeSection > 0) {
      goToSection(activeSection - 1);
    }
  }, [activeSection, goToSection]);

  // ── Wheel Event Listener (Strict Section Snapping + Footer Hand-off) ──
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement)?.closest?.('[data-prevent-slide]')) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 18) return;

      // ── IF USER IS SCROLLED INTO THE FOOTER ZONE (window.scrollY > 15) ──
      // Let the browser scroll normally in the footer.
      if (window.scrollY > 15) {
        if (delta < 0 && window.scrollY <= 35) {
          // Re-engaging last section of the deck
          setActiveSection(ABOUT_SECTIONS.length - 1);
        }
        return;
      }

      // ── AT LAST SECTION: SCROLLING DOWN REVEALS FOOTER ──
      if (activeSection === ABOUT_SECTIONS.length - 1 && delta > 0) {
        const footerEl = document.querySelector('footer');
        if (footerEl) {
          e.preventDefault();
          footerEl.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      // ── WITHIN ABOUT SECTIONS (0 to 3): STRICT 1-SECTION SNAP ──
      e.preventDefault();
      e.stopPropagation();

      if (isAnimatingRef.current) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current < 1050) return;

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
  }, [activeSection, goToNext, goToPrev]);

  // ── Touch Swipe Gestures (Mobile Devices) ──
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartYRef.current = e.touches[0].clientY;
      touchStartXRef.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      if ((e.target as HTMLElement)?.closest?.('[data-prevent-slide]')) return;

      const deltaY = touchStartYRef.current - e.touches[0].clientY;
      const deltaX = touchStartXRef.current - e.touches[0].clientX;

      // Ignore horizontal gestures
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) return;
      if (Math.abs(deltaY) < 30) return;

      if (window.scrollY > 15) return;

      if (activeSection === ABOUT_SECTIONS.length - 1 && deltaY > 0) {
        const footerEl = document.querySelector('footer');
        if (footerEl) {
          footerEl.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      e.preventDefault();
      if (isAnimatingRef.current) return;
      const now = Date.now();
      if (now - lastScrollTimeRef.current < 950) return;

      if (deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [activeSection, goToNext, goToPrev]);

  // ── Keyboard Navigation (Arrow Keys / Page Keys / Space) ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement)?.tagName?.toLowerCase() || '')) return;

      if (window.scrollY > 15) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        if (activeSection === ABOUT_SECTIONS.length - 1) {
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
  }, [activeSection, goToNext, goToPrev, goToSection]);

  return (
    <div
      id="about-deck"
      style={{ fontFamily: SANS }}
      className="relative w-screen h-screen overflow-hidden text-white bg-black select-none"
    >
      {/* Ambient background glow aura */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] rounded-full blur-[140px] pointer-events-none -z-10 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.35) 0%, transparent 70%)',
        }}
      />

      {/* Large Ghost Watermark */}
      <div className="fixed top-28 left-1/2 -translate-x-1/2 select-none pointer-events-none text-[15vw] font-black uppercase text-white/[0.015] whitespace-nowrap tracking-tighter -z-10 leading-none">
        REBELIVE
      </div>

      {/* ── Discrete Slides Track with 60fps GPU Hardware Translate ── */}
      <div
        className="w-full h-full transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        style={{
          transform: `translate3d(0, -${activeSection * 100}%, 0)`,
        }}
      >
        {/* ══════════════════════════════════════════════════════════════
            SLIDE 0: FOUNDERS SECTION
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="founders"
          className="w-full h-screen flex-shrink-0 flex items-center justify-center relative overflow-hidden pt-20 sm:pt-24 pb-12 px-4 sm:px-8 lg:px-16"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 0 ? 'visible' : 'hidden'}
            className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
          >
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-7">
             

              <motion.h1
                variants={fadeUpItem}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.92]"
              >
                HEAR IT FROM <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
                  OUR FOUNDERS.
                </span>
              </motion.h1>

              <motion.div variants={fadeUpItem} className="space-y-4 max-w-2xl">
                <div className="p-5 sm:p-7 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl relative shadow-2xl space-y-4">
                  <p className="text-base sm:text-xl lg:text-2xl text-white/90 font-light leading-relaxed">
                    “We’re on a mission to make better-for-you choices fun, simple and for everyone. It has led us to innovative, clutter-breaking formats and flavours, presented with a lightness that fits into anyone’s lifestyle. Let's Wake Up and Rebel!”
                  </p>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                   <div>
                      <p className="text-white font-bold text-sm sm:text-base tracking-wide">
                        Krishna &amp; Sai Vaishno
                      </p>
                      <p className="text-xs font-mono text-white/50 uppercase tracking-widest mt-0.5">
                        Co-Founders
                      </p>
                   </div>

                  
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Founder Image */}
            <motion.div
              variants={scaleInItem}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-3xl overflow-hidden border border-white/15 bg-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.85)] group">
                <Image
                  src="/brand/founder_portrait.webp"
                  alt="Krishna and Sai Vaishno - Co-Founders"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale contrast-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
                
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SLIDE 1: REBELIVE PHILOSOPHY & EMBLEM
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="rebelive"
          className="w-full h-screen flex-shrink-0 flex flex-col justify-center relative overflow-hidden pt-16 sm:pt-20 pb-8"
        >
          {/* Full-bleed edge-to-edge Marquee Bar across entire screen width */}
          <div className="w-full border-y border-white/15 bg-white/[0.02] py-3 sm:py-4.5 overflow-hidden select-none mb-6 sm:mb-10">
            <div className="flex w-max animate-marquee space-x-8 sm:space-x-12 whitespace-nowrap">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-8 sm:space-x-12 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-tall uppercase tracking-wider text-white/90"
                >
                  <span className="hover:text-white transition-colors">WAKE . FUEL . REBEL</span>
                  <span className="text-white/30">•</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400">
                    WAKE . FUEL . REBEL
                  </span>
                  <span className="text-white/30">•</span>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 1 ? 'visible' : 'hidden'}
            className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16"
          >
            {/* Split Content: Narrative Left, Panther Emblem Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              <div className="lg:col-span-7 space-y-5">
            

                <motion.h2
                  variants={fadeUpItem}
                  className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-[0.95]"
                >
                  REBELIVE.
                </motion.h2>

                <motion.div
                  variants={fadeUpItem}
                  className="space-y-3.5 text-sm sm:text-base md:text-lg text-white/80 leading-relaxed font-light"
                >
                  <p>
                    Rebelive exists for those who refuse to settle for ordinary. We envision a world where taking care of yourself fuels ambition rather than slowing it down.
                  </p>
                  <p>
                    Our mission is to create functional beverages that combine purposeful ingredients, great taste, and everyday functionality to support your well-being.
                  </p>
                  <p className="text-white font-medium">
                    At our core is a simple philosophy: <span className="text-white underline decoration-white/30 underline-offset-4">Wake. Fuel. Rebel.</span> Wake up to your potential, fuel what drives you, and rebel against the ordinary.
                  </p>
                </motion.div>

               
              </div>

              {/* Right: Panther Emblem Artwork */}
              <motion.div
                variants={scaleInItem}
                className="lg:col-span-5 flex items-center justify-center"
              >
                <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 flex items-center justify-center select-none group">
                  <div className="absolute inset-0 rounded-full bg-white/[0.05] blur-3xl pointer-events-none group-hover:bg-white/[0.1] transition-colors" />
                  <div className="relative w-full h-full p-6 flex items-center justify-center">
                    <Image
                      src="/brand/panther_white_icon-transparent.webp"
                      alt="Rebelive Panther Emblem"
                      fill
                      sizes="(max-width: 768px) 240px, 300px"
                      className="object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.18)] group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SLIDE 2: OXYTRIUM DYNAMICS (INCUBATOR LAB)
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="oxytrium"
          className="w-full h-screen flex-shrink-0 flex items-center justify-center relative overflow-hidden pt-20 sm:pt-24 pb-12 px-4 sm:px-8 lg:px-16"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 2 ? 'visible' : 'hidden'}
            className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
          >
            {/* Left: Oxytrium Dynamics Studio Visual */}
            <motion.div
              variants={scaleInItem}
              className="lg:col-span-5 order-2 lg:order-1 flex justify-center"
            >
              <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-3xl overflow-hidden border border-white/15 bg-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.85)] group">
                <Image
                  src="/brand/oxytrium_dynamics.webp"
                  alt="Oxytrium Dynamics Innovation Studio"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                <div className="absolute bottom-3.5 left-4 right-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                      OXYTRIUM DYNAMICS
                    </p>
                    <p className="text-[10px] font-mono text-white/50">
                      NEXT-GEN FOOD &amp; BEVERAGE INCUBATOR
                    </p>
                  </div>
                  <Compass className="w-4 h-4 text-white/60" />
                </div>
              </div>
            </motion.div>

            {/* Right: Oxytrium Narrative */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
            

              <motion.h2
                variants={fadeUpItem}
                className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-[0.95]"
              >
                OXYTRIUM <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400">
                  DYNAMICS.
                </span>
              </motion.h2>

              <motion.div
                variants={fadeUpItem}
                className="space-y-3.5 text-sm sm:text-base md:text-lg text-white/80 leading-relaxed font-light"
              >
                <p>
                  Oxytrium Dynamics is building the next generation of food and beverage brands that people genuinely want in their lives.
                </p>
                <p>
                  We envision an F&amp;B landscape where taste, functionality, and better ingredients come together to create products that truly fit modern lifestyles.
                </p>
                <p className="text-white font-medium">
                  Our mission is to build bold, consumer-first brands, challenge conventional categories, and create products that shape how the world eats and drinks tomorrow.
                </p>
              </motion.div>

           
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SLIDE 3: EXPLORATION PATHWAYS & CLOSING MANIFESTO
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="pathways"
          className="w-full h-screen flex-shrink-0 flex items-center justify-center relative overflow-hidden pt-20 sm:pt-24 pb-12 px-4 sm:px-8 lg:px-16"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={activeSection === 3 ? 'visible' : 'hidden'}
            className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8"
          >
            <div className="text-center max-w-3xl mx-auto space-y-3">
             

              <motion.h2
                variants={fadeUpItem}
                className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight"
              >
                CHOOSE YOUR <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
                  NEXT MOVE.
                </span>
              </motion.h2>

           
            </div>

            {/* 3 Pathway Action Cards */}
            <motion.div
              variants={fadeUpItem}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto"
            >
              {/* Pathway 1: Shop */}
              <Link
                href="/shop"
                className="group p-5 sm:p-6 rounded-2xl bg-[#141416]/90 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-between cursor-pointer hover:-translate-y-1 shadow-xl"
              >
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/40 block mb-1">
                    ALLOCATIONS
                  </span>
                  <span className="font-bold text-sm sm:text-base text-white uppercase group-hover:text-white transition-colors">
                    Explore Shop
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Pathway 2: Story */}
              <Link
                href="/story"
                className="group p-5 sm:p-6 rounded-2xl bg-[#141416]/90 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-between cursor-pointer hover:-translate-y-1 shadow-xl"
              >
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/40 block mb-1">
                    CHRONICLES
                  </span>
                  <span className="font-bold text-sm sm:text-base text-white uppercase group-hover:text-white transition-colors">
                    Read Our Story
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/20 bg-white/[0.04] text-white flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              {/* Pathway 3: Contact */}
              <Link
                href="/contact"
                className="group p-5 sm:p-6 rounded-2xl bg-[#141416]/90 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-between cursor-pointer hover:-translate-y-1 shadow-xl"
              >
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/40 block mb-1">
                    DIRECT INQUIRIES
                  </span>
                  <span className="font-bold text-sm sm:text-base text-white uppercase group-hover:text-white transition-colors">
                    Contact Team
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/20 bg-white/[0.04] text-white flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>

       
          </motion.div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 26s linear infinite;
        }
      `}</style>
    </div>
  );
}
