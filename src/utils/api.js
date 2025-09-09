import axios from "axios";

const API = axios.create({
    baseURL: "https://chat-backend-production-98ad.up.railway.app/api",
});

// Attach token automatically
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;

