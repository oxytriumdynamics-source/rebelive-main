/**
 * In-memory flag tracking if the initial loading intro has already been shown in this browser session.
 * - On first page load or hard refresh (F5 / browser reload):
 *   The JS execution context initializes fresh, so this returns false. Loading screen displays once.
 * - On client-side navigation (e.g. clicking "HOME" from shop, auth, profile):
 *   The JS context and window persist, so this returns true. Loading screen does NOT reload.
 */

let introLoaded = false;
type IntroListener = () => void;
const listeners = new Set<IntroListener>();

export function subscribeIntroLoaded(fn: IntroListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function hasIntroLoaded(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    introLoaded ||
    Boolean((window as unknown as { __REBELIVE_INTRO_SHOWN__?: boolean }).__REBELIVE_INTRO_SHOWN__)
  );
}

export function markIntroLoaded(): void {
  introLoaded = true;
  if (typeof window !== 'undefined') {
    (window as unknown as { __REBELIVE_INTRO_SHOWN__?: boolean }).__REBELIVE_INTRO_SHOWN__ = true;
    window.dispatchEvent(new CustomEvent('rebelive:introLoaded'));
  }
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      // safe no-op
    }
  });
}
