import axios from "axios";
import Storage from "./Storage";
import Auth from "./Auth";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const AccessToken = Storage.getItem("Access Token");
  if (AccessToken) {
    config.headers.Authorization = `Bearer ${AccessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/verify" &&
      originalRequest.url !== "/refresh-token"
    ) {
      originalRequest._retry = true; // Mark as retry

      try {
        await Auth.refreshToken();

        return api(originalRequest);
      } catch (refreshError) {

        Storage.clear();
        throw refreshError;
      }
    }

    if (
      error.response?.status === 401 &&
      originalRequest._retry &&
      originalRequest.url === "/refresh-token"
    ) {
      Storage.clear(); // Clear any stored tokens and user data
      window.location.href = "/login"; // Redirect the user to the login page
      throw error; // Stop the execution and throw the error to prevent further processing
    }

    // For other errors, just propagate
    throw error.response?.data || error;
  }
);

export default api;
