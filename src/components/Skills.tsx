'use client';

import React, { useState } from 'react';

type SkillCategory = 'frontend' | 'backend' | 'ai';

interface SkillItem {
  name: string;
  percentage: number;
  color: string;
  logo: string;
  level: string;
}

const categorizedSkills: Record<SkillCategory, SkillItem[]> = {
  frontend: [
    { name: 'Next.js 14', percentage: 95, color: '#e63946', logo: '/tech-logos/nextjs.png', level: 'Expert Architecture' },
    { name: 'React.js', percentage: 92, color: '#00d8ff', logo: '/tech-logos/reactjs.png', level: 'Component Systems' },
    { name: 'TypeScript', percentage: 90, color: '#3178c6', logo: '/tech-logos/typescript.png', level: 'Strict Type-Safe' },
    { name: 'JavaScript', percentage: 94, color: '#f7df1e', logo: '/tech-logos/javascript.png', level: 'Modern ES6+ Async' }
  ],
  backend: [
    { name: 'Node.js', percentage: 92, color: '#22c55e', logo: '/tech-logos/nodejs.png', level: 'High-Throughput Runtime' },
    { name: 'Express.js', percentage: 90, color: '#f472b6', logo: '/tech-logos/expressjs.png', level: 'RESTful Microservices' },
    { name: 'PostgreSQL', percentage: 88, color: '#38bdf8', logo: '/tech-logos/postgresql.png', level: 'Relational & Indexing' },
    { name: 'Prisma ORM', percentage: 92, color: '#818cf8', logo: '/tech-logos/prisma.png', level: 'Schema Modeling' }
  ],
  ai: [
    { name: 'Claude AI', percentage: 96, color: '#f97316', logo: '/tech-logos/claude-ai.png', level: 'Prompt Blueprints' },
    { name: 'Python', percentage: 92, color: '#60a5fa', logo: '/tech-logos/python.png', level: 'Data & Model Pipelines' },
    { name: 'PyTorch', percentage: 85, color: '#ee4c2c', logo: '/tech-logos/pytorch.png', level: 'Neural Modeling' },
    { name: 'Autonomous Agents', percentage: 94, color: '#e63946', logo: '/tech-logos/claude-ai.png', level: 'Multi-Agent Routing' }
  ]
};

const marqueeTechList = [
  { name: 'Next.js 14', logo: '/tech-logos/nextjs.png' },
  { name: 'TypeScript', logo: '/tech-logos/typescript.png' },
  { name: 'React.js', logo: '/tech-logos/reactjs.png' },
  { name: 'Claude AI', logo: '/tech-logos/claude-ai.png' },
  { name: 'Python', logo: '/tech-logos/python.png' },
  { name: 'PyTorch', logo: '/tech-logos/pytorch.png' },
  { name: 'Node.js', logo: '/tech-logos/nodejs.png' },
  { name: 'Express.js', logo: '/tech-logos/expressjs.png' },
  { name: 'PostgreSQL', logo: '/tech-logos/postgresql.png' },
  { name: 'Prisma ORM', logo: '/tech-logos/prisma.png' },
  { name: 'JavaScript', logo: '/tech-logos/javascript.png' },
  { name: 'Cloudinary', logo: '/tech-logos/cloudinary.png' }
];

export default function Skills() {
  const [activeTab, setActiveTab] = useState<SkillCategory>('frontend');
  const currentSkills = categorizedSkills[activeTab];

  // Circle Geometry Calculations (Radius 42, Circumference ~263.89)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  return (
    <section className="skills-section" id="skills">
      {/* Section Top Editorial Header */}
      <div className="section-header">
        <div className="section-title">
          <span>SKILLS &amp; PROFICIENCY</span>
          <span className="sparkle">✦</span>
        </div>
        <span className="section-tag">ENGINEERING COMPETENCIES</span>
      </div>

      {/* 100% Seamless Continuous Infinite Marquee Header */}
      <div className="skills-marquee-container">
        <div className="skills-marquee-group">
          {marqueeTechList.map((tech, idx) => (
            <div className="skill-pill-box" key={`set1-${idx}`} title={tech.name}>
              <img src={tech.logo} alt={tech.name} className="skill-tech-img" />
              <span className="skill-tech-name">{tech.name}</span>
            </div>
          ))}
        </div>
        <div className="skills-marquee-group" aria-hidden="true">
          {marqueeTechList.map((tech, idx) => (
            <div className="skill-pill-box" key={`set2-${idx}`} title={tech.name}>
              <img src={tech.logo} alt={tech.name} className="skill-tech-img" />
              <span className="skill-tech-name">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Luxury Skills Glass Container with Interactive Category Tabs */}
      <div className="skills-interactive-container">
        {/* Category Switcher Tabs */}
        <div className="skills-tab-bar">
          <button
            type="button"
            className={`skills-tab-btn ${activeTab === 'frontend' ? 'active' : ''}`}
            onClick={() => setActiveTab('frontend')}
          >
            <span className="tab-dot"></span>
            <span>Frontend Skills</span>
          </button>

          <button
            type="button"
            className={`skills-tab-btn ${activeTab === 'backend' ? 'active' : ''}`}
            onClick={() => setActiveTab('backend')}
          >
            <span className="tab-dot"></span>
            <span>Backend Skills</span>
          </button>

          <button
            type="button"
            className={`skills-tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            <span className="tab-dot"></span>
            <span>AI &amp; ML Skills</span>
          </button>
        </div>

        {/* Circular Percentage Meters Grid (Strict 3-4 Key Technologies) */}
        <div className="skills-meters-grid">
          {currentSkills.map((skill, index) => {
            const strokeDashoffset = circumference - (skill.percentage / 100) * circumference;

            return (
              <div className="skill-meter-card" key={`${activeTab}-${index}`}>
                {/* Circular Animated SVG Progress Gauge */}
                <div className="circle-gauge-wrap">
                  <svg className="circle-gauge-svg" width="110" height="110" viewBox="0 0 100 100">
                    {/* Background Base Ring */}
                    <circle
                      className="gauge-bg-ring"
                      cx="50"
                      cy="50"
                      r={radius}
                      strokeWidth="7"
                      fill="transparent"
                    />
                    {/* Active Gradient/Color Stroke Ring */}
                    <circle
                      className="gauge-active-ring"
                      cx="50"
                      cy="50"
                      r={radius}
                      strokeWidth="7"
                      fill="transparent"
                      stroke={skill.color}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      style={{
                        filter: `drop-shadow(0 0 8px ${skill.color}88)`
                      }}
                    />
                  </svg>

                  {/* Percentage Value Centered */}
                  <div className="gauge-center-val">
                    <span className="percent-num">{skill.percentage}%</span>
                  </div>
                </div>

                {/* Tech Title & Category Tag */}
                <div className="skill-meta-info">
                  <div className="skill-title-row">
                    <img src={skill.logo} alt={skill.name} className="skill-inline-icon" />
                    <h4 className="skill-name-text">{skill.name}</h4>
                  </div>
                  <span className="skill-level-text">{skill.level}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
