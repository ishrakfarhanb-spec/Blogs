// Simple post renderer: loads JSON by slug and renders body as paragraphs
(function(){
  function qs(k){ return new URLSearchParams(location.search).get(k); }
  function esc(s){ return String(s||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function transformInline(s){
    // Replace custom image marker like: (((https://...))) with an inline image
    return String(s||'').replace(/\(\(\(([^)]+)\)\)\)/g, (m, url) => {
      const safe = url.replace(/"/g, '%22');
      return `<img class="post-img" src="${safe}" alt="" loading="lazy">`;
    });
  }
  function para(html){
    const withImages = transformInline(String(html||''));
    const lines = withImages.split(/\r?\n\r?\n+/);
    return lines.map(x => `<p>${x.replace(/\r?\n/g,'<br>')}</p>`).join('\n');
  }
  async function init(){
    const slug = qs('slug');
    if(!slug){ document.getElementById('post-body').innerHTML = '<p class="muted">Missing slug.</p>'; return; }
    try{
      const res = await fetch(`assets/data/posts/${encodeURIComponent(slug)}.json`, { cache: 'no-cache' });
      if(!res.ok) throw new Error('Not found');
      const data = await res.json();
      document.title = `${data.title} | Blogs`;
      document.getElementById('post-title').textContent = data.title;
      document.getElementById('post-meta').textContent = [data.author, data.date].filter(Boolean).join(' • ');
      if(data.image){
        document.getElementById('post-hero').innerHTML = `<img src="${esc(data.image)}" alt="${esc(data.imageAlt||data.title)}">`;
      }
      document.getElementById('post-body').innerHTML = para(data.body || '');
    }catch(err){
      document.getElementById('post-body').innerHTML = '<p class="muted">Post not found.</p>';
    }
  }
  document.addEventListener('DOMContentLoaded', init);
})();
