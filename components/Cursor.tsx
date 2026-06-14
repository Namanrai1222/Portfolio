'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';

// ─── Context ──────────────────────────────────────────────────────────────────
interface CursorContextType {
  setCursorLabel: (label: string) => void;
  setCursorVariant: (variant: 'default' | 'hover' | 'card') => void;
}

const CursorContext = createContext<CursorContextType>({
  setCursorLabel: () => {},
  setCursorVariant: () => {},
});

export function useCursor() {
  return useContext(CursorContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CursorProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'card'>('default');
  const [cursorLabel, setCursorLabel] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { stiffness: 400, damping: 28, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Small dot follows exactly — no spring
  const dotX = mouseX;
  const dotY = mouseY;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    },
    [mouseX, mouseY, isVisible]
  );

  const handleMouseLeave = useCallback(() => setIsVisible(false), []);
  const handleMouseEnter = useCallback(() => setIsVisible(true), []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter, prefersReducedMotion]);

  const cursorSize = cursorVariant === 'default' ? 48 : 80;

  return (
    <CursorContext.Provider value={{ setCursorLabel, setCursorVariant }}>
      {children}
      {!prefersReducedMotion && (
        <>
          {/* Large circle */}
          <AnimatePresence>
            {isVisible && (
              <motion.div
                key="cursor-circle"
                className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
                style={{
                  x: cursorX,
                  y: cursorY,
                  translateX: '-50%',
                  translateY: '-50%',
                  mixBlendMode: 'difference',
                }}
                animate={{
                  width: cursorSize,
                  height: cursorSize,
                  opacity: 1,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{
                    width: cursorSize,
                    height: cursorSize,
                    borderWidth: cursorVariant !== 'default' ? 1.5 : 1,
                    borderColor:
                      cursorVariant !== 'default' ? '#6EE7B7' : 'rgba(240,244,255,0.5)',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="rounded-full border flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                >
                  <AnimatePresence mode="wait">
                    {cursorLabel ? (
                      <motion.span
                        key={cursorLabel}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        className="text-white font-syne font-bold text-[10px] tracking-widest uppercase"
                        style={{ mixBlendMode: 'difference' }}
                      >
                        {cursorLabel}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Small dot — exact position, no lag */}
          <AnimatePresence>
            {isVisible && (
              <motion.div
                key="cursor-dot"
                className="fixed top-0 left-0 pointer-events-none z-[9999] w-[6px] h-[6px] rounded-full bg-white"
                style={{
                  x: dotX,
                  y: dotY,
                  translateX: '-50%',
                  translateY: '-50%',
                  mixBlendMode: 'difference',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </CursorContext.Provider>
  );
}

// ─── Hover wrapper (attach to interactive elements) ───────────────────────────
export function CursorHover({
  children,
  label = 'VIEW',
  variant = 'hover',
  className,
}: {
  children: React.ReactNode;
  label?: string;
  variant?: 'hover' | 'card';
  className?: string;
}) {
  const { setCursorLabel, setCursorVariant } = useCursor();

  return (
    <div
      className={className}
      onMouseEnter={() => {
        setCursorLabel(label);
        setCursorVariant(variant);
      }}
      onMouseLeave={() => {
        setCursorLabel('');
        setCursorVariant('default');
      }}
    >
      {children}
    </div>
  );
}
