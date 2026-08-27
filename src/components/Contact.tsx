'use client';

import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../lib/api';
import CelebrationModal from './CelebrationModal';
import VisitingCardModal from './VisitingCardModal';
import SendMessageModal from './SendMessageModal';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // Fetch dynamic settings from backend
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      try {
        const res = await api.get('/settings');
        return res.data?.data;
      } catch (err) {
        return null;
      }
    }
  });

  // TanStack Query useMutation for contact form
  const contactMutation = useMutation({
    mutationFn: async (payload: typeof formData) => {
      const response = await api.post('/contact', payload);
      return response.data;
    },
    onMutate: () => {
      toast.loading('Transmitting message via Resend API...', { id: 'contact-toast' });
    },
    onSuccess: () => {
      toast.success('Message Delivered! ✦', {
        id: 'contact-toast',
        description: `Delivered directly to ${settings?.adminEmail || 'tamjidulislamsamim@gmail.com'}`,
        duration: 5000
      });
      setIsSuccessModalOpen(true);
      setIsMessageModalOpen(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    },
    onError: (error: any) => {
      console.warn('Direct server fallback:', error);
      toast.error('Opening Email Client', {
        id: 'contact-toast',
        description: 'Connecting to default mail client...',
        duration: 4000
      });

      // Mailto Fallback
      window.location.href = `mailto:${settings?.adminEmail || 'tamjidulislamsamim@gmail.com'}?subject=${encodeURIComponent(
        formData.subject || 'Inquiry from ' + formData.name
      )}&body=${encodeURIComponent(
        formData.message + '\n\nFrom: ' + formData.name + ' (' + formData.email + ')'
      )}`;
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Required Fields', {
        description: 'Please fill in Name, Email and Message.'
      });
      return;
    }
    contactMutation.mutate(formData);
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const adminEmail = (settings?.adminEmail || 'tamjidulislamsamim@gmail.com').toUpperCase();
  const location = (settings?.location || 'Dhaka, Bangladesh').toUpperCase();
  const instagramTag = '@SH4MIM.PY';
  const instagramUrl = settings?.instagramUrl || 'https://www.instagram.com/sh4mim.py/';

  return (
    <>
      <footer className="ref-footer-section" id="contact">
        {/* Main Editorial 4-Cell Grid Container (Matches Reference Layout) */}
        <div className="ref-footer-container">
          {/* Cell 1: Heading Block */}
          <div className="ref-footer-cell cell-heading">
            <h2 className="ref-main-title">
              LET'S CREATE<br />SOMETHING
            </h2>
            <span className="ref-cursive-script">Amazing</span>
          </div>

          {/* Cell 2: Status & Message Trigger (Opens Modal) */}
          <div className="ref-footer-cell cell-cta">
            <div className="ref-status-block">
              <span className="ref-status-eyebrow">
                I'M CURRENTLY OPEN<br />FOR NEW PROJECTS
              </span>
              <p className="ref-status-desc">
                Let's build something impactful and beautiful together.
              </p>
            </div>

            <button
              type="button"
              className="ref-action-pill-btn"
              onClick={() => setIsMessageModalOpen(true)}
            >
              <span>SEND ME A MESSAGE</span>
              <span className="ref-btn-sparkle">✦</span>
            </button>
          </div>

          {/* Cell 3: Direct Contact Information Links */}
          <div className="ref-footer-cell cell-info">
            <div className="ref-info-stack">
              {/* Email */}
              <a href={`mailto:${settings?.adminEmail || 'tamjidulislamsamim@gmail.com'}`} className="ref-info-item">
                <div className="ref-info-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <span className="ref-info-text">{adminEmail}</span>
              </a>

              {/* Instagram / Social */}
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="ref-info-item">
                <div className="ref-info-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <span className="ref-info-text">{instagramTag}</span>
              </a>

              {/* Location */}
              <div className="ref-info-item static-item">
                <div className="ref-info-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <span className="ref-info-text">{location}</span>
              </div>

              {/* Digital Visiting Card Pill */}
              <button
                type="button"
                className="ref-card-trigger-btn"
                onClick={() => setIsCardModalOpen(true)}
              >
                <span>DIGITAL VISITING CARD</span>
                <span className="sparkle">✦</span>
              </button>
            </div>
          </div>

          {/* Cell 4: Elegant Portrait Card */}
          <div className="ref-footer-cell cell-portrait">
            <div className="ref-portrait-wrapper">
              <img
                src="/dark_villain_frames_24fps_high_quality/frame_0001.jpg"
                alt="Md. Samim"
                className="ref-portrait-photo"
              />
              <div className="ref-portrait-overlay"></div>
            </div>
          </div>
        </div>

        {/* Bottom Banner: Editorial Signature */}
        <div className="ref-footer-bottom">
          <span className="ref-visiting-tag">THANK YOU FOR VISITING</span>
          <span className="ref-bottom-sparkle">✦</span>
          <a href="#hero" className="ref-back-top-link" onClick={scrollToTop} title="Back to Top">
            ↑
          </a>
        </div>
      </footer>

      {/* Pop-up Modals */}
      <SendMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        isPending={contactMutation.isPending}
        adminEmail={adminEmail}
      />

      <CelebrationModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        senderName={formData.name}
      />

      <VisitingCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
      />
    </>
  );
}
