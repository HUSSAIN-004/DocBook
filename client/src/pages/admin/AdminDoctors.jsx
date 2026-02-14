'use client';

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllDoctors, approveDoctor, blockDoctor, unblockDoctor } from '../../redux/slices/adminSlice'
import { toast } from 'react-toastify'

function AdminDoctors() {
  const dispatch = useDispatch()
  const { doctors, loading } = useSelector((state) => state.admin)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    dispatch(getAllDoctors())
  }, [dispatch])

  const handleApprove = async (id) => {
    const result = await dispatch(approveDoctor(id))
    if (approveDoctor.fulfilled.match(result)) {
      toast.success('Doctor approved successfully')
    } else {
      toast.error('Failed to approve doctor')
    }
  }

  const handleBlock = async (id) => {
    if (window.confirm('Are you sure you want to block this doctor?')) {
      const result = await dispatch(blockDoctor(id))
      if (blockDoctor.fulfilled.match(result)) {
        toast.success('Doctor blocked')
      } else {
        toast.error('Failed to block doctor')
      }
    }
  }

  const handleUnblock = async (id) => {
    const result = await dispatch(unblockDoctor(id))
    if (unblockDoctor.fulfilled.match(result)) {
      toast.success('Doctor unblocked')
    } else {
      toast.error('Failed to unblock doctor')
    }
  }

  const filteredDoctors = doctors?.filter((doctor) => {
    if (filter === 'all') return true
    return doctor.status === filter
  })

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning text-dark',
      approved: 'bg-success',
      blocked: 'bg-danger',
    }
    return badges[status] || 'bg-secondary'
  }

  if (loading && doctors?.length === 0) {
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
          <i className="bi bi-clipboard2-pulse me-2"></i>
          Doctor Management
        </h1>
        <div className="btn-group">
          <button
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('all')}
          >
            All ({doctors?.length || 0})
          </button>
          <button
            className={`btn ${filter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({doctors?.filter((d) => d.status === 'pending').length || 0})
          </button>
          <button
            className={`btn ${filter === 'approved' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setFilter('approved')}
          >
            Approved ({doctors?.filter((d) => d.status === 'approved').length || 0})
          </button>
          <button
            className={`btn ${filter === 'blocked' ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setFilter('blocked')}
          >
            Blocked ({doctors?.filter((d) => d.status === 'blocked').length || 0})
          </button>
        </div>
      </div>

      {filteredDoctors?.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No doctors found.
        </div>
      ) : (
        <div className="row g-4">
          {filteredDoctors?.map((doctor) => (
            <div key={doctor._id} className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-2 text-center mb-3 mb-md-0">
                      {doctor?.image ? (
                        <img
                          src={doctor.image || "/placeholder.svg"}
                          alt={doctor.name}
                          className="profile-image"
                        />
                      ) : (
                        <div className="profile-image bg-light d-flex align-items-center justify-content-center mx-auto">
                          <i className="bi bi-person-fill fs-1 text-muted"></i>
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <h5 className="mb-1">{doctor?.name}</h5>
                      <p className="text-primary mb-1">
                        <i className="bi bi-clipboard2-pulse me-1"></i>
                        {doctor?.speciality}
                      </p>
                      <p className="text-muted small mb-1">
                        <i className="bi bi-building me-1"></i>
                        {doctor?.hospital}
                      </p>
                      <p className="text-muted small mb-1">
                        <i className="bi bi-envelope me-1"></i>
                        {doctor?.email} |
                        <i className="bi bi-telephone ms-2 me-1"></i>
                        {doctor?.phone}
                      </p>
                      <p className="text-muted small mb-0">
                        <i className="bi bi-award me-1"></i>
                        {doctor?.degree} | {doctor?.experience} years experience
                      </p>
                    </div>
                    <div className="col-md-2 text-center">
                      <p className="fw-bold text-success mb-1">
                        ${doctor?.fee} / consultation
                      </p>
                      <span className={`badge ${getStatusBadge(doctor?.status)}`}>
                        {doctor?.status?.toUpperCase()}
                      </span>
                    </div>
                    <div className="col-md-2 text-center">
                      <div className="d-flex flex-column gap-2">
                        {doctor?.status === 'pending' && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleApprove(doctor._id)}
                            disabled={loading}
                          >
                            <i className="bi bi-check-circle me-1"></i>
                            Approve
                          </button>
                        )}
                        {doctor?.status === 'approved' && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleBlock(doctor._id)}
                            disabled={loading}
                          >
                            <i className="bi bi-slash-circle me-1"></i>
                            Block
                          </button>
                        )}
                        {doctor?.status === 'blocked' && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleUnblock(doctor._id)}
                            disabled={loading}
                          >
                            <i className="bi bi-unlock me-1"></i>
                            Unblock
                          </button>
                        )}
                        {doctor?.status === 'pending' && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleBlock(doctor._id)}
                            disabled={loading}
                          >
                            <i className="bi bi-x-circle me-1"></i>
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminDoctors
