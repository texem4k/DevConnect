import { cardGrid } from "../../templates/JS/cardGrid.js";

document.addEventListener("DOMContentLoaded", async () => {
    await init();
    await Promise.all([
        loadDataUserProfile(),
        loadHeader(),
        loadFooter()
    ]);
});

async function loadDataUserProfile() {
    const [usersData, projectsData] = await Promise.all([
        fetch("../../backend/users.json").then(res => res.json()),
        fetch("../../backend/projects.json").then(res => res.json())
    ]);

    const loggedUserId = Number(localStorage.getItem("loggedUserId"));
    let profileId = Number(new URLSearchParams(window.location.search).get('id'));
    if (!profileId) profileId = Math.floor(Math.random() * usersData.Users.length) + 1; //esto es por si se hace una carga directa del html 

    const user = usersData.Users.find(p => p.Id === profileId);
    const userProjects = projectsData.projects.filter(p =>
        user.Projects.some(up => up.Name === p.title)
    );

    presentacion(user, loggedUserId);
    await Promise.all([
        informacionAdicional(user),
        cardGrid(userProjects, "Projects", ".cardsSection", (p) => ({
            imgSrc:      p.image, imgAlt:      p.title,
            title:       p.title, description: p.description,
            topics:      (p.requirements?.technologies || []).slice(0, 2),
            onClick:     () => { window.location.href = `../HTML/projectProfile.html?title=${encodeURIComponent(p.title)}`; }
        }))
    ]);
}

function presentacion(user, loggedUserId) {
    document.querySelector(".profilePicture").src = user.Avatar;
    document.querySelector(".profileName").textContent = user.Nickname;
    document.querySelector(".profileDescription p").textContent = user.Description;
    document.querySelector(".bannerProfile").style.backgroundImage = `url(${user.Banner})`;

    const buttons = document.querySelectorAll(".profileInformationButtons button");
    if (user.Id === loggedUserId) {
        buttons[0].style.display = "block";
        buttons[0].textContent = "Editar Perfil";
        buttons[0].addEventListener("click", () => {
            window.location.href = "../HTML/manageProfile.html";
        });
        buttons[1].style.display = "block";
        buttons[1].textContent = "Gestion de proyectos";
        buttons[1].addEventListener("click", () => {
            window.location.href = "../HTML/manageProject.html";
        });
    } else {
        buttons[0].style.display = "none";
        buttons[1].style.display = "none";
    }
}

async function informacionAdicional(user) {
    const Topic = document.querySelectorAll(".userSkillsButton");
    Topic[0].querySelector(".profileInformationTag").textContent = Object.keys(user.Topic)[0];
    Topic[1].querySelector(".profileInformationTag").textContent = Object.keys(user.Topic)[1];

    const template = await fetch("../../templates/HTML/topicBoxBtn.html").then(res => res.text());
    topics(user.Topic.Specialty, Topic[0].querySelector(".profileSkillContainerFields"), template);
    topics(user.Topic.Language,  Topic[1].querySelector(".profileSkillContainerFields"), template);

    const cvLink = document.querySelector(".profileInformationDivDownload a");
    cvLink.href = user.CV;
    cvLink.textContent = "Descargar CV ⬇️";

    socialMedia(document.querySelectorAll(".profileInformationContainer"), Object.entries(user.Social));
}

function socialMedia(containers, socials) {
    containers.forEach((container, index) => {
        const [platform, data] = socials[index];
        container.querySelector("h3").textContent = platform;
        const link = container.querySelector("a");
        link.textContent = data.Name;
        link.href = data.Link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });
}

function topics(specialties, container, template) {
    container.innerHTML = "";
    specialties.slice(0, 5).forEach(spec => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = template;
        const btn = wrapper.querySelector("button");
        btn.querySelector("p").textContent = spec;
        btn.addEventListener("click", () => {
            window.location.href = `../HTML/searchResult.html?topic=${encodeURIComponent(spec)}`;
        });
        container.appendChild(wrapper.firstChild);
    });
}