import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Experiences from './pages/Experiences'
import ExperienceDetail from './pages/ExperienceDetail'
import Admin from './pages/Admin'
import Auth from './pages/Auth'
import MyBookings from './pages/MyBookings'
import Profile from './pages/Profile'
import GroupEvents from './pages/GroupEvents'
import LegalPage from './pages/LegalPage'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import ForgotPassword from './pages/ForgetPassword'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/experience/:id" element={<ExperienceDetail />} />
        <Route path="/group-events" element={<GroupEvents />} />
        <Route path="/terms" element={<LegalPage page="terms" />} />
        <Route path="/privacy" element={<LegalPage page="privacy" />} />
        <Route path="/cancellation-refund-policy" element={<LegalPage page="refunds" />} />
        <Route path="/service-delivery-policy" element={<LegalPage page="delivery" />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/forgotpassword" element={<ForgotPassword/>} />
        <Route path="/forgotpassword/:token" element={<ForgotPassword/>} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
