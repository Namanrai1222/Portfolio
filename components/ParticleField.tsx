'use client';

// PERF FIX: THREE.js WebGL particle field removed entirely.
// Always uses the lightweight CSS dot-grid fallback.
// Rationale: WebGL canvas adds ~150KB JS, a continuous RAF loop, GPU memory,
// and re-initializes on theme change. The CSS version is visually equivalent
// and costs zero JS/GPU overhead.

import { useAchievements } from './AchievementTracker';

export default function ParticleField() {
  const { theme } = useAchievements();
  const colorHex =
    theme === 'sunset' ? '#F97316' : theme === 'vaporwave' ? '#EC4899' : '#E27D60';

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `radial-gradient(circle, ${colorHex} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial fade so dots don't crowd the center */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, var(--color-bg) 80%)',
        }}
      />
    </div>
  );
}
