import { SmokeConfig } from '../types/smoke';

const VERTEX_SHADER = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform float u_time, u_speed, u_scale, u_warp, u_rise, u_swirl, u_contrast, u_softness, u_bgalpha, u_colorCount;
uniform vec2 u_mouse;
uniform float u_mouseAct, u_mouseStr;
uniform vec3 u_bg, u_c0, u_c1, u_c2, u_c3;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.07;
    a *= 0.5;
  }
  return v;
}

vec3 getPaletteColor(float blend) {
  float b = clamp(blend, 0.0, 1.0);
  float count = max(u_colorCount, 1.0);
  if (count <= 1.5) {
    return u_c0;
  }
  float scaled = b * (count - 1.0);
  if (scaled < 1.0) {
    return mix(u_c0, u_c1, scaled);
  } else if (scaled < 2.0) {
    return mix(u_c1, u_c2, scaled - 1.0);
  } else {
    return mix(u_c2, u_c3, min(scaled - 2.0, 1.0));
  }
}

void main() {
  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2 uv = vec2(v_uv.x * aspect, v_uv.y);
  float t = u_time * u_speed;

  // Cursor stir: tight, localized rotational displacement field strictly around the mouse cursor
  float mAmt = u_mouseStr * u_mouseAct;
  vec2 mrel = uv - u_mouse;
  float mr2 = dot(mrel, mrel);
  float stir = exp(-mr2 * 60.0) * mAmt;
  uv += (vec2(-mrel.y, mrel.x) * 1.2 + mrel * 0.3) * stir * 0.7;

  // Swirl around center then rise scroll
  vec2 sp = uv * u_scale;
  vec2 c = vec2(0.5 * aspect, 0.5) * u_scale;
  vec2 rel = sp - c;
  float ang = u_swirl * 0.6 * sin(t * 0.3) * length(rel);
  mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
  sp = c + rot * rel;
  vec2 p = sp + vec2(0.0, -t * u_rise * 0.4);

  // Double domain warp
  vec2 q = vec2(fbm(p + vec2(t * 0.15, 0.0)), fbm(p + vec2(5.2, 1.3) - t * 0.1));
  vec2 r = vec2(fbm(p + u_warp * 2.0 * q + vec2(1.7, 9.2)), fbm(p + u_warp * 2.0 * q + vec2(8.3, 2.8)));
  float v = fbm(p + u_warp * 2.2 * r);
  v = pow(smoothstep(1.0 - u_softness, 1.0, v + 0.35), u_contrast);

  // Pointer wake thins the smoke slightly directly at the cursor core
  v *= 1.0 - 0.25 * exp(-mr2 * 90.0) * mAmt;

  float blendCoord = clamp(q.x + r.y * 0.5, 0.0, 1.0);
  vec3 smoke = getPaletteColor(blendCoord);

  // Baseline monochrome smoke (preserves dark charcoal, slate gray, and crisp white)
  float lum = dot(smoke, vec3(0.299, 0.587, 0.114));
  vec3 monoSmoke = vec3(lum);

  // Keep smoke predominantly dark/gray/white; inject just a gentle touch of color into select moving tendrils
  float colorMask = smoothstep(0.35, 0.58, blendCoord) * (1.0 - smoothstep(0.68, 0.88, blendCoord));
  smoke = mix(monoSmoke, smoke, colorMask * 0.45);

  vec3 col = mix(u_bg, smoke, v);
  float alpha = clamp(max(u_bgalpha, v), 0.0, 1.0);
  gl_FragColor = vec4(col, alpha);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3 || clean.length === 4) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length >= 8) {
    clean = clean.slice(0, 6);
  }
  const intVal = parseInt(clean, 16);
  if (isNaN(intVal)) return [0.2, 0.2, 0.2];
  return [
    ((intVal >> 16) & 255) / 255,
    ((intVal >> 8) & 255) / 255,
    (intVal & 255) / 255,
  ];
}

export function parseAttributes(el: HTMLElement): SmokeConfig {
  const getAttr = (name: string, fallback: string) =>
    el.getAttribute(`data-aifx-${name}`) ?? fallback;

  const colorsRaw = getAttr('colors', '#333333,#888888,#cccccc,#ffffff');
  const colors = colorsRaw
    .split(',')
    .map((c) => c.trim())
    .filter((c) => /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c))
    .slice(0, 4);

  return {
    colors: colors.length > 0 ? colors : ['#333333', '#888888', '#cccccc', '#ffffff'],
    bg: getAttr('bg', '#000000'),
    bgAlpha: parseFloat(getAttr('bg-alpha', '1')),
    speed: parseFloat(getAttr('speed', '0.35')),
    scale: parseFloat(getAttr('scale', '1.4')),
    warp: parseFloat(getAttr('warp', '0.8')),
    rise: parseFloat(getAttr('rise', '0.4')),
    swirl: parseFloat(getAttr('swirl', '0.5')),
    contrast: parseFloat(getAttr('contrast', '1.2')),
    softness: parseFloat(getAttr('softness', '0.7')),
    mouse: parseFloat(getAttr('mouse', '0.7')),
  };
}

