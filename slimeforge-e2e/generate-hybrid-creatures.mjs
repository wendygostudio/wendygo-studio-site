import { writeFile } from 'node:fs/promises';
import { buildCreature, BODY, derivePalette } from '../slimeforge-v1.1.0-review/common/engine.js';

const out = 'C:/Users/Damian/.codex/visualizations/2026/07/16/019f6c98-abad-73d2-82c4-cb8640a61a69/slimeforge-light-hybrid-creatures.html';

const creatures = [
  { species: 'panda', name: 'Mora', color: '#e8d4b2', seed: 42 },
  { species: 'fox', name: 'Brasa', color: '#d9823b', seed: 73 },
  { species: 'axolotl', name: 'Luma', color: '#e5a7b8', seed: 109 },
  { species: 'dragon', name: 'Tizón', color: '#9e705d', seed: 141 }
];

const extras = {
  dirtLvl: 0,
  poops: 0,
  focusing: false,
  mood: 72,
  sick: false,
  sleeping: false,
  focusSeed: 0,
  inStage: true,
  growth: 700
};

function dna(c) {
  return {
    v: 1,
    species: c.species,
    color: c.color,
    gender: 'hembra',
    accessory: 'none',
    cos: {},
    marking: { type: 'none', color: '#4a4038' },
    temperament: 'tranquilo',
    name: c.name,
    seed: c.seed
  };
}

function hybridCreature(c, idx) {
  const P = derivePalette(c.color, true);
  const grad = `sf-gel-${idx}`;
  const glow = `sf-core-${idx}`;
  let svg = buildCreature(dna(c), 3, extras);

  svg = svg.replace(
    '</defs>',
    `<radialGradient id="${grad}" cx="32%" cy="23%" r="82%"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".28" stop-color="${P.light}" stop-opacity=".96"/><stop offset=".76" stop-color="${P.body}" stop-opacity=".82"/><stop offset="1" stop-color="${P.dark}" stop-opacity=".68"/></radialGradient><filter id="${glow}" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="8"/></filter></defs>`
  );

  svg = svg.replace(
    `<path d="${BODY}" fill="${P.body}" stroke="${P.outline}" stroke-width="5" stroke-linejoin="round"/>`,
    `<path d="${BODY}" fill="url(#${grad})" stroke="${P.outline}" stroke-opacity=".5" stroke-width="3.5" stroke-linejoin="round"/>`
  );

  const core = `<g class="sf-inner-life" pointer-events="none">
    <ellipse cx="100" cy="145" rx="23" ry="19" fill="#f7b94f" opacity=".12" filter="url(#${glow})"/>
    <ellipse cx="100" cy="145" rx="8" ry="10" fill="#ffc15a" opacity=".38"/>
    <ellipse cx="97.5" cy="142" rx="2.2" ry="3.2" fill="#fff5c7" opacity=".58"/>
    <circle cx="75" cy="130" r="3.2" fill="#fff" opacity=".22"/><circle cx="128" cy="112" r="2.3" fill="#fff" opacity=".24"/><circle cx="119" cy="139" r="1.7" fill="#fff" opacity=".2"/>
  </g>`;
  svg = svg.replace('<g clip-path="url(#bodyclip)">', `<g clip-path="url(#bodyclip)">${core}`);
  svg = svg.replace(/<g class="ember ([^"]*)" style="opacity:0\.5">/, '<g class="ember $1" style="display:none">');
  svg = svg.replace(
    '</g>\n        <ellipse cx="78"',
    `<path d="${BODY}" fill="#fff" opacity=".13"/></g>\n        <ellipse cx="78"`
  );
  return svg;
}

function specimen(c, idx) {
  const current = buildCreature(dna(c), 3, extras);
  const hybrid = hybridCreature(c, idx);
  const species = { panda: 'Panda', fox: 'Zorro', axolotl: 'Axolotl', dragon: 'Dragón' }[c.species];
  return `<article class="sf-specimen">
    <div class="sf-creature-stage">
      <svg class="sf-creature sf-current" viewBox="0 0 200 200" role="img" aria-label="${species} actual">${current}</svg>
      <svg class="sf-creature sf-hybrid" viewBox="0 0 200 200" role="img" aria-label="${species} con tratamiento híbrido">${hybrid}</svg>
    </div>
    <div class="sf-name"><strong>${c.name}</strong><span>${species}</span></div>
  </article>`;
}

