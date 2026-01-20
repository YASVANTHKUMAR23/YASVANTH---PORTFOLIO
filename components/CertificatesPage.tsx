import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import CertificateCard from './CertificateCard';
import { useRealTimeData } from '@/context/RealTimeDataContext';

const CertificatesPage: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const { data } = useRealTimeData();
  const header = data.pageHeaders.certificates;

  const Modal = () => (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-start md:justify-center p-6 md:p-12 bg-black/98 backdrop-blur-3xl transition-all duration-700 pointer-events-auto overflow-y-auto"
      onClick={() => setSelectedCert(null)}
    >
      <div className="relative max-w-4xl w-full flex flex-col items-center animate-in zoom-in-95 duration-500 my-auto" onClick={e => e.stopPropagation()}>
        <div className="w-full text-white mb-8 md:mb-12 flex justify-between items-start md:items-end gap-6 md:gap-8">
          <div className="max-w-[70%]">
            <span className="text-[10px] tracking-[0.5em] uppercase font-black opacity-40 block mb-2">{selectedCert.organization}</span>
            <h2 className="text-2xl md:text-6xl font-black leading-tight">{selectedCert.title}</h2>
          </div>
          <button
            className="text-white/60 hover:text-white transition-all hover:rotate-90 duration-300 flex-shrink-0"
            onClick={() => setSelectedCert(null)}
          >
            <X className="w-8 h-8 md:w-16 md:h-16" />
          </button>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-2xl w-full flex items-center justify-center">
          <img
            src={selectedCert.image_url}
            alt={selectedCert.title}
            className="max-w-full max-h-[70vh] object-contain rounded-2xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/1200x800?text=${encodeURIComponent(selectedCert.title)}`;
            }}
          />
        </div>
      </div>
    </div>
  );

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

      <section className="px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {data.certificates.map((cert, idx) => (
            <div key={cert.id} className="entrance-anim" style={{ animationDelay: `${idx * 0.1}s` }} onClick={() => setSelectedCert(cert)}>
              <CertificateCard cert={{
                id: cert.id,
                title: cert.title,
                org: cert.organization,
                image: cert.image_url
              }} />
            </div>
          ))}
          {data.certificates.length === 0 && (
            <p className="col-span-full text-center text-gray-500 font-bold uppercase tracking-widest py-20">No certifications listed.</p>
          )}
        </div>
      </section>

      {selectedCert && ReactDOM.createPortal(<Modal />, document.body)}
    </div>
  );
};

export default CertificatesPage;
