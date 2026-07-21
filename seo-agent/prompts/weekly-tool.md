# Herramienta Interactiva Semanal

Hoy es {{TODAY}}. Ejecuta TODOS los pasos sin pedir confirmación. Tienes permiso total para crear y editar archivos. Crea UNA herramienta interactiva gratuita en `{{SITE_DIR}}/public/tools/`.

## Proceso

1. Revisa qué herramientas existen ya en `public/tools/`.
2. Lee `content/weekly-plan-*.md` más reciente si existe, para ver si hay una sugerencia.
3. Elige la herramienta que más impacto SEO tenga de la lista de abajo (prioriza las que no existan):

**Para FrameForge:**
- `youtube-thumbnail-checker/` — Arrastra imagen, verifica si cumple 1280×720, <2MB, JPG/PNG
- `social-media-image-sizes/` — Tabla interactiva con tamaños de cada plataforma (YouTube, Instagram, TikTok, X, LinkedIn, Twitch, Pinterest, Facebook)
- `aspect-ratio-calculator/` — Calculadora de aspect ratio con presets de plataformas

**Para TextForge:**
- `line-counter/` — Pega texto, cuenta líneas, palabras, caracteres, líneas únicas, duplicadas
- `text-diff/` — Compara dos textos lado a lado, muestra diferencias resaltadas
- `base64-tool/` — Encode/decode Base64 en el navegador
- `uuid-generator/` — Genera UUIDs v4 con botón de copiar
- `email-extractor/` — Pega texto, extrae todos los emails encontrados
- `json-formatter/` — Pega JSON, formatea/valida/minifica con highlighting de errores
- `csv-to-table/` — Pega CSV, muestra tabla visual con ordenación por columna
- `markdown-preview/` — Editor de Markdown con preview en tiempo real
- `regex-tester/` — Tester de regex con highlighting de matches (keyword 8.4K búsquedas/mes)
- `word-frequency-counter/` — Cuenta frecuencia de cada palabra en un texto con tabla ordenable
- `slug-generator/` — Genera slugs SEO-friendly desde cualquier texto

**Para ScrubForge:**
- `ip-extractor/` — Pega texto, extrae todas las IPs (IPv4 + IPv6) con clasificación public/private
- `config-syntax-checker/` — Pega una config de red, detecta el vendor (Cisco, FortiGate, MikroTik, Juniper, Palo Alto)
- `subnet-calculator/` — Calcula subnets, máscaras, rangos, hosts disponibles, notación CIDR
- `mac-address-lookup/` — Identifica fabricante por MAC address (tabla OUI local embebida)

**Para ClaimForge:**
- `warranty-calculator/` — Introduce fecha de compra, muestra cuántos días de garantía quedan según la ley EU (2 años mínimo)
- `consumer-rights-checker/` — Selecciona tu país EU y tipo de problema (producto defectuoso, entrega tardía, etc.), muestra tus derechos
- `complaint-letter-generator/` — Genera una carta de reclamación formal en inglés/español basada en el tipo de problema
- `gdpr-request-builder/` — Genera solicitudes GDPR (acceso, borrado, portabilidad) listas para enviar

**General (atraen tráfico amplio):**
- `password-generator/` — Generador de contraseñas seguras con longitud y complejidad configurables
- `color-converter/` — Convierte entre HEX, RGB, HSL con preview visual del color

4. Crea `public/tools/nombre-herramienta/index.html` con:
   - HTML + CSS + JS todo inline en un solo archivo
   - Sistema de diseño dark del sitio:
     ```
     --ink: #13151a; --surf: #1c1f26; --line: #2e343f;
     --text: #e7e9ee; --muted: #8b93a3; --amber: #e8a33d;
     --amber2: #f0b75a; --on-a: #13151a;
     ```
   - Nav consistente con el sitio (Extensions, Blog, Tools, How it works, Privacy, ES 🌐)
   - Footer consistente con el sitio
   - Meta description SEO optimizada para la keyword de la herramienta
   - JSON-LD: `WebApplication` + `BreadcrumbList` + **`FAQPage` (obligatorio, ver punto 4b)**
   - Procesamiento 100% local (nada se envía a ningún servidor)
   - Funcional en mobile (responsive)
   - Input claro (textarea, drag & drop, o botón)
   - Output claro (resultado visible inmediatamente)
   - CTA suave al final: "Need more power? Try [Extension] — free on the Chrome Web Store" con URL real

