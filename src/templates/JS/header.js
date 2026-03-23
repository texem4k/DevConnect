async function loadHeader() {
    const data = await fetch("../../backend/headerTopics.json").then(res => res.json());
    burger(data);
    setHeaderDropdowns(data);
    await setHeaderLinks();
}

function burger(data) {
    const ham      = document.getElementById('ham-btn');
    const sidebar  = document.getElementById('sidebar');
    const overlay  = document.getElementById('overlay');
    const closeBtn = document.getElementById('close-btn');

    const openSidebar  = () => { sidebar.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const closeSidebar = () => { sidebar.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; };

    ham.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 768) closeSidebar(); });

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
    const ids = ['sb-create', 'sb-upload', 'sb-login', 'sb-logout'];
    const [sbCreate, sbUpload, sbLogin, sbLogout] = ids.map(id => document.getElementById(id));
    const loggedUserId = localStorage.getItem("loggedUserId");

    sbCreate.textContent = "Crear Proyecto";
    sbUpload.textContent = "Gestionar Proyecto";
    if (loggedUserId) {
        [sbCreate, sbUpload, sbLogout].forEach(btn => { btn.style.display = "block"; btn.disabled = false; });
        sbCreate.addEventListener('click', () => { window.location.href = "../HTML/createProject.html"; });
        sbUpload.addEventListener('click', () => { window.location.href = "../HTML/manageProject.html"; });
        sbLogin.textContent = "Mi Perfil";
        sbLogin.addEventListener('click', () => { window.location.href = `../HTML/userProfile.html?id=${loggedUserId}`; });
        sbLogout.textContent = "Cerrar Sesión";
        sbLogout.addEventListener('click', () => { localStorage.clear(); window.location.reload(); });
    } else {
        [sbCreate, sbUpload, sbLogout].forEach(btn => { btn.style.display = "none"; btn.disabled = true; });
        sbLogin.textContent = "Iniciar Sesión";
        sbLogin.addEventListener('click', () => { window.location.href = "../HTML/login.html"; });
    }
}

function setHeaderDropdowns(data) {
    const headers = document.querySelectorAll('.dropdown-btn');
    const options = document.querySelectorAll('.dropdown-content button');
    const values  = Object.values(data);

    Object.keys(data).forEach((categoria, index) => { headers[index].textContent = categoria; });

    for (let i = 0; i < options.length; i += 2) {
        const topics = values[i / 2];
        options[i].textContent     = topics[0];
        options[i + 1].textContent = topics[1];
        options[i].addEventListener('click', () => { window.location.href = `../HTML/searchResult.html?topic=${encodeURIComponent(topics[0])}`; });
        options[i + 1].addEventListener('click', () => { window.location.href = `../HTML/searchResult.html?topic=${encodeURIComponent(topics[1])}`; });
    }
}

function setupProfileDropdown(loggedUserId) {
    const dropdown = document.getElementById('profile-dropdown');
    const loginBtn = document.getElementById('login-btn');

    const ddButtons = {
        'dd-profile': { text: "Mi Perfil",          href: `../HTML/userProfile.html?id=${loggedUserId}` },
        'dd-create':  { text: "Crear Proyecto",      href: "../HTML/createProject.html" },
        'dd-upload':  { text: "Gestionar Proyecto",  href: "../HTML/manageProject.html" },
    };

    Object.entries(ddButtons).forEach(([id, { text, href }]) => {
        const btn = document.getElementById(id);
        btn.textContent = text;
        btn.addEventListener('click', () => { window.location.href = href; });
    });

    document.getElementById('dd-logout').textContent = "Cerrar Sesión";
    document.getElementById('dd-logout').addEventListener('click', () => {
        localStorage.clear(); window.location.reload();
    });

    loginBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
        dropdown.style.flexDirection = "column";
    });

    document.addEventListener('click', () => { dropdown.style.display = "none"; });
}

async function setHeaderLinks() {
    const q = id => document.getElementById(id);
    const qs = sel => document.querySelector(sel);

    qs("#home-btn a").textContent   = "Home";
    qs("#home-btn a").href          = "../HTML/index.html";
    qs("#create-btn a").textContent = "Crear Proyecto";
    qs("#create-btn a").href        = "../HTML/createProject.html";
    qs("#upload-btn a").textContent = "Gestionar Proyecto";
    qs("#upload-btn a").href        = "../HTML/manageProject.html";

    const loggedUserId = localStorage.getItem("loggedUserId");
    const loginBtn     = q('login-btn');
    const createBtn    = qs("#create-btn");
    const uploadBtn    = qs("#upload-btn");

    if (loggedUserId) {
        createBtn.style.display = "none";
        uploadBtn.style.display = "none";

        const usersData = await fetch("../../backend/users.json").then(res => res.json());
        const user = usersData.Users.find(u => u.Id === Number(loggedUserId));

        if (user) {
            const img = Object.assign(document.createElement('img'), {
                src: user.Avatar,
                alt: user.Fullname
            });
            img.style.cssText = "width:100%; height:100%; object-fit:cover; border-radius:50%;";
            loginBtn.innerHTML = "";
            loginBtn.appendChild(img);
        }

        setupProfileDropdown(loggedUserId);

    } else {
        [createBtn, uploadBtn, q('sb-create'), q('sb-upload')].forEach(el => { el.style.display = "none"; });
        loginBtn.textContent = "Iniciar Sesión";
        loginBtn.classList.add("login-text");
        loginBtn.addEventListener('click', () => { window.location.href = "../HTML/login.html"; });
    }
}