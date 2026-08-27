'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssetUrl } from '../lib/api';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any | null;
}

export default function ProjectDetailsModal({
  isOpen,
  onClose,
  project
}: ProjectDetailsModalProps) {
  const techArray = project
    ? (Array.isArray(project.techStack)
        ? project.techStack
        : (typeof project.techStack === 'string' ? project.techStack.split(',').map((t: string) => t.trim()).filter(Boolean) : []))
    : [];

  const imageUrl = getAssetUrl(project?.imageUrl || project?.image);
  const liveUrl = project?.liveUrl || 'https://github.com/MdShamim5669';
  const clientUrl = project?.clientUrl || project?.githubClientUrl || project?.githubUrl || 'https://github.com/MdShamim5669';
  const serverUrl = project?.serverUrl || project?.githubServerUrl || (project?.githubUrl ? `${project.githubUrl}` : 'https://github.com/MdShamim5669');

  return (
    <AnimatePresence>
      {isOpen && project && (
        <div className="proj-modal-backdrop" onClick={onClose}>
          <motion.div
            className="proj-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top Bar with Badge & Close Button */}
            <div className="proj-modal-top-bar">
              <div className="proj-modal-category-badge">
                <span className="proj-badge-dot"></span>
                <span>{project.category || 'FEATURED ARCHITECTURE'}</span>
              </div>

              <button
                type="button"
                className="proj-modal-close-btn"
                onClick={onClose}
                aria-label="Close project modal"
              >
                ✕
              </button>
            </div>

            {/* Project Cover Picture Frame */}
            <div className="proj-modal-cover-frame">
              <img
                src={imageUrl}
                alt={project.title}
                className="proj-modal-cover-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/dark_villain_frames_24fps_high_quality/frame_0001.jpg';
                }}
              />
              <div className="proj-modal-cover-gradient"></div>
              <div className="proj-modal-title-overlay">
                <h2 className="proj-modal-title">{project.title}</h2>
                {project.subtitle && (
                  <p className="proj-modal-subtitle">{project.subtitle}</p>
                )}
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="proj-modal-body">
              {/* Description */}
              <div className="proj-modal-section">
                <h4 className="proj-section-heading">PROJECT OVERVIEW &amp; ARCHITECTURE</h4>
                <p className="proj-modal-desc">{project.description}</p>
              </div>

              {/* Key Features & Architectural Highlights */}
              {project.bullets && Array.isArray(project.bullets) && project.bullets.length > 0 && (
                <div className="proj-modal-section">
                  <h4 className="proj-section-heading">KEY HIGHLIGHTS &amp; DELIVERABLES</h4>
                  <div className="proj-modal-bullets">
                    {project.bullets.map((b: string, i: number) => (
                      <div className="proj-bullet-row" key={i}>
                        <span className="proj-bullet-sparkle">✦</span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack Chips */}
              {techArray.length > 0 && (
                <div className="proj-modal-section">
                  <h4 className="proj-section-heading">TECHNOLOGY STACK</h4>
                  <div className="proj-modal-chips-stack">
                    {techArray.map((t: string, i: number) => (
                      <span className="proj-tech-chip" key={i}>{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* 3 Action Links Bar: Live Site, Client Site, Server Site */}
              <div className="proj-modal-actions-bar">
                {/* 1. Live Link / Demo */}
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proj-action-btn primary"
                >
                  <span>Live Site / Demo</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>

                {/* 2. Client Site / Frontend Repo */}
                <a
                  href={clientUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proj-action-btn secondary"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                  <span>Client Site</span>
                </a>

                {/* 3. Server Site / Backend API Repo */}
                <a
                  href={serverUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proj-action-btn tertiary"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                    <line x1="6" y1="6" x2="6.01" y2="6"></line>
                    <line x1="6" y1="18" x2="6.01" y2="18"></line>
                  </svg>
                  <span>Server Site</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
