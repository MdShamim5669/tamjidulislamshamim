'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  onOpenAdminCv?: () => void;
}

export default function Navbar({ onOpenAdminCv }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('skills');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['skills', 'education', 'projects', 'experience', 'courses', 'services', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="floating-navbar navbar-container" id="navbar">
      {/* Brand - Glides Smoothly to Top */}
      <a href="#hero" className="nav-brand" onClick={scrollToTop} aria-label="Go to top">
        <div className="brand-details brand-text">
          <span className="brand-name">MD. SAMIM</span>
          {/* <span className="brand-role">AI &amp; Backend Specialist</span> */}
        </div>
      </a>


      {/* Floating Navbar Links */}
      <nav className="nav-menu">
        <a
          href="#skills"
          className={`nav-item ${activeSection === 'skills' ? 'active' : ''}`}
          onClick={(e) => scrollToSection(e, 'skills')}
        >
          Skills
        </a>
        <a
          href="#education"
          className={`nav-item ${activeSection === 'education' ? 'active' : ''}`}
          onClick={(e) => scrollToSection(e, 'education')}
        >
          Education
        </a>
        <a
          href="#projects"
          className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`}
          onClick={(e) => scrollToSection(e, 'projects')}
        >
          Projects
        </a>
        <a
          href="#experience"
          className={`nav-item ${activeSection === 'experience' ? 'active' : ''}`}
          onClick={(e) => scrollToSection(e, 'experience')}
        >
          Experience
        </a>
        <a
          href="#courses"
          className={`nav-item ${activeSection === 'courses' ? 'active' : ''}`}
          onClick={(e) => scrollToSection(e, 'courses')}
        >
          Courses
        </a>
        <a
          href="#services"
          className={`nav-item ${activeSection === 'services' ? 'active' : ''}`}
          onClick={(e) => scrollToSection(e, 'services')}
        >
          Services
        </a>
      </nav>

      {/* Action Buttons: Let's Talk CTA */}
      <div className="nav-action">
        <a
          href="#contact"
          className="nav-talk-btn"
          onClick={(e) => {
            scrollToSection(e, 'contact');
            setTimeout(() => {
              const input = document.getElementById('form-name');
              if (input) input.focus();
            }, 600);
          }}
        >
          <span className="nav-status-pulse"></span>
          <span>Let's Talk</span>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" className="arrow-up-right">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </a>
      </div>
    </header>
  );
}
