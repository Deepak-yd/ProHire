const express = require('express');
const requireAuth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const { User, Professional, Service, Hire, Message } = require('../models');
const { normalizeRole, serializeUser } = require('../utils/serializers');

const router = express.Router();

router.get('/', requireAuth, isAdmin, async (_req, res) => {
  const users = await User.findAll({ order: [['createdAt', 'DESC']] });
  res.json(users.map(serializeUser));
});

router.post('/', requireAuth, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: String(password),
      role: normalizeRole(role),
      status: 'Active',
    });

    if (normalizeRole(role) === 'professional') {
      await Professional.create({
        userId: user.id,
        name: user.name,
        title: 'Professional',
        location: user.location || '',
        rate: 50,
        bio: user.bio || '',
        skills: JSON.stringify([]),
      });
    }

    res.status(201).json(serializeUser(user));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });

    const data = req.body || {};
    const nextRole = data.role ? normalizeRole(data.role) : normalizeRole(user.role);

    user.name = data.name ?? user.name;
    user.email = data.email ? String(data.email).trim().toLowerCase() : user.email;
    user.status = data.status ?? user.status;
    user.role = nextRole;
    await user.save();

    if (nextRole === 'professional') {
      const pro = await Professional.findOne({ where: { userId: user.id } });
      if (!pro) {
        await Professional.create({
          userId: user.id,
          name: user.name,
          title: 'Professional',
          location: user.location || '',
          rate: 50,
          bio: user.bio || '',
          skills: JSON.stringify([]),
        });
      }
    }

    res.json(serializeUser(user));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    if (Number(req.userId) === Number(user.id)) {
      return res.status(400).json({ error: 'Admin cannot delete own account' });
    }

    const professional = await Professional.findOne({ where: { userId: user.id } });
    if (professional) {
      await Service.destroy({ where: { professionalId: professional.id } });
      await Hire.destroy({ where: { professionalId: professional.id } });
      await professional.destroy();
    }

    await Hire.destroy({ where: { clientId: user.id } });
    await Message.destroy({ where: { senderId: user.id } });
    await Message.destroy({ where: { receiverId: user.id } });
    await user.destroy();

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
