import React from 'react';
import { ABOUT_STRINGS } from '../content';

const About: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto text-[#EDEDED]">
      <div className="mb-16">
        <h2 className="text-5xl md:text-6xl font-serif font-black mb-10 tracking-tighter uppercase border-b border-[#EDEDED]/10 pb-6">
          {ABOUT_STRINGS.title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-7 space-y-8 text-xl leading-relaxed font-light">
            <p className="first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-[#00FF66] font-serif">
              {ABOUT_STRINGS.bioParagraph1}
            </p>
            <p className="font-serif italic text-[#EDEDED]">
              {ABOUT_STRINGS.bioParagraph2}
            </p>
          </div>

          <div className="md:col-span-5 space-y-8">
            <div className="border border-[#EDEDED]/10 p-2 rounded-2xl bg-[#EDEDED]/5 overflow-hidden group">
              <img 
                src="https://i.ibb.co/0VsTScJm/photo-2026-01-07-11-14-03.jpg" 
                alt="Mohammed Shefin" 
                className="w-full h-auto rounded-xl grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out"
              />
              <div className="mt-3 text-[9px] font-black tracking-[0.3em] uppercase text-[#EDEDED]/40 text-center pb-1">
                {ABOUT_STRINGS.portraitLabel}
              </div>
            </div>

            <div className="bg-[#EDEDED]/5 border border-[#EDEDED]/10 p-8 rounded-2xl">
              <h3 className="text-xs font-bold tracking-[0.3em] uppercase mb-8 text-[#00FF66] border-b border-[#00FF66]/20 pb-2">{ABOUT_STRINGS.rulesHeading}</h3>
              <ul className="space-y-6 text-[10px] font-black tracking-[0.2em] uppercase">
                {ABOUT_STRINGS.rules.map((rule, idx) => (
                  <li key={idx} className="flex flex-col gap-2">
                    <span className="w-12 h-[2.5px] bg-[#00FF66]"></span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 p-12 bg-[#EDEDED]/5 border border-[#00FF66]/40 rounded-2xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF66]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <h3 className="text-3xl font-serif italic mb-6 text-[#00FF66]">{ABOUT_STRINGS.whatIDoHeading}</h3>
        <p className="text-lg font-light leading-relaxed max-w-2xl text-[#EDEDED]">
          {ABOUT_STRINGS.whatIDoContent}
        </p>
      </div>
    </div>
  );
};

export default About;
