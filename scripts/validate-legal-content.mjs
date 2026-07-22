import fs from 'node:fs';
import path from 'node:path';

// Terms that describe the EU ODR platform as if it were still operative.
// The platform stopped accepting complaints 2025-03-20 and was fully
// discontinued 2025-07-20 (Regulation (EU) 2024/3228). Any of these terms
// is only acceptable when the surrounding text marks it as historical.
const forbidden = [
  /\bODR\b/,
  /Online Dispute Resolution/i,
  /consumers\/odr/i,
  /Resoluci[oó]n de Litigios en L[ií]nea/i,
  /plataforma ODR/i,
  /ODR[- ]?Plattform/i,
  /r[eé]solution des litiges en ligne/i,
  /risoluzione delle controversie online/i,
  /resolu[cç][aã]o de litígios em linha/i
];

// If a forbidden term appears, the same paragraph must contain one of these
// to prove it's being described as retired, not as an available channel.
const historicalMarkers = /discontinued|permanently closed|shut down|retired|cerr[oó]|cerrada|clausurada|discontinuad[ao]|eingestellt|abgeschaltet|ferm[ée]e?|dismessa|chiusa|descontinuad[ao]|encerrad[ao]|2025-07-20|20 de julio de 2025|20 July 2025|juillet 2025|luglio 2025|julho de 2025|Juli 2025/i;

const root = path.resolve('public');
const errors = [];
let scanned = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(full); continue; }
    if (!entry.name.endsWith('.html')) continue;
    scanned++;
    const text = fs.readFileSync(full, 'utf8');
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      for (const pattern of forbidden) {
        if (!pattern.test(line)) continue;
        // Look at a window around the match (this line plus neighbors) for
        // a historical marker, since the marker is often in an adjacent
        // sentence within the same paragraph rather than the same line.
        const windowStart = Math.max(0, i - 2);
        const windowEnd = Math.min(lines.length, i + 3);
        const window = lines.slice(windowStart, windowEnd).join(' ');
        if (!historicalMarkers.test(window)) {
          errors.push(`${path.relative(root, full)}:${i + 1}: retired ODR term without historical context \u2014 "${line.trim().slice(0, 140)}"`);
        }
      }
    });
  }
}

walk(root);

console.log(`Legal content validation: scanned ${scanned} HTML files, ${errors.length} errors`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
