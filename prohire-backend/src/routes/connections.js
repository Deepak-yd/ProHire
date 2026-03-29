const express = require('express');
const requireAuth = require('../middleware/auth');
const { User, Connection, sequelize } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// send a connection (friend) request to another user by email or name
router.post('/', requireAuth, async (req, res) => {
  try {
    const identifier = String(req.body.email || req.body.username || '').trim();
    if (!identifier) return res.status(400).json({ error: 'Email or username is required' });
    const lowered = identifier.toLowerCase();

    const receiver = await User.findOne({
      where: {
        [Op.or]: [
          sequelize.where(sequelize.fn('LOWER', sequelize.col('email')), lowered),
          sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), lowered),
        ],
      },
    });
    if (!receiver) return res.status(404).json({ error: 'User not found' });
    if (receiver.id === req.userId) return res.status(400).json({ error: 'Cannot connect to yourself' });

    // check for existing connection (either direction)
    let existing = await Connection.findOne({
      where: {
        requesterId: req.userId,
        receiverId: receiver.id,
      },
    });
    if (existing) return res.status(400).json({ error: 'Request already sent' });

    existing = await Connection.findOne({
      where: {
        requesterId: receiver.id,
        receiverId: req.userId,
      },
    });
    if (existing) {
      if (existing.status === 'pending') {
        // if they already sent you a request, accept it automatically
        existing.status = 'accepted';
        await existing.save();
        return res.json({ message: 'Request accepted automatically' });
      }
      return res.status(400).json({ error: 'Connection already exists' });
    }

    const conn = await Connection.create({
      requesterId: req.userId,
      receiverId: receiver.id,
    });
    res.json({ id: conn.id, status: conn.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// list incoming pending requests
router.get('/incoming', requireAuth, async (req, res) => {
  try {
    const requests = await Connection.findAll({
      where: { receiverId: req.userId, status: 'pending' },
      include: [{ model: User, as: 'requester', attributes: ['id', 'name', 'email', 'role'] }],
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// list sent pending requests
router.get('/sent', requireAuth, async (req, res) => {
  try {
    const requests = await Connection.findAll({
      where: { requesterId: req.userId, status: 'pending' },
      include: [{ model: User, as: 'receiver', attributes: ['id', 'name', 'email', 'role'] }],
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// accept a request
router.put('/:id/accept', requireAuth, async (req, res) => {
  try {
    const conn = await Connection.findByPk(req.params.id);
    if (!conn) return res.status(404).json({ error: 'Request not found' });
    if (conn.receiverId !== req.userId) return res.status(403).json({ error: 'Not authorized' });
    conn.status = 'accepted';
    await conn.save();
    res.json({ message: 'Accepted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// reject a request
router.put('/:id/reject', requireAuth, async (req, res) => {
  try {
    const conn = await Connection.findByPk(req.params.id);
    if (!conn) return res.status(404).json({ error: 'Request not found' });
    if (conn.receiverId !== req.userId) return res.status(403).json({ error: 'Not authorized' });
    conn.status = 'rejected';
    await conn.save();
    res.json({ message: 'Rejected' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// list accepted friends
router.get('/friends', requireAuth, async (req, res) => {
  try {
    const friends = await Connection.findAll({
      where: {
        status: 'accepted',
        [Op.or]: [
          { requesterId: req.userId },
          { receiverId: req.userId },
        ],
      },
      include: [
        { model: User, as: 'requester', attributes: ['id', 'name', 'email', 'role'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'email', 'role'] },
      ],
    });
    // map to other user
    const list = friends.map((c) => {
      const other = c.requesterId === req.userId ? c.receiver : c.requester;
      return { id: other.id, name: other.name, email: other.email, role: other.role };
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
