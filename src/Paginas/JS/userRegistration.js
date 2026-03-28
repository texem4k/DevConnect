import {validateEmail, setPassword, setEmail, setLabel,
    validateSelectedTopics, validateNickname, validatePassword,
    validateNumber, validateFullname, validateOption } from "../../utils/validators.js";
import { previewUserImage } from "../../utils/previewUserImage.js";





document.addEventListener("DOMContentLoaded", async () => {
    await init();
    await Promise.all([loadRegistration(), loadFooter()]);
});

async function loadRegistration() {
    const [usersData, topicsData] = await Promise.all([
        fetch("../../backend/users.json").then(res => res.json()),
        fetch("../../backend/topics.json").then(res => res.json())
    ]);
    const fields = document.querySelectorAll("#input input");
    const errors = document.querySelectorAll(".fieldFeedBack");


    setPageContent(fields, errors);
    setInputAttributes(fields);
    const state = setupFormState();
    setupValidations(usersData, state, fields, errors, topicsData);
    setupSubmit(topicsData, state, fields, errors, usersData);
    previewUserImage();
}





function setPageContent() {
    document.querySelector(".title").textContent = "Registro en Devconnect";

    const titles = document.querySelectorAll("h2");
    titles[0].textContent = "¿Como quieres que te vea el mundo?";
    titles[1].textContent = "Información personal (El nombre y apellido no podrá cambiarse más tarde, tenga cuidado.)";
    titles[2].textContent = "¿Eres un particular o una empresa?";
    titles[3].textContent = "Busca tus especialidades...";

    const labels = document.querySelectorAll("#input p");
    labels[0].textContent = "* Nombre de usuario";
    labels[1].textContent = "* Contraseña para tu cuenta de DevConnect";
    labels[2].textContent = "* Repetir contraseña";
    labels[3].textContent = "* Nombre";
    labels[4].textContent = "* Apellidos";
    labels[5].textContent = "* Teléfono móvil";
    labels[6].textContent = "* Correo electrónico";

    const descriptions = document.querySelectorAll(".description");
    descriptions[0].textContent = "Como particular tienes todas las opciones que dispone Devconnect para conectar, crear y unirte diversos proyectos, ya sean creados por empresas u gente cómo tú.";
    descriptions[1].textContent = "Como empresa tienes todas las opciones que dispone un usuario particular, pero con otras opciones más enfocadas al entorno laboral, cómo poder contactar con los usuarios que cumplan ciertos criterios que establezcas, hacer rondas de contratación y entre otros.";

    document.querySelectorAll(".typeUser")[0].textContent = "Crear cuenta cómo particular";
    document.querySelectorAll(".typeUser")[1].textContent = "Crear cuenta cómo empresa";

    document.querySelectorAll("button")[0].addEventListener("click", () => history.back());
}

function setInputAttributes(fields) {
    setLabel(fields[0]);
    setPassword(fields[1]);
    setPassword(fields[2]);
    setLabel(fields[3]);
    fields[3].placeholder = "John";
    setLabel(fields[4]);
    fields[4].placeholder = "Doe";
    fields[5].setAttribute("type", "tel");
    fields[5].setAttribute("maxlength", "9");
    fields[5].setAttribute("pattern", "^[0-9]{9}$");
    fields[5].placeholder = "";
    setEmail(fields[6]);
}

function setupFormState() {
    return {
        nicknameValid:  false,
        passwordValid:  false,
        emailValid:     false,
        fullnameValid:  false,
        numberValid:    false,
        radioSelected:  null,
        topicValid:  false,
    };
}

function setupValidations(usersData, state, fields, errors, topicsData) {

    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener("change", () => {
            state.radioSelected = validateOption();
        });
    });

    document.querySelector('.search-container input').addEventListener("blur", () => {
        state.topicValid = validateSelectedTopics(errors[5], topicsData);
    });


    fields[0].addEventListener("blur", async () => {
        state.nicknameValid = validateNickname(fields[0], errors[0], usersData);
    });

    [fields[1], fields[2]].forEach(f => {
        f.addEventListener("blur", async () => {
            state.passwordValid = validatePassword(fields[1], fields[2], errors[1]);
        });
    });

    [fields[3], fields[4]].forEach(f => {
        f.addEventListener("input", () => {
            f.value = f.value.replace(/\d/g, "");
        });
    });

    [fields[3],fields[4]].forEach(f =>{
        f.addEventListener("blur", async () => {
            state.fullnameValid = validateFullname(fields[3], fields[4]);
        });
    });

    fields[5].addEventListener("blur", async () => {
        state.numberValid = validateNumber(fields[5], errors[3]);
    });
    fields[5].addEventListener("input", () => {
        fields[5].value = fields[5].value.replace(/\D/g, "");
    });

    fields[6].addEventListener("blur", () => {
        state.emailValid = validateEmail(fields[6], errors[2]);
    });
}

function setupSubmit(topicsData, state, fields, errors, usersData) {
    document.querySelector(".endButton").addEventListener("click", async () => {
        state.nicknameValid = validateNickname(fields[0], errors[0], usersData);
        state.passwordValid = validatePassword(fields[1], fields[2], errors[1]);
        state.fullnameValid = validateFullname(fields[3], fields[4]);
        state.numberValid = validateNumber(fields[5], errors[2]);
        state.emailValid = validateEmail(fields[6], errors[3]);
        state.topicValid = validateSelectedTopics(errors[5], topicsData);
        state.radioSelected = validateOption();


        if (state.passwordValid && state.emailValid && state.nicknameValid && state.numberValid && state.fullnameValid && state.topicValid) {
            console.log("Registrado!");
        }
        else{
            alert("Falta información por añadir");
        }
    });
}