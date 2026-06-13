'use client';

import { Leaf, Stethoscope, ArrowRight, TreePine, ShieldCheck, Activity, Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl eco-gradient flex items-center justify-center shadow-lg shadow-emerald-200">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-emerald-900 tracking-tight">BookMed</h1>
            <p className="text-xs text-emerald-600/70 font-medium">Paperless Healthcare</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden eco-gradient px-6 py-16 sm:py-24 text-white">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-8 right-12 w-40 h-40 rounded-full border-2 border-white/20" />
            <div className="absolute bottom-6 left-16 w-24 h-24 rounded-full border-2 border-white/15" />
            <div className="absolute top-16 left-1/3 w-20 h-20 rounded-full border-2 border-white/10" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-2 text-emerald-100">
              <TreePine className="w-5 h-5" />
              <span className="text-sm font-medium tracking-widest uppercase">Sustainable Healthcare</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Welcome to the<br />
              <span className="text-emerald-100">BookMed Appointment Ecosystem</span>
            </h2>
            <p className="text-emerald-50/90 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Access your patient portal or staff dashboard. Paperless tracking, real-time updates, and eco-friendly care management.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <div className="flex items-center gap-2 bg-white/15 rounded-lg px-4 py-2 backdrop-blur-sm">
                <Leaf className="w-4 h-4" />
                <span className="text-sm font-medium">Zero Paper Waste</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 rounded-lg px-4 py-2 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-sm font-medium">Secure Records</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 rounded-lg px-4 py-2 backdrop-blur-sm">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Real-time Tracking</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Portal Cards */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-16 w-full">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Patient Portal */}
            <Link href="/patient/login" className="group block">
              <Card className="h-full border-emerald-100 shadow-xl shadow-emerald-100/40 overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-emerald-200/50 group-hover:-translate-y-1 group-hover:border-emerald-300">
                <CardHeader className="bg-gradient-to-br from-emerald-50 to-green-50 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl eco-gradient flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform duration-300">
                      <Leaf className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-emerald-900 text-xl">Patient Portal</CardTitle>
                      <CardDescription className="text-emerald-600/70">
                        Book &amp; manage appointments
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 pb-8 space-y-4">
                  <ul className="space-y-2.5 text-sm text-emerald-700">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Mobile number verification
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Instant appointment booking
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Track your appointment history
                    </li>
                  </ul>
                  <Button className="w-full eco-gradient text-white font-semibold shadow-md shadow-emerald-200 group-hover:shadow-lg transition-shadow">
                    Enter Portal <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Medical Staff Portal */}
            <Link href="/doctor/login" className="group block">
              <Card className="h-full border-slate-200 shadow-xl shadow-slate-100/40 overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-slate-200/50 group-hover:-translate-y-1 group-hover:border-slate-300">
                <CardHeader className="bg-gradient-to-br from-slate-50 to-gray-50 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg shadow-slate-300 group-hover:scale-105 transition-transform duration-300">
                      <Stethoscope className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-900 text-xl">Medical Staff Portal</CardTitle>
                      <CardDescription className="text-slate-500">
                        Admin &amp; appointment control
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 pb-8 space-y-4">
                  <ul className="space-y-2.5 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Secure email/password login
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Real-time appointment dashboard
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Cancel or manage bookings
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white font-semibold shadow-md shadow-slate-300 group-hover:shadow-lg transition-shadow hover:opacity-90">
                    Enter Portal <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-emerald-100">
        <div className="flex items-center justify-center gap-2 text-emerald-600/50">
          <Heart className="w-4 h-4" />
          <span className="text-sm">BookMed — Sustainable Healthcare for All</span>
        </div>
      </footer>
    </div>
  );
}
