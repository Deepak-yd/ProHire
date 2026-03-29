const express = require('express');
const requireAuth = require('../middleware/auth');
const { normalizeRole } = require('../utils/serializers');
const { User, Professional, Service, Hire, Message } = require('../models');

const router = express.Router();

router.get('/metrics', requireAuth, async (req, res) => {
  const role = normalizeRole(req.userRole);

  if (role === 'admin') {
    const [totalUsers, totalProfessionals, totalServices] = await Promise.all([
      User.count(),
      Professional.count(),
      Service.count(),
    ]);
    const hires = await Hire.findAll();

    return res.json({
      totalUsers,
      totalProfessionals,
      totalServices,
      totalRevenue: hires.reduce((sum, h) => sum + Number(h.amount || 0), 0),
    });
  }

  if (role === 'professional') {
    const myPro = await Professional.findOne({ where: { userId: req.userId } });
    if (!myPro) {
      return res.json({ activeProjects: 0, completedProjects: 0, services: 0, earnings: 0 });
    }

    const hires = await Hire.findAll({ where: { professionalId: myPro.id } });
    const services = await Service.count({ where: { professionalId: myPro.id } });

    return res.json({
      activeProjects: hires.filter((h) => h.status === 'Active').length,
      completedProjects: hires.filter((h) => h.status === 'Completed').length,
      services,
      earnings: hires.reduce((sum, h) => sum + Number(h.amount || 0), 0),
    });
  }

  const [hires, incomingMessages] = await Promise.all([
    Hire.findAll({ where: { clientId: req.userId } }),
    Message.count({ where: { receiverId: req.userId } }),
  ]);

  return res.json({
    activeHires: hires.filter((h) => h.status === 'Active').length,
    completedHires: hires.filter((h) => h.status === 'Completed').length,
    totalSpent: hires.reduce((sum, h) => sum + Number(h.amount || 0), 0),
    messages: incomingMessages,
  });
});

module.exports = router;
