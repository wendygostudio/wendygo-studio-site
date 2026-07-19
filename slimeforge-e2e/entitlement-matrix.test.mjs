import test from 'node:test';
import assert from 'node:assert/strict';

import {
  advanceExpedition,
  freshState,
  startExpedition,
} from '../slimeforge-v1.5.1-fresh-test/common/logic.js';
import {
  proActive,
  proTier,
  startTrial,
  trialStatus,
} from '../slimeforge-v1.5.1-fresh-test/common/license.js';

const DAY = 86_400_000;
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};
const pet = (species = 'zorro') => ({
  dna: { name: 'Mora', species, seed: 42 },
});

test('Free nuevo no activa PRO ni consume la prueba', () => {
  const state = freshState();
  assert.deepEqual(trialStatus(state), { active: false, available: true, remaining: 5 });
  assert.equal(proActive(state), false);
  assert.equal(proTier(state), null);
});

test('la prueba solo empieza por activación explícita', () => {
  const state = freshState();
  startTrial(state);
  assert.equal(trialStatus(state).active, true);
  assert.equal(trialStatus(state).remaining, 5);
  assert.equal(proActive(state), true);
  assert.equal(proTier(state), null);
});

test('el quinto día de uso permanece activo durante ese día', () => {
  const state = freshState();
  state.trialStart = Date.now() - 4 * DAY;
  state.trialDays = ['2099-1-1', '2099-1-2', '2099-1-3', '2099-1-4', today()];
  assert.equal(trialStatus(state).active, true);
  assert.equal(trialStatus(state).remaining, 1);
});

test('cinco días ya usados o una ventana de 14 días caducan la prueba', () => {
  const used = freshState();
  used.trialStart = Date.now() - 6 * DAY;
  used.trialDays = ['2099-1-1', '2099-1-2', '2099-1-3', '2099-1-4', '2099-1-5'];
  assert.equal(trialStatus(used).active, false);
  assert.equal(proActive(used), false);

  const windowed = freshState();
  windowed.trialStart = Date.now() - 15 * DAY;
  windowed.trialDays = [today()];
  assert.equal(trialStatus(windowed).windowExpired, true);
  assert.equal(proActive(windowed), false);
});

test('una licencia activa prevalece y una licencia inactiva no desbloquea', () => {
  const paid = freshState();
  paid.pro = { active: true, tier: 'annual' };
  assert.equal(proActive(paid), true);
  assert.equal(proTier(paid), 'annual');

  paid.pro.active = false;
  assert.equal(proActive(paid), false);
  assert.equal(proTier(paid), null);
});

test('Free solo puede iniciar Bosque semanal sin afinidad', () => {
  const state = freshState();
  assert.equal(startExpedition(state, 'ruins', pet('dragon')), false);
  assert.equal(startExpedition(state, 'forest', pet('zorro')), true);
  assert.equal(state.expedition.free, true);
  assert.equal(state.expedition.target, 3);
  assert.equal(startExpedition(state, 'forest', pet()), false);
});

test('PRO aplica afinidad; al caducar pausa la expedición sin borrarla', () => {
  const state = freshState();
  state.pro = { active: true, tier: 'monthly' };
  assert.equal(startExpedition(state, 'ruins', pet('dragon')), true);
  assert.equal(state.expedition.free, false);
  assert.equal(state.expedition.target, 4);

  state.pro.active = false;
  assert.equal(advanceExpedition(state), false);
  assert.equal(state.expedition.route, 'ruins');
  assert.equal(state.expedition.progress, 0);

  state.pro.active = true;
  assert.equal(advanceExpedition(state), false);
  assert.equal(state.expedition.progress, 1);
});
