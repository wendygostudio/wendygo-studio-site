import test from 'node:test';
import assert from 'node:assert/strict';
import { freshState, sanitizeImportedState, sanitizeVisitPayload, mergeConcurrentValue, addMemory, applyElapsed, focusValue, SAVE_SCHEMA, recordMissionProgress, startExpedition, advanceExpedition, claimExpedition, featureUnlocked, awardRelics, relicUniqueCount } from '../common/logic.js';
import { startTrial, trialStatus, markTrialUse } from '../common/license.js';

const dna = (name = 'Mochi') => ({
  v: 1, species: 'gato', color: '#e8a33d', gender: 'hembra', accessory: 'none', cos: {},
  marking: { type: 'none', color: '#4a4038' }, temperament: 'tranquilo', name, seed: 42
});

test('rechaza archivos que no son partidas', () => {
  assert.throws(() => sanitizeImportedState(null), /save_not_object/);
  assert.throws(() => sanitizeImportedState({ phase: 'unknown' }), /save_bad_phase/);
  assert.throws(() => sanitizeImportedState({ schema: SAVE_SCHEMA + 1, phase: 'egg' }), /save_newer_version/);
});

test('normaliza límites y elimina propiedades desconocidas', () => {
  const imported = sanitizeImportedState({
    phase: 'pet', dna: dna('  Michi\u0000  '), brasas: -900, hambre: 999,
    stageIdx: 999, reserve: new Array(40).fill({ phase: 'pet', dna: dna('Reserva') }),
    unknownPayload: '<script>', demoMode: true
  }, freshState());
  assert.equal(imported.schema, SAVE_SCHEMA);
  assert.equal(imported.brasas, 0);
  assert.equal(imported.hambre, 100);
  assert.equal(imported.stageIdx, 4);
  assert.equal(imported.reserve.length, 25);
  assert.equal(imported.dna.name, 'Michi');
  assert.equal('demoMode' in imported, false);
  assert.equal('unknownPayload' in imported, false);
});

test('una importación no rejuvenece el trial ni sustituye la licencia local', () => {
  const now = Date.now();
  const current = freshState();
  current.trialStart = now - 4 * 86400e3;
  current.trialSeen = 4 * 86400e3;
  current.pro = { active: true, tier: 'lifetime', key: 'local-only' };
  const imported = sanitizeImportedState({ phase: 'egg', trialStart: now, trialSeen: 0, pro: { active: true, key: 'foreign' } }, current);
  assert.equal(imported.trialStart, current.trialStart);
  assert.equal(imported.trialSeen, current.trialSeen);
  assert.equal(imported.pro.key, 'local-only');
});

test('el foco completado recompensa y limpia el temporizador', () => {
  const s = freshState();
  s.phase = 'pet'; s.dna = dna(); s.focus = { kind: 'work', startedAt: Date.now() - 1600e3, endsAt: Date.now() - 1, duration: 25 * 60000 };
  const oldRandom = Math.random; Math.random = () => 1;
  try { applyElapsed(s, 1000); } finally { Math.random = oldRandom; }
  assert.equal(s.focus, null);
  assert.equal(s.brasas, 15);
  assert.equal(s.growth, 5);
  assert.equal(s.fstats.totalN, 1);
  assert.equal(s.fstats.totalMin, 25);
});

test('los códigos de visita se acotan antes de dibujar el SVG', () => {
  const p = sanitizeVisitPayload({ dna: { ...dna('<b>Michi</b>'), color: '" onload="bad' }, stage: 999, owner: 'Amigo\u0000<script>' });
  assert.equal(p.dna.color, '#e8a33d');
  assert.equal(p.stage, 4);
  assert.equal(p.owner.includes('\u0000'), false);
  assert.equal(p.owner.length <= 14, true);
});

test('la fusión concurrente conserva recompensas independientes', () => {
  const base = { brasas: 10, mats: { hilo: 0, escama: 0 } };
  const popup = { brasas: 8, mats: { hilo: 1, escama: 0 } };
  const worker = { brasas: 18, mats: { hilo: 0, escama: 1 } };
  assert.deepEqual(mergeConcurrentValue(base, popup, worker), { brasas: 16, mats: { hilo: 1, escama: 1 } });
});

test('las partidas antiguas no pueden reactivar campos de aceleración', () => {
  const imported = sanitizeImportedState({ phase: 'egg', speedMode: 10, demoMode: true }, freshState());
  assert.equal('speedMode' in imported, false);
  assert.equal('demoMode' in imported, false);
});

test('la primera sesión conserva objetivo, minutos y recuerdo al eclosionar', () => {
  const s = freshState();
  s.focus = { kind: 'work', goal: 'Preparar informe', nominalMinutes: 25, duration: 1500000, endsAt: Date.now() - 1 };
  const oldRandom = Math.random; Math.random = () => 0.5;
  try { applyElapsed(s, 1000); } finally { Math.random = oldRandom; }
  assert.equal(s.phase, 'pet');
  assert.equal(s.pendingFocusReview.goal, 'Preparar informe');
  assert.equal(s.fstats.totalMin, 25);
  assert.equal(s.brasas, 15);
  assert.equal(s.growth, 5);
  assert.equal(s.peces, 2);
  assert.equal(s.memories[0].type, 'birth');
});

