import React from 'react';
import { useRealTimeData } from '../context/RealTimeDataContext';

const AboutPage: React.FC = () => {
  const { data } = useRealTimeData();
  const header = data.pageHeaders.about;
  const expHeader = data.pageHeaders.experience;
  const skillsHeader = data.pageHeaders.skills;

  return (
    <div className="pt-40 pb-24 min-h-screen bg-transparent text-white">
      <section className="px-8 md:px-16 mb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="entrance-anim">
            <h3 className="text-xs font-bold tracking-[0.4em] text-blue-400/60 uppercase mb-8">{header.eyebrow}</h3>
            <h1 className="text-2xl md:text-4xl font-light leading-none mb-12 text-white">
              {header.title.split(' ').slice(0, -1).join(' ')} <span className="font-extrabold">{header.title.split(' ').slice(-1)}</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed font-light max-w-xl">
              {header.description}
            </p>
          </div>
          <div className="entrance-anim delay-1 relative">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden transition-all duration-1000 shadow-[0_0_50px_rgba(0,124,240,0.1)] border border-white/10">
              <img src={data.settings.about_image} alt="Portrait" className="w-full h-full object-cover opacity-90 transition-opacity hover:opacity-100" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-[#007cf0] text-white p-12 rounded-3xl hidden md:block z-10 shadow-3xl">
              <span className="text-6xl font-extrabold block leading-tight">{data.settings.years_of_mastery}</span>
              <p className="text-[10px] tracking-[0.3em] uppercase mt-2 opacity-80 font-black">Years of Mastery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="px-8 md:px-16 py-32 bg-[#0d3b66]/10 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-[10px] uppercase tracking-[0.5em] font-extrabold text-blue-400/40">{expHeader.eyebrow}</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white">{expHeader.title}</h3>
            <p className="text-gray-400 text-sm max-w-xl mx-auto font-medium">{expHeader.description}</p>
          </div>

          <div className="space-y-12">
            {data.experience.map((exp, i) => (
              <div key={exp.id} className="flex flex-col md:flex-row gap-8 py-10 border-b border-white/5 group hover:px-6 transition-all duration-500">
                <span className="text-blue-400/30 font-bold tracking-widest text-xs md:w-48 group-hover:text-blue-400 transition-colors">{exp.year_range}</span>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold group-hover:tracking-wider transition-all uppercase tracking-tight text-white">{exp.role}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-blue-400/60 mt-2 font-black">{exp.company}</p>
                  <p className="text-gray-400 mt-6 leading-relaxed max-w-2xl font-medium">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="px-8 md:px-16 py-32 bg-[#020b1d] border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-20 space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.5em] font-extrabold text-blue-400/40">{skillsHeader.eyebrow}</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white">{skillsHeader.title}</h3>
            <p className="text-gray-400 text-sm max-w-xl mx-auto font-medium">{skillsHeader.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {data.skills.map((skill, i) => (
              <div key={i} className="group p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-[#007cf0] hover:text-white transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,124,240,0.2)]">
                <span className="text-[10px] uppercase tracking-widest font-black italic">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
