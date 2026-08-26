'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import TypewriterText from './TypewriterText';

const defaultExperiences = [
  {
    id: 'exp-1',
    role: 'AI Content Development Intern',
    company: 'ALGORIZIN',
    location: 'Remote',
    employmentType: 'Internship / AI Content',
    startDate: 'Feb 2026',
    endDate: 'June 2026',
    current: false,
    description: 'Designed AI-powered learning content using Claude, ChatGPT, Gamma, and HeyGen. Leveraged prompt engineering and AI automation to improve course development workflows.',
    bullets: [
      'Designed AI-powered learning content using Claude, ChatGPT, Gamma, and HeyGen.',
      'Leveraged prompt engineering and AI automation to improve course development workflows.',
      'Created and published 5 comprehensive technical courses on Udemy.'
    ],
    techStack: ['Claude 3.5', 'ChatGPT', 'Gamma', 'HeyGen', 'Prompt Engineering', 'AI Automation', 'Udemy']
  }
];

export default function Experience() {
  const [scrollProgress, setScrollProgress] = useState(15);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: experiences = defaultExperiences } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      try {
        const res = await api.get('/experiences');
        if (res.data?.data && res.data.data.length > 0) return res.data.data;
      } catch (e) {
        // Fallback
      }
      return defaultExperiences;
    },
    initialData: defaultExperiences,
  });

  // Calculate dynamic scroll progress (Down to Up, Up to Down)
  useEffect(() => {
    const updateScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start when top of timeline is at 75% of viewport, finish when bottom is at 35% of viewport
      const startTrigger = windowHeight * 0.75;
      const endTrigger = windowHeight * 0.35;

      const totalDistance = rect.height + (startTrigger - endTrigger);
      const currentDistance = startTrigger - rect.top;

      const progress = Math.min(Math.max(currentDistance / totalDistance, 0), 1);
      setScrollProgress(progress * 100);
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  return (
    <section className="ref-experience-section" id="experience">
      {/* Section Top Editorial Header */}
      <div className="ref-exp-header-center">
        <div className="ref-exp-badge-pill">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <span>PROFESSIONAL JOURNEY</span>
        </div>

        <h2 className="ref-exp-main-title">
          Work <span className="ref-exp-title-accent">Experience</span>
          <span className="ref-exp-cursor-pipe">|</span>
        </h2>
      </div>

      {/* Timeline & Experience Card Container */}
      <div className="ref-exp-timeline-wrapper" ref={containerRef}>
        {/* Inactive Base Track Line */}
        <div className="ref-exp-timeline-base-line"></div>

        {/* Dynamic Glowing Filled Beam (Fills down on scroll down, retreats up on scroll up) */}
        <div
          className="ref-exp-timeline-fill-beam"
          style={{ height: `${scrollProgress}%` }}
        ></div>

        {/* Animated Traveling Glowing Node (Moves down on scroll down, moves up on scroll up) */}
        <div
          className="ref-exp-traveling-node"
          style={{ top: `${scrollProgress}%` }}
        >
          <div className="ref-node-inner-core"></div>
          <div className="ref-node-halo"></div>
        </div>

        <div className="ref-exp-cards-column">
          {experiences.map((exp: any, index: number) => {
            const dateRange = `${exp.startDate || 'Feb 2026'} — ${exp.endDate || 'June 2026'}`;
            const bulletsArray = Array.isArray(exp.bullets)
              ? exp.bullets
              : (typeof exp.bullets === 'string' ? JSON.parse(exp.bullets) : []);

            return (
              <div className="ref-exp-item-container" key={exp.id || index}>
                {/* Pure Transparent Luxury Editorial Card */}
                <div className="ref-exp-card-box">
                  {/* Top Bar: Date Range on Left | Company Badge on Right */}
                  <div className="ref-exp-top-bar">
                    <div className="ref-exp-date-pill">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>{dateRange}</span>
                    </div>

                    <div className="ref-exp-company-badge">
                      <span className="company-sparkle">✦</span>
                      <span>{exp.company || 'ALGORIZIN'}</span>
                    </div>
                  </div>

                  {/* High-Impact Role Title */}
                  <h3 className="ref-exp-role-title">
                    <TypewriterText text={exp.role || 'AI Content Development Intern'} />
                  </h3>

                  {/* Overview Editorial Paragraph */}
                  {exp.description && (
                    <p className="ref-exp-overview-desc">{exp.description}</p>
                  )}

                  {/* Key Deliverables Eyebrow Header */}
                  <div className="ref-exp-deliverables-header">
                    <span className="ref-exp-hash-icon">❖</span>
                    <span>KEY ENGINEERING DELIVERABLES</span>
                  </div>

                  {/* Deliverables List (Capsules with Checkmark Icons) */}
                  <div className="ref-exp-deliverables-list">
                    {bulletsArray.map((bullet: string, bIdx: number) => (
                      <div className="ref-exp-deliverable-item" key={bIdx}>
                        <div className="ref-exp-check-circle">
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.8">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="ref-exp-deliverable-text">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
