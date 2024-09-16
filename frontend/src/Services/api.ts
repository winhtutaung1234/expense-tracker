import axios from "axios";
import Storage from "./Storage";
import Auth from "./Auth/Auth";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
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
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshTokenResponse = await Auth.refreshToken();
        const newAccessToken = refreshTokenResponse.accessToken;

        Storage.setItem("Access Token", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        Storage.clear();
        console.error('Token refresh failed, logging out:', refreshError);
        throw refreshError;
      }
    }

    if (error.response?.status === 404) {
      console.log("404 Not Found");
    }

    throw error.response.data;
  }
);

export default api;
