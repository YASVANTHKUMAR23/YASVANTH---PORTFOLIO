import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase.ts';

interface Project {
  id: number;
  title: string;
  description: string;
  image_url: string;
  stack: string;
  featured: boolean;
  live_url?: string;
  github_url?: string;
}

interface Certificate {
  id: number;
  title: string;
  organization: string;
  image_url: string;
}

interface Experience {
  id: number;
  year_range: string;
  role: string;
  company: string;
  description: string;
}

interface Skill {
  id: number;
  name: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface PageHeader {
  eyebrow: string;
  title: string;
  description: string;
}

interface PhilosophyLine {
  line_number: number;
  text: string;
}

interface AnimatedTitle {
  id: number;
  title: string;
  order_index: number;
}

interface SiteData {
  projects: Project[];
  certificates: Certificate[];
  experience: Experience[];
  skills: Skill[];
  settings: Record<string, string>;
  socialLinks: SocialLink[];
  pageHeaders: {
    about: PageHeader;
    projects: PageHeader;
    certificates: PageHeader;
    contact: PageHeader;
    experience: PageHeader;
    skills: PageHeader;
  };
  philosophy: PhilosophyLine[];
  animatedTitles: AnimatedTitle[];
}

interface RealTimeDataContextType {
  data: SiteData;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  refreshData: () => void;
  updatePageHeader: (page: keyof SiteData['pageHeaders'], header: PageHeader) => Promise<void>;
  createProject: (project: Omit<Project, 'id'>) => Promise<Project>;
  updateProject: (project: Project | { id: number; delete?: boolean }) => Promise<void>;
  createCertificate: (certificate: Omit<Certificate, 'id'>) => Promise<Certificate>;
  updateCertificate: (certificate: Certificate | { id: number; delete?: boolean }) => Promise<void>;
  createExperience: (experience: Omit<Experience, 'id'>) => Promise<Experience>;
  updateExperience: (experience: Experience | { id: number; delete?: boolean }) => Promise<void>;
  createSkill: (skill: Omit<Skill, 'id'>) => Promise<Skill>;
  updateSkill: (skill: Skill | { id: number; delete?: boolean }) => Promise<void>;
  updateSocialLink: (platform: string, url: string) => Promise<void>;
  updateSettings: (key: string, value: any) => Promise<void>;
  setIsPaused: (paused: boolean) => void;
}

const RealTimeDataContext = createContext<RealTimeDataContextType | undefined>(undefined);

export const RealTimeDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>({
    projects: [],
    certificates: [],
    experience: [],
    skills: [],
    settings: {},
    socialLinks: [],
    pageHeaders: {
      about: { eyebrow: '', title: '', description: '' },
      projects: { eyebrow: '', title: '', description: '' },
      certificates: { eyebrow: '', title: '', description: '' },
      contact: { eyebrow: '', title: '', description: '' },
      experience: { eyebrow: '', title: '', description: '' },
      skills: { eyebrow: '', title: '', description: '' }
    },
    philosophy: [],
    animatedTitles: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isPausedRef = React.useRef(false);

  const setIsPaused = (paused: boolean) => {
    isPausedRef.current = paused;
  };

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Technically we should check expiry here or validness via an endpoint, 
      // but for now existence suggests logged in. 401s will clear it.
      // We could decode JWT to check exp.
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminToken');
        }
      } catch (e) {
        localStorage.removeItem('adminToken');
      }
    }
  }, []);

  const login = async (password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password }) // Backend implementation expects username too
      });

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login error', e);
      return false;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  }, []);

  const authenticatedFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('adminToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      logout();
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const error = new Error(errorData.error || 'Request failed');
      (error as any).details = errorData.details;
      throw error;
    }

    // Handle 204 No Content
    if (res.status === 204) return null;

    return res.json();
  }, [logout]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [projects, certificates, experience, skills, settings, socialLinks, pageHeaders, philosophy, animatedTitles] = await Promise.all([
        fetch('/api/projects').then(res => res.json()),
        fetch('/api/certificates').then(res => res.json()),
        fetch('/api/experience').then(res => res.json()),
        fetch('/api/skills').then(res => res.json()),
        fetch('/api/settings').then(res => res.json()),
        fetch('/api/social-links').then(res => res.json()),
        fetch('/api/page-headers').then(res => res.json()),
        fetch('/api/philosophy').then(res => res.json()),
        fetch('/api/animated-titles').then(res => res.json())
      ]);

      setData({
        projects,
        certificates,
        experience,
        skills,
        settings,
        socialLinks,
        pageHeaders,
        philosophy,
        animatedTitles
      });

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
      setError('Failed to load data. Please refresh the page.');
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchInitialData();
  };

  const updatePageHeader = async (page: keyof SiteData['pageHeaders'], header: PageHeader) => {
    setData(prev => ({ ...prev, pageHeaders: { ...prev.pageHeaders, [page]: header } }));
    await authenticatedFetch(`/api/page-headers/${page}`, {
      method: 'PUT',
      body: JSON.stringify(header),
    });
  };

  /* =========================
     Project Actions
     ========================= */
  const createProject = async (project: Omit<Project, 'id'>) => {
    try {
      const newProject = await authenticatedFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify(project),
      });
      // Update local state immediately with valid ID from server
      setData(prev => ({ ...prev, projects: [newProject, ...prev.projects] }));
      return newProject;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  };

  const updateProject = async (project: Project | { id: number; delete?: boolean }) => {
    if ("delete" in project && project.delete) {
      setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== project.id) }));
      await authenticatedFetch(`/api/projects/${project.id}`, { method: "DELETE" });
    } else {
      // Optimistic update
      setData(prev => ({ ...prev, projects: prev.projects.map(p => (p.id === (project as Project).id ? project as Project : p)) }));
      await authenticatedFetch(`/api/projects/${(project as Project).id}`, {
        method: "PUT",
        body: JSON.stringify(project),
      });
    }
  };

  /* =========================
     Certificate Actions
     ========================= */
  const createCertificate = async (certificate: Omit<Certificate, 'id'>) => {
    try {
      const newCert = await authenticatedFetch('/api/certificates', {
        method: 'POST',
        body: JSON.stringify(certificate),
      });
      setData(prev => ({ ...prev, certificates: [newCert, ...prev.certificates] }));
      return newCert;
    } catch (error) {
      console.error('Failed to create certificate:', error);
      throw error;
    }
  };

  const updateCertificate = async (certificate: Certificate | { id: number; delete?: boolean }) => {
    if ("delete" in certificate && certificate.delete) {
      setData(prev => ({ ...prev, certificates: prev.certificates.filter(c => c.id !== certificate.id) }));
      await authenticatedFetch(`/api/certificates/${certificate.id}`, { method: "DELETE" });
    } else {
      setData(prev => ({ ...prev, certificates: prev.certificates.map(c => (c.id === (certificate as Certificate).id ? certificate as Certificate : c)) }));
      await authenticatedFetch(`/api/certificates/${(certificate as Certificate).id}`, { method: "PUT", body: JSON.stringify(certificate) });
    }
  };

  /* =========================
     Experience Actions
     ========================= */
  const createExperience = async (experience: Omit<Experience, 'id'>) => {
    try {
      const newExp = await authenticatedFetch('/api/experience', {
        method: 'POST',
        body: JSON.stringify(experience),
      });
      setData(prev => ({ ...prev, experience: [newExp, ...prev.experience] }));
      return newExp;
    } catch (error) {
      console.error('Failed to create experience:', error);
      throw error;
    }
  };

  const updateExperience = async (experience: Experience | { id: number; delete?: boolean }) => {
    if ("delete" in experience && experience.delete) {
      setData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== experience.id) }));
      await authenticatedFetch(`/api/experience/${experience.id}`, { method: "DELETE" });
    } else {
      setData(prev => ({ ...prev, experience: prev.experience.map(e => (e.id === (experience as Experience).id ? experience as Experience : e)) }));
      await authenticatedFetch(`/api/experience/${(experience as Experience).id}`, { method: "PUT", body: JSON.stringify(experience) });
    }
  };

  /* =========================
     Skill Actions
     ========================= */
  const createSkill = async (skill: Omit<Skill, 'id'>) => {
    try {
      const newSkill = await authenticatedFetch('/api/skills', {
        method: 'POST',
        body: JSON.stringify(skill),
      });
      setData(prev => ({ ...prev, skills: [...prev.skills, newSkill] })); // Append skills usually? Or prepend. DB sorts by name usually.
      // Re-sort locally or just append? DB `getAllSkills` sorts by name.
      // We can just append and let refresh handle order later, or try to sort.
      // For now, prepend as others.
      return newSkill;
    } catch (error) {
      console.error('Failed to create skill:', error);
      throw error;
    }
  };

  const updateSkill = async (skill: Skill | { id: number; delete?: boolean }) => {
    if ("delete" in skill && skill.delete) {
      setData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== skill.id) }));
      await authenticatedFetch(`/api/skills/${skill.id}`, { method: "DELETE" });
    } else {
      setData(prev => ({ ...prev, skills: prev.skills.map(s => (s.id === (skill as Skill).id ? skill as Skill : s)) }));
      await authenticatedFetch(`/api/skills/${(skill as Skill).id}`, { method: "PUT", body: JSON.stringify(skill) });
    }
  };

  const updateSocialLink = async (platform: string, url: string) => {
    setData(prev => ({ ...prev, socialLinks: prev.socialLinks.map(s => s.platform === platform ? { ...s, url } : s) }));
    await authenticatedFetch(`/api/social-links/${platform}`, { method: "PUT", body: JSON.stringify({ url }) });
  };

  const updateSettings = async (key: string, value: any) => {
    // Handle animated titles special cases if they are routed through settings in dashboard (Dashboard calls updateSettings for them?)
    // Dashboard: `updateSettings('animatedTitles_add', '')`
    if (key === 'animatedTitles_add') {
      await authenticatedFetch('/api/animated-titles', { method: 'POST', body: JSON.stringify({ title: 'NEW TITLE' }) });
      refreshData();
      return;
    }
    if (key === 'animatedTitles_update') {
      // value is { id, title }
      const { id, title } = value;
      await authenticatedFetch(`/api/animated-titles/${id}`, { method: 'PUT', body: JSON.stringify({ title }) });
      refreshData(); // Sync
      return;
    }
    if (key === 'animatedTitles_delete') {
      // value is id
      await authenticatedFetch(`/api/animated-titles/${value}`, { method: 'DELETE' });
      refreshData(); // Sync
      return;
    }
    if (key === 'philosophy_update') {
      // value is { id, text }
      const { id, text } = value;
      await authenticatedFetch(`/api/philosophy/${id}`, { method: 'PUT', body: JSON.stringify({ text }) });
      // No need to refresh entire data if we update local, but philosophy structure is complex array.
      // Refresh is safer.
      refreshData();
      return;
    }

    setData(prev => ({ ...prev, settings: { ...prev.settings, [key]: value } }));
    await authenticatedFetch(`/api/settings/${key}`, { method: "PUT", body: JSON.stringify({ value }) });
  };

  const setupRealTimeUpdates = useCallback(() => {
    const { supabase } = require('../lib/supabase.ts');

    // Subscribe to all changes on the public schema
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
        },
        (payload: any) => {
          console.log('Real-time update received:', payload);
          if (!isPausedRef.current) {
            refreshData();
          }
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log('Real-time connection established via Supabase');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshData]);

  useEffect(() => {
    fetchInitialData();
    const cleanup = setupRealTimeUpdates();

    return () => {
      cleanup();
    };
  }, [setupRealTimeUpdates]);

  return (
    <RealTimeDataContext.Provider
      value={{
        data,
        loading,
        error,
        isAuthenticated,
        login,
        logout,
        refreshData,
        updatePageHeader,
        createProject,
        updateProject,
        createCertificate,
        updateCertificate,
        createExperience,
        updateExperience,
        createSkill,
        updateSkill,
        updateSocialLink,
        updateSettings,
        setIsPaused
      }}
    >
      {children}
    </RealTimeDataContext.Provider>
  );
};

export const useRealTimeData = () => {
  const context = useContext(RealTimeDataContext);
  if (!context) {
    throw new Error('useRealTimeData must be used within a RealTimeDataProvider');
  }
  return context;
};