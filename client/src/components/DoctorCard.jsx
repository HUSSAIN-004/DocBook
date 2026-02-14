import { Link } from 'react-router-dom'

function DoctorCard({ doctor }) {
  return (
    <div className="card doctor-card h-100">
      <div className="card-body text-center">
        {doctor?.image ? (
          <img
            src={doctor.image || "/placeholder.svg"}
            alt={doctor.name}
            className="profile-image mb-3"
          />
        ) : (
          <div className="profile-image mb-3 bg-light d-flex align-items-center justify-content-center mx-auto">
            <i className="bi bi-person-fill fs-1 text-muted"></i>
          </div>
        )}
        <h5 className="card-title">{doctor?.name || 'Doctor'}</h5>
        <p className="text-primary mb-1">
          <i className="bi bi-clipboard2-pulse me-1"></i>
          {doctor?.speciality || 'General'}
        </p>
        <p className="text-muted small mb-2">
          <i className="bi bi-building me-1"></i>
          {doctor?.hospital || 'Hospital'}
        </p>
        <p className="text-muted small mb-2">
          <i className="bi bi-briefcase me-1"></i>
          {doctor?.experience || '0'} years experience
        </p>
        <p className="fw-bold text-success mb-3">
          <i className="bi bi-currency-dollar"></i>
          {doctor?.fee || 0} / consultation
        </p>
        <div className="d-grid gap-2">
          <Link to={`/doctors/${doctor?._id}`} className="btn btn-outline-primary btn-sm">
            View Profile
          </Link>
          <Link to={`/book-appointment/${doctor?._id}`} className="btn btn-primary btn-sm">
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DoctorCard
