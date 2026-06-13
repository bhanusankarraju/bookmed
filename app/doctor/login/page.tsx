'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stethoscope, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DoctorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!password.trim()) {
      toast.error('Please enter your password');
      return;
    }
    if (email === 'doctor@ecohealth.com' && password === 'password123') {
      toast.success('Login successful!');
      router.push('/doctor/dashboard');
    } else {
      toast.error('Invalid credentials. Try doctor@ecohealth.com / password123');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="glass border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg shadow-slate-300">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">BookMed</h1>
              <p className="text-xs text-slate-500 font-medium">Medical Staff Access</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Centered Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-slate-50 to-gray-100 pb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-lg shadow-slate-300 mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-slate-900 text-2xl">Medical Staff Login</CardTitle>
            <CardDescription className="text-slate-500">
              Secure access to the clinical dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                <Mail className="w-3.5 h-3.5 inline mr-1" />Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@ecohealth.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-slate-200 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">
                <Lock className="w-3.5 h-3.5 inline mr-1" />Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
                className="border-slate-200 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white font-semibold hover:opacity-90 transition-opacity shadow-md shadow-slate-300"
            >
              Sign In <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-xs text-center text-slate-400">
              Demo: doctor@ecohealth.com / password123
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
