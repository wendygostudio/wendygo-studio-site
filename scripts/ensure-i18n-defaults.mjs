import fs from 'node:fs';
import path from 'node:path';
import {defaultLocale, locales} from './lib/i18n.mjs';

const check = process.argv.includes('--check');
const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name.endsWith('.html')) files.push(target);
  }
};
walk('public');

let changed = 0;
const changedFiles = [];
for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  if (/name=["']robots["'][^>]+noindex/i.test(before)) continue;
  const canonical = before.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)/i)?.[1];
  if (!canonical) continue;
  const alternates = [...before.matchAll(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']+)["']\s+href=["']([^"']+)["'][^>]*>/gi)];
  if (!alternates.length) continue;
  const defaultHreflang = locales[defaultLocale].hreflang;
  const defaultTarget = alternates.find(match => match[1].toLowerCase() === defaultHreflang.toLowerCase())?.[2]
    || (before.match(/<html[^>]+lang=["']([^"']+)/i)?.[1] === locales[defaultLocale].htmlLang ? canonical : null);
  if (!defaultTarget) continue;
  let after = before;
  const existing = alternates.find(match => match[1].toLowerCase() === 'x-default');
  if (existing && existing[2] === defaultTarget) continue;
  const desired = `<link rel="alternate" hreflang="x-default" href="${defaultTarget}"${existing?.[0].trimEnd().endsWith('/>') ? ' /' : ''}>`;
  if (existing) after = after.replace(existing[0], desired);
  else {
    const last = alternates.at(-1);
    after = after.replace(last[0], `${last[0]}\n  ${desired}`);
  }
  if (after !== before) {
    changed++;
    changedFiles.push(file);
    if (!check) fs.writeFileSync(file, after, 'utf8');
  }
}

console.log(`${check ? 'Checked' : 'Ensured'} x-default alternates; ${changed} ${check ? 'out of sync' : 'updated'}`);
if (changedFiles.length) console.log(changedFiles.map(file => `- ${file}`).join('\n'));
if (check && changed) process.exit(1);
