import fs from 'node:fs';

const file = 'public/index.html';
let html = fs.readFileSync(file, 'utf8');

// Keep the transform safe to run repeatedly during build and local previews.
html = html.replace(/<style id="presentation-polish">[\s\S]*?<\/style>/g, '');
html = html.replace(/<div class="product-audience">[\s\S]*?<\/div>/g, '');
html = html.replace(/<caption>[\s\S]*?<\/caption>/g, '');

// Make the first screen explain the product in plain language before the details.
html = html.replace(
  /<p class="hero-sub">[\s\S]*?<\/p>/,
  '<p class="hero-sub">Simple browser tools for six everyday jobs: clean text, prepare images, convert files, protect configurations, understand EU consumer routes and build a steadier focus habit.</p>'
);
html = html.replace(
  /<div class="hero-term">[\s\S]*?<\/div>/,
  '<div class="hero-term"><span class="prompt">$</span> what happens to my content? <b>→ it stays in your browser by default.</b></div>'
);
html = html.replace('>Find your tool</a>', '>Choose your tool</a>');
html = html.replace('<a class="cta-ghost" href="/forge-ecosystem/">Explore the ecosystem</a>', '<a class="cta-ghost" href="#privacy">How privacy works</a>');
html = html.replace('<a class="cta-ghost" href="/blog/">Read practical guides</a>', '<a class="cta-ghost" href="/blog/">Read practical guides</a>');
html = html.replace(
  /<div class="hero-badges">[\s\S]*?<\/div>\s*<div class="hero-stats">[\s\S]*?<\/div>/,
  `<div class="hero-badges">
      <span class="badge"><span class="dot"></span>Local processing by default</span>
      <span class="badge"><span class="dot"></span>No extension content collected</span>
      <span class="badge"><span class="dot"></span>No account required</span>
      <span class="badge"><span class="dot"></span>Chrome &amp; Edge</span>
    </div>
    <div class="hero-stats">
      <span><b>6</b>focused tools</span>
      <span><b>0</b>content-processing servers</span>
      <span><b>No</b>ad tracking</span>
      <span><b>6</b>extension languages</span>
    </div>`
);
html = html.replace(
  /<div class="home-proof"[^>]*>[\s\S]*?<\/div>\s*<\/div>/,
  '<div class="home-proof" aria-label="Wendygo Studio principles"><div><strong>6</strong><span>focused browser tools</span></div><div><strong>Local</strong><span>content processing by default</span></div><div><strong>5 days</strong><span>free PRO trial, no card</span></div><div><strong>6</strong><span>languages in every extension</span></div></div>'
);

// Give every product a quick audience cue and remove the ambiguous “Try” label.
const audiences = {
  TextForge: 'For developers, writers and anyone who works with text.',
  FrameForge: 'For creators preparing images for social platforms.',
  ScrubForge: 'For sysadmins and infrastructure teams.',
  ClaimForge: 'For consumers preparing a clearer EU claim.',
  ConvertForge: 'For anyone converting files without uploading them.',
  SlimeForge: 'For people building a more consistent focus habit.',
};
for (const [name, audience] of Object.entries(audiences)) {
  const marker = new RegExp(`(<div class="product-name">${name}<\\/div>[\\s\\S]*?<div class="product-tagline">[\\s\\S]*?<\\/div>)`);
  html = html.replace(marker, `$1<div class="product-audience">${audience}</div>`);
  html = html.replace(`>Try ${name}</a>`, `>View ${name}</a>`);
}

html = html.replace(
  '</head>',
  `<style id="presentation-polish">
    .product-audience{color:var(--text);font-size:13px;line-height:1.45;margin-top:8px}
    .hero-term{max-width:100%;line-height:1.45}
    .home-use-case span{line-height:1.5}
    .home-comparison caption{caption-side:top;text-align:left;padding:14px 16px;color:var(--muted);font-size:13px}
    @media(max-width:600px){.hero{padding-top:56px}.hero-ctas{align-items:stretch}.hero-ctas a{width:100%;justify-content:center}.hero-stats{gap:12px 20px}.hero-stats span{min-width:calc(50% - 10px);text-align:left}.product-audience{font-size:13px}}
  </style></head>`
);
html = html.replace('<div class="home-comparison"><table>', '<div class="home-comparison"><table><caption>Choose by the job you need to complete. Every Forge works without an account.</caption>');
fs.writeFileSync(file, html);

// Improve the tools hub without changing its existing URLs or cards.
const toolsFile = 'public/tools/index.html';
if (fs.existsSync(toolsFile)) {
  let tools = fs.readFileSync(toolsFile, 'utf8');
  tools = tools.replace('<h1>Free online utilities</h1>', '<h1>Free online utilities for everyday work</h1>');
  tools = tools.replace(
    /<p class="page-sub">[\s\S]*?<\/p>/,
    '<p class="page-sub">Choose a small task, get a clear result and move on. Every tool runs in your browser, needs no account and explains what it does before you start.</p>'
  );
  fs.writeFileSync(toolsFile, tools);
}

console.log('Presentation polish applied to home and tools hub.');
