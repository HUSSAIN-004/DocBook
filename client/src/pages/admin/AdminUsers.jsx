'use client';

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers, deleteUser } from '../../redux/slices/adminSlice'
import { toast } from 'react-toastify'

function AdminUsers() {
  const dispatch = useDispatch()
  const { users, loading } = useSelector((state) => state.admin)

  useEffect(() => {
    dispatch(getAllUsers())
  }, [dispatch])

  const handleDelete = async (id, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      const result = await dispatch(deleteUser(id))
      if (deleteUser.fulfilled.match(result)) {
        toast.success('User deleted successfully')
      } else {
        toast.error(result.payload || 'Failed to delete user')
      }
    }
  }

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
        <i className="bi bi-people me-2"></i>
        User Management
      </h1>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {user?.image ? (
                          <img
                            src={user.image || "/placeholder.svg"}
                            alt={user.username}
                            className="small-avatar me-2"
                          />
                        ) : (
                          <i className="bi bi-person-circle fs-4 me-2"></i>
                        )}
                        {user?.username}
                      </div>
                    </td>
                    <td>{user?.email}</td>
                    <td>
                      {user?.isAdmin && (
                        <span className="badge bg-danger me-1">Admin</span>
                      )}
                      {user?.isDoctor && (
                        <span className="badge bg-success me-1">Doctor</span>
                      )}
                      <span className="badge bg-primary">User</span>
                    </td>
                    <td>{new Date(user?.createdAt).toLocaleDateString()}</td>
                    <td>
                      {!user?.isAdmin ? (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(user._id, user.username)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      ) : (
                        <span className="text-muted small">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
                {users?.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminUsers
