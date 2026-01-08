import React, { useState } from 'react';
import { CONTACT_STRINGS, SITE_STRINGS } from '../content';
import { saveMessage } from '../store';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await saveMessage(formData);
      setFormData({ name: '', email: '', message: '' });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center py-8 text-[#EDEDED]">
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex flex-col justify-center space-y-10 pr-0 md:pr-12">
          <div className="space-y-4">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#00FF66] border-l-2 border-[#00FF66] pl-4">
              {CONTACT_STRINGS.getInTouch}
            </span>
            <h2 className="text-5xl md:text-8xl font-serif font-black tracking-tighter leading-none">
              {CONTACT_STRINGS.title}
            </h2>
          </div>

          <div className="space-y-8">
            <div className="group">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#00FF66] mb-2">{CONTACT_STRINGS.emailLabel}</p>
              <a href={`mailto:${SITE_STRINGS.email}`} className="text-2xl md:text-3xl font-serif hover:text-[#00FF66] transition-colors border-b-2 border-[#EDEDED]/10 group-hover:border-[#00FF66] pb-2 inline-block">
                {SITE_STRINGS.email}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-[#00FF66] mb-2">{CONTACT_STRINGS.locationLabel}</p>
                <p className="text-xl font-serif font-bold">{SITE_STRINGS.location}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-[#00FF66] mb-2">{CONTACT_STRINGS.statusLabel}</p>
                <p className="text-xl font-serif text-[#00FF66] font-bold">{SITE_STRINGS.status}</p>
              </div>
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#00FF66] mb-4">{CONTACT_STRINGS.socialsLabel}</p>
              <div className="flex flex-wrap gap-6">
                {[
                  { label: 'LinkedIn', url: SITE_STRINGS.linkedinUrl },
                  { label: 'GitHub', url: SITE_STRINGS.githubUrl },
                  { label: 'X', url: SITE_STRINGS.twitterUrl },
                  { label: 'Instagram', url: SITE_STRINGS.instagramUrl }
                ].map(social => (
                  <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold tracking-widest uppercase hover:text-[#00FF66] transition-colors border-b-2 border-transparent hover:border-[#00FF66]">
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#EDEDED]/5 backdrop-blur-xl border border-[#EDEDED]/10 p-10 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FF66]/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#00FF66]/20 transition-colors duration-1000"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-6">
              <div className="relative group">
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-transparent border-b-2 border-[#EDEDED]/20 py-4 font-serif text-xl focus:outline-none focus:border-[#00FF66] transition-all peer"
                  placeholder=" "
                />
                <label className="absolute left-0 top-4 text-[#EDEDED]/60 text-sm pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#00FF66] peer-focus:font-black peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#00FF66] peer-[:not(:placeholder-shown)]:opacity-100">
                  {CONTACT_STRINGS.formName}
                </label>
              </div>

              <div className="relative group">
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-transparent border-b-2 border-[#EDEDED]/20 py-4 font-serif text-xl focus:outline-none focus:border-[#00FF66] transition-all peer"
                  placeholder=" "
                />
                <label className="absolute left-0 top-4 text-[#EDEDED]/60 text-sm pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#00FF66] peer-focus:font-black peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#00FF66] peer-[:not(:placeholder-shown)]:opacity-100">
                  {CONTACT_STRINGS.formEmail}
                </label>
              </div>

              <div className="relative group">
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-transparent border-b-2 border-[#EDEDED]/20 py-4 font-serif text-xl focus:outline-none focus:border-[#00FF66] transition-all resize-none peer"
                  placeholder=" "
                />
                <label className="absolute left-0 top-4 text-[#EDEDED]/60 text-sm pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#00FF66] peer-focus:font-black peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[#00FF66] peer-[:not(:placeholder-shown)]:opacity-100">
                  {CONTACT_STRINGS.formMessage}
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={status === 'sending'}
              className="w-full bg-[#00FF66] text-[#0E0E0E] py-5 rounded-2xl font-black text-xs tracking-[0.4em] uppercase hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_20px_40px_rgba(0,255,102,0.2)]"
            >
              {status === 'sending' ? CONTACT_STRINGS.formSending : CONTACT_STRINGS.formSend}
            </button>

            {status === 'success' && (
              <p className="text-center text-[10px] font-black uppercase tracking-widest text-[#00FF66] animate-pulse">
                {CONTACT_STRINGS.successMsg}
              </p>
            )}
            {status === 'error' && (
              <p className="text-center text-[10px] font-black uppercase tracking-widest text-[#FF3333] animate-pulse">
                {CONTACT_STRINGS.errorMsg}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;