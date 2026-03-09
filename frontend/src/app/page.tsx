'use client';

import { useState, useEffect } from 'react';
import { PreLoader } from "@/components/PreLoader";
import { TopBar } from "@/components/TopBar";
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Service } from '@/components/Service';
import { About } from '@/components/About';
// import { SpecialDish } from '@/components/SpecialDish';
import { Menu } from '@/components/Menu';
import { Reservation } from '@/components/Reservation';
import { Features } from '@/components/Features';
// import { Event } from '@/components/Event';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { EventHall } from '@/components/EventHall';
import { Testimonial } from '@/components/Testimonial';

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [startExit, setStartExit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartExit(true);
    }, 750);

    return () => clearTimeout(timer);
  }, []);

  const handleLoadComplete = () => {
    setShowPreloader(false);
    document.body.classList.add('loaded');
  };

  return (
    <>
      {showPreloader && (
        <PreLoader startExit={startExit} onLoadComplete={handleLoadComplete} />
      )}
      {!showPreloader && (
        <>
          <TopBar />
          <Header />
          <main>
            <article>
              <Hero />
              <Service />
              <About />
              {/* <SpecialDish /> */}
              <Menu />
              <EventHall />
              <Testimonial />
              <Reservation />
              <Features />
              {/* <Event /> */}
            </article>
          </main>
          <Footer />
          <BackToTop />
        </>
      )}
    </>
  );
}