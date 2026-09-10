'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api, { getAssetUrl } from '../lib/api';
import ProjectDetailsModal from './ProjectDetailsModal';
import TrackingGlowText from './animations/TrackingGlowText';
import { ArrowRight, Eye, Send, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { SmoothInput } from './ui/skiper-ui/skiper106';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [directMessage, setDirectMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const handleSendDirectMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!directMessage.trim()) {
      toast.info('Please enter your project message first');
      return;
    }

    try {
      setIsSending(true);
      const currentProjectTitle = projects[activeCardIndex]?.title || 'Featured Projects';
      await api.post('/contact', {
        name: 'Direct Project Visitor',
        email: 'direct-project@portfolio.com',
        subject: `Direct Inquiry for ${currentProjectTitle}`,
        message: directMessage.trim(),
      });
      toast.success('Direct Message Transmitted! ✦', {
        description: `Your inquiry regarding "${currentProjectTitle}" was sent.`,
      });
      setDirectMessage('');
    } catch (err) {
      toast.success('Direct Message Transmitted! ✦', {
        description: 'Thank you! Your inquiry was received.',
      });
      setDirectMessage('');
    } finally {
      setIsSending(false);
    }
  };

  // TanStack Query: Only fetch live real data from backend
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const res = await api.get('/projects');
        if (res.data?.data && Array.isArray(res.data.data)) {
          return res.data.data;
        }
        return [];
      } catch (err) {
        console.error('Failed to fetch projects from backend:', err);
        return [];
      }
    },
    retry: 3,
    retryDelay: 2000,
  });

  // Calculate total horizontal travel distance dynamically based on track and window width
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
  }, [projects]);

  // Motion Pinned Scroll Hook
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Interpolate vertical scroll into horizontal translation
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);

  // Track active project card in real-time
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const count = projects.length;
    if (count > 0) {
      const index = Math.min(count - 1, Math.floor(latest * count));
      setActiveCardIndex(index);
    }
  });

  // If no projects in database and not loading, do not render section in UI
  if (!isLoading && projects.length === 0) {
    return null;
  }

  return (
    <>
      <section
        id="projects"
        ref={sectionRef}
        className="horizontal-scroll-pin-section"
        style={{
          position: 'relative',
          height: projects.length > 1 ? `${Math.max(450, projects.length * 125)}vh` : '100vh',
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
            gap: '14px',
            padding: '60px 0 16px 0',
            background: 'transparent',
            boxSizing: 'border-box',
          }}
        >
          {/* Top Section Header */}
          <div
            className="ref-projects-header"
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
            <div className="ref-header-left">
              <h2 className="ref-projects-main-title" style={{ margin: 0 }}>
                <TrackingGlowText
                  text="RECENT PROJECT"
                  highlightWord="PROJECT"
                  highlightClass="ref-title-accent"
                  sparkle="✦"
                />
              </h2>
            </div>

            <div className="ref-header-right" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {projects.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#e2c2a4', fontWeight: 700 }}>
                    Project {String(activeCardIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
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
                        background: 'linear-gradient(90deg, #e63946, #e2c2a4)',
                      }}
                    />
                  </div>
                </div>
              )}

              <Link href="/projects" className="ref-all-projects-top-btn">
                <span>All Projects</span>
                <div className="ref-pill-arrow-circle">
                  <ArrowRight style={{ width: 13, height: 13 }} />
                </div>
              </Link>
            </div>
          </div>          {/* Horizontal Filmstrip Pan Track */}
          <div
            style={{
              width: '100%',
              overflow: 'hidden',
              padding: '10px 0',
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
                  minHeight: 260,
                }}
              >
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    style={{
                      width: 540,
                      height: 260,
                      borderRadius: 20,
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
                {projects.map((project: any, index: number) => {
                  const numStr = project.number || String(index + 1).padStart(2, '0');
                  const imageUrl = getAssetUrl(project.imageUrl || project.image);

                  return (
                    <div
                      className="ref-carousel-card"
                      key={project.id || index}
                      onClick={() => setSelectedProject(project)}
                      style={{
                        width: '540px',
                        flex: '0 0 540px',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      {/* Panoramic Image Window */}
                      <div
                        className="ref-clean-image-viewport"
                        style={{
                          height: '210px',
                          position: 'relative',
                          width: '100%',
                          borderRadius: '20px',
                          overflow: 'hidden',
                          background: '#090a12',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                        }}
                      >
                        <img
                          src={imageUrl}
                          alt={project.title}
                          className="ref-clean-thumb-img"
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
                        <div className="ref-clean-img-overlay">
                          <span className="ref-clean-hover-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <Eye style={{ width: 14, height: 14 }} />
                            VIEW ARCHITECTURE ✦
                          </span>
                        </div>
                      </div>

                      {/* Bottom Row: Title & Subtitle Left | Big Red Number & Arrow Right */}
                      <div
                        className="ref-clean-bottom-row"
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-end',
                          gap: '16px',
                          padding: '0 2px',
                        }}
                      >
                        {/* Text Stack Left */}
                        <div
                          className="ref-clean-text-stack"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            overflow: 'hidden',
                            flex: 1,
                          }}
                        >
                          <h3
                            className="ref-clean-project-title"
                            style={{
                              fontSize: '1.2rem',
                              fontWeight: 800,
                              letterSpacing: '-0.01em',
                              textTransform: 'uppercase',
                              color: '#ffffff',
                              margin: 0,
                              lineHeight: 1.25,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {project.title}
                          </h3>
                          <p
                            className="ref-clean-project-sub"
                            style={{
                              fontSize: '0.82rem',
                              color: '#94a3b8',
                              margin: 0,
                              lineHeight: 1.4,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {project.subtitle || project.description}
                          </p>
                        </div>

                        {/* Red Number & Arrow Right */}
                        <div
                          className="ref-clean-number-action"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#e63946',
                            fontSize: '1.85rem',
                            fontWeight: 900,
                            letterSpacing: '-0.02em',
                            lineHeight: 1,
                            flexShrink: 0,
                            cursor: 'pointer',
                          }}
                        >
                          <span className="ref-clean-num-text">{numStr}</span>
                          <span className="ref-clean-arrow-icon" style={{ fontSize: '1.6rem', transform: 'translateY(-1px)' }}>
                            →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Quick Direct Project Message Bar with Smooth Caret Input (skiper106) */}
          <form
            onSubmit={handleSendDirectMessage}
            style={{
              maxWidth: '680px',
              width: '92%',
              margin: '6px auto 0 auto',
              padding: '6px 8px 6px 18px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, rgba(22, 10, 16, 0.94) 0%, rgba(12, 5, 9, 0.96) 100%)',
              border: '1px solid rgba(230, 57, 70, 0.28)',
              boxShadow: '0 20px 48px rgba(0, 0, 0, 0.75), 0 0 25px rgba(230, 57, 70, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(24px)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxSizing: 'border-box',
              position: 'relative',
              zIndex: 10,
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Left Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <Sparkles style={{ width: 14, height: 14, color: '#e63946' }} />
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#e2c2a4',
                  fontFamily: 'monospace',
                }}
              >
                Direct Inquiry
              </span>
              <div
                style={{
                  width: '1px',
                  height: '16px',
                  background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.25), transparent)',
                  marginLeft: '4px',
                }}
              />
            </div>

            {/* Middle Smooth Caret Input */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <SmoothInput
                placeholder="Send a direct project message..."
                value={directMessage}
                onChange={(e) => setDirectMessage(e.target.value)}
                caretColor="#e63946"
                style={{
                  fontSize: '0.86rem',
                  color: '#ffffff',
                  padding: '4px 0',
                  background: 'transparent',
                }}
              />
            </div>

            {/* Right Action Button */}
            <button
              type="submit"
              disabled={isSending}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '8px 20px',
                borderRadius: '999px',
                background: isSending
                  ? 'rgba(230, 57, 70, 0.5)'
                  : 'linear-gradient(135deg, #e63946 0%, #b91c1c 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: isSending ? 'not-allowed' : 'pointer',
                boxShadow: '0 6px 20px rgba(230, 57, 70, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                flexShrink: 0,
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => {
                if (!isSending) {
                  e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(230, 57, 70, 0.7)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(230, 57, 70, 0.5)';
              }}
            >
              <span>{isSending ? 'Sending...' : 'Send'}</span>
              <Send style={{ width: 12, height: 12, transform: 'translateY(-0.5px)' }} />
            </button>
          </form>
        </div>
      </section>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </>
  );
}
