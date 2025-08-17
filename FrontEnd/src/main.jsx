import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from "axios";

// Base config
// axios.defaults.baseURL = "http://localhost:3000";
// axios.defaults.withCredentials = true;

// Global interceptor
// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       window.location.href = "/";
//     }
//     return Promise.reject(error);
//   }
// );
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
