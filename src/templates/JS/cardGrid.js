export async function cardGrid(items, title, containerSelector, configFn) {
    document.querySelector(".cardGrid h1").textContent = title;
    const cardsSection = document.querySelector(containerSelector);
    cardsSection.innerHTML = "";

    const [cardTemplate, topicTemplate] = await Promise.all([
        fetch("../../templates/HTML/informationCard.html").then(res => res.text()),
        fetch("../../templates/HTML/topicBoxBtn.html").then(res => res.text())
    ]);

    items.slice(0, 4).forEach(item =>
        cardsSection.appendChild(buildCard(item, cardTemplate, topicTemplate, configFn))
    );
}

export function buildCard(item, cardTemplate, topicTemplate, config) {
    const { imgSrc, imgAlt, title, description, topics, onClick } = config(item);

    const cardWrapper = document.createElement("div");
    cardWrapper.innerHTML = cardTemplate;

    const img = cardWrapper.querySelector(".cardImage img");
    img.src = imgSrc;
    img.alt = imgAlt;
    cardWrapper.querySelector("h2").textContent = title;
    cardWrapper.querySelector("p").textContent = description;
    cardWrapper.querySelector(".informationCard").addEventListener("click", onClick);

    const placeholders = cardWrapper.querySelectorAll(".topicBoxBtnTemplate");
    placeholders.forEach((placeholder, i) => {
        if (!topics[i]) { placeholder.remove(); return; }
        const topicWrapper = document.createElement("div");
        topicWrapper.innerHTML = topicTemplate;
        const btn = topicWrapper.querySelector(".topicBox");
        btn.querySelector("p").textContent = topics[i];
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            window.location.href = `../HTML/searchResult.html?topic=${encodeURIComponent(topics[i])}`;
        });
        placeholder.replaceWith(topicWrapper.firstChild);
    });

    return cardWrapper.firstChild;
}