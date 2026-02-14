import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function DoctorRoute({ children }) {
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

  if (!user?.isDoctor) {
    return <Navigate to="/" replace />
  }

  return children
}

export default DoctorRoute
