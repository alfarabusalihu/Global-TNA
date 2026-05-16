'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from "@/store/useStore";
import { User, X, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal() {
  const isAuthModalOpen = useStore((state) => state.isAuthModalOpen);
  const setIsAuthModalOpen = useStore((state) => state.setIsAuthModalOpen);
  const login = useStore((state) => state.login);
  const register = useStore((state) => state.register);
  const isLoading = useStore((state) => state.isLoading);
  const authError = useStore((state) => state.error);

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authData, setAuthData] = useState({ name: '', email: '', password: '' });
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const errors: Record<string, string> = {};
    if (authMode === 'register' && !authData.name.trim()) errors.name = 'Full name is required';
    if (!authData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(authData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!authData.password || authData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setValidationErrors(errors);
  }, [authData, authMode]);

  const handleBlur = (fieldName: string) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouchedFields({ name: true, email: true, password: true });
    
    if (Object.keys(validationErrors).length > 0) return;

    try {
      if (authMode === 'login') {
        await login({ email: authData.email, password: authData.password });
      } else {
        const capitalizedName = authData.name.replace(/\b\w/g, letter => letter.toUpperCase());
        await register({ ...authData, name: capitalizedName });
      }
      setIsAuthModalOpen(false);
    } catch (err) {}
  };

  const handleFieldKeyDown = (event: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement | null>) => {
    if (event.key === 'Enter' && nextRef.current) {
      event.preventDefault();
      nextRef.current.focus();
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAuthModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer" />
          <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-2xl border border-gray-100">
            <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-5 right-5 text-gray-mid/40 hover:text-maroon cursor-pointer"><X size={20} /></button>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-maroon/5 rounded-xl flex items-center justify-center text-maroon mx-auto mb-4"><User size={24} /></div>
              <h2 className="text-2xl font-black uppercase tracking-tight">{authMode === 'login' ? 'Welcome' : 'Join Board'}</h2>
            </div>
            {authError && <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-[10px] font-bold"><AlertCircle size={14} className="mt-0.5" /><p>{authError}</p></div>}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && <AuthInput inputRef={nameInputRef} placeholder="Full Name" value={authData.name} onChange={(value: string) => setAuthData({...authData, name: value})} onBlur={() => handleBlur('name')} onKeyDown={event => handleFieldKeyDown(event, emailInputRef)} error={touchedFields.name ? validationErrors.name : ''} />}
              <AuthInput inputRef={emailInputRef} type="email" placeholder="Email" value={authData.email} onChange={(value: string) => setAuthData({...authData, email: value})} onBlur={() => handleBlur('email')} onKeyDown={event => handleFieldKeyDown(event, passwordInputRef)} error={touchedFields.email ? validationErrors.email : ''} />
              <AuthInput inputRef={passwordInputRef} type="password" placeholder="Password" value={authData.password} onChange={(value: string) => setAuthData({...authData, password: value})} onBlur={() => handleBlur('password')} error={touchedFields.password ? validationErrors.password : ''} />
              <button disabled={isLoading} className="w-full bg-maroon text-white font-black py-4 rounded-xl hover:bg-maroon-dark transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-maroon/20 active:scale-95 uppercase tracking-widest text-xs">
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : (authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT')}
              </button>
            </form>
            <div className="mt-8 text-center">
              <span className="text-gray-mid/40 text-[10px] font-bold uppercase">{authMode === 'login' ? "New here?" : "Already a member?"}</span>
              <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setValidationErrors({}); setTouchedFields({}); }} className="text-maroon font-black ml-2 text-[10px] uppercase tracking-widest cursor-pointer hover:underline">{authMode === 'login' ? 'JOIN NOW' : 'SIGN IN'}</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface AuthInputProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  error?: string;
}

function AuthInput({ inputRef, type = "text", placeholder, value, onChange, onBlur, onKeyDown, error }: AuthInputProps) {
  return (
    <div>
      <input ref={inputRef} type={type} placeholder={placeholder} value={value} onChange={event => onChange(event.target.value)} onBlur={onBlur} onKeyDown={onKeyDown} className={`w-full bg-gray-50 border-2 border-transparent rounded-xl px-5 py-3.5 focus:border-maroon/30 outline-none font-bold text-xs ${error ? 'border-red-500/50' : ''}`} />
      {error && <p className="mt-1 text-[8px] text-red-500 ml-2 font-black uppercase">{error}</p>}
    </div>
  );
}
