'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'framer-motion';
import { ArrowUpRight, Github, Clock, Zap, Terminal, Code2, Server, Database } from 'lucide-react';
import { PROJECTS, FILTER_TABS, UPCOMING_PROJECTS } from '@/lib/constants';
import type { Project } from '@/lib/types';
import type { UpcomingProject } from '@/lib/constants';
import ScrollReveal from './ScrollReveal';
import { CursorHover } from './Cursor';

// ─── Path Generator for Bezier S-Curve ─────────────────────────────────────────
const generatePath = (count: number) => {
  if (count === 0) return '';
  
  const points: { x: number; y: number }[] = [];
  // Start at top center
  points.push({ x: 50, y: 0 });
  
  for (let i = 0; i < count; i++) {
    const y = ((i + 0.5) / count) * 100;
    const x = i % 2 === 0 ? 43 : 57;
    points.push({ x, y });
  }
  
  // End at bottom center
  points.push({ x: 50, y: 100 });
  
  // Construct smooth cubic Bezier spline
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cy = p0.y + (p1.y - p0.y) / 2;
    d += ` C ${p0.x} ${cy}, ${p1.x} ${cy}, ${p1.x} ${p1.y}`;
  }
  
  return d;
};

// ─── Project Visuals (Interactive Mock Console Mockups) ────────────────────────

