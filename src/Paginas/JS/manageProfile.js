document.addEventListener("DOMContentLoaded", async () => {
    await init();
    const [usersData, topicsData] = await Promise.all([
        fetch("../../backend/users.json").then(res => res.json()),
        fetch("../../backend/topics.json").then(res => res.json())
    ]);

    const user = usersData.Users.find(u => u.Id === Number(localStorage.getItem("loggedUserId")));
    const selectedTopicIds = getSelectedTopicIds(user, topicsData);

    await initTopics(selectedTopicIds);
    await Promise.all([loadHeader(), loadFooter(), loadManageProfile(user)]);
});

function getSelectedTopicIds(user, topicsData) {
    return user.Topic.Language.map(lang => {
        const item = topicsData.find(el => el.name === lang);
        return item?.id;
    }).filter(Boolean);
}

async function loadManageProfile(user) {
    setProfileHeader(user);
    setFieldDescriptors();
    setFieldValues(user);
    setUploadLabels();
    setButtonLabels();
    setupImageUploads(user);
    setupButtons(user);
}

function setProfileHeader(user) {
    document.querySelector(".bannerProfile img").src = user.Avatar;
    document.querySelector(".profileName").textContent = user.Fullname;
}

function setFieldDescriptors() {
    const desc = document.querySelectorAll(".profileInformation p");
    desc[0].textContent = "Nombre de Usuario";
    desc[1].textContent = "Contraseña nueva";
    desc[2].textContent = "Número de teléfono";
    desc[3].textContent = "Correo electrónico";
    desc[4].textContent = "Lenguajes e idiomas";
    document.querySelector(".userDescription h3").textContent = "Descripción";
}

function setFieldValues(user) {
    const fields      = document.querySelectorAll("main input");
    const description = document.querySelector("textarea");

    fields[0].placeholder = "Manuelito123";
    fields[0].value       = user.Nickname;
    fields[1].placeholder = "Contraseña nueva";
    fields[2].placeholder = "Teléfono";
    fields[3].placeholder = "example@example.com";
    fields[3].value       = user.Gmail;
    description.placeholder = "Soy un ingeniero de ...";
}

function setUploadLabels() {
    const paragraphs = document.querySelectorAll(".upload-content p");
    const spans      = document.querySelectorAll(".upload-content span");

    paragraphs[0].innerHTML = "<strong>Pulsa para cambiar tu foto de perfil</strong>";
    paragraphs[1].innerHTML = "<strong>Pulsa para el banner</strong>";
    spans[0].textContent = "Tamaño MxN máximo, formato jpg y png";
    spans[1].textContent = "Tamaño MxN máximo, formato jpg y png";
}

function setButtonLabels() {
    const buttons = document.querySelectorAll(".profileInformationButtons button");
    buttons[0].textContent = "Actualizar";
    buttons[1].textContent = "Cancelar";
}

function setupImageUploads(user) {
    document.querySelectorAll(".file-upload")[0].addEventListener("change", (e) => {
        handleImageUpload(e.target.files[0], (base64) => {
            console.log("Foto de perfil en base64:", base64);
        });
    });

    document.querySelectorAll(".uploadContent input")[0].addEventListener("change", function () {
        handleImageUpload(this.files[0], (base64) => {
            console.log("Banner en base64:", base64);
            user.Avatar = base64;
        });
    });
}

function handleImageUpload(file, onLoad) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => onLoad(e.target.result);
    reader.readAsDataURL(file);
}

function setupButtons(user) {
    const buttons = document.querySelectorAll(".profileInformationButtons button");
    buttons[0].addEventListener("click", () => handleSaveChanges(user));
    buttons[1].addEventListener("click", () => history.back());
}

async function handleSaveChanges(user) {
    const fields = document.querySelectorAll("main input");
    console.log("Confirmando cambios...");

    if (fields[0].value !== "" && fields[0].value !== user.Nickname) {
        // Guarda el nombre de usuario
    }
    if (fields[1].value !== "") {
        // Guarda la contraseña
    }
    if (fields[2].value !== "" && fields[2].value !== user.Number) {
        // Guarda el número de teléfono
    }
    if (fields[3].value !== "" && fields[3].value !== user.Gmail) {
        // Guarda el correo
    }

    for (let i of selected) {
        // Recorrido de topics seleccionados
    }

    history.back();
}