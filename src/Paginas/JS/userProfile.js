document.addEventListener("DOMContentLoaded",   async () => {
    await init()
    await Promise.all([
        loadDataUserProfile(),
        loadHeader(),
        loadFooter()
    ]);
});


async function loadDataUserProfile(){
    const [usersData, projectsData] = await Promise.all([
        fetch("../../backend/users.json").then(res => res.json()),
        fetch("../../backend/projects.json").then(res => res.json())
    ]);
    const params = new URLSearchParams(window.location.search);
    const loggedUserId = Number(localStorage.getItem("loggedUserId"));
    let profileId = Number(params.get('id'));
    if (profileId === 0) {profileId = Math.floor(Math.random() * usersData.Users.length);} //Esto es apriori mientras no se gestione el usuario que visualiza la pagina
    const user = usersData.Users.find(p => p.Id === profileId);
    const userProjects = projectsData.projects.filter(p => user.Projects.some(up => up.Name === p.title));
    presentacion(user, loggedUserId);
    cardGrid(userProjects);
    informacionAdicional(user);
}
async function presentacion(user, loggedUserId){
    document.querySelector(".profilePicture").src = user.Avatar;
    document.querySelector(".profileName").textContent = user.Fullname;
    document.querySelector(".profileDescription p").textContent = user.Description;
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
    }else{
        buttons[0].style.display = "none";
        buttons[1].style.display = "none";
    }
}

async function informacionAdicional(user){
    const Topic = document.querySelectorAll(".userSkillsButton")
    Topic[0].querySelector(".profileInformationTag").textContent=Object.keys(user.Topic)[0]
    topics(user.Topic.Specialty,Topic[0].querySelector(".profileSkillContainerFields"))
    Topic[1].querySelector(".profileInformationTag").textContent=Object.keys(user.Topic)[1]
    topics(user.Topic.Language,Topic[1].querySelector(".profileSkillContainerFields"))
    const cvLink = document.querySelector(".profileInformationDivDownload a");
    cvLink.href = user.CV;
    cvLink.textContent = "Descargar CV ⬇️";
    socialMedia(document.querySelectorAll(".profileInformationContainer"),Object.entries(user.Social))
}

async function socialMedia(containers,socials){
    containers.forEach((container, index) => {
        const [platform, data] = socials[index];
        const title = container.querySelector("h3");
        const link = container.querySelector("a");
        title.textContent = platform;
        link.textContent = data.Name;
        link.href = data.Link
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });
}

async function topics(specialties, container) {
    const limit = 5;
    container.innerHTML = "";
    const template = await fetch("../../templates/HTML/topicBoxBtn.html").then(res => res.text());
    specialties.slice(0, limit).forEach(spec => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = template;
        const btn = wrapper.querySelector("button");
        const p = wrapper.querySelector("p");
        p.textContent = spec;
        btn.addEventListener("click", () => {
            window.location.href = `../HTML/searchResult.html?topic=${encodeURIComponent(spec)}`;
        });
        container.appendChild(wrapper.firstChild);
    });
}

async function cardGrid(projects) {
    document.querySelector(".cardGrid h1").textContent = "Projects";
    const cardsSection = document.querySelector(".cardsSection");
    cardsSection.innerHTML = "";

    const [cardTemplate, topicTemplate] = await Promise.all([
        fetch("../../templates/HTML/informationCard.html").then(res => res.text()),
        fetch("../../templates/HTML/topicBoxBtn.html").then(res => res.text())
    ]);

    const cards = await Promise.all(
        projects.slice(0, 4).map(project =>
            buildCard(project,cardTemplate, topicTemplate)
        )
    );
    cards.forEach(card => cardsSection.appendChild(card));
}

async function buildCard(project, cardTemplate, topicTemplate) {
    const cardWrapper = document.createElement("div");
    cardWrapper.innerHTML = cardTemplate;

    const img = cardWrapper.querySelector(".cardImage img");
    img.src = project.image;
    img.alt = project.title;
    cardWrapper.querySelector("h2").textContent = project.title;
    cardWrapper.querySelector("p").textContent = project.description;

    cardWrapper.querySelector(".informationCard").addEventListener("click", () => {
        window.location.href = `../HTML/projectProfile.html?title=${encodeURIComponent(project.title)}`;
    });
    const cardTopics = (project.requirements?.technologies || []).slice(0, 2);
    const placeholders = cardWrapper.querySelectorAll(".topicBoxBtnTemplate");
    placeholders.forEach((placeholder, i) => {
        if (!cardTopics[i]) { placeholder.remove(); return; }
        const topicWrapper = document.createElement("div");
        topicWrapper.innerHTML = topicTemplate;
        const btn = topicWrapper.querySelector("button");
        const p = topicWrapper.querySelector("p");
        p.textContent = cardTopics[i];
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // evita que dispare también el click de la card
            window.location.href = `../HTML/searchResult.html?topic=${encodeURIComponent(cardTopics[i])}`;
        });
        placeholder.replaceWith(topicWrapper.firstChild);
    });
    return cardWrapper.firstChild;
}
