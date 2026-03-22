async function typeWriter(element, text, speed = 150) {
    element.textContent = "";
    for (const char of text) {
        element.textContent += char;
        await new Promise(resolve => setTimeout(resolve, speed));
    }
}

async function cardLoad({ img, title, description, topicParams, linkedPage, id}, fragment, cardTemplate, topicTemplate) {
        const temp = document.createElement('div');
        temp.innerHTML = cardTemplate;

        const card = temp.querySelector('.cardLayout');
        card.querySelector('img').src = img;
        card.querySelector('img').alt = title;
        card.querySelector('h2').textContent = title;
        card.querySelector('p').textContent = description;

        const topicsContainer = card.querySelector('.cardContent div');
        topicsContainer.querySelectorAll('.topicBoxBtnTemplate').forEach(t => t.remove());

        (topicParams ?? []).slice(0, 2).forEach(param => {
            const temp2 = document.createElement('div');
            temp2.innerHTML = topicTemplate;
            const btn = temp2.querySelector('.topicBox');
            btn.querySelector('p').textContent = param;
            topicsContainer.appendChild(btn);
        });

        card.querySelector('.informationCard').addEventListener('click', function() {
            window.location.href = `../HTML/${linkedPage}.html?id=${id}`;
        });

        fragment.appendChild(card);
}

async function mediaLoad({ img, title, description, linkedPage}, fragment, mediaComponent) {
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

        fragment.appendChild(card);
}

init().then(async function() {
    await loadHeader();
    await loadfooter();

    document.querySelector(".introduction").textContent = "Trending Users"

    const h1 = document.querySelector("#home-banner h1");
    typeWriter(h1, "DevConnect");

    const [userData, projectData, cardTemplate, topicTemplate, mediaTemplate] = await Promise.all([
        fetch('../../backend/users.json').then(r => r.json()),
        fetch('../../backend/projects.json').then(r => r.json()),
        loadTemplate('informationCard'),
        loadTemplate('topicBoxBtn'),
        loadTemplate('mediaComponent'),
    ]);
    
    const userFragment = document.createDocumentFragment();
    userData.Users.slice(0,3).forEach(user => {
        cardLoad({
            img: user.Avatar,
            title: user.Fullname,
            description: user.Description,
            topicParams: user.Topic.Specialty,
            linkedPage: "userProfile",
            id: user.Id 
        }, userFragment, cardTemplate, topicTemplate);
    });

    const projectFragment = document.createDocumentFragment();
    projectData.projects.slice(0,4).forEach(project => {
        mediaLoad({
            img: project.image,
            title: project.title,
            description: project.description,
            linkedPage: "projectProfile",
        }, projectFragment, mediaTemplate);
    });

    document.querySelector('.trendingUsers').innerHTML = '';
    document.querySelector('.trendingUsers').appendChild(userFragment);

    document.querySelector('.projectList').innerHTML = '';
    document.querySelector('.projectList').appendChild(projectFragment);

    document.querySelectorAll(".discoverButton button").forEach(btn => {
        btn.textContent = "Ver más"
    });
    
});