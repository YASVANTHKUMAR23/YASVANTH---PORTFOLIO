import React, { useState, useEffect, useMemo } from 'react';
import SocialLinks from './SocialLinks';
import { ChevronDown, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealTimeData } from '@/context/RealTimeDataContext';

interface HeroProps {
  onNavigate: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { data } = useRealTimeData();
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = (data.animatedTitles?.map(t => t.title)) || ["Innovator", "Visionary", "Engineer", "Builder", "Designer"];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2800);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles.length]);

  // Enhanced particles for stronger atmospheric presence
  const particles = useMemo(() => {
    return Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 5 + 3}px`, // Increased size (3-8px)
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 12 + 8}s`,
      drift: `${(Math.random() - 0.5) * 100}px`
    }));
  }, []);

  const handleDownloadResume = () => {
    if (data.settings.resume_url && data.settings.resume_url !== '#') {
      try {
        const link = document.createElement('a');
        link.href = data.settings.resume_url;
        link.setAttribute('download', 'Yasvanth_Resume.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Download failed", error);
      }
    }
  };

  // Calculate dynamic font size based on word length to prevent overflow
  const getDynamicFontSize = (text: string) => {
    const len = text.length;
    let baseRem = 16;
    if (len > 12) baseRem = 7.5;
    else if (len > 10) baseRem = 10;
    else if (len > 8) baseRem = 12.5;

    // Scale for mobile (3.5rem min) and desktop (baseRem max)
    return `clamp(3.5rem, ${baseRem * 1.2}vw, ${baseRem}rem)`;
  };

  const currentTitle = titles[titleNumber];
  const dynamicSize = getDynamicFontSize(currentTitle);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden bg-transparent"
    >
      {/* Enhanced Floating Bubbles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {particles.map((p) => (
          <div
            key={p.id}
            className="marine-particle bg-cyan-300/40"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              boxShadow: `0 0 12px rgba(0, 210, 255, 0.4)`,
              animationDelay: p.delay,
              animationDuration: p.duration,
              '--drift-x': p.drift
            } as any}
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="relative z-30 flex flex-col items-center max-w-7xl px-4 w-full select-none mt-20 md:mt-0 pt-20 md:pt-32 mb-32 md:mb-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-0"
        >
          <span className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-none">
            {data.settings.hero_title || "I am a"}
          </span>
        </motion.div>

        {/* Dynamic height container to accommodate scaling text */}
        <div className="relative h-[8rem] sm:h-[12rem] md:h-[16rem] lg:h-[22rem] w-full flex items-center justify-center overflow-hidden -mt-4 md:-mt-8">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentTitle}
              initial={{ opacity: 0, y: 100, filter: "blur(15px)", scale: 0.9 }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                scale: 1,
                fontSize: dynamicSize
              }}
              exit={{ opacity: 0, y: -100, filter: "blur(15px)", scale: 1.1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 1
              }}
              className="absolute text-white font-black leading-none tracking-[-0.05em] drop-shadow-[0_20px_60px_rgba(0,0,0,0.4)] px-4"
              style={{ fontSize: dynamicSize }}
            >
              {currentTitle}
            </motion.h1>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Layout Section */}
      <div className="absolute bottom-10 left-0 w-full z-40 px-8 md:px-20 flex flex-col items-center pointer-events-none">

        {/* Subtitle Line */}
        <div className="flex items-center justify-center gap-6 mb-12 text-[10px] md:text-[11px] tracking-[0.8em] font-black text-blue-400/40 uppercase select-none">
          <span>{data.settings.hero_subtitle?.split(' • ')[0] || "Developer"}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400/20" />
          <span>{data.settings.hero_subtitle?.split(' • ')[1] || "Engineer"}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400/20" />
          <span>{data.settings.hero_subtitle?.split(' • ')[2] || "AI Builder"}</span>
        </div>

        {/* Interaction Row */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center gap-8 md:gap-0">

          <div className="flex items-center justify-center md:justify-start pointer-events-auto">
            <SocialLinks />
          </div>

          <div
            onClick={() => onNavigate('#projects')}
            className="flex flex-col items-center gap-1 group cursor-pointer justify-center pointer-events-auto"
          >
            <span className="text-[10px] uppercase tracking-[0.6em] font-black text-gray-400 group-hover:text-blue-400 transition-all">Explore</span>
            <ChevronDown className="w-4 h-4 text-blue-400/60 group-hover:text-blue-400 group-hover:translate-y-0.5 transition-all animate-bounce" />
          </div>

          <div className="flex justify-center md:justify-end pointer-events-auto">
            <button
              onClick={handleDownloadResume}
              className="flex items-center gap-5 text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-black bg-[#020617] text-white px-9 py-5 rounded-full hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5 group"
            >
              Download Resume
              <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center transition-all group-hover:bg-white/20">
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
