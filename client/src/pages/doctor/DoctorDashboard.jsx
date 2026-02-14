'use client';

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getDoctorProfile } from '../../redux/slices/doctorSlice'
import { getDoctorAppointments } from '../../redux/slices/appointmentSlice'

function DoctorDashboard() {
  const dispatch = useDispatch()
  const { doctorProfile, loading: profileLoading } = useSelector((state) => state.doctor)
  const { doctorAppointments, loading: appointmentsLoading } = useSelector(
    (state) => state.appointment
  )

  useEffect(() => {
    dispatch(getDoctorProfile())
    dispatch(getDoctorAppointments())
  }, [dispatch])

  const loading = profileLoading || appointmentsLoading

  const pendingAppointments = doctorAppointments?.filter(
    (a) => a.status === 'pending'
  ).length || 0
  const approvedAppointments = doctorAppointments?.filter(
    (a) => a.status === 'approved'
  ).length || 0
  const completedAppointments = doctorAppointments?.filter(
    (a) => a.status === 'completed'
  ).length || 0
  const totalAppointments = doctorAppointments?.length || 0

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="bi bi-speedometer2 me-2"></i>
          Doctor Dashboard
        </h1>
        <span className={`badge ${doctorProfile?.status === 'approved' ? 'bg-success' : 'bg-warning'}`}>
          {doctorProfile?.status?.toUpperCase()}
        </span>
      </div>

      {/* Welcome Card */}
      <div className="card bg-primary text-white mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h3>Welcome, Dr. {doctorProfile?.name}!</h3>
              <p className="mb-0 opacity-75">
                {doctorProfile?.speciality} | {doctorProfile?.hospital}
              </p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <Link to="/doctor/profile" className="btn btn-light">
                <i className="bi bi-pencil me-1"></i>
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card dashboard-card h-100">
            <div className="card-body text-center">
              <i className="bi bi-calendar-check text-primary fs-1 mb-2"></i>
              <p className="dashboard-stat text-primary mb-0">{totalAppointments}</p>
              <p className="text-muted mb-0">Total Appointments</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card h-100">
            <div className="card-body text-center">
              <i className="bi bi-hourglass-split text-warning fs-1 mb-2"></i>
              <p className="dashboard-stat text-warning mb-0">{pendingAppointments}</p>
              <p className="text-muted mb-0">Pending</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card h-100">
            <div className="card-body text-center">
              <i className="bi bi-check-circle text-success fs-1 mb-2"></i>
              <p className="dashboard-stat text-success mb-0">{approvedAppointments}</p>
              <p className="text-muted mb-0">Approved</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card h-100">
            <div className="card-body text-center">
              <i className="bi bi-clipboard-check text-info fs-1 mb-2"></i>
              <p className="dashboard-stat text-info mb-0">{completedAppointments}</p>
              <p className="text-muted mb-0">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-clock-history me-2"></i>
            Recent Appointments
          </h5>
          <Link to="/doctor/appointments" className="btn btn-primary btn-sm">
            View All
          </Link>
        </div>
        <div className="card-body">
          {doctorAppointments?.length === 0 ? (
            <p className="text-muted text-center mb-0">No appointments yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorAppointments?.slice(0, 5).map((appointment) => (
                    <tr key={appointment._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {appointment?.userInfo?.image ? (
                            <img
                              src={appointment.userInfo.image || "/placeholder.svg"}
                              alt={appointment.userInfo.username}
                              className="small-avatar me-2"
                            />
                          ) : (
                            <i className="bi bi-person-circle fs-4 me-2"></i>
                          )}
                          {appointment?.userInfo?.username}
                        </div>
                      </td>
                      <td>{appointment?.date}</td>
                      <td>{appointment?.time}</td>
                      <td>
                        <span
                          className={`badge ${
                            appointment?.status === 'pending'
                              ? 'bg-warning text-dark'
                              : appointment?.status === 'approved'
                              ? 'bg-success'
                              : appointment?.status === 'completed'
                              ? 'bg-info'
                              : 'bg-danger'
                          }`}
                        >
                          {appointment?.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
