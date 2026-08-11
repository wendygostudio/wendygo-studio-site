import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root = path.resolve('content/blog');
const score = text => (text.match(/�|ï¿½/g) || []).length * 100 + (text.match(/Ã|Â|â|[\u0013\u0014\u0080-\u009f]/g) || []).length;
const normalizeLegacy = text => text
  .replaceAll('â\u0080\u0093', '–').replaceAll('â\u0080\u0094', '—')
  .replaceAll('â\u0080\u0098', '˜').replaceAll('â\u0080\u0099', '™')
  .replaceAll('â\u0082¬', '€').replaceAll('â\u0086\u2019', '→')
  .replaceAll('\u0013', '–').replaceAll('\u0014', '—');
const cp1252 = bytes => {
  // These files contain a mixture of UTF-8 and legacy Windows-1252 bytes.
  // Decode as latin-1 first, then undo UTF-8 mojibake below.
  return bytes.toString('latin1');
};
const repairMojibake = input => {
  let value = normalizeLegacy(input);
  for (let i = 0; i < 3; i++) {
    try {
      const candidate = normalizeLegacy(Buffer.from(value, 'latin1').toString('utf8'));
      if (score(candidate) < score(value)) value = candidate; else break;
    } catch { break; }
  }
  return value;
};
const files = fs.readdirSync(root).filter(name => name.endsWith('.md'));
let restored = 0, decoded = 0, unresolved = 0;

for (const name of files) {
  const full = path.join(root, name);
  const current = fs.readFileSync(full, 'utf8');
  const currentScore = score(current);
  if (!currentScore) continue;

  const direct = repairMojibake(current);
  if (score(direct) < currentScore) {
    fs.writeFileSync(full, direct, 'utf8');
    decoded++;
    continue;
  }

  if (current.includes('�')) {
    const commits = execFileSync('git', ['log', '--all', '--format=%H', '--', `content/blog/${name}`], {encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
    let best = current, bestScore = currentScore;
    for (const commit of commits) {
      try {
        const candidate = repairMojibake(cp1252(execFileSync('git', ['show', `${commit}:content/blog/${name}`])));
        const candidateScore = score(candidate);
        if (candidateScore < bestScore) { best = candidate; bestScore = candidateScore; }
        if (bestScore === 0) break;
      } catch {}
    }
    if (bestScore < currentScore) { fs.writeFileSync(full, best, 'utf8'); restored++; continue; }
    unresolved++;
    continue;
  }

  // No safe reversible repair was found.
}
console.log(JSON.stringify({restored, decoded, unresolved}));
