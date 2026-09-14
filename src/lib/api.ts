import axios, { InternalAxiosRequestConfig } from "axios";

// Backend base URL, e.g. http://localhost:5001. Each client adds its route.
const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

if (!API_URL) {
  console.error("VITE_API_URL is not set, so API requests won't reach the backend.");
}

// Separate clients so each route keeps its own baseURL.
export const usersApi = axios.create({
  baseURL: `${API_URL}/users`,
});

export const eventsApi = axios.create({
  baseURL: `${API_URL}/events`,
});

export const chatApi = axios.create({
  baseURL: `${API_URL}/chat`,
});

const withAuth = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

eventsApi.interceptors.request.use(withAuth);
usersApi.interceptors.request.use(withAuth);
chatApi.interceptors.request.use(withAuth);
