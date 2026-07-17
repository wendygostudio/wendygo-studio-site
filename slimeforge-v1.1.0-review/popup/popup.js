/* SlimeForge · popup/popup.js — la UI del juego.
   Carga el estado desde chrome.storage, aplica el tiempo transcurrido
   (catch-up), y simula en vivo mientras el popup está abierto. */

import {
  buildCreature, buildEgg, rollDNA,
  TEMP_INFO, SP_LABEL, STAGES, PHRASES,
  SP_FLAVOR, SP_LORE, genderedLabel, tempAdj, RARITY, compatScore,
  hexToHsl, hslToHex, LOCO, PHRASES_EN, phraseBank, duelBank,
  SEEDS, seedStageMs, buildPlot, COS, COS_SLOTS
} from '../common/engine.js';
import { isAsleep } from '../common/logic.js';
import { proActive, proTier, PAY_LINKS, activateLicense, revalidateLicense, deactivateLicense, trialStatus, startTrial, markTrialUse } from '../common/license.js';
import {
  loadState, saveState, importState, sanitizeVisitPayload, freshState, applyElapsed, markDiscovered,
  huertoOp, cosUnlocked, cosProgress, addMemory, FOCUS_REAL_MS, dayKey,
  ensureDailyMission, recordMissionProgress, EXPEDITION_ROUTES, startExpedition, advanceExpedition, claimExpedition, freeExpeditionReady, FREE_EXPEDITION_COOLDOWN,
  FEATURE_UNLOCKS, featureUnlocked, RELIC_CATALOG, RELIC_MILESTONES, relicUniqueCount
} from '../common/logic.js';

/* Puerto al SW: mientras el popup vive, el SW no tickea */
chrome.runtime.connect({ name: 'popup' });

let G = null;
let persistedState = null;
let persistQueue = Promise.resolve();
let hidePoops = 0;          // ocultación temporal para el numerito del popó
let saveCounter = 0;

const $ = id => document.getElementById(id);
const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
const normalizeUiLang = value => {
  const raw = String(value || '').replace('-', '_');
  const base = raw.split('_')[0].toLowerCase();
  if (base === 'pt') return 'pt_PT';
  return ['es','en','de','fr','it'].includes(base) ? base : 'en';
};

/* ═══ i18n helper ═══ */

/* ═══ i18n: traducir el DOM completo al arrancar ═══ */
function translateDOM() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const m = t(key);
    if (m && m !== key) {
      const b = el.querySelector('b');
      if (b) {
        const tn = Array.from(el.childNodes).find(n => n.nodeType === 3);
        if (tn) tn.textContent = m + ' ';
      } else {
        el.textContent = m;
      }
    }
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const m = t(el.getAttribute('data-i18n-ph'));
    if (m) el.placeholder = m;
  });
  document.querySelectorAll('[data-i18n-after]').forEach(el => {
    const m = t(el.getAttribute('data-i18n-after'));
    if (!m) return;
    if (el.nextSibling && el.nextSibling.nodeType === 3) el.nextSibling.textContent = ' ' + m;
    else el.insertAdjacentText('afterend', ' ' + m);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { const m = t(el.dataset.i18nTitle); if (m) el.title = m; });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { const m = t(el.dataset.i18nAria); if (m) el.setAttribute('aria-label', m); });
}
/* ═══ TOOLBAR ═══ */
$('btnTheme').addEventListener('click', () => {
  if (!G) return;
  G.lightTheme = !G.lightTheme;
  document.body.classList.toggle('light', G.lightTheme);
  $('btnTheme').textContent = G.lightTheme ? '☀️' : '🌙';
  persist();
});
$('btnQuiet').addEventListener('click', () => {
  if (!G) return;
  G.quietMode = !G.quietMode;
  if (G.quietMode) G.experienceMode = 'calm';
  applyQuietMode();
  if ($('selExperience')) $('selExperience').value = G.experienceMode || 'coach';
  toast(t(G.quietMode ? 'quiet_on' : 'quiet_off'));
  persist();
});
const EXPERIENCE_MODES = ['calm','coach','game','strict'];
function chooseExperience(mode, save = true) {
  if (!G || !EXPERIENCE_MODES.includes(mode)) return;
  G.experienceMode = mode;
  G.experienceChosen = true;
  G.quietMode = mode === 'calm';
  G.focusShield = G.focusShield || freshState().focusShield;
  if (mode === 'strict') G.focusShield.mode = 'firm';
  else if (!G.focusShield.mode) G.focusShield.mode = 'gentle';
  if ($('selExperience')) $('selExperience').value = mode;
  applyProgressiveUI(); renderShield();
  if (save) persist();
}
$('selExperience').addEventListener('change', e => {
  chooseExperience(e.target.value);
  toast(t('experience_saved'));
});
$('selLang').addEventListener('change', async e => {
  if (!G) return;
  G.uiLang = e.target.value;
  nanoSession = null;                 // el system prompt de Nano cambia de idioma
  await loadI18N(G.uiLang);
  translateDOM();
  renderPro(); renderPets(); renderBestiario(); renderDaily(); renderJourney(); renderCraft(); renderNanoUI();
  renderHuerto(true); renderVestidor(true); renderVisits(); renderDnd(); renderRituals(); renderProjects(); renderShield(); applyProgressiveUI(); updateHUD();
  persist();
});
$('btnPopout').addEventListener('click', () => {
  chrome.windows.create({ url: chrome.runtime.getURL('popup/popup.html'), type: 'popup', width: 420, height: 660 });
  window.close();
});

const I18N = {};
async function loadI18N(lang) {
  try {
    document.documentElement.lang = lang === 'pt_PT' ? 'pt-PT' : lang;
    const url = chrome.runtime.getURL('_locales/' + lang + '/messages.json');
    const msgs = await (await fetch(url)).json();
    Object.keys(I18N).forEach(k => delete I18N[k]);   // sin residuos del idioma anterior
    Object.keys(msgs).forEach(k => I18N[k] = msgs[k].message);
  } catch (e) { if (lang !== 'en') await loadI18N('en'); }
}
function t(key, ...subs) {
  let m = I18N[key];
  if (!m) { try { m = chrome.i18n.getMessage(key); } catch (e) {} }
  if (!m) return key;
  if (subs.length === 1 && subs[0] && typeof subs[0] === 'object') {
    Object.entries(subs[0]).forEach(([k, v]) => { m = m.split('$' + k).join(String(v)); });
  } else {
    subs.forEach((s, i) => { m = m.replace('$' + (i + 1), String(s)); });
  }
  return m;
}


/* Nombres traducibles de especie/temperamento/etapa (fallback al canon ES) */
function spName(sp) { const m = t('sp_' + sp); return m !== 'sp_' + sp ? m : (SP_LABEL[sp] || sp); }
function tmpName(k) { const m = t('tmp_' + k); return m !== 'tmp_' + k ? m : (TEMP_INFO[k] ? TEMP_INFO[k].label : k); }
function stName(id) { const m = t('st_' + id); return m !== 'st_' + id ? m : id; }

const world = $('world');
const stageEl = $('stage');
const stageDiorama = $('stageDiorama');

/* ═══════════ TOASTS EN COLA ═══════════ */
const toastQueue = [];
let toastBusy = false;
function toast(msg) { toastQueue.push(msg); pumpToasts(); }
function pumpToasts() {
  if (toastBusy || !toastQueue.length) return;
  toastBusy = true;
  const t = $('toast');
  t.textContent = toastQueue.shift();
  t.classList.add('show');
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => { toastBusy = false; pumpToasts(); }, 300);
  }, 2100);
}
function particle(emoji, x, y) {
  const p = document.createElement('div');
  p.className = 'particle'; p.textContent = emoji;
  p.style.left = (x ?? (stageEl.clientWidth/2 - 10)) + 'px';
  p.style.top = (y ?? (stageEl.clientHeight/2 - 30)) + 'px';
  stageEl.appendChild(p);
  setTimeout(() => p.remove(), 1100);
}

/* ═══════════ SONIDO (Web Audio sintetizado) ═══════════ */
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) { try { audioCtx = new AudioContext(); } catch (e) {} }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}
document.addEventListener('pointerdown', ensureAudio);
function playPoot() {
  if (!G.soundOn || !audioCtx || audioCtx.state !== 'running') return;
  const t = audioCtx.currentTime;
  const o = audioCtx.createOscillator(); o.type = 'sawtooth';
  const g = audioCtx.createGain();
  const lfo = audioCtx.createOscillator(); lfo.frequency.value = 28;
  const lg = audioCtx.createGain(); lg.gain.value = 18;
  lfo.connect(lg); lg.connect(o.frequency);
  o.frequency.setValueAtTime(150, t);
  o.frequency.exponentialRampToValueAtTime(68, t + 0.42);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.16, t + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.46);
  o.connect(g); g.connect(audioCtx.destination);
  o.start(t); lfo.start(t); o.stop(t + 0.5); lfo.stop(t + 0.5);
  const o2 = audioCtx.createOscillator(); o2.type = 'sine';
  const g2 = audioCtx.createGain();
  o2.frequency.setValueAtTime(320, t + 0.44);
  o2.frequency.exponentialRampToValueAtTime(90, t + 0.55);
  g2.gain.setValueAtTime(0.0001, t + 0.44);
  g2.gain.exponentialRampToValueAtTime(0.22, t + 0.46);
  g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.58);
  o2.connect(g2); g2.connect(audioCtx.destination);
  o2.start(t + 0.44); o2.stop(t + 0.62);
}

/* ═══════════ SINTETIZADOR DE SFX (un sonido por acción) ═══════════ */
function tone(f, d, type, vol, delay, fEnd) {
  if (!G.soundOn || !audioCtx || audioCtx.state !== 'running') return;
  const t = audioCtx.currentTime + (delay || 0);
  const o = audioCtx.createOscillator(); o.type = type || 'sine';
  o.frequency.setValueAtTime(f, t);
  if (fEnd) o.frequency.exponentialRampToValueAtTime(fEnd, t + d);
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g); g.connect(audioCtx.destination);
  o.start(t); o.stop(t + d + 0.05);
}
function noiseBurst(d, vol, fc, delay, ftype) {
  if (!G.soundOn || !audioCtx || audioCtx.state !== 'running') return;
  const t = audioCtx.currentTime + (delay || 0);
  const buf = audioCtx.createBuffer(1, Math.ceil(audioCtx.sampleRate * d), audioCtx.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
  const src = audioCtx.createBufferSource(); src.buffer = buf;
  const f = audioCtx.createBiquadFilter(); f.type = ftype || 'lowpass'; f.frequency.value = fc;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  src.connect(f); f.connect(g); g.connect(audioCtx.destination);
  src.start(t); src.stop(t + d);
}
const sfx = {
  eat()     { for (let i = 0; i < 3; i++) { noiseBurst(0.07, 0.18, 1200, i * 0.17); tone(200 + (i % 2) * 60, 0.07, 'square', 0.05, i * 0.17); } },
  pet()     { tone(520, 0.12, 'sine', 0.1, 0, 660); tone(720, 0.14, 'sine', 0.08, 0.12, 880); },
  shower()  { noiseBurst(1.9, 0.10, 900); },
  whoosh()  { noiseBurst(0.28, 0.14, 2400, 0, 'highpass'); },
  sparkle() { [660, 880, 1320].forEach((f, i) => tone(f, 0.14, 'triangle', 0.1, i * 0.09)); },
  chime()   { tone(880, 0.25, 'sine', 0.12); tone(1320, 0.3, 'sine', 0.08, 0.05); },
  knock()   { tone(140, 0.06, 'square', 0.1); },
  fanfare() { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.16, 'triangle', 0.11, i * 0.11)); }
};
function fx(cls, ms) {
  world.classList.add(cls);
  setTimeout(() => world.classList.remove(cls), ms);
}

/* ═══ DIÁLOGOS: Gemini Nano (Prompt API) con fallback a banco ═══ */
let bubbleT = null;
function say(text) {
  const b = $('bubble');
  b.textContent = text;
  b.classList.add('show');
  clearTimeout(bubbleT);
  bubbleT = setTimeout(() => b.classList.remove('show'), 4200);
}
function bankPhrase() {
  // 'pt_PT' (selector/_locales) → 'pt' (bancos runtime): normalizar a 2 letras
  const lang = (G.uiLang || navigator.language || 'es').slice(0, 2);
  const src = phraseBank(lang);
  const bank = src[G.dna.temperament] || src.tranquilo;
  return bank[Math.floor(Math.random() * bank.length)];
}
let nanoSession = null;
let nanoState = 'checking';        // checking | available | downloadable | downloading | unavailable
let nanoProgress = 0;

function getLM() {
  return self.LanguageModel || (self.ai && self.ai.languageModel) || null;
}
function normalizeNanoAvailability(value) {
  if (value === 'available' || value === 'readily') return 'available';
  if (value === 'downloadable' || value === 'after-download') return 'downloadable';
  if (value === 'downloading') return 'downloading';
  return 'unavailable';
}
async function nanoAvailability() {
  const LM = getLM();
  if (!LM) return 'unavailable';
  try {
    if (LM.availability) return normalizeNanoAvailability(await LM.availability()); // API moderna
    if (LM.capabilities) {                                        // API antigua (compat)
      const c = await LM.capabilities();
      if (c.available === 'readily') return 'available';
      if (c.available === 'after-download') return 'downloadable';
      return 'unavailable';
    }
  } catch (e) {}
  return 'unavailable';
}
function renderNanoUI() {
  const map = {
    checking:     ['⏳', t('ai_checking'), false],
    available:    ['🟢', t('ai_active'), false],
    downloadable: ['🟡', t('ai_download'), true],
    downloading:  ['🔵', t('ai_downloading') + ' ' + nanoProgress + '%', false],
    unavailable:  ['⚪', t('ai_unavail'), false]
  };
  const [dot, txt, showBtn] = map[nanoState] || map.unavailable;
  $('aiDot').textContent = dot;
  $('aiTxt').textContent = txt;
  $('aiBtn').style.display = showBtn ? '' : 'none';
  $('aiBarWrap').style.display = nanoState === 'downloading' ? '' : 'none';
  $('aiBar').style.width = nanoProgress + '%';
}
async function refreshNano() {
  // Algunos Chrome dejan availability() pendiente en el popup aunque Nano
  // funcione correctamente en el service worker. Evitamos el spinner eterno y
  // usamos ese segundo contexto como fuente de respaldo.
  nanoState = await Promise.race([
    nanoAvailability(),
    new Promise(resolve => setTimeout(() => resolve('unavailable'), 3500))
  ]);
  if (nanoState === 'unavailable') {
    try {
      const swState = await Promise.race([
        chrome.runtime.sendMessage({ type: 'sf-nano-availability' }),
        new Promise(resolve => setTimeout(() => resolve(null), 2500))
      ]);
      if (swState) nanoState = normalizeNanoAvailability(swState);
    } catch (e) {}
  }
  renderNanoUI();
}
$('aiDiag').addEventListener('click', async () => {
  $('aiDiag').textContent = '⏳';
  let r = null;
  try { r = await chrome.runtime.sendMessage({ type: 'sf-nano-diag' }); } catch (e) {}
  $('aiDiag').textContent = '🔬';
  openModal('🧠 ' + t('diag_title'));
  mbody.innerHTML = !r
    ? '<div class="mnote">' + esc(t('diag_no_response')) + '</div>'
    : '<div class="mnote" style="line-height:1.7">' +
      esc(t('diag_model')) + ': <b>' + esc(r.lm ? t('yes') : t('no')) + '</b><br>' +
      esc(t('diag_availability')) + ': <b>' + esc(r.avail || '—') + '</b><br>' +
      (r.ms != null ? esc(t('diag_first_line')) + ': <b>' + r.ms + ' ms</b>' + (r.ms > 4500 ? ' ⚠️' : '') + '<br>' : '') +
      (r.line ? esc(t('diag_response')) + ': <i>«' + esc(r.line) + '»</i><br>' : '') +
      (r.err ? esc(t('diag_error')) + ': <code>' + esc(r.err) + '</code>' : '') +
      '</div>';
});
$('aiBtn').addEventListener('click', async () => {
  const LM = getLM();
  if (!LM) return;
  nanoState = 'downloading'; nanoProgress = 0; renderNanoUI();
  try {
    const s = await LM.create({
      monitor(m) {
        m.addEventListener('downloadprogress', e => {
          nanoProgress = Math.min(100, Math.round((e.loaded || 0) * 100));
          renderNanoUI();
        });
      }
    });
    if (s && s.destroy) s.destroy();     // era solo para disparar la descarga
    nanoSession = null;
    nanoState = 'available'; renderNanoUI();
    toast(t('ai_ready'));
    sfx.sparkle();
  } catch (e) {
    nanoState = 'unavailable'; renderNanoUI();
    toast(t('ai_dl_fail'));
  }
});
function nanoSys() {
  const gl = genderedLabel(G.dna);
  return 'Eres ' + G.dna.name + ', ' + gl.art + ' ' + gl.label + ' virtual ' + tempAdj(G.dna) +
    '. Tu carácter de especie: ' + (SP_FLAVOR[G.dna.species] || 'adorable') +
    '. Hablas de ti en ' + (gl.g === 'hembra' ? 'femenino' : 'masculino') +
    '. Respondes SIEMPRE con UNA sola frase corta en ' + t('nano_lang') + ' (máximo 12 palabras), ' +
    'con mucha personalidad. Sin comillas, sin explicaciones.';
}
async function nanoLine(ctx) {
  if (nanoState !== 'available') return null;
  try {
    const LM = getLM();
    if (!nanoSession) nanoSession = await LM.create({ initialPrompts: [{ role: 'system', content: nanoSys() }] });
    const res = await Promise.race([
      nanoSession.prompt(ctx),
      new Promise(r => setTimeout(() => r(null), 2500))
    ]);
    if (typeof res === 'string') {
      const t = res.trim().replace(/^["“']|["”']$/g, '');
      if (t.length > 0 && t.length < 90) return t;
    }
  } catch (e) {
    nanoSession = null;              // fallo transitorio: reintentar en la próxima
  }
  return null;
}
function speakCtx() {
  const h = new Date().getHours();
  const parts = ['Son las ' + h + 'h.'];
  if (G.hambre < 40) parts.push('Tienes bastante hambre.');
  if (G.higiene < 40) parts.push('Estás algo sucio.');
  if (G.animo > 80) parts.push('Estás de muy buen humor.');
  if (G.streak && G.streak.count > 1) parts.push('Tu humano lleva una racha de foco de ' + G.streak.count + ' días.');
  if (G.visits && G.visits.length) {
    const m = G.visits[G.visits.length - 1];
    parts.push('Recuerdas la visita de ' + m.name + (m.owner ? ' (de ' + m.owner + ')' : '') + '; ' +
      (m.score >= 1 ? 'os caísteis genial.' : m.score <= -1 ? 'no congeniasteis nada.' : 'fue una visita correcta.'));
  }
  return parts.join(' ') + ' Di algo breve a tu humano.';
}
async function speak() {
  if (G.phase !== 'pet') return;
  const line = await nanoLine(speakCtx());
  if (line) { say(line); return; }
  if ((G.uiLang || 'es') === 'es' && G.visits && G.visits.length && Math.random() < 0.3) {
    const m = G.visits[Math.floor(Math.random() * G.visits.length)];
    const tpl = m.score >= 1
      ? ['¿Cuándo vuelve ' + m.name + '? 🥺', 'Hoy he soñado con ' + m.name + '.', m.name + ' me debe una revancha al ovillo.']
      : m.score <= -1
      ? ['Como vuelva ' + m.name + ', me escondo.', 'No es por hablar mal, pero… ' + m.name + '. Eso.', 'Mi rincón. MÍO. Que se entere ' + m.name + '.']
      : ['Saluda a ' + m.name + ' de mi parte. O no. Como veas.'];
    say(tpl[Math.floor(Math.random() * tpl.length)]);
    return;
  }
  say(bankPhrase());
}

/* ═══ SLIMEFORGE PRO (Creem · contrato de familia v2.0) ═══ */
const TIER_KEYS = { monthly: 'tier_m', annual: 'tier_a', lifetime: 'tier_l' };
function tierName(tier) { return TIER_KEYS[tier] ? t(TIER_KEYS[tier]) : tier; }
function renderPro() {
  const st = $('proStatus');
  const tb = $('trialBanner');
  const start = $('btnTrialStart');
  const trial = trialStatus(G);
  start.style.display = 'none';
  if (!(G.pro && G.pro.active)) {
    if (trial.active) {
      tb.style.display = '';
      tb.textContent = '🎁 ' + t('trial_active', { D: trial.remaining });
    } else if (G.trialStart) {
      tb.style.display = '';
      tb.textContent = '⏰ ' + t('trial_over');
    } else {
      tb.style.display = '';
      tb.textContent = '🎟️ ' + t('trial_ready');
      start.style.display = '';
    }
  } else { tb.style.display = 'none'; }
  const tm = $('trialMini');
  tm.style.display = ((trial.active || G.trialStart) && tb.style.display !== 'none' && G.phase === 'pet') ? '' : 'none';
  tm.textContent = tb.textContent;
  renderProPerks();
  if (G.pro && G.pro.active) {
    const exp = G.pro.expiresAt ? ' · ' + t('pro_renews', { DATE: new Date(G.pro.expiresAt).toLocaleDateString() }) : '';
    st.innerHTML = '<b style="color:var(--amber)">' + t('pro_active') + '</b> · ' + tierName(G.pro.tier) + exp;
    $('proBuy').style.display = 'none';
    $('proManage').style.display = '';
  } else {
    st.textContent = t('pro_pitch');
    $('proBuy').style.display = '';
    $('proManage').style.display = 'none';
  }
}
/* Lista de ventajas Pro con estado en vivo. La clave de producto: dejar
   claro qué se PAUSA (no se borra) al caducar el trial/Pro, para que nadie
   sienta que le hemos quitado algo suyo. */
const PRO_PERKS = [
  { k: 'focus', group: 'productivity', on: () => true },
  { k: 'shield', group: 'productivity', on: s => !!(s.focusShield && (s.focusShield.schedule.enabled || Object.keys(s.focusShield.ritualSites || {}).length)) || (s.projects || []).length > 3 },
  { k: 'weekly', group: 'productivity', on: s => (s.focusHistory || []).length > 0 },
  { k: 'multi', group: 'world', on: s => s.stable && s.stable.some(p => p) },
  { k: 'expedition', group: 'world', on: s => !!s.expedition || (s.relics || 0) > 0 },
  { k: 'forge', group: 'world', on: s => (s.forjas && s.forjas.month === monthKey() && s.forjas.used > 0) || (s.dna && s.dna.cos && Object.keys(COS).some(id => COS[id].pro && Object.values(s.dna.cos).includes(id))) }
];
function renderProPerks() {
  const box = $('proPerks');
  const pro = !!(G.pro && G.pro.active);
  const trialing = !pro && trialStatus(G).active;
  const expired = !pro && !trialing && G.trialStart;
  // encabezado según el momento
  let head = '';
  if (trialing) head = '<div class="perkhead trial">' + t('perks_head_trial') + '</div>';
  else if (expired) head = '<div class="perkhead lost">' + t('perks_head_lost') + '</div>';
  else if (!pro) head = '<div class="perkhead">' + t('perks_head_free') + '</div>';
  const row = p => {
    const using = p.on(G);
    let icon, cls;
    if (pro) { icon = '✅'; cls = 'ok'; }
    else if (trialing) { icon = using ? '🎁' : '🔓'; cls = 'ok'; }      // disfrutándolo ahora
    else { icon = '🔒'; cls = 'lk'; }                                    // caducado o nunca activo
    const warn = (trialing && using) ? '<em>' + t('perk_will_pause') + '</em>' : '';
    // La Forja: contador de usos del mes cuando el usuario tiene acceso
    let extra = '';
    if (p.k === 'forge' && (pro || trialing)) {
      const used = (G.forjas && G.forjas.month === monthKey()) ? G.forjas.used : 0;
      extra = '<em style="color:#7fd0a8">' + t('perk_forge_left', { N: Math.max(0, 3 - used) }) + '</em>';
    }
    return '<div class="perkrow ' + cls + '"><span class="perki">' + icon + '</span>' +
      '<span class="perktx"><b>' + t('perk_' + p.k) + '</b><small>' + t('perkd_' + p.k) + '</small>' + warn + extra + '</span></div>';
  };
  const groups = ['productivity','world'].map(group => '<div class="perkgroup"><h4>' + esc(t('pro_group_' + group)) + '</h4><div class="perklist">' + PRO_PERKS.filter(p => p.group === group).map(row).join('') + '</div></div>').join('');
  // pie tranquilizador: nada se pierde, solo se pausa
  const foot = (trialing || expired || !pro)
    ? '<div class="perkfoot">🛟 ' + t('perks_safe') + '</div>' : '';
  const compare = '<div class="perkfoot" style="margin-bottom:8px">' + t('pro_free_compare') + '</div>';
  box.innerHTML = head + compare + groups + foot;
}
$('btnTrialStart').addEventListener('click', async () => {
  if (!G || G.trialStart || (G.pro && G.pro.active)) return;
  startTrial(G);
  G.proOn = proActive(G);
  await persist();
  renderPro(); renderPets(); renderShield(); applyProgressiveUI(); updateHUD();
  toast(t('trial_started'));
});
$('proBuy').addEventListener('click', e => {
  const b = e.target.closest('[data-plan]');
  if (b) chrome.tabs.create({ url: PAY_LINKS[b.getAttribute('data-plan')] });
});
$('proAct').addEventListener('click', async () => {
  $('proAct').disabled = true;
  $('proMsg').textContent = t('lic_activating');
  const res = await activateLicense(G, $('proKey').value);
  $('proAct').disabled = false;
  if (res.ok) {
    $('proMsg').textContent = '';
    sfx.fanfare();
    toast(t('pro_activated') + ' · ' + tierName(res.tier));
    G.proOn = true;
    persist(); renderPro(); renderPets(); updateHUD();
  } else {
    $('proMsg').textContent = '⚠️ ' + t(res.msg, res.subs || {});
  }
});
$('proDeact').addEventListener('click', async () => {
  if (!confirm(t('confirm_deact'))) return;
  await deactivateLicense(G);
  G.proOn = proActive(G);
  G.packMode = G.proOn ? G.packMode : false;
  persist(); renderPro(); renderPets(); updateHUD();
  toast(t('pro_deact'));
});
function monthKey() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1); }

