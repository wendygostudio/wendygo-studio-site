import fs from 'node:fs';
import path from 'node:path';
const files = ['de/datenschutz.html','de/nutzungsbedingungen.html','fr/conditions.html','fr/confidentialite.html','it/privacy.html','it/termini.html','pt/privacidade.html','pt/termos.html'];
let changed=0;
for (const rel of files) {
  const file=path.join('public',rel); if(!fs.existsSync(file)) continue;
  const old=fs.readFileSync(file,'utf8'); if(/property=["']og:title["']/.test(old)) continue;
  const title=old.match(/<title>([^<]+)<\/title>/i)?.[1] || 'Wendygo Studio';
  const next=old.replace('</head>',`<meta property="og:title" content="${title.replaceAll('&','&amp;').replaceAll('"','&quot;')}" /></head>`);
  if(next!==old){fs.writeFileSync(file,next,'utf8');changed++;}
}
console.log(`Repaired legal OG titles; ${changed} files updated`);
