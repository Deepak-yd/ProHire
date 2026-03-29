const express = require('express');
const requireAuth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const { Setting } = require('../models');

const router = express.Router();

async function getSettings() {
  let setting = await Setting.findByPk(1);
  if (!setting) {
    setting = await Setting.create({ id: 1, platformName: 'ProHire', commissionRate: 10 });
  }
  return setting;
}

router.get('/', requireAuth, isAdmin, async (_req, res) => {
  const setting = await getSettings();
  res.json({
    platformName: setting.platformName,
    commissionRate: Number(setting.commissionRate || 0),
  });
});

router.put('/', requireAuth, isAdmin, async (req, res) => {
  try {
    const setting = await getSettings();
    setting.platformName = req.body?.platformName ?? setting.platformName;
    setting.commissionRate = req.body?.commissionRate !== undefined
      ? Number(req.body.commissionRate)
      : setting.commissionRate;
    await setting.save();

    res.json({
      platformName: setting.platformName,
      commissionRate: Number(setting.commissionRate || 0),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
