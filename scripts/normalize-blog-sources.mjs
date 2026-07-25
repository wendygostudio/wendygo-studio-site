import fs from 'node:fs';
import path from 'node:path';

const check = process.argv.includes('--check');
const root = path.resolve('content/blog');
let changed = 0;

for (const name of fs.readdirSync(root).filter((file) => file.endsWith('.md'))) {
  const file = path.join(root, name);
  const current = fs.readFileSync(file, 'utf8');
  const normalized = current
    .replace(/^\s*<content>\s*$/gim, '')
    .replace(/^\s*<\/content>\s*$/gim, '')
    .replace(/\n{3,}$/g, '\n');
  if (normalized !== current) {
    changed++;
    if (!check) fs.writeFileSync(file, normalized, 'utf8');
  }
}

console.log(`${check ? 'Checked' : 'Normalized'} blog sources; ${changed} ${check ? 'out of sync' : 'updated'}`);
if (check && changed) process.exit(1);
