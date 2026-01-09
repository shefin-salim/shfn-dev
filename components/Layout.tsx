
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SITE_STRINGS, NAVIGATION } from '../content';
import StarryBackground from './StarryBackground';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="relative min-h-screen bg-[#0E0E0E] text-[#EDEDED]">
      <StarryBackground />
      
      <div className="relative z-10 min-h-screen flex flex-col max-w-6xl mx-auto px-4 sm:px-8 bg-transparent">
        <header className="pt-10 pb-6 border-b border-[#EDEDED]/20 flex flex-col items-center gap-6">
          <div className="text-center group">
            <Link 
              to="/" 
              className="text-3xl md:text-5xl font-russo tracking-widest transition-all duration-500 block relative text-[#EDEDED] hover:text-[#00FF66] hover:-translate-y-1 hover:drop-shadow-[0_0_20px_rgba(0,255,102,0.9)]"
            >
              {SITE_STRINGS.name}
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-[#00FF66] transition-all duration-500 group-hover:w-full blur-[1px]"></span>
            </Link>
          </div>
          
          <nav className="flex items-center justify-center gap-x-4 md:gap-x-10">
            {NAVIGATION.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative group px-1 py-1 text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-300 ${
                  isActive(item.path) 
                    ? 'text-[#00FF66]' 
                    : 'text-[#EDEDED] hover:text-[#00FF66]'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                
                <span 
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-[#00FF66] transition-all duration-500 ease-out shadow-[0_0_8px_rgba(0,255,102,0.8)] ${
                    isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-grow py-6">
          <div key={location.pathname} className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
            {children}
          </div>
        </main>

        <footer className="py-8 border-t border-[#EDEDED]/20 flex flex-col sm:flex-row justify-between text-[9px] font-bold tracking-[0.2em] uppercase gap-6 text-[#EDEDED]">
          <div>&copy; 2025 {SITE_STRINGS.name} / {SITE_STRINGS.footerCopy}</div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link to="/admin" className="hover:text-[#00FF66] transition-colors">ADMIN</Link>
            <a href={SITE_STRINGS.linkedinUrl} className="hover:text-[#00FF66] transition-colors" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
            <a href={SITE_STRINGS.githubUrl} className="hover:text-[#00FF66] transition-colors" target="_blank" rel="noopener noreferrer">GITHUB</a>
            <a href={SITE_STRINGS.twitterUrl} className="hover:text-[#00FF66] transition-colors" target="_blank" rel="noopener noreferrer">X</a>
            <a href={SITE_STRINGS.instagramUrl} className="hover:text-[#00FF66] transition-colors" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
