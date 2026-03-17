setTimeout(() => {
    // Promise.all([
    //     fetch("../../backend/users.json").then(res => res.json()),
    //     fetch("../../backend/projects.json").then(res => res.json())
    // ]).then(([users, projects]) => {
    //
    //     const user = users[0];
    //
    //     // nombres de proyectos del usuario
    //     const userProjects = user.projects;
    //
    //     // buscar los proyectos completos
    //     const fullProjects = projects.filter(project =>
    //         userProjects.includes(project.name)
    //     );
    fetch("../../backend/users.json")
        .then(res => res.json())
        .then(users => {

            const randomIndex = Math.floor(Math.random() * users.length);
            const user = users[randomIndex];
            const loggedUserId = 1;
            document.querySelector(".profilePicture").src = user.avatar;
            document.querySelector(".profileName").textContent = user.fullname;
            const buttons = document.querySelectorAll(".profileInformationButtons button");
            if (user.id === loggedUserId) {
                buttons[0].style.display = "block";
                buttons[0].textContent = "Editar Perfil";
                buttons[0].addEventListener("click", () => {
                    window.location.href = "../HTML/manageProfile.html";
                });
                buttons[1].style.display = "block";
                buttons[1].textContent = "Gestion de proyectos";
                buttons[1].addEventListener("click", () => {
                    window.location.href = "../HTML/manageProject.html";
                });
            }else{
                buttons[0].style.display = "none";
                buttons[1].style.display = "none";
            }
            document.querySelector(".profileDescription p").textContent = user.description;
            const topic = document.querySelectorAll(".userSkillsButton")
            const limit = 5;
            let specialties = user.topic.Specialty;
            let container = topic[0].querySelector(".profileSkillContainerFields");
            topic[0].querySelector(".profileInformationTag").textContent=Object.keys(user.topic)[0]
            container.innerHTML = "";
            specialties.slice(0, limit).forEach(spec => {
                const button = document.createElement("button");
                button.classList.add("topicBox");
                button.innerHTML = `
                <p>
                    <a href="../HTML/searchResult.html">${spec}</a>
                </p>`;

                container.appendChild(button);
            });
            specialties = user.topic.Language;
            container = topic[1].querySelector(".profileSkillContainerFields");
            topic[1].querySelector(".profileInformationTag").textContent=Object.keys(user.topic)[1]
            container.innerHTML = "";
            specialties.slice(0, limit).forEach(spec => {
                const button = document.createElement("button");
                button.classList.add("topicBox");
                button.innerHTML = `
                <p>
                    <a href="../HTML/searchResult.html">${spec}</a>
                </p>`;

                container.appendChild(button);
            });
            const cvLink = document.querySelector(".profileInformationDivDownload a");
            cvLink.href = user.CV;
            cvLink.textContent = "Descargar CV ⬇️";

            const containers = document.querySelectorAll(".profileInformationContainer");
            const socials = Object.entries(user.social);

            containers.forEach((container, index) => {

                const [platform, data] = socials[index];

                const title = container.querySelector("h3");
                const link = container.querySelector("a");

                title.textContent = platform;
                link.textContent = data.name;
                link.href = data.link
                link.target = "_blank";
                link.rel = "noopener noreferrer";

            });
            document.querySelector(".cardGrid h1").textContent = "Projects";

            const cardsSection = document.querySelector(".cardsSection");
            cardsSection.innerHTML = "";
            const maxCards = 4;
            const projectsToShow = (user.projects || []).slice(0, maxCards);
            projectsToShow.forEach(projectName => {
                const cardWrapper = document.createElement("div");
                cardWrapper.classList.add("informationCardTemplate");
                const button = document.createElement("button");
                button.classList.add("informationCard");
                button.innerHTML = `
        <div class="cardImage">
            <img src="${user.avatar}" alt="${projectName}">
        </div>
        <div class="cardContent">
            <div>
                <h2>${projectName}</h2>
                <div class="topicsRow"></div>
            </div>
            <p>
                ${user.description}
            </p>
        </div>
    `;
                button.addEventListener("click", () => {
                    window.location.href = "../HTML/projectProfile.html";
                })
                cardWrapper.appendChild(button);
                cardsSection.appendChild(cardWrapper);

                // Rellenar topics (por ejemplo 2)
                const topicsRow = button.querySelector(".topicsRow");
                const topics = [
                    ...(user.topic?.Specialty || []),
                    ...(user.topic?.Language || [])
                ];

                topics.slice(0, 2).forEach(topic => {
                    const topicBtn = document.createElement("button");
                    topicBtn.classList.add("topicBoxBtnTemplate");
                    topicBtn.textContent = topic;
                    topicsRow.appendChild(topicBtn);
                });
            });


        });
}, 100);
