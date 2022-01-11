import { refreshToken } from "../utils/authAPI.js";
import { searchGames, joinGame } from "../utils/gameAPI.js";

(async () => {
    const token = await refreshToken();
    await user(token);
    const { roomId } = await searchGames(token);
    console.log(roomId);
    const { idPlayer1 } = await joinGame(token, roomId);

    window.sessionStorage.setItem("game", { idPlayer1, roomId });

    window.location.replace("/partita.html");
})();

const user = async (jwt) => {
    const response = await fetch("/api/user", {
        method: "GET",
        credentials: "same-origin",
        headers: {
            jwt,
        },
    });

    const { username } = await response.json();

    document.querySelector("h2").innerText = `User logged ${username}`;
};
