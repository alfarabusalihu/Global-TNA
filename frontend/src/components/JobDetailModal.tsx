'use client';

import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { 
  X, MapPin, Calendar, Mail, User, 
  Trash2, CheckCircle2, Clock3, Clock 
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function JobDetailModal() {
  const { 
    selectedJob, setSelectedJob, user, 
    updateJobStatus, deleteJob 
  } = useStore();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!selectedJob) return null;

  const handleStatusUpdate = async (status: string) => {
    await updateJobStatus(selectedJob._id, status);
    setSelectedJob({ ...selectedJob, status: status as any });
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    await deleteJob(selectedJob._id);
    setSelectedJob(null);
  };

  const isOwner = user && (selectedJob.postedBy === user._id || user.role === 'admin');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedJob(null)}
        className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
      />

      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]"
      >
        {/* Title Header (Top) */}
        <div className="bg-maroon p-8 md:p-10 text-white relative">
          <button 
            onClick={() => setSelectedJob(null)}
            className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
          
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-[9px] uppercase tracking-[0.2em] font-black bg-white/20 px-3 py-1.5 rounded-lg">
              {selectedJob.category}
            </span>
            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
              selectedJob.status === 'Open' ? 'bg-green-500/20 text-green-300' :
              selectedJob.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300' :
              'bg-gray-500/20 text-gray-300'
            }`}>
              {selectedJob.status}
            </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight uppercase">{selectedJob.title}</h2>
          
          <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-white/70 h-4">
            <span className="flex items-center gap-2"><MapPin size={16} className="text-white" /> {selectedJob.location}</span>
            {mounted && (
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-white" /> 
                {new Date(selectedJob.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Content Body (2 Columns) */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {/* Description Column */}
            <section className="space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-mid/30 font-black">Request Description</h3>
              <p className="text-lg text-gray-mid/80 leading-relaxed font-medium whitespace-pre-wrap">{selectedJob.description}</p>
            </section>

            {/* Details & Contact Column */}
            <div className="space-y-10">
              <section>
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-mid/30 font-black mb-6">Client Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-maroon">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-mid/30 font-black uppercase tracking-tight">Full Name</p>
                      <p className="text-xs font-black uppercase">{selectedJob.contactName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-maroon">
                      <Mail size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[9px] text-gray-mid/30 font-black uppercase tracking-tight">Email Address</p>
                      <p className="text-xs font-black break-all">{selectedJob.contactEmail}</p>
                    </div>
                  </div>
                </div>
              </section>

              {isOwner && (
                <section className="space-y-6 pt-8 border-t border-gray-100">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-mid/30 font-black">Admin Controls</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => handleStatusUpdate('Open')} className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedJob.status === 'Open' ? 'border-maroon bg-maroon/5 text-maroon' : 'border-transparent bg-gray-50 opacity-50 hover:opacity-100'}`}>
                      <Clock3 size={18} />
                      <span className="text-[8px] font-black uppercase">Open</span>
                    </button>
                    <button onClick={() => handleStatusUpdate('In Progress')} className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedJob.status === 'In Progress' ? 'border-maroon bg-maroon/5 text-maroon' : 'border-transparent bg-gray-50 opacity-50 hover:opacity-100'}`}>
                      <Clock size={18} />
                      <span className="text-[8px] font-black uppercase">Progress</span>
                    </button>
                    <button onClick={() => handleStatusUpdate('Closed')} className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedJob.status === 'Closed' ? 'border-maroon bg-maroon/5 text-maroon' : 'border-transparent bg-gray-50 opacity-50 hover:opacity-100'}`}>
                      <CheckCircle2 size={18} />
                      <span className="text-[8px] font-black uppercase">Closed</span>
                    </button>
                  </div>
                  <button onClick={handleDelete} className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer shadow-sm">
                    <Trash2 size={16} /> Delete Request
                  </button>
                </section>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
