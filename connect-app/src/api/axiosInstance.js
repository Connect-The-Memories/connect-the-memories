// services/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors globally
      console.error('Unauthorized (401) Response:', error.response.data);
      // Don't automatically logout here if using context, let context handle it
      // Maybe emit an event or use a different mechanism if needed globally
      alert('Authentication failed or session expired. Please log in.');
      // Redirecting here might be too aggressive, let components decide?
      // Or perhaps clear storage if using localStorage/sessionStorage directly
      // sessionStorage.removeItem('authToken'); // Example if using sessionStorage
      // window.location.href = '/login';
    }
    // Important: Reject the promise so individual calls can still catch errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
