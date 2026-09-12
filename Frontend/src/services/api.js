import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_BACKEND_BASEURL || "http://localhost:3000",
    withCredentials: true,
});

// Request interceptor: attach Bearer token from localStorage as fallback for cross-domain auth
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: automatically handle 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
        return Promise.reject(error);
    }
);

export default api;
