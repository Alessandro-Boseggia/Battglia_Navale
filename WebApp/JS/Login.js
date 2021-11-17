document.getElementById("mostraNascondi").addEventListener("click", () => {
    let pwd = document.getElementById("password");
    if(pwd.type === "password"){
        pwd.type = "text";
    }else{
        pwd.type = "password"; 
    }
})

document.getElementById("loginBtn").addEventListener("click", () => {
    location.href='Griglia.html';
})