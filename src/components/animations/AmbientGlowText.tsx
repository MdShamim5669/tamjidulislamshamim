'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AmbientGlowTextProps {
  line1?: string;
  line2?: string;
  scriptWord?: string;
  className?: string;
}

export default function AmbientGlowText({
  line1 = "LET'S CREATE",
  line2 = 'SOMETHING',
  scriptWord = 'Amazing',
  className = ''
}: AmbientGlowTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <div
      ref={ref}
      className={`ambient-glow-wrapper ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block'
      }}
    >
      {/* Ambient Breathing Radial Glow Halo */}
      <motion.div
        animate={
          isInView
            ? {
                opacity: [0.3, 0.65, 0.3],
                scale: [0.95, 1.08, 0.95]
              }
            : { opacity: 0 }
        }
        transition={{
          repeat: Infinity,
          duration: 4.5,
          ease: 'easeInOut'
        }}
        style={{
          position: 'absolute',
          inset: '-20px -30px',
          background: 'radial-gradient(circle at 40% 50%, rgba(230, 57, 70, 0.22) 0%, rgba(226, 194, 164, 0.08) 50%, transparent 75%)',
          filter: 'blur(28px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Main Headline */}
      <h2
        className="ref-main-title"
        style={{
          position: 'relative',
          zIndex: 1,
          margin: 0,
          lineHeight: 1.05
        }}
      >
        <span style={{ display: 'block', overflow: 'hidden' }}>
          <motion.span
            initial={{ y: '110%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'block', willChange: 'transform, opacity' }}
          >
            {line1}
          </motion.span>
        </span>
        <span style={{ display: 'block', overflow: 'hidden' }}>
          <motion.span
            initial={{ y: '110%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'block', willChange: 'transform, opacity' }}
          >
            {line2}
          </motion.span>
        </span>
      </h2>

      {/* Cursive Script Accent */}
      {scriptWord && (
        <motion.span
          className="ref-cursive-script"
          initial={{ opacity: 0, scale: 0.88, rotate: -3 }}
          animate={
            isInView
              ? { opacity: 1, scale: 1, rotate: 0 }
              : { opacity: 0, scale: 0.88, rotate: -3 }
          }
          transition={{ duration: 0.95, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'block',
            marginTop: '8px',
            background: 'linear-gradient(135deg, #e2c2a4 0%, #ff8a93 50%, #e63946 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: isInView ? 'scriptShimmer 5s ease-in-out infinite' : 'none',
            filter: 'drop-shadow(0 0 16px rgba(226, 194, 164, 0.35))'
          }}
        >
          {scriptWord}
        </motion.span>
      )}

      <style jsx global>{`
        @keyframes scriptShimmer {
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
    </div>
  );
}
