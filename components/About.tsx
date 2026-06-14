'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Building2 } from 'lucide-react';
import { CERTIFICATIONS } from '@/lib/constants';
import ScrollReveal from './ScrollReveal';

export default function About() {
  return (
    <section id="about" className="section bg-surface/20">
      <div className="container-max">
        <ScrollReveal direction="left" className="mb-4">
          <span className="eyebrow">About</span>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Bio */}
          <div className="space-y-8">
            <ScrollReveal direction="clip-up" delay={0.1}>
              <h2 className="font-syne font-bold text-display-lg text-text1">
                The person behind the terminal.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="font-dm text-body-lg text-text2 leading-relaxed">
                I&apos;m a second-year Data Science student in Greater Noida who serves as a core team
                member (Systems &amp; Operations Lead) at a branding agency from Prayagraj. I spend my
                days building NLP models and content systems.
              </p>
              <p className="font-dm text-body-lg text-text2 leading-relaxed mt-4">
                I believe the best engineers understand people, and the best designers understand
                systems. I&apos;m trying to be both.
              </p>
            </ScrollReveal>

            {/* Education */}
            <ScrollReveal delay={0.3}>
              <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap size={16} className="text-accent" />
                  <span className="font-mono text-xs text-text3 tracking-widest uppercase">
                    Education
                  </span>
                </div>
                <div>
                  <p className="font-syne font-bold text-text1">NIET, Greater Noida</p>
                  <p className="font-dm text-sm text-accent mt-0.5">
                    B.Tech CSE — Data Science
                  </p>
                  <p className="font-mono text-xs text-text3 mt-2">
                    AKTU · 2024–2028 · Greater Noida, UP
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 size={16} className="text-accent2" />
                  <span className="font-mono text-xs text-text3 tracking-widest uppercase">
                    Core Team
                  </span>
                </div>
                <div>
                  <p className="font-syne font-bold text-text1">Indevaa Studio</p>
                  <p className="font-dm text-sm text-accent2 mt-0.5">
                    Systems &amp; Operations Lead
                  </p>
                  <p className="font-mono text-xs text-text3 mt-2">Prayagraj · Dec 2025–Present</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Code block (sticky) */}
          <div className="lg:sticky lg:top-28">
            <ScrollReveal direction="right" delay={0.2}>
              <div className="code-block text-[13px] leading-loose">
                {/* Line numbers + code */}
                <div className="flex gap-6">
                  <div className="text-text3 select-none text-right leading-loose" style={{ minWidth: '1.5rem' }}>
                    {Array.from({ length: 11 }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <div className="flex-1 overflow-x-auto">
                    <div>
                      <span className="code-keyword">class </span>
                      <span className="code-value">NamanRai</span>
                      <span className="code-value">:</span>
                    </div>
                    <div className="pl-4">
                      <span className="code-key">role</span>
                      <span className="code-value"> = </span>
                      <span className="code-string">&quot;DS Student + Systems/Ops Lead&quot;</span>
                    </div>
                    <div className="pl-4">
                      <span className="code-key">location</span>
                      <span className="code-value"> = </span>
                      <span className="code-string">&quot;Prayagraj / Greater Noida&quot;</span>
                    </div>
                    <div className="pl-4">
                      <span className="code-key">currently_building</span>
                      <span className="code-value"> = </span>
                      <span className="code-string">&quot;Indevaa Studio&quot;</span>
                    </div>
                    <div className="pl-4">
                      <span className="code-key">open_to</span>
                      <span className="code-value"> = [</span>
                    </div>
                    <div className="pl-8">
                      <span className="code-string">&quot;internships&quot;</span>
                      <span className="code-value">, </span>
                      <span className="code-string">&quot;freelance&quot;</span>
                      <span className="code-value">,</span>
                    </div>
                    <div className="pl-8">
                      <span className="code-string">&quot;interesting problems&quot;</span>
                    </div>
                    <div className="pl-4">
                      <span className="code-value">]</span>
                    </div>
                    <div className="pl-4">
                      <span className="code-key">f1_score</span>
                      <span className="code-value"> = </span>
                      <span className="code-number">0.94</span>
                    </div>
                    <div className="mt-2">
                      <span className="code-comment"># Currently running at 100% curiosity</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Certifications */}
            <ScrollReveal direction="right" delay={0.35} className="mt-8">
              <p className="font-mono text-xs text-text3 tracking-widest uppercase mb-4">
                Certifications
              </p>
              <div className="cert-scroll pb-2">
                {CERTIFICATIONS.map((cert) => (
                  <div
                    key={cert.title}
                    className="flex-shrink-0 border border-border rounded-xl p-4 bg-surface min-w-[200px] max-w-[220px]"
                  >
                    <p className="font-mono text-[10px] text-accent mb-1">{cert.issuer}</p>
                    <p className="font-dm text-xs text-text2 leading-snug">{cert.title}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
