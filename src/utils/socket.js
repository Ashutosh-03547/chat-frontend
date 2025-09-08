import { io } from "socket.io-client";

const socket = io("https://chat-backend-production-98ad.up.railway.app", {
    auth: {
        token: localStorage.getItem("token") // send JWT to server
    }
});

export default socket;
