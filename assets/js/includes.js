// Minimal HTML partial loader: replaces elements with data-include="name" with assets/partials/name.html
document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll('[data-include]');
  targets.forEach(async (el) => {
    const name = el.getAttribute('data-include');
    const path = `assets/partials/${name}.html`;
    try {
      const res = await fetch(path, { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.statusText);
      el.outerHTML = await res.text();
    } catch (err) {
      console.warn('Include failed:', path, err);
    }
  });
});

