import React from 'react';
import { Twitter, Linkedin, Github, Instagram, Mail } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useRealTimeData } from '@/context/RealTimeDataContext';

const SocialLinks: React.FC = () => {
  const { data } = useRealTimeData();
  const socials = Object.fromEntries(data.socialLinks.map(s => [s.platform, s.url]));

  const links = [
    { icon: <Twitter className="w-5 h-5" />, href: socials.twitter, name: "Twitter" },
    { icon: <Linkedin className="w-5 h-5" />, href: socials.linkedin, name: "LinkedIn" },
    { icon: <Github className="w-5 h-5" />, href: socials.github, name: "GitHub" },
    { icon: <Instagram className="w-5 h-5" />, href: socials.instagram, name: "Instagram" },
    { icon: <Mail className="w-5 h-5" />, href: socials.email, name: "Email" },
  ];

  return (
    <div className="flex space-x-8">
      {links.map((link) => (
        link.href && (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative text-gray-500 hover:text-blue-400 transition-all duration-300 transform hover:-translate-y-1"
            aria-label={link.name}
          >
            <div className="transition-transform duration-300 group-hover:scale-125">
              {link.icon}
            </div>
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              {link.name}
            </span>
          </a>
        )
      ))}
    </div>
  );
};

export default SocialLinks;
