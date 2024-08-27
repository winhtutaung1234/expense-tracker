import axios from "axios";
import Storage from "./Storage";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
})

api.interceptors.request.use((config) => {
    const AccessToken = Storage.getItem('Access Token');
    config.headers.Authorization = `${AccessToken}`
    return config;
})

export default api;