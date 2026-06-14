'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      autoRaf: false,
    });

    let rafId = 0;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Keep Framer Motion useScroll in sync with Lenis without a parallel RAF loop
    const onLenisScroll = () => {
      window.dispatchEvent(new Event('scroll'));
    };
    lenis.on('scroll', onLenisScroll);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off('scroll', onLenisScroll);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
