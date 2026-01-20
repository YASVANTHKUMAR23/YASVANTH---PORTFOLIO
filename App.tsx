import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectsPage from './components/ProjectsPage';
import CertificatesPage from './components/CertificatesPage';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';
import { RealTimeDataProvider, useRealTimeData } from './context/RealTimeDataContext';
import { LampContainer } from './components/ui/lamp';
import { motion, Variants } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { DataProvider } from './context/DataContext';
import { CircularTestimonials } from './components/ui/circular-testimonials';
import { SkillsMarquee } from './components/ui/skills-marquee';

import { DeepSeaAtmosphere } from './components/ui/deep-sea-atmosphere';

const SectionDivider = () => <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />;

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'projects' | 'certificates' | 'contact' | 'about' | 'admin' | 'dashboard'>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { data, loading, error, isAuthenticated } = useRealTimeData();

  const navigate = useCallback((page: string) => {
    const target = page.replace('#', '') as any;
    if (target === currentPage) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentPage(target);
      try {
        window.scrollTo({ top: 0, behavior: 'auto' });
      } catch (e) { }
      setIsTransitioning(false);
    }, 250);
  }, [currentPage]);

  const isAuthView = currentPage === 'admin' || currentPage === 'dashboard';

  // Transform data from API format to component format
  const transformProjects = (projects: any[]) => projects.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    image: p.image_url,
    stack: p.stack.split(','),
    featured: p.featured,
    liveUrl: p.live_url,
    githubUrl: p.github_url
  }));

  const transformCertificates = (certs: any[]) => certs.map(c => ({
    id: c.id,
    title: c.title,
    org: c.organization,
    image: c.image_url
  }));

  const transformExperience = (exp: any[]) => exp.map(e => ({
    id: e.id,
    year: e.year_range,
    role: e.role,
    company: e.company,
    description: e.description
  }));

  const transformPhilosophy = (philosophy: any[]) => philosophy.map(p => p.text);

  const transformAnimatedTitles = (titles: any[]) => titles.map(t => t.title);

  const siteData = {
    heroTitle: data.settings.hero_title || "I'm a Full Stack",
    heroSubtitle: data.settings.hero_subtitle || "DEVELOPER • ENGINEER • AI BUILDER",
    animatedTitles: transformAnimatedTitles(data.animatedTitles),
    philosophy: transformPhilosophy(data.philosophy),
    aboutText: data.settings.about_text || "",
    aboutImage: data.settings.about_image || "",
    yearsOfMastery: data.settings.years_of_mastery || "8+",
    resumeUrl: data.settings.resume_url || "#",
    email: data.settings.email || "hello@larson.design",
    location: data.settings.location || "San Francisco, CA",
    skills: data.skills.map(s => s.name),
    projects: transformProjects(data.projects),
    certificates: transformCertificates(data.certificates),
    experience: transformExperience(data.experience),
    socials: {
      twitter: data.socialLinks.find(s => s.platform === 'twitter')?.url || "",
      linkedin: data.socialLinks.find(s => s.platform === 'linkedin')?.url || "",
      github: data.socialLinks.find(s => s.platform === 'github')?.url || "",
      instagram: data.socialLinks.find(s => s.platform === 'instagram')?.url || "",
      email: data.socialLinks.find(s => s.platform === 'email')?.url || ""
    },
    headers: {
      about: data.pageHeaders.about,
      projects: data.pageHeaders.projects,
      certificates: data.pageHeaders.certificates,
      contact: data.pageHeaders.contact,
      experience: data.pageHeaders.experience,
      skills: data.pageHeaders.skills
    }
  };

  // Precision staggered animations
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const p = siteData.philosophy || [];

  // Prepare project data for testimonials component
  const featuredProjects = siteData.projects.filter(proj => proj.featured).map(proj => ({
    name: proj.title,
    designation: proj.stack.join(" • "),
    quote: proj.description,
    src: proj.image,
    liveUrl: proj.liveUrl,
    githubUrl: proj.githubUrl
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#010816] flex items-center justify-center">
        <DeepSeaAtmosphere />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-500 tracking-widest uppercase text-[10px] font-black">Decrypting Portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#010816] flex items-center justify-center">
        <DeepSeaAtmosphere />
        <div className="text-center max-w-md px-4 relative z-10">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Transmission Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-500 transition-all font-black uppercase tracking-widest text-[10px]"
          >
            Reconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010816] overflow-x-hidden selection:bg-blue-600 selection:text-white relative">
      <DeepSeaAtmosphere />

      {currentPage === 'admin' && (isAuthenticated ? <AdminDashboard onNavigate={navigate} /> : <AdminLoginPage onNavigate={navigate} />)}
      {currentPage === 'dashboard' && (isAuthenticated ? <AdminDashboard onNavigate={navigate} /> : <AdminLoginPage onNavigate={navigate} />)}

      {!isAuthView && (
        <div className="relative z-10">
          <Navbar activePage={currentPage} onNavigate={navigate} />

          <main
            className={`transition-all duration-300 ease-in-out transform ${isTransitioning ? 'opacity-0 scale-[0.99] translate-y-2' : 'opacity-100 scale-100 translate-y-0'
              }`}
          >
            {currentPage === 'home' && (
              <div className="entrance-anim">
                <Hero onNavigate={navigate} />
                <SectionDivider />

                {/* Refined Philosophy Section */}
                <div className="bg-[#020b1d] relative">
                  <LampContainer mode="dark">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      className="max-w-5xl mx-auto w-full px-8 md:px-12 relative flex flex-col items-center"
                    >
                      <div className="flex flex-col space-y-8 md:space-y-12 select-none w-full max-w-screen-md lg:max-w-screen-lg py-12">
                        {/* Line 1: I am a */}
                        <motion.div variants={itemVariants} className="flex justify-start">
                          <div className="px-8 py-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10 vibrant-border shadow-2xl">
                            <h2 className="text-[2rem] md:text-[3.5rem] lg:text-[4.5rem] font-light leading-none tracking-tighter text-white/80">
                              {p[0] || "I am a"}
                            </h2>
                          </div>
                        </motion.div>

                        <div className="flex flex-col space-y-4 md:space-y-6">
                          {/* Line 2 & 3: digital architect */}
                          <div className="flex flex-col md:flex-row gap-4 md:pl-16 lg:pl-24">
                            <motion.div variants={itemVariants} className="px-10 py-8 rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 vibrant-border shadow-2xl">
                              <h2 className="text-[2.8rem] md:text-[5.5rem] lg:text-[6.5rem] font-black italic leading-none tracking-[-0.04em] text-white">
                                {p[1] || "digital"}
                              </h2>
                            </motion.div>
                            <motion.div variants={itemVariants} className="px-10 py-8 rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 vibrant-border shadow-2xl md:-mt-4 lg:-mt-8">
                              <h2 className="text-[2.8rem] md:text-[5.5rem] lg:text-[6.5rem] font-black italic leading-none tracking-[-0.04em] text-blue-400">
                                {p[2] || "architect"}
                              </h2>
                            </motion.div>
                          </div>
                        </div>

                        {/* Line 4, 5, 6: obsessed with performance */}
                        <div className="flex flex-wrap gap-4 md:pl-8 lg:pl-12">
                          <motion.div variants={itemVariants} className="px-8 py-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10 vibrant-border">
                            <h2 className="text-[2rem] md:text-[4rem] lg:text-[5rem] font-light leading-none tracking-tighter text-white/80">
                              {p[3] || "obsessed"}
                            </h2>
                          </motion.div>
                          <motion.div variants={itemVariants} className="px-8 py-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10 vibrant-border flex items-center">
                            <h2 className="text-[2rem] md:text-[4rem] lg:text-[5rem] font-light leading-none tracking-tighter text-white/80">
                              {p[4] || "with"}
                            </h2>
                          </motion.div>
                          <motion.div variants={itemVariants} className="px-10 py-8 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10 vibrant-border shadow-2xl">
                            <h2 className="text-[2rem] md:text-[4rem] lg:text-[5rem] font-light leading-none tracking-tighter text-white/80 underline decoration-blue-500/30 decoration-8 underline-offset-8">
                              {p[5] || "performance"}
                            </h2>
                          </motion.div>
                        </div>

                        {/* Line 7: aesthetics */}
                        <motion.div variants={itemVariants} className="flex justify-center md:justify-end md:pr-12 lg:pr-20">
                          <div className="relative inline-block px-12 py-10 rounded-3xl bg-blue-600/10 backdrop-blur-xl border border-blue-500/20 vibrant-border shadow-[0_0_50px_rgba(37,99,235,0.1)]">
                            <h2 className="text-[3.2rem] md:text-[6.5rem] lg:text-[8rem] font-black leading-none tracking-tighter text-white">
                              {p[6] || "aesthetics."}
                            </h2>
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: "80%" }}
                              transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                              className="absolute -bottom-2 md:-bottom-4 left-[10%] h-[2px] md:h-[5px] bg-blue-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,0.5)]"
                            />
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </LampContainer>
                </div>

                <SectionDivider />

                {/* Featured Projects Carousel Section - Unify background */}
                <section className="bg-transparent py-32 md:py-52">
                  <div className="max-w-7xl mx-auto px-8 md:px-16 mb-24 flex flex-col items-center text-center">
                    <span className="text-[10px] uppercase tracking-[0.6em] font-black text-blue-400/20 mb-4">Curated Showcase</span>
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase">
                      Featured <span className="font-light italic">Manifesto</span>
                    </h2>
                  </div>

                  {featuredProjects.length > 0 ? (
                    <CircularTestimonials
                      testimonials={featuredProjects}
                      autoplay={true}
                      colors={{
                        name: "#fff",
                        designation: "#6b7280",
                        testimony: "#a3a3a3",
                        arrowBackground: "#1e1b4b",
                        arrowForeground: "#fff",
                        arrowHoverBackground: "#007cf0",
                      }}
                      fontSizes={{
                        name: "clamp(2rem, 5vw, 4rem)",
                        designation: "12px",
                        quote: "clamp(1rem, 1.5vw, 1.25rem)",
                      }}
                    />
                  ) : (
                    <div className="text-center py-20">
                      <p className="text-[10px] uppercase font-bold tracking-[0.5em] text-gray-300">No projects currently featured.</p>
                    </div>
                  )}
                </section>

                <SectionDivider />

                {/* Mastery & Tech Stack - Unify background */}
                <section className="bg-transparent pb-32">
                  <div className="max-w-7xl mx-auto px-8 md:px-16 py-24 flex flex-col items-center text-center">
                    <span className="text-[10px] uppercase tracking-[0.6em] font-black text-blue-400/20 mb-4">Mastery & Tech Stack</span>
                  </div>
                  <div className="py-20 bg-white/[0.02] backdrop-blur-sm border-y border-white/5 vibrant-border">
                    <SkillsMarquee skills={siteData.skills} />
                  </div>
                </section>
              </div>
            )}

            {currentPage === 'projects' && <ProjectsPage />}
            {currentPage === 'certificates' && <CertificatesPage />}
            {currentPage === 'contact' && <ContactPage />}
            {currentPage === 'about' && <AboutPage />}
          </main>

          <footer className="py-24 bg-[#010816]/80 backdrop-blur-xl border-t border-white/5 text-[10px] tracking-[0.5em] uppercase font-black text-gray-400 px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-center gap-10">
              <div className="flex flex-col gap-2 text-center md:text-left">
                <p className="text-white font-black">YASVANTH STUDIO</p>
                <p className="opacity-40">© 2024 ALL RIGHTS RESERVED</p>
              </div>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                {siteData.socials.linkedin && <a href={siteData.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">LinkedIn</a>}
                {siteData.socials.github && <a href={siteData.socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">GitHub</a>}
                {siteData.socials.twitter && <a href={siteData.socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Twitter</a>}
                {siteData.socials.instagram && <a href={siteData.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Instagram</a>}
              </div>
              <div className="text-center md:text-right hidden md:block">
                <p className="opacity-40">STAY CONNECTED</p>
                <p className="text-white font-black uppercase">{siteData.email}</p>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <RealTimeDataProvider>
        <AppContent />
      </RealTimeDataProvider>
    </DataProvider>
  );
};

export default App;

