const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// @route   GET /api/jobs
// @desc    Get all jobs (public)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/jobs/all
// @desc    Get all jobs including drafts (Admin only)
router.get('/all', auth, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/jobs
// @desc    Create a job (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const newJob = new Job(req.body);
    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
