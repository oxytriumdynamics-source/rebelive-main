/**
 * Web Audio API synthesizer for tactile futuristic UI sounds
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private lastClickTime: number = 0;
  private lastIntroTime: number = 0;
  private lastOutroTime: number = 0;
  private lastFeatureTime: number = 0;
  private lastStatementTime: number = 0;

  // Real audio assets from public/brand/aud/
  private clickBuffer: AudioBuffer | null = null;
  private transBuffer: AudioBuffer | null = null;
  private clickAudio: HTMLAudioElement | null = null;
  private transAudio: HTMLAudioElement | null = null;
  private isPreloading: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const schedulePreload = () => {
        if ('requestIdleCallback' in window) {
          (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => this.preloadAssets());
        } else {
          setTimeout(() => this.preloadAssets(), 150);
        }
      };

      if (document.readyState === 'complete') {
        schedulePreload();
      } else {
        window.addEventListener('load', schedulePreload, { once: true });
      }

      // Unlock and initialize on first user gesture
      const unlockHandler = () => {
        ['click', 'touchstart', 'keydown', 'scroll'].forEach((evt) => {
          window.removeEventListener(evt, unlockHandler);
        });
        this.unlockAudio();
      };
      ['click', 'touchstart', 'keydown', 'scroll'].forEach((evt) => {
        window.addEventListener(evt, unlockHandler, { once: true, passive: true });
      });
    }
  }

  private preloadAssets() {
    if (this.isPreloading || typeof window === 'undefined') return;
    this.isPreloading = true;

    // Instant HTML5 Audio fallback preloading
    try {
      this.clickAudio = new Audio('/brand/aud/click.mp3');
      this.clickAudio.preload = 'auto';
      this.transAudio = new Audio('/brand/aud/trans.mp3');
      this.transAudio.preload = 'auto';
    } catch {
      // Audio prefetch not permitted
    }

    // Decode into Web Audio API buffers for zero-latency, glitch-free triggers
    const fetchAndDecode = async (url: string, fallbackUrl: string): Promise<AudioBuffer | null> => {
      try {
        let res = await fetch(url).catch(() => null);
        if (!res || !res.ok) {
          res = await fetch(fallbackUrl).catch(() => null);
        }
        if (!res || !res.ok) return null;

        const arrayBuf = await res.arrayBuffer();
        const ctx = this.getContext();
        if (!ctx) return null;
        return await ctx.decodeAudioData(arrayBuf);
      } catch {
        return null;
      }
    };

    const loadBuffers = () => {
      const ctx = this.getContext();
      if (!ctx) return;
      if (!this.clickBuffer) {
        fetchAndDecode('/brand/aud/click.mp3', '/aud/click.mp3').then((buf) => {
          if (buf) this.clickBuffer = buf;
        });
      }
      if (!this.transBuffer) {
        fetchAndDecode('/brand/aud/trans.mp3', '/aud/trans.mp3').then((buf) => {
          if (buf) this.transBuffer = buf;
        });
      }
    };

    if (this.ctx && this.ctx.state === 'running') {
      loadBuffers();
    } else {
      const onResume = () => {
        loadBuffers();
      };
      window.addEventListener('click', onResume, { once: true, passive: true });
      window.addEventListener('touchstart', onResume, { once: true, passive: true });
    }
  }

  private playBuffer(buffer: AudioBuffer, volume = 1.0, playbackRate = 1.0): boolean {
    if (this.muted) return false;
    const ctx = this.getContext();
    if (!ctx) return false;
    try {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.setValueAtTime(playbackRate, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);

      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(0);
      return true;
    } catch {
      return false;
    }
  }

  private getContext(): AudioContext | null {
    if (this.muted) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private noiseBuffer: AudioBuffer | null = null;

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === ctx.sampleRate) {
      return this.noiseBuffer;
    }
    // Pre-render 1.5 seconds of organic pink/brown noise for authentic aerodynamic air textures
    const bufferSize = Math.floor(ctx.sampleRate * 1.5);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0.0, b1 = 0.0, b2 = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2 + white * 0.25) * 0.45;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  public unlockAudio() {
    this.getContext();
    this.preloadAssets();
  }

  private listeners: Set<(enabled: boolean) => void> = new Set();

  public subscribe(cb: (enabled: boolean) => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb(!this.muted);
      } catch {}
    });
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    this.notify();
    return this.muted;
  }

  public setMuted(val: boolean) {
    this.muted = val;
    this.notify();
  }

  public toggleAmbient(): boolean {
    this.muted = !this.muted;
    this.notify();
    return !this.muted;
  }

  /**
   * Tactile Click: Uses public/brand/aud/click.mp3
   */
  public playClick(pitch: number = 800) {
    if (this.muted) return;
    const now = Date.now();
    if (now - this.lastClickTime < 40) return;
    this.lastClickTime = now;

    // 1. Instant zero-latency Web Audio Buffer source
    if (this.clickBuffer) {
      const rate = Math.max(0.85, Math.min(1.25, pitch / 800));
      if (this.playBuffer(this.clickBuffer, 0.75, rate)) return;
    }

    // 2. HTML5 Audio instant playback
    if (this.clickAudio) {
      try {
        const clone = this.clickAudio.cloneNode() as HTMLAudioElement;
        clone.volume = 0.75;
        clone.play().catch(() => {});
        return;
      } catch {
        // Fall through to procedural
      }
    }

    // 3. Fallback: acoustic physical transient
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const audioNow = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch * 0.55, audioNow);
      osc.frequency.exponentialRampToValueAtTime(140, audioNow + 0.018);

      gain.gain.setValueAtTime(0.045, audioNow);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 0.022);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(audioNow);
      osc.stop(audioNow + 0.025);
    } catch {
      // Audio not permitted yet
    }
  }

  public playTransition(direction: 'forward' | 'backward' = 'forward') {
    if (this.muted) return;
    if (this.transBuffer || this.transAudio) {
      this.playCurtainSlide();
      return;
    }
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Subtle air whoosh
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(ctx);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(1.8, now);

      const startF = direction === 'forward' ? 240 : 480;
      const endF = direction === 'forward' ? 520 : 220;
      filter.frequency.setValueAtTime(startF, now);
      filter.frequency.exponentialRampToValueAtTime(endF, now + 0.14);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.17);
    } catch {
      // Audio not permitted yet
    }
  }

  public playDeepChime() {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(82, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio not permitted yet
    }
  }

  /**
   * Details Page Can Transition Sound:
   * Uses public/brand/aud/trans.mp3
   */
  public playCurtainSlide() {
    if (this.muted) return;
    if (Date.now() - this.lastIntroTime < 380) return;
    this.lastIntroTime = Date.now();

    // 1. Instant zero-latency Web Audio Buffer source
    if (this.transBuffer) {
      if (this.playBuffer(this.transBuffer, 0.85)) return;
    }

    // 2. HTML5 Audio instant playback
    if (this.transAudio) {
      try {
        this.transAudio.currentTime = 0;
        this.transAudio.volume = 0.85;
        this.transAudio.play().catch(() => {});
        return;
      } catch {
        // Fall through to procedural
      }
    }

    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // ── Layer 1: Billowing Fabric Air Rush (The body of the sliding curtain) ──
      const airNoise = ctx.createBufferSource();
      airNoise.buffer = this.getNoiseBuffer(ctx);

      const airFilter = ctx.createBiquadFilter();
      airFilter.type = 'bandpass';
      airFilter.Q.setValueAtTime(1.15, now);
      // Gentle air swell curve matching the physical motion of curtains parting
      airFilter.frequency.setValueAtTime(280, now);
      airFilter.frequency.exponentialRampToValueAtTime(880, now + 0.20);
      airFilter.frequency.exponentialRampToValueAtTime(360, now + 0.50);

      const airGain = ctx.createGain();
      airGain.gain.setValueAtTime(0.0001, now);
      airGain.gain.linearRampToValueAtTime(0.075, now + 0.08); // gentle 80ms attack
      airGain.gain.setValueAtTime(0.075, now + 0.22);         // sustained slide
      airGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.54); // smooth air release

      airNoise.connect(airFilter);
      airFilter.connect(airGain);
      airGain.connect(ctx.destination);
      airNoise.start(now);
      airNoise.stop(now + 0.56);

      // ── Layer 2: Silky Curtain Rail & Ring Friction (High-frequency whisper) ──
      const railNoise = ctx.createBufferSource();
      railNoise.buffer = this.getNoiseBuffer(ctx);

      const railFilter = ctx.createBiquadFilter();
      railFilter.type = 'bandpass';
      railFilter.Q.setValueAtTime(2.2, now);
      railFilter.frequency.setValueAtTime(2200, now);
      railFilter.frequency.linearRampToValueAtTime(2900, now + 0.18);
      railFilter.frequency.linearRampToValueAtTime(1800, now + 0.44);

      const railGain = ctx.createGain();
      railGain.gain.setValueAtTime(0.0001, now);
      railGain.gain.linearRampToValueAtTime(0.036, now + 0.06);
      railGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.46);

      railNoise.connect(railFilter);
      railFilter.connect(railGain);
      railGain.connect(ctx.destination);
      railNoise.start(now);
      railNoise.stop(now + 0.48);

      // ── Layer 3: Soft Low Air Breath (Warm acoustic draft) ──
      const draftNoise = ctx.createBufferSource();
      draftNoise.buffer = this.getNoiseBuffer(ctx);

      const draftFilter = ctx.createBiquadFilter();
      draftFilter.type = 'lowpass';
      draftFilter.frequency.setValueAtTime(260, now);

      const draftGain = ctx.createGain();
      draftGain.gain.setValueAtTime(0.0001, now);
      draftGain.gain.linearRampToValueAtTime(0.040, now + 0.10);
      draftGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

      draftNoise.connect(draftFilter);
      draftFilter.connect(draftGain);
      draftGain.connect(ctx.destination);
      draftNoise.start(now);
      draftNoise.stop(now + 0.50);
    } catch {
      // Audio not permitted yet
    }
  }

  /**
   * Can Intro Sound: delegates to the organic Curtain Slide Air Effect
   */
  public playCanIntro() {
    this.playCurtainSlide();
  }

  /**
   * Can Outro Sound: Atmospheric Dissolve & Depressurize
   * Smooth, velvety high-altitude air release as the 3D can floats into space.
   */
  public playCanOutro() {
    if (this.muted) return;
    if (Date.now() - this.lastOutroTime < 380) return;
    this.lastOutroTime = Date.now();
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Gentle decaying air breath
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(ctx);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(0.9, now);
      filter.frequency.setValueAtTime(620, now);
      filter.frequency.exponentialRampToValueAtTime(140, now + 0.36);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.038, now);
      gain.gain.linearRampToValueAtTime(0.032, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.44);
    } catch {
      // Audio not permitted yet
    }
  }

  /**
   * Feature Transition Sound: Apple-Grade Precision Mechanical Haptic Detent
   * Muted, ultra-short physical tock (18ms) - zero video game synth beeps.
   */
  public playFeatureTransition(featureIdx: number = 0) {
    if (this.muted) return;
    if (Date.now() - this.lastFeatureTime < 200) return;
    this.lastFeatureTime = Date.now();
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Micro-frequency variations feel like precision mechanical gear detents
      const detentPitches = [190, 205, 220, 235];
      const baseFreq = detentPitches[featureIdx % detentPitches.length] || 205;

      // 1. Deep mechanical haptic thump (16ms)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.016);

      gain.gain.setValueAtTime(0.065, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.020);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.022);

      // 2. High-precision click transient (4ms)
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = 'triangle';
      click.frequency.setValueAtTime(1600 + featureIdx * 80, now);
      clickGain.gain.setValueAtTime(0.02, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.006);

      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      click.start(now);
      click.stop(now + 0.008);
    } catch {
      // Audio not permitted yet
    }
  }

  /**
   * Statement Impact: Heavy Cinematic Sub Thud
   * Authoritative IMAX-style acoustic sub impact (ZERO laser pitch sweeps, zero cartoon pings).
   */
  public playStatementImpact(statementIdx: number = 1) {
    if (this.muted) return;
    if (Date.now() - this.lastStatementTime < 300) return;
    this.lastStatementTime = Date.now();
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Cinematic Heavy Sub Impact (Solid 42Hz fundamental)
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(46, now);
      sub.frequency.exponentialRampToValueAtTime(36, now + 0.32);

      subGain.gain.setValueAtTime(0.09, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 0.38);

      // 2. Low acoustic membrane transient (muffled chest hit, 8ms)
      const transient = ctx.createOscillator();
      const transientGain = ctx.createGain();
      transient.type = 'triangle';
      transient.frequency.setValueAtTime(140 + statementIdx * 15, now);
      transient.frequency.exponentialRampToValueAtTime(60, now + 0.015);

      transientGain.gain.setValueAtTime(0.05, now);
      transientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      transient.connect(transientGain);
      transientGain.connect(ctx.destination);
      transient.start(now);
      transient.stop(now + 0.025);
    } catch {
      // Audio not permitted yet
    }
  }
}

export const soundEngine = new SoundEngine();
