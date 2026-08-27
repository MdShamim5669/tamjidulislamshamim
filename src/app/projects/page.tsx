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
      const res = await api.get('/projects');
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
      return [];
    },
    retry: 3,
    retryDelay: 2000,
  });

  const categories = ['ALL', 'FULL-STACK WEB', 'BACKEND & APIS', 'AI & MACHINE LEARNING', 'AUTONOMOUS AI'];

  const getCategoryCount = (cat: string) => {
    if (cat === 'ALL') return projects.length;
    return projects.filter((p: any) => {
      const c = (p.category || '').toUpperCase();
      return c.includes(cat) || cat.includes(c);
    }).length;
  };

  const filteredProjects = selectedCategory === 'ALL'
    ? projects
    : projects.filter((p: any) => {
        const cat = (p.category || '').toUpperCase();
        return cat.includes(selectedCategory) || selectedCategory.includes(cat);
      });

  return (
    <div className="projects-archive-page">
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

      {/* Main Content Area (Wide 3-in-a-row Container) */}
      <main className="projects-archive-main">
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
            {categories.map((cat) => {
              const count = getCategoryCount(cat);
              return (
                <button
                  type="button"
                  key={cat}
                  className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span>{cat}</span>
                  {count > 0 && <span style={{ opacity: 0.7, fontSize: '10px', marginLeft: '4px' }}>({count})</span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3 Projects Per Row Grid */}
        <section className="projects-grid-3col">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project: any, index: number) => {
              const numStr = project.number || (index + 1 < 10 ? `0${index + 1}` : `${index + 1}`);
              const imageUrl = project.imageUrl || project.image || '/dark_villain_frames_24fps_high_quality/frame_0001.jpg';
              
              const techList: string[] = Array.isArray(project.techStack)
                ? project.techStack
                : (typeof project.techStack === 'string' ? project.techStack.split(',').map((s: string) => s.trim()).filter(Boolean) : []);

              return (
                <motion.div
                  layout
                  key={project.id || index}
                  className="project-archive-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Top Image Box */}
                  <div className="project-card-image-box">
                    <img
                      src={imageUrl}
                      alt={project.title}
                      className="project-card-thumb"
                    />

                    {/* Floating Top Badges */}
                    <div className="project-card-top-badges">
                      <span className="project-category-tag">{project.category || 'Full-Stack Web'}</span>
                      <span className="project-index-pill">{numStr}</span>
                    </div>

                    {/* Hover Overlay */}
                    <div className="project-hover-overlay">
                      <span className="project-hover-cta">INSPECT ARCHITECTURE ✦</span>
                    </div>
                  </div>

                  {/* Card Body Details */}
                  <div className="project-card-body">
                    <h3 className="project-card-title" title={project.title}>
                      {project.title}
                    </h3>
                    <p className="project-card-desc">
                      {project.description || project.subtitle || 'Production-grade full stack system architecture and engineering deployment.'}
                    </p>

                    {/* Tech Stack Pills */}
                    {techList.length > 0 && (
                      <div className="project-tech-badges">
                        {techList.slice(0, 4).map((tech, tIdx) => (
                          <span key={tIdx} className="project-tech-pill">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Card Footer Row */}
                    <div className="project-card-footer">
                      <span className="project-footer-explore">
                        <span>Case Study &amp; Demo</span>
                        <span className="project-footer-arrow">→</span>
                      </span>
                      <span className="project-footer-number">{numStr}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </section>

        {/* Bottom CTA Banner */}
        <section className="services-cta-banner" style={{ marginTop: '80px' }}>
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
