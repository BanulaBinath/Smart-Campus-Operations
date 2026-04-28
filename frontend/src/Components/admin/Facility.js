import React, { useEffect, useState } from 'react'
import { X, Trash2, Edit } from 'lucide-react'
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch (err) {
      console.error(err);
      setError(`Unable to update facility: ${err.response?.data?.message || err.message || 'Unknown error'}. Details: ${JSON.stringify(editForm)}`)
    } finally {
      setSubmitting(false)
    }
  }

  const closeEditModal = () => {
    setEditingFacility(null)
    setEditForm(initialEditForm)
  }

  return (
    <div className="w-full">
      {error && (
        <div className="m-6 bg-red-50 text-red-600 text-sm p-4 rounded-lg border border-red-100 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-600"></span>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--color-text)]">
            <thead className="bg-[#F8FAFC] text-xs uppercase text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Facility Name</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Capacity</th>
                <th className="px-6 py-4 font-semibold">Room Number</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {facilities.length > 0 ? (
                facilities.map((facility) => (
                  <tr key={facility.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4 font-medium">{facility.id}</td>
                    <td className="px-6 py-4">{facility.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {facility.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{facility.category}</td>
                    <td className="px-6 py-4">{facility.type === 'GROUND' ? '-' : facility.capacity}</td>
                    <td className="px-6 py-4">{facility.roomNumber || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${facility.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' :
                          facility.status === 'MAINTENANCE' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                        {facility.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate" title={facility.description}>{facility.description}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(facility)}
                          className="rounded-[8px] border border-[var(--color-border)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-light)] flex items-center gap-1.5"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(facility.id)}
                          className="rounded-[8px] border border-[var(--color-border)] bg-white p-1.5 text-[var(--color-danger)] transition-colors hover:bg-red-50 hover:border-red-200"
                          title="Delete Facility"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-[var(--color-text-muted)]">
                    No facilities found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editingFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in" onClick={closeEditModal}>
          <div className="w-full max-w-[500px] rounded-[16px] bg-[var(--color-surface)] shadow-2xl animate-in zoom-in-95 border border-[var(--color-border)] flex flex-col max-h-[90vh]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-[var(--color-text)]">Edit Facility Details</h2>
                <p className="text-xs text-[var(--color-text-muted)]">Update information for {editingFacility.name}</p>
              </div>
              <button type="button" className="rounded-full p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)] transition-colors" onClick={closeEditModal}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="px-6 py-6 overflow-y-auto space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Facility Name</label>
                    <select name="name" value={editForm.name} onChange={handleEditChange} required className="w-full px-4 py-2 border border-[var(--color-border)] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all">
                      <option value="" disabled>Select Facility Name</option>
                      {FACILITY_NAME_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Type</label>
                    <select name="type" value={editForm.type} onChange={handleEditChange} required className="w-full px-4 py-2 border border-[var(--color-border)] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all">
                      <option value="" disabled>Select Type</option>
                      {FACILITY_TYPE_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Category</label>
                    <select name="category" value={editForm.category} onChange={handleEditChange} required className="w-full px-4 py-2 border border-[var(--color-border)] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all">
                      <option value="" disabled>Select Category</option>
                      {CATEGORY_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  {!isGroundType && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Capacity</label>
                      <input type="number" name="capacity" min="1" max="60" value={editForm.capacity} onChange={handleEditChange} required className="w-full px-4 py-2 border border-[var(--color-border)] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all" />
                    </div>
                  )}

                  {needsRoomNumber && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Room Number</label>
                      <input type="text" name="roomNumber" value={editForm.roomNumber} onChange={handleEditChange} placeholder="Enter room number" required className="w-full px-4 py-2 border border-[var(--color-border)] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all" />
                    </div>
                  )}

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Status</label>
                    <div className="grid grid-cols-3 gap-2">
                      {STATUS_OPTIONS.map((status) => (
                        <label
                          key={status}
                          className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 transition-all ${editForm.status === status
                              ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]/20 text-[var(--color-primary-text)] font-medium'
                              : 'border-[var(--color-border)] hover:bg-[var(--color-bg)] grayscale'
                            }`}
                        >
                          <input
                            type="radio"
                            name="status"
                            value={status}
                            checked={editForm.status === status}
                            onChange={handleEditChange}
                            className="hidden"
                          />
                          <span className="text-xs">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Description</label>
                    <textarea name="description" rows="3" value={editForm.description} onChange={handleEditChange} className="w-full px-4 py-2 border border-[var(--color-border)] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4 bg-gray-50/50 rounded-b-[16px] shrink-0">
                <button type="button" onClick={closeEditModal} className="px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex items-center justify-center min-w-[120px] rounded-[10px] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[var(--color-primary-light)] hover:bg-[var(--color-primary-hover)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? 'Saving...' : 'Update Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Facility
