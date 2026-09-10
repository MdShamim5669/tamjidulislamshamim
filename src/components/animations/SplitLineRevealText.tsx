'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SplitLineRevealTextProps {
  firstWord?: string;
  accentWord?: string;
  accentClass?: string;
  pipeCursor?: boolean;
  className?: string;
}

export default function SplitLineRevealText({
  firstWord = 'Work',
  accentWord = 'Experience',
  accentClass = 'ref-exp-title-accent',
  pipeCursor = true,
  className = ''
}: SplitLineRevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <span
      ref={ref}
      className={`inline-flex items-center gap-3 overflow-hidden ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        overflow: 'hidden',
        verticalAlign: 'bottom'
      }}
    >
      <span style={{ overflow: 'hidden', display: 'inline-block' }}>
        <motion.span
          initial={{ y: '115%', opacity: 0, rotate: 2 }}
          animate={isInView ? { y: '0%', opacity: 1, rotate: 0 } : { y: '115%', opacity: 0, rotate: 2 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'inline-block', willChange: 'transform, opacity' }}
        >
          {firstWord}
        </motion.span>
      </span>

      <span style={{ overflow: 'hidden', display: 'inline-block' }}>
        <motion.span
          initial={{ y: '115%', opacity: 0, rotate: -2 }}
          animate={isInView ? { y: '0%', opacity: 1, rotate: 0 } : { y: '115%', opacity: 0, rotate: -2 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={accentClass}
          style={{
            display: 'inline-block',
            willChange: 'transform, opacity',
            background: 'linear-gradient(135deg, #e63946 0%, #ff8a93 60%, #e2c2a4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {accentWord}
        </motion.span>
      </span>

      {pipeCursor && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
          className="ref-exp-cursor-pipe"
          style={{
            display: 'inline-block',
            color: '#e63946',
            fontWeight: 300,
            marginLeft: '2px'
          }}
        >
          |
        </motion.span>
      )}
    </span>
  );
}

export function RoleShimmerText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.4 });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, x: -12 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <span
        style={{
          background: 'linear-gradient(90deg, #f5eeea 0%, #ffffff 40%, #e2c2a4 70%, #f5eeea 100%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: isInView ? 'roleShimmer 4s ease-in-out infinite' : 'none'
        }}
      >
        {text}
      </span>
      <span
        style={{
          display: 'inline-block',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#e63946',
          marginLeft: '8px',
          boxShadow: '0 0 10px #e63946'
        }}
      />
      <style jsx global>{`
        @keyframes roleShimmer {
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
