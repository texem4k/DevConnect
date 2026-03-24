

async function getTopics(){
    let res = await fetch("../../backend/topics.json");
    return await res.json();
}
let OPTIONS= [];
let selected = new Set();   //Tiene todos los elementos seleccionados, por IDs
let isOpen = false;

const input      = document.querySelector('.search-box input');
const dropdown   = document.getElementById('dropdown');
const optsList   = document.getElementById('optionsList');
const tagsArea   = document.getElementById('tagsArea');
const emptyHint  = document.getElementById('emptyHint');
const countBadge = document.getElementById('countBadge');
const clearBtn   = document.getElementById('clearBtn');

function openDropdown() {
    isOpen = true;
    dropdown.classList.add('open');
}

function closeDropdown() {
    isOpen = false;
    dropdown.classList.remove('open');
}

function renderOptions(query = '') {
    const q = query.toLowerCase();
    const filtered = OPTIONS.filter(o =>
        o.name.toLowerCase().includes(q) || o.cat.toLowerCase().includes(q)
    );

    if (!filtered.length) {
        optsList.innerHTML = `<div class="no-results">Sin resultados para "${query}"</div>`;
        return;
    }

    optsList.innerHTML = filtered.map(o => {
        const isSel = selected.has(o.id);
        return `
        <div class="dropdown-item cat-${o.category} ${isSel ? 'selected' : ''}"
             onclick="event.stopPropagation(); toggleOption(${o.id})">
          <div class="checkbox">
            <svg class="checkmark" viewBox="0 0 10 10">
              <polyline points="1.5,5 4,7.5 8.5,2" stroke="#0e0e10" stroke-width="1.8"
                fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="item-meta">
            <div class="item-name">${highlight(o.name, q)}</div>
            <div class="item-category">${o.cat}</div>
          </div>
          <span class="badge">${o.category}</span>
        </div>`;
    }).join('');
}

function highlight(text, q) {
    if (!q) return text;
    const re = new RegExp(`(${q})`, 'gi');
    return text.replace(re, '<mark style="background:var(--accent-dim);color:var(--accent);border-radius:2px;">$1</mark>');
}

function toggleOption(id) {
    if (selected.has(id)) {
        selected.delete(id);
    } else {
        selected.add(id);
    }
    renderOptions(input.value);
    renderTags();
}

function renderTags() {
    const items = OPTIONS.filter(o => selected.has(o.id));

    // update counter
    countBadge.textContent = items.length;
    countBadge.classList.toggle('visible', items.length > 0);
    clearBtn.style.display = items.length > 0 ? 'block' : 'none';

    if (!items.length) {
        tagsArea.innerHTML = '';
        tagsArea.appendChild(emptyHint);
        return;
    }

    // keep emptyHint out
    emptyHint.remove();

    // sync tags: remove ones no longer selected
    document.querySelectorAll('.tag[data-id]').forEach(el => {
        if (!selected.has(+el.dataset.id)) el.remove();
    });

    // add new ones
    items.forEach(o => {
        if (!document.querySelector(`.tag[data-id="${o.id}"]`)) {
            const tag = document.createElement('div');
            tag.className = `tag cat-${o.category}`;
            tag.dataset.id = o.id;
            tag.innerHTML = `
          <span class="tag-dot"></span>
          ${o.name}
          <button class="tag-remove" onclick="removeTag(${o.id})" title="Quitar">✕</button>`;
            tagsArea.appendChild(tag);
        }
    });
}

function removeTag(id) {
    selected.delete(id);
    renderOptions(input.value);
    renderTags();
}

function clearAll() {
    selected.clear();
    renderOptions(input.value);
    renderTags();
}

// events
input.addEventListener('focus', () => {
    renderOptions(input.value);
    openDropdown();
});

input.addEventListener('input', () => {
    renderOptions(input.value);
    if (!isOpen) openDropdown();
});

document.addEventListener('click', e => {
    if (!e.target.closest('.search-box') && !e.target.closest('#dropdown')) {
        closeDropdown();
    }
});

clearBtn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    clearAll();
});

// init
async function initTopics(){
    OPTIONS=await getTopics();
    renderOptions();
    renderTags();
}
initTopics();

