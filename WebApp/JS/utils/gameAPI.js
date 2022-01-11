export async function createGame(jwt) {
    const response = await fetch("/api/game/createGame", {
        method: "POST",
        credentials: "same-origin",
        headers: {
            jwt,
        },
    });

    const statusCode = response.status;

    if (statusCode !== 200) throw new Error("Qualcosa è andato storto");

    const data = await response.json();

    return data.roomId;
}

export async function searchGames(jwt) {
    const response = await fetch("/api/game/searchGames", {
        method: "GET",
        credentials: "same-origin",
        headers: {
            jwt,
        },
    });

    const statusCode = response.status;

    if (statusCode === 404) throw new Error("Partita non trovata");

    if (statusCode !== 200) throw new Error("Qualcosa è andato storto");

    return response.json();
}

export async function joinGame(jwt, roomId) {
    const response = await fetch("/api/game/joinGame", {
        method: "POST",
        credentials: "same-origin",
        headers: {
            jwt,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId }),
    });

    const statusCode = response.status;

    if (statusCode !== 200) throw new Error("Qualcosa è andato storto");

    return response.json();
}
