'use client';

import { motion } from 'framer-motion';
import { createScrollReveal } from '@/lib/animations';
import type { ScrollRevealProps } from '@/lib/types';

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  className,
}: ScrollRevealProps) {
  const variants = createScrollReveal(direction);

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
