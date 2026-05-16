'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { X, Send, User, Ghost, LogIn } from 'lucide-react';

export default function SlidingForm() {
  const currentUser = useStore(state => state.user);
  const isFormOpen = useStore(state => state.isFormOpen);
  const setIsFormOpen = useStore(state => state.setIsFormOpen);
  const createJob = useStore(state => state.createJob);
  const setIsAuthModalOpen = useStore(state => state.setIsAuthModalOpen);
  
  const [formType, setFormType] = useState<'anonymous' | 'user'>('anonymous'); 
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    category: 'General' as any, 
    location: '', 
    contactName: '', 
    contactEmail: '' 
  });
  
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const inputRefs: Record<string, React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>> = { 
    title: useRef<HTMLInputElement>(null), 
    description: useRef<HTMLTextAreaElement>(null), 
    location: useRef<HTMLInputElement>(null), 
    contactName: useRef<HTMLInputElement>(null), 
    contactEmail: useRef<HTMLInputElement>(null) 
  };

  useEffect(() => {
    if (currentUser) {
      setFormType('user');
      setFormData(prev => ({ ...prev, contactName: currentUser.name, contactEmail: currentUser.email }));
    }
  }, [currentUser]);

  useEffect(() => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.contactName.trim()) errors.contactName = 'Contact name is required';
    if (!formData.contactEmail.trim()) {
      errors.contactEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      errors.contactEmail = 'Invalid email address';
    }
    setValidationErrors(errors);
  }, [formData]);

  const handleBlur = (fieldName: string) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleKeyDown = (event: React.KeyboardEvent, nextKey?: string) => {
    if (event.key === 'Enter' && !event.shiftKey && nextKey && inputRefs[nextKey]?.current) {
      event.preventDefault();
      inputRefs[nextKey].current!.focus();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const allTouched = Object.keys(inputRefs).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouchedFields(allTouched);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const capitalize = (s: string) => s.replace(/\b\w/g, l => l.toUpperCase());
      await createJob({ 
        ...formData, 
        title: capitalize(formData.title), 
        contactName: capitalize(formData.contactName), 
        postedBy: formType === 'user' && currentUser ? currentUser._id : 'Anonymous' 
      });
      setIsFormOpen(false);
    } catch (err) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFormOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-md cursor-pointer" />
      <motion.div initial={{ y: 100, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 100, opacity: 0, scale: 0.95 }} className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <FormHeader user={currentUser} formType={formType} setFormType={setFormType} onClose={() => setIsFormOpen(false)} />
        {formType === 'user' && !currentUser ? (
          <LoginRequired onLogin={() => { setIsFormOpen(false); setIsAuthModalOpen(true); }} />
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[75vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Title" inputRef={inputRefs.title} value={formData.title} onChange={(v: string) => setFormData({...formData, title: v})} onBlur={() => handleBlur('title')} onKeyDown={(e: any) => handleKeyDown(e, 'description')} error={touchedFields.title ? validationErrors.title : ''} />
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-mid/30">Category</label>
                <select className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 outline-none font-bold text-xs appearance-none cursor-pointer" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                  {['General', 'Plumbing', 'Electrical', 'Painting', 'Joinery'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-mid/30">Description</label>
              <textarea ref={inputRefs.description as any} rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} onBlur={() => handleBlur('description')} onKeyDown={e => handleKeyDown(e, 'location')} className={`w-full bg-gray-50 border-0 rounded-xl px-4 py-3 outline-none font-medium text-xs resize-none ${touchedFields.description && validationErrors.description ? 'ring-1 ring-red-500/30' : ''}`} placeholder="Details..." />
              {touchedFields.description && validationErrors.description && <p className="mt-1 text-[8px] text-red-500 ml-2 font-black uppercase">{validationErrors.description}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="Location" inputRef={inputRefs.location} value={formData.location} onChange={(v: string) => setFormData({...formData, location: v})} onBlur={() => handleBlur('location')} onKeyDown={(e: any) => handleKeyDown(e, 'contactName')} error={touchedFields.location ? validationErrors.location : ''} />
              <FormInput label="Contact Name" inputRef={inputRefs.contactName} value={formData.contactName} onChange={(v: string) => setFormData({...formData, contactName: v})} onBlur={() => handleBlur('contactName')} onKeyDown={(e: any) => handleKeyDown(e, 'contactEmail')} error={touchedFields.contactName ? validationErrors.contactName : ''} />
            </div>
            <FormInput label="Contact Email" type="email" inputRef={inputRefs.contactEmail} value={formData.contactEmail} onChange={(v: string) => setFormData({...formData, contactEmail: v})} onBlur={() => handleBlur('contactEmail')} error={touchedFields.contactEmail ? validationErrors.contactEmail : ''} />
            <button type="submit" className="w-full bg-maroon text-white font-black py-4 rounded-xl hover:bg-maroon-dark transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-maroon/20 uppercase tracking-widest text-[10px]"><Send size={16} /> Publish Request</button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

function FormHeader({ user, formType, setFormType, onClose }: any) {
  return !user ? (
    <div className="flex h-10 border-b border-gray-100">
      <FormTab active={formType === 'anonymous'} onClick={() => setFormType('anonymous')} icon={<Ghost size={14} />} label="Anonymous" />
      <FormTab active={formType === 'user'} onClick={() => setFormType('user')} icon={<User size={14} />} label="Registered Users" />
      <button onClick={onClose} className="w-10 flex items-center justify-center text-gray-mid/40 hover:text-maroon cursor-pointer"><X size={18} /></button>
    </div>
  ) : (
    <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-100">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-maroon flex items-center gap-2.5"><User size={16} /> Registered User Request</h3>
      <button onClick={onClose} className="text-gray-mid/40 hover:text-maroon cursor-pointer"><X size={20} /></button>
    </div>
  );
}

function FormTab({ active, onClick, icon, label }: any) {
  return <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold transition-colors cursor-pointer ${active ? 'text-maroon bg-maroon/5' : 'text-gray-mid/40 hover:text-gray-mid'}`}>{icon} {label}</button>;
}

function FormInput({ label, inputRef, value, onChange, onBlur, onKeyDown, type = "text", error }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-mid/30">{label}</label>
      <input ref={inputRef} type={type} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur} onKeyDown={onKeyDown} className={`w-full bg-gray-50 border-0 rounded-xl px-4 py-3 outline-none font-bold text-xs ${error ? 'ring-1 ring-red-500/30' : ''}`} placeholder={`Enter ${label.toLowerCase()}...`} />
      {error && <p className="mt-1 text-[8px] text-red-500 ml-2 font-black uppercase">{error}</p>}
    </div>
  );
}

function LoginRequired({ onLogin }: any) {
  return (
    <div className="p-10 text-center space-y-5">
      <div className="w-16 h-16 bg-maroon/10 rounded-full flex items-center justify-center text-maroon mx-auto"><LogIn size={32} /></div>
      <div className="space-y-1"><h3 className="text-xl font-black uppercase tracking-tight">Login Required</h3><p className="text-gray-mid/60 text-xs">You must be logged in to post an identified request.</p></div>
      <button onClick={onLogin} className="px-6 py-2.5 bg-maroon text-white font-bold rounded-lg hover:bg-maroon-dark transition-all active:scale-95 flex items-center gap-2 mx-auto cursor-pointer text-xs"><User size={16} /> SIGN IN NOW</button>
    </div>
  );
}
