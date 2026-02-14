'use client';

import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getDoctor, clearDoctor } from '../redux/slices/doctorSlice'

function DoctorDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { doctor, loading, error } = useSelector((state) => state.doctor)

  useEffect(() => {
    dispatch(getDoctor(id))
    return () => {
      dispatch(clearDoctor())
    }
  }, [dispatch, id])

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error || 'Doctor not found'}
        </div>
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
          <li className="breadcrumb-item active">{doctor?.name}</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card">
            <div className="card-body text-center">
              {doctor?.image ? (
                <img
                  src={doctor.image || "/placeholder.svg"}
                  alt={doctor.name}
                  className="doctor-profile-image mb-3"
                />
              ) : (
                <div className="doctor-profile-image bg-light d-flex align-items-center justify-content-center mx-auto mb-3">
                  <i className="bi bi-person-fill fs-1 text-muted"></i>
                </div>
              )}
              <h3>{doctor?.name}</h3>
              <p className="text-primary mb-1">
                <i className="bi bi-clipboard2-pulse me-1"></i>
                {doctor?.speciality}
              </p>
              <p className="text-muted">
                <i className="bi bi-award me-1"></i>
                {doctor?.degree}
              </p>
              <Link
                to={`/book-appointment/${doctor?._id}`}
                className="btn btn-primary btn-lg w-100"
              >
                <i className="bi bi-calendar-plus me-2"></i>
                Book Appointment
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-person-badge me-2"></i>
                About Doctor
              </h5>
            </div>
            <div className="card-body">
              <p>{doctor?.about || 'No description available.'}</p>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Professional Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-building text-primary fs-4 me-3"></i>
                    <div>
                      <small className="text-muted">Hospital</small>
                      <p className="mb-0 fw-semibold">{doctor?.hospital}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-briefcase text-primary fs-4 me-3"></i>
                    <div>
                      <small className="text-muted">Experience</small>
                      <p className="mb-0 fw-semibold">{doctor?.experience} years</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-currency-dollar text-primary fs-4 me-3"></i>
                    <div>
                      <small className="text-muted">Consultation Fee</small>
                      <p className="mb-0 fw-semibold">${doctor?.fee}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-clock text-primary fs-4 me-3"></i>
                    <div>
                      <small className="text-muted">Available Time</small>
                      <p className="mb-0 fw-semibold">
                        {doctor?.timeFrom} - {doctor?.timeTo}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-geo-alt me-2"></i>
                Contact Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-envelope text-primary fs-4 me-3"></i>
                    <div>
                      <small className="text-muted">Email</small>
                      <p className="mb-0 fw-semibold">{doctor?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-telephone text-primary fs-4 me-3"></i>
                    <div>
                      <small className="text-muted">Phone</small>
                      <p className="mb-0 fw-semibold">{doctor?.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-geo-alt text-primary fs-4 me-3"></i>
                    <div>
                      <small className="text-muted">Address</small>
                      <p className="mb-0 fw-semibold">{doctor?.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetails
