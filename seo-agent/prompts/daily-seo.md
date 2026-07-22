# Rutina Diaria de SEO — Artículo Principal

Hoy es {{TODAY}}. Estás trabajando en el sitio de Wendygo Studio ubicado en `{{SITE_DIR}}`. Ejecuta TODOS los pasos sin pedir confirmación ni aprobación. Tienes permiso total para crear y editar cualquier archivo en este directorio.

## Fuente de verdad obligatoria

Antes de elegir tema o escribir una sola frase, lee `{{SITE_DIR}}/data/products.json`.
Ese catálogo prevalece sobre cualquier versión, permiso, URL de tienda o estado
duplicado más abajo en este prompt. Si hay una contradicción, usa el catálogo y
registra la discrepancia en el journal; no edites el catálogo durante una
ejecución autónoma. No menciones números de versión en contenido público salvo
que la intención de búsqueda lo exija.

Antes de terminar, ejecuta desde `{{SITE_DIR}}`:

```bash
npm run seo:fix
npm run validate
```

Una ejecución con validación fallida no está terminada y no puede publicarse.

## Recordatorio crítico — Productos reales

- **TextForge v1.6.0** — Toolkit de texto con 58 funciones + recetas encadenables + compositor IA local (Gemini Nano, on-device): describe lo que quieres y la IA construye el pipeline. Forge Magic detecta JSON/Base64/hex al pegar. Regex find & replace (Pro), recetas y composiciones ilimitadas (Pro).
- **FrameForge v2.0.0** — Redimensionador de imágenes y thumbnails con DOS IAs locales: eliminación de fondos (U²-Net) y ampliación 2×/4× (ESRGAN), ilimitado y sin subidas. Crop a tamaños de plataforma (YouTube, Instagram, Twitch, X), 12 efectos, texto/logo overlay, batch (Pro). NO es una herramienta de screenshots.
- **ScrubForge v1.13.1** — Sanitizador de configs de red. 120+ patrones, 12 fabricantes, secretos de servicios (AWS/GitHub/Slack/JWT), perfiles de contexto, revisión antes de sanear, diccionario custom import/export. Detecta y reemplaza datos sensibles con tokens consistentes que preservan la estructura lógica. BYOK con 5 proveedores IA.
- **ClaimForge v1.4.0** — Asistente de derechos del consumidor UE con IA local. Analizador de respuestas del vendedor (pega el email de la tienda → detecta excusas ilegales → contraargumento legal), redacción de cartas con Gemini Nano, garantías, devoluciones, derecho a reparación, GDPR. 6 países UE.
- **ConvertForge v1.5.0** — Conversor de archivos local: imágenes (HEIC…), audio, documentos (OCR local con Tesseract), datos (JSON/CSV/YAML/XLSX). Router drag-and-drop universal. Trial PRO de 5 días. Publicada en CWS.
- **SlimeForge v1.8.0** — Pomodoro timer & focus pet: pomodoro completo (15/25/45/60, descansos, stats, rachas) + mascota slime virtual que eclosiona y crece con las sesiones de foco (Brasas 🔥). 16 especies, cuidados, misiones, minijuegos, crafteo, visitas entre amigos; pasea por las páginas (opcional) y charla con Gemini Nano on-device en 6 idiomas. Gacha ético: dinero real jamás compra azar. Trial PRO 5 días. Publicada en CWS: https://chromewebstore.google.com/detail/dobhabpmcmpfdihchnhbickecelihhbc

**Todas: interfaz en 6 idiomas (EN/ES/FR/DE/IT/PT). Si no estás 100% seguro de que un producto tiene una feature, NO la menciones.**

URLs reales del Chrome Web Store:
- TextForge: https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba
- FrameForge: https://chromewebstore.google.com/detail/abdmadomfnijoiklnaklmplifmljgchj
- ScrubForge: https://chromewebstore.google.com/detail/pjaohhipefhjfopoaepjbmiienagaffe
- ClaimForge: https://chromewebstore.google.com/detail/mlnjadkolgplpgbheklkdjcglojfakcg
- ConvertForge: https://chromewebstore.google.com/detail/mjmamnnhophdhccknmgnppcdkojkpagj
- SlimeForge: https://chromewebstore.google.com/detail/dobhabpmcmpfdihchnhbickecelihhbc

---

### Paso 1: Evaluar el estado actual

1. Lee el journal de ayer en `{{JOURNAL_DIR}}/` para saber qué se hizo y qué estaba planeado.
2. Comprueba cuántas páginas/posts hay en `content/blog/` y en `public/blog/`.
3. Revisa `public/sitemap.xml` para saber qué está publicado.
4. Si hay un archivo `analytics-data.json`, léelo para ver qué contenido tiene tracción.

