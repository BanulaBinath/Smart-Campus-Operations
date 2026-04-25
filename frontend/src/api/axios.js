import axios from 'axios';
import { API_BASE_URL } from '../config/backendUrls';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const shouldSkipAuthRedirect = Boolean(error?.config?.skipAuthRedirect);
    const requestUrl = String(error?.config?.url || '');
    const isCurrentUserProbe = requestUrl.includes('/users/me');
    const isOnLoginPage = window.location.pathname === '/login';
    const shouldRedirectToLogin =
      status === 401 && !shouldSkipAuthRedirect && !isCurrentUserProbe && !isOnLoginPage;

    if (shouldRedirectToLogin) {
      console.warn('Unauthorized: Redirecting to login');
      window.location.assign('/login');
    }

    return Promise.reject(error);
  }
);

export default api;
