// src/api.js (example file)
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust to your backend URL
});

// Add an interceptor to include JWT token in every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