const fragment = `<div id="sf-hybrid-preview" class="sf-wrap sf-mode-hybrid">
  <style>
    #sf-hybrid-preview{--sf-bg:var(--color-background-primary,#11161d);--sf-panel:var(--color-background-secondary,#1a2029);--sf-text:var(--color-text-primary,#f5f2eb);--sf-muted:var(--color-text-secondary,#aeb7c4);--sf-line:var(--color-border-secondary,#343d49);--sf-amber:#f0a638;color:var(--sf-text);font:14px/1.35 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;background:var(--sf-bg);border:1px solid var(--sf-line);border-radius:18px;overflow:hidden;max-width:920px;margin:0 auto}
    #sf-hybrid-preview *{box-sizing:border-box}
    #sf-hybrid-preview .sf-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 20px 14px;border-bottom:1px solid var(--sf-line)}
    #sf-hybrid-preview .sf-title{margin:0;font-size:18px;letter-spacing:-.02em}
    #sf-hybrid-preview .sf-sub{margin:4px 0 0;color:var(--sf-muted);font-size:12px}
    #sf-hybrid-preview .sf-controls{display:flex;gap:4px;padding:4px;background:var(--sf-panel);border:1px solid var(--sf-line);border-radius:11px;flex:0 0 auto}
    #sf-hybrid-preview .btn{appearance:none;border:0;border-radius:8px;padding:8px 12px;color:var(--sf-muted);background:transparent;font:700 12px/1 inherit;cursor:pointer}
    #sf-hybrid-preview .btn[aria-pressed="true"]{background:var(--sf-amber);color:#1b1408;box-shadow:0 2px 9px #0004}
    #sf-hybrid-preview .sf-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:var(--sf-line)}
    #sf-hybrid-preview .sf-specimen{min-width:0;background:var(--sf-bg);padding:12px 10px 13px}
    #sf-hybrid-preview .sf-creature-stage{position:relative;aspect-ratio:1/1;overflow:hidden;border-radius:14px;background:radial-gradient(circle at 50% 80%,#344a3d 0 3%,transparent 35%),linear-gradient(#1b2631,#17211d 66%,#25342b);box-shadow:inset 0 0 0 1px #ffffff0e}
    #sf-hybrid-preview .sf-creature-stage:before{content:"";position:absolute;inset:auto 12% 8% 12%;height:13%;background:radial-gradient(ellipse,#0b100dc7,transparent 67%);filter:blur(3px)}
    #sf-hybrid-preview .sf-creature{position:absolute;inset:2%;width:96%;height:96%;overflow:visible;filter:drop-shadow(0 9px 8px #0007)}
    #sf-hybrid-preview .sf-current{display:none}
    #sf-hybrid-preview.sf-mode-current .sf-current{display:block}
    #sf-hybrid-preview.sf-mode-current .sf-hybrid{display:none}
    #sf-hybrid-preview .sf-hybrid .eyes{transform-box:view-box;transform-origin:100px 101px;transform:scale(1.075)}
    #sf-hybrid-preview .sf-hybrid .sf-inner-life{animation:sf-breathe 2.8s ease-in-out infinite;transform-origin:100px 145px}
    #sf-hybrid-preview .sf-hybrid .sf-inner-life circle{animation:sf-bubble 3.2s ease-in-out infinite alternate}
    #sf-hybrid-preview .sf-name{display:flex;align-items:baseline;justify-content:space-between;gap:8px;padding:9px 4px 0}
    #sf-hybrid-preview .sf-name strong{font-size:14px}
    #sf-hybrid-preview .sf-name span{color:var(--sf-muted);font-size:11px}
    #sf-hybrid-preview .sf-note{display:flex;gap:8px;align-items:flex-start;padding:13px 18px;color:var(--sf-muted);font-size:12px;border-top:1px solid var(--sf-line)}
    #sf-hybrid-preview .sf-note i{width:9px;height:9px;border-radius:50%;background:var(--sf-amber);box-shadow:0 0 12px #f0a638b8;margin-top:3px;flex:0 0 auto}
    @keyframes sf-breathe{50%{transform:scale(.95);opacity:.86}}
    @keyframes sf-bubble{to{transform:translateY(-4px)}}
    @media(max-width:700px){#sf-hybrid-preview .sf-head{align-items:flex-start;flex-direction:column}#sf-hybrid-preview .sf-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#sf-hybrid-preview .sf-controls{align-self:stretch}#sf-hybrid-preview .btn{flex:1}}
  </style>
  <div class="sf-head">
    <div><h2 class="sf-title">Las criaturas actuales, con tratamiento híbrido</h2><p class="sf-sub">Misma silueta, especies y ADN procedural. Cambia el material, la mirada y el núcleo.</p></div>
    <div class="sf-controls" aria-label="Comparar estilos"><button class="btn" type="button" data-mode="current" aria-pressed="false">Actual</button><button class="btn" type="button" data-mode="hybrid" aria-pressed="true">Híbrido</button></div>
  </div>
  <div class="sf-grid">${creatures.map(specimen).join('')}</div>
  <div class="sf-note"><i></i><span>La llama ya no está pintada sobre la barriga: queda detrás del gel como una ascua viva, menos literal y menos dominante.</span></div>
  <script>
    (()=>{const root=document.getElementById('sf-hybrid-preview');if(!root)return;root.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{const mode=button.dataset.mode;root.classList.toggle('sf-mode-current',mode==='current');root.classList.toggle('sf-mode-hybrid',mode==='hybrid');root.querySelectorAll('[data-mode]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));}));})();
  </script>
</div>`;

await writeFile(out, fragment, 'utf8');
console.log(out);
