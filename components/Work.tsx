'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'framer-motion';
import { ArrowUpRight, Github, Clock, Zap } from 'lucide-react';
import { PROJECTS, FILTER_TABS, UPCOMING_PROJECTS } from '@/lib/constants';
import type { Project } from '@/lib/types';
import type { UpcomingProject } from '@/lib/constants';
import ScrollReveal from './ScrollReveal';
import { CursorHover } from './Cursor';

// ─── Path Generator for Bezier S-Curve ─────────────────────────────────────────
const generatePath = (count: number) => {
  if (count === 0) return '';
  const points: { x: number; y: number }[] = [];
  points.push({ x: 50, y: 0 });
  for (let i = 0; i < count; i++) {
    const y = ((i + 0.5) / count) * 100;
    const x = i % 2 === 0 ? 43 : 57;
    points.push({ x, y });
  }
  points.push({ x: 50, y: 100 });
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cy = p0.y + (p1.y - p0.y) / 2;
    d += ` C ${p0.x} ${cy}, ${p1.x} ${cy}, ${p1.x} ${p1.y}`;
  }
  return d;
};

// ─── Static Project Visuals ─────────────────────────────────────────────────────
// Replaced 4 interactive stateful mock terminals (~320 lines, 4 timers/intervals)
// with lightweight static metric panels — same information, zero JS state.

