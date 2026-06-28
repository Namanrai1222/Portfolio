'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Preloader from '@/components/Preloader';
import { AchievementProvider } from '@/components/AchievementTracker';

function SectionSkeleton() {
  // Note: NOT using className="section" here to avoid scroll-margin-top
  // interacting with browser anchor restoration during section mount
  return <div className="min-h-[200px]" aria-hidden="true" />;
}

const Stats = dynamic(() => import('@/components/Stats'), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const Work = dynamic(() => import('@/components/Work'), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const Experience = dynamic(() => import('@/components/Experience'), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const Skills = dynamic(() => import('@/components/Skills'), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const About = dynamic(() => import('@/components/About'), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const Contact = dynamic(() => import('@/components/Contact'), {
  ssr: false,
  loading: () => <SectionSkeleton />,
});

const EnquiryModal = dynamic(() => import('@/components/EnquiryModal'), {
  ssr: false,
  loading: () => null,
});

function markBootComplete() {
  document.body.classList.remove('boot-active');
  document.documentElement.classList.remove('boot-active');
  document.body.classList.add('boot-complete');
  window.dispatchEvent(new Event('boot-complete'));
}

export default function Home() {
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    document.body.classList.add('boot-active');
    document.documentElement.classList.add('boot-active');

    // Prevent browser from restoring scroll position from session history
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Strip any URL hash so browser anchor-restoration can't jump to #about etc.
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    // Force top immediately
    window.scrollTo(0, 0);

    // Warm below-fold chunks while the boot sequence runs
    void import('@/components/Stats');
    void import('@/components/Work');
    void import('@/components/Experience');
    void import('@/components/Skills');
    void import('@/components/About');
    void import('@/components/Contact');

    return () => {
      document.body.classList.remove('boot-active');
      document.documentElement.classList.remove('boot-active');
    };
  }, []);

  const handleLoadingComplete = useCallback(() => {
    markBootComplete();
    setPreloaderVisible(false);

    // SCROLL FIX: setBootComplete first so React mounts the sections,
    // then use double-rAF to ensure we scrollTo(0,0) AFTER the browser
    // has painted the newly mounted section DOM — not before.
    setBootComplete(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      });
    });
  }, []);

  return (
    <AchievementProvider>
      <main className="relative">
        <Nav />
        <Hero />
        {bootComplete && (
          <>
            <Stats />
            <Work />
            <Experience />
            <Skills />
            <About />
            <Contact />
            <EnquiryModal />
          </>
        )}
      </main>
      {preloaderVisible && <Preloader onComplete={handleLoadingComplete} />}
    </AchievementProvider>
  );
}
