# Daily Growth — 2026-08-27 — Chrome extension permissions

## Estado y cobertura

Ejecución adicional del Daily realizada en `C:\Users\Damian\Documents\WendygoStudio\.integration` el 2026-08-27. Motor único: Codex. No se usaron Claude, Anthropic, cron, `orchestrator.sh` ni otro agente. Se cubrieron ingesta, auditoría, decisión SEO, contenido en seis idiomas, segunda pasada, distribución, validación, journal y entrega aislada. La telemetría real de tokens no está expuesta; no se estimó consumo.

## Datos y decisión

- GSC se refrescó y devolvió datos finales del 2026-07-28 al 2026-08-24: 50 consultas, 50 páginas y 215 pares consulta–página. La exportación reproducible ya existente está en `seo-agent/reports/weekly-gsc-2026-08-27.json`.
- La muestra no cambió respecto al Daily anterior: Forest 152 impresiones/posición 27,5; Pomodoro 47/23,9; garantía UE 32/16,2; TikTok 28/14,8; Pinterest 21/22,3; X/Twitter 11/14,5; Instagram 9/21,1.
- Se excluyeron Pinterest, Instagram, X/Twitter y Forest por cambios muy recientes. La oportunidad elegida fue el cluster de extensiones para estudiantes/privacidad: `/blog/best-chrome-extensions-for-students/` tuvo 5 impresiones en posición 17 y `/blog/is-your-chrome-extension-spying-on-you/` 17 impresiones en posición 35,4. La combinación respalda un ángulo de decisión de instalación, no otra lista genérica.
- Hipótesis: una checklist que traduzca los permisos de Chrome a preguntas concretas puede captar búsquedas de revisión antes de instalar y derivar tráfico cualificado hacia la guía de estudiantes y SlimeForge sin duplicar el análisis posterior a incidentes. Éxito: impresiones, clics, CTR, posición y reparto de consultas de las seis URL nuevas; no se atribuirán instalaciones, sesiones ni activación.

## Medición bloqueada

- GA4: la propiedad comprobada devolvió HTTP 403 y el fallback OAuth devolvió `invalid_grant`. No se registran sesiones, conversiones ni activación.
- Chrome Web Store: no existe exportación oficial en `measurement/cws/`; no se inventan instalaciones.
- Plausible: sigue sin autorización de lectura; no se registran sesiones.

## Artículo nuevo en seis idiomas

- Fuentes nuevas: `content/blog/2026-08-27-chrome-extension-permissions-checklist.md`, `2026-08-27-es-permisos-extensiones-chrome-checklist.md`, `2026-08-27-de-chrome-erweiterungs-berechtigungen-checkliste.md`, `2026-08-27-fr-permissions-extension-chrome-checklist.md`, `2026-08-27-it-permessi-estensioni-chrome-checklist.md` y `2026-08-27-pt-permissoes-extensoes-chrome-checklist.md`.
- Rutas nuevas: `/blog/chrome-extension-permissions-checklist/`, `/es/blog/permisos-extensiones-chrome-checklist/`, `/de/blog/chrome-erweiterungs-berechtigungen-checkliste/`, `/fr/blog/permissions-extension-chrome-checklist/`, `/it/blog/permessi-estensioni-chrome-checklist/` y `/pt/blog/permissoes-extensoes-chrome-checklist/`.
- Cada versión incluye una H1, canonical, siete alternates incluyendo `x-default`, Article + BreadcrumbList + FAQPage JSON-LD, enlaces al cluster y fuentes oficiales de Chrome sobre permisos, privacidad y lista de permisos.
- La ficha enlaza a las seis rutas mediante los seis índices de blog; sitemap y `llms.txt`/`llms-full.txt` quedaron actualizados.

## Mejoras existentes y segunda pasada

