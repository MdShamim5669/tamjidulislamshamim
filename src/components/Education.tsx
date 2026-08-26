'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import TypewriterText from './TypewriterText';

const defaultEducations = [
  {
    id: 'edu-1',
    degree: 'Bachelor of Science in CSE',
    institution: 'Daffodil International University',
    year: '2021 — 2025',
    startDate: '2021',
    endDate: '2025',
    subject: 'Computer Science & Engineering',
    field: 'CSE'
  },
  {
    id: 'edu-2',
    degree: 'Higher Secondary Certificate (HSC)',
    institution: 'Bhola Government College',
    year: '2017 — 2019',
    startDate: '2017',
    endDate: '2019',
    subject: 'Science',
    field: 'Science'
  }
];

const modernProcessSteps = [
  {
    num: '01',
    title: 'Architecture & System Design',
    desc: 'Domain modeling & REST schema contracts'
  },
  {
    num: '02',
    title: 'Database & High-Throughput APIs',
    desc: 'PostgreSQL, Prisma ORM & secure auth'
  },
  {
    num: '03',
    title: 'AI Pipelines & Next.js Full-Stack',
    desc: 'Claude subagents, vector search & reactive UI'
  },
  {
    num: '04',
    title: 'Cloud CI/CD & Edge Deployment',
    desc: 'Dockerized microservices & health probes'
  }
];

export default function Education() {
  const [scrollProgress, setScrollProgress] = useState(15);
  const containerRef = useRef<HTMLDivElement>(null);

  // TanStack Query for dynamic academic degrees from backend
  const { data: educations = defaultEducations } = useQuery({
    queryKey: ['educations'],
    queryFn: async () => {
      try {
        const res = await api.get('/education');
        if (res.data?.data && res.data.data.length > 0) return res.data.data;
      } catch (e) {
        // Fallback
      }
      return defaultEducations;
    },
    initialData: defaultEducations,
  });

  // Calculate dynamic scroll progress (Down to Up, Up to Down)
  useEffect(() => {
    const updateScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

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
    <section className="ref-edu-process-section" id="education">
      {/* Section Top Editorial Header */}
      <div className="ref-edu-header-center">
        <div className="ref-edu-badge-pill">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
          </svg>
          <span>ACADEMIC &amp; WORKFLOW</span>
        </div>

        <h2 className="ref-edu-main-title">
          <TypewriterText
            text="Education & Process"
            highlightWord="Process"
            highlightClass="ref-edu-title-accent"
            sparkle="✦"
          />
        </h2>
      </div>

      {/* 2-Column Split Grid with Central Scrolling Animated Timeline */}
      <div className="ref-edu-two-column-wrapper" ref={containerRef}>
        {/* ============================================================
            CENTRAL TIMELINE SCROLL ANIMATION (BETWEEN 2 DIVS)
            ============================================================ */}
        <div className="ref-edu-center-timeline-track">
          {/* Base Inactive Track */}
          <div className="ref-edu-center-base-line"></div>

          {/* Dynamic Glowing Beam Fill */}
          <div
            className="ref-edu-center-fill-beam"
            style={{ height: `${scrollProgress}%` }}
          ></div>

          {/* Animated Traveling Glowing Node */}
          <div
            className="ref-edu-center-traveling-node"
            style={{ top: `${scrollProgress}%` }}
          >
            <div className="ref-node-inner-core"></div>
            <div className="ref-node-halo"></div>
          </div>
        </div>

        {/* ============================================================
            DIV 1 (LEFT): DYNAMIC ACADEMIC EDUCATION (CLEAN & MINIMAL)
            ============================================================ */}
        <div className="ref-simple-edu-card">
          <div className="ref-simple-card-header">
            <div className="ref-simple-tag-pill">
              <span className="simple-dot-gold"></span>
              <span>ACADEMIC MILESTONES</span>
            </div>
            <span className="ref-simple-count-badge">{educations.length} DEGREES</span>
          </div>

          <div className="ref-simple-edu-list">
            {educations.map((edu: any, index: number) => {
              const degreeName = edu.degree || 'Bachelor of Science';
              const instName = edu.institution || 'Leading University';
              const timeline = edu.year || `${edu.startDate || ''} — ${edu.endDate || ''}`;
              const subjectName = edu.subject || edu.field || 'Computer Science & Engineering';

              return (
                <div className="ref-simple-edu-item" key={edu.id || index}>
                  {/* Top Row: Year Pill on Left | Institution Badge on Right */}
                  <div className="ref-simple-edu-top-row">
                    <div className="ref-simple-year-pill">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>{timeline}</span>
                    </div>

                    <div className="ref-simple-inst-badge">
                      <span className="inst-sparkle">✦</span>
                      <span>{instName}</span>
                    </div>
                  </div>

                  {/* Degree Name */}
                  <h3 className="ref-simple-degree-title">{degreeName}</h3>

                  {/* Subject / Major */}
                  <div className="ref-simple-subject-row">
                    <span className="subject-icon">❖</span>
                    <span className="subject-label">Field of Study:</span>
                    <span className="subject-name">{subjectName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            DIV 2 (RIGHT): 4-STEP WORKFLOW PROCESS (SEAMLESS STEP POINTS)
            ============================================================ */}
        <div className="ref-simple-process-card">
          <div className="ref-simple-card-header">
            <div className="ref-simple-tag-pill red">
              <span className="simple-dot-red"></span>
              <span>ENGINEERING LIFECYCLE</span>
            </div>
            <span className="ref-simple-count-badge">4 PHASES</span>
          </div>

          {/* Clean Step-by-Step Points (No Sub-div Boxes) */}
          <div className="ref-editorial-process-list">
            {modernProcessSteps.map((step, idx) => (
              <div className="ref-process-point-row" key={idx}>
                {/* Step Indicator & Subtle Vertical Connector */}
                <div className="ref-process-point-left">
                  <span className="point-num-pill">{step.num}</span>
                  {idx < modernProcessSteps.length - 1 && <div className="point-connector-line"></div>}
                </div>

                {/* Step Details */}
                <div className="ref-process-point-right">
                  <h4 className="point-title-text">{step.title}</h4>
                  <p className="point-desc-text">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
