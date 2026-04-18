const backendOrigin =
  process.env.REACT_APP_BACKEND_ORIGIN ||
  `${window.location.protocol}//${window.location.hostname}:8080`;

export const API_BASE_URL = `${backendOrigin}/api/v1`;
export const GOOGLE_OAUTH_URL = `${backendOrigin}/oauth2/authorization/google`;
export const LOGOUT_URL = `${backendOrigin}/api/v1/auth/logout`;

export const navigateToBackend = (url) => {
  // When embedded in an iframe/webview, prefer navigating the top-level frame.
  try {
    if (window.top && window.top !== window.self) {
      window.top.location.assign(url);
      return;
    }
  } catch (error) {
    // Ignore cross-origin frame access errors and fall back to current window.
  }

  window.location.assign(url);
};
