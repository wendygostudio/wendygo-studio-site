import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const files = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) walk(file);
    else if (name === 'index.html') files.push(file);
  }
}
walk(root);

const routes = new Map();
for (const file of files) {
  const rel = `/${path.relative(root, file).replaceAll(path.sep, '/')}`;
  const route = rel === '/index.html' ? '/' : rel.replace(/index\.html$/, '');
  routes.set(route, file);
}

const incoming = new Map([...routes.keys()].map(route => [route, 0]));
const external = new Map();
const missing = [];

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  for (const match of html.matchAll(/href=["']([^"'#]+)["']/gi)) {
    const href = match[1];
    if (href.startsWith('https://wendygostudio.com')) {
      const target = new URL(href).pathname;
      if (incoming.has(target)) incoming.set(target, incoming.get(target) + 1);
      else if (target !== '/') missing.push({ source: file, target });
    } else if (/^https?:\/\//i.test(href)) {
      try {
        const host = new URL(href).hostname;
        if (!host.endsWith('wendygostudio.com')) external.set(host, (external.get(host) || 0) + 1);
      } catch {}
    }
  }
}

const excluded = /^\/(?:privacy|terms|datenschutz|confidentialite|privacy|privacidade|blog|es|de|fr|it|pt)?\/?$/;
const orphans = [...incoming]
  .filter(([route, count]) => count === 0 && !excluded.test(route))
  .map(([route]) => route);

const result = {
  generatedAt: new Date().toISOString(),
  htmlFiles: files.length,
  externalDomains: [...external.entries()].sort((a, b) => b[1] - a[1]),
  internalMissingTargets: missing.length,
  orphanCandidates: orphans,
  note: 'This is an internal-link audit. It cannot identify external backlinks; use Search Console Links export or a backlink index for that.'
};
console.log(JSON.stringify(result, null, 2));