/* ═══ ESTABLO: hasta 3 criaturas (las inactivas descansan) ═══ */
const PET_FIELDS = ['phase', 'cracks', 'dna', 'stageIdx', 'growth', 'hambre', 'higiene', 'animo', 'vinculo', 'educacion', 'poops', 'poopBornAt', 'sick', 'sickMeds', 'sickMimos', 'neglectMs', 'visits', 'wokeUntil', 'digestBoost', 'pendingPoopShow', 'sizePct', 'freeRetouchUsed'];
function snapPet() { const o = {}; PET_FIELDS.forEach(k => o[k] = G[k]); return o; }
function loadPet(p) { PET_FIELDS.forEach(k => G[k] = p[k]); if (G.sizePct == null) G.sizePct = 100; G.activeVisit = null; }
function freshEggPet() {
  return { phase: 'egg', cracks: 0, dna: null, stageIdx: 0, growth: 0, hambre: 80, higiene: 90, animo: 70, vinculo: 5, educacion: 30, poops: 0, poopBornAt: 0, sick: false, sickMeds: false, sickMimos: 0, neglectMs: 0, visits: [], wokeUntil: 0, digestBoost: false, pendingPoopShow: false, sizePct: 100, freeRetouchUsed: false };
}
function renderPets() {
  const box = $('petsbox');
  box.style.display = (G.phase === 'pet' || (G.stable && G.stable.length)) ? '' : 'none';
  const rows = [];
  const activeMini = G.phase === 'pet'
    ? '<svg viewBox="0 0 200 200" width="50" height="50">' + buildCreature(G.dna, G.stageIdx, { dirtLvl: 0, poops: 0, focusing: false, mood: 80, sleeping: isAsleep(G) }).split('bodyclip').join('bodyclipSlA') + '</svg>'
    : '🥚';
  rows.push('<div class="petslot"><div class="mini">' + activeMini + '</div><div class="pnm"><b>' + esc(G.dna ? G.dna.name : t('egg_word')) + '</b><small>' + t('pets_active') + '</small></div><input type="range" class="psz" min="10" max="100" data-psize="a" value="' + (G.sizePct == null ? 100 : G.sizePct) + '" title="' + t('lbl_size') + ' ' + (G.sizePct == null ? 100 : G.sizePct) + '%" style="width:56px"><span style="color:var(--amber);font-size:0.74rem;font-weight:700">● ' + t('pets_withyou') + '</span></div>');
  for (let i = 0; i < 2; i++) {
    const p = G.stable[i];
    const locked = !proActive(G);
    if (p) {
      const mini = p.phase === 'pet'
        ? '<svg viewBox="0 0 200 200" width="50" height="50">' + buildCreature(p.dna, p.stageIdx, { dirtLvl: 0, poops: 0, focusing: false, mood: 80, sleeping: isAsleep({ phase: 'pet', dna: p.dna, wokeUntil: 0 }) }).split('bodyclip').join('bodyclipSl' + i) + '</svg>'
        : '🥚';
      const canStore = (G.reserve || []).length < resCap();
      rows.push('<div class="petslot"><div class="mini">' + mini + '</div><div class="pnm"><b>' + esc(p.dna ? p.dna.name : t('egg_word')) + '</b><small>' + t('pets_resting') + '</small></div><input type="range" class="psz" min="10" max="100" data-psize="' + i + '" value="' + (p.sizePct == null ? 100 : p.sizePct) + '" title="' + t('lbl_size') + ' ' + (p.sizePct == null ? 100 : p.sizePct) + '%" style="width:56px"><button data-swap="' + i + '">' + t('pets_swap') + '</button><button data-store="' + i + '" title="📦"' + (canStore ? '' : ' disabled') + '>📦</button></div>');
    } else {
      rows.push('<div class="petslot"><div class="mini">➕</div><div class="pnm"><b>' + t('pets_free') + '</b><small>' + (locked ? t('pets_prolock') : t('pets_newegg_cost', { N: EGG_COST })) + '</small></div>' + (locked ? '<span style="font-size:0.9rem">🔒</span>' : '<button data-newegg="' + i + '">🥚 ' + t('pets_newegg_btn') + '</button>') + '</div>');
    }
  }
  $('petSlots').innerHTML = rows.join('');
  renderReserve();
}
function resCap() { return proActive(G) ? 25 : 10; }
let bestOpenSp = null;
function renderBestiario() {
  const box = $('bestbox');
  const disc = G.discovered || [];
  box.style.display = disc.length ? '' : 'none';
  if (!disc.length) return;
  const all = Object.keys(SP_LABEL);
  $('bestCount').textContent = t('best_count', { N: disc.length, T: all.length });
  const wits = G.wits || [];
  $('witsLbl').textContent = '⚔️ ' + t('wit_count', { N: wits.length, T: duelBank('es').length });
  $('bestGrid').innerHTML = all.map(sp => {
    const known = disc.includes(sp);
    const rare = known && RARITY[sp];
    const icon = known
      ? '<svg viewBox="0 0 200 200" width="34" height="34">' + buildCreature({ species: sp, color: '#e8a33d', marking: { type: 'none' }, gender: 'macho', accessory: 'none', temperament: 'tranquilo', seed: 1, name: '' }, 2, { dirtLvl: 0, poops: 0, focusing: false, mood: 80 }).split('bodyclip').join('bodyclipBest' + sp) + '</svg>'
      : '❔';
    return '<div class="bestcard' + (known ? '' : ' locked') + (rare ? ' rare' : '') + '" data-sp="' + sp + '" title="' + (known ? spName(sp) : '???') + '">' +
      '<div class="bicon">' + icon + '</div><div class="bname">' + (known ? spName(sp) : '???') + '</div></div>';
  }).join('');
  if (bestOpenSp && disc.includes(bestOpenSp)) { showBestLore(bestOpenSp); }
  else { const lo = $('bestLore'); if (lo) lo.style.display = 'none'; }   // el nodo solo existe tras abrir una ficha
}
function showBestLore(sp) {
  bestOpenSp = sp;
  let lore = $('bestLore');
  if (!lore) {
    lore = document.createElement('div');
    lore.id = 'bestLore';
    lore.className = 'bestlore';
    $('bestGrid').insertAdjacentElement('afterend', lore);
  }
  lore.style.display = '';
  const rk = RARITY[sp] === 'raro' ? 'rarity_rare' : RARITY[sp] === 'épico' ? 'rarity_epic' : RARITY[sp] ? 'rarity_legendary' : 'rarity_common';
  const loreKey = 'lore_' + sp;
  const localizedLore = t(loreKey) !== loreKey ? t(loreKey) : (G.uiLang === 'es' ? (SP_LORE[sp] || '') : t('lore_generic'));
  lore.innerHTML = '<b>' + spName(sp) + ' · <span style="color:var(--amber)">' + esc(t(rk)) + '</span></b><br>' + esc(localizedLore);
}
$('bestGrid').addEventListener('click', e => {
  const card = e.target.closest('.bestcard');
  if (!card || card.classList.contains('locked')) return;
  showBestLore(card.getAttribute('data-sp'));
});
function renderReserve() {
  const res = G.reserve || [];
  $('resHead').textContent = '📦 ' + t('res_head', { N: res.length, C: resCap() }) + (proActive(G) ? '' : ' · ' + t('res_pro_note'));
  const emptySlot = !G.stable[0] || !G.stable[1];
  $('resList').innerHTML = res.map((p, j) => {
    const mini = (p.phase === 'pet' && p.dna)
      ? '<svg viewBox="0 0 200 200" width="40" height="40">' + buildCreature(p.dna, p.stageIdx, { dirtLvl: 0, poops: 0, focusing: false, mood: 75, sleeping: isAsleep({ phase: 'pet', dna: p.dna, wokeUntil: 0 }) }).split('bodyclip').join('bodyclipR' + j) + '</svg>'
      : '🥚';
    return '<div class="petslot"><div class="mini" style="width:44px;height:44px">' + mini + '</div><div class="pnm"><b>' + esc(p.dna ? p.dna.name : t('egg_word')) + '</b><small>' + (p.dna ? spName(p.dna.species) + ' · ' + stName(STAGES[p.stageIdx].id) : t('res_unhatched')) + '</small></div>' +
      '<button data-bring="' + j + '"' + (emptySlot ? '' : ' disabled') + '>' + t('res_bring') + '</button>' +
      '<button data-release="' + j + '" title="🕊️">🕊️</button></div>';
  }).join('') || '<div class="mnote" style="margin:4px 0 0">' + t('res_empty') + '</div>';
}
$('resList').addEventListener('click', e => {
  const br = e.target.closest('[data-bring]');
  const rl = e.target.closest('[data-release]');
  if (br) {
    const j = parseInt(br.getAttribute('data-bring'), 10);
    const idx = !G.stable[0] ? 0 : (!G.stable[1] ? 1 : -1);
    if (idx < 0) { toast(t('bring_full')); return; }
    if (idx > 0 && !proActive(G)) { toast('🔒 ' + t('bring_pro')); return; }
    G.stable[idx] = G.reserve.splice(j, 1)[0];
    sfx.sparkle();
    toast(t('bring_back', { N: G.stable[idx].dna ? G.stable[idx].dna.name : t('egg_word') }));
    renderPets(); persist();
  }
  if (rl) {
    const j = parseInt(rl.getAttribute('data-release'), 10);
    const p = G.reserve[j];
    const nm = p.dna ? p.dna.name : t('egg_word');
    if (!confirm(t('confirm_release', { N: nm }))) return;
    G.reserve.splice(j, 1);
    toast(t('released', { N: nm }));
    renderPets(); persist();
  }
});
$('petSlots').addEventListener('input', e => {
  // mini-slider de tamaño por criatura: 'a' = activa (espeja el slider grande),
  // 0/1 = huecos de la cuadra. Cada criatura recuerda el suyo (viaja en snapPet).
  const r = e.target.closest('[data-psize]');
  if (!r) return;
  const v = Math.max(10, Math.min(100, parseInt(r.value, 10) || 100));
  const who = r.getAttribute('data-psize');
  if (who === 'a') {
    G.sizePct = v;
    $('rngSize').value = v; $('sizeval').textContent = v + '%';
  } else {
    const p = G.stable[parseInt(who, 10)];
    if (!p) return;
    p.sizePct = v;   // la manada lo relee vía storage.onChanged → syncComps
  }
  r.title = t('lbl_size') + ' ' + v + '%';
  persist();
});
$('petSlots').addEventListener('click', e => {
  const sw = e.target.closest('[data-swap]');
  const ne = e.target.closest('[data-newegg]');
  const st = e.target.closest('[data-store]');
  if (st) {
    const i = parseInt(st.getAttribute('data-store'), 10);
    if ((G.reserve || []).length >= resCap()) { toast(t('reserve_full', { N: resCap() }) + (proActive(G) ? '' : ' · ' + t('res_pro_note'))); return; }
    const p = G.stable[i];
    if (!p) return;
    G.reserve.push(p);
    G.stable[i] = null;
    toast(t('stored', { N: p.dna ? p.dna.name : t('egg_word') }));
    renderPets(); persist();
    return;
  }
  if (sw) {
    const i = parseInt(sw.getAttribute('data-swap'), 10);
    const target = G.stable[i];
    if (!target) return;
    if (G.phase === 'egg') toast('\u{1F525} ' + t('egg_stable_hint'));   // huevo aparcado: se incuba con el próximo foco (v0.48)
    G.stable[i] = snapPet();
    loadPet(target);
    nanoSession = null;
    sfx.sparkle();
    toast(t('swap_msg', { N: G.dna ? G.dna.name : t('egg_word') }));
    syncPhaseUI(); renderPets(); draw(true, true); updateHUD(); persist();
  }
  if (ne) {
    if (!proActive(G)) { toast('🔒 ' + t('multi_pro') + (trialStatus(G).remaining > 0 ? '' : ' ' + t('pro_from'))); return; }
    if (G.brasas < EGG_COST) { toast(t('egg_cost_msg', { N: EGG_COST })); return; }
    const i = parseInt(ne.getAttribute('data-newegg'), 10);
    if (!confirm(t('confirm_newegg', { P: EGG_COST, N: G.dna ? G.dna.name : '???' }))) return;
    G.brasas -= EGG_COST;
    // v0.48.1: el huevo aterriza en el hueco donde se compra — la mascota
    // sigue activa y la cuadra lo incuba con el próximo foco. Quien quiera el
    // ritual de la incubadora lo intercambia a activo desde aquí mismo.
    G.stable[i] = freshEggPet();
    sfx.knock();
    toast('\u{1F525} ' + t('egg_stable_hint'));
    renderPets(); updateHUD(); persist();
  }
});

