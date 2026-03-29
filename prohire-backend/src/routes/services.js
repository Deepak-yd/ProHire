const express = require('express');
const requireAuth = require('../middleware/auth');
const { Professional, Service } = require('../models');
const { normalizeRole, serializeService } = require('../utils/serializers');

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
  const professionalId = Number(req.params.professionalId);
  const professional = await Professional.findByPk(professionalId);
  if (!professional) return res.status(404).json({ error: 'Professional not found' });

  const services = await Service.findAll({ where: { professionalId }, order: [['createdAt', 'DESC']] });
  res.json(services.map((s) => serializeService(s, professional.name)));
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const professionalId = Number(req.params.professionalId);
    const professional = await Professional.findByPk(professionalId);
    if (!professional) return res.status(404).json({ error: 'Professional not found' });

    const isOwner = Number(professional.userId) === Number(req.userId);
    const isAdminUser = normalizeRole(req.userRole) === 'admin';
    if (!isOwner && !isAdminUser) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const payload = req.body || {};
    const service = await Service.create({
      professionalId,
      title: String(payload.title || '').trim(),
      description: payload.description || '',
      price: Number(payload.price || 0),
    });

    res.status(201).json(serializeService(service, professional.name));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:serviceId', requireAuth, async (req, res) => {
  try {
    const professionalId = Number(req.params.professionalId);
    const serviceId = Number(req.params.serviceId);

    const professional = await Professional.findByPk(professionalId);
    if (!professional) return res.status(404).json({ error: 'Professional not found' });

    const isOwner = Number(professional.userId) === Number(req.userId);
    const isAdminUser = normalizeRole(req.userRole) === 'admin';
    if (!isOwner && !isAdminUser) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const service = await Service.findOne({ where: { id: serviceId, professionalId } });
    if (!service) return res.status(404).json({ error: 'Service not found' });

    const payload = req.body || {};
    service.title = payload.title ?? service.title;
    service.description = payload.description ?? service.description;
    service.price = payload.price !== undefined ? Number(payload.price) : service.price;

    await service.save();
    res.json(serializeService(service, professional.name));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:serviceId', requireAuth, async (req, res) => {
  try {
    const professionalId = Number(req.params.professionalId);
    const serviceId = Number(req.params.serviceId);

    const professional = await Professional.findByPk(professionalId);
    if (!professional) return res.status(404).json({ error: 'Professional not found' });

    const isOwner = Number(professional.userId) === Number(req.userId);
    const isAdminUser = normalizeRole(req.userRole) === 'admin';
    if (!isOwner && !isAdminUser) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const service = await Service.findOne({ where: { id: serviceId, professionalId } });
    if (!service) return res.status(404).json({ error: 'Service not found' });

    await service.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
