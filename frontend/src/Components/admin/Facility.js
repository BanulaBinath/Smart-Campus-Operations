import React, { useEffect, useState } from 'react'
import Sidebar from './sidebar'
import './Facility.css'
import {
  deleteFacility,
  getAllFacilities,
  getFacilityRoomNumberMap,
  removeFacilityRoomNumber,
  setFacilityRoomNumber,
  updateFacility,
} from '../../services/facilityService'

const FACILITY_NAME_OPTIONS = [
  'IT Department',
  'DS Department',
  'Engineering Department',
  'Science Department',
  'Management Department',
]

const FACILITY_TYPE_OPTIONS = ['CLASSROOM', 'LAB', 'HALL', 'SPORTS', 'EQUIPMENT', 'GROUND']
const ROOM_NUMBER_REQUIRED_TYPES = ['CLASSROOM', 'LAB', 'HALL']
const CATEGORY_OPTIONS = ['Academic', 'Sports']
const STATUS_OPTIONS = ['ACTIVE', 'MAINTENANCE', 'INACTIVE']

const normalizeType = (value = '') => {
  const upperType = value.toUpperCase()

  if (upperType === 'ROOM') {
    return 'CLASSROOM'
  }

  if (upperType === 'AUDITORIUM') {
    return 'HALL'
  }

  return upperType
}

const initialEditForm = {
  name: '',
  type: '',
  category: '',
  capacity: '',
  roomNumber: '',
  status: '',
  description: '',
}

