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

const API_BASE = '/api';

const isUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// Helper for authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('sb-access-token'); // Supabase default or custom
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  return fetch(url, { ...options, headers });
};

export const db = {
  get: async (): Promise<PortfolioData> => {
    try {
      const [heroRes, aboutRes, projectsRes, certificatesRes, blogsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/hero`),
        fetch(`${API_BASE}/about`),
        fetch(`${API_BASE}/projects`),
        fetch(`${API_BASE}/certificates`),
        fetch(`${API_BASE}/blogs`),
        fetch(`${API_BASE}/stats`)
      ]);

      const [hero, about, projects, certificates, blogs, stats] = await Promise.all([
        heroRes.json(),
        aboutRes.json(),
        projectsRes.json(),
        certificatesRes.json(),
        blogsRes.json(),
        statsRes.json()
      ]);

      // Map backend fields to frontend types
      const mappedHero = {
        id: hero.data?.id, // Capture ID for updates
        title: hero.data?.title || INITIAL_DATA.hero.title,
        subtitle: hero.data?.subtitle || INITIAL_DATA.hero.subtitle,
        imageUrl: hero.data?.background_image_url || INITIAL_DATA.hero.imageUrl,
        ctaText: hero.data?.cta_text || INITIAL_DATA.hero.ctaText
      };

      const mappedAbout = {
        id: about.data?.id, // Capture ID for updates
        bio: about.data?.bio || INITIAL_DATA.about.bio,
        skills: about.data?.skills || INITIAL_DATA.about.skills
      };

      return {
        hero: mappedHero,
        about: mappedAbout,
        projects: projects.data?.projects?.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.short_description,
          techStack: p.technologies || [],
          imageUrl: p.thumbnail_url,
          demoUrl: p.demo_url,
          repoUrl: p.github_url
        })) || INITIAL_DATA.projects,
        certificates: certificates.data?.map((c: any) => ({
          ...c,
          id: c.id,
          date: c.issue_date,
          url: c.credential_url
        })) || INITIAL_DATA.certificates,
        blogs: blogs.data?.blogs?.map((b: any) => ({
          ...b,
          id: b.id,
          date: b.published_at,
          content: b.content
        })) || INITIAL_DATA.blogs,
        stats: stats.data && stats.data.length > 0 ? stats.data : INITIAL_DATA.stats,
        experience: about.data?.experience || INITIAL_DATA.experience,
        contact: hero.data?.social_links || INITIAL_DATA.contact
      };
    } catch (error) {
      console.error('Error fetching data from API:', error);
      return INITIAL_DATA;
    }
  },

  update: async (data: PortfolioData): Promise<void> => {
    console.log('Update called with:', data);
    try {
      // 1. Update Hero & Contact (Social Links)
      const heroId = (data.hero as any).id;
      const heroRes = await fetchWithAuth(`${API_BASE}/hero`, {
        method: 'POST',
        body: JSON.stringify({
          id: isUUID(heroId) ? heroId : undefined,
          title: data.hero.title || 'Untitled Portfolio',
          subtitle: data.hero.subtitle || '',
          background_image_url: data.hero.imageUrl || '',
          cta_text: data.hero.ctaText || 'View Work',
          social_links: data.contact,
          is_active: true
        })
      });
      if (!heroRes.ok) console.error('Hero update failed:', await heroRes.status, await heroRes.text());

      // 2. Update About & Experience
      const aboutId = (data.about as any).id;
      const aboutRes = await fetchWithAuth(`${API_BASE}/about`, {
        method: 'POST',
        body: JSON.stringify({
          id: isUUID(aboutId) ? aboutId : undefined,
          heading: data.hero.title || 'About Me',
          bio: data.about.bio || ' No bio provided.',
          skills: data.about.skills || [],
          experience: data.experience,
          is_active: true
        })
      });
      if (!aboutRes.ok) console.error('About update failed:', await aboutRes.status, await aboutRes.text());

      // 3. Update Projects
      for (const project of data.projects) {
        const projRes = await fetchWithAuth(`${API_BASE}/projects`, {
          method: 'POST',
          body: JSON.stringify({
            id: isUUID(project.id) ? project.id : undefined,
            title: project.title || 'New Project',
            slug: (project.title || 'new-project-' + Date.now()).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            short_description: project.description || ' No description',
            technologies: project.techStack || [],
            thumbnail_url: project.imageUrl || '',
            demo_url: project.demoUrl || '',
            github_url: project.repoUrl || '',
            is_published: true
          })
        });
        if (!projRes.ok) console.error(`Project "${project.title}" update failed:`, await projRes.status, await projRes.text());
      }

      // 4. Update Stats
      const statsRes = await fetchWithAuth(`${API_BASE}/stats`, {
        method: 'POST',
        body: JSON.stringify(data.stats.map(s => ({
          ...s,
          label: s.label || 'Stat',
          value: s.value || '0',
          id: isUUID(s.id) ? s.id : undefined
        })))
      });
      if (!statsRes.ok) console.error('Stats update failed:', await statsRes.status, await statsRes.text());

      // 5. Update Certificates
      for (const cert of data.certificates) {
        const certRes = await fetchWithAuth(`${API_BASE}/certificates`, {
          method: 'POST',
          body: JSON.stringify({
            id: isUUID(cert.id) ? cert.id : undefined,
            title: cert.title || 'New Certificate',
            issuer: cert.issuer || 'Unknown Issuer',
            issue_date: cert.date || new Date().toISOString().split('T')[0],
            credential_url: cert.url || '',
            is_published: true
          })
        });
        if (!certRes.ok) console.error(`Certificate "${cert.title}" update failed:`, await certRes.status, await certRes.text());
      }

      // 6. Update Blogs
      for (const post of data.blogs) {
        const blogRes = await fetchWithAuth(`${API_BASE}/blogs`, {
          method: 'POST',
          body: JSON.stringify({
            id: isUUID(post.id) ? post.id : undefined,
            title: post.title || 'New Post',
            slug: (post.title || 'new-post-' + Date.now()).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            excerpt: post.excerpt || ' No excerpt',
            content: post.content || 'Draft content...',
            published_at: post.date || new Date().toISOString(),
            is_published: true
          })
        });
        if (!blogRes.ok) console.error(`Blog "${post.title}" update failed:`, await blogRes.status, await blogRes.text());
      }

    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  },

  reset: async (): Promise<PortfolioData> => {
    console.log('Reset called');
    return INITIAL_DATA;
  }
};
