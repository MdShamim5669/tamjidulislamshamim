'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CanvasSequence from '../components/CanvasSequence';
import Skills from '../components/Skills';
import Education from '../components/Education';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Courses from '../components/Courses';
import Services from '../components/Services';
import Contact from '../components/Contact';
import AdminCvModal from '../components/AdminCvModal';

export default function Home() {
  const [isAdminCvOpen, setIsAdminCvOpen] = useState(false);

  // Global shortcut: Ctrl + Shift + C or Cmd + Shift + C to toggle Admin CV Manager
  // and interactive card mouse move / smooth scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setIsAdminCvOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Interactive Tilt / Mouse Glow on Cards
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll('.project-card, .split-col, .testimonial-card, .service-accordion-item');
      cards.forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Smooth Anchor Scroll with Navbar Header Offset
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (target) {
        const href = target.getAttribute('href');
        if (href && href !== '#' && href.startsWith('#')) {
          const targetEl = document.querySelector(href);
          if (targetEl) {
            e.preventDefault();
            const headerOffset = 76;
            const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: targetPos,
              behavior: 'smooth'
            });
          }
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <>
      {/* 1. Interactive 120-Frame Canvas Scroll Animation */}
      <CanvasSequence />

      {/* 2. Floating Navbar */}
      <Navbar onOpenAdminCv={() => setIsAdminCvOpen(true)} />

      {/* 3. Main Page Container */}
      <main className="page-wrapper">
        {/* Hero Section */}
        <Hero />

        {/* Skills Section */}
        <Skills />

        {/* Education & Work Process */}
        <Education />

        {/* Selected Projects */}
        <Projects />

        {/* Work Experience */}
        <Experience />

        {/* Udemy Courses Developed */}
        <Courses />

        {/* Services & Specialization */}
        <Services />

        {/* Contact & Footer */}
        <Contact />
      </main>

      {/* Admin CV Drag & Drop Modal (accessible via shortcut or admin dashboard) */}
      <AdminCvModal
        isOpen={isAdminCvOpen}
        onClose={() => setIsAdminCvOpen(false)}
      />
    </>
  );
}
