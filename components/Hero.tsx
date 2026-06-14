'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowDown, Download } from 'lucide-react';
import { letterVariants, eyebrowVariants, ctaVariants } from '@/lib/animations';
import { CursorHover } from './Cursor';

const ParticleField = dynamic(() => import('./ParticleField'), {
  ssr: false,
  loading: () => null,
});
import { ROLE_TAGS, SOCIAL } from '@/lib/constants';
import { useAchievements } from './AchievementTracker';


// ─── SplitText ───────────────────────────────────────────────────────────────
function SplitText({
  text,
  className,
  staggerOffset = 0,
  ambient = false,
}: {
  text: string;
  className?: string;
  staggerOffset?: number;
  ambient?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <span className={`inline-flex ${ambient ? 'perspective-container' : ''}`} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={letterVariants}
          className={`inline-block ${char === ' ' ? 'mr-[0.25em]' : ''} ${className ?? ''}`}
          aria-hidden="true"
          style={
            ambient && !prefersReducedMotion
              ? {
                  '--float-y': `${-4 - (i % 3) * 2}px`,
                  '--float-dur': `${3.5 + (i % 4) * 0.7}s`,
                  '--float-delay': `${i * 0.05}s`,
                  '--letter-rotate': `${(i % 2 === 0 ? 0.3 : -0.3)}deg`,
                } as React.CSSProperties
              : {}
          }
        >
          <span className={ambient && !prefersReducedMotion ? 'letter-float inline-block' : 'inline-block'}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        </motion.span>
      ))}
    </span>
  );
}

// ─── Orbit Tags ───────────────────────────────────────────────────────────────
function OrbitTags() {
  const orbits = [
    { tag: ROLE_TAGS[0], dur: '6s', radius: '130px', color: 'border-accent/40 text-accent' },
    { tag: ROLE_TAGS[1], dur: '9s', radius: '165px', color: 'border-accent2/40 text-accent2' },
    { tag: ROLE_TAGS[2], dur: '12s', radius: '200px', color: 'border-accent3/40 text-accent3' },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none hidden lg:flex">
      {orbits.map(({ tag, dur, radius, color }) => (
        <div
          key={tag}
          className={`orbit-tag pointer-events-auto px-3 py-1.5 rounded-full border bg-background/80 backdrop-blur-sm font-mono text-xs font-medium transition-all duration-300 hover:scale-105 ${color}`}
          style={
            {
              '--orbit-dur': dur,
              '--orbit-r': radius,
            } as React.CSSProperties
          }
        >
          {tag}
        </div>
      ))}
    </div>
  );
}

// ─── Photo ────────────────────────────────────────────────────────────────────
function HeroPhoto() {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      className="relative w-full max-w-[420px] mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Orbit tags */}
      <OrbitTags />

      {/* Photo container */}
      <motion.div
        className="relative photo-clip overflow-hidden group cursor-pointer"
        initial={{ clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)' }}
        animate={{
          clipPath:
            'polygon(12% 0%, 88% 0%, 100% 12%, 100% 82%, 88% 100%, 12% 100%, 0% 88%, 0% 12%)',
        }}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.2 },
        }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ aspectRatio: '3/4' }}
      >
        {!imgError ? (
          <>
            <Image
              src="/naman.jpg"
              alt="Naman Rai"
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
            {/* Duotone accent overlay - tied to theme color variable */}
            <div
              className="absolute inset-0 bg-accent/25 transition-colors duration-300"
              style={{
                mixBlendMode: 'color',
              }}
            />
            {/* Hover Glitch overlay block */}
            <div className="absolute inset-0 bg-accent3/10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 mix-blend-overlay pointer-events-none" />
          </>
        ) : (
          /* Gradient placeholder when photo is missing */
          <div
            className="absolute inset-0 bg-gradient-to-tr from-accent2 to-accent"
          />
        )}

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/60 to-transparent" />
      </motion.div>

      {/* Decorative glow ring - bound to CSS variables */}
      <div
        className="absolute -inset-4 rounded-full pointer-events-none opacity-30 transition-all duration-300"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, var(--color-accent-glow) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}

