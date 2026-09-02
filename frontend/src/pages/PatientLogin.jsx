import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Leaf, Phone, ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function PatientLogin() {
  const navigate = useNavigate()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [otpValues, setOtpValues] = useState(['', '', '', ''])

  const handleSendOtp = () => {
    const clean = phoneNumber.replace(/\D/g, '')
    if (clean.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number')
      return
    }
    setShowOtp(true)
    toast.warning('Demo Mode OTP: 1234', {
      description: 'Enter 1234 to verify your phone number',
      duration: 6000,
    })
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otpValues]
    newOtp[index] = value.slice(-1)
    setOtpValues(newOtp)
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleVerifyOtp = () => {
    const otp = otpValues.join('')
    if (otp === '1234') {
      toast.success('Phone verified successfully!')
      navigate(`/patient/dashboard?phone=${phoneNumber}`)
    } else {
      toast.error('Invalid OTP. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="glass border-b border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl eco-gradient flex items-center justify-center shadow-lg shadow-emerald-200">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-900 tracking-tight">BookMed</h1>
              <p className="text-xs text-emerald-600/70 font-medium">Patient Portal</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Centered Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-emerald-100 shadow-2xl shadow-emerald-100/40 overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-emerald-50 to-green-50 pb-8 text-center">
            <div className="w-16 h-16 rounded-2xl eco-gradient flex items-center justify-center shadow-lg shadow-emerald-200 mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-emerald-900 text-2xl">Patient Sign In</CardTitle>
            <CardDescription className="text-emerald-600/70">
              Verify your mobile number to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 space-y-6">
            {!showOtp ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-emerald-800 font-medium">
                    Mobile Number
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-4 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold text-sm shrink-0">
                      +91
                    </div>
                    <Input
                      id="phone"
                      placeholder="Enter 10-digit number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="flex-1 border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                      maxLength={10}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSendOtp}
                  className="w-full eco-gradient text-white font-semibold hover:opacity-90 transition-opacity shadow-md shadow-emerald-200"
                  disabled={phoneNumber.length !== 10}
                >
                  Send OTP <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label className="text-emerald-800 font-medium">
                    Enter OTP sent to +91{phoneNumber}
                  </Label>
                  <div className="flex gap-3 justify-center py-3">
                    {otpValues.map((val, i) => (
                      <Input
                        key={i}
                        id={`otp-${i}`}
                        className="w-14 h-14 text-center text-2xl font-bold border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                        value={val}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        maxLength={1}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  onClick={handleVerifyOtp}
                  className="w-full eco-gradient text-white font-semibold hover:opacity-90 transition-opacity shadow-md shadow-emerald-200"
                  disabled={otpValues.some((v) => !v)}
                >
                  <ShieldCheck className="w-4 h-4 mr-2" /> Verify &amp; Continue
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-emerald-600"
                  onClick={() => {
                    setShowOtp(false)
                    setOtpValues(['', '', '', ''])
                  }}
                >
                  Change Number
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
