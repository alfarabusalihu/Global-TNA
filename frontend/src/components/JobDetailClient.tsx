'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import Header from '@/components/Header';
import { JobRequest } from '@/types/index';
import { 
  MapPin, 
  Calendar, 
  Mail, 
  User, 
  ChevronLeft, 
  Trash2, 
  CheckCircle2, 
  Clock3, 
  Clock
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface JobDetailClientProps {
  initialJob: JobRequest;
}

export default function JobDetailClient({ initialJob }: JobDetailClientProps) {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const updateJobStatus = useStore((state) => state.updateJobStatus);
  const deleteJob = useStore((state) => state.deleteJob);
  const initializeAuth = useStore((state) => state.initializeAuth);
  const [mounted, setMounted] = useState(false);
  
  const jobs = useStore((state) => state.jobs);
  const job = jobs.find(j => j._id === initialJob._id) || initialJob;

  useEffect(() => {
    initializeAuth();
    setMounted(true);
  }, [initializeAuth]);

  const handleStatusUpdate = async (status: string) => {
    await updateJobStatus(job._id, status);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this request?')) return;
    await deleteJob(job._id);
    router.push('/');
  };

  const isOwner = user && (job.postedBy === user._id || user.role === 'admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl flex-1">
        <button 
          onClick={() => router.push('/')}
          className="mb-6 flex items-center gap-2 text-gray-mid/40 hover:text-maroon transition-colors font-black uppercase text-[10px] tracking-widest cursor-pointer"
        >
          <ChevronLeft size={16} /> Back to Board
        </button>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-2xl flex flex-col">
          {/* Title Header (Top) */}
          <div className="bg-maroon p-10 md:p-14 text-white">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-[9px] uppercase tracking-[0.2em] font-black bg-white/20 px-3 py-1.5 rounded-lg">
                {job.category}
              </span>
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                job.status === 'Open' ? 'bg-green-500/20 text-green-300' :
                job.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {job.status}
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight uppercase">{job.title}</h1>
            
            <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-white/70 h-4">
              <span className="flex items-center gap-2"><MapPin size={18} className="text-white" /> {job.location}</span>
              {mounted && (
                <span className="flex items-center gap-2">
                  <Calendar size={18} className="text-white" /> 
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Content Body (2 Columns) */}
          <div className="p-10 md:p-14 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              {/* Description Column */}
              <section className="space-y-8">
                <h2 className="text-[10px] uppercase tracking-[0.3em] text-gray-mid/30 font-black">Request Description</h2>
                <p className="text-xl text-gray-mid/80 leading-relaxed font-medium whitespace-pre-wrap">{job.description}</p>
              </section>

              {/* Contact & Admin Column */}
              <div className="space-y-12">
                <section>
                  <h2 className="text-[10px] uppercase tracking-[0.3em] text-gray-mid/30 font-black mb-8">Client Contact</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-maroon">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-mid/30 font-black uppercase tracking-tight">Full Name</p>
                        <p className="text-sm font-black uppercase">{job.contactName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-maroon">
                        <Mail size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[9px] text-gray-mid/30 font-black uppercase tracking-tight">Email Address</p>
                        <p className="text-sm font-black break-all">{job.contactEmail}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {isOwner && (
                  <section className="space-y-8 pt-10 border-t border-gray-100">
                    <h2 className="text-[10px] uppercase tracking-[0.3em] text-gray-mid/30 font-black">Administration</h2>
                    <div className="grid grid-cols-3 gap-3">
                      <button onClick={() => handleStatusUpdate('Open')} className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${job.status === 'Open' ? 'border-maroon bg-maroon/5 text-maroon' : 'border-transparent bg-gray-50 opacity-50 hover:opacity-100'}`}>
                        <Clock3 size={20} />
                        <span className="text-[9px] font-black uppercase">Open</span>
                      </button>
                      <button onClick={() => handleStatusUpdate('In Progress')} className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${job.status === 'In Progress' ? 'border-maroon bg-maroon/5 text-maroon' : 'border-transparent bg-gray-50 opacity-50 hover:opacity-100'}`}>
                        <Clock size={20} />
                        <span className="text-[9px] font-black uppercase">Progress</span>
                      </button>
                      <button onClick={() => handleStatusUpdate('Closed')} className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${job.status === 'Closed' ? 'border-maroon bg-maroon/5 text-maroon' : 'border-transparent bg-gray-50 opacity-50 hover:opacity-100'}`}>
                        <CheckCircle2 size={20} />
                        <span className="text-[9px] font-black uppercase">Closed</span>
                      </button>
                    </div>
                    <button onClick={handleDelete} className="w-full flex items-center justify-center gap-3 p-5 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all font-black text-xs uppercase tracking-widest cursor-pointer shadow-sm">
                      <Trash2 size={20} /> Delete Request
                    </button>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
