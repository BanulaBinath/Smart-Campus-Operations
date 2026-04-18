import axios from 'axios'

const API_URL = 'http://localhost:8080/api/facilities'
const ROOM_NUMBER_STORE_KEY = 'facilityRoomNumbers'

const buildPayload = (data = {}) => ({
  ...data,
  location: '',
  capacity: Number(data.capacity) || 0,
})

export const getAllFacilities = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

export const addFacility = async (data) => {
  const response = await axios.post(API_URL, buildPayload(data))
  return response.data
}

export const updateFacility = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, buildPayload(data))
  return response.data
}

export const deleteFacility = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`)
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