/* ═══ ALMA: vínculo, sueño, misiones y regalo diario ═══ */
function bondTitle(v) {
  return v < 20 ? t('bond_1') : v < 45 ? t('bond_2') : v < 70 ? t('bond_3') : v < 90 ? t('bond_4') : t('bond_5');
}
function wakeIfAsleep() {
  if (!isAsleep(G)) return;
  G.wokeUntil = Date.now() + 90 * 1000;
  fx('stretch', 900);
  const WAKE = { es: 'Mmm… ¿ya es de día?', en: 'Mmm… is it morning already?', de: 'Mmm… ist schon Morgen?', fr: 'Mmm… c\'est déjà le matin ?', it: 'Mmm… è già mattina?', pt: 'Mmm… já é de manhã?' };
  const sleepy = { grunon: '¿QUIÉN osa…? Ah. Eres tú. Hmpf.', timido: '¿Eh? ¡Ah! M-me has visto dormir…', caotico: '¡NO ESTABA DORMIDO! …vale sí.', jugueton: '¿Ya es hora de jugar? *bostezo*', tranquilo: 'Mmm… cinco minutitos más…' };
  const lang = (G.uiLang || 'es').slice(0, 2);   // 'pt_PT' → 'pt' para el banco WAKE
  say(lang === 'es' ? (sleepy[G.dna.temperament] || WAKE.es) : (WAKE[lang] || WAKE.en));
  draw(true); updateHUD(); persist();
}
function renderDaily() {
  if (!G.daily) return;
  const items = [
    ['🍎', t('daily_feed'), G.daily.fed],
    ['⏱️', t('daily_focus'), G.daily.focus],
    ['🎮', t('daily_play'), G.daily.played]
  ];
  $('dailyList').innerHTML = items.map(([e, t, done]) =>
    '<div class="dailyrow' + (done ? ' done' : '') + '"><span class="dchk">' + (done ? '✅' : '⬜') + '</span>' + e + ' ' + t + '</div>'
  ).join('') + (G.daily.done ? '<div class="dailyrow done"><span class="dchk">🏆</span>' + t('daily_done_row') + '</div>' : '');
}
const ROUTE_EMOJI = { forest: '🌲', ruins: '🏛️', lagoon: '🌊' };
function relicName(id) { return t('relic_' + id + '_name'); }
function relicLore(id) { return t('relic_' + id + '_lore'); }
function openRelicarium() {
  const unique = relicUniqueCount(G), milestone = RELIC_MILESTONES.filter(m => unique >= m.unique).slice(-1)[0];
  openModal(t('relicarium_title'));
  const groups = ['forest','ruins','lagoon'].map(route => '<section class="relic-route"><h4>' + ROUTE_EMOJI[route] + ' ' + esc(t('route_' + route)) + '</h4><div class="relic-grid">' + RELIC_CATALOG.filter(r => r.route === route).map(r => {
    const rec = G.relicCollection && G.relicCollection[r.id], found = rec && rec.n > 0;
    return '<article class="relic-card ' + (found ? 'found ' + r.rarity : 'locked') + '"><span class="relic-emoji">' + (found ? r.emoji : '❔') + '</span><b>' + esc(found ? relicName(r.id) : t('relic_unknown')) + '</b><small>' + esc(found ? relicLore(r.id) : t('relic_unknown_lore')) + '</small>' + (found ? '<em>×' + rec.n + '</em>' : '') + '</article>';
  }).join('') + '</div></section>').join('');
  const milestones = RELIC_MILESTONES.map(m => '<div class="relic-milestone ' + (unique >= m.unique ? 'done' : '') + '"><span>' + (unique >= m.unique ? '✅' : '🔒') + '</span><b>' + esc(t('relic_milestone_' + m.id)) + '</b><small>' + m.unique + '/9</small></div>').join('');
  mbody.innerHTML = '<div class="relic-head"><b>' + esc(t('relicarium_progress', { N: unique })) + '</b><small>' + esc(t('relicarium_total', { N: G.relics || 0 })) + '</small></div>' + groups + '<h4>' + esc(t('relicarium_milestones')) + '</h4>' + milestones + (milestone ? '<div class="mnote relic-current">✨ ' + esc(t('relic_current_reward', { R:t('relic_milestone_' + milestone.id) })) + '</div>' : '');
}
function showRelicReveal(reward) {
  if (!reward || !reward.relicDrops || !reward.relicDrops.length) return;
  openModal(t('relic_found_title'));
  mbody.innerHTML = '<div class="relic-reveal">' + reward.relicDrops.map(id => { const r=RELIC_CATALOG.find(x=>x.id===id); return '<div class="relic-drop"><span>' + (r?r.emoji:'✨') + '</span><b>' + esc(relicName(id)) + '</b>' + (reward.relicNew.includes(id)?'<em>'+esc(t('relic_new'))+'</em>':'<small>'+esc(t('relic_duplicate'))+'</small>') + '</div>'; }).join('') + '</div>' + (reward.relicMilestone ? '<div class="relic-unlock">🎭 <b>' + esc(t('relic_milestone_unlocked')) + '</b><br>' + esc(t('relic_milestone_' + reward.relicMilestone.id)) + '</div>' : '') + '<button class="primary" id="relicRevealOk">' + esc(t('relicarium_view')) + '</button>';
  $('relicRevealOk').addEventListener('click', openRelicarium);
}
function missionLabel(m) { return t('mission_' + m.type, { N: m.target }); }
function renderJourney() {
  if (!G || G.phase !== 'pet') return;
  const m = ensureDailyMission(G);
  const pct = Math.min(100, Math.round(m.progress / m.target * 100));
  $('missionCard').innerHTML = '<div class="journey-card' + (m.claimed ? ' done' : '') + '"><div class="journey-line"><span>' + (m.claimed ? '✅' : '🎯') + '</span><span class="journey-copy"><b>' + esc(t('mission_daily')) + '</b><small>' + esc(missionLabel(m)) + ' · ' + Math.min(m.progress, m.target) + '/' + m.target + ' · ' + esc(t('mission_reward')) + '</small></span></div><div class="journey-progress"><i style="width:' + pct + '%"></i></div></div>';
  const week = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const k = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(); week.push(!!(G.fstats && G.fstats.days && G.fstats.days[k] && G.fstats.days[k].n)); }
  const streak = G.streak || { count: 0, shield: false };
  $('streakCard').innerHTML = '<div class="journey-card"><div class="journey-line"><span>🔥</span><span class="journey-copy"><b>' + esc(t('streak_gentle', { N: streak.count || 0 })) + '</b><small>' + esc(streak.shield ? t('streak_shield_ready') : t('streak_shield_desc')) + '</small></span>' + (streak.shield ? '<span title="' + esc(t('streak_shield_ready')) + '">🛡️</span>' : '<button id="btnShield"' + ((G.brasas || 0) < 12 ? ' disabled' : '') + '>🛡️ 12🔥</button>') + '</div><div class="streak-week">' + week.map(on => '<i class="streak-day' + (on ? ' on' : '') + '"></i>').join('') + '</div></div>';
  const e = G.expedition;
  if (!e) {
    const freeReady = freeExpeditionReady(G);
    const freeText = freeReady ? t('expedition_free_ready') : t('expedition_free_wait', { N: Math.max(1, Math.ceil((FREE_EXPEDITION_COOLDOWN - (Date.now() - (G.freeExpeditionAt || 0))) / 86400e3)) });
    $('expeditionCard').innerHTML = '<div class="journey-card"><div class="journey-line"><span>🗺️</span><span class="journey-copy"><b>' + esc(t('expedition_title')) + (proActive(G) ? '' : ' <span class="pro-tag">PRO+</span>') + '</b><small>' + esc(proActive(G) ? t('expedition_empty') : freeText) + ' · ' + esc(t('relicarium_progress', { N: relicUniqueCount(G) })) + '</small></span></div></div>';
  } else {
    const epct = Math.min(100, Math.round(e.progress / e.target * 100));
    $('expeditionCard').innerHTML = '<div class="journey-card' + (e.status === 'ready' ? ' done' : '') + '"><div class="journey-line"><span>' + ROUTE_EMOJI[e.route] + '</span><span class="journey-copy"><b>' + esc(t('route_' + e.route)) + ' · ' + esc(e.petName) + '</b><small>' + esc(e.status === 'ready' ? t('expedition_returned') : t('expedition_progress', { N: e.progress, T: e.target })) + '</small></span>' + (e.status === 'ready' ? '<button id="btnClaimExpedition">' + esc(t('expedition_claim')) + '</button>' : (proActive(G) ? '' : '🔒')) + '</div><div class="journey-progress"><i style="width:' + epct + '%"></i></div></div>';
  }
  $('btnExpedition').disabled = !!(e && e.status === 'active');
  const shield = $('btnShield');
  if (shield) shield.addEventListener('click', () => { if ((G.brasas || 0) < 12) return; G.brasas -= 12; G.streak = G.streak || { count: 0, last: '', best: 0 }; G.streak.shield = true; toast(t('streak_shield_bought')); renderJourney(); updateHUD(); persist(); });
  const claim = $('btnClaimExpedition');
  if (claim) claim.addEventListener('click', () => { const reward = claimExpedition(G); if (!reward) return; sfx.fanfare(); react('happy', 1800); ['🧭','✨','🔥'].forEach((x,i) => setTimeout(() => particle(x), i*140)); toast(t(reward.free ? 'expedition_claimed_free' : 'expedition_claimed', { B: reward.brasas, R: reward.relics })); renderJourney(); renderCraft(); updateHUD(); draw(true); persist(); if (!reward.free) setTimeout(() => showRelicReveal(reward), 250); });
}

$('btnRelicarium').addEventListener('click', openRelicarium);

function expeditionPets() {
  const out = G.dna ? [{ key: 'active', dna: G.dna }] : [];
  (G.stable || []).forEach((p, i) => { if (p && p.phase === 'pet' && p.dna) out.push({ key: 'stable-' + i, dna: p.dna }); });
  return out;
}
$('btnExpedition').addEventListener('click', () => {
  if (G.expedition) return;
  const pro = proActive(G);
  const pets = pro ? expeditionPets() : expeditionPets().slice(0, 1);
  let route = 'forest';
  openModal(t('expedition_title'));
  const routes = Object.entries(EXPEDITION_ROUTES).map(([id, d]) => { const locked=!pro&&id!=='forest', desc=(!pro&&id==='forest')?'route_desc_forest_free':'route_desc_'+id; return '<button class="route-card' + (id === route ? ' selected' : '') + (locked?' locked':'') + '" data-route="' + id + '"' + (locked?' disabled':'') + '><b>' + ROUTE_EMOJI[id] + ' ' + esc(t('route_' + id)) + (locked?' <span class="pro-tag">PRO</span>':'') + '</b><small>' + esc(t(desc, { N: d.sessions })) + '</small></button>'; }).join('');
  const freeReady = freeExpeditionReady(G);
  const freeNote = pro ? '' : '<div class="mnote pro-split">' + esc(freeReady ? t('expedition_free_note') : t('expedition_free_wait', { N: Math.max(1, Math.ceil((FREE_EXPEDITION_COOLDOWN - (Date.now() - (G.freeExpeditionAt || 0))) / 86400e3)) })) + '</div>';
  mbody.innerHTML = '<div class="mnote" style="margin-bottom:8px">🧭 ' + esc(t('expedition_relics', { N: G.relics || 0 })) + '</div><div class="route-grid">' + routes + '</div>' + freeNote + '<label class="fieldlbl" style="margin-top:10px">' + esc(t('expedition_companion')) + '<select id="expPet">' + pets.map(p => '<option value="' + p.key + '">' + esc(p.dna.name) + ' · ' + esc(spName(p.dna.species)) + '</option>').join('') + '</select></label><div id="expBonus" class="fnote"></div><button class="primary" id="expStart" style="margin-top:10px"' + (!pro&&!freeReady?' disabled':'') + '>' + esc(t('expedition_start')) + '</button>';
  const updateBonus = () => { const p = pets.find(x => x.key === $('expPet').value) || pets[0]; const favored = pro && p && EXPEDITION_ROUTES[route].favored.includes(p.dna.species); $('expBonus').textContent = pro ? (favored ? t('expedition_species_bonus') : t('expedition_no_bonus')) : t('expedition_affinity_pro'); };
  mbody.querySelectorAll('[data-route]').forEach(b => b.addEventListener('click', () => { route = b.dataset.route; mbody.querySelectorAll('[data-route]').forEach(x => x.classList.toggle('selected', x === b)); updateBonus(); }));
  $('expPet').addEventListener('change', updateBonus); updateBonus();
  $('expStart').addEventListener('click', () => { const p = pets.find(x => x.key === $('expPet').value) || pets[0]; if (!startExpedition(G, route, p)) { toast(t('expedition_free_wait', { N: 7 })); return; } toast(t('expedition_started', { N: p.dna.name })); closeModal(); renderJourney(); persist(); });
});

function weeklyStats() {
  const since = Date.now() - 7 * 86400e3;
  const hs = (G.focusHistory || []).filter(h => h.at >= since);
  const min = hs.reduce((n,h) => n + (h.minutes || 0), 0);
  const done = hs.filter(h => h.result === 'done').length;
  const ritualCounts = {};
  hs.forEach(h => { if (h.ritualId) ritualCounts[h.ritualId] = (ritualCounts[h.ritualId] || 0) + 1; });
  const bestRitualId = Object.keys(ritualCounts).sort((a,b) => ritualCounts[b] - ritualCounts[a])[0];
  const ritual = (G.rituals || []).find(r => r.id === bestRitualId);
  let bestDay = '', bestMin = 0;
  for (let i=0;i<7;i++) { const d=new Date(); d.setDate(d.getDate()-i); const k=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); const x=G.fstats&&G.fstats.days&&G.fstats.days[k]; if(x&&x.min>bestMin){bestMin=x.min;bestDay=d.toLocaleDateString(document.documentElement.lang,{weekday:'long'});} }
  const projectCounts = {};
  hs.forEach(h => { if (h.projectId) projectCounts[h.projectId] = (projectCounts[h.projectId] || 0) + 1; });
  const projectId = Object.keys(projectCounts).sort((a,b) => projectCounts[b] - projectCounts[a])[0];
  const project = (G.projects || []).find(p => p.id === projectId);
  return { n: hs.length, min, done, rate: hs.length ? Math.round(done/hs.length*100) : 0, avg: hs.length ? Math.round(min/hs.length) : 0, bestDay: bestDay || '—', ritual: ritual ? ritual.name : '—', project: project ? project.name : '—' };
}
$('btnWeeklyReport').addEventListener('click', async () => {
  const w = weeklyStats();
  openModal(t('weekly_title'));
  const pro = proActive(G);
  mbody.innerHTML = '<div class="report-grid"><div class="report-stat"><b>' + w.n + '</b><small>' + esc(t('weekly_sessions')) + '</small></div><div class="report-stat"><b>' + w.min + '</b><small>' + esc(t('weekly_minutes')) + '</small></div><div class="report-stat"><b>' + w.rate + '%</b><small>' + esc(t('weekly_completion')) + '</small></div><div class="report-stat"><b>' + w.avg + '</b><small>' + esc(t('weekly_average')) + '</small></div></div><div class="mnote">📅 ' + esc(t('weekly_best_day', { D: w.bestDay })) + '<br>⚙️ ' + esc(t('weekly_best_ritual', { R: w.ritual })) + '</div><div class="journey-card' + (pro?'':' locked') + '" style="margin-top:10px"><b>' + esc(t('weekly_nano_title')) + ' <span class="pro-tag">PRO</span></b><div id="weeklyInsight" class="mnote">' + esc(pro?t('weekly_analyzing'):t('weekly_nano_locked')) + '</div></div>';
  if (!pro) return;
  const fallback = w.n ? t(w.rate >= 70 ? 'weekly_tip_consistency' : 'weekly_tip_small') : t('weekly_tip_start');
  const line = await nanoLine('Analiza esta semana de foco y da una sola recomendación concreta y amable. Sesiones: ' + w.n + ', minutos: ' + w.min + ', objetivos completados: ' + w.done + ', media: ' + w.avg + ' minutos.');
  if ($('weeklyInsight')) $('weeklyInsight').textContent = line || fallback;
});

function applyQuietMode() {
  document.body.classList.toggle('quiet-mode', !!G.quietMode);
  EXPERIENCE_MODES.forEach(mode => document.body.classList.toggle('experience-' + mode, G.experienceMode === mode));
  $('btnQuiet').classList.toggle('active', !!G.quietMode);
  $('btnQuiet').textContent = G.quietMode ? '🌱' : '🌿';
  if (G.quietMode && ['jugar','col'].includes(G.uiTab)) goTab('foco');
}

function sessionCount() { return Math.max((G.fstats && G.fstats.totalN) || 0, (G.focusHistory || []).length); }
function applyProgressiveUI() {
  if (!G) return;
  const unlocked = id => featureUnlocked(G, id);
  const toggle = (id, on) => { const el=$(id); if(el) el.style.display=on?'':'none'; };
  // Productividad esencial: siempre disponible, incluso durante la
  // incubación. La progresión descubre el mundo, no retiene herramientas.
  ['projectRow','shieldCard'].forEach(id => toggle(id, true));
  if (G.phase !== 'pet') { applyQuietMode(); return; }
  toggle('dailybox', unlocked('journey'));
  // Pesca es cuidado básico y aparece al nacer. El resto del juego continúa
  // descubriéndose tras tres sesiones para no saturar la primera apertura.
  document.querySelectorAll('.tab[data-goto="jugar"]').forEach(el => el.style.display = '');
  document.querySelectorAll('.tab[data-goto="col"]').forEach(el => el.style.display = unlocked('collection') ? '' : 'none');
  ['minis','screenbox'].forEach(id => toggle(id, true));
  toggle('btnOvillo', unlocked('play'));
  if ($('minisNote')) $('minisNote').textContent = t(unlocked('play') ? 'minis_note' : 'minis_note_early');
  ['petsbox','bestbox','memoryBox'].forEach(id => toggle(id, unlocked('collection')));
  ['huertoBox','craftbox','cosBox','logrosBox'].forEach(id => toggle(id, unlocked('craft')));
  ['btnExpedition','btnRelicarium','btnWeeklyReport','expeditionCard'].forEach(id => toggle(id, unlocked('expeditions')));
  ['visitbox','btnForge'].forEach(id => toggle(id, unlocked('mastery')));
  const n = sessionCount();
  const next = FEATURE_UNLOCKS.find(f => n < f.sessions);
  const path = $('unlockPath');
  if (path) path.innerHTML = next ? esc(t('unlock_next', { N: next.sessions - n, F: t('unlock_' + next.id + '_title') })) : '<b>' + esc(t('unlock_complete')) + '</b>';
  if (!unlocked('collection') && G.uiTab === 'col') goTab('foco');
  applyQuietMode();
}
function maybeShowUnlock() {
  if (!G || G.phase !== 'pet') return;
  G.unlockSeen = Array.isArray(G.unlockSeen) ? G.unlockSeen : [];
  const next = FEATURE_UNLOCKS.find(f => featureUnlocked(G, f.id) && !G.unlockSeen.includes(f.id));
  if (!next) return;
  G.unlockSeen.push(next.id);
  openModal(t('unlock_' + next.id + '_title'));
  mbody.innerHTML = '<div class="unlock-hero">' + ({journey:'🧭',play:'🎮',collection:'📖',shield:'🛡️',craft:'⚒️',expeditions:'🗺️',mastery:'✨'}[next.id] || '✨') + '</div><div class="mnote">' + esc(t('unlock_' + next.id + '_desc')) + '</div><button class="primary" id="unlockOk" style="margin-top:12px">' + esc(t('unlock_ok')) + '</button>';
  $('unlockOk').addEventListener('click', closeModal);
  applyProgressiveUI(); persist();
}

function renderProjects() {
  const sel = $('selProject'); if (!sel) return;
  const projects = proActive(G) ? (G.projects || []).slice(0, 12) : (G.projects || []).slice(0, 3);
  sel.innerHTML = '<option value="">' + esc(t('project_none')) + '</option>' + projects.map(p => '<option value="' + esc(p.id) + '">' + esc(p.name) + '</option>').join('');
  sel.value = projects.some(p => p.id === G.activeProjectId) ? G.activeProjectId : '';
}
$('selProject').addEventListener('change', e => { G.activeProjectId=e.target.value; persist(); });
$('btnProjects').addEventListener('click', () => {
  const cap = proActive(G) ? 12 : 3;
  openModal(t('project_title'));
  const drawProjects = () => {
    const visible=(G.projects||[]).slice(0,cap), paused=Math.max(0,(G.projects||[]).length-visible.length);
    mbody.innerHTML = '<div class="mnote">' + esc(t('project_limit', { N:cap })) + (proActive(G)?'':' <span class="pro-tag">PRO: 12</span>') + '</div><div id="projectList">' + visible.map(p => '<div class="mrow" style="margin-top:7px"><input data-pname="'+esc(p.id)+'" maxlength="32" value="'+esc(p.name)+'"><button data-pdel="'+esc(p.id)+'">×</button></div>').join('') + '</div>' + (paused?'<div class="mnote pro-split">'+esc(t('project_paused',{N:paused}))+' <span class="pro-tag">PRO</span></div>':'') + '<div class="mrow" style="margin-top:10px"><input id="projectNew" maxlength="32" placeholder="'+esc(t('project_new_ph'))+'"><button id="projectAdd" class="primary">'+esc(t('project_add'))+'</button></div>';
    mbody.querySelectorAll('[data-pname]').forEach(i => i.addEventListener('change', () => { const p=G.projects.find(x=>x.id===i.dataset.pname); if(p)p.name=i.value.trim().slice(0,32)||p.name; renderProjects(); persist(); }));
    mbody.querySelectorAll('[data-pdel]').forEach(b => b.addEventListener('click', () => { G.projects=G.projects.filter(p=>p.id!==b.dataset.pdel); if(G.activeProjectId===b.dataset.pdel)G.activeProjectId=''; renderProjects(); persist(); drawProjects(); }));
    $('projectAdd').addEventListener('click', () => { const name=$('projectNew').value.trim().slice(0,32); if(!name)return; if((G.projects||[]).length>=cap){toast(t('project_limit_reached'));return;} G.projects=G.projects||[]; G.projects.push({id:'p'+Date.now().toString(36),name,createdAt:Date.now()}); G.activeProjectId=G.projects[G.projects.length-1].id; renderProjects(); persist(); drawProjects(); });
  }; drawProjects();
});

