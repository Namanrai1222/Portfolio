'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView, animate, useMotionValue } from 'framer-motion';
import { Database, Target, Layers, BarChart3 } from 'lucide-react';
import { STATS } from '@/lib/constants';
import type { StatItem } from '@/lib/types';

// ─── Animated Counter ────────────────────────────────────────────────────────
function formatStatValue(item: StatItem, value: number) {
  return item.numericValue < 1 ? value.toFixed(2) : Math.floor(value).toString();
}

function StatCounter({ item }: { item: StatItem }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(item.value.replace(item.suffix ?? '', ''));

  useEffect(() => {
    if (!inView) {
      setDisplayValue(item.value.replace(item.suffix ?? '', ''));
      return;
    }
    const controls = animate(count, item.numericValue, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        setDisplayValue(formatStatValue(item, value));
      },
    });
    return () => controls.stop();
  }, [inView, count, item]);

  return (
    <span className="font-mono font-medium" ref={ref}>
      {displayValue}
    </span>
  );
}

// ─── Static icons — replaced 4 animated SVG components (~180 lines)
// with simple Lucide icons. Same meaning, zero animation overhead.
const STAT_ICONS = [Database, Target, Layers, BarChart3];
const STAT_DESCRIPTIONS = [
  'Trained on real news corpus with balanced class distribution.',
  'TF-IDF + Logistic Regression across 40K labeled samples.',
  'D2C brands across Instagram and LinkedIn for Indevaa Studio.',
  'Full-stack: NLP API, Forum platform, SaaS automation system.',
];

// ─── Stats Section ───────────────────────────────────────────────────────────
export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-40px' });

  return (
    <section id="stats" className="section">
      <div className="container-max">

        {/* Header */}
        <div className="mb-12 md:mb-16">
          <motion.span
            className="eyebrow block mb-4"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            By the Numbers
          </motion.span>
          <motion.h2
            className="font-syne font-black text-3xl md:text-4xl lg:text-5xl text-text1 leading-tight tracking-tight max-w-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            Metrics that matter.
          </motion.h2>
        </div>

        {/* Stat cards grid */}
        <motion.div
          ref={containerRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {STATS.map((stat, i) => {
            const Icon = STAT_ICONS[i];
            return (
              <motion.div
                key={stat.label}
                className="flex flex-col justify-between p-5 md:p-7 rounded-2xl border border-border/60 bg-surface/80 relative overflow-hidden group hover:border-accent/20 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
              >
                {/* Subtle corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-accent/8 to-transparent rounded-bl-full pointer-events-none" />

                {/* Icon */}
                <div className="mb-4 md:mb-6">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Icon size={16} className="text-accent" />
                  </div>
                </div>

                {/* Value */}
                <div className="mb-1">
                  <div className="font-syne font-black text-2xl md:text-3xl lg:text-4xl text-text1 leading-none tabular-nums">
                    <StatCounter item={stat} />
                    {stat.suffix && (
                      <span className="text-accent text-xl md:text-2xl">{stat.suffix}</span>
                    )}
                  </div>
                </div>

                {/* Label */}
                <div className="font-mono text-[10px] text-text3 uppercase tracking-widest mb-3">
                  {stat.label}
                </div>

                {/* Description */}
                <p className="font-dm text-xs text-text3 leading-relaxed hidden sm:block">
                  {STAT_DESCRIPTIONS[i]}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
