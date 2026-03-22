

export function validateFormatPassword(value) {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/.test(value);
}

export function validateFormatEmail(value) {
    return /^[a-zA-Z0-9.+]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
}


export function validateEmail(email, emailErr){
    email.addEventListener("blur", () => {
        if (validateFormatEmail(email.value)) {
            email.style.border = "2px solid green";
            emailErr.textContent = "";
        }
        else if(email.value === ""){
            emailErr.textContent = "";
            email.style.border = "";
        }
        else {
            email.style.border = "2px solid red";
            emailErr.style.color = "red";
            emailErr.style.marginBottom= "0.8rem";
            emailErr.style.gridColumn="2";
            emailErr.textContent = "Correo inválido, por favor, introuduzca uno válido.";
        }
    });
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
    label.setAttribute("maxlength","40");
    label.placeholder="";
}
