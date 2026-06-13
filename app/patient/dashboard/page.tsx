'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import Link from 'next/link';

type Appointment = {
  id: string;
  patient_name: string;
  patient_phone: string;
  department: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  created_at: string;
};

const DEPARTMENTS = ['General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics'];
const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
];

function PatientDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phone = searchParams.get('phone') || '';
  const patientPhone = `+91${phone}`;

  const [patientName, setPatientName] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMyAppointments = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_phone', patientPhone)
      .order('created_at', { ascending: false });
    if (error) {
      toast.error('Failed to fetch appointments');
    } else {
      setAppointments(data || []);
    }
    setIsLoading(false);
  }, [patientPhone]);

  useEffect(() => {
    if (!phone) {
      router.push('/patient/login');
      return;
    }
    fetchMyAppointments();
  }, [phone, router, fetchMyAppointments]);

  useEffect(() => {
    const channel = supabase
      .channel('patient-appointments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        () => { fetchMyAppointments(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchMyAppointments]);

  const handleBookAppointment = async () => {
    if (!patientName.trim()) { toast.error('Please enter patient name'); return; }
    if (!department) { toast.error('Please select a department'); return; }
    if (!selectedDate) { toast.error('Please select a date'); return; }
    if (!selectedTime) { toast.error('Please select a time slot'); return; }

    setIsSubmitting(true);
    const { error } = await supabase.from('appointments').insert({
      patient_name: patientName.trim(),
      patient_phone: patientPhone,
      department,
      appointment_date: format(selectedDate, 'yyyy-MM-dd'),
      appointment_time: selectedTime,
      status: 'Confirmed',
    });
    if (error) {
      toast.error('Failed to book appointment');
    } else {
      toast.success('Appointment booked successfully!');
      setPatientName('');
      setDepartment('');
      setSelectedDate(undefined);
      setSelectedTime('');
      fetchMyAppointments();
    }
    setIsSubmitting(false);
  };

  const statusBadge = (status: string) => {
    if (status === 'Confirmed')
      return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100"><CheckCircle2 className="w-3 h-3 mr-1" />{status}</Badge>;
    return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
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
            <Button variant="ghost" size="sm" onClick={() => router.push('/patient/login')} className="text-emerald-700 hover:text-red-600 hover:bg-red-50">
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
                  <CardTitle className="text-emerald-900">Book Appointment</CardTitle>
                  <CardDescription className="text-emerald-600/70">Schedule your visit</CardDescription>
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
                      onSelect={(date) => { setSelectedDate(date); setCalendarOpen(false); }}
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
                onClick={handleBookAppointment}
                className="w-full eco-gradient text-white font-semibold hover:opacity-90 transition-opacity shadow-md shadow-emerald-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <CalendarPlus className="w-4 h-4 mr-2" />}
                {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
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
                  <p className="text-sm text-emerald-400 mt-1">Book your first appointment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="p-4 rounded-xl border border-emerald-100 bg-white hover:bg-emerald-50/30 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 min-w-0">
                          <p className="font-semibold text-emerald-900 truncate">{apt.patient_name}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                              {apt.department}
                            </Badge>
                            <span className="text-xs text-emerald-600">{apt.appointment_date}</span>
                            <span className="text-xs text-emerald-500">{apt.appointment_time}</span>
                          </div>
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
  );
}

export default function PatientDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    }>
      <PatientDashboardContent />
    </Suspense>
  );
}
