import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  stack: string[];
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
}

export interface Certificate {
  id: number;
  title: string;
  org: string;
  image: string;
}

export interface Experience {
  id: number;
  year: string;
  role: string;
  company: string;
  description: string;
}

interface PageHeader {
  eyebrow: string;
  title: string;
  description: string;
}

interface SocialLinksData {
  twitter: string;
  linkedin: string;
  github: string;
  instagram: string;
  email: string;
}

interface SiteData {
  heroTitle: string;
  heroSubtitle: string;
  animatedTitles: string[];
  philosophy: string[];
  aboutText: string;
  aboutImage: string;
  yearsOfMastery: string;
  resumeUrl: string;
  email: string;
  location: string;
  skills: string[];
  projects: Project[];
  certificates: Certificate[];
  experience: Experience[];
  socials: SocialLinksData;
  headers: {
    about: PageHeader;
    projects: PageHeader;
    certificates: PageHeader;
    contact: PageHeader;
    experience: PageHeader;
    skills: PageHeader;
  };
}

interface DataContextType {
  data: SiteData;
  updateHome: (title: string, subtitle: string, animatedTitles?: string[]) => void;
  updatePhilosophy: (philosophy: string[]) => void;
  updateAbout: (text: string, image: string, years: string) => void;
  updateContact: (email: string, location: string) => void;
  updateSkills: (skills: string[]) => void;
  updateSocials: (socials: SocialLinksData) => void;
  updateResumeUrl: (url: string) => void;
  updatePageHeader: (page: keyof SiteData['headers'], header: PageHeader) => void;
  addProject: (p: Project) => void;
  updateProject: (p: Project) => void;
  removeProject: (id: number) => void;
  addCertificate: (c: Certificate) => void;
  updateCertificate: (c: Certificate) => void;
  removeCertificate: (id: number) => void;
  addExperience: (e: Omit<Experience, 'id'>) => void;
  updateExperience: (e: Experience) => void;
  removeExperience: (id: number) => void;
}

