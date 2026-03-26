
document.addEventListener("DOMContentLoaded", async ()=>{
    await init();
    await Promise.all([f(),loadFooter()]);
});


import {
    validateFormatPassword,
    validateEmail,
    setPassword,
    setEmail,
    setLabel, validateSelectedTopics,
} from "./validators.js";


import {
    previewUserImage
} from "./utils.js";




async function f () {

    const res = await fetch("../../backend/users.json");
    if (!res.ok) throw new Error("Error al cargar users.json");
    const users = await res.json();

    const res1 = await fetch("../../backend/topics.json");
    if (!res1.ok) throw new Error("Error al cargar topics.json");
    const topics = await res1.json();

    setTimeout(() => {
        document.querySelector(".title").textContent = "Registro en Devconnect";
        let titles = document.querySelectorAll("h2");
        titles[0].textContent = "¿Como quieres que te vea el mundo?";
        titles[1].textContent = "Información personal (El nombre y apellido no podrá cambiarse más tarde, tenga cuidado.)";
        titles[2].textContent = "¿Eres un particular o una empresa?";
        titles[3].textContent = "Busca tus especialidades...";

        let x = document.querySelectorAll("#input p");
        x[0].textContent = "* Nombre de usuario";
        x[1].textContent = "* Contraseña para tu cuenta de DevConnect";
        x[2].textContent = "* Repetir contraseña";
        x[3].textContent = "* Nombre";
        x[4].textContent = "* Apellidos";
        x[5].textContent = "* Teléfono móvil";
        x[6].textContent = "* Correo electrónico";

        /*textField tiene todos los campos ordenados así:
        nickname = textFields[0];
        passwd = textFields[1];
        passwd1 = textFields[2];
        userName = textFields[3];
        surname = textFields[4];
        phone_number = textFields[5];
        email = textFields[6];
         */
        document.querySelectorAll("button")[0].addEventListener("click", ()=>{
            history.back();
        })
        let textFields = document.querySelectorAll("#input input");


        const nicknameErr = document.querySelectorAll(".description")[0];
        const passwdErr = document.querySelectorAll(".description")[1];
        const emailErr = document.querySelectorAll(".description")[2];
        const numberErr = document.querySelectorAll(".description")[3];
        const submit = document.querySelector(".endButton");
        let nicknameValid = false;
        let passwordValid = false;
        let emailValid = false;
        let fullnameValid = false;
        let numberValid = false;
        let radioInputSelected = null;
        let topicsSelected = null;


        document.querySelectorAll(".description")[4].textContent = "Como particular tienes todas las opciones que " +
            "dispone Devconnect para conectar, crear y unirte\n diversos proyectos, ya sean creados por empresas u gente cómo tú."

        document.querySelectorAll(".description")[5].textContent = "Como empresa tienes todas las opciones que " +
            "dispone un usuario particular, pero con otras opciones más enfocadas al entorno laboral, cómo poder contactar con\n" +
            "los usuarios que cumplan ciertos criterios que establezcas, hacer rondas de contratación y entre otros."
        document.querySelectorAll(".typeUser")[0].textContent = "Crear cuenta cómo particular";
        document.querySelectorAll(".typeUser")[1].textContent = "Crear cuenta cómo empresa";
        setLabel(textFields[0]);
        setPassword(textFields[1]);
        setPassword(textFields[2]);
        setLabel(textFields[3]);
        textFields[3].placeholder = "John";
        setLabel(textFields[4]);
        textFields[4].placeholder = "Doe";

        textFields[5].setAttribute("type", "tel");
        textFields[5].setAttribute("maxlength", "9");
        textFields[5].setAttribute("pattern", "^[0-9]{9}$");
        textFields[5].placeholder = "";
        setEmail(textFields[6]);





        //Detecta si ha pulsado el input de tipo radio y cual de ellos
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', () => {
                radioInputSelected = document.querySelector('input:checked')?.value ?? null;
            });
        });



        //Cuando cambia el campo Nombre Usuario
        textFields[0].addEventListener("blur", async () => {
            nicknameValid = await validateNickname(textFields[0], nicknameErr, users);
        });

        //Cuando cambia cualquier campo Contraseña
        [textFields[1],textFields[2]].forEach(a =>{
            a.addEventListener("blur", async () => {
                passwordValid = await validatePassword(textFields[1], textFields[2], passwdErr);
            });
        });

        //Cuando cambia cualquier campo Nombre/Apellidos

        [textFields[4],textFields[3]].forEach(e=>{
            e.addEventListener("input", async () => {
                e.value = e.value.replace(/\d/d,"");
            })
        });
        textFields[4].addEventListener("blur", async () => {
            fullnameValid = await validateFullname(textFields[3], textFields[4]);
        });


        //Cuando cambia el campo Numero
        textFields[5].addEventListener("blur", async () => {
            numberValid = await validateNumber(textFields[5], numberErr);
        });
        textFields[5].addEventListener("input", async ()=> {
            textFields[5].value = textFields[5].value.replace(/\D/g, "");
        })

        //Cuando cambia el campo Numero
        textFields[6].addEventListener("blur", async () => {
            emailValid = validateEmail(textFields[6], emailErr);
        });

        submit.addEventListener("click", async ()=>{
            topicsSelected= validateSelectedTopics(undefined, topics);
            if(radioInputSelected===null){
                alert("Debes seleccionar una opción")
            }
            if(topicsSelected===false){
                alert("Debes seleccionar al menos un idioma y un lenguaje como especialidades")
            }
            console.log(topicsSelected);
            if(passwordValid && emailValid && nicknameValid && numberValid && fullnameValid && radioInputSelected && topicsSelected){
                console.log("Registrado!")
            }

        });

        previewUserImage();
    },100);


}



