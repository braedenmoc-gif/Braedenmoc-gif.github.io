// After the Vite build, copy index.html into one folder per route so GitHub Pages
// answers deep links with a normal 200 instead of the 404 fallback.
import { mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
const routes = ['about', 'resources', 'program', 'film-room', 'faq', 'contact', 'privacy', 'terms',
  'products/quarterback-playbook', 'products/qb-film-room-guide', 'products/quarterback-journal', 'products/complete-qb-development-bundle'];
for (const r of routes) { mkdirSync(`dist/${r}`, { recursive: true }); copyFileSync('dist/index.html', `dist/${r}/index.html`); }
const base = 'https://braedenmoc-gif.github.io';
const urls = ['', ...routes].map((r) => `  <url><loc>${base}/${r}</loc></url>`).join('\n');
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
