'use client';

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register, clearError } from '../redux/slices/authSlice'
import { toast } from 'react-toastify'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

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

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    const data = new FormData()
    data.append('username', formData.username)
    data.append('email', formData.email)
    data.append('password', formData.password)
    if (image) {
      data.append('image', image)
    }

    const result = await dispatch(register(data))
    if (register.fulfilled.match(result)) {
      toast.success('Registration successful!')
      navigate('/')
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <i className="bi bi-hospital fs-1 text-primary"></i>
                <h2 className="mt-2">Create Account</h2>
                <p className="text-muted">Join DocBook today</p>
              </div>

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
                  <p className="text-muted small mt-2">Click to upload profile photo</p>
                </div>

                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter your username"
                    minLength={3}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Create password"
                      minLength={6}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary">
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
