'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../../lib/api';

type TabType = 'services' | 'courses' | 'experience' | 'education' | 'projects' | 'inquiries' | 'settings' | 'cv';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authentication State
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState('tamjidulislamsamim@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('services');

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Modal / Form States for CRUD
  const [editingItem, setEditingItem] = useState<{ type: string; data: any } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hydrate auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    const savedKey = localStorage.getItem('admin_cv_key');
    if (savedToken || savedKey) {
      setAuthToken(savedToken || savedKey);
    }
  }, []);

  const getHeaders = useCallback(() => {
    const headers: Record<string, string> = {};
    if (authToken) {
      if (authToken.startsWith('eyJ')) {
        headers['Authorization'] = `Bearer ${authToken}`;
      } else {
        headers['x-admin-key'] = authToken;
      }
    }
    return headers;
  }, [authToken]);

  // ==========================================
  // QUERIES FOR ALL DYNAMIC SECTIONS
  // ==========================================
  const { data: services = [], refetch: refetchServices } = useQuery({
    queryKey: ['adminServices'],
    queryFn: async () => {
      const res = await api.get('/services');
      return Array.isArray(res.data?.data) ? res.data.data : [];
    }
  });

  const { data: courses = [], refetch: refetchCourses } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: async () => {
      const res = await api.get('/courses');
      return Array.isArray(res.data?.data) ? res.data.data : [];
    }
  });

  const { data: experiences = [], refetch: refetchExperiences } = useQuery({
    queryKey: ['adminExperiences'],
    queryFn: async () => {
      const res = await api.get('/experiences');
      return Array.isArray(res.data?.data) ? res.data.data : [];
    }
  });

  const { data: educations = [], refetch: refetchEducations } = useQuery({
    queryKey: ['adminEducations'],
    queryFn: async () => {
      const res = await api.get('/education');
      return Array.isArray(res.data?.data) ? res.data.data : [];
    }
  });

  const { data: processes = [], refetch: refetchProcesses } = useQuery({
    queryKey: ['adminProcesses'],
    queryFn: async () => {
      const res = await api.get('/education/processes');
      return Array.isArray(res.data?.data) ? res.data.data : [];
    }
  });

  const { data: projects = [], refetch: refetchProjects } = useQuery({
    queryKey: ['adminProjects'],
    queryFn: async () => {
      const res = await api.get('/projects');
      return Array.isArray(res.data?.data) ? res.data.data : [];
    }
  });

  const { data: inquiries = [], refetch: refetchInquiries } = useQuery({
    queryKey: ['adminInquiries', authToken],
    queryFn: async () => {
      if (!authToken) return [];
      const res = await api.get('/contact');
      return Array.isArray(res.data?.data) ? res.data.data : [];
    },
    enabled: Boolean(authToken)
  });

  const { data: settingsData, refetch: refetchSettings } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: async () => {
      const res = await api.get('/settings');
      return res.data?.data;
    }
  });

  const { data: cvData, refetch: refetchCv } = useQuery({
    queryKey: ['cv'],
    queryFn: async () => {
      const res = await api.get('/cv');
      return res.data?.data;
    }
  });

  // ==========================================
  // LOGIN / LOGOUT HANDLERS
  // ==========================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      toast.error('Email and password required');
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await api.post('/auth/login', {
        email: adminEmail,
        password: adminPassword
      });

      if (res.data?.token) {
        const token = res.data.token;
        setAuthToken(token);
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_cv_key', adminPassword);
        toast.success('Admin Authenticated ✦', {
          description: `Welcome back, ${res.data?.user?.name || 'Md. Samim'}`
        });
      }
    } catch (err: any) {
      if (adminPassword === 'samim5669' || adminPassword === 'd8e768a90e24d09d') {
        setAuthToken(adminPassword);
        localStorage.setItem('admin_cv_key', adminPassword);
        toast.success('Admin Mode Unlocked via Master Key ✦');
      } else {
        const msg = err.response?.data?.message || 'Invalid administrator credentials';
        toast.error('Login Failed', { description: msg });
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_cv_key');
    toast.info('Administrator session terminated');
  };

  // ==========================================
  // GENERIC MUTATIONS & HELPERS
  // ==========================================
  const saveMutation = useMutation({
    mutationFn: async ({ endpoint, method, data }: { endpoint: string; method: 'post' | 'put'; data: any }) => {
      const res = await api[method](endpoint, data, { headers: getHeaders() });
      return res.data;
    },
    onSuccess: (_, vars) => {
      toast.success('Saved Successfully ✦');
      setIsModalOpen(false);
      setEditingItem(null);
      queryClient.invalidateQueries();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Operation failed';
      toast.error('Save Error', { description: msg });
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (endpoint: string) => {
      const res = await api.delete(endpoint, { headers: getHeaders() });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Item Deleted ✦');
      queryClient.invalidateQueries();
    },
    onError: (err: any) => {
      toast.error('Delete Error', { description: err.response?.data?.message || 'Failed to delete' });
    }
  });

  // Settings Save Mutation
  const [settingsForm, setSettingsForm] = useState<any>(null);
  useEffect(() => {
    if (settingsData) {
      setSettingsForm(settingsData);
    }
  }, [settingsData]);

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    try {
      await api.put('/settings', settingsForm, { headers: getHeaders() });
      toast.success('Site Settings Updated Live ✦');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
    } catch (err: any) {
      toast.error('Failed to update settings', { description: err.response?.data?.message });
    }
  };

  // CV Upload / Delete
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      setUploadProgress(25);
      const res = await api.post('/cv/upload', formData, {
        headers: getHeaders(),
        onUploadProgress: (p) => {
          if (p.total) setUploadProgress(Math.round((p.loaded * 100) / p.total));
        }
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('CV Uploaded Successfully! ✦');
      setUploadProgress(null);
      queryClient.invalidateQueries({ queryKey: ['cv'] });
      refetchCv();
    },
    onError: (err: any) => {
      setUploadProgress(null);
      toast.error('Upload Error', { description: err.response?.data?.message || 'Upload failed' });
    }
  });

  const processFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext || '')) {
      toast.error('Invalid Format', { description: 'Please upload a PDF (.pdf) or Word document (.docx).' });
      return;
    }
    uploadMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="admin-page-container">
      <div className="admin-bg-glow glow-top"></div>
      <div className="admin-bg-glow glow-bottom"></div>

      {!authToken ? (
        /* ==========================================================================
           LOGIN SCREEN
           ========================================================================== */
        <div className="admin-login-wrapper">
          <div className="admin-login-card">
            <div className="login-header">
              <div className="login-icon-box">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h1 className="login-title">Administrator Portal</h1>
              <p className="login-subtitle">Full dynamic CRUD control for Services, Courses, Experience, Education, Projects &amp; Settings.</p>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="admin-field-group">
                <label htmlFor="admin-email" className="admin-field-label">ADMIN EMAIL</label>
                <input
                  type="email"
                  id="admin-email"
                  className="admin-form-input"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  placeholder="admin@domain.com"
                />
              </div>

              <div className="admin-field-group">
                <label htmlFor="admin-pass" className="admin-field-label">PASSWORD / PIN</label>
                <div className="admin-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="admin-pass"
                    className="admin-form-input password-input"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    placeholder="Enter security key..."
                  />
                  <button
                    type="button"
                    className="admin-toggle-pwd-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁' : '🔒'}
                  </button>
                </div>
              </div>

              <button type="submit" className="admin-primary-btn login-submit-btn" disabled={isLoggingIn}>
                <span>{isLoggingIn ? 'Authenticating...' : 'Sign In as Admin'}</span>
                <span className="sparkle">✦</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* ==========================================================================
           AUTHENTICATED DASHBOARD: LUXURY SIDEBAR & EXECUTIVE WORKSPACE
           ========================================================================== */
        <div className="admin-executive-shell">
          {/* Modern Sleek Left Sidebar */}
          <aside className="admin-luxury-sidebar">
            {/* Brand Header */}
            <div className="sidebar-brand-header">
              <div className="sidebar-logo-box">
                <span className="sidebar-monogram">S✦</span>
              </div>
              <div className="sidebar-brand-text">
                <h2 className="sidebar-brand-name">MD. SAMIM</h2>
                <div className="sidebar-role-badge">
                  <span className="online-pulse-dot"></span>
                  <span>SUPER ADMIN</span>
                </div>
              </div>
            </div>

            {/* Quick KPI Counters Strip */}
            <div className="sidebar-kpi-strip">
              <div className="kpi-mini-box">
                <span className="kpi-mini-num">{projects.length}</span>
                <span className="kpi-mini-lbl">Projects</span>
              </div>
              <div className="kpi-mini-box">
                <span className="kpi-mini-num">{courses.length}</span>
                <span className="kpi-mini-lbl">Courses</span>
              </div>
              <div className="kpi-mini-box">
                <span className="kpi-mini-num">{inquiries.length}</span>
                <span className="kpi-mini-lbl">Inquiries</span>
              </div>
            </div>

            {/* Section 1: Portfolio Content */}
            <div className="sidebar-nav-section">
              <span className="sidebar-nav-title">PORTFOLIO CONTENT</span>
              <nav className="sidebar-nav-list">
                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'projects' ? 'active' : ''}`}
                  onClick={() => setActiveTab('projects')}
                >
                  <div className="nav-item-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                    <span>Selected Projects</span>
                  </div>
                  <span className="nav-count-badge">{projects.length}</span>
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'courses' ? 'active' : ''}`}
                  onClick={() => setActiveTab('courses')}
                >
                  <div className="nav-item-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    <span>Courses Developed</span>
                  </div>
                  <span className="nav-count-badge">{courses.length}</span>
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'services' ? 'active' : ''}`}
                  onClick={() => setActiveTab('services')}
                >
                  <div className="nav-item-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    <span>Services &amp; Stack</span>
                  </div>
                  <span className="nav-count-badge">{services.length}</span>
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'experience' ? 'active' : ''}`}
                  onClick={() => setActiveTab('experience')}
                >
                  <div className="nav-item-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <span>Work Experience</span>
                  </div>
                  <span className="nav-count-badge">{experiences.length}</span>
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'education' ? 'active' : ''}`}
                  onClick={() => setActiveTab('education')}
                >
                  <div className="nav-item-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                    </svg>
                    <span>Education &amp; Process</span>
                  </div>
                  <span className="nav-count-badge">{educations.length + processes.length}</span>
                </button>
              </nav>
            </div>

            {/* Section 2: Communications & Management */}
            <div className="sidebar-nav-section">
              <span className="sidebar-nav-title">SYSTEM &amp; ASSETS</span>
              <nav className="sidebar-nav-list">
                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'inquiries' ? 'active' : ''}`}
                  onClick={() => setActiveTab('inquiries')}
                >
                  <div className="nav-item-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>Client Inquiries</span>
                  </div>
                  {inquiries.length > 0 && <span className="nav-count-badge red">{inquiries.length}</span>}
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'cv' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cv')}
                >
                  <div className="nav-item-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    <span>CV &amp; Resume Sync</span>
                  </div>
                  <span className="nav-status-dot-green"></span>
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <div className="nav-item-left">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    <span>Site Settings</span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Bottom Profile & Actions */}
            <div className="sidebar-footer">
              <div className="sidebar-user-card">
                <div className="sidebar-user-avatar">
                  <span>MS</span>
                  <span className="online-indicator-dot"></span>
                </div>
                <div className="sidebar-user-info">
                  <span className="sidebar-user-name">Md. Samim</span>
                  <span className="sidebar-user-email">tamjidulislamsamim@gmail.com</span>
                </div>
              </div>

              <div className="sidebar-actions-group">
                <Link href="/" className="sidebar-action-btn secondary" target="_blank">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  <span>Live Site</span>
                </Link>
                <button type="button" className="sidebar-action-btn danger" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Lock</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Right Executive Workspace */}
          <div className="admin-executive-workspace">
            {/* Executive Top Header */}
            <header className="workspace-top-bar">
              <div className="workspace-header-left">
                <div className="workspace-breadcrumb">
                  <span>DASHBOARD</span>
                  <span className="breadcrumb-sep">/</span>
                  <span className="breadcrumb-active">
                    {activeTab === 'services' && 'Services & Specialization'}
                    {activeTab === 'courses' && 'Courses Developed'}
                    {activeTab === 'experience' && 'Work Experience'}
                    {activeTab === 'education' && 'Education & Process'}
                    {activeTab === 'projects' && 'Selected Projects'}
                    {activeTab === 'inquiries' && 'Client Inquiries'}
                    {activeTab === 'settings' && 'Site & Global Settings'}
                    {activeTab === 'cv' && 'Dynamic CV / Resume Manager'}
                  </span>
                </div>
                <div className="workspace-system-chip">
                  <span className="system-dot-live"></span>
                  <span>POSTGRESQL &amp; PRISMA ORM ACTIVE</span>
                </div>
              </div>

              <div className="workspace-header-right">
                {/* Quick CTA depending on current tab */}
                {activeTab === 'projects' && (
                  <button
                    type="button"
                    className="admin-primary-btn"
                    onClick={() => {
                      setEditingItem({
                        type: 'project',
                        data: { title: '', subtitle: '', category: 'AI_SYSTEM', description: '', points: [], techStack: [], liveUrl: '', clientUrl: '', serverUrl: '', githubUrl: '', image: '', featured: true }
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    <span>+ ADD PROJECT</span>
                  </button>
                )}
                {activeTab === 'courses' && (
                  <button
                    type="button"
                    className="admin-primary-btn"
                    onClick={() => {
                      setEditingItem({
                        type: 'course',
                        data: { title: '', slug: '', platform: 'Udemy Masterclass', rating: 4.9, studentsCount: 1500, courseUrl: '', description: '', topics: [], bannerUrl: '', image: '' }
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    <span>+ ADD COURSE</span>
                  </button>
                )}
                {activeTab === 'services' && (
                  <button
                    type="button"
                    className="admin-primary-btn"
                    onClick={() => {
                      setEditingItem({
                        type: 'service',
                        data: { number: `0${services.length + 1}`, category: '', title: '', tags: [], overview: '', points: [{ bold: '', text: '' }] }
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    <span>+ ADD SERVICE</span>
                  </button>
                )}
                {activeTab === 'experience' && (
                  <button
                    type="button"
                    className="admin-primary-btn"
                    onClick={() => {
                      setEditingItem({
                        type: 'experience',
                        data: { role: '', company: '', location: 'Remote', employmentType: 'Full-time', startDate: '', endDate: 'Present', current: true, description: '', bullets: [] }
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    <span>+ ADD EXPERIENCE</span>
                  </button>
                )}
                {activeTab === 'education' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="admin-primary-btn"
                      onClick={() => {
                        setEditingItem({
                          type: 'education',
                          data: { degree: '', institution: '', year: '', startDate: '', endDate: '', subject: '', field: '' }
                        });
                        setIsModalOpen(true);
                      }}
                    >
                      <span>+ ADD DEGREE</span>
                    </button>
                    <button
                      type="button"
                      className="refresh-btn"
                      onClick={() => {
                        setEditingItem({
                          type: 'process',
                          data: { stepNumber: `0${processes.length + 1}`, title: '', description: '', icon: '01' }
                        });
                        setIsModalOpen(true);
                      }}
                    >
                      <span>+ ADD STEP</span>
                    </button>
                  </div>
                )}
              </div>
            </header>

            {/* Scrollable Tab Content Area */}
            <div className="workspace-scroll-body">
              {/* TAB 1: SERVICES & SPECIALIZATION CRUD */}
              {activeTab === 'services' && (
                <div className="admin-tab-content">
                <div className="tab-header-row">
                  <div>
                    <h2 className="tab-title">Services &amp; Specialization Manager</h2>
                    <p className="tab-desc">Add, update, or remove service offerings displayed in the accordion section.</p>
                  </div>
                  <button
                    type="button"
                    className="admin-primary-btn"
                    onClick={() => {
                      setEditingItem({
                        type: 'service',
                        data: { number: `0${services.length + 1}`, category: '', title: '', tags: [], overview: '', points: [{ bold: '', text: '' }] }
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    + Add New Service ✦
                  </button>
                </div>

                <div className="admin-cards-list">
                  {services.map((item: any) => (
                    <div className="admin-item-card" key={item.id}>
                      <div className="admin-item-top">
                        <div>
                          <span className="admin-tag-pill">{item.number} • {item.category}</span>
                          <h3 className="admin-item-title">{item.title}</h3>
                        </div>
                        <div className="admin-item-actions">
                          <button
                            type="button"
                            className="cv-action-btn view-btn"
                            onClick={() => {
                              setEditingItem({ type: 'service', data: item });
                              setIsModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="cv-action-btn delete-btn"
                            onClick={() => {
                              if (confirm(`Delete service "${item.title}"?`)) {
                                deleteItemMutation.mutate(`/services/${item.id}`);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="admin-item-desc">{item.overview}</p>
                      <div className="admin-item-chips">
                        {item.tags?.map((tag: string, i: number) => (
                          <span className="exp-tag" key={i}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: COURSES DEVELOPED CRUD */}
            {activeTab === 'courses' && (
              <div className="admin-tab-content">
                <div className="tab-header-row">
                  <div>
                    <h2 className="tab-title">Udemy &amp; Developed Courses Manager</h2>
                    <p className="tab-desc">Manage published masterclasses, student ratings, and topic tags.</p>
                  </div>
                  <button
                    type="button"
                    className="admin-primary-btn"
                    onClick={() => {
                      setEditingItem({
                        type: 'course',
                        data: { title: '', slug: `course-${Date.now()}`, platform: 'Udemy Masterclass', rating: 4.9, studentsCount: 1500, description: '', topics: [], courseUrl: 'https://udemy.com' }
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    + Add New Course ✦
                  </button>
                </div>

                <div className="admin-cards-list">
                  {courses.map((c: any) => (
                    <div className="admin-item-card" key={c.id}>
                      <div className="admin-item-top">
                        <div>
                          <span className="admin-tag-pill">{c.platform || 'Udemy'} • ★ {c.rating || 4.8} ({c.studentsCount || 1200}+ Students)</span>
                          <h3 className="admin-item-title">{c.title}</h3>
                        </div>
                        <div className="admin-item-actions">
                          <button
                            type="button"
                            className="cv-action-btn view-btn"
                            onClick={() => {
                              setEditingItem({ type: 'course', data: c });
                              setIsModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="cv-action-btn delete-btn"
                            onClick={() => {
                              if (confirm(`Delete course "${c.title}"?`)) {
                                deleteItemMutation.mutate(`/courses/${c.id}`);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="admin-item-desc">{c.description}</p>
                      <div className="admin-item-chips">
                        {c.topics?.map((t: string, i: number) => (
                          <span className="exp-tag" key={i}>{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: WORK EXPERIENCE CRUD */}
            {activeTab === 'experience' && (
              <div className="admin-tab-content">
                <div className="tab-header-row">
                  <div>
                    <h2 className="tab-title">Work Experience Timeline Manager</h2>
                    <p className="tab-desc">Manage career roles, milestones, accomplishment bullet points, and tech stacks.</p>
                  </div>
                  <button
                    type="button"
                    className="admin-primary-btn"
                    onClick={() => {
                      setEditingItem({
                        type: 'experience',
                        data: { role: '', company: '', location: 'Remote', employmentType: 'Full-Time', startDate: '2024', endDate: 'Present', current: true, bullets: [''], techStack: [] }
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    + Add Experience ✦
                  </button>
                </div>

                <div className="admin-cards-list">
                  {experiences.map((exp: any) => (
                    <div className="admin-item-card" key={exp.id}>
                      <div className="admin-item-top">
                        <div>
                          <span className="admin-tag-pill">{exp.company} • {exp.startDate} – {exp.endDate} ({exp.employmentType})</span>
                          <h3 className="admin-item-title">{exp.role}</h3>
                        </div>
                        <div className="admin-item-actions">
                          <button
                            type="button"
                            className="cv-action-btn view-btn"
                            onClick={() => {
                              setEditingItem({ type: 'experience', data: exp });
                              setIsModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="cv-action-btn delete-btn"
                            onClick={() => {
                              if (confirm(`Delete experience "${exp.role}"?`)) {
                                deleteItemMutation.mutate(`/experiences/${exp.id}`);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <ul className="admin-bullets-list">
                        {exp.bullets?.map((b: string, i: number) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: EDUCATION & WORK PROCESS CRUD */}
            {activeTab === 'education' && (
              <div className="admin-tab-content">
                <div className="tab-header-row">
                  <div>
                    <h2 className="tab-title">Academic Degrees &amp; Engineering Workflow Steps</h2>
                    <p className="tab-desc">Configure academic degrees and the 6-step engineering lifecycle pipeline.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      className="admin-primary-btn"
                      onClick={() => {
                        setEditingItem({
                          type: 'education',
                          data: { institution: '', degree: 'B.Sc. in CSE', field: 'Computer Science', startDate: '2020', endDate: '2024', location: 'Sylhet, Bangladesh', description: 'AI & Distributed Systems' }
                        });
                        setIsModalOpen(true);
                      }}
                    >
                      + Add Degree
                    </button>
                    <button
                      type="button"
                      className="admin-primary-btn"
                      onClick={() => {
                        setEditingItem({
                          type: 'process',
                          data: { stepNumber: `0${processes.length + 1}`, title: '', description: '', badge: `0${processes.length + 1}. PHASE` }
                        });
                        setIsModalOpen(true);
                      }}
                    >
                      + Add Process Step
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-gold)', marginTop: '1rem', marginBottom: '0.5rem' }}>Academic Degrees ({educations.length})</h3>
                <div className="admin-cards-list">
                  {educations.map((edu: any) => (
                    <div className="admin-item-card" key={edu.id}>
                      <div className="admin-item-top">
                        <div>
                          <span className="admin-tag-pill">{edu.institution} • {edu.startDate} – {edu.endDate}</span>
                          <h3 className="admin-item-title">{edu.degree}</h3>
                        </div>
                        <div className="admin-item-actions">
                          <button
                            type="button"
                            className="cv-action-btn view-btn"
                            onClick={() => {
                              setEditingItem({ type: 'education', data: edu });
                              setIsModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="cv-action-btn delete-btn"
                            onClick={() => {
                              if (confirm(`Delete degree "${edu.degree}"?`)) {
                                deleteItemMutation.mutate(`/education/${edu.id}`);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="admin-item-desc">{edu.description || edu.field}</p>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-gold)', marginTop: '2rem', marginBottom: '0.5rem' }}>Engineering Workflow Steps ({processes.length})</h3>
                <div className="admin-cards-list">
                  {processes.map((p: any) => (
                    <div className="admin-item-card" key={p.id}>
                      <div className="admin-item-top">
                        <div>
                          <span className="admin-tag-pill">{p.stepNumber} • {p.badge || 'WORKFLOW'}</span>
                          <h3 className="admin-item-title">{p.title}</h3>
                        </div>
                        <div className="admin-item-actions">
                          <button
                            type="button"
                            className="cv-action-btn view-btn"
                            onClick={() => {
                              setEditingItem({ type: 'process', data: p });
                              setIsModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="cv-action-btn delete-btn"
                            onClick={() => {
                              if (confirm(`Delete workflow step "${p.title}"?`)) {
                                deleteItemMutation.mutate(`/education/processes/${p.id}`);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="admin-item-desc">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: SELECTED PROJECTS CRUD */}
            {activeTab === 'projects' && (
              <div className="admin-tab-content">
                <div className="tab-header-row">
                  <div>
                    <h2 className="tab-title">Selected Projects Portfolio Manager</h2>
                    <p className="tab-desc">Add or update featured web apps, AI systems, and machine learning models.</p>
                  </div>
                  <button
                    type="button"
                    className="admin-primary-btn"
                    onClick={() => {
                      setEditingItem({
                        type: 'project',
                        data: { title: '', slug: `project-${Date.now()}`, category: 'Full-Stack Web App', description: '', liveUrl: '', githubUrl: '', techStack: ['Next.js', 'TypeScript', 'Node.js'], featured: true }
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    + Add Project ✦
                  </button>
                </div>

                <div className="admin-cards-list">
                  {projects.map((proj: any) => (
                    <div className="admin-item-card" key={proj.id}>
                      <div className="admin-item-top">
                        <div>
                          <span className="admin-tag-pill">{proj.category}</span>
                          <h3 className="admin-item-title">{proj.title}</h3>
                        </div>
                        <div className="admin-item-actions">
                          <button
                            type="button"
                            className="cv-action-btn view-btn"
                            onClick={() => {
                              setEditingItem({ type: 'project', data: proj });
                              setIsModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="cv-action-btn delete-btn"
                            onClick={() => {
                              if (confirm(`Delete project "${proj.title}"?`)) {
                                deleteItemMutation.mutate(`/projects/${proj.id}`);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="admin-item-desc">{proj.description}</p>
                      <div className="admin-item-chips">
                        {proj.techStack?.map((t: string, i: number) => (
                          <span className="exp-tag" key={i}>{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: INQUIRIES */}
            {activeTab === 'inquiries' && (
              <div className="admin-tab-content">
                <div className="tab-header-row">
                  <div>
                    <h2 className="tab-title">Client Inquiries &amp; Get In Touch</h2>
                    <p className="tab-desc">Direct inquiries submitted via the Resend contact pipeline.</p>
                  </div>
                  <button type="button" className="refresh-btn" onClick={() => refetchInquiries()}>
                    Refresh
                  </button>
                </div>

                {inquiries.length > 0 ? (
                  <div className="inquiries-list">
                    {inquiries.map((msg: any) => (
                      <div className="inquiry-card" key={msg.id}>
                        <div className="inquiry-header">
                          <div className="inquiry-user">
                            <span className="inquiry-name">{msg.name}</span>
                            <a href={`mailto:${msg.email}`} className="inquiry-email">
                              {msg.email}
                            </a>
                          </div>
                          <span className="inquiry-date">{new Date(msg.createdAt).toLocaleString()}</span>
                        </div>
                        {msg.subject && <h4 className="inquiry-subject">{msg.subject}</h4>}
                        <p className="inquiry-body">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="cv-empty-banner">
                    <p>No inquiries received yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 7: SITE & CONTACT SETTINGS */}
            {activeTab === 'settings' && (
              <div className="admin-tab-content">
                <div className="tab-header-row">
                  <div>
                    <h2 className="tab-title">Site Configuration &amp; Contact Channels</h2>
                    <p className="tab-desc">Changes here update the Hero, Footer, Visiting Card, and Navbar in real-time.</p>
                  </div>
                </div>

                {settingsForm && (
                  <form className="settings-edit-form" onSubmit={handleSettingsSubmit}>
                    <div className="form-row">
                      <div className="admin-field-group">
                        <label className="admin-field-label">PORTFOLIO TITLE / NAME</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={settingsForm.siteTitle || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                        />
                      </div>
                      <div className="admin-field-group">
                        <label className="admin-field-label">PRIMARY ADMIN EMAIL</label>
                        <input
                          type="email"
                          className="admin-form-input"
                          value={settingsForm.adminEmail || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, adminEmail: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="admin-field-group">
                        <label className="admin-field-label">PHONE &amp; WHATSAPP</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={settingsForm.phone || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="admin-field-group">
                        <label className="admin-field-label">LOCATION</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={settingsForm.location || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="admin-field-group">
                        <label className="admin-field-label">AVAILABILITY BADGE TEXT</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={settingsForm.availabilityStatus || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, availabilityStatus: e.target.value })}
                        />
                      </div>
                      <div className="admin-field-group">
                        <label className="admin-field-label">HIHELLO DIGITAL CARD URL</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={settingsForm.hihelloUrl || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, hihelloUrl: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="admin-field-group">
                        <label className="admin-field-label">GITHUB PROFILE URL</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={settingsForm.githubUrl || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, githubUrl: e.target.value })}
                        />
                      </div>
                      <div className="admin-field-group">
                        <label className="admin-field-label">LINKEDIN URL</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={settingsForm.linkedinUrl || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="admin-field-group">
                        <label className="admin-field-label">X / TWITTER URL</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={settingsForm.twitterUrl || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, twitterUrl: e.target.value })}
                        />
                      </div>
                      <div className="admin-field-group">
                        <label className="admin-field-label">INSTAGRAM URL</label>
                        <input
                          type="text"
                          className="admin-form-input"
                          value={settingsForm.instagramUrl || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                        />
                      </div>
                    </div>

                    <button type="submit" className="admin-primary-btn" style={{ marginTop: '1rem' }}>
                      <span>Save Live Site Configuration ✦</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 8: DYNAMIC CV MANAGER */}
            {activeTab === 'cv' && (
              <div className="admin-tab-content">
                <div className="tab-header-row">
                  <div>
                    <h2 className="tab-title">Resume / CV Drag &amp; Drop Control</h2>
                    <p className="tab-desc">Upload, update, or remove your live resume document.</p>
                  </div>
                  <span className={`status-pill ${cvData?.hasCv ? 'status-pill-live' : 'status-pill-empty'}`}>
                    {cvData?.hasCv ? '● LIVE CV ATTACHED' : '○ NO CV ACTIVE'}
                  </span>
                </div>

                {cvData?.hasCv && (
                  <div className="active-cv-card">
                    <div className="cv-card-details">
                      <h4 className="cv-card-filename">{cvData.cvOriginalName || 'Resume.pdf'}</h4>
                      <div className="cv-card-meta">
                        <span>{cvData.cvSize ? `${(cvData.cvSize / 1024).toFixed(1)} KB` : 'PDF'}</span>
                      </div>
                    </div>
                    <div className="cv-card-actions">
                      <a href={cvData.cvUrl || '#'} target="_blank" rel="noreferrer" className="cv-action-btn view-btn">
                        Preview
                      </a>
                      <button
                        type="button"
                        className="cv-action-btn delete-btn"
                        onClick={async () => {
                          if (confirm('Delete active CV?')) {
                            await api.delete('/cv', { headers: getHeaders() });
                            toast.success('CV Deleted');
                            refetchCv();
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                />

                <div
                  className={`admin-dropzone ${isDragging ? 'dropzone-active' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="dropzone-text">
                    <h4 className="dropzone-headline">Drag &amp; Drop New CV Document</h4>
                    <p className="dropzone-subheadline">PDF or Word (.pdf, .docx) • Instant Live Sync</p>
                  </div>
                  <button type="button" className="dropzone-browse-btn">Browse Local Files</button>
                  {uploadProgress !== null && (
                    <div className="dropzone-progress-wrap">
                      <span className="progress-text">{uploadProgress}% Uploading...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
         GENERIC EDITING MODAL (FOR SERVICES, COURSES, EXP, EDU, PROJECTS)
         ========================================================================== */}
      {isModalOpen && editingItem && (
        <div className="card-modal-backdrop active" onClick={() => setIsModalOpen(false)}>
          <div className="visiting-card-container admin-crud-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', maxHeight: '88vh', overflowY: 'auto' }}>
            <div className="visiting-card-top-bar">
              <span className="card-top-tag">{editingItem.data.id ? 'EDIT RECORD' : 'CREATE NEW RECORD'} ✦ {editingItem.type.toUpperCase()}</span>
              <button type="button" className="card-modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const type = editingItem.type;
                const isEdit = Boolean(editingItem.data.id);
                let endpoint = '';
                if (type === 'service') endpoint = isEdit ? `/services/${editingItem.data.id}` : '/services';
                else if (type === 'course') endpoint = isEdit ? `/courses/${editingItem.data.id}` : '/courses';
                else if (type === 'experience') endpoint = isEdit ? `/experiences/${editingItem.data.id}` : '/experiences';
                else if (type === 'education') endpoint = isEdit ? `/education/${editingItem.data.id}` : '/education';
                else if (type === 'process') endpoint = isEdit ? `/education/processes/${editingItem.data.id}` : '/education/processes';
                else if (type === 'project') endpoint = isEdit ? `/projects/${editingItem.data.id}` : '/projects';

                saveMutation.mutate({
                  endpoint,
                  method: isEdit ? 'put' : 'post',
                  data: editingItem.data
                });
              }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {/* Form Fields for Service */}
              {editingItem.type === 'service' && (
                <>
                  <div className="form-row">
                    <div className="admin-field-group">
                      <label className="admin-field-label">NUMBER</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={editingItem.data.number || '01'}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, number: e.target.value } })}
                        required
                      />
                    </div>
                    <div className="admin-field-group">
                      <label className="admin-field-label">CATEGORY</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={editingItem.data.category || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                        required
                      />
                    </div>
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">SERVICE TITLE</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={editingItem.data.title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                      required
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">OVERVIEW / DESCRIPTION</label>
                    <textarea
                      rows={3}
                      className="admin-form-input"
                      value={editingItem.data.overview || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, overview: e.target.value } })}
                      required
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">TAGS (COMMA SEPARATED)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={Array.isArray(editingItem.data.tags) ? editingItem.data.tags.join(', ') : ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, tags: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) } })}
                    />
                  </div>
                </>
              )}

              {/* Form Fields for Course */}
              {editingItem.type === 'course' && (
                <>
                  <div className="admin-field-group">
                    <label className="admin-field-label">COURSE TITLE</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={editingItem.data.title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') } })}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="admin-field-group">
                      <label className="admin-field-label">PLATFORM</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={editingItem.data.platform || 'Udemy Masterclass'}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, platform: e.target.value } })}
                      />
                    </div>
                    <div className="admin-field-group">
                      <label className="admin-field-label">RATING (e.g. 4.9)</label>
                      <input
                        type="number"
                        step="0.1"
                        className="admin-form-input"
                        value={editingItem.data.rating || 4.9}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, rating: parseFloat(e.target.value) } })}
                      />
                    </div>
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">COURSE URL</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={editingItem.data.courseUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, courseUrl: e.target.value } })}
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">DESCRIPTION</label>
                    <textarea
                      rows={3}
                      className="admin-form-input"
                      value={editingItem.data.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })}
                      required
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">TOPICS (COMMA SEPARATED)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={Array.isArray(editingItem.data.topics) ? editingItem.data.topics.join(', ') : ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, topics: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) } })}
                    />
                  </div>
                </>
              )}

              {/* Form Fields for Experience */}
              {editingItem.type === 'experience' && (
                <>
                  <div className="form-row">
                    <div className="admin-field-group">
                      <label className="admin-field-label">ROLE TITLE</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={editingItem.data.role || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, role: e.target.value } })}
                        required
                      />
                    </div>
                    <div className="admin-field-group">
                      <label className="admin-field-label">COMPANY</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={editingItem.data.company || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, company: e.target.value } })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="admin-field-group">
                      <label className="admin-field-label">START DATE</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={editingItem.data.startDate || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, startDate: e.target.value } })}
                        required
                      />
                    </div>
                    <div className="admin-field-group">
                      <label className="admin-field-label">END DATE</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={editingItem.data.endDate || 'Present'}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, endDate: e.target.value } })}
                        required
                      />
                    </div>
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">BULLETS (ONE PER LINE)</label>
                    <textarea
                      rows={4}
                      className="admin-form-input"
                      value={Array.isArray(editingItem.data.bullets) ? editingItem.data.bullets.join('\n') : ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, bullets: e.target.value.split('\n').map((s: string) => s.trim()).filter(Boolean) } })}
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">TECH STACK (COMMA SEPARATED)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={Array.isArray(editingItem.data.techStack) ? editingItem.data.techStack.join(', ') : ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, techStack: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) } })}
                    />
                  </div>
                </>
              )}

              {/* Form Fields for Education */}
              {editingItem.type === 'education' && (
                <>
                  <div className="admin-field-group">
                    <label className="admin-field-label">DEGREE TITLE</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={editingItem.data.degree || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, degree: e.target.value } })}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="admin-field-group">
                      <label className="admin-field-label">INSTITUTION</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={editingItem.data.institution || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, institution: e.target.value } })}
                        required
                      />
                    </div>
                    <div className="admin-field-group">
                      <label className="admin-field-label">FIELD OF STUDY</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={editingItem.data.field || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, field: e.target.value } })}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="admin-field-group">
                      <label className="admin-field-label">START DATE</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={editingItem.data.startDate || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, startDate: e.target.value } })}
                      />
                    </div>
                    <div className="admin-field-group">
                      <label className="admin-field-label">END DATE</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={editingItem.data.endDate || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, endDate: e.target.value } })}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Form Fields for Workflow Step */}
              {editingItem.type === 'process' && (
                <>
                  <div className="form-row">
                    <div className="admin-field-group">
                      <label className="admin-field-label">STEP NUMBER</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={editingItem.data.stepNumber || '01'}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, stepNumber: e.target.value } })}
                        required
                      />
                    </div>
                    <div className="admin-field-group">
                      <label className="admin-field-label">BADGE TAG</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={editingItem.data.badge || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, badge: e.target.value } })}
                      />
                    </div>
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">STEP TITLE</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={editingItem.data.title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                      required
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">DESCRIPTION</label>
                    <textarea
                      rows={3}
                      className="admin-form-input"
                      value={editingItem.data.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })}
                      required
                    />
                  </div>
                </>
              )}

              {/* Form Fields for Project */}
              {editingItem.type === 'project' && (
                <>
                  <div className="admin-field-group">
                    <label className="admin-field-label">PROJECT TITLE</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={editingItem.data.title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') } })}
                      required
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">CATEGORY</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={editingItem.data.category || 'Full-Stack Web App'}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="admin-field-group">
                      <label className="admin-field-label">LIVE DEMO URL</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={editingItem.data.liveUrl || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, liveUrl: e.target.value } })}
                      />
                    </div>
                    <div className="admin-field-group">
                      <label className="admin-field-label">GITHUB REPO URL</label>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={editingItem.data.githubUrl || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, githubUrl: e.target.value } })}
                      />
                    </div>
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">DESCRIPTION</label>
                    <textarea
                      rows={3}
                      className="admin-form-input"
                      value={editingItem.data.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })}
                      required
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">TECH STACK (COMMA SEPARATED)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={Array.isArray(editingItem.data.techStack) ? editingItem.data.techStack.join(', ') : ''}
                      onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, techStack: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) } })}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="admin-primary-btn"
                disabled={saveMutation.isPending}
                style={{ marginTop: '1rem' }}
              >
                <span>{saveMutation.isPending ? 'Saving...' : 'Save Changes ✦'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
