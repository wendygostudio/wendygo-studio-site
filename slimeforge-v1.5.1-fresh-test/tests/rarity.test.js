import test from 'node:test';
import assert from 'node:assert/strict';
import { rollDNA, RARITY } from '../common/engine.js';

test('la Forja produce 16 especies y cuatro categorías', () => {
  const species = new Set();
  const buckets = new Set();
  for (let i = 0; i < 20000; i++) {
    const d = rollDNA(); species.add(d.species); buckets.add(RARITY[d.species] || 'común');
  }
  assert.equal(species.size, 16);
  assert.deepEqual([...buckets].sort(), ['LEGENDARIO','común','raro','épico'].sort());
});
