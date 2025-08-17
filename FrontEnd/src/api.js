// src/axios.js
import axios from "axios";
import toast from "react-hot-toast";


const api = axios.create({
  baseURL: "http://localhost:5000", // change this to your backend URL
  withCredentials: true, // include cookies (important since you use httpOnly cookies)
});

// Add interceptor for expired/invalid token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid → redirect to GettingStarted
     toast.error("Session expired. Redirecting...");
     setTimeout(() => {
       window.location.href = "/";
     }, 1500);
    }
    return Promise.reject(error);
  }
);

export default api;
