'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api, { getAssetUrl } from '../lib/api';
import TypewriterText from './TypewriterText';

const defaultServices = [
  {
    number: '01.',
    category: 'FULL-STACK DEVELOPMENT',
    title: 'Custom Web Applications & Next.js Systems',
    tags: ['Next.js 14 App Router', 'React 18', 'TypeScript', 'Tailwind CSS', 'TanStack Query'],
    overview: 'Scalable, high-performance web applications built from scratch with Next.js 14 App Router, Server & Client Component optimization, sub-second hydration, and reactive state engines.',
    points: [
      { bold: 'Enterprise Architectures:', text: 'Modular, production-grade codebases built with TypeScript and clean state separation.' },
      { bold: 'Hybrid SSR/SSG:', text: 'Sub-second page loads, automated SEO optimization, and 99+ Lighthouse performance scores.' },
      { bold: 'Payment Pipelines:', text: 'End-to-end checkout integrations with Stripe & SSLCommerz with idempotent webhook handling.' }
    ],
    image: '/dark_villain_frames_24fps_high_quality/frame_0001.jpg'
  },
  {
    number: '02.',
    category: 'BACKEND ARCHITECTURE',
    title: 'High-Throughput REST APIs & Database Engineering',
    tags: ['Node.js & Express', 'PostgreSQL', 'Prisma ORM', 'JWT PIN Auth', 'Redis Caching', 'Microservices'],
    overview: 'Robust, distributed backend microservices and RESTful APIs engineered with Node.js, Express, and PostgreSQL/Prisma for ultra-low latency and maximum data integrity.',
    points: [
      { bold: 'Relational Modeling:', text: 'Normalized PostgreSQL schemas, indexed queries, connection pooling, and sub-10ms query execution.' },
      { bold: 'Cryptographic Security:', text: 'Multi-factor PIN/JWT auth, Resend OTP email verification, and granular Role-Based Access Control (RBAC).' },
      { bold: 'Business Logic Engines:', text: 'Automated fare calculation, transaction settlement, and idempotent background queue workers.' }
    ],
    image: '/campus_photo.png'
  },
  {
    number: '03.',
    category: 'AI & AUTOMATION',
    title: 'Autonomous Multi-Agents & LLM Pipeline Integration',
    tags: ['Claude 3.5 Sonnet', 'OpenAI API', 'Prompt Blueprints', 'Autonomous Agents', 'LangChain', 'Vector Search'],
    overview: 'End-to-end integration of LLM systems, prompt engineering frameworks, and autonomous multi-agent task routing pipelines into real-world business applications.',
    points: [
      { bold: 'Deterministic Prompting:', text: 'Structured JSON validation, schema enforcement, and zero-shot/few-shot blueprint design.' },
      { bold: 'Subagent Workflows:', text: 'Multi-agent orchestration, tool calling, hallucination guardrails, and automated developer pipelines.' },
      { bold: 'Productivity Optimization:', text: 'AI-assisted coding workflows that cut development and delivery timelines by over 60%.' }
    ],
    image: '/dark_villain_frames_24fps_high_quality/frame_0001.jpg'
  },
  {
    number: '04.',
    category: 'DATA SCIENCE & ML',
    title: 'Applied Machine Learning & Predictive Analytics',
    tags: ['Python', 'Scikit-Learn', 'XGBoost', 'SMOTE Balancing', 'FastAPI', 'Pandas & NumPy'],
    overview: 'Statistical modeling, class balancing on imbalanced datasets, and high-accuracy classification algorithms packaged into lightweight inference microservices.',
    points: [
      { bold: 'Ensemble Modeling:', text: 'Random Forest, Gradient Boosting & XGBoost benchmarking for high precision and F1-scores.' },
      { bold: 'Dataset Balancing:', text: 'SMOTE preprocessing on real-world opinion datasets (84.4% classification accuracy).' },
      { bold: 'Inference Microservices:', text: 'Lightweight, scalable FastAPI endpoints ready for immediate production consumption.' }
    ],
    image: '/campus_photo.png'
  },
  {
    number: '05.',
    category: 'CURRICULUM ARCHITECTURE',
    title: 'Technical Curriculum Development & AI Course Creation',
    tags: ['Udemy Publishing', 'Claude 3.5', 'HeyGen AI', 'Gamma Presentations', '12+ Masterclasses'],
    overview: 'End-to-end technical learning ecosystem architecture — creating, scripting, producing, and publishing high-retention technical courses on global platforms.',
    points: [
      { bold: '12+ Published Courses:', text: 'Authored technical masterclasses on Udemy educating international developers on AI and full-stack.' },
      { bold: 'Synthetic Media Workflows:', text: 'Leveraging HeyGen AI avatars and Gamma automated slide generation for high-engagement video production.' },
      { bold: 'Code Walkthroughs:', text: 'Crystal-clear hands-on repositories, architectural blueprints, and interactive project-based assignments.' }
    ],
    image: '/dark_villain_frames_24fps_high_quality/frame_0001.jpg'
  }
];

