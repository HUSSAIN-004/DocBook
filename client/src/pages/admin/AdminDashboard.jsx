'use client';

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getStats } from '../../redux/slices/adminSlice'

function AdminDashboard() {
  const dispatch = useDispatch()
  const { stats, loading } = useSelector((state) => state.admin)

  useEffect(() => {
    dispatch(getStats())
  }, [dispatch])

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
        <i className="bi bi-shield-lock me-2"></i>
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card dashboard-card bg-primary text-white h-100">
            <div className="card-body text-center">
              <i className="bi bi-people fs-1 mb-2"></i>
              <p className="dashboard-stat mb-0">{stats?.totalUsers || 0}</p>
              <p className="mb-0">Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card bg-success text-white h-100">
            <div className="card-body text-center">
              <i className="bi bi-clipboard2-pulse fs-1 mb-2"></i>
              <p className="dashboard-stat mb-0">{stats?.totalDoctors || 0}</p>
              <p className="mb-0">Approved Doctors</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card bg-warning text-dark h-100">
            <div className="card-body text-center">
              <i className="bi bi-hourglass-split fs-1 mb-2"></i>
              <p className="dashboard-stat mb-0">{stats?.pendingDoctors || 0}</p>
              <p className="mb-0">Pending Approvals</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card dashboard-card bg-info text-white h-100">
            <div className="card-body text-center">
              <i className="bi bi-calendar-check fs-1 mb-2"></i>
              <p className="dashboard-stat mb-0">{stats?.totalAppointments || 0}</p>
              <p className="mb-0">Total Appointments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-people me-2"></i>
                User Management
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted">
                Manage user accounts, view profiles, and remove users from the platform.
              </p>
              <Link to="/admin/users" className="btn btn-primary">
                <i className="bi bi-arrow-right me-1"></i>
                Manage Users
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-clipboard2-pulse me-2"></i>
                Doctor Management
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted">
                Review doctor applications, approve or block doctor accounts.
              </p>
              <Link to="/admin/doctors" className="btn btn-success">
                <i className="bi bi-arrow-right me-1"></i>
                Manage Doctors
              </Link>
              {stats?.pendingDoctors > 0 && (
                <span className="badge bg-warning text-dark ms-2">
                  {stats.pendingDoctors} pending
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
