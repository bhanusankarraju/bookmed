import { supabase } from '@/lib/supabaseClient'

function getToken() {
  return localStorage.getItem('bookmed_token')
}

function setToken(token) {
  if (token) localStorage.setItem('bookmed_token', token)
  else localStorage.removeItem('bookmed_token')
}

export function getDoctorInfo() {
  const raw = localStorage.getItem('bookmed_doctor')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function setDoctorInfo(doctor) {
  if (doctor) localStorage.setItem('bookmed_doctor', JSON.stringify(doctor))
  else localStorage.removeItem('bookmed_doctor')
}

export const api = {
  getToken,
  setToken,
  getDoctorInfo,

  async login(email, password) {
    const { data, error } = await supabase
      .from('doctors')
      .select('id, email, name, password, department')
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
    const doctor = { id: data.id, email: data.email, name: data.name, department: data.department }
    setDoctorInfo(doctor)
    return { access_token: fakeToken, doctor }
  },

  async logout() {
    setToken(null)
    setDoctorInfo(null)
  },

  async getMe() {
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    return getDoctorInfo() || { authenticated: true }
  },

  async getAllAppointments() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  },

  async getAppointmentsByDepartment(department) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('department', department)
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
        age: data.age || null,
        gender: data.gender || null,
        cause_of_visit: data.cause_of_visit || null,
        status: 'Pending',
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return row
  },

  async updateAppointmentStatus(id, status) {
    const { data: row, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return row
  },
}
