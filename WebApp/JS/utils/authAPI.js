export async function login(username, password) {
    const response = await fetch("http://127.0.0.1:3000/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            password,
        }),
    });

    const statusCode = response.statusCode;

    if (statusCode === 400) throw new Error("Inserisci dei dati validi");
    if (statusCode === 401) throw new Error("Credenziali non valide");
    if (statusCode !== 200) throw new Error("Qualcosa è andato storto");

    window.location.replace("/WebApp/HTML/test.html");
}
