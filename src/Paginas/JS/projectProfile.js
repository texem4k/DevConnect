import {cardGrid} from "../../templates/JS/cardGrid.js";

document.addEventListener('DOMContentLoaded', async () => {
    await init();
    await Promise.all([loadHeader(), loadFooter(), loadDataProjectProfile()]);
});

async function loadDataProjectProfile() {
    const title = decodeURIComponent(new URLSearchParams(window.location.search).get('title'));

    const [projectsData, usersData, topicTemplate] = await Promise.all([
        fetch('../../backend/projects.json').then(r => r.json()),
        fetch('../../backend/users.json').then(r => r.json()),
        fetch("../../templates/HTML/topicBoxBtn.html").then(res => res.text())
    ]);

    /** @type {{title: string, creator: string, description: string, image: string, maintainers: string[], requirements: {technologies: string[], knowledgeAreas: string[]}}} */
    const project = projectsData.projects.find(p => p.title === title);
    if (!project) { console.error('Proyecto no encontrado'); return; }
    setProjectInfo(project, usersData);
    setTopicGrid(project.requirements.technologies, 0, 'Tecnologías', topicTemplate);
    setTopicGrid(project.requirements.knowledgeAreas, 1, 'Áreas de conocimiento', topicTemplate);
    await setCollaborators(project, usersData);
}

function setProjectInfo(project, usersData) {
    document.title = project.title;
    document.querySelector('.overlay-text h1').textContent = project.title;
    document.querySelector('#project-image').src = project.image;
    document.querySelector('#project-image').alt = `Imagen de ${project.title}`;
    document.querySelector('.main-content p').textContent = project.description;

    const creatorLink = document.querySelector('.overlay-text a');
    creatorLink.textContent = project.creator;
    const creator = usersData.Users.find(u => u.Fullname === project.creator);
    if (creator) creatorLink.href = `../HTML/userProfile.html?id=${creator.Id}`;
}

async function setCollaborators(project, usersData) {
    const collaborators = project.maintainers
        .map(fullname => usersData.Users.find(u => u.Fullname === fullname))
        .filter(Boolean);

    await cardGrid(collaborators, 'Colaboradores', '.cardsSection', (u) => ({
        imgSrc:      u.Avatar,
        imgAlt:      u.Fullname,
        title:       u.Fullname,
        description: u.Description,
        topics:      (u.Topic?.Specialty || []).slice(0, 2),
        onClick:     () => { window.location.href = `../HTML/userProfile.html?id=${u.Id}`; }
    }));
}

function setTopicGrid(topics, gridIndex, title, topicTemplate) {
    const grid = document.querySelectorAll('.topicGrid')[gridIndex];
    grid.querySelector('h1').textContent = title;

    const section = grid.querySelector('.topicsSection');
    section.innerHTML = '';
    const fragment = document.createDocumentFragment();

    topics.forEach(topic => {
        const temp = document.createElement('div');
        temp.innerHTML = topicTemplate;
        const btn = temp.querySelector('.topicBox');
        btn.querySelector('p').textContent = topic;
        btn.addEventListener("click", (e) => {
            window.location.href = `../HTML/searchResult.html?topic=${encodeURIComponent(topics)}`;
        });
        fragment.appendChild(btn);
    });

    section.appendChild(fragment);
}