function renderShield() {
  const f=G.focusShield||{};
  $('shieldSummary').textContent = f.enabled ? t('shield_on_summary',{N:f.sites.length,R:f.recovered||0}) : t('shield_off_summary');
}
$('btnFocusShield').addEventListener('click', () => {
  const f=G.focusShield;
  openModal(t('shield_name'));
  const pro=proActive(G), rituals=(G.rituals||[]);
  mbody.innerHTML = '<label class="demolbl"><input id="shieldEnabled" type="checkbox"'+(f.enabled?' checked':'')+'> '+esc(t('shield_enable'))+'</label><label class="fieldlbl">'+esc(t('shield_mode'))+'<select id="shieldMode"><option value="gentle">'+esc(t('shield_gentle'))+'</option><option value="firm">'+esc(t('shield_firm'))+'</option></select></label><label class="fieldlbl">'+esc(t('shield_scope'))+'<select id="shieldScope"'+(pro?'':' disabled')+'><option value="">'+esc(t('shield_global'))+'</option>'+rituals.map(r=>'<option value="'+esc(r.id)+'">'+esc(r.name)+'</option>').join('')+'</select></label><label class="fieldlbl">'+esc(t('shield_sites'))+'<textarea id="shieldSites" class="site-list" placeholder="youtube.com\ninstagram.com">'+esc((f.sites||[]).join('\n'))+'</textarea></label><div class="journey-card"><label class="demolbl"><input id="shieldSchedule" type="checkbox"'+(f.schedule&&f.schedule.enabled?' checked':'')+(pro?'':' disabled')+'> '+esc(t('shield_schedule'))+'</label><div class="mrow"><input id="shieldStart" type="time" value="'+esc(f.schedule&&f.schedule.start||'09:00')+'"'+(pro?'':' disabled')+'><input id="shieldEnd" type="time" value="'+esc(f.schedule&&f.schedule.end||'17:00')+'"'+(pro?'':' disabled')+'></div></div><div class="mnote">'+esc(t('shield_metrics',{A:f.attempts||0,R:f.recovered||0,M:f.recoveredMin||0}))+'</div><div class="mnote">'+esc(pro?t('shield_pro_note'):t('shield_free_note'))+'</div>'+(f.later&&f.later.length?'<details><summary>'+esc(t('shield_later'))+' ('+f.later.length+')</summary>'+f.later.slice(-5).reverse().map(x=>'<div class="mnote">• '+esc(x.title||x.url)+'</div>').join('')+'</details>':'')+'<button id="shieldSave" class="primary" style="margin-top:10px">'+esc(t('save_btn'))+'</button>';
  $('shieldScope').closest('label').insertAdjacentHTML('afterbegin', '<span class="pro-tag">PRO</span> ');
  $('shieldSchedule').closest('label').insertAdjacentHTML('beforeend', ' <span class="pro-tag">PRO</span>');
  $('shieldMode').value=f.mode||'gentle';
  $('shieldScope').addEventListener('change',()=>{$('shieldSites').value=(($('shieldScope').value?(f.ritualSites||{})[$('shieldScope').value]:f.sites)||[]).join('\n');});
  $('shieldSave').addEventListener('click', async () => {
    const enabled = $('shieldEnabled').checked;
    if (enabled) {
      // Avoid requesting an already granted permission: Chrome may close the
      // popup while showing the native prompt, aborting the save handler.
      const hasRoam = await chrome.permissions.contains({ origins: ['<all_urls>'] });
      if (!hasRoam) {
        const ok = await enableRoam();
        if (!ok) return;
      }
    }
    const cap = pro ? 50 : 5;
    const hosts = $('shieldSites').value.split(/[\n,]+/).map(x => x.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '')).filter(Boolean);
    const sites = [...new Set(hosts)].slice(0, cap), scope = $('shieldScope').value;
    f.enabled = enabled;
    f.mode = $('shieldMode').value;
    if (scope && pro) {
      f.ritualSites = f.ritualSites || {};
      f.ritualSites[scope] = sites;
    } else f.sites = sites;
    f.schedule = f.schedule || {};
    f.schedule.enabled = pro && $('shieldSchedule').checked;
    f.schedule.start = $('shieldStart').value || '09:00';
    f.schedule.end = $('shieldEnd').value || '17:00';
    await persist();
    renderShield();
    closeModal();
  });
});

$('btnShareCard').addEventListener('click', async () => {
  const w=weeklyStats(), c=document.createElement('canvas'); c.width=1200;c.height=630;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,1200,630);g.addColorStop(0,'#171b25');g.addColorStop(1,'#45301c');x.fillStyle=g;x.fillRect(0,0,1200,630);
  x.fillStyle='#e8a33d';x.font='700 34px system-ui';x.fillText('🔥 SlimeForge',70,80);x.fillStyle='#fff';x.font='700 58px system-ui';x.fillText((G.dna&&G.dna.name)||'Slime',70,175);x.fillStyle='#c9c7c2';x.font='30px system-ui';x.fillText(t('share_week'),70,225);
  x.fillStyle='#fff';x.font='700 70px system-ui';x.fillText(String(w.n),70,350);x.fillText(String(w.min),300,350);x.fillText(String((G.streak&&G.streak.count)||0),570,350);x.font='24px system-ui';x.fillStyle='#c9c7c2';x.fillText(t('weekly_sessions'),70,390);x.fillText(t('weekly_minutes'),300,390);x.fillText(t('share_streak'),570,390);x.fillStyle='#e8a33d';x.font='28px system-ui';x.fillText(t('share_local'),70,540);
  if(G.dna){const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">'+buildCreature(G.dna,G.stageIdx,{dirtLvl:0,poops:0,focusing:false,mood:90})+'</svg>';const im=new Image();await new Promise(res=>{im.onload=res;im.onerror=res;im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)});if(im.complete)x.drawImage(im,830,150,280,280);}
  const url=c.toDataURL('image/png');openModal(t('share_title'));mbody.innerHTML='<img class="share-preview" src="'+url+'" alt="'+esc(t('share_title'))+'"><div class="mrow" style="margin-top:10px"><button id="shareCopy">'+esc(t('share_copy'))+'</button><button id="shareSave" class="primary">'+esc(t('share_save'))+'</button></div>';
  const blob=await new Promise(r=>c.toBlob(r,'image/png'));$('shareSave').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='slimeforge-progreso.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};$('shareCopy').onclick=async()=>{try{await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);toast(t('share_copied'));}catch(e){toast(t('share_copy_fail'));}};
});
function checkDaily() {
  if (!G.daily || G.daily.done) { renderDaily(); return; }
  if (G.daily.fed && G.daily.focus && G.daily.played) {
    G.daily.done = true;
    G.brasas += 3;
    const m = ['escama', 'hilo', 'calcetin'][Math.floor(Math.random() * 3)];
    G.mats[m] = (G.mats[m] || 0) + 1;
    sfx.fanfare();
    toast(t('daily_done') + ' ' + ({ escama: '🐟', hilo: '🧵', calcetin: '🧦' })[m]);
    renderCraft();
  }
  renderDaily(); updateHUD(); persist();
}
function dailyGift() {
  if (!G.daily || G.daily.gift || G.phase !== 'pet') return;
  G.daily.gift = true;
  const roll = Math.random();
  let msg;
  if (roll < 0.55) { const n = 1 + Math.floor(Math.random() * 2); G.brasas += n; msg = '+' + n + ' 🔥'; }
  else { const m = ['escama', 'hilo', 'calcetin'][Math.floor(Math.random() * 3)]; G.mats[m] = (G.mats[m] || 0) + 1; msg = '+1 ' + ({ escama: '🐟', hilo: '🧵', calcetin: '🧦' })[m]; renderCraft(); }
  particle('🎁');
  toast(t('gift_msg', { G: msg }));
  setTimeout(() => say(t('gift_say')), 600);
  updateHUD(); persist();
}

/* ═══ GOTEO DEL SLIME (popup) ═══ */
function slimeDripPopup() {
  if (!G.dna) return;
  const dp = (LOCO[G.dna.species] || LOCO.slime).drip;
  if (Math.random() > dp) return;   // todos gotean baba, cada especie con su flujo
  const c = G.dna.color || '#e8a33d';
  const o = hexToHsl(c);
  const rim = hslToHex(o.h, o.s, Math.max(o.l - 30, 8));
  const cx = stageEl.clientWidth / 2 + (Math.random() * 44 - 22);
  const d = document.createElement('div');
  d.className = 'pdrop';
  d.style.cssText = 'left:' + Math.round(cx - 3) + 'px;top:158px;width:6px;height:8px;background:' + c + ';box-shadow:inset 0 0 0 1.5px ' + rim + ';';
  stageEl.appendChild(d);
  d.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(38px)' }],
    { duration: 260, easing: 'cubic-bezier(.5,0,1,1)', fill: 'forwards' }).onfinish = () => {
    d.remove();
    const s = document.createElement('div');
    s.className = 'psplat';
    s.style.cssText = 'left:' + Math.round(cx) + 'px;top:196px;width:16px;height:5px;background:' + c + ';box-shadow:inset 0 0 0 1.5px ' + rim + ';opacity:0.55;';
    stageEl.appendChild(s);
    s.animate([{ opacity: 0.55, transform: 'translateX(-50%) scaleY(0.35) scale(1)' },
               { opacity: 0, transform: 'translateX(-50%) scaleY(0.35) scale(1.25)' }],
      { duration: 2600, easing: 'ease-out', fill: 'forwards' }).onfinish = () => s.remove();
  };
}

/* ═══ EVENTOS ALEATORIOS DEL POPUP ═══ */
let popupEvT = 0;
function popupEvent() {
  const r = Math.random();
  if (r < 0.45 && G.dna) {
    const sp = G.dna.species;
    fx('spmoment-' + sp, 1500);
    const em = ({ gato:'✨',perro:'🎾',conejo:'❗',zorro:'🍂',panda:'💤',pinguino:'❄️',buho:'👀',axolotl:'🫧',dragon:'💨',fantasma:'👻',fenix:'🔥',kitsune:'✨',unicornio:'🌈',hada:'✨',kraken:'🌊',slime:'💧' })[sp] || '✨';
    particle(em); sfx.sparkle();
  } else if (r < 0.68) {
    fx('loaf', 6000);
    say('🍞 ...');
    toast('🍞 ' + t('ev_loaf'));
  } else if (r < 0.86) {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => { particle('🫧'); tone(700 + i * 120, 0.08, 'sine', 0.08); }, i * 650);
    }
    say(t('ev_hiccup'));
  } else {
    speak();
  }
}

/* ═══════════ RENDER ═══════════ */
let lastSig = '';
function dirtLevel() { return G.higiene > 70 ? 0 : G.higiene > 50 ? 1 : G.higiene > 30 ? 2 : 3; }
function sig() {
  return [G.phase, G.cracks, G.stageIdx, Math.floor(G.growth || 0), dirtLevel(), G.poops - hidePoops,
    G.focus ? (G.focus.kind || 'work') + (G.focus.startedAt || 0) : 0, !!G.sick, isAsleep(G), G.animo < 30, G.animo > 85,
    G.dna && (G.dna.seed + '-' + G.dna.accessory + '-' + (G.dna.cos ? Object.values(G.dna.cos).join('.') : '')), relicUniqueCount(G)].join('|');
}
function renderStageDiorama() {
  if (!stageDiorama || !G) return;
  const i = G.phase === 'pet' ? Math.max(0, Math.min(4, G.stageIdx || 0)) : 0;
  const st = STAGES[i];
  const prev = i === 0 ? 0 : STAGES[i - 1].next;
  const next = st.next == null ? Math.max(prev + 1, G.growth || prev) : st.next;
  const f = G.phase === 'pet' ? Math.max(0, Math.min(1, ((G.growth || 0) - prev) / (next - prev))) : 0;
  const op1 = i >= 1 ? 1 : 0, op2 = i >= 2 ? 1 : 0, op3 = i >= 3 ? 1 : 0, op4 = i >= 4 ? 1 : 0;
  const relicN = relicUniqueCount(G);
  const sprout = (0.72 + f * 0.28).toFixed(2);
  stageDiorama.innerHTML = `
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
    <g class="dio-anchor">
      <ellipse cx="62" cy="194" rx="48" ry="9" fill="#111713" opacity=".32"/>
      <path d="M27 185Q17 152 43 142Q48 116 70 130Q91 116 98 143Q119 157 99 184Z" fill="#416a4e" stroke="#5e4630" stroke-width="4"/>
      <circle cx="48" cy="153" r="5" fill="#6f9a68"/><circle cx="78" cy="142" r="5" fill="#6f9a68"/><circle cx="89" cy="164" r="5" fill="#6f9a68"/>
    </g>
    <g transform="translate(278 199) scale(1 ${sprout})" style="transform-origin:278px 199px">
      <path d="M0 0V-40" stroke="#568b61" stroke-width="5" stroke-linecap="round"/>
      <path d="M0-24Q-22-31-25-47Q-6-45 2-30Z" fill="#5e9c6a" stroke="#3f6849" stroke-width="3"/>
      <path d="M1-14Q20-22 25-38Q7-37-2-21Z" fill="#6aae75" stroke="#3f6849" stroke-width="3"/>
    </g>
    <g opacity="${i === 0 ? 1 : .72}"><path d="M315 195q0-23 15-23t15 23" fill="#b85e4f" stroke="#5e4630" stroke-width="3"/><path d="M314 181q16-13 32 0" fill="#e8d4b2" stroke="#5e4630" stroke-width="3"/></g>
    <g opacity="${op4}"><ellipse cx="235" cy="202" rx="22" ry="6" fill="#18231d"/><path d="M215 197q20-30 40 0" fill="#7e9d68" stroke="#4b6746" stroke-width="3"/></g>
    ${relicN >= 3 ? '<g class="dio-relic-lantern" transform="translate(105 185)"><path d="M0 0v-38" stroke="#59432e" stroke-width="4"/><path d="M-9-39h18l-3 20H-6Z" fill="#f0b94f" stroke="#5e4630" stroke-width="3"/><circle cy="-29" r="6" fill="#fff1a8" opacity=".72"/></g>' : ''}
    ${relicN >= 6 ? '<g class="dio-relic-arch" opacity=".72"><path d="M128 174V94q52-54 104 0v80" fill="none" stroke="#596068" stroke-width="12"/><path d="M128 116q52-55 104 0" fill="none" stroke="#858b90" stroke-width="4"/></g>' : ''}
    ${relicN >= 9 ? '<g class="dio-relic-pool"><ellipse cx="181" cy="218" rx="54" ry="13" fill="#558e9d" stroke="#9bd2d7" stroke-width="3" opacity=".7"/><circle cx="181" cy="214" r="7" fill="#f7e7a8" opacity=".8"/><path d="M148 216q33 10 66 0" fill="none" stroke="#c9f0ef" stroke-width="2" opacity=".7"/></g>' : ''}`;
}
function draw(force, hatch) {
  const s = sig();
  if (!force && s === lastSig) return;
  lastSig = s;
  if (G.phase === 'egg') world.innerHTML = buildEgg(G.cracks, !!(G.focus && G.focus.kind !== 'break'));   // v0.46.1: en sesión, el rescoldo incuba acelerado
  else world.innerHTML = buildCreature(G.dna, G.stageIdx, {
    dirtLvl: dirtLevel(), poops: Math.max(0, G.poops - hidePoops),
    focusing: !!G.focus, mood: G.animo, sick: !!G.sick, sleeping: isAsleep(G),
    focusSeed: (G.focus && G.focus.kind !== 'break') ? G.focus.startedAt : 0,
    inStage: true,
    expr: exprUntil > Date.now() ? exprFx : undefined,
    growth: G.growth
  });
  renderStageDiorama();
  world.classList.toggle('sleeping', isAsleep(G));
  if (hatch) {
    world.classList.remove('hatch'); void world.getBoundingClientRect();
    world.classList.add('hatch');
  }
}
/* Reacción facial temporal en el escenario del popup. */
let exprFx = null, exprUntil = 0;
function react(name, ms) {
  exprFx = name; exprUntil = Date.now() + ms;
  draw(true);
  setTimeout(() => { if (Date.now() >= exprUntil) { exprFx = null; draw(true); } }, ms + 40);
}
function fillColor(v) { return v > 60 ? 'var(--good)' : v > 30 ? 'var(--warn)' : 'var(--bad)'; }
function fmt(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
}
function updateHUD() {
  $('brasas').textContent = Math.floor(G.brasas);
  $('gotasWrap').style.display = (G.gotas || 0) > 0 ? '' : 'none';   // aparece al recoger la primera
  $('gotas').textContent = G.gotas || 0;
  $('btnSound').textContent = G.soundOn ? '🔊' : '🔇';
  if (G.phase === 'egg') {
    $('stagelbl').innerHTML = t('stage_lbl') + ': <b>' + t('egg_word') + '</b>';
    $('cname').textContent = '???';
    $('cmeta').textContent = t('egg_meta');
    updateFocusUI();   // v0.46.2: la incubadora también late
    return;
  }
  const st = STAGES[G.stageIdx];
  $('btnForge').classList.toggle('free-ready', !proActive(G) && G.stageIdx >= 3 && !G.freeRetouchUsed);
  $('stagelbl').innerHTML = t('stage_lbl') + ': <b>' + stName(st.id) + '</b>';
  $('cname').textContent = G.dna.name;
  $('cmeta').textContent = spName(G.dna.species) + ' ' + genderedLabel(G.dna).sym + ' · ' + tmpName(G.dna.temperament) + ' · 💛 ' + bondTitle(G.vinculo);
  [['Hambre', G.hambre], ['Higiene', G.higiene], ['Animo', G.animo], ['Vinculo', G.vinculo], ['Educacion', G.educacion || 0]].forEach(([k, v]) => {
    $('v' + k).textContent = Math.round(v);
    const b = $('b' + k);
    b.style.width = v + '%';
    b.style.background = (k === 'Vinculo' || k === 'Educacion') ? 'var(--amber)' : fillColor(v);
  });
  if (st.next !== null) {
    $('gLbl').textContent = Math.floor(G.growth) + ' / ' + st.next;
    const prev = G.stageIdx === 0 ? 0 : STAGES[G.stageIdx - 1].next;
    $('gFill').style.width = Math.min(100, ((G.growth - prev) / (st.next - prev)) * 100) + '%';
  } else {
    $('gLbl').textContent = t('growth_max');
    $('gFill').style.width = '100%';
  }
  const fb = $('btnFeed');
  if (G.peces > 0) { fb.textContent = '🐟 ' + t('feed_btn_fish', { N: G.peces }); fb.disabled = G.hambre >= 98; }
  else { fb.textContent = '🍎 ' + t('feed_btn'); fb.disabled = G.brasas < 2 || G.hambre >= 98; }
  $('btnMeds').style.display = (G.sick && !G.sickMeds) ? '' : 'none';
  $('btnMeds').disabled = G.brasas < 10;
  $('chkPack').checked = !!G.packMode;
  $('chkPack').disabled = !proActive(G);
  $('packLock').textContent = proActive(G) ? '' : '🔒';
  $('rngSize').value = G.sizePct || 100;
  $('sizeval').textContent = (G.sizePct || 100) + '%';
  if (G.huerto) {
    $('chkGarden').checked = G.huerto.show !== false;
    $('rngGardenOp').value = G.huerto.op || 70;
    $('gardenOpVal').textContent = (G.huerto.op || 70) + '%';
    if (G.phase === 'pet') renderHuerto();
  }
  if (G.phase === 'pet') renderVestidor();
  if (G.focusHud) {
    $('chkFocusHud').checked = G.focusHud.show !== false;
    $('rngFocusOp').value = G.focusHud.op || 85;
    $('focusOpVal').textContent = (G.focusHud.op || 85) + '%';
  }
  $('cntPesca').textContent = G.playsPesca + '/3';
  $('cntOvillo').textContent = G.playsOvillo + '/3';
  if (G.fstats) {
    const days = [];
    for (let i = 0; i < 7; i++) { const d = new Date(); d.setDate(d.getDate() - i); days.push(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()); }
    let n = 0, min = 0;
    days.forEach(k => { const e = G.fstats.days[k]; if (e) { n += e.n; min += e.min; } });
    $('fstatsLbl').textContent = n
      ? t('stats_week', { N: n, M: min, R: (G.streak && G.streak.best) || 1 })
      : t('stats_none');
    const bars = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const e = G.fstats.days[d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()];
      bars.push(e ? e.min : 0);
    }
    const mxb = Math.max(1, ...bars);
    $('fbars').innerHTML = bars.map(v =>
      '<div class="fbar" style="height:' + Math.max(2, Math.round(v / mxb * 26)) + 'px" title="' + v + ' min"></div>').join('');
  }
  renderTodayCompact();
  renderJourney();
  $('btnPesca').disabled = G.playsPesca >= 3;
  $('btnOvillo').disabled = G.playsOvillo >= 3;
  const sc = (G.streak && G.streak.count) || 0;
  $('streakLbl').textContent = sc > 0
    ? t('streak_lbl', { D: sc, B: Math.min(5, Math.max(0, sc - 1)) })
    : t('streak_none');
  updateFocusUI();
}
function updateFocusUI() {
  // v0.46.2: extraído de updateHUD — su early-return de fase huevo dejaba la
  // cuenta atrás congelada en la primera sesión (la incubadora). Esto se
  // ejecuta SIEMPRE, en huevo y en mascota.
  const minValue = String(G.focusMin || 25);
  $('selMin').querySelectorAll('[data-custom]').forEach(o => { if (o.value !== minValue) o.remove(); });
  if (!$('selMin').querySelector('option[value="' + minValue + '"]')) {
    const o = document.createElement('option'); o.value = minValue; o.textContent = minValue + ' min'; o.dataset.custom = '1'; $('selMin').appendChild(o);
  }
  $('selMin').value = minValue;
  $('selMin').disabled = !!G.focus;
  $('focusGoal').disabled = !!G.focus;
  if (document.activeElement !== $('focusGoal')) $('focusGoal').value = G.focus ? (G.focus.goal || '') : (G.focusGoal || '');
  renderPresets();
  renderRituals();
  $('btnBreak').style.display = G.focus ? 'none' : '';
  if (G.focus) {
    $('ftimer').textContent = fmt(G.focus.endsAt - Date.now());
    $('btnFocus').style.display = 'none';
    $('btnFocusCancel').style.display = '';
  } else {
    $('ftimer').textContent = fmt((G.focusMin || 25) * 60000);
    $('btnFocus').style.display = '';
    $('btnFocusCancel').style.display = 'none';
  }
}
/* ── Pestañas (v0.35): 4 secciones, estado en G.uiTab ── */
function goTab(name) {
  if (G && G.phase === 'egg' && name !== 'foco') name = 'foco';   // v0.47.1
  if (name === 'mas') setTimeout(renderDnd, 0);
  document.body.classList.remove('tab-foco', 'tab-jugar', 'tab-col', 'tab-mas');
  document.body.classList.add('tab-' + name);
  document.querySelectorAll('.tab').forEach(b => {
    const active = b.getAttribute('data-goto') === name;
    b.classList.toggle('on', active);
    b.setAttribute('aria-current', active ? 'page' : 'false');
  });
  if (G && G.uiTab !== name) { G.uiTab = name; persist(); }
}
document.querySelectorAll('.tab').forEach(b =>
  b.addEventListener('click', () => goTab(b.getAttribute('data-goto'))));
