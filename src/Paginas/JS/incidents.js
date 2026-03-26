document.addEventListener("DOMContentLoaded",   async () => {
    await init()
    await Promise.all([
        loadDataIncidents(),
        loadHeader(),
        loadFooter(),
        leerInput()
    ]);
});

async function loadDataIncidents() {
    document.querySelector("main .title").textContent = "¿Algún problema?"
    document.querySelector(".field span").textContent = "Asunto del problema"
    document.querySelector(".field-large span").textContent = "Describe detalladamente el problema que tienes..."
    document.querySelector(".submit-btn").textContent = "Enviar"
}

async function leerInput() {
    const asunto = document.querySelector("input[type='text']");
    const texto = document.querySelector("textarea");
    const asuntoError = document.querySelector(".asuntoError");
    const textoError = document.querySelector(".contextoError");
    document.querySelector(".submit-btn").addEventListener("click", async () => {
        asuntoError.innerHTML="";
        textoError.innerHTML="";
        if (!asunto.value.trim()) {
            asuntoError.innerText = "Es necesario poner un asunto."
        }
        if (texto.value.trim().length < 30) {
            textoError.innerText = "El mensaje requiere un minimo es de 30 palabras."
        }
        if (texto.value.trim().length > 200) {
            textoError.innerText = "El mensaje es demasiado grande, el maximo es de 200 palabras."
        }
    })
}