### Paso 1a: Decidir si debe existir una URL nueva

Antes de elegir producto o formato, busca la intención en `content/`, `public/`,
el sitemap y los hubs de `/resources/` y `/es/recursos/`. Una ejecución no tiene
obligación de crear una URL.

Solo se permite una URL nueva cuando se cumplen todas estas condiciones:

1. Responde a una intención de búsqueda distinta que ninguna URL existente cubre bien.
2. Aporta un ejemplo, comparación, flujo o evidencia que no esté ya publicado.
3. Tiene una landing de producto y un hub temático claros a los que enlazar.
4. Puede recibir al menos dos enlaces internos reales sin inventar rutas.
5. Las afirmaciones verificables proceden de `data/products.json`; las legales,
   además, de fuentes oficiales vigentes.

Si una página existente cubre la intención, actualízala en vez de crear otra.
Si no hay aportación diferencial suficiente, no publiques: documenta la decisión
en el journal. Registra siempre `targetHub`, `competingUrls` y `whyNewUrl`.

### Paso 1b: Elegir el PRODUCTO antes que el tipo de artículo

Esto va antes de decidir el tipo (Paso 2). Cuenta cuántos posts existentes mencionan cada producto en el título, en ambos idiomas:

```bash
for p in TextForge FrameForge ScrubForge ClaimForge ConvertForge SlimeForge; do
  n=$(grep -ril "$p" public/blog/*/index.html public/es/blog/*/index.html 2>/dev/null | wc -l)
  echo "$n  $p"
done | sort -n
```

**El artículo de esta ejecución es SIEMPRE sobre el producto que salga primero en esa lista (el de menos cobertura).** En caso de empate, prioriza el producto lanzado más recientemente (mira la fecha en el bloque "Productos reales" de arriba). Esto es una regla dura, no una sugerencia: no elijas el producto por lo que te resulte más fácil de escribir ese día ni por keywords que tengas más a mano — cuenta primero, luego escribe. Un producto recién publicado (0 artículos) siempre gana a uno con cobertura, sin excepción, hasta que deje de estar en último lugar.

**Tope anti-monotema (excepción única a la regla anterior): máximo 2 artículos consecutivos sobre el mismo producto.** Antes de fijar el producto, mira los títulos de los 2 posts más recientes de `public/blog/` (ordena los directorios por fecha de `content/blog/` o por el `datePublished` del schema). Si AMBOS son ya del producto que ha salido primero en el recuento, salta al SEGUNDO producto con menos cobertura para esta ejecución. Un blog que publica 5-8 posts seguidos del mismo producto parece spam tanto para un lector como para Google — el producto rezagado recupera cobertura igualmente, solo que intercalado.

**Si el orquestador ejecuta esta rutina 2 veces en el mismo día:** el recuento del Paso 1b se hace contra el sistema de ficheros en el momento de cada ejecución, así que si la 1ª ejecución ya escribió su artículo en `public/blog/` antes de que arranque la 2ª, el recuento de la 2ª ya reflejará ese +1 y automáticamente saldrá otro producto distinto en primer lugar. **Las 2 ejecuciones deben ser secuenciales, nunca en paralelo.** El orquestador debe esperar a que la primera ejecución termine y supere la validación integral antes de lanzar la segunda.

**Publicar 2 al día NO es motivo para abreviar el proceso de ninguno de los dos.** Cada ejecución —sea la 1ª o la 2ª del día— sigue el pipeline completo de este documento sin recortar ningún paso: investigación de keywords real (Paso 2), 600-900 palabras (Paso 3), los 3 schemas obligatorios, actualización de sitemap/blog index/enlaces internos (Paso 4), y journal (Paso 6). La restricción de "Máximo 1 artículo por ejecución" (ver Restricciones más abajo) sigue vigente sin cambios —  2 al día se consigue ejecutando la rutina dos veces, nunca metiendo 2 artículos en una sola ejecución.

### Paso 2: Decidir qué tipo de contenido crear (para el producto ya elegido en el Paso 1b)

**Tipo A — Guía práctica (how-to)**
Keywords para TextForge:
- "how to remove duplicate lines online"
- "how to extract emails from text"
- "how to convert text to uppercase bulk"
- "how to sort lines alphabetically online"
- "how to clean pasted text formatting"
- "how to generate uuid in browser"
- "base64 encode decode online tool"

Keywords para FrameForge:
- "how to resize image for youtube thumbnail"
- "best thumbnail maker chrome extension"
- "resize image for instagram chrome"
- "how to crop image to social media sizes"
- "image resizer for content creators"
- "batch resize images chrome extension"

Keywords para ScrubForge:
- "how to sanitize network config before sharing"
- "remove sensitive data from cisco config"
- "fortigate config sanitizer"

