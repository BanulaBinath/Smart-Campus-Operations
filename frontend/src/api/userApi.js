import api from './axios';

export const userApi = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await api.patch(`/users/${id}/role`, { role });
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.patch('/users/me', data);
    return response.data;
  },

  deleteProfile: async () => {
    const response = await api.delete('/users/me');
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};
