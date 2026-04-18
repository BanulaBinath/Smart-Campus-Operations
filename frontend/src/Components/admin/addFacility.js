import React, { useState } from 'react'
import Sidebar from './sidebar'
import { useNavigate } from 'react-router-dom'
import './addFacility.css'
import { addFacility, setFacilityRoomNumber } from '../../services/facilityService'

const FACILITY_NAME_OPTIONS = [
  'IT Department',
  'DS Department',
  'Engineering Department',
  'Science Department',
  'Management Department',
]

const FACILITY_TYPE_OPTIONS = ['CLASSROOM', 'LAB', 'HALL', 'SPORTS', 'EQUIPMENT', 'GROUND']
const CATEGORY_OPTIONS = ['Academic', 'Sports']
const STATUS_OPTIONS = ['ACTIVE', 'MAINTENANCE', 'INACTIVE']

function AddFacility() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
    capacity: '',
    roomNumber: '',
    status: '',
    description: '',
  })
  const needsRoomNumber = ['CLASSROOM', 'LAB', 'HALL'].includes(formData.type)
  const isGroundType = formData.type === 'GROUND'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validateForm = () => {
    if (!formData.name) {
      return 'Please select a facility name.'
    }

    if (!formData.type) {
      return 'Please select a facility type.'
    }

    if (!formData.category) {
      return 'Please select a category.'
    }

    if (!isGroundType) {
      if (!formData.capacity) {
        return 'Capacity is required for this facility type.'
      }

      if (Number(formData.capacity) > 60) {
        return 'Capacity cannot be greater than 60.'
      }
    }

    if (needsRoomNumber && !formData.roomNumber.trim()) {
      return 'Room number is required for classroom, lab, and hall types.'
    }

    if (!formData.status) {
      return 'Please select a status.'
    }

    return ''
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentForm) => ({
      ...currentForm,
      ...(name === 'type' && value === 'GROUND' ? { capacity: '', roomNumber: '' } : {}),
      ...(name === 'type' && !['CLASSROOM', 'LAB', 'HALL'].includes(value) ? { roomNumber: '' } : {}),
      [name]: value,
    }))

    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationMessage = validateForm()
    if (validationMessage) {
      setError(validationMessage)
      return
    }

    setLoading(true)
    setError('')

    try {
      const createdFacility = await addFacility({
        name: formData.name,
        type: formData.type,
        category: formData.category,
        capacity: isGroundType ? 0 : Number(formData.capacity),
        status: formData.status,
        description: formData.description,
        location: '',
      })

      if (createdFacility?.id) {
        setFacilityRoomNumber(createdFacility.id, needsRoomNumber ? formData.roomNumber : '')
      }

      setFormData({
        name: '',
        type: '',
        category: '',
        capacity: '',
        roomNumber: '',
        status: '',
        description: '',
      })
      navigate('/admin/facilities')
    } catch {
      setError('Unable to add facility. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-shell">
      <Sidebar />

      <main className="admin-content add-facility-page">
        <section className="form-hero">
          <p className="page-eyebrow">Campus Operations</p>
          <h1>Add Facility</h1>
          <p className="page-description">
            Capture the essential information for a new facility using a simple and professional form.
          </p>
        </section>

        <section className="form-card">
          {error && <div className="inline-message inline-message-error">{error}</div>}

          <form className="facility-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="form-field">
                <span>Facility Name</span>
                <select name="name" value={formData.name} onChange={handleChange} required>
                  <option value="" disabled>
                    Select Facility Name
                  </option>
                  {FACILITY_NAME_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Facility Type</span>
                <select className="facility-type-select" name="type" value={formData.type} onChange={handleChange} required>
                  <option value="" disabled>
                    Select Type
                  </option>
                  {FACILITY_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Category</span>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  <option value="" disabled>
                    Select Category
                  </option>
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              {!isGroundType && (
                <label className="form-field">
                  <span>Capacity</span>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Enter capacity"
                    min="1"
                    max="60"
                    required
                  />
                  <small className="field-hint">Maximum allowed capacity is 60.</small>
                </label>
              )}

              {needsRoomNumber && (
                <label className="form-field">
                  <span>Room Number</span>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    placeholder="Enter room number"
                    required
                  />
                </label>
              )}

              <label className="form-field">
                <span>Status</span>
                <select name="status" value={formData.status} onChange={handleChange} required>
                  <option value="" disabled>
                    Select status
                  </option>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field form-field-full">
                <span>Description</span>
                <textarea
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add a short description of this facility"
                />
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Saving...' : 'Save Facility'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

export default AddFacility
