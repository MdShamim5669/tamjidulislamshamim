'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import ProjectDetailsModal from '../../components/ProjectDetailsModal';

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // TanStack Query for dynamic projects directly from PostgreSQL backend
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const res = await api.get('/projects');
        if (res.data?.data && Array.isArray(res.data.data)) {
          return res.data.data;
        }
      } catch (e) {
        console.error('Error fetching projects:', e);
      }
      return [];
    },
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
