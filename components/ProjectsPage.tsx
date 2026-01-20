import React from 'react';
import ProjectCard from './ProjectCard';
import { useData } from '../context/DataContext';
import { useRealTimeData } from '@/context/RealTimeDataContext';

const ProjectsPage: React.FC = () => {
  const { data } = useRealTimeData();
  const header = data.pageHeaders.projects;
  const featured = data.projects.filter(p => p.featured);
  const others = data.projects.filter(p => !p.featured);

  return (
    <div className="pt-40 pb-24 min-h-screen bg-transparent text-white">
      <section className="px-8 md:px-16 mb-24">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-[10px] font-black mb-8 tracking-[0.5em] text-blue-400/60 uppercase">{header.eyebrow}</h3>
          <h1 className="text-6xl md:text-9xl font-light text-white leading-none mb-12 tracking-tighter">
            {header.title.split(' ').slice(0, -1).join(' ')} <span className="font-black">{header.title.split(' ').slice(-1)}</span>
          </h1>
          <p className="max-w-2xl text-xl text-gray-400 font-light leading-relaxed">
            {header.description}
          </p>
        </div>
      </section>

      {/* Featured Section */}
      <section className="px-8 md:px-16 mb-40">
        <div className="max-w-7xl mx-auto space-y-40">
          {featured.map((project, idx) => (
            <div key={project.id} className="entrance-anim">
              <ProjectCard
                project={{
                  ...project,
                  image: project.image_url,
                  stack: project.stack.split(',').map(s => s.trim())
                }}
                featured={true}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Others Grid */}
      <section className="px-8 md:px-16 py-32 bg-[#0d3b66]/10 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-blue-400/40 mb-20 whitespace-nowrap overflow-hidden">Full Directory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {others.map((project, idx) => (
              <div key={project.id} className="entrance-anim" style={{ animationDelay: `${0.1 * idx}s` }}>
                <ProjectCard project={{
                  ...project,
                  image: project.image_url,
                  stack: project.stack.split(',').map(s => s.trim())
                }} />
              </div>
            ))}
            {others.length === 0 && (
              <p className="col-span-full text-center text-gray-500 font-bold uppercase tracking-widest py-20">No minor projects registered.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
