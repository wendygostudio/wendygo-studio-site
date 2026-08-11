import fs from 'node:fs';
import path from 'node:path';

const replacements = {
  '/es/blog/como-presentar-reclamacion-consumidor-ue/': '/es/blog/how-to-file-consumer-complaint-eu/',
  '/es/blog/alternativas-reclamar-sin-abogado-ue/': '/es/blog/alternatives-to-hiring-a-lawyer-consumer-claims-eu/',
  '/es/blog/pomodoro-vs-bloques-de-tiempo/': '/es/blog/pomodoro-vs-time-blocking/'
};
let updated = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.md') || entry.name.endsWith('.html')) {
      const before = fs.readFileSync(file, 'utf8');
      let after = before;
      for (const [from, to] of Object.entries(replacements)) after = after.replaceAll(from, to);
      if (after !== before) { fs.writeFileSync(file, after, 'utf8'); updated++; }
    }
  }
}
walk('content');
walk('public');
console.log(`Repaired legacy internal links: ${updated} files`);
