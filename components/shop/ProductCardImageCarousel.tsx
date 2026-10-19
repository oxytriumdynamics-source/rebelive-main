'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Product } from '@/data/products';

interface ProductCardImageCarouselProps {
  product: Product;
  priority?: boolean;
}

export function ProductCardImageCarousel({ product, priority = false }: ProductCardImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Extract all available multi-angle images for this product strictly from backend API
  const images = useMemo(() => {
    const list: string[] = [];
    const add = (url?: string | null) => {
      if (url && typeof url === 'string') {
        const trimmed = url.trim();
        // Discard empty strings, flat wrap textures, and static mock files
        if (
          trimmed &&
          !list.includes(trimmed) &&
          !trimmed.includes('-can.webp') &&
          !trimmed.startsWith('/products/') &&
          !trimmed.startsWith('/brand/')
        ) {
          list.push(trimmed);
        }
      }
    };

    // 1. Primary backend hero image first (always index 0)
    add(product.image);

    // 2. Gallery images array from backend API
    if (Array.isArray(product.gallery) && product.gallery.length > 0) {
      product.gallery.forEach((item: any) => {
        const u = typeof item === 'string' ? item : item?.src || item?.url || item?.imageUrl;
        add(u);
      });
    }

    // 3. Backend images relation (if returned from backend API)
    if (Array.isArray((product as any).images)) {
      (product as any).images.forEach((item: any) => {
        const u = typeof item === 'string' ? item : item?.url || item?.src;
        add(u);
      });
    }

    // 4. Render image from API if distinct and valid
    if (product.renderImage && product.renderImage !== product.image) {
      add(product.renderImage);
    }

    // Fallback: If no API images matched the strict filter (e.g. offline mock mode), ensure card is never blank
    if (list.length === 0 && product.image) {
      list.push(product.image);
    }

    return list;
  }, [product]);

  // Smooth, relaxed auto-carousel on hover: cycles smoothly through all available angles
  useEffect(() => {
    if (isHovered && images.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 1400);
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
      {/* ── Carousel Images Stack with Buttery Smooth Cross-Fade Transition ── */}
      {images.map((src, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={src + idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={src}
              alt={`${product.name} - Angle ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority={priority && idx === 0}
              unoptimized={src.startsWith('http')}
            />
          </div>
        );
      })}

      {/* ── Seamless solid black gradient fading from bottom, bleeding past edge ── */}
      <div className="absolute inset-x-0 -bottom-[2px] h-28 sm:h-32 bg-gradient-to-t from-[#0e0e0e] from-10% via-[#0e0e0e]/80 via-45% to-transparent pointer-events-none z-20" />

      {/* ── Top Multi-Segment Indicator Bars (illuminates subtly on hover as auto-cycling) ── */}
      {images.length > 1 && (
        <div className="absolute top-2.5 sm:top-3 inset-x-3 sm:inset-x-4 flex items-center gap-1.5 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          {images.map((_, idx) => {
            const isBarActive = currentIndex === idx;
            return (
              <div
                key={idx}
                className="h-1 flex-1 rounded-full transition-all duration-500 overflow-hidden bg-white/20"
                title={`Angle ${idx + 1}`}
              >
                <div
                  className={`h-full transition-all duration-500 ease-out ${
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
    </div>
  );
}
