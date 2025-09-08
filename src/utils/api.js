import axios from "axios";

const API = axios.create({
    baseURL: "https://chat-backend-production-98ad.up.railway.app/api",
 // backend URL
});
API.get("/auth/users") // ✅ this matches /api/auth/users

// If token exists, send it automatically
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
