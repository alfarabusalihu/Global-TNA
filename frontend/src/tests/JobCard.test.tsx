import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import JobCard from '../components/JobCard';
import { JobRequest } from '@/types/index';

// Mock the store
vi.mock('@/store/useStore', () => ({
  useStore: vi.fn((selector) => {
    const state = {
      setSelectedJob: vi.fn()
    };
    return selector ? selector(state) : state;
  })
}));

const mockJob: JobRequest = {
  _id: '123',
  title: 'REPAIR KITCHEN SINK',
  description: 'The kitchen sink is leaking from the pipe below.',
  category: 'Plumbing',
  status: 'Open',
  location: 'Manchester',
  contactName: 'ALICE SMITH',
  contactEmail: 'alice@example.com',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  anonId: 'ANON-123',
  postedBy: 'Anonymous'
};

describe('JobCard Component', () => {
  it('renders the job title in uppercase', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText('REPAIR KITCHEN SINK')).toBeInTheDocument();
  });

  it('renders the job location and category', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText('Manchester')).toBeInTheDocument();
    expect(screen.getByText('Plumbing')).toBeInTheDocument();
  });

  it('displays the correct status with appropriate styling', () => {
    render(<JobCard job={mockJob} />);
    const statusBadge = screen.getByText('Open');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge.className).toContain('text-green-600');
  });
});
