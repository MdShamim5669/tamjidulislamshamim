'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  itemGap?: number;
  containerStyle?: React.CSSProperties;
}

interface ScrollStackItemProps {
  children: React.ReactNode;
  index: number;
  total?: number;
  topOffset?: number;
  scaleStep?: number;
  dimStep?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollStackItem({
  children,
  index,
  total = 5,
  topOffset = 90,
  scaleStep = 0.04,
  dimStep = 0.08,
  className = '',
  style = {},
}: ScrollStackItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Calculate dynamic scale reduction as user scrolls beyond this card
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - scaleStep]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 1 - dimStep]);

  // Card stack sticky positioning
  const stickyTop = topOffset + index * 20;

  return (
    <div
      ref={containerRef}
      className={`scroll-stack-card-wrapper ${className}`}
      style={{
        position: 'sticky',
        top: `${stickyTop}px`,
        marginBottom: '48px',
        willChange: 'transform',
        zIndex: index + 1,
        ...style,
      }}
    >
      <motion.div
        style={{
          scale,
          opacity,
          transformOrigin: 'top center',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function ScrollStack({
  children,
  className = '',
  containerStyle = {},
}: ScrollStackProps) {
  return (
    <div
      className={`scroll-stack-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        ...containerStyle,
      }}
    >
      {children}
    </div>
  );
}
