'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

const defaultAllServices = [
  {
    id: 's-1',
    number: '01.',
    category: 'FULL-STACK DEVELOPMENT',
    title: 'Custom Web Applications & Next.js Systems',
    tags: ['Next.js 14 App Router', 'React 18', 'TypeScript', 'Tailwind CSS', 'TanStack Query', 'SSR/SSG'],
    overview: 'Scalable, high-performance web applications built from scratch with Next.js 14 App Router, Server & Client Component optimization, sub-second hydration, and reactive state engines.',
    points: [
      { bold: 'Enterprise Architectures:', text: 'Modular, production-grade codebases built with TypeScript and clean state separation.' },
      { bold: 'Hybrid SSR/SSG:', text: 'Sub-second page loads, automated SEO optimization, and 99+ Lighthouse performance scores.' },
      { bold: 'Payment Pipelines:', text: 'End-to-end checkout integrations with Stripe & SSLCommerz with idempotent webhook handling.' },
      { bold: 'State Management:', text: 'Zustand & TanStack Query caching for zero redundant network overhead.' }
    ],
    image: '/dark_villain_frames_24fps_high_quality/frame_0001.jpg',
    deliverables: ['Production Next.js Codebase', 'Component Design System', 'Vercel Deployment Spec', 'API Documentation']
  },
  {
    id: 's-2',
    number: '02.',
    category: 'BACKEND ARCHITECTURE',
    title: 'High-Throughput REST APIs & Database Engineering',
    tags: ['Node.js & Express', 'PostgreSQL', 'Prisma ORM', 'JWT PIN Auth', 'Redis Caching', 'Microservices'],
    overview: 'Robust, distributed backend microservices and RESTful APIs engineered with Node.js, Express, and PostgreSQL/Prisma for ultra-low latency and maximum data integrity.',
    points: [
      { bold: 'Relational Modeling:', text: 'Normalized PostgreSQL schemas, indexed queries, connection pooling, and sub-10ms query execution.' },
      { bold: 'Cryptographic Security:', text: 'Multi-factor PIN/JWT auth, Resend OTP email verification, and granular Role-Based Access Control (RBAC).' },
      { bold: 'Business Logic Engines:', text: 'Automated fare calculation, transaction settlement, and idempotent background queue workers.' },
      { bold: 'Containerization:', text: 'Dockerized service containers with Render/AWS production blueprints.' }
    ],
    image: '/campus_photo.png',
    deliverables: ['REST API Endpoints', 'Prisma Database Schema', 'Swagger/Postman Spec', 'Authentication Pipeline']
  },
  {
    id: 's-3',
    number: '03.',
    category: 'AI & AUTOMATION',
    title: 'Autonomous Multi-Agents & LLM Pipeline Integration',
    tags: ['Claude 3.5 Sonnet', 'OpenAI API', 'Prompt Blueprints', 'Autonomous Agents', 'LangChain', 'Vector Search'],
    overview: 'End-to-end integration of LLM systems, prompt engineering frameworks, and autonomous multi-agent task routing pipelines into real-world business applications.',
    points: [
      { bold: 'Deterministic Prompting:', text: 'Structured JSON validation, schema enforcement, and zero-shot/few-shot blueprint design.' },
      { bold: 'Subagent Workflows:', text: 'Multi-agent orchestration, tool calling, hallucination guardrails, and automated developer pipelines.' },
      { bold: 'Productivity Optimization:', text: 'AI-assisted coding workflows that cut development and delivery timelines by over 60%.' },
      { bold: 'RAG Knowledge Bases:', text: 'Embedding search and vector chunking pipelines for contextual enterprise document intelligence.' }
    ],
    image: '/dark_villain_frames_24fps_high_quality/frame_0001.jpg',
    deliverables: ['Custom AI Agents', 'Prompt Architecture Spec', 'Vector Search Integration', 'Tool Calling Handlers']
  },
  {
    id: 's-4',
    number: '04.',
    category: 'DATA SCIENCE & ML',
    title: 'Applied Machine Learning & Predictive Analytics',
    tags: ['Python', 'Scikit-Learn', 'XGBoost', 'SMOTE Balancing', 'FastAPI', 'Pandas & NumPy'],
    overview: 'Statistical modeling, class balancing on imbalanced datasets, and high-accuracy classification algorithms packaged into lightweight inference microservices.',
    points: [
      { bold: 'Ensemble Modeling:', text: 'Random Forest, Gradient Boosting & XGBoost benchmarking for high precision and F1-scores.' },
      { bold: 'Dataset Balancing:', text: 'SMOTE preprocessing on real-world opinion datasets (84.4% classification accuracy).' },
      { bold: 'Inference Microservices:', text: 'Lightweight, scalable FastAPI endpoints ready for immediate production consumption.' },
      { bold: 'EDA Pipelines:', text: 'Automated data wrangling, outlier detection, and statistical correlation matrices.' }
    ],
    image: '/campus_photo.png',
    deliverables: ['Trained ML Models', 'FastAPI Inference Service', 'Jupyter Benchmarks', 'Evaluation Reports']
  },
  {
    id: 's-5',
    number: '05.',
    category: 'CURRICULUM ARCHITECTURE',
    title: 'Technical Curriculum Development & AI Course Creation',
    tags: ['Udemy Publishing', 'Claude 3.5', 'HeyGen AI', 'Gamma Presentations', '12+ Masterclasses'],
    overview: 'End-to-end technical learning ecosystem architecture — creating, scripting, producing, and publishing high-retention technical courses on global platforms.',
    points: [
      { bold: '12+ Published Courses:', text: 'Authored technical masterclasses on Udemy educating international developers on AI and full-stack.' },
      { bold: 'Synthetic Media Workflows:', text: 'Leveraging HeyGen AI avatars and Gamma automated slide generation for high-engagement video production.' },
      { bold: 'Code Walkthroughs:', text: 'Crystal-clear hands-on repositories, architectural blueprints, and interactive project-based assignments.' },
      { bold: 'Curriculum Roadmaps:', text: 'Progressive learning trajectories from foundational computing to advanced agentic architecture.' }
    ],
    image: '/dark_villain_frames_24fps_high_quality/frame_0001.jpg',
    deliverables: ['Full Course Syllabus', 'Production Video Modules', 'Hands-On Code Repos', 'Quiz & Assignment Packs']
  }
];

