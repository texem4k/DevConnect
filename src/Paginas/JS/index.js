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
    const fragment = document.createDocumentFragment();

    users.slice(0, 3).forEach(user => {
        fragment.appendChild(buildUserCard({
            img: user.Avatar,
            title: user.Nickname,
            description: user.Description,
            topicParams: user.Topic.Specialty,
            linkedPage: "userProfile",
            id: user.Id
        }, cardTemplate, topicTemplate));
    });

    const container = document.querySelector('.trendingUsers');
    container.innerHTML = '';
    container.appendChild(fragment);
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

function buildUserCard({ img, title, description, topicParams, linkedPage, id }, cardTemplate, topicTemplate) {
    const temp = document.createElement('div');
    temp.innerHTML = cardTemplate;

    const card = temp.querySelector('.cardLayout');
    card.querySelector('img').src = img;
    card.querySelector('img').alt = title;
    card.querySelector('h2').textContent = title;
    card.querySelector('p').textContent = description;

    buildCardTopics(card, topicParams, topicTemplate);

    card.querySelector('.informationCard').addEventListener('click', () => {
        window.location.href = `../HTML/${linkedPage}.html?id=${id}`;
    });

    return card;
}

function buildCardTopics(card, topicParams, topicTemplate) {
    const topicsContainer = card.querySelector('.cardContent div');
    topicsContainer.querySelectorAll('.topicBoxBtnTemplate').forEach(t => t.remove());

    (topicParams ?? []).slice(0, 2).forEach(param => {
        const temp = document.createElement('div');
        temp.innerHTML = topicTemplate;
        const btn = temp.querySelector('.topicBox');
        btn.querySelector('p').textContent = param;
        topicsContainer.appendChild(btn);
    });
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