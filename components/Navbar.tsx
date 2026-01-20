import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Navbar as ResizableNavbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu
} from './ui/resizable-navbar';

interface NavbarProps {
  activePage?: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage = 'home', onNavigate }) => {
  const [clickCount, setClickCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const timerRef = useRef<any>(null);

  const NAV_ITEMS = [
    { label: 'Home', target: 'home' },
    { label: 'About', target: 'about' },
    { label: 'Projects', target: 'projects' },
    { label: 'Certificates', target: 'certificates' },
    { label: 'Contact', target: 'contact' },
  ];

  const handleLogoClick = useCallback(() => {
    setClickCount(p => {
      const n = p + 1;
      if (n === 3) {
        setTimeout(() => onNavigate('admin'), 0);
        return 0;
      }
      return n;
    });

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 1000);
  }, [onNavigate]);

  const handleNavClick = (target: string) => {
    onNavigate(target);
    setIsMenuOpen(false);
  };

  const Logo = () => (
    <div
      onClick={handleLogoClick}
      className={`bg-white px-8 py-2.5 rounded-full shadow-sm flex items-center justify-center transition-all duration-200 border border-gray-100 ${clickCount > 0 ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
        }`}
    >
      <span className="text-black text-base md:text-lg font-black tracking-tighter uppercase italic select-none">
        Yasvanth.
      </span>
    </div>
  );

  return (
    <ResizableNavbar>
      {/* Desktop Navigation */}
      <NavBody className="border-none">
        <Logo />
        <nav className="flex space-x-6 lg:space-x-12">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.target;
            return (
              <button
                key={item.label}
                onClick={() => onNavigate(item.target)}
                className={`relative text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-300 pb-1 ${isActive ? 'text-blue-400' : 'text-gray-500 hover:text-blue-400'
                  }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="desktop-active-nav"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-400"
                  />
                )}
              </button>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('contact')}
            className="text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
          >
            Hire Me
          </button>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <Logo />
          <MobileNavToggle
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        >
          {NAV_ITEMS.map((item, i) => {
            const isActive = activePage === item.target;
            return (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleNavClick(item.target)}
                className={`text-3xl font-black uppercase tracking-widest transition-colors ${isActive ? 'text-black' : 'text-gray-300'
                  }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-nav"
                    className="h-1 bg-black w-full mt-1"
                  />
                )}
              </motion.button>
            );
          })}
          <div className="flex w-full flex-col gap-4 mt-8">
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20"
            >
              Get Started
            </button>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
};

export default Navbar;
