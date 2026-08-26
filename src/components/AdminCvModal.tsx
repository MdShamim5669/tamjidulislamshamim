'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api, { API_BASE_URL } from '../lib/api';

interface AdminCvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CvData {
  hasCv: boolean;
  cvUrl: string | null;
  cvOriginalName: string | null;
  cvSize: number | null;
  cvFileType: string | null;
  cvUpdatedAt: string | null;
}

export default function AdminCvModal({ isOpen, onClose }: AdminCvModalProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Admin Authentication State
  const [adminKey, setAdminKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_cv_key') || '';
    }
    return '';
  });
  const [tempKeyInput, setTempKeyInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Boolean(localStorage.getItem('admin_cv_key'));
    }
    return false;
  });

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Fetch Current Dynamic CV
  const { data: cvData, isLoading, refetch } = useQuery<CvData>({
    queryKey: ['cv'],
    queryFn: async () => {
      const res = await api.get('/cv');
      return res.data?.data;
    },
    enabled: isOpen
  });

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const headers: Record<string, string> = {};
      if (adminKey) {
        headers['x-admin-key'] = adminKey;
      }

      setUploadProgress(20);
      const res = await api.post('/cv/upload', formData, {
        headers,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      });
      return res.data;
    },
    onMutate: () => {
      toast.loading('Uploading & optimizing CV via Cloudinary...', { id: 'cv-upload' });
    },
    onSuccess: (data) => {
      toast.success('CV Uploaded Successfully! ✦', {
        id: 'cv-upload',
        description: 'The dynamic download button is now live for all visitors.'
      });
      setUploadProgress(null);
      queryClient.invalidateQueries({ queryKey: ['cv'] });
      refetch();
    },
    onError: (error: any) => {
      setUploadProgress(null);
      const msg = error.response?.data?.message || 'Failed to upload CV. Please check your admin key.';
      toast.error('Upload Error', { id: 'cv-upload', description: msg });
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const headers: Record<string, string> = {};
      if (adminKey) {
        headers['x-admin-key'] = adminKey;
      }
      const res = await api.delete('/cv', { headers });
      return res.data;
    },
    onMutate: () => {
      toast.loading('Deleting CV from Cloudinary & database...', { id: 'cv-delete' });
    },
    onSuccess: () => {
      toast.success('CV Deleted Successfully ✦', {
        id: 'cv-delete',
        description: 'The download button has been reset to dynamic fallback.'
      });
      queryClient.invalidateQueries({ queryKey: ['cv'] });
      refetch();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to delete CV.';
      toast.error('Delete Error', { id: 'cv-delete', description: msg });
    }
  });

  // Drag & Drop Handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const next = prev - 1;
      if (next <= 0) setIsDragging(false);
      return Math.max(0, next);
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFile = (file: File) => {
    const validExtensions = ['pdf', 'doc', 'docx'];
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!ext || !validExtensions.includes(ext)) {
      toast.error('Invalid File Type', {
        description: 'Please upload a PDF (.pdf) or Word Document (.doc, .docx).'
      });
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error('File Too Large', {
        description: 'Max file size allowed is 15MB.'
      });
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setDragCounter(0);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    },
    [adminKey]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempKeyInput.trim()) {
      toast.error('Please enter the Admin Security Key.');
      return;
    }
    const key = tempKeyInput.trim();
    setAdminKey(key);
    localStorage.setItem('admin_cv_key', key);
    setIsUnlocked(true);
    toast.success('Admin Authenticated ✦');
  };

  const handleLock = () => {
    setAdminKey('');
    localStorage.removeItem('admin_cv_key');
    setIsUnlocked(false);
    toast.info('Admin Session Locked.');
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-cv-backdrop" onClick={onClose}>
      <div
        className="admin-cv-modal"
        onClick={(e) => e.stopPropagation()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Modal Header */}
        <div className="admin-cv-header">
          <div className="admin-cv-header-left">
            <div className="admin-cv-badge">
              <span className="admin-pulse-dot"></span>
              BACKEND CV MANAGER
            </div>
            <h3 className="admin-cv-title">Dynamic Resume Control Center</h3>
          </div>
          <button
            type="button"
            className="admin-cv-close-btn"
            onClick={onClose}
            aria-label="Close CV Manager"
          >
            ✕
          </button>
        </div>

        {/* Admin Unlock Bar */}
        {!isUnlocked ? (
          <form className="admin-auth-box" onSubmit={handleUnlock}>
            <div className="admin-auth-header">
              <span className="admin-auth-icon">🔒</span>
              <div>
                <h4 className="admin-auth-title">Administrator Verification</h4>
                <p className="admin-auth-desc">Enter your Admin Key / PIN to upload or delete CV documents.</p>
              </div>
            </div>
            <div className="admin-auth-inputs">
              <input
                type="password"
                placeholder="Enter Admin Security Key..."
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                className="admin-auth-input"
                autoFocus
              />
              <button type="submit" className="admin-auth-submit-btn">
                <span>Unlock</span>
                <span>✦</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="admin-session-bar">
            <div className="admin-session-status">
              <span className="session-dot"></span>
              <span>Admin Mode Active (Full Upload &amp; Deletion Rights)</span>
            </div>
            <button type="button" className="admin-lock-btn" onClick={handleLock}>
              Lock Session
            </button>
          </div>
        )}

        {/* Current Live CV Status */}
        <div className="admin-cv-status-section">
          <div className="status-section-header">
            <span className="section-label">LIVE STATUS</span>
            <span className={`status-pill ${cvData?.hasCv ? 'status-pill-live' : 'status-pill-empty'}`}>
              {cvData?.hasCv ? '● LIVE ON PORTFOLIO' : '○ NO ACTIVE CV'}
            </span>
          </div>

          {cvData?.hasCv ? (
            <div className="active-cv-card">
              <div className="cv-card-icon-wrap">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>

              <div className="cv-card-details">
                <h4 className="cv-card-filename" title={cvData.cvOriginalName || 'Resume.pdf'}>
                  {cvData.cvOriginalName || 'Md_Samim_Resume.pdf'}
                </h4>
                <div className="cv-card-meta">
                  <span>{formatFileSize(cvData.cvSize)}</span>
                  <span className="meta-separator">•</span>
                  <span>{formatDate(cvData.cvUpdatedAt)}</span>
                  <span className="meta-separator">•</span>
                  <span className="format-badge">
                    {cvData.cvFileType?.includes('pdf') ? 'PDF' : 'DOC'}
                  </span>
                </div>
              </div>

              <div className="cv-card-actions">
                <a
                  href={cvData.cvUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cv-action-btn view-btn"
                  title="Open live CV in new tab"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  <span>Preview</span>
                </a>

                {isUnlocked && (
                  <button
                    type="button"
                    className="cv-action-btn delete-btn"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete the active CV? The download button will revert to dynamic contact fallback.')) {
                        deleteMutation.mutate();
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    title="Delete CV from Cloudinary and DB"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    <span>{deleteMutation.isPending ? 'Deleting...' : 'Delete'}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="cv-empty-banner">
              <p>No CV document is currently uploaded. Visitors will be guided to contact you directly.</p>
            </div>
          )}
        </div>

        {/* Drag and Drop Upload Zone */}
        {isUnlocked ? (
          <div className="admin-dropzone-container">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              style={{ display: 'none' }}
            />

            <div
              className={`admin-dropzone ${isDragging ? 'dropzone-active' : ''} ${uploadMutation.isPending ? 'dropzone-uploading' : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="dropzone-glow"></div>
              <div className="dropzone-content">
                <div className="dropzone-icon-box">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>

                <div className="dropzone-text">
                  <h4 className="dropzone-headline">
                    {isDragging
                      ? 'Release to Upload & Replace CV'
                      : cvData?.hasCv
                      ? 'Drag & Drop New CV to Replace'
                      : 'Drag & Drop Your CV Here'}
                  </h4>
                  <p className="dropzone-subheadline">
                    Supports <strong>PDF, DOCX, DOC</strong> up to 15MB • Uploads directly to Cloudinary
                  </p>
                </div>

                <button
                  type="button"
                  className="dropzone-browse-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  disabled={uploadMutation.isPending}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                  <span>{uploadMutation.isPending ? 'Uploading...' : 'Browse Computer'}</span>
                </button>
              </div>

              {/* Upload Progress Bar */}
              {uploadProgress !== null && (
                <div className="dropzone-progress-wrap">
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{uploadProgress}% Uploading...</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="admin-locked-notice">
            <p>Unlock administrator access above to drag &amp; drop a new CV or delete the existing one.</p>
          </div>
        )}

        {/* Modal Footer Tips */}
        <div className="admin-cv-footer">
          <div className="footer-tip">
            <span className="tip-sparkle">✦</span>
            <span>All uploads auto-sync instantly with the <strong>DOWNLOAD CV</strong> button on the Hero page.</span>
          </div>
          <button type="button" className="admin-cv-done-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
