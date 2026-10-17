'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/data/products';

interface ProductCardImageCarouselProps {
  product: Product;
  priority?: boolean;
}

export function ProductCardImageCarousel({ product, priority = false }: ProductCardImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Extract all available multi-angle images for this product
  const images = useMemo(() => {
    const list: string[] = [];
    const add = (url?: string) => {
      if (url && typeof url === 'string' && url.trim() && !list.includes(url.trim())) {
        list.push(url.trim());
      }
    };

    // 1. Gallery array from backend / static data
    if (Array.isArray(product.gallery) && product.gallery.length > 0) {
      product.gallery.forEach((item: any) => {
        const u = typeof item === 'string' ? item : item?.src || item?.url;
        add(u);
      });
    }

    // 2. Primary / can / render images
    add(product.image);
    add(product.canImage);
    add(product.renderImage);

    // 3. High-resolution studio angle renders for flagship personas
    const slug = (product.id || '').toLowerCase();
    if (['apex', 'aviva', 'capella'].includes(slug)) {
      add(`/products/${slug}.webp`);
      add(`/products/${slug}-clean.webp`);
      add(`/products/${slug}-perspective.webp`);
      add(`/brand/${slug}-can.webp`);
    } else if (slug === 'variety') {
      add('/products/apex.webp');
      add('/products/aviva-clean.webp');
      add('/products/capella-clean.webp');
      add('/brand/apex-can.webp');
      add('/brand/aviva-can.webp');
      add('/brand/capella-can.webp');
    }

    return list;
  }, [product]);

  // Handle automated cycling on hover
  useEffect(() => {
    if (isHovered && images.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 1500);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      // Reset smoothly to hero angle when cursor leaves
      setCurrentIndex(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isHovered, images.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center text-center p-3 z-10 relative">
        <div className="w-20 h-32 rounded-2xl bg-neutral-900/90 border border-white/10 flex flex-col items-center justify-center shadow-inner group-hover:border-white/30 transition-colors">
          <div className="w-6 h-1 rounded-full bg-white/20 mb-2" />
          <span className="font-bold text-[9px] text-white/70 tracking-widest uppercase font-mono px-1 truncate max-w-full">
            {product.name}
          </span>
          <span className="text-[7.5px] text-white/30 uppercase font-mono mt-1 px-1 truncate max-w-full">
            {product.flavor || '250ML'}
          </span>
          <div className="w-6 h-1 rounded-full bg-white/10 mt-3" />
        </div>
        <span className="text-[8.5px] text-white/30 font-mono uppercase tracking-wider mt-2">
          Artwork Pending
        </span>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full z-10 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Carousel Images Stack with Cross-Fade Transition ── */}
      {images.map((src, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={src + idx}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={src}
              alt={`${product.name} - Angle ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={priority && idx === 0}
              unoptimized={src.startsWith('http')}
            />
          </div>
        );
      })}

      {/* ── Seamless solid black gradient fading from bottom, bleeding past edge ── */}
      <div className="absolute inset-x-0 -bottom-[2px] h-28 sm:h-32 bg-gradient-to-t from-[#0e0e0e] from-10% via-[#0e0e0e]/80 via-45% to-transparent pointer-events-none z-20" />

      {/* ── Top Multi-Segment Indicator Bars (illuminates on hover or as auto-cycling) ── */}
      {images.length > 1 && (
        <div className="absolute top-2.5 sm:top-3 inset-x-3 sm:inset-x-4 flex items-center gap-1.5 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
          {images.map((_, idx) => {
            const isBarActive = currentIndex === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setCurrentIndex(idx)}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className="h-1 flex-1 rounded-full cursor-pointer transition-all duration-300 overflow-hidden bg-white/20 hover:bg-white/40"
                title={`View Angle ${idx + 1}`}
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    isBarActive
                      ? 'w-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]'
                      : 'w-0'
                  }`}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ── Subtle Angle Counter Badge ── */}
      {images.length > 1 && (
        <div className="absolute top-6 sm:top-7 right-3 text-[8.5px] font-mono text-white/70 bg-black/60 border border-white/10 px-2 py-0.5 rounded-full z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-md pointer-events-none">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* ── Navigation Chevrons on Hover ── */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/65 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 backdrop-blur-md cursor-pointer hover:scale-110 shadow-lg active:scale-95"
            aria-label="Previous image"
            title="Previous Angle"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/65 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 backdrop-blur-md cursor-pointer hover:scale-110 shadow-lg active:scale-95"
            aria-label="Next image"
            title="Next Angle"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
