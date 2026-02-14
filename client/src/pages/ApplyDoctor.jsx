'use client';

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { applyDoctor, checkApplicationStatus, clearError } from '../redux/slices/doctorSlice'
import { toast } from 'react-toastify'

const specialities = [
  'General Physician',
  'Dermatologist',
  'Pediatrician',
  'Cardiologist',
  'Orthopedic',
  'Neurologist',
  'Psychiatrist',
  'Dentist',
  'ENT Specialist',
  'Gynecologist',
  'Ophthalmologist',
  'Urologist',
]

function ApplyDoctor() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { loading, error, applicationStatus } = useSelector((state) => state.doctor)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    about: '',
    speciality: '',
    degree: '',
    experience: '',
    hospital: '',
    fee: '',
    timeFrom: '09:00',
    timeTo: '17:00',
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    dispatch(checkApplicationStatus())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.username || '',
        email: user.email || '',
      }))
    }
  }, [user])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData()
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key])
    })
    if (image) {
      data.append('image', image)
    }

    const result = await dispatch(applyDoctor(data))
    if (applyDoctor.fulfilled.match(result)) {
      toast.success('Application submitted successfully!')
    }
  }

  // If already applied, show status
  if (applicationStatus?.hasApplied) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card text-center">
              <div className="card-body p-5">
                {applicationStatus.status === 'pending' && (
                  <>
                    <i className="bi bi-hourglass-split text-warning display-1 mb-3"></i>
                    <h3>Application Pending</h3>
                    <p className="text-muted">
                      Your doctor application is under review. We'll notify you once
                      it's approved.
                    </p>
                  </>
                )}
                {applicationStatus.status === 'approved' && (
                  <>
                    <i className="bi bi-check-circle text-success display-1 mb-3"></i>
                    <h3>Application Approved</h3>
                    <p className="text-muted">
                      Congratulations! Your doctor profile is now active.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate('/doctor/dashboard')}
                    >
                      Go to Doctor Dashboard
                    </button>
                  </>
                )}
                {applicationStatus.status === 'blocked' && (
                  <>
                    <i className="bi bi-x-circle text-danger display-1 mb-3"></i>
                    <h3>Application Blocked</h3>
                    <p className="text-muted">
                      Your doctor application has been blocked. Please contact support
                      for more information.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header">
              <h4 className="mb-0">
                <i className="bi bi-clipboard-plus me-2"></i>
                Apply to Become a Doctor
              </h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Profile Image */}
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="profile-image"
                      />
                    ) : (
                      <div className="profile-image bg-light d-flex align-items-center justify-content-center">
                        <i className="bi bi-person-fill fs-1 text-muted"></i>
                      </div>
                    )}
                    <label
                      htmlFor="image"
                      className="position-absolute bottom-0 end-0 btn btn-primary btn-sm rounded-circle"
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="bi bi-camera"></i>
                    </label>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="d-none"
                    />
                  </div>
                  <p className="text-muted small mt-2">Upload your professional photo</p>
                </div>

                <h5 className="mb-3">Personal Information</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Clinic/Hospital address"
                    />
                  </div>
                </div>

                <h5 className="mb-3">Professional Information</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label">Speciality</label>
                    <select
                      className="form-select"
                      name="speciality"
                      value={formData.speciality}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Speciality</option>
                      {specialities.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Degree</label>
                    <input
                      type="text"
                      className="form-control"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      required
                      placeholder="e.g., MBBS, MD"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Experience (Years)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      placeholder="Years of experience"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Hospital/Clinic</label>
                    <input
                      type="text"
                      className="form-control"
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleChange}
                      required
                      placeholder="Hospital name"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">About</label>
                    <textarea
                      className="form-control"
                      name="about"
                      rows="4"
                      value={formData.about}
                      onChange={handleChange}
                      required
                      placeholder="Tell us about yourself and your practice..."
                    ></textarea>
                  </div>
                </div>

                <h5 className="mb-3">Availability & Fees</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label">Consultation Fee ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="fee"
                      value={formData.fee}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="Fee amount"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Available From</label>
                    <input
                      type="time"
                      className="form-control"
                      name="timeFrom"
                      value={formData.timeFrom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Available To</label>
                    <input
                      type="time"
                      className="form-control"
                      name="timeTo"
                      value={formData.timeTo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>
                      Submit Application
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

export default ApplyDoctor
