import fs from 'node:fs';
import path from 'node:path';
const replacements = {
  '/es/blog/codificar-base64-secretos-kubernetes/': '/es/blog/base64-encode-kubernetes-secrets/',
  '/es/blog/convertir-video-a-audio-gratis/': '/es/blog/convert-video-to-audio-free/',
  '/es/blog/alternativas-reclamar-sin-abogado-ue/': '/es/blog/alternatives-to-hiring-a-lawyer-consumer-claims-eu/',
  '/es/blog/extraer-urls-de-texto/': '/es/blog/extract-urls-from-text/',
  '/es/blog/extraer-texto-de-imagen-gratis/': '/es/blog/extract-text-from-image-free/',
  '/es/blog/como-presentar-reclamacion-consumidor-ue/': '/es/blog/how-to-file-consumer-complaint-eu/',
  '/es/blog/alternativas-reclamar-sin-abogado-ue/': '/es/blog/alternatives-to-hiring-a-lawyer-consumer-claims-eu/',
  '/es/blog/pomodoro-vs-bloques-de-tiempo/': '/es/blog/pomodoro-vs-time-blocking/',
};
function walk(dir) { return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : e.name.endsWith('.html') ? [path.join(dir,e.name)] : []); }
let changed = 0;
for (const file of walk('public')) {
  const old = fs.readFileSync(file, 'utf8');
  let next = old; for (const [from,to] of Object.entries(replacements)) next = next.replaceAll(from,to);
  if (next !== old) { fs.writeFileSync(file, next, 'utf8'); changed++; }
}
console.log(`Repaired localized internal links; ${changed} files updated`);
