'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface LiquidShimmerTextProps {
  text: string;
  highlightWord?: string;
  highlightClass?: string;
  sparkle?: string;
  className?: string;
}

export default function LiquidShimmerText({
  text,
  highlightWord = 'Developed',
  highlightClass = 'ref-courses-title-accent',
  sparkle = '✦',
  className = ''
}: LiquidShimmerTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const parts = highlightWord && text.includes(highlightWord)
    ? text.split(highlightWord)
    : [text, ''];

  const beforeText = parts[0];
  const afterText = parts.slice(1).join(highlightWord);

  return (
    <motion.span
      ref={ref}
      className={`liquid-shimmer-wrap ${className}`}
      initial={{ opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        position: 'relative'
      }}
    >
      {beforeText && (
        <span
          style={{
            background: 'linear-gradient(120deg, #f5eeea 0%, #ffffff 50%, #d8cec9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {beforeText.trim()}
        </span>
      )}

      {highlightWord && (
        <span
          className={highlightClass}
          style={{
            position: 'relative',
            display: 'inline-block',
            fontWeight: 800,
            background: 'linear-gradient(110deg, #e63946 0%, #ff7582 30%, #e2c2a4 55%, #e63946 85%)',
            backgroundSize: '250% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: isInView ? 'liquidWave 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite' : 'none',
            filter: 'drop-shadow(0 0 16px rgba(230, 57, 70, 0.35))'
          }}
        >
          {highlightWord}
        </span>
      )}

      {afterText && <span>{afterText}</span>}

      {sparkle && (
        <motion.span
          initial={{ scale: 0, rotate: 45 }}
          animate={isInView ? { scale: [0, 1.25, 1], rotate: 0 } : { scale: 0, rotate: 45 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="sparkle"
          style={{
            display: 'inline-block',
            color: '#e63946',
            marginLeft: '4px'
          }}
        >
          {sparkle}
        </motion.span>
      )}

      <style jsx global>{`
        @keyframes liquidWave {
          0% {
            background-position: 100% 0%;
          }
          50% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 100% 0%;
          }
        }
      `}</style>
    </motion.span>
  );
}
