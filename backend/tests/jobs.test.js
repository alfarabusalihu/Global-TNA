import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';
import JobRequest from '../models/JobRequest';

// Mock Mongoose model methods
vi.mock('../models/JobRequest', () => {
  return {
    default: {
      find: vi.fn(),
      prototype: {
        save: vi.fn(),
      },
    },
  };
});

describe('Jobs API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/jobs', () => {
    it('should fetch all jobs', async () => {
      const mockJobs = [
        { _id: '1', title: 'Test Job 1', status: 'Open', category: 'General' },
        { _id: '2', title: 'Test Job 2', status: 'Open', category: 'General' }
      ];
      
      // Mocking the chained find().sort()
      const mockSort = vi.fn().mockResolvedValue(mockJobs);
      JobRequest.find.mockReturnValue({ sort: mockSort });

      const response = await request(app).get('/api/jobs');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(JobRequest.find).toHaveBeenCalled();
    });
  });

  describe('POST /api/jobs', () => {
    it('should return 400 if required fields are missing', async () => {
      const incompleteData = { title: 'Missing Info' };
      
      const response = await request(app)
        .post('/api/jobs')
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });
});
