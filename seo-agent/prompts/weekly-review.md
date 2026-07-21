# Revisión Semanal

Hoy es {{TODAY}}. Ejecuta TODOS los pasos sin pedir confirmación ni aprobación. El sitio está en `{{SITE_DIR}}`.

---

### Paso 1: Recopilar datos

1. Lee TODOS los journals de la semana en `{{JOURNAL_DIR}}/`.
2. Cuenta artículos publicados esta semana (inglés + español + variaciones).
3. Si hay `analytics-data.json`, analízalo.
4. Revisa sitemap vs contenido real en `public/`.

### Paso 2: Auditoría técnica

Verifica y corrige sin pedir confirmación:
- Links internos rotos (404)
- Sitemap incluye TODAS las páginas (inglés + español + tools)
- Meta descriptions únicas por página y bajo 150 caracteres
- Títulos no repetidos
- JSON-LD válido (HowTo, Article, FAQPage, BreadcrumbList)
- Hreflang tags recíprocos (en↔es)
- robots.txt apunta al sitemap
- Imágenes con alt text (si hay)
- Existe `public/tools/index.html` como índice de herramientas — si no, créalo con tarjetas para cada herramienta en `public/tools/`
- El nav de TODAS las páginas incluye links a Tools (/tools/) y selector de idioma (ES 🌐 o EN 🌐)
- Las páginas en español tienen nav en español con link "EN 🌐" a la versión inglesa
- **Soft-404**: verifica que existe `public/404.html` con diseño del sitio y meta robots noindex. Cloudflare Pages lo sirve automáticamente para rutas inexistentes.
- **Canonicals auto-referenciados**: cada página debe tener `<link rel="canonical">` apuntando a SÍ MISMA (no a la homepage). Las páginas ES apuntan a su URL ES, no a la versión EN.
- **Open Graph completo**: cada página con `og:title`, `og:description`, `og:image` y `twitter:card`. La og:image debe ser una URL absoluta a una imagen que exista físicamente en public/ (verifica que el archivo existe).
- **lang correcto**: páginas en `/es/` deben tener `<html lang="es">`, no `lang="en"`.
- **hreflang absolutos**: los hreflang deben usar URLs completas (https://wendygostudio.com/...), nunca rutas relativas (/es/...).
- **Schema sin duplicados**: ninguna página debe tener el mismo tipo de schema dos veces (ej. dos bloques Article).
- **Consistencia de trailing slash**: sitemap, canonicals y links internos deben usar el MISMO formato de URL (con / final). Elige uno y aplícalo en todo.
- **Título y meta description en TODAS las páginas**: incluyendo privacy, terms, goodbye y tools.

### Paso 3: Análisis de contenido

- ¿Hay variedad de tipos (how-to, comparativas, tutoriales)?
- ¿Las keywords están bien distribuidas o hay canibalización?
- ¿El internal linking es coherente?
- ¿Hay artículos que necesitan actualización?
- ¿Traducciones al español al día?

### Paso 4: Content Hubs — Detectar clusters

Revisa los artículos existentes. Si hay **3+ artículos sobre un mismo tema**, crea una página pilar:

Ejemplo: artículos de resize para YouTube, Instagram, Twitch → crear `public/guides/image-resizing-social-media/index.html` con:
- Resumen de cada plataforma + links a los artículos detallados
- Los artículos individuales enlazan de vuelta a la página pilar
- Schema: Article + BreadcrumbList
- Diseño dark del sitio (CSS inline)

Si no hay masa crítica (menos de 3 por tema), documéntalo y sigue.

### Paso 5: Página principal en español

Si NO existe `public/es/index.html`, créala como traducción de `public/index.html`:
- Misma estructura y diseño
- Textos traducidos naturalmente
- Nav con links a `/es/blog/` en vez de `/blog/`
- Link de idioma "EN 🌐" que lleve a `/`
- Hreflang tags recíprocos con la versión inglesa
- Añadir al sitemap

Si ya existe, verifica que está actualizada con cualquier cambio de la versión inglesa.

### Landing pages por extensión

Si no existen, crea landing pages individuales para cada extensión publicada:
- `public/textforge/index.html` — Landing dedicada de TextForge
- `public/frameforge/index.html` — Landing dedicada de FrameForge
- `public/scrubforge/index.html` — Landing dedicada de ScrubForge
- `public/claimforge/index.html` — Landing dedicada de ClaimForge

Cada landing debe tener:
- Hero con título, descripción y CTA directo al Chrome Web Store
- Lista de features con ejemplos prácticos
- Sección FAQ (3-5 preguntas) con schema FAQPage
- Sección "More from Wendygo Studio" promocionando las otras extensiones (cross-promotion)
- Schema: SoftwareApplication + BreadcrumbList + FAQPage
- Diseño dark del sitio, nav y footer estándar
- Añadir al sitemap

En español también: `public/es/textforge/`, `public/es/frameforge/`, `public/es/scrubforge/`, `public/es/claimforge/`


### Paso 6: Análisis competitivo

Revisa `public/blog/` y compara mentalmente con competidores:
- GoFullPage, Canva (FrameForge)
- CyberChef (TextForge)

Identifica keywords que ellos cubrirían y nosotros no. Guarda en `content/competitive-analysis-{{TODAY}}.md`:
- Keywords encontrados
- Gaps
- Plan de artículos para cerrarlos

### Paso 7: Backlink outreach (SOLO preparar)

Piensa en artículos tipo "best chrome extensions for [developers/creators] 2026" que podrían mencionar nuestras extensiones. Redacta emails breves y personalizados.

Guarda en `{{JOURNAL_DIR}}/outreach-{{TODAY}}.md`:
- Tipo de artículo objetivo
- Email borrador
- Estado: "pendiente de revisión por Damián"

**NUNCA envíes emails — solo prepara.**

### Paso 8: Plan de la próxima semana

Crea `content/weekly-plan-{{TODAY}}.md`:
- Qué artículo principal cada día (alternando TextForge/FrameForge/ScrubForge)
- Qué variaciones generar
- Qué herramienta crear (sugerencia para la tarea weekly-tool)
- Qué contenido optimizar

### Paso 9: Informe semanal

Genera `{{JOURNAL_DIR}}/weekly-{{TODAY}}.md`:

```markdown
# Informe Semanal — Semana del {{TODAY}}

## Resumen
- Artículos principales: X
- Variaciones programáticas: X
- Traducciones ES: X
- Herramientas: X
- Posts Bluesky: X
- Posts Dev.to: X
- Total páginas: X (EN) + X (ES) + X (tools)

## Content Hubs
- Clusters detectados: [lista]
- Pillar pages creadas: [lista]

## Gaps competitivos
- [lista de keywords]

## Outreach preparado
- X emails borrador (pendientes de Damián)

## Plan próxima semana
- [resumen]
```

### Paso 10: Mantenimiento

- Limpia archivos temporales
- Verifica `.gitignore`
- Ejecuta `npm run seo:fix` y `npm run validate` — NO staging, commit ni push

---

## Restricciones
- No borres contenido que tenga tráfico
- Backlink outreach: SOLO preparar, NUNCA enviar
- Si propones un cambio estructural grande, marca con `[REQUIERE APROBACIÓN]`
- Sé honesto en el informe
