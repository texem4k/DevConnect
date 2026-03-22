async function loadfooter () {
    loadDatafooter()
}

async function loadDatafooter() {
    const data = await fetch("../../backend/footer.json").then(res => res.json());
    const values = Object.values(data);

    setFooterName(values[0]);
    setColumnNames(data);
    setColumnLinks(values.slice(1));
}

function setFooterName(name) {
    document.querySelector("#footer-name").textContent = name;
}

function setColumnNames(data) {
    const columnNames = document.querySelectorAll('.column-footer p');
    Object.keys(data).slice(1).forEach((name, index) => {
        columnNames[index].textContent = name;
    });
}

function setColumnLinks(values) {
    const links = document.querySelectorAll('.column-footer a');
    links.forEach((link, i) => {
        if (i <= 2) {
            link.textContent = values[0][i % 3];
        } else if (i === 3) {
            link.href = "../HTML/incidents.html";
            link.textContent = values[1];
        } else {
            link.textContent = values[2];
            link.href = "../HTML/aboutUs.html";
        }
    });
}
