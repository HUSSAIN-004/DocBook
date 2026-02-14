import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <h5>
              <i className="bi bi-hospital me-2"></i>
              DocBook
            </h5>
            <p className="text-muted">
              Your trusted platform for finding and booking appointments with qualified healthcare professionals.
            </p>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-muted text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-muted text-decoration-none">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/apply-doctor" className="text-muted text-decoration-none">
                  Join as Doctor
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact</h5>
            <ul className="list-unstyled text-muted">
              <li>
                <i className="bi bi-envelope me-2"></i>
                support@docbook.com
              </li>
              <li>
                <i className="bi bi-telephone me-2"></i>
                +1 234 567 890
              </li>
              <li>
                <i className="bi bi-geo-alt me-2"></i>
                123 Medical Street, Health City
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-3" />
        <div className="text-center text-muted">
          <small>&copy; {new Date().getFullYear()} DocBook. All rights reserved.</small>
        </div>
      </div>
    </footer>
  )
}

export default Footer
