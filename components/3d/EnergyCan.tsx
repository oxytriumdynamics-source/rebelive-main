'use client';
import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { Product } from '../../data/products';
import { animationState } from '@/lib/animationState';
import { hasIntroLoaded } from '@/lib/introState';
import { getCanTexture, getCanNormalMap } from './canTexture';

// Cache reduced-motion preference at module level
const _mql =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
let _prefersReducedMotion = _mql?.matches ?? false;
_mql?.addEventListener('change', (e) => {
  _prefersReducedMotion = e.matches;
});

// Local self-hosted Draco decoder path
export const DRACO_DECODER_PATH = '/draco/gltf/';
export const MODEL_PATH = '/models/soda-can1.glb';

// Preload the shared can model
useGLTF.preload(MODEL_PATH, DRACO_DECODER_PATH);

// Real-world 250ml slim energy drink can dimensions:
// 134 mm (5.3 in) tall, diameter 53.4 mm (2.1 in)
export const CAN_HEIGHT_MM = 134;
export const CAN_DIAMETER_MM = 53.4;
export const CAN_RADIUS_MM = CAN_DIAMETER_MM / 2; // 26.7 mm
export const CAN_ASPECT_RATIO = CAN_HEIGHT_MM / CAN_DIAMETER_MM; // ~2.50936

export const TARGET_HEIGHT = 2.4; // world units at scale 1
export const TARGET_DIAMETER = TARGET_HEIGHT / CAN_ASPECT_RATIO; // ~0.9564 world units
export const TARGET_RADIUS = TARGET_DIAMETER / 2; // ~0.4782 world units

// Model coordinates (metres): straight wall r=0.0336 from y=0.012 to 0.158
export const WALL_R = 0.0336;
export const WALL_Y0 = 0.012;
export const WALL_Y1 = 0.158;

interface EnergyCanProps {
  product: Product;
  isSelected?: boolean;
  diff?: number;
  isMobile?: boolean;
  isTablet?: boolean;
  onCanClick?: () => void;
}

/**
 * Renders the real REBELIVE soda-can.glb model calibrated to 134mm x 53.4mm:
 * 1. The base GLB mesh is rendered as pure physical reflective aluminum (lid, tab, rims, chime).
 * 2. The authentic 360° flavor label is wrapped around the straight cylinder body with MeshPhysicalMaterial.
 */
