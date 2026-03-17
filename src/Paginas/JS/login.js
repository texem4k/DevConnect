document.addEventListener("DOMContentLoaded", f);

function f (){
    setTimeout(()=>{
        document.querySelector("h1").textContent ="Inicia Sesión";
        let x = document.querySelectorAll("#input p");
        x[0].textContent = "Correo electrónico/Usuario";
        x[1].textContent = "Contraseña";
        let y = document.querySelectorAll("#input input");
        y[0].placeholder = "example@gmail.com";
        y[0].setAttribute("required","");
        y[0].setAttribute("type","email");
        y[0].setAttribute("pattern","^[a-zA-Z0-9.+]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
        y[1].placeholder = "Contraseña";
        y[1].setAttribute("maxlength","32");
        y[1].setAttribute("type","password");
        y[1].setAttribute("minlength","8");
        y[1].setAttribute("pattern","^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,32}$");
        y[1].setAttribute("required","");
        y[1].setAttribute("title","ejemploooooo");

        let buttons = document.querySelectorAll("main button");
        buttons[1].textContent="Iniciar sesión";
        buttons[2].textContent="Crear cuenta";
        buttons[3].textContent="Incidencias";
        buttons[3].href="./incidents.html";
        document.querySelector(".helpText").textContent ="Si surgió algún problema, ¡No dudes en avisarnos!";


    },100)
}