function FakeNewsVisual() {
  const [inputText, setInputText] = useState("Breaking: Mars Rover discovers alien flora.");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ score: number; label: string } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setResult(null);
    timeoutRef.current = setTimeout(() => {
      setAnalyzing(false);
      const isFake = inputText.toLowerCase().includes('alien') || inputText.toLowerCase().includes('secret');
      setResult({
        score: isFake ? 0.94 : 0.12,
        label: isFake ? 'UNVERIFIED / SATIRE' : 'VERIFIED / NEWS',
      });
    }, 1200);
  };

  return (
    <div className="w-full h-full bg-[#1A1817] border border-border/60 rounded-2xl p-6 font-mono text-[11px] leading-relaxed flex flex-col justify-between shadow-inner relative overflow-hidden select-none">
      <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="text-[10px] text-text3 ml-2">classifier_nlp.py</span>
        </div>
        <span className="text-[10px] text-accent font-semibold flex items-center gap-1">
          <Terminal size={10} /> model: active
        </span>
      </div>

      <div className="space-y-3 flex-1">
        <div className="text-text3">{"// INPUT SOURCE STRING"}</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={analyzing}
            className="flex-1 bg-surface2 border border-border rounded px-2.5 py-1.5 text-text1 outline-none focus:border-accent/50 transition-colors"
          />
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="bg-accent text-background font-bold px-3 py-1.5 rounded hover:bg-accent/80 transition-colors flex items-center gap-1.5 shrink-0"
          >
            {analyzing ? '...' : 'RUN'}
          </button>
        </div>

        <div className="bg-surface2/60 border border-border/40 rounded p-3 min-h-[90px] flex flex-col justify-between">
          {analyzing ? (
            <div className="text-accent flex items-center gap-2 h-full justify-center py-4">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce" />
              <span>TOKENIZING & EXTRACTING TF-IDF VECTORS...</span>
            </div>
          ) : result ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-text3">PREDICTION RESULT:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                  result.label.startsWith('UN') ? 'bg-red-950/50 border border-red-500/30 text-red-400' : 'bg-green-950/50 border border-green-500/30 text-green-400'
                }`}>
                  {result.label}
                </span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${result.label.startsWith('UN') ? 'bg-red-400' : 'bg-green-400'}`}
                  style={{ width: `${result.score * 100}%` }}
                />
              </div>
              <div className="text-[10px] text-text3 flex justify-between">
                <span>F1 SCORE: 0.94</span>
                <span>PROBABILITY: {(result.score * 100).toFixed(0)}%</span>
              </div>
              <div className="text-[10px] text-accent/80 leading-normal mt-1 border-t border-border/20 pt-1.5">
                <span className="text-accent3">LIME explanation:</span> Word tokens &apos;rover&apos; and &apos;alien&apos; contributed +42% weight to satire confidence score.
              </div>
            </div>
          ) : (
            <div className="text-text3 text-center py-4">
              Input news string above and click run to trigger Logistic Regression classification.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NexusForumVisual() {
  const [threads, setThreads] = useState([
    { id: 1, title: 'AKTU 2026 Curriculum updates', votes: 42, author: 'naman' },
    { id: 2, title: 'Why build without frameworks?', votes: 89, author: 'dev_guru' },
  ]);

  const handleUpvote = (id: number) => {
    setThreads(threads.map(t => t.id === id ? { ...t, votes: t.votes + 1 } : t));
  };

  return (
    <div className="w-full h-full bg-[#1A1817] border border-border/60 rounded-2xl p-6 font-mono text-[11px] leading-relaxed flex flex-col justify-between shadow-inner relative overflow-hidden select-none">
      <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="text-[10px] text-text3 ml-2">community_router.php</span>
        </div>
        <span className="text-[10px] text-accent2 font-semibold flex items-center gap-1">
          <Code2 size={10} /> engine: PHP-pure
        </span>
      </div>

      <div className="space-y-3 flex-1">
        <div className="text-text3">{"// PHP DB SCHEMA (POSTS TABLE)"}</div>
        <div className="bg-surface2/40 border border-border/40 rounded p-2 text-[10px] text-text3">
          <span className="text-accent3">CREATE TABLE</span> posts (id INT PRIMARY KEY, title VARCHAR(255), votes INT, user_id INT);
        </div>

        <div className="text-text3">{"// LIVE FORUM SCHEMATIC INTERACTIVE"}</div>
        <div className="space-y-2">
          {threads.map((thread) => (
            <div key={thread.id} className="flex items-center justify-between bg-surface2/60 border border-border/40 rounded p-2.5 hover:border-accent2/30 transition-all">
              <div className="min-w-0 pr-4">
                <div className="text-text1 font-semibold truncate leading-tight mb-1">{thread.title}</div>
                <div className="text-[9px] text-text3">Posted by u/{thread.author} · MySQL index query OK</div>
              </div>
              <button
                onClick={() => handleUpvote(thread.id)}
                className="bg-accent2/10 hover:bg-accent2/20 border border-accent2/30 rounded p-1.5 flex flex-col items-center min-w-[36px]"
              >
                <span className="text-accent2 text-[8px]">▲</span>
                <span className="text-text1 font-bold text-[10px] mt-0.5">{thread.votes}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SaaSBuilderVisual() {
  const [activeStep, setActiveStep] = useState(0);
  const [runLogs, setRunLogs] = useState<string[]>(['[system] pipeline initialized.']);

  const steps = [
    { label: 'Ingest Orchestrator Config', icon: Server },
    { label: 'Parse Multi-tenant settings', icon: Database },
    { label: 'GitHub Action Build Deployment', icon: Zap },
  ];

  const triggerNextStep = () => {
    const next = (activeStep + 1) % steps.length;
    setActiveStep(next);
    const logMsgs = [
      '[pipeline] scheduler dispatched: tenant_142.yml config loaded.',
      '[pipeline] provisioned Docker container: node:20-alpine isolation.',
      '[pipeline] GitHub action trigger success: deployment deployed live (1.4s).'
    ];
    setRunLogs((prev) => [...prev, logMsgs[next]].slice(-3));
  };

  return (
    <div className="w-full h-full bg-[#1A1817] border border-border/60 rounded-2xl p-6 font-mono text-[11px] leading-relaxed flex flex-col justify-between shadow-inner relative overflow-hidden select-none">
      <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="text-[10px] text-text3 ml-2">saas_orchestrator.js</span>
        </div>
        <span className="text-[10px] text-accent font-semibold flex items-center gap-1">
          <Zap size={10} /> CI/CD: active
        </span>
      </div>

      <div className="space-y-4 flex-1">
        <div className="text-text3">{"// ARCHITECTURE LAYERS PIPELINE (CLICK TO RUN)"}</div>
        
        <div className="grid grid-cols-3 gap-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === activeStep;
            return (
              <button
                key={idx}
                onClick={triggerNextStep}
                className={`p-2.5 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${
                  isActive
                    ? 'bg-accent/5 border-accent text-accent shadow-glow-sm'
                    : 'bg-surface2/40 border-border/40 text-text3 hover:border-accent/30'
                }`}
              >
                <Icon size={14} className={isActive ? 'animate-pulse' : ''} />
                <span className="text-[9px] leading-tight font-semibold">{step.label}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-surface2/60 border border-border/40 rounded p-2.5">
          <div className="text-[9px] text-text3 mb-1.5">{"// SYSTEM RUNTIME CONSOLE LOGS"}</div>
          <div className="space-y-1 font-mono text-[9px] text-text2">
            {runLogs.map((log, i) => (
              <div key={i} className="truncate">
                <span className="text-accent">{'>'}</span> {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CRMVisual() {
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [leads, setLeads] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startScraper = () => {
    if (pipelineRunning) return;
    setPipelineRunning(true);
    setLeads([]);
    const mockLeads = [
      'Found: D2C Beauty Brand (Aesthetic Lab) - CEO: R. Verma',
      'Enriched: lead contact verified (rohit@aestheticlab.in) via Apify',
      'Completed: Pushed to Notion database & triggered n8n workflow sequence'
    ];
    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i < mockLeads.length) {
        const nextLead = mockLeads[i];
        if (nextLead) {
          setLeads((prev) => [...prev, nextLead]);
        }
      }
      i++;
      if (i >= mockLeads.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setPipelineRunning(false);
      }
    }, 1000);
  };

  return (
    <div className="w-full h-full bg-[#1A1817] border border-border/60 rounded-2xl p-6 font-mono text-[11px] leading-relaxed flex flex-col justify-between shadow-inner relative overflow-hidden select-none">
      <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="text-[10px] text-text3 ml-2">indevaa_n8n_flow.json</span>
        </div>
        <span className="text-[10px] text-accent3 font-semibold flex items-center gap-1">
          <Server size={10} /> automated
        </span>
      </div>

      <div className="space-y-3 flex-1">
        <div className="flex justify-between items-center">
          <span className="text-text3">{"// PIPELINE PROSPECTING AGENT"}</span>
          <button
            onClick={startScraper}
            disabled={pipelineRunning}
            className={`px-3 py-1 rounded font-bold text-[10px] transition-all ${
              pipelineRunning
                ? 'bg-accent3/20 border border-accent3/30 text-accent3 animate-pulse cursor-not-allowed'
                : 'bg-accent3 text-background hover:bg-accent3/80'
            }`}
          >
            {pipelineRunning ? 'SCRAPING...' : 'RUN PIPELINE'}
          </button>
        </div>

        <div className="bg-surface2/60 border border-border/40 rounded p-3 min-h-[110px] flex flex-col justify-center gap-1.5 font-mono text-[9.5px]">
          {leads.length > 0 ? (
            leads.map((lead, i) => (
              <div
                key={i}
                className={`flex gap-1.5 leading-normal ${
                  i === 2 ? 'text-accent border-t border-border/20 pt-1.5 mt-1' : 'text-text2'
                }`}
              >
                <span className={i === 2 ? 'text-accent' : 'text-accent3'}>
                  {i === 0 ? '🔍' : i === 1 ? '⚡' : '✅'}
                </span>
                <span>{lead}</span>
              </div>
            ))
          ) : (
            <div className="text-text3 text-center">
              Click RUN PIPELINE to simulate Apify web scraping + Notion DB lead auto-enrichment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectNode({ active, num, isEven }: { active: boolean; num: string; isEven: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulsating ring */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute w-8 h-8 rounded-full border border-accent/60 bg-accent/5"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.1, 0.4, 0.1] }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* Main core circle */}
      <motion.div
        className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-mono font-bold transition-all duration-300 z-10 ${
          active
            ? 'border-accent bg-background text-accent shadow-glow-sm scale-110'
            : 'border-border bg-surface text-text3'
        }`}
      >
        <span>{num}</span>
      </motion.div>

      {/* Dynamic status coordinates tool-tip */}
      <AnimatePresence>
        {active && (
          <motion.div
            className={`absolute ${isEven ? 'left-8' : 'right-8'} bg-surface border border-border/80 rounded-md px-2.5 py-1 pointer-events-none whitespace-nowrap hidden lg:block shadow-md`}
            initial={{ opacity: 0, x: isEven ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isEven ? -10 : 10 }}
            transition={{ duration: 0.3 }}
          >
            <span className="font-mono text-[9px] text-accent tracking-wider uppercase font-semibold">
              Pipeline Step {num} Active
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Completed Project Row ────────────────────────────────────────────────────
function ProjectRow({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0;
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, { once: false, margin: "-30% 0px -40% 0px" });

  return (
    <div ref={rowRef} className="w-full relative">
      {/* Central timeline node bubble */}
      <div className={`absolute left-4 md:left-6 ${isEven ? 'lg:left-[43%]' : 'lg:left-[57%]'} top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center`}>
        <ProjectNode active={isInView} num={project.num} isEven={isEven} />
      </div>

      <ScrollReveal direction={isEven ? 'left' : 'right'} delay={0.05} className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center py-16 border-b border-border/40 last:border-b-0 pl-10 md:pl-16 lg:pl-0">
          
          {/* Left Col (Visual on Even, Details on Odd) */}
          <div className={`w-full aspect-[4/3] max-w-[520px] mx-auto ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}>
            {project.id === 'fake-news-detector' && <FakeNewsVisual />}
            {project.id === 'nexus-forum' && <NexusForumVisual />}
            {project.id === 'auto-saas-builder' && <SaaSBuilderVisual />}
            {project.id === 'indevaa-crm' && <CRMVisual />}
          </div>

          {/* Right Col (Details on Even, Visual on Odd) */}
          <div className={`flex flex-col gap-5 ${isEven ? 'order-2' : 'order-2 lg:order-1'}`}>
            <span className="font-mono text-xs text-text3 tracking-wider">{"// PROJECT "}{project.num}</span>
            
            <h3 className="font-syne font-black text-3xl md:text-4xl text-text1 leading-none tracking-tight">
              {project.title}
            </h3>

            <p className="font-dm text-sm md:text-base text-text2 leading-relaxed">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-surface2 border border-border font-mono text-[10px] text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Tech Stack */}
            <p className="font-mono text-xs text-accent2 border-t border-border/30 pt-4">
              <span className="text-text3">Built with:</span> {project.tech}
            </p>

            {/* Action Row */}
            <div className="flex items-center gap-4 mt-2">
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

// ─── Upcoming Project Card ────────────────────────────────────────────────────
function UpcomingCard({ project, index }: { project: UpcomingProject; index: number }) {
  return (
    <motion.div
      className="relative bg-surface border border-border/60 rounded-2xl p-6 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Background gradient based on progress */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          background: `linear-gradient(135deg, #818CF8 0%, #6EE7B7 100%)`,
        }}
      />

      {/* "Upcoming" badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent2/10 border border-accent2/20 font-mono text-[10px] text-accent2">
          <Clock size={9} />
          {project.eta}
        </span>
        <span className="font-mono text-[10px] text-text3">{project.progress}% built</span>
      </div>

      {/* Progress bar */}
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
          <span
            key={tag}
            className="px-2 py-0.5 rounded bg-surface2 font-mono text-[10px] text-accent3"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Work Section ─────────────────────────────────────────────────────────────
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
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(45,40,37,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(45,40,37,0.15)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="container-max relative">
        {/* Header */}
        <ScrollReveal direction="left" className="mb-4">
          <span className="eyebrow">Selected Work</span>
        </ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <ScrollReveal direction="clip-up" delay={0.1}>
            <h2 className="font-syne font-black text-4xl md:text-5xl lg:text-6xl text-text1 leading-none tracking-tight">
              Things I&apos;ve built.
            </h2>
          </ScrollReveal>
          {/* Toggle upcoming */}
          <ScrollReveal delay={0.2}>
            <button
              onClick={() => setShowUpcoming(!showUpcoming)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border font-mono text-xs transition-all duration-300 ${
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
              className="relative"
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

              {/* Showcase Container with vertical line */}
              <div ref={containerRef} className="relative flex flex-col">
                
                {/* Vertical scroll-linked line (Tablet md only) */}
                <div className="absolute left-6 top-16 bottom-16 w-[1.5px] -translate-x-1/2 hidden md:block lg:hidden z-0 pointer-events-none">
                  {/* Background Track Line */}
                  <div className="absolute inset-0 bg-border/40 w-full h-full rounded-full" />
                  {/* Drawing Active Line */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 bg-accent origin-top rounded-full shadow-[0_0_15px_rgba(226,125,96,0.3)]"
                    style={{ height: '100%', scaleY: springProgress }}
                  />
                </div>

                {/* Dynamic S-Curve Timeline (Desktop lg only) */}
                <div className="absolute inset-0 hidden lg:block z-0 pointer-events-none">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    {/* Background Track Path */}
                    <path
                      d={generatePath(filtered.length)}
                      fill="none"
                      stroke="var(--color-border)"
                      strokeWidth={2}
                      vectorEffect="non-scaling-stroke"
                      opacity="0.4"
                    />
                    {/* Active Drawing Path */}
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

                {/* Showcase rows */}
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
              {/* Upcoming header */}
              <div className="mb-8 p-5 rounded-2xl border border-accent/20 bg-accent/5">
                <div className="flex items-start gap-3">
                  <Zap size={16} className="text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-syne font-bold text-text1 mb-1">On the Radar</p>
                    <p className="font-dm text-sm text-text2">
                      Projects I&apos;m actively building or researching. Progress bars are real estimates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {UPCOMING_PROJECTS.map((project, i) => (
                  <UpcomingCard key={project.id} project={project} index={i} />
                ))}
              </div>

              {/* Project suggestions note */}
              <motion.div
                className="mt-10 p-6 rounded-2xl border border-dashed border-accent3/30 bg-accent3/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="font-mono text-xs text-accent3 tracking-widest uppercase mb-2">
                  Suggested Next Projects
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  {[
                    { name: 'Sentiment API for Brands', why: 'Bridge DS + branding expertise' },
                    { name: 'Open-source NLP Toolkit', why: 'Build in public, establish credibility' },
                    { name: 'AI Social Caption Generator', why: 'Direct Indevaa product with real demand' },
                  ].map((s) => (
                    <div key={s.name} className="p-3 rounded-xl bg-background border border-border">
                      <p className="font-dm text-sm text-text1 mb-1">{s.name}</p>
                      <p className="font-mono text-[10px] text-text3">{s.why}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
