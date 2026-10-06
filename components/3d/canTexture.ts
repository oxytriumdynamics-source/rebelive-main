import * as THREE from 'three';
import { Product } from '../../data/products';

const textureCache: Record<string, THREE.Texture> = {};
let cachedGlowTexture: THREE.CanvasTexture | null = null;

export interface DeviceProfile {
  isMobile: boolean;
  isLowEnd: boolean;
  maxTextureSize: number;
  anisotropy: number;
}

export function getDeviceProfile(): DeviceProfile {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isLowEnd: false,
      maxTextureSize: 2048,
      anisotropy: 8,
    };
  }

  const isMobile =
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return {
    isMobile,
    isLowEnd: false,
    maxTextureSize: 2048,
    anisotropy: 8,
  };
}

/**
 * Creates or retrieves a seamless 360 wrap-around texture for the cylindrical can body.
 * Built for CylinderGeometry with u=0..1 wrapping 360 degrees around the can.
 */
export function getCanTexture(product: Product): THREE.Texture {
  const profile = getDeviceProfile();
  const cacheKey = `${product.id}_wrap_2048_v2`;

  if (textureCache[cacheKey]) {
    return textureCache[cacheKey];
  }

  if (typeof document === 'undefined') {
    const dummy = new THREE.Texture();
    return dummy;
  }

  // High-fidelity 2048x1516 canvas wrap: ultra-sharp text and razor-sharp contour lines on all screens
  const width = 2048;
  const height = 1516;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: false })!;

  // 1. Sleek metallic base fill matching the product identity (instant display before image arrives)
  const baseGrad = ctx.createLinearGradient(0, 0, width, 0);
  if (product.id === 'aviva') {
    baseGrad.addColorStop(0.0, '#f2f2f5');
    baseGrad.addColorStop(0.25, '#ffffff');
    baseGrad.addColorStop(0.5, '#eaeaf0');
    baseGrad.addColorStop(0.75, '#ffffff');
    baseGrad.addColorStop(1.0, '#f2f2f5');
  } else if (product.id === 'capella') {
    baseGrad.addColorStop(0.0, '#0a0d14');
    baseGrad.addColorStop(0.25, '#121824');
    baseGrad.addColorStop(0.5, '#070a10');
    baseGrad.addColorStop(0.75, '#121824');
    baseGrad.addColorStop(1.0, '#0a0d14');
  } else {
    // APEX
    baseGrad.addColorStop(0.0, '#090a0c');
    baseGrad.addColorStop(0.25, '#14161a');
    baseGrad.addColorStop(0.5, '#07080a');
    baseGrad.addColorStop(0.75, '#14161a');
    baseGrad.addColorStop(1.0, '#090a0c');
  }
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = profile.anisotropy;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.flipY = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;

  textureCache[cacheKey] = texture;

  // 2. Load the authentic 360 flat can wrap image and draw cleanly onto the canvas
  if (product.canImage) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      texture.needsUpdate = true;
    };
    img.src = product.canImage;
  }

  return texture;
}

/**
 * Creates a soft radial glow texture for atmospheric lighting behind the can.
 */
export function createRadialGlowTexture(): THREE.CanvasTexture {
  if (cachedGlowTexture) {
    return cachedGlowTexture;
  }

  if (typeof document === 'undefined') {
    return new THREE.CanvasTexture({} as any);
  }

  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d')!;

  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.35)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');

  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  cachedGlowTexture = t;
  return t;
}

/**
 * Fine brushed aluminum normal map for micro surface realism
 */
export function getCanNormalMap(): THREE.CanvasTexture {
  const profile = getDeviceProfile();
  const cacheKey = `normal_map_${profile.maxTextureSize}_v1`;
  if (textureCache[cacheKey]) {
    return textureCache[cacheKey] as THREE.CanvasTexture;
  }

  if (typeof document === 'undefined') {
    return new THREE.CanvasTexture({} as any);
  }

  const SIZE = profile.isLowEnd ? 256 : 512;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d', { willReadFrequently: false })!;

  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, SIZE, SIZE);

  const step = profile.isLowEnd ? 8 : 4;
  for (let y = 0; y < SIZE; y += step) {
    const noise = Math.random() * 8 - 4;
    ctx.fillStyle = `rgb(${128 + noise}, ${128 + noise}, 255)`;
    ctx.fillRect(0, y, SIZE, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = profile.anisotropy;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.flipY = true;
  textureCache[cacheKey] = texture;
  return texture;
}

/**
 * Cleanup helper for disposing textures
 */
export function disposeTextureCache(): void {
  Object.keys(textureCache).forEach((key) => {
    try {
      textureCache[key]?.dispose();
      delete textureCache[key];
    } catch {}
  });
  if (cachedGlowTexture) {
    cachedGlowTexture.dispose();
    cachedGlowTexture = null;
  }
}