test('las recompensas de foco son proporcionales a los minutos nominales', () => {
  assert.equal(focusValue(15), 3);
  assert.equal(focusValue(25), 5);
  assert.equal(focusValue(45), 9);
  assert.equal(focusValue(60), 12);
});

test('el metabolismo permite mantener a la criatura con una comida diaria', () => {
  const s = freshState(); s.phase = 'pet'; s.dna = dna(); s.wokeUntil = Date.now() + 48 * 3600e3;
  const oldRandom = Math.random; Math.random = () => 1;
  try { applyElapsed(s, 24 * 3600e3); } finally { Math.random = oldRandom; }
  assert.ok(s.hambre >= 45 && s.hambre <= 60);
  assert.ok(s.higiene >= 60);
  assert.equal(s.sick, false);
});

test('la migración v1.6 conserva el porcentaje dentro de la etapa', () => {
  const s = sanitizeImportedState({ schema: 5, phase: 'pet', dna: dna(), stageIdx: 1, growth: 200 });
  assert.equal(s.stageIdx, 1);
  assert.equal(s.growth, 125);
});

test('rituales y recuerdos importados quedan acotados', () => {
  const raw = { phase: 'egg', rituals: new Array(20).fill(0).map((_, i) => ({ id: 'r'+i, name: 'Ritual '+i, min: 999, breakMin: -2 })), memories: [] };
  const s = sanitizeImportedState(raw, freshState());
  assert.equal(s.rituals.length, 8); assert.equal(s.rituals[0].min, 180); assert.equal(s.rituals[0].breakMin, 1);
  for (let i = 0; i < 130; i++) addMemory(s, 'focus', 'M' + i, i);
  assert.equal(s.memories.length, 120);
});

test('los recuerdos antiguos en español se convierten en datos traducibles', () => {
  const raw = {
    phase: 'pet',
    dna: { species: 'slime', color: '#e8a33d', name: 'Mochi' },
    focusHistory: [{ at: 10, minutes: 25, goal: 'Preparar informe', result: 'partial' }],
    memories: [
      { type: 'birth', text: 'Mochi nació durante una sesión de foco.', at: 1 },
      { type: 'evolution', text: 'Mochi alcanzó la etapa joven.', at: 2 },
      { type: 'focus', text: 'Preparar informe · Parcialmente', at: 3 }
    ]
  };
  const s = sanitizeImportedState(raw, freshState());
  assert.equal(s.memories[0].meta.name, 'Mochi');
  assert.equal(s.memories[1].meta.stage, 'joven');
  assert.deepEqual(s.memories[2].meta, { name: '', stage: '', goal: 'Preparar informe', result: 'partial' });
});

test('la misión diaria entrega la recompensa una sola vez', () => {
  const s = freshState();
  s.dailyMission = { day: new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate(), type: 'care', target: 2, progress: 0, claimed: false, rewardMat: 'hilo' };
  const before = s.brasas;
  assert.equal(recordMissionProgress(s, 'care', 1), false);
  assert.equal(recordMissionProgress(s, 'care', 1), true);
  assert.equal(recordMissionProgress(s, 'care', 9), false);
  assert.equal(s.brasas, before + 4);
  assert.equal(s.mats.hilo, 1);
});

test('una especie afín reduce la expedición y el botín se reclama una vez', () => {
  const s = freshState(); s.phase = 'pet'; s.dna = { ...dna(), species: 'zorro' }; s.pro = { active: true, tier: 'lifetime' };
  assert.equal(startExpedition(s, 'forest', { dna: s.dna }), true);
  assert.equal(s.expedition.target, 2);
  assert.equal(advanceExpedition(s), false);
  assert.equal(advanceExpedition(s), true);
  const reward = claimExpedition(s);
  assert.equal(reward.relics, 1);
  assert.equal(s.expedition, null);
  assert.equal(claimExpedition(s), null);
  assert.equal(s.memories.at(-1).type, 'expedition');
});

test('Free recibe un Bosque semanal sin afinidad ni reliquias', () => {
  const s = freshState(); s.phase = 'pet'; s.dna = { ...dna(), species: 'zorro' };
  assert.equal(startExpedition(s, 'ruins', { dna: s.dna }), false);
  assert.equal(startExpedition(s, 'forest', { dna: s.dna }), true);
  assert.equal(s.expedition.free, true);
  assert.equal(s.expedition.target, 3);
  assert.equal(advanceExpedition(s), false);
  assert.equal(advanceExpedition(s), false);
  assert.equal(advanceExpedition(s), true);
  const reward = claimExpedition(s);
  assert.equal(reward.brasas, 6);
  assert.equal(reward.relics, 0);
  assert.equal(startExpedition(s, 'forest', { dna: s.dna }), false);
});

