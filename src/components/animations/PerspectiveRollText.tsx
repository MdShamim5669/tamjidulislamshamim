'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface PerspectiveRollTextProps {
  text: string;
  highlightWord?: string;
  highlightClass?: string;
  sparkle?: string;
  className?: string;
}

export default function PerspectiveRollText({
  text,
  highlightWord = 'Services',
  highlightClass = 'ref-title-accent',
  sparkle = '✦',
  className = ''
}: PerspectiveRollTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const words = text.split(' ');

  return (
    <span
      ref={ref}
      className={`perspective-text-root ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        position: 'relative'
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          perspective: '800px'
        }}
      >
        {words.map((word, index) => {
          const isHighlight = highlightWord && word.toLowerCase().includes(highlightWord.toLowerCase());

          return (
            <motion.span
              key={`${word}-${index}`}
              initial={{ opacity: 0, rotateX: 65, y: 24 }}
              animate={
                isInView
                  ? { opacity: 1, rotateX: 0, y: 0 }
                  : { opacity: 0, rotateX: 65, y: 24 }
              }
              transition={{
                duration: 0.75,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1]
              }}
              className={isHighlight ? highlightClass : ''}
              style={{
                display: 'inline-block',
                transformOrigin: 'bottom center',
                willChange: 'transform, opacity',
                ...(isHighlight
                  ? {
                      color: '#e63946',
                      fontWeight: 800,
                      textShadow: '0 0 20px rgba(230, 57, 70, 0.4)'
                    }
                  : {})
              }}
            >
              {word}
            </motion.span>
          );
        })}

        {sparkle && (
          <motion.span
            initial={{ scale: 0, opacity: 0, rotate: -30 }}
            animate={
              isInView
                ? { scale: [0, 1.3, 1], opacity: 1, rotate: 0 }
                : { scale: 0, opacity: 0, rotate: -30 }
            }
            transition={{
              duration: 0.7,
              delay: words.length * 0.12 + 0.15,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="ref-title-sparkle"
            style={{
              display: 'inline-block',
              color: '#e63946',
              marginLeft: '4px'
            }}
          >
            {sparkle}
          </motion.span>
        )}
      </span>

      {/* Animated Subtle Underline Laser Beam */}
      <motion.span
        initial={{ width: 0, opacity: 0 }}
        animate={isInView ? { width: '100%', opacity: 1 } : { width: 0, opacity: 0 }}
        transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'block',
          height: '2px',
          marginTop: '6px',
          background: 'linear-gradient(90deg, #e63946 0%, rgba(230, 57, 70, 0.4) 60%, transparent 100%)',
          borderRadius: '2px'
        }}
      />
    </span>
  );
}
