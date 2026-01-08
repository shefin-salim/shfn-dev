import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPosts, addComment } from '../store';
import { BlogPost, Comment } from '../types';
import { BLOG_STRINGS } from '../content';

const PostDetail: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPost = async () => {
    setIsLoading(true);
    const allPosts = await getPosts();
    const found = allPosts.find(p => p.id === id);
    if (found) setPost(found);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentName.trim() || !commentText.trim()) return;

    setIsSubmitting(true);
    const newComment: Comment = {
      id: Date.now().toString(),
      author: commentName,
      text: commentText,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const success = await addComment(id, newComment);
    if (success) {
      setCommentName('');
      setCommentText('');
      await fetchPost();
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="py-40 text-center text-[#00FF66] text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
        Opening Data Stream...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-20 text-center text-[#EDEDED]">
        <h2 className="text-2xl font-serif mb-4">{BLOG_STRINGS.postNotFound}</h2>
        <Link to="/blog" className="text-[#00FF66] font-bold underline uppercase tracking-widest text-xs">{BLOG_STRINGS.backToBlog}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700 text-[#EDEDED]">
      <header className="mb-10">
        <Link to="/blog" className="text-[10px] font-black tracking-[0.4em] uppercase text-[#00FF66] mb-8 block hover:text-white transition-colors">
          &larr; {BLOG_STRINGS.backToBlog}
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 mb-6">
          <p className="text-xs font-black tracking-widest uppercase text-[#00FF66]">{post.date}</p>
          <div className="h-[1px] flex-grow bg-[#EDEDED]/10 hidden md:block mx-4"></div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-[#EDEDED]/40">Ref: {post.id.substring(0, 6)}</p>
        </div>
        <h1 className="text-4xl md:text-7xl font-serif font-black leading-tight tracking-tighter mb-8">{post.title}</h1>
      </header>

      <div className="mb-12 border border-[#EDEDED]/10 p-2 rounded-2xl bg-[#EDEDED]/5">
        {post.image ? (
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-auto object-cover max-h-[600px] rounded-xl"
          />
        ) : (
          <div className="w-full h-[300px] flex items-center justify-center">
             <span className="text-[12px] font-mono tracking-[0.5em] text-[#EDEDED]/30">{BLOG_STRINGS.noImagePlaceholder}</span>
          </div>
        )}
      </div>
      
      <div className="prose prose-invert prose-xl max-w-none font-serif text-2xl leading-[1.6] mb-20">
        {post.content.split('\n').map((para, i) => (
          para.trim() && <p key={i} className="mb-10 text-justify hyphens-auto">{para}</p>
        ))}
      </div>

      <div className="pt-10 border-t border-[#00FF66] mb-20">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#00FF66] mb-2">{BLOG_STRINGS.by}</p>
        <div className="font-serif italic text-3xl font-black">{BLOG_STRINGS.authorName}</div>
      </div>

      <section className="mb-20">
        <h3 className="text-xs font-black tracking-[0.4em] uppercase text-[#00FF66] mb-10 border-b border-[#EDEDED]/10 pb-4">{BLOG_STRINGS.commentsHeading}</h3>
        
        <div className="space-y-10 mb-12">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment.id} className="animate-in fade-in duration-500">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-sm font-black uppercase tracking-widest text-[#EDEDED]">{comment.author}</span>
                  <span className="text-[10px] font-bold tracking-widest text-[#EDEDED]/40 uppercase">{comment.date}</span>
                </div>
                <div className="border border-[#EDEDED]/10 rounded-2xl p-6 bg-[#EDEDED]/5">
                  <p className="text-lg font-serif italic text-[#EDEDED] leading-relaxed">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="italic text-[#EDEDED]/60 font-serif">{BLOG_STRINGS.noComments}</p>
          )}
        </div>

        <div className="bg-[#EDEDED]/5 border border-[#EDEDED]/10 rounded-2xl p-8">
          <h4 className="text-xl font-serif italic mb-6 text-[#EDEDED]">{BLOG_STRINGS.writeComment}</h4>
          <form onSubmit={handleCommentSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-[#EDEDED]/50">{BLOG_STRINGS.labelName}</label>
              <input 
                type="text"
                required
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                placeholder={BLOG_STRINGS.placeholderName}
                className="w-full border border-[#EDEDED]/10 rounded-xl p-4 text-sm text-[#EDEDED] bg-transparent focus:outline-none focus:border-[#00FF66] transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-[#EDEDED]/50">{BLOG_STRINGS.labelMessage}</label>
              <textarea 
                required
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={BLOG_STRINGS.placeholderMessage}
                className="w-full border border-[#EDEDED]/10 rounded-xl p-4 text-lg font-serif italic text-[#EDEDED] bg-transparent focus:outline-none focus:border-[#00FF66] transition-all resize-none"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#00FF66] text-[#0E0E0E] px-10 py-4 rounded-xl text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white transition-all shadow-[0_0_15px_rgba(0,255,102,0.2)] active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : BLOG_STRINGS.postComment}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default PostDetail;