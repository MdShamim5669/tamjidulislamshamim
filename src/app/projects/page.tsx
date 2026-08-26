'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import ProjectDetailsModal from '../../components/ProjectDetailsModal';

const defaultAllProjects = [
  {
    id: 'p-1',
    number: '01',
    title: 'DineFlow',
    subtitle: 'Restaurant Management & POS Engine',
    category: 'FULL-STACK WEB',
    description: 'Comprehensive restaurant management platform featuring real-time kitchen display, automated meal fare calculations, Stripe payment processing, and multi-tenant store isolation.',
    bullets: [
      'Engineered multi-tenant store isolation and dynamic table management.',
      'Implemented real-time kitchen order display with optimistic state sync.',
      'Integrated Stripe checkout with sub-2s transaction finality.'
    ],
    techStack: ['Next.js 14', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma ORM', 'Stripe'],
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
    title: 'LogiXpress',
    subtitle: 'Logistics & Merchant Settlement Engine',
    category: 'BACKEND & APIS',
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
    title: 'Youth Survey Opinion AI',
    subtitle: 'Predictive Research & ML Pipeline',
    category: 'AI & MACHINE LEARNING',
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
    title: 'Algorizin AI Portal',
    subtitle: 'Multi-Agent RAG Knowledge System',
    category: 'AUTONOMOUS AI',
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
    title: 'OmniCommerce Cloud',
    subtitle: 'High-Scale Distributed Storefront',
    category: 'FULL-STACK WEB',
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
  },
  {
    id: 'p-6',
    number: '06',
    title: 'MediScan Vision AI',
    subtitle: 'Clinical Diagnostic Imaging Model',
    category: 'AI & MACHINE LEARNING',
    description: 'Medical computer vision pipeline utilizing transfer learning with EfficientNet-B4 for rapid radiological anomaly localization and confidence classification.',
    bullets: [
      'Fine-tuned PyTorch convolutional network on 12k annotated radiological scans.',
      'Engineered Grad-CAM visual heatmap explanation overlay for clinician review.',
      'Achieved 96.2% validation sensitivity on test holdout benchmark.'
    ],
    techStack: ['PyTorch', 'TorchVision', 'Python', 'FastAPI', 'NumPy', 'OpenCV'],
    liveUrl: 'https://github.com/MdShamim5669',
    clientUrl: 'https://github.com/MdShamim5669',
    serverUrl: 'https://github.com/MdShamim5669',
    githubUrl: 'https://github.com/MdShamim5669',
    image: '/campus_photo.png',
    featured: true
  }
];

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // TanStack Query for dynamic projects from backend
  const { data: projects = defaultAllProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const res = await api.get('/projects');
        if (res.data?.data && res.data.data.length > 0) return res.data.data;
      } catch (e) {
        // Fallback
      }
      return defaultAllProjects;
    },
    initialData: defaultAllProjects,
  });

  const categories = ['ALL', 'FULL-STACK WEB', 'BACKEND & APIS', 'AI & MACHINE LEARNING', 'AUTONOMOUS AI'];

  const filteredProjects = selectedCategory === 'ALL'
    ? projects
    : projects.filter((p: any) => {
        const cat = (p.category || '').toUpperCase();
        return cat.includes(selectedCategory) || selectedCategory.includes(cat);
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
          <span>PROJECT ARCHIVES • 2026 REPOSITORY</span>
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
          <span className="services-hero-eyebrow">— COMPLETE PRODUCTION REPOSITORY</span>
          <h1 className="services-hero-title">
            Engineered Systems &amp; <span className="title-highlight">Live Deployments</span>
          </h1>
          <p className="services-hero-desc">
            Explore verified full-stack applications, distributed backend microservices, and applied AI pipelines built with production-first engineering standards.
          </p>

          {/* Category Filter Pills */}
          <div className="services-category-bar">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* 3 Projects Per Row Grid (Wrap to Row 2, Row 3, etc.) */}
        <section className="proj-catalog-grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project: any, index: number) => {
              const numStr = project.number || (index + 1 < 10 ? `0${index + 1}` : `${index + 1}`);
              const imageUrl = project.imageUrl || project.image || '/dark_villain_frames_24fps_high_quality/frame_0001.jpg';
              const techSnippet = Array.isArray(project.techStack)
                ? project.techStack.slice(0, 3).join(' • ')
                : (typeof project.techStack === 'string' ? project.techStack.split(',').slice(0, 3).join(' • ') : project.category);

              return (
                <motion.div
                  layout
                  key={project.id || index}
                  className="proj-catalog-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Top Image Window */}
                  <div className="proj-catalog-image-viewport">
                    <img
                      src={imageUrl}
                      alt={project.title}
                      className="proj-catalog-thumb-img"
                    />
                    <div className="proj-catalog-img-overlay">
                      <span className="proj-catalog-hover-badge">VIEW ARCHITECTURE ✦</span>
                    </div>
                  </div>

                  {/* Bottom Details Row */}
                  <div className="proj-catalog-bottom-row">
                    <div className="proj-catalog-text-stack">
                      <h3 className="proj-catalog-title">{project.title}</h3>
                      <p className="proj-catalog-sub">{project.subtitle || project.category}</p>
                      <span className="proj-catalog-tags">{techSnippet}</span>
                    </div>

                    <div className="proj-catalog-action" title="Open Project Details">
                      <span className="proj-catalog-num">{numStr}</span>
                      <span className="proj-catalog-arrow">→</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </section>

        {/* Bottom CTA Banner */}
        <section className="services-cta-banner" style={{ marginTop: '70px' }}>
          <div className="cta-banner-glow"></div>
          <div className="cta-banner-inner">
            <span className="cta-banner-badge">HAVE A CUSTOM SYSTEM IN MIND? ✦</span>
            <h2 className="cta-banner-title">Let's Build Your Production Roadmap</h2>
            <p className="cta-banner-desc">
              Available for end-to-end full-stack architectures, API design, and multi-agent AI system integrations.
            </p>
            <div className="cta-banner-btn-group">
              <Link href="/#contact" className="cta-primary-btn">
                <span>Discuss Project Architecture</span>
                <span className="sparkle">✦</span>
              </Link>
              <Link href="/" className="cta-secondary-btn">
                <span>Back to Homepage</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Project Details Pop-Up Modal */}
      <ProjectDetailsModal
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </div>
  );
}
