'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TrackingGlowTextProps {
  text: string;
  highlightWord?: string;
  highlightClass?: string;
  sparkle?: string;
  className?: string;
}

export default function TrackingGlowText({
  text,
  highlightWord = 'PROJECT',
  highlightClass = 'ref-title-accent',
  sparkle = '✦',
  className = ''
}: TrackingGlowTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  // Separate normal text and highlighted text
  const parts = highlightWord && text.includes(highlightWord)
    ? text.split(highlightWord)
    : [text, ''];

  const beforeText = parts[0];
  const afterText = parts.slice(1).join(highlightWord);

  return (
    <motion.span
      ref={ref}
      className={`tracking-glow-container ${className}`}
      initial={{ opacity: 0, letterSpacing: '0.22em', y: 16 }}
      animate={
        isInView
          ? { opacity: 1, letterSpacing: '0.04em', y: 0 }
          : { opacity: 0, letterSpacing: '0.22em', y: 16 }
      }
      transition={{
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        willChange: 'letter-spacing, opacity, transform',
        textTransform: 'uppercase'
      }}
    >
      {beforeText && (
        <span style={{ color: 'var(--text-main, #f5eeea)' }}>
          {beforeText.trim()}
        </span>
      )}

      {highlightWord && (
        <span
          className={`tracking-highlight-glow ${highlightClass}`}
          style={{
            position: 'relative',
            display: 'inline-block',
            fontWeight: 800,
            background: 'linear-gradient(90deg, #e63946 0%, #ff6b78 50%, #e63946 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: isInView ? 'laserShimmer 3.2s ease-in-out infinite' : 'none',
            textShadow: '0 0 25px rgba(230, 57, 70, 0.45)'
          }}
        >
          {highlightWord}
        </span>
      )}

      {afterText && <span>{afterText}</span>}

      {sparkle && (
        <motion.span
          initial={{ scale: 0, rotate: -90, opacity: 0 }}
          animate={
            isInView
              ? { scale: [0, 1.3, 1], rotate: 0, opacity: 1 }
              : { scale: 0, rotate: -90, opacity: 0 }
          }
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="sparkle"
          style={{
            display: 'inline-block',
            color: '#e63946',
            marginLeft: '4px',
            fontSize: '1em'
          }}
        >
          {sparkle}
        </motion.span>
      )}

      <style jsx global>{`
        @keyframes laserShimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </motion.span>
  );
}
