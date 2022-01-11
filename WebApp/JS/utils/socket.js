import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import { refreshToken } from "../utils/authAPI.js";

export function createSocket(jwt, namespace) {
    const socket = io(namespace, {
        auth: {
            token: jwt,
        },
    });

    socket.on("reconnect_attempt", async () => {
        const { jwt } = await refreshToken();
        socket.query.token = jwt;
        console.log("token refresced");
    });

    return socket;
}
