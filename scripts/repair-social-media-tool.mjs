import fs from 'node:fs';
import path from 'node:path';

const files = [
  path.resolve('public/tools/social-media-image-sizes/index.html'),
  path.resolve('public/es/tools/social-media-image-sizes/index.html'),
  ...['de', 'fr', 'it', 'pt'].map((locale) => path.resolve(`public/${locale}/tools/social-media-image-sizes/index.html`)),
];

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/\}\}\]\}<\/script>/g, '}}]}]</script>');
  html = html.replace(/href="\/(?:[a-z-]+\/)?how-it-works\/"/g, 'href="/"');
  html = html.replace(/href="\/(?:[a-z-]+\/)?privacy\/"/g, 'href="/#privacy"');
  if (!html.includes('property="og:title"')) {
    const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] || 'Social Media Image Sizes';
    const description = html.match(/<meta name="description" content="([^"]*)"/i)?.[1] || '';
    html = html.replace('</head>', `<meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:image" content="https://wendygostudio.com/og-image.png"><meta name="twitter:card" content="summary_large_image"></head>`);
  }
  if (!html.includes('static.cloudflareinsights.com/beacon.min.js')) {
    html = html.replace('</body>', '<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon=\'{"token":"e5e5861ded154e779510bf3f84cdd7fd"}\'></script></body>');
  }
  fs.writeFileSync(file, html, 'utf8');
}
console.log(`Repaired ${files.length} social media tool pages`);
