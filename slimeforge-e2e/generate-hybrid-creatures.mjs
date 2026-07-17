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

const fragment = `<div id="sf-light-hybrid-preview" class="sf-mode-hybrid">
  <style>
    #sf-light-hybrid-preview{color:var(--foreground);width:100%}
    #sf-light-hybrid-preview *{box-sizing:border-box}
    #sf-light-hybrid-preview .sf-controls{justify-content:center;margin-bottom:var(--space-4)}
    #sf-light-hybrid-preview .sf-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--space-3)}
    #sf-light-hybrid-preview .sf-specimen{min-width:0}
    #sf-light-hybrid-preview .sf-creature-stage{position:relative;aspect-ratio:1/1;overflow:hidden;background:radial-gradient(ellipse at 50% 82%,color-mix(in srgb,var(--muted) 72%,transparent) 0 10%,transparent 48%),linear-gradient(color-mix(in srgb,var(--background) 74%,var(--muted)),var(--background))}
    #sf-light-hybrid-preview .sf-creature-stage:before{content:"";position:absolute;inset:auto 14% 8% 14%;height:11%;background:radial-gradient(ellipse,color-mix(in srgb,var(--foreground) 18%,transparent),transparent 68%);filter:blur(3px)}
    #sf-light-hybrid-preview .sf-creature{position:absolute;inset:2%;width:96%;height:96%;overflow:visible;filter:drop-shadow(0 7px 7px color-mix(in srgb,var(--foreground) 18%,transparent))}
    #sf-light-hybrid-preview .sf-current{display:none}
    #sf-light-hybrid-preview.sf-mode-current .sf-current{display:block}
    #sf-light-hybrid-preview.sf-mode-current .sf-hybrid{display:none}
    #sf-light-hybrid-preview .sf-hybrid .eyes{transform-box:view-box;transform-origin:100px 101px;transform:scale(1.075)}
    #sf-light-hybrid-preview .sf-hybrid .sf-inner-life{animation:sf-breathe 2.8s ease-in-out infinite;transform-origin:100px 145px}
    #sf-light-hybrid-preview .sf-hybrid .sf-inner-life circle{animation:sf-bubble 3.2s ease-in-out infinite alternate}
    #sf-light-hybrid-preview .sf-name{display:flex;align-items:baseline;justify-content:space-between;gap:var(--space-2);padding-top:var(--space-2)}
    #sf-light-hybrid-preview .sf-name strong{font-weight:500}
    #sf-light-hybrid-preview .sf-name span{color:var(--muted-foreground)}
    @keyframes sf-breathe{50%{transform:scale(.96);opacity:.88}}
    @keyframes sf-bubble{to{transform:translateY(-4px)}}
    @media(max-width:620px){#sf-light-hybrid-preview .sf-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(prefers-reduced-motion:reduce){#sf-light-hybrid-preview .sf-hybrid .sf-inner-life,#sf-light-hybrid-preview .sf-hybrid .sf-inner-life circle{animation:none}}
  </style>
  <div class="viz-controls sf-controls" aria-label="Comparar estilos"><button class="btn" type="button" data-mode="current" aria-pressed="false">Actual</button><button class="btn btn-primary" type="button" data-mode="hybrid" aria-pressed="true">Gel luminoso</button></div>
  <div class="sf-grid">${creatures.map(specimen).join('')}</div>
  <script>
    (()=>{const root=document.getElementById('sf-light-hybrid-preview');if(!root)return;root.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{const mode=button.dataset.mode;root.classList.toggle('sf-mode-current',mode==='current');root.classList.toggle('sf-mode-hybrid',mode==='hybrid');root.querySelectorAll('[data-mode]').forEach(item=>{const active=item===button;item.setAttribute('aria-pressed',String(active));item.classList.toggle('btn-primary',active);});}));})();
  </script>
</div>`;

await writeFile(out, fragment, 'utf8');
console.log(out);
