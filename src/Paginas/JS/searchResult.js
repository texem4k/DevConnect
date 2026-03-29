import {buildPageLink} from "../../utils/PageLink.js";

document.addEventListener("DOMContentLoaded", async () => {
    await init();
    await Promise.all([loadHeader(), loadFooter(), loadPage()]);
});

async function loadPage() {
    const ITEMS_PER_PAGE = 2;
    let currentPage = 1;
    let allProjects = [];
    let filteredProjects = [];

    const mediaTemplate = await loadTemplate('mediaComponent');
    const projectData = await fetchProjectsData();

    allProjects = projectData.projects;
    filteredProjects = allProjects;

    function goToPage(page) {
        currentPage = page;
        renderProjects(filteredProjects, currentPage, ITEMS_PER_PAGE, mediaTemplate);
        renderPagination(currentPage, filteredProjects.length, ITEMS_PER_PAGE, goToPage);
    }

    goToPage(currentPage);
    initFilters(allProjects, () => goToPage(1), (result) => { filteredProjects = result; });
}

async function fetchProjectsData() {
    return fetch('../../backend/projects.json')
        .then(r => r.json())
        .catch(error => console.error('Error cargando el JSON:', error));
}

function initFilters(allProjects, onSearch, onResult) {
    const form = document.querySelector('.filters-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const filtered = applyFilters(allProjects, readFilterValues());
        onResult(filtered);
        onSearch();
    });

    form.addEventListener('reset', (e) => {
        form.reset();
        onResult(allProjects);
        onSearch();
    });
}

function readFilterValues() {
    return {
        categories: [...document.querySelectorAll('input[name="category"]:checked')]
            .map(input => input.value),
        level: document.querySelector('input[name="level"]:checked')?.value,
        sort: document.querySelector('select[name="sort"]').value
    };
}

function applyFilters(projects, { categories, level, sort }) {
    let result = projects;

    if (categories.length > 0) {
        result = result.filter(project =>
            categories.some(cat =>
                project.requirements.technologies.some(tech =>
                    tech.toLowerCase().includes(cat)
                )
            )
        );
    }

    if (level) {
        result = result.filter(project =>
            project.requirements.level.toLowerCase() === level
        );
    }

    if (sort === 'popular') {
        result = [...result].sort((a, b) => b.maintainers.length - a.maintainers.length);
    }

    return result;
}

function renderProjects(projects, currentPage, itemsPerPage, mediaTemplate) {
    const container = document.querySelector('.media-list');
    const fragment = document.createDocumentFragment();

    const start = (currentPage - 1) * itemsPerPage;
    const pageProjects = projects.slice(start, start + itemsPerPage);

    container.innerHTML = '';

    pageProjects.forEach(project => {
        fragment.appendChild(buildProjectCard(project, mediaTemplate));
    });

    container.appendChild(fragment);
}

function buildProjectCard(project, mediaTemplate) {
    const temp = document.createElement('div');
    temp.innerHTML = mediaTemplate;

    const card = temp.querySelector('.media-button');
    card.querySelector('img').src = project.image;
    card.querySelector('img').alt = `Imagen de ${project.title}`;
    card.querySelector('h3').textContent = project.title;
    card.querySelector('p').textContent = project.description;

    card.addEventListener('click', () => {
        window.location.href = `../HTML/projectProfile.html?title=${encodeURIComponent(project.title)}`;
    });

    return card;
}

function renderPagination(currentPage, totalItems, itemsPerPage, onPageChange) {
    const pagination = document.querySelector('.pagination');
    const totalPages = Math.ceil(totalItems / itemsPerPage);

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

function getVisiblePages(currentPage, totalPages) {
    return [...new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1])]
        .filter(p => p >= 1 && p <= totalPages)
        .sort((a, b) => a - b);
}