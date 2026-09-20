'use client';

import React, { useEffect, useState, useRef } from 'react';
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

function parseTarget(input: any, explicitVal?: any, explicitSuffix?: string): { target: number; suffix: string } {
  let target = 0;
  let suffix = explicitSuffix || '';

  if (explicitVal !== undefined && explicitVal !== null) {
    if (typeof explicitVal === 'number') target = explicitVal;
    else if (typeof explicitVal === 'string') {
      const match = explicitVal.match(/([0-9.-]+)/);
      if (match) target = parseFloat(match[1]);
      if (explicitVal.includes('%') && !suffix) suffix = '%';
    }
    return { target, suffix };
  }

  if (Array.isArray(input)) {
    for (const item of input) {
      if (typeof item === 'number') {
        target = item;
      } else if (typeof item === 'string') {
        const match = item.match(/([0-9.-]+)/);
        if (match && !target) target = parseFloat(match[1]);
        if (item.includes('%') && !suffix) suffix = '%';
      }
    }
    return { target, suffix };
  }

  if (typeof input === 'number') {
    target = input;
  } else if (typeof input === 'string') {
    const match = input.match(/([0-9.-]+)/);
    if (match) target = parseFloat(match[1]);
    if (input.includes('%') && !suffix) suffix = '%';
  }

  return { target, suffix };
}

export default function AnimateNumber({
  children,
  value,
  duration = 1.3,
  delay = 0,
  prefix = '',
  suffix = '',
  className,
  style,
}: AnimateNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });

  const { target, suffix: parsedSuffix } = parseTarget(children, value, suffix);
  const finalSuffix = suffix || parsedSuffix;

  const [displayNum, setDisplayNum] = useState(0);

  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1], // Smooth luxury ease-out
      onUpdate: (latest) => {
        setDisplayNum(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [target, inView, duration, delay]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{displayNum}{finalSuffix}
    </span>
  );
}
