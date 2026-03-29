const express = require('express');
const requireAuth = require('../middleware/auth');
const { Hire, Professional, Service } = require('../models');
const { normalizeRole, serializeHire } = require('../utils/serializers');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const role = normalizeRole(req.userRole);
  const where = {};

  if (role === 'user') {
    where.clientId = req.userId;
  } else if (role === 'professional') {
    const myPro = await Professional.findOne({ where: { userId: req.userId } });
    if (!myPro) return res.json([]);
    where.professionalId = myPro.id;
  }

  const hires = await Hire.findAll({ where, order: [['createdAt', 'DESC']] });
  res.json(hires.map(serializeHire));
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const role = normalizeRole(req.userRole);
    if (!['user', 'admin'].includes(role)) {
      return res.status(403).json({ error: 'Only client/admin can create hires' });
    }

    const service = await Service.findByPk(req.body?.serviceId);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    const professional = await Professional.findByPk(service.professionalId);
    if (!professional) return res.status(404).json({ error: 'Professional not found' });

    const hire = await Hire.create({
      clientId: req.userId,
      professionalId: professional.id,
      serviceId: service.id,
      serviceTitle: service.title,
      professionalName: professional.name,
      amount: Number(service.price || 0),
      status: 'Active',
      progress: 0,
      date: new Date().toISOString().slice(0, 10),
      notes: req.body?.notes || '',
    });

    res.status(201).json(serializeHire(hire));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const hire = await Hire.findByPk(req.params.id);
    if (!hire) return res.status(404).json({ error: 'Hire not found' });

    const role = normalizeRole(req.userRole);
    let canManage = role === 'admin' || Number(hire.clientId) === Number(req.userId);

    if (!canManage && role === 'professional') {
      const myPro = await Professional.findOne({ where: { userId: req.userId } });
      canManage = myPro && Number(myPro.id) === Number(hire.professionalId);
    }

    if (!canManage) return res.status(403).json({ error: 'Forbidden' });

    const payload = req.body || {};
    hire.status = payload.status ?? hire.status;
    hire.progress = payload.progress !== undefined ? Number(payload.progress) : hire.progress;
    if (payload.rating !== undefined) {
      hire.rating = payload.rating;
    }

    await hire.save();
    res.json(serializeHire(hire));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
