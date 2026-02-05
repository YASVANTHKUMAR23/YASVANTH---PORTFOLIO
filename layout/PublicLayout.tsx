import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { BackgroundBeams } from '../components/Components';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Secret Login Trigger
  const handleNameClick = () => {
    setClickCount(prev => prev + 1);
  };

  useEffect(() => {
    if (clickCount >= 3) {
      setClickCount(0);
      navigate('/login');
    }
    const timer = setTimeout(() => {
      if (clickCount > 0) setClickCount(0);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [clickCount, navigate]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Certificates', path: '/certificates' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col text-slate-200 relative">
      <BackgroundBeams />
      
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0 cursor-pointer select-none" onClick={handleNameClick}>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                DevFolio
              </span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-white bg-indigo-500/10 border border-indigo-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-20 w-full bg-[#0f172a]/95 backdrop-blur-xl border-b border-slate-800 transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'text-indigo-400 bg-indigo-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900/50 backdrop-blur-md border-t border-slate-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">DevFolio</span>
            <p className="text-slate-500 text-sm mt-2">© {new Date().getFullYear()} All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-indigo-600 transition-all duration-300"><Github size={20} /></a>
            <a href="#" className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-blue-600 transition-all duration-300"><Linkedin size={20} /></a>
            <a href="#" className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-sky-500 transition-all duration-300"><Twitter size={20} /></a>
            <a href="#" className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-red-500 transition-all duration-300"><Mail size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;