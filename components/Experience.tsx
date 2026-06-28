'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, CheckSquare, Sparkles, Database, Code } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const CHAPTERS = [
  {
    num: '01',
    title: 'Indevaa Agency Epoch',
    subtitle: 'Core Team Member & Systems Lead',
    period: 'Dec 2025 – Present',
    location: 'Prayagraj, UP (Remote / Hybrid)',
    metrics: [
      { value: '60%', label: 'Prospecting saved' },
      { value: '5+', label: 'D2C brands managed' },
      { value: '10+', label: 'Contracts executed' },
    ],
    bullets: [
      'Built Apify scraping flows & custom n8n lead generation pipelines, saving 15h weekly.',
      'Designed and executed end-to-end social branding plans, including short-form Reels scripts and carousel layouts.',
      'Authored client proposals, legally vetted service agreements, and managed billing pathways.',
    ],
    icon: Sparkles,
  },
  {
    num: '02',
    title: 'NLP & Data Science Lab',
    subtitle: 'B.Tech CSE - Student Researcher',
    period: 'Aug 2024 – Present',
    location: 'NIET, Greater Noida (AKTU)',
    metrics: [
      { value: '0.94', label: 'NLP F1 Classifier' },
      { value: '40K+', label: 'Training datasets' },
      { value: '6+', label: 'Certifications' },
    ],
    bullets: [
      'Built TF-IDF + Logistic Regression NLP pipeline classifying news strings with 94% accuracy.',
      'Wrote Oracle SQL database schemas and executed query scripts for information retrieval.',
      'Completed data analytics certifications in SQL Server and computation problem solving via Infosys Springboard.',
    ],
    icon: Database,
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section bg-surface/20 relative overflow-hidden">
      {/* Background line helper */}
      <div className="absolute top-0 bottom-0 left-[24px] md:left-[48px] w-px bg-border/40 pointer-events-none" />

      <div className="container-max relative">
        {/* Section Header */}
        <ScrollReveal direction="left" className="mb-4">
          <span className="eyebrow">Professional Pathway</span>
        </ScrollReveal>
        <ScrollReveal direction="clip-up" delay={0.1} className="mb-20">
          <h2 className="font-syne font-black text-4xl md:text-5xl lg:text-6xl text-text1 leading-none tracking-tight">
            Pathway & Experience.
          </h2>
        </ScrollReveal>

        {/* Chapters timeline flow */}
        <div className="space-y-24">
          {CHAPTERS.map((chap, idx) => {
            const Icon = chap.icon;
            return (
              <div key={chap.num} className="relative grid grid-cols-1 lg:grid-cols-[100px_1fr] gap-8 lg:gap-16">
                
                {/* Visual chapter number indicator */}
                <div className="hidden lg:flex flex-col items-center">
                  <div className="font-syne font-black text-6xl text-text3/40 sticky top-24 select-none">
                    {chap.num}
                  </div>
                  <div className="w-[1.5px] h-20 bg-gradient-to-b from-border/80 to-transparent mt-4" />
                </div>

                {/* Chapter body content */}
                <ScrollReveal direction="up" delay={idx * 0.1} className="w-full">
                  <div className="bg-surface border border-border/85 rounded-3xl p-6 md:p-10 hover:border-accent2/20 transition-all duration-300 relative group">
                    {/* Glowing highlight indicator */}
                    <div className="absolute top-6 right-6 text-text3 group-hover:text-accent transition-colors">
                      <Icon size={20} />
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8 border-b border-border/40 pb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="lg:hidden font-mono text-xs font-bold text-accent">CH_{chap.num}</span>
                          <h3 className="font-syne font-black text-2xl md:text-3xl text-text1">
                            {chap.title}
                          </h3>
                        </div>
                        <p className="font-dm text-accent2 font-semibold text-sm md:text-base">{chap.subtitle}</p>
                      </div>

                      <div className="flex flex-col md:flex-row lg:flex-col md:items-center lg:items-end gap-3 font-mono text-xs text-text3 shrink-0">
                        <span className="flex items-center gap-1.5 bg-surface2/60 px-3 py-1 rounded-full border border-border/40">
                          <Calendar size={11} className="text-accent" />
                          {chap.period}
                        </span>
                        <span className="flex items-center gap-1.5 bg-surface2/60 px-3 py-1 rounded-full border border-border/40">
                          <MapPin size={11} className="text-accent3" />
                          {chap.location}
                        </span>
                      </div>
                    </div>

                    {/* Chapter Metrics Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {chap.metrics.map((m, mi) => (
                        <div key={mi} className="bg-surface2/40 border border-border/40 rounded-2xl p-4 text-center">
                          <div className="font-syne font-black text-text1 text-xl md:text-2xl">{m.value}</div>
                          <div className="font-mono text-[9px] text-text3 tracking-wider uppercase mt-1">{m.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Chapter details lists */}
                    <div className="space-y-4">
                      <div className="font-mono text-[10px] text-text3 uppercase tracking-widest">{"// DELIVERABLES ACCELERATOR"}</div>
                      {/* PERF FIX: Replaced 6 individual motion.li whileInView (= 6 IO observers)
                          with a single motion.ul stagger container (= 1 IO observer per chapter).
                          Same cascading reveal effect, 83% fewer Intersection Observers. */}
                      <motion.ul
                        className="space-y-3.5"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-40px' }}
                        variants={{
                          hidden: {},
                          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
                        }}
                      >
                        {chap.bullets.map((bullet, bi) => (
                          <motion.li
                            key={bi}
                            className="flex items-start gap-3.5 font-dm text-sm text-text2 leading-relaxed"
                            variants={{
                              hidden: { opacity: 0, x: -10 },
                              visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                            }}
                          >
                            <span className="text-accent font-mono text-[11px] mt-0.5 shrink-0 select-none">[{bi+1}]</span>
                            <span>{bullet}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>

                  </div>
                </ScrollReveal>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
