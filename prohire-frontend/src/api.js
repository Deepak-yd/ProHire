const API_BASE_URL = import.meta.env.VITE_API_URL;

function toCurrency(value) {
  return `$${Number(value || 0).toFixed(0)}`;
}

function getToken() {
  return localStorage.getItem('token');
}

function normalizeRole(role) {
  const value = String(role || '').toLowerCase();
  if (value === 'admin') return 'admin';
  if (value === 'professional') return 'professional';
  return 'user';
}

function shapeUser(user) {
  if (!user) return null;
  return {
    ...user,
    role: normalizeRole(user.role),
    profile: {
      phone: user.profile?.phone || '',
      location: user.profile?.location || '',
      company: user.profile?.company || '',
      website: user.profile?.website || '',
      bio: user.profile?.bio || '',
      avatar: user.profile?.avatar || '',
    },
  };
}

function shapeProfessional(pro) {
  if (!pro) return null;
  return {
    ...pro,
    id: String(pro.id),
    userId: String(pro.userId || ''),
    categoryId: pro.categoryId ? String(pro.categoryId) : null,
    category: pro.category || 'Uncategorized',
    rate: typeof pro.rate === 'string' ? pro.rate : toCurrency(pro.rateValue ?? pro.rate),
    skills: Array.isArray(pro.skills) ? pro.skills : [],
    reviewCount: Number(pro.reviewCount || 0),
  };
}

function shapeService(service) {
  return {
    ...service,
    id: String(service.id),
    professionalId: String(service.professionalId),
    price: Number(service.price || 0),
    priceLabel: service.priceLabel || toCurrency(service.price),
  };
}

function shapeHire(hire) {
  return {
    ...hire,
    id: String(hire.id),
    clientUserId: String(hire.clientUserId),
    professionalId: String(hire.professionalId),
    serviceId: hire.serviceId ? String(hire.serviceId) : null,
    amount: typeof hire.amount === 'string' ? hire.amount : toCurrency(hire.amountValue ?? hire.amount),
  };
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const rawText = await response.text();
  let data = null;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }

  return data;
}

export async function login(data) {
  const session = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return { token: session.token, user: shapeUser(session.user) };
}

export async function register(data) {
  const payload = { ...data, role: normalizeRole(data?.role) };
  const session = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return { token: session.token, user: shapeUser(session.user) };
}

export async function loginWithGoogle(data) {
  const session = await request('/auth/google-login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return { token: session.token, user: shapeUser(session.user) };
}

export async function getCurrentUser() {
  const user = await request('/auth/me');
  return shapeUser(user);
}

export async function updateMyProfile(payload) {
  const user = await request('/auth/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return shapeUser(user);
}

export async function fetchUsers() {
  const users = await request('/users');
  return users.map(shapeUser);
}

export async function createUser(data) {
  const user = await request('/users', {
    method: 'POST',
    body: JSON.stringify({ ...data, role: normalizeRole(data?.role) }),
  });
  return shapeUser(user);
}

export async function updateUser(id, data) {
  const user = await request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, role: data?.role ? normalizeRole(data.role) : undefined }),
  });
  return shapeUser(user);
}

export async function deleteUser(id) {
  return request(`/users/${id}`, { method: 'DELETE' });
}

export async function fetchProfessionals() {
  const pros = await request('/professionals');
  return pros.map(shapeProfessional);
}

export async function fetchMyProfessionalProfile() {
  const profile = await request('/professionals/me');
  return shapeProfessional(profile);
}

export async function updateProfessional(id, data) {
  const payload = { ...data };
  if (payload.skills !== undefined && !Array.isArray(payload.skills)) {
    payload.skills = String(payload.skills)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const pro = await request(`/professionals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return shapeProfessional(pro);
}

export async function deleteProfessional(id) {
  return request(`/professionals/${id}`, { method: 'DELETE' });
}

export async function fetchCategories() {
  return request('/categories');
}

// connection / friend system
export async function sendConnectionRequest(email) {
  return request('/connections', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function getIncomingConnectionRequests() {
  return request('/connections/incoming');
}

export async function getSentConnectionRequests() {
  return request('/connections/sent');
}

export async function acceptConnection(id) {
  return request(`/connections/${id}/accept`, { method: 'PUT' });
}

export async function rejectConnection(id) {
  return request(`/connections/${id}/reject`, { method: 'PUT' });
}

export async function fetchFriends() {
  return request('/connections/friends');
}

export async function createCategory(data) {
  return request('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id, data) {
  return request(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id) {
  return request(`/categories/${id}`, { method: 'DELETE' });
}

export async function fetchServices(professionalId) {
  const services = await request(`/professionals/${professionalId}/services`);
  return services.map(shapeService);
}

export async function createService(professionalId, data) {
  const service = await request(`/professionals/${professionalId}/services`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return shapeService(service);
}

export async function updateService(professionalId, serviceId, data) {
  const service = await request(`/professionals/${professionalId}/services/${serviceId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return shapeService(service);
}

export async function deleteService(professionalId, serviceId) {
  return request(`/professionals/${professionalId}/services/${serviceId}`, {
    method: 'DELETE',
  });
}

export async function fetchHires() {
  const hires = await request('/hires');
  return hires.map(shapeHire);
}

export async function createHire(data) {
  const hire = await request('/hires', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return shapeHire(hire);
}

export async function updateHire(id, data) {
  const hire = await request(`/hires/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return shapeHire(hire);
}

export async function fetchDashboardMetrics() {
  return request('/dashboard/metrics');
}

export async function fetchReports() {
  return request('/reports');
}

export async function fetchPlatformSettings() {
  return request('/settings');
}

export async function updatePlatformSettings(payload) {
  return request('/settings', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
// Job API functions
export async function fetchAllJobs() {
  return request('/jobs');
}

export async function fetchJobsByProfessional(professionalId) {
  return request(`/jobs/professional/${professionalId}`);
}

export async function fetchJobDetails(jobId) {
  return request(`/jobs/${jobId}`);
}

export async function createJob(data) {
  return request('/jobs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateJob(jobId, data) {
  return request(`/jobs/${jobId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteJob(jobId) {
  return request(`/jobs/${jobId}`, {
    method: 'DELETE',
  });
}
