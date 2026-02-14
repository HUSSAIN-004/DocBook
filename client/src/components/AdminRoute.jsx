import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function AdminRoute({ children }) {
  const { isAuthenticated, user, checkingAuth } = useSelector((state) => state.auth)

  if (checkingAuth) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
