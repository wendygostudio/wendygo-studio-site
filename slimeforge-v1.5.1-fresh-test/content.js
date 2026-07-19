/* SlimeForge · content.js — GENERADO: motor inline + comportamiento. No editar a mano. */
/* SlimeForge · common/engine.js
   Motor de criaturas: ADN JSON → SVG. El canon (Ascua, ojos, blush,
   glossy, outline derivado) se aplica automáticamente — es ley, no parámetro. */

/* ── Color ───────────────────────────────────────────── */
/* The service worker can invoke this file in a tab where it is already
   registered. Scope the engine too (not only the behaviour below), and avoid
   duplicating listeners or HUD nodes on repeated invocations. */
(() => {
if (globalThis.__SLIMEFORGE_CONTENT_V140__) return;
globalThis.__SLIMEFORGE_CONTENT_V140__ = true;

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
  const mx = Math.max(r,g,b), mn = Math.min(r,g,b);
  let h = 0, s = 0, l = (mx+mn)/2;
  if (mx !== mn) {
    const d = mx-mn;
    s = l > 0.5 ? d/(2-mx-mn) : d/(mx+mn);
    switch (mx) { case r: h=(g-b)/d+(g<b?6:0); break; case g: h=(b-r)/d+2; break; case b: h=(r-g)/d+4; }
    h *= 60;
  }
  return { h, s: s*100, l: l*100 };
}
function hslToHex(h,s,l) {
  s/=100; l/=100;
  const k = n => (n + h/30) % 12;
  const a = s * Math.min(l, 1-l);
  const f = n => l - a * Math.max(-1, Math.min(k(n)-3, Math.min(9-k(n), 1)));
  const to = x => Math.round(255*x).toString(16).padStart(2,'0');
  return '#' + to(f(0)) + to(f(8)) + to(f(4));
}
function derivePalette(bodyHex, isAnimal) {
  const { h, s, l } = hexToHsl(bodyHex);
  return {
    body: bodyHex,
    outline: hslToHex(h, Math.min(s+8,100), Math.max(l*0.42, 8)),
    light:   hslToHex(h, Math.max(s-6,0), Math.min(l+16, 96)),
    belly:   hslToHex(h, Math.max(s-14,0), Math.min(l+24, 97)),
    blush:   isAnimal ? '#f0a8a0' : hslToHex(h, Math.min(s+10,100), Math.min(l+20, 92)),
    innerEar: '#f0b4ac',
    bone: '#f2e3c4',
    ember: '#e8a33d', emberDark: '#a86f1c', emberGlow: '#f7cd7e'
  };
}

/* ── Constantes del canon ────────────────────────────── */
const BODY = "M100,58 C140,58 158,90 156,122 C155,144 148,156 134,160 Q128,168 116,162 Q108,170 94,163 Q82,170 72,161 Q56,158 48,142 C42,132 42,120 44,110 C48,80 66,58 100,58 Z";
const ANIMALS = ['gato','perro','conejo','zorro','panda','pinguino','buho','axolotl'];
const TEMP_INFO = {
  jugueton:  { label: 'Juguetón',  expr: 'open'    },
  tranquilo: { label: 'Tranquilo', expr: 'relaxed' },
  grunon:    { label: 'Gruñón',    expr: 'fierce'  },
  timido:    { label: 'Tímido',    expr: 'shy'     },
  caotico:   { label: 'Caótico',   expr: 'chaos'   }
};
const NAMES = ['Mochi','Brasa','Nube','Kiro','Pixel','Goomi','Lumo','Chispa','Bimo','Tofu','Nori','Yuki','Pompa','Mora','Ondo','Fumi'];
const SP_LABEL = {
  slime:'Slime puro', gato:'Gato', perro:'Perro', conejo:'Conejo', dragon:'Dragón', fantasma:'Fantasmita',
  zorro:'Zorro', panda:'Panda', axolotl:'Axolotl', pinguino:'Pingüino', buho:'Búho',
  fenix:'Fénix', kitsune:'Kitsune', unicornio:'Unicornio', hada:'Hada', kraken:'Kraken'
};
const RARITY = {
  dragon:'raro', fantasma:'raro', hada:'raro',
  fenix:'épico', kraken:'épico',
  unicornio:'LEGENDARIO', kitsune:'LEGENDARIO'
};
const SP_FLAVOR = {
  gato: 'elegante, independiente y algo teatral',
  perro: 'leal, entusiasta y facilísimo de emocionar',
  conejo: 'dulce, saltarín y un pelín nervioso',
  dragon: 'orgulloso, dramático, presume de su humo y de sus placas',
  fantasma: 'etéreo, travieso, le gusta asustar flojito',
  slime: 'inocente, curioso, todo le parece nuevo',
  zorro: 'astuto, ágil, siempre con una salida ingeniosa',
  panda: 'relajado, glotón, rueda antes que caminar',
  axolotl: 'sonrisa eterna, zen acuático, nada le estresa',
  pinguino: 'formal por fuera, payaso por dentro, resbala con estilo',
  buho: 'sabio nocturno, observador, suelta datos curiosos',
  fenix: 'renace de sus cenizas, dramatismo épico, brasa pura',
  kitsune: 'astuta ancestral, misteriosa, colecciona colas y secretos',
  unicornio: 'noble, radiante, cree que todo merece purpurina',
  hada: 'diminuta, chispeante, esparce polvo mágico al hablar',
  kraken: 'abisal y mimoso, abraza con muchos tentáculos'
};
/* ── Bestiario: lore de cada especie, para la pantalla de colección.
   Se desbloquea la entrada la primera vez que nace/se reforja esa especie. */
const SP_LORE = {
  slime: 'La forma original de toda criatura de la Fragua. Antes de decidir en qué convertirse, todo pasa por aquí: puro, curioso, sin prejuicios sobre lo que le espera.',
  gato: 'Vive en su propio horario y te hace sentir afortunado si te presta atención. Bajo la pose independiente, se acuerda de quién le ha dado de comer.',
  perro: 'No sabe fingir que algo no le importa. Cada vuelta a casa es un acontecimiento; cada caricia, la mejor de su vida.',
  conejo: 'Su ánimo cambia con la velocidad de un salto. Se sobresalta con nada y se le pasa con menos, siempre que tenga a alguien cerca.',
  zorro: 'Presume de encontrar la salida más lista de cualquier lío, aunque a veces se meta en el lío solo por presumir después.',
  panda: 'Su filosofía de vida cabe en una frase: por qué andar pudiendo rodar. Duerme con una entrega envidiable.',
  axolotl: 'Sonríe siempre, incluso cuando no hay motivo, y eso basta para que los demás se calmen a su alrededor.',
  pinguino: 'Camina con una dignidad que dura hasta el primer resbalón. Se ríe de sí mismo antes de que lo hagan los demás.',
  buho: 'Se pasa las noches despierto acumulando datos que nadie le ha pedido, y los suelta igualmente, encantado de la vida.',
  dragon: 'Desciende de algo mucho más grande y no deja que lo olvides. El humo que le sale por la nariz es puro teatro, casi nunca fuego real.',
  fantasma: 'Murió de aburrimiento, según cuenta él mismo, y desde entonces se dedica a dar sustos flojitos a quien se deje.',
  fenix: 'Cada vez que las cosas se ponen mal, vuelve a empezar literalmente desde la ceniza. No le tiene miedo a nada que ya haya superado antes.',
  kitsune: 'Cuantas más colas le crecen, más secretos guarda. Nunca cuenta toda la historia a la primera.',
  unicornio: 'Convencido de que el mundo mejoraría con algo más de purpurina, y no se equivoca tantas veces como parece.',
  hada: 'Diminuta y con mucha prisa, dejando polvo brillante en cada sitio por el que pasa aunque nadie se lo pida.',
  kraken: 'Bajo esa fama de monstruo de las profundidades, solo quiere un abrazo con todos los tentáculos a la vez.'
};
/* Especialidad de cada especie: da forma a pequeños comportamientos propios
   en los encuentros de manada (ver pickPackType/roleplay en content.js). No
   afecta al ADN ni al canon visual, solo a cómo se comporta en compañía. */
const SP_TRAIT = {
  buho: 'dato',       // suelta datos curiosos random durante la charla
  zorro: 'ingenioso',  // se libra de sustos con una salida airosa
  axolotl: 'calmante', // rebaja la tensión en encuentros de mala química
  pinguino: 'torpe',   // resbalón cómico al huir en la persecución
  kitsune: 'misteriosa' // deja una frase a medias, como quien guarda un secreto
};
/* ── Goo-locomoción: todos son slimes, cada uno con su física ──
   dist/h = fracción del tamaño por salto · dur/pause en ms ·
   squash = elasticidad squash&stretch · drip/puddle = flujo de baba (0-1) */
const LOCO = {
  slime:     { dist: 0.50, h: 0.22, dur: 380, pause: 140, squash: 1.00, drip: 1.00, puddle: 1.00 },
  gato:      { dist: 0.62, h: 0.18, dur: 330, pause: 280, squash: 0.55, drip: 0.15, puddle: 0.20 },
  perro:     { dist: 0.55, h: 0.20, dur: 300, pause: 90,  squash: 0.70, drip: 0.20, puddle: 0.25 },
  conejo:    { dist: 0.85, h: 0.30, dur: 360, pause: 210, squash: 0.80, drip: 0.15, puddle: 0.20 },
  zorro:     { dist: 0.70, h: 0.22, dur: 320, pause: 150, squash: 0.60, drip: 0.15, puddle: 0.20 },
  panda:     { dist: 0.36, h: 0.10, dur: 430, pause: 280, squash: 0.90, drip: 0.25, puddle: 0.30 },
  pinguino:  { dist: 0.32, h: 0.12, dur: 290, pause: 110, squash: 0.65, drip: 0.20, puddle: 0.25 },
  buho:      { dist: 0.55, h: 0.26, dur: 410, pause: 250, squash: 0.40, drip: 0.10, puddle: 0.15 },
  axolotl:   { dist: 0.45, h: 0.16, dur: 400, pause: 180, squash: 0.85, drip: 0.60, puddle: 0.60 },
  dragon:    { dist: 0.60, h: 0.28, dur: 380, pause: 200, squash: 0.50, drip: 0.15, puddle: 0.20 },
  fenix:     { dist: 0.60, h: 0.30, dur: 360, pause: 180, squash: 0.45, drip: 0.20, puddle: 0.15 },
  kraken:    { dist: 0.40, h: 0.12, dur: 430, pause: 200, squash: 0.95, drip: 0.70, puddle: 0.70 },
  unicornio: { dist: 0.70, h: 0.26, dur: 340, pause: 190, squash: 0.50, drip: 0.12, puddle: 0.15 },
  kitsune:   { dist: 0.75, h: 0.24, dur: 330, pause: 170, squash: 0.55, drip: 0.12, puddle: 0.15 },
  fantasma:  { dist: 0.50, h: 0,    dur: 500, pause: 0,   squash: 0.20, drip: 0.30, puddle: 0,   float: true },
  hada:      { dist: 0.45, h: 0,    dur: 420, pause: 0,   squash: 0.25, drip: 0.20, puddle: 0,   float: true }
};

function genderedLabel(dna) {
  const g = dna.gender === 'hembra' ? 'hembra' : 'macho';
  const M = {
    gato: ['gata', 'gato'], perro: ['perra', 'perro'], conejo: ['coneja', 'conejo'],
    dragon: ['dragona', 'dragón'], fantasma: ['fantasmita', 'fantasmita'], slime: ['slime', 'slime'],
    zorro: ['zorrita', 'zorro'], panda: ['panda', 'panda'], axolotl: ['ajolote', 'ajolote'],
    pinguino: ['pingüina', 'pingüino'], buho: ['búho', 'búho'],
    fenix: ['fénix', 'fénix'], kitsune: ['kitsune', 'kitsune'], unicornio: ['unicornio', 'unicornio'],
    hada: ['hada', 'hada'], kraken: ['kraken', 'kraken']
  };
  const label = (M[dna.species] || ['criatura', 'criatura'])[g === 'hembra' ? 0 : 1];
  const art = dna.species === 'hada' ? 'un' : (g === 'hembra' ? 'una' : 'un');
  return { g, art, label, sym: g === 'hembra' ? '♀' : '♂' };
}
function tempAdj(dna) {
  const g = dna.gender === 'hembra' ? 'hembra' : 'macho';
  const M = {
    hembra: { jugueton: 'juguetona', tranquilo: 'tranquila', grunon: 'gruñona', timido: 'tímida', caotico: 'caótica' },
    macho:  { jugueton: 'juguetón',  tranquilo: 'tranquilo', grunon: 'gruñón',  timido: 'tímido',  caotico: 'caótico' }
  };
  return M[g][dna.temperament] || '';
}
const STAGES = [
  { id:'chispa',  label:'Chispa',  scale:0.20, next:100 },
  { id:'cria',    label:'Cría',    scale:0.40, next:300 },
  { id:'joven',   label:'Joven',   scale:0.62, next:600 },
  { id:'adulto',  label:'Adulto',  scale:0.85, next:1000 },
  { id:'colosal', label:'Colosal', scale:1.10, next:null }
];
/* Tamaño CONTINUO (v0.36): interpola la escala entre etapas según el
   growth actual — la criatura crece un poquito con cada punto, cientos
   de tamaños perceptibles sin nombrar etapas nuevas. */
function scaleFor(stageIdx, growth) {
  const st = STAGES[stageIdx];
  if (!st || st.next == null || growth == null) return st ? st.scale : 1;
  const prev = stageIdx > 0 ? STAGES[stageIdx - 1].next : 0;
  const f = Math.max(0, Math.min(1, (growth - prev) / (st.next - prev)));
  const nxt = STAGES[stageIdx + 1] ? STAGES[stageIdx + 1].scale : st.scale;
  return st.scale + (nxt - st.scale) * f;
}

/* ── Piezas ──────────────────────────────────────────── */
function pieceHead(sp, P, mark) {
  const earL = (mark && mark.type.includes('patches')) ? mark.color : P.body;
  const D = P.outline;
  if (sp === 'gato') return `<path d="M60,72 Q48,34 52,30 Q57,26 92,54 Q80,68 60,72 Z" fill="${earL}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M140,72 Q152,34 148,30 Q143,26 108,54 Q120,68 140,72 Z" fill="${P.body}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M138,62 Q145,42 142,38 Q128,46 118,56 Z" fill="${P.innerEar}"/>`;
  if (sp === 'perro') return `<path d="M64,64 Q42,58 38,86 Q38,108 58,106 Q70,98 72,74 Z" fill="${earL}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M136,64 Q158,58 162,86 Q162,108 142,106 Q130,98 128,74 Z" fill="${P.body}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/>`;
  if (sp === 'conejo') return `<path d="M74,64 Q60,26 70,8 Q86,20 88,58 Q82,64 74,64 Z" fill="${earL}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M78,50 Q72,28 76,16 Q84,26 84,50 Z" fill="${P.innerEar}"/><path d="M118,58 Q126,34 146,30 Q152,46 132,62 Q124,62 118,58 Z" fill="${P.body}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M126,52 Q132,40 142,37 Q144,46 132,55 Z" fill="${P.innerEar}"/>`;
  if (sp === 'dragon') return `<path d="M68,64 Q52,40 56,12 Q78,30 84,58 Z" fill="${P.bone}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M132,64 Q148,40 144,12 Q122,30 116,58 Z" fill="${P.bone}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M92,58 L100,42 L108,58 Z" fill="${P.bone}" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/>`;
  if (sp === 'zorro' || sp === 'kitsune') return `<path d="M64,70 Q50,18 58,10 Q72,20 90,58 Q78,70 64,70 Z" fill="${earL}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M67,56 Q60,30 63,24 Q72,34 80,52 Z" fill="${P.bone}"/><path d="M136,70 Q150,18 142,10 Q128,20 110,58 Q122,70 136,70 Z" fill="${P.body}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M133,56 Q140,30 137,24 Q128,34 120,52 Z" fill="${P.bone}"/>`;
  if (sp === 'panda') return `<circle cx="62" cy="54" r="15" fill="${D}"/><circle cx="138" cy="54" r="15" fill="${D}"/>`;
  if (sp === 'axolotl') {
    let g = '';
    [[64, -4], [76, 0], [88, 4]].forEach(([y, dy]) => {
      g += `<path d="M56,${y+8} Q36,${y+dy} 26,${y+dy+4}" fill="none" stroke="${D}" stroke-width="9" stroke-linecap="round"/><path d="M56,${y+8} Q36,${y+dy} 26,${y+dy+4}" fill="none" stroke="#f2a0b8" stroke-width="5.5" stroke-linecap="round"/>`;
      g += `<path d="M144,${y+8} Q164,${y+dy} 174,${y+dy+4}" fill="none" stroke="${D}" stroke-width="9" stroke-linecap="round"/><path d="M144,${y+8} Q164,${y+dy} 174,${y+dy+4}" fill="none" stroke="#f2a0b8" stroke-width="5.5" stroke-linecap="round"/>`;
    });
    return g;
  }
  if (sp === 'buho') return `<path d="M70,60 L58,36 L86,52 Z" fill="${P.body}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/><path d="M130,60 L142,36 L114,52 Z" fill="${P.body}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/>`;
  if (sp === 'fenix') return `<path d="M99,58 Q90,36 100,14 Q110,36 101,58 Z" fill="#f7cd7e" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/><path d="M84,60 Q76,44 82,28 Q92,42 90,58 Z" fill="#f2a04a" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/><path d="M116,60 Q124,44 118,28 Q108,42 110,58 Z" fill="#f2a04a" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/>`;
  if (sp === 'unicornio') {
    const mane = (mark && mark.type !== 'none') ? mark.color : P.light;
    return `<circle cx="70" cy="58" r="12" fill="${mane}" stroke="${D}" stroke-width="4.5"/><circle cx="84" cy="49" r="13" fill="${mane}" stroke="${D}" stroke-width="4.5"/><path d="M100,56 L92,50 L100,8 L108,50 Z" fill="${P.bone}" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/><path d="M95,42 L104,38 M93,32 L103,27 M96,20 L102,17" stroke="${D}" stroke-width="2.4" stroke-linecap="round"/>`;
  }
  if (sp === 'hada') return `<path d="M90,58 Q86,42 78,33" fill="none" stroke="${D}" stroke-width="3.5" stroke-linecap="round"/><circle cx="78" cy="32" r="4.5" fill="${P.emberGlow}" stroke="${D}" stroke-width="3"/><path d="M110,58 Q114,42 122,33" fill="none" stroke="${D}" stroke-width="3.5" stroke-linecap="round"/><circle cx="122" cy="32" r="4.5" fill="${P.emberGlow}" stroke="${D}" stroke-width="3"/>`;
  return '';
}

function pieceBack(sp, P) {
  const D = P.outline;
  if (sp === 'dragon') {
    const w = hexToHsl(P.body);
    const wing = hslToHex(w.h, w.s, Math.max(w.l-12, 10));
    return `<g class="wingL"><path d="M54,104 Q18,94 10,60 Q28,68 34,82 Q31,64 38,50 Q50,68 52,86 Z" fill="${wing}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/></g><g class="wingR"><path d="M146,104 Q182,94 190,60 Q172,68 166,82 Q169,64 162,50 Q150,68 148,86 Z" fill="${wing}" stroke="${D}" stroke-width="5" stroke-linejoin="round"/></g>`;
  }
  if (sp === 'hada') return `<g class="wingL"><path d="M54,96 Q10,74 8,50 Q34,58 56,84 Z" fill="#dff3f7" opacity="0.8" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/><path d="M54,106 Q16,104 12,88 Q36,90 55,100 Z" fill="#dff3f7" opacity="0.7" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/></g><g class="wingR"><path d="M146,96 Q190,74 192,50 Q166,58 144,84 Z" fill="#dff3f7" opacity="0.8" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/><path d="M146,106 Q184,104 188,88 Q164,90 145,100 Z" fill="#dff3f7" opacity="0.7" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/></g>`;
  if (sp === 'kraken') return `<g class="wag"><path d="M150,122 Q186,110 184,82 Q182,70 172,68" fill="none" stroke="${D}" stroke-width="13" stroke-linecap="round"/><path d="M150,122 Q186,110 184,82 Q182,70 172,68" fill="none" stroke="${P.body}" stroke-width="8.5" stroke-linecap="round"/><circle cx="178" cy="94" r="2.6" fill="${P.light}"/><circle cx="181" cy="82" r="2.6" fill="${P.light}"/></g><path d="M50,126 Q22,120 20,100 Q21,90 30,88" fill="none" stroke="${D}" stroke-width="12" stroke-linecap="round"/><path d="M50,126 Q22,120 20,100 Q21,90 30,88" fill="none" stroke="${P.body}" stroke-width="7.5" stroke-linecap="round"/><circle cx="24" cy="108" r="2.4" fill="${P.light}"/>`;
  return '';
}

function pieceTail(sp, P, mark, stageIdx) {
  const D = P.outline;
  const tip = (mark && mark.type !== 'none') ? mark.color : P.light;
  if (sp === 'gato') return `<path d="M152,138 Q186,128 180,96 Q177,82 165,81" fill="none" stroke="${D}" stroke-width="13" stroke-linecap="round"/><path d="M152,138 Q186,128 180,96 Q177,82 165,81" fill="none" stroke="${P.body}" stroke-width="8.5" stroke-linecap="round"/><path d="M180,98 Q177,84 165,82" fill="none" stroke="${tip}" stroke-width="8.5" stroke-linecap="round"/>`;
  if (sp === 'perro') return `<g class="wag"><path d="M150,140 Q172,128 170,106" fill="none" stroke="${D}" stroke-width="12" stroke-linecap="round"/><path d="M150,140 Q172,128 170,106" fill="none" stroke="${P.body}" stroke-width="7.5" stroke-linecap="round"/></g>`;
  if (sp === 'conejo') return `<circle cx="158" cy="142" r="11" fill="#fdfaf4" stroke="${D}" stroke-width="4.5"/>`;
  if (sp === 'dragon') return `<path d="M150,142 Q184,134 180,104" fill="none" stroke="${D}" stroke-width="13" stroke-linecap="round"/><path d="M150,142 Q184,134 180,104" fill="none" stroke="${P.body}" stroke-width="8.5" stroke-linecap="round"/><path d="M180,110 L168,94 L192,96 Z" fill="${P.bone}" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/>`;
  if (sp === 'zorro') return `<path d="M150,140 Q188,126 182,92 Q179,76 164,74" fill="none" stroke="${D}" stroke-width="16" stroke-linecap="round"/><path d="M150,140 Q188,126 182,92 Q179,76 164,74" fill="none" stroke="${P.body}" stroke-width="11" stroke-linecap="round"/><path d="M182,96 Q179,80 164,75" fill="none" stroke="${P.bone}" stroke-width="11" stroke-linecap="round"/>`;
  if (sp === 'kitsune') {
    const n = stageIdx >= 4 ? 5 : stageIdx >= 3 ? 3 : 1;
    const angles = { 1: [0], 3: [-16, 0, 16], 5: [-30, -15, 0, 15, 30] }[n];
    let g = '';
    angles.forEach(a => {
      g += `<g transform="rotate(${a} 150 140)"><path d="M150,140 Q188,126 182,92 Q179,76 164,74" fill="none" stroke="${D}" stroke-width="14" stroke-linecap="round"/><path d="M150,140 Q188,126 182,92 Q179,76 164,74" fill="none" stroke="${P.body}" stroke-width="9.5" stroke-linecap="round"/><path d="M182,96 Q179,80 164,75" fill="none" stroke="${P.bone}" stroke-width="9.5" stroke-linecap="round"/></g>`;
    });
    return g;
  }
  if (sp === 'fenix') return `<path d="M148,146 Q192,150 198,118" fill="none" stroke="${D}" stroke-width="10" stroke-linecap="round"/><path d="M148,146 Q192,150 198,118" fill="none" stroke="#f2a04a" stroke-width="6" stroke-linecap="round"/><path d="M150,150 Q188,162 198,140" fill="none" stroke="${D}" stroke-width="10" stroke-linecap="round"/><path d="M150,150 Q188,162 198,140" fill="none" stroke="#f7cd7e" stroke-width="6" stroke-linecap="round"/><path d="M146,153 Q178,172 192,164" fill="none" stroke="${D}" stroke-width="10" stroke-linecap="round"/><path d="M146,153 Q178,172 192,164" fill="none" stroke="#f2a04a" stroke-width="6" stroke-linecap="round"/>`;
  if (sp === 'unicornio') {
    const mane = (mark && mark.type !== 'none') ? mark.color : P.light;
    return `<path d="M152,142 Q186,140 188,110" fill="none" stroke="${D}" stroke-width="12" stroke-linecap="round"/><path d="M152,142 Q186,140 188,110" fill="none" stroke="${mane}" stroke-width="7.5" stroke-linecap="round"/>`;
  }
  if (sp === 'pinguino' || sp === 'buho') return `<path d="M152,148 q14,0 13,11 q-9,5 -17,-3 Z" fill="${P.body}" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/>`;
  if (sp === 'axolotl') return `<path d="M150,142 Q182,130 186,102 Q170,120 148,130 Z" fill="#f2a0b8" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/>`;
  if (sp === 'panda') return `<circle cx="156" cy="144" r="9" fill="${D}"/>`;
  return '';
}

function pieceUnderFace(sp, P) {
  if (sp === 'panda') return `<ellipse cx="82" cy="110" rx="14" ry="12" fill="#57504a" transform="rotate(-12 82 110)"/><ellipse cx="118" cy="110" rx="14" ry="12" fill="#57504a" transform="rotate(12 118 110)"/>`;
  return '';
}

function pieceMarkings(sp, P, mark, dirtLvl) {
  let out = '';
  if (sp === 'dragon') {
    out += `<rect x="72" y="124" width="56" height="12" rx="6" fill="${P.bone}"/><rect x="76" y="139" width="48" height="12" rx="6" fill="${P.bone}"/><rect x="81" y="154" width="38" height="12" rx="6" fill="${P.bone}"/>`;
  } else if (sp === 'pinguino') {
    out += `<ellipse cx="100" cy="142" rx="40" ry="34" fill="#fdfaf4"/>`;
  } else if (sp === 'buho') {
    out += `<ellipse cx="100" cy="142" rx="34" ry="30" fill="${P.belly}"/>` +
      `<path d="M86,132 q7,6 14,0 M100,132 q7,6 14,0 M90,144 q7,6 14,0 M96,156 q7,6 14,0" fill="none" stroke="${P.outline}" stroke-width="2.2" stroke-linecap="round" opacity="0.5"/>`;
  } else if (mark) {
    if (mark.type.includes('belly')) out += `<ellipse cx="100" cy="148" rx="30" ry="23" fill="${P.belly}"/>`;
    if (mark.type.includes('patches')) out += `<path d="M42,84 Q66,66 86,86 Q92,104 70,110 Q44,112 42,84 Z" fill="${mark.color}"/><path d="M126,142 Q150,132 158,152 Q160,170 134,168 Q118,160 126,142 Z" fill="${mark.color}"/>`;
  }
  out += `<circle cx="66" cy="146" r="4" fill="${P.light}" opacity="0.95"/><circle cx="138" cy="130" r="5" fill="${P.light}" opacity="0.95"/>`;
  const dirt = [[76,142,6],[122,96,5],[96,158,7]];
  for (let i = 0; i < dirtLvl; i++) {
    const [x, y, r] = dirt[i];
    out += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*0.7}" fill="#5a5248" opacity="0.55"/>`;
  }
  return out;
}

function pieceEyesAndLids(P, expr) {
  const eyes = `<circle cx="82" cy="109" r="10" fill="#33302b"/><circle cx="118" cy="109" r="10" fill="#33302b"/><circle cx="85.2" cy="106" r="3.2" fill="#fff"/><circle cx="121.2" cy="106" r="3.2" fill="#fff"/><circle cx="79" cy="112.5" r="1.6" fill="#fff" opacity="0.7"/><circle cx="115" cy="112.5" r="1.6" fill="#fff" opacity="0.7"/>`;
  // Polígonos = zona de ojo OCULTA por el párpado (van a una máscara: recortan
  // el ojo y dejan ver lo que haya detrás, sea cuerpo o mancha).
  const POLY = {
    F_L: 'M66,90 L100,90 L96,108 L66,100 Z',  F_R: 'M134,90 L100,90 L104,108 L134,100 Z',
    R_L: 'M68,90 L96,90 L96,103 L68,103 Z',   R_R: 'M104,90 L132,90 L132,103 L104,103 Z',
    S_L: 'M66,90 L100,90 L96,100 L68,107 Z',  S_R: 'M134,90 L100,90 L104,100 L132,107 Z'
  };
  const LINE = {
    F_L: `<path d="M69,100 L96,108" fill="none" stroke="${P.outline}" stroke-width="4.5" stroke-linecap="round"/>`,
    F_R: `<path d="M131,100 L104,108" fill="none" stroke="${P.outline}" stroke-width="4.5" stroke-linecap="round"/>`,
    R_L: `<path d="M70,103 L94,103" fill="none" stroke="${P.outline}" stroke-width="4" stroke-linecap="round"/>`,
    R_R: `<path d="M106,103 L130,103" fill="none" stroke="${P.outline}" stroke-width="4" stroke-linecap="round"/>`,
    S_L: `<path d="M96,100 L70,107" fill="none" stroke="${P.outline}" stroke-width="4" stroke-linecap="round"/>`,
    S_R: `<path d="M104,100 L130,107" fill="none" stroke="${P.outline}" stroke-width="4" stroke-linecap="round"/>`
  };
  if (expr === 'happy') {
    return `<g class="eyes-follow"><path d="M72,111 Q82,100 92,111" fill="none" stroke="${P.outline}" stroke-width="4.5" stroke-linecap="round"/><path d="M108,111 Q118,100 128,111" fill="none" stroke="${P.outline}" stroke-width="4.5" stroke-linecap="round"/></g>`;
  }
  if (expr === 'love') {
    const heart = cx => `<path d="M${cx},${104} c-2.6,-4.2 -9.2,-2.6 -9.2,2.3 c0,4.1 5.6,7.7 9.2,10.3 c3.6,-2.6 9.2,-6.2 9.2,-10.3 c0,-4.9 -6.6,-6.5 -9.2,-2.3 Z" fill="#e2556e" stroke="${P.outline}" stroke-width="2.4" stroke-linejoin="round"/>`;
    return `<g class="eyes-follow">${heart(82)}${heart(118)}</g>`;
  }
  if (expr === 'wow') {
    return `<g class="eyes-follow"><circle cx="82" cy="109" r="11.5" fill="#33302b"/><circle cx="118" cy="109" r="11.5" fill="#33302b"/><circle cx="84" cy="105.5" r="2.4" fill="#fff"/><circle cx="120" cy="105.5" r="2.4" fill="#fff"/></g>`;
  }
  if (expr === 'sleep') {
    return `<g class="eyes-follow"><path d="M72,107 Q82,113 92,107" fill="none" stroke="${P.outline}" stroke-width="4" stroke-linecap="round"/><path d="M108,107 Q118,113 128,107" fill="none" stroke="${P.outline}" stroke-width="4" stroke-linecap="round"/></g>`;
  }
  let keys = null;
  if (expr === 'fierce') keys = ['F_L', 'F_R'];
  else if (expr === 'relaxed') keys = ['R_L', 'R_R'];
  else if (expr === 'shy' || expr === 'sad') keys = ['S_L', 'S_R'];
  else if (expr === 'chaos') keys = ['F_L'];
  if (!keys) return `<g class="eyes"><g class="eyes-follow">${eyes}</g></g>`;
  const maskPolys = keys.map(k => `<path d="${POLY[k]}" fill="#000"/>`).join('');
  const lines = keys.map(k => LINE[k]).join('');
  return `<defs><mask id="bodyclipLids" maskUnits="userSpaceOnUse"><rect x="0" y="0" width="200" height="200" fill="#fff"/>${maskPolys}</mask></defs>` +
    `<g class="eyes"><g mask="url(#bodyclipLids)"><g class="eyes-follow">${eyes}</g></g>${lines}</g>`;
}

function pieceMouth(sp, P, expr) {
  const D = P.outline;
  if (expr === 'sad') return `<path d="M92,129 Q100,124 108,129" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/>`;
  if (expr === 'fierce') {
    let m = `<path d="M90,128 Q100,123 110,128" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/>`;
    if (sp === 'dragon') m += `<path d="M90,128 L93,121.5 L96,127.5 Z" fill="#fff" stroke="${D}" stroke-width="1.8" stroke-linejoin="round"/><path d="M110,128 L107,121.5 L104,127.5 Z" fill="#fff" stroke="${D}" stroke-width="1.8" stroke-linejoin="round"/>`;
    return m;
  }
  if (expr === 'happy') return `<path d="M92,122 Q100,135 108,122 Z" fill="${D}"/><ellipse cx="100" cy="128" rx="4" ry="3.4" fill="#f08a9b"/>`;
  if (expr === 'wow') return `<ellipse cx="100" cy="127" rx="5" ry="6.5" fill="${D}"/><ellipse cx="100" cy="125.5" rx="2.6" ry="3" fill="#f08a9b"/>`;
  if (expr === 'love') return `<path d="M93,126 Q100,132.5 107,126" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/>`;
  if (sp === 'gato') return `<path d="M94.5,124 Q97.2,127.6 100,124 Q102.8,127.6 105.5,124" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/><path d="M50,114 L36,110 M50,121 L37,124 M150,114 L164,110 M150,121 L163,124" stroke="${D}" stroke-width="2.4" stroke-linecap="round"/>`;
  if (sp === 'perro') return `<path d="M92,122 Q100,134 108,122 Z" fill="${D}"/><ellipse cx="100" cy="128" rx="4" ry="3.4" fill="#f08a9b"/>`;
  if (sp === 'conejo') return `<path d="M97,119 L103,119 L100,123 Z" fill="${P.innerEar}" stroke="${D}" stroke-width="2" stroke-linejoin="round"/><path d="M100,123 L100,127 M96,129 Q100,132 104,129" fill="none" stroke="${D}" stroke-width="2.6" stroke-linecap="round"/>`;
  if (sp === 'dragon') return `<circle cx="95" cy="120" r="1.8" fill="${D}"/><circle cx="105" cy="120" r="1.8" fill="${D}"/><path d="M91,126 Q100,131 109,126" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/><path d="M104,127 L107,133 L110,126.5 Z" fill="#fff" stroke="${D}" stroke-width="1.8" stroke-linejoin="round"/>`;
  if (sp === 'zorro' || sp === 'kitsune' || sp === 'panda') return `<path d="M96.5,118 L103.5,118 L100,124 Z" fill="${D}"/><path d="M93,128 Q100,132 107,128" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/>`;
  if (sp === 'axolotl') return `<path d="M88,124 Q100,133 112,124" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/>`;
  if (sp === 'pinguino') return `<path d="M94,118 L106,118 L100,128 Z" fill="#f2a04a" stroke="${D}" stroke-width="3" stroke-linejoin="round"/>`;
  if (sp === 'buho' || sp === 'fenix') return `<path d="M96,118 L104,118 L100,127 Z" fill="${sp === 'fenix' ? '#f2b04a' : P.bone}" stroke="${D}" stroke-width="2.6" stroke-linejoin="round"/>`;
  if (sp === 'fantasma') return `<circle cx="100" cy="126" r="3.6" fill="${D}"/>`;
  if (sp === 'hada') return `<path d="M94,125 Q100,130 106,125" fill="none" stroke="${D}" stroke-width="2.6" stroke-linecap="round"/>`;
  return `<path d="M92,125 Q100,131 108,125" fill="none" stroke="${D}" stroke-width="3" stroke-linecap="round"/>`;
}

function pieceZzz(P) {
  return `<g class="smoke1"><path d="M128,80 h9 l-9,9 h9" fill="none" stroke="${P.outline}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></g><g class="smoke2"><path d="M141,64 h7 l-7,7 h7" fill="none" stroke="${P.outline}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>`;
}

function pieceAccessory(P, acc) {
  const D = P.outline;
  if (acc === 'lazo') return `<g transform="rotate(-14 70 68)"><path d="M70,68 L56,60 Q52,68 56,76 Z" fill="#e86a8a" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/><path d="M70,68 L84,60 Q88,68 84,76 Z" fill="#e86a8a" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="70" cy="68" r="5" fill="#f291ab" stroke="${D}" stroke-width="3"/></g>`;
  if (acc === 'bufanda') return `<path d="M62,146 Q100,162 138,146 L136,158 Q100,173 64,158 Z" fill="#c94f4f" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/><path d="M124,155 L130,178 L114,176 L112,158 Z" fill="#c94f4f" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/><path d="M116,176 L128,177 M115,169 L126,170" stroke="${D}" stroke-width="2" stroke-linecap="round"/>`;
  if (acc === 'gorro') return `<path d="M78,58 Q100,36 122,58 Q100,66 78,58 Z" fill="#5a8fc9" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="100" cy="38" r="5.5" fill="#fdfaf4" stroke="${D}" stroke-width="3"/>`;
  if (acc === 'monoculo') return `<circle cx="118" cy="109" r="14" fill="none" stroke="#d4af37" stroke-width="3.4"/><path d="M130,119 Q136,132 132,142" fill="none" stroke="#d4af37" stroke-width="2.4" stroke-linecap="round"/>`;
  return '';
}

function pieceFx(sp, P) {
  if (sp === 'dragon') return `<g class="smoke1"><circle cx="94" cy="112" r="2.8" fill="#cfd8d2"/></g><g class="smoke2"><circle cx="106" cy="111" r="2.2" fill="#cfd8d2"/></g>`;
  if (sp === 'fenix') return `<g class="smoke1"><circle cx="70" cy="86" r="3" fill="${P.ember}"/></g><g class="smoke2"><circle cx="130" cy="90" r="2.4" fill="${P.emberGlow}"/></g>`;
  if (sp === 'hada') return `<g class="smoke1"><circle cx="62" cy="118" r="2.2" fill="#f7e9a0"/></g><g class="smoke2"><circle cx="138" cy="114" r="1.9" fill="#f7e9a0"/></g>`;
  if (sp === 'kraken') return `<g class="smoke1"><circle cx="66" cy="88" r="2.6" fill="#bfe6ef"/></g><g class="smoke2"><circle cx="134" cy="84" r="2.1" fill="#bfe6ef"/></g>`;
  if (sp === 'unicornio') return `<g class="smoke1"><path d="M64,96 l1.6,3.2 3.4,0.5 -2.5,2.4 0.6,3.4 -3.1,-1.6 -3.1,1.6 0.6,-3.4 -2.5,-2.4 3.4,-0.5 Z" fill="${P.emberGlow}"/></g><g class="smoke2"><path d="M136,92 l1.4,2.8 3,0.4 -2.2,2.1 0.5,3 -2.7,-1.4 -2.7,1.4 0.5,-3 -2.2,-2.1 3,-0.4 Z" fill="${P.emberGlow}"/></g>`;
  return '';
}

function pieceSick(P) {
  const D = P.outline;
  return `<g transform="rotate(-18 66 84)">
    <rect x="52" y="80" width="28" height="9" rx="4.5" fill="#f2d8b8" stroke="${D}" stroke-width="2.6"/>
    <rect x="61.5" y="70.5" width="9" height="28" rx="4.5" fill="#f2d8b8" stroke="${D}" stroke-width="2.6"/>
  </g>
  <path d="M126,120 q4,6 0,10 q-6,-2 -3,-9 Z" fill="#9ecfe8" stroke="${D}" stroke-width="2"/>
  <g class="smoke1"><circle cx="100" cy="134" r="2.2" fill="#bfe6ef" opacity="0.8"/></g>`;
}

/* ── COSMÉTICOS (v0.40): 6 slots, 20 piezas ──────────────
   10 por hitos (economía: foco, duelos, huerto, gotas, colección)
   + 10 Pro (partes de animal y auras). Se guardan en dna.cos
   (viajan con la criatura por Reserva/export). El desbloqueo lo
   resuelve logic.cosUnlocked; el motor solo pinta. */
const COS = {
  laurel:        { slot: 'cabeza', e: '🏵️', pro: false, cond: 'duels10' },
  paja:          { slot: 'cabeza', e: '👒', pro: false, cond: 'harvest1' },
  orejasconejo:  { slot: 'cabeza', e: '🐰', pro: true },
  cuernos:       { slot: 'cabeza', e: '🐲', pro: true },
  halo:          { slot: 'cabeza', e: '😇', pro: true },
  estrella:      { slot: 'cara', e: '⭐', pro: false, cond: 'species8' },
  gafaslectura:  { slot: 'cara', e: '👓', pro: false, cond: 'focus25' },
  gafassol:      { slot: 'cara', e: '😎', pro: true },
  capa:          { slot: 'cuerpo', e: '🦸', pro: false, cond: 'streak7' },
  mariposa:      { slot: 'cuerpo', e: '🦋', pro: false, cond: 'seeds3' },
  colazorro:     { slot: 'cuerpo', e: '🦊', pro: true },
  alasmurci:     { slot: 'cuerpo', e: '🦇', pro: true },
  aurarocio:     { slot: 'aura', e: '💧', pro: false, cond: 'gotas50' },
  auradorada:    { slot: 'aura', e: '✨', pro: false, cond: 'colosal' },
  auracorazones: { slot: 'aura', e: '💞', pro: true },
  ascuagemela:   { slot: 'ascua', e: '🔥', pro: false, cond: 'streak14' },
  ascuaazul:     { slot: 'ascua', e: '🔷', pro: true },
  fondopradera:  { slot: 'fondo', e: '🌿', pro: false, cond: 'harvest10' },
  fondobosque:   { slot: 'fondo', e: '🌲', pro: true },
  fondocosmos:   { slot: 'fondo', e: '🌌', pro: true },
  paletadorada:     { slot: 'paleta', e: '🎨', pro: true, hex: '#d4a537' },
  paletamedianoche: { slot: 'paleta', e: '🎨', pro: true, hex: '#5a6fa8' },
  paletasakura:     { slot: 'paleta', e: '🎨', pro: true, hex: '#f2a8c0' },
  paletacarbon:     { slot: 'paleta', e: '🎨', pro: true, hex: '#454a55' },
  paletasangria:    { slot: 'paleta', e: '🎨', pro: true, hex: '#c85070' }
};
const COS_SLOTS = ['cabeza', 'cara', 'cuerpo', 'aura', 'ascua', 'fondo', 'paleta'];

/* Ajuste de cosméticos por anatomía de especie (v0.47): [dx, dy, sx, sy]
   aplicado alrededor de un anclaje por slot. Las orejas/branquias/crestas de
   cada especie ocupan la misma zona que los cosméticos genéricos — sin esto,
   cuernos sobre orejas de gato, halos cortando orejas de conejo, etc.
   sx>1 "abre" elementos pareados (cuernos) hacia fuera; sx<0 espeja (cola). */
const COS_FIT = {
  cuernos: { gato:[0,6,1.28,1], perro:[0,2,1.26,1], conejo:[0,7,1.34,0.95], zorro:[0,7,1.36,0.95], kitsune:[0,7,1.36,0.95], panda:[0,9,1.3,1], buho:[0,6,1.3,0.98], axolotl:[0,-6,0.92,1], dragon:[0,-8,0.94,1], fenix:[0,-6,1.05,1], unicornio:[0,4,1.2,1] },
  halo:    { conejo:[0,-22,1,1], zorro:[0,-20,1,1], kitsune:[0,-20,1,1], gato:[0,-14,1,1], buho:[0,-12,1,1], fenix:[0,-14,1,1], unicornio:[0,-14,1,1], dragon:[0,-8,1,1], panda:[0,-8,1,1], perro:[0,-6,1,1], axolotl:[0,-4,1,1] },
  laurel:  { gato:[0,8,0.94,1], perro:[0,6,0.96,1], conejo:[0,10,0.92,1], zorro:[0,10,0.92,1], kitsune:[0,10,0.92,1], panda:[0,8,0.95,1], buho:[0,8,0.92,1], dragon:[0,4,0.95,1], fenix:[0,4,0.95,1], unicornio:[0,6,0.95,1], axolotl:[0,2,0.96,1] },
  paja:    { gato:[0,-8,0.95,1], conejo:[0,-10,0.92,1], zorro:[0,-10,0.92,1], kitsune:[0,-10,0.92,1], panda:[0,-6,0.96,1], buho:[0,-8,0.94,1], dragon:[0,-6,0.96,1], fenix:[0,-8,0.94,1], unicornio:[0,-6,0.96,1], axolotl:[0,-4,0.98,1], perro:[0,-2,1,1] },
  orejasconejo: { gato:[0,4,0.8,0.85], perro:[0,0,0.85,0.9], conejo:[0,-2,0.7,0.8], zorro:[0,2,0.72,0.8], kitsune:[0,2,0.72,0.8], panda:[0,4,0.85,0.9], buho:[0,4,0.8,0.85] },
  colazorro: { gato:[0,0,-1,1], perro:[0,0,-1,1], conejo:[0,0,-1,1], zorro:[0,0,-1,1], kitsune:[0,0,-1,1], dragon:[0,0,-1,1], fenix:[0,0,-1,1], unicornio:[0,0,-1,1], axolotl:[0,4,-1,1], panda:[0,6,1,1] },
  alasmurci: { axolotl:[0,10,1,0.95], panda:[0,0,1.06,1], dragon:[0,6,1,0.95], kraken:[0,-8,1,0.95] },
  mariposa:  { axolotl:[0,8,1,0.95], kraken:[0,-6,1,0.95], panda:[0,0,1.05,1] },
};
const COS_ANCHOR = { cabeza: [100, 56], cara: [100, 106], cuerpo: [100, 120] };
function cosFitT(sp, id, slot) {
  const f = COS_FIT[id] && COS_FIT[id][sp];
  if (!f) return '';
  const [dx, dy, sx, sy] = f, [ax, ay] = COS_ANCHOR[slot] || [100, 100];
  return ` transform="translate(${dx} ${dy}) translate(${ax} ${ay}) scale(${sx} ${sy}) translate(${-ax} ${-ay})"`;
}
function cosHead(P, id) {
  const D = P.outline;
  if (id === 'laurel') return `<g>
    <path d="M66,64 Q80,50 100,48 Q120,50 134,64" fill="none" stroke="#5f7d43" stroke-width="4.5" stroke-linecap="round"/>
    ${[[-1,70,60,-38],[-1,80,53,-22],[-1,91,49,-8],[1,130,60,38],[1,120,53,22],[1,109,49,8]].map(([sg,x,y,r]) =>
      `<path transform="rotate(${r} ${x} ${y})" d="M${x},${y} Q${x - 4*sg},${y - 9} ${x},${y - 15} Q${x + 4*sg},${y - 9} ${x},${y} Z" fill="#7fa05a" stroke="#4d6636" stroke-width="2.2" stroke-linejoin="round"/>`).join('')}
    <circle cx="100" cy="48" r="3.4" fill="#e8a33d" stroke="#a86f1c" stroke-width="2"/></g>`;
  if (id === 'paja') return `<g transform="rotate(-7 100 56)">
    <ellipse cx="100" cy="60" rx="42" ry="11" fill="#e8c56a" stroke="${D}" stroke-width="4"/>
    <path d="M74,58 Q74,34 100,34 Q126,34 126,58 Q113,64 100,64 Q87,64 74,58 Z" fill="#f0d488" stroke="${D}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M75,53 Q100,60 125,53 L125,58 Q100,65 75,58 Z" fill="#a86f1c"/></g>`;
  if (id === 'orejasconejo') return `<g>
    <path d="M78,66 Q64,28 74,12 Q88,10 90,58 Z" fill="${P.body}" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/>
    <path d="M79,54 Q72,32 77,20 Q84,22 85,52 Z" fill="#f6b8c8" opacity="0.85"/>
    <path d="M122,66 Q136,28 126,12 Q112,10 110,58 Z" fill="${P.body}" stroke="${D}" stroke-width="4.5" stroke-linejoin="round"/>
    <path d="M121,54 Q128,32 123,20 Q116,22 115,52 Z" fill="#f6b8c8" opacity="0.85"/></g>`;
  if (id === 'cuernos') return `<g>
    <path d="M74,66 Q60,52 62,34 Q76,42 82,60 Z" fill="#e8a33d" stroke="#a86f1c" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M126,66 Q140,52 138,34 Q124,42 118,60 Z" fill="#e8a33d" stroke="#a86f1c" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M66,46 Q70,42 74,46 M134,46 Q130,42 126,46" fill="none" stroke="#a86f1c" stroke-width="2.4" stroke-linecap="round"/></g>`;
  if (id === 'halo') return `<g class="cos-halo">
    <ellipse cx="100" cy="36" rx="26" ry="7.5" fill="none" stroke="#f7cd7e" stroke-width="5.5" opacity="0.95"/>
    <ellipse cx="100" cy="36" rx="26" ry="7.5" fill="none" stroke="#fff" stroke-width="1.8" opacity="0.7"/></g>`;
  return '';
}
function cosFace(P, id) {
  const D = P.outline;
  if (id === 'estrella') return `<path transform="translate(140 108) scale(0.95)" d="M0,-7 L2,-2.2 7,-2.2 3.2,1 4.4,6 0,3.2 -4.4,6 -3.2,1 -7,-2.2 -2,-2.2 Z" fill="#f7cd7e" stroke="#a86f1c" stroke-width="2"/>`;
  if (id === 'gafaslectura') return `<g>
    <circle cx="82" cy="108" r="16.5" fill="#fff" opacity="0.14"/><circle cx="118" cy="108" r="16.5" fill="#fff" opacity="0.14"/>
    <circle cx="82" cy="108" r="16.5" fill="none" stroke="${D}" stroke-width="3.4"/>
    <circle cx="118" cy="108" r="16.5" fill="none" stroke="${D}" stroke-width="3.4"/>
    <path d="M98.5,105 Q100,103.5 101.5,105 M65.5,105 L54,99 M134.5,105 L146,99" fill="none" stroke="${D}" stroke-width="3.4" stroke-linecap="round"/></g>`;
  if (id === 'gafassol') return `<g>
    <path d="M62,99 Q82,94 102,99 L100,116 Q82,123 64,116 Z" fill="#22252c" stroke="${D}" stroke-width="3.4" stroke-linejoin="round"/>
    <path d="M98,99 Q118,94 138,99 L136,116 Q118,123 100,116 Z" fill="#22252c" stroke="${D}" stroke-width="3.4" stroke-linejoin="round"/>
    <path d="M62,100 L52,95 M138,100 L148,95" fill="none" stroke="${D}" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M68,102 L76,111 M73,101 L81,110" stroke="#8fa3bd" stroke-width="2" stroke-linecap="round" opacity="0.7"/></g>`;
  return '';
}
function cosBodyBack(P, id) {
  const D = P.outline;
  if (id === 'capa') return `<g class="cos-cape">
    <path d="M64,86 Q52,120 48,164 Q74,156 100,164 Q126,156 152,164 Q148,120 136,86 Q100,74 64,86 Z" fill="#c85050" stroke="#8a3434" stroke-width="4" stroke-linejoin="round"/>
    <path d="M64,86 Q100,76 136,86 L133,96 Q100,86 67,96 Z" fill="#e8a33d" stroke="#a86f1c" stroke-width="3"/></g>`;
  if (id === 'mariposa') return `<g class="cos-wingflap">
    <path d="M62,96 Q22,72 18,102 Q16,124 54,122 Q28,128 34,148 Q40,162 64,140 Z" fill="#8fd0c0" stroke="#3c6e50" stroke-width="3.5" stroke-linejoin="round" opacity="0.95"/>
    <path d="M138,96 Q178,72 182,102 Q184,124 146,122 Q172,128 166,148 Q160,162 136,140 Z" fill="#8fd0c0" stroke="#3c6e50" stroke-width="3.5" stroke-linejoin="round" opacity="0.95"/>
    <circle cx="38" cy="100" r="5" fill="#e8a33d" opacity="0.85"/><circle cx="162" cy="100" r="5" fill="#e8a33d" opacity="0.85"/>
    <circle cx="46" cy="138" r="3.4" fill="#f7cd7e" opacity="0.85"/><circle cx="154" cy="138" r="3.4" fill="#f7cd7e" opacity="0.85"/></g>`;
  if (id === 'colazorro') return `<g class="wag" style="transform-origin:138px 152px">
    <path d="M138,156 Q176,148 184,116 Q188,102 178,96 Q186,124 156,136 Q136,142 132,152 Z" fill="#e8833d" stroke="#8a4a1c" stroke-width="4" stroke-linejoin="round"/>
    <path d="M178,96 Q186,110 181,120 Q172,104 170,100 Z" fill="#fff" stroke="#8a4a1c" stroke-width="3" stroke-linejoin="round"/></g>`;
  if (id === 'alasmurci') return `<g class="cos-wingflap">
    <path d="M66,92 Q30,64 14,84 Q34,88 36,100 Q16,98 12,116 Q32,114 38,124 Q24,130 28,144 Q52,138 66,116 Z" fill="#4a4258" stroke="#2e2838" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M134,92 Q170,64 186,84 Q166,88 164,100 Q184,98 188,116 Q168,114 162,124 Q176,130 172,144 Q148,138 134,116 Z" fill="#4a4258" stroke="#2e2838" stroke-width="3.5" stroke-linejoin="round"/></g>`;
  return '';
}
function cosAura(id) {
  if (id === 'aurarocio') return `<g class="cos-orbit" opacity="0.9">
    ${[0, 120, 240].map(a => { const r = 78, x = 100 + r * Math.cos(a * Math.PI / 180), y = 118 + r * 0.62 * Math.sin(a * Math.PI / 180);
      return `<path transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(0.8)" d="M0,-8 C3,-4 4.6,-1 4.6,1.6 C4.6,4.6 2.6,6.4 0,6.4 C-2.6,6.4 -4.6,4.6 -4.6,1.6 C-4.6,-1 -3,-4 0,-8 Z" fill="#6ea8e0" stroke="#3a5f8a" stroke-width="2" stroke-linejoin="round"/>`; }).join('')}</g>`;
  if (id === 'auradorada') return `<g>
    <ellipse cx="100" cy="120" rx="76" ry="66" fill="#f7cd7e" opacity="0.14"/>
    <ellipse cx="100" cy="120" rx="60" ry="52" fill="#e8a33d" opacity="0.1"/>
    <g class="fd-spark"><path d="M42,74 l1.8,4.2 4.2,1.8 -4.2,1.8 -1.8,4.2 -1.8,-4.2 -4.2,-1.8 4.2,-1.8 Z" fill="#f7cd7e"/>
    <path d="M158,88 l1.4,3.2 3.2,1.4 -3.2,1.4 -1.4,3.2 -1.4,-3.2 -3.2,-1.4 3.2,-1.4 Z" fill="#f7cd7e" opacity="0.85"/>
    <path d="M52,150 l1.2,2.8 2.8,1.2 -2.8,1.2 -1.2,2.8 -1.2,-2.8 -2.8,-1.2 2.8,-1.2 Z" fill="#fff" opacity="0.7"/></g></g>`;
  if (id === 'auracorazones') return `<g class="cos-orbit" opacity="0.9">
    ${[30, 150, 270].map(a => { const r = 78, x = 100 + r * Math.cos(a * Math.PI / 180), y = 118 + r * 0.62 * Math.sin(a * Math.PI / 180);
      return `<path transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(0.9)" d="M0,6 C-7,0 -8,-5 -4.5,-7 C-2,-8.2 0,-6.5 0,-4.5 C0,-6.5 2,-8.2 4.5,-7 C8,-5 7,0 0,6 Z" fill="#f08aa8" stroke="#b8567a" stroke-width="2" stroke-linejoin="round"/>`; }).join('')}</g>`;
  return '';
}
function cosFondo(id) {
  if (id === 'fondopradera') return `<g opacity="0.85">
    <path d="M0,152 Q50,128 100,146 Q150,162 200,140 L200,200 L0,200 Z" fill="#5f8f5a" opacity="0.55"/>
    <path d="M0,168 Q60,150 120,164 Q170,174 200,162 L200,200 L0,200 Z" fill="#4d7a48" opacity="0.6"/>
    ${[[26,158],[58,170],[152,168],[178,152]].map(([x,y]) => `<g transform="translate(${x} ${y}) scale(0.8)"><path d="M0,8 L0,-2" stroke="#3c6e50" stroke-width="2.4" stroke-linecap="round"/><circle cx="0" cy="-5" r="4" fill="#f08aa8"/><circle cx="0" cy="-5" r="1.6" fill="#f7cd7e"/></g>`).join('')}</g>`;
  if (id === 'fondobosque') return `<g opacity="0.8">
    ${[[16,148,1.3],[40,158,1],[168,152,1.2],[190,162,0.9]].map(([x,y,k]) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0,-44 L14,-16 L7,-16 L18,6 L-18,6 L-7,-16 L-14,-16 Z" fill="#2e4a38" stroke="#1e3226" stroke-width="2.5" stroke-linejoin="round"/><rect x="-3.5" y="6" width="7" height="9" fill="#4a3a28"/></g>`).join('')}
    <g class="fd-spark"><circle cx="70" cy="120" r="2.4" fill="#f7cd7e"/><circle cx="140" cy="106" r="2" fill="#f7cd7e" opacity="0.8"/><circle cx="104" cy="132" r="1.7" fill="#fff" opacity="0.7"/></g></g>`;
  if (id === 'fondocosmos') return `<g opacity="0.85">
    <circle cx="160" cy="52" r="16" fill="#8f7fc0" opacity="0.9"/><ellipse cx="160" cy="52" rx="27" ry="7" fill="none" stroke="#c8bce8" stroke-width="3" transform="rotate(-18 160 52)" opacity="0.9"/>
    <g class="fd-spark"><circle cx="30" cy="40" r="2.2" fill="#fff"/><circle cx="72" cy="24" r="1.6" fill="#fff" opacity="0.85"/><circle cx="118" cy="44" r="1.8" fill="#fff" opacity="0.9"/><circle cx="44" cy="86" r="1.4" fill="#fff" opacity="0.7"/><circle cx="184" cy="104" r="1.6" fill="#fff" opacity="0.8"/></g>
    <path d="M18,64 l8,3 -8,3 -3,8 -3,-8 -8,-3 8,-3 3,-8 Z" transform="scale(0.7) translate(14 30)" fill="#f7cd7e" opacity="0.9"/></g>`;
  return '';
}

/* ── Ensamblador ─────────────────────────────────────── */
function buildCreature(dna, stageIdx, extras) {
  const st = STAGES[stageIdx];
  const sp = (st.id === 'chispa') ? 'slime' : dna.species;
  const isAnimal = ANIMALS.includes(sp);
  const cos = (st.id !== 'chispa' && dna.cos) ? dna.cos : {};   // cosméticos (v0.40); la chispa aún no viste
  const baseColor = (cos.paleta && COS[cos.paleta] && COS[cos.paleta].hex) ? COS[cos.paleta].hex : dna.color;
  const P = derivePalette(baseColor, isAnimal);
  const mark = (dna.marking && dna.marking.type !== 'none' && sp !== 'dragon' && st.id !== 'chispa') ? dna.marking : null;
  const ghost = sp === 'fantasma';
  let expr = TEMP_INFO[dna.temperament].expr;
  if (extras.sleeping) expr = 'sleep';
  else if (extras.sick) expr = 'sad';
  else if (extras.mood < 30) expr = 'sad';
  else if (extras.mood > 85 && expr !== 'fierce') expr = 'open';
  if (extras.expr) expr = extras.expr;   // reacción temporal (caricia, susto, duelo…)
  const s = scaleFor(stageIdx, extras.growth);
  const EC = cos.ascua === 'ascuaazul' ? { glow: '#8fc3ea', main: '#5a9bd8' } : { glow: P.emberGlow, main: P.ember };
  const twin = cos.ascua === 'ascuagemela'
    ? `<g transform="translate(-17 6) scale(0.55)" opacity="0.9"><g class="flame-mid"><path d="M100,127 C105.5,134.5 108.5,141.5 108.5,148.5 C108.5,154.3 104.8,157.5 100,157.5 C95.2,157.5 91.5,154.3 91.5,148.5 C91.5,141.5 94.5,134.5 100,127 Z" fill="${P.ember}"/></g><g class="flame-inner"><path d="M100,138 C103,142 104.8,145.6 104.8,148.9 C104.8,152.2 102.8,154.2 100,154.2 C97.2,154.2 95.2,152.2 95.2,148.9 C95.2,145.6 97,142 100,138 Z" fill="${P.emberGlow}"/></g></g>`
    : '';
  const shadow = ghost ? '' : `<ellipse class="sf-shdw" style="transform-box:fill-box;transform-origin:50% 50%" cx="100" cy="176" rx="52" ry="8" fill="#000" opacity="0.28"/>`;
  const inner = `
    ${extras.inStage && cos.fondo ? cosFondo(cos.fondo) : ''}
    ${shadow}
    ${cos.aura ? cosAura(cos.aura) : ''}
    ${pieceBack(sp, P)}
    <g class="${ghost ? 'ghostfloat' : ''}" ${ghost ? 'opacity="0.92"' : ''}>
      <g class="squish" data-action="pet" style="cursor:pointer">
        ${cos.cuerpo ? `<g${cosFitT(sp, cos.cuerpo, 'cuerpo')}>${cosBodyBack(P, cos.cuerpo)}</g>` : ''}
        ${pieceTail(sp, P, mark, stageIdx)}
        ${pieceHead(sp, P, mark)}
        <path d="${BODY}" fill="${P.body}" stroke="${P.outline}" stroke-width="5" stroke-linejoin="round"/>
        <g clip-path="url(#bodyclip)">${pieceMarkings(sp, P, mark, extras.dirtLvl)}${extras.sick ? '' : `<g class="ember ${extras.focusing ? 'focusing' : ''}" style="opacity:0.5">
          <ellipse cx="100" cy="151" rx="15" ry="8.5" fill="${EC.glow}" opacity="0.45"/>
          <g class="flame-outer"><path d="M100,127 C105.5,134.5 108.5,141.5 108.5,148.5 C108.5,154.3 104.8,157.5 100,157.5 C95.2,157.5 91.5,154.3 91.5,148.5 C91.5,141.5 94.5,134.5 100,127 Z" fill="${EC.main}"/></g>
          <g class="flame-mid"><path d="M100,134.5 C103.8,139.5 106,143.8 106,148.6 C106,152.8 103.4,155.3 100,155.3 C96.6,155.3 94,152.8 94,148.6 C94,143.8 96.2,139.5 100,134.5 Z" fill="${EC.glow}"/></g>
          <g class="flame-inner"><path d="M100,142 C102.2,145 103.4,147.5 103.4,150.2 C103.4,152.7 101.9,154.1 100,154.1 C98.1,154.1 96.6,152.7 96.6,150.2 C96.6,147.5 97.8,145 100,142 Z" fill="#fff" opacity="0.75"/></g>
          ${twin}
        </g>`}</g>
        <ellipse cx="78" cy="80" rx="22" ry="10" fill="#fff" opacity="0.5" transform="rotate(-16 78 80)"/>
        ${pieceUnderFace(sp, P)}
        ${pieceEyesAndLids(P, expr).replace('class="eyes"', 'class="eyes" style="animation-duration:' + (3.8 + (dna.seed % 17) / 10).toFixed(1) + 's"')}
        ${pieceMouth(sp, P, expr)}
        <ellipse cx="64" cy="122" rx="6.5" ry="4" fill="${P.blush}" opacity="0.9"/>
        <ellipse cx="136" cy="122" rx="6.5" ry="4" fill="${P.blush}" opacity="0.9"/>
        ${pieceAccessory(P, dna.accessory)}
        ${cos.cabeza ? `<g${cosFitT(sp, cos.cabeza, 'cabeza')}>${cosHead(P, cos.cabeza)}</g>` : ''}
        ${cos.cara ? `<g${cosFitT(sp, cos.cara, 'cara')}>${cosFace(P, cos.cara)}</g>` : ''}
        ${extras.sick ? pieceSick(P) : ''}
        ${extras.sleeping ? pieceZzz(P) : ''}
        ${pieceFx(sp, P)}
      </g>
    </g>`;
  const poop = extras.poops > 0 ? `
    <g data-action="poop" style="cursor:pointer">
      <ellipse cx="34" cy="170" rx="13" ry="4" fill="#000" opacity="0.2"/>
      <path d="M34,150 q7,2 6,8 q6,1 5,7 q0,6 -11,6 q-11,0 -11,-6 q-1,-6 5,-7 q-1,-6 6,-8 Z" fill="#8a6a4a" stroke="#5e4630" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="30.5" cy="162" r="1.6" fill="#3c2d1e"/><circle cx="37.5" cy="162" r="1.6" fill="#3c2d1e"/>
      ${extras.poops > 1 ? `<path d="M60,158 q5,1.5 4.5,6 q4.5,1 4,5.5 q0,4.5 -8.5,4.5 q-8.5,0 -8.5,-4.5 q-0.5,-4.5 4,-5.5 q-0.5,-4.5 4.5,-6 Z" fill="#8a6a4a" stroke="#5e4630" stroke-width="2.5" stroke-linejoin="round"/>` : ''}
    </g>` : '';
  const desk = (extras.focusSeed && !extras.sick && !extras.sleeping) ? pieceDesk(P, extras.focusSeed) : '';
  return `<defs><clipPath id="bodyclip"><path d="${BODY}"/></clipPath></defs>
    <g transform="translate(${(100*(1-s)).toFixed(1)} ${(176*(1-s)).toFixed(1)}) scale(${s})">${inner}${desk}</g>
    ${poop}`;
}

/* ── Escritorio de foco: 3 actividades rotatorias (v0.38) ──
   Se elige por la sesión (startedAt) y se dibuja delante de la criatura,
   en su mismo <svg> (viaja y escala con ella). Canon: outline #5e4630,
   superficies oscuras, acento ámbar. */
function pieceDesk(P, seed) {
  const act = Math.floor(seed / 1000) % 3;
  if (act === 0) return `
  <g class="sf-desk">
    <ellipse cx="172" cy="176" rx="27" ry="5" fill="#000" opacity="0.22"/>
    <rect x="152" y="130" width="42" height="38" rx="4" fill="#22252c" stroke="#5e4630" stroke-width="4"/>
    <rect x="156" y="134" width="34" height="30" rx="2" fill="#12141a"/>
    <rect class="fd-l1" x="159" y="139" width="21" height="3" rx="1.5" fill="#e8a33d"/>
    <rect class="fd-l2" x="159" y="146" width="27" height="3" rx="1.5" fill="#6ea8e0"/>
    <rect class="fd-l3" x="159" y="153" width="16" height="3" rx="1.5" fill="#5ec4a0"/>
    <rect class="fd-cur" x="159" y="159" width="6" height="3" fill="#e8a33d"/>
    <path d="M148,168 L196,168 L199.5,176 L144.5,176 Z" fill="#2a2e36" stroke="#5e4630" stroke-width="4" stroke-linejoin="round"/>
    <path d="M154,171 L190,171 M156,173.5 L188,173.5" stroke="#454b57" stroke-width="1.4"/>
    <ellipse class="fd-glow" cx="173" cy="150" rx="30" ry="22" fill="#e8a33d" opacity="0.07"/>
  </g>`;
  if (act === 1) return `
  <g class="sf-desk">
    <ellipse cx="170" cy="176" rx="28" ry="5" fill="#000" opacity="0.22"/>
    <path d="M142,175 L142,158 Q156,150 170,156 L170,175 Z" fill="#efe6cf" stroke="#5e4630" stroke-width="4" stroke-linejoin="round"/>
    <path d="M198,175 L198,158 Q184,150 170,156 L170,175 Z" fill="#f8f1de" stroke="#5e4630" stroke-width="4" stroke-linejoin="round"/>
    <path d="M148,161 L164,158 M148,166 L164,163 M176,158 L192,161 M176,163 L192,166" stroke="#b9ac8e" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    <path class="fd-page" d="M170,156 Q182,149 194,156 L194,171 Q182,163 170,171 Z" fill="#fffaf0" stroke="#c8bb9b" stroke-width="1.5"/>
  </g>`;
  return `
  <g class="sf-desk">
    <ellipse cx="170" cy="176" rx="27" ry="5" fill="#000" opacity="0.22"/>
    <rect x="144" y="158" width="34" height="18" rx="3" fill="#f8f1de" stroke="#5e4630" stroke-width="4"/>
    <path d="M150,164 L170,164 M150,169 L166,169" stroke="#b9ac8e" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    <g class="fd-pen"><path d="M167,149 L175,161" stroke="#e8a33d" stroke-width="4.5" stroke-linecap="round"/><path d="M175,161 L177.5,165" stroke="#5e4630" stroke-width="4.5" stroke-linecap="round"/></g>
    <rect x="180" y="158" width="14" height="17" rx="3.5" fill="#e8a33d" stroke="#5e4630" stroke-width="4"/>
    <path d="M194,161.5 q5,1.5 4,5 q-1,3.5 -4,3.5" fill="none" stroke="#5e4630" stroke-width="3.5"/>
    <g class="smoke1"><circle cx="185" cy="152" r="2.4" fill="#cfd6e2" opacity="0.8"/></g>
    <g class="smoke2"><circle cx="190" cy="150" r="2" fill="#cfd6e2" opacity="0.7"/></g>
  </g>`;
}

function buildEgg(cracks, focusing) {
  const lines = [
    `<path d="M88,88 L96,102 L90,114" fill="none" stroke="#a86f1c" stroke-width="2.5" stroke-linecap="round"/>`,
    `<path d="M112,80 L106,96 L114,108 M96,70 L102,82" fill="none" stroke="#a86f1c" stroke-width="2.5" stroke-linecap="round"/>`
  ].slice(0, cracks).join('');
  return `
  <ellipse cx="100" cy="172" rx="34" ry="7" fill="#000" opacity="0.28"/>
  <g data-action="egg" style="cursor:pointer" id="eggG">
    <path d="M100,52 C126,52 138,86 138,120 C138,152 122,168 100,168 C78,168 62,152 62,120 C62,86 74,52 100,52 Z" fill="#f2e3c4" stroke="#a86f1c" stroke-width="5"/>
    <ellipse cx="86" cy="84" rx="12" ry="6" fill="#fff" opacity="0.55" transform="rotate(-18 86 84)"/>
    <circle cx="116" cy="128" r="7" fill="#e8a33d" opacity="0.75"/>
    <circle cx="84" cy="140" r="5" fill="#e8a33d" opacity="0.75"/>
    <circle cx="104" cy="100" r="4" fill="#e8a33d" opacity="0.6"/>
    ${lines}
    <g class="${focusing ? 'focusing' : ''}" transform="translate(100,118) scale(0.7)">
    <g class="ember ${focusing ? 'focusing' : ''}">
          <g class="flame-outer"><path d="M0,-16 C5.5,-8.5 8.5,-1.5 8.5,5.5 C8.5,11.3 4.8,14.5 0,14.5 C-4.8,14.5 -8.5,11.3 -8.5,5.5 C-8.5,-1.5 -5.5,-8.5 0,-16 Z" fill="#a86f1c" stroke="#5e4630" stroke-width="2.8" stroke-linejoin="round"/></g>
          <g class="flame-mid"><path d="M0,-8.5 C3.8,-3.5 6,0.8 6,5.6 C6,9.8 3.4,12.3 0,12.3 C-3.4,12.3 -6,9.8 -6,5.6 C-6,0.8 -3.8,-3.5 0,-8.5 Z" fill="#e8a33d"/></g>
          <g class="flame-inner"><path d="M0,-1 C2.2,2 3.4,4.5 3.4,7.2 C3.4,9.7 1.9,11.1 0,11.1 C-1.9,11.1 -3.4,9.7 -3.4,7.2 C-3.4,4.5 -2.2,2 0,-1 Z" fill="#f7cd7e"/></g>
        </g>
    </g>
  </g>`;
}

/* ── HUERTO (fase 2, v0.38) ──────────────────────────────
   Catálogo de semillas y render de parcelas. Moneda: gotas 💧.
   Cada planta tiene 3 etapas visuales; cada etapa necesita UN riego
   para avanzar (sin riego se PAUSA, nunca muere — GDD). */
const SEEDS = {
  baya:      { emoji: '🫐', cost: 6,  hours: 4,  kind: 'food', yieldN: 2 },
  zanahoria: { emoji: '🥕', cost: 10, hours: 9,  kind: 'food', yieldN: 1 },
  flor:      { emoji: '🌸', cost: 14, hours: 14, kind: 'mat',  yieldN: 3 }
};
function seedStageMs(seed) { return (SEEDS[seed] ? SEEDS[seed].hours : 6) * 3600e3 / 3; }

function buildPlot(plot) {
  const soil = `<ellipse cx="35" cy="61" rx="27" ry="7.5" fill="#4a3a28" stroke="#5e4630" stroke-width="3"/>
    <ellipse cx="35" cy="58.5" rx="22.5" ry="5.5" fill="#6a5138"/>`;
  if (!plot) return soil + `<g opacity="0.5">
    <circle cx="35" cy="33" r="12" fill="none" stroke="#8b93a3" stroke-width="2.5" stroke-dasharray="4.2 4.2"/>
    <path d="M35,27 L35,39 M29,33 L41,33" stroke="#8b93a3" stroke-width="2.5" stroke-linecap="round"/></g>`;
  const st = plot.done ? 3 : plot.st;   // 0 brote · 1 media · 2 crecida · 3 lista
  let plant = '';
  const sprout = `<path d="M35,58 L35,46" stroke="#4f8f5f" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M35,49 Q28,46 27,40 Q34,41 35,47 Z" fill="#5ec4a0" stroke="#3c6e50" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M35,51 Q42,48 43,42 Q36,43 35,49 Z" fill="#5ec4a0" stroke="#3c6e50" stroke-width="2.5" stroke-linejoin="round"/>`;
  if (st === 0) plant = sprout;
  else if (plot.seed === 'baya') {
    const bush = st >= 2
      ? `<path d="M35,58 C18,58 14,44 21,37 C19,27 30,22 35,26 C40,20 52,25 50,35 C58,42 52,58 35,58 Z" fill="#4f8f5f" stroke="#3c6e50" stroke-width="3" stroke-linejoin="round"/>`
      : `<path d="M35,58 C24,58 21,49 25,44 C24,37 32,34 35,37 C39,33 46,36 45,42 C50,47 46,58 35,58 Z" fill="#4f8f5f" stroke="#3c6e50" stroke-width="3" stroke-linejoin="round"/>`;
    const berries = st === 3
      ? `<circle cx="27" cy="42" r="4.4" fill="#6ea8e0" stroke="#3a5f8a" stroke-width="2"/><circle cx="40" cy="36" r="4.4" fill="#6ea8e0" stroke="#3a5f8a" stroke-width="2"/><circle cx="43" cy="47" r="4.4" fill="#6ea8e0" stroke="#3a5f8a" stroke-width="2"/><circle cx="25.6" cy="40.6" r="1.3" fill="#fff" opacity="0.8"/><circle cx="38.6" cy="34.6" r="1.3" fill="#fff" opacity="0.8"/>`
      : (st === 2 ? `<circle cx="28" cy="43" r="2.6" fill="#7f9f6a"/><circle cx="41" cy="39" r="2.6" fill="#7f9f6a"/>` : '');
    plant = bush + berries;
  } else if (plot.seed === 'zanahoria') {
    const leaves = `<path d="M35,${st >= 2 ? 46 : 50} C30,38 24,36 20,37 C24,42 29,45 33,46 M35,${st >= 2 ? 46 : 50} C35,36 33,30 29,27 C34,31 37,38 36,46 M35,${st >= 2 ? 46 : 50} C40,38 46,36 50,37 C46,42 41,45 37,46" fill="none" stroke="#4f8f5f" stroke-width="3.2" stroke-linecap="round"/>`;
    const top = st === 3
      ? `<path d="M27,50 Q27,44 35,44 Q43,44 43,50 L40,60 Q35,63 30,60 Z" fill="#e8833d" stroke="#8a4a1c" stroke-width="2.6" stroke-linejoin="round"/><path d="M30,50 L40,50 M31,54 L39,54" stroke="#8a4a1c" stroke-width="1.6" stroke-linecap="round"/>`
      : (st === 2 ? `<path d="M30,52 Q30,48 35,48 Q40,48 40,52 L38,57 Q35,59 32,57 Z" fill="#e8833d" stroke="#8a4a1c" stroke-width="2.4" stroke-linejoin="round"/>` : '');
    plant = leaves + top;
  } else {
    const stem = `<path d="M35,58 L35,${st >= 2 ? 34 : 40}" stroke="#4f8f5f" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M35,50 Q28,47 27,41 Q34,42 35,48 Z" fill="#5ec4a0" stroke="#3c6e50" stroke-width="2.5" stroke-linejoin="round"/>`;
    const bloom = st === 3
      ? `<g><ellipse cx="35" cy="27" rx="12" ry="10" fill="#e8a33d" opacity="0.25"/>
         <path d="M35,14 C39,19 41,24 41,28 C41,32 38.4,34.5 35,34.5 C31.6,34.5 29,32 29,28 C29,24 31,19 35,14 Z" fill="#e8a33d" stroke="#a86f1c" stroke-width="2.6" stroke-linejoin="round"/>
         <path d="M27,22 C30,25 31.5,28 31,31 M43,22 C40,25 38.5,28 39,31" fill="none" stroke="#e8a33d" stroke-width="4" stroke-linecap="round" opacity="0.85"/>
         <path d="M35,22 C36.6,24.5 37.4,26.8 37.4,28.8 C37.4,30.8 36.3,31.9 35,31.9 C33.7,31.9 32.6,30.8 32.6,28.8 C32.6,26.8 33.4,24.5 35,22 Z" fill="#fff" opacity="0.75"/></g>`
      : (st === 2 ? `<path d="M35,26 C38,29.5 39.5,32.6 39.5,35 C39.5,37.8 37.6,39.4 35,39.4 C32.4,39.4 30.5,37.8 30.5,35 C30.5,32.6 32,29.5 35,26 Z" fill="#e8a33d" stroke="#a86f1c" stroke-width="2.6" stroke-linejoin="round"/>` : '');
    plant = stem + bloom;
  }
  const drop = (!plot.w && !plot.done)
    ? `<g class="fd-drop"><path d="M56,8 C59,12 60.5,15 60.5,17.5 C60.5,20.4 58.5,22 56,22 C53.5,22 51.5,20.4 51.5,17.5 C51.5,15 53,12 56,8 Z" fill="#6ea8e0" stroke="#3a5f8a" stroke-width="2.4" stroke-linejoin="round"/><circle cx="54.6" cy="16.6" r="1.2" fill="#fff" opacity="0.8"/></g>` : '';
  const spark = plot.done
    ? `<g class="fd-spark"><path d="M14,16 l1.6,3.8 3.8,1.6 -3.8,1.6 -1.6,3.8 -1.6,-3.8 -3.8,-1.6 3.8,-1.6 Z" fill="#f7cd7e"/><path d="M57,34 l1.2,2.8 2.8,1.2 -2.8,1.2 -1.2,2.8 -1.2,-2.8 -2.8,-1.2 2.8,-1.2 Z" fill="#f7cd7e" opacity="0.85"/></g>` : '';
  return soil + plant + drop + spark;
}

/* ── Generador de ADN (huevo) ────────────────────────── */
const rnd = a => a[Math.floor(Math.random()*a.length)];

/* ── Banco de frases por temperamento (fallback sin Gemini Nano) ── */
const PHRASES = {
  jugueton: [
    '¡Otra vez, otra vez! 🎾', '¿Eso se come? ¿Y eso? ¿Y ESO?',
    'Te apuesto tres Brasas a que no me pillas.', '¡He visto un punto rojo! …ah no. ¿O sí?',
    'Hoy me siento con energía para 40 ovillos.'
  ],
  tranquilo: [
    'Buen día para no hacer absolutamente nada.', 'Respira. Yo ya lo hago por los dos.',
    'Este rincón de la pantalla tiene buena luz.', 'Todo llega. Sobre todo la comida, espero.',
    'Mmm. Cinco minutos más.'
  ],
  grunon: [
    'No estaba dormido. Estaba pensando con los ojos cerrados.', 'Hmpf. Llegas tarde a mimarme.',
    'Ese scroll tuyo me marea. Modérate.', 'Sí, sí, muy bonito todo. ¿Y mi comida?',
    'No sonrío. Es un tic.'
  ],
  timido: [
    '¿…me has mirado? P-perdón.', 'Hoy casi saludo al cursor. Casi.',
    'Si me escondo detrás de la gota, no me ves, ¿verdad?', 'Me gusta cuando estás. No se lo digas a nadie.',
    'Eep. Nada, nada. Sigue a lo tuyo.'
  ],
  caotico: [
    '¿Y si el popó fuera moneda? Piénsalo.', '¡ZOOM! Perdón. Necesitaba correr.',
    'He mordido la barra de scroll. No me arrepiento.', 'Plan del día: caos. Plan B: más caos.',
    'La gravedad es una sugerencia.'
  ]
};

const PHRASES_EN = {
  jugueton: [
    'Again, again! 🎾', 'Can I eat that? What about THAT?',
    'I bet you 3 Embers you can\'t catch me.', 'I saw a red dot! …oh wait. Or did I?',
    'I have enough energy for 40 yarn balls today.'
  ],
  tranquilo: [
    'Good day for doing absolutely nothing.', 'Breathe. I already do it for both of us.',
    'This corner of the screen has nice light.', 'Everything comes. Especially food, I hope.',
    'Mmm. Five more minutes.'
  ],
  grunon: [
    'I wasn\'t sleeping. I was thinking with my eyes closed.', 'Hmpf. You\'re late to pamper me.',
    'Your scrolling makes me dizzy. Tone it down.', 'Yes, very nice. Where\'s my food?',
    'I\'m not smiling. It\'s a twitch.'
  ],
  timido: [
    '…did you look at me? S-sorry.', 'Today I almost waved at the cursor. Almost.',
    'If I hide behind the droplet, you can\'t see me, right?', 'I like when you\'re here. Don\'t tell anyone.',
    'Eep. Nothing, nothing. Carry on.'
  ],
  caotico: [
    'What if poop was currency? Think about it.', 'ZOOM! Sorry. Needed to run.',
    'I bit the scrollbar. No regrets.', 'Today\'s plan: chaos. Plan B: more chaos.',
    'Gravity is a suggestion.'
  ]
};

const PHRASES_DE = {
  jugueton: [
    'Nochmal, nochmal! 🎾', 'Kann man das essen? Und DAS?',
    'Ich wette 3 Glutfunken, dass du mich nicht fängst.', 'Ich hab einen roten Punkt gesehen! …oder doch nicht?',
    'Heute hab ich Energie für 40 Wollknäuel.'
  ],
  tranquilo: [
    'Guter Tag, um absolut nichts zu tun.', 'Atme. Ich mache das schon für uns beide.',
    'Diese Bildschirmecke hat schönes Licht.', 'Alles kommt. Vor allem das Essen, hoffe ich.',
    'Mmm. Noch fünf Minuten.'
  ],
  grunon: [
    'Ich habe nicht geschlafen. Ich habe mit geschlossenen Augen nachgedacht.', 'Hmpf. Du bist spät dran mit dem Verwöhnen.',
    'Dein Scrollen macht mich schwindelig. Mäßige dich.', 'Ja, ja, alles sehr schön. Und mein Essen?',
    'Ich lächle nicht. Das ist ein Tick.'
  ],
  timido: [
    '…hast du mich angeschaut? T-tschuldigung.', 'Heute hätte ich fast dem Cursor gewinkt. Fast.',
    'Wenn ich mich hinter dem Tropfen verstecke, siehst du mich nicht, oder?', 'Ich mag es, wenn du da bist. Sag es niemandem.',
    'Iiep. Nichts, nichts. Mach weiter.'
  ],
  caotico: [
    'Was, wenn Kacka Währung wäre? Denk drüber nach.', 'ZOOM! Sorry. Musste rennen.',
    'Ich habe in die Scrollleiste gebissen. Keine Reue.', 'Plan des Tages: Chaos. Plan B: mehr Chaos.',
    'Schwerkraft ist nur ein Vorschlag.'
  ]
};
const PHRASES_FR = {
  jugueton: [
    'Encore, encore ! 🎾', 'Ça se mange ? Et ça ? Et ÇA ?',
    'Je te parie 3 Braises que tu ne m\'attrapes pas.', 'J\'ai vu un point rouge ! …ah non. Ou si ?',
    'Aujourd\'hui j\'ai de l\'énergie pour 40 pelotes.'
  ],
  tranquilo: [
    'Belle journée pour ne rien faire du tout.', 'Respire. Je le fais déjà pour nous deux.',
    'Ce coin de l\'écran a une belle lumière.', 'Tout arrive. Surtout la nourriture, j\'espère.',
    'Mmm. Cinq minutes de plus.'
  ],
  grunon: [
    'Je ne dormais pas. Je réfléchissais les yeux fermés.', 'Hmpf. Tu es en retard pour me câliner.',
    'Ton scroll me donne le tournis. Modère-toi.', 'Oui, oui, très joli tout ça. Et ma nourriture ?',
    'Je ne souris pas. C\'est un tic.'
  ],
  timido: [
    '…tu m\'as regardé ? P-pardon.', 'Aujourd\'hui j\'ai presque salué le curseur. Presque.',
    'Si je me cache derrière la goutte, tu ne me vois pas, hein ?', 'J\'aime quand tu es là. Ne le dis à personne.',
    'Iip. Rien, rien. Continue.'
  ],
  caotico: [
    'Et si le caca était une monnaie ? Penses-y.', 'ZOOM ! Pardon. Besoin de courir.',
    'J\'ai mordu la barre de défilement. Aucun regret.', 'Plan du jour : chaos. Plan B : plus de chaos.',
    'La gravité n\'est qu\'une suggestion.'
  ]
};
const PHRASES_IT = {
  jugueton: [
    'Ancora, ancora! 🎾', 'Si mangia? E quello? E QUELLO?',
    'Scommetto 3 Braci che non mi prendi.', 'Ho visto un puntino rosso! …ah no. O sì?',
    'Oggi ho energia per 40 gomitoli.'
  ],
  tranquilo: [
    'Bella giornata per non fare assolutamente niente.', 'Respira. Lo faccio già io per tutti e due.',
    'Questo angolo dello schermo ha una bella luce.', 'Tutto arriva. Soprattutto il cibo, spero.',
    'Mmm. Altri cinque minuti.'
  ],
  grunon: [
    'Non dormivo. Pensavo con gli occhi chiusi.', 'Hmpf. Sei in ritardo per coccolarmi.',
    'Il tuo scroll mi fa girare la testa. Datti una calmata.', 'Sì, sì, tutto molto bello. E il mio cibo?',
    'Non sto sorridendo. È un tic.'
  ],
  timido: [
    '…mi hai guardato? S-scusa.', 'Oggi ho quasi salutato il cursore. Quasi.',
    'Se mi nascondo dietro la goccia non mi vedi, vero?', 'Mi piace quando ci sei. Non dirlo a nessuno.',
    'Iip. Niente, niente. Continua pure.'
  ],
  caotico: [
    'E se la cacca fosse moneta? Pensaci.', 'ZOOM! Scusa. Dovevo correre.',
    'Ho morso la barra di scorrimento. Nessun rimpianto.', 'Piano del giorno: caos. Piano B: più caos.',
    'La gravità è solo un suggerimento.'
  ]
};
const PHRASES_PT = {
  jugueton: [
    'Outra vez, outra vez! 🎾', 'Isso come-se? E isso? E ISSO?',
    'Aposto 3 Brasas que não me apanhas.', 'Vi um ponto vermelho! …ah não. Ou vi?',
    'Hoje tenho energia para 40 novelos.'
  ],
  tranquilo: [
    'Bom dia para não fazer absolutamente nada.', 'Respira. Eu já o faço pelos dois.',
    'Este canto do ecrã tem boa luz.', 'Tudo chega. Sobretudo a comida, espero.',
    'Mmm. Mais cinco minutos.'
  ],
  grunon: [
    'Não estava a dormir. Estava a pensar de olhos fechados.', 'Hmpf. Chegas tarde para me mimar.',
    'Esse teu scroll deixa-me tonto. Modera-te.', 'Sim, sim, muito bonito. E a minha comida?',
    'Não estou a sorrir. É um tique.'
  ],
  timido: [
    '…olhaste para mim? D-desculpa.', 'Hoje quase acenei ao cursor. Quase.',
    'Se me esconder atrás da gota, não me vês, pois não?', 'Gosto quando estás aqui. Não digas a ninguém.',
    'Iip. Nada, nada. Continua.'
  ],
  caotico: [
    'E se o cocó fosse moeda? Pensa nisso.', 'ZOOM! Desculpa. Precisava de correr.',
    'Mordi a barra de scroll. Sem arrependimentos.', 'Plano do dia: caos. Plano B: mais caos.',
    'A gravidade é uma sugestão.'
  ]
};
const PHRASES_ALL = { es: PHRASES, en: PHRASES_EN, de: PHRASES_DE, fr: PHRASES_FR, it: PHRASES_IT, pt: PHRASES_PT };
/* ── Ampliación v0.18: +6 frases por temperamento e idioma (retención). ── */
const PHRASES_X = {
es: {
  jugueton: ['¿Jugamos? Di que sí. Di que sí. ¡Di que sí!','He inventado un juego: se llama TODO VALE.','Tres vueltas a la pantalla y vuelvo. Cronometra.','La pestaña de al lado parece divertida. ¿Vamos?','Si me lanzas algo, lo persigo. Es ley.','¡Hoy he saltado más alto que ayer! Casi seguro.'],
  tranquilo: ['He visto pasar tres nubes. Día completo.','No es pereza, es eficiencia energética.','Tu scroll me arrulla. Sigue, sigue.','Hoy toca contemplar. Mañana, ya veremos.','Qué bien se está donde ya estás.','Shhh. La página está descansando.'],
  grunon: ['No me mires así. Así tampoco.','Tenía el día planeado y has llegado tú.','La letra de esta web me ofende personalmente.','Bah. En mis tiempos los píxeles eran más grandes.','Estoy bien. Deja de preguntar. …¿por qué no preguntas?','Esto no es ceño fruncido, es concentración.'],
  timido: ['H-hola. Ya está. Ya lo he dicho.','Estaba practicando un saludo. No has visto nada.','Si te acercas despacito, no me escondo. Creo.','Me sé un chiste pero me da cosa.','Hoy he mirado al cursor a los ojos. Un segundo entero.','Gracias por no hacer ruido al hacer clic.'],
  caotico: ['He escondido algo en esta página. Ni yo sé qué.','Las esquinas de la pantalla saben cosas.','¿Y si hoy caminamos hacia el OTRO lado? Revolucionario.','He probado a morder un píxel. Sabe a lunes.','Plan: ninguno. Ejecución: impecable.','Dicen que no se puede lamer el scroll. DICEN.']
},
en: {
  jugueton: ['Play with me? Say yes. Say yes. SAY YES!','I invented a game: it\'s called ANYTHING GOES.','Three laps around the screen, be right back. Time me.','The next tab looks fun. Shall we?','Throw something and I WILL chase it. It\'s the law.','I jumped higher than yesterday! Pretty sure.'],
  tranquilo: ['Watched three clouds go by. Full day.','It\'s not laziness, it\'s energy efficiency.','Your scrolling lulls me. Keep going.','Today we contemplate. Tomorrow, we\'ll see.','It\'s so nice right where you already are.','Shhh. The page is resting.'],
  grunon: ['Don\'t look at me like that. Not like that either.','I had my day planned and then you showed up.','This website\'s font offends me personally.','Bah. Pixels were bigger in my day.','I\'m fine. Stop asking. …why aren\'t you asking?','This isn\'t a frown, it\'s concentration.'],
  timido: ['H-hi. There. I said it.','I was practicing a greeting. You saw nothing.','If you come closer slowly, I won\'t hide. I think.','I know a joke but I\'m too shy.','Today I looked the cursor in the eye. A whole second.','Thanks for clicking quietly.'],
  caotico: ['I hid something on this page. Even I don\'t know what.','The corners of the screen know things.','What if we walk the OTHER way today? Revolutionary.','I tried biting a pixel. Tastes like Monday.','Plan: none. Execution: flawless.','They say you can\'t lick the scrollbar. THEY SAY.']
},
de: {
  jugueton: ['Spielen wir? Sag ja. Sag ja. SAG JA!','Ich habe ein Spiel erfunden: ALLES ERLAUBT.','Drei Runden um den Bildschirm, bin gleich zurück. Stopp die Zeit.','Der Tab nebenan sieht lustig aus. Gehen wir?','Wirf etwas, ich jage es. Das ist Gesetz.','Heute bin ich höher gesprungen als gestern! Ziemlich sicher.'],
  tranquilo: ['Drei Wolken vorbeiziehen sehen. Voller Tag.','Das ist keine Faulheit, das ist Energieeffizienz.','Dein Scrollen wiegt mich in den Schlaf. Weiter so.','Heute wird betrachtet. Morgen sehen wir weiter.','Wie schön es da ist, wo du schon bist.','Psst. Die Seite ruht sich aus.'],
  grunon: ['Schau mich nicht so an. So auch nicht.','Mein Tag war geplant, und dann kamst du.','Die Schrift dieser Seite beleidigt mich persönlich.','Pah. Zu meiner Zeit waren die Pixel größer.','Mir geht\'s gut. Hör auf zu fragen. …warum fragst du nicht?','Das ist kein Stirnrunzeln, das ist Konzentration.'],
  timido: ['H-hallo. So. Jetzt ist es raus.','Ich habe einen Gruß geübt. Du hast nichts gesehen.','Wenn du langsam näher kommst, verstecke ich mich nicht. Glaube ich.','Ich kenne einen Witz, aber ich trau mich nicht.','Heute habe ich dem Cursor in die Augen gesehen. Eine ganze Sekunde.','Danke, dass du leise klickst.'],
  caotico: ['Ich habe etwas auf dieser Seite versteckt. Selbst ich weiß nicht was.','Die Bildschirmecken wissen Dinge.','Was, wenn wir heute in die ANDERE Richtung gehen? Revolutionär.','Ich habe in ein Pixel gebissen. Schmeckt nach Montag.','Plan: keiner. Ausführung: makellos.','Man sagt, man kann die Scrollleiste nicht ablecken. MAN SAGT.']
},
fr: {
  jugueton: ['On joue ? Dis oui. Dis oui. DIS OUI !','J\'ai inventé un jeu : ça s\'appelle TOUT EST PERMIS.','Trois tours d\'écran et je reviens. Chronomètre.','L\'onglet d\'à côté a l\'air amusant. On y va ?','Lance un truc et je le poursuis. C\'est la loi.','J\'ai sauté plus haut qu\'hier ! Presque sûr.'],
  tranquilo: ['J\'ai vu passer trois nuages. Journée bien remplie.','Ce n\'est pas de la paresse, c\'est de l\'efficacité énergétique.','Ton défilement me berce. Continue.','Aujourd\'hui on contemple. Demain, on verra.','Qu\'on est bien là où tu es déjà.','Chut. La page se repose.'],
  grunon: ['Ne me regarde pas comme ça. Comme ça non plus.','J\'avais ma journée planifiée et tu es arrivé.','La police de ce site m\'offense personnellement.','Bah. De mon temps, les pixels étaient plus grands.','Je vais bien. Arrête de demander. …pourquoi tu ne demandes pas ?','Ce n\'est pas un froncement, c\'est de la concentration.'],
  timido: ['B-bonjour. Voilà. C\'est dit.','Je m\'entraînais à saluer. Tu n\'as rien vu.','Si tu approches doucement, je ne me cache pas. Je crois.','Je connais une blague mais ça me gêne.','Aujourd\'hui j\'ai regardé le curseur dans les yeux. Une seconde entière.','Merci de cliquer sans faire de bruit.'],
  caotico: ['J\'ai caché quelque chose sur cette page. Même moi je ne sais pas quoi.','Les coins de l\'écran savent des choses.','Et si on marchait dans l\'AUTRE sens aujourd\'hui ? Révolutionnaire.','J\'ai mordu un pixel. Goût de lundi.','Plan : aucun. Exécution : impeccable.','On dit qu\'on ne peut pas lécher la barre de défilement. ON DIT.']
},
it: {
  jugueton: ['Giochiamo? Di\' di sì. Di\' di sì. DI\' DI SÌ!','Ho inventato un gioco: si chiama TUTTO VALE.','Tre giri dello schermo e torno. Cronometra.','La scheda accanto sembra divertente. Andiamo?','Lancia qualcosa e la inseguo. È la legge.','Oggi ho saltato più in alto di ieri! Quasi sicuro.'],
  tranquilo: ['Ho visto passare tre nuvole. Giornata piena.','Non è pigrizia, è efficienza energetica.','Il tuo scroll mi culla. Continua.','Oggi si contempla. Domani, si vedrà.','Come si sta bene dove sei già.','Shhh. La pagina sta riposando.'],
  grunon: ['Non guardarmi così. Nemmeno così.','Avevo la giornata pianificata e sei arrivato tu.','Il carattere di questo sito mi offende personalmente.','Bah. Ai miei tempi i pixel erano più grandi.','Sto bene. Smettila di chiedere. …perché non chiedi?','Non è broncio, è concentrazione.'],
  timido: ['C-ciao. Ecco. L\'ho detto.','Stavo provando un saluto. Non hai visto niente.','Se ti avvicini piano, non mi nascondo. Credo.','So una barzelletta ma mi vergogno.','Oggi ho guardato il cursore negli occhi. Un secondo intero.','Grazie per cliccare piano.'],
  caotico: ['Ho nascosto qualcosa in questa pagina. Nemmeno io so cosa.','Gli angoli dello schermo sanno cose.','E se oggi camminassimo dall\'ALTRA parte? Rivoluzionario.','Ho provato a mordere un pixel. Sa di lunedì.','Piano: nessuno. Esecuzione: impeccabile.','Dicono che non si può leccare la barra di scorrimento. DICONO.']
},
pt: {
  jugueton: ['Brincamos? Diz que sim. Diz que sim. DIZ QUE SIM!','Inventei um jogo: chama-se VALE TUDO.','Três voltas ao ecrã e já volto. Cronometra.','O separador ao lado parece divertido. Vamos?','Atira algo e eu persigo-o. É a lei.','Hoje saltei mais alto do que ontem! Quase de certeza.'],
  tranquilo: ['Vi passar três nuvens. Dia completo.','Não é preguiça, é eficiência energética.','O teu scroll embala-me. Continua.','Hoje toca contemplar. Amanhã, logo se vê.','Que bem que se está onde já estás.','Shhh. A página está a descansar.'],
  grunon: ['Não olhes assim para mim. Assim também não.','Tinha o dia planeado e chegaste tu.','A letra deste site ofende-me pessoalmente.','Bah. No meu tempo os píxeis eram maiores.','Estou bem. Para de perguntar. …porque não perguntas?','Isto não é carranca, é concentração.'],
  timido: ['O-olá. Pronto. Já disse.','Estava a treinar um cumprimento. Não viste nada.','Se te aproximares devagarinho, não me escondo. Acho.','Sei uma piada mas tenho vergonha.','Hoje olhei o cursor nos olhos. Um segundo inteiro.','Obrigado por clicares baixinho.'],
  caotico: ['Escondi algo nesta página. Nem eu sei o quê.','Os cantos do ecrã sabem coisas.','E se hoje andássemos para o OUTRO lado? Revolucionário.','Experimentei morder um píxel. Sabe a segunda-feira.','Plano: nenhum. Execução: impecável.','Dizem que não se pode lamber a barra de scroll. DIZEM.']
}
};
function phraseBank(lang) {
  const base = PHRASES_ALL[lang] || PHRASES;
  const ext = PHRASES_X[lang] || PHRASES_X.es;
  const out = {};
  for (const t in base) out[t] = base[t].concat(ext[t] || []);
  return out;
}

/* ── Voz por especie (v0.18): 2 líneas propias × 16 especies, mezcladas
   en los bancos (30%) para que un búho no suene igual que un kraken. ── */
const SP_LINES_ALL = {
es: { slime:['Todavía estoy decidiendo qué ser de mayor.','Blub. Eso lo resume todo.'], gato:['Te concedo tres caricias. Adminístralas.','No te ignoro. Priorizo.'], perro:['¡Has vuelto! ¡El mejor momento del día!','¿Salimos? ¿Salimos? ¡¿SALIMOS?!'], conejo:['¡¿Qué ha sido eso?! …ah, nada. Otra vez.','Salto primero, pregunto después.'], zorro:['Tengo un plan. Técnicamente, tres.','Yo no fui. Y si fui, fue con estilo.'], panda:['Rodar cuesta abajo cuenta como cardio.','Cinco minutos más. Por el bambú.'], axolotl:['Sonríe. Confunde a los problemas.','Regenero hasta los lunes.'], pinguino:['El suelo estaba resbaladizo. El suelo.','Elegancia hasta el tropiezo. Luego, comedia.'], buho:['¿Sabías que…? Da igual, te lo cuento.','La noche es joven. Yo, sabio.'], dragon:['Este humo es decorativo. De momento.','Desciendo de leyendas. Se nota, ¿verdad?'], fantasma:['Bu. Perdón, protocolo.','Atravesar paredes está sobrevalorado. Las webs, no.'], fenix:['Si sale mal, renazco y ya.','Las cenizas son solo un punto de guardado.'], kitsune:['Sé algo que tú no. Ventaja de colas.','Esa historia te la cuento… otro día que no es hoy.'], unicornio:['Un poco de purpurina lo arregla casi todo.','Mi cuerno detecta malas vibras. Y las corrige.'], hada:['¡Rápido, rápido! …¿a dónde íbamos?','He dejado brillitos por ahí. De nada.'], kraken:['¿Un abrazo? Tengo tentáculos de sobra.','Las profundidades están bien, pero aquí hay wifi.'] },
en: { slime:['Still deciding what to be when I grow up.','Blub. That sums it up.'], gato:['I grant you three pets. Budget them.','I\'m not ignoring you. I\'m prioritizing.'], perro:['You\'re back! Best moment of the day!','Walkies? Walkies? WALKIES?!'], conejo:['WHAT WAS THAT?! …oh, nothing. Again.','Jump first, ask later.'], zorro:['I have a plan. Technically, three.','Wasn\'t me. And if it was, it was stylish.'], panda:['Rolling downhill counts as cardio.','Five more minutes. For the bamboo.'], axolotl:['Smile. It confuses problems.','I regenerate even from Mondays.'], pinguino:['The floor was slippery. The FLOOR.','Elegance until the trip. Then, comedy.'], buho:['Did you know…? Whatever, I\'m telling you anyway.','The night is young. I am wise.'], dragon:['This smoke is decorative. For now.','I descend from legends. You can tell, right?'], fantasma:['Boo. Sorry, protocol.','Walking through walls is overrated. Websites aren\'t.'], fenix:['If it goes wrong, I just respawn.','Ashes are just a save point.'], kitsune:['I know something you don\'t. Tail privilege.','I\'ll tell you that story… some day that isn\'t today.'], unicornio:['A little glitter fixes almost everything.','My horn detects bad vibes. And corrects them.'], hada:['Quick, quick! …where were we going?','I left sparkles around. You\'re welcome.'], kraken:['A hug? I\'ve got tentacles to spare.','The deep is fine, but there\'s wifi up here.'] },
de: { slime:['Ich überlege noch, was ich mal werden will.','Blub. Das fasst es zusammen.'], gato:['Ich gewähre dir drei Streicheleinheiten. Teile sie gut ein.','Ich ignoriere dich nicht. Ich priorisiere.'], perro:['Du bist zurück! Bester Moment des Tages!','Gassi? Gassi? GASSI?!'], conejo:['WAS WAR DAS?! …ach, nichts. Schon wieder.','Erst springen, dann fragen.'], zorro:['Ich habe einen Plan. Genau genommen drei.','Ich war\'s nicht. Und wenn doch, dann mit Stil.'], panda:['Bergab rollen zählt als Cardio.','Noch fünf Minuten. Für den Bambus.'], axolotl:['Lächle. Das verwirrt die Probleme.','Ich regeneriere sogar Montage.'], pinguino:['Der Boden war rutschig. Der BODEN.','Eleganz bis zum Stolpern. Danach Komödie.'], buho:['Wusstest du…? Egal, ich erzähle es trotzdem.','Die Nacht ist jung. Ich bin weise.'], dragon:['Dieser Rauch ist Deko. Vorerst.','Ich stamme von Legenden ab. Merkt man, oder?'], fantasma:['Buh. Entschuldigung, Protokoll.','Durch Wände gehen wird überschätzt. Webseiten nicht.'], fenix:['Wenn es schiefgeht, respawne ich einfach.','Asche ist nur ein Speicherpunkt.'], kitsune:['Ich weiß etwas, das du nicht weißt. Schwanzprivileg.','Die Geschichte erzähle ich dir… an einem Tag, der nicht heute ist.'], unicornio:['Ein bisschen Glitzer repariert fast alles.','Mein Horn erkennt schlechte Stimmung. Und korrigiert sie.'], hada:['Schnell, schnell! …wohin wollten wir?','Ich habe überall Glitzer verteilt. Gern geschehen.'], kraken:['Eine Umarmung? Ich habe Tentakel übrig.','Die Tiefe ist okay, aber hier oben gibt es WLAN.'] },
fr: { slime:['Je réfléchis encore à ce que je serai plus tard.','Bloub. Tout est dit.'], gato:['Je t\'accorde trois caresses. Gère-les bien.','Je ne t\'ignore pas. Je priorise.'], perro:['Tu es rentré ! Meilleur moment de la journée !','On sort ? On sort ? ON SORT ?!'], conejo:['C\'ÉTAIT QUOI ÇA ?! …ah, rien. Encore.','Je saute d\'abord, je demande après.'], zorro:['J\'ai un plan. Techniquement, trois.','C\'est pas moi. Et si c\'est moi, c\'était avec style.'], panda:['Rouler en descente compte comme du cardio.','Cinq minutes de plus. Pour le bambou.'], axolotl:['Souris. Ça déroute les problèmes.','Je régénère même les lundis.'], pinguino:['Le sol était glissant. Le SOL.','Élégance jusqu\'à la chute. Ensuite, comédie.'], buho:['Tu savais que… ? Peu importe, je te le dis quand même.','La nuit est jeune. Moi, sage.'], dragon:['Cette fumée est décorative. Pour l\'instant.','Je descends de légendes. Ça se voit, non ?'], fantasma:['Bouh. Pardon, protocole.','Traverser les murs, c\'est surfait. Pas les sites web.'], fenix:['Si ça tourne mal, je renais et voilà.','Les cendres, c\'est juste un point de sauvegarde.'], kitsune:['Je sais quelque chose que tu ignores. Privilège de queues.','Cette histoire, je te la raconte… un jour qui n\'est pas aujourd\'hui.'], unicornio:['Un peu de paillettes répare presque tout.','Ma corne détecte les mauvaises ondes. Et les corrige.'], hada:['Vite, vite ! …on allait où déjà ?','J\'ai laissé des paillettes partout. De rien.'], kraken:['Un câlin ? J\'ai des tentacules en trop.','Les profondeurs, ça va, mais ici il y a le wifi.'] },
it: { slime:['Sto ancora decidendo cosa fare da grande.','Blub. Questo riassume tutto.'], gato:['Ti concedo tre carezze. Amministrale.','Non ti ignoro. Do priorità.'], perro:['Sei tornato! Il momento migliore della giornata!','Usciamo? Usciamo? USCIAMO?!'], conejo:['COS\'È STATO?! …ah, niente. Di nuovo.','Prima salto, poi chiedo.'], zorro:['Ho un piano. Tecnicamente, tre.','Non sono stato io. E se sono stato io, è stato con stile.'], panda:['Rotolare in discesa conta come cardio.','Altri cinque minuti. Per il bambù.'], axolotl:['Sorridi. Confonde i problemi.','Rigenero perfino i lunedì.'], pinguino:['Il pavimento era scivoloso. Il PAVIMENTO.','Eleganza fino all\'inciampo. Poi, commedia.'], buho:['Lo sapevi che…? Vabbè, te lo dico lo stesso.','La notte è giovane. Io, saggio.'], dragon:['Questo fumo è decorativo. Per ora.','Discendo da leggende. Si nota, vero?'], fantasma:['Bu. Scusa, protocollo.','Attraversare i muri è sopravvalutato. I siti web no.'], fenix:['Se va male, rinasco e via.','La cenere è solo un punto di salvataggio.'], kitsune:['So una cosa che tu non sai. Privilegio delle code.','Quella storia te la racconto… un giorno che non è oggi.'], unicornio:['Un po\' di brillantini sistemano quasi tutto.','Il mio corno rileva le cattive vibrazioni. E le corregge.'], hada:['Presto, presto! …dove stavamo andando?','Ho lasciato brillantini in giro. Prego.'], kraken:['Un abbraccio? Ho tentacoli d\'avanzo.','Gli abissi vanno bene, ma qui c\'è il wifi.'] },
pt: { slime:['Ainda estou a decidir o que ser quando crescer.','Blub. Isso resume tudo.'], gato:['Concedo-te três festinhas. Administra-as.','Não te ignoro. Dou prioridades.'], perro:['Voltaste! O melhor momento do dia!','Vamos passear? Vamos? VAMOS?!'], conejo:['O QUE FOI ISTO?! …ah, nada. Outra vez.','Salto primeiro, pergunto depois.'], zorro:['Tenho um plano. Tecnicamente, três.','Não fui eu. E se fui, foi com estilo.'], panda:['Rolar ladeira abaixo conta como cardio.','Mais cinco minutos. Pelo bambu.'], axolotl:['Sorri. Confunde os problemas.','Regenero até as segundas-feiras.'], pinguino:['O chão estava escorregadio. O CHÃO.','Elegância até ao tropeção. Depois, comédia.'], buho:['Sabias que…? Tanto faz, conto-te na mesma.','A noite é jovem. Eu, sábio.'], dragon:['Este fumo é decorativo. Por enquanto.','Descendo de lendas. Nota-se, não é?'], fantasma:['Bu. Desculpa, protocolo.','Atravessar paredes é sobrevalorizado. Os sites não.'], fenix:['Se correr mal, renasço e pronto.','As cinzas são só um ponto de gravação.'], kitsune:['Sei algo que tu não sabes. Privilégio de caudas.','Essa história conto-ta… num dia que não é hoje.'], unicornio:['Um pouco de purpurina resolve quase tudo.','O meu corno deteta más vibrações. E corrige-as.'], hada:['Depressa, depressa! …aonde íamos?','Deixei brilhinhos por aí. De nada.'], kraken:['Um abraço? Tenho tentáculos a mais.','As profundezas estão bem, mas aqui há wifi.'] }
};
function spLine(dna, lang) {
  if (!dna || !dna.species) return null;
  const bank = SP_LINES_ALL[lang] || SP_LINES_ALL.es;
  const arr = bank[dna.species];
  return arr ? arr[Math.floor(Math.random() * arr.length)] : null;
}
/* ── Duelos de ingenio (v0.18, estilo Monkey Island para todos los públicos).
   60 pares pulla→réplica: 3 con la voz de cada especie (sp) + 12 genéricos.
   Los índices son PARALELOS entre idiomas: el id aprendido (posición en el
   array) vale para cualquier idioma. Perder también enseña la réplica. ── */
const DUELS_ALL = {
es: [
  {p:'Peleas como un renacuajo mareado.', r:'Qué apropiado. Tú insultas como uno.'},
  {p:'Mi abuela rebota más alto que tú.', r:'Normal: entrenó esquivándote a ti.'},
  {p:'Eres tan blando que das ternura.', r:'Y tú tan duro… de mollera.'},
  {p:'Te he visto brillar más en un apagón.', r:'Es que a tu lado cualquiera deslumbra.'},
  {sp:'slime', p:'No eres más que gelatina con ínfulas.', r:'Gelatina premium. Tú, caldo aguado.'},
  {sp:'slime', p:'Sin forma, sin futuro.', r:'Sin forma quepo en todas partes. Tú no cabes ni en esta frase.'},
  {sp:'gato', p:'Duermes más de lo que existes.', r:'Y aun dormido tengo más estilo que tú despierto.'},
  {sp:'gato', p:'Nadie te ha pedido opinión, bola de pelo.', r:'Por eso la doy gratis. A ti habría que pagarte por callar.'},
  {sp:'perro', p:'Mueves la cola por cualquiera.', r:'Menos por ti. Fíjate qué quieta.'},
  {sp:'perro', p:'Tanto entusiasmo marea.', r:'Y tanta amargura, ¿hidrata?'},
  {sp:'conejo', p:'Saltas mucho para llegar tan poco.', r:'Llego justo donde tú no alcanzas.'},
  {sp:'conejo', p:'Con esas orejas oirás hasta tus miedos.', r:'Oigo tus pullas venir desde ayer. Por eso bostezo.'},
  {sp:'zorro', p:'Te crees muy listo, ¿eh?', r:'No me lo creo: lo confirmaste tú al retarme.'},
  {sp:'zorro', p:'Astuto como un ladrillo.', r:'Los ladrillos construyen. Tú solo estorbas.'},
  {sp:'panda', p:'Ruedas porque andar te queda grande.', r:'Ruedo porque ganarte andando no tiene mérito.'},
  {sp:'panda', p:'Mucho bambú y poca chispa.', r:'La chispa la reservo. Contigo basta el piloto automático.'},
  {sp:'axolotl', p:'Esa sonrisa fija da grima.', r:'Es mi cara de verte perder. Permanente.'},
  {sp:'axolotl', p:'Blandito por fuera, blandito por dentro.', r:'Y regenerable. Tus pullas caducan; yo no.'},
  {sp:'pinguino', p:'Caminas como un flan con prisa.', r:'Y aun así llego más lejos que tu ingenio.'},
  {sp:'pinguino', p:'¿Elegancia? Si te resbalas solo.', r:'Me resbalo yo… y también tus insultos.'},
  {sp:'buho', p:'Cuánto dato para tan poca gracia.', r:'Dato: acabas de perder este duelo. ¿A que hace gracia?'},
  {sp:'buho', p:'Sabelotodo de tres al cuarto.', r:'Sé lo suficiente: por ejemplo, cómo termina esto.'},
  {sp:'dragon', p:'Tu fuego es humo de incienso.', r:'Y aun así te tiene sudando.'},
  {sp:'dragon', p:'Lagartija con ego.', r:'Leyenda con paciencia. Poca: date prisa en perder.'},
  {sp:'fantasma', p:'Ni asustas ni existes del todo.', r:'Existo lo justo para ganarte. Bu.'},
  {sp:'fantasma', p:'Se te ve venir a través.', r:'Y aun viéndome venir, no esquivaste esta réplica.'},
  {sp:'fenix', p:'Arder tanto para acabar en ceniza…', r:'La ceniza es mi salida de emergencia. Tú no tienes ni plan A.'},
  {sp:'fenix', p:'Pájaro de un solo truco.', r:'Un truco infinito. Cuenta los tuyos: cero.'},
  {sp:'kitsune', p:'Tantas colas y ninguna idea.', r:'Una cola por cada duelo ganado. Hoy estreno otra.'},
  {sp:'kitsune', p:'Misteriosa… o simplemente sosa.', r:'El misterio es cómo sigues hablando sin decir nada.'},
  {sp:'unicornio', p:'La purpurina no tapa lo cursi.', r:'Ni tu vozarrón tapa la envidia. Se te ve el brillo prestado.'},
  {sp:'unicornio', p:'Caballo con cucurucho.', r:'Cucurucho que pincha egos. Acércate y comprueba.'},
  {sp:'hada', p:'Tan pequeña que ni molestas.', r:'El tamaño justo para colarme por los agujeros de tu lógica.'},
  {sp:'hada', p:'¿Polvo brillante? Será caspa.', r:'Caspa que me pides prestada para tener algo de brillo.'},
  {sp:'kraken', p:'Ocho brazos y ningún argumento.', r:'Ocho argumentos. ¿Quieres el abrazo de demostración?'},
  {sp:'kraken', p:'Monstruito de charca.', r:'De charca profunda. Tú no cubres ni de tobillo.'},
  {p:'He visto piedras con más reflejos.', r:'Y yo piedras con más conversación. Ah, no: eras tú.'},
  {p:'Tu ingenio llega tarde hasta a esta frase.', r:'Llega cuando quiere. Ganar siempre da esas licencias.'},
  {p:'¿Eso es todo? Esperaba un rival.', r:'Y yo un insulto. Ya somos dos esperando.'},
  {p:'Rindes menos que un lunes.', r:'Los lunes al menos vuelven. Tu ingenio, quién sabe.'},
  {p:'Presumes mucho para brillar tan poco.', r:'No presumo: aviso. Así luego no lloras.'},
  {p:'Bostezo cuando hablas. Y eso que madrugo.', r:'No es sueño, es envidia con los ojos cerrados.'},
  {p:'Tus réplicas las escribe un caracol.', r:'Y aun así te adelantan. Salúdalo cuando pase.'},
  {p:'Hasta un espejo se aburre contigo.', r:'El tuyo no se aburre: se disculpa.'},
  {sp:'slime', p:'Si te aprieto, ¿sale ingenio o solo babas?', r:'Babas. El ingenio lo reservo para rivales de verdad.'},
  {sp:'gato', p:'Ni con siete vidas me ganarías.', r:'Con media me sobra. Las otras seis son para la siesta.'},
  {sp:'perro', p:'Solo sabes traer la pelota.', r:'Y aun así traigo más ideas que tú.'},
  {sp:'conejo', p:'Corres mucho para no ir a ninguna parte.', r:'Voy a la meta. Tú ni sabías que había carrera.'},
  {sp:'zorro', p:'Tus trucos se ven venir de lejos.', r:'Los que dejo que veas. Los buenos ya te ganaron.'},
  {sp:'panda', p:'Blando por fuera, vago por dentro.', r:'Vago no: eficiente. Gano duelos sin levantarme.'},
  {sp:'axolotl', p:'Vives en un charco y se te nota.', r:'Mi charco tiene vistas: desde aquí te veo perder.'},
  {sp:'pinguino', p:'Un pájaro que no vuela. Qué desperdicio.', r:'No vuelo: planeo. Mis réplicas sí despegan.'},
  {sp:'buho', p:'Tanto libro y ninguna calle.', r:'La calle dice que vas perdiendo. Lo leí en tu cara.'},
  {sp:'dragon', p:'¿Y esas alitas? ¿De pollo?', r:'Las justas para volar por encima de tu nivel. Ni esfuerzo.'},
  {sp:'fantasma', p:'Das menos miedo que una sábana tendida.', r:'Bu. …Has parpadeado. Punto para mí.'},
  {sp:'fenix', p:'Renaces mucho y aprendes poco.', r:'Aprendí lo importante: para ganarte no hace falta más.'},
  {sp:'kitsune', p:'Tanta leyenda para tan poco cuento.', r:'Y tu cuento acaba siempre igual: perdiendo. Fin.'},
  {sp:'unicornio', p:'Arcoíris andante, empalagas.', r:'Empalago, deslumbro y gano. Menudo día llevas.'},
  {sp:'hada', p:'Tus alas son de adorno, como tu ingenio.', r:'Mis alas me sacan volando de aquí. Tu ingenio ni gatea.'},
  {sp:'kraken', p:'Tanto tentáculo y nada que agarrar.', r:'Ocho brazos: uno para ganarte y siete para aplaudirme.'}
],
en: [
  {p:'You fight like a dizzy tadpole.', r:'How appropriate. You insult like one.'},
  {p:'My grandma bounces higher than you.', r:'Of course: she trained by dodging you.'},
  {p:'You\'re so soft it\'s almost cute.', r:'And you\'re so hard… of hearing when wit talks.'},
  {p:'I\'ve seen you shine brighter in a blackout.', r:'Next to you, anyone looks dazzling.'},
  {sp:'slime', p:'You\'re just jelly with delusions.', r:'Premium jelly. You\'re watered-down broth.'},
  {sp:'slime', p:'No shape, no future.', r:'Shapeless, I fit anywhere. You don\'t even fit in this sentence.'},
  {sp:'gato', p:'You sleep more than you exist.', r:'And asleep I still have more style than you awake.'},
  {sp:'gato', p:'Nobody asked for your opinion, furball.', r:'That\'s why I give it free. You\'d have to be paid to stay quiet.'},
  {sp:'perro', p:'You wag your tail for anyone.', r:'Except for you. Notice how still it is.'},
  {sp:'perro', p:'All that enthusiasm is dizzying.', r:'And all that bitterness — does it hydrate?'},
  {sp:'conejo', p:'You jump so much to get so little.', r:'I land exactly where you can\'t reach.'},
  {sp:'conejo', p:'With those ears you must hear your own fears.', r:'I heard your insults coming since yesterday. Hence the yawn.'},
  {sp:'zorro', p:'You think you\'re so clever, huh?', r:'I don\'t think it: you confirmed it by challenging me.'},
  {sp:'zorro', p:'Cunning as a brick.', r:'Bricks build things. You just get in the way.'},
  {sp:'panda', p:'You roll because walking is too much for you.', r:'I roll because beating you on foot has no merit.'},
  {sp:'panda', p:'Lots of bamboo, little spark.', r:'I save the spark. For you, autopilot is plenty.'},
  {sp:'axolotl', p:'That fixed smile is creepy.', r:'It\'s my watching-you-lose face. Permanent.'},
  {sp:'axolotl', p:'Soft outside, soft inside.', r:'And regenerating. Your insults expire; I don\'t.'},
  {sp:'pinguino', p:'You walk like pudding in a hurry.', r:'And still get further than your wit.'},
  {sp:'pinguino', p:'Elegance? You slip on your own.', r:'I slip… and so do your insults, right off me.'},
  {sp:'buho', p:'So many facts, so little charm.', r:'Fact: you just lost this duel. Charming, isn\'t it?'},
  {sp:'buho', p:'A two-bit know-it-all.', r:'I know enough: for instance, how this ends.'},
  {sp:'dragon', p:'Your fire is incense smoke.', r:'And it still has you sweating.'},
  {sp:'dragon', p:'A lizard with an ego.', r:'A legend with patience. Little of it: hurry up and lose.'},
  {sp:'fantasma', p:'You neither scare nor fully exist.', r:'I exist just enough to beat you. Boo.'},
  {sp:'fantasma', p:'I can see you coming right through you.', r:'And even seeing me coming, you didn\'t dodge this comeback.'},
  {sp:'fenix', p:'All that burning just to end up as ash…', r:'Ash is my emergency exit. You don\'t even have a plan A.'},
  {sp:'fenix', p:'A one-trick bird.', r:'An infinite trick. Count yours: zero.'},
  {sp:'kitsune', p:'So many tails and not one idea.', r:'One tail per duel won. Today I unlock another.'},
  {sp:'kitsune', p:'Mysterious… or just bland.', r:'The mystery is how you keep talking while saying nothing.'},
  {sp:'unicornio', p:'Glitter doesn\'t hide the corniness.', r:'And your big voice doesn\'t hide the envy. Your shine is borrowed.'},
  {sp:'unicornio', p:'A horse with an ice-cream cone.', r:'A cone that pops egos. Come closer and check.'},
  {sp:'hada', p:'So tiny you\'re not even a bother.', r:'Just the right size to slip through the holes in your logic.'},
  {sp:'hada', p:'Sparkling dust? More like dandruff.', r:'Dandruff you borrow to have any sparkle at all.'},
  {sp:'kraken', p:'Eight arms and not one argument.', r:'Eight arguments. Want the demonstration hug?'},
  {sp:'kraken', p:'Little puddle monster.', r:'A deep puddle. You wouldn\'t get your ankles wet.'},
  {p:'I\'ve seen rocks with quicker reflexes.', r:'And I\'ve seen rocks with better banter. Oh wait — that was you.'},
  {p:'Your wit arrives late even to this sentence.', r:'It arrives whenever it likes. Winning always grants such liberties.'},
  {p:'Is that all? I expected a rival.', r:'And I expected an insult. Now we\'re both waiting.'},
  {p:'You perform worse than a Monday.', r:'Mondays at least come back. Your wit? No word yet.'},
  {p:'You boast a lot for someone so dim.', r:'I don\'t boast: I warn. So you don\'t cry later.'},
  {p:'I yawn when you talk. And I\'m an early riser.', r:'That\'s not sleepiness, that\'s envy with its eyes closed.'},
  {p:'A snail writes your comebacks.', r:'And they still outrun you. Wave when it passes.'},
  {p:'Even a mirror gets bored of you.', r:'Yours doesn\'t get bored: it apologizes.'},
  {sp:'slime', p:'If I squeeze you, does wit come out or just goo?', r:'Goo. I save the wit for real rivals.'},
  {sp:'gato', p:'Not even nine lives would beat me.', r:'Half of one is plenty. The rest are for napping.'},
  {sp:'perro', p:'All you can do is fetch.', r:'And I still fetch more ideas than you.'},
  {sp:'conejo', p:'You run so fast to get nowhere.', r:'I\'m headed for the finish line. You didn\'t know there was a race.'},
  {sp:'zorro', p:'Your tricks can be seen from a mile away.', r:'Only the ones I let you see. The good ones already beat you.'},
  {sp:'panda', p:'Soft outside, lazy inside.', r:'Not lazy: efficient. I win duels without getting up.'},
  {sp:'axolotl', p:'You live in a puddle and it shows.', r:'My puddle has a view: from here I watch you lose.'},
  {sp:'pinguino', p:'A bird that can\'t fly. What a waste.', r:'I don\'t fly: I glide. My comebacks, though, take off.'},
  {sp:'buho', p:'All those books and no street smarts.', r:'The street says you\'re losing. I read it on your face.'},
  {sp:'dragon', p:'What are those wings? Chicken wings?', r:'Just enough to soar above your level. Barely an effort.'},
  {sp:'fantasma', p:'You\'re less scary than laundry on a line.', r:'Boo. …You blinked. Point for me.'},
  {sp:'fenix', p:'So many rebirths, so little learning.', r:'I learned what matters: beating you takes nothing more.'},
  {sp:'kitsune', p:'So much legend for such a short tale.', r:'And your tale always ends the same: losing. The end.'},
  {sp:'unicornio', p:'A walking rainbow. Sickeningly sweet.', r:'Sweet, dazzling, and winning. Rough day for you.'},
  {sp:'hada', p:'Your wings are decorative, like your wit.', r:'My wings fly me out of here. Your wit can\'t even crawl.'},
  {sp:'kraken', p:'All those tentacles and nothing to grasp.', r:'Eight arms: one to beat you, seven to applaud myself.'}
],
de: [
  {p:'Du kämpfst wie eine schwindlige Kaulquappe.', r:'Wie passend. Du beleidigst wie eine.'},
  {p:'Meine Oma hüpft höher als du.', r:'Klar: sie hat trainiert, indem sie dir auswich.'},
  {p:'Du bist so weich, dass es fast niedlich ist.', r:'Und du so hart… im Begreifen.'},
  {p:'Ich habe dich bei Stromausfall heller strahlen sehen.', r:'Neben dir wirkt eben jeder blendend.'},
  {sp:'slime', p:'Du bist nur Gelee mit Ambitionen.', r:'Premium-Gelee. Du bist verwässerte Brühe.'},
  {sp:'slime', p:'Keine Form, keine Zukunft.', r:'Formlos passe ich überall hin. Du passt nicht mal in diesen Satz.'},
  {sp:'gato', p:'Du schläfst mehr, als du existierst.', r:'Und schlafend habe ich mehr Stil als du wach.'},
  {sp:'gato', p:'Niemand hat nach deiner Meinung gefragt, Fellknäuel.', r:'Darum gibt es sie gratis. Fürs Schweigen müsste man dich bezahlen.'},
  {sp:'perro', p:'Du wedelst für jeden mit dem Schwanz.', r:'Außer für dich. Schau, wie still er ist.'},
  {sp:'perro', p:'So viel Begeisterung macht schwindlig.', r:'Und so viel Bitterkeit — spendet die Feuchtigkeit?'},
  {sp:'conejo', p:'Du springst so viel für so wenig.', r:'Ich lande genau da, wo du nicht hinkommst.'},
  {sp:'conejo', p:'Mit den Ohren hörst du sogar deine Ängste.', r:'Deine Sticheleien höre ich seit gestern kommen. Daher das Gähnen.'},
  {sp:'zorro', p:'Hältst dich wohl für schlau, was?', r:'Ich halte nicht: du hast es bestätigt, als du mich herausgefordert hast.'},
  {sp:'zorro', p:'Schlau wie ein Ziegelstein.', r:'Ziegel bauen etwas auf. Du stehst nur im Weg.'},
  {sp:'panda', p:'Du rollst, weil Laufen dich überfordert.', r:'Ich rolle, weil dich zu Fuß zu schlagen keine Kunst ist.'},
  {sp:'panda', p:'Viel Bambus, wenig Funke.', r:'Den Funken spare ich. Für dich reicht der Autopilot.'},
  {sp:'axolotl', p:'Dieses starre Lächeln ist unheimlich.', r:'Das ist mein Gesicht beim Zusehen, wie du verlierst. Dauerhaft.'},
  {sp:'axolotl', p:'Weich außen, weich innen.', r:'Und regenerierend. Deine Sticheleien laufen ab; ich nicht.'},
  {sp:'pinguino', p:'Du läufst wie Pudding in Eile.', r:'Und komme trotzdem weiter als dein Witz.'},
  {sp:'pinguino', p:'Eleganz? Du rutschst von allein aus.', r:'Ich rutsche… und deine Beleidigungen rutschen an mir ab.'},
  {sp:'buho', p:'So viele Fakten, so wenig Charme.', r:'Fakt: du hast dieses Duell gerade verloren. Charmant, oder?'},
  {sp:'buho', p:'Billiger Besserwisser.', r:'Ich weiß genug: zum Beispiel, wie das hier endet.'},
  {sp:'dragon', p:'Dein Feuer ist Räucherstäbchenrauch.', r:'Und trotzdem bringt es dich ins Schwitzen.'},
  {sp:'dragon', p:'Eine Eidechse mit Ego.', r:'Eine Legende mit Geduld. Wenig davon: verlier schneller.'},
  {sp:'fantasma', p:'Du erschreckst nicht mal und existierst kaum.', r:'Ich existiere gerade genug, um dich zu schlagen. Buh.'},
  {sp:'fantasma', p:'Man sieht dich durch dich hindurch kommen.', r:'Und trotzdem hast du diese Antwort nicht kommen sehen.'},
  {sp:'fenix', p:'So viel Brennen, um als Asche zu enden…', r:'Asche ist mein Notausgang. Du hast nicht mal einen Plan A.'},
  {sp:'fenix', p:'Ein Vogel mit nur einem Trick.', r:'Ein unendlicher Trick. Zähl deine: null.'},
  {sp:'kitsune', p:'So viele Schwänze und keine einzige Idee.', r:'Ein Schwanz pro gewonnenem Duell. Heute kommt ein neuer dazu.'},
  {sp:'kitsune', p:'Mysteriös… oder einfach fad.', r:'Das Mysterium ist, wie du weiterredest, ohne etwas zu sagen.'},
  {sp:'unicornio', p:'Glitzer versteckt den Kitsch nicht.', r:'Und deine große Klappe versteckt den Neid nicht. Dein Glanz ist geliehen.'},
  {sp:'unicornio', p:'Ein Pferd mit Eistüte.', r:'Eine Tüte, die Egos ansticht. Komm näher und prüf es.'},
  {sp:'hada', p:'So winzig, dass du nicht mal störst.', r:'Genau die richtige Größe, um durch die Löcher deiner Logik zu schlüpfen.'},
  {sp:'hada', p:'Glitzerstaub? Eher Schuppen.', r:'Schuppen, die du dir leihst, um überhaupt zu glänzen.'},
  {sp:'kraken', p:'Acht Arme und kein einziges Argument.', r:'Acht Argumente. Willst du die Demonstrations-Umarmung?'},
  {sp:'kraken', p:'Kleines Pfützenmonster.', r:'Aus einer tiefen Pfütze. Dir reicht es nicht mal bis zum Knöchel.'},
  {p:'Ich habe Steine mit schnelleren Reflexen gesehen.', r:'Und ich Steine mit besseren Kontern. Ach nein — das warst du.'},
  {p:'Dein Witz kommt sogar zu diesem Satz zu spät.', r:'Er kommt, wann er will. Wer immer gewinnt, darf das.'},
  {p:'Das ist alles? Ich hatte einen Gegner erwartet.', r:'Und ich eine Beleidigung. Jetzt warten wir beide.'},
  {p:'Du leistest weniger als ein Montag.', r:'Montage kommen wenigstens wieder. Dein Witz? Keine Spur.'},
  {p:'Viel Angeberei für so wenig Glanz.', r:'Ich gebe nicht an: ich warne. Damit du später nicht weinst.'},
  {p:'Ich gähne, wenn du redest. Und ich bin Frühaufsteher.', r:'Das ist kein Schlaf, das ist Neid mit geschlossenen Augen.'},
  {p:'Deine Konter schreibt eine Schnecke.', r:'Und trotzdem überholt sie dich. Wink ihr zu, wenn sie vorbeikommt.'},
  {p:'Sogar ein Spiegel langweilt sich mit dir.', r:'Deiner langweilt sich nicht: er entschuldigt sich.'},
  {sp:'slime', p:'Wenn ich dich drücke, kommt Witz raus oder nur Schleim?', r:'Schleim. Den Witz spare ich mir für echte Gegner.'},
  {sp:'gato', p:'Nicht mal mit sieben Leben schlägst du mich.', r:'Ein halbes reicht. Der Rest ist fürs Nickerchen.'},
  {sp:'perro', p:'Du kannst nur Stöckchen holen.', r:'Und trotzdem hole ich mehr Ideen als du.'},
  {sp:'conejo', p:'Du rennst so schnell, um nirgends anzukommen.', r:'Ich laufe zum Ziel. Du wusstest nicht mal, dass ein Rennen läuft.'},
  {sp:'zorro', p:'Deine Tricks sieht man von Weitem.', r:'Nur die, die ich dich sehen lasse. Die guten haben dich schon besiegt.'},
  {sp:'panda', p:'Weich außen, faul innen.', r:'Nicht faul: effizient. Ich gewinne Duelle im Sitzen.'},
  {sp:'axolotl', p:'Du lebst in einer Pfütze, und man merkt es.', r:'Meine Pfütze hat Aussicht: von hier sehe ich dich verlieren.'},
  {sp:'pinguino', p:'Ein Vogel, der nicht fliegt. Was für eine Verschwendung.', r:'Ich fliege nicht: ich gleite. Meine Konter heben trotzdem ab.'},
  {sp:'buho', p:'So viele Bücher und keine Straßenschläue.', r:'Die Straße sagt, du verlierst. Stand in deinem Gesicht.'},
  {sp:'dragon', p:'Was sind das für Flügelchen? Hähnchenflügel?', r:'Genau genug, um über deinem Niveau zu schweben. Ohne Mühe.'},
  {sp:'fantasma', p:'Du bist harmloser als Wäsche auf der Leine.', r:'Buh. …Du hast geblinzelt. Punkt für mich.'},
  {sp:'fenix', p:'So oft wiedergeboren und so wenig gelernt.', r:'Ich habe das Wichtige gelernt: für dich braucht es nicht mehr.'},
  {sp:'kitsune', p:'So viel Legende für so wenig Geschichte.', r:'Und deine Geschichte endet immer gleich: mit deiner Niederlage. Ende.'},
  {sp:'unicornio', p:'Ein wandelnder Regenbogen. Zuckersüß bis zum Umfallen.', r:'Süß, blendend und siegreich. Harter Tag für dich.'},
  {sp:'hada', p:'Deine Flügel sind Deko, wie dein Witz.', r:'Meine Flügel fliegen mich hier raus. Dein Witz krabbelt nicht mal.'},
  {sp:'kraken', p:'So viele Tentakel und nichts zu greifen.', r:'Acht Arme: einer besiegt dich, sieben applaudieren mir.'}
],
fr: [
  {p:'Tu te bats comme un têtard étourdi.', r:'Comme c\'est approprié. Tu insultes comme tel.'},
  {p:'Ma grand-mère rebondit plus haut que toi.', r:'Normal : elle s\'est entraînée en t\'esquivant.'},
  {p:'Tu es si mou que c\'en est mignon.', r:'Et toi si dur… de la comprenette.'},
  {p:'Je t\'ai vu briller davantage pendant une panne.', r:'À côté de toi, n\'importe qui éblouit.'},
  {sp:'slime', p:'Tu n\'es que de la gelée avec des prétentions.', r:'De la gelée premium. Toi, du bouillon coupé à l\'eau.'},
  {sp:'slime', p:'Sans forme, sans avenir.', r:'Sans forme, je rentre partout. Toi, tu ne rentres même pas dans cette phrase.'},
  {sp:'gato', p:'Tu dors plus que tu n\'existes.', r:'Et même endormi, j\'ai plus de style que toi éveillé.'},
  {sp:'gato', p:'Personne n\'a demandé ton avis, boule de poils.', r:'C\'est pour ça qu\'il est gratuit. Toi, il faudrait te payer pour te taire.'},
  {sp:'perro', p:'Tu remues la queue pour n\'importe qui.', r:'Sauf pour toi. Regarde comme elle est immobile.'},
  {sp:'perro', p:'Tant d\'enthousiasme donne le tournis.', r:'Et tant d\'amertume, ça hydrate ?'},
  {sp:'conejo', p:'Tu sautes beaucoup pour arriver si peu loin.', r:'J\'atterris exactement là où tu n\'arrives pas.'},
  {sp:'conejo', p:'Avec ces oreilles, tu dois entendre tes propres peurs.', r:'J\'entends tes piques arriver depuis hier. D\'où le bâillement.'},
  {sp:'zorro', p:'Tu te crois malin, hein ?', r:'Je ne le crois pas : tu l\'as confirmé en me défiant.'},
  {sp:'zorro', p:'Rusé comme une brique.', r:'Les briques construisent. Toi, tu encombres.'},
  {sp:'panda', p:'Tu roules parce que marcher te dépasse.', r:'Je roule parce que te battre en marchant n\'a aucun mérite.'},
  {sp:'panda', p:'Beaucoup de bambou, peu d\'étincelle.', r:'Je garde l\'étincelle. Avec toi, le pilote automatique suffit.'},
  {sp:'axolotl', p:'Ce sourire figé fait froid dans le dos.', r:'C\'est ma tête quand je te regarde perdre. Permanente.'},
  {sp:'axolotl', p:'Mou dehors, mou dedans.', r:'Et régénérable. Tes piques expirent ; pas moi.'},
  {sp:'pinguino', p:'Tu marches comme un flan pressé.', r:'Et j\'arrive quand même plus loin que ton esprit.'},
  {sp:'pinguino', p:'De l\'élégance ? Tu glisses tout seul.', r:'Je glisse… et tes insultes glissent sur moi.'},
  {sp:'buho', p:'Tant de savoir pour si peu de charme.', r:'Info : tu viens de perdre ce duel. Charmant, non ?'},
  {sp:'buho', p:'Monsieur je-sais-tout au rabais.', r:'J\'en sais assez : par exemple, comment ça se termine.'},
  {sp:'dragon', p:'Ton feu, c\'est de la fumée d\'encens.', r:'Et pourtant il te fait transpirer.'},
  {sp:'dragon', p:'Un lézard avec un ego.', r:'Une légende avec de la patience. Peu : dépêche-toi de perdre.'},
  {sp:'fantasma', p:'Tu ne fais pas peur et tu existes à peine.', r:'J\'existe juste assez pour te battre. Bouh.'},
  {sp:'fantasma', p:'On te voit venir à travers toi.', r:'Et même en me voyant venir, tu n\'as pas esquivé cette réplique.'},
  {sp:'fenix', p:'Tant brûler pour finir en cendres…', r:'Les cendres sont ma sortie de secours. Toi, tu n\'as même pas de plan A.'},
  {sp:'fenix', p:'Oiseau à un seul tour.', r:'Un tour infini. Compte les tiens : zéro.'},
  {sp:'kitsune', p:'Tant de queues et pas une idée.', r:'Une queue par duel gagné. Aujourd\'hui, j\'en étrenne une autre.'},
  {sp:'kitsune', p:'Mystérieuse… ou juste fade.', r:'Le mystère, c\'est comment tu continues à parler sans rien dire.'},
  {sp:'unicornio', p:'Les paillettes ne cachent pas le kitsch.', r:'Et ta grande voix ne cache pas l\'envie. Ton éclat est emprunté.'},
  {sp:'unicornio', p:'Un cheval avec un cornet.', r:'Un cornet qui perce les ego. Approche et vérifie.'},
  {sp:'hada', p:'Si petite que tu ne déranges même pas.', r:'Juste la taille qu\'il faut pour me glisser dans les trous de ta logique.'},
  {sp:'hada', p:'De la poussière brillante ? Des pellicules, oui.', r:'Des pellicules que tu m\'empruntes pour briller un peu.'},
  {sp:'kraken', p:'Huit bras et pas un argument.', r:'Huit arguments. Tu veux le câlin de démonstration ?'},
  {sp:'kraken', p:'Petit monstre de flaque.', r:'De flaque profonde. Toi, tu n\'aurais pas d\'eau aux chevilles.'},
  {p:'J\'ai vu des pierres avec plus de réflexes.', r:'Et moi des pierres avec plus de répartie. Ah non — c\'était toi.'},
  {p:'Ton esprit arrive en retard même à cette phrase.', r:'Il arrive quand il veut. Gagner toujours donne ces libertés.'},
  {p:'C\'est tout ? J\'attendais un rival.', r:'Et moi une insulte. Nous voilà deux à attendre.'},
  {p:'Tu rends moins qu\'un lundi.', r:'Les lundis, au moins, reviennent. Ton esprit, mystère.'},
  {p:'Tu frimes beaucoup pour briller si peu.', r:'Je ne frime pas : je préviens. Comme ça, tu ne pleures pas après.'},
  {p:'Je bâille quand tu parles. Et pourtant je me lève tôt.', r:'Ce n\'est pas du sommeil, c\'est de l\'envie les yeux fermés.'},
  {p:'Tes répliques, c\'est un escargot qui les écrit.', r:'Et elles te doublent quand même. Salue-le au passage.'},
  {p:'Même un miroir s\'ennuie avec toi.', r:'Le tien ne s\'ennuie pas : il s\'excuse.'},
  {sp:'slime', p:'Si je te presse, il sort de l\'esprit ou juste de la bave ?', r:'De la bave. L\'esprit, je le garde pour les vrais rivaux.'},
  {sp:'gato', p:'Même avec neuf vies tu ne me battrais pas.', r:'Une demie me suffit. Le reste, c\'est pour la sieste.'},
  {sp:'perro', p:'Tu ne sais que rapporter la balle.', r:'Et je rapporte quand même plus d\'idées que toi.'},
  {sp:'conejo', p:'Tu cours beaucoup pour n\'aller nulle part.', r:'Je vais à l\'arrivée. Tu ne savais même pas qu\'il y avait une course.'},
  {sp:'zorro', p:'Tes tours se voient de loin.', r:'Seulement ceux que je te laisse voir. Les bons t\'ont déjà battu.'},
  {sp:'panda', p:'Mou dehors, paresseux dedans.', r:'Pas paresseux : efficace. Je gagne mes duels sans me lever.'},
  {sp:'axolotl', p:'Tu vis dans une flaque et ça se voit.', r:'Ma flaque a une belle vue : d\'ici je te regarde perdre.'},
  {sp:'pinguino', p:'Un oiseau qui ne vole pas. Quel gâchis.', r:'Je ne vole pas : je glisse. Mes répliques, elles, décollent.'},
  {sp:'buho', p:'Tant de livres et aucune rue.', r:'La rue dit que tu perds. Je l\'ai lu sur ton visage.'},
  {sp:'dragon', p:'C\'est quoi ces ailettes ? Des ailes de poulet ?', r:'Juste assez pour planer au-dessus de ton niveau. Sans effort.'},
  {sp:'fantasma', p:'Tu fais moins peur qu\'un drap qui sèche.', r:'Bouh. …Tu as cligné. Point pour moi.'},
  {sp:'fenix', p:'Renaître autant pour apprendre si peu.', r:'J\'ai appris l\'essentiel : te battre ne demande rien de plus.'},
  {sp:'kitsune', p:'Tant de légende pour si peu d\'histoire.', r:'Et ton histoire finit toujours pareil : tu perds. Fin.'},
  {sp:'unicornio', p:'Arc-en-ciel ambulant, tu écœures.', r:'J\'écœure, j\'éblouis et je gagne. Sale journée pour toi.'},
  {sp:'hada', p:'Tes ailes sont décoratives, comme ton esprit.', r:'Mes ailes me font m\'envoler d\'ici. Ton esprit ne rampe même pas.'},
  {sp:'kraken', p:'Tant de tentacules et rien à saisir.', r:'Huit bras : un pour te battre, sept pour m\'applaudir.'}
],
it: [
  {p:'Combatti come un girino stordito.', r:'Che appropriato. Tu insulti come tale.'},
  {p:'Mia nonna rimbalza più in alto di te.', r:'Normale: si è allenata schivando te.'},
  {p:'Sei così molle che fai tenerezza.', r:'E tu così duro… di comprendonio.'},
  {p:'Ti ho visto brillare di più durante un blackout.', r:'Accanto a te, chiunque abbaglia.'},
  {sp:'slime', p:'Non sei che gelatina con pretese.', r:'Gelatina premium. Tu, brodo annacquato.'},
  {sp:'slime', p:'Senza forma, senza futuro.', r:'Senza forma entro ovunque. Tu non entri nemmeno in questa frase.'},
  {sp:'gato', p:'Dormi più di quanto esisti.', r:'E anche dormendo ho più stile di te sveglio.'},
  {sp:'gato', p:'Nessuno ha chiesto la tua opinione, palla di pelo.', r:'Per questo la do gratis. Te, bisognerebbe pagarti per stare zitto.'},
  {sp:'perro', p:'Scodinzoli per chiunque.', r:'Tranne che per te. Guarda com\'è ferma.'},
  {sp:'perro', p:'Tanto entusiasmo dà il capogiro.', r:'E tanta amarezza, idrata?'},
  {sp:'conejo', p:'Salti tanto per arrivare così poco lontano.', r:'Atterro esattamente dove tu non arrivi.'},
  {sp:'conejo', p:'Con quelle orecchie sentirai perfino le tue paure.', r:'Sento arrivare le tue frecciate da ieri. Da qui lo sbadiglio.'},
  {sp:'zorro', p:'Ti credi tanto furbo, eh?', r:'Non lo credo: l\'hai confermato tu sfidandomi.'},
  {sp:'zorro', p:'Astuto come un mattone.', r:'I mattoni costruiscono. Tu ingombri e basta.'},
  {sp:'panda', p:'Rotoli perché camminare è troppo per te.', r:'Rotolo perché batterti a piedi non ha merito.'},
  {sp:'panda', p:'Tanto bambù e poca scintilla.', r:'La scintilla la conservo. Con te basta il pilota automatico.'},
  {sp:'axolotl', p:'Quel sorriso fisso fa impressione.', r:'È la mia faccia mentre ti guardo perdere. Permanente.'},
  {sp:'axolotl', p:'Molle fuori, molle dentro.', r:'E rigenerabile. Le tue frecciate scadono; io no.'},
  {sp:'pinguino', p:'Cammini come un budino di fretta.', r:'E arrivo comunque più lontano del tuo spirito.'},
  {sp:'pinguino', p:'Eleganza? Se scivoli da solo.', r:'Scivolo io… e scivolano anche i tuoi insulti, via da me.'},
  {sp:'buho', p:'Quanti dati per così poco fascino.', r:'Dato: hai appena perso questo duello. Affascinante, no?'},
  {sp:'buho', p:'Saputello da quattro soldi.', r:'So abbastanza: per esempio, come finisce questa storia.'},
  {sp:'dragon', p:'Il tuo fuoco è fumo d\'incenso.', r:'Eppure ti fa sudare.'},
  {sp:'dragon', p:'Una lucertola con l\'ego.', r:'Una leggenda con pazienza. Poca: sbrigati a perdere.'},
  {sp:'fantasma', p:'Non spaventi e nemmeno esisti del tutto.', r:'Esisto quel tanto che basta per batterti. Bu.'},
  {sp:'fantasma', p:'Ti si vede arrivare attraverso.', r:'E pur vedendomi arrivare, non hai schivato questa replica.'},
  {sp:'fenix', p:'Bruciare tanto per finire in cenere…', r:'La cenere è la mia uscita d\'emergenza. Tu non hai nemmeno un piano A.'},
  {sp:'fenix', p:'Uccello da un trucco solo.', r:'Un trucco infinito. Conta i tuoi: zero.'},
  {sp:'kitsune', p:'Tante code e nemmeno un\'idea.', r:'Una coda per ogni duello vinto. Oggi ne inauguro un\'altra.'},
  {sp:'kitsune', p:'Misteriosa… o solo insipida.', r:'Il mistero è come continui a parlare senza dire niente.'},
  {sp:'unicornio', p:'I brillantini non nascondono il kitsch.', r:'E il tuo vocione non nasconde l\'invidia. Il tuo splendore è in prestito.'},
  {sp:'unicornio', p:'Un cavallo col cono gelato.', r:'Un cono che buca gli ego. Avvicinati e verifica.'},
  {sp:'hada', p:'Così piccola che non disturbi nemmeno.', r:'La taglia giusta per infilarmi nei buchi della tua logica.'},
  {sp:'hada', p:'Polvere brillante? Sarà forfora.', r:'Forfora che mi chiedi in prestito per avere un po\' di brillantezza.'},
  {sp:'kraken', p:'Otto braccia e nemmeno un argomento.', r:'Otto argomenti. Vuoi l\'abbraccio dimostrativo?'},
  {sp:'kraken', p:'Mostriciattolo di pozzanghera.', r:'Di pozzanghera profonda. A te non arriverebbe alle caviglie.'},
  {p:'Ho visto pietre con più riflessi.', r:'E io pietre con più battute. Ah no — eri tu.'},
  {p:'Il tuo ingegno arriva in ritardo perfino a questa frase.', r:'Arriva quando vuole. Vincere sempre dà certe libertà.'},
  {p:'Tutto qui? Mi aspettavo un rivale.', r:'E io un insulto. Ora aspettiamo in due.'},
  {p:'Rendi meno di un lunedì.', r:'I lunedì almeno tornano. Il tuo ingegno, chissà.'},
  {p:'Ti vanti molto per brillare così poco.', r:'Non mi vanto: avviso. Così dopo non piangi.'},
  {p:'Sbadiglio quando parli. E dire che mi alzo presto.', r:'Non è sonno, è invidia a occhi chiusi.'},
  {p:'Le tue repliche le scrive una lumaca.', r:'E ti superano comunque. Salutala quando passa.'},
  {p:'Perfino uno specchio si annoia con te.', r:'Il tuo non si annoia: si scusa.'},
  {sp:'slime', p:'Se ti strizzo, esce ingegno o solo bava?', r:'Bava. L\'ingegno lo tengo per i rivali veri.'},
  {sp:'gato', p:'Nemmeno con sette vite mi batteresti.', r:'Me ne basta mezza. Le altre sono per il pisolino.'},
  {sp:'perro', p:'Sai solo riportare la palla.', r:'E riporto comunque più idee di te.'},
  {sp:'conejo', p:'Corri tanto per non andare da nessuna parte.', r:'Vado al traguardo. Tu non sapevi nemmeno che c\'era una gara.'},
  {sp:'zorro', p:'I tuoi trucchi si vedono da lontano.', r:'Solo quelli che ti lascio vedere. I migliori ti hanno già battuto.'},
  {sp:'panda', p:'Morbido fuori, pigro dentro.', r:'Non pigro: efficiente. Vinco i duelli senza alzarmi.'},
  {sp:'axolotl', p:'Vivi in una pozzanghera e si vede.', r:'La mia pozzanghera ha vista: da qui ti guardo perdere.'},
  {sp:'pinguino', p:'Un uccello che non vola. Che spreco.', r:'Non volo: plano. Le mie repliche, invece, decollano.'},
  {sp:'buho', p:'Tanti libri e niente strada.', r:'La strada dice che stai perdendo. L\'ho letto sulla tua faccia.'},
  {sp:'dragon', p:'E quelle alette? Di pollo?', r:'Quanto basta per volare sopra il tuo livello. Senza sforzo.'},
  {sp:'fantasma', p:'Fai meno paura di un lenzuolo steso.', r:'Bu. …Hai sbattuto le palpebre. Punto per me.'},
  {sp:'fenix', p:'Rinasci tanto e impari poco.', r:'Ho imparato l\'essenziale: per batterti non serve altro.'},
  {sp:'kitsune', p:'Tanta leggenda per così poca storia.', r:'E la tua storia finisce sempre uguale: perdendo. Fine.'},
  {sp:'unicornio', p:'Arcobaleno ambulante, stucchi.', r:'Stucco, abbaglio e vinco. Brutta giornata per te.'},
  {sp:'hada', p:'Le tue ali sono decorative, come il tuo ingegno.', r:'Le mie ali mi portano via in volo. Il tuo ingegno non gattona nemmeno.'},
  {sp:'kraken', p:'Tanti tentacoli e niente da afferrare.', r:'Otto braccia: una per batterti, sette per applaudirmi.'}
],
pt: [
  {p:'Lutas como um girino tonto.', r:'Que apropriado. Tu insultas como um.'},
  {p:'A minha avó salta mais alto do que tu.', r:'Normal: treinou a desviar-se de ti.'},
  {p:'És tão mole que até é fofo.', r:'E tu tão duro… de entendimento.'},
  {p:'Já te vi brilhar mais num apagão.', r:'Ao teu lado, qualquer um deslumbra.'},
  {sp:'slime', p:'Não passas de gelatina com pretensões.', r:'Gelatina premium. Tu, caldo aguado.'},
  {sp:'slime', p:'Sem forma, sem futuro.', r:'Sem forma caibo em todo o lado. Tu nem cabes nesta frase.'},
  {sp:'gato', p:'Dormes mais do que existes.', r:'E mesmo a dormir tenho mais estilo do que tu acordado.'},
  {sp:'gato', p:'Ninguém pediu a tua opinião, bola de pelo.', r:'Por isso a dou de graça. A ti, teriam de te pagar para te calares.'},
  {sp:'perro', p:'Abanas a cauda a qualquer um.', r:'Menos a ti. Repara como está quieta.'},
  {sp:'perro', p:'Tanto entusiasmo dá tonturas.', r:'E tanta amargura, hidrata?'},
  {sp:'conejo', p:'Saltas muito para chegar tão pouco longe.', r:'Aterro exatamente onde tu não alcanças.'},
  {sp:'conejo', p:'Com essas orelhas até ouves os teus medos.', r:'Ouço as tuas bocas a chegar desde ontem. Daí o bocejo.'},
  {sp:'zorro', p:'Achas-te muito esperto, hã?', r:'Não acho: confirmaste-o tu ao desafiar-me.'},
  {sp:'zorro', p:'Astuto como um tijolo.', r:'Os tijolos constroem. Tu só atrapalhas.'},
  {sp:'panda', p:'Rolas porque andar é demais para ti.', r:'Rolo porque vencer-te a pé não tem mérito.'},
  {sp:'panda', p:'Muito bambu e pouca faísca.', r:'A faísca guardo-a. Contigo basta o piloto automático.'},
  {sp:'axolotl', p:'Esse sorriso fixo mete impressão.', r:'É a minha cara a ver-te perder. Permanente.'},
  {sp:'axolotl', p:'Mole por fora, mole por dentro.', r:'E regenerável. As tuas bocas expiram; eu não.'},
  {sp:'pinguino', p:'Andas como um pudim com pressa.', r:'E mesmo assim chego mais longe do que o teu engenho.'},
  {sp:'pinguino', p:'Elegância? Se escorregas sozinho.', r:'Escorrego eu… e escorregam também os teus insultos.'},
  {sp:'buho', p:'Tanto dado para tão pouca graça.', r:'Dado: acabaste de perder este duelo. Tem graça, não tem?'},
  {sp:'buho', p:'Sabichão de meia-tigela.', r:'Sei o suficiente: por exemplo, como isto acaba.'},
  {sp:'dragon', p:'O teu fogo é fumo de incenso.', r:'E mesmo assim deixa-te a suar.'},
  {sp:'dragon', p:'Lagartixa com ego.', r:'Lenda com paciência. Pouca: despacha-te a perder.'},
  {sp:'fantasma', p:'Nem assustas nem existes de todo.', r:'Existo o suficiente para te vencer. Bu.'},
  {sp:'fantasma', p:'Vê-se-te a chegar através de ti.', r:'E mesmo a ver-me chegar, não te desviaste desta réplica.'},
  {sp:'fenix', p:'Arder tanto para acabar em cinza…', r:'A cinza é a minha saída de emergência. Tu nem plano A tens.'},
  {sp:'fenix', p:'Pássaro de um truque só.', r:'Um truque infinito. Conta os teus: zero.'},
  {sp:'kitsune', p:'Tantas caudas e nenhuma ideia.', r:'Uma cauda por cada duelo ganho. Hoje estreio outra.'},
  {sp:'kitsune', p:'Misteriosa… ou simplesmente insossa.', r:'O mistério é como continuas a falar sem dizer nada.'},
  {sp:'unicornio', p:'A purpurina não tapa o piroso.', r:'Nem o teu vozeirão tapa a inveja. Nota-se o brilho emprestado.'},
  {sp:'unicornio', p:'Cavalo com cone de gelado.', r:'Cone que fura egos. Aproxima-te e comprova.'},
  {sp:'hada', p:'Tão pequena que nem incomodas.', r:'O tamanho certo para me enfiar pelos buracos da tua lógica.'},
  {sp:'hada', p:'Pó brilhante? Será caspa.', r:'Caspa que me pedes emprestada para teres algum brilho.'},
  {sp:'kraken', p:'Oito braços e nenhum argumento.', r:'Oito argumentos. Queres o abraço de demonstração?'},
  {sp:'kraken', p:'Monstrinho de poça.', r:'De poça funda. A ti nem te dava pelos tornozelos.'},
  {p:'Já vi pedras com mais reflexos.', r:'E eu pedras com mais conversa. Ah não — eras tu.'},
  {p:'O teu engenho chega atrasado até a esta frase.', r:'Chega quando quer. Ganhar sempre dá dessas liberdades.'},
  {p:'É tudo? Esperava um rival.', r:'E eu um insulto. Já somos dois à espera.'},
  {p:'Rendes menos do que uma segunda-feira.', r:'As segundas ao menos voltam. O teu engenho, quem sabe.'},
  {p:'Gabas-te muito para brilhar tão pouco.', r:'Não me gabo: aviso. Assim depois não choras.'},
  {p:'Bocejo quando falas. E olha que madrugo.', r:'Não é sono, é inveja de olhos fechados.'},
  {p:'As tuas réplicas escreve-as um caracol.', r:'E mesmo assim ultrapassam-te. Acena-lhe quando passar.'},
  {p:'Até um espelho se aborrece contigo.', r:'O teu não se aborrece: pede desculpa.'},
  {sp:'slime', p:'Se te apertar, sai engenho ou só baba?', r:'Baba. O engenho guardo-o para rivais a sério.'},
  {sp:'gato', p:'Nem com sete vidas me ganhavas.', r:'Meia chega-me. As outras são para a sesta.'},
  {sp:'perro', p:'Só sabes ir buscar a bola.', r:'E mesmo assim trago mais ideias do que tu.'},
  {sp:'conejo', p:'Corres muito para não ir a lado nenhum.', r:'Vou para a meta. Tu nem sabias que havia corrida.'},
  {sp:'zorro', p:'Os teus truques veem-se ao longe.', r:'Só os que te deixo ver. Os bons já te ganharam.'},
  {sp:'panda', p:'Mole por fora, preguiçoso por dentro.', r:'Preguiçoso não: eficiente. Ganho duelos sem me levantar.'},
  {sp:'axolotl', p:'Vives numa poça e nota-se.', r:'A minha poça tem vista: daqui vejo-te perder.'},
  {sp:'pinguino', p:'Uma ave que não voa. Que desperdício.', r:'Não voo: deslizo. As minhas réplicas é que levantam voo.'},
  {sp:'buho', p:'Tanto livro e nenhuma rua.', r:'A rua diz que estás a perder. Li-o na tua cara.'},
  {sp:'dragon', p:'E essas asinhas? De frango?', r:'As suficientes para voar acima do teu nível. Sem esforço.'},
  {sp:'fantasma', p:'Metes menos medo do que um lençol estendido.', r:'Bu. …Pestanejaste. Ponto para mim.'},
  {sp:'fenix', p:'Renasces tanto e aprendes tão pouco.', r:'Aprendi o essencial: para te ganhar não é preciso mais.'},
  {sp:'kitsune', p:'Tanta lenda para tão pouca história.', r:'E a tua história acaba sempre igual: a perder. Fim.'},
  {sp:'unicornio', p:'Arco-íris ambulante, enjoas.', r:'Enjoo, deslumbro e ganho. Que dia mau o teu.'},
  {sp:'hada', p:'As tuas asas são de enfeite, como o teu engenho.', r:'As minhas asas tiram-me daqui a voar. O teu engenho nem gatinha.'},
  {sp:'kraken', p:'Tanto tentáculo e nada para agarrar.', r:'Oito braços: um para te ganhar, sete para me aplaudir.'}
]
};
function duelBank(lang) { return DUELS_ALL[lang] || DUELS_ALL.es; }


const EGG_POOL = [];
[['slime',8],['gato',8],['perro',8],['conejo',7],['zorro',6],['panda',6],['pinguino',6],['axolotl',5],['buho',5],
 ['dragon',4],['fantasma',4],['hada',4],
 ['fenix',2],['kraken',2],
 ['unicornio',1],['kitsune',1]].forEach(([sp, w]) => { for (let i = 0; i < w; i++) EGG_POOL.push(sp); });
const NAT_COLORS = {
  gato: ['#f5f0e6','#ded5c9','#c9b8a3','#8a7f72','#e8b98a'],
  perro: ['#f5f0e6','#c9b8a3','#a8825f','#8a6a4a','#4a4038'],
  conejo: ['#f5f0e6','#ded5c9','#c9b8a3','#b8a89a'],
  zorro: ['#e8853d','#d97a2e','#c9b8a3'],
  panda: ['#f5f0e6','#efe8dd'],
  pinguino: ['#3f4a55','#2f3a44','#4a5a68'],
  buho: ['#a8825f','#8a6a4a','#c9b8a3'],
  axolotl: ['#f4b8ce','#f2c9d4','#e8b0c0','#ded5c9']
};
/* ── Compatibilidad entre temperamentos (visitas y convivencia) ── */
const COMPAT_MATRIX = {
  jugueton:  { jugueton: 2, caotico: 2, timido: 1, tranquilo: 0, grunon: -1 },
  tranquilo: { tranquilo: 2, timido: 2, grunon: 1, jugueton: 0, caotico: -2 },
  grunon:    { grunon: 1, tranquilo: 1, timido: 0, jugueton: -1, caotico: -2 },
  timido:    { tranquilo: 2, timido: 1, jugueton: 1, grunon: 0, caotico: -1 },
  caotico:   { caotico: 2, jugueton: 2, timido: -1, tranquilo: -2, grunon: -2 }
};
function compatScore(a, b) {
  const x = COMPAT_MATRIX[a] ? COMPAT_MATRIX[a][b] : 0;
  const y = COMPAT_MATRIX[b] ? COMPAT_MATRIX[b][a] : 0;
  return Math.round(((x ?? 0) + (y ?? 0)) / 2);
}

function rollDNA() {
  const species = rnd(EGG_POOL);
  const h = Math.floor(Math.random()*360);
  const natural = ANIMALS.includes(species) && Math.random() < 0.7;
  const color = natural
    ? rnd(NAT_COLORS[species] || ['#f5f0e6','#c9b8a3'])
    : hslToHex(h, 45 + Math.random()*30, 55 + Math.random()*18);
  const markColor = natural ? rnd(['#e8853d','#4a4038','#8a7f72']) : hslToHex((h+160)%360, 50, 45);
  return {
    v: 1, species, color,
    gender: rnd(['hembra', 'macho']),
    accessory: rnd(['none','none','none','none','none','lazo','bufanda']),
    cos: {},
    marking: { type: rnd(['none','patches','belly','patches_belly','patches']), color: markColor },
    temperament: rnd(Object.keys(TEMP_INFO)),
    name: rnd(NAMES),
    seed: Math.floor(Math.random()*1e6)
  };
}
(function () {
  if (window.__slimeforgeInjected) return;
  window.__slimeforgeInjected = true;

  const STORAGE_KEY = 'sf_state';
  const BASE = 150;

  /* ── i18n ligero del comportamiento en página ── */
  const L_STRINGS = {
    es: { mine: '¡Mías! +3 🔥', mine_sock: '¡Mías! +3 🔥 …¿y un 🧦?', box_sock: '🧦 ¡Había un calcetín en la caja!',
          corner: 'A mi rincón, como me enseñaste. 😌', gift_give: 'Toma. Para ti.', gift_thanks: '¡Gracias! 🤍',
          scare_react: '¡¡AAAH!! ¡$N!', scare_laugh: 'Jejeje. Valió la pena.', race_start: '🏁 ¡A la de tres!', race_win: '¡Gané! Como siempre.',
          bond_friends: '¡$A y $B ya son mejores amigos!',
          duel_hi: '¡Eh, tú! Duelo de ingenio. Si te atreves. ⚔️', duel_pick: 'Elige tu réplica:', duel_hit: '¡Zas! Directa.', duel_miss: 'Uy… esa no era.', duel_learn: 'La buena era: «$R»', duel_win: '¡Victoria! +2 🔥', duel_lose: 'Me ha ganado… esta vez. Réplica aprendida.',
          focus_mid: 'Vamos bien. Yo vigilo el Ascua. 🔥', focus_cheer: '¡Sesión completada! Estoy que ardo. 🎉',
          huerto_pick: 'Elige semilla', huerto_no_gotas: 'Nos faltan gotas \u{1F4A7}. \u00a1A pasear y recoger charcos!',
          huerto_water_auto: 'Yo la riego. Este huerto es de los dos. \u{1F4A7}', huerto_smell: '*snif snif* Qu\u00e9 bien huele esta planta.',
          nibble1: 'Yo no he sido. *mastica sospechosamente* \u{1FAD0}', nibble2: 'Vale\u2026 s\u00ed he sido yo. Estaba DELICIOSA.',
          focus_social1: '\u00a1Eh! \u00bfY el foco? El Ascua nos est\u00e1 mirando. \u{1F440}\u{1F525}', focus_social2: 'Esto no parece trabajo\u2026 Vuelve, que la racha es de los dos.', focus_social3: 'Aviso oficial del Departamento de Ascuas: \u00a1a lo tuyo! \u{1F624}',
          hud_sure: '\u00bfSeguro?', focus_done: '\u00a1Sesi\u00f3n completada! La racha crece. \u{1F525}',
          focus_pack1: '$N tiene raz\u00f3n. Aqu\u00ed se trabaja. \u{1F624}', focus_pack2: 'Yo tambi\u00e9n lo he visto. \u00a1Al foco! \u{1F440}', focus_pack3: 'La racha es de toda la manada. Vuelve. \u{1F525}',
          focus_pack_start: '\u00a1Foco de manada! Cada una a su rinc\u00f3n. \u{1F525}', focus_pack_mid: 'Vamos a mitad. La manada aguanta. \u{1F4AA}', focus_pack_done: '\u00a1Lo logramos en manada! \u{1F389}', zoom_yell: '\u00a1\u00a1ZOOM!!', eep: '\u00a1Eep!', personal_space: 'Espacio personal.', sleep_mumble: '\u2026\u00bfmmm? Zzz\u2026', dnd_site: 'Silenciar en este sitio', dnd_hour: 'Pausar 1 hora', dnd_day: 'Ocultar hasta ma\u00f1ana',
          crimen1: '\u00bf$B? \u00bfY esa cara de baya masticada?', crimen2: 'No s\u00e9 de qu\u00e9 me hablas. *traga*', crimen3: '\u00a1El crimen perfecto no existe, te he visto!', crimen4: 'Vale, s\u00ed\u2026 Estaba DELICIOSA. \u{1FAD0}', cameo_visit: '\u00a1$V! Mi humano me ha hablado de ti.' },
    en: { mine: 'Mine! +3 🔥', mine_sock: 'Mine! +3 🔥 …and a 🧦?', box_sock: '🧦 There was a sock in the box!',
          corner: 'To my corner, like you taught me. 😌', gift_give: 'Here. For you.', gift_thanks: 'Thanks! 🤍',
          scare_react: 'AAAH!! $N!', scare_laugh: 'Hehehe. Worth it.', race_start: '🏁 On three!', race_win: 'I won! As always.',
          bond_friends: '$A and $B are now best friends!',
          duel_hi: 'Hey, you! Duel of wits. If you dare. ⚔️', duel_pick: 'Choose your comeback:', duel_hit: 'Zing! Direct hit.', duel_miss: 'Oof… not that one.', duel_learn: 'The right one was: “$R”', duel_win: 'Victory! +2 🔥', duel_lose: 'It beat me… this time. Comeback learned.',
          focus_mid: 'Going strong. I\'m watching the Ember. 🔥', focus_cheer: 'Session complete! I\'m on fire. 🎉',
          huerto_pick: 'Pick a seed', huerto_no_gotas: 'We need more drops \u{1F4A7}. Walk me and grab my puddles!',
          huerto_water_auto: 'I\'ll water it. This garden belongs to both of us. \u{1F4A7}', huerto_smell: '*sniff sniff* This plant smells so good.',
          nibble1: 'It wasn\'t me. *chews suspiciously* \u{1FAD0}', nibble2: 'Okay\u2026 it was me. It was DELICIOUS.',
          focus_social1: 'Hey! What about the focus? The Ember is watching us. \u{1F440}\u{1F525}', focus_social2: 'This doesn\'t look like work\u2026 Come back, the streak belongs to both of us.', focus_social3: 'Official notice from the Ember Department: back to it! \u{1F624}',
          hud_sure: 'Sure?', focus_done: 'Session complete! The streak grows. \u{1F525}',
          focus_pack1: '$N is right. This is work time. \u{1F624}', focus_pack2: 'I saw it too. Back to focus! \u{1F440}', focus_pack3: 'The streak belongs to the whole pack. Come back. \u{1F525}',
          focus_pack_start: 'Pack focus! Everyone to their corner. \u{1F525}', focus_pack_mid: 'Halfway there. The pack holds strong. \u{1F4AA}', focus_pack_done: 'We did it as a pack! \u{1F389}', zoom_yell: 'ZOOM!!', eep: 'Eep!', personal_space: 'Personal space.', sleep_mumble: '\u2026hmm? Zzz\u2026', dnd_site: 'Mute on this site', dnd_hour: 'Pause for 1 hour', dnd_day: 'Hide until tomorrow',
          crimen1: '$B? Why the chewed-berry face?', crimen2: 'No idea what you mean. *swallows*', crimen3: 'The perfect crime doesn\'t exist \u2014 I SAW you!', crimen4: 'Fine, yes\u2026 It was DELICIOUS. \u{1FAD0}', cameo_visit: '$V! My human has told me about you.' },
    de: { mine: 'Meins! +3 🔥', mine_sock: 'Meins! +3 🔥 …und eine 🧦?', box_sock: '🧦 In der Kiste war eine Socke!',
          corner: 'In meine Ecke, wie du es mir beigebracht hast. 😌', gift_give: 'Hier. Für dich.', gift_thanks: 'Danke! 🤍',
          scare_react: 'AAAH!! $N!', scare_laugh: 'Hehehe. Hat sich gelohnt.', race_start: '🏁 Auf drei!', race_win: 'Gewonnen! Wie immer.',
          bond_friends: '$A und $B sind jetzt beste Freunde!',
          duel_hi: 'He, du! Duell der Schlagfertigkeit. Wenn du dich traust. ⚔️', duel_pick: 'Wähle deine Antwort:', duel_hit: 'Zack! Volltreffer.', duel_miss: 'Uff… die war es nicht.', duel_learn: 'Richtig wäre gewesen: „$R“', duel_win: 'Sieg! +2 🔥', duel_lose: 'Es hat mich besiegt… diesmal. Antwort gelernt.',
          focus_mid: 'Läuft gut. Ich passe auf die Glut auf. 🔥', focus_cheer: 'Sitzung geschafft! Ich brenne. 🎉',
          huerto_pick: 'W\u00e4hle einen Samen', huerto_no_gotas: 'Uns fehlen Tropfen \u{1F4A7}. Geh mit mir spazieren und sammle meine Pf\u00fctzen!',
          huerto_water_auto: 'Ich gie\u00dfe sie. Dieser Garten geh\u00f6rt uns beiden. \u{1F4A7}', huerto_smell: '*schn\u00fcffel* Diese Pflanze riecht so gut.',
          nibble1: 'Ich war\'s nicht. *kaut verd\u00e4chtig* \u{1FAD0}', nibble2: 'Okay\u2026 ich war\'s doch. Sie war K\u00d6STLICH.',
          focus_social1: 'He! Und der Fokus? Die Glut schaut uns zu. \u{1F440}\u{1F525}', focus_social2: 'Das sieht nicht nach Arbeit aus\u2026 Komm zur\u00fcck, die Serie geh\u00f6rt uns beiden.', focus_social3: 'Amtliche Mitteilung der Glut-Abteilung: zur\u00fcck an die Arbeit! \u{1F624}',
          hud_sure: 'Sicher?', focus_done: 'Sitzung geschafft! Die Serie w\u00e4chst. \u{1F525}',
          focus_pack1: '$N hat recht. Hier wird gearbeitet. \u{1F624}', focus_pack2: 'Ich habe es auch gesehen. Zur\u00fcck zum Fokus! \u{1F440}', focus_pack3: 'Die Serie geh\u00f6rt dem ganzen Rudel. Komm zur\u00fcck. \u{1F525}',
          focus_pack_start: 'Rudel-Fokus! Alle in ihre Ecke. \u{1F525}', focus_pack_mid: 'Halbzeit. Das Rudel h\u00e4lt durch. \u{1F4AA}', focus_pack_done: 'Als Rudel geschafft! \u{1F389}', zoom_yell: 'ZUUUM!!', eep: 'Iiep!', personal_space: 'Privatsph\u00e4re.', sleep_mumble: '\u2026hmm? Zzz\u2026', dnd_site: 'Auf dieser Seite stumm', dnd_hour: '1 Stunde pausieren', dnd_day: 'Bis morgen ausblenden',
          crimen1: '$B? Warum das Beeren-Kaugesicht?', crimen2: 'Keine Ahnung, wovon du redest. *schluckt*', crimen3: 'Das perfekte Verbrechen gibt es nicht \u2014 ich habe dich GESEHEN!', crimen4: 'Okay, ja\u2026 Sie war K\u00d6STLICH. \u{1FAD0}', cameo_visit: '$V! Mein Mensch hat mir von dir erz\u00e4hlt.' },
    fr: { mine: 'À moi ! +3 🔥', mine_sock: 'À moi ! +3 🔥 …et une 🧦 ?', box_sock: '🧦 Il y avait une chaussette dans la boîte !',
          corner: 'Dans mon coin, comme tu me l\'as appris. 😌', gift_give: 'Tiens. Pour toi.', gift_thanks: 'Merci ! 🤍',
          scare_react: 'AAAH !! $N !', scare_laugh: 'Héhéhé. Ça valait le coup.', race_start: '🏁 À trois !', race_win: 'Gagné ! Comme toujours.',
          bond_friends: '$A et $B sont maintenant meilleurs amis !',
          duel_hi: 'Hé, toi ! Duel d\'esprit. Si tu oses. ⚔️', duel_pick: 'Choisis ta réplique :', duel_hit: 'Paf ! En plein dans le mille.', duel_miss: 'Aïe… ce n\'était pas celle-là.', duel_learn: 'La bonne était : « $R »', duel_win: 'Victoire ! +2 🔥', duel_lose: 'Il m\'a battu… cette fois. Réplique apprise.',
          focus_mid: 'On avance bien. Je veille sur la Braise. 🔥', focus_cheer: 'Session terminée ! Je suis en feu. 🎉',
          huerto_pick: 'Choisis une graine', huerto_no_gotas: 'Il nous manque des gouttes \u{1F4A7}. Prom\u00e8ne-moi et ramasse mes flaques !',
          huerto_water_auto: 'Je m\'en occupe. Ce jardin est \u00e0 nous deux. \u{1F4A7}', huerto_smell: '*snif snif* Cette plante sent si bon.',
          nibble1: 'C\'est pas moi. *m\u00e2che d\'un air suspect* \u{1FAD0}', nibble2: 'Bon\u2026 c\'\u00e9tait moi. Elle \u00e9tait D\u00c9LICIEUSE.',
          focus_social1: 'H\u00e9 ! Et le focus ? La Braise nous regarde. \u{1F440}\u{1F525}', focus_social2: '\u00c7a ne ressemble pas \u00e0 du travail\u2026 Reviens, la s\u00e9rie est \u00e0 nous deux.', focus_social3: 'Avis officiel du D\u00e9partement des Braises : au boulot ! \u{1F624}',
          hud_sure: 'S\u00fbr ?', focus_done: 'Session termin\u00e9e ! La s\u00e9rie grandit. \u{1F525}',
          focus_pack1: '$N a raison. Ici on travaille. \u{1F624}', focus_pack2: 'Je l\'ai vu aussi. Retour au focus\u202f! \u{1F440}', focus_pack3: 'La s\u00e9rie appartient \u00e0 toute la meute. Reviens. \u{1F525}',
          focus_pack_start: 'Focus de meute\u202f! Chacun dans son coin. \u{1F525}', focus_pack_mid: '\u00c0 mi-chemin. La meute tient bon. \u{1F4AA}', focus_pack_done: 'On l\'a fait en meute\u202f! \u{1F389}', zoom_yell: 'ZOOM\u202f!!', eep: 'Iiip\u202f!', personal_space: 'Espace personnel.', sleep_mumble: '\u2026mmh\u202f? Zzz\u2026', dnd_site: 'Couper sur ce site', dnd_hour: 'Pause d\u2019une heure', dnd_day: 'Masquer jusqu\u2019\u00e0 demain',
          crimen1: '$B ? C\'est quoi cette t\u00eate de baie m\u00e2ch\u00e9e ?', crimen2: 'Je ne vois pas de quoi tu parles. *avale*', crimen3: 'Le crime parfait n\'existe pas \u2014 je t\'ai VU !', crimen4: 'Bon, oui\u2026 Elle \u00e9tait D\u00c9LICIEUSE. \u{1FAD0}', cameo_visit: '$V ! Mon humain m\'a parl\u00e9 de toi.' },
    it: { mine: 'Mie! +3 🔥', mine_sock: 'Mie! +3 🔥 …e un 🧦?', box_sock: '🧦 C\'era un calzino nella scatola!',
          corner: 'Nel mio angolino, come mi hai insegnato. 😌', gift_give: 'Tieni. Per te.', gift_thanks: 'Grazie! 🤍',
          scare_react: 'AAAH!! $N!', scare_laugh: 'Eheheh. Ne è valsa la pena.', race_start: '🏁 Al tre!', race_win: 'Ho vinto! Come sempre.',
          bond_friends: '$A e $B ora sono migliori amici!',
          duel_hi: 'Ehi, tu! Duello d\'ingegno. Se hai coraggio. ⚔️', duel_pick: 'Scegli la tua replica:', duel_hit: 'Zac! Colpo diretto.', duel_miss: 'Ahi… non era quella.', duel_learn: 'Quella giusta era: «$R»', duel_win: 'Vittoria! +2 🔥', duel_lose: 'Mi ha battuto… stavolta. Replica imparata.',
          focus_mid: 'Andiamo bene. Io sorveglio la Brace. 🔥', focus_cheer: 'Sessione completata! Sono in fiamme. 🎉',
          huerto_pick: 'Scegli un seme', huerto_no_gotas: 'Ci mancano gocce \u{1F4A7}. Portami a spasso e raccogli le mie pozze!',
          huerto_water_auto: 'La annaffio io. Questo orto \u00e8 di entrambi. \u{1F4A7}', huerto_smell: '*sniff sniff* Questa pianta profuma tantissimo.',
          nibble1: 'Non sono stato io. *mastica in modo sospetto* \u{1FAD0}', nibble2: 'Va bene\u2026 sono stato io. Era DELIZIOSA.',
          focus_social1: 'Ehi! E il focus? La Brace ci sta guardando. \u{1F440}\u{1F525}', focus_social2: 'Questo non sembra lavoro\u2026 Torna, la serie \u00e8 di entrambi.', focus_social3: 'Avviso ufficiale del Dipartimento Braci: al lavoro! \u{1F624}',
          hud_sure: 'Sicuro?', focus_done: 'Sessione completata! La serie cresce. \u{1F525}',
          focus_pack1: '$N ha ragione. Qui si lavora. \u{1F624}', focus_pack2: 'L\'ho visto anch\'io. Torna al focus! \u{1F440}', focus_pack3: 'La serie \u00e8 di tutto il branco. Torna. \u{1F525}',
          focus_pack_start: 'Focus di branco! Ognuno al proprio angolo. \u{1F525}', focus_pack_mid: 'Siamo a met\u00e0. Il branco resiste. \u{1F4AA}', focus_pack_done: 'Ce l\'abbiamo fatta in branco! \u{1F389}', zoom_yell: 'ZOOM!!', eep: 'Iiip!', personal_space: 'Spazio personale.', sleep_mumble: '\u2026mmh? Zzz\u2026', dnd_site: 'Silenzia su questo sito', dnd_hour: 'Pausa di 1 ora', dnd_day: 'Nascondi fino a domani',
          crimen1: '$B? E quella faccia da bacca masticata?', crimen2: 'Non so di cosa parli. *ingoia*', crimen3: 'Il crimine perfetto non esiste \u2014 ti ho VISTO!', crimen4: 'Va bene, s\u00ec\u2026 Era DELIZIOSA. \u{1FAD0}', cameo_visit: '$V! Il mio umano mi ha parlato di te.' },
    pt: { mine: 'Minhas! +3 🔥', mine_sock: 'Minhas! +3 🔥 …e uma 🧦?', box_sock: '🧦 Havia uma meia na caixa!',
          corner: 'Para o meu cantinho, como me ensinaste. 😌', gift_give: 'Toma. Para ti.', gift_thanks: 'Obrigado! 🤍',
          scare_react: 'AAAH!! $N!', scare_laugh: 'Hehehe. Valeu a pena.', race_start: '🏁 À de três!', race_win: 'Ganhei! Como sempre.',
          bond_friends: '$A e $B agora são melhores amigos!',
          duel_hi: 'Eh, tu! Duelo de engenho. Se te atreves. ⚔️', duel_pick: 'Escolhe a tua réplica:', duel_hit: 'Zás! Direta.', duel_miss: 'Ui… não era essa.', duel_learn: 'A certa era: «$R»', duel_win: 'Vitória! +2 🔥', duel_lose: 'Ganhou-me… desta vez. Réplica aprendida.',
          focus_mid: 'Vamos bem. Eu vigio a Brasa. 🔥', focus_cheer: 'Sessão completa! Estou a arder. 🎉',
          huerto_pick: 'Escolhe uma semente', huerto_no_gotas: 'Faltam-nos gotas \u{1F4A7}. Passeia comigo e apanha as minhas po\u00e7as!',
          huerto_water_auto: 'Eu rego-a. Esta horta \u00e9 dos dois. \u{1F4A7}', huerto_smell: '*snif snif* Esta planta cheira t\u00e3o bem.',
          nibble1: 'N\u00e3o fui eu. *mastiga de forma suspeita* \u{1FAD0}', nibble2: 'Est\u00e1 bem\u2026 fui eu. Estava DELICIOSA.',
          focus_social1: 'Eh! E o foco? A Brasa est\u00e1 a olhar para n\u00f3s. \u{1F440}\u{1F525}', focus_social2: 'Isto n\u00e3o parece trabalho\u2026 Volta, a sequ\u00eancia \u00e9 dos dois.', focus_social3: 'Aviso oficial do Departamento das Brasas: ao trabalho! \u{1F624}',
          hud_sure: 'De certeza?', focus_done: 'Sess\u00e3o conclu\u00edda! A sequ\u00eancia cresce. \u{1F525}',
          focus_pack1: '$N tem raz\u00e3o. Aqui trabalha-se. \u{1F624}', focus_pack2: 'Eu tamb\u00e9m vi. De volta ao foco! \u{1F440}', focus_pack3: 'A sequ\u00eancia \u00e9 de toda a matilha. Volta. \u{1F525}',
          focus_pack_start: 'Foco de matilha! Cada um para o seu cantinho. \u{1F525}', focus_pack_mid: 'Vamos a meio. A matilha aguenta. \u{1F4AA}', focus_pack_done: 'Conseguimos em matilha! \u{1F389}', zoom_yell: 'ZUUUM!!', eep: 'Iip!', personal_space: 'Espa\u00e7o pessoal.', sleep_mumble: '\u2026hmm? Zzz\u2026', dnd_site: 'Silenciar neste site', dnd_hour: 'Pausar 1 hora', dnd_day: 'Ocultar at\u00e9 amanh\u00e3',
          crimen1: '$B? E essa cara de baga mastigada?', crimen2: 'N\u00e3o sei do que falas. *engole*', crimen3: 'O crime perfeito n\u00e3o existe \u2014 eu VI-te!', crimen4: 'Est\u00e1 bem, sim\u2026 Estava DELICIOSA. \u{1FAD0}', cameo_visit: '$V! O meu humano falou-me de ti.' }
  };
  function uiLangC() {
    // 'pt_PT' (selector/_locales) → 'pt' (bancos runtime): 2 letras SIEMPRE
    const l = ((S && S.uiLang) || navigator.language || 'es').slice(0, 2);
    return L_STRINGS[l] ? l : 'es';
  }
  function L(key, subs) {
    let m = (L_STRINGS[uiLangC()] || L_STRINGS.es)[key] || L_STRINGS.es[key] || key;
    if (subs) Object.entries(subs).forEach(([k, v]) => { m = m.split('$' + k).join(String(v)); });
    return m;
  }

  let S = null, host = null, root = null, wrap = null, svgEl = null, bubbleEl = null, shieldEl = null, shieldAttemptKey = '';
  let x = Math.max(80, window.innerWidth * 0.3);
  let dir = 1, mode = 'idle', targetX = x, modeUntil = 0;
  let dragging = false, dragMoved = false, lift = 0;
  let rafId = 0, lastSigC = '', running = false;
  let ev = null;                       // evento activo {type, until, ...}
  let visit = null;                    // visitante en página {node, vx, sz, av, phase, greeted}
  let hop = null, hopPause = 0, hopCount = 0, nextDrip = 0, puddles = [];
  let reactCd = 0, mx = null, my = null, idleHopAt = 0;
  let packEv = null, nextPackAt = 0;
  let focusCheered = false;          // ánimo de mitad de sesión, una vez por foco
  let exprFx = null, exprFxUntil = 0;   // expresión de reacción temporal (caricia, duelo…)
  let peekUntil = 0, nextMicroAt = performance.now() + 18000;   // micro-gestos de idle
  let gardenEl = null, gardenSig = '', seedBox = null;             // huerto en pantalla (v0.38)
  let gardenRun = null, nextGardenAt = 0;                          // riego auto / mordisco del conejo
  let nextScoldAt = 0, scoldN = 0, scoldPoseUntil = 0;             // aviso de redes durante el foco
  let packScoldIdx = 0;                                            // rota las frases de la manada en el foco (v0.45)
  let lastFocusOnAt = -1e9;                                        // histéresis: absorbe parpadeos del estado de foco (v0.45.1)
  let savedPos = null, nextPosSaveAt = 0;
  let deskForce = null;                                            // demo: fuerza la pieza del escritorio (0 portátil / 1 libro / 2 café)                          // continuidad de posiciones entre recargas (v0.45.3)
  let dndTimer = 0;
  function dndActive() {
    // No molestar: pausa global con vencimiento (until) o lista negra de
    // sitios. La sesión de foco en curso NUNCA se cancela — solo se oculta
    // la presencia visual (mascota, HUD, huerto) en esta página.
    const d = S && S.dnd;
    if (!d) return false;
    if (d.until && d.until > Date.now()) return true;
    return Array.isArray(d.sites) && d.sites.indexOf(location.hostname) !== -1;
  }
  function applyDnd() {
    clearTimeout(dndTimer);
    const off = dndActive();
    if (host) host.style.display = off ? 'none' : '';
    if (off) stop(); else start();
    const d = S && S.dnd;
    if (off && d && d.until && d.until > Date.now() && !(Array.isArray(d.sites) && d.sites.indexOf(location.hostname) !== -1)) {
      dndTimer = setTimeout(applyDnd, Math.min(d.until - Date.now() + 500, 2147000000));   // reaparece solo al vencer
    }
  }
  function savePos() {
    // guarda dónde está cada bicho como fracción del ancho (cada página tiene
    // su viewport) en storage.session: en memoria, compartido entre pestañas,
    // se olvida al cerrar el navegador. Falla en silencio si no está accesible.
    if (!S || S.phase !== 'pet' || !wrap || !window.innerWidth) return;
    try {
      const seeds = {};
      comps.forEach(c => { seeds[c.seed] = { f: c.x / window.innerWidth, dir: c.dir }; });
      chrome.storage.session.set({ sf_pos: { active: { seed: S.dna && S.dna.seed, f: x / window.innerWidth, dir }, seeds, t: Date.now() } });
    } catch (e) {}
  }
  let hudEl = null, hudSig = '', hudEls = null, hudConfirmAt = 0;  // HUD del temporizador de foco (v0.39)
  let hudDrag = null, hudMoved = false;                            // arrastre del HUD (v0.41)
  let prevFocus = null;                                            // para celebrar sesiones completadas
  let lastDir = 1, turnUntil = 0;       // squash al girar
  let shEl = null;                      // sombra interna, anclada al suelo en saltos
  /* Reacción facial temporal: re-renderiza con la expresión y la limpia sola. */
  function react(name, ms) {
    exprFx = name; exprFxUntil = Date.now() + ms;
    render(true);
    setTimeout(() => { if (Date.now() >= exprFxUntil) { exprFx = null; render(true); } }, ms + 40);
  }
  /* Micro-gestos de idle: mirar alrededor, ladearse, estirarse. Vida en reposo. */
  function microGesture(now) {
    nextMicroAt = now + 12000 + Math.random() * 22000;
    const g = ['tilt', 'stretchy', 'peek'][Math.floor(Math.random() * 3)];
    if (g === 'peek') return peekAround();
    wrap.classList.add('sf-' + g);
    setTimeout(() => wrap && wrap.classList.remove('sf-' + g), 1350);
  }
  function peekAround() {
    peekUntil = Date.now() + 1600;
    const f = svgEl && svgEl.querySelector('.eyes-follow');
    if (!f) return;
    f.style.transition = 'transform .35s ease';
    f.style.transform = 'translate(-3px,0.5px)';
    setTimeout(() => { if (f.isConnected) f.style.transform = 'translate(3px,0.5px)'; }, 650);
    setTimeout(() => { if (f.isConnected) { f.style.transform = ''; f.style.transition = ''; } }, 1350);
  }
  let hopSx = 1, hopSy = 1, landUntil = 0, landQ = 0;
  let nextEventAt = performance.now() + eventDelay();
  let nextSoloAt = performance.now() + soloDelay();
  let bubbleUntil = 0;

  function eventDelay() {
    const demo = S && S.demoMode;
    return demo ? 25000 + Math.random() * 35000 : 140000 + Math.random() * 200000;   // v0.37: 2,3-5,6 min (antes 4-9)
  }
  function soloDelay() {
    const demo = S && S.demoMode;
    // Pensamientos en solitario: más espaciados que los eventos, para que
    // sigan siendo una sorpresa y no una muletilla de "algo tenía que decir".
    return demo ? 20000 + Math.random() * 20000 : 180000 + Math.random() * 240000;
  }
  async function soloThought(now) {
    nextSoloAt = now + soloDelay();
    if (!S || !S.dna) return;
    const usePage = Math.random() < 0.35 && document.title && document.title.trim().length > 3;
    let line = null;
    try {
      line = await chrome.runtime.sendMessage({
        type: 'sf-line',
        ctx: usePage
          ? 'Estás en la pantalla de tu humano. El título de la página que está mirando es: «' + document.title.slice(0, 90) + '». Suelta una impresión muy breve sobre ello, con tu personalidad (no hace falta que sea literal).'
          : 'No hay nadie más cerca ahora mismo. Suelta un pensamiento suelto muy breve, con tu personalidad, como quien piensa en voz alta.'
      });
    } catch (e) {}
    if (typeof line === 'string' && line) say(line, 3600);
    else {
      const sl = Math.random() < 0.4 ? spLine(S.dna, uiLangC()) : null;
      if (sl) say(sl, 3200);
      else if (Math.random() < 0.5) say(phrase(), 3200);
    }
  }

  const SHADOW_CSS = [
    '.sf-wrap{position:fixed;bottom:0;left:0;transform-origin:50% 100%;cursor:grab;user-select:none;will-change:transform;}',
    '.sf-wrap:active{cursor:grabbing;}',
    '.sf-wrap svg{display:block;pointer-events:auto;overflow:visible;}',
    '.sf-visitor svg,.sf-wild svg{overflow:visible;}',
    '.sf-bubble{position:fixed;background:#fdfaf3;color:#2a2620;border:2px solid #4a4038;border-radius:12px;padding:6px 11px;font:600 13px system-ui,sans-serif;max-width:230px;opacity:0;transition:opacity .25s;pointer-events:none;transform:translateX(-50%);z-index:2;}',
    '.sf-bubble.show{opacity:1;}',
    '.sf-bubble::after{content:"";position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);border:8px solid transparent;border-top-color:#4a4038;border-bottom:0;}',
    '.sf-laser{position:fixed;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle,#ff5a4d,#c81e12);box-shadow:0 0 12px 4px rgba(255,70,50,.55);cursor:pointer;z-index:3;}',
    '.sf-wild{position:fixed;bottom:0;cursor:pointer;z-index:1;}',
    '.sf-duelbox{position:fixed;left:50%;transform:translateX(-50%);bottom:130px;z-index:2147483646;background:#16181d;border:2px solid #e8a33d;border-radius:14px;padding:12px 14px;max-width:340px;font:13px/1.4 system-ui,sans-serif;color:#eee;box-shadow:0 8px 30px rgba(0,0,0,.5);}',
    '.sf-duelbox .dq{color:#e8a33d;font-weight:700;margin-bottom:8px;}',
    '.sf-duelbox button{display:block;width:100%;margin:6px 0;padding:8px 10px;background:#22252c;color:#eee;border:1px solid #3a3e48;border-radius:9px;cursor:pointer;text-align:left;font:12px/1.35 system-ui,sans-serif;}',
    '.sf-duelbox button:hover{border-color:#e8a33d;}',
    '.sf-box{position:fixed;bottom:0;font-size:52px;z-index:0;transform:translateX(-50%);transition:transform .2s;}',
    '.sf-box.wob{animation:boxwob .5s ease-in-out infinite;}',
    '@keyframes boxwob{0%,100%{transform:translateX(-50%) rotate(0)}50%{transform:translateX(-50%) rotate(4deg)}}',
    '.squish{animation:sq 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%;}',
    '@keyframes sq{0%,100%{transform:scale(1,1)}50%{transform:scale(1.045,0.94)}}',
    '.walking .squish{animation:walkbob .38s ease-in-out infinite !important;}',
    '@keyframes walkbob{0%,100%{transform:translateY(0) scale(1,1)}50%{transform:translateY(-5px) scale(0.98,1.03)}}',
    '.walking .species-pinguino{animation:waddleWalk .42s ease-in-out infinite !important;}',
    '.walking .species-conejo{animation:rabbitWalk .48s cubic-bezier(.25,.8,.35,1) infinite !important;}',
    '.walking .species-axolotl,.walking .species-kraken{animation:aquaWalk .52s ease-in-out infinite !important;}',
    '.walking .species-panda{animation:pandaWalk .56s ease-in-out infinite !important;}',
    '.walking .species-kitsune,.walking .species-zorro{animation:foxWalk .34s ease-in-out infinite !important;}',
    '.walking .species-hada,.walking .species-fenix,.walking .species-fantasma{animation:hoverWalk .46s ease-in-out infinite !important;}',
    '@keyframes waddleWalk{0%,100%{transform:translateY(0) rotate(-4deg) scale(1.02,.98)}50%{transform:translateY(-3px) rotate(4deg) scale(.98,1.02)}}',
    '@keyframes rabbitWalk{0%,100%{transform:translateY(1px) scale(1.06,.93)}45%{transform:translateY(-10px) scale(.96,1.04)}75%{transform:translateY(0) scale(1.1,.9)}}',
    '@keyframes aquaWalk{0%,100%{transform:translateX(-2px) scale(1.05,.96)}50%{transform:translateX(2px) translateY(-3px) scale(.96,1.04)}}',
    '@keyframes pandaWalk{0%,100%{transform:translateY(0) rotate(-3deg) scale(1.04,.96)}50%{transform:translateY(-4px) rotate(3deg) scale(.97,1.03)}}',
    '@keyframes foxWalk{0%,100%{transform:translateY(0) skewX(-2deg) scale(1.02,.98)}50%{transform:translateY(-6px) skewX(2deg) scale(.98,1.02)}}',
    '@keyframes hoverWalk{0%,100%{transform:translateY(-2px) scale(1)}50%{transform:translateY(-9px) scale(.99,1.02)}}',
    '.zoom .squish{animation:walkbob .16s ease-in-out infinite !important;}',
    '.land .squish{animation:land .3s ease-out !important;}',
    '.hop .squish{animation:hopP .5s ease-out !important;}',
    '.sleeping .squish{animation-duration:5.2s !important;}',
    '@keyframes hopP{0%,100%{transform:translateY(0) scale(1,1)}45%{transform:translateY(-14px) scale(1.02,.98)}70%{transform:translateY(0) scale(1.08,.9)}}',
    '@keyframes land{0%{transform:scale(1.18,0.78)}100%{transform:scale(1,1)}}',
    '.ember{transform-box:fill-box;transform-origin:50% 100%;}',
    '.flame-outer{animation:flick 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%;}',
    '.flame-mid{animation:flick 1.2s ease-in-out infinite .15s;transform-box:fill-box;transform-origin:50% 100%;}',
    '.flame-inner{animation:flick 0.9s ease-in-out infinite .3s;transform-box:fill-box;transform-origin:50% 100%;}',
    '@keyframes flick{0%,100%{transform:scaleX(1) scaleY(1) rotate(0)}25%{transform:scaleX(.88) scaleY(1.12) rotate(-3deg)}50%{transform:scaleX(1.06) scaleY(.92) rotate(2deg)}75%{transform:scaleX(.92) scaleY(1.08) rotate(-2deg)}}',
    '.focusing .flame-outer{animation-duration:.7s;}',
    '.focusing .flame-mid{animation-duration:.5s;}',
    '.focusing .flame-inner{animation-duration:.35s;}',
    '.sf-garden{position:fixed;right:14px;bottom:0;display:flex;gap:6px;z-index:1;transition:opacity .2s;}',
    '.sf-plot{pointer-events:auto;cursor:pointer;}',
    '.sf-plot svg{display:block;overflow:visible;}',
    '.sf-plot.thirsty{cursor:url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2228%22 height=%2228%22 viewBox=%220 0 28 28%22><path d=%22M9 12 h10 v8 a2.5 2.5 0 0 1 -2.5 2.5 h-5 A2.5 2.5 0 0 1 9 20 Z%22 fill=%22%236ea8e0%22 stroke=%22%233a5f8a%22 stroke-width=%222.2%22 stroke-linejoin=%22round%22/><path d=%22M9 14 L4 9 l-1.6 2 M4 9 l2.4 -1.4%22 fill=%22none%22 stroke=%22%233a5f8a%22 stroke-width=%222.2%22 stroke-linecap=%22round%22/><path d=%22M19 14 q5.5 -0.5 4.5 -5.5%22 fill=%22none%22 stroke=%22%233a5f8a%22 stroke-width=%222.4%22/><circle cx=%222.6%22 cy=%2214.4%22 r=%221.3%22 fill=%22%236ea8e0%22/><circle cx=%224.8%22 cy=%2217%22 r=%221.1%22 fill=%22%236ea8e0%22/></svg>") 4 22, pointer;}',
    '.sf-seedbox{left:auto;right:14px;bottom:76px;transform:none;max-width:240px;}',
    '.sf-seedbox button{text-align:center;font-size:14px;}',
    '.sf-fhud{position:fixed;left:14px;bottom:12px;display:flex;align-items:center;gap:7px;background:rgba(22,24,29,.92);border:1px solid #2a2e36;border-radius:999px;padding:5px 10px 5px 6px;pointer-events:auto;z-index:3;font:600 13px/1 system-ui,sans-serif;color:#e6e9ef;box-shadow:0 4px 14px rgba(0,0,0,.35);transition:opacity .2s;}',
    '.sf-fhud.idle{padding:0;background:transparent;border:none;box-shadow:none;}',
    '.sf-fhud .fh-menu{position:absolute;left:0;bottom:calc(100% + 8px);display:flex;flex-direction:column;gap:4px;background:rgba(22,24,29,.96);border:1px solid #2a2e36;border-radius:12px;padding:6px;min-width:200px;box-shadow:0 6px 18px rgba(0,0,0,.4);}',
    '.sf-fhud .fh-mi{all:unset;cursor:pointer;font:600 12px/1.2 system-ui,sans-serif;color:#e6e9ef;padding:7px 9px;border-radius:8px;text-align:left;}',
    '.sf-fhud .fh-mi:hover{background:#2a2e36;}',
    '.sf-fhud .fh-dnd{opacity:.55;}','.sf-fhud .fh-dnd:hover{opacity:1;}',
    '.sf-fhud .fh-ring{display:block;}',
    '.sf-fhud .fh-ringwrap{position:relative;display:block;line-height:0;}',
    '.sf-fhud .fh-ico{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:12px;pointer-events:none;}',
    '.sf-fhud .fh-time{min-width:44px;text-align:center;font-variant-numeric:tabular-nums;font-size:14px;}',
    '.sf-fhud .fh-goal{max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:600 12px/1.2 system-ui,sans-serif;color:#d7d9df;}',
    '.fh-btn{pointer-events:auto;cursor:pointer;background:#22252c;border:1px solid #3a3f4a;color:#e6e9ef;border-radius:999px;padding:5px 9px;font:600 12px system-ui,sans-serif;}',
    '.fh-btn:hover{border-color:#e8a33d;}',
    '.fh-btn.warn{background:#5a2323;border-color:#c85050;}',
    '.fh-start{background:rgba(22,24,29,.85);border:1px solid #2a2e36;padding:8px 13px;font-size:13px;box-shadow:0 4px 14px rgba(0,0,0,.35);}',
    '.fd-cur{animation:fdblink 1.1s steps(1) infinite;}',
    '@keyframes fdblink{0%,55%{opacity:1}56%,100%{opacity:0}}',
    '.fd-l1,.fd-l2,.fd-l3{transform-box:fill-box;transform-origin:0 50%;animation:fdtype 4.2s ease-in-out infinite;}',
    '.fd-l2{animation-delay:.6s}',
    '.fd-l3{animation-delay:1.3s}',
    '@keyframes fdtype{0%{transform:scaleX(.2)}45%,82%{transform:scaleX(1)}100%{transform:scaleX(.2)}}',
    '.fd-glow{animation:fdglow 3.2s ease-in-out infinite;}',
    '@keyframes fdglow{0%,100%{opacity:.05}50%{opacity:.13}}',
    '.fd-page{transform-box:fill-box;transform-origin:0% 50%;animation:fdflip 4.6s ease-in-out infinite;}',
    '@keyframes fdflip{0%,20%{transform:scaleX(1)}46%{transform:scaleX(.05)}54%{transform:scaleX(-.05)}80%,100%{transform:scaleX(-1)}}',
    '.fd-pen{transform-box:fill-box;transform-origin:20% 88%;animation:fdpen 1.4s ease-in-out infinite;}',
    '@keyframes fdpen{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(5deg) translateX(2.5px)}}',
    '.fd-drop{transform-box:fill-box;transform-origin:50% 100%;animation:fddrop 1.5s ease-in-out infinite;}',
    '@keyframes fddrop{0%,100%{transform:scale(1)}50%{transform:scale(1.18);opacity:.75}}',
    '.fd-spark{animation:fdspark 1.8s ease-in-out infinite;}',
    '.cos-orbit{transform-box:fill-box;transform-origin:50% 50%;animation:cosorbit 14s linear infinite;}',
    '@keyframes cosorbit{from{transform:rotate(0)}to{transform:rotate(360deg)}}',
    '.cos-halo{transform-box:fill-box;transform-origin:50% 50%;animation:coshalo 3.4s ease-in-out infinite;}',
    '@keyframes coshalo{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}',
    '.cos-wingflap{transform-box:fill-box;transform-origin:50% 40%;animation:coswing 2.6s ease-in-out infinite;}',
    '@keyframes coswing{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.93)}}',
    '@keyframes fdspark{0%,100%{opacity:1}50%{opacity:.35}}',
    '.eyes{animation:blink 4.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%;}',
    '@keyframes blink{0%,94%,100%{transform:scaleY(1)}96%,98%{transform:scaleY(.08)}}',
    '.wingL{animation:fL 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:100% 50%;}',
    '.wingR{animation:fR 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:0% 50%;}',
    '@keyframes fL{0%,100%{transform:rotate(0)}50%{transform:rotate(-11deg)}}',
    '@keyframes fR{0%,100%{transform:rotate(0)}50%{transform:rotate(11deg)}}',
    '.wag{animation:wag .7s ease-in-out infinite;transform-box:fill-box;transform-origin:0% 100%;}',
    '@keyframes wag{0%,100%{transform:rotate(0)}50%{transform:rotate(9deg)}}',
    '.smoke1{animation:smk 2.4s ease-in-out infinite;}',
    '.smoke2{animation:smk 2.4s ease-in-out infinite .4s;}',
    '@keyframes smk{0%{opacity:0;transform:translateY(2px)}40%{opacity:.55}100%{opacity:0;transform:translateY(-9px)}}',
    '.ghostfloat{animation:gf 3.2s ease-in-out infinite;}',
    '@keyframes gf{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}',
    '.pooping .squish{animation:effort .9s ease-in-out !important;}',
    '@keyframes effort{0%{transform:scale(1,1)}22%{transform:scale(1.07,.86) rotate(-1.6deg)}40%{transform:scale(1.07,.86) rotate(1.6deg)}58%{transform:scale(1.08,.85) rotate(-1.6deg)}80%{transform:scale(1.12,.8)}100%{transform:scale(1,1)}}',
    '.sf-visitor{position:fixed;bottom:0;z-index:1;pointer-events:none;}',
    '.sf-comp{position:fixed;bottom:0;left:0;transform-origin:50% 100%;cursor:pointer;z-index:0;will-change:transform;}',
    '.sf-comp svg{overflow:visible;display:block;}',
    '.sf-drop{position:fixed;pointer-events:none;z-index:0;border-radius:50% 50% 62% 62%;}',
    '.sf-puddle{position:fixed;bottom:1px;pointer-events:auto;cursor:pointer;z-index:2;border-radius:50%;transform:translateX(-50%) scaleY(0.32);}',
    '.sf-poop{position:fixed;bottom:0;cursor:pointer;z-index:1;transform:translateX(-50%);}',
    '.sf-poop.pop{animation:ppin .45s cubic-bezier(.2,1.8,.4,1);transform-origin:50% 100%;}',
    '@keyframes ppin{0%{transform:translateX(-50%) scale(0)}100%{transform:translateX(-50%) scale(1)}}',
    '.sf-part{position:fixed;font-size:18px;pointer-events:none;animation:hf 1s ease-out forwards;z-index:4;}',
    '.sf-shield{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:2147483647;pointer-events:auto;background:rgba(11,13,17,.42);font:14px/1.45 system-ui,sans-serif;color:#f4f1eb;}',
    '.sf-shield.gentle{align-items:flex-start;justify-content:flex-end;background:transparent;padding:18px;}',
    '.sf-shield-card{width:min(390px,calc(100vw - 36px));background:#171a20;border:2px solid #e8a33d;border-radius:18px;padding:18px;box-shadow:0 16px 55px rgba(0,0,0,.55);}',
    '.sf-shield-card h2{margin:0 0 6px;font-size:20px;color:#f0b75e}.sf-shield-card p{margin:5px 0 14px;color:#d5d1c9}.sf-shield-actions{display:flex;flex-wrap:wrap;gap:7px}.sf-shield-actions button{cursor:pointer;border:1px solid #444b58;border-radius:10px;background:#252a33;color:#f4f1eb;padding:8px 11px;font-weight:650}.sf-shield-actions button:first-child{background:#d9922f;color:#15120d;border-color:#f0b75e}',
    '.sf-wrap svg{display:block;overflow:visible;transform-origin:50% 100%;}',
    '.sf-tilt svg{animation:sftilt 1.3s ease-in-out;}',
    '@keyframes sftilt{0%,100%{transform:rotate(0)}30%{transform:rotate(-4.5deg)}70%{transform:rotate(4deg)}}',
    '.sf-stretchy .squish{animation:sfstr 1s ease-in-out !important;}',
    '@keyframes sfstr{0%,100%{transform:scale(1,1)}40%,60%{transform:scale(.93,1.1)}}',
    '.sf-wiggle .squish{animation:sfwig .85s ease-in-out !important;}',
    '@keyframes sfwig{0%,100%{transform:rotate(0) scale(1,1)}25%{transform:rotate(-3.5deg) scale(1.03,.97)}50%{transform:rotate(3.5deg) scale(.98,1.02)}75%{transform:rotate(-2deg) scale(1.01,.99)}}',
    '@keyframes hf{0%{opacity:1;transform:translateY(0) scale(.8)}100%{opacity:0;transform:translateY(-40px) scale(1.25)}}',
    '@media (prefers-reduced-motion:reduce){*{animation:none !important;}}'
  ].join('\n');

  const STAGE_FRAC = [0.05, 0.12, 0.22, 0.45, 0.90];   // fracción del alto de pantalla por etapa (GDD: la Colosal lo llena)
  function sizePx() {
    const pct = (S.sizePct || 100) / 100;
    const i = S.stageIdx, st = STAGES[i];
    let frac = STAGE_FRAC[i] || 0.2;
    if (st && st.next != null && STAGE_FRAC[i + 1] != null && S.growth != null) {
      // crecimiento continuo: interpola la fracción de pantalla entre etapas
      const prev = i > 0 ? STAGES[i - 1].next : 0;
      const k = Math.max(0, Math.min(1, (S.growth - prev) / (st.next - prev)));
      frac = frac + (STAGE_FRAC[i + 1] - frac) * k;
    }
    const nat = window.innerHeight * frac;
    return Math.max(44, Math.min(window.innerHeight * 0.95, Math.round(nat * pct)));
  }
  function sigC() { return [S.stageIdx, S.focus ? (S.focus.kind || 'work') + (S.focus.startedAt || 0) : 0, !!S.sick, isAsleepC(), S.animo < 30, S.animo > 85, dirtLevel(), Math.round(sizePx() / 10), S.dna && (S.dna.seed + '-' + S.dna.accessory + '-' + (S.dna.cos ? Object.values(S.dna.cos).join('.') : ''))].join('|'); }
  function part(emoji, px, py) {
    const p = document.createElement('div');
    p.className = 'sf-part'; p.textContent = emoji;
    p.style.left = px + 'px'; p.style.top = py + 'px';
    root.appendChild(p); setTimeout(() => p.remove(), 1000);
  }
  function say(text, ms) {
    if (!bubbleEl) return;
    bubbleEl.textContent = text;
    bubbleEl.classList.add('show');
    bubbleUntil = performance.now() + (ms || 3800);
  }
  function phrase() {
    const src = phraseBank(uiLangC());
    const bank = src[S.dna.temperament] || src.tranquilo;
    return bank[Math.floor(Math.random() * bank.length)];
  }
  async function speakSmart(ctx) {
    let line = null;
    try { line = await chrome.runtime.sendMessage({ type: 'sf-line', ctx }); } catch (e) {}
    say((typeof line === 'string' && line) ? line : phrase());
  }
  function dirtLevel() { return S.higiene > 70 ? 0 : S.higiene > 50 ? 1 : S.higiene > 30 ? 2 : 3; }

  /* ── popó en la página ── */
  const POOP_SVG = '<svg viewBox="0 0 70 50" width="46" height="33">' +
    '<ellipse cx="35" cy="45" rx="16" ry="4" fill="#000" opacity="0.2"/>' +
    '<path d="M35,8 q8,2 7,9 q7,1 6,8 q0,8 -13,8 q-13,0 -13,-8 q-1,-7 6,-8 q-1,-7 7,-9 Z" fill="#8a6a4a" stroke="#5e4630" stroke-width="3" stroke-linejoin="round"/>' +
    '<circle cx="31" cy="23" r="1.8" fill="#3c2d1e"/><circle cx="39" cy="23" r="1.8" fill="#3c2d1e"/></svg>';
  let pagePoops = [], knownPoops = -1, poopAnimBusy = false;
  function clampX(px) { return Math.max(40, Math.min(window.innerWidth - 40, px)); }
  function addPagePoop(px, pop) {
    const el = document.createElement('div');
    el.className = 'sf-poop' + (pop ? ' pop' : '');
    el.innerHTML = POOP_SVG;
    el.style.left = clampX(px) + 'px';
    el.addEventListener('pointerdown', e => {
      e.stopPropagation();
      part('✨', e.clientX - 9, e.clientY - 26);
      try { chrome.runtime.sendMessage({ type: 'sf-clean' }); } catch (err) {}
    });
    root.appendChild(el);
    pagePoops.push(el);
  }
  function playPagePoopShow() {
    if (poopAnimBusy || !wrap) { syncPoopsSilent(); return; }
    poopAnimBusy = true;
    wrap.classList.add('pooping');
    setTimeout(() => {
      if (wrap) wrap.classList.remove('pooping');
      const edu = (S.educacion || 30) >= 70;
      addPagePoop(edu ? 70 : x - dir * (sizePx() * 0.45 + 16), true);
      if (edu) say(L('corner'), 2600);
      part('💨', clampX(x - dir * 34), window.innerHeight - sizePx() * 0.45);
      knownPoops = S.poops;
      poopAnimBusy = false;
      if (Math.random() < 0.5) say(phrase());
    }, 900);
  }
  function syncPoopsSilent() {
    const n = S.poops || 0;
    const edu = (S.educacion || 30) >= 70;
    while (pagePoops.length < n) addPagePoop(edu ? 70 + pagePoops.length * 50 : x + (pagePoops.length ? -1 : 1) * (60 + Math.random() * 80), false);
    while (pagePoops.length > n) { const el = pagePoops.pop(); if (el) el.remove(); }
    knownPoops = n;
  }
  function syncPoops() {
    if (!root) return;
    const n = S.poops || 0;
    if (knownPoops < 0) { syncPoopsSilent(); return; }
    if (n > knownPoops) playPagePoopShow();
    else if (n < knownPoops) syncPoopsSilent();
  }

  function mount() {
    if (host) return;
    host = document.createElement('div');
    host.id = 'slimeforge-host';
    host.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;z-index:2147483647;';
    root = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = SHADOW_CSS;
    root.appendChild(style);
    wrap = document.createElement('div');
    wrap.className = 'sf-wrap';
    wrap.innerHTML = '<svg viewBox="0 0 200 200"></svg>';
    root.appendChild(wrap);
    bubbleEl = document.createElement('div');
    bubbleEl.className = 'sf-bubble';
    root.appendChild(bubbleEl);
    svgEl = wrap.querySelector('svg');
    (document.body || document.documentElement).appendChild(host);
    wrap.addEventListener('pointerdown', onDown);
    window.addEventListener('mousemove', onEyes, { passive: true });
  }
  function unmount() {
    if (!host) return;
    if (shieldEl) { shieldEl.remove(); shieldEl = null; }
    window.removeEventListener('mousemove', onEyes);
    endEvent();
    if (visit) { visit.node.remove(); visit = null; }
    packEv = null;
    comps.forEach(c => c.node.remove()); comps.length = 0;
    puddles.forEach(el => el.remove());
    puddles = []; hop = null;
    pagePoops.forEach(el => el.remove());
    pagePoops = []; knownPoops = -1;
    if (gardenEl) { gardenEl.remove(); gardenEl = null; gardenSig = ''; }
    if (hudEl) { hudEl.remove(); hudEl = null; hudSig = ''; hudEls = null; }
    closeSeedPick(); gardenRun = null;
    host.remove();
    host = root = wrap = svgEl = bubbleEl = null;
  }
  function render(force) {
    if (!S || S.phase !== 'pet') { unmount(); return; }
    mount();
    renderGarden();
    renderFocusHud();
    renderShieldOverlay();
    const s = sigC();
    if (!force && s === lastSigC) return;
    lastSigC = s;
    svgEl.innerHTML = buildCreature(S.dna, S.stageIdx, { dirtLvl: dirtLevel(), poops: 0, focusing: !!S.focus, focusSeed: (S.focus && S.focus.kind !== 'break') ? (deskForce != null ? deskForce * 1000 : S.focus.startedAt) : 0, mood: S.animo, sick: !!S.sick, sleeping: isAsleepC(), expr: exprFxUntil > Date.now() ? exprFx : undefined, growth: S.growth });
    shEl = svgEl.querySelector('.sf-shdw');
    const px = sizePx();
    svgEl.setAttribute('width', px);
    svgEl.setAttribute('height', px);
    wrap.style.width = px + 'px';
  }

  /* ═══════════ EVENTOS ALEATORIOS ═══════════ */
  function startEvent() {
    if (S && S.quietMode) return;
    if (Math.random() < 0.36) return speciesMoment();
    const roll = Math.random();
    if (roll < 0.28) return evZoomies();
    if (roll < 0.52) return evLaser();
    if (roll < 0.74) return evWildSlime();
    if (roll < 0.90) return evBox();
    speakSmart('You are strolling around a web page. Drop a brief comment.');
  }
  function speciesMoment() {
    const sp = S && S.dna && S.dna.species;
    const fx = {
      perro:['zoom','🐾'], conejo:['hop','🥕'], gato:['sf-tilt','✨'], zorro:['zoom','🍂'], panda:['sf-wiggle','🎋'],
      pinguino:['sf-wiggle','❄️'], buho:['sf-tilt','💡'], axolotl:['sf-stretchy','💧'], dragon:['sf-wiggle','🔥'],
      fantasma:['sf-stretchy','👻'], fenix:['hop','🔥'], kitsune:['sf-tilt','🌙'], unicornio:['hop','🌈'], hada:['hop','✨'], kraken:['sf-stretchy','🌊'], slime:['sf-stretchy','💧']
    }[sp] || ['hop','✨'];
    ev = { type:'species', until:performance.now()+1800 };
    wrap.classList.add(fx[0]); part(fx[1],x-8,window.innerHeight-sizePx()-26);
    setTimeout(()=>{ if(wrap)wrap.classList.remove(fx[0]); },1500);
  }
  function endEvent() {
    if (!ev) return;
    if (ev.panel) ev.panel.remove();
    if (ev.node) ev.node.remove();
    if (ev.type === 'box' && wrap) wrap.style.display = '';
    if (wrap) wrap.classList.remove('zoom');
    ev = null;
  }
  function evZoomies() {
    ev = { type: 'zoomies', until: performance.now() + 5200 };
    wrap.classList.add('zoom');
    say(L('zoom_yell'), 1400);
  }
  function evLaser() {
    const dot = document.createElement('div');
    dot.className = 'sf-laser';
    root.appendChild(dot);
    ev = { type: 'laser', until: performance.now() + 9000, node: dot,
           lx: Math.random() * innerWidth, ly: innerHeight * (0.3 + Math.random() * 0.4),
           tx: 0, ty: 0, nextWp: 0 };
    dot.addEventListener('pointerdown', e => {
      part('✨', e.clientX - 9, e.clientY - 20);
      try { chrome.runtime.sendMessage({ type: 'sf-laser' }); } catch (err) {}
      endEvent();
    });
  }
  function dayKeyC() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function canDuel() {
    if (!S || !S.dna) return false;
    if (S.demoMode) return true;   // en pruebas: sin cap diario ni bloqueo por foco
    if (S.focus) return false;
    return !(S.duelDay && S.duelDay.d === dayKeyC() && S.duelDay.n >= 2);   // máx. 2 duelos/día
  }
  /* ── Duelo de ingenio (estilo Monkey Island): el slime salvaje te reta.
     Pulla → 3 réplicas, gana el mejor de 3. Perder también enseña. ── */
  function evDuel() {
    const w = document.createElement('div');
    w.className = 'sf-wild';
    const dna = { species: 'slime', color: '#e8a33d', marking: { type: 'none', color: '#fff' }, temperament: 'caotico', seed: 1 };
    w.innerHTML = '<svg viewBox="0 0 200 200" width="64" height="64">' +
      buildCreature(dna, 1, { dirtLvl: 0, poops: 0, focusing: false, mood: 90 }).split('bodyclip').join('bodyclipD') +
      '</svg>';
    const wx = Math.round(window.innerWidth * 0.62);
    w.style.left = wx + 'px';
    root.appendChild(w);
    ev = { type: 'duel', until: performance.now() + 90000, node: w, wx, seen: [], wins: 0, fails: 0, panel: null };
    mode = 'walk'; targetX = wx - 90; dir = 1;
    react('wow', 2000);
    chipBubble(wx + 32, 76, L('duel_hi'), 3400);
    setTimeout(() => { if (ev && ev.type === 'duel') duelRound(); }, 1600);
  }
  function duelPickPair() {
    const bank = duelBank(uiLangC());
    const unseen = bank.map((_, i) => i).filter(i => !ev.seen.includes(i));
    const own = unseen.filter(i => bank[i].sp === S.dna.species);
    const pool = (own.length && Math.random() < 0.6) ? own : unseen;   // diferenciación por especie
    const id = pool[Math.floor(Math.random() * pool.length)];
    ev.seen.push(id);
    return { id, pair: bank[id], bank };
  }
  function duelRound() {
    if (!ev || ev.type !== 'duel') return;
    const { pair, bank } = duelPickPair();
    chipBubble(ev.wx + 32, 76, '«' + pair.p + '»', 6500);
    const decoys = [];
    while (decoys.length < 2) {
      const d = bank[Math.floor(Math.random() * bank.length)].r;
      if (d !== pair.r && !decoys.includes(d)) decoys.push(d);
    }
    const opts = [pair.r, decoys[0], decoys[1]].sort(() => Math.random() - 0.5);
    const box = document.createElement('div');
    box.className = 'sf-duelbox';
    box.innerHTML = '<div class="dq">⚔️ ' + L('duel_pick') + '</div>';
    opts.forEach(o => {
      const b = document.createElement('button');
      b.textContent = o;
      b.addEventListener('click', () => {
        box.remove(); if (ev) ev.panel = null;
        if (!ev || ev.type !== 'duel') return;
        if (o === pair.r) {
          ev.wins++;
          react('happy', 2200);
          say('«' + pair.r + '»', 3000);
          part('🔥', x, window.innerHeight - sizePx() - 10);
        } else {
          ev.fails++;
          react('sad', 1900);
          say(L('duel_miss'), 2200);
          chipBubble(ev.wx + 32, 76, L('duel_learn', { R: pair.r }), 4600);
        }
        setTimeout(() => {
          if (!ev || ev.type !== 'duel') return;
          if (ev.wins >= 2) duelEnd(true);
          else if (ev.fails >= 2) duelEnd(false);
          else duelRound();
        }, 3200);
      });
      box.appendChild(b);
    });
    root.appendChild(box);
    ev.panel = box;
  }
  function duelEnd(won) {
    try { chrome.runtime.sendMessage({ type: 'sf-duel', won, ids: ev.seen }); } catch (err) {}
    if (won) {
      react('happy', 3200);
      say(L('duel_win'), 3200);
      part('🎉', x - 14, window.innerHeight - sizePx() - 14);
      part('🔥', x + 14, window.innerHeight - sizePx() - 6);
    } else { react('sad', 3000); say(L('duel_lose'), 3400); }
    if (ev) ev.until = performance.now() + 1800;
  }
  function evWildSlime() {
    if (canDuel() && Math.random() < 0.45) return evDuel();
    const w = document.createElement('div');
    w.className = 'sf-wild';
    const dna = { species: 'slime', color: '#e8a33d', marking: { type: 'none', color: '#fff' }, temperament: 'caotico', seed: 1 };
    w.innerHTML = '<svg viewBox="0 0 200 200" width="64" height="64">' +
      buildCreature(dna, 1, { dirtLvl: 0, poops: 0, focusing: false, mood: 90 }).split('bodyclip').join('bodyclipW') +
      '</svg>';
    root.appendChild(w);
    ev = { type: 'wild', until: performance.now() + 7000, node: w, wx: -70 };
    w.addEventListener('pointerdown', e => {
      part('🔥', e.clientX - 9, e.clientY - 24);
      part('🔥', e.clientX + 12, e.clientY - 12);
      try { chrome.runtime.sendMessage({ type: 'sf-brasas', n: 3 }); } catch (err) {}
      if (Math.random() < 0.3) {
        try { chrome.runtime.sendMessage({ type: 'sf-mat', m: 'calcetin' }); } catch (err) {}
        say(L('mine_sock'), 2600);
      } else say(L('mine'), 2200);
      endEvent();
    });
  }
  function evBox() {
    const b = document.createElement('div');
    b.className = 'sf-box'; b.textContent = '📦';
    const bx = Math.max(90, Math.min(innerWidth - 90, x + (Math.random() < 0.5 ? -1 : 1) * (140 + Math.random() * 160)));
    b.style.left = bx + 'px';
    root.appendChild(b);
    ev = { type: 'box', until: performance.now() + 13000, node: b, bx, inside: false, hideAt: 0 };
    mode = 'walk'; targetX = bx; dir = bx > x ? 1 : -1;
  }
  function tickEvent(now) {
    if (!ev) return;
    if (now > ev.until) {
      if (ev.type === 'box' && ev.inside) {
        wrap.style.display = ''; wrap.classList.add('land');
        setTimeout(() => wrap && wrap.classList.remove('land'), 320);
        if (Math.random() < 0.4) {
          try { chrome.runtime.sendMessage({ type: 'sf-mat', m: 'calcetin' }); } catch (err) {}
          say(L('box_sock'), 2800);
        }
      }
      endEvent();
      return;
    }
    if (ev.type === 'zoomies') {
      const half = sizePx() / 2;
      mode = 'walk';
      if (Math.abs(x - targetX) < 24 || targetX <= half || targetX >= window.innerWidth - half) {
        dir = x > window.innerWidth / 2 ? -1 : 1;
        targetX = dir > 0 ? window.innerWidth - half - 10 : half + 10;
      }
    }
    if (ev.type === 'laser') {
      if (now > ev.nextWp) { ev.tx = 40 + Math.random() * (innerWidth - 80); ev.ty = innerHeight * (0.25 + Math.random() * 0.5); ev.nextWp = now + 900 + Math.random() * 900; }
      ev.lx += (ev.tx - ev.lx) * 0.06;
      ev.ly += (ev.ty - ev.ly) * 0.06;
      ev.node.style.left = ev.lx + 'px';
      ev.node.style.top = ev.ly + 'px';
      mode = 'walk'; targetX = ev.lx; dir = ev.lx > x ? 1 : -1;
    }
    if (ev.type === 'wild') {
      ev.wx += 3.4;
      ev.node.style.left = ev.wx + 'px';
      dir = ev.wx > x ? 1 : -1;              // la criatura lo mira pasar
      if (ev.wx > innerWidth + 70) endEvent();
    }
    if (ev.type === 'box' && !ev.inside && Math.abs(x - ev.bx) < 14) {
      ev.inside = true;
      wrap.style.display = 'none';
      ev.node.classList.add('wob');
      ev.until = now + 2600;
    }
  }

  /* ── modo slime: saltitos, goteo y charquitos del color base ── */
  function isSlime() { return S && S.dna && S.dna.species === 'slime'; }
  function locoProf() { return (S && S.dna && LOCO[S.dna.species]) || LOCO.slime; }
  function isAsleepC() {
    if (!S || S.demoMode || S.phase !== 'pet' || !S.dna) return false;
    if (S.wokeUntil && Date.now() < S.wokeUntil) return false;
    const h = new Date().getHours();
    return ['buho', 'fantasma', 'kitsune'].includes(S.dna.species) ? (h >= 10 && h < 18) : (h < 7);
  }
  function favX() {
    const f = ((S.dna.seed % 97) / 97) * 0.6 + 0.2;   // su rincón favorito, fijo por ADN
    return Math.round(window.innerWidth * f);
  }
  function slimeColors(dna) {
    const c = (dna && dna.color) || (S.dna && S.dna.color) || '#e8a33d';
    const o = hexToHsl(c);
    return { body: c, rim: hslToHex(o.h, o.s, Math.max(o.l - 30, 8)) };
  }
  function leavePuddle(px, big, dna) {
    if (!root) return;
    const { body, rim } = slimeColors(dna);
    const w = Math.max(14, Math.round(sizePx() * (big ? 0.42 : 0.16)));
    const p = document.createElement('div');
    p.className = 'sf-puddle';
    p.style.cssText = 'left:' + Math.round(px) + 'px;width:' + w + 'px;height:' + Math.round(w * 0.32) + 'px;background:' + body + ';box-shadow:inset 0 0 0 2px ' + rim + ';opacity:0.55;';
    p.addEventListener('pointerdown', e => {
      // recoger la gota: moneda del huerto (v0.37)
      e.stopPropagation();
      p.remove(); puddles = puddles.filter(q => q !== p);
      part('💧', e.clientX - 8, e.clientY - 22);
      try { chrome.runtime.sendMessage({ type: 'sf-gota' }); } catch (err) {}
    }, { once: true });
    root.appendChild(p);
    puddles.push(p);
    // se queda "unos pocos pasos": se desvanece sola, y si hay demasiados, el más viejo se va antes
    p.animate([{ opacity: 0.55, transform: 'translateX(-50%) scaleY(0.32) scale(1)' },
               { opacity: 0, transform: 'translateX(-50%) scaleY(0.32) scale(1.18)' }],
              { duration: big ? 7000 : 4500, easing: 'ease-out', fill: 'forwards' })
     .onfinish = () => { p.remove(); puddles = puddles.filter(q => q !== p); };
    if (puddles.length > 5) {
      const old = puddles.shift();
      old.animate([{ opacity: 0.4 }, { opacity: 0 }], { duration: 350, fill: 'forwards' }).onfinish = () => old.remove();
    }
  }
  function dropFrom(cx, startY, w, dna) {
    if (!root) return;
    const { body, rim } = slimeColors(dna);
    const d = document.createElement('div');
    d.className = 'sf-drop';
    d.style.cssText = 'left:' + Math.round(cx - w / 2) + 'px;bottom:0;width:' + w + 'px;height:' + Math.round(w * 1.3) + 'px;background:' + body + ';box-shadow:inset 0 0 0 1.5px ' + rim + ';transform:translateY(' + (-Math.round(startY)) + 'px);';
    root.appendChild(d);
    d.animate([{ transform: 'translateY(' + (-Math.round(startY)) + 'px)' },
               { transform: 'translateY(0)' }],
              { duration: 220 + startY * 1.2, easing: 'cubic-bezier(.5,0,1,1)', fill: 'forwards' })
     .onfinish = () => { d.remove(); leavePuddle(cx, false, dna); };
  }
  function spawnDrop() {
    if (!wrap) return;
    const s = sizePx();
    dropFrom(x + (Math.random() * 0.5 - 0.25) * s, lift + s * 0.10 + Math.random() * s * 0.12, Math.max(5, Math.round(s * 0.055)), S.dna);
  }
  /* ── HUERTO en pantalla (fase 2, v0.38): 4 parcelas junto a la criatura ──
     Overlay con opacidad regulable (S.huerto.op) y ocultable (S.huerto.show).
     Clic: parcela vacía → selector de semillas · sedienta → regar · lista →
     cosechar. La criatura riega sola con vínculo ≥ 50 (el huerto es de los
     dos) y el conejo comete crímenes contra las bayas. */
  const PLOT_W = 58, GARDEN_GAP = 6, GARDEN_RIGHT = 14;
  function gardenX(i) {
    const total = 4 * PLOT_W + 3 * GARDEN_GAP;
    return window.innerWidth - GARDEN_RIGHT - total + PLOT_W / 2 + i * (PLOT_W + GARDEN_GAP);
  }
  function closeSeedPick() { if (seedBox) { seedBox.remove(); seedBox = null; } }
  function openSeedPick(i) {
    closeSeedPick();
    seedBox = document.createElement('div');
    seedBox.className = 'sf-duelbox sf-seedbox';
    seedBox.innerHTML = '<div class="dq">' + L('huerto_pick') + ' · \u{1F4A7} ' + (S.gotas || 0) + '</div>' +
      Object.keys(SEEDS).map(k => '<button data-s="' + k + '"' + ((S.gotas || 0) < SEEDS[k].cost ? ' disabled' : '') + '>' +
        SEEDS[k].emoji + ' · ' + SEEDS[k].hours + ' h · ' + SEEDS[k].cost + ' \u{1F4A7}</button>').join('') +
      '<button data-s="">\u2715</button>';
    seedBox.addEventListener('click', ev => {
      ev.stopPropagation();
      const b = ev.target.closest('button');
      if (!b) return;
      const k = b.getAttribute('data-s');
      if (k) {
        try {
          chrome.runtime.sendMessage({ type: 'sf-huerto', op: 'plant', i, seed: k }, r => {
            if (r) part('\u{1F331}', gardenX(i) - 9, window.innerHeight - 74);
            else say(L('huerto_no_gotas'), 3200);
          });
        } catch (err) {}
      }
      closeSeedPick();
    });
    root.appendChild(seedBox);
  }
  function onGardenClick(e) {
    const cell = e.target.closest('[data-i]');
    if (!cell) return;
    e.stopPropagation();
    const i = parseInt(cell.getAttribute('data-i'), 10);
    const p = S.huerto.plots[i];
    if (!p) return openSeedPick(i);
    if (p.done) {
      try {
        chrome.runtime.sendMessage({ type: 'sf-huerto', op: 'harvest', i }, r => {
          if (r) {
            part(r.kind === 'mat' ? '\u{1F338}' : (r.seed === 'baya' ? '\u{1FAD0}' : '\u{1F955}'), e.clientX - 9, e.clientY - 28);
            if (Math.random() < 0.45) say(phrase(), 2800);
          }
        });
      } catch (err) {}
      return;
    }
    if (!p.w) {
      try { chrome.runtime.sendMessage({ type: 'sf-huerto', op: 'water', i }, r => { if (r) part('\u{1F4A7}', e.clientX - 9, e.clientY - 28); }); } catch (err) {}
    }
  }
  function renderGarden() {
    const on = root && S && S.phase === 'pet' && S.huerto && S.huerto.show !== false && S.huerto.plots;
    if (!on) { if (gardenEl) { gardenEl.remove(); gardenEl = null; gardenSig = ''; } closeSeedPick(); return; }
    const sig = JSON.stringify([S.huerto.plots, S.huerto.op]);
    if (gardenEl && sig === gardenSig) return;
    gardenSig = sig;
    if (!gardenEl) {
      gardenEl = document.createElement('div');
      gardenEl.className = 'sf-garden';
      gardenEl.addEventListener('pointerdown', e => e.stopPropagation());
      gardenEl.addEventListener('click', onGardenClick);
      root.appendChild(gardenEl);
    }
    gardenEl.style.opacity = ((S.huerto.op || 70) / 100).toFixed(2);
    gardenEl.innerHTML = S.huerto.plots.map((p, i) =>
      '<div class="sf-plot' + (p && !p.w && !p.done ? ' thirsty' : '') + (p && p.done ? ' ready' : '') + '" data-i="' + i + '">' +
      '<svg viewBox="0 0 70 70" width="' + PLOT_W + '" height="' + PLOT_W + '">' + buildPlot(p) + '</svg></div>').join('');
  }
  function gardenActorPos(a) { return a.kind === 'active' ? x : a.c.x; }
  function gardenActorSz(a) { return a.kind === 'active' ? sizePx() : a.c.sz; }
  function tickGarden(now) {
    if (!S.huerto || S.huerto.show === false || !S.huerto.plots) { gardenRun = null; return; }
    if (!gardenRun) {
      if (!nextGardenAt) nextGardenAt = now + 20000;
      if (now > nextGardenAt) {
        nextGardenAt = now + (S.demoMode ? 25000 + Math.random() * 20000 : 100000 + Math.random() * 140000);
        // regar sola: con vínculo alto, el huerto es de toda la familia (v0.41:
        // también las compañeras de manada pueden encargarse)
        const wi = (S.vinculo || 0) >= 50 ? S.huerto.plots.findIndex(p => p && !p.w && !p.done) : -1;
        // mordisco del conejo: crimen cómico raro sobre una baya lista; el ladrón
        // puede ser la principal o una compañera coneja (v0.41)
        const rabbits = [];
        if (S.dna && S.dna.species === 'conejo') rabbits.push({ kind: 'active' });
        comps.forEach(c => { if (c.dna.species === 'conejo') rabbits.push({ kind: 'comp', c }); });
        const ni = (rabbits.length && Math.random() < 0.5)
          ? S.huerto.plots.findIndex(p => p && p.done && !p.nib && p.seed === 'baya') : -1;
        const kind = ni >= 0 ? 'nibble' : (wi >= 0 ? 'water' : null);
        if (kind) {
          let actor = { kind: 'active' };
          if (kind === 'nibble') actor = rabbits[Math.floor(Math.random() * rabbits.length)];
          else if (comps.length && Math.random() < 0.45) actor = { kind: 'comp', c: comps[Math.floor(Math.random() * comps.length)] };
          gardenRun = { i: kind === 'nibble' ? ni : wi, kind, actor, acted: false, started: now };
          pTarget(actor, gardenX(gardenRun.i));
          if (actor.kind === 'active') { dir = gardenX(gardenRun.i) > x ? 1 : -1; modeUntil = now + 30000; }
        }
      }
      return;
    }
    const p = S.huerto.plots[gardenRun.i];
    const valid = p && (gardenRun.kind === 'water' ? (!p.w && !p.done) : (p.done && !p.nib));
    const actorGone = gardenRun.actor.kind === 'comp' && !comps.includes(gardenRun.actor.c);
    if (!valid || actorGone || now - gardenRun.started > 45000) { gardenRun = null; return; }
    if (gardenRun.acted) return;
    const a = gardenRun.actor;
    const gx = gardenX(gardenRun.i);
    if (Math.abs(gardenActorPos(a) - gx) < gardenActorSz(a) * 0.55 + 26) {
      gardenRun.acted = true;
      const gi = gardenRun.i, kind = gardenRun.kind;
      pIdle(a, now, 3400);
      const node = a.kind === 'active' ? wrap : a.c.node;
      if (node) { node.classList.add('sf-tilt'); setTimeout(() => node.classList.remove('sf-tilt'), 1350); }   // oler la planta
      if (kind === 'water') {
        const line = Math.random() < 0.5 ? L('huerto_smell') : L('huerto_water_auto');
        if (a.kind === 'active') say(line, 3400); else sayAs(a, line, 3400);
        setTimeout(() => {
          try { chrome.runtime.sendMessage({ type: 'sf-huerto', op: 'water', i: gi, auto: true }, r => { if (r) part('\u{1F4A7}', gardenX(gi) - 9, window.innerHeight - 76); }); } catch (err) {}
          gardenRun = null;
        }, 900);
      } else {
        setTimeout(() => {
          try {
            chrome.runtime.sendMessage({ type: 'sf-huerto', op: 'nibble', i: gi }, r => {
              if (r) {
                part('\u{1FAD0}', gardenX(gi) - 9, window.innerHeight - 76);
                runCrimen(a);
              }
            });
          } catch (err) {}
          gardenRun = null;
        }, 700);
      }
    } else if (a.kind === 'active' ? mode === 'idle' : a.c.mode === 'idle') {
      pTarget(a, gx);
      if (a.kind === 'active') { dir = gx > x ? 1 : -1; modeUntil = now + 20000; }
    }
  }

  /* ── La charla del crimen (v0.41): guionizada en 4 turnos ──
     Si el ladrón es una compañera, la principal la acusa; si la ladrona es
     la principal y hay compañeras, una compañera la acusa; a solas queda
     el monólogo clásico (nibble1/nibble2). */
  async function runCrimen(thief) {
    const t0 = gardenRun;
    let accuser = null;
    if (thief.kind === 'comp') accuser = { kind: 'active' };
    else if (comps.length) accuser = { kind: 'comp', c: comps[Math.floor(Math.random() * comps.length)] };
    const speakT = (line, ms) => thief.kind === 'active' ? say(line, ms || 3400) : sayAs(thief, line, ms || 3400);
    if (!accuser) {
      if (thief.kind === 'active') react('happy', 2600);
      speakT(L('nibble1'), 3600);
      await wait(4000);
      speakT(L('nibble2'), 3400);
      return;
    }
    const speakA = (line, ms) => accuser.kind === 'active' ? say(line, ms || 3400) : sayAs(accuser, line, ms || 3400);
    const tn = (thief.kind === 'active' ? S.dna : thief.c.dna).name;
    const sub = str => str.split('$B').join(tn);
    pFace(accuser, gardenActorPos(thief) > gardenActorPos(accuser) ? 1 : -1);
    speakA(sub(L('crimen1')), 3400);
    await wait(3600);
    speakT(L('crimen2'), 3400);
    await wait(3600);
    speakA(sub(L('crimen3')), 3400);
    await wait(3600);
    speakT(L('crimen4'), 3200);
    if (thief.kind === 'active') react('happy', 2400);
    void t0;
  }

  /* ── HUD del temporizador de foco en página (v0.39) ──
     Durante la sesión: anillo de progreso + mm:ss + [+5\u2032] + [\u23F9 con
     confirmaci\u00f3n]. Sin sesi\u00f3n: p\u00edldora de inicio r\u00e1pido \u{1F525}. Opacidad y
     visibilidad propias (S.focusHud), regulables desde el popup. */
  function applyHudPos(conf) {
    if (!hudEl) return;
    if (conf.hx == null) { hudEl.style.left = '14px'; hudEl.style.bottom = '12px'; return; }
    const w = hudEl.offsetWidth || 150, h = hudEl.offsetHeight || 44;
    const hx = Math.max(4, Math.min(window.innerWidth - w - 4, conf.hx));
    const hy = Math.max(4, Math.min(window.innerHeight - h - 4, conf.hy));
    hudEl.style.left = hx + 'px';
    hudEl.style.bottom = hy + 'px';
  }
  function onHudDown(e) {
    e.stopPropagation();
    if (e.target.closest('.fh-btn') && !e.target.closest('.fh-start')) return;   // los botones no arrastran
    const r = hudEl.getBoundingClientRect();
    hudDrag = { px: e.clientX, py: e.clientY, left: r.left, bottom: window.innerHeight - r.bottom };
    hudMoved = false;
    const mv = ev => {
      const dx = ev.clientX - hudDrag.px, dy = ev.clientY - hudDrag.py;
      if (!hudMoved && Math.hypot(dx, dy) < 6) return;
      hudMoved = true;
      hudEl.style.left = Math.max(4, Math.min(window.innerWidth - hudEl.offsetWidth - 4, hudDrag.left + dx)) + 'px';
      hudEl.style.bottom = Math.max(4, Math.min(window.innerHeight - hudEl.offsetHeight - 4, hudDrag.bottom - dy)) + 'px';
    };
    const up = () => {
      window.removeEventListener('pointermove', mv);
      window.removeEventListener('pointerup', up);
      if (hudMoved) {
        const hx = parseInt(hudEl.style.left, 10), hy = parseInt(hudEl.style.bottom, 10);
        try { chrome.runtime.sendMessage({ type: 'sf-focus', op: 'hudpos', hx, hy }); } catch (err) {}
      }
      hudDrag = null;
    };
    window.addEventListener('pointermove', mv);
    window.addEventListener('pointerup', up);
  }
  function onHudClick(e) {
    if (hudMoved) { hudMoved = false; return; }   // un arrastre no es un clic
    const b = e.target.closest('[data-fh]');
    if (!b) return;
    e.stopPropagation();
    const op = b.getAttribute('data-fh');
    if (op === 'dnd') {
      const old = hudEl && hudEl.querySelector('.fh-menu');
      if (old) { old.remove(); return; }
      const m = document.createElement('div');
      m.className = 'fh-menu';
      m.innerHTML = '<button class="fh-mi" data-fh="dnd-site">\u{1F515} ' + L('dnd_site') + '</button>' +
                    '<button class="fh-mi" data-fh="dnd-hour">\u23F8\uFE0F ' + L('dnd_hour') + '</button>' +
                    '<button class="fh-mi" data-fh="dnd-day">\u{1F319} ' + L('dnd_day') + '</button>';
      hudEl.appendChild(m);
      return;
    }
    if (op === 'dnd-site' || op === 'dnd-hour' || op === 'dnd-day') {
      try { chrome.runtime.sendMessage({ type: 'sf-dnd', op: op.slice(4), host: location.hostname }); } catch (err) {}
      return;
    }
    if (op === 'start') {
      try { chrome.runtime.sendMessage({ type: 'sf-focus', op: 'start', kind: 'work' }, r => { if (r) part('\u{1F525}', 26, window.innerHeight - 84); }); } catch (err) {}
      return;
    }
    if (op === 'extend') {
      try { chrome.runtime.sendMessage({ type: 'sf-focus', op: 'extend' }, r => { if (r) part('\u23F3', 96, window.innerHeight - 84); }); } catch (err) {}
      return;
    }
    if (op === 'stop') {
      if (!hudConfirmAt) {
        hudConfirmAt = performance.now() + 3500;
        b.textContent = L('hud_sure');
        b.classList.add('warn');
        return;
      }
      hudConfirmAt = 0;
      try { chrome.runtime.sendMessage({ type: 'sf-focus', op: 'giveup' }); } catch (err) {}
    }
  }
  function renderFocusHud() {
    const conf = S && S.focusHud ? S.focusHud : {};
    const on = root && S && S.phase === 'pet' && conf.show !== false;
    if (!on) { if (hudEl) { hudEl.remove(); hudEl = null; hudSig = ''; hudEls = null; } return; }
    const focus = S.focus;
    const sig = (focus ? 'f' + focus.kind + (focus.startedAt || 0) + '-' + (focus.endsAt || 0) + '-' + (focus.goal || '') : 'idle' + (S.focusMin || 25)) + '|' + (conf.op || 85) + '|' + (conf.hx == null ? 'd' : conf.hx + ',' + conf.hy);
    if (hudDrag) return;   // no reconstruir en mitad de un arrastre
    if (sig !== hudSig) {
      hudSig = sig;
      hudConfirmAt = 0;
      if (!hudEl) {
        hudEl = document.createElement('div');
        hudEl.className = 'sf-fhud';
        hudEl.addEventListener('pointerdown', onHudDown);
        hudEl.addEventListener('click', onHudClick);
        root.appendChild(hudEl);
      }
      hudEl.style.opacity = ((conf.op || 85) / 100).toFixed(2);
      applyHudPos(conf);
      if (!focus) {
        hudEl.classList.add('idle');
        hudEl.innerHTML = '<button class="fh-btn fh-start" data-fh="start">\u{1F525} ' + (S.focusMin || 25) + '\u2032</button><button class="fh-btn fh-dnd" data-fh="dnd" title="">\u{1F515}</button>';
        hudEls = null;
      } else {
        hudEl.classList.remove('idle');
        const brk = focus.kind === 'break';
        const C = 2 * Math.PI * 14;
        hudEl.innerHTML =
          '<button class="fh-btn fh-dnd" data-fh="dnd">\u{1F515}</button>' +
          '<span class="fh-ringwrap"><svg class="fh-ring" viewBox="0 0 36 36" width="34" height="34">' +
          '<circle cx="18" cy="18" r="14" fill="none" stroke="#2a2e36" stroke-width="4"/>' +
          '<circle class="fh-prog" cx="18" cy="18" r="14" fill="none" stroke="' + (brk ? '#6ea8e0' : '#e8a33d') + '" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="0" transform="rotate(-90 18 18)"/></svg>' +
          '<span class="fh-ico">' + (brk ? '\u2615' : '\u{1F525}') + '</span></span>' +
          '<span class="fh-time">--:--</span>' +
          (!brk && focus.goal ? '<span class="fh-goal"></span>' : '') +
          (brk ? '' : '<button class="fh-btn" data-fh="extend">+5\u2032</button>') +
          '<button class="fh-btn fh-stop" data-fh="stop">\u23F9</button>';
        const goalEl = hudEl.querySelector('.fh-goal'); if (goalEl) goalEl.textContent = focus.goal;
        hudEls = { prog: hudEl.querySelector('.fh-prog'), time: hudEl.querySelector('.fh-time'), stop: hudEl.querySelector('.fh-stop'), C };
      }
    }
    if (focus && hudEls) {
      const total = focus.duration || (focus.endsAt - focus.startedAt) || 1;
      const rem = Math.max(0, focus.endsAt - Date.now());
      const mm = Math.floor(rem / 60000), ss = Math.floor((rem % 60000) / 1000);
      hudEls.time.textContent = String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
      hudEls.prog.setAttribute('stroke-dashoffset', (hudEls.C * (1 - rem / total)).toFixed(1));
      if (hudConfirmAt && performance.now() > hudConfirmAt) {
        hudConfirmAt = 0;
        hudEls.stop.textContent = '\u23F9';
        hudEls.stop.classList.remove('warn');
      }
    }
  }

  /* ── Aviso de redes sociales durante el foco (v0.38) ── */
  const SHIELD_TEXT = {
    es:['Vuelve a tu foco','Has elegido proteger este tiempo. Tu objetivo: ','Volver al foco','Solo 60 segundos','Guardar para después'],
    en:['Return to your focus','You chose to protect this time. Your goal: ','Back to focus','Just 60 seconds','Save for later'],
    de:['Zurück zum Fokus','Du hast diese Zeit geschützt. Dein Ziel: ','Zurück zum Fokus','Nur 60 Sekunden','Für später speichern'],
    fr:['Retour au focus','Tu as choisi de protéger ce temps. Ton objectif : ','Retour au focus','Juste 60 secondes','Garder pour plus tard'],
    it:['Torna al focus','Hai scelto di proteggere questo tempo. Obiettivo: ','Torna al focus','Solo 60 secondi','Salva per dopo'],
    pt:['Volta ao foco','Escolheste proteger este tempo. Objetivo: ','Voltar ao foco','Só 60 segundos','Guardar para depois']
  };
  function shieldTexts(){ return SHIELD_TEXT[uiLangC()] || SHIELD_TEXT.en; }
  function hostMatches(site) { const h=(location.hostname||'').replace(/^www\./,'').toLowerCase(); return h===site || h.endsWith('.'+site); }
  function shieldScheduled(f) {
    if (!S.proOn || !f.schedule || !f.schedule.enabled) return false;
    const d=new Date(), days=f.schedule.days||[]; if(!days.includes(d.getDay()))return false;
    const now=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
    const a=f.schedule.start||'09:00', b=f.schedule.end||'17:00'; return a<=b ? now>=a&&now<=b : now>=a||now<=b;
  }
  function shieldActive() {
    const f=S&&S.focusShield;if(!f||!f.enabled)return false;
    const h=(location.hostname||'').replace(/^www\./,'').toLowerCase(); if(f.snoozes&&f.snoozes[h]>Date.now())return false;
    let sites=[...(f.sites||[])].slice(0,S.proOn?50:5);
    if(S.proOn&&S.focus&&S.focus.ritualId&&f.ritualSites)sites.push(...(f.ritualSites[S.focus.ritualId]||[]));
    if(!sites.some(hostMatches))return false;
    return !!(S.focus&&S.focus.kind!=='break') || shieldScheduled(f);
  }
  function leaveDistraction(op) {
    try { chrome.runtime.sendMessage({type:'sf-shield',op,host:location.hostname,url:location.href,title:document.title,minutes:5}); } catch(e){}
    if(history.length>1)history.back();else location.replace('about:blank');
  }
  function renderShieldOverlay() {
    if(!root)return;
    if(!shieldActive()){if(shieldEl){shieldEl.remove();shieldEl=null;}shieldAttemptKey='';return;}
    const f=S.focusShield,key=location.href+'|'+(S.focus&&S.focus.startedAt||'schedule');
    if(!shieldEl){
      const tx=shieldTexts();shieldEl=document.createElement('div');shieldEl.className='sf-shield '+(f.mode==='firm'?'firm':'gentle');
      shieldEl.innerHTML='<div class="sf-shield-card"><h2>🛡️ '+tx[0]+'</h2><p>'+tx[1]+'<b></b></p><div class="sf-shield-actions"><button data-a="return">'+tx[2]+'</button><button data-a="snooze">'+tx[3]+'</button><button data-a="later">'+tx[4]+'</button></div></div>';
      shieldEl.querySelector('b').textContent=(S.focus&&S.focus.goal)||'—';root.appendChild(shieldEl);
      shieldEl.querySelector('[data-a="return"]').onclick=()=>leaveDistraction('recover');
      shieldEl.querySelector('[data-a="later"]').onclick=()=>leaveDistraction('later');
      shieldEl.querySelector('[data-a="snooze"]').onclick=()=>{try{chrome.runtime.sendMessage({type:'sf-shield',op:'snooze',host:location.hostname});}catch(e){}shieldEl.remove();shieldEl=null;};
    }
    if(shieldAttemptKey!==key){shieldAttemptKey=key;try{chrome.runtime.sendMessage({type:'sf-shield',op:'attempt',host:location.hostname});}catch(e){}}
  }
  const SOCIAL_HOSTS = ['facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'tiktok.com', 'reddit.com',
    'threads.net', 'bsky.app', 'twitch.tv', 'pinterest.com', 'tumblr.com', '9gag.com', 'youtube.com'];
  function isSocialPage() {
    const h = (location.hostname || '').replace(/^www\./, '').toLowerCase();
    return SOCIAL_HOSTS.some(d => h === d || h.endsWith('.' + d));
  }
  function scold(now) {
    nextScoldAt = now + 50000 + Math.random() * 40000;   // recordatorio suave, no bloqueo
    scoldPoseUntil = now + 9000;
    scoldN++;
    react(scoldN >= 3 ? 'fierce' : 'sad', 3400);
    wrap.classList.add('sf-wiggle');
    setTimeout(() => wrap && wrap.classList.remove('sf-wiggle'), 900);
    say(L('focus_social' + (1 + (scoldN - 1) % 3)), 4400);
    part('\u2757', x - 9, window.innerHeight - sizePx() - lift - 30);
    mode = 'walk'; targetX = Math.round(window.innerWidth / 2); dir = targetX > x ? 1 : -1; modeUntil = now + 8000;
    // foco de manada (v0.45): las compañeras respaldan a la activa, escalonadas
    // y sin repetir lo dicho — la segunda solo entra si reincides
    comps.slice(0, 2).forEach((c, i) => {
      if (i === 1 && scoldN < 2) return;
      setTimeout(() => {
        if (!S || !S.focus || !comps.includes(c)) return;
        c.dir = x > c.x ? 1 : -1;   // mira hacia la escena
        c.node.classList.add('hop'); setTimeout(() => c.node.classList.remove('hop'), 520);
        part('\u2757', c.x - 9, window.innerHeight - c.sz - c.lift - 26);
        (async () => {
          const fb = L('focus_pack' + (1 + (packScoldIdx++) % 3), { N: S.dna.name });
          const line = await relayFor(c.dna, 'Your human sneaked off to social media mid focus session and ' + S.dna.name + ' already called them out. Add your own complicit reproach with your personality, very short, without repeating what was said.') || fb;
          if (S && S.focus && comps.includes(c)) chipBubble(c.x, c.sz + c.lift + 12, c.dna.name + ': \u00ab' + line + '\u00bb', 3600);
        })();
      }, 1700 + i * 2800);
    });
  }

  function gooHop(now) {
    const prof = locoProf();
    const zoom = ev && ev.type === 'zoomies';
    const sleepy = isAsleepC();
    if (!hop) {
      if (now < hopPause) return;
      const remaining = targetX - x;
      if (Math.abs(remaining) < 8) { if (!zoom) { mode = 'idle'; modeUntil = now + 1500 + Math.random() * 4000; } return; }
      const s = sizePx();
      const dist = Math.min(Math.max(14, s * prof.dist * (zoom ? 1.35 : 1)), Math.abs(remaining));
      hop = { t0: now, dur: prof.dur * (zoom ? 0.5 : 1) * (sleepy ? 1.7 : 1),
              from: x, dist: dist * Math.sign(remaining),
              h: s * prof.h * (zoom ? 0.8 : 1) + 6, q: prof.squash };
      dir = Math.sign(remaining) || 1;
      return;
    }
    const t = (now - hop.t0) / hop.dur;
    if (t >= 1) {
      // aterrizaje: aplastamiento proporcional a la elasticidad
      x = hop.from + hop.dist; lift = 0;
      landUntil = now + 260; landQ = hop.q;
      hopCount++;
      if (Math.random() < locoProf().puddle * 0.6) leavePuddle(x, true, S.dna);
      hopPause = now + prof.pause * (sleepy ? 2 : 1) + Math.random() * 90;
      hop = null;
      if (Math.abs(targetX - x) < 8 && !zoom) { mode = 'idle'; modeUntil = now + 1500 + Math.random() * 4000; }
    } else if (t < 0.12) {
      // anticipación: se agacha sin moverse (frame 1 de la referencia)
      const k = t / 0.12;
      hopSx = 1 + 0.22 * hop.q * k; hopSy = 1 - 0.28 * hop.q * k;
      lift = 0;
    } else {
      // vuelo: estirada al subir, relajando hacia el ápice
      const ft = (t - 0.12) / 0.88;
      x = hop.from + hop.dist * ft;
      lift = Math.sin(ft * Math.PI) * hop.h;
      const st = Math.sin(ft * Math.PI);
      hopSx = 1 - 0.16 * hop.q * st;
      hopSy = 1 + 0.24 * hop.q * st;
    }
  }

  /* ── manada: las criaturas en reposo pasean juntas (Pro) ── */
  const comps = [];
  function focusWorkOn() {
    // sesión de trabajo activa (el descanso no cuenta): toda la manada se suma (v0.45)
    return !!(S && S.focus && S.focus.kind !== 'break');
  }
  function compFavX(c) {
    // rincón propio de cada compañera durante el foco, fijo por ADN y
    // separado tanto del rincón de la activa como del de la otra compañera
    const f = (((c.seed >> 3) % 89) / 89) * 0.6 + 0.2;
    let px = Math.round(window.innerWidth * f) + (comps.indexOf(c) - 0.5) * Math.round(c.sz * 0.4);
    if (Math.abs(px - favX()) < sizePx() * 0.9) px += (px < window.innerWidth / 2 ? -1 : 1) * Math.round(sizePx() * 1.1);
    const half = c.sz / 2;
    return Math.max(half, Math.min(window.innerWidth - half, px));
  }
  function compDesired() {
    if (!S || S.phase !== 'pet' || !S.proOn || !S.packMode || !Array.isArray(S.stable)) return [];
    return S.stable.filter(p => p && p.phase === 'pet' && p.dna).slice(0, 2);
  }
  function compSize(pet) {
    // cada compañera usa SU tamaño guardado (v0.44), no el slider de la activa
    const pct = (pet.sizePct == null ? 100 : pet.sizePct) / 100;
    const i = pet.stageIdx, st = STAGES[i];
    let frac = STAGE_FRAC[i] || 0.2;
    if (st && st.next != null && STAGE_FRAC[i + 1] != null && pet.growth != null) {
      // crecimiento continuo también para la manada (v0.41)
      const prev = i > 0 ? STAGES[i - 1].next : 0;
      const k = Math.max(0, Math.min(1, (pet.growth - prev) / (st.next - prev)));
      frac = frac + (STAGE_FRAC[i + 1] - frac) * k;
    }
    const nat = window.innerHeight * frac;
    return Math.max(40, Math.min(window.innerHeight * 0.9, Math.round(nat * pct * 0.92)));
  }
  function spawnComp(p, keep, at) {
    // keep/at (v0.45.1): al respawnear (cambio de etapa, tamaño o foco) se
    // conserva posición, dirección e índice — sin teletransportes. Solo una
    // compañera nueva de verdad aparece en un punto aleatorio.
    if (!root) return;
    const node = document.createElement('div');
    node.className = 'sf-comp';
    const sz = compSize(p);
    // foco de manada (v0.45): cada compañera se pone también en modo foco,
    // con su Ascua acelerada y su PROPIO escritorio (semilla desplazada →
    // actividad distinta a la de la activa: se complementan, no se copian)
    const foc = focusWorkOn();
    node.innerHTML = '<svg viewBox="0 0 200 200" width="' + sz + '" height="' + sz + '">' +
      buildCreature(p.dna, p.stageIdx, { dirtLvl: 0, poops: 0, focusing: foc, focusSeed: foc ? (deskForce != null ? deskForce * 1000 + (p.dna.seed % 3) * 1000 : S.focus.startedAt + (p.dna.seed % 9 + 1) * 977) : 0, mood: 75 })
        .split('bodyclip').join('bodyclipC' + (p.dna.seed % 100000)) + '</svg>';
    root.appendChild(node);
    const sp = (!keep || keep.x == null) && savedPos && savedPos.seeds ? savedPos.seeds[p.dna.seed] : null;
    const c = { seed: p.dna.seed, dna: p.dna, stageIdx: p.stageIdx, gBand: Math.round((p.growth || 0) / 60), szPct: (p.sizePct == null ? 100 : p.sizePct), foc, node, sz,
      x: keep && keep.x != null ? Math.max(sz / 2, Math.min(window.innerWidth - sz / 2, keep.x))
         : sp && sp.f != null ? Math.max(sz / 2, Math.min(window.innerWidth - sz / 2, sp.f * window.innerWidth))
         : Math.max(sz, Math.min(window.innerWidth - sz, Math.random() * window.innerWidth)),
      dir: (keep && keep.dir) || (sp && sp.dir) || 1, mode: 'idle', targetX: 0, modeUntil: 0,
      hop: null, hopPause: 0, sx: 1, sy: 1, lift: 0, landUntil: 0, landQ: 0,
      lastDir: (keep && keep.dir) || (sp && sp.dir) || 1, turnUntil: 0, sh: null };
    c.sh = node.querySelector('.sf-shdw');
    node.addEventListener('pointerdown', e => {
      e.stopPropagation();
      part('🤍', e.clientX - 9, e.clientY - 28);
      const srcB = phraseBank(uiLangC());
      const bank = srcB[c.dna.temperament] || srcB.tranquilo;
      if (Math.random() < 0.6) say(c.dna.name + ': «' + bank[Math.floor(Math.random() * bank.length)] + '»', 3000);
    });
    comps.splice(at == null ? comps.length : Math.min(at, comps.length), 0, c);
    // en foco, una compañera nueva SIN posición guardada aparece ya en su
    // rincón (determinista por ADN); con posición guardada, reaparece donde
    // estaba y camina lo que le falte (v0.45.2/v0.45.3)
    if (foc && !(keep && keep.x != null) && !(sp && sp.f != null)) c.x = compFavX(c);
  }
  function syncComps() {
    if (!root) return;
    const want = compDesired();
    const seeds = want.map(p => p.dna.seed);
    for (let i = comps.length - 1; i >= 0; i--) {
      if (!seeds.includes(comps[i].seed)) { comps[i].node.remove(); comps.splice(i, 1); }
    }
    want.forEach(p => {
      const ex = comps.find(c => c.seed === p.dna.seed);
      if (!ex) spawnComp(p);
      else if (ex.stageIdx !== p.stageIdx || ex.gBand !== Math.round((p.growth || 0) / 60) || ex.szPct !== (p.sizePct == null ? 100 : p.sizePct) || ex.foc !== focusWorkOn()) {
        // respawn conservador (v0.45.1): misma posición, dirección e índice
        const at = comps.indexOf(ex), keep = { x: ex.x, dir: ex.dir };
        ex.node.remove(); comps.splice(at, 1); spawnComp(p, keep, at);
      }
    });
  }
  function compHop(c, now, prof) {
    if (!c.hop) {
      if (now < c.hopPause) return;
      const rem = c.targetX - c.x;
      if (Math.abs(rem) < 8) { c.mode = 'idle'; c.modeUntil = now + 1800 + Math.random() * 4200; return; }
      const dist = Math.min(Math.max(12, c.sz * prof.dist), Math.abs(rem));
      c.hop = { t0: now, dur: prof.dur, from: c.x, dist: dist * Math.sign(rem), h: c.sz * prof.h + 5, q: prof.squash };
      c.dir = Math.sign(rem) || 1;
      return;
    }
    const t = (now - c.hop.t0) / c.hop.dur;
    if (t >= 1) {
      c.x = c.hop.from + c.hop.dist; c.lift = 0;
      c.landUntil = now + 260; c.landQ = c.hop.q;
      c.hopPause = now + prof.pause + Math.random() * 90;
      if (Math.random() < prof.puddle * 0.25) leavePuddle(c.x, false, c.dna);
      c.hop = null; c.sx = 1; c.sy = 1;
    } else if (t < 0.12) {
      const k = t / 0.12;
      c.sx = 1 + 0.22 * c.hop.q * k; c.sy = 1 - 0.28 * c.hop.q * k; c.lift = 0;
    } else {
      const ft = (t - 0.12) / 0.88;
      c.x = c.hop.from + c.hop.dist * ft;
      c.lift = Math.sin(ft * Math.PI) * c.hop.h;
      const st = Math.sin(ft * Math.PI);
      c.sx = 1 - 0.16 * c.hop.q * st; c.sy = 1 + 0.24 * c.hop.q * st;
    }
  }
  function tickComp(c, now) {
    const prof = LOCO[c.dna.species] || LOCO.slime;
    if (focusWorkOn()) lastFocusOnAt = now;
    if (c.mode === 'idle' && now > c.modeUntil) {
      if (focusWorkOn() && !packEv) {
        // foco de manada (v0.45): igual que la activa, acompaña la sesión
        // desde su rincón, sin pasear ni distraer
        const spot = compFavX(c);
        if (Math.abs(c.x - spot) > 14) { c.mode = 'walk'; c.targetX = spot; }
        c.modeUntil = now + 3500 + Math.random() * 2500;
      } else if (now - lastFocusOnAt < 8000) {
        // el foco acaba de apagarse (o parpadea): quieta un momento antes
        // de volver a pasear — evita carreras rincón↔paseo (v0.45.1)
        c.modeUntil = now + 1500;
      } else {
        if (Math.random() < 0.6) {
          c.mode = 'walk';
          const m = c.sz * 0.6 + 20;
          c.targetX = m + Math.random() * Math.max(60, window.innerWidth - m * 2);
        }
        c.modeUntil = now + 2000 + Math.random() * 5000;
      }
    }
    if (prof.float) {
      if (c.mode === 'walk') {
        c.dir = c.targetX > c.x ? 1 : -1;
        c.x += c.dir * 0.8;
        if (Math.abs(c.x - c.targetX) < 6) { c.mode = 'idle'; c.modeUntil = now + 2000 + Math.random() * 4000; }
      }
      const hov = c.sz * 0.10 + Math.sin(now / 500 + c.seed) * 5;
      c.lift += (hov - c.lift) * 0.12;
    } else if (c.hop || c.mode === 'walk') {
      compHop(c, now, prof);   // c.hop: aterriza aunque la charla la ponga en idle
    }
    if (prof.drip > 0.05 && now > (c.nextDrip || 0)) {
      c.nextDrip = now + (2400 + Math.random() * 2800) / prof.drip;
      dropFrom(c.x, c.lift + c.sz * 0.10, Math.max(4, Math.round(c.sz * 0.05)), c.dna);
    }
    let sx = 1, sy = 1;
    if (c.hop) { sx = c.sx; sy = c.sy; }
    else if (now < c.landUntil) {
      const t = 1 - (c.landUntil - now) / 260;
      const w = Math.exp(-3.4 * t) * Math.cos(t * 11.5);
      sx = 1 + 0.28 * c.landQ * w; sy = 1 - 0.34 * c.landQ * w;
    }
    const half = c.sz / 2;
    c.x = Math.max(half, Math.min(window.innerWidth - half, c.x));
    if (c.dir !== c.lastDir) { c.turnUntil = now + 170; c.lastDir = c.dir; }
    if (now < c.turnUntil) { const tk = (c.turnUntil - now) / 170; sx *= 1 - 0.2 * tk; sy *= 1 + 0.09 * tk; }
    if (!c.hop && !prof.float && c.lift > 0.5) {
      c.lift = Math.max(0, c.lift - Math.max(1.5, c.lift * 0.18));
      if (c.lift < 1) { c.lift = 0; c.landUntil = now + 260; c.landQ = 0.5; }
    }
    if (c.sh) {
      const su = c.lift * (200 / c.sz);
      const ss = Math.max(0.45, 1 - c.lift / (c.sz * 1.15));
      c.sh.style.transform = 'translateY(' + su.toFixed(1) + 'px) scale(' + ss.toFixed(3) + ')';
    }
    c.node.style.transform = 'translateX(' + Math.round(c.x - half) + 'px) translateY(' + (-Math.round(c.lift)) + 'px) scaleX(' + (c.dir < 0 ? -1 : 1) + ') scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')';
  }

  /* ── interacciones de manada: 6 tipos, con Gemini Nano por criatura ── */
  function chipBubble(cx, bottomPx, text, ms) {
    if (!root) return;
    const b = document.createElement('div');
    b.className = 'sf-bubble show';
    b.textContent = text;
    b.style.left = Math.max(90, Math.min(window.innerWidth - 90, cx)) + 'px';
    b.style.bottom = bottomPx + 'px';
    root.appendChild(b);
    setTimeout(() => b.remove(), ms || 3200);
  }
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function relayFor(dna, ctx) {
    try {
      const l = await chrome.runtime.sendMessage({ type: 'sf-line', ctx, dna });
      if (typeof l === 'string' && l) return l;
    } catch (e) {}
    return null;
  }
  function bankOf(d) {
    if (Math.random() < 0.3) {
      const sl = spLine(d, uiLangC());   // voz propia de la especie
      if (sl) return sl;
    }
    const src = phraseBank(uiLangC());
    const bank = src[d.temperament] || src.tranquilo;
    return bank[Math.floor(Math.random() * bank.length)];
  }
  function pDna(p) { return p.kind === 'active' ? S.dna : p.c.dna; }
  function pX(p) { return p.kind === 'active' ? x : p.c.x; }
  function pSz(p) { return p.kind === 'active' ? sizePx() : p.c.sz; }
  function pTarget(p, tx) {
    if (p.kind === 'active') { mode = 'walk'; targetX = tx; }
    else { p.c.mode = 'walk'; p.c.targetX = tx; }
  }
  function pIdle(p, now, ms) {
    if (p.kind === 'active') { mode = 'idle'; modeUntil = now + ms; }
    else { p.c.mode = 'idle'; p.c.modeUntil = now + ms; }
  }
  function pFace(p, d) { if (p.kind === 'active') dir = d; else p.c.dir = d; }
  function pHopFx(p) {
    const n = p.kind === 'active' ? wrap : p.c.node;
    if (!n) return;
    n.classList.add('hop');
    setTimeout(() => n.classList.remove('hop'), 520);
  }
  function relTxt(score) {
    return score >= 2 ? 'You adore each other.' : score === 1 ? 'You like each other.' : score === 0 ? 'You are merely cordial.'
      : score === -1 ? 'You barely stand each other.' : 'You clash completely.';
  }
  function sayAs(p, line, ms) { chipBubble(pX(p), pSz(p) + 12, pDna(p).name + ': «' + line + '»', ms || 3200); }
  function packDelay() { return (S && S.demoMode) ? 16000 + Math.random() * 20000 : 65000 + Math.random() * 95000; }   // v0.37: 1,1-2,7 min

  function bondRecord(dA, dB) {
    if (!S || !S.bonds || typeof dA.seed !== 'number' || typeof dB.seed !== 'number') return { n: 0, warmth: 0, tag: '' };
    const raw = S.bonds[Math.min(dA.seed, dB.seed) + '_' + Math.max(dA.seed, dB.seed)];
    if (!raw) return { n: 0, warmth: 0, tag: '' };
    return typeof raw === 'number' ? { n: raw, warmth: 0, tag: '' } : raw;
  }
  function bondCount(dA, dB) { return bondRecord(dA, dB).n; }
  function pickPackType(a, b, score) {
    const ta = pDna(a).temperament, tb = pDna(b).temperament;
    const spa = pDna(a).species, spb = pDna(b).species;
    const w = { charla: 30, mimo: score >= 1 ? 20 : 6, persecucion: 12, susto: 6, carrera: 10, siesta: 8 };
    if (ta === 'caotico' || tb === 'caotico') { w.susto += 14; w.carrera += 6; }
    if (spa === 'fantasma' || spb === 'fantasma') w.susto += 12;
    if (ta === 'jugueton' && tb === 'jugueton') { w.carrera += 14; w.persecucion += 8; }
    if (ta === 'tranquilo' && tb === 'tranquilo') w.siesta += 18;
    if (score <= -1) { w.mimo = 2; w.siesta = 2; w.charla += 10; w.persecucion += 8; }
    // El axolotl tiene fama de calmante: si hay mala química, rebaja la
    // tensión (menos susto/persecución, más charla tranquila).
    if (score <= -1 && (SP_TRAIT[spa] === 'calmante' || SP_TRAIT[spb] === 'calmante')) {
      w.susto = Math.max(1, Math.floor(w.susto * 0.4));
      w.persecucion = Math.max(1, Math.floor(w.persecucion * 0.5));
      w.charla += 10;
    }
    // Afinidad acumulada entre esta pareja concreta (no solo temperamento):
    // sube con encuentros bonitos, baja con sustos/roces. A más calidez,
    // más charla/mimo y menos susto entre ellos dos; a menos, al revés.
    const bw = bondRecord(pDna(a), pDna(b)).warmth;
    if (bw >= 2) { w.mimo += bw * 4; w.charla += bw * 3; w.susto = Math.max(1, Math.floor(w.susto * 0.7)); }
    else if (bw <= -2) { w.susto += Math.abs(bw) * 3; w.mimo = Math.max(1, Math.floor(w.mimo * 0.5)); }
    // Parejas "mejores amigos" (muchos encuentros) se buscan más entre ellas.
    if (bondCount(pDna(a), pDna(b)) >= BOND_FRIEND_AT_C) { w.mimo += 14; w.charla += 10; w.susto = Math.max(1, Math.floor(w.susto * 0.6)); }
    const pool = [];
    Object.entries(w).forEach(([k, n]) => { for (let i = 0; i < n; i++) pool.push(k); });
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function startPackEv(now) {
    const pool = [{ kind: 'active' }].concat(comps.map(c => ({ kind: 'comp', c })));
    if (pool.length < 2) return;
    const i = Math.floor(Math.random() * pool.length);
    let j = Math.floor(Math.random() * pool.length);
    if (j === i) j = (j + 1) % pool.length;
    let a = pool[i], b = pool[j];
    const score = compatScore(pDna(a).temperament, pDna(b).temperament);
    const type = pickPackType(a, b, score);
    // en el susto, ataca quien tenga madera de sustador
    if (type === 'susto') {
      const scary = p => pDna(p).temperament === 'caotico' || pDna(p).species === 'fantasma';
      if (scary(b) && !scary(a)) { const t = a; a = b; b = t; }
    }
    packEv = { type, a, b, score, phase: type === 'persecucion' ? 'chase' : 'approach',
               until: now + (type === 'persecucion' ? 6500 : 22000), spoke: 0, nextBeat: 0, started: false };
    // pre-calienta las sesiones de Nano mientras caminan a encontrarse
    try { chrome.runtime.sendMessage({ type: 'sf-nano-warm', dnas: [pDna(a), pDna(b)] }); } catch (err) {}
  }
  function bumpBond(dA, dB, midX, midY, warmthDelta, tag) {
    if (typeof dA.seed !== 'number' || typeof dB.seed !== 'number') return;
    try {
      chrome.runtime.sendMessage({ type: 'sf-bond', seeds: [dA.seed, dB.seed], warmthDelta: warmthDelta || 0, tag: tag || '' }, res => {
        if (res && res.justBonded) {
          part('💛', midX - 10, midY);
          chipBubble(midX, midY - 6, '💛 ' + L('bond_friends', { A: dA.name, B: dB.name }), 3600);
        }
      });
    } catch (e) {}
  }
  function packEvOutcome(pe) {
    // Cuánto sube/baja la afinidad de esta pareja y qué se llevan de
    // recuerdo (o nada) según cómo haya ido el encuentro.
    const da = pDna(pe.a), db = pDna(pe.b);
    switch (pe.type) {
      case 'charla': return { warmth: 1, tag: null };
      case 'mimo': return { warmth: 2, tag: pe.gifted ? (da.name + ' surprised ' + db.name + ' with an unexpected gift') : null };
      case 'susto': return pe.clever
        ? { warmth: 1, tag: db.name + ' dodged a scare from ' + da.name + ' with a witty comeback' }
        : { warmth: -1, tag: da.name + ' gave ' + db.name + ' a good scare' };
      case 'carrera': return { warmth: 1, tag: pe.winnerDna ? (pe.winnerDna.name + ' won a memorable race between them') : null };
      case 'persecucion': return { warmth: pe.score >= 1 ? 1 : 0, tag: null };
      case 'siesta': return { warmth: 1, tag: null };
      default: return { warmth: 0, tag: null };
    }
  }
  function endPackEv(now) {
    if (!packEv) return;
    const { a, b } = packEv;
    try { chrome.runtime.sendMessage({ type: 'sf-line-end', dnas: [pDna(a), pDna(b)] }); } catch (e) {}
    const outcome = packEvOutcome(packEv);
    bumpBond(pDna(a), pDna(b), (pX(a) + pX(b)) / 2, window.innerHeight - Math.max(pSz(a), pSz(b)) - 20, outcome.warmth, outcome.tag);
    [packEv.a, packEv.b].forEach(p => pIdle(p, now, 2500));
    packEv = null;
  }

  /* Plomería de prompts a Nano (v0.45.4): todo lo que viaja DENTRO de un
     prompt va en inglés — un único idioma interno evita que el modelo imite
     el idioma equivocado. El idioma de SALIDA lo fija el sw (system +
     ejemplo n-shot + refuerzo por mensaje en el idioma de la UI). */
  const ACC_LABEL = { lazo: 'a bow', bufanda: 'a scarf', gorro: 'a beanie', monoculo: 'a monocle' };
  const SPEC_EN = { slime: 'slime', gato: 'cat', perro: 'dog', conejo: 'bunny', zorro: 'fox', panda: 'panda', pinguino: 'penguin', buho: 'owl', axolotl: 'axolotl', dragon: 'dragon', fenix: 'phoenix', kraken: 'kraken', unicornio: 'unicorn', kitsune: 'kitsune', hada: 'fairy', fantasma: 'ghost' };
  function noticeFlavor(otherDna) {
    // Estilo "Suck Up!": fijarse en un detalle concreto del otro (lo que
    // lleva puesto) da sensación de que de verdad te está mirando.
    const lbl = ACC_LABEL[otherDna.accessory];
    if (lbl && Math.random() < 0.3) return ' ' + otherDna.name + ' is wearing ' + lbl + '; feel free to mention it.';
    return '';
  }
  function bondFlavor(dA, dB) {
    // Estilo Nemesis System: un recuerdo concreto de un encuentro pasado
    // con esta pareja exacta, no una charla genérica cada vez.
    const rec = bondRecord(dA, dB);
    if (rec.tag && Math.random() < 0.3) return ' A memory you two share: ' + rec.tag + '. You may mention or hint at it, very brief.';
    return '';
  }
  const CONFIANZA_LINES = {
    es: ['Contigo casi ni hace falta hablar.', 'Sabía que andarías por aquí.', 'Con nadie me río tanto como contigo.', 'Ya ni me acuerdo de cuando no te conocía.'],
    en: ['With you I barely need words.', 'I knew you\u2019d be around.', 'No one makes me laugh like you do.', 'I can barely remember not knowing you.'],
    de: ['Bei dir brauche ich kaum Worte.', 'Ich wusste, du w\u00e4rst hier.', 'Mit niemandem lache ich so wie mit dir.', 'Ich erinnere mich kaum, dich nicht gekannt zu haben.'],
    fr: ['Avec toi, les mots sont presque inutiles.', 'Je savais que tu serais l\u00e0.', 'Avec personne je ris autant qu\u2019avec toi.', 'Je me souviens \u00e0 peine d\u2019avant toi.'],
    it: ['Con te non servono nemmeno le parole.', 'Sapevo che saresti stato qui.', 'Con nessuno rido quanto con te.', 'Non ricordo nemmeno com\u2019era prima di conoscerti.'],
    pt: ['Contigo quase nem preciso de palavras.', 'Sabia que estarias por aqui.', 'Com ningu\u00e9m me rio tanto como contigo.', 'J\u00e1 nem me lembro de quando n\u00e3o te conhecia.']
  };
  function confianzaLine() {
    const arr = CONFIANZA_LINES[uiLangC()] || CONFIANZA_LINES.es;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function warmBankOf(dna, otherDna) {
    // Estilo Hades II: en vez de generar más con IA, un banco pequeño
    // escrito a mano para parejas con mucha confianza acumulada.
    const bw = bondRecord(dna, otherDna).warmth;
    if (bw >= 3 && Math.random() < 0.5) return confianzaLine();
    return bankOf(dna);
  }
  function roleFlavor(dna) {
    // Pequeño extra de personalidad según la especialidad de la especie
    // (ver SP_TRAIT). No siempre se dispara, para que siga siendo una
    // sorpresa y no una muletilla.
    const tr = SP_TRAIT[dna.species];
    if (tr === 'dato' && Math.random() < 0.35) return ' Take the chance to drop a random fun fact, very brief.';
    if (tr === 'misteriosa' && Math.random() < 0.3) return ' Leave the sentence unfinished, like someone keeping a secret.';
    return '';
  }

  function replayWit(pe) {
    // Las criaturas rememoran un pique aprendido en los duelos, como
    // quien repite un chiste interno. Refuerza la colección de ingenios.
    const { a, b } = pe;
    const bank = duelBank(uiLangC());
    const pair = bank[S.wits[Math.floor(Math.random() * S.wits.length)]];
    if (!pair) return;
    sayAs(a, pair.p, 3000);
    setTimeout(() => { if (packEv === pe) sayAs(b, pair.r, 3200); }, 3300);
  }

  /* ── Charlas guionizadas (v0.36): diálogos coherentes de 3 turnos, por nivel
     de relación (0 desconocidos · 1 conocidos · 2 amigos). Son el SUELO de
     calidad: sin Nano las charlas eran 3 frases de banco inconexas ("hola y
     adiós"); con esto siempre hay conversación de verdad. $A/$B = nombres. ── */
  const CHARLAS = {
  es: [
    {n:0,t:['No te había visto por esta página. ¿Vienes mucho?','Primera vez. Me han dicho que el scroll es suave.','Lo es. Pero cuidado con los banners.']},
    {n:0,t:['¿Tú también vives en esta pantalla?','Solo de paso. Sigo a mi humano a todas partes.','Ah, el mío igual. No saben estarse quietos.']},
    {n:0,t:['Perdona, ¿este rincón está ocupado?','Ahora sí. Pero cabemos dos.','Trato hecho. Yo vigilo la izquierda.']},
    {n:0,t:['Bonito rebote. ¿Entrenas?','Nací con él. Lo tuyo también tiene mérito.','Años de práctica contra el borde de la pantalla.']},
    {n:1,t:['¿Sabes qué? Ayer casi cazo el cursor.','Eso mismo dijiste la semana pasada.','Esta vez fue MUY casi.']},
    {n:1,t:['Esta página tiene demasiada letra pequeña.','Y poca sombra donde sentarse.','Los píxeles ya no se hacen como antes.']},
    {n:1,t:['Te veo brillante hoy, $B. ¿Ducha nueva?','Champú de burbujas premium. Cortesía del humano.','El mío me debe una.']},
    {n:1,t:['¿Un piquecito de carreras luego?','Solo si no haces trampas en la salida.','Yo nunca. Casi nunca.']},
    {n:2,t:['¿Te acuerdas de la caja de cartón?','JA. Todavía sueño con ella.','Éramos jóvenes y valientes.']},
    {n:2,t:['Si fueras un píxel, serías de los buenos.','Y tú de los que nunca parpadean.','Para, que me sonrojo de verdad.']},
    {n:2,t:['Te guardé un sitio al sol, $B.','Por eso eres mi favorito de esta pantalla.','Que no se entere el resto de la manada.']},
    {n:2,t:['Un día deberíamos escaparnos a otra pestaña.','¿A la de los vídeos de gatitos?','Sabía que dirías eso.']}
  ],
  en: [
    {n:0,t:["Haven't seen you on this page before. Come here often?","First time. I hear the scrolling is smooth.","It is. But watch out for the banners."]},
    {n:0,t:['Do you live on this screen too?','Just passing through. I follow my human everywhere.','Ah, same. They never sit still.']},
    {n:0,t:['Excuse me, is this corner taken?','It is now. But there\'s room for two.','Deal. I\'ll watch the left side.']},
    {n:0,t:['Nice bounce. Do you train?','Born with it. Yours has merit too.','Years of practice against the screen edge.']},
    {n:1,t:['Guess what? I almost caught the cursor yesterday.','You said that last week too.','This time it was VERY almost.']},
    {n:1,t:['This page has way too much fine print.','And nowhere shady to sit.','They don\'t make pixels like they used to.']},
    {n:1,t:['You look shiny today, $B. New shower?','Premium bubble shampoo. Courtesy of the human.','Mine owes me one.']},
    {n:1,t:['Quick race later, just for bragging rights?','Only if you don\'t cheat at the start.','Me? Never. Almost never.']},
    {n:2,t:['Remember the cardboard box?','HA. I still dream about it.','We were young and brave.']},
    {n:2,t:['If you were a pixel, you\'d be one of the good ones.','And you\'d be one that never flickers.','Stop, I\'m actually blushing.']},
    {n:2,t:['Saved you a sunny spot, $B.','That\'s why you\'re my favorite on this screen.','Don\'t tell the rest of the pack.']},
    {n:2,t:['Someday we should run off to another tab.','The one with the kitten videos?','I knew you\'d say that.']}
  ],
  de: [
    {n:0,t:['Dich habe ich hier noch nie gesehen. Kommst du öfter?','Zum ersten Mal. Das Scrollen soll hier weich sein.','Ist es. Aber Vorsicht mit den Bannern.']},
    {n:0,t:['Wohnst du auch auf diesem Bildschirm?','Nur auf der Durchreise. Ich folge meinem Menschen überallhin.','Ah, meiner genauso. Die können nie stillsitzen.']},
    {n:0,t:['Entschuldige, ist diese Ecke besetzt?','Jetzt schon. Aber wir passen zu zweit rein.','Abgemacht. Ich übernehme die linke Seite.']},
    {n:0,t:['Schöner Hüpfer. Trainierst du?','Damit geboren. Deiner ist auch nicht übel.','Jahre der Übung gegen den Bildschirmrand.']},
    {n:1,t:['Weißt du was? Gestern hätte ich fast den Cursor gefangen.','Das hast du letzte Woche auch gesagt.','Diesmal war es SEHR fast.']},
    {n:1,t:['Diese Seite hat zu viel Kleingedrucktes.','Und keinen Schatten zum Sitzen.','Pixel werden auch nicht mehr gemacht wie früher.']},
    {n:1,t:['Du glänzt heute, $B. Neue Dusche?','Premium-Blasenshampoo. Mit Grüßen vom Menschen.','Meiner schuldet mir noch eins.']},
    {n:1,t:['Später ein kleines Wettrennen?','Nur wenn du am Start nicht schummelst.','Ich? Nie. Fast nie.']},
    {n:2,t:['Erinnerst du dich an den Pappkarton?','HA. Ich träume noch davon.','Wir waren jung und mutig.']},
    {n:2,t:['Wärst du ein Pixel, wärst du einer von den guten.','Und du einer, der nie flackert.','Hör auf, ich werde echt rot.']},
    {n:2,t:['Ich habe dir einen Sonnenplatz freigehalten, $B.','Deshalb bist du mein Liebling auf diesem Bildschirm.','Sag es nicht dem Rest des Rudels.']},
    {n:2,t:['Irgendwann sollten wir in einen anderen Tab abhauen.','In den mit den Katzenvideos?','Ich wusste, dass du das sagst.']}
  ],
  fr: [
    {n:0,t:['Je ne t\'avais jamais vu sur cette page. Tu viens souvent ?','Première fois. Il paraît que le défilement est doux.','Il l\'est. Mais méfie-toi des bannières.']},
    {n:0,t:['Toi aussi tu vis sur cet écran ?','Juste de passage. Je suis mon humain partout.','Ah, pareil. Ils ne tiennent pas en place.']},
    {n:0,t:['Pardon, ce coin est pris ?','Maintenant oui. Mais on tient à deux.','Marché conclu. Je surveille la gauche.']},
    {n:0,t:['Joli rebond. Tu t\'entraînes ?','Né avec. Le tien a du mérite aussi.','Des années de pratique contre le bord de l\'écran.']},
    {n:1,t:['Tu sais quoi ? Hier j\'ai presque attrapé le curseur.','Tu as dit ça la semaine dernière aussi.','Cette fois c\'était TRÈS presque.']},
    {n:1,t:['Cette page a trop de petits caractères.','Et pas d\'ombre où s\'asseoir.','On ne fait plus les pixels comme avant.']},
    {n:1,t:['Tu brilles aujourd\'hui, $B. Nouvelle douche ?','Shampoing à bulles premium. Offert par l\'humain.','Le mien m\'en doit une.']},
    {n:1,t:['Une petite course tout à l\'heure ?','Seulement si tu ne triches pas au départ.','Moi ? Jamais. Presque jamais.']},
    {n:2,t:['Tu te souviens du carton ?','HA. J\'en rêve encore.','On était jeunes et courageux.']},
    {n:2,t:['Si tu étais un pixel, tu serais un des bons.','Et toi un de ceux qui ne clignotent jamais.','Arrête, je rougis pour de vrai.']},
    {n:2,t:['Je t\'ai gardé une place au soleil, $B.','C\'est pour ça que tu es mon préféré sur cet écran.','Ne le dis pas au reste de la meute.']},
    {n:2,t:['Un jour on devrait filer vers un autre onglet.','Celui des vidéos de chatons ?','Je savais que tu dirais ça.']}
  ],
  it: [
    {n:0,t:['Non ti avevo mai visto su questa pagina. Vieni spesso?','Prima volta. Dicono che lo scroll sia morbido.','Lo è. Ma occhio ai banner.']},
    {n:0,t:['Anche tu vivi su questo schermo?','Solo di passaggio. Seguo il mio umano ovunque.','Ah, il mio uguale. Non sanno stare fermi.']},
    {n:0,t:['Scusa, questo angolo è occupato?','Adesso sì. Ma ci stiamo in due.','Affare fatto. Io sorveglio la sinistra.']},
    {n:0,t:['Bel rimbalzo. Ti alleni?','Ci sono nato. Anche il tuo ha merito.','Anni di pratica contro il bordo dello schermo.']},
    {n:1,t:['Sai una cosa? Ieri ho quasi preso il cursore.','L\'hai detto anche la settimana scorsa.','Stavolta è stato MOLTO quasi.']},
    {n:1,t:['Questa pagina ha troppe scritte piccole.','E niente ombra dove sedersi.','Non fanno più i pixel come una volta.']},
    {n:1,t:['Ti vedo lucido oggi, $B. Doccia nuova?','Shampoo alle bolle premium. Cortesia dell\'umano.','Il mio me ne deve una.']},
    {n:1,t:['Una gara veloce più tardi?','Solo se non bari alla partenza.','Io? Mai. Quasi mai.']},
    {n:2,t:['Ti ricordi la scatola di cartone?','AH. La sogno ancora.','Eravamo giovani e coraggiosi.']},
    {n:2,t:['Se fossi un pixel, saresti uno di quelli buoni.','E tu uno di quelli che non sfarfallano mai.','Smettila, arrossisco davvero.']},
    {n:2,t:['Ti ho tenuto un posto al sole, $B.','Ecco perché sei il mio preferito su questo schermo.','Non dirlo al resto del branco.']},
    {n:2,t:['Un giorno dovremmo scappare in un\'altra scheda.','Quella dei video di gattini?','Sapevo che l\'avresti detto.']}
  ],
  pt: [
    {n:0,t:['Nunca te tinha visto nesta página. Vens cá muito?','Primeira vez. Dizem que o scroll é suave.','E é. Mas cuidado com os banners.']},
    {n:0,t:['Também vives neste ecrã?','Só de passagem. Sigo o meu humano para todo o lado.','Ah, o meu igual. Não sabem estar quietos.']},
    {n:0,t:['Desculpa, este canto está ocupado?','Agora está. Mas cabemos os dois.','Combinado. Eu vigio a esquerda.']},
    {n:0,t:['Belo salto. Treinas?','Nasci com ele. O teu também tem mérito.','Anos de prática contra a borda do ecrã.']},
    {n:1,t:['Sabes que mais? Ontem quase apanhei o cursor.','Disseste isso na semana passada.','Desta vez foi MESMO quase.']},
    {n:1,t:['Esta página tem letra pequena a mais.','E pouca sombra para sentar.','Já não fazem píxeis como antigamente.']},
    {n:1,t:['Estás brilhante hoje, $B. Duche novo?','Champô de bolhas premium. Cortesia do humano.','O meu deve-me um.']},
    {n:1,t:['Uma corridinha logo?','Só se não fizeres batota na partida.','Eu? Nunca. Quase nunca.']},
    {n:2,t:['Lembras-te da caixa de cartão?','AH. Ainda sonho com ela.','Éramos jovens e corajosos.']},
    {n:2,t:['Se fosses um píxel, serias dos bons.','E tu daqueles que nunca piscam.','Para, que estou mesmo a corar.']},
    {n:2,t:['Guardei-te um lugar ao sol, $B.','Por isso és o meu favorito neste ecrã.','Não contes ao resto da matilha.']},
    {n:2,t:['Um dia devíamos fugir para outro separador.','O dos vídeos de gatinhos?','Sabia que ias dizer isso.']}
  ]
  };
  async function runScriptedCharla(pe) {
    const { a, b, score } = pe;
    const da = pDna(a), db = pDna(b);
    const bank = CHARLAS[uiLangC()] || CHARLAS.es;
    const tier = score >= 3 ? 2 : score >= 1 ? 1 : 0;
    const pool = bank.filter(d => d.n === tier);
    const d = pool[Math.floor(Math.random() * pool.length)];
    const sub = s => s.split('$A').join(da.name).split('$B').join(db.name);
    sayAs(a, sub(d.t[0]));
    await wait(3300); if (packEv !== pe) return;
    sayAs(b, sub(d.t[1]));
    await wait(3300); if (packEv !== pe) return;
    sayAs(a, sub(d.t[2]), 2800);
  }
  async function runCharla(pe) {
    const { a, b, score } = pe;
    if (S.wits && S.wits.length && Math.random() < 0.15) return replayWit(pe);
    if (Math.random() < 0.35) return runScriptedCharla(pe);   // suelo de calidad garantizado
    const da = pDna(a), db = pDna(b), rel = relTxt(score);
    const l1 = await relayFor(da, 'You are out for a stroll and run into ' + db.name + ' (a ' + (SPEC_EN[db.species] || 'creature') + '). ' + rel + ' Say ONE sentence about something concrete (this page, your human, a plan, something that happened to you). Greetings like hello or hi are FORBIDDEN.' + roleFlavor(da) + noticeFlavor(db) + bondFlavor(da, db));
    if (!l1) return runScriptedCharla(pe);
    if (packEv !== pe) return;
    sayAs(a, l1);
    await wait(3400); if (packEv !== pe) return;
    const l2 = await relayFor(db, da.name + ' just told you: "' + l1 + '". ' + rel + ' Reply to the CONTENT with your personality, no greetings, brief.' + roleFlavor(db)) || bankOf(db);
    if (packEv !== pe) return;
    sayAs(b, l2);
    await wait(3400); if (packEv !== pe) return;
    const l3 = await relayFor(da, db.name + ' replied: "' + l2 + '". Close the chat with one very short sentence.' + roleFlavor(da)) || bankOf(da);
    if (packEv !== pe) return;
    sayAs(a, l3, 2800);
    if (Math.random() < 0.4) {
      await wait(2600); if (packEv !== pe) return;
      const l4 = await relayFor(db, da.name + ' said, wrapping up: "' + l3 + '". Give one last very short comeback, with your personality.' + roleFlavor(db)) || bankOf(db);
      if (packEv !== pe) return;
      sayAs(b, l4, 2600);
    }
  }
  async function runRegalo(pe) {
    const { a, b } = pe;
    pe.gifted = true;
    const gifts = { fenix: '✨', hada: '🌼', kraken: '🐚', axolotl: '🫧' };
    const g = gifts[pDna(a).species] || ['🌸', '🐟', '🧦', '🍬'][Math.floor(Math.random() * 4)];
    part(g, (pX(a) + pX(b)) / 2 - 10, window.innerHeight - pSz(b) * 0.6);
    sayAs(a, L('gift_give'), 2400);
    await wait(2200); if (packEv !== pe) return;
    pHopFx(b);
    const th = await relayFor(pDna(b), pDna(a).name + ' just gave you ' + g + ' as a gift. Say thanks your own way, brief.') || L('gift_thanks');
    if (packEv !== pe) return;
    sayAs(b, th, 2800);
  }
  async function runMimoTalk(pe) {
    // Rama "mimo" sin regalo: antes se quedaban 13.5s en silencio, solo con
    // corazones flotando. Ahora siempre se dicen algo cariñoso, breve.
    const { a, b, score } = pe;
    const da = pDna(a), db = pDna(b), rel = relTxt(score);
    const l1 = await relayFor(da, 'You are cuddling up with ' + db.name + '. ' + rel + ' Say something affectionate and very brief.' + bondFlavor(da, db)) || warmBankOf(da, db);
    if (packEv !== pe) return;
    sayAs(a, l1, 2800);
    await wait(3000); if (packEv !== pe) return;
    const l2 = await relayFor(db, da.name + ' just told you: "' + l1 + '" while you cuddle. Reply warmly, brief.') || bankOf(db);
    if (packEv !== pe) return;
    sayAs(b, l2, 2800);
  }
  async function runSusto(pe) {
    const { a, b } = pe;
    part('❗', pX(b) - 10, window.innerHeight - pSz(b) - 14);
    pHopFx(b); await wait(240); if (packEv !== pe) return; pHopFx(b);
    const clever = SP_TRAIT[pDna(b).species] === 'ingenioso' && Math.random() < 0.55;
    pe.clever = clever;
    const sc = clever
      ? (await relayFor(pDna(b), pDna(a).name + ' tried to sneak-scare you from behind, but you saw it coming! React with a witty comeback, brief.') || L('scare_react', { N: pDna(a).name }))
      : (await relayFor(pDna(b), pDna(a).name + ' just sneak-scared you from behind! React, brief.') || L('scare_react', { N: pDna(a).name }));
    if (packEv !== pe) return;
    sayAs(b, sc, 2600);
    await wait(2400); if (packEv !== pe) return;
    const ja = clever
      ? (await relayFor(pDna(a), 'You tried to scare ' + pDna(b).name + ' but they dodged it with a witty comeback. Give them credit, brief.') || L('scare_laugh'))
      : (await relayFor(pDna(a), 'You just scared ' + pDna(b).name + ' and it worked. Laugh about it, brief.') || L('scare_laugh'));
    if (packEv !== pe) return;
    sayAs(a, ja, 2400);
  }
  function tickPackEv(now) {
    if (!packEv) return;
    if (now > packEv.until) { endPackEv(now); return; }
    const pe = packEv, { a, b, type } = pe;
    if (type === 'persecucion') {
      const bx = pX(b), half = pSz(b) / 2;
      let flee = bx + (bx > pX(a) ? 240 : -240);
      if (flee < half + 10 || flee > window.innerWidth - half - 10) flee = bx > window.innerWidth / 2 ? half + 20 : window.innerWidth - half - 20;
      pTarget(b, flee);
      pTarget(a, pX(b) - Math.sign(pX(b) - pX(a)) * pSz(a) * 0.4);
      if (now > pe.nextBeat) {
        pe.nextBeat = now + 1400;
        part('💨', pX(b) - 12, window.innerHeight - pSz(b) * 0.6);
        // El pingüino tiene fama de torpe: se resbala huyendo, muy de vez en cuando.
        if (SP_TRAIT[pDna(b).species] === 'torpe' && Math.random() < 0.3) {
          part('💫', pX(b) - 6, window.innerHeight - pSz(b) - 10);
          pIdle(b, now, 500);
        }
      }
      return;
    }
    if (type === 'carrera' && pe.phase === 'race') {
      if (now > pe.nextBeat) { pe.nextBeat = now + 1100; part('💨', (pX(a) + pX(b)) / 2, window.innerHeight - pSz(a) * 0.55); }
      const winA = Math.abs(pX(a) - pe.goal) < 16, winB = Math.abs(pX(b) - pe.goal) < 16;
      if (winA || winB) {
        const win = winA ? a : b, lose = winA ? b : a;
        pe.winnerDna = pDna(win);
        pHopFx(win); setTimeout(() => packEv === pe && pHopFx(win), 400);
        part('🏆', pX(win) - 10, window.innerHeight - pSz(win) - 12);
        relayFor(pDna(win), 'You just won a race against ' + pDna(lose).name + '. Brag, brief.').then(l => { if (packEv === pe) sayAs(win, l || L('race_win')); });
        setTimeout(() => { if (packEv === pe) sayAs(lose, bankOf(pDna(lose)), 2400); }, 2600);
        pe.phase = 'done'; pe.until = now + 5200;
      }
      return;
    }
    const gap = pSz(a) * 0.55 + pSz(b) * 0.55 + 20;
    if (pe.phase === 'approach') {
      const meet = Math.max(gap, Math.min(window.innerWidth - gap, (pX(a) + pX(b)) / 2));
      pTarget(a, meet - gap / 2);
      pTarget(b, meet + gap / 2);
      if (Math.abs(pX(a) - (meet - gap / 2)) < 14 && Math.abs(pX(b) - (meet + gap / 2)) < 14) {
        pFace(a, pX(b) > pX(a) ? 1 : -1);
        pFace(b, pX(a) > pX(b) ? 1 : -1);
        pIdle(a, now, 14000); pIdle(b, now, 14000);
        if (type === 'carrera') {
          pe.phase = 'race'; pe.until = now + 9000; pe.nextBeat = 0;
          pe.goal = pX(a) < window.innerWidth / 2 ? window.innerWidth - 90 : 90;
          chipBubble((pX(a) + pX(b)) / 2, Math.max(pSz(a), pSz(b)) + 14, L('race_start'), 1800);
          setTimeout(() => { if (packEv === pe) { pTarget(a, pe.goal); pTarget(b, pe.goal + (pe.goal > 200 ? -pSz(b) : pSz(b))); } }, 1600);
          return;
        }
        pe.phase = 'meet'; pe.until = now + (type === 'siesta' ? 10000 : 13500);
        if (!pe.started) {
          pe.started = true;
          if (type === 'charla') runCharla(pe);
          else if (type === 'mimo') (pe.score >= 1 && Math.random() < 0.45 ? runRegalo(pe) : runMimoTalk(pe));
          else if (type === 'susto') runSusto(pe);
        }
      }
      return;
    }
    // fase meet: latidos ambientales según el tipo
    if (now > pe.nextBeat) {
      pe.nextBeat = now + 2900;
      pe.spoke++;
      const midX = (pX(a) + pX(b)) / 2;
      const em = pe.score >= 2 ? '💕' : pe.score === 1 ? '🙂' : pe.score === 0 ? '😐' : pe.score === -1 ? '😾' : '⚡';
      if (type === 'siesta') {
        part('💤', midX - 8 + (Math.random() * 26 - 13), window.innerHeight - Math.max(pSz(a), pSz(b)) - 8);
      } else if (type === 'mimo') {
        part('🤍', midX - 10 + (Math.random() * 30 - 15), window.innerHeight - Math.max(pSz(a), pSz(b)) * 0.6);
        if (pe.score >= 1) pHopFx(pe.spoke % 2 ? a : b);
      } else if (type === 'charla') {
        if (pe.spoke >= 2) part(em, midX - 10, window.innerHeight - Math.max(pSz(a), pSz(b)) * 0.55);
        if (pe.score >= 1) pHopFx(pe.spoke % 2 ? a : b);
        else if (pe.score <= -1 && pe.spoke >= 4) {
          pTarget(a, pX(a) - 60); pTarget(b, pX(b) + 60);
          part('⚡', midX - 10, window.innerHeight - pSz(a) * 0.6);
          pe.until = now + 800;
        }
      }
    }
  }

  /* ── visitante en página (espejo de la visita del popup) ── */
  function visitEmojiC(score) { return score >= 2 ? '💕' : score === 1 ? '🙂' : score === 0 ? '😐' : score === -1 ? '😾' : '⚡'; }
  function spawnVisitor(av) {
    if (visit || !root) return;
    const holder = document.createElement('div');
    holder.className = 'sf-visitor';
    const sz = Math.max(50, Math.round(sizePx() * 0.72));
    holder.innerHTML = '<svg viewBox="0 0 200 200" width="' + sz + '" height="' + sz + '" style="transform:scaleX(-1)">' +
      buildCreature(av.dna, av.stage || 1, { dirtLvl: 0, poops: 0, focusing: false, mood: 80 })
        .split('bodyclip').join('bodyclipVV') + '</svg>';
    root.appendChild(holder);
    visit = { node: holder, vx: window.innerWidth + 90, sz, av, phase: 'in', greeted: false };
  }
  function tickVisit(now) {
    if (!visit) return;
    // cameo de manada (v0.41): tras el saludo, una compañera puede acercarse
    if (visit.greeted && !visit.cameoAt) visit.cameoAt = now + 4500 + Math.random() * 3500;
    if (visit.cameoAt && !visit.cameoDone && now > visit.cameoAt) {
      visit.cameoDone = true;
      if (comps.length && Math.random() < 0.65 && visit.av && visit.av.dna) {
        const c = comps[Math.floor(Math.random() * comps.length)];
        const vn = visit.av.dna.name;
        pTarget({ kind: 'comp', c }, Math.max(c.sz * 0.5 + 8, (visit.meetX || x) - sizePx() * 0.8));
        setTimeout(() => {
          if (!visit || !comps.includes(c)) return;
          c.dir = 1;
          sayAs({ kind: 'comp', c }, L('cameo_visit').split('$V').join(vn), 3400);
        }, 2200);
      }
    }
    // marcas fijas: el visitante se detiene en stopX, la mascota en meetX
    if (!visit.stopX) {
      visit.stopX = Math.min(window.innerWidth - visit.sz * 0.5 - 12, Math.max(window.innerWidth * 0.62, x + 60));
      visit.meetX = Math.max(sizePx() * 0.5 + 8, visit.stopX - (sizePx() * 0.55 + visit.sz * 0.55 + 26));
      visit.node.classList.add('walking');
    }
    if (visit.phase === 'in') {
      visit.vx = Math.max(visit.stopX, visit.vx - 2.6);
      if (Math.abs(x - visit.meetX) > 6) { mode = 'walk'; targetX = visit.meetX; dir = visit.meetX > x ? 1 : -1; }
      else mode = 'idle';
      if (visit.vx <= visit.stopX && Math.abs(x - visit.meetX) <= 8) {
        visit.phase = 'stay';
        visit.node.classList.remove('walking');
        mode = 'idle'; modeUntil = now + 9e9;      // nada de paseos hasta que acabe
        dir = 1;                                    // se miran
        wrap.classList.add('land'); setTimeout(() => wrap && wrap.classList.remove('land'), 320);
        visit.node.classList.add('land'); setTimeout(() => visit && visit.node.classList.remove('land'), 320);
        if (!visit.greeted) {
          visit.greeted = true;
          const fem = visit.av.dna.gender === 'hembra';
          (async () => {
            let hLine = null;
            try { hLine = await chrome.runtime.sendMessage({ type: 'sf-line', ctx: 'Tu ' + (fem ? 'amiga' : 'amigo') + ' ' + visit.av.dna.name + ' ha venido a verte a esta página. Salúdal' + (fem ? 'a' : 'o') + ', breve.' + noticeFlavor(visit.av.dna) + bondFlavor(S.dna, visit.av.dna) }); } catch (e) {}
            hLine = (typeof hLine === 'string' && hLine) ? hLine : phrase();
            if (!visit) return;
            say(hLine);
            await wait(5200); if (!visit) return;
            const vLine = await relayFor(visit.av.dna, S.dna.name + ' just said to you: "' + hLine + '". Greet them back, brief, with your personality.') || bankOf(visit.av.dna);
            if (!visit) return;
            say(visit.av.dna.name + ': «' + vLine + '»', 3600);
            if (Math.random() < 0.5) {
              await wait(3400); if (!visit) return;
              let hLine2 = null;
              try { hLine2 = await chrome.runtime.sendMessage({ type: 'sf-line', ctx: visit.av.dna.name + ' te ha respondido: «' + vLine + '». Contesta con una réplica muy corta.' }); } catch (e) {}
              if (typeof hLine2 === 'string' && hLine2 && visit) say(hLine2, 2800);
            }
          })();
          const em = visitEmojiC(visit.av.score);
          let k = 0;
          const iv = setInterval(() => {
            if (!visit) { clearInterval(iv); return; }
            part(em, (x + visit.vx) / 2 - 10, window.innerHeight - sizePx() * 0.6 - Math.random() * 40);
            if (++k >= 4) clearInterval(iv);
          }, 2600);
        }
      }
    } else if (visit.phase === 'stay') {
      mode = 'idle';
      if (visit.vx > x + 8) dir = 1;               // mirando al visitante, sin jitter
      // micro-interacciones según la química
      if (now > (visit.nextBeat || 0)) {
        visit.nextBeat = now + 3200 + Math.random() * 1800;
        if (visit.av.score >= 1) {
          // saltitos alternos de alegría
          const who = (visit.beat = !visit.beat) ? wrap : visit.node;
          who.classList.add('hop'); setTimeout(() => who && who.classList.remove('hop'), 520);
        } else if (visit.av.score <= -1 && x > visit.meetX - 40 && Math.random() < 0.65) {
          x -= 16;                                  // se aparta un pasito, incómoda
        }
      }
      if (!S.activeVisit || Date.now() > S.activeVisit.until) {
        visit.phase = 'out';
        visit.node.classList.add('walking');
        const sv = visit.node.querySelector('svg');
        if (sv) sv.style.transform = 'scaleX(1)';   // se da la vuelta para irse
        modeUntil = now + 1800;                     // la mascota recupera su vida tras la despedida
        try { chrome.runtime.sendMessage({ type: 'sf-line-end', dnas: [S.dna, visit.av.dna] }); } catch (e) {}
        bumpBond(S.dna, visit.av.dna, (x + visit.vx) / 2, window.innerHeight - sizePx() - 20);
      }
    } else {
      visit.vx += 3.2;
      if (visit.vx > window.innerWidth + 130) { visit.node.remove(); visit = null; modeUntil = 0; return; }
    }
    if (visit) {
      const vprof = LOCO[visit.av.dna.species] || LOCO.slime;
      if (vprof.drip > 0.05 && now > (visit.nextDrip || 0)) {
        visit.nextDrip = now + (2400 + Math.random() * 2800) / vprof.drip;
        dropFrom(visit.vx, visit.sz * 0.10, Math.max(4, Math.round(visit.sz * 0.05)), visit.av.dna);
      }
      visit.node.style.left = (visit.vx - visit.sz / 2) + 'px';
    }
  }
  function syncVisit() {
    if (!S) return;
    if (S.activeVisit && !visit && Date.now() < S.activeVisit.until) spawnVisitor(S.activeVisit);
    if (!S.activeVisit && visit && visit.phase !== 'out') {
      visit.phase = 'out';
      try { chrome.runtime.sendMessage({ type: 'sf-line-end', dnas: [S.dna, visit.av.dna] }); } catch (e) {}
    }
  }

  /* ═══════════ COMPORTAMIENTO BASE ═══════════ */
  function pickNext(now) {
    if (Math.random() < 0.62) {
      mode = 'walk';
      const margin = sizePx() * 0.6 + 20;
      targetX = Math.random() < 0.25 ? favX()
        : margin + Math.random() * Math.max(60, window.innerWidth - margin * 2);
      dir = targetX > x ? 1 : -1;
      modeUntil = now + 20000;
    } else {
      mode = 'idle';
      modeUntil = now + 2000 + Math.random() * 5000;
    }
  }
  let loopErrs = 0;
  function loop(now) {
    // Watchdog (v0.46): un error en un tick se registra y se salta el frame,
    // pero la cadena de rAF NUNCA se corta — antes, cualquier excepción
    // congelaba a la criatura para siempre (p.ej. el bug del atajo G).
    if (!running) return;
    try { loopTick(now); }
    catch (err) { if (++loopErrs <= 12) { try { console.warn('[SlimeForge] tick:', err); } catch (e2) {} } }
    rafId = requestAnimationFrame(loop);
  }
  function loopTick(now) {
    if (S && S.phase === 'pet' && wrap) {
      if (now > nextPosSaveAt) { nextPosSaveAt = now + 4000; savePos(); }   // continuidad entre recargas (v0.45.3)
      if (!dragging) {
        const asleep = isAsleepC();
        wrap.classList.toggle('sleeping', asleep);
        tickVisit(now);
        if (!S.quietMode && !asleep && !ev && !visit && !S.focus && now > nextEventAt) { nextEventAt = now + eventDelay(); startEvent(); }
        tickEvent(now);
        if (!S.quietMode && !packEv && !visit && !ev && !asleep && !S.focus && comps.length >= 1 && now > nextPackAt) {
          nextPackAt = now + packDelay();
          startPackEv(now);
        }
        if (packEv) tickPackEv(now);
        // Pensamiento en solitario: solo cuando no hay nadie más con quien
        // interactuar (ni evento, ni manada, ni visita), para que la
        // criatura no se sienta muda fuera de esos encuentros.
        if (!S.quietMode && !asleep && !ev && !visit && !packEv && !S.focus && now > nextSoloAt) soloThought(now);
        if (!S.quietMode && !asleep && !ev && !visit && !packEv && !dragging && !S.focus && mode === 'idle' && now > nextMicroAt) microGesture(now);
        if (!asleep && !ev && !visit && !packEv && !dragging && !S.focus) tickGarden(now);
        renderFocusHud();
        if (asleep && !visit && !ev) {
          // dormida: se acurruca en su rincón favorito
          const fav = favX();
          if (Math.abs(x - fav) > 14) { mode = 'walk'; targetX = fav; dir = fav > x ? 1 : -1; }
          else { mode = 'idle'; modeUntil = now + 5000; }
        } else if (S.focus && !packEv && !visit && !ev) {
          // aviso de redes sociales durante el foco (v0.38): la criatura te pilla
          if (S.focus.kind !== 'break' && isSocialPage()) {
            if (!nextScoldAt) nextScoldAt = now + 2500;
            else if (now > nextScoldAt) scold(now);
          }
          // modo trabajo: acompaña la sesión desde su rincón, sin distraer
          if (now >= scoldPoseUntil) {
            const fav = favX();
            if (Math.abs(x - fav) > 14) { mode = 'walk'; targetX = fav; dir = fav > x ? 1 : -1; }
            else { mode = 'idle'; modeUntil = now + 4000; }
          }
          if (!focusCheered && S.focus.startedAt && Date.now() > S.focus.startedAt + (S.focus.endsAt - S.focus.startedAt) / 2) {
            focusCheered = true;
            say(L('focus_mid'), 3200);
            // foco de manada (v0.45): una compañera secunda el ánimo
            if (comps.length) {
              const ci = Math.floor(Math.random() * comps.length);
              setTimeout(() => {
                const c = comps[ci];
                if (!S || !S.focus || !c) return;
                c.node.classList.add('hop'); setTimeout(() => c.node.classList.remove('hop'), 520);
                chipBubble(c.x, c.sz + c.lift + 12, c.dna.name + ': \u00ab' + L('focus_pack_mid') + '\u00bb', 3200);
              }, 2600);
            }
          }
        } else if (!packEv && !visit && (!ev || ev.type === 'wild')) {
          if (now > modeUntil) pickNext(now);
        }
        // reacciones al cursor cercano, según temperamento
        if (!asleep && !visit && !ev && !packEv && mx !== null && now > reactCd) {
          const cy = window.innerHeight - sizePx() * 0.5;
          if (Math.hypot(mx - x, my - cy) < sizePx() * 0.95 + 40) {
            reactCd = now + 7000 + Math.random() * 5000;
            const t = S.dna.temperament;
            if (t === 'jugueton') { wrap.classList.add('hop'); setTimeout(() => wrap && wrap.classList.remove('hop'), 520); }
            else if (t === 'timido') { x += (mx > x ? -1 : 1) * 22; if (Math.random() < 0.4) say(L('eep'), 1500); }
            else if (t === 'grunon') { dir = mx > x ? -1 : 1; if (Math.random() < 0.35) say(L('personal_space'), 1800); }
            else if (t === 'caotico') { mode = 'walk'; targetX = Math.max(60, Math.min(window.innerWidth - 60, x + (Math.random() < 0.5 ? -1 : 1) * 180)); }
          }
        }
        // el slime rebota suavecito incluso parado
        if (isSlime() && !asleep && mode === 'idle' && now > idleHopAt) {
          idleHopAt = now + 2400 + Math.random() * 2600;
          wrap.classList.add('hop'); setTimeout(() => wrap && wrap.classList.remove('hop'), 520);
        }
        if (mode === 'walk') {
          if (locoProf().float) {
            // fantasma y hada planean sin tocar el suelo
            const speed = 0.7 + STAGES[S.stageIdx].scale * 0.9;
            x += dir * speed * (ev && ev.type === 'zoomies' ? 2.6 : 1);
            if (Math.abs(x - targetX) < 6 && !(ev && ev.type === 'zoomies')) { mode = 'idle'; modeUntil = now + 1500 + Math.random() * 4000; }
          } else {
            gooHop(now);
          }
        } else if (hop && !locoProf().float) {
          gooHop(now);   // termina el salto en el aire aunque una charla la ponga en idle
        }
        if (locoProf().float && !dragging) {
          const hover = sizePx() * 0.10 + Math.sin(now / 480) * 5;
          lift += (hover - lift) * 0.12;
        }
        // goteo de baba: todos son slimes, cada especie con su flujo
        const dp = locoProf().drip;
        if (dp > 0.05 && now > nextDrip) {
          nextDrip = now + (2000 + Math.random() * 2600) / dp;
          spawnDrop();
        }
        if (lift > 0 && !hop && !locoProf().float) {
          lift = Math.max(0, lift - Math.max(6, lift * 0.18));
          if (lift === 0) { wrap.classList.add('land'); setTimeout(() => wrap && wrap.classList.remove('land'), 320); }
        }
      }
      const half = sizePx() / 2;
      x = Math.max(half, Math.min(window.innerWidth - half, x));
      let sx = 1, sy = 1;
      if (hop) { sx = hopSx; sy = hopSy; }
      else if (now < landUntil) {
        // gelatina: oscilación amortiguada (squash → rebote → asentarse)
        const t = 1 - (landUntil - now) / 260;
        const w = Math.exp(-3.4 * t) * Math.cos(t * 11.5);
        sx = 1 + 0.28 * landQ * w; sy = 1 - 0.34 * landQ * w;
      }
      if (dir !== lastDir) { turnUntil = now + 170; lastDir = dir; }
      if (now < turnUntil) { const tk = (turnUntil - now) / 170; sx *= 1 - 0.2 * tk; sy *= 1 + 0.09 * tk; }
      if (!hop && !dragging && !locoProf().float && lift > 0.5 && !(ev && ev.type === 'box' && ev.inside)) {
        // watchdog: nadie se queda congelado en el aire — sea cual sea el
        // camino que dejó lift huérfano, se aterriza con easing
        lift = Math.max(0, lift - Math.max(1.5, lift * 0.18));
        if (lift < 1) { lift = 0; landUntil = now + 260; landQ = 0.5; }
      }
      if (shEl) {
        // la sombra se queda en el suelo: contra-traslación + encoge al subir
        const su = lift * (200 / sizePx());
        const ss = Math.max(0.45, 1 - lift / (sizePx() * 1.15));
        shEl.style.transform = 'translateY(' + su.toFixed(1) + 'px) scale(' + ss.toFixed(3) + ')';
        shEl.style.opacity = (0.28 * (0.55 + 0.45 * ss)).toFixed(3);
      }
      wrap.style.transform = 'translateX(' + Math.round(x - half) + 'px) translateY(' + (-Math.round(lift)) + 'px) scaleX(' + (dir < 0 ? -1 : 1) + ') scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')';
      comps.forEach(c => tickComp(c, now));
      if (bubbleEl && bubbleEl.classList.contains('show')) {
        bubbleEl.style.left = x + 'px';
        bubbleEl.style.bottom = (sizePx() + lift + 10) + 'px';
        if (now > bubbleUntil) bubbleEl.classList.remove('show');
      }
    }
  }
  function start() { if (!running) { running = true; rafId = requestAnimationFrame(loop); } }
  function stop() { running = false; cancelAnimationFrame(rafId); }
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });
  let rszT = 0;
  window.addEventListener('resize', () => {
    clearTimeout(rszT);
    rszT = setTimeout(() => { lastSigC = ''; render(true); }, 200);
  });

  function onEyes(e) {
    mx = e.clientX; my = e.clientY;
    if (!svgEl) return;
    const r = svgEl.getBoundingClientRect();
    let dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 260));
    const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / 260));
    if (dir < 0) dx = -dx;
    if (Date.now() < peekUntil) return;
    const f = svgEl.querySelector('.eyes-follow');
    if (f) f.setAttribute('transform', 'translate(' + (dx * 2.5).toFixed(1) + ' ' + (dy * 1.8).toFixed(1) + ')');
  }

  function onDown(e) {
    e.preventDefault();
    dragging = true; dragMoved = false;
    const startX = e.clientX, startY = e.clientY;
    function onMove(evn) {
      if (Math.abs(evn.clientX - startX) + Math.abs(evn.clientY - startY) > 7) {
        if (!dragMoved && !isAsleepC()) react('wow', 9e7);   // en el aire hasta que la sueltes (dormida sigue dormida)
        dragMoved = true;
      }
      if (!dragMoved) return;
      x = evn.clientX;
      lift = Math.max(0, window.innerHeight - evn.clientY - sizePx() * 0.5);
    }
    function onUp(evn) {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      dragging = false;
      if (!dragMoved) {
        part('🤍', evn.clientX - 9, evn.clientY - 30);
        if (isAsleepC()) say(L('sleep_mumble'), 2000);
        else if (Math.random() < 0.45) speakSmart('Your human just petted you. React with your personality.');
        try { chrome.runtime.sendMessage({ type: 'sf-pet' }); } catch (err) {}
        if (!isAsleepC()) {
          react('love', 2400);
          wrap.classList.add('sf-wiggle');
          setTimeout(() => wrap && wrap.classList.remove('sf-wiggle'), 900);
        }
      } else if (exprFxUntil > Date.now()) {
        exprFx = null; exprFxUntil = 0; render(true);   // fin del arrastre: cara normal
      }
      mode = 'idle'; modeUntil = performance.now() + 2000;
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  Promise.all([
    chrome.storage.local.get(STORAGE_KEY),
    (chrome.storage.session ? chrome.storage.session.get('sf_pos').catch(() => ({})) : Promise.resolve({}))
  ]).then(([o, po]) => {
    S = o[STORAGE_KEY] || null;
    savedPos = (po && po.sf_pos) || null;
    prevFocus = S && S.focus ? S.focus : null;   // evita celebraciones falsas al cargar
    // continuidad (v0.45.3): la activa reaparece donde estaba (fracción del
    // ancho, por si el viewport cambió); si no hay dato y hay foco, en su
    // rincón (v0.45.2); si no, en el punto por defecto
    if (S && S.phase === 'pet' && S.dna) {
      const ap = savedPos && savedPos.active && savedPos.active.seed === S.dna.seed ? savedPos.active : null;
      if (ap && ap.f != null) {
        const half = sizePx() / 2;
        x = Math.max(half, Math.min(window.innerWidth - half, ap.f * window.innerWidth));
        dir = ap.dir || 1;
      } else if (focusWorkOn()) x = favX();
    }
    render(true);
    if (S && S.phase === 'pet') { syncPoops(); syncVisit(); syncComps(); }
    start();
    applyDnd();
  });
  window.addEventListener('pagehide', savePos);   // último apunte antes de recargar/navegar (v0.45.3)
  /* ── Atajos de Modo pruebas (Alt+Mayús+tecla, solo con demoMode) ── */
  window.addEventListener('keydown', e => {
    if (!S || !S.demoMode || !wrap || !e.altKey || !e.shiftKey) return;
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;
    const k = e.code;
    const force = fn => { e.preventDefault(); if (ev) endEvent(); fn(); };
    if (k === 'KeyD') force(() => evDuel());
    else if (k === 'KeyW') force(() => evWildSlime());
    else if (k === 'KeyL') force(() => evLaser());
    else if (k === 'KeyZ') force(() => evZoomies());
    else if (k === 'KeyB') force(() => evBox());
    else if (k === 'KeyP') { e.preventDefault(); soloThought(performance.now()); }
    else if (k === 'KeyG') {
      e.preventDefault();
      const idx = S.huerto && S.huerto.plots ? S.huerto.plots.findIndex(pp => pp && !pp.w && !pp.done) : -1;
      if (idx >= 0) { gardenRun = { i: idx, kind: 'water', actor: { kind: 'main' }, acted: false, started: performance.now() }; mode = 'walk'; targetX = gardenX(idx); dir = targetX > x ? 1 : -1; modeUntil = performance.now() + 30000; }
      else say('Nada pendiente de riego en el huerto.', 2600);
    }
    else if (k === 'KeyE') {
      // demo (v0.46): cicla la pieza del escritorio para capturas de la CWS
      e.preventDefault();
      deskForce = deskForce == null ? 2 : deskForce === 0 ? null : deskForce - 1;   // café → libro → portátil → auto
      say(deskForce == null ? 'Escritorio: auto' : 'Escritorio: ' + ['portátil', 'libro', 'café'][deskForce], 1600);
      render(true);
      comps.forEach(c => { c.gBand = -1; });   // fuerza respawn (conserva posición desde v0.45.1)
      syncComps();
    }
    else if (k === 'KeyM') {
      e.preventDefault();
      if (comps.length >= 1 && !packEv) { nextPackAt = 0; startPackEv(performance.now()); }
      else say(comps.length ? 'Ya hay un encuentro en marcha.' : 'Necesito compañía: activa «Pasean juntas» con 2+ criaturas.', 3200);
    }
  }, true);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !changes[STORAGE_KEY]) return;
    const prevFocusEnd = S && S.focus ? S.focus.endsAt : 0;
    const hadFocus = !!(S && S.focus);
    S = changes[STORAGE_KEY].newValue;
    if (!S || !S.focus) { focusCheered = false; nextScoldAt = 0; scoldN = 0; scoldPoseUntil = 0; packScoldIdx = 0; }
    // foco de manada (v0.45): al arrancar una sesión de trabajo, una compañera
    // anuncia que toda la manada se pone en modo foco (comps ya respawneadas
    // con Ascua acelerada cuando dispare el timeout, vía syncComps)
    if (!hadFocus && S && S.focus && S.focus.kind !== 'break' && wrap) {
      setTimeout(() => {
        if (!S || !S.focus || !comps.length) return;
        const c = comps[Math.floor(Math.random() * comps.length)];
        c.node.classList.add('hop'); setTimeout(() => c.node.classList.remove('hop'), 520);
        chipBubble(c.x, c.sz + c.lift + 12, c.dna.name + ': \u00ab' + L('focus_pack_start') + '\u00bb', 3400);
      }, 1400);
    }
    if (prevFocus && S && !S.focus && prevFocus.kind !== 'break' && Date.now() >= prevFocus.endsAt - 1500 && wrap) {
      // sesión de trabajo completada mientras la criatura está en la página
      react('love', 3600);
      wrap.classList.add('sf-wiggle');
      setTimeout(() => wrap && wrap.classList.remove('sf-wiggle'), 900);
      say(L('focus_done'), 4600);
      part('\u{1F389}', x - 9, window.innerHeight - sizePx() - lift - 30);
      setTimeout(() => { try { part('\u{1F525}', x + 14, window.innerHeight - sizePx() - lift - 18); } catch (err) {} }, 450);
      // foco de manada (v0.45): las compañeras celebran también (se consultan
      // en el momento del disparo: syncComps las habrá respawneado sin Ascua)
      setTimeout(() => {
        try {
          comps.forEach((c, i) => setTimeout(() => {
            if (!comps.includes(c)) return;
            c.node.classList.add('hop'); setTimeout(() => c.node.classList.remove('hop'), 520);
            part('\u{1F389}', c.x - 9, window.innerHeight - c.sz - c.lift - 12);
          }, i * 320));
          if (comps[0]) chipBubble(comps[0].x, comps[0].sz + comps[0].lift + 12, comps[0].dna.name + ': \u00ab' + L('focus_pack_done') + '\u00bb', 3600);
        } catch (err) {}
      }, 1100);
    }
    prevFocus = S && S.focus ? S.focus : null;
    if (prevFocusEnd && (!S || !S.focus) && Date.now() >= prevFocusEnd - 1500 && wrap) {
      // sesión de foco COMPLETADA (no abandonada): pequeña fiesta en página
      react('happy', 3400);
      say(L('focus_cheer'), 3600);
      wrap.classList.add('hop'); setTimeout(() => wrap && wrap.classList.remove('hop'), 520);
      const gy = window.innerHeight - sizePx() - 12;
      part('🎉', x - 18, gy); part('🔥', x + 6, gy - 10); part('✨', x + 24, gy);
    }
    render();
    if (S && S.phase === 'pet') { syncPoops(); syncVisit(); syncComps(); }
    else syncComps();
    applyDnd();
  });
})();

})();