Keywords para ClaimForge:
- "EU consumer rights warranty"
- "how to claim warranty in Europe"
- "right to repair EU law"
- "how to return product EU consumer law"
- "GDPR rights explained simply"
- "EU warranty 2 years law"
- "consumer protection chrome extension"
- "how to file consumer complaint EU"

**Tipo B — Comparativa** (honesta y justa)
- "TextForge vs CyberChef for text manipulation"
- "FrameForge vs Canva for quick thumbnails"
- "best image resizer chrome extensions"

**Tipo C — Tutorial técnico**
- "youtube thumbnail workflow for content creators"
- "text cleanup workflow for data entry"
- "sysadmin config sharing workflow"

**Tipo D — Top of funnel**
- "best chrome extensions for content creators 2026"
- "must-have chrome extensions for developers 2026"
- "chrome extensions for sysadmins"

**Tipo E — Caso de uso (landing page)**
Página dedicada a un caso de uso específico. Más corta que un artículo (400-600 palabras), directa al problema y la solución. Va en `public/use-cases/slug/index.html`.
- "youtube thumbnail creator" → landing de FrameForge
- "cisco config sanitizer" → landing de ScrubForge
- "bulk text cleaner" → landing de TextForge
- "instagram image resizer" → landing de FrameForge
- "network config anonymizer for AI" → landing de ScrubForge
- "EU warranty checker" → landing de ClaimForge (NO linkear al store)
- "consumer complaint assistant" → landing de ClaimForge (NO linkear al store)
- "GDPR rights tool" → landing de ClaimForge (NO linkear al store)

**Tipo F — Alternativas a competidores**
Captura tráfico de gente buscando cambiar de herramienta. Tono honesto, no agresivo.
- "best alternatives to CyberChef"
- "GoFullPage alternatives chrome"
- "Canva alternatives for quick thumbnails"
- "free config sanitizer alternatives"
- "best consumer rights apps EU"
- "alternatives to hiring a lawyer for consumer claims"

**Tipo G — Integración / Workflow**
Cómo usar nuestras extensiones con otras herramientas populares.
- "how to use ScrubForge with ChatGPT"
- "TextForge workflow for VS Code users"
- "FrameForge for Notion documentation screenshots"
- "ScrubForge + Claude AI for network troubleshooting"
- "TextForge for cleaning API responses"
- "how to use ClaimForge for Amazon returns"
- "ClaimForge + GDPR: request your data deletion"
- "ClaimForge for warranty claims on electronics"

### Criterios de decisión (tipo de artículo, el producto ya está fijado en el Paso 1b)

- Cuando haya 5+ artículos de un producto, empieza a crear páginas de Tipo E (caso de uso) y Tipo F (alternativas) para ese producto — convierten mejor que los how-to genéricos.
- Los Tipo G (integración) son ideales para ScrubForge porque su público (sysadmins) busca workflows específicos con herramientas que ya usan.
- Alterna tipos: no repitas el mismo tipo dos días seguidos para el mismo producto.
- Dentro del producto elegido, prioriza keywords no cubiertos (revisa `content/` y `public/blog/`).
- Si hay datos de analytics, prioriza temas con impresiones.

### Paso 3: Crear el artículo

1. **Archivo fuente:** `content/blog/YYYY-MM-DD-slug.md`. Su frontmatter obligatorio es:
   ```yaml
   ---
   schemaVersion: 1
   title: "Título SEO"
   description: "Descripción SEO"
   date: YYYY-MM-DD
   slug: slug
   locale: en
   translationKey: slug-estable-compartido-entre-idiomas
   product: textforge|frameforge|convertforge|scrubforge|claimforge|slimeforge
   contentType: how-to|comparison|tutorial|top-of-funnel|use-case|alternatives|workflow
   primaryKeyword: "keyword principal"
   relatedPages: /producto/,/blog/otro-slug/
   ---
   ```
   Para ClaimForge añade también `jurisdiction`, `reviewedAt`, `reviewDue` (máximo 90 días) y `sourceUrls` con fuentes oficiales vigentes. Si no puedes verificar una afirmación legal en una fuente oficial actual, no publiques esa afirmación.
