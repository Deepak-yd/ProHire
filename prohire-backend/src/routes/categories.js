const express = require('express');
const requireAuth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const { Category, Professional } = require('../models');

const router = express.Router();

router.get('/', async (_req, res) => {
  const cats = await Category.findAll({ order: [['name', 'ASC']] });
  res.json(cats);
});

router.post('/', requireAuth, isAdmin, async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim();
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const existing = await Category.findOne({ where: { name } });
    if (existing) return res.status(400).json({ error: 'Category already exists' });

    const category = await Category.create({ name, description: req.body?.description || '' });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Not found' });
    category.name = req.body?.name ?? category.name;
    category.description = req.body?.description ?? category.description;
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Not found' });

    await Professional.update({ categoryId: null }, { where: { categoryId: category.id } });
    await category.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
