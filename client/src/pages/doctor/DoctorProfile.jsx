'use client';

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDoctorProfile, updateDoctorProfile, clearError } from '../../redux/slices/doctorSlice'
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

function DoctorProfile() {
  const dispatch = useDispatch()
  const { doctorProfile, loading, error } = useSelector((state) => state.doctor)

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    about: '',
    speciality: '',
    degree: '',
    experience: '',
    hospital: '',
    fee: '',
    timeFrom: '',
    timeTo: '',
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    dispatch(getDoctorProfile())
  }, [dispatch])

  useEffect(() => {
    if (doctorProfile) {
      setFormData({
        name: doctorProfile.name || '',
        phone: doctorProfile.phone || '',
        address: doctorProfile.address || '',
        about: doctorProfile.about || '',
        speciality: doctorProfile.speciality || '',
        degree: doctorProfile.degree || '',
        experience: doctorProfile.experience || '',
        hospital: doctorProfile.hospital || '',
        fee: doctorProfile.fee || '',
        timeFrom: doctorProfile.timeFrom || '',
        timeTo: doctorProfile.timeTo || '',
      })
      setImagePreview(doctorProfile.image || null)
    }
  }, [doctorProfile])

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

    const result = await dispatch(updateDoctorProfile(data))
    if (updateDoctorProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully!')
      setIsEditing(false)
      setImage(null)
    }
  }

  if (loading && !doctorProfile) {
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
          <i className="bi bi-person-badge me-2"></i>
          Doctor Profile
        </h1>
        {!isEditing && (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            <i className="bi bi-pencil me-1"></i>
            Edit Profile
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {/* Profile Image */}
            <div className="text-center mb-4">
              <div className="position-relative d-inline-block">
                {imagePreview ? (
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt={doctorProfile?.name}
                    className="doctor-profile-image"
                  />
                ) : (
                  <div className="doctor-profile-image bg-light d-flex align-items-center justify-content-center">
                    <i className="bi bi-person-fill fs-1 text-muted"></i>
                  </div>
                )}
                {isEditing && (
                  <>
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
                  </>
                )}
              </div>
              <h4 className="mt-3 mb-0">{doctorProfile?.name}</h4>
              <p className="text-primary">{doctorProfile?.speciality}</p>
              <span className={`badge ${doctorProfile?.status === 'approved' ? 'bg-success' : doctorProfile?.status === 'pending' ? 'bg-warning' : 'bg-danger'}`}>
                {doctorProfile?.status?.toUpperCase()}
              </span>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
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
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Speciality</label>
                <select
                  className="form-select"
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleChange}
                  disabled={!isEditing}
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
                  disabled={!isEditing}
                  required
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
                  disabled={!isEditing}
                  required
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
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
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
                  disabled={!isEditing}
                  required
                ></textarea>
              </div>
              <div className="col-md-4">
                <label className="form-label">Consultation Fee ($)</label>
                <input
                  type="number"
                  className="form-control"
                  name="fee"
                  value={formData.fee}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>

            {isEditing && (
              <div className="d-flex gap-2 mt-4">
                <button
                  type="submit"
                  className="btn btn-primary flex-fill"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-1"></i>
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setIsEditing(false)
                    setImage(null)
                    if (doctorProfile) {
                      setFormData({
                        name: doctorProfile.name || '',
                        phone: doctorProfile.phone || '',
                        address: doctorProfile.address || '',
                        about: doctorProfile.about || '',
                        speciality: doctorProfile.speciality || '',
                        degree: doctorProfile.degree || '',
                        experience: doctorProfile.experience || '',
                        hospital: doctorProfile.hospital || '',
                        fee: doctorProfile.fee || '',
                        timeFrom: doctorProfile.timeFrom || '',
                        timeTo: doctorProfile.timeTo || '',
                      })
                      setImagePreview(doctorProfile.image || null)
                    }
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