// ─── Status List ─────────────────────────────────────────────────────────────
const STATUSES = [
  { text: 'Training Model: naman_v2.5', dotColor: 'bg-accent2' },
  { text: 'Building Indevaa Lead pipelines', dotColor: 'bg-accent' },
  { text: 'Open to DS/ML Internships', dotColor: 'bg-accent3' },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const { unlock } = useAchievements();
  const [statusIdx, setStatusIdx] = useState(0);
  
  useEffect(() => {
    // Start hero animations just before the panel wipe reveals content
    const mountTimer = setTimeout(() => setMounted(true), 2000);

    const onBoot = () => {
      setShowParticles(true);
      setTimeout(() => unlock('welcome'), 500);
    };

    if (document.body.classList.contains('boot-complete')) {
      onBoot();
    } else {
      window.addEventListener('boot-complete', onBoot, { once: true });
    }

    const statusTimer = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % STATUSES.length);
    }, 4000);

    return () => {
      clearTimeout(mountTimer);
      clearInterval(statusTimer);
    };
  }, [unlock]);

  const letterStaggerContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden"
      style={{ paddingTop: '80px' }}
    >
      {/* Ambient particle field — behind everything, deferred until boot completes */}
      {showParticles && (
        <div className="absolute inset-0 hidden lg:block" style={{ zIndex: 0 }}>
          <ParticleField />
        </div>
      )}

      {/* Top-left light source glow */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(ellipse at 0% 0%, rgba(110,231,183,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="container-max relative flex-1 flex flex-col justify-center" style={{ zIndex: 1 }}>
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 lg:gap-0 items-center py-16">
          
          {/* ── Left: Text ── */}
          <div className="flex flex-col justify-center">
            
            {/* Availability badge */}
            <motion.div
              variants={eyebrowVariants}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2.5 mb-10 self-start"
            >
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-border bg-surface text-xs font-mono text-text2 overflow-hidden h-[34px] min-w-[315px] relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={statusIdx}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="flex items-center gap-2 w-full h-full"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${STATUSES[statusIdx].dotColor} pulse-dot`}
                      style={{ flexShrink: 0 }}
                    />
                    {STATUSES[statusIdx].text}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.div>

            {/* Name — giant SplitText */}
            <div className="mb-6" style={{ perspective: '800px' }}>
              <h1 className="font-syne font-black leading-none tracking-tighter text-text1"
                style={{ fontSize: 'clamp(64px, 10vw, 96px)' }}>
                {mounted && (
                  <>
                    <motion.div
                      variants={letterStaggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="block"
                    >
                      <SplitText text="NAMAN" ambient />
                    </motion.div>
                    <motion.div
                      variants={letterStaggerContainer}
                      initial="hidden"
                      animate="visible"
                      transition={{ delayChildren: 0.36 }}
                      className="block"
                    >
                      <SplitText text="RAI" ambient staggerOffset={5} />
                    </motion.div>
                  </>
                )}
              </h1>
            </div>

            {/* Discipline line with strikethrough */}
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-syne font-bold text-xl md:text-2xl text-text2 strike-text">
                Data Science
              </span>
              <span className="text-accent3 font-mono text-sm mt-0.5">×</span>
              <motion.span
                className="font-syne font-bold text-xl md:text-2xl text-accent"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.5, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                Brand Strategy
              </motion.span>
            </motion.div>

            {/* Body copy */}
            <motion.p
              className="font-dm text-body-lg text-text2 max-w-[500px] mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              I build ML pipelines that detect fake news at 94% accuracy and brand systems that make people stop scrolling.
            </motion.p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <motion.div custom={0} variants={ctaVariants} initial="hidden" animate="visible">
                <CursorHover label="WORK">
                  <a
                    href="#work"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent text-background font-dm font-medium text-sm hover:bg-accent/90 transition-all duration-200"
                  >
                    View Work
                  </a>
                </CursorHover>
              </motion.div>

              <motion.div custom={1} variants={ctaVariants} initial="hidden" animate="visible">
                <CursorHover label="CV">
                  <a
                    href={SOCIAL.resume}
                    download="Naman_Rai_CV.pdf"
                    onClick={() => unlock('cv_downloaded')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-border text-text1 font-dm text-sm hover:border-accent/40 hover:text-accent transition-all duration-200"
                  >
                    <Download size={14} />
                    Download CV
                  </a>
                </CursorHover>
              </motion.div>
            </div>

            {/* Social row */}
            <motion.div
              className="flex items-center gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              {[
                { href: SOCIAL.github, icon: Github, label: 'GitHub' },
                { href: SOCIAL.linkedin, icon: Linkedin, label: 'LinkedIn' },
                { href: SOCIAL.email, icon: Mail, label: 'Email' },
              ].map(({ href, icon: Icon, label }) => (
                <CursorHover key={label} label={label.toUpperCase()}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    onClick={() => unlock('social_connect')}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text3 hover:text-accent hover:border-accent/40 transition-all duration-200"
                  >
                    <Icon size={16} />
                  </a>
                </CursorHover>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Photo ── */}
          <div className="flex items-center justify-center lg:justify-end relative">
            <HeroPhoto />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-24 right-8 hidden xl:flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <span className="font-mono text-xs text-text3 tracking-widest uppercase rotate-90 origin-center mb-6">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} className="text-text3" />
        </motion.div>
      </motion.div>

      {/* Currently Learning Marquee Ticker */}
      <div className="w-full border-t border-b border-border/40 bg-surface/20 backdrop-blur-xs py-4 overflow-hidden relative z-10 mt-auto select-none">
        <div className="animate-marquee flex items-center gap-16 font-mono text-xs font-medium tracking-wider text-text2">
          {Array.from({ length: 4 }).map((_, repeatIdx) => (
            <div key={repeatIdx} className="flex items-center gap-16">
              <span>CURRENTLY DEVELOPING IN LANGCHAIN</span>
              <span className="text-accent">•</span>
              <span>pgvector RAG IMPLEMENTATIONS</span>
              <span className="text-accent2">•</span>
              <span>OLLAMA NLP EXPERIMENTATIONS</span>
              <span className="text-accent3">•</span>
              <span>INDEVAA BRANDING SYSTEMATICS</span>
              <span className="text-accent">•</span>
              <span>FASTAPI SERVICES DEPLOYMENT</span>
              <span className="text-accent2">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
