
import React, { useState, useEffect, useRef } from 'react';
import { getPosts, savePost, deletePost, getMessages, deleteMessage, login } from '../store';
import { BlogPost, ContactMessage } from '../types';
import { ADMIN_STRINGS } from '../content';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'messages'>('posts');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('shfn_token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [p, m] = await Promise.all([getPosts(), getMessages()]);
      setPosts(p);
      setMessages(m);
    } catch (e) {
      console.error("Sync error", e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) refreshData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(username, password);
    if (result.success) {
      setIsAuthenticated(true);
    } else {
      setFeedback({ message: ADMIN_STRINGS.loginFailed, type: 'error' });
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('shfn_token');
    setIsAuthenticated(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFeedback({ message: 'Limit 2MB.', type: 'error' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingPost(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost?.title && editingPost?.content) {
      setIsLoading(true);
      const postToSave: BlogPost = {
        id: editingPost.id || `temp_${Date.now()}`,
        title: editingPost.title,
        content: editingPost.content,
        excerpt: editingPost.excerpt || editingPost.content.substring(0, 120).replace(/\n/g, ' ') + '...',
        date: editingPost.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        image: editingPost.image || '',
        comments: editingPost.comments || []
      };
      
      const success = await savePost(postToSave);
      if (success) {
        await refreshData();
        setEditingPost(null);
        setFeedback({ message: ADMIN_STRINGS.postSecured, type: 'success' });
      } else {
        setFeedback({ message: 'Cloud Transmission Failed. Ensure server.js is running.', type: 'error' });
      }
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Erase this post from the cloud?')) {
      const success = await deletePost(id);
      if (success) {
        await refreshData();
        setFeedback({ message: 'Data purged.', type: 'success' });
      }
    }
  };

  const handleDeleteMsg = async (id: string) => {
    if (window.confirm('Delete this message?')) {
      const success = await deleteMessage(id);
      if (success) {
        await refreshData();
        setFeedback({ message: ADMIN_STRINGS.msgDeleted, type: 'success' });
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-24 animate-in fade-in duration-700">
        <div className="border border-[#00FF66]/20 rounded-3xl p-10 bg-[#EDEDED]/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FF66]/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
          <h2 className="text-4xl font-russo mb-2 tracking-tighter text-[#EDEDED]">{ADMIN_STRINGS.loginHeading}</h2>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-8 text-[#00FF66]">{ADMIN_STRINGS.loginSubheading}</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-[#EDEDED]/40 mb-2">Username</label>
              <input 
                type="text" 
                placeholder="Ident..." 
                className="w-full border border-[#EDEDED]/10 rounded-xl p-4 font-mono text-sm text-[#EDEDED] bg-[#0E0E0E] focus:outline-none focus:border-[#00FF66] transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-[#EDEDED]/40 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="Access Key..." 
                className="w-full border border-[#EDEDED]/10 rounded-xl p-4 font-mono text-sm text-[#EDEDED] bg-[#0E0E0E] focus:outline-none focus:border-[#00FF66] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-[#00FF66] text-[#0E0E0E] py-4 rounded-xl font-black text-xs tracking-[0.2em] uppercase hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,102,0.2)]">
              {isLoading ? 'Connecting...' : ADMIN_STRINGS.loginButton}
            </button>
          </form>
          {feedback?.type === 'error' && <p className="mt-6 text-[10px] font-bold text-[#FF3333] uppercase tracking-widest">{feedback.message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 relative text-[#EDEDED]">
      {feedback && (
        <div className={`fixed bottom-8 right-8 z-50 p-4 border rounded-xl font-bold text-[10px] tracking-widest uppercase shadow-2xl ${feedback.type === 'success' ? 'bg-[#00FF66] text-[#0E0E0E]' : 'bg-[#FF3333] text-white'}`}>
          {feedback.message}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-[#EDEDED]/10 pb-8 gap-6">
        <div>
          <h2 className="text-6xl font-russo font-black tracking-tighter uppercase">{ADMIN_STRINGS.consoleHeading}</h2>
          <div className="flex gap-4 mt-4">
            <button 
              onClick={() => setActiveTab('posts')}
              className={`text-[10px] font-black uppercase tracking-[0.2em] pb-2 border-b-2 transition-all ${activeTab === 'posts' ? 'text-[#00FF66] border-[#00FF66]' : 'text-[#EDEDED] opacity-40 border-transparent hover:opacity-100'}`}
            >
              {ADMIN_STRINGS.tabPosts} ({posts.length})
            </button>
            <button 
              onClick={() => setActiveTab('messages')}
              className={`text-[10px] font-black uppercase tracking-[0.2em] pb-2 border-b-2 transition-all ${activeTab === 'messages' ? 'text-[#00FF66] border-[#00FF66]' : 'text-[#EDEDED] opacity-40 border-transparent hover:opacity-100'}`}
            >
              {ADMIN_STRINGS.tabMessages} ({messages.length})
            </button>
          </div>
        </div>
        
        <div className="flex gap-4">
          {activeTab === 'posts' && (
            <button 
              onClick={() => setEditingPost({ title: '', content: '', excerpt: '' })}
              className="bg-[#00FF66] text-[#0E0E0E] px-8 py-3 rounded-full text-[10px] font-black tracking-[0.2em] uppercase hover:bg-white transition-all shadow-lg"
            >
              {ADMIN_STRINGS.newEntry}
            </button>
          )}
          <button onClick={handleLogout} className="border border-[#EDEDED]/10 text-[#EDEDED] opacity-50 hover:opacity-100 hover:text-[#FF3333] hover:border-[#FF3333]/30 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all">
            Logout
          </button>
        </div>
      </div>

      {isLoading && !posts.length && <div className="py-20 text-center text-[#00FF66] text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Establishing Cloud Connection...</div>}

      {activeTab === 'posts' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-3">
            {posts.map(post => (
              <div 
                key={post.id} 
                className={`p-5 border rounded-2xl transition-all cursor-pointer group flex justify-between items-start ${editingPost?.id === post.id ? 'border-[#00FF66] bg-[#EDEDED]/5' : 'border-[#EDEDED]/10 bg-[#EDEDED]/5 hover:border-[#00FF66]'}`}
                onClick={() => setEditingPost(post)}
              >
                <div className="flex-grow pr-4">
                  <p className="font-serif text-lg leading-tight mb-1">{post.title}</p>
                  <p className="text-[9px] font-black opacity-30 uppercase tracking-widest">{post.date}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}
                  className="text-[#FF3333] opacity-0 group-hover:opacity-100 p-2 hover:bg-[#FF3333]/10 rounded-lg transition-all"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-8">
            {editingPost ? (
              <form onSubmit={handleSave} className="space-y-8 bg-[#EDEDED]/5 border border-[#EDEDED]/10 p-10 rounded-2xl shadow-xl">
                <input 
                  value={editingPost.title || ''}
                  onChange={e => setEditingPost({...editingPost, title: e.target.value})}
                  placeholder="Post Title..."
                  className="w-full border-b border-[#EDEDED]/10 pb-4 font-serif text-3xl text-[#EDEDED] bg-transparent focus:outline-none focus:border-[#00FF66] transition-all"
                />
                
                <div className="space-y-4">
                   <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    ref={fileInputRef} 
                   />
                   {editingPost.image ? (
                     <div className="relative w-48 group">
                        <img src={editingPost.image} className="w-full h-auto rounded-xl border border-[#EDEDED]/10 shadow-lg" alt="Preview" />
                        <button 
                          type="button"
                          onClick={() => setEditingPost({...editingPost, image: undefined})}
                          className="absolute -top-2 -right-2 bg-[#FF3333] text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] shadow-lg"
                        >
                          &times;
                        </button>
                     </div>
                   ) : (
                     <button 
                       type="button"
                       onClick={() => fileInputRef.current?.click()}
                       className="border border-dashed border-[#EDEDED]/20 rounded-xl px-6 py-4 text-[10px] font-black tracking-widest uppercase text-[#EDEDED] opacity-60 hover:border-[#00FF66] hover:text-[#00FF66] transition-all"
                     >
                       {ADMIN_STRINGS.uploadImage}
                     </button>
                   )}
                </div>

                <textarea 
                  rows={15}
                  value={editingPost.content || ''}
                  onChange={e => setEditingPost({...editingPost, content: e.target.value})}
                  placeholder="Article Content..."
                  className="w-full border border-[#EDEDED]/10 rounded-xl p-6 font-serif text-xl text-[#EDEDED] bg-transparent focus:outline-none focus:border-[#00FF66] transition-all min-h-[400px]"
                />

                <div className="flex gap-4">
                  <button type="submit" disabled={isLoading} className="flex-grow bg-[#00FF66] text-[#0E0E0E] py-5 rounded-xl font-black tracking-[0.3em] uppercase text-xs hover:bg-white transition-all shadow-md disabled:opacity-50">
                    {isLoading ? 'Transmitting...' : ADMIN_STRINGS.saveButton}
                  </button>
                  <button type="button" onClick={() => setEditingPost(null)} className="px-12 border border-[#EDEDED]/10 rounded-xl text-xs font-black uppercase tracking-widest hover:border-[#00FF66] text-[#EDEDED] opacity-60">
                    {ADMIN_STRINGS.discardButton}
                  </button>
                </div>
              </form>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-[#EDEDED]/10 rounded-2xl text-[#EDEDED] opacity-20">
                <p className="text-[10px] font-black tracking-[0.2em] uppercase">{ADMIN_STRINGS.selectEntry}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#EDEDED]/5 border border-[#EDEDED]/10 rounded-2xl shadow-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#EDEDED]/10 text-[10px] font-black uppercase tracking-[0.2em] text-[#00FF66]">
                <th className="p-6">Date</th>
                <th className="p-6">Sender</th>
                <th className="p-6">Contact</th>
                <th className="p-6">Transmission</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEDED]/5 text-[#EDEDED]">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center italic opacity-20 font-serif">Cloud storage empty. No transmissions found.</td>
                </tr>
              ) : (
                messages.map(msg => (
                  <tr key={msg.id} className="hover:bg-[#EDEDED]/5 transition-colors group">
                    <td className="p-6 text-[10px] font-mono opacity-50">{msg.date}</td>
                    <td className="p-6 font-serif text-lg">{msg.name}</td>
                    <td className="p-6">
                      <a href={`mailto:${msg.email}`} className="text-[#00FF66] hover:underline transition-all text-xs font-bold tracking-widest">{msg.email}</a>
                    </td>
                    <td className="p-6 max-w-xs">
                      <p className="text-sm opacity-70 line-clamp-2 hover:line-clamp-none transition-all">{msg.message}</p>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => handleDeleteMsg(msg.id)}
                        className="text-[#FF3333] hover:bg-[#FF3333]/10 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Purge
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
