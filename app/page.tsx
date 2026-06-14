'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Preloader from '@/components/Preloader';
import { AchievementProvider } from '@/components/AchievementTracker';

function SectionSkeleton() {
  return <div className="section min-h-[200px]" aria-hidden="true" />;
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

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Disable browser scroll restoration on mount
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Reset scroll to top when loading is completed
  const handleLoadingComplete = () => {
    setLoading(false);
    window.scrollTo(0, 0);
    // Double check on next animation frame
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  };

  return (
    <AchievementProvider>
      <Preloader onComplete={handleLoadingComplete} />
      {!loading && (
        <main className="relative">
          <Nav />
          <Hero />
          <Stats />
          <Work />
          <Experience />
          <Skills />
          <About />
          <Contact />
          <EnquiryModal />
        </main>
      )}
    </AchievementProvider>
  );
}
