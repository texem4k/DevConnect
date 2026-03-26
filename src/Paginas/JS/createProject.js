document.addEventListener("DOMContentLoaded", async ()=>{
    await init();
    await Promise.all([f(),loadFooter()]);
});
import {setEmail, setLabel, validateSelectedTopics} from "./validators.js";
import {previewUserImage} from "./utils.js";



async function f (){
    const res = await fetch("../../backend/topics.json");
    const data = await res.json();

    setTimeout( ()=>{

        document.querySelectorAll("button")[0].addEventListener("click", ()=>{
            history.back()
        });

        document.querySelector("h1").textContent = "Creación de proyecto"
        let fields = document.querySelectorAll("input");
        let fieldDescriptor = document.querySelectorAll(".form p");
        let description = document.querySelector("textarea");
        const errors=document.querySelectorAll(".fieldFeedBack");
        const maxUsers=20;
        description.style.resize="none";
        fieldDescriptor[0].textContent="* Nombre del proyecto";
        fieldDescriptor[2].textContent="Descripción";
        fieldDescriptor[3].textContent="Correo de contacto";
        fieldDescriptor[4].textContent="Teléfono de contacto";
        fieldDescriptor[5].textContent="Fecha máxima de inscripción";
        fieldDescriptor[6].textContent="* Número de participantes (Máx 20)";

        setLabel(fields[0]);
        setEmail(fields[1]);
        fields[1].removeAttribute("required");

        fields[3].setAttribute("max", "2099-12-31")
        fields[4].setAttribute("required", "");
        fields[4].setAttribute("type", "number");
        fields[4].setAttribute("min", "1");
        fields[4].setAttribute("max", "20");
        fields[4].setAttribute("value", "1");

        fields[0].placeholder="Nombre del proyecto";
        description.placeholder="Mi proyecto basado en Java tiene como finalidad...";
        fields[1].placeholder="example@gmail.com";
        fields[2].placeholder="";
        fields[4].placeholder="";
        document.querySelectorAll("h2")[0].textContent = "* Selecciona como mínimo un lenguaje y un idioma (Recomendamos al menos inglés)";
        document.querySelectorAll("h2")[1].textContent = "De forma, opcional, puedes añadir una imagen como banner:";

        validateProjectName(fields[0],errors[0]);
        previewUserImage();
        validateMemberNumber(fields[4], maxUsers);
        validateDate(fields[3], null);


        document.querySelectorAll("button")[3].textContent="Crear proyecto";
        document.querySelectorAll("button")[3].addEventListener("click", async (e) =>{
            e.preventDefault();
            if(!validateSelectedTopics(errors[1], data)) return null;
            if(fields[4].value === ""){
                fields[4].value=1;
            }
            console.log("Proyecto creado");
            history.back();

        });

        },100);
}





function validateProjectName(field, fieldErr){
    field.addEventListener("blur", async ()=>{
        try {
            const res = await fetch("../../backend/projects.json");
            const data = await res.json();

            if (field.value.trim() === "") {
                fieldErr.textContent = "Nombre del proyecto no puede estar vacío.";
                fieldErr.style.color = "red";
                field.style.border = "solid 2px red";
                return;
            }

            const exists = data.projects.some(project => project.title === field.value.trim());

            if (exists) {
                fieldErr.textContent = "Nombre de proyecto ya existe, por favor, introduzca otro.";
                fieldErr.style.color = "red";
                field.style.border = "solid 2px red";
                return;
            }

            fieldErr.style.color = "green";
            fieldErr.textContent = "Nombre Disponible";
            field.style.border = "solid 2px green";
        }catch (error) {
            fieldErr.textContent = "Error al validar el nombre de proyecto.";
            fieldErr.style.color = "red";
            field.style.border = "solid 2px red";
            console.error(error);
        }
    });
}


function validateMemberNumber(field,maxUsers){

    field.addEventListener("input", function () {
        const max = parseInt(this.max, maxUsers);
        if (this.value > max) {
            this.value = max;
        }
        if(this.value < 0) {
            this.value = 0;
        }
    })
}



function validateDate(field){

    field.addEventListener("blur", () => {
        const fecha = new Date(field.value);
        const hoy = new Date();

        if (fecha < hoy) {
            alert("No puedes seleccionar una fecha anterior a la actual");
            field.value = "";
        }
    });
}
