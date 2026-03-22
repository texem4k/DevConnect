document.addEventListener("DOMContentLoaded", f);


import {
    validateFormatPassword,
    validateEmail,
    setPassword,
    setEmail,
    setLabel
} from "./validators.js";


function f () {
    setTimeout(() => {
        document.querySelector(".title").textContent = "Registro en Devconnect";
        let titles = document.querySelectorAll("h2");
        titles[0].textContent = "¿Como quieres que te vea el mundo?";
        titles[1].textContent = "Información personal";
        titles[2].textContent = "¿Eres un particular o una empresa?";
        titles[3].textContent = "Busca tus especialidades...";

        let x = document.querySelectorAll("#input p");
        x[0].textContent = "Nombre de usuario";
        x[1].textContent = "Contraseña para tu cuenta de DevConnect";
        x[2].textContent = "Repetir contraseña";
        x[3].textContent = "Nombre";
        x[4].textContent = "Apellidos";
        x[5].textContent = "Teléfono móvil";
        x[6].textContent = "Correo electrónico";

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

        validateRegisterPassword(textFields[1], textFields[2], passwdErr);
        validateEmail(textFields[6], emailErr);
        validateNickname(textFields[0], nicknameErr);
        validateNumber(textFields[5], numberErr);
        previewUserImage();

        submit.addEventListener("click", ()=>{
        });

    },100);


}



//-----------------------------------------------------------------------------------------------------




function previewUserImage(){
    const input = document.getElementById('fileInput');
    const preview = document.getElementById('imagenPreview');
    input.addEventListener('change', function () {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();

            reader.addEventListener('load', function () {
                preview.src = reader.result;
                preview.style.display = 'block';
            });

            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none';
        }
    });
}


function validateRegisterPassword(passwd, passwd1, passwdErr){
    passwd1.addEventListener("blur", () => {
        if (validateFormatPassword(passwd.value)) {
            if(passwd.value===passwd1.value){
                passwd.style.border = "2px solid green";
                passwd1.style.border = "2px solid green";
                passwdErr.textContent = "";
                return [true,passwd.value];
            }
            else{
                passwd1.style.border = "2px solid red";
                passwdErr.textContent = "Las contraseñas no son iguales";
                passwdErr.style.color = "red";
                return [false];
            }

        }
        else{
            passwd1.style.border = "2px solid red";
            passwd.style.border = "2px solid red";
            passwdErr.style.color = "red";
            passwdErr.style.marginBottom= "0.8rem"
            passwdErr.textContent = "La contraseña debe contener al menos 8 carácteres, un dígito, un carácter especial y una mayúscula";
            return [false];
        }
    });
}


function validateNumber(number, numberErr){

    number.addEventListener("input", ()=> {
        number.value = number.value.replace(/\D/g, "");
    })

    return new Promise(resolve => {
        number.addEventListener("blur", () => {
            if (/^[0-9]{9}$/.test(number.value)) {
                numberErr.textContent = "";
                number.style.border="";
                resolve([true, number.value]);
            } else {
                number.style.border = "2px solid red";
                numberErr.textContent = "Por favor, introduzca tu número completo";
                numberErr.style.color = "red";
                numberErr.style.gridColumn = "1";
                numberErr.style.gridRow = "3";
                resolve([false,null]);
            }
        })
    });

}


function validateNickname(nickname, nicknameErr) {
    return new Promise(() => {
        nickname.addEventListener("blur", async () => {
            try {
                const res = await fetch("../../backend/users.json");
                if (!res.ok) throw new Error("Error al cargar users.json");
                const data = await res.json();

                if (nickname.value.trim() === "") {
                    nicknameErr.textContent = "Nombre de usuario no puede estar vacío.";
                    nicknameErr.style.color = "red";
                    nickname.style.border = "solid 2px red";
                    return;
                }

                const exists = data.some(user => user.fullname === nickname.value.trim());
                if (exists) {
                    nicknameErr.textContent = "Nombre de usuario ya existe, por favor, introduzca otro.";
                    nicknameErr.style.color = "red";
                    nickname.style.border = "solid 2px red";
                    return;
                }

                nicknameErr.style.color = "green";
                nicknameErr.textContent = "Nombre Disponible";
                nickname.style.border = "solid 2px green";

            } catch (error) {
                nicknameErr.textContent = "Error al validar el nombre de usuario.";
                nicknameErr.style.color = "red";
                nickname.style.border = "solid 2px red";
                console.error(error);
            }
        });
    });
}



