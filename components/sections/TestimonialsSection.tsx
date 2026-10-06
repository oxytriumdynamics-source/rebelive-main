'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { soundEngine } from '@/lib/audio';

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  rating: number;
  image: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'viraj',
    name: 'VIRAJ',
    quote: 'I can’t believe this has zero sugar and still keeps me dialed in for 3-hour marathon sessions without any crash.',
    rating: 5,
    image: '/testimonials/rebel-viraj.jpg',
  },
  {
    id: 'meghna',
    name: 'MEGHNA',
    quote: 'Finally a functional drink that calms my nervous system without making me sluggish. The ashwagandha blend is pure magic.',
    rating: 5,
    image: '/testimonials/rebel-meghna.jpg',
  },
  {
    id: 'nishkarsh',
    name: 'NISHKARSH',
    quote: 'Replaced my afternoon coffee and jittery pre-workout completely. Clean, sustained energy from the very first sip.',
    rating: 5,
    image: '/testimonials/rebel-nishkarsh.jpg',
  },
  {
    id: 'ananya',
    name: 'ANANYA',
    quote: 'My work schedule is chaotic, but Rebelive gives me razor-sharp focus for late-night design sprints. Truly obsessed.',
    rating: 5,
    image: '/testimonials/rebel-ananya.jpg',
  },
  {
    id: 'aarav',
    name: 'AARAV',
    quote: 'The crisp citrus notes and electrolyte balance are unbelievable. Zero aftertaste, zero bullshit. It’s now essential in my gym bag.',
    rating: 5,
    image: '/testimonials/rebel-aarav.jpg',
  },
];

export interface TestimonialsSectionProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  className = '',
  title = 'OUR FIRST REBELS',
  subtitle = 'Tested and Tasted our pilot batch. Loved it from the first sip.',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth continuous auto-scroll
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const step = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isPaused && !isDragging && scrollRef.current) {
        const el = scrollRef.current;
        const move = (delta / 16.67) * 0.45;
        el.scrollLeft += move;

        // Loop seamlessly when near end
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
          el.scrollLeft = 0;
        }
      }
      animFrame = requestAnimationFrame(step);
    };

    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [isPaused, isDragging]);

  // Robust manual button scroll with temporary pause so smooth scroll animation completes cleanly
  const scrollByAmount = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    try {
      soundEngine.playClick(850);
    } catch {
      // Audio optional
    }

    // Pause auto-scroll immediately during manual scroll
    setIsPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);

    const el = scrollRef.current;
    const cardWidth = 340;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

    el.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });

    // Resume auto-scroll after smooth transition settles
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2200);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  // Drag-to-scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setIsPaused(true);
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  // Repeated items for seamless continuous looping
  const displayItems = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

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

      {/* ── Carousel Container with Floating Glass Navigation Arrows ── */}
      <div className="relative w-full group/track flex-1 max-h-[500px] flex items-center">
        {/* Floating Left Navigation Button */}
        <button
          onClick={() => scrollByAmount('left')}
          aria-label="Previous card"
          className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Floating Right Navigation Button */}
        <button
          onClick={() => scrollByAmount('right')}
          aria-label="Next card"
          className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/80 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* ── Horizontal Scroll Track with Animated Cards ── */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            setIsDragging(false);
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={`w-full h-full overflow-x-auto flex items-center gap-6 sm:gap-8 md:gap-9 px-8 sm:px-14 lg:px-18 scrollbar-none no-scrollbar cursor-grab active:cursor-grabbing will-change-scroll ${
            isDragging ? 'select-none' : ''
          }`}
          style={{
            scrollBehavior: isDragging ? 'auto' : 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {displayItems.map((item, idx) => (
            <motion.div
              key={`${item.id}-${idx}`}
              initial={{ opacity: 0, x: 45, scale: 0.98 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.08 }}
              transition={{
                duration: 0.48,
                delay: Math.min(0.2, (idx % TESTIMONIALS.length) * 0.05),
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
              className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] lg:w-[320px] h-[340px] sm:h-[360px] rounded-2xl sm:rounded-3xl relative overflow-hidden bg-neutral-950/60 hover:bg-neutral-900/80 border border-white/10 hover:border-white/20 backdrop-blur-xl transition-all duration-300 group p-6 sm:p-7 flex flex-col justify-between items-center text-center select-none"
            >
              {/* Top: Bigger Circular Photo */}
              <div className="flex flex-col items-center w-full">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-30 md:h-30 rounded-full overflow-hidden border border-white/20 group-hover:border-white/50 transition-all duration-500 shrink-0">
                  <Image
                    src={item.image}
                    alt={`${item.name} Rebelive Review`}
                    fill
                    sizes="128px"
                    className="object-cover object-[center_18%] grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                    priority={idx < 4}
                  />
                </div>
              </div>

              {/* Middle: Quote Text */}
              <div className="my-auto py-3 w-full px-1">
                <p className="text-[11px] sm:text-xs text-neutral-300 font-sans font-light leading-relaxed line-clamp-4 group-hover:text-white/95 transition-colors duration-200">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Bottom: Author Name */}
              <div className="pt-3 border-t border-white/10 w-full flex items-center justify-center">
                <span className="text-white/80 group-hover:text-white font-sans font-semibold text-[10px] sm:text-[11px] uppercase tracking-widest transition-colors duration-200">
                  {item.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
