import React, { useState, useRef } from 'react';
import { ExternalLink, Github } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    description: string;
    image: string;
    stack: string[];
    liveUrl?: string;
    githubUrl?: string;
  };
  featured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, featured = false }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  if (featured) {
    return (
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative flex flex-col lg:flex-row items-center gap-12 p-8 md:p-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl hover:shadow-[0_0_50px_rgba(37,99,235,0.2)] transition-all duration-500 perspective-1000 vibrant-border"
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: 'transform 0.1s ease-out, box-shadow 0.5s ease'
        }}
      >
        <div className="w-full lg:w-3/5 overflow-hidden rounded-xl bg-black/20 aspect-video relative shadow-inner border border-white/5">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-110 opacity-80 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-transparent transition-colors" />
        </div>

        <div className="w-full lg:w-2/5 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.4em] uppercase font-extrabold text-blue-400/60">Featured Work</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{project.title}</h2>
          </div>

          <p className="text-gray-400 leading-relaxed text-sm md:text-base">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.stack.map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest border border-white/10 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-6 pt-4">
            <a
              href={project.liveUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white border-b-2 border-white pb-1 hover:text-blue-400 hover:border-blue-400 transition-all"
            >
              Live Demo <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={project.githubUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white border-b-2 border-white pb-1 hover:text-blue-400 hover:border-blue-400 transition-all"
            >
              GitHub <Github className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group bg-white/5 backdrop-blur-xl p-6 border border-white/10 rounded-xl hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] transition-all duration-500 flex flex-col aspect-[4/5] perspective-1000 vibrant-border"
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
    >
      <div className="overflow-hidden rounded-lg bg-black/20 aspect-square mb-6 border border-white/5">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-all duration-700 opacity-80 group-hover:opacity-100"
        />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
      <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">{project.description}</p>
      <div className="mt-auto flex justify-between items-center">
        <div className="flex gap-1">
          {project.stack.slice(0, 2).map(tag => (
            <span key={tag} className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{tag}</span>
          ))}
        </div>
        <div className="flex gap-3 text-white">
          <a href={project.liveUrl || "#"} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 cursor-pointer hover:text-blue-400 hover:scale-125 transition-all" />
          </a>
          <a href={project.githubUrl || "#"} target="_blank" rel="noopener noreferrer">
            <Github className="w-4 h-4 cursor-pointer hover:text-blue-400 hover:scale-125 transition-all" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
