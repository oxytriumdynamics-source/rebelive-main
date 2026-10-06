'use client';
import React, { useMemo } from 'react';
import { Product } from '../../data/products';
import { FluidSmokeBackground } from './FluidSmokeBackground';
import { SmokeConfig } from '../../types/smoke';

interface AtmosphericBackgroundProps {
  currentProduct?: Product;
  isMobile?: boolean;
}

/**
 * Full Atmospheric Smokey Gradient Background:
 * - Deep obsidian/charcoal foundation with rich layered smoky radial gradients
 * - Dynamic mouse parallax response creating depth across smoky mist clouds
 * - Fluid smoke WebGL simulation tendrils drifting seamlessly over the gradient
 * - Sleek dark gradient border framing all 4 screen edges for cinematic focus
 */
const AtmosphericBackgroundInner: React.FC<AtmosphericBackgroundProps> = ({
  currentProduct,
  isMobile = false,
}) => {
  // Determine smoke palette colors based on active product persona
  const smokeColors = useMemo(() => {
    if (currentProduct?.id === 'aviva') {
      // AVIVA: Smoke is predominantly black, gray, and white, with moving pink fluid smoke tendrils
      return ['#020202', '#383840', '#e46892', '#ffffff'];
    }

    if (currentProduct?.id === 'capella') {
      // CAPELLA: Smoke is predominantly black, gray, and white, with moving golden yellow fluid smoke tendrils
      return ['#000000', '#383840', '#e5b83b', '#ffffff'];
    }

    // ELSE (APEX & default): Strictly pure monochrome black, gray, and white
    return ['#000000', '#414141', '#7e7e8a', '#ffffff'];
  }, [currentProduct?.id]);

  // Subtle interactive smoke config (calm autonomous drift with zero mouse artifacts)
  const smokeConfig: SmokeConfig = useMemo(() => ({
    colors: smokeColors,
    bg: '#000000',
    bgAlpha: 0.0,
    speed: 0.25,
    scale: 1.35,
    warp: 0.76,
    rise: 0.32,
    swirl: 0.48,
    contrast: 1.16,
    softness: 0.78,
    mouse: 0.16,
    interactive: false,
  }), [smokeColors]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-black">
      {/* ── 1. Master Base Smokey Gradient Layers (Pure Neutral Monochrome) ── */}
      {/* Deep foundation gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg,
              #000000 0%,
              #030303 35%,
              #080808 50%,
              #030303 68%,
              #000000 100%
            )
          `,
        }}
      />

      {/* Primary Smokey Horizon & Center Glow - neutral charcoal/graphite */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 95% 70% at 50% 55%,
              rgba(38, 42, 54, 0.42) 0%,
              rgba(22, 24, 32, 0.32) 40%,
              rgba(10, 11, 15, 0.18) 70%,
              transparent 100%
            )
          `,
        }}
      />

      {/* Secondary Ethereal Smokey Bloom (Upper/Mid depth) */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 85% 55% at 52% 35%,
              rgba(0 0 0 / 0.36) 0%,
              rgba(22, 24, 32, 0.24) 50%,
              transparent 85%
            )
          `,
        }}
      />

      {/* Lower Ground Smoky Haze (Behind 3D cans) */}
      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[130vw] h-[55vh] pointer-events-none transform-gpu"
        style={{
          background: `
            radial-gradient(ellipse at 50% 90%,
              rgba(42, 46, 58, 0.28) 0%,
              rgba(22, 25, 33, 0.16) 35%,
              rgba(8, 9, 12, 0.06) 65%,
              transparent 100%
            )
          `,
        }}
      />

      {/* ── 2. Fluid Smoke Simulation Layer - desktop only (second WebGL context is too heavy for mobile) ── */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none opacity-45 mix-blend-screen">
          <FluidSmokeBackground
            config={smokeConfig}
            interactive={false}
            resetKey={currentProduct?.id}
          />
        </div>
      )}

      {/* ── 3. Minimal Dark Gradient Border Framing ── */}
      {/* Soft, minimal edge vignette - keeps border gradient delicate and unobtrusive */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          boxShadow: 'inset 0 0 40px 2px rgba(0, 0, 0, 0.50)',
        }}
      />

      {/* ── 4. Ultra-Subtle Film Grain ── */}
      <div className="absolute inset-0 pointer-events-none grain-overlay opacity-[0.025] mix-blend-screen z-10" />
    </div>
  );
};

export const AtmosphericBackground = React.memo(
  AtmosphericBackgroundInner,
  (prev, next) =>
    prev.currentProduct?.id === next.currentProduct?.id &&
    prev.isMobile === next.isMobile
);

