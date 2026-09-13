import axios, { InternalAxiosRequestConfig } from "axios";

// Separate clients so the users and events APIs never clobber each other's baseURL.
export const usersApi = axios.create({
  baseURL: import.meta.env.VITE_USER_API_URL,
});

export const eventsApi = axios.create({
  baseURL: import.meta.env.VITE_EVENTS_API_URL,
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
