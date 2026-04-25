import api from '../api/axios'
import { API_BASE_URL } from '../config/backendUrls'

const API_URL = API_BASE_URL.replace(/\/api\/v1$/, '/api/facilities')
const ROOM_NUMBER_STORE_KEY = 'facilityRoomNumbers'

const TOKEN_STORAGE_KEYS = ['token', 'authToken', 'accessToken', 'jwt', 'jwtToken', 'bearerToken']

const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return ''
  }

  for (const key of TOKEN_STORAGE_KEYS) {
    const localValue = window.localStorage.getItem(key)
    if (localValue) {
      return localValue
    }

    const sessionValue = window.sessionStorage.getItem(key)
    if (sessionValue) {
      return sessionValue
    }
  }

  return ''
}

const buildAuthHeaders = () => {
  const token = getStoredToken()
  if (!token) {
    return {}
  }

  return {
    Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
  }
}

const buildRequestConfig = (extraConfig = {}) => ({
  ...extraConfig,
  headers: {
    'Content-Type': 'application/json',
    ...buildAuthHeaders(),
    ...(extraConfig.headers || {}),
  },
})

const facilityEndpoint = (suffix = '') => `${API_URL}${suffix}`

const buildPayload = (data = {}) => ({
  name: data.name || '',
  type: data.type || '',
  category: data.category || '',
  capacity: Number(data.capacity) || 0,
  location: data.location ?? '',
  status: data.status || '',
  description: data.description || '',
})

export const getApiErrorMessage = (error, fallbackMessage) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message

  return message || fallbackMessage
}

export const getAllFacilities = async () => {
  const response = await api.get(facilityEndpoint(), buildRequestConfig())
  return response.data
}

export const getFacilityById = async (id) => {
  const response = await api.get(facilityEndpoint(`/${id}`), buildRequestConfig())
  return response.data
}

export const addFacility = async (data) => {
  const response = await api.post(facilityEndpoint(), buildPayload(data), buildRequestConfig())
  return response.data
}

export const updateFacility = async (id, data) => {
  const response = await api.put(facilityEndpoint(`/${id}`), buildPayload(data), buildRequestConfig())
  return response.data
}

export const deleteFacility = async (id) => {
  const response = await api.delete(facilityEndpoint(`/${id}`), buildRequestConfig())
  return response.data
}

const readRoomNumberMap = () => {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const rawValue = window.localStorage.getItem(ROOM_NUMBER_STORE_KEY)
    return rawValue ? JSON.parse(rawValue) : {}
  } catch {
    return {}
  }
}

const writeRoomNumberMap = (roomNumberMap) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(ROOM_NUMBER_STORE_KEY, JSON.stringify(roomNumberMap))
}

export const getFacilityRoomNumberMap = () => readRoomNumberMap()

export const setFacilityRoomNumber = (id, roomNumber) => {
  if (!id) {
    return
  }

  const roomNumberMap = readRoomNumberMap()
  const roomKey = String(id)
  const normalizedRoom = (roomNumber || '').trim()

  if (normalizedRoom) {
    roomNumberMap[roomKey] = normalizedRoom
  } else {
    delete roomNumberMap[roomKey]
  }

  writeRoomNumberMap(roomNumberMap)
}

export const removeFacilityRoomNumber = (id) => {
  if (!id) {
    return
  }

  const roomNumberMap = readRoomNumberMap()
  delete roomNumberMap[String(id)]
  writeRoomNumberMap(roomNumberMap)
}