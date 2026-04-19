import { useEffect } from 'react';
import Lenis from 'lenis';

// Module-level singleton so any component can access the active lenis instance
let lenisInstance = null;

/**
 * Returns the active Lenis instance (or null if not yet initialised).
 * Use this to call lenis.stop() / lenis.start() from modals/drawers.
 */
export function getLenis() {
  return lenisInstance;
}

export function useLenis() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisInstance = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}
