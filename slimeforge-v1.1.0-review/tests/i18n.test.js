import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const langs = ['es','en','de','fr','it','pt_PT'];
const catalogs = Object.fromEntries(langs.map(lang => [lang, JSON.parse(fs.readFileSync(path.join(root, '_locales', lang, 'messages.json'), 'utf8'))]));

test('los seis catálogos contienen exactamente las mismas claves', () => {
  const expected = Object.keys(catalogs.en).sort();
  for (const lang of langs) assert.deepEqual(Object.keys(catalogs[lang]).sort(), expected, 'catálogo incompleto: ' + lang);
});

test('todas las claves declaradas en el HTML existen en cada idioma', () => {
  const html = fs.readFileSync(path.join(root, 'popup', 'popup.html'), 'utf8');
  const keys = [...html.matchAll(/data-i18n(?:-ph|-after|-title|-aria)?="([^"]+)"/g)].map(m => m[1]);
  for (const lang of langs) for (const key of keys) assert.ok(catalogs[lang][key], lang + ' no contiene ' + key);
});

test('los títulos y etiquetas accesibles del HTML son traducibles', () => {
  const html = fs.readFileSync(path.join(root, 'popup', 'popup.html'), 'utf8');
  for (const tag of html.matchAll(/<[^>]+(?:title|aria-label)="[^"]+"[^>]*>/g)) {
    if (tag[0].includes('title=')) assert.match(tag[0], /data-i18n-title=/, tag[0]);
    if (tag[0].includes('aria-label=')) assert.match(tag[0], /data-i18n-aria=/, tag[0]);
  }
});

test('las claves literales usadas desde JavaScript existen en todos los idiomas', () => {
  const js = fs.readFileSync(path.join(root, 'popup', 'popup.js'), 'utf8');
  const keys = [...js.matchAll(/\bt\('([^']+)'\s*(?:,|\))/g)].map(m => m[1]);
  for (const lang of langs) for (const key of keys) assert.ok(catalogs[lang][key], lang + ' no contiene ' + key);
});
