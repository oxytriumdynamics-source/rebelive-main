'use client';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StudioPodiumsProps {
  scrollProgress: number;
  isMobile: boolean;
  accentColor?: string;
  mousePosition?: { x: number; y: number };
}

/**
 * Photorealistic dual studio podiums:
 * 1. Top suspended ceiling mount / lighting emitter
 * 2. Bottom circular turntable stage platform
 * Inspired by cyber-industrial showcase environments.
 */
export const StudioPodiums: React.FC<StudioPodiumsProps> = ({
  scrollProgress,
  isMobile,
  accentColor = '#a855f7',
}) => {
  const topGroupRef = useRef<THREE.Group>(null);
  const bottomGroupRef = useRef<THREE.Group>(null);

  // Smoothly fade out and retract both podiums when scrolling from hero into details
  const heroExit = THREE.MathUtils.clamp((scrollProgress - 0.02) / 0.10, 0, 1);
  const opacity = Math.max(0, 1 - heroExit * 1.35);

  // Top podium hangs down from top center; retreats upward on scroll
  const topRestY = isMobile ? 3.45 : 3.40;
  const topExitY = 6.2;
  const targetTopY = THREE.MathUtils.lerp(topRestY, topExitY, heroExit);

  // Bottom podium rises from bottom center; retreats downward on scroll
  const bottomRestY = isMobile ? -2.45 : -2.32;
  const bottomExitY = -5.0;
  const targetBottomY = THREE.MathUtils.lerp(bottomRestY, bottomExitY, heroExit);

  useFrame((_, delta) => {
    if (opacity <= 0.005) return;
    if (topGroupRef.current) {
      topGroupRef.current.position.y = THREE.MathUtils.lerp(
        topGroupRef.current.position.y,
        targetTopY,
        delta * 5.0
      );
    }
    if (bottomGroupRef.current) {
      bottomGroupRef.current.position.y = THREE.MathUtils.lerp(
        bottomGroupRef.current.position.y,
        targetBottomY,
        delta * 5.0
      );
    }
  });

  if (opacity <= 0.01) return null;

  const podiumScale = isMobile ? 1.05 : 1.25;

  return (
    <>
      {/* ────────────────────────────────────────────────────────────
          1. TOP PODIUM: Suspended Ceiling Ring Emitter / Clamp
      ──────────────────────────────────────────────────────────── */}
      <group
        ref={topGroupRef}
        position={[0, targetTopY, 0]}
        scale={[podiumScale, podiumScale, podiumScale]}
      >
        {/* Outermost ceiling mount housing cylinder */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[2.35, 2.55, 0.5, 64]} />
          <meshStandardMaterial
            color="#0b0b0e"
            metalness={0.92}
            roughness={0.22}
            envMapIntensity={1.8}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Stepped metallic bevel ring */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[2.05, 2.35, 0.35, 64]} />
          <meshStandardMaterial
            color="#14141a"
            metalness={0.95}
            roughness={0.14}
            envMapIntensity={2.4}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Outer sharp specular chrome edge ring */}
        <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.08, 0.018, 16, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.98}
            roughness={0.08}
            envMapIntensity={3.2}
            transparent
            opacity={opacity * 0.95}
          />
        </mesh>

        {/* Outer illuminated LED halo ring */}
        <mesh position={[0, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.02, 0.014, 16, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={opacity * 0.85}
          />
        </mesh>

        {/* Secondary concentric recessed grooved ring */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[1.72, 1.98, 0.22, 64]} />
          <meshStandardMaterial
            color="#0c0c10"
            metalness={0.94}
            roughness={0.18}
            envMapIntensity={2.0}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Mid specular chrome ring */}
        <mesh position={[0, -0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.74, 0.012, 16, 64]} />
          <meshStandardMaterial
            color="#d8d8e8"
            metalness={0.96}
            roughness={0.10}
            envMapIntensity={2.8}
            transparent
            opacity={opacity * 0.9}
          />
        </mesh>

        {/* Inner emitter chamber recessed cylinder */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[1.42, 1.68, 0.18, 64]} />
          <meshStandardMaterial
            color="#08080b"
            metalness={0.96}
            roughness={0.12}
            envMapIntensity={2.2}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Inner concentric ring grooves */}
        <mesh position={[0, -0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.40, 0.010, 16, 64]} />
          <meshBasicMaterial
            color="#c0d4ff"
            transparent
            opacity={opacity * 0.7}
          />
        </mesh>

        <mesh position={[0, -0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.08, 0.009, 16, 64]} />
          <meshStandardMaterial
            color="#888899"
            metalness={0.9}
            roughness={0.15}
            transparent
            opacity={opacity * 0.8}
          />
        </mesh>

        {/* Recessed downward-facing center emitter disc */}
        <mesh position={[0, -0.075, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.38, 64]} />
          <meshStandardMaterial
            color="#050508"
            metalness={0.98}
            roughness={0.08}
            envMapIntensity={2.6}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Center core vent ring */}
        <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.75, 48]} />
          <meshStandardMaterial
            color="#181822"
            metalness={0.95}
            roughness={0.15}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Downward focused spotlight beam from top podium */}
        <spotLight
          position={[0, -0.1, 0]}
          target-position={[0, -1.8, 0]}
          intensity={2.8 * opacity}
          angle={0.45}
          penumbra={0.7}
          color="#ffffff"
          distance={6.5}
        />
      </group>

      {/* ────────────────────────────────────────────────────────────
          2. BOTTOM PODIUM: Heavy Cyber Turntable Stage Platform
      ──────────────────────────────────────────────────────────── */}
      <group
        ref={bottomGroupRef}
        position={[0, targetBottomY, 0]}
        scale={[podiumScale, podiumScale, podiumScale]}
      >
        {/* Sub-base chamfer cylinder sinking below viewport */}
        <mesh position={[0, -0.52, 0]} receiveShadow>
          <cylinderGeometry args={[2.42, 2.78, 0.70, 64]} />
          <meshStandardMaterial
            color="#09090c"
            metalness={0.88}
            roughness={0.30}
            envMapIntensity={1.3}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Main mid plinth cylinder */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[2.12, 2.38, 0.74, 64]} />
          <meshStandardMaterial
            color="#121217"
            metalness={0.94}
            roughness={0.16}
            envMapIntensity={2.4}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Top surface inner disc plate */}
        <mesh position={[0, 0.371, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.05, 64]} />
          <meshStandardMaterial
            color="#0a0a0e"
            metalness={0.97}
            roughness={0.11}
            envMapIntensity={2.7}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Top rim polished specular chrome ring */}
        <mesh position={[0, 0.373, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.11, 0.016, 16, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.98}
            roughness={0.06}
            envMapIntensity={3.4}
            transparent
            opacity={opacity * 0.95}
          />
        </mesh>

        {/* Primary glowing rim halo (white/accent) */}
        <mesh position={[0, 0.372, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.06, 0.013, 16, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={opacity * 0.88}
          />
        </mesh>

        {/* Concentric turntable grooves on the top plate */}
        <mesh position={[0, 0.374, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.78, 0.009, 16, 64]} />
          <meshStandardMaterial
            color="#222230"
            metalness={0.9}
            roughness={0.2}
            transparent
            opacity={opacity * 0.75}
          />
        </mesh>

        <mesh position={[0, 0.374, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.44, 0.008, 16, 64]} />
          <meshStandardMaterial
            color="#1d1d28"
            metalness={0.9}
            roughness={0.2}
            transparent
            opacity={opacity * 0.7}
          />
        </mesh>

        <mesh position={[0, 0.374, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.08, 0.008, 16, 64]} />
          <meshStandardMaterial
            color="#252535"
            metalness={0.92}
            roughness={0.18}
            transparent
            opacity={opacity * 0.65}
          />
        </mesh>

        {/* Subtle accent glow ring just below the top bevel */}
        <mesh position={[0, 0.26, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.18, 0.010, 16, 64]} />
          <meshBasicMaterial
            color={accentColor}
            transparent
            opacity={opacity * 0.55}
          />
        </mesh>
      </group>
    </>
  );
};
