'use client';

import { useState, useEffect } from 'react';
import { JobRequest } from "@/types/index";
import { MapPin, Calendar, Clock, ChevronRight } from "lucide-react";
import { useStore } from '@/store/useStore';

interface JobCardProps {
  job: JobRequest;
}

export default function JobCard({ job }: JobCardProps) {
  const setSelectedJob = useStore((state) => state.setSelectedJob);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dateStr = mounted ? new Date(job.createdAt).toLocaleDateString() : '';
  const timeStr = mounted ? new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div 
      onClick={() => setSelectedJob(job)}
      className="group relative bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden cursor-pointer"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-maroon transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-widest text-maroon font-black bg-maroon/5 px-2 py-0.5 rounded-md">
              {job.postedBy === 'Anonymous' ? `ID: ${job.anonId || 'N/A'}` : `User: ${(job.postedBy || '').toString().substring(Math.max(0, (job.postedBy || '').toString().length - 4))}`}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-gray-mid/40 font-black border border-gray-100 px-2 py-0.5 rounded-md">
              {job.category}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-[9px] font-bold text-gray-mid/30 uppercase tracking-tight h-4">
            {mounted && (
              <>
                <span className="flex items-center gap-1">
                  <Calendar size={11} className="text-maroon/40" />
                  {dateStr}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} className="text-maroon/40" />
                  {timeStr}
                </span>
              </>
            )}
          </div>
        </div>
        <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
          job.status === 'Open' ? 'bg-green-50 text-green-600' :
          job.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
          'bg-gray-100 text-gray-500'
        }`}>
          {job.status}
        </span>
      </div>

      <h3 className="text-lg font-black mb-2 group-hover:text-maroon transition-colors leading-tight uppercase">
        {job.title}
      </h3>
      
      <p className="text-xs text-gray-mid/60 line-clamp-2 mb-4 font-medium leading-relaxed">
        {job.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 group-hover:border-maroon/30 transition-colors duration-300">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tight text-gray-mid/60">
          <MapPin size={13} className="text-maroon" />
          {job.location}
        </div>
        <div className="text-maroon flex items-center gap-1 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
          Details <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}
