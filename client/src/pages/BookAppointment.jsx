'use client';

import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getDoctor } from '../redux/slices/doctorSlice'
import { bookAppointment, resetBookingSuccess } from '../redux/slices/appointmentSlice'
import { toast } from 'react-toastify'

function BookAppointment() {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { doctor, loading: doctorLoading } = useSelector((state) => state.doctor)
  const { loading: bookingLoading, bookingSuccess, error } = useSelector(
    (state) => state.appointment
  )

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    symptoms: '',
  })

  useEffect(() => {
    dispatch(getDoctor(doctorId))
  }, [dispatch, doctorId])

  useEffect(() => {
    if (bookingSuccess) {
      toast.success('Appointment booked successfully!')
      dispatch(resetBookingSuccess())
      navigate('/my-appointments')
    }
  }, [bookingSuccess, dispatch, navigate])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.date || !formData.time) {
      toast.error('Please select date and time')
      return
    }

    dispatch(
      bookAppointment({
        doctorId,
        date: formData.date,
        time: formData.time,
        symptoms: formData.symptoms,
      })
    )
  }

  // Generate time slots based on doctor's availability
  const generateTimeSlots = () => {
    if (!doctor?.timeFrom || !doctor?.timeTo) return []

    const slots = []
    const start = parseInt(doctor.timeFrom.split(':')[0])
    const end = parseInt(doctor.timeTo.split(':')[0])

    for (let hour = start; hour < end; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  if (doctorLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Doctor not found</div>
        <Link to="/doctors" className="btn btn-primary">
          Back to Doctors
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/doctors">Doctors</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/doctors/${doctor._id}`}>{doctor.name}</Link>
          </li>
          <li className="breadcrumb-item active">Book Appointment</li>
        </ol>
      </nav>

      <div className="row">
        {/* Doctor Info Card */}
        <div className="col-lg-4 mb-4">
          <div className="card">
            <div className="card-body text-center">
              {doctor?.image ? (
                <img
                  src={doctor.image || "/placeholder.svg"}
                  alt={doctor.name}
                  className="profile-image mb-3"
                />
              ) : (
                <div className="profile-image bg-light d-flex align-items-center justify-content-center mx-auto mb-3">
                  <i className="bi bi-person-fill fs-1 text-muted"></i>
                </div>
              )}
              <h5>{doctor?.name}</h5>
              <p className="text-primary mb-1">{doctor?.speciality}</p>
              <p className="text-muted small mb-2">{doctor?.hospital}</p>
              <p className="fw-bold text-success mb-0">
                <i className="bi bi-currency-dollar"></i>
                {doctor?.fee} / consultation
              </p>
              <hr />
              <p className="small text-muted mb-0">
                <i className="bi bi-clock me-1"></i>
                Available: {doctor?.timeFrom} - {doctor?.timeTo}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-calendar-plus me-2"></i>
                Book Appointment
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-calendar me-1"></i>
                    Select Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-clock me-1"></i>
                    Select Time Slot
                  </label>
                  <div className="d-flex flex-wrap">
                    {timeSlots.length > 0 ? (
                      timeSlots.map((slot) => (
                        <div
                          key={slot}
                          className={`time-slot ${
                            formData.time === slot ? 'selected' : ''
                          }`}
                          onClick={() => setFormData({ ...formData, time: slot })}
                        >
                          {slot}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No time slots available</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-clipboard2-pulse me-1"></i>
                    Describe Your Symptoms (Optional)
                  </label>
                  <textarea
                    className="form-control"
                    name="symptoms"
                    rows="4"
                    value={formData.symptoms}
                    onChange={handleChange}
                    placeholder="Describe your symptoms or reason for visit..."
                  ></textarea>
                </div>

                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Note:</strong> Consultation fee of ${doctor?.fee} will be
                  collected at the time of appointment.
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Booking...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Confirm Booking
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment
