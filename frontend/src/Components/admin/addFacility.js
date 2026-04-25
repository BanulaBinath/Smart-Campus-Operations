import React, { useState } from 'react'
import axios from 'axios'

const BASE_URL = "http://localhost:8080";

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

function AddFacility({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
    capacity: '',
    roomNumber: '',
    location: '',
    status: '',
    description: '',
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
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

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
      setError('')
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
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
      // Prepare facility data
      const facilityData = {
        name: formData.name,
        type: formData.type,
        category: formData.category,
        capacity: isGroundType ? 0 : Number(formData.capacity),
        location: formData.location || '',
        status: formData.status,
        description: formData.description,
      }

      // Create FormData for multipart request
      const formDataToSend = new FormData()
      
      // Append facility data as JSON blob
      formDataToSend.append('facility', new Blob([JSON.stringify(facilityData)], { type: 'application/json' }))
      
      // Append image if selected
      if (selectedImage) {
        formDataToSend.append('image', selectedImage)
      }

      // Send request to backend
      const response = await axios.post(`${BASE_URL}/api/facilities`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      })

      // Store room number in localStorage if needed
      if (response.data?.id && needsRoomNumber && formData.roomNumber) {
        const roomNumberMap = JSON.parse(localStorage.getItem('facilityRoomNumbers') || '{}')
        roomNumberMap[String(response.data.id)] = formData.roomNumber
        localStorage.setItem('facilityRoomNumbers', JSON.stringify(roomNumberMap))
      }

      // Reset form
      setFormData({
        name: '',
        type: '',
        category: '',
        capacity: '',
        roomNumber: '',
        location: '',
        status: '',
        description: '',
      })
      setSelectedImage(null)
      setImagePreview(null)

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error adding facility:', error)
      setError(error.response?.data?.message || 'Unable to add facility. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 pb-6 border-b border-[var(--color-border)]">
        <h2 className="text-xl font-bold text-[var(--color-text)]">Add New Facility</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Capture the essential information for a new facility using a simple and professional form.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 text-sm p-4 rounded-lg border border-red-100 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-600"></span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Facility Image</label>
          <div className="border-2 border-dashed border-[var(--color-border)] rounded-[10px] p-4">
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer py-8">
                <svg className="w-12 h-12 text-[var(--color-text-muted)] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-[var(--color-text-muted)]">Click to upload facility image</span>
                <span className="text-xs text-[var(--color-text-placeholder)] mt-1">PNG, JPG up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Facility Name</label>
            <select name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all">
              <option value="" disabled>Select Facility Name</option>
              {FACILITY_NAME_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Facility Type</label>
            <select name="type" value={formData.type} onChange={handleChange} required className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all">
              <option value="" disabled>Select Type</option>
              {FACILITY_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all">
              <option value="" disabled>Select Category</option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {!isGroundType && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Enter capacity"
                min="1"
                max="60"
                required
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all"
              />
              <p className="text-xs text-[var(--color-text-placeholder)] mt-1">Maximum allowed: 60</p>
            </div>
          )}

          {needsRoomNumber && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Room Number</label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="Enter room number"
                required
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location (optional)"
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} required className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all">
              <option value="" disabled>Select status</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add a short description of this facility"
            className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-[10px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary)] transition-all"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={loading} className="flex items-center justify-center min-w-[140px] rounded-[10px] bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white shadow-[0_4px_12px_rgba(var(--color-primary-rgb),0.3)] hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-50">
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              'Save Facility'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddFacility
