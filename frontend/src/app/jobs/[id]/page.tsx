import JobDetailClient from '@/components/JobDetailClient';
import { JobRequest } from '@/types/index';
import Header from '@/components/Header';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

async function getJob(id: string): Promise<JobRequest | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${apiUrl}/jobs/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const job = await getJob(id);

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fafafa]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <AlertCircle size={48} className="text-gray-mid/40" />
          <h2 className="text-2xl font-bold uppercase tracking-tight">Job Not Found</h2>
          <Link href="/" className="text-maroon font-black uppercase text-sm flex items-center gap-2 cursor-pointer">
            <ChevronLeft size={20} /> Back to Board
          </Link>
        </div>
      </div>
    );
  }

  return <JobDetailClient initialJob={job} />;
}