test('el Relicario garantiza descubrimientos y conserva duplicados', () => {
  const s = freshState();
  const a = awardRelics(s, 'lagoon', 3, 42);
  assert.equal(a.ids.length, 3);
  assert.ok(a.newIds.length >= 1);
  assert.equal(relicUniqueCount(s), new Set(a.ids).size);
  const total = Object.values(s.relicCollection).reduce((n, r) => n + r.n, 0);
  assert.equal(total, 3);
  awardRelics(s, 'lagoon', 3, 43);
  assert.equal(Object.values(s.relicCollection).reduce((n, r) => n + r.n, 0), 6);
});

test('las reliquias antiguas migran sin perder el contador', () => {
  const raw = freshState(); raw.phase = 'pet'; raw.dna = dna(); raw.relics = 3;
  raw.memories = [{ type:'expedition', at:Date.now(), meta:{ name:'Mochi', route:'lagoon' } }];
  delete raw.relicCollection; raw.schema = 6;
  const s = sanitizeImportedState(raw, freshState());
  assert.equal(Object.values(s.relicCollection).reduce((n, r) => n + r.n, 0), 3);
  assert.ok(Object.keys(s.relicCollection).every(id => ['moon_shell','tide_glass','leviathan_pearl'].includes(id)));
});

test('los accesorios PRO se conservan al importar una partida Free', () => {
  const decorated = { ...dna(), accessory: 'monoculo' };
  const s = sanitizeImportedState({ phase: 'pet', dna: decorated }, freshState());
  assert.equal(s.dna.accessory, 'monoculo');
});

test('importar no reinicia la expedición semanal ni el retoque gratuito', () => {
  const current = freshState(); current.freeExpeditionAt = Date.now() - 1000; current.freeRetouchUsed = true;
  const s = sanitizeImportedState({ phase: 'pet', dna: dna(), freeExpeditionAt: 0, freeRetouchUsed: false }, current);
  assert.equal(s.freeExpeditionAt, current.freeExpeditionAt);
  assert.equal(s.freeRetouchUsed, true);
});

test('el escudo conserva la racha tras perder exactamente un día', () => {
  const s = freshState(); s.phase = 'pet'; s.dna = dna();
  const d = new Date(); d.setDate(d.getDate() - 2);
  s.streak = { count: 4, best: 4, shield: true, last: d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() };
  s.focus = { kind: 'work', startedAt: Date.now() - 1000, endsAt: Date.now() - 1, nominalMinutes: 15, duration: 900000 };
  const oldRandom = Math.random; Math.random = () => 1;
  try { applyElapsed(s, 1000); } finally { Math.random = oldRandom; }
  assert.equal(s.streak.count, 5);
  assert.equal(s.streak.shield, false);
  assert.ok(s.pendingReactions.includes('streak_saved'));
});

test('la senda desbloquea herramientas de forma gradual', () => {
  const s = freshState(); s.fstats.totalN = 3;
  assert.equal(featureUnlocked(s, 'play'), true);
  assert.equal(featureUnlocked(s, 'collection'), false);
  assert.equal(featureUnlocked(s, 'shield'), false);
  s.fstats.totalN = 4;
  assert.equal(featureUnlocked(s, 'collection'), true);
  s.fstats.totalN = 8;
  assert.equal(featureUnlocked(s, 'mastery'), true);
});

test('el trial PRO espera una activación explícita y cuenta días de uso', () => {
  const s = freshState();
  assert.equal(trialStatus(s).available, true);
  assert.equal(trialStatus(s).active, false);
  startTrial(s);
  assert.equal(trialStatus(s).active, true);
  assert.equal(trialStatus(s).remaining, 5);
  const before = s.trialDays.length;
  markTrialUse(s);
  assert.equal(s.trialDays.length, before);
});

test('proyectos y Escudo importados quedan acotados', () => {
  const raw = { phase:'egg', projects:new Array(20).fill(0).map((_,i)=>({id:'p'+i,name:'Proyecto '+i})), activeProjectId:'p2', focusShield:{enabled:true,mode:'firm',sites:['https://www.youtube.com/watch','reddit.com:443'],attempts:-2,recovered:4,schedule:{enabled:true,start:'99:00',end:'17:00',days:[1,9]}} };
  const s = sanitizeImportedState(raw, freshState());
  assert.equal(s.projects.length, 12); assert.equal(s.activeProjectId, 'p2');
  assert.deepEqual(s.focusShield.sites, ['youtube.com','reddit.com']);
  assert.equal(s.focusShield.attempts, 0); assert.deepEqual(s.focusShield.schedule.days, [1]);
});

test('una sesión conserva el proyecto para la revisión', () => {
  const s=freshState();s.phase='pet';s.dna=dna();s.focus={kind:'work',startedAt:Date.now()-1000,endsAt:Date.now()-1,nominalMinutes:25,duration:1500000,projectId:'p-work'};
  const oldRandom=Math.random;Math.random=()=>1;try{applyElapsed(s,1000);}finally{Math.random=oldRandom;}
  assert.equal(s.pendingFocusReview.projectId,'p-work');
});
