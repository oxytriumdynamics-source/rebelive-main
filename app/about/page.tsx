'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const SANS = "'Poppins', sans-serif";



const LUX_EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
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

  


  return (
    <div
      id="about-page"
      style={{ fontFamily: SANS }}
      className="relative w-full min-h-screen text-white bg-black selection:bg-white selection:text-black overflow-x-hidden"
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

   

      {/* ── Continuous, Butter-Smooth Natural Scrolling Flow with Even Spacing ── */}
      <div className="w-full flex flex-col gap-14 sm:gap-20 lg:gap-24 pt-20 sm:pt-24 pb-16 sm:pb-24">
        {/* ══════════════════════════════════════════════════════════════
            SECTION 0: FOUNDERS SECTION
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="founders"
          className="w-full flex items-center justify-center relative px-4 sm:px-8 lg:px-16"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end"
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
                    “We’re on a mission to make better-for-you choices fun, simple and for everyone. It has led us to innovative, clutter-breaking formats and flavours, presented with a lightness that fits into anyone’s lifestyle. Let&apos;s Wake Up and Rebel!”
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
              className="lg:col-span-5 flex justify-center lg:justify-end self-end w-full"
            >
              <div className="relative w-full max-w-[520px] aspect-[4/3] rounded-3xl overflow-hidden border border-white/15 bg-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.85)] group">
                <Image
                  src="/brand/founders-8137.webp"
                  alt="Krishna and Sai Vaishno - Co-Founders"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            MARQUEE DIVIDER: WAKE . FUEL . REBEL
           ══════════════════════════════════════════════════════════════ */}
        <div className="w-full border-y border-white/15 bg-white/[0.02] py-3.5 sm:py-5 overflow-hidden select-none">
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

        {/* ══════════════════════════════════════════════════════════════
            SECTION 1: REBELIVE PHILOSOPHY & EMBLEM
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="rebelive"
          className="w-full flex items-center justify-center relative px-4 sm:px-8 lg:px-16 pt-4 pb-8 sm:pb-16 lg:pb-20"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="w-full max-w-7xl mx-auto"
          >
            {/* Content: Image at top on mobile (order-1), Narrative below (order-2); side-by-side on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              {/* Narrative Content */}
              <div className="lg:col-span-7 order-2 lg:order-1 space-y-5">
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

              {/* Panther Emblem Artwork (Top on mobile) */}
              <motion.div
                variants={scaleInItem}
                className="lg:col-span-5 order-1 lg:order-2 flex items-center justify-center"
              >
                <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 flex items-center justify-center select-none group">
                  <div className="absolute inset-0 rounded-full bg-white/[0.05] blur-3xl pointer-events-none group-hover:bg-white/[0.1] transition-colors" />
                  <div className="relative w-full h-full p-4 sm:p-6 flex items-center justify-center">
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

        {/* ── Generous Separation Divider Between Rebelive & Oxytrium Dynamics ── */}
        <div className="w-full max-w-5xl mx-auto px-6 sm:px-12 my-6 sm:my-10 lg:my-14 select-none pointer-events-none">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SECTION 2: OXYTRIUM DYNAMICS (INCUBATOR LAB)
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="oxytrium"
          className="w-full flex items-center justify-center relative px-4 sm:px-8 lg:px-16 pt-6 sm:pt-14 lg:pt-18 pb-8 sm:pb-16 lg:pb-20"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
          >
            {/* Oxytrium Dynamics Official Logo Emblem (Top on mobile) */}
            <motion.div
              variants={scaleInItem}
              className="lg:col-span-5 order-1 lg:order-1 flex items-center justify-center"
            >
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center select-none group">
                {/* Subtle Ambient Radial Backlight */}
                <div className="absolute inset-0 rounded-full bg-[#5195D0]/10 blur-3xl pointer-events-none group-hover:bg-[#5195D0]/20 transition-all duration-700" />

                <div className="relative w-full h-full p-2 sm:p-4 flex items-center justify-center">
                  <Image
                    src="/brand/oxytrium_logo_white.png"
                    alt="Oxytrium Dynamics Official Emblem"
                    fill
                    sizes="(max-width: 768px) 320px, (max-width: 1024px) 384px, 420px"
                    className="object-contain drop-shadow-[0_0_40px_rgba(81,149,208,0.25)] group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
              </div>
            </motion.div>

            {/* Oxytrium Narrative (Below image on mobile) */}
            <div className="lg:col-span-7 order-2 lg:order-2 space-y-5">
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
            SECTION 3: EXPLORATION PATHWAYS & CLOSING MANIFESTO
           ══════════════════════════════════════════════════════════════ */}
        <section
          id="pathways"
          className="w-full flex items-center justify-center relative px-4 sm:px-8 lg:px-16"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="w-full max-w-7xl mx-auto space-y-8 sm:space-y-12"
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
