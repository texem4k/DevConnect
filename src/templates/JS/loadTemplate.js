const templateCache = {};
const templatePath = "../../templates/HTML/";

async function loadTemplate(name) {
    if (templateCache[name]) return templateCache[name];
    const res = await fetch(templatePath + name + ".html");
    const text = await res.text();
    templateCache[name] = text;
    return text;
}

async function processTemplates() {
    const elements = document.querySelectorAll('[class$="Template"]');
    let inserted = 0;
    for (const el of elements) {
        const templateClass = [...el.classList]
            .find(c => c.endsWith("Template"));
        const templateName = templateClass.replace("Template","");
        const html = await loadTemplate(templateName);
        el.innerHTML = html;
        el.classList.remove(templateClass);
        inserted++;
    }
    return inserted;
}

async function init() {
    let inserted;
    do {
        inserted = await processTemplates();
    }
    while (inserted > 0);
}