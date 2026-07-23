const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload?.detail || 'Request failed'
    throw new Error(message)
  }

  return payload
}

export async function registerUser(user) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(user),
  })
}

export async function loginUser(credentials) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export async function getProfile(email) {
  return request(`/api/profile/${encodeURIComponent(email)}`)
}

export async function updateProfile(email, updates) {
  return request(`/api/profile/${encodeURIComponent(email)}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export async function getNovels() {
  return request('/api/novels')
}

export async function getNovel(id) {
  return request(`/api/novels/${id}`)
}

export async function createNovel(novel) {
  return request('/api/novels', {
    method: 'POST',
    body: JSON.stringify(novel),
  })
}

export async function updateNovel(id, updates) {
  return request(`/api/novels/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export async function deleteNovel(id) {
  return request(`/api/novels/${id}`, {
    method: 'DELETE',
  })
}

