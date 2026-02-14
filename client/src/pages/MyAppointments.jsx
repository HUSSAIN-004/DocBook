'use client';

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyAppointments, cancelAppointment } from '../redux/slices/appointmentSlice'
import { toast } from 'react-toastify'

function MyAppointments() {
  const dispatch = useDispatch()
  const { appointments, loading } = useSelector((state) => state.appointment)

  useEffect(() => {
    dispatch(getMyAppointments())
  }, [dispatch])

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      const result = await dispatch(cancelAppointment(id))
      if (cancelAppointment.fulfilled.match(result)) {
        toast.success('Appointment cancelled')
      } else {
        toast.error('Failed to cancel appointment')
      }
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

      {appointments?.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          You don't have any appointments yet.
        </div>
      ) : (
        <div className="row g-4">
          {appointments?.map((appointment) => (
            <div key={appointment._id} className="col-12">
              <div className={`card appointment-card ${appointment.status}`}>
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-2 text-center mb-3 mb-md-0">
                      {appointment?.doctorInfo?.image ? (
                        <img
                          src={appointment.doctorInfo.image || "/placeholder.svg"}
                          alt={appointment.doctorInfo.name}
                          className="profile-image"
                        />
                      ) : (
                        <div className="profile-image bg-light d-flex align-items-center justify-content-center mx-auto">
                          <i className="bi bi-person-fill fs-1 text-muted"></i>
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <h5 className="mb-1">{appointment?.doctorInfo?.name}</h5>
                      <p className="text-primary mb-1">
                        <i className="bi bi-clipboard2-pulse me-1"></i>
                        {appointment?.doctorInfo?.speciality}
                      </p>
                      <p className="text-muted small mb-1">
                        <i className="bi bi-building me-1"></i>
                        {appointment?.doctorInfo?.hospital}
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
                      <p className="mb-1">
                        <i className="bi bi-clock me-1"></i>
                        {appointment?.time}
                      </p>
                      <p className="fw-bold text-success mb-0">
                        ${appointment?.doctorInfo?.fee}
                      </p>
                    </div>
                    <div className="col-md-2 text-center">
                      <span
                        className={`badge ${getStatusBadge(appointment?.status)} status-badge mb-2`}
                      >
                        {appointment?.status?.toUpperCase()}
                      </span>
                      {appointment?.status === 'pending' && (
                        <button
                          className="btn btn-outline-danger btn-sm d-block mx-auto"
                          onClick={() => handleCancel(appointment._id)}
                        >
                          Cancel
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

export default MyAppointments