const initialData: SiteData = {
  heroTitle: "I’m a Full Stack",
  heroSubtitle: "DEVELOPER • ENGINEER • AI BUILDER",
  animatedTitles: ["Developer", "Engineer", "Architect", "Builder"],
  philosophy: [
    "I am a",
    "digital",
    "architect",
    "obsessed",
    "with",
    "performance",
    "aesthetics."
  ],
  headers: {
    about: {
      eyebrow: "Personal Narrative",
      title: "Engineering Excellence Since 2018",
      description: "I am a digital architect obsessed with performance and minimalist aesthetics."
    },
    projects: {
      eyebrow: "Archive",
      title: "Digital Artifacts",
      description: "A comprehensive overview of engineering challenges tackled and elegance achieved. Updated in real-time."
    },
    certificates: {
      eyebrow: "Validation",
      title: "Verified Expertise",
      description: "A verified list of professional credentials and academic milestones."
    },
    contact: {
      eyebrow: "Get in touch",
      title: "Contact Me",
      description: "Whether you have a question, a project idea, or just want to say hi, my inbox is always open."
    },
    experience: {
      eyebrow: "Career Journey",
      title: "Professional Milestones",
      description: "A timeline of technical leadership and product engineering."
    },
    skills: {
      eyebrow: "Tooling & Mastery",
      title: "Current Arsenal",
      description: "A breakdown of the technologies I use to build the future."
    }
  },
  aboutText: "I am a digital architect obsessed with performance and minimalist aesthetics. My approach combines technical rigor with artistic intuition to create products that feel as good as they function.",
  aboutImage: "https://picsum.photos/id/64/800/1200?grayscale",
  yearsOfMastery: "8+",
  resumeUrl: "#",
  email: "hello@larson.design",
  location: "San Francisco, CA",
  skills: ['React', 'TypeScript', 'Node.js', 'Go', 'AWS', 'TensorFlow', 'PostgreSQL', 'Docker', 'GraphQL', 'Python', 'Tailwind', 'Next.js'],
  socials: {
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    instagram: "https://instagram.com",
    email: "mailto:hello@larson.design"
  },
  projects: [
    { id: 1, title: "AI Vision Analytics", description: "Real-time safety monitoring using computer vision and edge computing.", image: "https://picsum.photos/id/101/1200/800?grayscale", stack: ["React", "Python", "OpenCV"], featured: true, liveUrl: "#", githubUrl: "#" },
    { id: 2, title: "EcoSphere", description: "Sustainability tracking platform for enterprise-level carbon footprint monitoring.", image: "https://picsum.photos/id/102/1200/800?grayscale", stack: ["Next.js", "D3.js", "PostgreSQL"], featured: true, liveUrl: "#", githubUrl: "#" },
    { id: 3, title: "CryptoVault", description: "High-security decentralized wallet with multi-sig capabilities.", image: "https://picsum.photos/id/103/600/600?grayscale", stack: ["Web3", "Solidity", "React"], featured: false, liveUrl: "#", githubUrl: "#" }
  ],
  certificates: [
    { id: 1, title: 'AWS Solutions Architect', org: 'Amazon Web Services', image: 'https://picsum.photos/id/101/1200/800?grayscale' },
    { id: 2, title: 'Professional Data Engineer', org: 'Google Cloud', image: 'https://picsum.photos/id/102/1200/800?grayscale' }
  ],
  experience: [
    { id: 1, year: '2022 — Present', role: 'Senior Lead Developer', company: 'TechFlow Global', description: 'Heading AI implementation and scalable cloud architecture for Fortune 500 clients.' },
    { id: 2, year: '2020 — 2022', role: 'Full Stack Engineer', company: 'Nexus Systems', description: 'Developed high-performance distributed systems using Go and React.' },
    { id: 3, year: '2018 — 2020', role: 'Frontend Architect', company: 'Pixel Studio', description: 'Pioneered creative web experiences and design systems for global brands.' },
  ]
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(() => {
    try {
      const saved = localStorage.getItem('larson_site_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.headers) parsed.headers = initialData.headers;
        if (!parsed.headers.experience) parsed.headers.experience = initialData.headers.experience;
        if (!parsed.headers.skills) parsed.headers.skills = initialData.headers.skills;
        if (!parsed.philosophy) parsed.philosophy = initialData.philosophy;
        if (!parsed.aboutImage) parsed.aboutImage = initialData.aboutImage;
        if (!parsed.yearsOfMastery) parsed.yearsOfMastery = initialData.yearsOfMastery;
        if (!parsed.resumeUrl) parsed.resumeUrl = initialData.resumeUrl;
        if (!parsed.socials) parsed.socials = initialData.socials;
        return parsed;
      }
      return initialData;
    } catch (e) {
      return initialData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('larson_site_data', JSON.stringify(data));
    } catch (e) {}
  }, [data]);

  const updateHome = (heroTitle: string, heroSubtitle: string, animatedTitles?: string[]) => setData(p => ({ 
    ...p, 
    heroTitle, 
    heroSubtitle,
    animatedTitles: animatedTitles || p.animatedTitles
  }));

  const updatePhilosophy = (philosophy: string[]) => setData(p => ({ ...p, philosophy }));
  
  const updateAbout = (aboutText: string, aboutImage: string, yearsOfMastery: string) => setData(p => ({ 
    ...p, 
    aboutText,
    aboutImage,
    yearsOfMastery
  }));

  const updateContact = (email: string, location: string) => setData(p => ({ ...p, email, location }));
  const updateSkills = (skills: string[]) => setData(p => ({ ...p, skills }));
  const updateSocials = (socials: SocialLinksData) => setData(p => ({ ...p, socials }));
  const updateResumeUrl = (resumeUrl: string) => setData(p => ({ ...p, resumeUrl }));
  
  const updatePageHeader = (page: keyof SiteData['headers'], header: PageHeader) => setData(p => ({
    ...p,
    headers: { ...p.headers, [page]: header }
  }));

  const addProject = (p: Project) => setData(prev => ({ 
    ...prev, 
    projects: [...prev.projects, p] 
  }));

  const updateProject = (updatedP: Project) => setData(prev => ({
    ...prev,
    projects: prev.projects.map(p => p.id === updatedP.id ? updatedP : p)
  }));

  const removeProject = (id: number) => setData(prev => ({ 
    ...prev, 
    projects: prev.projects.filter(p => p.id !== id) 
  }));

  const addCertificate = (c: Certificate) => setData(prev => ({ 
    ...prev, 
    certificates: [...prev.certificates, c] 
  }));

  const updateCertificate = (updatedC: Certificate) => setData(prev => ({
    ...prev,
    certificates: prev.certificates.map(c => c.id === updatedC.id ? updatedC : c)
  }));

  const removeCertificate = (id: number) => setData(prev => ({ 
    ...prev, 
    certificates: prev.certificates.filter(c => c.id !== id) 
  }));

  const addExperience = (e: Omit<Experience, 'id'>) => setData(prev => ({ 
    ...prev, 
    experience: [{ ...e, id: Date.now() }, ...prev.experience] 
  }));

  const updateExperience = (updatedE: Experience) => setData(prev => ({
    ...prev,
    experience: prev.experience.map(e => e.id === updatedE.id ? updatedE : e)
  }));

  const removeExperience = (id: number) => setData(prev => ({ 
    ...prev, 
    experience: prev.experience.filter(exp => exp.id !== id) 
  }));

  return (
    <DataContext.Provider value={{ 
      data, updateHome, updatePhilosophy, updateAbout, updateContact, updateSkills, updateSocials, updateResumeUrl, updatePageHeader,
      addProject, updateProject, removeProject, 
      addCertificate, updateCertificate, removeCertificate, 
      addExperience, updateExperience, removeExperience 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
