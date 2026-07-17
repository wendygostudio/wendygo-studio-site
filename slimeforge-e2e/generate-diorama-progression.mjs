import { writeFile } from 'node:fs/promises';
import { buildCreature, STAGES } from '../slimeforge-v1.1.0-review/common/engine.js';

const out = 'C:/Users/Damian/.codex/visualizations/2026/07/16/019f6c98-abad-73d2-82c4-cb8640a61a69/slimeforge-real-progression.html';

const dna = {
  v: 1,
  species: 'panda',
  color: '#e8d4b2',
  gender: 'hembra',
  accessory: 'none',
  cos: {},
  marking: { type: 'none', color: '#4a4038' },
  temperament: 'tranquilo',
  name: 'Mora',
  seed: 42
};

function diorama(stageIdx, growth, relicN = 0) {
  const i = Math.max(0, Math.min(4, stageIdx));
  const st = STAGES[i];
  const prev = i === 0 ? 0 : STAGES[i - 1].next;
  const next = st.next == null ? Math.max(prev + 1, growth || prev) : st.next;
  const f = Math.max(0, Math.min(1, ((growth || 0) - prev) / (next - prev)));
  const op1 = i >= 1 ? 1 : 0, op2 = i >= 2 ? 1 : 0, op3 = i >= 3 ? 1 : 0, op4 = i >= 4 ? 1 : 0;
  const sprout = (0.72 + f * 0.28).toFixed(2);
  return `
    <g class="dio-sky" opacity="${op3}">
      <path d="M0 0H360V118C302 101 260 111 211 95C151 76 95 104 0 84Z" fill="#26384a" opacity=".72"/>
      <path d="M42 70C82 42 118 50 146 77C178 52 220 58 251 85C285 62 324 68 360 92V126H0V99C13 91 27 80 42 70Z" fill="#253429" stroke="#334a38" stroke-width="3"/>
      <g opacity="${op4}"><path d="M220 63q24-24 48 0q25-18 48 4" fill="none" stroke="#c7d3d8" stroke-width="5" stroke-linecap="round" opacity=".35"/><circle cx="298" cy="35" r="15" fill="#f7cd7e" opacity=".38"/></g>
    </g>
    <g class="dio-far" opacity="${op2}">
      <path d="M0 111Q43 82 83 112T164 108T246 108T360 99V190H0Z" fill="#1c2c25"/>
      <g fill="#284236" stroke="#355546" stroke-width="3"><circle cx="30" cy="104" r="30"/><circle cx="87" cy="95" r="37"/><circle cx="285" cy="96" r="38"/><circle cx="340" cy="108" r="31"/></g>
    </g>
    <g class="dio-trees" opacity="${op1}">
      <path d="M20 0h35l7 159H12Z" fill="#3e3024" stroke="#5e4630" stroke-width="5"/><path d="M305 0h38l7 160h-54Z" fill="#3e3024" stroke="#5e4630" stroke-width="5"/>
      <path d="M-15 32Q20 3 78 24Q58 69 7 72Z" fill="#355844" stroke="#466c55" stroke-width="4"/><path d="M287 28Q335 1 380 32V76Q329 72 285 58Z" fill="#355844" stroke="#466c55" stroke-width="4"/>
    </g>
    <path d="M0 176Q76 164 143 179Q221 195 360 172V252H0Z" fill="#253028" stroke="#34453a" stroke-width="4"/>
    <path d="M137 252Q146 206 180 181Q216 207 226 252Z" fill="#4b3b2b" opacity="${i >= 2 ? '.7' : '.18'}"/>
    <g class="dio-anchor"><ellipse cx="62" cy="194" rx="48" ry="9" fill="#111713" opacity=".32"/><path d="M27 185Q17 152 43 142Q48 116 70 130Q91 116 98 143Q119 157 99 184Z" fill="#416a4e" stroke="#5e4630" stroke-width="4"/><circle cx="48" cy="153" r="5" fill="#6f9a68"/><circle cx="78" cy="142" r="5" fill="#6f9a68"/><circle cx="89" cy="164" r="5" fill="#6f9a68"/></g>
    <g transform="translate(278 199) scale(1 ${sprout})" style="transform-origin:278px 199px"><path d="M0 0V-40" stroke="#568b61" stroke-width="5" stroke-linecap="round"/><path d="M0-24Q-22-31-25-47Q-6-45 2-30Z" fill="#5e9c6a" stroke="#3f6849" stroke-width="3"/><path d="M1-14Q20-22 25-38Q7-37-2-21Z" fill="#6aae75" stroke="#3f6849" stroke-width="3"/></g>
    <g opacity="${i === 0 ? 1 : .72}"><path d="M315 195q0-23 15-23t15 23" fill="#b85e4f" stroke="#5e4630" stroke-width="3"/><path d="M314 181q16-13 32 0" fill="#e8d4b2" stroke="#5e4630" stroke-width="3"/></g>
    <g opacity="${op4}"><ellipse cx="235" cy="202" rx="22" ry="6" fill="#18231d"/><path d="M215 197q20-30 40 0" fill="#7e9d68" stroke="#4b6746" stroke-width="3"/></g>
    ${relicN >= 3 ? '<g class="dio-relic-lantern" transform="translate(105 185)"><path d="M0 0v-38" stroke="#59432e" stroke-width="4"/><path d="M-9-39h18l-3 20H-6Z" fill="#f0b94f" stroke="#5e4630" stroke-width="3"/><circle cy="-29" r="6" fill="#fff1a8" opacity=".72"/></g>' : ''}
    ${relicN >= 6 ? '<g class="dio-relic-arch" opacity=".72"><path d="M128 174V94q52-54 104 0v80" fill="none" stroke="#596068" stroke-width="12"/><path d="M128 116q52-55 104 0" fill="none" stroke="#858b90" stroke-width="4"/></g>' : ''}
    ${relicN >= 9 ? '<g class="dio-relic-pool"><ellipse cx="181" cy="218" rx="54" ry="13" fill="#558e9d" stroke="#9bd2d7" stroke-width="3" opacity=".7"/><circle cx="181" cy="214" r="7" fill="#f7e7a8" opacity=".8"/><path d="M148 216q33 10 66 0" fill="none" stroke="#c9f0ef" stroke-width="2" opacity=".7"/></g>' : ''}`;
}

