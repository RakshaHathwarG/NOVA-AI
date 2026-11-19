const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('nova_token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

export const authApi = {
  register: (payload) => request('/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/login', { method: 'POST', body: JSON.stringify(payload) }),
  googleLogin: (credential) => request('/google', { method: 'POST', body: JSON.stringify({ credential }) }),
  getProfile: () => request('/profile'),
}

export const chatApi = {
  generate: (payload) => request('/chat/generate', { method: 'POST', body: JSON.stringify(payload) }),
  saveMessage: (payload) => request('/chat', { method: 'POST', body: JSON.stringify(payload) }),
  getHistory: (role) => request(`/chat-history${role ? `?role=${encodeURIComponent(role)}` : ''}`),
}

export const sessionBriefApi = {
  get: (role, conversationId) => request(`/session-brief?role=${encodeURIComponent(role)}&conversationId=${encodeURIComponent(conversationId)}`),
  save: (payload) => request('/session-brief', { method: 'PUT', body: JSON.stringify(payload) }),
  delete: (role, conversationId) => request(`/session-brief?role=${encodeURIComponent(role)}&conversationId=${encodeURIComponent(conversationId)}`, { method: 'DELETE' }),
}

export const feedbackApi = {
  submit: (payload) => request('/feedback', { method: 'POST', body: JSON.stringify(payload) }),
}

