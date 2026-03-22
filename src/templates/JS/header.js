async function loadHeader() {
    const data = await fetch("../../backend/headerTopics.json")
        .then(res => res.json())
        .catch(error => console.error('Error:', error));

    burger(data);
    setHeaderDropdowns(data);
    await setHeaderLinks();
}

function burger(data) {
    const ham      = document.getElementById('ham-btn');
    const sidebar  = document.getElementById('sidebar');
    const overlay  = document.getElementById('overlay');
    const closeBtn = document.getElementById('close-btn');

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    ham.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeSidebar();
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });
    setSidebarMenu(data);
    setSidebarActions();
}

function setSidebarMenu(data) {
    const accordions = document.querySelectorAll('.sidebar-accordion');

    Object.entries(data).forEach(([categoria, opciones], index) => {
        if (!accordions[index]) return;

        accordions[index].querySelector('summary').textContent = categoria;

        const content = accordions[index].querySelector('.sidebar-accordion-content');
        content.innerHTML = "";
        opciones.forEach(opcion => {
            const btn = document.createElement('button');
            btn.textContent = opcion;
            btn.addEventListener('click', () => {
                window.location.href = `../HTML/searchResult.html?topic=${encodeURIComponent(opcion)}`;
            });
            content.appendChild(btn);
        });
    });
}

function setSidebarActions() {
    const sbCreate = document.getElementById('sb-create');
    const sbUpload = document.getElementById('sb-upload');
    const sbLogin  = document.getElementById('sb-login');
    const loggedUserId = sessionStorage.getItem("loggedUserId");

    sbCreate.textContent = "Crear Proyecto";
    sbUpload.textContent = "Gestionar Proyecto";

    if (loggedUserId) {
        sbCreate.disabled = false;
        sbUpload.disabled = false;

        sbCreate.addEventListener('click', () => {
            window.location.href = "../HTML/createProject.html";
        });
        sbUpload.addEventListener('click', () => {
            window.location.href = "../HTML/manageProject.html";
        });

        sbLogin.textContent = "Mi Perfil";
        sbLogin.addEventListener('click', () => {
            window.location.href = "../HTML/userProfile.html";
        });
    } else {
        sbCreate.disabled = true;
        sbUpload.disabled = true;
        sbLogin.textContent = "Iniciar Sesión";
        sbLogin.addEventListener('click', () => {
            window.location.href = "../HTML/login.html";
        });
    }
}

function setHeaderDropdowns(data) {
    const headers = document.querySelectorAll('.dropdown-btn');
    const options = document.querySelectorAll('.dropdown-content button');
    const values  = Object.values(data);

    Object.keys(data).forEach((categoria, index) => {
        headers[index].textContent = categoria;
    });

    for (let i = 0; i < options.length; i += 2) {
        options[i].textContent     = values[i / 2][0];
        options[i + 1].textContent = values[i / 2][1];
        options[i].addEventListener('click', () => {
            window.location.href = `../HTML/searchResult.html?topic=${encodeURIComponent(values[i / 2][0])}`;
        });
        options[i + 1].addEventListener('click', () => {
            window.location.href = `../HTML/searchResult.html?topic=${encodeURIComponent(values[i / 2][1])}`;
        });
    }
}

async function setHeaderLinks() {
    document.querySelector("#home-btn a").textContent = "Home";
    document.querySelector("#home-btn a").href        = "../HTML/index.html";

    document.querySelector("#create-btn a").textContent = "Crear Proyecto";
    document.querySelector("#create-btn a").href        = "../HTML/createProject.html";

    document.querySelector("#upload-btn a").textContent = "Gestionar Proyecto";
    document.querySelector("#upload-btn a").href        = `../HTML/manageProject.html?`;

    const loggedUserId = sessionStorage.getItem("loggedUserId");
    const loginBtn     = document.getElementById('login-btn');
    const createBtn    = document.querySelector("#create-btn");
    const uploadBtn    = document.querySelector("#upload-btn");
    const sbCreate     = document.getElementById('sb-create');
    const sbUpload     = document.getElementById('sb-upload');

    if (loggedUserId) {
        createBtn.style.display = "block";
        uploadBtn.style.display = "block";
        sbCreate.style.display  = "block";
        sbUpload.style.display  = "block";

        const usersData = await fetch("../../backend/users.json").then(res => res.json());
        const user = usersData.Users.find(u => u.Id === Number(loggedUserId));

        if (user) {
            const img = document.createElement('img');
            img.src = user.Avatar;
            img.alt = user.Fullname;
            img.style.cssText = "width:100%; height:100%; object-fit:cover; border-radius:50%;";
            loginBtn.innerHTML = "";
            loginBtn.appendChild(img);
        }

        loginBtn.addEventListener('click', () => {
            window.location.href = `../HTML/userProfile.html?id=${loggedUserId}`;
        });
    } else {
        createBtn.style.display = "none";
        uploadBtn.style.display = "none";
        sbCreate.style.display  = "none";
        sbUpload.style.display  = "none";
        loginBtn.textContent = "Iniciar Sesión";
        loginBtn.addEventListener('click', () => {
            window.location.href = "../HTML/login.html";
        });
    }
}