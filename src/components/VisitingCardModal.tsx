'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../lib/api';

interface VisitingCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VisitingCardModal({
  isOpen,
  onClose
}: VisitingCardModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Fetch dynamic site settings
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

  const adminEmail = settings?.adminEmail || 'tamjidulislamsamim@gmail.com';
  const adminPhone = settings?.phone || '+880 1743 597989';
  const adminLocation = settings?.location || 'Dhaka, Bangladesh';
  const hihelloUrl = settings?.hihelloUrl || 'https://hihello.com/p/15a18c40-8d2b-4b05-8f39-e2ce947be1a4';
  const siteUrl = 'www.md-samim.com';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`Copied to Clipboard! ✦`, {
      description: text,
      duration: 2500
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="ref-card-backdrop" onClick={onClose}>
          <motion.div
            className="ref-physical-card-shell"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.88, rotateY: -8 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.88, rotateY: 8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              className="ref-card-close-floating"
              onClick={onClose}
              aria-label="Close visiting card"
            >
              ✕
            </button>

            {/* Left Section: Curved Light/Cream Brand Face */}
            <div className="ref-card-left-curve">
              {/* Outer Golden Geometric Arcs */}
              <div className="ref-gold-arc-outer"></div>
              <div className="ref-gold-arc-inner"></div>

              <div className="ref-brand-center-stack">
                {/* Stylized S Emblem with Orbital Swish */}
                <div className="ref-emblem-wrapper">
                  <div className="ref-emblem-swish-arc"></div>
                  <div className="ref-emblem-letter-s">S</div>
                </div>

                <h2 className="ref-brand-main-name">MD. SAMIM</h2>
                <p className="ref-brand-tagline-text">INNOVATE • SOLVE • SUCCEED</p>
              </div>
            </div>

            {/* Middle Vertical Gold Accent Divider */}
            <div className="ref-card-gold-divider"></div>

            {/* Right Section: Deep Navy/Obsidian Details Panel */}
            <div className="ref-card-right-panel">
              {/* Profile Name & Title */}
              <div className="ref-profile-header-block">
                <h3 className="ref-person-name">
                  <span className="ref-name-highlight">Md.</span> Samim
                </h3>
                <p className="ref-person-designation">AI &amp; Backend Specialist</p>
                <div className="ref-designation-underline"></div>
              </div>

              {/* Contact Information List with Golden Circle Icons */}
              <div className="ref-contacts-stack">
                {/* Phone */}
                <div
                  className="ref-contact-entry"
                  onClick={() => copyToClipboard(adminPhone, 'phone')}
                  title="Click to copy phone"
                >
                  <div className="ref-gold-circle-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.44-5.15-3.75-6.59-6.59l1.97-1.57c.28-.28.37-.68.25-1.02A11.36 11.36 0 018.96 4c0-.55-.45-1-1-1H4.5c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.49c.01-.55-.44-1.01-.99-1.01z"/>
                    </svg>
                  </div>
                  <span className="ref-contact-value-text">{adminPhone}</span>
                  {copiedField === 'phone' && <span className="ref-copy-tooltip">COPIED</span>}
                </div>

                {/* Email */}
                <div
                  className="ref-contact-entry"
                  onClick={() => copyToClipboard(adminEmail, 'email')}
                  title="Click to copy email"
                >
                  <div className="ref-gold-circle-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <span className="ref-contact-value-text">{adminEmail}</span>
                  {copiedField === 'email' && <span className="ref-copy-tooltip">COPIED</span>}
                </div>

                {/* Location */}
                <div className="ref-contact-entry">
                  <div className="ref-gold-circle-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <span className="ref-contact-value-text">{adminLocation}</span>
                </div>

                {/* Website / Digital Profile */}
                <a
                  href={hihelloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ref-contact-entry ref-link-entry"
                  title="Open official digital visiting profile"
                >
                  <div className="ref-gold-circle-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <span className="ref-contact-value-text">{siteUrl}</span>
                  <span className="ref-external-arrow">↗</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
