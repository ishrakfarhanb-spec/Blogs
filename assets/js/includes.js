// Minimal HTML partial loader: replaces elements with data-include="name" with assets/partials/name.html
document.addEventListener('DOMContentLoaded', () => {
  const targets = Array.from(document.querySelectorAll('[data-include]'));

  const loadInclude = async (el) => {
    const name = el.getAttribute('data-include');
    const path = `assets/partials/${name}.html`;
    try {
      const res = await fetch(path, { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.statusText);
      el.outerHTML = await res.text();
    } catch (err) {
      console.warn('Include failed:', path, err);
    }
  };

  Promise.all(targets.map(loadInclude)).then(() => {
    initHeaderNav();
  });
});

function initHeaderNav() {
  const nav = document.querySelector('.site-header .site-nav');
  const toggle = document.querySelector('.site-header .nav-toggle');
  const list = nav ? nav.querySelector('#nav-list') : null;
  if (!nav || !toggle || !list) return;

  const mq = window.matchMedia('(max-width: 900px)');

  const close = () => {
    nav.classList.remove('open');
    nav.dataset.open = 'false';
    toggle.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onDocClick);
  };

  const onDocClick = (e) => {
    if (!nav.contains(e.target)) close();
  };

  const open = () => {
    nav.classList.add('open');
    nav.dataset.open = 'true';
    toggle.setAttribute('aria-expanded', 'true');
    // Defer so the click that opened it doesn't immediately close it
    setTimeout(() => document.addEventListener('click', onDocClick), 0);
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = nav.classList.contains('open');
    if (isOpen) close(); else open();
  });

  // Close on nav link click (mobile)
  list.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));

  // Close when resizing to desktop
  if (mq && mq.addEventListener) {
    mq.addEventListener('change', (e) => { if (!e.matches) close(); });
  } else {
    window.addEventListener('resize', () => { if (window.innerWidth > 900) close(); });
  }
}
