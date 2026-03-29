const express = require('express');
const requireAuth = require('../middleware/auth');
const { Job, Professional } = require('../models');

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: [
        {
          model: Professional,
          as: 'professional',
          attributes: ['id', 'name', 'title', 'avatar'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(jobs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get jobs by professional
router.get('/professional/:professionalId', async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { professionalId: req.params.professionalId },
      include: [
        {
          model: Professional,
          as: 'professional',
          attributes: ['id', 'name', 'title', 'avatar'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(jobs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        {
          model: Professional,
          as: 'professional',
          attributes: ['id', 'name', 'title', 'avatar'],
        },
      ],
    });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create job (professional only)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, skills, budget, deadline, category } = req.body;

    // Find the professional associated with this user
    const professional = await Professional.findOne({
      where: { userId: req.userId },
    });
    if (!professional) {
      return res.status(403).json({ error: 'Only professionals can create jobs' });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Job title is required' });
    }

    const job = await Job.create({
      professionalId: professional.id,
      title: title.trim(),
      description: description || '',
      skills: Array.isArray(skills) ? skills : [],
      budget: Number(budget) || 0,
      deadline: deadline || null,
      category: category || '',
      status: 'open',
    });

    const jobWithProfessional = await Job.findByPk(job.id, {
      include: [
        {
          model: Professional,
          as: 'professional',
          attributes: ['id', 'name', 'title', 'avatar'],
        },
      ],
    });

    res.status(201).json(jobWithProfessional);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update job (professional only)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Check if user is the job owner
    const professional = await Professional.findOne({
      where: { userId: req.userId },
    });
    if (!professional || job.professionalId !== professional.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { title, description, skills, budget, deadline, category, status } = req.body;

    if (title !== undefined) job.title = title.trim();
    if (description !== undefined) job.description = description;
    if (skills !== undefined) job.skills = Array.isArray(skills) ? skills : [];
    if (budget !== undefined) job.budget = Number(budget);
    if (deadline !== undefined) job.deadline = deadline;
    if (category !== undefined) job.category = category;
    if (status !== undefined) job.status = status;

    await job.save();

    const updatedJob = await Job.findByPk(job.id, {
      include: [
        {
          model: Professional,
          as: 'professional',
          attributes: ['id', 'name', 'title', 'avatar'],
        },
      ],
    });

    res.json(updatedJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete job
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Check if user is the job owner
    const professional = await Professional.findOne({
      where: { userId: req.userId },
    });
    if (!professional || job.professionalId !== professional.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await job.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
