'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, animate, useMotionValue } from 'framer-motion';
import { STATS } from '@/lib/constants';
import type { StatItem } from '@/lib/types';

function StatCounter({ item }: { item: StatItem }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;

    const controls = animate(count, item.numericValue, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        if (!ref.current) return;
        const formatted =
          item.numericValue < 1
            ? value.toFixed(2)
            : Math.floor(value).toString();
        ref.current.textContent = formatted;
      },
    });

    return () => controls.stop();
  }, [inView, count, item.numericValue]);

  return (
    <span className="font-mono font-medium" ref={ref}>
      0
    </span>
  );
}

// ─── SVG Graphic 1: Batch Bars (Training Samples) ──────────────────────────
function BatchBarsGraphic({ active }: { active: boolean }) {
  const barHeights = [24, 38, 18, 48, 30, 42, 28];
  return (
    <svg className="w-16 h-12 text-accent" viewBox="0 0 80 50" fill="none">
      {barHeights.map((h, i) => (
        <motion.rect
          key={i}
          x={4 + i * 10}
          y={50 - h}
          width={6}
          height={h}
          rx={2}
          fill="currentColor"
          className="opacity-30"
          initial={{ height: 0, y: 50 }}
          animate={active ? { height: h, y: 50 - h } : {}}
          transition={{
            delay: i * 0.1,
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
      {/* Active scanning bar */}
      <motion.line
        x1="0"
        y1="0"
        x2="0"
        y2="50"
        stroke="#6EE7B7"
        strokeWidth="1.5"
        className="opacity-80"
        initial={{ x: 0 }}
        animate={active ? { x: 80 } : {}}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'easeInOut',
        }}
      />
    </svg>
  );
}

// ─── SVG Graphic 2: Gauge (F1-Score) ─────────────────────────────────────────
function GaugeGraphic({ active }: { active: boolean }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (94 / 100) * circumference;

  return (
    <svg className="w-12 h-12 text-accent2 -rotate-90" viewBox="0 0 50 50" fill="none">
      {/* Background track */}
      <circle
        cx="25"
        cy="25"
        r={radius}
        stroke="rgba(129, 140, 248, 0.15)"
        strokeWidth="3.5"
      />
      {/* Active Fill */}
      <motion.circle
        cx="25"
        cy="25"
        r={radius}
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={active ? { strokeDashoffset: strokeOffset } : {}}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.2 }}
      />
    </svg>
  );
}

// ─── SVG Graphic 3: Network Nodes (Brands Managed) ───────────────────────────
function NetworkGraphic({ active }: { active: boolean }) {
  const nodes = [
    { x: 30, y: 15 },
    { x: 15, y: 35 },
    { x: 45, y: 35 },
    { x: 50, y: 15 },
    { x: 10, y: 15 },
  ];

  return (
    <svg className="w-14 h-12 text-accent3" viewBox="0 0 60 50" fill="none">
      {/* Central node */}
      <circle cx="30" cy="28" r="4.5" fill="currentColor" />
      {/* Connecting lines */}
      {nodes.map((node, i) => (
        <motion.line
          key={i}
          x1="30"
          y1="28"
          x2={node.x}
          y2={node.y}
          stroke="currentColor"
          strokeWidth="1.5"
          className="opacity-20"
          initial={{ x2: 30, y2: 28 }}
          animate={active ? { x2: node.x, y2: node.y } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
        />
      ))}
      {/* Outer nodes */}
      {nodes.map((node, i) => (
        <motion.circle
          key={i}
          cx={node.x}
          cy={node.y}
          r="3"
          fill="currentColor"
          className="opacity-70"
          initial={{ scale: 0 }}
          animate={active ? { scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 300, delay: 0.4 + i * 0.08 }}
        />
      ))}
    </svg>
  );
}

// ─── SVG Graphic 4: Stack Layers (Full-stack apps) ───────────────────────────
function StackGraphic({ active }: { active: boolean }) {
  return (
    <svg className="w-12 h-12 text-accent" viewBox="0 0 50 50" fill="none">
      {/* Layer 3 (Top - Frontend) */}
      <motion.path
        d="M10 20 L25 13 L40 20 L25 27 Z"
        fill="currentColor"
        className="opacity-80"
        initial={{ y: -15, opacity: 0 }}
        animate={active ? { y: 0, opacity: 0.8 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
      />
      {/* Layer 2 (Middle - API) */}
      <motion.path
        d="M10 28 L25 21 L40 28 L25 35 Z"
        fill="currentColor"
        className="opacity-40"
        initial={{ y: -10, opacity: 0 }}
        animate={active ? { y: 0, opacity: 0.4 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
      />
      {/* Layer 1 (Bottom - Database) */}
      <motion.path
        d="M10 36 L25 29 L40 36 L25 43 Z"
        fill="currentColor"
        className="opacity-15"
        initial={{ y: -5, opacity: 0 }}
        animate={active ? { y: 0, opacity: 0.15 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
      />
    </svg>
  );
}

export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <section className="py-20 border-y border-border/40 bg-surface/10 relative overflow-hidden">
      {/* Behind details */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(28,31,46,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(28,31,46,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="container-max relative">
        <motion.div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col justify-between p-6 md:p-8 rounded-2xl border border-border/60 bg-surface/50 backdrop-blur-md relative overflow-hidden group hover:border-border transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              {/* Inner glowing corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/5 via-transparent to-transparent rounded-bl-full pointer-events-none group-hover:from-accent/10 transition-all duration-300" />

              {/* Graphic Row */}
              <div className="flex justify-between items-start mb-8">
                {i === 0 && <BatchBarsGraphic active={inView} />}
                {i === 1 && <GaugeGraphic active={inView} />}
                {i === 2 && <NetworkGraphic active={inView} />}
                {i === 3 && <StackGraphic active={inView} />}
                
                <span className="font-mono text-[10px] text-text3 group-hover:text-text2 transition-colors">
                  METRIC_0{i + 1}
                </span>
              </div>

              {/* Data block */}
              <div>
                <div
                  className="font-syne font-black text-text1 leading-none mb-3 flex items-baseline select-none"
                  style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
                >
                  <span className="text-text1">{stat.prefix}</span>
                  <StatCounter item={stat} />
                  <span className="text-accent font-semibold text-2xl ml-0.5">{stat.suffix}</span>
                </div>

                <p className="font-mono text-[11px] text-text2 tracking-wider uppercase leading-snug">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
