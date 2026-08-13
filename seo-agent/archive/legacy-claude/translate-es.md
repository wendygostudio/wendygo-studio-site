# Traducción al Español

Hoy es {{TODAY}}. Traduce el artículo principal de hoy al español. Ejecuta TODOS los pasos sin pedir confirmación.

IMPORTANTE: Traduce TODO el contenido del artículo al español, incluyendo todos los párrafos, listas, secciones, FAQ y los campos de texto del JSON-LD (headline, description, preguntas y respuestas — ver detalle más abajo). No dejes NINGÚN texto en inglés. Reescribe el HTML completo del body y del head, no uses sed ni reemplazos parciales — escribe el archivo entero traducido.

## Proceso

1. Lee el journal de hoy en `{{JOURNAL_DIR}}/{{TODAY}}.md` para saber qué artículo se creó.
2. Lee el HTML del artículo principal en `public/blog/` (el slug está en el journal).
3. Traduce el artículo completo al español:
   - Traducción natural, NO literal
   - Adapta las keywords al español (la traducción literal no siempre es la más buscada)
   - Ejemplos: "how to resize image" → "cómo redimensionar imagen", "remove duplicate lines" → "eliminar líneas duplicadas"
   - Traduce también la sección FAQ
   - **Traduce también el JSON-LD — TODOS los campos de texto, no solo el HTML visible.** Una auditoría del 17-jul-2026 encontró 39 de 52 posts ES con el `headline` y `description` del schema `Article` (y las `Question`/`acceptedAnswer` del `FAQPage`) todavía en inglés, porque una versión anterior de este prompt decía lo contrario ("Google los procesa mejor en inglés" — **eso era incorrecto**, Google recomienda que el structured data coincida con el idioma del contenido visible de la página). Campos que SÍ debes traducir dentro de cada bloque `<script type="application/ld+json">`: `headline`, `description` (Article), `name`+`text` de cada `Question`/`Answer` (FAQPage), `name` de cada `HowToStep` (HowTo). Campos que NO se traducen porque no son texto de lectura: `@context`, `@type`, `url`, `datePublished`, `dateModified`, IDs y URLs de imagen.
   - Verifica el resultado: `headline` del JSON-LD debe ser idéntico (o muy próximo) al `<h1>` visible de la página en español, nunca en inglés.
4. Crea el HTML en `public/es/blog/slug-en-español/index.html`
5. Usa el mismo diseño dark (copia la estructura CSS del artículo original)
6. El nav en páginas españolas debe tener `<a href="/blog/" class="lang-switch">EN 🌐</a>` en vez de `<a href="/es/blog/" class="lang-switch">ES 🌐</a>`
7. **Título y meta description en español, dentro de límite.** El español suele ocupar un 15-20% más de caracteres que el inglés equivalente — no traduzcas el `<title>`/`meta description` palabra por palabra si eso te saca del límite. Objetivo: `<title>` ≤60 caracteres (incluyendo "| Wendygo Studio"), `meta description` ≤150. Verifica igual que en el artículo EN (ver `system-prompt.md`, sección Analytics) antes de continuar, y copia el mismo texto en `og:title`/`twitter:title` y `og:description`/`twitter:description`.

8. Añade hreflang tags en AMBAS versiones:

En la versión inglesa (edita el archivo existente), añade dentro de `<head>`:
```html
<link rel="alternate" hreflang="en" href="https://wendygostudio.com/blog/slug/" />
<link rel="alternate" hreflang="es" href="https://wendygostudio.com/es/blog/slug-es/" />
```

En la versión española:
```html
<link rel="alternate" hreflang="es" href="https://wendygostudio.com/es/blog/slug-es/" />
<link rel="alternate" hreflang="en" href="https://wendygostudio.com/blog/slug/" />
```

9. Actualiza `public/es/blog/index.html` — si no existe, créalo copiando la estructura de `public/blog/index.html` pero con textos en español.
10. Actualiza `public/sitemap.xml` con la URL española.
11. Ejecuta `npm run seo:fix` y `npm run validate` — NO staging, commit ni push.

## Alcance de cada ejecución (sustituye a la antigua regla "solo el principal")

Cada run traduce, en este orden:

1. **El artículo principal de hoy** (el del journal, como siempre).
2. **La variación de hoy**, si existe (el journal la documenta; también puedes detectarla como el otro directorio de `public/blog/` con fecha de hoy en `content/blog/{{TODAY}}-*.md`). El proceso es idéntico al del principal: HTML completo traducido, hreflang bidireccional, sitemap, índice ES.
3. **1 artículo del backlog** — posts EN antiguos que nunca se tradujeron. Detéctalos así:

```bash
grep -L 'hreflang="es"' public/blog/*/index.html
```

   Todo fichero que salga en esa lista es un post sin par ES. Elige **el más antiguo** (menor `datePublished` en su schema Article) y tradúcelo con el mismo proceso completo. Si la lista sale vacía, el backlog está liquidado — documéntalo en el journal y no traduzcas nada extra.

Si el artículo principal no existe todavía, salta los puntos 1-2, documéntalo, y haz solo el punto 3.

## Restricciones
- **Encoding:** guarda todo como UTF-8 sin BOM, con comillas rectas `"` en atributos HTML. El español tiene tildes y ñ en cada línea — si el archivo se corrompe a doble codificación verás `Ã©`/`Ã±` por todas partes. Tras crear cada traducción ejecuta `python3 {{AGENT_DIR}}/scripts/content-lint.py public/es/blog/<slug-es>/` y repara con `--fix` si señala algo (ver "REGLAS DE ENCODING" en `system-prompt.md`).
- Máximo 3 traducciones por ejecución (principal + variación + 1 backlog). No vacíes el backlog de golpe aunque sea tentador: 1 por run mantiene el ritmo de publicación natural del sitio.
- El slug ES nunca es el slug EN copiado tal cual: tradúcelo (`convert-csv-to-json-free` → `convertir-csv-a-json-gratis`). Si al crear el directorio ya existiera, comprueba si es una traducción previa (entonces solo falta el hreflang en el EN — añádelo y no dupliques) o elige un slug ES distinto.

## REGLA CRÍTICA — Enlaces internos en la traducción

Al traducir, los enlaces internos del artículo original (href="/blog/...") NO se traducen automáticamente:
1. Para cada enlace interno del original, comprueba si existe una versión ES con `ls {{SITE_DIR}}/public/es/blog/<slug-es>/index.html`.
2. Si existe → usa la ruta /es/blog/<slug-es>/.
3. Si NO existe → mantén el enlace a la versión EN original (/blog/<slug>/). NUNCA inventes un slug ES que no exista.
4. El enlace al producto siempre apunta a la landing que exista: /es/textforge/, /es/frameforge/, /es/scrubforge/, /es/claimforge/, /es/convertforge/ (todas existen ya).
5. Añade la página ES nueva a public/sitemap.xml con su par hreflang en el mismo run.
