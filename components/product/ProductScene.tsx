'use client';
import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { animationState } from '@/lib/animationState';
import * as THREE from 'three';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../data/products';
import { EnergyCan } from '../3d/EnergyCan';
import { createRadialGlowTexture } from '../3d/canTexture';

interface ProductSceneProps {
  products: Product[];
  selectedIndex: number;
  carouselOffset: number;
  isMobile: boolean;
  isTablet?: boolean;
  isPageReady?: boolean;
  onSelectFlavor: (index: number) => void;
  scrollProgress?: number;
  rotationVelocity?: number;
  mousePosition?: { x: number; y: number };
}

// Scroll phase constants
const HERO_TO_DETAIL_START = 0.05;
const HERO_TO_DETAIL_END = 0.16;

// Camera controller with smooth damping & calibrated parallax
function CameraRig({ isMobile, isTablet }: { isMobile: boolean; isTablet?: boolean }) {
  useFrame((state, delta) => {
    const sp = animationState.scrollProgress;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isSmall = isMobile || isTablet;

    // Calibrated mouse parallax (locked strictly dead-center on hero stage so can stays concentric with podiums)
    const heroParallaxLock = THREE.MathUtils.clamp((sp - 0.03) / 0.06, 0, 1);
    const parallaxFactorX = isSmall || prefersReduced ? 0 : THREE.MathUtils.lerp(0, 0.16, heroParallaxLock);
    const parallaxFactorY = isSmall || prefersReduced ? 0 : THREE.MathUtils.lerp(0, 0.10, heroParallaxLock);
    const px = animationState.mouseX * parallaxFactorX;
    const py = -animationState.mouseY * parallaxFactorY;

    // Camera targets calibrated for fov 35
    const heroZ = isMobile ? 8.2 : isTablet ? 8.0 : 7.6;
    const detailZ = isSmall ? 5.1 : 4.4;

    const heroToDetail = Math.min(
      1,
      Math.max(
        0,
        (sp - HERO_TO_DETAIL_START) /
        (HERO_TO_DETAIL_END - HERO_TO_DETAIL_START)
      )
    );

    // Smoothly re-center camera view as the scene transitions into the Statement section
    const detailToStmt = THREE.MathUtils.clamp((sp - 0.39) / 0.07, 0, 1);
    const easeCamD2S = detailToStmt * detailToStmt * (3 - 2 * detailToStmt);
    const baseCamX = THREE.MathUtils.lerp(
      THREE.MathUtils.lerp(0, isSmall ? 0 : 0.05, heroToDetail),
      0,
      easeCamD2S
    );
    const baseCamY = THREE.MathUtils.lerp(
      THREE.MathUtils.lerp(0, isSmall ? 0.12 : -0.02, heroToDetail),
      0,
      easeCamD2S
    );

    const targetX = baseCamX + px;
    const targetY = baseCamY + py;
    const targetZ = THREE.MathUtils.lerp(heroZ, detailZ, heroToDetail);

    // Smooth delta damping with responsive tracking
    const camSpeed = Math.min(1, delta * 6.5);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, camSpeed);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, camSpeed);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, camSpeed);
    state.camera.lookAt(baseCamX, baseCamY, 0);
  });

  return null;
}



const ProductSceneInner: React.FC<ProductSceneProps> = ({
  products,
  selectedIndex,
  carouselOffset,
  isMobile,
  isTablet = false,
  isPageReady = true,
  onSelectFlavor,
  scrollProgress = 0,
}) => {
  const [sceneReady, setSceneReady] = useState(false);
  const numProducts = products.length;
  const currentProduct = products[selectedIndex];
  const isPastStatement = scrollProgress >= 0.86;

  return (
    <div
      className={`fixed inset-0 z-10 transition-opacity duration-300 ease-out ${
        isPastStatement ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      style={{
        opacity: isPageReady ? (isPastStatement ? 0 : 1) : 0,
        visibility: isPastStatement ? 'hidden' : 'visible',
      }}
    >
      {/* 2D Poster fallback while 3D WebGL scene compiles and initializes (Instant LCP) */}
      <AnimatePresence>
        {!sceneReady && (currentProduct?.renderImage || currentProduct?.image) && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
          >
            <div className="relative w-36 sm:w-44 md:w-52 h-64 sm:h-72 md:h-[320px] opacity-95">
              <Image
                src={currentProduct.renderImage || currentProduct.image}
                alt={currentProduct.name}
                fill
                priority
                sizes="(max-width: 768px) 240px, 320px"
                className="object-contain filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 35, near: 0.1, far: 40 }}
        dpr={typeof window !== 'undefined' ? [1.5, Math.min(window.devicePixelRatio || 2, 2.25)] : [1, 2]}
        onCreated={() => setSceneReady(true)}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.95,
        }}
        shadows={false}
      >
        <CameraRig isMobile={isMobile} isTablet={isTablet} />

        {/* All-white clean studio lighting */}
        <ambientLight intensity={0.35} color="#ffffff" />
        <directionalLight position={[3, 4, 5]} intensity={2.4} color="#ffffff" />
        <pointLight
          position={[-4, 2, -2]}
          intensity={isMobile ? 20 : 35}
          distance={14}
          color="#ffffff"
        />
        <pointLight
          position={[4, -1, -3]}
          intensity={isMobile ? 15 : 28}
          distance={14}
          color="#ffffff"
        />

        {/* Procedural studio environment: pure white softboxes & specular strips */}
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3.5} position={[0, 5, -2]} scale={[10, 2, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={2.8} position={[-5, 0, 2]} scale={[6, 1.5, 1]} color="#ffffff" target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={2.8} position={[5, 0, 1]} scale={[6, 1.5, 1]} color="#ffffff" target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={6.0} position={[-3, 0, 5]} scale={[0.4, 6, 1]} color="#ffffff" target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={6.0} position={[3, 0, 5]} scale={[0.4, 6, 1]} color="#ffffff" target={[0, 0, 0]} />
        </Environment>

       

        {/* ── 3D Cans ── */}
        {products.map((product, idx) => {
          let diff = (idx - carouselOffset) % numProducts;
          while (diff > numProducts / 2) diff -= numProducts;
          while (diff < -numProducts / 2) diff += numProducts;

          const isSelected = Math.abs(diff) < 0.45;

          return (
            <EnergyCan
              key={product.id}
              product={product}
              isSelected={isSelected}
              diff={diff}
              isMobile={isMobile}
              isTablet={isTablet}
              onCanClick={() => {
                if (!isSelected) {
                  onSelectFlavor(idx);
                }
              }}
            />
          );
        })}
      </Canvas>
    </div>
  );
};

export const ProductScene = React.memo(ProductSceneInner, (prev, next) => {
  return (
    prev.selectedIndex === next.selectedIndex &&
    prev.carouselOffset === next.carouselOffset &&
    prev.isMobile === next.isMobile &&
    prev.isTablet === next.isTablet &&
    prev.isPageReady === next.isPageReady &&
    prev.products === next.products &&
    ((prev.scrollProgress ?? 0) >= 0.86) === ((next.scrollProgress ?? 0) >= 0.86)
  );
});