export default function Services() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // TanStack Query for dynamic services
  const { data: serverServices } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        const res = await api.get('/services');
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          return res.data.data;
        }
      } catch (e) {
        // Fallback
      }
      return null;
    },
  });

  const displayedServices = serverServices && serverServices.length > 0 ? serverServices : defaultServices;

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="ref-services-section" id="services">
      {/* Section Top Header (Matches Reference Layout) */}
      <div className="ref-services-header">
        <div className="ref-header-left">
          <span className="ref-eyebrow-dash">— My Specialization</span>
          <h2 className="ref-services-title">
            <TypewriterText
              text="Services I Provide"
              highlightWord="Services"
              highlightClass="ref-title-accent"
              sparkle="✦"
            />
          </h2>
        </div>

        <div className="ref-header-right">
          <p className="ref-services-subtitle">
            Delivering resilient, production-ready architectures, autonomous AI pipelines, and high-throughput backend systems tailored for scalable mission-critical platforms.
          </p>
        </div>
      </div>

      {/* Accordion Stack Container */}
      <div className="ref-accordion-stack">
        {displayedServices.map((service: any, index: number) => {
          const isExpanded = expandedIndex === index;
          const serviceNum = service.number?.includes('.') ? service.number : `0${index + 1}.`;
          const tagsArray = Array.isArray(service.tags)
            ? service.tags
            : (typeof service.tags === 'string' ? service.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []);

          return (
            <motion.div
              layout
              key={service.id || index}
              className={`ref-service-card ${isExpanded ? 'card-is-expanded' : 'card-is-collapsed'}`}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Row Header (Clickable Trigger) */}
              <div
                className="ref-card-trigger"
                onClick={() => toggleAccordion(index)}
              >
                <div className="ref-card-trigger-left">
                  <div className="ref-num-wrap">
                    <span className="ref-service-num">{serviceNum}</span>
                  </div>
                  <div className="ref-title-wrap">
                    {service.category && (
                      <span className="ref-service-eyebrow-tag">{service.category}</span>
                    )}
                    <h3 className="ref-service-name">{service.title}</h3>
                  </div>
                </div>

                <div className="ref-card-trigger-right">
                  {tagsArray.length > 0 && (
                    <div className="ref-collapsed-tech-pills">
                      {tagsArray.slice(0, 2).map((t: string, ti: number) => (
                        <span className="ref-collapsed-pill" key={ti}>{t}</span>
                      ))}
                    </div>
                  )}
                  <div className={`ref-trigger-circle-btn ${isExpanded ? 'circle-active' : ''}`}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded Card Content (Detailed View with Chips, Text & Visual Showcase) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="ref-card-expanded-body"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Skill / Technology Chips */}
                    {tagsArray.length > 0 && (
                      <div className="ref-chips-row">
                        {tagsArray.map((tag: string, i: number) => (
                          <span className="ref-skill-chip" key={i}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Overview Paragraph */}
                    {service.overview && (
                      <p className="ref-expanded-overview">
                        {service.overview}
                      </p>
                    )}

                    {/* Key Capabilities List */}
                    {service.points && Array.isArray(service.points) && service.points.length > 0 && (
                      <div className="ref-expanded-capabilities">
                        {service.points.map((p: any, i: number) => {
                          const boldPart = typeof p === 'object' && p?.bold ? p.bold : '';
                          const textPart = typeof p === 'object' ? (p?.text || '') : p;
                          return (
                            <div className="ref-capability-bullet" key={i}>
                              <span className="bullet-sparkle">✦</span>
                              <span>
                                {boldPart && <strong>{boldPart} </strong>}
                                {textPart}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Visual Showcase Card */}
                    <div className="ref-visual-showcase-frame">
                      <div className="ref-showcase-blueprint-overlay">
                        <div className="blueprint-badge">
                          <span className="blueprint-dot"></span>
                          <span>PRODUCTION ARCHITECTURE SPECIFICATION</span>
                        </div>
                      </div>
                      <img
                        src={getAssetUrl(service.imageUrl || service.image)}
                        alt={service.title}
                        className="ref-showcase-img"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/dark_villain_frames_24fps_high_quality/frame_0001.jpg';
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Action Pill Button (Matches Reference) */}
      <div className="ref-services-bottom-row">
        <Link
          href="/services"
          className="ref-view-all-pill-btn"
        >
          <span>View All Services</span>
          <div className="ref-pill-arrow-circle">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </Link>
      </div>
    </section>
  );
}