- Se actualizó la pieza existente `is-your-chrome-extension-spying-on-you` en sus seis traducciones: fuentes oficiales de Chrome, enlace visible al nuevo ángulo y relación interna actualizada. Es una mejora de una pieza, aplicada de forma consistente a los seis locales.
- La segunda pasada revisó el cluster de estudiantes, Pomodoro y privacidad para no crear otra guía de temporizadores, otra lista de extensiones o una repetición del artículo sobre ModHeader.
- Se comprobó reciprocidad de enlaces, JSON-LD, alternates, sitemap, GEO y destinos internos: 0 enlaces internos faltantes; `/goodbye/` sigue siendo el único candidato huérfano histórico.
- El lint de encoding mantiene 22 HTML históricos con mojibake; las seis fuentes y seis HTML nuevos no presentan ese problema. No se corrigieron archivos sin originales fiables.

## Fuentes externas y distribución

- Fuentes oficiales consultadas: `https://support.google.com/chrome_webstore/answer/186213?hl=en`, `https://developer.chrome.com/docs/extensions/develop/security-privacy/user-privacy?hl=en` y `https://developer.chrome.com/docs/extensions/reference/permissions-list?hl=en`.
- DEV.to: la lectura autenticada local quedó bloqueada por fallo TLS antes de obtener respuesta HTTP. La búsqueda pública encontró una adaptación reciente y muy próxima sobre auditoría de permisos (`https://dev.to/aidevhub/auditing-chrome-extension-permissions-in-2026-a-3-minute-check-4bh2`); no se publicó para evitar duplicación. No se simula actividad.
- Bluesky: la API autenticada funcionó para búsqueda. La consulta sobre permisos mostró publicaciones propias anteriores y conversaciones antiguas/no accionables; no hubo like, follow, respuesta ni publicación. La búsqueda de contenido no justificaba otra interacción sin spam.

## Validación

- QA directo de las seis nuevas: 6/6 con una H1, una canonical, tres bloques JSON-LD, siete alternates y switcher de idioma; los seis índices contienen la tarjeta y el sitemap contiene las seis familias de alternates.
- `npm test`: OK — 7/7.
- Validadores independientes: contenido 276 estructurados + 348 legacy, higiene 0, gobernanza 0, editorial 0, i18n 804 canónicas/6 locales/0 errores, legal 870/0, pricing 36/0, sitio 870/0, auditoría estática 870/0.
- Auditoría local de enlaces: 857 HTML inspeccionados, 0 destinos internos faltantes.
- `npm run validate` no completó porque `render-resource-hubs.mjs --check` detectó 8 hubs históricos desincronizados antes de los validadores restantes.
- `render-blog.mjs --check` detecta 624 páginas por la inyección de switchers derivada que no pertenece al renderer estructurado; no se incluyó ninguna de esas superficies históricas.

## Git y entrega

- El checkout empezó divergente: `main` local estaba 6 commits por delante y 7 por detrás de `origin/main`, con cambios previos, derivados y temporales. Se preservaron fuera del alcance.
- Entrega propia preparada para staging sobre el árbol de `origin/main`: seis fuentes nuevas, seis HTML nuevos, seis fuentes de seguridad mejoradas, seis HTML de seguridad, seis índices de blog, sitemap, GEO (`llms.txt` y `llms-full.txt`) y este journal. Quedan fuera Pinterest previo, renderer-wide HTML, índices temporales, secretos, reportes ya existentes y cambios ajenos.
- Resultado de commit/push: bloqueado y no ejecutado. Las validaciones independientes del alcance pasan, pero `npm run validate` se detiene antes por 8 hubs de recursos históricos desincronizados; la autorización automática exige el gate completo. No se creó commit ni se intentó sortear el bloqueo. El staging alternativo fue solo de inspección y no alteró el índice normal.

## Siguiente experimento

Medir durante al menos 14 días las seis URL nuevas y las dos piezas enlazadas, comparando impresiones, clics, CTR, posición y consultas. No modificar precios ni CTAs hasta recuperar acceso válido a GA4, Plausible y la exportación oficial de CWS; reintentar DEV.to solo con TLS/credencial funcional y sin duplicar la adaptación existente.
