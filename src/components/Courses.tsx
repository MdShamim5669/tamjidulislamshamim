'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api, { getAssetUrl } from '../lib/api';
import LiquidShimmerText from './animations/LiquidShimmerText';
import { ArrowRight, ExternalLink, BookOpen } from 'lucide-react';

export default function Courses() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [activeCourseIndex, setActiveCourseIndex] = useState(0);

  // TanStack Query: Only fetch live real courses from backend
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      try {
        const res = await api.get('/courses');
        if (res.data?.data && Array.isArray(res.data.data)) {
          return res.data.data;
        }
        return [];
      } catch (err) {
        console.error('Failed to fetch courses from backend:', err);
        return [];
      }
    },
    retry: 3,
    retryDelay: 2000,
  });

  // Dynamically calculate horizontal pan distance
  useEffect(() => {
    const updateRange = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const paddingRight = Math.min(180, viewportWidth * 0.15);
        const distance = Math.max(0, trackWidth - viewportWidth + paddingRight);
        setScrollRange(distance);
      }
    };

    updateRange();
    const timer = setTimeout(updateRange, 400);
    window.addEventListener('resize', updateRange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateRange);
    };
  }, [courses]);

  // Motion Pinned Scroll Hook
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Interpolate vertical scroll into horizontal translation
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  // Track active course index
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const count = courses.length;
    if (count > 0) {
      const index = Math.min(count - 1, Math.floor(latest * count));
      setActiveCourseIndex(index);
    }
  });

  // If no courses in database and not loading, do not render section in UI
  if (!isLoading && courses.length === 0) {
    return null;
  }

  return (
    <section
      id="courses"
      ref={sectionRef}
      className="horizontal-scroll-pin-section"
      style={{
        position: 'relative',
        height: courses.length > 1 ? `${Math.max(400, courses.length * 125)}vh` : '100vh',
        backgroundColor: 'transparent',
      }}
    >
      {/* Sticky Pinned Container */}
      <div
        className="horizontal-scroll-sticky-viewport"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '16px',
          padding: '76px 0 20px 0',
          background: 'transparent',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Header Row */}
        <div
          className="ref-courses-header-row"
          style={{
            padding: '0 40px',
            maxWidth: '1380px',
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div className="ref-courses-header-left">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: '999px',
                background: 'rgba(226, 194, 164, 0.1)',
                border: '1px solid rgba(226, 194, 164, 0.25)',
                color: '#e2c2a4',
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 8,
              }}
            >
              <BookOpen style={{ width: 12, height: 12 }} />
              <span>EDUCATIONAL MASTERCLASSES</span>
            </div>

            <h2 className="ref-courses-main-title" style={{ margin: 0 }}>
              <LiquidShimmerText
                text="Courses Developed"
                highlightWord="Developed"
                highlightClass="ref-courses-title-accent"
                sparkle="✦"
              />
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {courses.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#e2c2a4', fontWeight: 700 }}>
                  Course {String(activeCourseIndex + 1).padStart(2, '0')} / {String(courses.length).padStart(2, '0')}
                </span>
                <div
                  style={{
                    width: 80,
                    height: 4,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    style={{
                      scaleX: scrollYProgress,
                      transformOrigin: 'left',
                      height: '100%',
                      background: 'linear-gradient(90deg, #e2c2a4, #e63946)',
                    }}
                  />
                </div>
              </div>
            )}

            <Link
              href="/courses"
              className="ref-see-all-courses-btn"
              title="Explore All Courses"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#f5eeea',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >
              <span>See All Courses</span>
              <ArrowRight style={{ width: 14, height: 14, color: '#e2c2a4' }} />
            </Link>
          </div>
        </div>

        {/* Horizontal Filmstrip Pan Track */}
        <div
          style={{
            width: '100%',
            overflow: 'hidden',
            padding: '16px 0',
            cursor: 'grab',
          }}
        >
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                gap: 24,
                paddingLeft: 40,
                alignItems: 'center',
                minHeight: 280,
              }}
            >
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  style={{
                    width: 450,
                    height: 280,
                    borderRadius: 22,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    animation: 'pulse 1.5s infinite',
                  }}
                />
              ))}
            </div>
          ) : (
            <motion.div
              ref={trackRef}
              style={{
                x,
                display: 'flex',
                gap: '28px',
                paddingLeft: '40px',
                width: 'max-content',
                willChange: 'transform',
              }}
            >
              {courses.map((course: any, index: number) => {
                const numStr = course.number || `0${index + 1}`;
                const courseTitle = course.title;
                const courseSubtitle =
                  course.subtitle ||
                  course.category ||
                  (course.topics
                    ? Array.isArray(course.topics)
                      ? course.topics.slice(0, 2).join(' • ')
                      : course.topics
                    : 'Udemy Masterclass');
                const courseImg = getAssetUrl(
                  course.bannerUrl || course.image || course.imageUrl,
                  '/dark_villain_frames_24fps_high_quality/frame_0001.jpg'
                );
                const courseLink = course.courseUrl || course.liveUrl || 'https://www.udemy.com';
                const topicsList: string[] = Array.isArray(course.topics)
                  ? course.topics
                  : typeof course.topics === 'string'
                  ? course.topics.split(',').map((t: string) => t.trim())
                  : ['Masterclass', 'Curriculum'];

                return (
                  <a
                    href={courseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={course.id || index}
                    style={{
                      width: '440px',
                      flex: '0 0 440px',
                      height: '425px',
                      background: 'rgba(16, 6, 10, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '20px',
                      padding: '16px',
                      textDecoration: 'none',
                      color: '#f5eeea',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(20px)',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      boxSizing: 'border-box',
                    }}
                    className="horizontal-course-card"
                  >
                    {/* Top Preview Image & Badge */}
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '185px',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        background: '#090a12',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        marginBottom: '10px',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={courseImg}
                        alt={courseTitle}
                        draggable={false}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            '/dark_villain_frames_24fps_high_quality/frame_0001.jpg';
                        }}
                      />

                      {/* Badge Pill */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: 'rgba(226, 194, 164, 0.2)',
                          border: '1px solid rgba(226, 194, 164, 0.4)',
                          fontSize: '0.65rem',
                          fontFamily: 'monospace',
                          color: '#ffffff',
                          fontWeight: 700,
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        {course.badge || 'UDEMY'}
                      </div>

                      {/* Number Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          padding: '3px 7px',
                          borderRadius: '6px',
                          background: 'rgba(6, 2, 4, 0.85)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          fontSize: '0.68rem',
                          fontFamily: 'monospace',
                          color: '#e2c2a4',
                          fontWeight: 700,
                        }}
                      >
                        {numStr}
                      </div>
                    </div>

                    {/* Course Details Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: '#ffffff',
                          marginBottom: '4px',
                          lineHeight: 1.3,
                        }}
                      >
                        {courseTitle}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.78rem',
                          color: '#9c8e8c',
                          marginBottom: '8px',
                          lineHeight: 1.35,
                        }}
                      >
                        {courseSubtitle}
                      </p>

                      {/* Topic Badges */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px', marginTop: 'auto' }}>
                        {topicsList.slice(0, 3).map((topic, tIdx) => (
                          <span
                            key={tIdx}
                            style={{
                              fontSize: '0.65rem',
                              fontFamily: 'monospace',
                              padding: '2px 7px',
                              borderRadius: '5px',
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              color: '#e2c2a4',
                            }}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Bottom CTA Link */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        paddingTop: '10px',
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.78rem',
                          color: '#e2c2a4',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <span>Enroll / Explore Curriculum</span>
                      </span>

                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          background: 'rgba(226, 194, 164, 0.15)',
                          border: '1px solid rgba(226, 194, 164, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#e2c2a4',
                          flexShrink: 0,
                        }}
                      >
                        <ExternalLink style={{ width: 13, height: 13 }} />
                      </div>
                    </div>
                  </a>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
