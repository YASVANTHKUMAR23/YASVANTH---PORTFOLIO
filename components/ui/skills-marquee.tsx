import React from 'react';
import { cn } from "../../lib/utils";

interface SkillsMarqueeProps {
  skills: string[];
  className?: string;
}

export function SkillsMarquee({ skills, className }: SkillsMarqueeProps) {
  // We use a high duration for slow, readable speed
  // Seamless loop is achieved by repeating the list twice in the marquee container
  return (
    <div className={cn("relative flex w-full flex-col items-center justify-center overflow-hidden py-12", className)}>
      <div
        className="group flex overflow-hidden p-2 [--gap:2rem] [gap:var(--gap)] flex-row [--duration:80s]"
      >
        <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
          {/* First set for the primary scroll */}
          {skills.map((skill, i) => (
            <div
              key={`set1-${i}`}
              className="flex items-center justify-center px-10 py-6 bg-white border border-black/5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <span className="text-sm md:text-lg font-black tracking-[0.3em] uppercase italic text-black whitespace-nowrap">
                {skill}
              </span>
            </div>
          ))}
          {/* Second set for the seamless repeat (removes the "wait time") */}
          {skills.map((skill, i) => (
            <div
              key={`set2-${i}`}
              className="flex items-center justify-center px-10 py-6 bg-white border border-black/5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <span className="text-sm md:text-lg font-black tracking-[0.3em] uppercase italic text-black whitespace-nowrap">
                {skill}
              </span>
            </div>
          ))}
        </div>

        {/* We mirror the container above to ensure there is never a gap regardless of screen width */}
        <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]" aria-hidden="true">
          {skills.map((skill, i) => (
            <div
              key={`set3-${i}`}
              className="flex items-center justify-center px-10 py-6 bg-white border border-black/5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <span className="text-sm md:text-lg font-black tracking-[0.3em] uppercase italic text-black whitespace-nowrap">
                {skill}
              </span>
            </div>
          ))}
          {skills.map((skill, i) => (
            <div
              key={`set4-${i}`}
              className="flex items-center justify-center px-10 py-6 bg-white border border-black/5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <span className="text-sm md:text-lg font-black tracking-[0.3em] uppercase italic text-black whitespace-nowrap">
                {skill}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Side Fades for elegant entry/exit - Unified color */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#e3ebf2] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#e3ebf2] to-transparent z-10" />
    </div>
  );
}
