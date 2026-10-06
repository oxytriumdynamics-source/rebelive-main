'use client';

import React, { useEffect, useRef } from 'react';
import { SmokeConfig } from '@/types/smoke';
import { mountFluidSmoke } from '@/lib/fluid-smoke';

export interface FluidSmokeBackgroundProps {
  config: SmokeConfig;
  className?: string;
  interactive?: boolean;
  resetKey?: string | number;
}

export function FluidSmokeBackground({
  config,
  className = '',
  interactive = false,
  resetKey,
}: FluidSmokeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ReturnType<typeof mountFluidSmoke> | null>(null);
  const [fadeOpacity, setFadeOpacity] = React.useState(1);
  const isFirstMount = useRef(true);

  const effectiveConfig = React.useMemo(() => ({
    ...config,
    mouse: interactive ? (config.mouse ?? 0.22) : 0,
    interactive,
  }), [config, interactive]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Mount fluid smoke engine
    const instance = mountFluidSmoke(el, effectiveConfig);
    instanceRef.current = instance;

    return () => {
      instance.destroy();
      instanceRef.current = null;
    };
  }, []);

  // Update uniforms when configuration changes
  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update(effectiveConfig);
    }
  }, [effectiveConfig]);

  // Restart fluid smoke flow from the start when can changes
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    // Soft crossfade: momentarily dip opacity, restart flow from start at t=0, then bloom back in
    setFadeOpacity(0.12);
    const timer = setTimeout(() => {
      if (instanceRef.current) {
        instanceRef.current.restart();
        instanceRef.current.update(effectiveConfig);
      }
      setFadeOpacity(1);
    }, 160);

    return () => clearTimeout(timer);
  }, [resetKey]);

  const colorsAttr = effectiveConfig.colors.join(',');

  return (
    <div
      ref={containerRef}
      style={{
        opacity: fadeOpacity,
        transition: 'opacity 0.28s ease-out',
      }}
      data-aifx="fluid-smoke"
      data-aifx-colors={colorsAttr}
      data-aifx-bg={effectiveConfig.bg}
      data-aifx-bg-alpha={effectiveConfig.bgAlpha}
      data-aifx-speed={effectiveConfig.speed}
      data-aifx-scale={effectiveConfig.scale}
      data-aifx-warp={effectiveConfig.warp}
      data-aifx-rise={effectiveConfig.rise}
      data-aifx-swirl={effectiveConfig.swirl}
      data-aifx-contrast={effectiveConfig.contrast}
      data-aifx-softness={effectiveConfig.softness}
      data-aifx-mouse={effectiveConfig.mouse}
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}

export default FluidSmokeBackground;
