import axios from "axios";

/**
 * Axios instance pre-configured with base URL.
 * The Vite proxy forwards /api requests to http://localhost:5000.
 */
const API = axios.create({
  baseURL: "/api",
});

/**
 * Request interceptor: attach JWT token to every request
 * if one exists in localStorage.
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor: if we get a 401 (token expired/invalid),
 * clear storage and redirect to login.
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
