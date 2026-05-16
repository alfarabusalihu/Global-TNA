'use client';

import Link from 'next/link';
import { Home, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-maroon/10 rounded-full flex items-center justify-center text-maroon mx-auto mb-8"
        >
          <AlertCircle size={48} />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-8xl font-black text-maroon/20 uppercase tracking-tighter mb-4 italic">404</h1>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Request Not Found</h2>
          <p className="text-gray-mid/60 text-sm font-medium mb-10 leading-relaxed">
            The service request or page you are looking for has been closed, 
            moved, or never existed in our directory.
          </p>
          
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-maroon text-white font-black rounded-2xl hover:bg-maroon-dark transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-maroon/20 uppercase tracking-widest text-xs italic"
          >
            <Home size={18} />
            Back to Global Board
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
