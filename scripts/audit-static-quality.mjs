import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) files.push(file);
  }
}
walk(root);
const issues = [];
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file).replaceAll('\\', '/');
  if (!/<title>[^<]+<\/title>/i.test(html)) issues.push(`${rel}: missing title`);
  if (!/<meta\s+name=["']description["'][^>]+>/i.test(html)) issues.push(`${rel}: missing description`);
  if (!/property=["']og:title["']/i.test(html) && !/noindex/i.test(html)) issues.push(`${rel}: missing og:title`);
  for (const image of html.matchAll(/<img\b[^>]*>/gi)) if (!/\balt=["'][^"']*["']/i.test(image[0])) issues.push(`${rel}: image without alt`);
  for (const button of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)) {
    if (!button[1].replace(/<[^>]+>/g, '').trim() && !/aria-label=/i.test(button[0])) issues.push(`${rel}: unlabeled button`);
  }
}
console.log(`Static quality audit: ${files.length} HTML files, ${issues.length} issues`);
if (issues.length) { console.error(issues.join('\n')); process.exit(1); }
