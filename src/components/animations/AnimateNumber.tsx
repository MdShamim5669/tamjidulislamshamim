'use client';

import React, { useEffect, useRef } from 'react';
import { useInView, animate } from 'framer-motion';

interface AnimateNumberProps {
  children?: React.ReactNode;
  value?: number | string;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AnimateNumber({
  children,
  value,
  duration = 1.2,
  delay = 0,
  prefix = '',
  suffix = '',
  className,
  style,
}: AnimateNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: '-20px' });

  // Resolve target value and detect potential percentage/symbol suffixes in string children
  const rawInput = value !== undefined ? value : children;
  
  let targetNumber = 0;
  let detectedSuffix = suffix;

  if (typeof rawInput === 'number') {
    targetNumber = rawInput;
  } else if (typeof rawInput === 'string') {
    if (rawInput.includes('%') && !detectedSuffix) {
      detectedSuffix = '%';
    }
    const cleanStr = rawInput.replace(/[^0-9.-]/g, '');
    targetNumber = parseFloat(cleanStr) || 0;
  } else if (React.isValidElement(rawInput)) {
    // If child is wrapped or contains nested text
    targetNumber = Number(value) || 0;
  }

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!inView) {
      node.textContent = `${prefix}0${detectedSuffix}`;
      return;
    }

    const controls = animate(0, targetNumber, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1], // Luxury cubic ease-out
      onUpdate(latest) {
        if (node) {
          node.textContent = `${prefix}${Math.round(latest)}${detectedSuffix}`;
        }
      },
    });

    return () => controls.stop();
  }, [targetNumber, inView, duration, delay, prefix, detectedSuffix]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{targetNumber}{detectedSuffix}
    </span>
  );
}
