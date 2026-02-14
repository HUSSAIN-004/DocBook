'use client';

import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { checkAuth } from './redux/slices/authSlice'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Loader from './components/Loader'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import DoctorRoute from './components/DoctorRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Doctors from './pages/Doctors'
import DoctorDetails from './pages/DoctorDetails'
import BookAppointment from './pages/BookAppointment'
import MyAppointments from './pages/MyAppointments'
import Profile from './pages/Profile'
import ApplyDoctor from './pages/ApplyDoctor'

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorProfile from './pages/doctor/DoctorProfile'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminDoctors from './pages/admin/AdminDoctors'

function App() {
  const dispatch = useDispatch()
  const { checkingAuth } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  if (checkingAuth) {
    return <Loader />
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorDetails />} />

          {/* Protected User Routes */}
          <Route
            path="/book-appointment/:doctorId"
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute>
                <MyAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apply-doctor"
            element={
              <ProtectedRoute>
                <ApplyDoctor />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <DoctorRoute>
                <DoctorDashboard />
              </DoctorRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <DoctorRoute>
                <DoctorAppointments />
              </DoctorRoute>
            }
          />
          <Route
            path="/doctor/profile"
            element={
              <DoctorRoute>
                <DoctorProfile />
              </DoctorRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <AdminRoute>
                <AdminDoctors />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default App