$('trialMini').addEventListener('click', () => { goTab('mas'); $('probox').scrollIntoView({ behavior: 'smooth' }); });

/* ── Ambiente del escenario: día / atardecer / noche según hora local ── */
function stageAmbient() {
  const h = new Date().getHours();
  const amb = (h >= 7 && h < 19) ? 'amb-day' : (h >= 19 && h < 22) ? 'amb-dusk' : 'amb-night';
  const st = $('stage');
  if (!st.classList.contains(amb)) {
    st.classList.remove('amb-day', 'amb-dusk', 'amb-night');
    st.classList.add(amb);
  }
}

function syncPhaseUI() {
  const pet = G.phase === 'pet';
  ['bars', 'growth', 'actions', 'minis', 'huertoBox', 'screenbox', 'visitbox', 'craftbox', 'cosBox', 'logrosBox', 'memoryBox', 'dailybox', 'savebox'].forEach(id => $(id).style.display = pet ? '' : 'none');
  if (pet) { renderHuerto(true); renderVestidor(true); }
  $('tabbar').style.display = pet ? '' : 'none';
  $('focusbox').style.display = '';   // limpia el display:none inline del HTML (v0.46) — sin esto la incubadora no aparece en la primera instalación
  if (!pet) goTab('foco');            // v0.47.1: en huevo, forzar la pestaña de la incubadora (el 2º huevo llegaba desde 'col' con el tabbar oculto → bloqueo)
  document.body.classList.toggle('egg', !pet);
  if (pet) renderDaily();
  if (pet) renderCraft();
  $('btnForge').style.display = pet ? '' : 'none';
  const h = $('hint');
  if (pet) { h.style.display = 'none'; }
  else { h.style.display = ''; h.textContent = t('hint_egg'); }
}
function drainToasts() {
  while (G.pendingToasts && G.pendingToasts.length) {
    const m = G.pendingToasts.shift();
    if (m && m.s && m.s.SID) { m.s.S = stName(m.s.SID); }
    toast(typeof m === 'string' ? m : t(m.k, m.s || {}));
  }
}
function drainReactions() {
  if (!Array.isArray(G.pendingReactions) || !G.pendingReactions.length || G.phase !== 'pet') return;
  const reactions = G.pendingReactions.splice(0);
  const strongest = reactions.includes('expedition_ready') ? 'expedition_ready' : reactions[reactions.length - 1];
  stageEl.classList.remove('context-celebrate'); void stageEl.getBoundingClientRect(); stageEl.classList.add('context-celebrate');
  if (strongest === 'expedition_ready') { sfx.fanfare(); fx('stretch', 1000); ['🗺️','✨','🧭'].forEach((x,i) => setTimeout(() => particle(x), i*130)); say(t('reaction_expedition')); }
  else if (strongest === 'streak_saved') { sfx.sparkle(); react('happy', 1600); particle('🛡️'); say(t('reaction_streak_saved')); }
  else if (strongest === 'streak_record') { sfx.chime(); fx('happyhop', 800); particle('🔥'); say(t('reaction_streak_record')); }
  else { sfx.sparkle(); react('happy', 1500); ['🎯','✨'].forEach((x,i) => setTimeout(() => particle(x), i*130)); say(t('reaction_mission')); }
}
/* BUG-1: cada contexto de popup firma sus escrituras; si el estado cambia
   desde OTRO contexto (pop-out, otra ventana, el SW), esta instancia lo
   adopta en vez de machacarlo con su copia obsoleta. */
$('witsLbl').addEventListener('click', () => {
  const wits = G.wits || [];
  const bank = duelBank((G.uiLang || 'es').slice(0, 2));
  openModal('⚔️ ' + t('wit_title'));
  mbody.innerHTML = wits.length
    ? wits.map(id => bank[id]).filter(Boolean)
        .map(pr => '<div class="witrow"><div class="wp">«' + pr.p + '»</div><div class="wr">→ ' + pr.r + '</div></div>').join('')
    : '<div class="mnote">' + t('wit_none') + '</div>';
});

/* ── Export/import de guardado (local-first). El reloj del trial viaja
   dentro del archivo y NUNCA rejuvenece al importar: se conserva el más
   antiguo entre archivo e instalación (anti-reset de los 5 días). ── */
$('btnExport').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(G, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'slimeforge-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast(t('exp_ok'));
});
$('btnImport').addEventListener('click', () => $('fileImport').click());
$('fileImport').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  try {
    if (f.size > 1024 * 1024) throw new Error('too_large');
    const st = JSON.parse(await f.text());
    if (!confirm(t('imp_confirm'))) return;
    G = await importState(st, G);
    location.reload();
  } catch (err) { toast(t('imp_bad')); }
});

const EGG_COST = 100;   // precio del huevo de la Forja — ÚNICA fuente de verdad (UI vía $N)
const WRITER_ID = 'w' + Math.random().toString(36).slice(2, 10);
async function persist() {
  const snapshot = JSON.parse(JSON.stringify(G));
  persistQueue = persistQueue.then(async () => {
    const patch = {};
    const base = {};
    const before = persistedState || {};
    Object.keys(snapshot).forEach(key => {
      if (key === 'rev' || key === 'schema' || key === 'writerId') return;
      if (JSON.stringify(snapshot[key]) !== JSON.stringify(before[key])) { patch[key] = snapshot[key]; base[key] = before[key]; }
    });
    if (!Object.keys(patch).length) return;
    const res = await chrome.runtime.sendMessage({ type: 'sf-state-patch', patch, base, writerId: WRITER_ID });
    if (!res || !res.ok || !res.state) throw new Error('state_commit_failed');
    persistedState = res.state;
  }).catch(() => {}); // El siguiente cambio vuelve a intentar el parche; nunca pisa el estado completo.
  return persistQueue;
}
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || !changes.sf_state || !G) return;
  const nv = changes.sf_state.newValue;
  if (!nv || nv.writerId === WRITER_ID) return;
  G = nv;
  lastSig = '';
  syncPhaseUI(); renderPro(); renderPets(); renderProjects(); renderShield(); applyProgressiveUI(); draw(true); updateHUD(); drainToasts();
});
function evolveFx(stageId) {
  if (!stageId) return;
  sfx.sparkle();
  toast(t('evolved', { N: G.dna.name, S: stName(stageId) }));
  particle('✨'); particle('✨', stageEl.clientWidth/2 - 40, 110); particle('✨', stageEl.clientWidth/2 + 30, 130);
  draw(true, true);
}

/* ═══════════ SECUENCIA CÓMICA DEL POPÓ ═══════════ */
let poopAnimating = false;
function poopMsgs() {
  const n = G.dna ? G.dna.name : '???';
  return [t('poop_1', { N: n }), t('poop_2', { N: n }), t('poop_3', { N: n }), t('poop_4', { N: n })];
}
function playPoopShow() {
  if (poopAnimating) return;
  poopAnimating = true;
  hidePoops = 1;
  draw(true);
  world.classList.add('pooping');
  playPoot();
  setTimeout(() => {
    world.classList.remove('pooping');
    hidePoops = 0; poopAnimating = false;
    draw(true);
    const p = world.querySelector('[data-action="poop"]');
    if (p) p.classList.add('poop-pop');
    particle('💨', stageEl.clientWidth * 0.30, stageEl.clientHeight - 92);
    toast(poopMsgs()[Math.floor(Math.random() * 4)]);
    updateHUD();
  }, 900);
}

/* ═══════════ INTERACCIÓN EN EL ESCENARIO ═══════════ */
let petCd = 0;
function doPet(px, py) {
  if (Date.now() < petCd) return;
  petCd = Date.now() + 1500;
  wakeIfAsleep();
  G.animo = Math.min(100, G.animo + 4);
  G.vinculo = Math.min(100, G.vinculo + 1);
  recordMissionProgress(G, 'care', 1);
  if (G.sick && G.sickMeds) {
    G.sickMimos = (G.sickMimos || 0) + 1;
    if (G.sickMimos >= 3) {
      G.sick = false; G.sickMeds = false; G.sickMimos = 0; G.neglectMs = 0;
      G.animo = Math.min(100, G.animo + 15);
      sfx.sparkle();
      toast('✨ ' + t('cure_done', { N: G.dna.name }));
      say(t('say_cured'));
    } else {
      toast('🤍 ' + t('cure_pet', { N: G.sickMimos }));
    }
  }
  if (!G.lastPetGrow || Date.now() - G.lastPetGrow >= 5 * 60 * 1000) {
    G.lastPetGrow = Date.now();          // el cariño es infinito; el growth por caricia, cada 5 min
  }
  sfx.pet(); fx('happyhop', 500);
  if (Math.random() < 0.35) speak();
  particle('🤍', px, py);
  draw(); updateHUD(); persist();
}
world.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const act = el.getAttribute('data-action');
  const r = stageEl.getBoundingClientRect();
  if (act === 'egg') {
    // v0.46 (pomodoro-first): tocar el huevo ya no lo abre — lo agrieta y
    // enseña la mecánica real: eclosiona al completar la primera sesión de
    // foco (la materialización vive en logic.js/applyElapsed).
    G.cracks = Math.min(2, (G.cracks || 0) + 1);
    sfx.knock();
    const eg = $('eggG');
    if (eg) { eg.classList.remove('wobble'); void eg.getBoundingClientRect(); eg.classList.add('wobble'); }
    if (G.cracks >= 2) toast('\u{1F525} ' + t('egg_focus_hint'));
    draw(true); persist();
  }
  if (act === 'pet') { doPet(e.clientX - r.left - 10, e.clientY - r.top - 20); if (!isAsleep(G)) react('love', 2200); }
  if (act === 'poop') {
    G.poops = Math.max(0, G.poops - 1);
    G.vinculo = Math.min(100, G.vinculo + 2);
    G.higiene = Math.min(100, G.higiene + 5);
    if (G.poopBornAt && Date.now() - G.poopBornAt < 15 * 60 * 1000) {
      G.educacion = Math.min(100, (G.educacion || 30) + 2);
    }
    sfx.whoosh();
    particle('✨', 55, 190);
    toast(t('clean'));
    draw(true); updateHUD(); persist();
  }
});
function offerRoam(after) {
  // CTA post-eclosión (v0.46.2): ofrece el paseo por las páginas nada más
  // nacer — un clic concede el permiso; "quizá luego" lo deja para chkAlways.
  if (G.roamAsked) { if (after) after(); return; }
  const ov = document.createElement('div');
  ov.className = 'ob-ov';
  const card = document.createElement('div');
  card.className = 'ob-card';
  card.innerHTML = '<div class="ob-egg">\u{1F43E}</div><h2>' + esc(t('hatch_roam_t', { NAME: G.dna.name })) + '</h2><p>' + t('hatch_roam_d') + '</p>' +
    '<button class="primary" id="roamYes">' + t('roam_yes') + '</button>' +
    '<button id="roamLater" style="margin-top:8px;background:transparent;border:none;color:inherit;opacity:.65;cursor:pointer">' + t('roam_later') + '</button>';
  ov.appendChild(card);
  card.querySelector('#roamYes').addEventListener('click', async () => {
    G.roamAsked = true; await persist();
    const ok = await enableRoam();
    if (ok) $('chkAlways').checked = true;
    ov.remove();
    if (after) after();
  });
  card.querySelector('#roamLater').addEventListener('click', async () => { G.roamAsked = true; await persist(); ov.remove(); if (after) after(); });
  document.body.appendChild(ov);
}
function celebrateHatch() {
  // v0.46: la eclosión ocurre en applyElapsed (logic.js) al completar el
  // primer foco — aquí solo la celebración visual/sonora al detectarla.
  if (document.querySelector('.birth-ov')) return;
  sfx.fanfare();
  syncPhaseUI();
  const gl0 = genderedLabel(G.dna);
  const esUI = (G.uiLang || 'es') === 'es';
  toast('🎉 ' + t('born', { NAME: G.dna.name, ART: esUI ? gl0.art : '', LABEL: esUI ? gl0.label : spName(G.dna.species), TEMPADJ: esUI ? tempAdj(G.dna) : tmpName(G.dna.temperament) }));
  if (RARITY[G.dna.species]) {
    const rk = RARITY[G.dna.species] === 'raro' ? 'rarity_rare' : RARITY[G.dna.species] === 'épico' ? 'rarity_epic' : 'rarity_legendary';
    setTimeout(() => { toast('🌟 ' + t('rarity', { R: t(rk) })); sfx.sparkle(); }, 1200);
  }
  draw(true, true); updateHUD(); renderBestiario();
  const ov = document.createElement('div');
  ov.className = 'birth-ov';
  const meta = spName(G.dna.species) + ' · ' + stName(STAGES[0].id);
  ov.innerHTML = '<div class="birth-card"><div class="birth-sparks">✦ 🔥 ✦</div>' +
    '<svg class="birth-creature" viewBox="0 0 200 200">' + buildCreature(G.dna, 0, { dirtLvl:0, poops:0, focusing:false, mood:95, growth:G.growth, scaleOverride:.62 }) + '</svg>' +
    '<h2>' + esc(t('birth_title', { NAME:G.dna.name })) + '</h2><div class="birth-meta">' + esc(meta) + '</div>' +
    '<div class="birth-copy">' + esc(t('birth_copy')) + '</div><div class="birth-progress">' + esc(t('birth_progress', { N:Math.floor(G.growth || 0), T:STAGES[0].next })) + '</div>' +
    '<button class="primary" id="birthMeet">' + esc(t('birth_meet', { NAME:G.dna.name })) + '</button></div>';
  document.body.appendChild(ov);
  ov.querySelector('#birthMeet').addEventListener('click', async () => {
    G.pendingHatch = false;
    await persist();
    ov.remove();
    offerRoam(() => { if (G.pendingFocusReview) setTimeout(showFocusReview, 250); });
  });
}

/* ═══════════ ACCIONES ═══════════ */
$('btnFeed').addEventListener('click', () => {
  if (G.hambre >= 98) return;
  wakeIfAsleep();
  react('happy', 2200);
  if (G.peces > 0) {
    G.peces--; G.hambre = Math.min(100, G.hambre + 60); G.animo = Math.min(100, G.animo + 4);
    sfx.eat(); fx('munch', 850);
    particle('🐟'); toast(t('feed_fish'));
  } else {
    if (G.brasas < 2) return;
    G.brasas -= 2; G.hambre = Math.min(100, G.hambre + 45); G.animo = Math.min(100, G.animo + 3);
    sfx.eat(); fx('munch', 850);
    particle('🍎'); toast(t('feed_apple'));
  }
  if (G.daily) { G.daily.fed = true; checkDaily(); }
  recordMissionProgress(G, 'care', 1);
  G.digestBoost = true;
  draw(); updateHUD(); persist();
});
$('btnShower').addEventListener('click', () => {
  const wasDirty = G.higiene < 50;
  sfx.shower();
  const r = document.createElement('div');
  r.className = 'rain'; stageEl.appendChild(r);
  const showerMs = (G.tools && G.tools.ducha) ? 600 : 2200;
  setTimeout(() => {
    r.remove();
    G.higiene = 100; G.animo = Math.min(100, G.animo + 4);
    if (wasDirty) {
      G.educacion = Math.min(100, (G.educacion || 30) + 1);
      recordMissionProgress(G, 'care', 1);
    }
    fx('wiggle', 650);
    toast(t('shower_done'));
    draw(true); updateHUD(); persist();
  }, showerMs);
});
$('btnPet').addEventListener('click', () => doPet());
$('btnSound').addEventListener('click', () => { G.soundOn = !G.soundOn; updateHUD(); persist(); });
$('btnMeds').addEventListener('click', () => {
  if (!G.sick || G.sickMeds || G.brasas < 10) return;
  G.brasas -= 10;
  G.sickMeds = true;
  toast(t('cure_meds'));
  say(t('say_meds'));
  updateHUD(); persist();
});

