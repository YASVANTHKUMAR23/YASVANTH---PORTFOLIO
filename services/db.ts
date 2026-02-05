import { PortfolioData, Project, Certificate, BlogPost } from '../types';

// Initial Mock Data
const INITIAL_DATA: PortfolioData = {
  hero: {
    title: "Building the Future of Web",
    subtitle: "Senior Full-Stack Engineer specializing in scalable React applications and AI integration.",
    imageUrl: "https://picsum.photos/400/400",
    ctaText: "View My Work"
  },
  about: {
    bio: "I am a passionate developer with over 5 years of experience in building modern web applications. I love solving complex problems and creating intuitive user experiences. My expertise spans across the entire JavaScript ecosystem.",
    skills: ["React", "TypeScript", "Node.js", "Next.js", "Tailwind", "PostgreSQL", "AWS", "Docker"]
  },
  stats: [
    { id: "1", label: "Years Experience", value: "5+" },
    { id: "2", label: "Projects Completed", value: "50+" },
    { id: "3", label: "Satisfied Clients", value: "100%" },
    { id: "4", label: "Commit Count", value: "5k+" }
  ],
  experience: [
    { 
      id: "1",
      role: "Senior Frontend Engineer", 
      company: "TechCorp Inc.", 
      year: "2022 - Present", 
      description: "Leading a team of 5 developers building scalable React applications." 
    },
    { 
      id: "2",
      role: "Full Stack Developer", 
      company: "Creative Solutions", 
      year: "2020 - 2022", 
      description: "Developed end-to-end e-commerce solutions using Next.js and Supabase." 
    },
    { 
      id: "3",
      role: "Web Developer", 
      company: "Digital Agency", 
      year: "2018 - 2020", 
      description: "Crafted pixel-perfect UIs for various high-profile clients." 
    }
  ],
  certificates: [
    {
      id: "1",
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023-08",
      url: "#"
    },
    {
      id: "2",
      title: "Meta Frontend Developer Professional",
      issuer: "Meta",
      date: "2023-01",
      url: "#"
    }
  ],
  projects: [
    {
      id: "1",
      title: "E-Commerce Dashboard",
      description: "A comprehensive analytics dashboard for online retailers featuring real-time data visualization.",
      techStack: ["React", "D3.js", "Supabase"],
      imageUrl: "https://picsum.photos/600/400?random=1",
      demoUrl: "#",
      repoUrl: "#"
    },
    {
      id: "2",
      title: "AI Content Generator",
      description: "SaaS application leveraging Gemini API to help writers generate creative content blocks.",
      techStack: ["Next.js", "Gemini API", "Stripe"],
      imageUrl: "https://picsum.photos/600/400?random=2",
      demoUrl: "#",
      repoUrl: "#"
    },
    {
      id: "3",
      title: "Task Master",
      description: "Collaborative project management tool with real-time updates and team workspaces.",
      techStack: ["Vue.js", "Firebase", "Pinia"],
      imageUrl: "https://picsum.photos/600/400?random=3",
      demoUrl: "#",
      repoUrl: "#"
    }
  ],
  blogs: [
    {
      id: "1",
      title: "The Future of React Server Components",
      excerpt: "Exploring how RSCs are changing the way we build performant web applications.",
      content: "Full content would go here...",
      date: "2023-10-15",
      readTime: "5 min read"
    },
    {
      id: "2",
      title: "Mastering Tailwind CSS",
      excerpt: "Tips and tricks to speed up your styling workflow without sacrificing maintainability.",
      content: "Full content would go here...",
      date: "2023-09-22",
      readTime: "8 min read"
    }
  ],
  contact: {
    email: "dev@example.com",
    github: "github.com/developer",
    linkedin: "linkedin.com/in/developer",
    twitter: "twitter.com/dev_guru"
  }
};

const STORAGE_KEY = 'portfolio_cms_data_v2';

// Simulating Async Supabase Calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  get: async (): Promise<PortfolioData> => {
    await delay(500); // Simulate network latency
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  },

  update: async (data: PortfolioData): Promise<void> => {
    await delay(800); // Simulate network latency
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  // Reset to default (for demo purposes)
  reset: async (): Promise<PortfolioData> => {
    await delay(300);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
};