const express = require('express');
const requireAuth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const { User, Hire, Service } = require('../models');
const { normalizeRole } = require('../utils/serializers');

const router = express.Router();

router.get('/', requireAuth, isAdmin, async (_req, res) => {
  const users = await User.findAll();
  const hires = await Hire.findAll();
  const totalServices = await Service.count();

  const usersByRole = users.reduce(
    (acc, user) => {
      const role = normalizeRole(user.role);
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    },
    { admin: 0, professional: 0, user: 0 }
  );

  const hiresByStatus = hires.reduce(
    (acc, hire) => {
      acc[hire.status] = (acc[hire.status] || 0) + 1;
      return acc;
    },
    { Active: 0, Completed: 0, Pending: 0, Cancelled: 0 }
  );

  res.json({
    usersByRole,
    hiresByStatus,
    totalRevenue: hires.reduce((sum, h) => sum + Number(h.amount || 0), 0),
    totalServices,
  });
});

module.exports = router;