function RealCanModel({
  product,
  isSelected,
}: {
  product: Product;
  isSelected?: boolean;
}) {
  const { scene } = useGLTF(MODEL_PATH, DRACO_DECODER_PATH);

  // Lazy-load textures: hero immediately, side cans deferred slightly
  const [canLoadTexture, setCanLoadTexture] = React.useState(!!isSelected);
  useEffect(() => {
    if (isSelected) {
      setCanLoadTexture(true);
    } else {
      const timer = setTimeout(() => setCanLoadTexture(true), 400);
      return () => clearTimeout(timer);
    }
  }, [isSelected]);

  const labelTexture = useMemo(() => {
    if (!canLoadTexture && !isSelected) return null;
    return getCanTexture(product);
  }, [product, canLoadTexture, isSelected]);

  const normalMap = useMemo(() => getCanNormalMap(), []);

  // Compute normalized scale, centering offset, and materials calibrated to 134mm x 53.4mm
  const built = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Calibrate each axis to the exact 134 mm x 53.4 mm slim can proportion
    const scaleY = TARGET_HEIGHT / (size.y || 0.16835);
    const scaleX = TARGET_DIAMETER / (size.x || 0.06659);
    const scaleZ = TARGET_DIAMETER / (size.z || 0.06659);

    const offset: [number, number, number] = [
      -center.x * scaleX,
      -center.y * scaleY,
      -center.z * scaleZ,
    ];

    // Photorealistic physical aluminum for the raw can geometry
    const metal = new THREE.MeshPhysicalMaterial({
      color: isSelected ? '#d8d4e2' : '#454350',
      metalness: isSelected ? 0.96 : 0.75,
      roughness: isSelected ? 0.24 : 0.52,
      clearcoat: isSelected ? 0.35 : 0.10,
      clearcoatRoughness: 0.15,
      envMapIntensity: isSelected ? 1.5 : 0.35,
    });

    cloned.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        (o as THREE.Mesh).material = metal;
      }
    });

    // Wrap-around label cylinder: covers straight body with micro-offset to prevent z-fighting
    const labelGeo = new THREE.CylinderGeometry(
      WALL_R,
      WALL_R,
      WALL_Y1 - WALL_Y0,
      96,
      1,
      true
    );

    const labelMat = new THREE.MeshPhysicalMaterial({
      map: labelTexture,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.04, 0.04),
      metalness: isSelected ? 0.65 : 0.30,
      roughness: isSelected ? 0.26 : 0.55,
      clearcoat: isSelected ? 0.75 : 0.20,
      clearcoatRoughness: 0.16,
      envMapIntensity: isSelected ? 1.35 : 0.30,
      transparent: true,
      depthWrite: true,
    });

    return {
      cloned,
      scaleX,
      scaleY,
      scaleZ,
      offset,
      metal,
      labelGeo,
      labelMat,
    };
  }, [scene, isSelected, labelTexture, normalMap]);

  // Clean up geometries & materials when unmounting
  useEffect(() => {
    return () => {
      built.metal.dispose();
      built.labelMat.dispose();
      built.labelGeo.dispose();
    };
  }, [built]);

  const { cloned, scaleX, scaleY, scaleZ, offset, labelGeo, labelMat } = built;

  return (
    <group scale={[scaleX, scaleY, scaleZ]} position={offset}>
      <primitive object={cloned} />
      {/* Wrap-around label: u=0.25 faces +Z after a -90° turn */}
      <mesh
        geometry={labelGeo}
        material={labelMat}
        position={[0, (WALL_Y0 + WALL_Y1) / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
    </group>
  );
}

/**
 * Procedural 3D can fallback when GLB model is loading.
 */
function ProceduralCan({
  product,
  isSelected,
}: {
  product: Product;
  isSelected?: boolean;
}) {
  const labelTexture = useMemo(() => getCanTexture(product), [product]);
  const normalMap = useMemo(() => getCanNormalMap(), []);

  const aluminumMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: isSelected ? '#d8d4e2' : '#454350',
        metalness: isSelected ? 0.95 : 0.70,
        roughness: isSelected ? 0.24 : 0.55,
        clearcoat: isSelected ? 0.35 : 0.10,
        clearcoatRoughness: 0.15,
        envMapIntensity: isSelected ? 1.5 : 0.35,
      }),
    [isSelected]
  );

  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: labelTexture,
        normalMap,
        normalScale: new THREE.Vector2(0.04, 0.04),
        metalness: isSelected ? 0.65 : 0.30,
        roughness: isSelected ? 0.26 : 0.55,
        clearcoat: isSelected ? 0.75 : 0.20,
        clearcoatRoughness: 0.16,
        envMapIntensity: isSelected ? 1.35 : 0.30,
        transparent: true,
      }),
    [labelTexture, normalMap, isSelected]
  );

  const R = TARGET_RADIUS;
  const H = TARGET_HEIGHT;
  const WALL_H = H * 0.867;

  return (
    <group>
      {/* Label Body (134mm x 53.4mm calibrated) */}
      <mesh material={bodyMaterial} position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <cylinderGeometry args={[R, R, WALL_H, 64, 1, true]} />
      </mesh>
      {/* Bottom Bevel & Rim */}
      <mesh material={aluminumMaterial} position={[0, -WALL_H / 2 - 0.07, 0]}>
        <cylinderGeometry args={[R, R * 0.85, 0.14, 64]} />
      </mesh>
      <mesh material={aluminumMaterial} position={[0, -H / 2 + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[R * 0.84, 0.025, 16, 64]} />
      </mesh>
      {/* Top Neck & Lip Rim */}
      <mesh material={aluminumMaterial} position={[0, WALL_H / 2 + 0.07, 0]}>
        <cylinderGeometry args={[R * 0.90, R, 0.14, 64]} />
      </mesh>
      <mesh material={aluminumMaterial} position={[0, H / 2 - 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[R * 0.90, 0.026, 16, 64]} />
      </mesh>
      {/* Lid & Tab */}
      <mesh material={aluminumMaterial} position={[0, H / 2 - 0.035, 0]}>
        <cylinderGeometry args={[R * 0.86, R * 0.86, 0.025, 64]} />
      </mesh>
      <group position={[0, H / 2 - 0.02, 0]}>
        <mesh material={aluminumMaterial} position={[0, 0.012, 0.10]}>
          <boxGeometry args={[0.15, 0.014, 0.26]} />
        </mesh>
        <mesh material={aluminumMaterial} position={[0, 0.015, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.042, 0.014, 12, 24]} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * EnergyCan:
 * Updates 3D can properties directly inside the useFrame animation loop.
 * Features:
 * - Decoupled hierarchy: outer (world/scroll) -> floatG (idle bob/sway) -> intro (entrance) -> spin (drag/features)
 * - Ultra-lightweight 60/120fps physics loop with zero React re-renders during scrolling
 */
const EnergyCanInner: React.FC<EnergyCanProps> = ({
  product,
  isSelected = false,
  diff = 0,
  isMobile = false,
  isTablet = false,
  onCanClick,
}) => {
  const outerRef = useRef<THREE.Group>(null);
  const floatG = useRef<THREE.Group>(null);
  const intro = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);

  const currentRotY = useRef<number>(0);
  const currentRotX = useRef<number>(0);
  const currentRotZ = useRef<number>(0);
  const currentVelocity = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const dragStartX = useRef<number>(0);
  const dragDeltaRotY = useRef<number>(0);
  const basePos = useRef(
    new THREE.Vector3(
      diff * (isMobile ? 3.4 : isTablet ? 3.15 : 2.95),
      isMobile ? -0.04 : (isSelected ? -0.05 : -0.14),
      isSelected ? 0.15 : -1.45
    )
  );
  const smoothMouse = useRef({ x: 0, y: 0, rotX: 0, rotY: 0, rotZ: 0 });
  const hasIntroRunRef = useRef(false);

  // Initial load entrance animation (GSAP) - only runs once on initial hero load for the selected can
  useEffect(() => {
    if (!intro.current) return;
    if (!isSelected || hasIntroRunRef.current || hasIntroLoaded()) {
      if (intro.current) {
        intro.current.position.y = 0;
        intro.current.rotation.y = 0;
        intro.current.scale.set(1, 1, 1);
      }
      return;
    }
    hasIntroRunRef.current = true;
    const prefersReduced = _prefersReducedMotion;
    if (prefersReduced) return;

    const tween = gsap.fromTo(
      intro.current.position,
      { y: -1.2 },
      { y: 0, duration: 1.8, ease: 'expo.out', delay: 0.2 }
    );
    const rotTween = gsap.fromTo(
      intro.current.rotation,
      { y: -1.4 },
      { y: 0, duration: 2.2, ease: 'expo.out', delay: 0.2 }
    );
    const scaleTween = gsap.fromTo(
      intro.current.scale,
      { x: 0.75, y: 0.75, z: 0.75 },
      { x: 1, y: 1, z: 1, duration: 1.8, ease: 'expo.out', delay: 0.2 }
    );

    return () => {
      tween.kill();
      rotTween.kill();
      scaleTween.kill();
    };
  }, [isSelected]);

  // Pure GPU-driven physics & trajectory loop - runs at native display refresh rate
  useFrame((state, delta) => {
    if (!outerRef.current) return;

    const sp = animationState.scrollProgress;
    const prefersReducedMotion = _prefersReducedMotion;
    const t = state.clock.elapsedTime;

    // ── 1. Hero to Detail travel (0.03 -> 0.13) ──
    const tHeroToDetail = THREE.MathUtils.clamp((sp - 0.03) / 0.10, 0, 1);
    const easeH2D = tHeroToDetail * tHeroToDetail * (3 - 2 * tHeroToDetail);

    // ── 2. Details phase progress (0.12 -> 0.40) ──
    const pDetails = THREE.MathUtils.clamp((sp - 0.12) / 0.28, 0, 1);

    // ── 3. Details to Statement travel (0.39 -> 0.46) ──
    const tDetailToStmt = THREE.MathUtils.clamp((sp - 0.39) / 0.07, 0, 1);
    const easeD2S =
      tDetailToStmt *
      tDetailToStmt *
      tDetailToStmt *
      (tDetailToStmt * (tDetailToStmt * 6 - 15) + 10);

    // ── 4. Statement exit & entry across SubFooter transition (0.76 <-> 0.85) ──
    const tExit = THREE.MathUtils.clamp((sp - 0.76) / 0.09, 0, 1);
    const easeExit = tExit * tExit * (3 - 2 * tExit);

    const isSmall = isMobile || isTablet;

    // Hero coordinates (perfectly centered, balanced vertical spacing, upright posture)
    const heroSpread = isMobile ? 3.4 : isTablet ? 3.15 : 2.95;
    const heroX = diff * heroSpread;
    // On small screen, keep Y level identical so can transitions horizontally from left/right with zero vertical hop
    const heroY = isMobile ? -0.04 : isTablet ? -0.05 : (isSelected ? -0.05 : -0.14);
    const heroZ = isSelected ? 0.15 : -1.45;
    const heroScale = isSelected ? (isMobile ? 0.82 : isTablet ? 0.78 : 0.94) : (isMobile ? 0.50 : 0.56);
    const heroOpacity = isSelected ? 1.0 : (isSmall ? Math.max(0, 1 - Math.abs(diff) * 1.25) : 0.85);

    // Upright center can (heroRotZ = 0) perfectly concentric with upper fixture & lower podium
    const heroRotX = isSelected ? 0.04 : diff < 0 ? 0.06 : -0.02;
    const heroRotY = isSelected ? 0 : diff < 0 ? 0.20 : -0.20;
    const heroRotZ = isSelected ? 0.0 : diff < 0 ? -0.14 : 0.14;

    let targetX = heroX;
    let targetY = heroY;
    let targetZ = heroZ;
    let targetScale = heroScale;
    let targetRotX = heroRotX;
    let targetRotY = heroRotY;
    let targetRotZ = heroRotZ;
    let targetOpacity = heroOpacity;

    if (isSelected) {
      // In Details section:
      // Mobile and Tablet: can at middle (x = 0), vertically positioned above the bottom text
      // Desktop (lg+): can on right (x = 1.02)
      const detailX = isSmall ? 0 : 1.02;
      const detailY = isSmall ? 0.425 : -0.02;
      const detailScale = isSmall ? 0.63 : 0.96;
      const detailZ = isSmall ? 0.20 : 0.25;

      targetX = THREE.MathUtils.lerp(0, detailX, easeH2D);
      targetY = THREE.MathUtils.lerp(heroY, detailY, easeH2D);
      targetZ = THREE.MathUtils.lerp(heroZ, detailZ, easeH2D);
      targetScale = THREE.MathUtils.lerp(heroScale, detailScale, easeH2D);

      targetRotX = THREE.MathUtils.lerp(heroRotX, isSmall ? -0.04 : -0.09, easeH2D);
      targetRotZ = THREE.MathUtils.lerp(heroRotZ, isSmall ? -0.06 : -0.18, easeH2D);
      targetRotY = THREE.MathUtils.lerp(heroRotY, Math.PI * 1.5, easeH2D);

      // In Statement section:
      // Mobile and Tablet: in middle (x = 0), vertically centered above bottom text, scaled responsively!
      // Desktop: centered (x = 0), monumental scale
      const stmtBaseScale = isSmall ? 0.48 : 0.75;
      const stmtY = isSmall ? 0.31 : -0.025;

      if (sp >= 0.12 && sp < 0.39) {
        const detailOscDamp = 1 - THREE.MathUtils.clamp((sp - 0.34) / 0.05, 0, 1);
        targetX = detailX;
        targetScale = detailScale;
        targetZ = detailZ;
        targetRotY = Math.PI * 1.5 + pDetails * (Math.PI * 2.5);
        targetRotZ =
          (isSmall ? -0.06 : -0.18) +
          Math.sin(pDetails * Math.PI * 3.2) * (isSmall ? 0.04 : 0.08) * detailOscDamp;
        targetRotX =
          (isSmall ? -0.04 : -0.09) +
          Math.cos(pDetails * Math.PI * 2.2) * 0.04 * detailOscDamp;
        targetY = detailY + Math.sin(pDetails * Math.PI * 3.6) * 0.025 * detailOscDamp;
      } else if (sp >= 0.39 && sp < 0.46) {
        targetX = THREE.MathUtils.lerp(detailX, 0, easeD2S);
        targetY = THREE.MathUtils.lerp(detailY, stmtY, easeD2S);
        targetZ = THREE.MathUtils.lerp(detailZ, 0.22, easeD2S);
        targetScale = THREE.MathUtils.lerp(detailScale, stmtBaseScale, easeD2S);
        targetRotX = THREE.MathUtils.lerp(isSmall ? -0.04 : -0.09, 0.02, easeD2S);
        targetRotZ = THREE.MathUtils.lerp(isSmall ? -0.06 : -0.18, 0.0, easeD2S);
        targetRotY = THREE.MathUtils.lerp(Math.PI * 4.0, Math.PI * 6.0, easeD2S);
      } else if (sp >= 0.46 && tExit === 0) {
        targetRotY = Math.PI * 6.0;
        targetRotX = 0.02;
        targetRotZ = 0.0;
        targetX = 0;
        targetY = stmtY;
        targetZ = 0.22;
        targetScale = stmtBaseScale;
      } else if (tExit > 0) {
        // Smooth cinematic ascension & descent across SubFooter transition
        targetX = 0;
        targetY = THREE.MathUtils.lerp(stmtY, 3.2, easeExit);
        targetZ = THREE.MathUtils.lerp(0.22, -0.6, easeExit);
        targetRotX = THREE.MathUtils.lerp(0.02, 0.12, easeExit);
        targetRotY = Math.PI * 6.0 + easeExit * Math.PI * 0.6;
        targetScale = THREE.MathUtils.lerp(stmtBaseScale, stmtBaseScale * 0.85, easeExit);
        targetOpacity = Math.max(0, 1 - easeExit * 1.15);
      }
    } else {
      const exitX = diff < 0 ? (isSmall ? -6.5 : -8.5) : isSmall ? 6.5 : 8.5;
      targetX = THREE.MathUtils.lerp(heroX, exitX, easeH2D);
      targetZ = THREE.MathUtils.lerp(heroZ, -4, easeH2D);
      targetOpacity = Math.max(0, heroOpacity * (1 - easeH2D * 1.5));
    }

    // Velocity & drag delta rotation
    const rv = animationState.rotationVelocity * (isSelected ? 1.0 : 0.4);
    currentVelocity.current = THREE.MathUtils.damp(currentVelocity.current, rv, 4.5, delta);

    if (!isDragging.current) {
      dragDeltaRotY.current = THREE.MathUtils.damp(dragDeltaRotY.current, 0, 5.0, delta);
    }

    const finalRotY =
      targetRotY +
      (isSelected ? currentVelocity.current : 0) +
      dragDeltaRotY.current;

    // Smooth base position interpolation
    const posSpeed = Math.min(1, delta * (isMobile ? 11.5 : 9.5));
    basePos.current.x = THREE.MathUtils.lerp(basePos.current.x, targetX, posSpeed);
    basePos.current.y = THREE.MathUtils.lerp(basePos.current.y, targetY, posSpeed);
    basePos.current.z = THREE.MathUtils.lerp(basePos.current.z, targetZ, posSpeed);

    currentRotX.current = THREE.MathUtils.lerp(currentRotX.current, targetRotX, posSpeed);
    currentRotY.current = THREE.MathUtils.lerp(currentRotY.current, finalRotY, posSpeed);
    currentRotZ.current = THREE.MathUtils.lerp(currentRotZ.current, targetRotZ, posSpeed);

    // Subtle idle life bob and sway (layered on floatG without affecting base coordinates)
    if (floatG.current && !prefersReducedMotion) {
      const bobDamp = sp > 0.12 && sp < 0.42 ? 0.35 : 1.0;
      floatG.current.position.y = Math.sin(t * 0.9) * 0.035 * bobDamp;
      floatG.current.rotation.y = Math.sin(t * 0.45) * 0.06 * bobDamp;
      // Keep selected can upright in hero phase (no sideways rocking)
      floatG.current.rotation.z =
        isSelected && sp < 0.06 ? 0 : Math.sin(t * 0.6) * 0.015 * bobDamp;
    }

    // Statement phase mouse interaction
    if (isSelected && !prefersReducedMotion && !animationState.isMobile) {
      const mouseSpeed = Math.min(1, delta * 6.0);
      if (sp >= 0.46 && sp < 0.74) {
        const mouseInfluence = Math.min(1, (sp - 0.46) / 0.05);
        const mx = animationState.mouseX;
        const my = animationState.mouseY;
        smoothMouse.current.x = THREE.MathUtils.lerp(
          smoothMouse.current.x,
          mx * 0.20 * mouseInfluence,
          mouseSpeed
        );
        smoothMouse.current.y = THREE.MathUtils.lerp(
          smoothMouse.current.y,
          my * 0.14 * mouseInfluence,
          mouseSpeed
        );
        smoothMouse.current.rotY = THREE.MathUtils.lerp(
          smoothMouse.current.rotY,
          mx * 0.42 * mouseInfluence,
          mouseSpeed
        );
        smoothMouse.current.rotX = THREE.MathUtils.lerp(
          smoothMouse.current.rotX,
          -my * 0.22 * mouseInfluence,
          mouseSpeed
        );
        smoothMouse.current.rotZ = THREE.MathUtils.lerp(
          smoothMouse.current.rotZ,
          -mx * 0.08 * mouseInfluence,
          mouseSpeed
        );
      } else {
        const decaySpeed = Math.min(1, delta * 8.0);
        smoothMouse.current.x = THREE.MathUtils.lerp(smoothMouse.current.x, 0, decaySpeed);
        smoothMouse.current.y = THREE.MathUtils.lerp(smoothMouse.current.y, 0, decaySpeed);
        smoothMouse.current.rotY = THREE.MathUtils.lerp(smoothMouse.current.rotY, 0, decaySpeed);
        smoothMouse.current.rotX = THREE.MathUtils.lerp(smoothMouse.current.rotX, 0, decaySpeed);
        smoothMouse.current.rotZ = THREE.MathUtils.lerp(smoothMouse.current.rotZ, 0, decaySpeed);
      }
    }

    // Direct GPU assignment to outer group
    outerRef.current.position.set(
      basePos.current.x + smoothMouse.current.x,
      basePos.current.y + smoothMouse.current.y,
      basePos.current.z
    );
    outerRef.current.rotation.set(
      currentRotX.current + smoothMouse.current.rotX,
      currentRotY.current + smoothMouse.current.rotY,
      currentRotZ.current + smoothMouse.current.rotZ
    );
    outerRef.current.scale.set(targetScale, targetScale, targetScale);
    outerRef.current.visible = targetOpacity > 0.005 && sp < 0.86;
  });

  return (
    <group
      ref={outerRef}
      onClick={(e) => {
        e.stopPropagation();
        onCanClick?.();
      }}
      onPointerDown={(e) => {
        if (
          isSelected &&
          animationState.scrollProgress >= 0.44 &&
          animationState.scrollProgress <= 0.72
        ) {
          e.stopPropagation();
          isDragging.current = true;
          dragStartX.current = e.clientX;
          (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
          document.body.style.cursor = 'grabbing';
        }
      }}
      onPointerMove={(e) => {
        if (isDragging.current) {
          e.stopPropagation();
          const deltaX = (e.clientX - dragStartX.current) * 0.0075;
          dragDeltaRotY.current = deltaX;
        }
      }}
      onPointerUp={(e) => {
        if (isDragging.current) {
          e.stopPropagation();
          isDragging.current = false;
          (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
          document.body.style.cursor = 'grab';
        }
      }}
      onPointerCancel={(e) => {
        if (isDragging.current) {
          isDragging.current = false;
          (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
          document.body.style.cursor = 'auto';
        }
      }}
      onPointerOver={(e) => {
        if (!isSelected) {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        } else if (
          animationState.scrollProgress >= 0.44 &&
          animationState.scrollProgress <= 0.72
        ) {
          document.body.style.cursor = 'grab';
        }
      }}
      onPointerOut={() => {
        if (!isDragging.current) {
          document.body.style.cursor = 'auto';
        }
      }}
    >
      <group ref={floatG}>
        <group ref={intro}>
          <group ref={spin}>
            <React.Suspense
              fallback={<ProceduralCan product={product} isSelected={isSelected} />}
            >
              <RealCanModel product={product} isSelected={isSelected} />
            </React.Suspense>
          </group>
        </group>
      </group>
    </group>
  );
};

export const EnergyCan = React.memo(EnergyCanInner, (prev, next) => {
  return (
    prev.product.id === next.product.id &&
    prev.isSelected === next.isSelected &&
    prev.diff === next.diff &&
    prev.isMobile === next.isMobile &&
    prev.isTablet === next.isTablet
  );
});
