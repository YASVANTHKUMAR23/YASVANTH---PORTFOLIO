import React, { useEffect, useState } from 'react';
import { db } from '../services/db';
import { PortfolioData } from '../types';
import { Button, Card, SectionTitle, Skeleton, ScrollReveal, TiltCard } from '../components/Components';
import { ExternalLink, Github, Calendar, Clock, ArrowRight, Code, Cpu, Globe, Layout, Database, Terminal, Briefcase, Award, Zap, Layers, Server } from 'lucide-react';

// Icons helper
const ICON_MAP: Record<string, any> = {
  'React': Code,
  'TypeScript': Terminal,
  'Next.js': Globe,
  'Tailwind': Layout,
  'Node.js': Server,
  'PostgreSQL': Database,
  'AWS': CloudIcon,
  'Docker': ContainerIcon,
  'Vue.js': Code,
  'Firebase': Database,
};

function getIcon(name: string) {
  return ICON_MAP[name] || Code;
}

// --- Home/Hero ---
export const Home = () => {
  const [data, setData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    db.get().then(setData);
  }, []);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Skeleton className="w-32 h-32 rounded-full mx-auto" />
        <Skeleton className="w-64 h-8 mx-auto" />
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        
        <ScrollReveal>
          <div className="relative mb-10 group mx-auto w-fit">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <img
              src={data.hero.imageUrl}
              alt="Profile"
              className="relative w-40 h-40 md:w-56 md:h-56 rounded-full object-cover border-4 border-slate-900 shadow-2xl transform transition-transform group-hover:scale-105"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-6 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-slate-300 bg-300% animate-gradient">
              {data.hero.title}
            </span>
          </h1>
        </ScrollReveal>
        
        <ScrollReveal delay={400}>
          <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mb-10 leading-relaxed text-center mx-auto">
            {data.hero.subtitle}
          </p>
        </ScrollReveal>
        
        <ScrollReveal delay={600}>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => window.location.hash = '#/projects'} className="text-lg px-8 py-4 shadow-indigo-500/25">
              {data.hero.ctaText}
            </Button>
            <Button variant="secondary" onClick={() => window.location.hash = '#/contact'} className="text-lg px-8 py-4">
              Get In Touch
            </Button>
          </div>
        </ScrollReveal>
      </section>

      {/* Tech Marquee Section */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800 backdrop-blur-sm">
        <div className="max-w-full overflow-hidden">
          <p className="text-center text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mb-10">Technologies & Tools</p>
          <div className="relative flex overflow-x-hidden group">
            <div className="animate-marquee whitespace-nowrap flex gap-16 px-8">
              {[...data.about.skills, ...data.about.skills, ...data.about.skills].map((skill, i) => {
                const Icon = getIcon(skill);
                return (
                  <div key={i} className="flex items-center gap-3 text-slate-400 text-xl font-bold opacity-70 hover:opacity-100 hover:text-white transition-all cursor-default">
                    <Icon className="text-indigo-500" /> {skill}
                  </div>
                );
              })}
            </div>
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#0f172a] to-transparent z-10"></div>
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#0f172a] to-transparent z-10"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-slate-800/30">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {data.stats.map((stat, i) => (
            <ScrollReveal key={stat.id} delay={i * 100} className="text-center group cursor-default">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors duration-300">{stat.value}</div>
              <div className="text-slate-500 text-xs uppercase tracking-widest font-semibold">{stat.label}</div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <ScrollReveal>
          <SectionTitle>The Process</SectionTitle>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent -z-10"></div>
          
          {[
            { title: 'Discover', desc: 'Understanding the core problem and user needs through deep research.', icon: <Zap size={32} className="text-white" />, color: 'bg-yellow-500' },
            { title: 'Design', desc: 'Crafting intuitive and beautiful interfaces with a focus on UX.', icon: <Layout size={32} className="text-white" />, color: 'bg-cyan-500' },
            { title: 'Develop', desc: 'Building robust, scalable solutions using modern tech stacks.', icon: <Code size={32} className="text-white" />, color: 'bg-indigo-500' }
          ].map((step, i) => (
            <ScrollReveal key={i} delay={i * 200}>
              <TiltCard className="h-full bg-slate-800/20 hover:bg-slate-800/40 border-slate-700/30">
                <div className={`${step.color} shadow-lg shadow-${step.color.replace('bg-', '')}/20 rounded-2xl w-16 h-16 flex items-center justify-center mb-8 mx-auto md:mx-0`}>
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 text-center md:text-left">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-center md:text-left">{step.desc}</p>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="py-24 px-4 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Work</h2>
                <p className="text-slate-400">A selection of my recent projects.</p>
              </div>
              <Button variant="secondary" onClick={() => window.location.hash = '#/projects'} className="group">
                  View All Projects <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </Button>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.projects.slice(0, 3).map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 100}>
                  <TiltCard className="h-full group flex flex-col">
                    <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-xl">
                      <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/0 transition-all duration-500"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.slice(0, 3).map(tech => (
                          <span key={tech} className="text-xs text-slate-500 bg-slate-950/50 px-2 py-1 rounded border border-slate-800">
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="text-xs text-slate-500 bg-slate-950/50 px-2 py-1 rounded border border-slate-800">+{project.techStack.length - 3}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700/50">
                      <a href={project.demoUrl} className="text-sm font-medium text-white hover:text-indigo-400 flex items-center gap-1 transition-colors">
                        View Project <ArrowRight size={14} />
                      </a>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              ))}
           </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-32 px-4 max-w-4xl mx-auto">
        <ScrollReveal>
          <SectionTitle>Experience</SectionTitle>
        </ScrollReveal>
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-indigo-500/50 before:to-transparent">
          {data.experience.map((exp, i) => (
            <ScrollReveal key={exp.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Briefcase size={16} className="text-white" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm shadow-xl hover:border-indigo-500/30 transition-all hover:-translate-y-1 duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-lg">{exp.role}</h3>
                  <span className="inline-block px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded text-xs font-mono">{exp.year}</span>
                </div>
                <div className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                  <Layers size={14} /> {exp.company}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/20 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
            <ScrollReveal>
              <h2 className="text-4xl md:text-7xl font-bold text-white mb-8 tracking-tight">Ready to build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">extraordinary?</span></h2>
              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">Let's combine your vision with my technical expertise to create a digital product that stands out.</p>
              <Button className="text-lg px-12 py-5 rounded-full shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 transform hover:scale-105 transition-all duration-300" onClick={() => window.location.hash = '#/contact'}>
                Start a Project
              </Button>
            </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

// Icons helper
function CloudIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>; }
function ContainerIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>; }


// --- About ---
export const About = () => {
  const [data, setData] = useState<PortfolioData | null>(null);

  useEffect(() => { db.get().then(setData); }, []);

  if (!data) return <div className="p-8"><Skeleton className="h-64 w-full" /></div>;

  // Use dynamic stats if available, otherwise fallback
  const expStat = data.stats.find(s => s.label.toLowerCase().includes('year'))?.value || "5+";
  const projStat = data.stats.find(s => s.label.toLowerCase().includes('project'))?.value || "50+";

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <ScrollReveal>
        <SectionTitle>About Me</SectionTitle>
      </ScrollReveal>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <ScrollReveal className="space-y-6">
           <TiltCard>
            <p className="text-slate-300 leading-relaxed text-lg mb-6">{data.about.bio}</p>
            <div className="flex gap-4">
              <div className="text-center p-4 bg-slate-900/50 rounded-lg flex-1 border border-slate-700/50">
                <div className="text-3xl font-bold text-indigo-400 mb-1">{expStat}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Years Exp</div>
              </div>
              <div className="text-center p-4 bg-slate-900/50 rounded-lg flex-1 border border-slate-700/50">
                <div className="text-3xl font-bold text-cyan-400 mb-1">{projStat}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Projects</div>
              </div>
            </div>
          </TiltCard>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
              <Cpu className="text-indigo-400" /> Technical Arsenal
            </h3>
            <div className="flex flex-wrap gap-3">
              {data.about.skills.map((skill, i) => (
                <span key={skill} className="px-4 py-2 bg-slate-900/80 text-indigo-300 border border-indigo-500/20 rounded-lg text-sm font-medium hover:bg-indigo-500/20 hover:scale-105 transition-all cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

// --- Projects ---
export const Projects = () => {
  const [projects, setProjects] = useState<PortfolioData['projects']>([]);

  useEffect(() => { db.get().then(d => setProjects(d.projects)); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SectionTitle>Featured Projects</SectionTitle>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <ScrollReveal key={project.id} delay={i * 100}>
            <TiltCard className="h-full group flex flex-col">
              <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-xl">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-2 py-1 bg-indigo-500/80 text-white text-xs rounded shadow-lg backdrop-blur-sm">Featured</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-indigo-400 transition-colors">{project.title}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                {project.techStack.map(tech => (
                  <span key={tech} className="text-xs text-slate-500 bg-slate-950/50 px-2 py-1 rounded border border-slate-800">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
                <a href={project.repoUrl} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                  <Github size={16} /> Code
                </a>
                <a href={project.demoUrl} className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                  Live Demo <ExternalLink size={16} />
                </a>
              </div>
            </TiltCard>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

// --- Certificates ---
export const Certificates = () => {
  const [certs, setCerts] = useState<PortfolioData['certificates']>([]);

  useEffect(() => { db.get().then(d => setCerts(d.certificates)); }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <SectionTitle>Certifications</SectionTitle>
      <div className="grid md:grid-cols-2 gap-6">
        {certs.map((cert, i) => (
          <ScrollReveal key={cert.id} delay={i * 100}>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 flex items-start justify-between hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all group">
              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:scale-110 transition-transform">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">{cert.title}</h3>
                  <p className="text-slate-400 text-sm mb-3">{cert.issuer}</p>
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Calendar size={14} /> {cert.date}
                  </div>
                </div>
              </div>
              <a href={cert.url} className="p-2 bg-slate-700/50 rounded-full hover:bg-indigo-600 hover:text-white transition-all text-slate-400">
                <ExternalLink size={20} />
              </a>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

// --- Blog ---
export const Blog = () => {
  const [blogs, setBlogs] = useState<PortfolioData['blogs']>([]);

  useEffect(() => { db.get().then(d => setBlogs(d.blogs)); }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <SectionTitle>Latest Thoughts</SectionTitle>
      <div className="space-y-8">
        {blogs.map((post, i) => (
          <ScrollReveal key={post.id} delay={i * 150}>
            <article className="group bg-slate-800/20 border border-slate-700/30 rounded-2xl p-8 hover:bg-slate-800/40 hover:border-indigo-500/20 transition-all cursor-pointer">
              <div className="flex items-center gap-4 text-xs text-indigo-400 font-mono mb-4">
                <span className="flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded"><Calendar size={12} /> {post.date}</span>
                <span className="flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded"><Clock size={12} /> {post.readTime}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-200 mb-4 group-hover:text-indigo-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                {post.excerpt}
              </p>
              <button className="text-white text-sm font-medium flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-full group-hover:bg-indigo-600 transition-all">
                Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};

// --- Contact ---
export const Contact = () => {
  const [contact, setContact] = useState<PortfolioData['contact'] | null>(null);

  useEffect(() => { db.get().then(d => setContact(d.contact)); }, []);

  if (!contact) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <ScrollReveal>
        <SectionTitle>Get In Touch</SectionTitle>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 blur-2xl opacity-20 -z-10 rounded-2xl"></div>
          <div className="bg-slate-900/80 backdrop-blur-xl p-10 rounded-2xl border border-slate-700/50 text-center shadow-2xl">
            <p className="text-slate-300 mb-8 text-xl font-light">
              I'm currently available for freelance work or full-time opportunities. 
              If you have a project that needs some creative touch, let's chat.
            </p>
            
            <a href={`mailto:${contact.email}`} className="inline-block bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-indigo-500/25 transition-all mb-12 transform hover:scale-105">
              Say Hello
            </a>

            <div className="grid grid-cols-3 gap-6 border-t border-slate-800 pt-10">
              {[
                { label: 'GitHub', value: contact.github, icon: Github },
                { label: 'LinkedIn', value: contact.linkedin, icon: ExternalLink },
                { label: 'Twitter', value: contact.twitter, icon: ExternalLink }
              ].map((item) => (
                 <a key={item.label} href={`https://${item.value}`} target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-3 text-slate-400 hover:text-white transition-colors p-4 rounded-xl hover:bg-slate-800/50 border border-transparent hover:border-slate-700">
                   <div className="p-3 bg-slate-800 rounded-full group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                     <item.icon size={24} />
                   </div>
                   <span className="text-sm font-medium">{item.label}</span>
                 </a>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};