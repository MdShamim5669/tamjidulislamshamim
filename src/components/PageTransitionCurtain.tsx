'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export type CurtainEffect = 'fade' | 'wipe' | 'doors' | 'iris';

const EFFECTS: CurtainEffect[] = ['fade', 'wipe', 'doors', 'iris'];

export default function PageTransitionCurtain() {
  const pathname = usePathname();
  const [effectIndex, setEffectIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stage, setStage] = useState<'idle' | 'covering' | 'revealing'>('idle');
  const initialRender = useRef(true);

  const currentEffect = EFFECTS[effectIndex];

  // Listen to pathname changes for route transitions
  useEffect(() => {
    // Skip animation on initial page load
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    // Trigger curtain cover
    setIsTransitioning(true);
    setStage('covering');

    const coverTimer = setTimeout(() => {
      // Switch to reveal phase
      setStage('revealing');

      const revealTimer = setTimeout(() => {
        setIsTransitioning(false);
        setStage('idle');
        // Automatically swap to next curtain effect for the next transition
        setEffectIndex((prev) => (prev + 1) % EFFECTS.length);
      }, 550);

      return () => clearTimeout(revealTimer);
    }, 450);

    return () => clearTimeout(coverTimer);
  }, [pathname]);

  if (!isTransitioning && stage === 'idle') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: isTransitioning ? 'all' : 'none',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* 1. FADE EFFECT */}
      {currentEffect === 'fade' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: stage === 'covering' ? 1 : 0 }}
          transition={{ duration: stage === 'covering' ? 0.35 : 0.45, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #0d0408 0%, #060204 100%)',
          }}
        />
      )}

      {/* 2. WIPE EFFECT */}
      {currentEffect === 'wipe' && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{
            x: stage === 'covering' ? '0%' : '100%',
          }}
          transition={{
            duration: 0.5,
            ease: [0.77, 0, 0.175, 1],
          }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #0e0509 0%, #060204 100%)',
            borderRight: stage === 'covering' ? '2px solid rgba(230, 57, 70, 0.7)' : 'none',
            borderLeft: stage === 'revealing' ? '2px solid rgba(230, 57, 70, 0.7)' : 'none',
            boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)',
          }}
        />
      )}

      {/* 3. DOORS EFFECT (Stage Split Curtains) */}
      {currentEffect === 'doors' && (
        <>
          {/* Left Door */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{
              x: stage === 'covering' ? '0%' : '-100%',
            }}
            transition={{
              duration: 0.5,
              ease: [0.77, 0, 0.175, 1],
            }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '50.5%',
              background: 'linear-gradient(90deg, #090306 0%, #12060c 100%)',
              borderRight: '1px solid rgba(230, 57, 70, 0.6)',
              boxShadow: '10px 0 30px rgba(0, 0, 0, 0.8)',
            }}
          />
          {/* Right Door */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{
              x: stage === 'covering' ? '0%' : '100%',
            }}
            transition={{
              duration: 0.5,
              ease: [0.77, 0, 0.175, 1],
            }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '50.5%',
              background: 'linear-gradient(270deg, #090306 0%, #12060c 100%)',
              borderLeft: '1px solid rgba(230, 57, 70, 0.6)',
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.8)',
            }}
          />
        </>
      )}

      {/* 4. IRIS EFFECT (Circular Aperture) */}
      {currentEffect === 'iris' && (
        <motion.div
          initial={{ clipPath: 'circle(0% at 50% 50%)' }}
          animate={{
            clipPath:
              stage === 'covering'
                ? 'circle(150% at 50% 50%)'
                : 'circle(0% at 50% 50%)',
          }}
          transition={{
            duration: 0.55,
            ease: [0.77, 0, 0.175, 1],
          }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, #1a0812 0%, #060204 80%)',
            boxShadow: 'inset 0 0 80px rgba(230, 57, 70, 0.4)',
          }}
        />
      )}
    </div>
  );
}
