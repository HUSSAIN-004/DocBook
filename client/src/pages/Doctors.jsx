'use client';

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getDoctors, getDoctorsBySpeciality } from '../redux/slices/doctorSlice'
import DoctorCard from '../components/DoctorCard'

const specialities = [
  'All',
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
]

function Doctors() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedSpeciality, setSelectedSpeciality] = useState(
    searchParams.get('speciality') || 'All'
  )
  const [searchTerm, setSearchTerm] = useState('')

  const dispatch = useDispatch()
  const { doctors, loading } = useSelector((state) => state.doctor)

  useEffect(() => {
    if (selectedSpeciality === 'All') {
      dispatch(getDoctors())
    } else {
      dispatch(getDoctorsBySpeciality(selectedSpeciality))
    }
  }, [dispatch, selectedSpeciality])

  const handleSpecialityChange = (speciality) => {
    setSelectedSpeciality(speciality)
    if (speciality === 'All') {
      searchParams.delete('speciality')
    } else {
      searchParams.set('speciality', speciality)
    }
    setSearchParams(searchParams)
  }

  const filteredDoctors = doctors?.filter((doctor) =>
    doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container py-5">
      <h1 className="mb-4">Find Doctors</h1>

      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-lg-3 mb-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-funnel me-2"></i>
                Filter by Speciality
              </h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {specialities.map((spec) => (
                  <button
                    key={spec}
                    className={`list-group-item list-group-item-action ${
                      selectedSpeciality === spec ? 'active' : ''
                    }`}
                    onClick={() => handleSpecialityChange(spec)}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Doctors List */}
        <div className="col-lg-9">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search doctors by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Results Info */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <p className="mb-0 text-muted">
              {selectedSpeciality !== 'All' && (
                <span className="badge bg-primary me-2">{selectedSpeciality}</span>
              )}
              {filteredDoctors?.length || 0} doctors found
            </p>
          </div>

          {/* Doctors Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {filteredDoctors?.map((doctor) => (
                <div key={doctor._id} className="col-md-6 col-xl-4">
                  <DoctorCard doctor={doctor} />
                </div>
              ))}
              {filteredDoctors?.length === 0 && (
                <div className="col-12">
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    No doctors found matching your criteria.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors
