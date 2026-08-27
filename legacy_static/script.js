(function () {
  'use strict';

  const TOTAL_FRAMES = 240;
  const FOLDER = 'dark_villain_frames_24fps_high_quality';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });

  const loader = document.getElementById('loader');
  const progressText = document.getElementById('load-progress');

  const images = [];
  let loadedCount = 0;
  let currentFrame = 0;
  let targetFrame = 0;
  let isInitialFrameDrawn = false;

  // Format frame path: frame_0001.jpg -> frame_0240.jpg
  function getFramePath(index) {
    const padIndex = String(index).padStart(4, '0');
    return `${FOLDER}/frame_${padIndex}.jpg`;
  }

  // Responsive retina DPR canvas scaling
  function resizeCanvas() {
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
  function renderFrame(frameIndex) {
    const img = images[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

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

  // Preload all 240 frame images
  function preloadImages() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameIndex = i - 1;

      img.onload = () => {
        loadedCount++;
        const percent = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
        if (progressText) {
          progressText.textContent = `${percent}%`;
        }

        // Draw initial frame as soon as frame 0 is ready
        if (frameIndex === 0 && !isInitialFrameDrawn) {
          isInitialFrameDrawn = true;
          renderFrame(0);
        }

        // All frames loaded
        if (loadedCount === TOTAL_FRAMES) {
          setTimeout(() => {
            if (loader) loader.classList.add('loaded');
          }, 350);
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES && loader) {
          loader.classList.add('loaded');
        }
      };

      img.src = getFramePath(i);
      images.push(img);
    }
  }

  // Calculate target frame from scroll progress
  function updateScroll() {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    
    // Total progress 0 to 1
    const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
    
    // Map scroll progress smoothly across all 240 frames
    targetFrame = progress * (TOTAL_FRAMES - 1);

    // Subtle canvas parallax/dimming as user scrolls past hero
    const heroHeight = window.innerHeight * 1.2;
    if (scrollY > heroHeight) {
      canvas.style.opacity = '0.45';
      canvas.style.filter = 'blur(3px)';
    } else {
      const heroProgress = Math.min(1, scrollY / heroHeight);
      canvas.style.opacity = String(0.92 - heroProgress * 0.45);
      canvas.style.filter = `blur(${heroProgress * 3}px)`;
    }

    updateEduTimelineScroll();
    updateExpTimelineScroll();
    updateNavScrollSpy();
  }

  // Dynamic Scroll-Spy to highlight current active navbar tab
  function updateNavScrollSpy() {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navItems = document.querySelectorAll('.nav-menu .nav-item');
    const scrollPos = window.scrollY + 220;

    let currentSectionId = '';
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  }

  // Update Middle Timeline Scroll in Education Section
  function updateEduTimelineScroll() {
    const section = document.getElementById('education');
    const middleTimeline = document.getElementById('edu-middle-timeline');
    if (!section || !middleTimeline) return;

    const fill = middleTimeline.querySelector('.timeline-progress-fill');
    const beacon = middleTimeline.querySelector('.timeline-glowing-beacon');
    const glowLine = middleTimeline.querySelector('.timeline-glow-line');
    if (!fill || !beacon || !glowLine) return;

    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Progress starts when section enters viewport
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

  // Update Timeline Scroll in Work Experience Section
  function updateExpTimelineScroll() {
    const section = document.getElementById('experience');
    const expTimeline = document.getElementById('exp-timeline-track');
    if (!section || !expTimeline) return;

    const fill = expTimeline.querySelector('.exp-progress-fill');
    const beacon = expTimeline.querySelector('.exp-glowing-beacon');
    const spine = expTimeline.querySelector('.exp-timeline-spine');
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

  // Butter-smooth rAF linear interpolation loop
  let lastDrawnFrame = -1;
  function animate() {
    // Lerp smoothing factor
    currentFrame += (targetFrame - currentFrame) * 0.12;

    const frameToDraw = Math.round(currentFrame);
    if (frameToDraw !== lastDrawnFrame && images[frameToDraw] && images[frameToDraw].complete) {
      renderFrame(frameToDraw);
      lastDrawnFrame = frameToDraw;
    }

    requestAnimationFrame(animate);
  }

  // Tilt / interactive hover effects on cards
  function initCardInteractions() {
    const cards = document.querySelectorAll('.project-card, .split-col, .testimonial-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // Interactive Services Accordion (Opens on Hover & Click)
  function initServicesAccordion() {
    const items = document.querySelectorAll('.service-accordion-item');
    items.forEach(item => {
      // Open on Hover
      item.addEventListener('mouseenter', () => {
        items.forEach(i => i.classList.remove('is-expanded'));
        item.classList.add('is-expanded');
      });

      // Click toggle fallback for mobile / touch devices
      const header = item.querySelector('.service-row-header');
      if (header) {
        header.addEventListener('click', (e) => {
          const wasExpanded = item.classList.contains('is-expanded');
          items.forEach(i => i.classList.remove('is-expanded'));
          if (!wasExpanded) {
            item.classList.add('is-expanded');
          }
        });
      }
    });
  }

  // Download CV button interaction
  const downloadBtn = document.getElementById('download-cv-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      // If no physical CV file is attached yet, create and download a sleek resume text document
      const resumeContent = "MD. SAMIM - Full Stack Web & AI Engineering Specialist\n\nEmail: tamjidulislamsamim@gmail.com\nPhone: +880 1743 597989\nGitHub: https://github.com/MdShamim5669\nDigital Card: https://hihello.com/p/15a18c40-8d2b-4b05-8f39-e2ce947be1a4\nPortfolio: https://mdsamim.design\n\nCore Specializations:\n- Full-Stack Web Development (React, Next.js, Node.js)\n- High-Performance Scalable Backend Systems & APIs\n- AI Agents, LLM Integrations & RAG Pipelines\n- Distributed Architecture, Microservices & Cloud Infrastructure\n\nAvailable for high-impact engineering & AI projects worldwide.";
      const blob = new Blob([resumeContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      downloadBtn.href = url;
      downloadBtn.download = "Md_Samim_Resume.txt";
    });
  }

  // Universal Smooth Anchor Scrolling with Header Offset Compensation
  const navItems = document.querySelectorAll('.nav-menu .nav-item');
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 76;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });

        // Update active nav state
        navItems.forEach(n => n.classList.remove('active'));
        if (this.classList.contains('nav-item')) {
          this.classList.add('active');
        }
      }
    });
  });

  // Sonner Toast Notification Controller
  function showToast({ title, description, type = 'info', duration = 4500 }) {
    const container = document.getElementById('toast-container');
    if (!container) return null;

    const toast = document.createElement('div');
    toast.className = `sonner-toast toast-${type}`;

    let iconHtml = '';
    if (type === 'loading') {
      iconHtml = '<div class="toast-spinner"></div>';
    } else if (type === 'success') {
      iconHtml = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#2ec4b6" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      iconHtml = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#e63946" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else {
      iconHtml = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#38bdf8" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon-wrap">${iconHtml}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-desc">${description}</div>
      </div>
      <button class="toast-close-btn" aria-label="Close">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px) scale(0.9)';
        setTimeout(() => toast.remove(), 250);
      });
    }

    if (duration > 0) {
      setTimeout(() => {
        if (toast.parentNode) {
          toast.style.opacity = '0';
          toast.style.transform = 'translateY(10px) scale(0.9)';
          setTimeout(() => toast.remove(), 250);
        }
      }, duration);
    }

    return toast;
  }

  // Luxury Modal Controller
  function openContactModal(userName) {
    const modal = document.getElementById('contact-modal');
    const title = document.getElementById('modal-user-name');
    if (!modal) return;

    if (title && userName) {
      title.textContent = `Thank you, ${userName}!`;
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Setup Modal Listeners
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');
  const contactModal = document.getElementById('contact-modal');

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeContactModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeContactModal);
  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeContactModal();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeContactModal();
  });

  // Handle contact form submission (Direct Inbox Delivery + Sonner Toast & Modal)
  window.handleFormSubmit = async function () {
    const feedback = document.getElementById('form-feedback');
    const form = document.getElementById('talk-form');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    const btnSpan = submitBtn ? submitBtn.querySelector('span') : null;
    if (!form || !feedback) return;

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      showToast({
        title: 'Missing Details',
        description: 'Please fill in your name, email, and message.',
        type: 'error'
      });
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      if (btnSpan) btnSpan.textContent = 'Sending...';
    }

    // Show Loading Sonner Toast
    const loadingToast = showToast({
      title: 'Transmitting Message',
      description: `Sending inquiry to Md. Samim's inbox...`,
      type: 'loading',
      duration: 0
    });

    try {
      // Connect directly to Express + Prisma + Resend backend endpoint
      const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : '/api';

      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          subject: subject || 'Portfolio Project Inquiry',
          message: message
        })
      });

      const data = await response.json();

      if (loadingToast && loadingToast.parentNode) {
        loadingToast.remove();
      }

      if (response.ok && data.success) {
        // Trigger Success Sonner Toast
        showToast({
          title: 'Message Delivered! ✦',
          description: `Dispatched via Resend directly to tamjidulislamsamim@gmail.com`,
          type: 'success',
          duration: 5000
        });

        // Trigger Luxury Celebration Modal
        openContactModal(name);

        form.reset();
        if (btnSpan) btnSpan.textContent = 'Sent Successfully!';
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      if (loadingToast && loadingToast.parentNode) {
        loadingToast.remove();
      }

      console.warn('FormSubmit AJAX fallback:', err);

      showToast({
        title: 'Network Fallback',
        description: 'Opening direct email client for backup delivery...',
        type: 'info',
        duration: 4000
      });

      // Fallback: Open mailto with prefilled values
      window.location.href = `mailto:tamjidulislamsamim@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        setTimeout(() => {
          if (btnSpan) btnSpan.textContent = 'Send Message';
        }, 4000);
      }
    }
  };

  // Initialize Services Accordion Interactions
  function initServicesAccordion() {
    const items = document.querySelectorAll('.service-accordion-item');
    if (!items.length) return;

    items.forEach(item => {
      const header = item.querySelector('.service-row-header');
      if (!header) return;

      header.addEventListener('click', () => {
        const isAlreadyExpanded = item.classList.contains('is-expanded');

        // Collapse all others for clean single-focus accordion
        items.forEach(other => {
          if (other !== item) {
            other.classList.remove('is-expanded');
          }
        });

        // Toggle current item
        if (isAlreadyExpanded) {
          item.classList.remove('is-expanded');
        } else {
          item.classList.add('is-expanded');
        }
      });
    });
  }

  // Smooth scroll and focus when clicking Let's Talk
  document.querySelectorAll('a[href="#contact"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('contact');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const nameInput = document.getElementById('form-name');
          if (nameInput) nameInput.focus();
        }, 600);
      }
    });
  });

  // Smooth scroll to top
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Smooth scroll to Home on clicking Nav Brand / Logo
  const navBrand = document.querySelector('.nav-brand');
  if (navBrand) {
    navBrand.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Dynamic Backend Data Synchronization (Zero Design / CSS Changes)
  async function initBackendDataSync() {
    const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000/api'
      : '/api';

    // 1. Dynamic Site Settings Sync
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.copyrightText) {
          const footerCopy = document.querySelector('.footer-copyright p');
          if (footerCopy) footerCopy.textContent = json.data.copyrightText;
        }
      }
    } catch (e) { /* silent fallback */ }

    // 2. Dynamic Projects Sync
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const grid = document.querySelector('.projects-grid');
          if (grid) {
            grid.innerHTML = json.data.map((p, i) => {
              const num = String(i + 1).padStart(2, '0');
              const previewClass = i % 3 === 0 ? 'preview-velvet' : i % 3 === 1 ? 'preview-aurora' : 'preview-mindspace';
              const imgClass = i % 3 === 0 ? 'velvet-img' : i % 3 === 1 ? 'aurora-img' : 'mockup-arch';
              const tagsHtml = (p.techStack || []).map(t => `<span class="tag">${t}</span>`).join('');
              const liveLink = p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-gold);margin-left:12px;font-size:12px;text-decoration:none;letter-spacing:0.05em;display:inline-flex;align-items:center;gap:4px;">Live Demo ↗</a>` : '';
              return `
                <article class="project-card" data-project="${i + 1}">
                  <div class="project-meta">
                    <span class="project-num">${num}</span>
                    <div class="project-titles">
                      <h3 class="project-name">${p.title.toUpperCase()}</h3>
                      <p class="project-category">${p.category} ${liveLink}</p>
                    </div>
                  </div>
                  <div class="project-preview ${previewClass}">
                    <div class="preview-inner">
                      <div class="preview-backdrop"></div>
                      <div class="preview-mockup">
                        <div class="mockup-header">
                          <span class="mockup-title">${p.description ? p.description.slice(0, 50) + '...' : 'System Architecture'}</span>
                        </div>
                        <div class="mockup-body">
                          <div class="mockup-image ${imgClass}"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="project-tags">
                    ${tagsHtml}
                  </div>
                </article>
              `;
            }).join('');
            initCardInteractions();
          }
        }
      }
    } catch (e) { /* silent fallback */ }

    // 3. Dynamic Work Experience Sync (Preserves Exact Design & Timeline Spine)
    try {
      const res = await fetch(`${API_BASE}/experiences`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const cardsColumn = document.getElementById('exp-cards-column') || document.querySelector('.exp-cards-column');
          if (cardsColumn) {
            cardsColumn.innerHTML = json.data.map((exp, index) => {
              const sideClass = index % 2 === 0 ? 'card-right' : 'card-left';
              const bulletsHtml = (exp.bullets || []).map(b => `
                <div class="deliverable-item">
                  <div class="deliverable-icon">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                  </div>
                  <p class="deliverable-text">${b}</p>
                </div>
              `).join('');

              const techTags = (exp.techStack || []).map(t => `<span class="pill-chip">${t}</span>`).join('');

              return `
                <article class="experience-card ${sideClass}">
                  <div class="exp-card-header">
                    <div class="exp-date-pill">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>${exp.startDate} – ${exp.endDate}</span>
                    </div>
                    <span class="exp-company-badge">${exp.company.toUpperCase()}</span>
                  </div>

                  <h3 class="exp-role-title">${exp.role}</h3>
                  <p class="exp-role-description">
                    ${exp.location} • ${exp.employmentType || 'Contract / Authoring'}
                  </p>

                  <div class="exp-deliverables-wrap">
                    <div class="deliverables-heading">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2">
                        <line x1="4" y1="9" x2="20" y2="9"></line>
                        <line x1="4" y1="15" x2="20" y2="15"></line>
                        <line x1="10" y1="3" x2="8" y2="21"></line>
                        <line x1="16" y1="3" x2="14" y2="21"></line>
                      </svg>
                      <span>KEY DELIVERABLES</span>
                    </div>
                    <div class="deliverables-list">
                      ${bulletsHtml}
                    </div>
                  </div>

                  ${techTags ? `
                    <div class="exp-tech-stack-row">
                      <div class="tech-stack-label">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                          <path d="M2 17l10 5 10-5"></path>
                          <path d="M2 12l10 5 10-5"></path>
                        </svg>
                        <span>TECH ARSENAL</span>
                      </div>
                      <div class="tech-pill-list">
                        ${techTags}
                      </div>
                    </div>
                  ` : ''}
                </article>
              `;
            }).join('');
            updateExpTimelineScroll();
          }
        }
      }
    } catch (e) { /* silent fallback */ }
  }

  // Listeners
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', resizeCanvas);

  // Initialize
  resizeCanvas();
  preloadImages();
  updateScroll();
  initCardInteractions();
  initServicesAccordion();
  initBackendDataSync();
  requestAnimationFrame(animate);
})();
