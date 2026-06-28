'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, CornerDownLeft } from 'lucide-react';
import { SKILLS, TOOLS } from '@/lib/constants';
import ScrollReveal from './ScrollReveal';
import { useAchievements } from './AchievementTracker';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

export default function Skills() {
  const [commandInput, setCommandInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [booting, setBooting] = useState(true);
  const [commandCount, setCommandCount] = useState(0);

  const { unlock } = useAchievements();
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  useEffect(() => {
    const lines = [
      { text: 'CONNECTING TO SYSTEM HOST NODE [127.0.0.1]...', type: 'output' as const },
      { text: 'ESTABLISHING AUTH ENVELOPE SECURE SSH TUNNEL...', type: 'output' as const },
      { text: 'guest@naman-rai:~$ welcome --init', type: 'input' as const },
      { text: 'Naman Rai Terminal Interface v2.4 initialized.', type: 'output' as const },
      { text: 'Type "help" or click the terminal pill tags below to execute console commands.', type: 'output' as const },
    ];

    let current = 0;
    const timer = setInterval(() => {
      if (current < lines.length) {
        const nextLine = lines[current];
        if (nextLine) {
          setHistory((prev) => [...prev, nextLine]);
        }
      }
      current++;
      if (current >= lines.length) {
        clearInterval(timer);
        setBooting(false);
      }
    }, 250);

    return () => clearInterval(timer);
  }, []);

  const runCommand = (cmdText: string) => {
    if (booting) return;
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    const newHistory = [...history, { text: `guest@naman-rai:~$ ${trimmed}`, type: 'input' as const }];
    const cmd = trimmed.toLowerCase();

    // Increment command counter for achievements
    const count = commandCount + 1;
    setCommandCount(count);
    if (count >= 3) {
      unlock('terminal_pro');
    }

    let responses: TerminalLine[] = [];

    switch (cmd) {
      case 'help':
        responses = [
          { text: 'AVAILABLE BASH UTILITIES:', type: 'success' },
          { text: '  skills       - Render technical skill competencies with visual metrics', type: 'output' },
          { text: '  tools        - Print complete development environment tools', type: 'output' },
          { text: '  predict-news - Execute NLP Fake News Logistic Regression mock run', type: 'output' },
          { text: '  easter-egg   - Query the central Indevaa node database', type: 'output' },
          { text: '  clear        - Clear console output window buffers', type: 'output' },
          { text: '  about        - View person coordinates summary', type: 'output' },
        ];
        break;

      case 'skills':
        responses = [
          { text: 'LOADING SKILLSET CONFIDENCE METRICS...', type: 'success' },
          ...SKILLS.map((s) => {
            const barLength = Math.round(s.level / 10);
            const bar = '█'.repeat(barLength) + '░'.repeat(10 - barLength);
            return {
              text: `  ${s.name.padEnd(16)} [${bar}] ${s.level}%`,
              type: 'output' as const,
            };
          }),
        ];
        break;

      case 'tools':
        responses = [
          { text: 'RETRIEVING ECOSYSTEM PILLS:', type: 'success' },
          { text: `  ${TOOLS.map((t) => t.name).join('  ·  ')}`, type: 'output' },
        ];
        break;

      case 'predict-news':
        responses = [
          { text: 'INITIATING MODEL INSTANCE...', type: 'output' },
          { text: '  [info] Loaded vocabulary size: 40,000 text samples.', type: 'output' },
          { text: '  [info] Processing TF-IDF feature vectors...', type: 'output' },
          { text: '  [prediction] Confidence classification: SATIRE (0.94 probability)', type: 'success' },
          { text: '  [explanation] Main weights: "rocket" (+12%), "alien" (+38%).', type: 'output' },
        ];
        break;

      case 'easter-egg':
        unlock('easter_egg');
        responses = [
          { text: 'ACCESSING INDEVAA STUDIO PRIVATE SECRETS...', type: 'success' },
          { text: '    ______                 __ ', type: 'success' },
          { text: '   /  _/ /_  ___  __ _____/ /', type: 'success' },
          { text: '  _/ //  _ \\/ _ \\/ // / _  / ', type: 'success' },
          { text: ' /___/_//_//_//_/\\_,_/\\_,_/  ', type: 'success' },
          { text: '                              ', type: 'success' },
          { text: '  "We build brands that people stop scrolling for."', type: 'success' },
          { text: '  Indevaa Node: Prayagraj Core. Status: Dec 2025.', type: 'output' },
        ];
        break;

      case 'about':
        responses = [
          { text: 'NAMAN RAI - SYSTEM INFO:', type: 'success' },
          { text: '  - B.Tech CSE (Data Science) @ NIET (AKTU 2024-2028)', type: 'output' },
          { text: '  - Core Team Member @ Indevaa Studio, branding & social agency', type: 'output' },
          { text: '  - Location coordinates: Greater Noida / Prayagraj', type: 'output' },
          { text: '  - Goal F1-score parameter: 0.94 NLP accuracy', type: 'output' },
        ];
        break;

      case 'clear':
        setHistory([]);
        setCommandInput('');
        return;

      default:
        responses = [
          { text: `bash: command not found: "${trimmed}". Type "help" for a list of valid commands.`, type: 'error' },
        ];
    }

    setHistory([...newHistory, ...responses]);
    setCommandInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(commandInput);
    }
  };

  const quickPills = ['help', 'skills', 'tools', 'predict-news', 'easter-egg', 'clear'];

  return (
    <section id="skills" className="section bg-surface/10 relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-max relative">
        {/* Header */}
        <ScrollReveal direction="left" className="mb-4">
          <span className="eyebrow">Interactive Shell</span>
        </ScrollReveal>
        <ScrollReveal direction="clip-up" delay={0.1} className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="font-syne font-black text-4xl md:text-5xl lg:text-6xl text-text1 leading-none tracking-tight">
                Technical Arsenal.
              </h2>
              <p className="font-dm text-sm text-text2 mt-4 max-w-[500px]">
                Interact with my skillset console database. Type commands or click the action pills below to execute functions.
              </p>
            </div>
            
            {/* HUD Status */}
            <div className="flex gap-4 shrink-0 font-mono text-[10px] text-text3">
              <div>HOST: <span className="text-accent">localhost</span></div>
              <div>SHELL: <span className="text-accent2">indevaa-bash</span></div>
            </div>
          </div>
        </ScrollReveal>

        {/* Terminal Window */}
         <ScrollReveal delay={0.2} className="w-full max-w-[840px] mx-auto">
          {/* PERF FIX: Removed crt-flicker class — it ran opacity animation every 200ms
              forcing repaints on this large element. The .crt scanline overlay is kept (static). */}
          <div className="rounded-2xl border border-border/80 bg-[#1A1817] shadow-[0_0_50px_rgba(0,0,0,0.6)] overflow-hidden crt relative">
            {/* Terminal Top bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#24201F] border-b border-border/60 select-none relative z-30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="font-mono text-xs text-text3 font-semibold flex items-center gap-1.5">
                <Terminal size={11} className="text-accent" /> bash: guest@naman-rai:~
              </span>
              <div className="w-10 h-1" />
            </div>

            {/* Terminal Body Screen — touch-action: pan-y lets touch events scroll this
                container independently without conflicting with Lenis page scroll */}
            <div
              ref={scrollContainerRef}
              className="p-5 md:p-6 h-[380px] overflow-y-auto font-mono text-xs md:text-sm leading-relaxed space-y-2 select-text relative z-10"
              style={{ touchAction: 'pan-y' }}
            >
              {history.map((line, idx) => {
                if (!line) return null;
                let colorClass = 'text-text2';
                if (line.type === 'input') colorClass = 'text-text1 font-semibold';
                if (line.type === 'error') colorClass = 'text-red-400';
                if (line.type === 'success') colorClass = 'text-accent font-semibold';

                return (
                  <div key={idx} className={`${colorClass} break-all whitespace-pre-wrap`}>
                    {line.text}
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Bottom Input Prompt */}
            <div className="flex items-center gap-2 px-5 py-4 bg-[#131110] border-t border-border/60 relative z-30">
              <span className="font-mono text-xs md:text-sm text-accent font-bold select-none shrink-0">
                guest@naman-rai:~$
              </span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={booting ? 'System loading...' : "Type command... (e.g. help, skills, tools)"}
                disabled={booting}
                className="flex-1 bg-transparent font-mono text-xs md:text-sm text-text1 outline-none border-none placeholder-text3 disabled:opacity-50"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                onClick={() => runCommand(commandInput)}
                disabled={booting}
                className="p-1.5 text-text3 hover:text-accent transition-colors duration-200 disabled:opacity-50"
                title="Send Command"
              >
                <CornerDownLeft size={16} />
              </button>
            </div>
          </div>

          {/* Quick Pill Controls */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center select-none">
            {quickPills.map((pill) => (
              <button
                key={pill}
                onClick={() => runCommand(pill)}
                disabled={booting}
                className="px-3.5 py-1.5 rounded-full border border-border/60 bg-surface/50 text-text2 hover:text-accent hover:border-accent/40 font-mono text-[11px] transition-all duration-200 shadow-glow-sm hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {pill === 'clear' ? 'clear' : `./${pill}`}
              </button>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
