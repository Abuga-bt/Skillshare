const API = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getStats: () => request('/stats'),
  getSkills: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/skills${q ? `?${q}` : ''}`);
  },
  getSkill: (id) => request(`/skills/${id}`),
  createSkill: (body) => request('/skills', { method: 'POST', body: JSON.stringify(body) }),
  updateSkill: (id, body) => request(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteSkill: (id) => request(`/skills/${id}`, { method: 'DELETE' }),
  getUser: (id) => request(`/users/${id}`),
  updateUser: (id, body) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  getUserSkills: (id) => request(`/users/${id}/skills`),
  getExchanges: () => request('/exchanges'),
  createExchange: (body) => request('/exchanges', { method: 'POST', body: JSON.stringify(body) }),
  updateExchange: (id, body) => request(`/exchanges/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  getConversations: () => request('/messages/conversations'),
  getUnreadCount: () => request('/messages/unread-count'),
  markConversationRead: (convId) => request(`/messages/${convId}/read`, { method: 'POST' }),
  startConversation: (body) => request('/messages/start', { method: 'POST', body: JSON.stringify(body) }),
  getMessages: (convId) => request(`/messages/${convId}`),
  sendMessage: (body) => request('/messages', { method: 'POST', body: JSON.stringify(body) }),
  createReview: (body) => request('/reviews', { method: 'POST', body: JSON.stringify(body) }),
  getReviews: (userId) => request(`/users/${userId}/reviews`),
  getCategories: () => request('/categories'),
  getCommunities: () => request('/communities'),
};
