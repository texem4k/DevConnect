import { validateFormatPassword, validateFormatEmail, validateEmail,
    setPassword, setEmail } from "../../utils/validators.js";

document.addEventListener("DOMContentLoaded", async () => {
    await init();
    await Promise.all([loadLogin()]);
});

async function loadLogin() {
    const email      = document.querySelectorAll("#input input")[0];
    const passwd     = document.querySelectorAll("#input input")[1];
    const emailErr   = document.querySelector("#emailError");
    const passwordErr = document.querySelector("#passwordError");
    const buttons    = document.querySelectorAll("main button");

    setPageContent(buttons);
    setInputAttributes(email, passwd);
    setupValidations(email, emailErr, passwd, passwordErr);
    setupButtons(buttons, email, passwd, emailErr);
}

function setPageContent(buttons) {
    document.querySelector("h1").textContent = "Inicia Sesión";
    document.querySelector(".helpText").textContent = "Si surgió algún problema, ¡No dudes en avisarnos!";

    const labels = document.querySelectorAll("#input p");
    labels[0].textContent = "Correo electrónico";
    labels[1].textContent = "Contraseña";

    buttons[1].textContent = "Iniciar sesión";
    buttons[2].textContent = "Crear cuenta";
    buttons[3].textContent = "Incidencias";
}

function setInputAttributes(email, passwd) {
    setEmail(email);
    setPassword(passwd);
    addPasswordToggle(passwd);
}

function addPasswordToggle(passwd) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("password-wrapper");
    const inputWidth = passwd.offsetWidth;
    wrapper.style.width = inputWidth + "px";

    passwd.parentNode.insertBefore(wrapper, passwd);
    wrapper.appendChild(passwd);

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.classList.add("toggle-password");
    toggleBtn.textContent = "👁️";
    toggleBtn.style.transform = "translateY(-60%)";
    wrapper.appendChild(toggleBtn);

    toggleBtn.addEventListener("click", () => {
        const isPassword = passwd.type === "password";
        passwd.type = isPassword ? "text" : "password";
        toggleBtn.textContent = isPassword ? "🙈" : "👁️";
    });
}
function setupValidations(email, emailErr, passwd, passwordErr) {
    email.addEventListener("blur", () => validateEmail(email, emailErr));
    passwd.addEventListener("blur", () => validateLoginPassword(passwd, passwordErr));
}



function validateLoginPassword(passwd, passwordErr) {
    if (validateFormatPassword(passwd.value)) {
        passwd.style.border = "2px solid green";
        passwordErr.textContent = "";
    } else {
        passwd.style.border = "2px solid red";
        passwordErr.style.color = "red";
        passwordErr.style.marginBottom = "0.8rem";
        passwordErr.textContent = "La contraseña debe contener al menos 8 caracteres, una mayúscula, un dígito y un carácter especial (.\\-_...)";
    }
}

function setupButtons(buttons, email, passwd, emailErr) {
    buttons[0].addEventListener("click", () => {
        document.referrer ? history.back() : window.location.href = "../HTML/index.html";
    });

    buttons[1].addEventListener("click", async () => {
        await handleLogin(email, passwd, emailErr);
    });

    buttons[2].addEventListener("click", () => {
        window.location.href = "../HTML/userRegistration.html";
    });

    buttons[3].addEventListener("click", () => {
        window.location.href = "../HTML/incidents.html";
    });
}

async function handleLogin(email, passwd, emailErr) {
    if (!validateFormatEmail(email.value) || !validateFormatPassword(passwd.value)) return;

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