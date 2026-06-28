'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Volume2, VolumeX, Sparkles } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  welcome: {
    id: 'welcome',
    title: 'Hello World!',
    description: 'Entered Naman\'s interactive portfolio space.',
    icon: '👋',
  },
  terminal_pro: {
    id: 'terminal_pro',
    title: 'Terminal Master',
    description: 'Discovered the hidden secrets of the shell.',
    icon: '💻',
  },
  chatbot_friend: {
    id: 'chatbot_friend',
    title: 'Interrogator',
    description: 'Had a detailed chat with virtual Naman.',
    icon: '🤖',
  },
  cv_downloaded: {
    id: 'cv_downloaded',
    title: 'Resume Hunter',
    description: 'Grabbed a copy of Naman\'s credentials.',
    icon: '📄',
  },
  social_connect: {
    id: 'social_connect',
    title: 'Networker',
    description: 'Checked out Naman\'s digital coordinates.',
    icon: '🔗',
  },
  easter_egg: {
    id: 'easter_egg',
    title: 'Easter Egg Finder',
    description: 'Unlocked the hidden terminal command.',
    icon: '🥚',
  },
  theme_switched: {
    id: 'theme_switched',
    title: 'Dimensional Traveler',
    description: 'Switched visual dimensions (color themes).',
    icon: '🔮',
  },
};

interface AchievementContextType {
  unlocked: string[];
  unlock: (id: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  theme: string;
  changeTheme: (newTheme: string) => void;
}

const AchievementContext = createContext<AchievementContextType>({
  unlocked: [],
  unlock: () => {},
  soundEnabled: true,
  setSoundEnabled: () => {},
  theme: 'emerald',
  changeTheme: () => {},
});

export const useAchievements = () => useContext(AchievementContext);

// ─── Floating Dev Console Widget Removed ───────────────────────────────────────
// (Removed to reduce visual clutter and performance overhead)

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState('emerald');
  const [activeAlert, setActiveAlert] = useState<Achievement | null>(null);
  
  const queue = useRef<Achievement[]>([]);
  const alerted = useRef<string[]>([]);

  // Load achievements from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('naman_achievements');
    if (saved) {
      try {
        const list = JSON.parse(saved);
        setUnlocked(list);
        alerted.current = list; // mark loaded achievements as already alerted
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('naman_theme') || 'emerald';
    setTheme(savedTheme);
    if (savedTheme === 'emerald') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const playSynthSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Chime sequence
      const now = ctx.currentTime;
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        
        osc.start(start);
        osc.stop(start + duration);
      };

      // Play major pentatonic arpeggio (C5, E5, G5, C6)
      playTone(523.25, now, 0.4);       // C5
      playTone(659.25, now + 0.08, 0.4);  // E5
      playTone(783.99, now + 0.16, 0.4);  // G5
      playTone(1046.50, now + 0.24, 0.6); // C6
    } catch (e) {
      console.warn('Audio Context failed to start (interaction required):', e);
    }
  }, [soundEnabled]);

  const processQueue = useCallback(() => {
    if (activeAlert || queue.current.length === 0) return;
    const next = queue.current.shift()!;
    setActiveAlert(next);
    playSynthSound();
  }, [activeAlert, playSynthSound]);

  const unlock = useCallback((id: string) => {
    if (!ACHIEVEMENTS[id]) return;
    setUnlocked((prev) => {
      if (prev.includes(id)) return prev;
      const newUnlocked = [...prev, id];
      try {
        localStorage.setItem('naman_achievements', JSON.stringify(newUnlocked));
      } catch (e) {
        console.error(e);
      }
      return newUnlocked;
    });
  }, []);

  // Listen to unlocked achievements and trigger alerts safely outside render
  useEffect(() => {
    if (unlocked.length === 0) return;
    
    let shouldProcess = false;
    unlocked.forEach((id) => {
      if (!alerted.current.includes(id)) {
        alerted.current.push(id);
        const achievement = ACHIEVEMENTS[id];
        if (achievement) {
          queue.current.push(achievement);
          shouldProcess = true;
        }
      }
    });

    if (shouldProcess) {
      processQueue();
    }
  }, [unlocked, processQueue]);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('naman_theme', newTheme);
    if (newTheme === 'emerald') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
    unlock('theme_switched');
  };

  useEffect(() => {
    if (!activeAlert && queue.current.length > 0) {
      const timer = setTimeout(() => {
        processQueue();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeAlert, processQueue]);

  return (
    <AchievementContext.Provider value={{ unlocked, unlock, soundEnabled, setSoundEnabled, theme, changeTheme }}>
      {children}
      
      {/* HUD Panel: Sound & Themes */}
      <div className="fixed bottom-6 left-6 z-[99] flex items-center gap-3">
        {/* Sound Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="w-10 h-10 rounded-full border border-border/80 bg-background/90 backdrop-blur-md flex items-center justify-center text-text2 hover:text-accent hover:border-accent/40 transition-all duration-300 shadow-glow-sm"
          title={soundEnabled ? 'Mute Interface Sounds' : 'Unmute Interface Sounds'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Theme Toggles */}
        <div className="flex items-center gap-1.5 bg-background/90 border border-border/80 rounded-full p-1 backdrop-blur-md shadow-glow-sm">
          {[
            { id: 'emerald', color: 'bg-emerald-400', name: 'Emerald' },
            { id: 'sunset', color: 'bg-orange-500', name: 'Sunset' },
            { id: 'vaporwave', color: 'bg-pink-500', name: 'Vaporwave' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => changeTheme(t.id)}
              className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 hover:scale-110 ${
                theme === t.id ? 'border-text1 scale-105' : 'border-transparent'
              }`}
              title={`${t.name} Mode`}
            >
              <span className={`w-3.5 h-3.5 rounded-full ${t.color}`} />
            </button>
          ))}
        </div>

        {/* Achievement Counters */}
        {unlocked.length > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/80 bg-background/90 backdrop-blur-md font-mono text-[10px] text-accent font-semibold shadow-glow-sm">
            <Trophy size={11} className="text-accent animate-pulse" />
            <span>{unlocked.length}/{Object.keys(ACHIEVEMENTS).length} ACHIEVED</span>
          </div>
        )}
      </div>



      {/* Achievement Notification Banner */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div
            initial={{ opacity: 0, x: 50, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            className="fixed top-6 right-6 z-[9999] w-[320px] bg-surface/95 border border-accent/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(110,231,183,0.15)] backdrop-blur-lg flex gap-4 items-center"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl relative flex-shrink-0">
              <span className="relative z-10">{activeAlert.icon}</span>
              <div className="absolute inset-0 bg-accent/5 rounded-xl blur-[3px] animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-mono text-[9px] text-accent tracking-wider font-bold uppercase flex items-center gap-1">
                <Sparkles size={9} /> Achievement Unlocked!
              </span>
              <h4 className="font-syne font-extrabold text-sm text-text1 truncate leading-tight mt-0.5">
                {activeAlert.title}
              </h4>
              <p className="font-dm text-xs text-text2 truncate leading-normal mt-0.5">
                {activeAlert.description}
              </p>
            </div>
            <button
              onClick={() => setActiveAlert(null)}
              className="text-text3 hover:text-text2 font-mono text-xs p-1"
            >
              [x]
            </button>

            {/* Micro timer bar */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent rounded-b-2xl origin-left"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4.5, ease: 'linear' }}
              onAnimationComplete={() => setActiveAlert(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AchievementContext.Provider>
  );
}
