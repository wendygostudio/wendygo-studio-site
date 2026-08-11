import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('content/blog');
const updates = new Map([
  ['convert-pdf-to-text-free', ['Convert a Scanned PDF to Text Free — Local OCR in Chrome', 'Convert a scanned PDF to searchable text with local OCR in Chrome. No upload or account, with clear free and Pro limits.']],
  ['forest-app-alternatives-chrome', ['5 Forest App Alternatives for Chrome: Focus Tools Compared', 'Compare five Forest alternatives for Chrome, including visual progress, distraction blocking and local Pomodoro sessions.']],
  ['decode-jwt-online', ['Decode a JWT Token Online — Private, Local and No Upload', 'Decode a JWT header and payload in your browser without sending the token to a third-party server.']],
  ['resize-image-for-tiktok-profile-picture', ['TikTok Profile Picture Size: Resize to 400×400 in Chrome', 'Resize a TikTok profile picture to 400×400 in Chrome. FrameForge crops locally and exports a clean, upload-ready square.']],
  ['resize-image-for-x-twitter-post', ['X (Twitter) Image Size: Resize Posts to 1200×675 in Chrome', 'Resize images to 1200×675 for X (Twitter) without cropping. FrameForge works locally in Chrome, with no upload or Photoshop.']]
]);
let changed = 0;
for (const file of fs.readdirSync(root)) {
  if (!file.endsWith('.md')) continue;
  const raw = fs.readFileSync(path.join(root, file), 'utf8');
  const slug = raw.match(/^slug:\s*([^\r\n]+)/m)?.[1]?.trim();
  if (!updates.has(slug)) continue;
  const [title, description] = updates.get(slug);
  let next = raw.replace(/^title:\s*.*$/m, `title: ${JSON.stringify(title)}`)
    .replace(/^description:\s*.*$/m, `description: ${JSON.stringify(description)}`);
  if (next !== raw) { fs.writeFileSync(path.join(root, file), next, 'utf8'); changed++; }
}
console.log(`Optimized ${changed} search snippets`);