//-----------------------------------------------------------------------------------------------------



async function validatePassword(passwd, passwd1, passwdErr){
    if (validateFormatPassword(passwd.value)) {
        if (passwd.value === passwd1.value) {
            passwd.style.border = "2px solid green";
            passwd1.style.border = "2px solid green";
            passwdErr.textContent = "";
            return true;
        } else {
            passwd1.style.border = "2px solid red";
            passwdErr.textContent = "Las contraseñas no son iguales";
            passwdErr.style.color = "red";
            return false;
        }

    } else {
        passwd1.style.border = "2px solid red";
        passwd.style.border = "2px solid red";
        passwdErr.style.color = "red";
        passwdErr.style.marginBottom = "0.8rem"
        passwdErr.textContent = "La contraseña debe contener al menos 8 carácteres, un dígito, un carácter especial y una mayúscula";
        return false;
    }
}


async function validateNumber(number, numberErr){
    if (/^[0-9]{9}$/.test(number.value)) {
        numberErr.textContent = "";
        number.style.border="";
        return true;
    } else {
        number.style.border = "2px solid red";
        numberErr.textContent = "Por favor, introduzca tu número completo";
        numberErr.style.color = "red";
        numberErr.style.gridColumn = "1";
        numberErr.style.gridRow = "3";
        return false;
    }
}


async function validateNickname(nickname, nicknameErr, data) {
    try {
        if (nickname.value.trim() === "") {
            nicknameErr.textContent = "Nombre de usuario no puede estar vacío.";
            nicknameErr.style.color = "red";
            nickname.style.border = "solid 2px red";
            return false;
        }

        const exists = data.Users.some(user => user.Nickname === nickname.value.trim());
        if (exists) {
            nicknameErr.textContent = "Nombre de usuario ya existe.";
            nicknameErr.style.color = "red";
            nickname.style.border = "solid 2px red";
            return false;
        }

        nicknameErr.style.color = "green";
        nicknameErr.textContent = "Nombre Disponible";
        nickname.style.border = "solid 2px green";
        return true;

    } catch (error) {
        nicknameErr.textContent = "Error al validar el nombre de usuario.";
        nicknameErr.style.color = "red";
        nickname.style.border = "solid 2px red";
        console.error(error);
        return false;
    }
}


async function validateFullname(name, surname) {
    if (name.value.trim() === "" || surname.value.trim() === "") {
        alert("Los campos Nombre y Apellidos no pueden estar vacíos")
        return false;
    }
    return true;


}



