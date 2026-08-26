import React, { useEffect, useRef, useState } from 'react';
import PerformanceGaugeLoader from './PerformanceGaugeLoader';

const TOTAL_FRAMES = 240;
const FOLDER = '/dark_villain_frames_24fps_high_quality';

export default function CanvasSequence() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let currentFrame = 0;
    let targetFrame = 0;
    let lastDrawnFrame = -1;
    let isInitialFrameDrawn = false;
    let animFrameId: number;
    let loaded = 0;

    const images: HTMLImageElement[] = [];

    function getFramePath(index: number) {
      const padIndex = String(index).padStart(4, '0');
      return `${FOLDER}/frame_${padIndex}.jpg`;
    }

    // Responsive retina DPR canvas scaling
    function resizeCanvas() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.scale(dpr, dpr);
      renderFrame(Math.round(currentFrame));
    }

    // Draw frame maintaining aspect ratio (cover mode with top headspace for navbar)
    function renderFrame(frameIndex: number) {
      if (!canvas || !ctx) return;
      const img = images[frameIndex];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

      // Shift character slightly lower so the floating navbar sits clearly above the head
      const verticalShift = Math.max(60, canvasHeight * 0.1);

      if (canvasRatio > imgRatio) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2 + verticalShift;
      } else {
        drawWidth = canvasHeight * imgRatio;
        drawHeight = canvasHeight;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = verticalShift;
      }

      ctx.fillStyle = '#060203';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    // Preload all 240 frames
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameIndex = i - 1;

      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);

        if (frameIndex === 0 && !isInitialFrameDrawn) {
          isInitialFrameDrawn = true;
          renderFrame(0);
        }

        if (loaded === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };

      img.src = getFramePath(i);
      images.push(img);
    }
    imagesRef.current = images;

    // Timeline Scroll animations for Education & Experience
    function updateEduTimelineScroll() {
      const section = document.getElementById('education');
      const middleTimeline = document.getElementById('edu-middle-timeline');
      if (!section || !middleTimeline) return;

      const fill = middleTimeline.querySelector('.timeline-progress-fill') as HTMLElement | null;
      const beacon = middleTimeline.querySelector('.timeline-glowing-beacon') as HTMLElement | null;
      const glowLine = middleTimeline.querySelector('.timeline-glow-line') as HTMLElement | null;
      if (!fill || !beacon || !glowLine) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const startOffset = windowHeight * 0.75;
      const scrollDistance = rect.height + windowHeight * 0.5;
      const currentPos = startOffset - rect.top;

      let progress = currentPos / scrollDistance;
      progress = Math.max(0, Math.min(1, progress));

      const trackHeight = glowLine.clientHeight;
      const beaconY = 8 + progress * (trackHeight - 16);

      fill.style.height = `${progress * 100}%`;
      beacon.style.top = `${beaconY}px`;
    }

    function updateExpTimelineScroll() {
      const section = document.getElementById('experience');
      const expTimeline = document.getElementById('exp-timeline-track');
      if (!section || !expTimeline) return;

      const fill = expTimeline.querySelector('.exp-progress-fill') as HTMLElement | null;
      const beacon = expTimeline.querySelector('.exp-glowing-beacon') as HTMLElement | null;
      const spine = expTimeline.querySelector('.exp-timeline-spine') as HTMLElement | null;
      if (!fill || !beacon || !spine) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const startOffset = windowHeight * 0.75;
      const scrollDistance = rect.height + windowHeight * 0.5;
      const currentPos = startOffset - rect.top;

      let progress = currentPos / scrollDistance;
      progress = Math.max(0, Math.min(1, progress));

      const trackHeight = spine.clientHeight;
      const beaconY = 8 + progress * (trackHeight - 16);

      fill.style.height = `${progress * 100}%`;
      beacon.style.top = `${beaconY}px`;
    }

    function updateNavScrollSpy() {
      const sections = document.querySelectorAll('section[id], footer[id]');
      const navItems = document.querySelectorAll('.nav-menu .nav-item');
      const scrollPos = window.scrollY + 220;

      let currentSectionId = '';
      sections.forEach((section) => {
        const el = section as HTMLElement;
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = el.getAttribute('id') || '';
        }
      });

      if (currentSectionId) {
        navItems.forEach((item) => {
          const href = item.getAttribute('href');
          if (href === `#${currentSectionId}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    }

    // Scroll calculation
    function handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));

      targetFrame = progress * (TOTAL_FRAMES - 1);

      // Parallax / subtle dimming on scroll past hero
      const heroHeight = window.innerHeight * 1.2;
      if (canvas) {
        if (scrollY > heroHeight) {
          canvas.style.opacity = '0.45';
          canvas.style.filter = 'blur(3px)';
        } else {
          const heroProgress = Math.min(1, scrollY / heroHeight);
          canvas.style.opacity = String(0.92 - heroProgress * 0.45);
          canvas.style.filter = `blur(${heroProgress * 3}px)`;
        }
      }

      updateEduTimelineScroll();
      updateExpTimelineScroll();
      updateNavScrollSpy();
    }

    // Butter-smooth rAF Lerp Loop (0.12 smoothing factor)
    function animate() {
      currentFrame += (targetFrame - currentFrame) * 0.12;
      const frameToDraw = Math.round(currentFrame);

      if (frameToDraw !== lastDrawnFrame && images[frameToDraw] && images[frameToDraw].complete) {
        renderFrame(frameToDraw);
        lastDrawnFrame = frameToDraw;
      }

      animFrameId = requestAnimationFrame(animate);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', handleScroll, { passive: true });
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  const progressPercent = Math.floor((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <>
      {/* Background Preloader — ThreeUI EV Power Performance Gauge */}
      <PerformanceGaugeLoader progress={progressPercent} isLoaded={isLoaded} />

      {/* Main Interactive Canvas (Fixed Fullscreen Behind Page) */}
      <div className="canvas-background-container">
        <canvas ref={canvasRef} id="hero-canvas" className="hero-canvas"></canvas>
        <div className="canvas-overlay-gradient"></div>
      </div>
    </>
  );
}

