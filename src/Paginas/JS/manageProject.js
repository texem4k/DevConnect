import {buildPageLink} from "../../utils/PageLink.js"

document.addEventListener("DOMContentLoaded", async () => {
    await init();
    await Promise.all([loadHeader(), loadFooter(), loadPage()]);
});

async function loadPage() {
    const ITEMS_PER_PAGE = 5;
    let currentPage = 1;

    const currentUserId = Number(localStorage.getItem("loggedUserId"));
    const { projectData, userData, mediaTemplate } = await fetchPageData();
    const userProjects = filterUserProjects(projectData, userData, currentUserId);
    const totalPages = Math.ceil(userProjects.length / ITEMS_PER_PAGE);

    function goToPage(page) {
        currentPage = page;
        const pageProjects = getProjectsPage(userProjects, currentPage, ITEMS_PER_PAGE);
        renderProjects(pageProjects, mediaTemplate);
        renderPagination(currentPage, totalPages, goToPage);
    }

    goToPage(currentPage);
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

function buildProjectActions(project) {
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.classList.add('editBtn');
    editBtn.addEventListener('click', () => {
        window.location.href = `../HTML/createProject.html?title=${encodeURIComponent(project.title)}`;
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.classList.add('deleteBtn');
    deleteBtn.addEventListener('click', () => {
        console.log('eliminar:', project.title);
    });

    return { editBtn, deleteBtn };
}

async function fetchPageData() {
    const [projectData, userData, mediaTemplate] = await Promise.all([
        fetch('../../backend/projects.json').then(r => r.json()),
        fetch('../../backend/users.json').then(r => r.json()),
        loadTemplate('mediaComponent')
    ]);
    return { projectData, userData, mediaTemplate };
}

function filterUserProjects(projectData, userData, currentUserId) {
    return projectData.projects.filter(project => {
        const creator = userData.Users.find(u => u.Nickname === project.creator);
        return creator?.Id === currentUserId;
    });
}

function renderProjects(projects, mediaTemplate) {
    const projectsContainer = document.querySelector('.project-container');
    const buttonsContainer  = document.querySelector('.button-container');

    const projectFragment = document.createDocumentFragment();
    const buttonFragment  = document.createDocumentFragment();

    projectsContainer.innerHTML = '';
    buttonsContainer.innerHTML  = '';

    projects.forEach(project => {
        projectFragment.appendChild(buildProjectCard({
            img: project.image,
            title: project.title,
            description: project.description,
            linkedPage: 'projectProfile'
        }, mediaTemplate));

        const { editBtn, deleteBtn } = buildProjectActions(project);
        buttonFragment.appendChild(editBtn);
        buttonFragment.appendChild(deleteBtn);
    });

    projectsContainer.appendChild(projectFragment);
    buttonsContainer.appendChild(buttonFragment);
}

function getProjectsPage(allProjects, page, itemsPerPage) {
    const start = (page - 1) * itemsPerPage;
    return allProjects.slice(start, start + itemsPerPage);
}

function getVisiblePages(currentPage, totalPages) {
    return [...new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1])]
        .filter(p => p >= 1 && p <= totalPages)
        .sort((a, b) => a - b);
}

function renderPagination(currentPage, totalPages, onPageChange) {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    const first = buildPageLink('«', 1, 'first', onPageChange);
    first.classList.toggle('disabled', currentPage === 1);
    pagination.appendChild(first);

    const prev = buildPageLink('‹', Math.max(1, currentPage - 1), 'prev', onPageChange);
    prev.classList.toggle('disabled', currentPage === 1);
    pagination.appendChild(prev);

    let lastRendered = 0;
    getVisiblePages(currentPage, totalPages).forEach(p => {
        if (p - lastRendered > 1) {
            const dots = document.createElement('span');
            dots.className = 'dots';
            dots.textContent = '...';
            pagination.appendChild(dots);
        }
        pagination.appendChild(buildPageLink(p, p, p === currentPage ? 'active' : '', onPageChange));
        lastRendered = p;
    });

    const next = buildPageLink('›', Math.min(totalPages, currentPage + 1), 'next', onPageChange);
    next.classList.toggle('disabled', currentPage === totalPages);
    pagination.appendChild(next);

    const last = buildPageLink('»', totalPages, 'last', onPageChange);
    last.classList.toggle('disabled', currentPage === totalPages);
    pagination.appendChild(last);
}
