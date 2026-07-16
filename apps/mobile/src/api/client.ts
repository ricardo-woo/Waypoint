import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
  baseURL: "http://192.168.7.161:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
let isLoggingOut = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? "";
    const isAuthEndpoint =
      url.includes("/auth/login") || url.includes("/auth/refresh");

    if (status === 401 && !isAuthEndpoint && !isLoggingOut) {
      const { token, logout } = useAuthStore.getState();

      if (token) {
        isLoggingOut = true;
        try {
          await logout();
        } finally {
          isLoggingOut = false;
        }
      }
    }

    return Promise.reject(error);
  },
);
