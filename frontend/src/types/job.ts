export type JobStatus = 'Open' | 'In Progress' | 'Closed';
export type JobCategory = 'Plumbing' | 'Electrical' | 'Painting' | 'Joinery' | 'General';

export interface JobRequest {
  _id: string;
  title: string;
  description: string;
  category: JobCategory;
  location: string;
  contactName: string;
  contactEmail: string;
  status: JobStatus;
  postedBy: string;
  anonId?: string;
  createdAt: string;
  updatedAt: string;
}
