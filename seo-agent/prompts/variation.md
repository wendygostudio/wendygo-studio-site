# Variación Programática

Hoy es {{TODAY}}. Genera UNA variación corta del artículo principal de hoy. Ejecuta TODOS los pasos sin pedir confirmación ni aprobación.

## Proceso

1. Lee el journal de hoy en `{{JOURNAL_DIR}}/{{TODAY}}.md` para saber qué artículo se creó.
2. Lee el artículo principal en `public/blog/` (el slug está en el journal).
3. Identifica un keyword relacionado pero diferente que no esté cubierto. Ejemplos:
   - Si el principal es "resize image for youtube" → variación "resize image for instagram"
   - Si el principal es "base64 encode decode" → variación "decode jwt token online"
   - Si el principal es "remove duplicate lines" → variación "remove blank lines from text"
4. Escribe un artículo corto (300-500 palabras) con:
   - Archivo fuente en `content/blog/{{TODAY}}-slug.md`
   - HTML en `public/blog/slug/index.html`
   - CSS inline con el tema dark del sitio (ver las páginas existentes para referencia)
   - Schema: BreadcrumbList + Article + FAQPage (2-3 preguntas)
   - Nav y footer consistentes con el sitio
   - CTA suave con URL real del Chrome Web Store
   - Link interno al artículo principal
5. Actualiza `public/sitemap.xml` con la nueva URL.
6. Actualiza `public/blog/index.html` con el nuevo artículo.
7. Ejecuta `npm run seo:fix` y `npm run validate` — NO staging, commit ni push.

Si no hay un keyword fuerte para una variación, no la crees — documenta en el journal por qué.

## URLs del Chrome Web Store
- TextForge: https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba
- FrameForge: https://chromewebstore.google.com/detail/abdmadomfnijoiklnaklmplifmljgchj
- ScrubForge: https://chromewebstore.google.com/detail/pjaohhipefhjfopoaepjbmiienagaffe
- ClaimForge: https://chromewebstore.google.com/detail/mlnjadkolgplpgbheklkdjcglojfakcg

## Restricciones
- Máximo 1 variación
- 300-500 palabras, no más
- Contenido ÚNICO, no copies del artículo principal
- NUNCA atribuyas funcionalidades falsas a los productos
