import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Stethoscope,
  Activity,
  Clock,
  Calendar,
  User,
  XCircle,
  CheckCircle2,
  LogOut,
  RefreshCw,
  Phone,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/api'

export default function DoctorDashboard() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const token = api.getToken()
      if (!token) {
        navigate('/doctor/login')
        return
      }
      try {
        await api.getMe()
        setIsAuthed(true)
      } catch {
        navigate('/doctor/login')
      }
    }
    checkSession()
  }, [navigate])

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await api.getAllAppointments()
      setAppointments(data)
    } catch {
      toast.error('Failed to fetch appointments')
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isAuthed) {
      fetchAppointments()
    }
  }, [isAuthed, fetchAppointments])

  // Polling for real-time updates every 5 seconds
  useEffect(() => {
    if (!isAuthed) return
    const interval = setInterval(() => {
      fetchAppointments()
    }, 5000)
    return () => clearInterval(interval)
  }, [isAuthed, fetchAppointments])

  const handleCancelAppointment = async (id) => {
    try {
      await api.updateAppointment(id, { status: 'Cancelled' })
      toast.success('Appointment cancelled')
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'Cancelled' } : a))
      )
    } catch {
      toast.error('Failed to cancel appointment')
    }
  }

  const handleLogout = async () => {
    await api.logout()
    navigate('/doctor/login')
  }

  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length

  const statusBadge = (status) => {
    if (status === 'Confirmed')
      return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100"><CheckCircle2 className="w-3 h-3 mr-1" />{status}</Badge>
    return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />{status}</Badge>
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg shadow-slate-300">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">BookMed Clinical Administration Hub</h1>
              <p className="text-xs text-slate-500 font-medium">Medical Staff Dashboard</p>
            </div>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-600 hover:text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-1" />Logout
          </Button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{appointments.length}</p>
                  <p className="text-xs text-slate-500 font-medium">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-emerald-100 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">{confirmedCount}</p>
                  <p className="text-xs text-emerald-500 font-medium">Confirmed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-100 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{cancelledCount}</p>
                  <p className="text-xs text-red-400 font-medium">Cancelled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">Live</p>
                  <p className="text-xs text-slate-500 font-medium">Real-time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full-Width Data Table */}
        <Card className="border-slate-200 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-slate-50 to-gray-50 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <CardTitle className="text-slate-900">Appointment Administration</CardTitle>
                  <CardDescription className="text-slate-500">All clinic bookings in real-time</CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAppointments}
                className="border-slate-200 text-slate-600 hover:bg-slate-50"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {appointments.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No appointments recorded</p>
                <p className="text-sm text-slate-400 mt-1">Waiting for patient bookings</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-100 hover:bg-transparent bg-slate-50/50">
                      <TableHead className="text-slate-600 font-semibold">Patient</TableHead>
                      <TableHead className="text-slate-600 font-semibold">Contact</TableHead>
                      <TableHead className="text-slate-600 font-semibold">Department</TableHead>
                      <TableHead className="text-slate-600 font-semibold">Date</TableHead>
                      <TableHead className="text-slate-600 font-semibold">Time</TableHead>
                      <TableHead className="text-slate-600 font-semibold">Status</TableHead>
                      <TableHead className="text-slate-600 font-semibold text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((apt) => (
                      <TableRow key={apt.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-slate-500" />
                            </div>
                            <span className="font-medium text-slate-900">{apt.patient_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                            <Phone className="w-3.5 h-3.5" />{apt.patient_phone}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">
                            {apt.department}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm text-slate-700">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />{apt.appointment_date}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />{apt.appointment_time}
                          </div>
                        </TableCell>
                        <TableCell>{statusBadge(apt.status)}</TableCell>
                        <TableCell className="text-right">
                          {apt.status !== 'Cancelled' ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelAppointment(apt.id)}
                              className="text-xs shadow-sm"
                            >
                              <XCircle className="w-3 h-3 mr-1" />Cancel
                            </Button>
                          ) : (
                            <span className="text-xs text-slate-400">--</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