export function mountFluidSmoke(container: HTMLElement, initialAttrs?: Partial<SmokeConfig>) {
  // Ensure position relative/absolute logic
  const cs = window.getComputedStyle(container);
  if (cs.position === 'static') {
    container.style.position = 'absolute';
  }
  container.style.overflow = 'hidden';

  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;';

  const gl =
    (canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    }) as WebGLRenderingContext | null) ||
    (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

  if (!gl) {
    const fallback = document.createElement('div');
    fallback.style.cssText =
      'position:absolute;inset:0;background:radial-gradient(ellipse at center, #262626 0%, #000000 100%);opacity:0.9;';
    container.appendChild(fallback);
    return {
      restart() { },
      update() { },
      destroy() {
        fallback.remove();
      },
    };
  }

  function compileShader(type: number, src: string) {
    if (!gl) return null;
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('[aifx] shader compile failed:', gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();

  if (!vs || !fs || !program) {
    return { restart() { }, update() { }, destroy() { } };
  }

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('[aifx] program link failed:', gl.getProgramInfoLog(program));
    return { restart() { }, update() { }, destroy() { } };
  }

  gl.useProgram(program);

  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );

  const aPos = gl.getAttribLocation(program, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const uniformLocs = new Map<string, WebGLUniformLocation | null>();
  function getLoc(name: string): WebGLUniformLocation | null {
    if (!gl) return null;
    if (!uniformLocs.has(name)) {
      uniformLocs.set(name, gl.getUniformLocation(program!, name));
    }
    return uniformLocs.get(name) ?? null;
  }

  function set1f(name: string, val: number) {
    if (!gl) return;
    const loc = getLoc(name);
    if (loc) gl.uniform1f(loc, val);
  }

  function set2f(name: string, x: number, y: number) {
    if (!gl) return;
    const loc = getLoc(name);
    if (loc) gl.uniform2f(loc, x, y);
  }

  function set3f(name: string, x: number, y: number, z: number) {
    if (!gl) return;
    const loc = getLoc(name);
    if (loc) gl.uniform3f(loc, x, y, z);
  }

  function setColor(name: string, hex: string) {
    const [r, g, b] = hexToRgb(hex);
    set3f(name, r, g, b);
  }

  container.appendChild(canvas);

  let currentConfig: SmokeConfig = {
    ...parseAttributes(container),
    ...initialAttrs,
  };

  const checkInteractive = (cfg: SmokeConfig) => cfg.interactive !== false && cfg.mouse > 0;
  let isInteractive = checkInteractive(currentConfig);

  function applyUniforms() {
    if (!gl) return;
    gl.useProgram(program);
    const cols = currentConfig.colors;
    set1f('u_colorCount', cols.length);

    const uniformColorNames = ['u_c0', 'u_c1', 'u_c2', 'u_c3'];
    uniformColorNames.forEach((uName, idx) => {
      const col = cols[Math.min(idx, cols.length - 1)] || '#555555';
      setColor(uName, col);
    });

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setColor('u_bg', currentConfig.bg);
    set1f('u_bgalpha', currentConfig.bgAlpha);
    set1f('u_speed', prefersReducedMotion ? 0.02 : currentConfig.speed);
    set1f('u_scale', currentConfig.scale);
    set1f('u_warp', prefersReducedMotion ? 0.2 : currentConfig.warp);
    set1f('u_rise', prefersReducedMotion ? 0.05 : currentConfig.rise);
    set1f('u_swirl', prefersReducedMotion ? 0.1 : currentConfig.swirl);
    set1f('u_contrast', currentConfig.contrast);
    set1f('u_softness', currentConfig.softness);
    set1f('u_mouseStr', prefersReducedMotion ? 0.0 : (isInteractive ? currentConfig.mouse : 0.0));
  }

  applyUniforms();

  function resize() {
    if (!gl || !canvas) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    // Efficient DPR for soft background smoke: drops fragment load by 75%+ while looking identical
    const maxDpr = isMobile ? 0.40 : 0.55;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const maxW = isMobile ? 480 : 840;
    const maxH = isMobile ? 720 : 960;
    const w = Math.min(maxW, Math.max(1, Math.round(container.clientWidth * dpr)));
    const h = Math.min(maxH, Math.max(1, Math.round(container.clientHeight * dpr)));

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      set2f('u_res', w, h);
    }
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Pointer move interaction with dampening
  let targetMouseX = 0.5;
  let targetMouseY = 0.5;
  let currMouseX = 0.5;
  let currMouseY = 0.5;
  let mouseActivity = 0.0;
  let lastMoveTime = -1e9;
  let pointerListening = false;

  const onPointerMove = (e: PointerEvent) => {
    if (!isInteractive) return;
    const rect = container.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    targetMouseX = (e.clientX - rect.left) / rect.width;
    targetMouseY = (e.clientY - rect.top) / rect.height;
    lastMoveTime = performance.now();
  };

  const syncPointerListener = () => {
    if (isInteractive && !pointerListening) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      pointerListening = true;
    } else if (!isInteractive && pointerListening) {
      window.removeEventListener('pointermove', onPointerMove);
      pointerListening = false;
      mouseActivity = 0.0;
      targetMouseX = 0.5;
      targetMouseY = 0.5;
      currMouseX = 0.5;
      currMouseY = 0.5;
    }
  };

  syncPointerListener();

  let rafId = 0;
  let isVisible = true;
  let startTime = performance.now();
  let lastFrameTime = 0;

  // Frame pacing: background smoke moves slowly, so ~30fps on mobile and ~35fps on desktop saves massive GPU power
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const frameInterval = isMobile ? 34 : 28;

  function animate(timestamp: number) {
    if (!isVisible) return;
    rafId = requestAnimationFrame(animate);

    if (timestamp - lastFrameTime < frameInterval) {
      return;
    }
    lastFrameTime = timestamp;

    const now = performance.now();
    const elapsedSec = (now - startTime) / 1000;

    if (isInteractive) {
      // Responsive cursor tracking keeps the effect tightly under the mouse cursor
      currMouseX += (targetMouseX - currMouseX) * 0.16;
      currMouseY += (targetMouseY - currMouseY) * 0.16;

      const isActive = now - lastMoveTime < 1200 ? 1 : 0;
      mouseActivity += (isActive - mouseActivity) * 0.08;
    } else {
      mouseActivity = 0.0;
      currMouseX = 0.5;
      currMouseY = 0.5;
    }

    const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    set2f('u_mouse', currMouseX * aspect, 1.0 - currMouseY);
    set1f('u_mouseAct', mouseActivity);
    set1f('u_time', elapsedSec);

    if (gl) {
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }

  rafId = requestAnimationFrame(animate);

  // Pause rendering when tab is in background to preserve battery and CPU/GPU
  const onVisibilityChange = () => {
    if (document.hidden) {
      isVisible = false;
      cancelAnimationFrame(rafId);
    } else {
      isVisible = true;
      startTime = performance.now();
      lastFrameTime = 0;
      rafId = requestAnimationFrame(animate);
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  const io =
    typeof IntersectionObserver === 'function'
      ? new IntersectionObserver((entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible && !isVisible) {
          isVisible = true;
          rafId = requestAnimationFrame(animate);
        } else if (!visible && isVisible) {
          isVisible = false;
          cancelAnimationFrame(rafId);
        }
      })
      : null;

  if (io) io.observe(container);

  const ro =
    typeof ResizeObserver === 'function'
      ? new ResizeObserver(() => resize())
      : null;

  if (ro) ro.observe(container);

  return {
    restart() {
      startTime = performance.now();
      lastMoveTime = -1e9;
      mouseActivity = 0.0;
    },
    update(attrs: Partial<SmokeConfig> | Record<string, string>) {
      if ('colors' in attrs && Array.isArray(attrs.colors)) {
        currentConfig = { ...currentConfig, ...(attrs as Partial<SmokeConfig>) };
      } else {
        const parsed = parseAttributes(container);
        currentConfig = { ...currentConfig, ...parsed, ...(attrs as Partial<SmokeConfig>) };
      }
      isInteractive = checkInteractive(currentConfig);
      syncPointerListener();
      applyUniforms();
    },
    destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (pointerListening) {
        window.removeEventListener('pointermove', onPointerMove);
        pointerListening = false;
      }
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      canvas.remove();
      try {
        const loseExt = gl?.getExtension('WEBGL_lose_context');
        loseExt?.loseContext();
      } catch {
        // ignore
      }
    },
  };
}

// Auto-register with AIDesigner window.AIFX if available
if (typeof window !== 'undefined') {
  if (!window.AIFX) {
    window.AIFX = {
      register(slug, mod) {
        (window as any).__AIFX_REGISTRY__ = (window as any).__AIFX_REGISTRY__ || new Map();
        (window as any).__AIFX_REGISTRY__.set(slug, mod);
      },
      rescan() {
        document.querySelectorAll<HTMLElement>('[data-aifx="fluid-smoke"]').forEach((el) => {
          if (!(el as any).__aifx_instance__) {
            (el as any).__aifx_instance__ = mountFluidSmoke(el);
          }
        });
      },
    };
  }
  window.AIFX.register('fluid-smoke', {
    mount(el, attrs) {
      return mountFluidSmoke(el, attrs as any);
    },
  });
}