4b. **FAQ obligatoria** (auditoría 2026-07-19 detectó que ninguna herramienta existente la tenía — no repitas ese hueco):
   - 4-6 preguntas reales sobre la herramienta (privacidad de los datos, límites, formato soportado, diferencias con conceptos similares). Basa las respuestas SOLO en lo que la herramienta realmente hace — nunca inventes funcionalidad para rellenar una pregunta.
   - Markup HTML (reutiliza el patrón ya usado en `public/blog/*` y en las 7 tools existentes):
     ```html
     <div class="info-card"> <!-- o .info-section si esa es la plantilla de la página -->
       <h2>Frequently asked questions</h2>
       <div class="faq-list">
         <div class="faq-item">
           <p class="faq-q">Pregunta</p>
           <p class="faq-a">Respuesta</p>
         </div>
       </div>
     </div>
     ```
     CSS necesario (añadir a `<style>` si la plantilla no lo trae ya):
     ```css
     .faq-list { margin: 24px 0; display: flex; flex-direction: column; gap: 12px; }
     .faq-item { padding: 18px 20px; background: var(--surf); border: 1px solid var(--line); border-radius: 10px; }
     .faq-q { font-size: 15px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
     .faq-a { font-size: 14px; color: var(--muted); line-height: 1.6; }
     ```
   - JSON-LD: añade un objeto `{"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "...", "acceptedAnswer": {"@type": "Answer", "text": "..."}}]}` al array existente (junto a `WebApplication` y `BreadcrumbList`). El texto de `name`/`text` debe ser idéntico al HTML visible.

4c. **Related Tools obligatorio** — cross-link a 2-3 páginas ya existentes (`public/tools/`, `public/guides/`, o un post de blog relevante). Nunca enlaces a una URL que no exista.
   - Markup:
     ```html
     <div class="related">
       <div class="related-label">Related tools</div>
       <div class="related-links">
         <a class="related-link" href="/tools/otra-herramienta/">
           Título de la otra herramienta
           <span>Por qué es relevante para quien usa esta</span>
         </a>
       </div>
     </div>
     ```
     CSS (añadir si falta):
     ```css
     .related { margin: 32px 0 0; }
     .related-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--faint); margin-bottom: 14px; }
     .related-links { display: flex; flex-direction: column; gap: 10px; }
     .related-link { display: block; padding: 14px 16px; background: var(--surf); border: 1px solid var(--line); border-radius: 10px; text-decoration: none; color: var(--text); font-size: 14px; font-weight: 600; }
     .related-link span { display: block; font-size: 12px; color: var(--faint); font-weight: 400; margin-top: 2px; }
     ```
   - **Reciprocidad**: añade también un link de vuelta hacia la herramienta nueva en el bloque "Related tools" de cada una de esas 2-3 páginas existentes (edítalas). Un enlace de solo ida no reparte autoridad SEO.

5. Crea la versión en español en `public/es/tools/nombre-herramienta/index.html`:
   - Traducción natural (no literal) de todo el contenido visible, incluyendo la FAQ y los campos de texto del JSON-LD (`name`/`description` de `WebApplication`, `name`+`text` de cada `Question`/`Answer`). No dejes nada en inglés.
   - hreflang bidireccional en ambas versiones (ver `translate-es.md` para el patrón exacto — mismo criterio aplica aquí).
   - Nav con `<a href="/tools/nombre-herramienta/" class="lang-switch">EN 🌐</a>` en la versión ES.
   - Actualiza `public/es/tools/index.html` con la tarjeta de la nueva herramienta.
   - Si por lo que sea no te da tiempo a traducir en esta misma ejecución, documéntalo explícitamente en el journal de hoy como pendiente — nunca dejes una herramienta nueva sin su par ES sin registrarlo (la auditoría de indexación del 2026-07-13 ya penalizó una vez la cobertura ES incompleta).

6. Actualiza `public/sitemap.xml` con la nueva URL (EN y ES) y su hreflang recíproco
7. Actualiza `public/tools/index.html` — añade tarjeta para la nueva herramienta
8. Añade links a la herramienta desde artículos relacionados del blog
9. Ejecuta `npm run seo:fix` y `npm run validate` — NO staging, commit ni push

## URLs del Chrome Web Store
- TextForge: https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba
- FrameForge: https://chromewebstore.google.com/detail/abdmadomfnijoiklnaklmplifmljgchj
- ScrubForge: https://chromewebstore.google.com/detail/pjaohhipefhjfopoaepjbmiienagaffe

## Restricciones
- Máximo 1 herramienta por ejecución
- Todo el procesamiento en el navegador, NUNCA enviar datos a servidores
- La herramienta debe funcionar realmente (no un mockup)
- NUNCA atribuyas funcionalidades falsas a los productos
- Ninguna herramienta se considera terminada sin: FAQ + `FAQPage` schema (punto 4b), Related Tools recíproco (punto 4c), y versión `/es/tools/` (punto 5, o su pendiente documentado en el journal)
