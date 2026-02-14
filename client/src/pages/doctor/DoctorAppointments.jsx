'use client';

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDoctorAppointments, updateAppointmentStatus } from '../../redux/slices/appointmentSlice'
import { toast } from 'react-toastify'

function DoctorAppointments() {
  const dispatch = useDispatch()
  const { doctorAppointments, loading } = useSelector((state) => state.appointment)

  useEffect(() => {
    dispatch(getDoctorAppointments())
  }, [dispatch])

  const handleStatusChange = async (id, status) => {
    const result = await dispatch(updateAppointmentStatus({ id, status }))
    if (updateAppointmentStatus.fulfilled.match(result)) {
      toast.success(`Appointment ${status}`)
    } else {
      toast.error('Failed to update appointment')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning text-dark',
      approved: 'bg-success',
      completed: 'bg-info',
      cancelled: 'bg-danger',
    }
    return badges[status] || 'bg-secondary'
  }

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
      <h1 className="mb-4">
        <i className="bi bi-calendar-check me-2"></i>
        My Appointments
      </h1>

      {doctorAppointments?.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No appointments yet.
        </div>
      ) : (
        <div className="row g-4">
          {doctorAppointments?.map((appointment) => (
            <div key={appointment._id} className="col-12">
              <div className={`card appointment-card ${appointment.status}`}>
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-2 text-center mb-3 mb-md-0">
                      {appointment?.userInfo?.image ? (
                        <img
                          src={appointment.userInfo.image || "/placeholder.svg"}
                          alt={appointment.userInfo.username}
                          className="profile-image"
                        />
                      ) : (
                        <div className="profile-image bg-light d-flex align-items-center justify-content-center mx-auto">
                          <i className="bi bi-person-fill fs-1 text-muted"></i>
                        </div>
                      )}
                    </div>
                    <div className="col-md-5">
                      <h5 className="mb-1">{appointment?.userInfo?.username}</h5>
                      <p className="text-muted mb-1">
                        <i className="bi bi-envelope me-1"></i>
                        {appointment?.userInfo?.email}
                      </p>
                      {appointment?.symptoms && (
                        <p className="small mb-0">
                          <strong>Symptoms:</strong> {appointment.symptoms}
                        </p>
                      )}
                    </div>
                    <div className="col-md-2 text-center">
                      <p className="mb-1">
                        <i className="bi bi-calendar me-1"></i>
                        {appointment?.date}
                      </p>
                      <p className="mb-0">
                        <i className="bi bi-clock me-1"></i>
                        {appointment?.time}
                      </p>
                    </div>
                    <div className="col-md-3 text-center">
                      <span
                        className={`badge ${getStatusBadge(appointment?.status)} status-badge mb-2 d-block`}
                      >
                        {appointment?.status?.toUpperCase()}
                      </span>
                      {appointment?.status === 'pending' && (
                        <div className="d-flex gap-1 justify-content-center">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleStatusChange(appointment._id, 'approved')}
                          >
                            <i className="bi bi-check"></i> Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                          >
                            <i className="bi bi-x"></i> Reject
                          </button>
                        </div>
                      )}
                      {appointment?.status === 'approved' && (
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => handleStatusChange(appointment._id, 'completed')}
                        >
                          <i className="bi bi-check-all"></i> Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorAppointments
