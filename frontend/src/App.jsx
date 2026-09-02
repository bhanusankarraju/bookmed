import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import PatientLogin from './pages/PatientLogin.jsx'
import PatientDashboard from './pages/PatientDashboard.jsx'
import DoctorLogin from './pages/DoctorLogin.jsx'
import DoctorDashboard from './pages/DoctorDashboard.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/patient/login" element={<PatientLogin />} />
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
    </Routes>
  )
}
