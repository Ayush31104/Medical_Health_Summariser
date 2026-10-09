import axios from "axios";

const api = axios.create({
  baseURL: "https://mediclarity-be.vercel.app/api",
});

// Automatically attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mediclarity_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;