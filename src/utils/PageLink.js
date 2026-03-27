export function buildPageLink(label, targetPage, classes, onPageChange) {
    const a = document.createElement('a');
    a.href = `?page=${targetPage}`;
    a.textContent = label;
    a.className = 'page-btn ' + classes;

    a.addEventListener('click', (e) => {
        e.preventDefault();
        onPageChange(targetPage);
    });

    return a;
}