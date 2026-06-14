'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PRELOAD_LOGS = [
  'INITIALIZING COGNITIVE INTERFACES...',
  'ESTABLISHING DATA PIPELINES (NIET CSE)...',
  'BOOTING INDEVAA STUDIO ENGINE (PRAYAGRAJ)...',
  'LOADING GAUSSIAN NLP MODELS...',
  'MOUNTING VECTORVAULT STACK...',
  'ACTIVATING BASH INTERACTIVE INTERPRETER...',
  'SYSTEM ONLINE. DEPLOYING PORTFOLIO...',
];

const EXIT_EASE = [0.76, 0, 0.24, 1] as const;
const EXIT_DURATION = 0.8;

export default function Preloader({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState(PRELOAD_LOGS[0]);
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const duration = 2400;
    let logIdx = 0;
    let rafId = 0;
    let exitStarted = false;
    const start = performance.now();

    const tick = (now: number) => {
      const timePassed = now - start;
      const pct = Math.min(Math.floor((timePassed / duration) * 100), 100);

      setProgress((prev) => (prev !== pct ? pct : prev));

      const targetLogIdx = Math.min(
        Math.floor((pct / 100) * PRELOAD_LOGS.length),
        PRELOAD_LOGS.length - 1
      );
      if (targetLogIdx !== logIdx) {
        logIdx = targetLogIdx;
        setCurrentLog(PRELOAD_LOGS[logIdx]);
      }

      if (pct >= 100 && !exitStarted) {
        exitStarted = true;
        window.setTimeout(() => {
          setIsExiting(true);
          window.setTimeout(() => {
            onCompleteRef.current();
            setVisible(false);
          }, EXIT_DURATION * 1000);
        }, 300);
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col justify-between bg-background p-8 md:p-16 overflow-hidden pointer-events-auto"
          initial={false}
          exit={{ opacity: 1 }}
          transition={{ duration: EXIT_DURATION, ease: EXIT_EASE }}
        >
          {/* Top Panel Wipe — transform-only for GPU compositing */}
          <motion.div
            className="panel-wipe absolute top-0 left-0 right-0 h-1/2 bg-background border-b border-border/20 flex flex-col justify-end p-8 md:p-16 select-none"
            initial={false}
            animate={isExiting ? { y: '-100%' } : { y: '0%' }}
            transition={{ duration: EXIT_DURATION, ease: EXIT_EASE }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 w-full max-w-container mx-auto">
              <span className="font-mono text-xs text-accent/60 tracking-wider">
                IND.ENG // PROTOCOL V4.2
              </span>
              <span className="font-mono text-xs text-text3">SYSTEM: ACTIVE</span>
            </div>
          </motion.div>

          {/* Core Content Layer */}
          <div className="flex-1 flex flex-col justify-center items-center w-full max-w-container mx-auto relative z-10 my-auto">
            <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_200px] gap-8 items-center">
              <div className="font-mono text-xs text-text2 text-left space-y-2 h-[80px] flex flex-col justify-end">
                <div className="text-text3 select-none">{'// BOOT LOGGER'}</div>
                <motion.div
                  key={currentLog}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-accent flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  {currentLog}
                </motion.div>
                <div className="text-text3 text-[10px]">
                  BYTES TRANSFER: {(progress * 409.6).toFixed(1)} KB / 40.0 MB
                </div>
              </div>

              <div className="flex md:justify-end items-baseline">
                <span className="font-syne font-black text-8xl md:text-9xl text-text1 leading-none select-none tracking-tighter">
                  {progress.toString().padStart(3, '0')}
                </span>
                <span className="font-mono text-accent text-lg font-bold ml-1">%</span>
              </div>
            </div>

            <div className="w-full h-[1px] bg-border/40 mt-8 relative overflow-hidden">
              <div
                className="absolute left-0 top-0 bottom-0 bg-accent transition-[width] duration-150 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Bottom Panel Wipe — transform-only for GPU compositing */}
          <motion.div
            className="panel-wipe absolute bottom-0 left-0 right-0 h-1/2 bg-background border-t border-border/20 flex flex-col justify-start p-8 md:p-16 select-none"
            initial={false}
            animate={isExiting ? { y: '100%' } : { y: '0%' }}
            transition={{ duration: EXIT_DURATION, ease: EXIT_EASE }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 w-full max-w-container mx-auto mt-auto">
              <span className="font-mono text-xs text-text3">
                AKTU - NIET DATA SCIENCE BRANCH
              </span>
              <span className="font-mono text-[10px] text-accent/60 tracking-widest uppercase">
                NAMAN RAI PORTFOLIO v3.0
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
