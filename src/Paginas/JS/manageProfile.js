
/*

Nota:

Como no tenemos base de datos y no se pueden cambiar los elementos de los JSON,
pues la implementación para realizar cambios en la información del usuario no se
pueden realizar, al menos en este sprint.
 */



document.addEventListener("DOMContentLoaded", async ()=>{
    const usersData = await fetch("../../backend/users.json").then(res=>res.json());
    const user = usersData.Users.find(u => u.Id === Number(localStorage.getItem("loggedUserId")));
    const topicsData = await fetch("../../backend/topics.json").then(res=>res.json());
    let array = [];
    user.Topic.Language.forEach(lang=>{
        const item = topicsData.find(el => el.name === lang);
        array.push(item.id);
    })
    await init();
    await initTopics(array);
    await Promise.all([loadHeader(), loadFooter(), f(user)]);
});



async function f(user){

    document.querySelector(".bannerProfile img").src = user.Avatar;
    document.querySelector(".profileName").textContent = user.Fullname;

    const fieldDescriptor = document.querySelectorAll(".profileInformation p");
    const fields = document.querySelectorAll("main input");
    const description=document.querySelector("textarea");


    fields[0].placeholder="Manuelito123";
    fields[0].value=user.Nickname;
    fields[1].placeholder="Contraseña nueva";
    fields[2].placeholder="Teléfono";
    fields[3].placeholder="example@example.com";
    fields[3].value=user.Gmail;
    fieldDescriptor[0].textContent="Nombre de Usuario";
    fieldDescriptor[1].textContent="Contraseña nueva";
    fieldDescriptor[2].textContent="Número de teléfono";
    fieldDescriptor[3].textContent="Correo electrónico";
    fieldDescriptor[4].textContent="Lenguajes e idiomas";

    description.placeholder="Soy un ingeniero de ...."
    document.querySelector(".userDescription h3").textContent="Descripción";
    document.querySelectorAll(".upload-content p")[0].innerHTML="<strong>Pulsa para cambiar tu foto de perfil</strong>";
    document.querySelectorAll(".upload-content p")[1].innerHTML="<strong>Pulsa para el banner</strong>";
    document.querySelectorAll(".upload-content span")[0].textContent="Tamaño MxN máximo, formato jpg y png";
    document.querySelectorAll(".upload-content span")[1].textContent="Tamaño MxN máximo, formato jpg y png";

    document.querySelectorAll(".profileInformationButtons button")[0].textContent="Actualizar";
    document.querySelectorAll(".profileInformationButtons button")[1].textContent="Cancelar";



    //Cambio de imagen del perfil
    document.querySelectorAll(".file-upload")[0].addEventListener("change",  function(event){
        console.log("Subida imagen de perfil");
        const file = event.target.files[0];

        if (!file) return;

        // Datos básicos del archivo
        console.log('Nombre:', file.name);
        console.log('Tipo:', file.type);
        console.log('Tamaño:', file.size, 'bytes');

        // Leer la imagen como URL (base64) para previsualizar
        const reader = new FileReader();

        reader.onload = function(e) {
            const base64Image = e.target.result;
            console.log('Base64:', base64Image);

            // Ejemplo: previsualizar en un <img>
            // const img = document.querySelector('#preview');
            // img.src = base64Image;
        };

        reader.readAsDataURL(file);
    });

    //Cambio de imagen del banner
    document.querySelectorAll(".uploadContent input")[0].addEventListener("change", async function(){
        console.log("Subida imagen de banner");
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const base64 = e.target.result;
                console.log(base64); // Imagen en base64
                user.Avatar = base64;
            };
        }
    });

    //Confirmar cambios...
    document.querySelectorAll(".profileInformationButtons button")[0].addEventListener("click", async function(){
        console.log("Confirmando cambios...");
        if(fields[0].value!=="" && fields[0].value!==user.Nickname){
            //Guarda el nombre de usuario
        }
        if(fields[1].value!==""){
            //Guarda la contraseña
        }
        if(fields[2].value!=="" && fields[2].value!==user.Number){
            //Guarda el número de teléfono del usuario
        }
        if(fields[3].value!=="" && fields[2].value!==user.Gmail){
            //Guarda el correo
        }

        //Recorrido de topicos selccionados...
        for(let i of selected){

        }
        history.back();

    });


    //Cancela cambios...
    document.querySelectorAll(".profileInformationButtons button")[1].addEventListener("click", async function(){
        history.back()

    });

}