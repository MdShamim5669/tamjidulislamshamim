'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface BlurRevealTextProps {
  text: string;
  highlightWord?: string;
  highlightClass?: string;
  sparkle?: string;
  className?: string;
}

export default function BlurRevealText({
  text,
  highlightWord,
  highlightClass = 'ref-edu-title-accent',
  sparkle = '✦',
  className = ''
}: BlurRevealTextProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.1
      }
    }
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 24,
      filter: 'blur(10px)',
      scale: 0.96
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <motion.span
      ref={ref}
      className={`inline-flex items-center flex-wrap gap-x-2.5 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        columnGap: '12px',
        rowGap: '6px'
      }}
    >
      {words.map((word, idx) => {
        const isHighlight = highlightWord && word.toLowerCase().includes(highlightWord.toLowerCase());

        return (
          <motion.span
            key={`${word}-${idx}`}
            variants={wordVariants}
            className={isHighlight ? highlightClass : ''}
            style={{
              display: 'inline-block',
              willChange: 'transform, opacity, filter',
              ...(isHighlight
                ? {
                    background: 'linear-gradient(135deg, #e63946 0%, #ff7582 50%, #e2c2a4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 24px rgba(230, 57, 70, 0.3)'
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
          variants={{
            hidden: { opacity: 0, scale: 0.3, rotate: -45 },
            visible: {
              opacity: 1,
              scale: 1,
              rotate: 0,
              transition: {
                delay: words.length * 0.09 + 0.15,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
              }
            }
          }}
          className="ref-title-sparkle"
          style={{
            display: 'inline-block',
            color: '#e63946',
            marginLeft: '6px',
            textShadow: '0 0 16px rgba(230, 57, 70, 0.6)'
          }}
        >
          {sparkle}
        </motion.span>
      )}
    </motion.span>
  );
}
