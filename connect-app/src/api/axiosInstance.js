// services/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000/api",
});

axiosInstance.defaults.withCredentials = true;

export default axiosInstance;