import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {alternateLinks, languageSwitcher, liveLocales, localeOrder, locales} from '../scripts/lib/i18n.mjs';

test('locale registry defines six extension-aligned languages', () => {
  assert.deepEqual(localeOrder, ['en', 'es', 'de', 'fr', 'it', 'pt']);
  assert.deepEqual(liveLocales, ['en', 'es', 'de']);
  assert.equal(locales.pt.htmlLang, 'pt-PT');
  assert.equal(locales.pt.hreflang, 'pt-PT');
  assert.equal(locales.pt.extensionLocale, 'pt_PT');
});

test('pending translations are not advertised to crawlers or users', () => {
  const routes = {en: '/', es: '/es/', de: '/de/', fr: '/fr/', it: '/it/', pt: '/pt/'};
  const alternates = alternateLinks(routes);
  const switcher = languageSwitcher(routes, 'en');
  assert.match(alternates, /hreflang="en"/);
  assert.match(alternates, /hreflang="es"/);
  assert.match(alternates, /hreflang="x-default"/);
  assert.match(alternates, /hreflang="de"/);
  assert.doesNotMatch(alternates, /hreflang="(?:fr|it|pt-PT)"/);
  assert.match(switcher, /\/de\//);
  assert.doesNotMatch(switcher, /\/fr\/|\/it\/|\/pt\//);
});

test('CyberChef comparisons preserve its documented client-side privacy model', () => {
  for (const file of [
    'public/blog/free-config-sanitizer-alternatives/index.html',
    'public/es/blog/alternativas-sanitizador-config-gratis/index.html'
  ]) {
    const html = fs.readFileSync(file, 'utf8');
    assert.match(html, /entirely client-side|íntegramente en el cliente/i);
    assert.doesNotMatch(html, /Your config data passes through that server|Tus datos de configuración pasan por ese servidor/i);
  }
});
