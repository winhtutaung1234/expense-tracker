import axios from "axios";
import Storage from "./Storage";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const AccessToken = Storage.getItem("Access Token");
  config.headers.Authorization = `Bearer ${AccessToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { status } = error.response;
    if (status === 401) {
      console.log("401 Unauthorized");
    }
    if (status === 404) {
      console.log("404 Not Found");
    }
    throw error.response.data;
  }
);

export default api;
