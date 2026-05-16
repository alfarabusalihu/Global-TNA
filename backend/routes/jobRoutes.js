const express = require('express');
const router = express.Router();
const JobRequest = require('../models/JobRequest');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all jobs
// @route   GET /api/jobs
router.get('/', async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await JobRequest.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Get single job
// @route   GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Create a job
// @route   POST /api/jobs
router.post('/', async (req, res) => {
  try {
    const { title, description, category, location, contactName, contactEmail, postedBy, anonId } = req.body;
    
    // If postedBy is not provided, it defaults to Anonymous in model
    // But we should handle the logic here if needed
    
    const job = await JobRequest.create({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
      postedBy: postedBy || 'Anonymous',
      anonId: postedBy === 'Anonymous' || !postedBy ? (anonId || `ANON-${Date.now()}`) : undefined
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Update job status
// @route   PATCH /api/jobs/:id
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Open', 'In Progress', 'Closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Check ownership or admin
    if (job.postedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ error: 'User not authorized to delete this job' });
    }

    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
