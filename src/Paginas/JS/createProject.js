import { setEmail, setLabel, validateSelectedTopics, validateProjectName, validateMemberNumber, validateDate } from "../../utils/validators.js";
import { previewUserImage } from "../../utils/previewUserImage.js";

document.addEventListener("DOMContentLoaded", async () => {
    await init();
    await Promise.all([loadCreateProject(), loadFooter()]);
});

async function loadCreateProject() {
    const data = await fetch("../../backend/topics.json").then(res => res.json());
    setupForm();
    setupButtons(data);
}

function setupForm() {
    const fields      = document.querySelectorAll("input");
    const fieldDesc   = document.querySelectorAll(".form p");
    const description = document.querySelector("textarea");
    const errors      = document.querySelectorAll(".fieldFeedBack");
    const maxUsers    = 20;

    document.querySelector("h1").textContent = "Creación de proyecto";
    description.style.resize = "none";

    setFieldDescriptors(fieldDesc);
    setFieldAttributes(fields, maxUsers);
    setPlaceholders(fields, description);
    setH2Labels();
    setupCalendarBtn(fields);
    validateProjectName(fields[0], errors[0]);
    validateMemberNumber(fields[4], maxUsers);
    validateDate(fields[3]);
    previewUserImage();
}

function setFieldDescriptors(fieldDesc) {
    fieldDesc[0].textContent = "* Nombre del proyecto";
    fieldDesc[2].textContent = "Descripción";
    fieldDesc[3].textContent = "Correo de contacto";
    fieldDesc[4].textContent = "Teléfono de contacto";
    fieldDesc[5].textContent = "Fecha máxima de inscripción";
    fieldDesc[6].textContent = "* Número de participantes (Máx 20)";
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
function setupButtons(data) {
    const buttons = document.querySelectorAll("button");
    const fields  = document.querySelectorAll("input");
    const errors  = document.querySelectorAll(".fieldFeedBack");

    buttons[0].addEventListener("click", () => history.back());

    buttons[3].textContent = "Crear proyecto";
    buttons[3].addEventListener("click", async (e) => {
        e.preventDefault();
        if (!validateSelectedTopics(errors[1], data)) return;
        if (fields[4].value === "") fields[4].value = 1;
        console.log("Proyecto creado");
        history.back();
    });
}