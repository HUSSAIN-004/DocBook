'use client';

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile, clearError } from '../redux/slices/authSlice'
import { toast } from 'react-toastify'

function Profile() {
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      })
      setImagePreview(user.image || null)
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
    data.append('username', formData.username)
    data.append('email', formData.email)
    if (image) {
      data.append('image', image)
    }

    const result = await dispatch(updateProfile(data))
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully!')
      setIsEditing(false)
      setImage(null)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-person-circle me-2"></i>
                My Profile
              </h5>
              {!isEditing && (
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="bi bi-pencil me-1"></i>
                  Edit
                </button>
              )}
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Profile Image */}
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt={user?.username}
                        className="profile-image"
                      />
                    ) : (
                      <div className="profile-image bg-light d-flex align-items-center justify-content-center">
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
                </div>

                {/* User Info */}
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                {/* Role Badges */}
                <div className="mb-4">
                  <label className="form-label">Roles</label>
                  <div>
                    {user?.isAdmin && (
                      <span className="badge bg-danger me-2">Admin</span>
                    )}
                    {user?.isDoctor && (
                      <span className="badge bg-success me-2">Doctor</span>
                    )}
                    <span className="badge bg-primary">User</span>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="d-flex gap-2">
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
                        setFormData({
                          username: user?.username || '',
                          email: user?.email || '',
                        })
                        setImagePreview(user?.image || null)
                        setImage(null)
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
      </div>
    </div>
  )
}

export default Profile
