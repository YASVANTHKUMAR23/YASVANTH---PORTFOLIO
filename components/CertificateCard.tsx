import React, { useState, useRef } from 'react';
import { ZoomIn } from 'lucide-react';

interface Certificate {
  id: number;
  title: string;
  org: string;
  image: string;
}

interface CertificateCardProps {
  cert: {
    id: number;
    title: string;
    org: string;
    image: string;
  };
}

const CertificateCard: React.FC<CertificateCardProps> = ({ cert }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 cursor-pointer overflow-hidden transition-all duration-500 perspective-1000 shadow-2xl hover:shadow-[0_0_40px_rgba(37,99,235,0.2)] vibrant-border"
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: 'transform 0.1s ease-out, box-shadow 0.5s ease'
        }}
      >
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-6 bg-black/20 border border-white/5">
          <img
            src={cert.image}
            alt={cert.title}
            className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-110 opacity-80 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-transparent transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-full shadow-2xl border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform">
              <ZoomIn className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[9px] tracking-[0.3em] uppercase font-extrabold text-blue-400/50 group-hover:text-blue-400 transition-colors">{cert.org}</span>
          <h3 className="text-base font-bold text-white group-hover:text-gray-300 transition-colors leading-tight line-clamp-1">{cert.title}</h3>
        </div>
      </div>
    </>
  );
};

export default CertificateCard;
