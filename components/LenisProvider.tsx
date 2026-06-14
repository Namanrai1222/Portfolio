'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

function initLenis() {
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

  const onLenisScroll = () => {
    window.dispatchEvent(new Event('scroll'));
  };
  lenis.on('scroll', onLenisScroll);

  return () => {
    cancelAnimationFrame(rafId);
    lenis.off('scroll', onLenisScroll);
    lenis.destroy();
  };
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let destroyLenis: (() => void) | undefined;

    const start = () => {
      destroyLenis = initLenis();
    };

    if (document.body.classList.contains('boot-complete')) {
      start();
    } else {
      window.addEventListener('boot-complete', start, { once: true });
    }

    return () => {
      window.removeEventListener('boot-complete', start);
      destroyLenis?.();
    };
  }, []);

  return <>{children}</>;
}
