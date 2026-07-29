import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const labels = { textforge: 'TextForge extension preview', frameforge: 'FrameForge extension preview', scrubforge: 'ScrubForge extension preview', claimforge: 'ClaimForge extension preview', convertforge: 'ConvertForge extension preview', slimeforge: 'SlimeForge extension preview', 'og-image': 'Wendygo Studio extensions' };
let changed = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) {
      const before = fs.readFileSync(file, 'utf8');
      const after = before.replace(/<img\b([^>]*?)>/gi, (full, attrs) => {
        if (/\balt\s*=["'][^"']+?["']/.test(attrs)) return full;
        const src = attrs.match(/\bsrc=["']([^"']+)/i)?.[1] || '';
        const key = Object.keys(labels).find(name => src.toLowerCase().includes(name));
        const fallback = path.basename(src.split('?')[0]).replace(/[-_]+/g, ' ').replace(/\.[a-z0-9]+$/i, '').trim() || 'Wendygo Studio image';
        const withAlt = attrs.replace(/\s+alt\s*=["'][^"']*["']/i, '');
        return `<img alt="${labels[key] || fallback}"${withAlt}>`;
      });
      if (after !== before) { fs.writeFileSync(file, after, 'utf8'); changed++; }
    }
  }
}
walk(root);
console.log(`Added alt text to ${changed} HTML files`);
