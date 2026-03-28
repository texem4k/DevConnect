export function validateFormatPassword(value) {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/.test(value);
}

export function validateFormatEmail(value) {
    return /^[a-zA-Z0-9.+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
}



export function setPassword(password){
    password.placeholder = "Contraseña";
    password.setAttribute("type","password");
    password.setAttribute("required","");
}

export function setEmail(email){
    email.setAttribute("required","");
    email.setAttribute("type","email");
    email.setAttribute("minlength","4");
    email.placeholder="example@gmail.com";
}


export function setLabel(label){
    label.setAttribute("required","");
    label.setAttribute("type","text");
    label.setAttribute("minlength","4");
    label.setAttribute("maxlength","60");
    label.placeholder="";
}


export function validateSelectedTopics(fieldErr=null, data) {

    let hasPLanguage = false;
    let hasLanguage = false;

    for (let id of selected) {
        const item = data.find(el => el.id === id)
        console.log(id)
        if (!item) continue;

        if (item.cat === "Idioma")   hasPLanguage = true;
        if (item.cat === "Lenguaje") hasLanguage = true;
    }

    if (hasPLanguage && hasLanguage) {
        if(fieldErr===null){
            return true;
        }
        fieldErr.textContent = "";
        document.querySelector(".search-box input").style.border="";
        document.querySelector(".selected-section").style.border="";
        return true;
    } else {
        if(fieldErr===null){
            return false;
        }
        fieldErr.textContent = "Debes seleccionar al menos un idioma y un lenguaje";
        fieldErr.style.color = "red";
        fieldErr.style.marginBottom="1rem";
        document.querySelector(".search-box input").style.border="2px solid red";
        document.querySelector(".selected-section").style.border="2px solid red";
        return false;
    }
}
export function validateProjectName(field, fieldErr, projects){
    if (field.value.trim() === "") {
        fieldErr.textContent = "Nombre del proyecto no puede estar vacío.";
        fieldErr.style.color = "red";
        field.style.border = "solid 2px red";
        return false;
    }

    const exists = projects.projects.some(project => project.title === field.value.trim());

    if (exists) {
        fieldErr.textContent = "Nombre de proyecto ya existe, por favor, introduzca otro.";
        fieldErr.style.color = "red";
        field.style.border = "solid 2px red";
        return false;
    }

    fieldErr.style.color = "green";
    fieldErr.textContent = "Nombre Disponible";
    field.style.border = "solid 2px green";
    return true;
}


export function validateMemberNumber(field,maxUsers){

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



export function validateDate(field, fieldErr){

    const fecha = new Date(field.value);
    const hoy = new Date();

    if (fecha < hoy) {
        fieldErr.textContent = "No puedes poner una fecha anterior a la actual";
        fieldErr.style.color = "red";
        field.value = "";
        field.style.border = "solid 2px red";
        return false;
    }
    else{
        fieldErr.textContent = "";
        return true;
    }


}

export function validateNickname(nickname, nicknameErr, usersData) {
    try {
        if (nickname.value.trim() === "") {
            nicknameErr.textContent = "Nombre de usuario no puede estar vacío.";
            nicknameErr.style.color = "red";
            nickname.style.border = "solid 2px red";
            return false;
        }
        const exists = usersData.Users.some(u => u.Nickname === nickname.value.trim());
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

export function validatePassword(passwd, passwd1, passwdErr) {
    if (!validateFormatPassword(passwd.value)) {
        passwd.style.border = "2px solid red";
        passwd1.style.border = "2px solid red";
        passwdErr.style.color = "red";
        passwdErr.style.marginBottom = "0.8rem";
        passwdErr.textContent = "La contraseña debe contener al menos 8 caracteres, un dígito, un carácter especial y una mayúscula";
        return false;
    }
    if (passwd.value !== passwd1.value) {
        passwd1.style.border = "2px solid red";
        passwdErr.textContent = "Las contraseñas no son iguales";
        passwdErr.style.color = "red";
        return false;
    }
    passwd.style.border = "2px solid green";
    passwd1.style.border = "2px solid green";
    passwdErr.textContent = "";
    return true;
}

export function validateNumber(number, numberErr) {
    if (/^[0-9]{9}$/.test(number.value)) {
        numberErr.textContent = "";
        number.style.border = "";
        return true;
    }
    numberErr.style.justifySelf = "center";
    number.style.border = "2px solid red";
    numberErr.textContent = "Por favor, introduzca tu número completo";
    numberErr.style.gridColumn = "1";
    numberErr.style.color = "red";
    return false;
}

export function validateFullname(name, surname) {
    if (name.value.trim() === "" || surname.value.trim() === "") {
        document.querySelectorAll("input")[4].style.border = "2px red solid";
        document.querySelectorAll("input")[3].style.border = "2px red solid";
        return false;
    }
    document.querySelectorAll("input")[4].style.border = "";
    document.querySelectorAll("input")[3].style.border = "";
    return true;
}


export function validateEmail(email, emailErr){
    emailErr.style.gridColumn = "2";
    emailErr.style.justifySelf = "center";

    if (validateFormatEmail(email.value)) {
        email.style.border = "2px solid green";
        emailErr.textContent = "";
        return true;
    } else if (email.value === "") {
        emailErr.textContent = "Debes agregar algún correo";
        emailErr.style.color = "red";
        email.style.border = "2px solid red";
        return true;
    } else {

        email.style.border = "2px solid red";
        emailErr.style.color = "red";
        emailErr.style.gridColumn = "2";
        emailErr.textContent = "Correo inválido, por favor, introuduzca uno válido.";
        return false;
    }
}


export function validateOption() {
    const val = document.querySelector("input:checked")?.value ?? null;
    if(val){
        document.querySelector('.particularOption').style.border="";
        document.querySelector('.companyOption').style.border="";
        document.querySelectorAll(".fieldFeedBack")[4].textContent = "";
        return val
    }
    document.querySelector('.particularOption').style.border="solid red 2px";
    document.querySelector('.companyOption').style.border="solid red 2px";
    document.querySelectorAll(".fieldFeedBack")[4].textContent = "Debes marcar una opción";
    document.querySelectorAll(".fieldFeedBack")[4].style.color = "red";
    document.querySelectorAll(".fieldFeedBack")[4].style.marginBottom="1rem";
    return null;
}