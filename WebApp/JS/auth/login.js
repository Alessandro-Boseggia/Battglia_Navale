import { login } from "../utils/authAPI.js";
const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

loginBtn.addEventListener("click", async (event) => {
    const userValue = usernameInput.value;
    const pwdValue = passwordInput.value;
    try {
        if (!userValue || !pwdValue)
            throw new Error("Uno o più campi non sono stati compilati");

        await login(userValue, pwdValue, passwordInput);
    } catch (error) {
        showError(error.message);
    }
});

function showError(message) {
    const messageField = document.querySelector(".errorContainer");
    messageField.classList.remove("hide");
    messageField.innerText = message;
}
