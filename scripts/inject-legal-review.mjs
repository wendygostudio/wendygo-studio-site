import fs from 'node:fs';
import path from 'node:path';

const roots = [path.resolve('public/blog'), path.resolve('public/es/blog')];
let changed = 0;
for (const root of roots) {
  for (const entry of fs.readdirSync(root, {withFileTypes: true})) {
    if (!entry.isDirectory()) continue;
    const file = path.join(root, entry.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    const before = fs.readFileSync(file, 'utf8');
    if (!before.includes('ClaimForge') || before.includes('data-legal-review') || before.includes('content="Wendygo structured content"')) continue;
    const es = file.includes(`${path.sep}es${path.sep}`);
    const banner = `<aside data-legal-review data-review-due="2026-10-21" style="margin:28px 0;padding:18px 20px;background:#1c1f26;border:1px solid #2e343f;border-left:4px solid #e8a33d;border-radius:0 10px 10px 0;color:#8b93a3;font-size:13px;line-height:1.6"><p style="margin:0 0 6px"><strong style="color:#e7e9ee">${es?'Revisión jurídica editorial':'Editorial legal review'}:</strong> 2026-07-21 · ${es?'Unión Europea; las normas nacionales pueden variar':'European Union; national rules may vary'}</p><p style="margin:0 0 6px">${es?'Información general; no sustituye asesoramiento jurídico individual.':'General information; this is not individual legal advice.'}</p><p style="margin:0">${es?'Fuente oficial':'Official source'}: <a style="color:#e8a33d" href="https://europa.eu/youreurope/citizens/consumers/" rel="noopener">Your Europe</a></p></aside>`;
    let after = before;
    if (after.includes('<div class="article-body">')) after = after.replace('<div class="article-body">', `${banner}\n<div class="article-body">`);
    else if (after.includes('<hr class="divider">')) after = after.replace('<hr class="divider">', `${banner}\n<hr class="divider">`);
    else if (after.includes('<main class="article-wrap">')) after = after.replace('<main class="article-wrap">', `<main class="article-wrap">\n${banner}`);
    else if (after.includes('<main class="page-wrap">')) after = after.replace('<main class="page-wrap">', `<main class="page-wrap">\n${banner}`);
    if (after !== before) {
      fs.writeFileSync(file, after, 'utf8');
      changed++;
    }
  }
}
console.log(`Injected legal review notices into ${changed} legacy articles`);
