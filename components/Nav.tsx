'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import { CursorHover } from './Cursor';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const backgroundColor = useTransform(
    scrollY,
    [0, 80],
    ['rgba(8, 10, 15, 0)', 'rgba(8, 10, 15, 0.85)']
  );
  const backdropFilter = useTransform(
    scrollY,
    [0, 80],
    ['blur(0px)', 'blur(20px)']
  );
  const borderBottomColor = useTransform(
    scrollY,
    [0, 80],
    ['rgba(28, 31, 46, 0)', 'rgba(28, 31, 46, 1)']
  );

  // Track active section
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => item.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // Close menu on resize
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          backgroundColor: prefersReducedMotion
            ? 'rgba(8,10,15,0.9)'
            : backgroundColor,
          backdropFilter: prefersReducedMotion ? 'blur(20px)' : backdropFilter,
          borderBottomColor: prefersReducedMotion
            ? 'rgba(28,31,46,1)'
            : borderBottomColor,
        }}
      >
        <div className="container-max">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <CursorHover label="HOME">
              <Link href="/" className="group">
                <motion.span
                  className="font-syne font-black text-xl text-text1 inline-flex"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {/* N and R split on hover */}
                  <motion.span
                    className="inline-block"
                    whileHover={{ x: -3 }}
                    transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                  >
                    N
                  </motion.span>
                  <motion.span
                    className="inline-block text-accent"
                    whileHover={{ x: 3 }}
                    transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                  >
                    R
                  </motion.span>
                </motion.span>
              </Link>
            </CursorHover>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <div key={item.href} className="relative">
                  <CursorHover label={item.label.toUpperCase()}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        if (item.href === '#contact') {
                          e.preventDefault();
                          window.dispatchEvent(new CustomEvent('open-enquiry'));
                        }
                      }}
                      className="font-dm text-sm text-text2 hover:text-text1 transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  </CursorHover>
                  {activeSection === item.href.replace('#', '') && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
              ))}
              <CursorHover label="HIRE">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent('open-enquiry'));
                  }}
                  className="font-dm text-sm text-accent border border-accent/30 rounded-full px-5 py-2 hover:border-accent hover:bg-accent/5 transition-all duration-200"
                >
                  Hire Me →
                </a>
              </CursorHover>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-text2 hover:text-text1 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="nav-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              className="absolute top-5 right-6 text-text2 hover:text-text1"
              onClick={() => setMenuOpen(false)}
            >
              <X size={24} />
            </button>
            {NAV_ITEMS.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="font-syne font-bold text-5xl text-text1 hover:text-accent transition-colors"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => {
                  setMenuOpen(false);
                  if (item.href === '#contact') {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent('open-enquiry'));
                  }
                }}
              >
                {item.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              className="font-dm text-sm text-accent border border-accent/30 rounded-full px-6 py-3 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              onClick={(e) => {
                setMenuOpen(false);
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('open-enquiry'));
              }}
            >
              Hire Me →
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
