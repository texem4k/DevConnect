document.addEventListener("DOMContentLoaded",   async () => {
    await init()
    const datoAboutAs = await fetch("../../backend/aboutUs.json").then(res => res.json());
    initCarousel(datoAboutAs)
    await Promise.all([
        loadHeader(),
        typeWriter(document.querySelector("#home-banner h1"), "DEVCONNECT"),
        loadDataAboutUs(datoAboutAs),
        loadFooter()
    ]);
});

async function loadDataAboutUs(datoAboutAs) {

    const container = document.querySelector(".aboutUsContainer");
    container.innerHTML = "";
    const h1 = document.createElement("h1");
    h1.textContent = "¿ Quien somos ?";
    container.appendChild(h1);
    const parrafos = datoAboutAs.AboutUs.split("\n\n");
    parrafos.forEach(texto => {
        const p = document.createElement("p");
        p.textContent = texto;
        container.appendChild(p);
    });
}
async function typeWriter(element, text, speed = 150) {
    element.textContent = "";
    for (const char of text) {
        element.textContent += char;
        await new Promise(resolve => setTimeout(resolve, speed));
    }
}
async function initCarousel(datoAboutAs) {
    const banner = document.querySelector("#home-banner");
    datoAboutAs.bannerImages.forEach((img, i) => {
        const slide = document.createElement("div");
        slide.classList.add("banner-slide");
        if (i === 0) slide.classList.add("active");
        slide.style.backgroundImage = `url(${img})`;
        banner.insertBefore(slide, banner.firstChild);
    });
    const slides = banner.querySelectorAll(".banner-slide");
    let current = 0;
    setInterval(() => {
        slides[current].classList.remove("active");
        current = current === slides.length - 1 ? 0 : current + 1;
        slides[current].classList.add("active");
    }, 3000);
}