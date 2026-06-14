import type { Variants } from 'framer-motion';
import type { MotionDirection } from './types';

// ─── Fade Up (default reveal) ─────────────────────────────────────────────────
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// ─── Stagger container ────────────────────────────────────────────────────────
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// ─── Individual letter (SplitText hero entrance) ──────────────────────────────
export const letterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 80,
    rotateX: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// ─── Card hover variants ──────────────────────────────────────────────────────
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// ─── Nav reveal ───────────────────────────────────────────────────────────────
export const navVariants: Variants = {
  top: {
    backgroundColor: 'rgba(8,10,15,0)',
    borderBottomColor: 'rgba(28,31,46,0)',
    backdropFilter: 'blur(0px)',
  },
  scrolled: {
    backgroundColor: 'rgba(8,10,15,0.85)',
    borderBottomColor: 'rgba(28,31,46,1)',
    backdropFilter: 'blur(20px)',
  },
};

// ─── Eyebrow badge ────────────────────────────────────────────────────────────
export const eyebrowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── CTA button ───────────────────────────────────────────────────────────────
export const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 1.2 + i * 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

// ─── createScrollReveal factory ───────────────────────────────────────────────
export function createScrollReveal(direction: MotionDirection): Variants {
  const initial: any = { opacity: 0 };

  switch (direction) {
    case 'up':
      initial.y = 40;
      break;
    case 'down':
      initial.y = -40;
      break;
    case 'left':
      initial.x = 40;
      break;
    case 'right':
      initial.x = -40;
      break;
    case 'scale':
      initial.scale = 0.92;
      break;
    case 'clip-up':
      initial.clipPath = 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)';
      initial.y = 35;
      break;
  }

  const animate: any = {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: direction === 'clip-up' ? 0.85 : 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  };

  if (direction === 'clip-up') {
    animate.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
  }

  return {
    hidden: initial,
    visible: animate,
  };
}
