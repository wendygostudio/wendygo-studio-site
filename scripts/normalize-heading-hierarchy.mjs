import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
let changed = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) {
      const html = fs.readFileSync(full, 'utf8');
      let seen = 0;
      const next = html.replace(/<h1(\b[^>]*)>([\s\S]*?)<\/h1>/gi, (match, attrs, body) => {
        seen++;
        return seen === 1 ? match : `<h2${attrs}>${body}</h2>`;
      });
      if (next !== html) { fs.writeFileSync(full, next, 'utf8'); changed++; }
    }
  }
}
walk(root);
console.log(`Normalized heading hierarchy on ${changed} HTML files`);
