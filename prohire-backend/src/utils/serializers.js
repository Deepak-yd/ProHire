function normalizeRole(role) {
  const value = String(role || '').toLowerCase();
  if (value === 'admin') return 'admin';
  if (value === 'professional') return 'professional';
  return 'user';
}

function toCurrency(amount) {
  return `$${Number(amount || 0).toFixed(0)}`;
}

function parseSkills(skills) {
  if (Array.isArray(skills)) return skills.filter(Boolean);
  if (!skills) return [];
  try {
    const parsed = JSON.parse(skills);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {}
  return String(skills)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function serializeUser(user) {
  if (!user) return null;
  const role = normalizeRole(user.role);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role,
    status: user.status || 'Active',
    joinDate: user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 10) : '',
    provider: user.provider || 'local',
    profile: {
      phone: user.phone || '',
      location: user.location || '',
      company: user.company || '',
      website: user.website || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
    },
  };
}

function serializeProfessional(professional) {
  if (!professional) return null;
  return {
    id: professional.id,
    userId: professional.userId,
    categoryId: professional.categoryId,
    category: professional.categoryObj?.name || 'Uncategorized',
    name: professional.name,
    title: professional.title || 'Professional',
    location: professional.location || '',
    rate: toCurrency(professional.rate),
    rateValue: Number(professional.rate || 0),
    bio: professional.bio || '',
    skills: parseSkills(professional.skills),
    rating: Number(professional.rating || 0),
    reviewCount: Number(professional.reviewCount || 0),
    avatar: professional.avatar || '',
  };
}

function serializeService(service, professionalName) {
  return {
    id: service.id,
    professionalId: service.professionalId,
    title: service.title,
    description: service.description || '',
    price: Number(service.price || 0),
    priceLabel: toCurrency(service.price),
    professionalName: professionalName || 'Unknown',
  };
}

function serializeHire(hire) {
  return {
    id: hire.id,
    clientUserId: hire.clientId,
    professionalId: hire.professionalId,
    serviceId: hire.serviceId,
    serviceTitle: hire.serviceTitle,
    professionalName: hire.professionalName,
    amount: toCurrency(hire.amount),
    amountValue: Number(hire.amount || 0),
    status: hire.status,
    progress: Number(hire.progress || 0),
    date: hire.date,
    rating: hire.rating,
    notes: hire.notes || '',
  };
}

module.exports = {
  normalizeRole,
  parseSkills,
  serializeUser,
  serializeProfessional,
  serializeService,
  serializeHire,
};
