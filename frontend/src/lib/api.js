import { supabase } from '@/lib/supabaseClient'

function getToken() {
  return localStorage.getItem('bookmed_token')
}

function setToken(token) {
  if (token) localStorage.setItem('bookmed_token', token)
  else localStorage.removeItem('bookmed_token')
}

export const api = {
  getToken,
  setToken,

  async login(email, password) {
    const { data, error } = await supabase
      .from('doctors')
      .select('id, email, name, password')
      .eq('email', email.trim())
      .single()

    if (error || !data) {
      throw new Error('Invalid email or password')
    }
    if (data.password !== password) {
      throw new Error('Invalid email or password')
    }

    const fakeToken = btoa(`${data.id}:${Date.now()}`)
    setToken(fakeToken)
    return { access_token: fakeToken, doctor: { id: data.id, email: data.email, name: data.name } }
  },

  async logout() {
    setToken(null)
  },

  async getMe() {
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    return { authenticated: true }
  },

  async getAllAppointments() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  },

  async getAppointmentsByPhone(phone) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_phone', `+91${phone}`)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  },

  async createAppointment(data) {
    const { data: row, error } = await supabase
      .from('appointments')
      .insert({
        patient_name: data.patient_name,
        patient_phone: data.patient_phone,
        department: data.department,
        appointment_date: data.appointment_date,
        appointment_time: data.appointment_time,
        status: data.status || 'Confirmed',
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return row
  },

  async updateAppointment(id, data) {
    const { data: row, error } = await supabase
      .from('appointments')
      .update({ status: data.status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return row
  },
}
