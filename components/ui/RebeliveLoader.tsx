'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export interface RebeliveLoaderProps {
  progress?: number;
  phaseText?: string;
  categoryText?: string;
  subtitle?: string;
  fullScreen?: boolean;
  className?: string;
}

const DEFAULT_PHASES = [
  'CALIBRATING 3D SHADERS',
  'SYNCHRONIZING MONOCHROME PALETTES',
  'COMPUTING ALUMINUM SPECULAR HIGHLIGHTS',
  'INITIALIZING PRODUCT 023 // REBELIVE LABS',
  'SYSTEM READY',
];

export const RebeliveLoader: React.FC<RebeliveLoaderProps> = ({
  progress: externalProgress,
  phaseText,
  categoryText = 'ENERGY DRINKS',
  subtitle = 'HIGH-VELOCITY BEVERAGE ARCHITECTURE',
  fullScreen = true,
  className = '',
}) => {
  const isIndeterminate = externalProgress === undefined;
  const [internalProgress, setInternalProgress] = useState(14);
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    if (!isIndeterminate) return;

    // Realistic progressive telemetry simulation for route transitions & initial loading
    const interval = setInterval(() => {
      setInternalProgress((prev) => {
        if (prev >= 96) return 96;
        const jump = Math.max(1, Math.floor((100 - prev) * 0.14));
        return Math.min(prev + jump, 96);
      });
    }, 280);

    const phaseInterval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % (DEFAULT_PHASES.length - 1));
    }, 1200);

    return () => {
      clearInterval(interval);
      clearInterval(phaseInterval);
    };
  }, [isIndeterminate]);

  const activeProgress = isIndeterminate ? internalProgress : Math.min(Math.max(externalProgress, 0), 100);
  const activePhase = phaseText || DEFAULT_PHASES[phaseIndex] || 'COMPUTING ALUMINUM SPECULAR HIGHLIGHTS';

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-[99999] bg-[#000000] flex flex-col items-center justify-center select-none pointer-events-auto'
    : 'w-full min-h-[380px] bg-[#000000] flex flex-col items-center justify-center select-none py-16';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="w-full max-w-md px-6 flex flex-col items-center">
        {/* Brand Logo with Ambient Glow and Horizontal Dark & Light Chrome Gradient */}
        <div className="flex flex-col items-center mb-6 sm:mb-8 relative">
          {/* Subtle Ambient Radial Backlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-24 bg-white/[0.06] rounded-full blur-2xl pointer-events-none" />

          {/* Logo container: Made bigger with metallic dark & light chrome gradient */}
          <div
            className="relative w-[240px] h-[52px] min-[420px]:w-[270px] min-[420px]:h-[58px] sm:w-[300px] sm:h-[64px] md:w-[330px] md:h-[70px]"
        
          >
            {/* Masked logo letterforms with horizontal dark & light gradient loading animation */}
            <div
              className="absolute inset-0 overflow-hidden animate-chrome-horizontal"
              style={{
                WebkitMaskImage: 'url("/brand/REBELIVE Logo Black.webp")',
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskImage: 'url("/brand/REBELIVE Logo Black.webp")',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
              }}
            />
          </div>

     
        </div>

        {/* Minimal Horizontal Gradient Loading Bar */}
        <div className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] h-[1.5px] sm:h-[2px] bg-white/[0.12] rounded-full overflow-hidden relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] mb-4">
          {isIndeterminate ? (
            /* Continuous Horizontal Gradient Beam */
            <div
              className="animate-horizontal-beam h-full rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, #2a2a30 20%, #70707c 35%, #ffffff 50%, #70707c 65%, #2a2a30 80%, transparent 100%)',
                boxShadow: '0 0 14px rgba(255,255,255,0.85), 0 0 24px rgba(255,255,255,0.35)',
              }}
            />
          ) : (
            /* Deterministic Horizontal Gradient Bar */
            <div
              className="h-full rounded-full relative transition-all duration-300 ease-out animate-chrome-horizontal"
              style={{
                width: `${activeProgress}%`,
                boxShadow: '0 0 12px rgba(255,255,255,0.7), 0 0 24px rgba(255,255,255,0.35)',
              }}
            />
          )}
        </div>

       


      </div>
    </div>
  );
};

export default RebeliveLoader;
