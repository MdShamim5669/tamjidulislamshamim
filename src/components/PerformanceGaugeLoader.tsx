'use client';

import React from 'react';

interface PerformanceGaugeLoaderProps {
  progress: number;
  isLoaded: boolean;
}

export default function PerformanceGaugeLoader({
  progress,
  isLoaded
}: PerformanceGaugeLoaderProps) {
  // 0-100% mapped smoothly to -130deg to +130deg (260deg total sweep)
  const minAngle = -130;
  const maxAngle = 130;
  const currentAngle = minAngle + (Math.min(100, Math.max(0, progress)) / 100) * (maxAngle - minAngle);

  // Generate 41 radial polar ticks
  const totalTicks = 41;
  const ticks = Array.from({ length: totalTicks }).map((_, i) => {
    const angle = minAngle + (i / (totalTicks - 1)) * (maxAngle - minAngle);
    const isMajor = i % 5 === 0;
    const isCharge = angle < 0;
    const isPassed = angle <= currentAngle;
    return { i, angle, isMajor, isCharge, isPassed };
  });

  const powerKw = Math.round((progress / 100) * 380);

  return (
    <div className={`ev-gauge-preloader-overlay ${isLoaded ? 'loader-hidden' : ''}`} id="site-preloader">
      <div className="ev-gauge-backdrop-glow"></div>

      <div className="ev-gauge-container">
        {/* Top Header Badge */}
        <div className="ev-gauge-top-brand">
          <span className="ev-brand-dot"></span>
          <span className="ev-brand-title">MD. SAMIM • SYSTEM DIAGNOSTIC</span>
          <span className="ev-brand-chip">EV-POWER INSTRUMENT</span>
        </div>

        {/* Circular Dial Instrument */}
        <div className="ev-gauge-dial">
          {/* Bezel Ring Accents */}
          <div className="ev-gauge-bezel-outer"></div>
          <div className="ev-gauge-bezel-inner"></div>

          {/* SVG Scale Bands */}
          <svg className="ev-gauge-scale-bands-svg" viewBox="0 0 320 320">
            {/* Inactive Background Arc */}
            <circle
              cx="160"
              cy="160"
              r="128"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="5"
              strokeDasharray="580 600"
              strokeDashoffset="145"
              strokeLinecap="round"
            />

            {/* Charge Green Accent Segment */}
            <circle
              cx="160"
              cy="160"
              r="128"
              fill="none"
              stroke="rgba(16, 185, 129, 0.6)"
              strokeWidth="5"
              strokeDasharray="130 600"
              strokeDashoffset="145"
              strokeLinecap="round"
            />

            {/* Dynamic Active Power Beam Arc */}
            <circle
              cx="160"
              cy="160"
              r="128"
              fill="none"
              stroke="url(#evPowerGrad)"
              strokeWidth="7"
              strokeDasharray="450 600"
              strokeDashoffset={580 - (progress / 100) * 440}
              strokeLinecap="round"
              className="ev-gauge-active-stroke"
            />

            <defs>
              <linearGradient id="evPowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="25%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#e63946" />
                <stop offset="100%" stopColor="#ff4d6d" />
              </linearGradient>
            </defs>
          </svg>

          {/* Polar Radial Ticks Layer */}
          <div className="ev-gauge-ticks-layer">
            {ticks.map((t) => (
              <div
                key={t.i}
                className={`ev-tick ${t.isMajor ? 'major' : 'minor'} ${t.isCharge ? 'charge' : 'power'} ${t.isPassed ? 'active' : ''}`}
                style={{
                  transform: `rotate(${t.angle}deg) translateY(-124px)`
                }}
              />
            ))}
          </div>

          {/* Scale Numeric Labels */}
          <div className="ev-scale-labels-layer">
            <span className="ev-scale-tag chg">CHG</span>
            <span className="ev-scale-tag zero">0</span>
            <span className="ev-scale-tag p50">50</span>
            <span className="ev-scale-tag pwr">100 PWR</span>
          </div>

          {/* Rotating Needle Beam Indicator */}
          <div
            className="ev-gauge-needle-wrap"
            style={{ transform: `rotate(${currentAngle}deg)` }}
          >
            <div className="ev-gauge-needle-beam"></div>
            <div className="ev-gauge-needle-tip-glow"></div>
          </div>

          {/* Central Digital Output Hub */}
          <div className="ev-gauge-center-hub">
            <div className="ev-hub-glass-core">
              <span className="ev-hub-small-label">LOAD PROGRESS</span>
              <div className="ev-hub-numeric-row">
                <span className="ev-hub-main-num">{progress}</span>
                <span className="ev-hub-unit">%</span>
              </div>
              <span className="ev-hub-kw-val">{powerKw} kW</span>
            </div>
          </div>
        </div>

        {/* High-Voltage Battery State of Charge (SOC) Bar */}
        <div className="ev-gauge-soc-container">
          <div className="ev-soc-meta-row">
            <span className="ev-soc-label">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="2" y="7" width="18" height="10" rx="2" ry="2"></rect>
                <line x1="22" y1="11" x2="22" y2="13"></line>
                <line x1="6" y1="11" x2="6" y2="13"></line>
              </svg>
              <span>HIGH-VOLTAGE SOC</span>
            </span>
            <span className="ev-soc-percent">{progress}% READY</span>
          </div>

          {/* SOC Track */}
          <div className="ev-soc-track">
            <div
              className="ev-soc-fill-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Diagnostic Subtitle */}
          <div className="ev-soc-status-text">
            <span>CALIBRATING THREE.JS / CANVAS 60FPS SEQUENCE SHADERS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
