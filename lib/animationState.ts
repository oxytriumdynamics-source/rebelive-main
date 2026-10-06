/**
 * Module-level shared animation state for high-frequency values.
 *
 * Values that change at 60fps (mouse position, scroll progress, rotation velocity)
 * are stored here instead of React state to avoid triggering React reconciliation.
 *
 * 3D components read from this in useFrame (RAF loop).
 * DOM components read from this via their own RAF loops or at render time.
 *
 * Written from:
 * - page.tsx mouse event handlers (mouseX, mouseY)
 * - page.tsx GSAP scroll animation callbacks (scrollProgress)
 * - page.tsx flavor switch handlers (rotationVelocity)
 * - page.tsx resize handler (isMobile)
 */
export const animationState = {
  /** Normalized mouse X position (-1 to 1, left to right) */
  mouseX: 0,
  /** Normalized mouse Y position (-1 to 1, bottom to top) */
  mouseY: 0,

  /** Current virtual scroll progress (0 = hero, 1 = footer) — updated by GSAP on every tick */
  scrollProgress: 0,

  /** Carousel swipe/click rotation impulse velocity */
  rotationVelocity: 0,

  /** Device type flag (synced from page.tsx resize handler) */
  isMobile: false,
};
