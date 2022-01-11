export async function login(username, password) {
    const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            password,
        }),
    });

    const statusCode = response.status;

    if (statusCode === 400) throw new Error("Inserisci dei dati validi");
    if (statusCode === 401) throw new Error("Credenziali non valide");
    if (statusCode !== 200) throw new Error("Qualcosa è andato storto");

    window.location.replace("/dashboard.html");
}

export async function refreshToken() {
    const response = await fetch("/api/auth/refresh", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });

    const jsonRespone = await response.json();

    return jsonRespone.jwt;
}
