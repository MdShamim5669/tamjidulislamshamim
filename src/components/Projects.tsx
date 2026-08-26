'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import ProjectDetailsModal from './ProjectDetailsModal';
import TypewriterText from './TypewriterText';

const defaultProjects = [
  {
    id: 'p-1',
    number: '01',
    title: 'DINEFLOW — ENTERPRISE RESTAURANT & MULTI-VENDOR ECOSYSTEM',
    subtitle: 'Full-Stack Web App',
    category: 'Next.js 14, PostgreSQL, Prisma ORM',
    description: 'Comprehensive restaurant management platform featuring real-time kitchen display, automated meal fare calculations, Stripe payment processing, and multi-tenant store isolation.',
    bullets: [
      'Engineered multi-tenant store isolation and dynamic table management.',
      'Implemented real-time kitchen order display with optimistic state sync.',
      'Integrated Stripe checkout with sub-2s transaction finality.'
    ],
    techStack: ['Next.js 14 App Router', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma ORM', 'Stripe', 'Tailwind CSS'],
    liveUrl: 'https://dineflow.vercel.app',
    clientUrl: 'https://github.com/MdShamim5669/dineflow',
    serverUrl: 'https://github.com/MdShamim5669/dineflow-server',
    githubUrl: 'https://github.com/MdShamim5669/dineflow',
    image: '/dark_villain_frames_24fps_high_quality/frame_0001.jpg',
    featured: true
  },
  {
    id: 'p-2',
    number: '02',
    title: 'LOGIXPRESS — LOGISTICS & PARCEL SETTLEMENT ENGINE',
    subtitle: 'Backend & Distributed APIs',
    category: 'Express.js, PostgreSQL, Resend OTP',
    description: 'High-throughput parcel tracking and merchant settlement engine with dynamic fare calculation, multi-factor PIN authentication, Resend OTP verification, and SSLCommerz gateway.',
    bullets: [
      'Designed dynamic fare calculation engine based on weight and distance matrices.',
      'Architected multi-factor PIN authentication & Resend OTP email verification.',
      'Integrated SSLCommerz payment gateway with webhook verification.'
    ],
    techStack: ['Express.js', 'PostgreSQL', 'Prisma ORM', 'JWT PIN Security', 'Resend OTP', 'SSLCommerz'],
    liveUrl: 'https://logixpress.vercel.app',
    clientUrl: 'https://github.com/MdShamim5669/logixpress-client',
    serverUrl: 'https://github.com/MdShamim5669/logixpress',
    githubUrl: 'https://github.com/MdShamim5669/logixpress',
    image: '/campus_photo.png',
    featured: true
  },
  {
    id: 'p-3',
    number: '03',
    title: 'YOUTH SURVEY OPINION AI — PREDICTIVE INFERENCE ENGINE',
    subtitle: 'Applied Machine Learning',
    category: 'Python, Scikit-Learn, FastAPI',
    description: 'Empirical research pipeline on 317 youth survey opinion dataset achieving 84.4% accuracy using SMOTE balancing + Random Forest & XGBoost ensemble models with FastAPI deployment.',
    bullets: [
      'Preprocessed and balanced 317 youth survey responses using SMOTE algorithm.',
      'Trained and benchmarked Random Forest, XGBoost, and Gradient Boosting ensembles.',
      'Packaged high-accuracy pipeline into lightweight FastAPI inference endpoints.'
    ],
    techStack: ['Python', 'Scikit-Learn', 'XGBoost', 'SMOTE Balancing', 'Pandas', 'FastAPI'],
    liveUrl: 'https://github.com/MdShamim5669',
    clientUrl: 'https://github.com/MdShamim5669/opinion-survey-ml',
    serverUrl: 'https://github.com/MdShamim5669/opinion-survey-ml',
    githubUrl: 'https://github.com/MdShamim5669/opinion-survey-ml',
    image: '/dark_villain_frames_24fps_high_quality/frame_0001.jpg',
    featured: true
  },
  {
    id: 'p-4',
    number: '04',
    title: 'ALGORIZIN AI PORTAL — MULTI-AGENT RAG KNOWLEDGE SYSTEM',
    subtitle: 'Autonomous AI & LLM Systems',
    category: 'Claude 3.5 Sonnet, ChromaDB, FastAPI',
    description: 'Enterprise AI knowledge base and interactive portfolio engine with Claude 3.5 Sonnet agent task automation, deterministic JSON validation, and vector chunk indexing.',
    bullets: [
      'Architected autonomous agent loop with tool-calling handlers and guardrails.',
      'Constructed RAG vector indexing pipeline for zero-latency retrieval.',
      'Deployed on high-availability container cluster with sub-second response times.'
    ],
    techStack: ['Claude 3.5', 'Next.js 14', 'Python', 'FastAPI', 'ChromaDB', 'Tailwind CSS'],
    liveUrl: 'https://github.com/MdShamim5669',
    clientUrl: 'https://github.com/MdShamim5669',
    serverUrl: 'https://github.com/MdShamim5669',
    githubUrl: 'https://github.com/MdShamim5669',
    image: '/campus_photo.png',
    featured: true
  },
  {
    id: 'p-5',
    number: '05',
    title: 'OMNICOMMERCE CLOUD — HIGH-SCALE DISTRIBUTED STOREFRONT',
    subtitle: 'Cloud Microservices',
    category: 'Redis Pub/Sub, Node.js, GraphQL',
    description: 'Distributed microservices e-commerce infrastructure with Redis event bus, Redis session caching, and sub-second inventory sync across multi-region edge nodes.',
    bullets: [
      'Engineered distributed lock mechanism with Redis for zero inventory oversell.',
      'Implemented async pub/sub queue for order processing pipeline.',
      'Benchmarked 10k req/sec throughput under peak load.'
    ],
    techStack: ['Node.js', 'Redis', 'Docker', 'PostgreSQL', 'GraphQL', 'Next.js 14'],
    liveUrl: 'https://github.com/MdShamim5669',
    clientUrl: 'https://github.com/MdShamim5669',
    serverUrl: 'https://github.com/MdShamim5669',
    githubUrl: 'https://github.com/MdShamim5669',
    image: '/dark_villain_frames_24fps_high_quality/frame_0001.jpg',
    featured: true
  }
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [activeDot, setActiveDot] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasMoved = useRef(false);

  // TanStack Query for dynamic projects from backend
  const { data: projects = defaultProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const res = await api.get('/projects');
        if (res.data?.data && res.data.data.length > 0) return res.data.data;
      } catch (e) {
        // Fallback
      }
      return defaultProjects;
    },
    initialData: defaultProjects,
  });

  const totalDots = Math.max(1, projects.length - 1);

  // Track active dot on scroll
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setActiveDot(0);
      return;
    }
    const ratio = scrollLeft / maxScroll;
    const idx = Math.min(totalDots - 1, Math.round(ratio * (totalDots - 1)));
    setActiveDot(idx);
  };

  const scrollToDot = (dotIndex: number) => {
    if (!sliderRef.current) return;
    const { scrollWidth, clientWidth } = sliderRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;
    const targetScroll = (dotIndex / (totalDots - 1)) * maxScroll;
    sliderRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
    setActiveDot(dotIndex);
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDragging.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftStart.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 6) {
      hasMoved.current = true;
    }
    sliderRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  return (
    <>
      <section className="ref-recent-projects-section" id="projects">
        {/* Section Top Header (Matches Screenshot) */}
        <div className="ref-projects-header">
          <div className="ref-header-left">
            <h2 className="ref-projects-main-title">
              <TypewriterText
                text="RECENT PROJECT"
                highlightWord="PROJECT"
                highlightClass="ref-title-accent"
                sparkle="✦"
              />
            </h2>
          </div>

          <div className="ref-header-right">
            <Link href="/projects" className="ref-all-projects-top-btn">
              <span>All Projects</span>
              <div className="ref-pill-arrow-circle">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* Drag / Swipe Carousel Track (Matches Screenshot Dimensions) */}
        <div
          className="ref-slider-track-container"
          ref={sliderRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          <div className="ref-slider-inner-row">
            {projects.map((project: any, index: number) => {
              const numStr = project.number || `0${index + 1}`;
              const imageUrl = project.imageUrl || project.image || '/dark_villain_frames_24fps_high_quality/frame_0001.jpg';

              return (
                <div
                  className="ref-carousel-card"
                  key={project.id || index}
                  onClick={() => {
                    if (!hasMoved.current) {
                      setSelectedProject(project);
                    }
                  }}
                >
                  {/* Panoramic Image Window (Matches Screenshot) */}
                  <div className="ref-clean-image-viewport">
                    <img
                      src={imageUrl}
                      alt={project.title}
                      className="ref-clean-thumb-img"
                      draggable={false}
                    />
                    <div className="ref-clean-img-overlay">
                      <span className="ref-clean-hover-badge">VIEW ARCHITECTURE ✦</span>
                    </div>
                  </div>

                  {/* Bottom Details Row */}
                  <div className="ref-clean-bottom-row">
                    <div className="ref-clean-text-stack">
                      <h3 className="ref-clean-project-title">{project.title}</h3>
                      <p className="ref-clean-project-sub">{project.subtitle}</p>
                      <span className="ref-clean-project-cat">{project.category}</span>
                    </div>

                    <div
                      className="ref-clean-number-action"
                      title="Open Project Details"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                    >
                      <span className="ref-clean-num-text">{numStr}</span>
                      <span className="ref-clean-arrow-icon">→</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Center Pagination Dots */}
        {totalDots > 1 && (
          <div className="ref-projects-pagination">
            {Array.from({ length: totalDots }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`ref-page-dot ${activeDot === idx ? 'active' : ''}`}
                onClick={() => scrollToDot(idx)}
                aria-label={`Slide to project ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Project Details Pop-Up Modal */}
      <ProjectDetailsModal
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </>
  );
}
