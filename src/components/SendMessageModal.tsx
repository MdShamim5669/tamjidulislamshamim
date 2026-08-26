'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      subject: string;
      message: string;
    }>
  >;
  handleSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  adminEmail: string;
}

export default function SendMessageModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  handleSubmit,
  isPending,
  adminEmail
}: SendMessageModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="msg-modal-backdrop" onClick={onClose}>
          <motion.div
            className="msg-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Ambient Lighting Background */}
            <div className="msg-modal-ambient"></div>

            {/* Top Bar */}
            <div className="msg-modal-top-bar">
              <div className="msg-modal-badge">
                <span className="msg-badge-dot"></span>
                <span>DIRECT RESEND TRANSMISSION</span>
                <span className="msg-badge-sparkle">✦</span>
              </div>

              <button
                type="button"
                className="msg-modal-close-btn"
                onClick={onClose}
                aria-label="Close message modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Heading */}
            <div className="msg-modal-header">
              <h3 className="msg-modal-title">Send a Direct Project Message</h3>
              <p className="msg-modal-subtitle">
                Deliver your project requirements directly to{' '}
                <strong className="msg-highlight-email">{adminEmail.toLowerCase()}</strong> with sub-second transmission.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="msg-modal-form">
              <div className="msg-form-grid">
                {/* Name */}
                <div className="msg-field-wrap">
                  <label className="msg-field-label">
                    <span>YOUR NAME</span>
                    <span className="msg-req-star">*</span>
                  </label>
                  <div className="msg-input-box">
                    <svg className="msg-field-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <input
                      type="text"
                      required
                      placeholder="Md. Samim"
                      className="msg-input-elem"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="msg-field-wrap">
                  <label className="msg-field-label">
                    <span>BUSINESS EMAIL</span>
                    <span className="msg-req-star">*</span>
                  </label>
                  <div className="msg-input-box">
                    <svg className="msg-field-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <input
                      type="email"
                      required
                      placeholder="tamjidulislamsamim@gmail.com"
                      className="msg-input-elem"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="msg-field-wrap">
                <label className="msg-field-label">SUBJECT / PROJECT SCOPE</label>
                <div className="msg-input-box">
                  <svg className="msg-field-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="9" x2="20" y2="9"></line>
                    <line x1="4" y1="15" x2="20" y2="15"></line>
                    <line x1="10" y1="3" x2="8" y2="21"></line>
                    <line x1="16" y1="3" x2="14" y2="21"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="e.g. System Architecture / AI Agent Pipeline / Hiring"
                    className="msg-input-elem"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="msg-field-wrap">
                <label className="msg-field-label">
                  <span>MESSAGE DETAILS</span>
                  <span className="msg-req-star">*</span>
                </label>
                <div className="msg-input-box msg-textarea-box">
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your project, technical deliverables, or collaboration inquiry..."
                    className="msg-input-elem msg-textarea-elem"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="msg-modal-footer">
                <button
                  type="submit"
                  className="msg-submit-btn"
                  disabled={isPending}
                >
                  <span>{isPending ? 'Transmitting via Resend...' : 'SEND MESSAGE NOW'}</span>
                  <span className="msg-sparkle">✦</span>
                </button>

                <div className="msg-security-note">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span>Encrypted Direct Delivery</span>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
