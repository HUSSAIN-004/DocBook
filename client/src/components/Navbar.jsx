'use client';

import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { toast } from 'react-toastify'

function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-hospital me-2"></i>
          DocBook
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/doctors">
                Find Doctors
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                {/* Admin Links */}
                {user?.isAdmin && (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-shield-lock me-1"></i>
                      Admin
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link className="dropdown-item" to="/admin/dashboard">
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/admin/users">
                          Manage Users
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/admin/doctors">
                          Manage Doctors
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}

                {/* Doctor Links */}
                {user?.isDoctor && (
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-clipboard2-pulse me-1"></i>
                      Doctor
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link className="dropdown-item" to="/doctor/dashboard">
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/doctor/appointments">
                          Appointments
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/doctor/profile">
                          My Profile
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}

                {/* User Menu */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    {user?.image ? (
                      <img
                        src={user.image || "/placeholder.svg"}
                        alt={user.username}
                        className="small-avatar me-2"
                      />
                    ) : (
                      <i className="bi bi-person-circle me-2 fs-5"></i>
                    )}
                    {user?.username}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/my-appointments">
                        <i className="bi bi-calendar-check me-2"></i>
                        My Appointments
                      </Link>
                    </li>
                    {!user?.isDoctor && (
                      <li>
                        <Link className="dropdown-item" to="/apply-doctor">
                          <i className="bi bi-clipboard-plus me-2"></i>
                          Apply as Doctor
                        </Link>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light ms-2" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
