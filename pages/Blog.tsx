import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../store';
import { BlogPost } from '../types';
import { BLOG_STRINGS } from '../content';

const ImagePlaceholder: React.FC = () => (
  <div className="w-full aspect-square bg-[#EDEDED]/5 border border-[#EDEDED]/10 rounded-xl flex items-center justify-center">
    <span className="text-[10px] font-mono tracking-widest text-[#EDEDED]/40 uppercase">
      {BLOG_STRINGS.noImagePlaceholder}
    </span>
  </div>
);

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const data = await getPosts();
      setPosts(data);
      setIsLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-5xl md:text-6xl font-serif font-black mb-4 tracking-tighter uppercase text-[#EDEDED]">{BLOG_STRINGS.title}</h2>
        <div className="w-24 h-[3px] bg-[#00FF66] shadow-[0_0_10px_#00FF66]"></div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-[#00FF66] text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
          Retrieving Archives...
        </div>
      ) : (
        <div className="divide-y divide-[#EDEDED]/10">
          {posts.length > 0 ? posts.map((post) => (
            <article key={post.id} className="py-12 group">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                <div className="md:col-span-3">
                  <p className="text-xs font-black tracking-[0.3em] uppercase text-[#00FF66] mb-4">
                    {post.date}
                  </p>
                  <div className="hidden md:block border border-[#EDEDED]/10 p-1 rounded-2xl bg-[#EDEDED]/5">
                    {post.image ? (
                       <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-700 rounded-xl"
                        />
                    ) : (
                      <ImagePlaceholder />
                    )}
                  </div>
                </div>
                <div className="md:col-span-9 text-[#EDEDED]">
                  <Link to={`/blog/${post.id}`} className="block mb-6">
                    <h3 className="text-4xl md:text-5xl font-serif font-bold group-hover:text-[#00FF66] transition-colors leading-[1.1] tracking-tight">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-lg leading-relaxed font-light max-w-2xl mb-8 italic font-serif">
                    {post.excerpt}
                  </p>
                  <Link 
                    to={`/blog/${post.id}`} 
                    className="inline-block text-[10px] font-black tracking-[0.4em] uppercase text-[#00FF66] border-b-2 border-[#00FF66]/30 pb-2 hover:border-[#00FF66] transition-all"
                  >
                    {BLOG_STRINGS.readMore} &rarr;
                  </Link>
                </div>
              </div>
            </article>
          )) : (
            <div className="py-40 text-center text-[#EDEDED]/30 font-serif italic">The digital library is currently empty.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;