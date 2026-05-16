'use client';

import { useState, useEffect } from 'react';
import { useStore } from "@/store/useStore";
import { User, LogOut } from "lucide-react";
import AuthModal from './AuthModal';

export default function Header() {
  const user = useStore(state => state.user);
  const logout = useStore(state => state.logout);
  const setIsAuthModalOpen = useStore(state => state.setIsAuthModalOpen);
  
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm' : 'bg-transparent border-b border-transparent'}`}>
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.location.href = '/'}>
          <div className="w-7 h-7 bg-maroon rounded-lg flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:scale-110 shadow-lg shadow-maroon/20 italic">G</div>
          <h1 className="text-lg font-black tracking-tighter hidden md:block uppercase italic">Global <span className="text-maroon">TNA</span></h1>
        </div>

        <div className="flex items-center gap-4">
          {mounted && (
            user ? (
              <div className="flex items-center gap-3 bg-white/50 px-3 py-1.5 rounded-xl border border-gray-50 shadow-sm">
                <div className="w-6 h-6 bg-maroon/10 rounded-full flex items-center justify-center text-maroon"><User size={14} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest">{user.name}</span>
                <div className="w-px h-3 bg-gray-200" />
                <button onClick={logout} className="p-1 rounded-lg hover:bg-maroon/10 text-maroon transition-colors cursor-pointer group"><LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" /></button>
              </div>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-2 px-6 py-2 bg-maroon text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-maroon-dark transition-all transform hover:scale-105 active:scale-95 cursor-pointer shadow-xl shadow-maroon/20">
                <User size={14} /> <span>SIGN IN</span>
              </button>
            )
          )}
        </div>
      </div>
      <AuthModal />
    </header>
  );
}