export default function ServicesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Fetch dynamic services from backend
  const { data: services = defaultAllServices } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        const res = await api.get('/services');
        if (res.data?.data && res.data.data.length > 0) return res.data.data;
      } catch (e) {
        // Fallback to default
      }
      return defaultAllServices;
    },
    initialData: defaultAllServices,
  });

  return (
    <div className="services-page-container">
      {/* Top Floating Glass Navigation */}
      <header className="services-page-nav">
        <Link href="/" className="services-back-link">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to Portfolio</span>
        </Link>

        <div className="services-nav-badge">
          <span className="badge-ping"></span>
          <span>SPECIALIZATION CATALOG • 2026</span>
        </div>

        <Link href="/#contact" className="services-nav-cta">
          <span>Hire for Project</span>
          <span className="sparkle">✦</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="services-page-main">
        {/* Page Hero Header */}
        <section className="services-hero-section">
          <span className="services-hero-eyebrow">— COMPLETE SERVICE &amp; ENGINEERING SUITE</span>
          <h1 className="services-hero-title">
            Enterprise Architecture &amp; <span className="title-highlight">AI Solutions</span>
          </h1>
          <p className="services-hero-desc">
            Production-tested engineering deliverables across modern full-stack web platforms, high-throughput distributed backends, autonomous LLM agent systems, and machine learning pipelines.
          </p>
        </section>

        {/* Services List / Cards */}
        <section className="services-catalog-grid">
          <AnimatePresence mode="popLayout">
            {services.map((service: any, index: number) => {
              const isExpanded = expandedId === (service.id || `s-${index}`);
              const numStr = service.number?.includes('.') ? service.number : `0${index + 1}.`;
              const tagsArray = Array.isArray(service.tags)
                ? service.tags
                : (typeof service.tags === 'string' ? service.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []);

              return (
                <motion.div
                  layout
                  key={service.id || index}
                  className={`service-catalog-card ${isExpanded ? 'is-active-card' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Card Header Bar */}
                  <div
                    className="service-card-header-bar"
                    onClick={() => setExpandedId(isExpanded ? null : (service.id || `s-${index}`))}
                  >
                    <div className="card-header-left">
                      <span className="service-card-number">{numStr}</span>
                      <div>
                        <span className="service-card-category">{service.category}</span>
                        <h2 className="service-card-title">{service.title}</h2>
                      </div>
                    </div>

                    <div className={`service-card-toggle-btn ${isExpanded ? 'btn-rotated' : ''}`}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="service-card-body">
                    {/* Tags */}
                    {tagsArray.length > 0 && (
                      <div className="service-tags-stack">
                        {tagsArray.map((tag: string, i: number) => (
                          <span className="tag-chip" key={i}>{tag}</span>
                        ))}
                      </div>
                    )}

                    <p className="service-card-overview">{service.overview}</p>

                    {/* Detailed Capabilities */}
                    {service.points && Array.isArray(service.points) && service.points.length > 0 && (
                      <div className="service-points-grid">
                        {service.points.map((p: any, i: number) => {
                          const boldPart = typeof p === 'object' && p?.bold ? p.bold : '';
                          const textPart = typeof p === 'object' ? (p?.text || '') : p;
                          return (
                            <div className="point-item" key={i}>
                              <span className="point-sparkle">✦</span>
                              <div>
                                {boldPart && <strong className="point-bold">{boldPart} </strong>}
                                <span className="point-text">{textPart}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Deliverables & Action Row */}
                    <div className="service-footer-action-row">
                      {service.deliverables && (
                        <div className="deliverables-stack">
                          <span className="deliverables-label">KEY DELIVERABLES:</span>
                          <div className="deliverables-chips">
                            {service.deliverables.map((d: string, di: number) => (
                              <span className="deliverable-item" key={di}>✓ {d}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <Link href="/#contact" className="request-service-btn">
                        <span>Request Architecture Scope</span>
                        <span className="arrow-sparkle">✦</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </section>

        {/* Bottom Banner CTA */}
        <section className="services-cta-banner">
          <div className="cta-banner-glow"></div>
          <div className="cta-banner-inner">
            <span className="cta-banner-badge">LET'S COLLABORATE ✦ 2026</span>
            <h2 className="cta-banner-title">Need a Custom Technical Architecture?</h2>
            <p className="cta-banner-desc">
              Available for select full-stack systems engineering, distributed database design, and autonomous AI pipeline integration.
            </p>
            <div className="cta-banner-btn-group">
              <Link href="/#contact" className="cta-primary-btn">
                <span>Start Direct Project Discussion</span>
                <span className="sparkle">✦</span>
              </Link>
              <Link href="/" className="cta-secondary-btn">
                <span>View Selected Projects</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
