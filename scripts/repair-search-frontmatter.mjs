import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root = path.resolve('content/blog');
const targets = new Set([
  'convert-pdf-to-text-free', 'forest-app-alternatives-chrome', 'decode-jwt-online',
  'resize-image-for-tiktok-profile-picture', 'resize-image-for-x-twitter-post'
]);
const optimized = new Map([
  ['convert-pdf-to-text-free', ['Convert a Scanned PDF to Text Free — Local OCR in Chrome', 'Convert a scanned PDF to searchable text with local OCR in Chrome. No upload or account, with clear free and Pro limits.']],
  ['forest-app-alternatives-chrome', ['5 Forest App Alternatives for Chrome: Focus Tools Compared', 'Compare five Forest alternatives for Chrome, including visual progress, distraction blocking and local Pomodoro sessions.']],
  ['decode-jwt-online', ['Decode a JWT Token Online — Private, Local and No Upload', 'Decode a JWT header and payload in your browser without sending the token to a third-party server.']],
  ['resize-image-for-tiktok-profile-picture', ['TikTok Profile Picture Size: Resize to 400×400 in Chrome', 'Resize a TikTok profile picture to 400×400 in Chrome. FrameForge crops locally and exports a clean, upload-ready square.']],
  ['resize-image-for-x-twitter-post', ['X (Twitter) Image Size: Resize Posts to 1200×675 in Chrome', 'Resize images to 1200×675 for X (Twitter) without cropping. FrameForge works locally in Chrome, with no upload or Photoshop.']]
]);
let repaired = 0;
for (const file of fs.readdirSync(root)) {
  if (!file.endsWith('.md')) continue;
  const full = path.join(root, file);
  const raw = fs.readFileSync(full, 'utf8');
  const slug = raw.match(/^slug:\s*([^\r\n]+)/m)?.[1]?.trim();
  if (!targets.has(slug)) continue;
  const locale = raw.match(/^locale:\s*([^\r\n]+)/m)?.[1]?.trim() || 'en';
  const end = raw.indexOf('\n---', 4);
  if (end < 0) continue;
  const body = raw.slice(end + 5);
  const original = execFileSync('git', ['show', `HEAD:content/blog/${file}`], {encoding:'utf8'});
  const originalEnd = original.indexOf('\n---', 4);
  let front = original.slice(0, originalEnd + 4);
  if (locale === 'en' && optimized.has(slug)) {
    const [title, description] = optimized.get(slug);
    front = front.replace(/^title:[\s\S]*?(?=^description:)/m, `title: ${JSON.stringify(title)}\n`)
      .replace(/^description:[\s\S]*?(?=^date:)/m, `description: ${JSON.stringify(description)}\n`);
  }
  fs.writeFileSync(full, front + body, 'utf8');
  repaired++;
}
console.log(`Repaired ${repaired} targeted frontmatters`);