const PROJECT_VISUALS: Record<string, React.ReactNode> = {
  'fake-news-detector': (
    <div className="w-full h-full bg-[#0F1117] border border-border/60 rounded-2xl p-6 font-mono text-[11px] flex flex-col gap-5 select-none overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 text-text3 text-[10px]">classifier_nlp.py</span>
      </div>
      {/* Metric blocks */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        <div className="rounded-xl bg-accent/8 border border-accent/20 p-3 flex flex-col gap-1">
          <span className="text-accent text-[9px] uppercase tracking-wider">F1-Score</span>
          <span className="text-text1 font-syne font-black text-2xl">0.94</span>
          <span className="text-text3 text-[9px]">TF-IDF + LogReg</span>
        </div>
        <div className="rounded-xl bg-accent2/8 border border-accent2/20 p-3 flex flex-col gap-1">
          <span className="text-accent2 text-[9px] uppercase tracking-wider">Dataset</span>
          <span className="text-text1 font-syne font-black text-2xl">40K</span>
          <span className="text-text3 text-[9px]">labeled samples</span>
        </div>
        <div className="rounded-xl bg-surface2/80 border border-border/40 col-span-2 p-3">
          <span className="text-text3 text-[9px] uppercase tracking-wider block mb-2">Pipeline</span>
          <div className="flex gap-2 flex-wrap">
            {['Tokenize', '→', 'TF-IDF', '→', 'Classify', '→', 'LIME'].map((s, i) => (
              <span key={i} className={s === '→' ? 'text-text3' : 'px-1.5 py-0.5 rounded bg-background border border-border/50 text-accent3 text-[9px]'}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="text-text3 text-[9px] border-t border-border/30 pt-3">
        <span className="text-green-400">✓</span> LIME explainability · Flask REST API · JS frontend
      </div>
    </div>
  ),

  'nexus-forum': (
    <div className="w-full h-full bg-[#0F1117] border border-border/60 rounded-2xl p-6 font-mono text-[11px] flex flex-col gap-5 select-none overflow-hidden">
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 text-text3 text-[10px]">community_router.php</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Auth System', value: 'JWT', color: 'accent' },
          { label: 'Comments', value: 'Threaded', color: 'accent2' },
          { label: 'Engine', value: 'Pure PHP', color: 'accent3' },
        ].map((m) => (
          <div key={m.label} className="rounded-xl bg-surface2/60 border border-border/40 p-3">
            <div className={`text-${m.color} text-[9px] uppercase tracking-wider mb-1`}>{m.label}</div>
            <div className="text-text1 font-semibold text-xs">{m.value}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 bg-surface2/40 border border-border/30 rounded-xl p-3 flex flex-col gap-2">
        <span className="text-text3 text-[9px] uppercase tracking-wider">Schema excerpt</span>
        <div className="text-[10px] leading-relaxed">
          <span className="text-accent3">CREATE TABLE</span>{' '}
          <span className="text-text2">posts</span>{' '}
          <span className="text-text3">( id, title, votes, user_id, parent_id )</span>
        </div>
        <div className="text-[10px] leading-relaxed">
          <span className="text-accent3">CREATE TABLE</span>{' '}
          <span className="text-text2">users</span>{' '}
          <span className="text-text3">( id, role, session_token, joined_at )</span>
        </div>
      </div>
      <div className="text-text3 text-[9px] border-t border-border/30 pt-3">
        <span className="text-green-400">✓</span> Role-based admin panel · Upvote system · User profiles
      </div>
    </div>
  ),

  'auto-saas-builder': (
    <div className="w-full h-full bg-[#0F1117] border border-border/60 rounded-2xl p-6 font-mono text-[11px] flex flex-col gap-5 select-none overflow-hidden">
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 text-text3 text-[10px]">saas_orchestrator.js</span>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <span className="text-text3 text-[9px] uppercase tracking-wider">Architecture</span>
        {[
          { layer: '01 Orchestrator', desc: 'Job scheduling & env config' },
          { layer: '02 Scheduler', desc: 'Multi-tenant isolation queue' },
          { layer: '03 Agents', desc: 'Service provisioning workers' },
          { layer: '04 Services', desc: 'GitHub Actions CI/CD pipeline' },
        ].map((l, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0">
            <span className="text-accent3 text-[9px] font-bold w-5">{l.layer.slice(0, 2)}</span>
            <span className="text-accent font-semibold text-[10px] flex-1">{l.layer.slice(3)}</span>
            <span className="text-text3 text-[9px]">{l.desc}</span>
          </div>
        ))}
      </div>
      <div className="text-text3 text-[9px] border-t border-border/30 pt-3">
        <span className="text-green-400">✓</span> Node.js · Axios · GitHub Actions · Docker
      </div>
    </div>
  ),

  'indevaa-crm': (
    <div className="w-full h-full bg-[#0F1117] border border-border/60 rounded-2xl p-6 font-mono text-[11px] flex flex-col gap-5 select-none overflow-hidden">
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 text-text3 text-[10px]">indevaa_n8n_flow.json</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-accent3/8 border border-accent3/20 p-3 col-span-2">
          <span className="text-accent3 text-[9px] uppercase tracking-wider block mb-1">Impact</span>
          <span className="text-text1 font-syne font-black text-xl">60%</span>
          <span className="text-text3 text-xs ml-1">prospecting time saved</span>
        </div>
        <div className="rounded-xl bg-surface2/60 border border-border/40 p-3">
          <span className="text-text3 text-[9px] block mb-1">Scraper</span>
          <span className="text-text2 font-semibold text-xs">Apify</span>
        </div>
        <div className="rounded-xl bg-surface2/60 border border-border/40 p-3">
          <span className="text-text3 text-[9px] block mb-1">Automation</span>
          <span className="text-text2 font-semibold text-xs">n8n + Notion</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        {['Scrape leads via Apify', 'Enrich & qualify contacts', 'Push to Notion DB', 'Trigger n8n outreach'].map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-[10px]">
            <span className="text-accent3">{'→'}</span>
            <span className="text-text2">{s}</span>
          </div>
        ))}
      </div>
      <div className="text-text3 text-[9px] border-t border-border/30 pt-3">
        <span className="text-green-400">✓</span> Apify · n8n · Notion API · Node.js
      </div>
    </div>
  ),
};

// ─── Project Row ───────────────────────────────────────────────────────────────
function ProjectRow({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0;
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, { once: false, margin: '-30% 0px -40% 0px' });

  return (
    <div ref={rowRef} className="w-full relative">
      {/* Timeline node */}
      <div className={`absolute left-4 md:left-6 ${isEven ? 'lg:left-[43%]' : 'lg:left-[57%]'} top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 hidden md:flex`}>
        <motion.div
          className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-mono font-bold transition-all duration-300 ${
            isInView
              ? 'border-accent bg-background text-accent shadow-[0_0_12px_rgba(226,125,96,0.4)]'
              : 'border-border bg-surface text-text3'
          }`}
        >
          {project.num}
        </motion.div>
      </div>

      <ScrollReveal direction={isEven ? 'left' : 'right'} delay={0.05} className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center py-14 border-b border-border/30 last:border-b-0 pl-10 md:pl-16 lg:pl-0">

          {/* Visual */}
          <div className={`w-full ${isEven ? 'order-1' : 'order-1 lg:order-2'}`} style={{ aspectRatio: '4/3' }}>
            {PROJECT_VISUALS[project.id]}
          </div>

          {/* Details */}
          <div className={`flex flex-col gap-5 ${isEven ? 'order-2' : 'order-2 lg:order-1'}`}>
            <span className="font-mono text-[11px] text-text3 tracking-wider">{'// PROJECT '}{project.num}</span>

            <h3 className="font-syne font-black text-3xl md:text-4xl text-text1 leading-none tracking-tight">
              {project.title}
            </h3>

            <p className="font-dm text-sm md:text-[15px] text-text2 leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-md bg-surface2 border border-border font-mono text-[10px] text-accent">
                  {tag}
                </span>
              ))}
            </div>

            <p className="font-mono text-[11px] text-accent2 border-t border-border/30 pt-4">
              <span className="text-text3">Built with: </span>{project.tech}
            </p>

            <div className="flex items-center gap-4">
              {project.github && (
                <CursorHover label="GITHUB">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 bg-surface/50 text-text2 hover:text-accent hover:border-accent/40 font-mono text-xs transition-all duration-200"
                  >
                    <Github size={12} /> Code Repo
                  </a>
                </CursorHover>
              )}
              <CursorHover label="OPEN">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-text1 hover:text-accent font-mono text-xs font-bold transition-all duration-200 group"
                >
                  Live Demo <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </CursorHover>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

// ─── Upcoming Project Card ─────────────────────────────────────────────────────
function UpcomingCard({ project, index }: { project: UpcomingProject; index: number }) {
  return (
    <motion.div
      className="relative bg-surface border border-border/60 rounded-2xl p-6 overflow-hidden hover:border-accent/20 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent2/10 border border-accent2/20 font-mono text-[10px] text-accent2">
          <Clock size={9} />{project.eta}
        </span>
        <span className="font-mono text-[10px] text-text3">{project.progress}% built</span>
      </div>

      <div className="h-px bg-border mb-4 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-accent2 to-accent"
          initial={{ width: 0 }}
          whileInView={{ width: `${project.progress}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 + 0.3 }}
        />
      </div>

      <h3 className="font-syne font-bold text-lg text-text1 mb-2">{project.title}</h3>
      <p className="font-dm text-xs text-text2 leading-relaxed mb-4">{project.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded bg-surface2 font-mono text-[10px] text-accent3">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Work Section ──────────────────────────────────────────────────────────────
export default function Work() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showUpcoming, setShowUpcoming] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });
  const springProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });

  const filtered = PROJECTS.filter(
    (p) => activeFilter === 'all' || p.category === activeFilter
  );

  return (
    <section id="work" className="section bg-background relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(45,40,37,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(45,40,37,0.12) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="container-max relative">
        {/* Header */}
        <ScrollReveal direction="left" className="mb-4">
          <span className="eyebrow">Selected Work</span>
        </ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <ScrollReveal direction="clip-up" delay={0.1}>
            <h2 className="font-syne font-black text-4xl md:text-5xl lg:text-6xl text-text1 leading-none tracking-tight">
              Things I&apos;ve built.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <button
              onClick={() => setShowUpcoming(!showUpcoming)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border font-mono text-xs transition-all duration-300 self-start sm:self-auto ${
                showUpcoming
                  ? 'bg-accent/15 border-accent/40 text-accent'
                  : 'border-border text-text3 hover:border-accent/30 hover:text-accent'
              }`}
            >
              <Zap size={12} />
              {showUpcoming ? 'View Completed' : 'View Upcoming'}
            </button>
          </ScrollReveal>
        </div>

        <AnimatePresence mode="wait">
          {!showUpcoming ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filter tabs */}
              <div className="flex gap-2 flex-wrap mb-10">
                {FILTER_TABS.map((tab) => (
                  <div key={tab.value} className="relative">
                    <button
                      onClick={() => setActiveFilter(tab.value)}
                      className={`relative px-5 py-2.5 rounded-full font-mono text-xs tracking-wide transition-colors duration-200 ${
                        activeFilter === tab.value
                          ? 'text-background font-semibold'
                          : 'text-text2 border border-border/80 hover:text-text1 hover:border-text3'
                      }`}
                    >
                      {activeFilter === tab.value && (
                        <motion.div
                          layoutId="filter-bg"
                          className="absolute inset-0 rounded-full bg-accent"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  </div>
                ))}
              </div>

              <div ref={containerRef} className="relative flex flex-col">
                {/* Vertical line (tablet) */}
                <div className="absolute left-6 top-16 bottom-16 w-[1.5px] -translate-x-1/2 hidden md:block lg:hidden z-0 pointer-events-none">
                  <div className="absolute inset-0 bg-border/40 rounded-full" />
                  <motion.div
                    className="absolute top-0 left-0 right-0 bg-accent origin-top rounded-full"
                    style={{ height: '100%', scaleY: springProgress }}
                  />
                </div>

                {/* S-Curve (desktop) */}
                <div className="absolute inset-0 hidden lg:block z-0 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path
                      d={generatePath(filtered.length)}
                      fill="none"
                      stroke="var(--color-border)"
                      strokeWidth={2}
                      vectorEffect="non-scaling-stroke"
                      opacity="0.4"
                    />
                    <motion.path
                      d={generatePath(filtered.length)}
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth={2.5}
                      vectorEffect="non-scaling-stroke"
                      style={{ pathLength: springProgress }}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {filtered.map((project, idx) => (
                  <ProjectRow key={project.id} project={project} index={idx} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 p-5 rounded-2xl border border-accent/20 bg-accent/5">
                <div className="flex items-start gap-3">
                  <Zap size={16} className="text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-syne font-bold text-text1 mb-1">On the Radar</p>
                    <p className="font-dm text-sm text-text2">
                      Projects I&apos;m actively building. Progress bars are real estimates.
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {UPCOMING_PROJECTS.map((project, i) => (
                  <UpcomingCard key={project.id} project={project} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
