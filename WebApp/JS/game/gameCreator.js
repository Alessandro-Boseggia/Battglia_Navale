import { refreshToken } from "../utils/authAPI.js";
import { createGame } from "../utils/gameAPI.js";
import { createSocket } from "../utils/socket.js";

(async () => {
    const token = await refreshToken();
    const roomId = await createGame(token);
    const socket = createSocket(token, "/matchmaking");
    console.log(socket);
    socket.on("game_found", ({ idPlayer2 }) => {
        window.sessionStorage.setItem("game", { roomId, idPlayer2 });

        window.location.replace("/partita.html");
    });

    const response = await fetch("/api/user", {
        method: "GET",
        credentials: "same-origin",
        headers: {
            jwt: token,
        },
    });

    const { username } = await response.json();

    document.querySelector("h2").innerText = `User logged ${username}`;
})();
