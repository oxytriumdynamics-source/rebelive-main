'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating: number;
  image: string;
  imagePosition?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'nishant',
    name: 'NISHANT MISHRA',
    quote: 'Clean sustained mental clarity through long coding sessions without any crash or anxiety. Rebelive is literally in a class of its own.',
    rating: 5,
    image: '/testimonials/rebel-nishant.jpg',
    imagePosition: 'center 15%',
  },
  {
    id: 'ashray',
    name: 'ASHRAY VASU',
    quote: 'The calm focus and zero-sugar formulation completely upgraded my workday routine. No jitters, pure natural flow state.',
    rating: 5,
    image: '/testimonials/rebel-ashray.jpg',
    imagePosition: 'center 15%',
  },


];

export interface TestimonialsSectionProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

const TestimonialCard: React.FC<{ item: Testimonial; priority?: boolean }> = ({ item, priority = false }) => {
  return (
    <div
      className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] h-[340px] sm:h-[360px] rounded-2xl sm:rounded-3xl relative overflow-hidden bg-neutral-950/70 hover:bg-neutral-900/90 border border-white/10 hover:border-white/25 backdrop-blur-xl transition-all duration-300 group/card p-6 sm:p-7 flex flex-col justify-between items-center text-center select-none hover:-translate-y-1 cursor-pointer"
    >
      {/* Top: Circular Photo with Grayscale to Color on Hover */}
      <div className="flex flex-col items-center w-full">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-30 md:h-30 rounded-full overflow-hidden border border-white/20 group-hover/card:border-white/50 transition-all duration-500 shrink-0">
          <Image
            src={item.image}
            alt={`${item.name} Rebelive Review`}
            fill
            sizes="128px"
            style={{ objectPosition: item.imagePosition || 'center 18%' }}
            className="object-cover grayscale group-hover/card:grayscale-0 group-hover/card:scale-105 transition-all duration-500 ease-out"
            priority={priority}
          />
        </div>
      </div>

      {/* Middle: Quote Text */}
      <div className="my-auto py-3 w-full px-1">
        <p className="text-[11px] sm:text-xs text-neutral-300 font-sans font-light leading-relaxed line-clamp-4 group-hover/card:text-white/95 transition-colors duration-200">
          &ldquo;{item.quote}&rdquo;
        </p>
      </div>

      {/* Bottom: Author Name */}
      <div className="pt-3 border-t border-white/10 w-full flex items-center justify-center">
        <span className="text-white/80 group-hover/card:text-white font-sans font-semibold text-[10px] sm:text-[11px] uppercase tracking-widest transition-colors duration-200">
          {item.name}
        </span>
      </div>
    </div>
  );
};

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  className = '',
  title = 'OUR FIRST REBELS',
  subtitle = 'Tested and Tasted our pilot batch. Loved it from the first sip.',
}) => {
  const [isPaused, setIsPaused] = useState(false);

  // Double items per track so every track is expansive and seamless
  const trackItems = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section
      className={`relative w-full flex flex-col justify-center items-center py-14 sm:py-20 md:py-24 overflow-hidden select-none bg-transparent text-white ${className}`}
    >
      {/* ── Centered Header with Staggered Scroll Intro Animation ── */}
      <div className="max-w-4xl mx-auto px-6 text-center space-y-2 mb-8 sm:mb-12 relative z-10 flex-shrink-0">
        <motion.h2
          initial={{ opacity: 0, y: 36, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-black tracking-tight uppercase leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm md:text-base text-neutral-300 font-sans font-light max-w-xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>
      </div>

      {/* ── Infinite Marquee Container with Hover Pause & Edge Fades ── */}
      <div
        className="relative w-full marquee-container group overflow-hidden py-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Sleek edge masks for smooth appearance / exit */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 z-20 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 z-20 bg-gradient-to-l from-black via-black/70 to-transparent" />

        {/* The Dual-Track Flex Row for 100% Mathematically Seamless Infinite Loop */}
        <div className="flex w-max">
          {/* Primary Track */}
          <div
            className="flex shrink-0 gap-6 sm:gap-8 md:gap-9 animate-marquee-smooth pr-6 sm:pr-8 md:pr-9"
            style={{ animationPlayState: isPaused ? 'paused' : undefined }}
          >
            {trackItems.map((item, idx) => (
              <TestimonialCard key={`track1-${item.id}-${idx}`} item={item} priority={idx < 4} />
            ))}
          </div>

          {/* Secondary Clone Track (Mirrors Primary Track to Create Seamless Infinite Horizon) */}
          <div
            className="flex shrink-0 gap-6 sm:gap-8 md:gap-9 animate-marquee-smooth pr-6 sm:pr-8 md:pr-9"
            style={{ animationPlayState: isPaused ? 'paused' : undefined }}
            aria-hidden="true"
          >
            {trackItems.map((item, idx) => (
              <TestimonialCard key={`track2-${item.id}-${idx}`} item={item} priority={false} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
