

export function validateFormatPassword(value) {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/.test(value);
}

export function validateFormatEmail(value) {
    return /^[a-zA-Z0-9.+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
}


export function validateEmail(email, emailErr){
    if (validateFormatEmail(email.value)) {
        email.style.border = "2px solid green";
        emailErr.textContent = "";
        return true;
    } else if (email.value === "") {
        emailErr.textContent = "";
        email.style.border = "";
        return true;
    } else {
        email.style.border = "2px solid red";
        emailErr.style.color = "red";
        emailErr.style.marginBottom = "0.8rem";
        emailErr.style.gridColumn = "2";
        emailErr.textContent = "Correo inválido, por favor, introuduzca uno válido.";
        return false;
    }
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
        return true;
    } else {
        if(fieldErr===null){
            return false;
        }
        fieldErr.textContent = "Debes seleccionar al menos un idioma y un lenguaje";
        fieldErr.style.color = "red";
        return false;
    }
}