'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import Header from '@/components/Header';
import PostGrid from '@/components/PostGrid';
import SlidingForm from '@/components/SlidingForm';
import JobDetailModal from '@/components/JobDetailModal';
import { Plus, Filter, Search } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function Home() {
  const { 
    fetchJobs, setIsFormOpen, isFormOpen, initializeAuth, 
    selectedCategory, setSelectedCategory, selectedJob 
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    initializeAuth();
    fetchJobs();
  }, [fetchJobs, initializeAuth]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs({ 
        search: searchTerm, 
        category: selectedCategory === 'All' ? undefined : selectedCategory 
      });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory, fetchJobs]);

  return (
    <main className="flex-1 flex flex-col relative bg-[#fafafa]">
      <Header />
      
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-0.5 uppercase italic">
              Service <span className="text-maroon">Board</span>
            </h2>
            <p className="text-gray-mid/40 text-[10px] font-bold uppercase tracking-widest">
              Browse professional training needs in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <div className="relative group flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-mid/30 group-focus-within:text-maroon transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-5 py-2.5 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-maroon/5 focus:border-maroon hover:border-maroon/30 transition-all w-full shadow-sm font-medium"
              />
            </div>
            <button className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-maroon/30 transition-all cursor-pointer shadow-sm group">
              <Filter size={18} className="text-gray-mid/30 group-hover:text-maroon transition-colors" />
            </button>
          </div>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Plumbing', 'Electrical', 'Painting', 'Joinery', 'General'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap uppercase tracking-widest cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-maroon text-white shadow-lg shadow-maroon/20' 
                  : 'bg-white border border-gray-100 text-gray-mid/40 hover:border-maroon/30 hover:text-maroon'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <PostGrid />
      </div>

      <button
        id="add-job-button"
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-maroon text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group cursor-pointer shadow-maroon/30"
      >
        <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <AnimatePresence>
        {isFormOpen && <SlidingForm />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedJob && <JobDetailModal />}
      </AnimatePresence>
    </main>
  );
}
