import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../store';
import { BlogPost } from '../types';
import { HOME_STRINGS, SITE_STRINGS } from '../content';

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const name = HOME_STRINGS.loadingName;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1;
      });
    }, 15);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0E0E0E] flex flex-col items-center justify-center p-8 transition-opacity duration-700">
      <div className="w-full max-w-xs">
        <div className="flex justify-between mb-2">
          {name.split('').map((char, i) => {
            const charProgress = (i + 1) * (100 / name.length);
            return (
              <span 
                key={i} 
                className={`text-2xl font-serif font-black tracking-widest transition-colors duration-300 ${
                  progress >= charProgress ? 'text-[#00FF66]' : 'text-[#EDEDED]/20'
                }`}
              >
                {char}
              </span>
            );
          })}
        </div>
        <div className="h-[2px] w-full bg-[#EDEDED]/10 overflow-hidden">
          <div 
            className="h-full bg-[#00FF66] transition-all duration-100 ease-out shadow-[0_0_15px_#00FF66]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 flex justify-between text-[8px] font-black tracking-[0.3em] uppercase text-[#00FF66]">
          <span>{HOME_STRINGS.loadingLabel}</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getPosts();
      setLatestPosts(allPosts.slice(0, 3));
    };
    fetchPosts();
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const scrollToArchives = () => {
    const element = document.getElementById('latest-archives');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-1000 flex flex-col items-center text-center">
      <section className="max-w-4xl pt-4 pb-12 md:pt-8 md:pb-16 relative">
        <div className="mb-4 inline-block">
          <span className="text-[9px] font-black tracking-[0.5em] uppercase text-[#00FF66] border border-[#00FF66] px-4 py-1.5 rounded-full bg-[#00FF66]/10">
            {HOME_STRINGS.badge}
          </span>
        </div>
        
        <h2 className="text-4xl md:text-7xl font-serif leading-tight mb-8 tracking-tighter flex flex-col items-center">
          <div className="mb-1 font-serif italic text-2xl md:text-4xl text-[#EDEDED]">
            {HOME_STRINGS.heroTitlePart1}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-0 md:gap-4">
            <span className="italic text-[#00FF66]">{HOME_STRINGS.heroTitlePart2}</span>
            <span className="font-serif text-[#EDEDED]">{HOME_STRINGS.heroTitlePart3}</span>
          </div>
        </h2>
        
        <div className="w-24 h-[2px] bg-[#00FF66] mx-auto mb-8 shadow-[0_0_12px_#00FF66]"></div>
        
        <p className="text-lg md:text-xl leading-relaxed font-light max-w-2xl mx-auto mb-12 italic font-serif text-[#EDEDED]">
          {HOME_STRINGS.intro}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
          <Link 
            to="/blog" 
            className="px-12 py-4 bg-[#00FF66] text-[#0E0E0E] text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white transition-all shadow-[0_10px_40px_rgba(0,255,102,0.3)] rounded-sm"
          >
            {HOME_STRINGS.blogButton}
          </Link>
          <Link 
            to="/about" 
            className="px-12 py-4 border-2 border-[#EDEDED] text-[#EDEDED] text-[10px] font-black tracking-[0.3em] uppercase hover:border-[#00FF66] hover:text-[#00FF66] transition-all rounded-sm backdrop-blur-sm"
          >
            {HOME_STRINGS.aboutButton}
          </Link>
        </div>

        <button 
          onClick={scrollToArchives}
          className="group flex flex-col items-center gap-2 mx-auto animate-bounce hover:scale-110 transition-transform"
        >
          <span className="text-[8px] font-black tracking-[0.6em] uppercase text-[#EDEDED]">Archive</span>
          <div className="w-[2px] h-12 bg-gradient-to-b from-[#00FF66] to-transparent"></div>
        </button>
      </section>

      <section id="latest-archives" className="w-full border-y border-[#EDEDED]/20 py-16 bg-[#EDEDED]/5 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6">
          <h3 
            onClick={scrollToArchives}
            className="text-[9px] font-black tracking-[0.5em] uppercase mb-12 text-[#00FF66] cursor-none hover:text-[#EDEDED] transition-colors inline-block"
          >
            {HOME_STRINGS.archiveHeading}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-[#EDEDED]">
            {latestPosts.length > 0 ? latestPosts.map(post => (
              <div key={post.id} className="text-left group relative">
                <p className="text-[9px] font-black mb-3 uppercase tracking-[0.2em] text-[#00FF66]">{post.date}</p>
                <Link to={`/blog/${post.id}`}>
                  <h4 className="font-serif text-2xl group-hover:text-[#00FF66] transition-all duration-500 leading-tight mb-4">{post.title}</h4>
                </Link>
                <p className="text-sm font-light line-clamp-2 mb-6 leading-relaxed italic font-serif text-[#EDEDED]">{post.excerpt}</p>
                <Link to={`/blog/${post.id}`} className="text-[9px] font-black uppercase tracking-[0.3em] text-[#00FF66] group-hover:pl-2 transition-all duration-300">
                  Entry Log &rarr;
                </Link>
              </div>
            )) : (
              <div className="col-span-3 py-10 opacity-60 italic font-serif">Cloud Archives Synchronizing...</div>
            )}
          </div>
        </div>
      </section>

      <div className="py-24 opacity-[0.15] overflow-hidden whitespace-nowrap">
        <span className="text-[14vw] font-russo tracking-tighter leading-none select-none uppercase text-[#EDEDED]">{SITE_STRINGS.name}</span>
      </div>
    </div>
  );
};

export default Home;