'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api, { getAssetUrl } from '../../lib/api';

export default function CoursesPage() {
  // Fetch dynamic courses directly from PostgreSQL backend
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await api.get('/courses');
      if (res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
      return [];
    },
    retry: 3,
    retryDelay: 2000,
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
          <span>UDEMY CURRICULUM CATALOG</span>
        </div>

        <Link href="/#contact" className="services-nav-cta">
          <span>Get in Touch</span>
          <span className="sparkle">✦</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="services-page-main">
        {/* Hero Header */}
        <section className="services-hero-section">
          <span className="services-hero-eyebrow">— EDUCATIONAL ARCHITECTURES &amp; UDEMY MASTERCLASSES</span>
          <h1 className="services-hero-title">
            Technical Courses &amp; <span className="title-highlight">AI Masterclasses</span>
          </h1>
          <p className="services-hero-desc">
            Production-grade learning programs educating developers globally on autonomous agent design, structured prompt engineering, full-stack Next.js systems, and synthetic media workflows.
          </p>
        </section>

        {/* Split Courses Catalog List (Left: Info | Right: Picture Div) */}
        <section className="course-catalog-list-wrap">
          {courses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(245, 238, 234, 0.7)' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>No courses or masterclasses published yet.</p>
              <p style={{ fontSize: '0.9rem', color: 'rgba(245, 238, 234, 0.4)' }}>You can create and publish courses anytime via the Admin Dashboard.</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {courses.map((course: any, index: number) => {
                const numStr = course.number || (index < 9 ? `0${index + 1}.` : `${index + 1}.`);
                const ratingVal = course.rating || 4.9;
                const studentsCountStr = course.studentsCount ? `${course.studentsCount}+ STUDENTS` : (course.students || '1200+ STUDENTS');
                const ratingText = `★ ${ratingVal} (${studentsCountStr})`;
                const platformLabel = (course.platform || 'UDEMY').toUpperCase();
                const courseImg = getAssetUrl(course.bannerUrl || course.image || course.imageUrl, index % 2 === 0 ? '/dark_villain_frames_24fps_high_quality/frame_0001.jpg' : '/campus_photo.png');
                const courseUrl = course.courseUrl || course.liveUrl || 'https://www.udemy.com';

                return (
                  <motion.div
                    layout
                    key={course.id || index}
                    className="course-split-catalog-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Left Column: Course Details & Action Buttons */}
                    <div className="course-split-left-content">
                      {/* Top Row: Number + Category & Rating */}
                      <div className="course-split-top-row">
                        <span className="course-split-number">{numStr}</span>
                        <div className="course-split-heading-group">
                          <span className="course-split-eyebrow">
                            {platformLabel} • {ratingText}
                          </span>
                          <h2 className="course-split-title">{course.title}</h2>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="course-split-desc">{course.description}</p>

                      {/* Bottom Row: Metrics Chips on Left | Access Button on Right */}
                      <div className="course-split-footer-row">
                        <div className="course-split-metrics-group">
                          <span className="metrics-eyebrow-label">COURSE METRICS:</span>
                          <div className="metrics-chips-stack">
                            <span className="metric-chip-pill">★ {course.rating || 4.9} Rating</span>
                            <span className="metric-chip-pill">✓ Certificate of Completion</span>
                            <span className="metric-chip-pill">✓ Hands-on Code Repos</span>
                          </div>
                        </div>

                        <a
                          href={courseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="course-split-access-btn"
                        >
                          <span>ACCESS ON UDEMY</span>
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </a>
                      </div>
                    </div>

                    {/* Right Column: Picture Div */}
                    <div className="course-split-right-media">
                      <div className="course-media-viewport">
                        <img
                          src={courseImg}
                          alt={course.title}
                          className="course-media-img"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/dark_villain_frames_24fps_high_quality/frame_0001.jpg';
                          }}
                        />
                        <div className="course-media-badge">
                          <span>{course.badge || 'UDEMY'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </section>

        {/* Bottom Banner */}
        <section className="services-cta-banner">
          <div className="cta-banner-glow"></div>
          <div className="cta-banner-inner">
            <span className="cta-banner-badge">CONTINUOUS LEARNING ✦ 2026</span>
            <h2 className="cta-banner-title">Want a Custom Workshop or Corporate Training?</h2>
            <p className="cta-banner-desc">
              Delivering customized corporate masterclasses on LLM agents, prompt engineering frameworks, and full-stack system architecture.
            </p>
            <div className="cta-banner-btn-group">
              <Link href="/#contact" className="cta-primary-btn">
                <span>Inquire Corporate Training</span>
                <span className="sparkle">✦</span>
              </Link>
              <Link href="/" className="cta-secondary-btn">
                <span>Return to Portfolio</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
