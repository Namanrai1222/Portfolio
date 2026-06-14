import React from 'react';

// ─── Project ────────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  num: string;
  title: string;
  description: string;
  tags: string[];
  tech: string;
  category: 'ml' | 'fullstack' | 'automation';
  github?: string;
  live?: string;
  status: 'completed' | 'upcoming';
}

// ─── Skills ─────────────────────────────────────────────────────────────────
export type SkillGroup = 'languages' | 'ml' | 'web';

export interface Skill {
  name: string;
  level: number;
  group: SkillGroup;
}

// ─── Stats ──────────────────────────────────────────────────────────────────
export interface StatItem {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  numericValue: number;
}

// ─── Nav ────────────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
}

// ─── Motion ─────────────────────────────────────────────────────────────────
export type MotionDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'clip-up';

// ─── ScrollReveal Props ──────────────────────────────────────────────────────
export interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: MotionDirection;
  delay?: number;
  className?: string;
  stagger?: number;
}

// ─── Certification ──────────────────────────────────────────────────────────
export interface Certification {
  issuer: string;
  title: string;
}

// ─── Experience ─────────────────────────────────────────────────────────────
export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
}

// ─── Tool Pill ───────────────────────────────────────────────────────────────
export interface ToolPill {
  name: string;
}
