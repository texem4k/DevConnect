init().then( async function() {

    await loadHeader();
    await loadfooter();

    const ITEMS_PER_PAGE = 2;
    let currentPage = 1;
    let allProjects = [];
    let filteredProjects = [];

    const templateHTML = await loadTemplate('mediaComponent');

    fetch('../../backend/projects.json')
        .then(response => response.json())
        .then(data => {
            allProjects = data.projects;
            filteredProjects = allProjects;
            renderPage(currentPage);
            renderPagination();
        })
        .catch(error => console.error('Error cargando el JSON:', error));

    const form = document.querySelector('.filters-form');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const categoriesChecked = [...document.querySelectorAll('input[name="category"]:checked')]
            .map(input => input.value);

        const levelSelected = document.querySelector('input[name="level"]:checked')?.value;

        const sortSelected = document.querySelector('select[name="sort"]').value;

        filteredProjects = allProjects;

        if (categoriesChecked.length > 0) {
            filteredProjects = filteredProjects.filter(project =>
                categoriesChecked.some(cat =>
                    project.requirements.technologies.some(tech =>
                        tech.toLowerCase().includes(cat)
                    )
                )
            );
        }

        if (levelSelected) {
            filteredProjects = filteredProjects.filter(project =>
                project.requirements.level.toLowerCase() === levelSelected
            );
        }

        if (sortSelected === 'popular') {
            filteredProjects = [...filteredProjects]
                .sort((a, b) => b.maintainers.length - a.maintainers.length);
        }

        currentPage = 1;
        renderPage(currentPage);
        renderPagination();
    });


    function renderPage(page) {
        const container = document.querySelector('.media-list');
        const fragment = document.createDocumentFragment();

        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageProjects = filteredProjects.slice(start, end);

        container.innerHTML = '';

        pageProjects.forEach(project => {
            const temp = document.createElement('div');
            temp.innerHTML = templateHTML;

            const button = temp.querySelector('.media-button');
            button.querySelector('img').src = project.image;
            button.querySelector('img').alt = `Imagen de ${project.title}`;
            button.querySelector('h3').textContent = project.title;
            button.querySelector('p').textContent = project.description;

            button.addEventListener('click', function() {
                window.location.href = `../HTML/projectProfile.html?title=${encodeURIComponent(project.title)}`;
            });

            fragment.appendChild(button);
        });

        container.appendChild(fragment);
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
        const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

        pagination.innerHTML = '';

        const first = createLink('«', 1, 'first');
        first.classList.toggle('disabled', currentPage === 1);
        pagination.appendChild(first);

        const prev = createLink('‹', Math.max(1, currentPage - 1), 'prev');
        prev.classList.toggle('disabled', currentPage === 1);
        pagination.appendChild(prev);

        const pagesToShow = new Set([
            1,
            totalPages,
            currentPage,
            currentPage - 1,
            currentPage + 1
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

});