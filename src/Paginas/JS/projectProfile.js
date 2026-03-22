init().then(async function() {
    await loadHeader();
    await loadfooter();

    const params = new URLSearchParams(window.location.search);
    const title = decodeURIComponent(params.get('title'));

    const [projectsData, usersData, cardTemplate, topicTemplate] = await Promise.all([
        fetch('../../backend/projects.json').then(r => r.json()),
        fetch('../../backend/users.json').then(r => r.json()),
        loadTemplate('informationCard'),
        loadTemplate('topicBoxBtn')
    ]);

    const project = projectsData.projects.find(p => p.title === title);

    if (!project) {
        console.error('Proyecto no encontrado');
        return;
    }

    document.title = project.title;
    document.querySelector('.overlay-text h1').textContent = project.title;

    const creatorLink = document.querySelector('.overlay-text a');
    creatorLink.textContent = project.creator;

    const creator = usersData.Users.find(u => u.Fullname === project.creator);
    if (creator) {
        creatorLink.href = `../HTML/userProfile.html?id=${creator.Id}`;
    }

    document.querySelector('#project-image').src = project.image;
    document.querySelector('#project-image').alt = `Imagen de ${project.title}`;
    document.querySelector('.main-content p').textContent = project.description;

    // colaboradores
    const collaborators = project.maintainers
        .map(fullname => usersData.Users.find(u => u.Fullname === fullname))
        .filter(u => u !== undefined);

    const sectionTitle = document.querySelector('.cardGrid h1');
    sectionTitle.textContent = 'Colaboradores';

    const section = document.querySelector('.cardsSection');
    section.innerHTML = '';
    const fragment = document.createDocumentFragment();

    collaborators.forEach(user => {
        const temp = document.createElement('div');
        temp.innerHTML = cardTemplate;

        const card = temp.querySelector('.cardLayout');
        card.querySelector('img').src = user.Avatar;
        card.querySelector('img').alt = user.Fullname;
        card.querySelector('h2').textContent = user.Fullname;
        card.querySelector('p').textContent = user.Description;

        const topicsContainer = card.querySelector('.cardContent div');
        topicsContainer.querySelectorAll('.topicBoxBtnTemplate').forEach(t => t.remove());

        user.Topic.Specialty.slice(0, 2).forEach(specialty => {
            const temp2 = document.createElement('div');
            temp2.innerHTML = topicTemplate;
            const btn = temp2.querySelector('.topicBox');
            btn.querySelector('p').textContent = specialty;
            topicsContainer.appendChild(btn);
        });

        card.querySelector('.informationCard').addEventListener('click', function() {
            window.location.href = `../HTML/userProfile.html?id=${user.Id}`;
        });

        fragment.appendChild(card);
    });

    section.appendChild(fragment);

    // tecnologías
    const techGrid = document.querySelectorAll('.topicGrid')[0];
    techGrid.querySelector('h1').textContent = 'Tecnologías';
    const techSection = techGrid.querySelector('.topicsSection');
    techSection.innerHTML = '';
    const techFragment = document.createDocumentFragment();

    project.requirements.technologies.forEach(tech => {
        const temp = document.createElement('div');
        temp.innerHTML = topicTemplate;
        const btn = temp.querySelector('.topicBox');
        btn.querySelector('p').textContent = tech;
        techFragment.appendChild(btn);
    });

    techSection.appendChild(techFragment);

    // áreas de conocimiento
    const knowledgeGrid = document.querySelectorAll('.topicGrid')[1];
    knowledgeGrid.querySelector('h1').textContent = 'Áreas de conocimiento';
    const knowledgeSection = knowledgeGrid.querySelector('.topicsSection');
    knowledgeSection.innerHTML = '';
    const knowledgeFragment = document.createDocumentFragment();

    project.requirements.knowledgeAreas.forEach(area => {
        const temp = document.createElement('div');
        temp.innerHTML = topicTemplate;
        const btn = temp.querySelector('.topicBox');
        btn.querySelector('p').textContent = area;
        knowledgeFragment.appendChild(btn);
    });

    knowledgeSection.appendChild(knowledgeFragment);
});