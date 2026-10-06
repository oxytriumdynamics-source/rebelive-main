export interface SmokeConfig {
  colors: string[];
  bg: string;
  bgAlpha: number;
  speed: number;
  scale: number;
  warp: number;
  rise: number;
  swirl: number;
  contrast: number;
  softness: number;
  mouse: number;
  interactive?: boolean;
}

export interface SmokePreset {
  id: string;
  name: string;
  description: string;
  config: SmokeConfig;
}

export interface AIFXInstance {
  update: (attrs: Partial<SmokeConfig> | Record<string, string>) => void;
  destroy: () => void;
}

export interface AIFXModule {
  mount: (el: HTMLElement, attrs: Record<string, any>) => AIFXInstance;
}

declare global {
  interface Window {
    AIFX?: {
      register: (slug: string, mod: AIFXModule) => void;
      rescan: () => void;
    };
    __AIFX_MAX_DPR__?: number;
    __AIFX_FPS_CAP__?: number;
  }
}

export const SMOKE_PRESETS: SmokePreset[] = [
  {
    id: 'titanium',
    name: 'Titanium Monochrome',
    description: 'Pure monochrome smoke with neutral charcoal, steel gray, and titanium white tendrils',
    config: {
      colors: ['rgb(209 20 20)', 'rgb(209 20 20)', 'rgb(209 20 20)', 'rgb(209 20 20)'],
      bg: '#000000',
      bgAlpha: 1.0,
      speed: 0.35,
      scale: 1.4,
      warp: 0.8,
      rise: 0.4,
      swirl: 0.5,
      contrast: 1.25,
      softness: 0.72,
      mouse: 0,
      interactive: false,
    },
  },
  {
    id: 'apex',
    name: 'Apex Obsidian Smoke',
    description: 'Deep obsidian and smoky charcoal monochrome tendrils',
    config: {
      colors: ['#000000', '#000000', '#000000', '#000000'],
      bg: '#000000',
      bgAlpha: 1.0,
      speed: 0.38,
      scale: 1.35,
      warp: 0.85,
      rise: 0.42,
      swirl: 0.55,
      contrast: 1.3,
      softness: 0.7,
      mouse: 0,
      interactive: false,
    },
  },
  {
    id: 'aviva',
    name: 'Aviva Lychee Mist',
    description: 'Pure ethereal white and cool platinum monochrome haze',
    config: {
      colors: ['#C51616', '#C50000', '#BD1F1F', '#AD1E1E'],
      bg: '#B31C1C',
      bgAlpha: 1.0,
      speed: 0.32,
      scale: 1.45,
      warp: 0.75,
      rise: 0.38,
      swirl: 0.48,
      contrast: 1.2,
      softness: 0.75,
      mouse: 0,
      interactive: false,
    },
  },
  {
    id: 'capella',
    name: 'Capella Midnight Vapor',
    description: 'High-contrast monochrome vapor with deep blacks and stark white wisps',
    config: {
      colors: ['#1e1e1e', '#4f4f4f', '#9a9a9a', '#ffffff'],
      bg: '#000000',
      bgAlpha: 1.0,
      speed: 0.36,
      scale: 1.4,
      warp: 0.82,
      rise: 0.45,
      swirl: 0.52,
      contrast: 1.3,
      softness: 0.68,
      mouse: 0,
      interactive: false,
    },
  },
];