/* ═══ TALLER (crafteo · GDD §9) ═══ */
const TOOLS = [
  { id: 'ducha',    emoji: '🚿', nm: () => t('tool_ducha'),    cost: { escama: 5, hilo: 2 },              desc: () => t('tool_ducha_d') },
  { id: 'cana',     emoji: '🎣', nm: () => t('tool_cana'),     cost: { escama: 8 },                       desc: () => t('tool_cana_d') },
  { id: 'ovillo',   emoji: '🧶', nm: () => t('tool_ovillo'),   cost: { hilo: 6 },                         desc: () => t('tool_ovillo_d') },
  { id: 'comedero', emoji: '🛢️', nm: () => t('tool_comedero'), cost: { escama: 4, hilo: 4, calcetin: 2 }, desc: () => t('tool_comedero_d') },
  { id: 'regadera', emoji: '🪣', nm: () => t('tool_regadera'), cost: { petalo: 6, hilo: 2 },              desc: () => t('tool_regadera_d') }
];
const MAT_EMOJI = { escama: '🐟', hilo: '🧵', calcetin: '🧦', petalo: '🌸' };
function costTxt(cost) { return Object.entries(cost).map(([m, n]) => n + MAT_EMOJI[m]).join(' + '); }
function canCraft(cost) { return Object.entries(cost).every(([m, n]) => (G.mats[m] || 0) >= n); }
function renderCraft() {
  if (!G.mats) return;
  $('matLbl').textContent = t('mat_lbl', { E: G.mats.escama || 0, H: G.mats.hilo || 0, C: G.mats.calcetin || 0, P: G.mats.petalo || 0 });
  $('craftList').innerHTML = TOOLS.map(t => {
    const owned = G.tools && G.tools[t.id];
    const btn = owned ? '<span class="done">✓ ' + tI18n('craft_owned') + '</span>'
      : '<button data-craft="' + t.id + '"' + (canCraft(t.cost) ? '' : ' disabled') + '>' + costTxt(t.cost) + '</button>';
    return '<div class="craftrow"><span>' + t.emoji + '</span><span class="nm"><b>' + t.nm() + '</b><small>' + t.desc() + '</small></span>' + btn + '</div>';
  }).join('');
}
const tI18n = t;
$('craftList').addEventListener('click', e => {
  const b = e.target.closest('[data-craft]');
  if (!b) return;
  const t = TOOLS.find(x => x.id === b.getAttribute('data-craft'));
  if (!t || !canCraft(t.cost) || (G.tools && G.tools[t.id])) return;
  Object.entries(t.cost).forEach(([m, n]) => G.mats[m] -= n);
  G.tools[t.id] = true;
  sfx.sparkle();
  toast(tI18n('craft_done', { N: t.nm() }));
  renderCraft(); updateHUD(); persist();
});

/* ═══ HUERTO (fase 2 · GDD §24.9) ═══
   4 parcelas · moneda: gotas 💧 · 3 etapas visuales, un riego por etapa.
   La simulación vive en tickHuerto (logic.js); aquí solo UI + huertoOp. */
const FOOD_FX = { baya: { hambre: 30, animo: 4 }, zanahoria: { hambre: 55, animo: 0 } };
function fmtH(ms) {
  const m = Math.max(1, Math.ceil(ms / 60000));
  return m >= 60 ? Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') + ' m' : m + ' m';
}
let lastHSig = '';
function huertoSig() {
  return JSON.stringify([G.huerto && G.huerto.plots, G.gotas || 0, G.despensa, G.tools && G.tools.regadera, G.hambre >= 98]);
}
function renderHuerto(force) {
  if (!G || !G.huerto) return;
  const sig = huertoSig();
  const rebuild = force || sig !== lastHSig;
  lastHSig = sig;
  $('huertoGotas').textContent = t('huerto_gotas_lbl', { N: G.gotas || 0 });
  if (rebuild) {
    $('huertoPlots').innerHTML = G.huerto.plots.map((p, i) => {
      const cls = !p ? 'empty' : p.done ? 'ready' : (!p.w ? 'thirsty' : 'growing');
      return '<div class="hplot ' + cls + '" data-plot="' + i + '">' +
        '<svg viewBox="0 0 70 70" width="58" height="58">' + buildPlot(p) + '</svg>' +
        '<div class="hst" data-hst="' + i + '"></div></div>';
    }).join('');
    const d = G.despensa || {};
    const rows = ['baya', 'zanahoria'].filter(k => (d[k] || 0) > 0).map(k =>
      '<div class="craftrow"><span>' + SEEDS[k].emoji + '</span><span class="nm"><b>' + t('seed_' + k) + '</b> ×' + d[k] +
      '<small>' + t('seed_' + k + '_fx') + '</small></span>' +
      '<button data-eat="' + k + '"' + (G.hambre >= 98 ? ' disabled' : '') + '>' + t('eat_btn') + '</button></div>').join('');
    $('despLbl').textContent = rows ? t('despensa_lbl') : '';
    $('despList').innerHTML = rows;
  }
  // etiquetas de estado por parcela (se refrescan cada tick, sin reconstruir)
  G.huerto.plots.forEach((p, i) => {
    const el = document.querySelector('[data-hst="' + i + '"]');
    if (!el) return;
    if (!p) el.textContent = t('huerto_empty');
    else if (p.done) el.textContent = t('huerto_ready');
    else if (!p.w) el.textContent = t('huerto_need_water');
    else el.textContent = t('huerto_growing', { S: p.st + 1, T: fmtH(seedStageMs(p.seed) - (p.ms || 0)) });
  });
}
$('huertoPlots').addEventListener('click', e => {
  const cell = e.target.closest('[data-plot]');
  if (!cell) return;
  const i = parseInt(cell.getAttribute('data-plot'), 10);
  const p = G.huerto.plots[i];
  if (!p) return openSeedPicker(i);
  if (p.done) {
    const r = huertoOp(G, 'harvest', i);
    if (r) {
      sfx.sparkle(); particle(SEEDS[r.seed].emoji);
      toast('✨ ' + t('huerto_harvested', { N: r.n, S: r.kind === 'mat' ? '🌸' : SEEDS[r.seed].emoji }));
      renderCraft(); renderHuerto(true); updateHUD(); persist();
    }
    return;
  }
  if (!p.w) {
    const r = huertoOp(G, 'water', i);
    if (r) { particle('💧'); toast('💧 ' + t('huerto_watered')); renderHuerto(true); persist(); }
  }
});
function openSeedPicker(i) {
  openModal(t('h_huerto'));
  mbody.innerHTML = '<div class="mnote" style="margin:0 0 8px">' + t('huerto_pick', { N: G.gotas || 0 }) + '</div>' +
    Object.keys(SEEDS).map(k => {
      const s = SEEDS[k];
      const can = (G.gotas || 0) >= s.cost;
      return '<div class="craftrow"><span>' + s.emoji + '</span><span class="nm"><b>' + t('seed_' + k) + '</b><small>' + t('seed_' + k + '_d') + '</small></span>' +
        '<button data-seed="' + k + '"' + (can ? '' : ' disabled') + '>' + s.cost + ' 💧</button></div>';
    }).join('');
  mbody.querySelectorAll('[data-seed]').forEach(b => b.addEventListener('click', () => {
    const r = huertoOp(G, 'plant', i, b.getAttribute('data-seed'));
    if (!r) { toast(t('huerto_no_gotas')); return; }
    sfx.sparkle(); closeModal();
    toast('🌱 ' + t('huerto_planted', { S: t('seed_' + r.seed) }));
    renderHuerto(true); updateHUD(); persist();
  }));
}
$('despList').addEventListener('click', e => {
  const b = e.target.closest('[data-eat]');
  if (!b || G.hambre >= 98) return;
  const k = b.getAttribute('data-eat');
  if (!G.despensa || (G.despensa[k] || 0) < 1) return;
  wakeIfAsleep();
  G.despensa[k]--;
  const fx2 = FOOD_FX[k];
  G.hambre = Math.min(100, G.hambre + fx2.hambre);
  G.animo = Math.min(100, G.animo + fx2.animo);
  if (G.daily) { G.daily.fed = true; checkDaily(); }
  G.digestBoost = true;
  react('happy', 2200);
  sfx.eat(); fx('munch', 850);
  particle(SEEDS[k].emoji);
  toast(t('huerto_eat', { S: SEEDS[k].emoji }));
  draw(); renderHuerto(true); updateHUD(); persist();
});
/* ═══ VESTIDOR (cosméticos v0.40) ═══
   Piezas por hito (progreso visible) + piezas Pro. Se equipan por slot
   en dna.cos y viajan con la criatura (Reserva/export). El motor pinta;
   aquí solo se valida el desbloqueo con cosUnlocked. */
let lastCosSig = '';
function cosSig() {
  return JSON.stringify([G.dna && G.dna.cos, proActive(G),
    Object.keys(COS).map(id => cosUnlocked(G, id) ? 1 : 0).join(''), G.uiLang]);
}
function renderVestidor(force) {
  if (!G || G.phase !== 'pet' || !G.dna) { $('cosSlots').innerHTML = ''; lastCosSig = ''; return; }
  const sig = cosSig();
  if (!force && sig === lastCosSig) return;
  lastCosSig = sig;
  if (!G.dna.cos) G.dna.cos = {};
  $('cosSlots').innerHTML = COS_SLOTS.map(slot => {
    const pieces = Object.keys(COS).filter(id => COS[id].slot === slot);
    const chips = ['<button class="coschip' + (!G.dna.cos[slot] ? ' eq' : '') + '" data-cos="" data-slot="' + slot + '">∅</button>']
      .concat(pieces.map(id => {
        const unlocked = cosUnlocked(G, id);
        const eq = G.dna.cos[slot] === id;
        const pr = cosProgress(G, id);
        const sub = unlocked ? t('cosn_' + id)
          : (COS[id].pro ? '🔒 PRO' : '🔒 ' + t('cosc_' + COS[id].cond) + (pr ? ' · ' + Math.min(pr[0], pr[1]) + '/' + pr[1] : ''));
        const icon = COS[id].hex ? '<span class="cosdot" style="background:' + COS[id].hex + '"></span>' : COS[id].e;
        return '<button class="coschip' + (eq ? ' eq' : '') + (unlocked ? '' : ' lk') + '" data-cos="' + id + '" data-slot="' + slot + '" title="' + sub.replace(/"/g, '&quot;') + '">' +
          icon + '<small>' + sub + '</small></button>';
      })).join('');
    return '<div class="cosrow"><span class="coslbl">' + t('cos_slot_' + slot) + '</span><div class="coschips">' + chips + '</div></div>';
  }).join('');
  renderLogros();
}
function renderLogros() {
  if (!G || G.phase !== 'pet') { $('logrosList').innerHTML = ''; return; }
  const frees = Object.keys(COS).filter(id => !COS[id].pro);
  $('logrosList').innerHTML = frees.map(id => {
    const done = cosUnlocked(G, id);
    const pr = cosProgress(G, id) || [done ? 1 : 0, 1];
    const pct = Math.round(Math.min(1, pr[0] / pr[1]) * 100);
    return '<div class="logrow' + (done ? ' done' : '') + '">' +
      '<span class="loge">' + (done ? '✅' : COS[id].e) + '</span>' +
      '<div class="logtxt"><b>' + t('cosc_' + COS[id].cond) + '</b>' +
      '<div class="logbar"><i style="width:' + pct + '%"></i></div>' +
      '<small>' + Math.min(pr[0], pr[1]) + '/' + pr[1] + ' · 🎁 ' + t('cosn_' + id) + '</small></div></div>';
  }).join('');
}
$('cosSlots').addEventListener('click', e => {
  const b = e.target.closest('[data-slot]');
  if (!b || !G.dna) return;
  const slot = b.getAttribute('data-slot');
  const id = b.getAttribute('data-cos');
  if (!G.dna.cos) G.dna.cos = {};
  if (!id) { delete G.dna.cos[slot]; }
  else {
    if (!cosUnlocked(G, id)) {
      const d = COS[id];
      toast(d.pro ? '🔒 ' + t('cos_pro_lock') + (trialStatus(G).remaining > 0 ? '' : ' ' + t('pro_from')) : '🔒 ' + t('cosc_' + d.cond));
      return;
    }
    if (G.dna.cos[slot] === id) delete G.dna.cos[slot];   // segundo clic: quitar
    else G.dna.cos[slot] = id;
  }
  sfx.sparkle();
  renderVestidor(true);
  draw(true); persist();
});

$('chkGarden').addEventListener('change', e => {
  if (!G.huerto) return;
  G.huerto.show = e.target.checked;
  persist();
});
$('rngGardenOp').addEventListener('input', e => {
  if (!G.huerto) return;
  G.huerto.op = parseInt(e.target.value, 10);
  $('gardenOpVal').textContent = G.huerto.op + '%';
  persist();   // la página lo aplica al instante vía storage.onChanged
});
$('chkFocusHud').addEventListener('change', e => {
  if (!G.focusHud) G.focusHud = { op: 85, show: true };
  G.focusHud.show = e.target.checked;
  persist();
});
$('rngFocusOp').addEventListener('input', e => {
  if (!G.focusHud) G.focusHud = { op: 85, show: true };
  G.focusHud.op = parseInt(e.target.value, 10);
  $('focusOpVal').textContent = G.focusHud.op + '%';
  persist();   // la página lo aplica al instante vía storage.onChanged
});

$('cname').addEventListener('click', () => {
  if (G.phase !== 'pet') return;
  const n = prompt(t('rename_prompt'), G.dna.name);
  if (n && n.trim() && n.trim().length <= 16) {
    G.dna.name = n.trim();
    nanoSession = null;
    updateHUD(); persist();
    toast(t('renamed', { N: G.dna.name }));
  }
});
$('chkPack').addEventListener('change', e => {
  if (!proActive(G)) {
    e.target.checked = false;
    toast(t('pack_lock'));
    return;
  }
  G.packMode = e.target.checked;
  persist();
  toast(G.packMode ? '🐾 ' + t('pack_on') : t('pack_off'));
});
$('rngSize').addEventListener('input', e => {
  G.sizePct = parseInt(e.target.value, 10);
  $('sizeval').textContent = G.sizePct + '%';
  const mini = document.querySelector('[data-psize="a"]');
  if (mini) { mini.value = G.sizePct; mini.title = t('lbl_size') + ' ' + G.sizePct + '%'; }
  persist();   // la página lo aplica al instante vía storage.onChanged
});

/* ═══════════ SESIÓN DE FOCO (sobrevive al popup) ═══════════ */
function renderPresets() {
  const box = $('fpresets');
  if (!box) return;
  if (!box.childElementCount) {
    [15, 25, 45, 60].forEach(m => {
      const b = document.createElement('button');
      b.textContent = m + '\u2032';
      b.dataset.min = m;
      b.addEventListener('click', () => {
        if (G.focus) return;
        G.focusMin = m;
        $('ftimer').textContent = String(m).padStart(2, '0') + ':00';
        renderPresets(); persist();
      });
      box.appendChild(b);
    });
  }
  const cur = G.focusMin || 25;
  box.querySelectorAll('button').forEach(b => {
    b.classList.toggle('on', +b.dataset.min === cur);
    b.disabled = !!G.focus;
  });
}
function renderRituals() {
  const sel = $('selRitual'); if (!sel) return;
  const current = sel.value;
  const visible = proActive(G) ? (G.rituals || []).slice(0, 8) : (G.rituals || []).slice(0, 1);
  sel.innerHTML = '<option value="">' + esc(t('ritual_quick')) + '</option>' + visible.map(r => '<option value="' + esc(r.id) + '">' + esc(r.name) + ' · ' + r.min + '′</option>').join('');
  sel.value = visible.some(r => r.id === (G.activeRitualId || current)) ? (G.activeRitualId || current) : '';
  if (!sel.value && G.activeRitualId) G.activeRitualId = '';
  sel.disabled = !!G.focus;
}
$('selRitual').addEventListener('change', e => {
  const r = (G.rituals || []).find(x => x.id === e.target.value);
  G.activeRitualId = r ? r.id : '';
  if (r) { G.focusMin = r.min; $('selMin').value = String(r.min); }
  updateFocusUI(); persist();
});
$('btnRitual').addEventListener('click', () => {
  const rituals = G.rituals || [];
  let r = rituals.find(x => x.id === G.activeRitualId) || (!proActive(G) ? rituals[0] : null);
  if (!r) r = { id: 'r' + Date.now().toString(36), name: '', min: G.focusMin || 25, breakMin: 5, goalRequired: false, projectId: G.activeProjectId || '' };
  openModal(t('ritual_title'));
  mbody.innerHTML = '<label class="fieldlbl">' + esc(t('ritual_name')) + '<input id="ritName" maxlength="28" value="' + esc(r.name) + '"></label>' +
    '<div class="mrow"><label class="fieldlbl">' + esc(t('ritual_focus')) + '<input id="ritMin" type="number" min="5" max="180" value="' + r.min + '"></label>' +
    '<label class="fieldlbl">' + esc(t('ritual_break')) + '<input id="ritBreak" type="number" min="1" max="60" value="' + r.breakMin + '"></label></div>' +
    '<label class="demolbl"><input id="ritGoal" type="checkbox"' + (r.goalRequired ? ' checked' : '') + '> ' + esc(t('ritual_goal_req')) + '</label>' +
    '<label class="fieldlbl">' + esc(t('project_active')) + '<select id="ritProject"><option value="">' + esc(t('project_none')) + '</option>' + (proActive(G)?(G.projects||[]).slice(0,12):(G.projects||[]).slice(0,3)).map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name)+'</option>').join('') + '</select></label>' +
    (!proActive(G)?'<div class="mnote pro-split">'+esc(t('ritual_pro_note'))+' <span class="pro-tag">PRO</span></div>':'') +
    '<button class="primary" id="ritSave" style="margin-top:10px">' + esc(t('save_btn')) + '</button>';
  $('ritProject').value = r.projectId || '';
  $('ritSave').addEventListener('click', () => {
    r.name = $('ritName').value.trim().slice(0, 28) || t('ritual_default');
    r.min = Math.max(5, Math.min(180, parseInt($('ritMin').value, 10) || 25));
    r.breakMin = Math.max(1, Math.min(60, parseInt($('ritBreak').value, 10) || 5));
    r.goalRequired = $('ritGoal').checked;
    r.projectId = $('ritProject').value;
    const idx = rituals.findIndex(x => x.id === r.id);
    if (idx >= 0) rituals[idx] = r; else if (proActive(G) || rituals.length === 0) rituals.push(r); else rituals[0] = r;
    // En Free solo se edita el primer ritual; los demás se conservan
    // pausados para reaparecer intactos al reactivar PRO.
    G.rituals = rituals.slice(0, 8); G.activeRitualId = r.id; G.focusMin = r.min;
    renderRituals(); updateFocusUI(); persist(); closeModal();
  });
});
$('focusGoal').addEventListener('input', e => { if (!G.focus) G.focusGoal = e.target.value.slice(0, 120); });
$('focusGoal').addEventListener('change', () => persist());
$('btnGoalPlan').addEventListener('click', async () => {
  const goal = $('focusGoal').value.trim();
  if (!goal) { $('focusGoal').focus(); return; }
  const out = $('goalPlan'); out.style.display = ''; out.textContent = t('goal_planning');
  const line = await nanoLine('Divide este objetivo en una secuencia muy breve y accionable, en una sola frase: ' + goal);
  out.textContent = line || t('goal_plan_fallback');
});

