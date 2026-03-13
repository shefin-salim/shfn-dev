import React, { useEffect, useState } from 'react';
import { PORTFOLIO_STRINGS } from '../content';
import { getProjects, getProfile } from '../store';
import { Project, Profile } from '../types';

const Portfolio: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prjData, profData] = await Promise.all([getProjects(), getProfile()]);
                setProjects(prjData);
                setProfile(profData);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="animate-in fade-in duration-700 max-w-4xl mx-auto text-[#EDEDED]">
            <div className="mb-16">
                <h2 className="text-5xl md:text-6xl font-serif font-black mb-6 tracking-tighter uppercase border-b border-[#EDEDED]/10 pb-6">
                    {PORTFOLIO_STRINGS.title}
                </h2>
                <p className="text-xl leading-relaxed font-light font-serif italic text-[#EDEDED]/70 mb-10">
                    {PORTFOLIO_STRINGS.subtitle}
                </p>

                {isLoading ? (
                    <div className="py-20 text-center text-[#00FF66] text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
                        Loading Projects...
                    </div>
                ) : projects.length === 0 ? (
                    <div className="py-20 text-center border border-dashed border-[#EDEDED]/10 rounded-2xl text-[#EDEDED] opacity-30">
                        <p className="text-[10px] font-black tracking-[0.2em] uppercase">No projects found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-[#EDEDED]/5 border border-[#EDEDED]/10 rounded-2xl overflow-hidden group hover:border-[#00FF66] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full shadow-lg hover:shadow-[0_0_30px_rgba(0,255,102,0.15)] relative">

                                {project.imageUrl && (
                                    <div className="relative h-48 sm:h-56 overflow-hidden border-b border-[#EDEDED]/10">
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] to-transparent opacity-80 decoration-0"></div>
                                    </div>
                                )}

                                <div className="p-6 flex flex-col flex-grow relative z-10 bg-[#0E0E0E]/50 backdrop-blur-sm">
                                    <h3 className="text-2xl font-serif font-black mb-3 text-[#EDEDED] flex-shrink-0 group-hover:text-[#00FF66] transition-colors">{project.title}</h3>
                                    <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
                                        {project.techStack?.split(',').map((tech, idx) => (
                                            <span key={idx} className="text-[9px] font-black tracking-widest uppercase border border-[#00FF66]/30 text-[#00FF66] px-2 py-1 rounded-md bg-[#00FF66]/5">
                                                {tech.trim()}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-sm font-light text-[#EDEDED]/60 mb-8 line-clamp-3">
                                        {project.description}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-[#EDEDED]/10">
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-[#EDEDED] hover:text-[#00FF66] transition-colors"
                                        >
                                            {PORTFOLIO_STRINGS.viewProject}
                                            <span className="text-[#00FF66]">&rarr;</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {profile && (
              <div className="mt-24 pt-16 border-t border-[#EDEDED]/10">
                <h2 className="text-5xl md:text-6xl font-serif font-black mb-10 tracking-tighter uppercase border-b border-[#EDEDED]/10 pb-6">
                  About Me
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start mb-16">
                  <div className="md:col-span-7 space-y-8 text-xl leading-relaxed font-light">
                    <p className="first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-[#00FF66] font-serif whitespace-pre-line">
                      {profile.bioParagraph1}
                    </p>
                    <p className="font-serif italic text-[#EDEDED] whitespace-pre-line">
                      {profile.bioParagraph2}
                    </p>
                  </div>

                  <div className="md:col-span-5 space-y-8">
                    {profile.photoUrl && (
                      <div className="border border-[#EDEDED]/10 p-2 rounded-2xl bg-[#EDEDED]/5 overflow-hidden group">
                        <img 
                          src={profile.photoUrl} 
                          alt={profile.name} 
                          className="w-full h-auto rounded-xl grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out"
                        />
                        <div className="mt-3 text-[9px] font-black tracking-[0.3em] uppercase text-[#EDEDED]/40 text-center pb-1">
                          {profile.photoLabel}
                        </div>
                      </div>
                    )}

                    {profile.stacks && (
                      <div className="bg-[#EDEDED]/5 border border-[#EDEDED]/10 p-8 rounded-2xl">
                        <h3 className="text-xs font-bold tracking-[0.3em] uppercase mb-8 text-[#00FF66] border-b border-[#00FF66]/20 pb-2">MY STACKS</h3>
                        <ul className="space-y-6 text-[10px] font-black tracking-[0.2em] uppercase">
                          {profile.stacks.split('\n').filter(s => s.trim() !== '').map((rule, idx) => (
                            <li key={idx} className="flex flex-col gap-2">
                              <span className="w-12 h-[2.5px] bg-[#00FF66]"></span>
                              <span>{rule.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {profile.whatIDoHeading && (
                  <div className="p-12 bg-[#EDEDED]/5 border border-[#00FF66]/40 rounded-2xl relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF66]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <h3 className="text-3xl font-serif italic mb-6 text-[#00FF66]">{profile.whatIDoHeading}</h3>
                    <p className="text-lg font-light leading-relaxed max-w-2xl text-[#EDEDED] whitespace-pre-line">
                      {profile.whatIDoContent}
                    </p>
                  </div>
                )}
              </div>
            )}
        </div>
    );
};

export default Portfolio;
