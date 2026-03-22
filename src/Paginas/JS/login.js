document.addEventListener("DOMContentLoaded", f);

import {validateFormatPassword, validateFormatEmail, validateEmail,
    setPassword, setEmail}from "./validators.js";

async function f (){
    setTimeout(()=>{
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


        buttons[1].addEventListener("click", async ()=>{
            if(validateFormatEmail(email, emailErr) && validateFormatPassword(passwd, passwordErr)){
                //Realizar busqueda del correo en la BD y verificar si hay algún usuario
                //Vinculado a ese correo
                const data = await fetch("../../backend/users.json").then(res => res.json());

                const user = data.find(user => user.Password === passwd && user.gmail === email);
                localStorage.setItem("loggedUserId", user.Id);
                history.back();
            }
        })

        buttons[0].addEventListener("click", ()=>{
            history.back();
        })

    },100)
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