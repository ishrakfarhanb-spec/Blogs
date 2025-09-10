# Blogs

Live site
- https://ishrakfarhanb-spec.github.io/Blogs/

A standalone blog website with a sticky sidebar and a two‑column feed.

- Uses simple HTML partials (header/footer) via `assets/js/includes.js`.
- Blog cards are rendered from `assets/data/blogs.json` by `assets/js/blogs.js`.
- All styles live in `assets/css` with page‑specific rules in `assets/css/pages/blogs.css`.

Local preview
- Open `index.html` directly in a browser, or serve via any static server.

Deploy (GitHub Pages)
- Uses GitHub Actions to deploy from `main` (see `.github/workflows/pages.yml`).
- First successful run publishes to: https://ishrakfarhanb-spec.github.io/Blogs/

Content
- Edit `assets/data/blogs.json` to change posts.
- Add images under `assets/img/` and reference them from the JSON.