function renderTodayCompact() {
  const e = G.fstats && G.fstats.days && G.fstats.days[dayKey()];
  const done = (G.focusHistory || []).filter(h => new Date(h.at).toDateString() === new Date().toDateString() && h.result === 'done').length;
  $('fstatsLbl').textContent = e ? t('today_summary', { N: e.n, M: e.min, D: done }) : t('today_empty');
}
function openTodaySummary() {
  openModal(t('today_title'));
  const seven = (G.focusHistory || []).slice(-20).reverse();
  mbody.innerHTML = seven.length ? '<div class="memory-list">' + seven.map(h => '<div class="memory-item">' + esc(h.goal || t('goal_none')) + '<small>' + new Date(h.at).toLocaleString() + ' · ' + h.minutes + ' min · ' + esc(t('result_' + h.result)) + '</small></div>').join('') + '</div>' : '<div class="mnote">' + esc(t('stats_none')) + '</div>';
}
$('fstatsLbl').addEventListener('click', openTodaySummary);
$('fstatsLbl').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openTodaySummary(); });
function showFocusReview() {
  const r = G.pendingFocusReview; if (!r) return;
  G.pendingFocusReview = null;
  openModal(t('review_title'));
  mbody.innerHTML = '<div class="review-goal">' + esc(r.goal || t('goal_none')) + '</div><p class="mnote">' + esc(t('review_question')) + '</p>' +
    '<div class="mrow review-actions"><button data-result="done">✅ ' + esc(t('result_done')) + '</button><button data-result="partial">🟡 ' + esc(t('result_partial')) + '</button><button data-result="notyet">↪ ' + esc(t('result_notyet')) + '</button></div>';
  mbody.querySelectorAll('[data-result]').forEach(b => b.addEventListener('click', async () => {
    const result = b.dataset.result;
    G.focusHistory = G.focusHistory || []; G.focusHistory.push({ at: r.endedAt || Date.now(), minutes: r.nominalMinutes || 25, goal: r.goal || '', result, ritualId: r.ritualId || '', projectId: r.projectId || '' });
    if (G.focusHistory.length > 120) G.focusHistory.shift();
    addMemory(G, 'focus', '', Date.now(), { goal: r.goal || '', result });
    G.focusGoal = result === 'notyet' ? (r.goal || '') : '';
    if (result === 'done') { react('happy', 1800); fx('happyhop', 700); particle('✅'); }
    else if (result === 'partial') { react('happy', 1100); particle('🌱'); }
    else { fx('stretch', 700); }
    say(t('review_pet_' + result)); renderTodayCompact(); renderJourney(); applyProgressiveUI(); await persist(); closeModal(); setTimeout(maybeShowUnlock, 250);
  }));
}
$('btnMemories').addEventListener('click', () => {
  openModal(t('memory_title'));
  const ms = (G.memories || []).slice().reverse();
  const memoryText = m => {
    if (m.meta && m.type === 'birth') return t('memory_birth', { N: m.meta.name || t('egg_word') });
    if (m.meta && m.type === 'evolution') return t('memory_evolution', { N: m.meta.name || '', S: stName(m.meta.stage) });
    if (m.meta && m.type === 'focus') return t('memory_focus', { G: m.meta.goal || t('goal_none'), R: t('result_' + (m.meta.result || 'done')) });
    if (m.meta && m.type === 'expedition') return t('memory_expedition', { N: m.meta.name || '', R: t('route_' + (m.meta.route || 'forest')) });
    return m.text || t('memory_generic');
  };
  mbody.innerHTML = ms.length ? '<div class="memory-list">' + ms.map(m => '<div class="memory-item">' + esc(memoryText(m)) + '<small>' + new Date(m.at).toLocaleString() + '</small></div>').join('') + '</div>' : '<div class="mnote">' + esc(t('memory_empty')) + '</div>';
});
function showOnboarding() {
  // v0.46: primer arranque — 2 pasos que llevan al primer foco (el huevo
  // eclosiona al completarlo; el onboarding ES la historia de incubación).
  const ov = document.createElement('div');
  ov.className = 'ob-ov';
  const card = document.createElement('div');
  card.className = 'ob-card';
  ov.appendChild(card);
  const step = n => {
    card.classList.toggle('ob-wide', n === 2);
    if (n === 1) {
      card.innerHTML = '<div class="ob-egg">\u{1F95A}</div><h2>' + t('ob_t1') + '</h2><p>' + t('ob_d1') + '</p><button class="primary" id="obNext">' + t('ob_next') + '</button>';
      card.querySelector('#obNext').addEventListener('click', () => step(2));
    } else if (n === 2) {
      card.innerHTML = '<h2>' + esc(t('experience_question')) + '</h2><p class="experience-explainer">' + esc(t('experience_intro')) + '</p><div class="ob-modes">' +
        EXPERIENCE_MODES.map(mode => '<button class="ob-mode" data-mode="' + mode + '"><span>' + ({calm:'🌿',coach:'💛',game:'🎮',strict:'🛡️'}[mode]) + '</span><span><b>' + esc(t('experience_' + mode)) + '</b><small>' + esc(t('experience_' + mode + '_desc')) + '</small></span></button>').join('') + '</div>';
      card.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => { chooseExperience(b.dataset.mode, false); step(3); }));
    } else {
      card.innerHTML = '<div class="ob-egg">\u{1F525}</div><h2>' + t('ob_t2') + '</h2><p>' + t('ob_d2') + '</p><button class="primary" id="obGo">' + t('ob_go') + '</button>';
      card.querySelector('#obGo').addEventListener('click', () => {
        ov.remove();
        if (!G.experienceChosen) chooseExperience('coach', false);
        G.obSeen = true; persist();
        goTab('foco');
        const bf = $('btnFocus');
        bf.classList.remove('pulse'); void bf.getBoundingClientRect(); bf.classList.add('pulse');
      });
    }
  };
  step(1);
  document.body.appendChild(ov);
}
function showExperienceChoice() {
  if (!G || G.experienceChosen) return;
  openModal(t('experience_question'));
  mbody.innerHTML = '<p class="experience-explainer">' + esc(t('experience_intro')) + '</p><div class="ob-modes">' +
    EXPERIENCE_MODES.map(mode => '<button class="ob-mode" data-mode="' + mode + '"><span>' + ({calm:'🌿',coach:'💛',game:'🎮',strict:'🛡️'}[mode]) + '</span><span><b>' + esc(t('experience_' + mode)) + '</b><small>' + esc(t('experience_' + mode + '_desc')) + '</small></span></button>').join('') + '</div>';
  mbody.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', async () => {
    chooseExperience(b.dataset.mode, false);
    await persist();
    closeModal();
    toast(t('experience_saved'));
  }));
}
function renderDnd() {
  const box = $('dndList');
  if (!box) return;
  const d = G.dnd || { sites: [], until: 0 };
  let html = '';
  if (d.until && d.until > Date.now()) {
    const tt = new Date(d.until);
    html += '<div class="dnd-row"><span>\u23F8\uFE0F ' + t('dnd_until', { T: String(tt.getHours()).padStart(2, '0') + ':' + String(tt.getMinutes()).padStart(2, '0') }) + '</span><button data-dnd="clear">' + t('dnd_resume') + '</button></div>';
  }
  (d.sites || []).forEach(h => { html += '<div class="dnd-row"><span>\u{1F515} ' + h + '</span><button data-dnd="' + h + '" title="\u2715">\u2715</button></div>'; });
  box.innerHTML = html || '<div class="fnote">' + t('dnd_empty') + '</div>';
  box.querySelectorAll('[data-dnd]').forEach(b => b.addEventListener('click', () => {
    const v = b.getAttribute('data-dnd');
    if (!G.dnd) G.dnd = { sites: [], until: 0 };
    if (v === 'clear') G.dnd.until = 0;
    else G.dnd.sites = (G.dnd.sites || []).filter(x => x !== v);
    persist(); renderDnd();
  }));
}
$('btnFocus').addEventListener('click', async () => {
  const pro = proActive(G);
  const rituals = pro ? (G.rituals || []).slice(0, 8) : (G.rituals || []).slice(0, 1);
  const projects = pro ? (G.projects || []).slice(0, 12) : (G.projects || []).slice(0, 3);
  const ritual = rituals.find(r => r.id === G.activeRitualId);
  const goal = $('focusGoal').value.trim().slice(0, 120);
  if (ritual && ritual.goalRequired && !goal) { $('focusGoal').focus(); toast(t('goal_required')); return; }
  markTrialUse(G);
  const nominalMinutes = G.focusMin || 25;
  const dur = nominalMinutes * 60000;
  G.focusGoal = goal;
  const projectId = (ritual && projects.some(p => p.id === ritual.projectId) && ritual.projectId) || (projects.some(p => p.id === G.activeProjectId) ? G.activeProjectId : '');
  G.focus = { startedAt: Date.now(), endsAt: Date.now() + dur, duration: dur, nominalMinutes, goal, ritualId: ritual ? ritual.id : '', projectId, kind: 'work' };
  await chrome.alarms.create('focusEnd', { when: G.focus.endsAt + 500 });
  toast('🔥 ' + t('focus_start', { M: G.focusMin || 25 }));
  draw(true); updateHUD(); persist();
});
$('btnBreak').addEventListener('click', async () => {
  if (G.focus) return;
  const rituals = proActive(G) ? (G.rituals || []).slice(0, 8) : (G.rituals || []).slice(0, 1);
  const ritual = rituals.find(r => r.id === G.activeRitualId);
  const nominalMinutes = ritual ? ritual.breakMin : 5;
  const dur = nominalMinutes * 60000;
  G.focus = { startedAt: Date.now(), endsAt: Date.now() + dur, duration: dur, nominalMinutes, kind: 'break' };
  await chrome.alarms.create('focusEnd', { when: G.focus.endsAt + 500 });
  toast('☕ ' + t('focus_break'));
  draw(true); updateHUD(); persist();
});
$('selMin').addEventListener('change', e => {
  G.focusMin = parseInt(e.target.value, 10) || 25;
  if (!G.focus) $('ftimer').textContent = String(G.focusMin).padStart(2, '0') + ':00';
  persist();
});
$('btnFocusCancel').addEventListener('click', async () => {
  await chrome.alarms.clear('focusEnd');
  const wasBreak = G.focus && G.focus.kind === 'break';
  G.focus = null;
  if (!wasBreak) G.animo = Math.max(0, G.animo - 8);
  toast(wasBreak ? '☕ ' + t('focus_break_cancel') : t('focus_abandon', { N: G.dna ? G.dna.name : '???' }));
  draw(true); updateHUD(); persist();
});

/* ═══════════ MINIJUEGOS ═══════════ */
const modal = $('modal'), mbody = $('mbody');
let mgRaf = 0, ovCleanup = null;
let modalReturnFocus = null;
function openModal(title) {
  modalReturnFocus = document.activeElement;
  $('mtitle').textContent = title; modal.classList.add('open');
  $('mclose').focus();
}
function closeModal() {
  modal.classList.remove('open');
  cancelAnimationFrame(mgRaf);
  if (ovCleanup) { ovCleanup(); ovCleanup = null; }
  mbody.innerHTML = '';
  if (modalReturnFocus && modalReturnFocus.isConnected) modalReturnFocus.focus();
  modalReturnFocus = null;
}
$('mclose').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

/* 🎣 Pesca */
let fsh = null;
$('btnPesca').addEventListener('click', () => {
  if (G.playsPesca >= 3) return;
  fsh = { cast: 0, caught: [], speed: 1.5, pos: 0, dir: 1, moving: false,
          max: (G.tools && G.tools.cana) ? 4 : 3,
          perf: (G.tools && G.tools.cana) ? 0.055 : 0.035 };
  openModal('🎣 ' + t('mg_pesca_title'));
  pescaIdle();
});
function pescaIdle() {
  if (fsh.cast >= fsh.max) {
    const peces = fsh.caught.filter(c => c.brasas > 0).length;
    const escamas = peces + fsh.caught.filter(c => c.brasas >= 4).length;
    G.peces += peces;
    if (G.daily) { G.daily.played = true; checkDaily(); }
    recordMissionProgress(G, 'play', 1);
    G.mats.escama = (G.mats.escama || 0) + escamas;
    renderCraft();
    G.animo = Math.min(100, G.animo + 6);
    G.playsPesca++;
    updateHUD(); persist();
    mbody.innerHTML = '<div class="pond">' + (fsh.caught.map(c => c.emoji).join(' ') || '💨') + '</div>' +
      '<div class="mnote">' + t('mg_pesca_result', { F: peces, E: escamas }) + '</div>' +
      '<div class="mrow" style="margin-top:8px"><button class="primary" id="pOk">' + t('mg_collect') + '</button></div>';
    $('pOk').addEventListener('click', closeModal);
    toast('🎣 ' + t('mg_pesca_toast', { F: peces, E: escamas }));
    return;
  }
  mbody.innerHTML = '<div class="pond" id="pond">🌊</div>' +
    '<div class="fbarwrap"><div class="fzone" style="left:38%;width:24%"></div><div class="fperf" style="left:' + (50 - fsh.perf * 100) + '%;width:' + (fsh.perf * 200) + '%"></div><div class="find" id="find" style="left:0%"></div></div>' +
    '<div class="mrow"><button class="primary" id="pBtn">' + t('mg_cast', { N: fsh.cast + 1, M: fsh.max }) + '</button></div>' +
    '<div class="mnote">' + t('mg_pesca_note') + '</div>';
  $('pBtn').addEventListener('click', pescaCast);
}
function pescaCast() {
  fsh.moving = true; fsh.pos = Math.random(); fsh.dir = 1;
  const btn = $('pBtn');
  btn.textContent = t('mg_bite');
  btn.removeEventListener('click', pescaCast);
  btn.addEventListener('click', pescaBite);
  const ind = $('find');
  let last = performance.now();
  function step(now) {
    if (!fsh.moving) return;
    const dt = (now - last) / 1000; last = now;
    fsh.pos += fsh.dir * fsh.speed * dt;
    if (fsh.pos > 1) { fsh.pos = 1; fsh.dir = -1; }
    if (fsh.pos < 0) { fsh.pos = 0; fsh.dir = 1; }
    ind.style.left = (fsh.pos * 100) + '%';
    mgRaf = requestAnimationFrame(step);
  }
  mgRaf = requestAnimationFrame(step);
}
function pescaBite() {
  fsh.moving = false; cancelAnimationFrame(mgRaf);
  const d = Math.abs(fsh.pos - 0.5);
  let res;
  if (d <= fsh.perf) res = { emoji: '🐠', brasas: 4, txt: t('mg_fish_rare') };
  else if (d <= 0.12) res = { emoji: '🐟', brasas: 2, txt: t('mg_fish_ok') };
  else res = { emoji: '💨', brasas: 0, txt: t('mg_fish_miss') };
  fsh.caught.push(res); fsh.cast++; fsh.speed *= 1.3;
  const pond = $('pond');
  if (pond) pond.textContent = res.emoji;
  toast(res.txt);
  setTimeout(pescaIdle, 750);
}

/* 🧶 Ovillo */
$('btnOvillo').addEventListener('click', () => {
  if (G.playsOvillo >= 3) return;
  openModal('🧶 ' + t('mg_ovillo_title'));
  mbody.innerHTML = '<div class="arena" id="arena">' +
    '<div class="ahud"><span id="ovT">20.0s</span><span style="color:var(--amber)" id="ovS">0 pts</span></div>' +
    '<div class="yarn" id="yarn">🧶</div>' +
    '<div class="miniPet" id="mpet"></div>' +
    '</div>' +
    '<div class="mnote">' + t('mg_ovillo_note') + '</div>';
  const arena = $('arena'), yarn = $('yarn'), mpet = $('mpet');
  const svgStr = buildCreature(G.dna, Math.min(G.stageIdx, 2), { dirtLvl: 0, poops: 0, focusing: false, mood: 90 })
    .split('bodyclip').join('bodyclipM');
  mpet.innerHTML = '<svg viewBox="0 0 200 200" width="84" height="84">' + svgStr + '</svg>';
  const W = () => arena.clientWidth, Hh = () => arena.clientHeight;
  const gold = G.tools && G.tools.ovillo;
  const ov = { tx: W()/2, ty: Hh()/2, bx: W()/2, by: Hh()/2, pbx: W()/2, pby: Hh()/2, px: W()/2, py: Hh()*0.75, score: 0,
               end: performance.now() + (gold ? 25000 : 20000), radius: gold ? 82 : 58 };
  function onMove(e) {
    const r = arena.getBoundingClientRect();
    ov.tx = Math.max(14, Math.min(W() - 14, e.clientX - r.left));
    ov.ty = Math.max(14, Math.min(Hh() - 14, e.clientY - r.top));
  }
  arena.addEventListener('pointermove', onMove);
  arena.addEventListener('pointerdown', onMove);
  ovCleanup = () => { arena.removeEventListener('pointermove', onMove); arena.removeEventListener('pointerdown', onMove); };
  function loop(now) {
    if (now >= ov.end) { ovilloEnd(ov.score); return; }
    ov.pbx = ov.bx; ov.pby = ov.by;
    ov.bx += (ov.tx - ov.bx) * 0.3; ov.by += (ov.ty - ov.by) * 0.3;
    ov.px += (ov.bx - ov.px) * 0.055; ov.py += (ov.by - ov.py) * 0.055;
    const ballSpd = Math.hypot(ov.bx - ov.pbx, ov.by - ov.pby);
    const dist = Math.hypot(ov.bx - ov.px, ov.by - ov.py);
    const scoring = dist < ov.radius && ballSpd > 1.1;
    if (scoring) ov.score++;
    yarn.style.left = ov.bx + 'px'; yarn.style.top = ov.by + 'px';
    mpet.style.left = ov.px + 'px'; mpet.style.top = ov.py + 'px';
    mpet.classList.toggle('scoring', scoring);
    $('ovT').textContent = ((ov.end - now) / 1000).toFixed(1) + 's';
    $('ovS').textContent = Math.floor(ov.score / 6) + ' pts';
    mgRaf = requestAnimationFrame(loop);
  }
  mgRaf = requestAnimationFrame(loop);
});
function ovilloEnd(score) {
  if (ovCleanup) { ovCleanup(); ovCleanup = null; }
  const pts = Math.floor(score / 6);
  const hilo = Math.max(0, Math.min(2, Math.round(pts / 40)));
  if (G.daily) { G.daily.played = true; checkDaily(); }
  recordMissionProgress(G, 'play', 1);
  G.mats.hilo = (G.mats.hilo || 0) + hilo;
  renderCraft();
  G.animo = Math.min(100, G.animo + 10);
  G.vinculo = Math.min(100, G.vinculo + 1);
  G.playsOvillo++;
  updateHUD(); persist();
  mbody.innerHTML = '<div class="pond">🧶✨</div>' +
    '<div class="mnote">' + esc(t('mg_ovillo_result', { P: pts, H: hilo ? ' · +' + hilo + '🧵' : '', N: G.dna ? G.dna.name : '???' })) + '</div>' +
    '<div class="mrow" style="margin-top:8px"><button class="primary" id="oOk">' + t('mg_done') + '</button></div>';
  $('oOk').addEventListener('click', closeModal);
  toast('🧶 ' + t('mg_ovillo_toast', { H: (hilo ? '+' + hilo + '🧵 · ' : '') + '+1💛' }));
}


