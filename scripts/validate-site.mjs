import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('public'), files = [];
function walk(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const file = path.join(dir, entry.name); entry.isDirectory() ? walk(file) : entry.name.endsWith('.html') && files.push(file); } }
walk(root);
const errors = [], canonicals = new Map();
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const redirects = new Set(fs.readFileSync(path.join(root, '_redirects'), 'utf8').split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith('#')).map(line => line.split(/\s+/)[0]));
const exists = href => { const clean = href.split('#')[0].split('?')[0]; if (!clean || !clean.startsWith('/') || clean.startsWith('//')) return true; if (redirects.has(clean) || redirects.has(`${clean}*`)) return true; const rel = decodeURIComponent(clean).replace(/^\/+|\/+$/g, ''); return fs.existsSync(path.join(root, rel, 'index.html')) || fs.existsSync(path.join(root, `${rel}.html`)) || fs.existsSync(path.join(root, rel)); };
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8'), rel = path.relative(root, file).replaceAll('\\', '/'), structured = /content=["']Wendygo structured content["']/i.test(html);
  const noindex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html), title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim(), desc = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1], canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i)?.[1];
  if (!title) errors.push(`${rel}: missing title`); else if (!structured && [...decode(title)].length > 60) errors.push(`${rel}: title ${[...decode(title)].length}`);
  if (desc && !structured && [...decode(desc)].length > 150) errors.push(`${rel}: description ${[...decode(desc)].length}`);
  if (!canonical && !noindex) errors.push(`${rel}: missing canonical`); if (canonical && !noindex) { if (canonicals.has(canonical)) errors.push(`${rel}: duplicate canonical ${canonical}`); canonicals.set(canonical, rel); }
  if (!html.includes('static.cloudflareinsights.com/beacon.min.js')) errors.push(`${rel}: missing analytics`);
  if (/<meta[^>]+content=["'][^"']*&(?!(?:amp|quot|lt|gt|#\d+|#x[0-9a-f]+);)/i.test(html)) errors.push(`${rel}: unescaped ampersand in meta content`);
  for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) if (!exists(match[1])) errors.push(`${rel}: broken internal link ${match[1]}`);
  try { for (const match of html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)) JSON.parse(match[1]); } catch { errors.push(`${rel}: invalid JSON-LD`); }
}
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8'), sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]));
for (const url of canonicals.keys()) if (!sitemapUrls.has(url)) errors.push(`sitemap missing ${url}`);
for (const url of sitemapUrls) if (!canonicals.has(url)) errors.push(`sitemap has noncanonical ${url}`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`${files.length} HTML files; ${errors.length} errors`);