function Facility() {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingFacility, setEditingFacility] = useState(null)
  const [editForm, setEditForm] = useState(initialEditForm)
  const [submitting, setSubmitting] = useState(false)
  const needsRoomNumber = ROOM_NUMBER_REQUIRED_TYPES.includes(normalizeType(editForm.type))
  const isGroundType = editForm.type === 'GROUND'

  const getEnrichedFacilities = (facilityList) => {
    const roomNumberMap = getFacilityRoomNumberMap()

    return facilityList.map((facility) => ({
      ...facility,
      roomNumber: roomNumberMap[String(facility.id)] || '',
    }))
  }

  const loadFacilities = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getAllFacilities()
      setFacilities(getEnrichedFacilities(Array.isArray(data) ? data : []))
    } catch {
      setError('Unable to load facilities. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFacilities()
  }, [])

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm('Delete this facility?')

    if (!shouldDelete) {
      return
    }

    try {
      setError('')
      await deleteFacility(id)
      removeFacilityRoomNumber(id)
      await loadFacilities()
    } catch {
      setError('Unable to delete facility. Please try again.')
    }
  }

  const handleEditClick = (facility) => {
    const normalizedType = normalizeType(facility.type)

    setEditingFacility(facility)
    setEditForm({
      name: facility.name || '',
      type: normalizedType,
      category: facility.category || '',
      capacity: normalizedType === 'GROUND' ? '' : facility.capacity?.toString() || '',
      roomNumber: facility.roomNumber || '',
      status: facility.status || '',
      description: facility.description || '',
    })
  }

  const handleEditChange = (event) => {
    const { name, value } = event.target
    const nextType = name === 'type' ? normalizeType(value) : editForm.type

    setEditForm((currentForm) => ({
      ...currentForm,
      ...(name === 'type' && nextType === 'GROUND' ? { capacity: '', roomNumber: '' } : {}),
      ...(name === 'type' && !ROOM_NUMBER_REQUIRED_TYPES.includes(nextType) ? { roomNumber: '' } : {}),
      [name]: name === 'type' ? nextType : value,
    }))
  }

  const validateEditForm = () => {
    if (!editForm.name) {
      return 'Please select a facility name.'
    }

    if (!editForm.type) {
      return 'Please select a facility type.'
    }

    if (!editForm.category) {
      return 'Please select a category.'
    }

    if (!isGroundType) {
      if (!editForm.capacity) {
        return 'Capacity is required for this facility type.'
      }

      if (Number(editForm.capacity) > 60) {
        return 'Capacity cannot be greater than 60.'
      }
    }

    if (needsRoomNumber && !editForm.roomNumber.trim()) {
      return 'Room number is required for classroom, lab, and hall types.'
    }

    if (!editForm.status) {
      return 'Please select a status.'
    }

    return ''
  }

  const handleEditSubmit = async (event) => {
    event.preventDefault()

    if (!editingFacility) {
      return
    }

    const validationMessage = validateEditForm()
    if (validationMessage) {
      setError(validationMessage)
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await updateFacility(editingFacility.id, {
        name: editForm.name,
        type: editForm.type,
        category: editForm.category,
        capacity: isGroundType ? 0 : Number(editForm.capacity),
        status: editForm.status,
        description: editForm.description,
        location: '',
      })
      setFacilityRoomNumber(editingFacility.id, needsRoomNumber ? editForm.roomNumber : '')
      setEditingFacility(null)
      setEditForm(initialEditForm)
      await loadFacilities()
    } catch {
      setError('Unable to update facility. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const closeEditModal = () => {
    setEditingFacility(null)
    setEditForm(initialEditForm)
  }

  return (
    <div className="admin-shell">
      <Sidebar />

      <main className="admin-content facility-page">
        <section className="page-header">
          <p className="page-eyebrow">Campus Operations</p>
          <h1>Facility Management Dashboard</h1>
          <p className="page-description">
            Monitor facility records, add new spaces, and keep campus operations organized from a single place.
          </p>
        </section>

        <section className="table-section" aria-label="Facility data table">
          <div className="table-card">
            <div className="table-card-header">
              <div>
                <p className="table-eyebrow">Current Records</p>
                <h2>Facility List</h2>
              </div>
              <p className="table-note">Backend data is loaded from the Spring Boot API.</p>
            </div>

            {error && <div className="inline-message inline-message-error">{error}</div>}

            {loading ? (
              <div className="table-state">Loading facilities...</div>
            ) : (
            <div className="table-wrap">
              <table className="facility-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Facility Name</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Capacity</th>
                    <th>Room Number</th>
                    <th>Status</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {facilities.length > 0 ? (
                    facilities.map((facility) => (
                      <tr key={facility.id}>
                        <td>{facility.id}</td>
                        <td>{facility.name}</td>
                        <td>{facility.type}</td>
                        <td>{facility.category}</td>
                        <td>{facility.type === 'GROUND' ? '-' : facility.capacity}</td>
                        <td>{facility.roomNumber || '-'}</td>
                        <td>{facility.status}</td>
                        <td>{facility.description}</td>
                        <td>
                          <div className="table-actions">
                            <button type="button" className="btn-update" onClick={() => handleEditClick(facility)}>
                              Update
                            </button>
                            <button type="button" className="btn-delete" onClick={() => handleDelete(facility.id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">
                        <div className="table-state">No facilities found.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </section>

        {editingFacility && (
          <div className="modal-backdrop" role="presentation" onClick={closeEditModal}>
            <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="edit-facility-title" onClick={(event) => event.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <p className="table-eyebrow">Update Record</p>
                  <h2 id="edit-facility-title">Edit Facility</h2>
                </div>
                <button type="button" className="modal-close" onClick={closeEditModal} aria-label="Close update form">
                  Close
                </button>
              </div>

              <form className="facility-form facility-form-modal" onSubmit={handleEditSubmit}>
                <div className="form-grid">
                  <label className="form-field">
                    <span>Facility Name</span>
                    <select name="name" value={editForm.name} onChange={handleEditChange} required>
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
                    <span>Type</span>
                    <select name="type" value={editForm.type} onChange={handleEditChange} required>
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
                    <select name="category" value={editForm.category} onChange={handleEditChange} required>
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
                      <input type="number" name="capacity" min="1" max="60" value={editForm.capacity} onChange={handleEditChange} required />
                    </label>
                  )}

                  {needsRoomNumber && (
                    <label className="form-field">
                      <span>Room Number</span>
                      <input type="text" name="roomNumber" value={editForm.roomNumber} onChange={handleEditChange} placeholder="Enter room number" required />
                    </label>
                  )}

                  <label className="form-field">
                    <span>Status</span>
                    <select name="status" value={editForm.status} onChange={handleEditChange} required>
                      <option value="" disabled>
                        Select Status
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
                    <textarea name="description" rows="4" value={editForm.description} onChange={handleEditChange} />
                  </label>
                </div>

                <div className="form-actions form-actions-modal">
                  <button type="button" className="secondary-button" onClick={closeEditModal}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-button" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Update Facility'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Facility
