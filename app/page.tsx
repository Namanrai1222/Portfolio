'use client';

import { useState, useEffect } from 'react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Work from '@/components/Work';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Preloader from '@/components/Preloader';
import EnquiryModal from '@/components/EnquiryModal';
import { AchievementProvider } from '@/components/AchievementTracker';

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
