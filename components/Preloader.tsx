'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PRELOAD_LOGS = [
  'INITIALIZING COGNITIVE INTERFACES...',
  'ESTABLISHING DATA PIPELINES (NIET CSE)...',
  'BOOTING INDEVAA STUDIO ENGINE (PRAYAGRAJ)...',
  'LOADING GAUSSIAN NLP MODELS...',
  'MOUNTING VECTORVAULT STACK...',
  'ACTIVATING BASH INTERACTIVE INTERPRETER...',
  'SYSTEM ONLINE. DEPLOYING PORTFOLIO...'
];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState('');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let start = Date.now();
    const duration = 2400; // 2.4s load time
    let logIdx = 0;

    const timer = setInterval(() => {
      const timePassed = Date.now() - start;
      const pct = Math.min(Math.floor((timePassed / duration) * 100), 100);
      setProgress(pct);

      // Rotate through logs based on progress
      const targetLogIdx = Math.min(
        Math.floor((pct / 100) * PRELOAD_LOGS.length),
        PRELOAD_LOGS.length - 1
      );
      if (targetLogIdx !== logIdx) {
        logIdx = targetLogIdx;
        setCurrentLog(PRELOAD_LOGS[logIdx]);
      }

      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 800); // match exit transition
        }, 300);
      }
    }, 30);

    setCurrentLog(PRELOAD_LOGS[0]);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col justify-between bg-background p-8 md:p-16 overflow-hidden"
          exit={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%, 0% 50%, 100% 50%, 100% 100%, 0% 100%)',
          }}
        >
          {/* Top Panel Wipe */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1/2 bg-background border-b border-border/20 flex flex-col justify-end p-8 md:p-16 select-none"
            exit={{
              y: '-100%',
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 w-full max-w-container mx-auto">
              <span className="font-mono text-xs text-accent/60 tracking-wider">
                IND.ENG // PROTOCOL V4.2
              </span>
              <span className="font-mono text-xs text-text3">
                SYSTEM: ACTIVE
              </span>
            </div>
          </motion.div>

          {/* Core Content Layer */}
          <div className="flex-1 flex flex-col justify-center items-center w-full max-w-container mx-auto relative z-10 my-auto">
            <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_200px] gap-8 items-center">
              
              {/* Terminal-like logging logs */}
              <div className="font-mono text-xs text-text2 text-left space-y-2 h-[80px] flex flex-col justify-end">
                <div className="text-text3 select-none">{"// BOOT LOGGER"}</div>
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

              {/* Huge percentage display */}
              <div className="flex md:justify-end items-baseline">
                <span className="font-syne font-black text-8xl md:text-9xl text-text1 leading-none select-none tracking-tighter">
                  {progress.toString().padStart(3, '0')}
                </span>
                <span className="font-mono text-accent text-lg font-bold ml-1">%</span>
              </div>
            </div>

            {/* Static layout line */}
            <div className="w-full h-[1px] bg-border/40 mt-8 relative overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 bottom-0 bg-accent"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Bottom Panel Wipe */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-background border-t border-border/20 flex flex-col justify-start p-8 md:p-16 select-none"
            exit={{
              y: '100%',
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
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
