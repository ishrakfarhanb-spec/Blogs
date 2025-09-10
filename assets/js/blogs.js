// Fetch blog data and render cards; enable sidebar filtering
async function loadBlogs() {
  const container = document.getElementById('feed');
  try {
    const res = await fetch('assets/data/blogs.json', { cache: 'no-cache' });
    const items = res.ok ? await res.json() : [];
    const sorted = sortByDateDesc(items);
    if (!sorted.length) {
      container.innerHTML = '<p class="muted">No posts yet.</p>';
    } else {
      const html = sorted.map(toCard).join('');
      container.innerHTML = html;
    }
    setupFiltering();
  } catch (e) {
    container.innerHTML = '<p class="muted">Failed to load posts.</p>';
  }
}

function sortByDateDesc(list) {
  return (Array.isArray(list) ? [...list] : []).sort((a,b) => {
    const da = Date.parse(a && a.date);
    const db = Date.parse(b && b.date);
    const va = isNaN(da) ? -Infinity : da;
    const vb = isNaN(db) ? -Infinity : db;
    // newer first; items without date sink to bottom but preserve relative order
    if (vb === va) return 0;
    return vb - va;
  });
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
      ${item.slug ? `<a class="btn btn-link" href="post.html?slug=${encodeURIComponent(item.slug)}">Read more →</a>` : ''}
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
