document.addEventListener("DOMContentLoaded", async () => {
    await init();
    await Promise.all([loadHeader(), loadFooter(), loadPage()]);
});

function mediaLoad({ img, title, description, linkedPage }, mediaComponent) {
    const temp = document.createElement('div');
    temp.innerHTML = mediaComponent;

    const card = temp.querySelector('.media-button');
    card.querySelector('img').src = img;
    card.querySelector('img').alt = title;
    card.querySelector('h3').textContent = title;
    card.querySelector('p').textContent = description;

    card.addEventListener('click', function() {
        window.location.href = `../HTML/${linkedPage}.html?title=${encodeURIComponent(title)}`;
    });

    return card;
}

async function loadPage() {
    const ITEMS_PER_PAGE = 5;
    let currentPage = 1;
    let ownedProjects = [];

    const currentUser = Number(localStorage.getItem("loggedUserId"));

    const [projectData, userData, mediaTemplate] = await Promise.all([
        fetch('../../backend/projects.json').then(r => r.json()),
        fetch('../../backend/users.json').then(r => r.json()),
        loadTemplate('mediaComponent')
    ]);

    ownedProjects = projectData.projects.filter(project => {
        const creator = userData.Users.find(u => u.Fullname === project.creator);
        return creator?.Id === currentUser;
    });

    renderPage(currentPage);
    renderPagination();

    function renderPage(page) {
        const projectsContainer = document.querySelector('.project-container');
        const buttonsContainer  = document.querySelector('.button-container');

        const projectFragment = document.createDocumentFragment();
        const buttonFragment  = document.createDocumentFragment();

        const start = (page - 1) * ITEMS_PER_PAGE;
        const end   = start + ITEMS_PER_PAGE;
        const pageProjects = ownedProjects.slice(start, end);

        projectsContainer.innerHTML = '';
        buttonsContainer.innerHTML  = '';

        pageProjects.forEach(project => {
            projectFragment.appendChild(mediaLoad({
                img: project.image,
                title: project.title,
                description: project.description,
                linkedPage: 'projectProfile'
            }, mediaTemplate));

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.addEventListener('click', function(e) {
                window.location.href = `../HTML/createProject.html?title=${encodeURIComponent(project.title)}`;
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.addEventListener('click', function(e) {
                console.log('eliminar:', project.title);
            });

            buttonFragment.appendChild(editBtn);
            buttonFragment.appendChild(deleteBtn);
        });

        projectsContainer.appendChild(projectFragment);
        buttonsContainer.appendChild(buttonFragment);
    }

    function createLink(label, page, classes) {
        const a = document.createElement('a');
        a.href = `?page=${page}`;
        a.textContent = label;
        a.className = 'page-btn ' + classes;

        a.addEventListener('click', function(e) {
            e.preventDefault();
            currentPage = page;
            renderPage(currentPage);
            renderPagination();
        });

        return a;
    }

    function renderPagination() {
        const pagination = document.querySelector('.pagination');
        const totalPages = Math.ceil(ownedProjects.length / ITEMS_PER_PAGE);

        pagination.innerHTML = '';

        const first = createLink('«', 1, 'first');
        first.classList.toggle('disabled', currentPage === 1);
        pagination.appendChild(first);

        const prev = createLink('‹', Math.max(1, currentPage - 1), 'prev');
        prev.classList.toggle('disabled', currentPage === 1);
        pagination.appendChild(prev);

        const pagesToShow = new Set([
            1, totalPages, currentPage, currentPage - 1, currentPage + 1
        ]);

        let lastRendered = 0;

        [...pagesToShow]
            .filter(p => p >= 1 && p <= totalPages)
            .sort((a, b) => a - b)
            .forEach(p => {
                if (p - lastRendered > 1) {
                    const dots = document.createElement('span');
                    dots.className = 'dots';
                    dots.textContent = '...';
                    pagination.appendChild(dots);
                }
                const a = createLink(p, p, p === currentPage ? 'active' : '');
                pagination.appendChild(a);
                lastRendered = p;
            });

        const next = createLink('›', Math.min(totalPages, currentPage + 1), 'next');
        next.classList.toggle('disabled', currentPage === totalPages);
        pagination.appendChild(next);

        const last = createLink('»', totalPages, 'last');
        last.classList.toggle('disabled', currentPage === totalPages);
        pagination.appendChild(last);
    }
}