function normalizeRole(role) {
  const value = String(role || '').toLowerCase();
  if (value === 'admin') return 'admin';
  if (value === 'professional') return 'professional';
  return 'user';
}

module.exports = {
  isAdmin: (req, res, next) => {
    if (normalizeRole(req.userRole) === 'admin') return next();
    return res.status(403).json({ error: 'Requires admin role' });
  },
  isProfessional: (req, res, next) => {
    if (normalizeRole(req.userRole) === 'professional') return next();
    return res.status(403).json({ error: 'Requires professional role' });
  },
  isUser: (req, res, next) => {
    if (normalizeRole(req.userRole) === 'user') return next();
    return res.status(403).json({ error: 'Requires user role' });
  },
};
