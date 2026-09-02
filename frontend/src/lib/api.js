const API_BASE = '/api'

function getToken() {
  return localStorage.getItem('bookmed_token')
}

function setToken(token) {
  if (token) localStorage.setItem('bookmed_token', token)
  else localStorage.removeItem('bookmed_token')
}

function authHeaders() {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

async function handleResponse(resp) {
  if (!resp.ok) {
    let message = `Request failed (${resp.status})`
    try {
      const data = await resp.json()
      if (data.detail) message = data.detail
    } catch {}
    throw new Error(message)
  }
  return resp.json()
}

export const api = {
  getToken,
  setToken,

  async login(email, password) {
    const resp = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await handleResponse(resp)
    setToken(data.access_token)
    return data
  },

  async logout() {
    setToken(null)
  },

  async getMe() {
    const resp = await fetch(`${API_BASE}/auth/me`, {
      headers: authHeaders(),
    })
    return handleResponse(resp)
  },

  async getAllAppointments() {
    const resp = await fetch(`${API_BASE}/appointments`, {
      headers: authHeaders(),
    })
    return handleResponse(resp)
  },

  async getAppointmentsByPhone(phone) {
    const resp = await fetch(`${API_BASE}/appointments/phone/${phone}`, {
      headers: { 'Content-Type': 'application/json' },
    })
    return handleResponse(resp)
  },

  async createAppointment(data) {
    const resp = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return handleResponse(resp)
  },

  async updateAppointment(id, data) {
    const resp = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(resp)
  },
}
