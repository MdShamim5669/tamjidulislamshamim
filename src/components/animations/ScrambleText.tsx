'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface ScrambleTextProps {
  text: string;
  className?: string;
  sparkle?: string;
  durationMs?: number;
  revealSpeedMs?: number;
  scrambleChars?: string;
}

const DEFAULT_CHARS = '01#@$%&*<>~/X_Z+=';

export default function ScrambleText({
  text,
  className = '',
  sparkle = '✦',
  durationMs = 900,
  revealSpeedMs = 45,
  scrambleChars = DEFAULT_CHARS
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.4 });
  const [displayText, setDisplayText] = useState(text);
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    if (!isInView) {
      setDisplayText(text);
      setIsResolved(false);
      return;
    }

    let iteration = 0;
    const totalChars = text.length;
    const intervalTime = Math.max(25, Math.floor(durationMs / totalChars));

    const timer = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return char;
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          })
          .join('')
      );

      if (iteration >= totalChars) {
        clearInterval(timer);
        setIsResolved(true);
      }

      iteration += 1 / 1.5;
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isInView, text, durationMs, scrambleChars]);

  return (
    <span
      ref={ref}
      className={`inline-flex items-center gap-2 ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        letterSpacing: '0.08em',
        fontFeatureSettings: '"tnum" on, "cv02" on'
      }}
    >
      <span
        style={{
          color: isResolved ? 'inherit' : '#e63946',
          transition: 'color 0.4s ease',
          textShadow: isResolved ? 'none' : '0 0 12px rgba(230, 57, 70, 0.6)'
        }}
      >
        {displayText}
      </span>
      {sparkle && (
        <span
          className="sparkle"
          style={{
            display: 'inline-block',
            color: '#e63946',
            transform: isResolved ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(45deg)',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
            opacity: isResolved ? 1 : 0.6
          }}
        >
          {sparkle}
        </span>
      )}
    </span>
  );
}
