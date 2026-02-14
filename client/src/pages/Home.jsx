'use client';

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getDoctors } from '../redux/slices/doctorSlice'
import DoctorCard from '../components/DoctorCard'

const specialities = [
  { name: 'General Physician', icon: 'bi-heart-pulse' },
  { name: 'Dermatologist', icon: 'bi-bandaid' },
  { name: 'Pediatrician', icon: 'bi-emoji-smile' },
  { name: 'Cardiologist', icon: 'bi-heart' },
  { name: 'Orthopedic', icon: 'bi-person-arms-up' },
  { name: 'Neurologist', icon: 'bi-activity' },
  { name: 'Psychiatrist', icon: 'bi-chat-heart' },
  { name: 'Dentist', icon: 'bi-emoji-laughing' },
]

function Home() {
  const dispatch = useDispatch()
  const { doctors, loading } = useSelector((state) => state.doctor)

  useEffect(() => {
    dispatch(getDoctors())
  }, [dispatch])

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Find & Book Appointment with Your Favorite Doctor
              </h1>
              <p className="lead mb-4">
                Connect with qualified healthcare professionals and book appointments easily. Your health is our priority.
              </p>
              <div className="d-flex gap-3">
                <Link to="/doctors" className="btn btn-light btn-lg">
                  Find Doctors
                </Link>
                <Link to="/apply-doctor" className="btn btn-outline-light btn-lg">
                  Join as Doctor
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <i className="bi bi-hospital display-1"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Specialities Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Browse by Speciality</h2>
          <p className="text-center text-muted mb-5">
            Find doctors by their area of expertise
          </p>
          <div className="row g-3">
            {specialities.map((spec, index) => (
              <div key={index} className="col-6 col-md-3">
                <Link
                  to={`/doctors?speciality=${spec.name}`}
                  className="card speciality-card h-100 text-decoration-none"
                >
                  <div className="card-body text-center py-4">
                    <i className={`bi ${spec.icon} fs-1 text-primary mb-2`}></i>
                    <h6 className="mb-0 text-dark">{spec.name}</h6>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Our Top Doctors</h2>
          <p className="text-center text-muted mb-5">
            Book appointments with the best healthcare professionals
          </p>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {doctors?.slice(0, 4).map((doctor) => (
                <div key={doctor._id} className="col-md-6 col-lg-3">
                  <DoctorCard doctor={doctor} />
                </div>
              ))}
              {doctors?.length === 0 && (
                <div className="col-12 text-center">
                  <p className="text-muted">No doctors available at the moment.</p>
                </div>
              )}
            </div>
          )}
          {doctors?.length > 4 && (
            <div className="text-center mt-4">
              <Link to="/doctors" className="btn btn-primary">
                View All Doctors
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-search fs-1 text-primary mb-3"></i>
                  <h5>Find Doctors</h5>
                  <p className="text-muted">
                    Search and find doctors by speciality, location, or name easily.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-calendar-check fs-1 text-primary mb-3"></i>
                  <h5>Book Appointments</h5>
                  <p className="text-muted">
                    Schedule appointments at your convenience with just a few clicks.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-shield-check fs-1 text-primary mb-3"></i>
                  <h5>Verified Doctors</h5>
                  <p className="text-muted">
                    All our doctors are verified professionals you can trust.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
