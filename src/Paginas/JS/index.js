import { buildCard } from '../../templates/JS/cardGrid.js'

document.addEventListener("DOMContentLoaded", async () => {
    await init();
    await Promise.all([loadHeader(), loadFooter(), loadPage()]);
});

async function loadPage() {
    initHomeBanner();

    const { userData, projectData, cardTemplate, topicTemplate, mediaTemplate } = await fetchHomeData();

    renderTrendingUsers(userData.Users, cardTemplate, topicTemplate);
    renderTrendingProjects(projectData.projects, mediaTemplate);
    initDiscoverButtons();
}

async function fetchHomeData() {
    const [userData, projectData, cardTemplate, topicTemplate, mediaTemplate] = await Promise.all([
        fetch('../../backend/users.json').then(r => r.json()),
        fetch('../../backend/projects.json').then(r => r.json()),
        loadTemplate('informationCard'),
        loadTemplate('topicBoxBtn'),
        loadTemplate('mediaComponent')
    ]);
    return { userData, projectData, cardTemplate, topicTemplate, mediaTemplate };
}

function initHomeBanner() {
    document.querySelector(".introduction").textContent = "Trending Users";
    typeWriter(document.querySelector("#home-banner h1"), "DevConnect");
}

function renderTrendingUsers(users, cardTemplate, topicTemplate) {
    const container = document.querySelector('.trendingUsers');
    container.innerHTML = '';

    users.slice(0, 3).forEach(user => {
        container.appendChild(buildUserCard(user, cardTemplate, topicTemplate));
    });
}

function renderTrendingProjects(projects, mediaTemplate) {
    const fragment = document.createDocumentFragment();

    projects.slice(0, 4).forEach(project => {
        fragment.appendChild(buildProjectCard({
            img: project.image,
            title: project.title,
            description: project.description,
            linkedPage: "projectProfile"
        }, mediaTemplate));
    });

    const container = document.querySelector('.projectList');
    container.innerHTML = '';
    container.appendChild(fragment);
}

function initDiscoverButtons() {
    document.querySelectorAll(".discoverButton button").forEach(btn => {
        btn.textContent = "Ver más";
        btn.addEventListener('click', () => {
            window.location.href = `../HTML/searchResult.html?`;
        });
    });
}

function buildUserCard(user, cardTemplate, topicTemplate) {
    return buildCard(user, cardTemplate, topicTemplate, (u) => ({
        imgSrc: u.Avatar,
        imgAlt: u.Nickname,
        title: u.Nickname,
        description: u.Description,
        topics: u.Topic.Specialty,
        onClick: () => {
            window.location.href = `../HTML/userProfile.html?id=${u.Id}`;
        }
    }));
}

function buildProjectCard({ img, title, description, linkedPage }, mediaTemplate) {
    const temp = document.createElement('div');
    temp.innerHTML = mediaTemplate;

    const card = temp.querySelector('.media-button');
    card.querySelector('img').src = img;
    card.querySelector('img').alt = title;
    card.querySelector('h3').textContent = title;
    card.querySelector('p').textContent = description;

    card.addEventListener('click', () => {
        window.location.href = `../HTML/${linkedPage}.html?title=${encodeURIComponent(title)}`;
    });

    return card;
}

async function typeWriter(element, text, speed = 150) {
    element.textContent = "";
    for (const char of text) {
        element.textContent += char;
        await new Promise(resolve => setTimeout(resolve, speed));
    }
}