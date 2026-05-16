import { create } from 'zustand';
import { JobRequest, User } from '@/types/index';
import api from '@/lib/api';
import { jwtDecode } from 'jwt-decode';

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User | null, token: string | null) => void;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;

  // Jobs
  jobs: JobRequest[];
  isLoading: boolean;
  error: string | null;
  fetchJobs: (filters?: { category?: string; status?: string; search?: string }) => Promise<void>;
  createJob: (jobData: Partial<JobRequest>) => Promise<void>;
  updateJobStatus: (id: string, status: string) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;

  // UI
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedJob: JobRequest | null;
  setSelectedJob: (job: JobRequest | null) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Auth Initial State
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ user, token, isAuthenticated: !!user });
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, _id, name, email, role } = response.data;
      const user = { _id, name, email, role };
      get().setAuth(user, token);
      set({ isLoading: false });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', userData);
      const { token, _id, name, email, role } = response.data;
      const user = { _id, name, email, role };
      get().setAuth(user, token);
      set({ isLoading: false });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  initializeAuth: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          get().logout();
        } else {
          set({ user: decoded, token, isAuthenticated: true });
        }
      } catch (e) {
        get().logout();
      }
    }
  },

  // Jobs
  jobs: [],
  isLoading: false,
  error: null,

  fetchJobs: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/jobs', { params: filters });
      let sortedJobs = response.data;
      
      const statusOrder: Record<string, number> = { 'Open': 0, 'In Progress': 1, 'Closed': 2 };
      sortedJobs.sort((a: JobRequest, b: JobRequest) => {
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      set({ jobs: sortedJobs, isLoading: false });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch jobs';
      set({ error: errorMessage, isLoading: false });
    }
  },

  createJob: async (jobData) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/jobs', jobData);
      await get().fetchJobs();
      set({ isLoading: false, isFormOpen: false });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to create job';
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  },

  updateJobStatus: async (id, status) => {
    try {
      await api.patch(`/jobs/${id}`, { status });
      // Update local state without full reload
      set((state) => {
        const updatedJobs = state.jobs.map((job) => 
          job._id === id ? { ...job, status: status as any } : job
        );
        
        // Re-sort
        const statusOrder: Record<string, number> = { 'Open': 0, 'In Progress': 1, 'Closed': 2 };
        updatedJobs.sort((a: JobRequest, b: JobRequest) => {
          if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return { jobs: updatedJobs };
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update status';
      set({ error: errorMessage });
    }
  },

  deleteJob: async (id) => {
    try {
      await api.delete(`/jobs/${id}`);
      set((state) => ({
        jobs: state.jobs.filter((job) => job._id !== id)
      }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to delete job';
      set({ error: errorMessage });
    }
  },

  // UI
  isFormOpen: false,
  setIsFormOpen: (open) => set({ isFormOpen: open }),
  isAuthModalOpen: false,
  setIsAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  selectedCategory: 'All',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  selectedJob: null,
  setSelectedJob: (job) => set({ selectedJob: job }),
}));
