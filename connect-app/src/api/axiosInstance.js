// services/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://flask-backend-qgnd4kcnka-uc.a.run.app/api" || "http://127.0.0.1:5000/api",
});

axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