function creature(stageIdx, growth) {
  return buildCreature(dna, stageIdx, {
    dirtLvl: 0, poops: 0, focusing: false, mood: 85, sick: false,
    sleeping: false, focusSeed: 0, inStage: true, growth
  });
}

function scene({ stageIdx, growth, relicN = 0, label, sub }) {
  return `<figure class="sf-scene">
    <div class="sf-frame" role="img" aria-label="${label}: diorama y criatura reales de SlimeForge">
      <svg class="sf-diorama" viewBox="0 0 360 252" preserveAspectRatio="none" aria-hidden="true">${diorama(stageIdx, growth, relicN)}</svg>
      <svg class="sf-creature" viewBox="0 0 200 200" aria-hidden="true">${creature(stageIdx, growth)}</svg>
    </div>
    <figcaption><span>${label}</span><small>${sub}</small></figcaption>
  </figure>`;
}

const growth = [
  { stageIdx: 0, growth: 25, label: 'Chispa', sub: '0–49 crecimiento · ≈ 0–9 focos' },
  { stageIdx: 1, growth: 100, label: 'Cría', sub: '50–199 · ≈ 10–39 focos' },
  { stageIdx: 2, growth: 300, label: 'Joven', sub: '200–499 · ≈ 40–99 focos' },
  { stageIdx: 3, growth: 700, label: 'Adulto', sub: '500–999 · ≈ 100–199 focos' },
  { stageIdx: 4, growth: 1000, label: 'Colosal', sub: '1000+ · ≈ 200+ focos' }
];

const relics = [
  { stageIdx: 3, growth: 700, relicN: 0, label: '0 reliquias', sub: 'Diorama base de Adulto' },
  { stageIdx: 3, growth: 700, relicN: 3, label: '3 reliquias', sub: '+ Farol de los Caminantes' },
  { stageIdx: 3, growth: 700, relicN: 6, label: '6 reliquias', sub: '+ Arco Resonante' },
  { stageIdx: 3, growth: 700, relicN: 9, label: '9 reliquias', sub: '+ Estanque Lunar' }
];

const html = `<section id="sf-real-progress">
  <style>
    #sf-real-progress { color: var(--foreground); display: grid; gap: 24px; }
    #sf-real-progress * { box-sizing: border-box; }
    #sf-real-progress h3 { margin: 0 0 4px; font-weight: 500; }
    #sf-real-progress .sf-note { color: var(--muted-foreground); margin: 0 0 12px; }
    #sf-real-progress .sf-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 12px; }
    #sf-real-progress figure { margin: 0; min-width: 0; }
    #sf-real-progress .sf-frame { position: relative; overflow: hidden; aspect-ratio: 360/252; background: #1c2028; border: 1px solid var(--border); border-radius: 14px; }
    #sf-real-progress .sf-diorama { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; }
    #sf-real-progress .sf-creature { position: absolute; width: 67%; height: 95%; left: 16.5%; bottom: 0; z-index: 2; overflow: visible; }
    #sf-real-progress figcaption { display: grid; gap: 2px; padding-top: 7px; }
    #sf-real-progress figcaption span { font-weight: 500; }
    #sf-real-progress figcaption small { color: var(--muted-foreground); }
    @media (max-width: 480px) { #sf-real-progress .sf-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 340px) { #sf-real-progress .sf-grid { grid-template-columns: 1fr; } }
  </style>
  <section aria-labelledby="sf-growth-title">
    <h3 id="sf-growth-title">Crecimiento por sesiones de foco</h3>
    <p class="sf-note">Mismo motor, misma criatura y el diorama actual. Equivalencias calculadas con focos de 25 minutos.</p>
    <div class="sf-grid">${growth.map(scene).join('')}</div>
  </section>
  <section aria-labelledby="sf-relic-title">
    <h3 id="sf-relic-title">Decoración por reliquias</h3>
    <p class="sf-note">Mora permanece en Adulto: aquí solo cambia el número de reliquias únicas.</p>
    <div class="sf-grid">${relics.map(scene).join('')}</div>
  </section>
</section>`;

await writeFile(out, html, 'utf8');
console.log(out);
