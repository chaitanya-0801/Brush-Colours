import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Experiences from './pages/Experiences'
import ExperienceDetail from './pages/ExperienceDetail'
import Admin from './pages/Admin'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/experience/:id" element={<ExperienceDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
