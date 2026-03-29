const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const requireAuth = require('../middleware/auth');
const { User, Professional, sequelize } = require('../models');
const { Op } = require('sequelize');
const { normalizeRole, parseSkills, serializeUser } = require('../utils/serializers');

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user.id, role: normalizeRole(user.role) }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function ensureProfessionalForUser(user) {
  let professional = await Professional.findOne({ where: { userId: user.id } });
  if (professional) return professional;

  professional = await Professional.create({
    userId: user.id,
    name: user.name,
    title: 'Professional',
    location: user.location || '',
    rate: 50,
    bio: user.bio || '',
    skills: JSON.stringify([]),
  });
  return professional;
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ where: { email: String(email).trim().toLowerCase() } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const safeRole = normalizeRole(role);
    const user = await User.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      password: String(password),
      role: safeRole,
    });

    if (safeRole === 'professional') {
      await ensureProfessionalForUser(user);
    }

    const token = signToken(user);
    res.json({ user: serializeUser(user), token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const identifier = String(username || email || '').trim().toLowerCase();
    if (!identifier) return res.status(400).json({ error: 'Username or email is required' });

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { username: identifier },
        ],
      },
    });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.status === 'Inactive') return res.status(403).json({ error: 'User is inactive' });

    const valid = await user.validatePassword(String(password || ''));
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(user);
    res.json({ user: serializeUser(user), token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/google-login', async (req, res) => {
  try {
    const { email, name, picture } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail) return res.status(400).json({ error: 'Google account email is required' });

    let user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      user = await User.create({
        name: String(name || normalizedEmail.split('@')[0]),
        email: normalizedEmail,
        password: `google_${Math.random().toString(36).slice(2)}`,
        role: 'user',
        provider: 'google',
        avatar: picture || '',
      });
    } else if (picture && !user.avatar) {
      user.avatar = picture;
      await user.save();
    }

    const token = signToken(user);
    res.json({ user: serializeUser(user), token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(serializeUser(user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: 'Not found' });

    const updates = req.body || {};

    user.name = updates.name ?? user.name;
    user.phone = updates.phone ?? user.phone;
    user.location = updates.location ?? user.location;
    user.company = updates.company ?? user.company;
    user.website = updates.website ?? user.website;
    user.bio = updates.bio ?? user.bio;
    user.avatar = updates.avatar ?? user.avatar;
    user.linkedIn = updates.linkedIn ?? user.linkedIn;
    user.github = updates.github ?? user.github;
    user.twitter = updates.twitter ?? user.twitter;
    user.portfolio = updates.portfolio ?? user.portfolio;

    await user.save();

    if (normalizeRole(user.role) === 'professional') {
      const professional = await ensureProfessionalForUser(user);
      professional.name = user.name;
      professional.title = updates.title ?? professional.title;
      professional.location = updates.location ?? professional.location;
      professional.rate = updates.hourlyRate ?? professional.rate;
      professional.bio = updates.bio ?? professional.bio;
      if (updates.skills !== undefined) {
        professional.skills = JSON.stringify(parseSkills(updates.skills));
      }
      await professional.save();
    }

    res.json(serializeUser(user));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      let user = await User.findOne({ where: { email } });
      if (!user) {
        user = await User.create({
          name: profile.displayName || 'Google User',
          email,
          password: `google_${Math.random().toString(36).slice(2)}`,
          role: 'user',
          provider: 'google',
          avatar: profile.photos?.[0]?.value || '',
        });
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  }));

  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), (req, res) => {
    const token = signToken(req.user);
    const redirect = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}`;
    res.redirect(redirect);
  });
}

module.exports = router;
