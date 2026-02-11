export interface HeroSection {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
}

export interface AboutSection {
  bio: string;
  skills: string[];
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  demoUrl: string;
  repoUrl: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown supported ideally, but simple text for now
  date: string;
  readTime: string;
}

export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  year: string;
  description: string;
}

export interface Stat {
  id: string;
  label: string;
  value: string;
}

export interface PortfolioData {
  hero: HeroSection;
  about: AboutSection;
  certificates: Certificate[];
  projects: Project[];
  blogs: BlogPost[];
  contact: ContactInfo;
  experience: Experience[];
  stats: Stat[];
}

export type SectionKey = keyof PortfolioData;