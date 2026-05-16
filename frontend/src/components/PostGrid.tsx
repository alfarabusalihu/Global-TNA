'use client';

import { useStore } from "@/store/useStore";
import JobCard from "./JobCard";
import { Loader2 } from "lucide-react";

export default function PostGrid() {
  const { jobs, isLoading, error } = useStore();

  if (isLoading && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-maroon mb-4" size={40} />
        <p className="text-gray-mid/60 animate-pulse">Loading requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-medium mb-2">Something went wrong</p>
        <p className="text-sm text-gray-mid/60">{error}</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-[var(--border)] rounded-3xl">
        <p className="text-lg font-medium text-gray-mid/60">No service requests found</p>
        <p className="text-sm text-gray-mid/40 mt-1">Try adjusting your filters or post a new request</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
}
