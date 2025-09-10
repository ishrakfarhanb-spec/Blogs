// Fetch blog data and render cards; enable sidebar filtering
async function loadBlogs() {
  const container = document.getElementById('feed');
  try {
    const res = await fetch('assets/data/blogs.json', { cache: 'no-cache' });
    const items = res.ok ? await res.json() : [];
    const html = items.map(toCard).join('');
    container.innerHTML = html;
    setupFiltering();
  } catch (e) {
    container.innerHTML = '<p class="muted">Failed to load posts.</p>';
  }
}

function toCard(item) {
  const tags = (item.tags || []).join(' ');
  const img = item.image || 'assets/img/placeholder-wide.svg';
  return `
  <article class="card" data-tags="${tags}">
    <div class="media"><img src="${img}" alt="${escapeHtml(item.imageAlt || item.title)}" loading="lazy" /></div>
    <div class="card-body">
      <span class="eyebrow">${escapeHtml(item.category || '')}</span>
      <h2 class="title">${escapeHtml(item.title)}</h2>
      <p class="desc">${escapeHtml(item.excerpt || '')}</p>
      <div class="byline"><span class="avatar" aria-hidden="true"></span><span>${escapeHtml(item.author || '')}</span></div>
    </div>
  </article>`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"]+/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
}

function setupFiltering() {
  const buttons = document.querySelectorAll('.filters button');
  const cards = document.querySelectorAll('.card');
  buttons.forEach(btn => btn.addEventListener('click', () => {
    buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const key = btn.dataset.filter;
    cards.forEach(card => {
      const match = key === 'all' || card.dataset.tags.split(/\s+/).includes(key);
      card.style.display = match ? '' : 'none';
    });
  }));
}

document.addEventListener('DOMContentLoaded', loadBlogs);

