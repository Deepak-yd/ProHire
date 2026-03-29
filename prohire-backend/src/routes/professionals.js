const express = require('express');
const requireAuth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const { Professional, Category, Service, User } = require('../models');
const { normalizeRole, parseSkills, serializeProfessional, serializeService } = require('../utils/serializers');

const router = express.Router();

async function includeProfessionalById(id) {
  return Professional.findByPk(id, { include: [{ model: Category, as: 'categoryObj' }] });
}

async function includeAllProfessionals() {
  return Professional.findAll({
    include: [{ model: Category, as: 'categoryObj' }],
    order: [['createdAt', 'DESC']],
  });
}

router.get('/', async (_req, res) => {
  const profs = await includeAllProfessionals();
  res.json(profs.map(serializeProfessional));
});

router.get('/me', requireAuth, async (req, res) => {
  if (normalizeRole(req.userRole) !== 'professional') {
    return res.status(403).json({ error: 'Requires professional role' });
  }

  const user = await User.findByPk(req.userId);
  let prof = await Professional.findOne({ where: { userId: req.userId }, include: [{ model: Category, as: 'categoryObj' }] });

  if (!prof) {
    prof = await Professional.create({
      userId: req.userId,
      name: user.name,
      title: 'Professional',
      location: user.location || '',
      rate: 50,
      bio: user.bio || '',
      skills: JSON.stringify([]),
    });
    prof = await includeProfessionalById(prof.id);
  }

  res.json(serializeProfessional(prof));
});

router.get('/:id', async (req, res) => {
  const prof = await includeProfessionalById(req.params.id);
  if (!prof) return res.status(404).json({ error: 'Not found' });

  const services = await Service.findAll({ where: { professionalId: prof.id } });
  res.json({
    ...serializeProfessional(prof),
    services: services.map((s) => serializeService(s, prof.name)),
  });
});

router.post('/', requireAuth, isAdmin, async (req, res) => {
  try {
    const payload = req.body || {};
    const pro = await Professional.create({
      userId: payload.userId || null,
      categoryId: payload.categoryId || null,
      name: payload.name,
      title: payload.title || 'Professional',
      rate: Number(payload.rate || 0),
      location: payload.location || '',
      bio: payload.bio || '',
      skills: JSON.stringify(parseSkills(payload.skills)),
      rating: Number(payload.rating || 0),
      reviewCount: Number(payload.reviewCount || 0),
    });

    const hydrated = await includeProfessionalById(pro.id);
    res.status(201).json(serializeProfessional(hydrated));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const pro = await Professional.findByPk(req.params.id);
    if (!pro) return res.status(404).json({ error: 'Not found' });

    const isOwner = Number(pro.userId) === Number(req.userId);
    const isAdminUser = normalizeRole(req.userRole) === 'admin';
    if (!isOwner && !isAdminUser) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const payload = req.body || {};
    pro.name = payload.name ?? pro.name;
    pro.title = payload.title ?? pro.title;
    pro.rate = payload.rate !== undefined ? Number(payload.rate) : pro.rate;
    pro.location = payload.location ?? pro.location;
    pro.bio = payload.bio ?? pro.bio;
    if (payload.skills !== undefined) {
      pro.skills = JSON.stringify(parseSkills(payload.skills));
    }
    pro.categoryId = payload.categoryId ?? pro.categoryId;

    await pro.save();

    if (pro.userId) {
      const user = await User.findByPk(pro.userId);
      if (user) {
        user.name = pro.name;
        user.location = pro.location || user.location;
        user.bio = pro.bio || user.bio;
        await user.save();
      }
    }

    const hydrated = await includeProfessionalById(pro.id);
    res.json(serializeProfessional(hydrated));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const pro = await Professional.findByPk(req.params.id);
    if (!pro) return res.status(404).json({ error: 'Not found' });

    await Service.destroy({ where: { professionalId: pro.id } });
    await pro.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
