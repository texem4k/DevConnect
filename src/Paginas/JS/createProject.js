import {
    setEmail, setLabel, validateSelectedTopics, validateProjectName, validateMemberNumber, validateDate
} from "../../utils/validators.js";
import { previewUserImage } from "../../utils/previewUserImage.js";

document.addEventListener("DOMContentLoaded", async () => {
    await init();
    await Promise.all([loadCreateProject(), loadFooter()]);
});

async function loadCreateProject() {
    const topics = await fetch("../../backend/topics.json").then(res => res.json());
    const projects = await fetch("../../backend/projects.json").then(res => res.json());

    const fields = document.querySelectorAll("input");
    const errors = document.querySelectorAll(".fieldFeedBack");
    const state=setupFormState();
    setupForm(topics, projects, fields, errors, state);
    setupButtons();
    setupSubmit(topics, projects, state,fields,errors);
}

function setupForm(topics, projects, fields, errors, state) {
    const fieldDesc   = document.querySelectorAll(".form p");
    const description = document.querySelector("textarea");
    const maxUsers    = 20;

    document.querySelector("h1").textContent = "Creación de proyecto";
    description.style.resize = "none";



    document.querySelector('.search-container input').addEventListener("blur", async () => {
        state.topicValid = validateSelectedTopics(errors[2], topics);
    });


    fields[0].addEventListener("blur", async () => {
        state.nameProjectValid = validateProjectName(fields[0], errors[0], projects);
    });

    fields[3].addEventListener("change", async () => {
        state.dateValid = validateDate(fields[3], errors[1]);
    });



    setFieldDescriptors(fieldDesc);
    setFieldAttributes(fields, maxUsers);
    setPlaceholders(fields, description);
    setH2Labels();
    setupCalendarBtn(fields);
    validateMemberNumber(fields[4], maxUsers);
    previewUserImage();
}

function setFieldDescriptors(fieldDesc) {
    fieldDesc[0].textContent = "* Nombre del proyecto";
    fieldDesc[2].textContent = "Descripción";
    fieldDesc[3].textContent = "Correo de contacto";
    fieldDesc[4].textContent = "Teléfono de contacto";
    fieldDesc[5].textContent = "Fecha máxima de inscripción";
    fieldDesc[7].textContent = "* Número de participantes (Máx 20)";
}

function setFieldAttributes(fields, maxUsers) {
    setLabel(fields[0]);
    setEmail(fields[1]);
    fields[1].removeAttribute("required");
    fields[3].setAttribute("max", "2099-12-31");
    fields[4].setAttribute("required", "");
    fields[4].setAttribute("type", "number");
    fields[4].setAttribute("min", "1");
    fields[4].setAttribute("max", String(maxUsers));
    fields[4].setAttribute("value", "1");
}

function setPlaceholders(fields, description) {
    fields[0].placeholder = "Nombre del proyecto";
    fields[1].placeholder = "example@gmail.com";
    fields[2].placeholder = "";
    fields[4].placeholder = "";
    description.placeholder = "Mi proyecto basado en Java tiene como finalidad...";
}

function setH2Labels() {
    document.querySelectorAll("h2")[0].textContent = "* Selecciona como mínimo un lenguaje y un idioma (Recomendamos al menos inglés)";
    document.querySelectorAll("h2")[1].textContent = "De forma, opcional, puedes añadir una imagen como banner:";
}

function setupCalendarBtn(fields) {
    const calendarBtn = document.querySelector(".calendar-btn");
    const dateField = fields[3]; // el input de fecha

    calendarBtn.addEventListener("click", () => {
        dateField.showPicker();
    });
}
function setupButtons() {
    const buttons = document.querySelectorAll("button");
    buttons[0].addEventListener("click", () => history.back());
    buttons[3].textContent = "Crear proyecto";
}




function setupSubmit(topics, projects, state, fields, errors) {
    const buttons = document.querySelectorAll("button");

    buttons[3].addEventListener("click", async () => {
        state.topicValid = validateSelectedTopics(errors[2], topics);
        state.dateValid = validateDate(fields[3], errors[1]);
        state.nameProjectValid = validateProjectName(fields[0], errors[0], projects);
        if (state.nameProjectValid && state.topicValid && state.dateValid) {
            console.log("Proyecto creado!");
            window.location.href = "../HTML/manageProject.html";
        }
        else{
            alert("Falta información por añadir");
        }
    });
}


function setupFormState() {
    return {
        nameProjectValid:  false,
        topicValid:  false,
        dateValid:  false
    };
}