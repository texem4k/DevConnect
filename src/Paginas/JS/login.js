import {validateFormatPassword, validateFormatEmail, validateEmail,
    setPassword, setEmail}from "./validators.js";

document.addEventListener("DOMContentLoaded",   async () => {
    await init()
    await Promise.all([
        f()
    ]);
});

async function f (){
    document.querySelector("h1").textContent ="Inicia Sesión";
    let x = document.querySelectorAll("#input p");
    x[0].textContent = "Correo electrónico";
    x[1].textContent = "Contraseña";
    let y = document.querySelectorAll("#input input");
    const emailErr = document.querySelector("#emailError");
    const passwordErr = document.querySelector("#passwordError");
    const email = y[0];
    const passwd = y[1];

    setPassword(y[1]);
    setEmail(y[0]);

    let buttons = document.querySelectorAll("main button");
    buttons[1].textContent="Iniciar sesión";
    buttons[2].textContent="Crear cuenta";
    buttons[2].addEventListener("click", ()=>{
        window.location.href="../HTML/userRegistration.html";
    })
    buttons[3].textContent="Incidencias";
    buttons[3].addEventListener("click", ()=>{
        window.location.href="../HTML/incidents.html";
    })
    document.querySelector(".helpText").textContent ="Si surgió algún problema, ¡No dudes en avisarnos!";

    validateLogInPassword(passwd, passwordErr);
    validateEmail(email, emailErr);

    buttons[1].addEventListener("click", async () => {
        if (validateFormatEmail(email.value) && validateFormatPassword(passwd.value)) {
            const data = await fetch("../../backend/users.json").then(res => res.json());
            const user = data.Users.find(u => u.Password === passwd.value && u.Gmail === email.value);
            if (!user) {
                emailErr.textContent = "Correo o contraseña incorrectos";
                emailErr.style.color = "red";
                return;
            }
            localStorage.setItem("loggedUserId", user.Id);
            window.location.replace(document.referrer || "../HTML/index.html");
        }
    });

    buttons[0].addEventListener("click", ()=>{
        history.back();
    })
}

function validateLogInPassword(passwd, passwordErr) {
    passwd.addEventListener("blur", () => {
        if (validateFormatPassword(passwd.value)) {
            passwd.style.border = "2px solid green";
            passwordErr.textContent = "";
        } else {
            passwd.style.border = "2px solid red";
            passwordErr.style.color = "red";
            passwordErr.style.marginBottom= "0.8rem"
            passwordErr.textContent = "La contraseña debe contener al menos 8 carácteres, \n una mayuscula, un dígito y un carácter especial (.\\-_...)";
        }
    });

}