/* ═══ VISITAS (códigos de intercambio · GDD §11) ═══ */
let visiting = false;
function visitEmoji(score) { return score >= 2 ? '💕' : score === 1 ? '🙂' : score === 0 ? '😐' : score === -1 ? '😾' : '⚡'; }
function renderVisits() {
  const box = $('visitMems');
  if (!box) return;
  const v = (G.visits || []).slice(-3).reverse();
  box.innerHTML = v.length
    ? t('visit_mems') + ' ' + v.map(m => visitEmoji(m.score) + ' <b>' + esc(m.name) + '</b>' + (m.owner ? ' (' + esc(m.owner) + ')' : '') + (m.bff ? ' 💛' : '')).join(' · ')
    : t('visit_none');
}
$('btnMyCode').addEventListener('click', async () => {
  if (!G.ownerAlias) {
    const a = prompt(t('visit_alias'), '');
    if (a && a.trim()) { G.ownerAlias = a.trim().slice(0, 14); persist(); }
  }
  const payload = { v: 1, dna: G.dna, stage: G.stageIdx, owner: G.ownerAlias || '' };
  const code = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  $('visitCode').value = code;
  try { await navigator.clipboard.writeText(code); } catch (e) {}
  toast(t('visit_code'));
});
$('btnVisit').addEventListener('click', () => {
  if (visiting) return;
  let p = null;
  try { p = sanitizeVisitPayload(JSON.parse(decodeURIComponent(escape(atob($('visitCode').value.trim()))))); } catch (e) {}
  if (!p || !p.dna || !SP_LABEL[p.dna.species] || !TEMP_INFO[p.dna.temperament]) { toast(t('visit_invalid')); return; }
  if (p.dna.seed === G.dna.seed) { toast(t('visit_self')); return; }
  startVisit(p);
});
function startVisit(p) {
  visiting = true;
  const score = Math.max(-2, Math.min(2, compatScore(G.dna.temperament, p.dna.temperament)));
  const holder = document.createElement('div');
  holder.id = 'visitorBox';
  holder.style.cssText = 'position:absolute;right:10px;bottom:4px;z-index:5;';
  holder.innerHTML = '<svg viewBox="0 0 200 200" width="118" height="118" class="hatch">' +
    buildCreature(p.dna, Math.min(p.stage || 1, 2), { dirtLvl: 0, poops: 0, focusing: false, mood: 80 })
      .split('bodyclip').join('bodyclipV') + '</svg>';
  stageEl.appendChild(holder);
  sfx.knock();
  toast('🧬 ' + t('visit_arrive', { N: p.dna.name }));
  // publicar la visita para que también ocurra en la página
  G.activeVisit = { dna: p.dna, stage: Math.min(p.stage || 1, 2), owner: p.owner || '', score, until: Date.now() + 19000 };
  persist();
  setTimeout(async () => {
    const fem = p.dna.gender === 'hembra';
    const l = await nanoLine('Tu ' + (fem ? 'amiga' : 'amigo') + ' ' + p.dna.name + ' (' + SP_LABEL[p.dna.species] + ', ' + TEMP_INFO[p.dna.temperament].label + ') acaba de llegar de visita. Salúdal' + (fem ? 'a' : 'o') + ' con tu personalidad.');
    say(l || '¡' + p.dna.name + '! 👋');
  }, 1300);
  setTimeout(() => {
    const srcB = phraseBank((G.uiLang || 'es').slice(0, 2));
    const bank = srcB[p.dna.temperament] || srcB.tranquilo;
    say(p.dna.name + ': «' + bank[Math.floor(Math.random() * bank.length)] + '»');
  }, 6200);
  const em = visitEmoji(score);
  let k = 0;
  const iv = setInterval(() => {
    particle(em, stageEl.clientWidth * 0.5 + (Math.random() * 90 - 45), 150 + Math.random() * 30);
    if (++k >= 5) clearInterval(iv);
  }, 2600);
  setTimeout(() => {
    holder.style.transition = 'opacity .6s';
    holder.style.opacity = '0';
    setTimeout(() => holder.remove(), 650);
    const labels = { '2': t('visit_r2'), '1': t('visit_r1'), '0': t('visit_r0'), '-1': t('visit_rm1'), '-2': t('visit_rm2') };
    toast(labels[String(score)]);
    if (score >= 1) sfx.sparkle(); else if (score <= -1) sfx.knock();
    G.visits = G.visits || [];
    let m = G.visits.find(x => x.seed === p.dna.seed);
    if (m) {
      m.times++; m.score = score; m.last = Date.now();
      if (m.times >= 3 && score >= 2) { m.bff = true; toast('💛 ' + t('visit_bff', { A: G.dna.name, B: p.dna.name })); }
    } else {
      m = { seed: p.dna.seed, name: p.dna.name, species: p.dna.species, temperament: p.dna.temperament, owner: p.owner || '', times: 1, score, last: Date.now(), bff: false };
      G.visits.push(m);
      if (G.visits.length > 10) G.visits.shift();
    }
    G.animo = Math.min(100, Math.max(0, G.animo + (score >= 1 ? 8 : score <= -1 ? -4 : 2)));
    G.vinculo = Math.min(100, G.vinculo + 1);
    G.activeVisit = null;
    renderVisits(); updateHUD(); persist();
    if (!proActive(G) && Math.random() < 0.25) {
      setTimeout(() => toast(t('upsell')), 2500);
    }
    visiting = false;
  }, 19000);
}

/* Retoque de madurez: una personalización visual Free que no altera especie,
   temperamento ni género. La Forja completa sigue siendo PRO. */
function openFreeRetouch() {
  const d = G.dna;
  openModal('🎨 ' + t('retouch_title'));
  const mkSel = v => d.marking.type === v ? ' selected' : '';
  mbody.innerHTML = '<div class="fpreview"><svg id="fprev" viewBox="0 0 200 200" width="150" height="150"></svg></div>' +
    '<div class="forgegrid"><input type="color" id="fCol" value="' + d.color + '" title="' + esc(t('retouch_body')) + '"><input type="color" id="fMkc" value="' + d.marking.color + '" title="' + esc(t('retouch_marks')) + '">' +
    '<select id="fMk" style="grid-column:1/3"><option value="none"'+mkSel('none')+'>'+t('fk_none')+'</option><option value="patches"'+mkSel('patches')+'>'+t('fk_patches')+'</option><option value="belly"'+mkSel('belly')+'>'+t('fk_belly')+'</option><option value="patches_belly"'+mkSel('patches_belly')+'>'+t('fk_pb')+'</option></select>' +
    '<select id="fAcc" style="grid-column:1/3"><option value="none">'+t('acc_none')+'</option><option value="lazo">🎀 '+t('acc_lazo')+'</option><option value="bufanda">🧣 '+t('acc_buf')+'</option></select></div>' +
    '<div class="mnote">'+esc(t('retouch_note'))+' <span class="pro-tag">'+esc(t('retouch_pro'))+'</span></div><button class="primary" id="fGo" style="margin-top:10px">'+esc(t('retouch_btn'))+'</button>';
  if (['gorro','monoculo'].includes(d.accessory)) {
    const held=document.createElement('option'); held.value=d.accessory; held.textContent=t(d.accessory==='gorro'?'acc_gorro':'acc_mono')+' · PRO'; $('fAcc').appendChild(held);
  }
  $('fAcc').value = ['none','lazo','bufanda','gorro','monoculo'].includes(d.accessory) ? d.accessory : 'none';
  const previewDna = () => ({ ...d, color:$('fCol').value, accessory:$('fAcc').value, marking:{type:$('fMk').value,color:$('fMkc').value} });
  const preview = () => { $('fprev').innerHTML = buildCreature(previewDna(), Math.max(1,G.stageIdx), {dirtLvl:0,poops:0,focusing:false,mood:80}).split('bodyclip').join('bodyclipR'); };
  ['fMk','fAcc'].forEach(id => $(id).addEventListener('change',preview));
  ['fCol','fMkc'].forEach(id => $(id).addEventListener('input',preview));
  $('fGo').addEventListener('click', () => { G.dna=previewDna(); G.freeRetouchUsed=true; nanoSession=null; sfx.sparkle(); closeModal(); draw(true,true); updateHUD(); persist(); toast(t('retouch_done')); });
  preview();
}

/* ═══ LA FORJA (editor completo · PRO) ═══ */
$('btnForge').addEventListener('click', () => {
  if (!proActive(G)) {
    if (G.stageIdx >= 3 && !G.freeRetouchUsed) { openFreeRetouch(); return; }
    toast(t('forge_lock') + (trialStatus(G).remaining > 0 ? '' : ' ' + t('pro_from')));
    renderPro();
    goTab('mas');
    $('probox').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  const mk = monthKey();
  if (!G.forjas || G.forjas.month !== mk) G.forjas = { month: mk, used: 0 };
  if (G.forjas.used >= 3) {
    toast(t('forge_limit'));
    return;
  }
  openModal('🔨 ' + t('forge_title', { N: 3 - G.forjas.used }));
  const d = G.dna;
  const spOpts = Object.keys(SP_LABEL).map(k => '<option value="' + k + '"' + (k === d.species ? ' selected' : '') + '>' + spName(k) + '</option>').join('');
  const tpOpts = Object.keys(TEMP_INFO).map(k => '<option value="' + k + '"' + (k === d.temperament ? ' selected' : '') + '>' + tmpName(k) + '</option>').join('');
  const mkSel = t => (d.marking.type === t ? ' selected' : '');
  mbody.innerHTML =
    '<div class="fpreview"><svg id="fprev" viewBox="0 0 200 200" width="150" height="150"></svg></div>' +
    '<div class="forgegrid">' +
    '<select id="fSp">' + spOpts + '</select>' +
    '<select id="fTp">' + tpOpts + '</select>' +
    '<input type="color" id="fCol" value="' + d.color + '" title="Color del cuerpo">' +
    '<input type="color" id="fMkc" value="' + d.marking.color + '" title="Color de marcas">' +
    '<select id="fMk" style="grid-column:1/3">' +
    '<option value="none"' + mkSel('none') + '>' + t('fk_none') + '</option>' +
    '<option value="patches"' + mkSel('patches') + '>' + t('fk_patches') + '</option>' +
    '<option value="belly"' + mkSel('belly') + '>' + t('fk_belly') + '</option>' +
    '<option value="patches_belly"' + mkSel('patches_belly') + '>' + t('fk_pb') + '</option>' +
    '</select>' +
    '<select id="fAcc" style="grid-column:1/3">' +
    ['none|' + t('acc_none'), 'lazo|🎀 ' + t('acc_lazo'), 'bufanda|🧣 ' + t('acc_buf'), 'gorro|🎩 ' + t('acc_gorro') + ' ⭐', 'monoculo|🧐 ' + t('acc_mono') + ' ⭐'].map(o => {
      const [v, l] = o.split('|');
      const proOnly = (v === 'gorro' || v === 'monoculo') && !proActive(G);
      return '<option value="' + v + '"' + ((d.accessory || 'none') === v ? ' selected' : '') + (proOnly ? ' disabled' : '') + '>' + l + (proOnly ? ' 🔒' : '') + '</option>';
    }).join('') +
    '</select>' +
    '<select id="fGen" style="grid-column:1/3">' +
    '<option value="hembra"' + (d.gender === 'hembra' ? ' selected' : '') + '>♀ ' + t('g_f') + '</option>' +
    '<option value="macho"' + (d.gender !== 'hembra' ? ' selected' : '') + '>♂ ' + t('g_m') + '</option>' +
    '</select>' +
    '<input type="text" id="fNm" value="' + d.name + '" maxlength="16" style="grid-column:1/3" placeholder="' + t('forge_name_ph') + '">' +
    '</div>' +
    '<div class="mrow"><button class="primary" id="fGo">' + t('forge_btn') + '</button></div>' +
    '<div class="mnote">' + t('forge_note') + '</div>';
  function fdna() {
    return Object.assign({}, d, {
      species: $('fSp').value, temperament: $('fTp').value,
      color: $('fCol').value,
      gender: $('fGen').value,
      accessory: $('fAcc').value,
      marking: { type: $('fMk').value, color: $('fMkc').value },
      name: $('fNm').value.trim() || d.name
    });
  }
  function fprev() {
    $('fprev').innerHTML = buildCreature(fdna(), Math.max(1, G.stageIdx), { dirtLvl: 0, poops: 0, focusing: false, mood: 80 })
      .split('bodyclip').join('bodyclipF');
  }
  ['fSp', 'fTp', 'fMk', 'fGen', 'fAcc'].forEach(id => $(id).addEventListener('change', fprev));
  ['fCol', 'fMkc', 'fNm'].forEach(id => $(id).addEventListener('input', fprev));
  $('fGo').addEventListener('click', () => {
    if (!confirm(t('forge_confirm', { N: G.dna.name }))) return;
    const nd = fdna();
    nd.seed = Math.floor(Math.random() * 1e6);
    G.dna = nd;
    markDiscovered(G, nd.species);
    G.forjas.used++;
    nanoSession = null;
    sfx.sparkle();
    closeModal();
    draw(true, true); updateHUD(); renderBestiario(); persist();
    toast(t('forge_done'));
  });
  fprev();
});

/* ═══ EN PANTALLA (content script) ═══ */
$('btnInvoke').addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
    toast(t('invoke'));
  } catch (e) {
    toast(t('invoke_fail'));
  }
});
async function syncAlwaysCheckbox() {
  try {
    const regs = await chrome.scripting.getRegisteredContentScripts({ ids: ['sf-pet'] });
    $('chkAlways').checked = regs.length > 0;
  } catch (e) { $('chkAlways').checked = false; }
}
async function enableRoam() {
  // Debe ejecutarse dentro de un gesto del usuario (Chrome lo exige para
  // permissions.request) — por eso el paseo no puede activarse solo tras la
  // eclosión: se OFRECE con un clic (CTA post-eclosión) o con chkAlways.
  const granted = await chrome.permissions.request({ origins: ['<all_urls>'] });
  if (!granted) return false;
  try {
    await chrome.scripting.registerContentScripts([{
      id: 'sf-pet', js: ['content.js'], matches: ['<all_urls>'], runAt: 'document_idle'
    }]);
  } catch (err) { /* ya registrado */ }
  // v0.46.4: el registro solo aplica a páginas cargadas A PARTIR de ahora —
  // invocar además en la pestaña activa para verla pasear al instante
  // (equivale a "Siempre en todas las webs" + "Invocar en esta pestaña").
  // content.js es idempotente (guarda __slimeforgeInjected).
  let injected = false;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.id != null) { await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] }); injected = true; }
  } catch (err) { /* páginas chrome:// y similares: no inyectables */ }
  toast(t(injected ? 'always_on' : 'roam_next_page'));
  return true;
}
$('chkAlways').addEventListener('change', async e => {
  if (e.target.checked) {
    const ok = await enableRoam();
    if (!ok) { e.target.checked = false; return; }
  } else {
    try { await chrome.scripting.unregisterContentScripts({ ids: ['sf-pet'] }); } catch (err) {}
    toast(t('always_off'));
  }
});

/* ═══ PUPILAS QUE SIGUEN EL CURSOR ═══ */
stageEl.addEventListener('mousemove', e => {
  const r = world.getBoundingClientRect();
  const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width/2)) / (r.width/2)));
  const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height/2)) / (r.height/2)));
  const f = world.querySelector('.eyes-follow');
  if (f) f.setAttribute('transform', 'translate(' + (dx*2.5).toFixed(1) + ' ' + (dy*1.8).toFixed(1) + ')');
});

/* ═══════════ ARRANQUE + BUCLE DE UI ═══════════ */
(async function init() {
  G = await loadState();
  persistedState = JSON.parse(JSON.stringify(G));
  applyElapsed(G, Date.now() - G.lastTick);   // catch-up del tiempo fuera
  syncPhaseUI();
  syncAlwaysCheckbox();
  document.body.classList.toggle('light', !!G.lightTheme);
  $('btnTheme').textContent = G.lightTheme ? '☀️' : '🌙';
  const uiLang = normalizeUiLang(G.uiLang || navigator.language);
  G.uiLang = uiLang;
  $('selLang').value = uiLang;
  $('selExperience').value = G.experienceMode || 'coach';
  G.proOn = proActive(G);
  await loadI18N(uiLang);
  translateDOM();
  document.documentElement.classList.remove('i18n-pending');
  // La traducción del DOM repone el texto inicial "Comprobando…". La
  // disponibilidad debe resolverse después para que el resultado no quede
  // sobrescrito aunque LanguageModel haya respondido correctamente.
  refreshNano();
  await persist();
  renderPro();
  renderPets();
  renderBestiario();   // sin esto, la pestaña Colección abría vacía hasta forjar o cambiar de idioma
  renderProjects(); renderShield(); applyProgressiveUI();
  revalidateLicense(G).then(changed => { if (changed) { G.proOn = proActive(G); persist(); renderPro(); renderPets(); renderShield(); applyProgressiveUI(); updateHUD(); } });
  draw(true);
  updateHUD();
  drainToasts();
  drainReactions();
  if (G.pendingPoopShow) { G.pendingPoopShow = false; setTimeout(playPoopShow, 600); }
  const gapSeen = Date.now() - (G.lastSeen || Date.now());
  G.lastSeen = Date.now();
  if (G.phase === 'pet' && isAsleep(G)) {
    say('Zzz…');
  } else if (G.phase === 'pet' && gapSeen > 6 * 3600 * 1000) {
    fx('happyhop', 500);
    setTimeout(async () => {
      const l = await nanoLine('Tu humano vuelve después de muchas horas fuera. Recíbele con muchísima alegría.');
      say(l || t('say_back'));
    }, 700);
  } else if (G.phase === 'pet') {
    if ((G.educacion || 30) >= 60) {
      setTimeout(async () => {
        const l = await nanoLine('Tu humano acaba de abrir el popup. Salúdale con educación y cariño, a tu manera.');
        say(l || t('say_hello'));
      }, 800);
    } else if (Math.random() < 0.35) setTimeout(speak, 900);
  }
  if (G.phase === 'pet' && !isAsleep(G)) setTimeout(dailyGift, 1600);
  // Informe del día: en la primera apertura de cada jornada, tu criatura
  // te resume ayer con su voz (stats → contenido emocional).
  if (G.phase === 'pet' && !isAsleep(G) && G.lastReport !== dayKey()) {
    G.lastReport = dayKey();
    const yd = new Date(); yd.setDate(yd.getDate() - 1);
    const ye = G.fstats && G.fstats.days && G.fstats.days[yd.getFullYear() + '-' + (yd.getMonth() + 1) + '-' + yd.getDate()];
    if (ye && ye.n) setTimeout(() => say(t('report_line', { N: ye.n, M: ye.min, R: (G.streak && G.streak.count) || 1 })), 2400);
  }
  goTab(G.uiTab || 'foco');
  if (G.pendingHatch) setTimeout(celebrateHatch, 450);   // se conserva hasta que el usuario conoce a la criatura
  if (G.pendingHatchSlot != null) { const hp = G.stable[G.pendingHatchSlot]; G.pendingHatchSlot = null; sfx.fanfare(); setTimeout(() => toast('\u{1F389} ' + t('born_stable', { NAME: hp && hp.dna ? hp.dna.name : '???' })), 700); renderPets(); persist(); }
  if (G.pendingFocusReview && !G.pendingHatch) setTimeout(showFocusReview, 900);
  if (G.phase === 'egg' && !G.obSeen) setTimeout(showOnboarding, 400);
  else if (G.phase === 'pet' && !G.experienceChosen) setTimeout(showExperienceChoice, 500);
  renderDnd();
  stageAmbient();
  renderVisits();
  await persist();

  setInterval(() => {
    if (!G) return;
    stageAmbient();
    const hadFocus = !!G.focus;
    applyElapsed(G, 1000);
    if (hadFocus && !G.focus) sfx.chime();
    if (hadFocus && !G.focus && G.pendingFocusReview) setTimeout(showFocusReview, 350);
    if (G.pendingHatch) { G.pendingHatch = false; celebrateHatch(); }
    if (G.pendingHatchSlot != null) { const hp = G.stable[G.pendingHatchSlot]; G.pendingHatchSlot = null; sfx.fanfare(); toast('\u{1F389} ' + t('born_stable', { NAME: hp && hp.dna ? hp.dna.name : '???' })); renderPets(); updateHUD(); persist(); }
    if (G.pendingPoopShow) { G.pendingPoopShow = false; playPoopShow(); }
    drainToasts();
    drainReactions();
    draw();
    updateHUD();
    if (++saveCounter % 5 === 0) persist();
    if (G.phase === 'pet' && Math.random() < 0.30) slimeDripPopup();
    popupEvT++;
    const chatMod = 1.7 - (G.educacion || 30) / 100;
    const modeMod = ({ calm: 0, coach: 1, game: 1.45, strict: 0.65 }[G.experienceMode] ?? 1);
    if (!G.quietMode && G.phase === 'pet' && !isAsleep(G) && popupEvT >= 40 && Math.random() < 0.05 * chatMod * modeMod) {
      popupEvT = 0;
      popupEvent();
    }
  }, 1000);
})();
