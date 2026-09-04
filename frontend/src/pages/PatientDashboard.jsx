import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Leaf,
  CalendarPlus,
  Stethoscope,
  Clock,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  LogOut,
  RefreshCw,
  Phone,
  Hourglass,
  HeartPulse,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarPicker } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { api } from '@/lib/api'

const DEPARTMENTS = [
  'General Medicine',
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Gynecology',
  'ENT',
  'Psychiatry',
  'Ophthalmology',
  'Dental',
  'Gastroenterology',
]
const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
]

export default function PatientDashboard() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const phone = searchParams.get('phone') || ''

  const [patientName, setPatientName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [causeOfVisit, setCauseOfVisit] = useState('')
  const [department, setDepartment] = useState('')
  const [selectedDate, setSelectedDate] = useState(undefined)
  const [selectedTime, setSelectedTime] = useState('')
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const prevStatusRef = useRef({})

  const fetchMyAppointments = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await api.getAppointmentsByPhone(phone)
      setAppointments(data)
    } catch {
      toast.error('Failed to fetch appointments')
    }
    setIsLoading(false)
  }, [phone])

  useEffect(() => {
    if (!phone) {
      navigate('/patient/login')
      return
    }
    fetchMyAppointments()
  }, [phone, navigate, fetchMyAppointments])

  useEffect(() => {
    if (!phone) return
    const interval = setInterval(() => {
      fetchMyAppointments()
    }, 5000)
    return () => clearInterval(interval)
  }, [phone, fetchMyAppointments])

  useEffect(() => {
    const prev = prevStatusRef.current
    const next = {}
    for (const apt of appointments) {
      next[apt.id] = apt.status
      if (prev[apt.id] && prev[apt.id] !== apt.status) {
        if (apt.status === 'Confirmed') {
          toast.success(`Your appointment with ${apt.department} on ${apt.appointment_date} at ${apt.appointment_time} has been ACCEPTED!`, { duration: 8000 })
        } else if (apt.status === 'Cancelled') {
          toast.error(`Your appointment with ${apt.department} on ${apt.appointment_date} has been CANCELLED by the doctor.`, { duration: 8000 })
        }
      }
    }
    prevStatusRef.current = next
  }, [appointments])

  const handleRequestAppointment = async () => {
    if (!patientName.trim()) { toast.error('Please enter patient name'); return }
    if (!age.trim()) { toast.error('Please enter your age'); return }
    if (!gender) { toast.error('Please select your gender'); return }
    if (!causeOfVisit.trim()) { toast.error('Please describe your symptoms or reason for visit'); return }
    if (!department) { toast.error('Please select a department'); return }
    if (!selectedDate) { toast.error('Please select a date'); return }
    if (!selectedTime) { toast.error('Please select a time slot'); return }

    setIsSubmitting(true)
    try {
      await api.createAppointment({
        patient_name: patientName.trim(),
        patient_phone: `+91${phone}`,
        department,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime,
        age: parseInt(age, 10),
        gender,
        cause_of_visit: causeOfVisit.trim(),
      })
      toast.success('Appointment request submitted! The doctor will review and respond.')
      setPatientName('')
      setAge('')
      setGender('')
      setCauseOfVisit('')
      setDepartment('')
      setSelectedDate(undefined)
      setSelectedTime('')
      fetchMyAppointments()
    } catch {
      toast.error('Failed to submit appointment request')
    }
    setIsSubmitting(false)
  }

  const statusBadge = (status) => {
    if (status === 'Confirmed')
      return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100"><CheckCircle2 className="w-3 h-3 mr-1" />Accepted</Badge>
    if (status === 'Pending')
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100"><Hourglass className="w-3 h-3 mr-1" />Pending</Badge>
    return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl eco-gradient flex items-center justify-center shadow-lg shadow-emerald-200">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-900 tracking-tight">BookMed Patient Portal</h1>
              <p className="text-xs text-emerald-600/70 font-medium">Patient Dashboard</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border-emerald-200">
              <Phone className="w-3 h-3" />+91{phone}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => navigate('/patient/login')} className="text-emerald-700 hover:text-red-600 hover:bg-red-50">
              <LogOut className="w-4 h-4 mr-1" />Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <Card className="border-emerald-100 shadow-lg shadow-emerald-50 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-green-50 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CalendarPlus className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <CardTitle className="text-emerald-900">Request Appointment</CardTitle>
                  <CardDescription className="text-emerald-600/70">Submit a request for doctor review</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-emerald-800 font-medium">
                  <User className="w-3.5 h-3.5 inline mr-1" />Patient Name
                </Label>
                <Input
                  placeholder="Enter your full name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-emerald-800 font-medium">Age</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 32"
                    value={age}
                    onChange={(e) => setAge(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-emerald-800 font-medium">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="border-emerald-200 focus:ring-emerald-500">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-emerald-800 font-medium">
                  <HeartPulse className="w-3.5 h-3.5 inline mr-1" />Reason for Visit
                </Label>
                <Input
                  placeholder="Describe your symptoms or reason for appointment"
                  value={causeOfVisit}
                  onChange={(e) => setCauseOfVisit(e.target.value)}
                  className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-emerald-800 font-medium">
                  <Stethoscope className="w-3.5 h-3.5 inline mr-1" />Department
                </Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="border-emerald-200 focus:ring-emerald-500">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-emerald-800 font-medium">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />Appointment Date
                </Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900">
                      <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => { setSelectedDate(date); setCalendarOpen(false) }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-emerald-800 font-medium">
                  <Clock className="w-3.5 h-3.5 inline mr-1" />Time Slot
                </Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((ts) => (
                    <Button
                      key={ts}
                      variant={selectedTime === ts ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTime(ts)}
                      className={selectedTime === ts
                        ? 'eco-gradient text-white shadow-sm shadow-emerald-200 border-0'
                        : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300'}
                    >
                      {ts}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="bg-emerald-100" />

              <Button
                onClick={handleRequestAppointment}
                className="w-full eco-gradient text-white font-semibold hover:opacity-90 transition-opacity shadow-md shadow-emerald-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <CalendarPlus className="w-4 h-4 mr-2" />}
                {isSubmitting ? 'Submitting...' : 'Request Appointment'}
              </Button>
            </CardContent>
          </Card>

          {/* My Appointments */}
          <Card className="border-emerald-100 shadow-lg shadow-emerald-50 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <CardTitle className="text-emerald-900">My Appointments</CardTitle>
                    <CardDescription className="text-emerald-600/70">Your booking history</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={fetchMyAppointments} className="text-emerald-600 hover:bg-emerald-50" disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {appointments.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                    <CalendarPlus className="w-8 h-8 text-emerald-300" />
                  </div>
                  <p className="text-emerald-600/60 font-medium">No appointments yet</p>
                  <p className="text-sm text-emerald-400 mt-1">Request your first appointment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="p-4 rounded-xl border border-emerald-100 bg-white hover:bg-emerald-50/30 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <p className="font-semibold text-emerald-900 truncate">{apt.patient_name}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                              {apt.department}
                            </Badge>
                            <span className="text-xs text-emerald-600">{apt.appointment_date}</span>
                            <span className="text-xs text-emerald-500">{apt.appointment_time}</span>
                          </div>
                          {(apt.age || apt.gender) && (
                            <p className="text-xs text-emerald-500/70">
                              {apt.age && `${apt.age} yrs`} {apt.age && apt.gender && '·'} {apt.gender}
                            </p>
                          )}
                          {apt.cause_of_visit && (
                            <p className="text-xs text-emerald-600/80 italic truncate">
                              Reason: {apt.cause_of_visit}
                            </p>
                          )}
                        </div>
                        {statusBadge(apt.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