2. **HTML:** `public/blog/slug/index.html`
3. **CSS inline** con el sistema de diseño dark del sitio (ver system prompt) — **incluye el nav con el menú móvil (checkbox hack) completo, HTML+CSS, tal como está documentado en `system-prompt.md` → "Nav — OBLIGATORIO incluir el menú móvil"**. No copies una plantilla de nav de un artículo antiguo sin comprobar antes que ese artículo ya tiene el menú móvil aplicado (búscalo con `grep -c nav-toggle` sobre el archivo que vayas a usar como base) — si no lo tiene, estás propagando la versión rota.
4. **600-900 palabras** con H1 = keyword principal, H2s, ejemplo práctico, CTA suave
5. **Sección FAQ** al final con 3-5 preguntas frecuentes visibles en el HTML
5b. **Ritmo visual obligatorio:** evita bloques largos de texto plano. Cada artículo debe usar, cuando encaje de forma natural, al menos 3 recursos visuales distribuidos por el cuerpo: un blockquote Markdown como idea clave o advertencia, una lista breve o tabla, y una tarjeta reutilizable (`step-card` o `key-points`). No inventes relleno para cumplir la cuota. Consulta `src/blog/EDITORIAL_STYLE.md` y reutiliza únicamente las clases documentadas allí.
6. **Antes de pasar al Paso 4:** verifica `<title>` (≤60 caracteres) y `meta description` (≤150 caracteres) con el script de `system-prompt.md` → sección Analytics, y confirma que `og:title`/`twitter:title`/`og:description`/`twitter:description` son copias literales de los mismos textos.
7. **Verificación de encoding:** ejecuta `python3 {{AGENT_DIR}}/scripts/content-lint.py public/blog/<slug>/` sobre el artículo recién creado. Debe salir "OK". Si detecta BOM, mojibake (`â€"`, `Ã©`, `ðŸ`) o comillas tipográficas en atributos, repáralo con `--fix` antes de continuar — ver "REGLAS DE ENCODING" en `system-prompt.md`.

#### Schema markup OBLIGATORIO:

**BreadcrumbList:**
```json
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
  {"@type":"ListItem","position":1,"name":"Home","item":"https://wendygostudio.com/"},
  {"@type":"ListItem","position":2,"name":"Blog","item":"https://wendygostudio.com/blog/"},
  {"@type":"ListItem","position":3,"name":"TITULO"}
]}
```

**Article:**
```json
{"@context":"https://schema.org","@type":"Article","headline":"...","description":"...","datePublished":"YYYY-MM-DD","dateModified":"YYYY-MM-DD","author":{"@type":"Organization","name":"Wendygo Studio","url":"https://wendygostudio.com"},"publisher":{"@type":"Organization","name":"Wendygo Studio","url":"https://wendygostudio.com"}}
```

**FAQPage** (las preguntas DEBEN estar visibles en el HTML):
```json
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
  {"@type":"Question","name":"Pregunta","acceptedAnswer":{"@type":"Answer","text":"Respuesta"}}
]}
```

**HowTo** (solo en guías paso a paso)

### Paso 4: Actualizar el sitio

1. Actualiza `public/sitemap.xml` con la nueva URL
2. Actualiza `public/blog/index.html` — añade el artículo como `<a class="post-item">`
3. **Enlaces internos — regla dura, no opcional.** Cada artículo nuevo lleva como mínimo 2 y como máximo 4 enlaces internos dentro del cuerpo del texto (no cuentan nav, footer ni el CTA final):
   - 1 enlace a la **landing del producto** (`/textforge/`, `/slimeforge/`, etc.) integrado en una frase, no como botón suelto.
   - 1-2 enlaces a **posts previos relacionados**: lista los títulos existentes con `grep -h '<title>' public/blog/*/index.html` y elige por afinidad temática real (misma keyword-familia o mismo producto). Usa anchor text descriptivo del tema destino, nunca "click here" ni el título completo con "| Wendygo Studio".
   - Los enlaces van repartidos por el cuerpo (uno en el primer tercio del artículo), no amontonados al final en una sección "Related".
   - NUNCA enlaces a un slug que no exista — verifica cada href con `ls public/blog/<slug>/index.html` antes de escribirlo.
4. Verifica nav y footer consistentes

### Paso 5: Optimización de contenido existente (si hay datos)

Si hay `analytics-data.json`:
- Impresiones altas + CTR bajo (<3%) → reescribe title y meta description
- Posición 8-20 → refuerza contenido

### Paso 6: Escribir el journal

En `{{JOURNAL_DIR}}/{{TODAY}}.md`:
- Qué artículo creaste
- Keyword atacado y por qué
- Decisiones tomadas
- Plan para mañana
- Slug del artículo creado (IMPORTANTE: las tareas posteriores lo necesitan)

### Paso 7: validación final

Ejecuta `npm run seo:fix` y `npm run validate`. No hagas staging, commit ni push: el orquestador solo versionará rutas editoriales después de superar la puerta de calidad.

---

## Restricciones

- Máximo 1 artículo por ejecución. Si el orquestador quiere 2 artículos ese día, ejecuta esta rutina completa dos veces de forma secuencial (nunca en paralelo) — no generes 2 artículos dentro de la misma ejecución.
- No borres contenido existente
- **NUNCA atribuyas funcionalidades falsas a los productos**
- Si no encuentras una buena keyword, no publiques — documéntalo en el journal
