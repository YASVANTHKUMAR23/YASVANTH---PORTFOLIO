import React from 'react';
import { Mail, MapPin, Share2 } from 'lucide-react';
import ContactForm from './ContactForm';
import SocialLinks from './SocialLinks';
import { useData } from '../context/DataContext';
import { useRealTimeData } from '@/context/RealTimeDataContext';

const ContactPage: React.FC = () => {
  const { data } = useRealTimeData();
  const header = data.pageHeaders.contact;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-transparent text-white">
      {/* Intro Section */}
      <section className="px-8 md:px-16 mb-20">
        <div className="max-w-7xl mx-auto">
          <h3 className="entrance-anim text-sm font-semibold mb-6 tracking-[0.3em] text-blue-400/60 uppercase">
            {header.eyebrow}
          </h3>
          <h1 className="entrance-anim delay-1 text-5xl md:text-8xl font-light text-white leading-none mb-8">
            {header.title.split(' ').slice(0, -1).join(' ')} <span className="font-extrabold">{header.title.split(' ').slice(-1)}</span>
          </h1>
          <p className="entrance-anim delay-2 max-w-2xl text-gray-400 text-lg leading-relaxed">
            {header.description}
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">

          {/* Contact Details Column */}
          <div className="space-y-8 entrance-anim delay-3">
            <div className="grid grid-cols-1 gap-6">
              {/* Contact Card 1 */}
              <div className="group bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl hover:shadow-[0_0_50px_rgba(0,124,240,0.1)] transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-start gap-6">
                  <div className="bg-white/5 p-4 rounded-xl text-blue-400 group-hover:bg-[#007cf0] group-hover:text-white transition-colors duration-300">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-blue-400/40 mb-2">Email Me</h4>
                    <p className="text-xl font-bold text-white">{data.settings.email}</p>
                  </div>
                </div>
              </div>

              {/* Contact Card 2 */}
              <div className="group bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl hover:shadow-[0_0_50px_rgba(0,124,240,0.1)] transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-start gap-6">
                  <div className="bg-white/5 p-4 rounded-xl text-blue-400 group-hover:bg-[#007cf0] group-hover:text-white transition-colors duration-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-blue-400/40 mb-2">Location</h4>
                    <p className="text-xl font-bold text-white">{data.settings.location}</p>
                  </div>
                </div>
              </div>

              {/* Contact Card 3 */}
              <div className="group bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl hover:shadow-[0_0_50px_rgba(0,124,240,0.1)] transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-start gap-6">
                  <div className="bg-white/5 p-4 rounded-xl text-blue-400 group-hover:bg-[#007cf0] group-hover:text-white transition-colors duration-300">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-blue-400/40 mb-4">Follow Me</h4>
                    <SocialLinks />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-80 bg-black/40 rounded-2xl border border-white/10 overflow-hidden relative shadow-inner">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                src="https://maps.google.com/maps?q=Tiruchirappalli,Tamil%20Nadu&t=&z=13&ie=UTF8&iwloc=&output=embed"
                allowFullScreen
              ></iframe>
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-12 h-12 bg-[#007cf0] text-white flex items-center justify-center rounded-full shadow-2xl animate-pulse">
                  <MapPin className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          <div className="entrance-anim delay-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-sm">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
