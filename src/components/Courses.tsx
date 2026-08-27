'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api, { getAssetUrl } from '../lib/api';
import TypewriterText from './TypewriterText';

export default function Courses() {
  const [activeDot, setActiveDot] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasMoved = useRef(false);

  // TanStack Query for dynamic courses directly from PostgreSQL backend
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

  // If no courses in database, do not show section on homepage
  if (!isLoading && courses.length === 0) {
    return null;
  }

  // Mouse Drag / Swipe Handlers
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
    if (Math.abs(walk) > 5) {
      hasMoved.current = true;
    }
    sliderRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
    if (maxScroll <= 0) return;
    const currentScroll = sliderRef.current.scrollLeft;
    const ratio = currentScroll / maxScroll;
    const totalDots = courses.length;
    const dotIndex = Math.min(Math.round(ratio * (totalDots - 1)), totalDots - 1);
    setActiveDot(dotIndex);
  };

  const scrollToCourseIndex = (index: number) => {
    if (!sliderRef.current) return;
    const cardWidth = 380;
    sliderRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
    setActiveDot(index);
  };

  return (
    <section className="ref-courses-section" id="courses">
      {/* Section Top Header with "See All Courses" on top-right */}
      <div className="ref-courses-header-row">
        <div className="ref-courses-header-left">
          <div className="ref-course-eyebrow-pill">
            <span className="course-dot"></span>
            <span>EDUCATIONAL MASTERCLASSES</span>
          </div>
          <h2 className="ref-courses-main-title">
            <TypewriterText
              text="Courses Developed"
              highlightWord="Developed"
              highlightClass="ref-courses-title-accent"
              sparkle="✦"
            />
          </h2>
        </div>

        {/* Top Right: See All Courses Link */}
        <Link
          href="/courses"
          className="ref-see-all-courses-btn"
          title="Explore All Courses"
        >
          <span>See All Courses</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </Link>
      </div>

      {/* Horizontal Draggable Slider Track (Matching Screenshot Design) */}
      <div
        className="ref-courses-slider-track-container"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onScroll={handleScroll}
      >
        <div className="ref-courses-cards-row">
          {courses.map((course: any, index: number) => {
            const courseTitle = course.title;
            const courseSubtitle = course.category || (course.topics ? (Array.isArray(course.topics) ? course.topics.slice(0, 2).join(', ') : course.topics) : 'Udemy Masterclass');
            const courseImg = getAssetUrl(course.bannerUrl || course.image || course.imageUrl, index % 2 === 0 ? '/dark_villain_frames_24fps_high_quality/frame_0001.jpg' : '/campus_photo.png');
            const courseLink = course.courseUrl || course.liveUrl || 'https://www.udemy.com';

            return (
              <a
                href={courseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ref-course-photo-card"
                key={course.id || index}
                onClick={(e) => {
                  if (hasMoved.current) {
                    e.preventDefault();
                  }
                }}
              >
                {/* Top Image Viewport Frame */}
                <div className="ref-course-img-viewport">
                  <img
                    src={courseImg}
                    alt={courseTitle}
                    className="ref-course-card-img"
                    draggable={false}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/dark_villain_frames_24fps_high_quality/frame_0001.jpg';
                    }}
                  />
                  <div className="ref-course-img-badge">
                    <span>{course.badge || 'UDEMY'}</span>
                  </div>
                </div>

                {/* Bottom Row: Title + Category Subtitle on Left | Circular Arrow Action on Right */}
                <div className="ref-course-bottom-info">
                  <div className="ref-course-text-col">
                    <h3 className="ref-course-card-title">{courseTitle}</h3>
                    <p className="ref-course-card-subtitle">{courseSubtitle}</p>
                  </div>

                  <div className="ref-course-arrow-btn">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Bottom Center Pagination Dots */}
      <div className="ref-courses-pagination">
        {courses.map((_: any, dotIdx: number) => (
          <button
            key={dotIdx}
            type="button"
            className={`ref-course-page-dot ${activeDot === dotIdx ? 'active' : ''}`}
            onClick={() => scrollToCourseIndex(dotIdx)}
            aria-label={`Go to slide ${dotIdx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
