'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  senderName: string;
}

export default function CelebrationModal({
  isOpen,
  onClose,
  senderName
}: CelebrationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="contact-modal-backdrop active" onClick={onClose}>
          <motion.div
            className="contact-modal-card"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="contact-modal-header">
              <div className="contact-modal-sparkle">✦ ✦ ✦</div>
              <button
                type="button"
                className="contact-modal-close"
                onClick={onClose}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>
            <div className="contact-modal-body">
              <div className="contact-modal-avatar">
                <span className="contact-modal-avatar-letter">S</span>
              </div>
              <h3 className="contact-modal-title">Thank You, {senderName || 'Valued Colleague'}!</h3>
              <p className="contact-modal-desc">
                Your message has been delivered directly to <strong>Md. Samim's</strong> primary inbox via Resend.
              </p>
              <div className="contact-modal-info-box">
                <span className="info-box-tag">EXPECTED RESPONSE</span>
                <p className="info-box-time">Within 12–24 Hours</p>
                <p className="info-box-note">For urgent discussions, reach out directly at <strong>+880 1743 597989</strong> or <strong>tamjidulislamsamim@gmail.com</strong>.</p>
              </div>
              <button
                type="button"
                className="contact-modal-btn"
                onClick={onClose}
              >
                <span>Back to Portfolio</span>
                <span className="sparkle">✦</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
