# Estado de accesos e integraciones

Última comprobación de medición y catálogo: 2026-09-15.

| Fuente | Estado | Evidencia / siguiente acción |
|---|---|---|
| Search Console | **Operativa** | Lectura final del 2026-09-15: siete días 2026-09-06–12 frente a 2026-08-30–2026-09-05, guardada en `reports/weekly-gsc-2026-09-15.json`; 33/1 frente a 23/0 impresiones/clics. |
| GA4 Data API | **Bloqueada por permisos** | `npm run analytics:refresh` del 2026-09-15: ConvertForge HTTP 403; fallback OAuth HTTP 400 `invalid_grant`. Añadir la cuenta de servicio como Viewer en las seis propiedades o reautorizar OAuth de solo lectura. |
| Chrome Web Store | **Pendiente de exportación** | `measurement/cws/` solo contiene README el 2026-09-15. Las seis fichas públicas muestran versiones e idiomas; ScrubForge 1.15.0 frente a catálogo 1.13.1. No son exports de instalaciones/activación por periodo. |
| DEV.to | **Credencial configurada** | `DEVTO_API_KEY` está presente y `devto-post.js` se conserva activo. Antes de publicar, deduplicar contra los artículos ya publicados y los borradores pendientes. |
| Bluesky | **Credencial configurada** | `BLUESKY_HANDLE` y `BLUESKY_APP_PASSWORD` están presentes; `bluesky-tools.js` conserva post, likes y follows prudentes. Registrar URI y acciones en el journal. |
| Plausible | **No configurada** | `PLAUSIBLE_API_KEY`, `PLAUSIBLE_SITE_ID` y `PLAUSIBLE_URL` están vacíos el 2026-09-15. Configurar y comprobar lectura antes de registrar sesiones. |
| PageSpeed/CWV | **Bloqueada por cuota** | PageSpeed Insights móvil devolvió HTTP 429 el 2026-09-15. El Lighthouse del 11-08 es histórico; repetir lab y obtener campo cuando haya cuota. |
| Verificación de propiedad GA | **Publicada** | `https://wendygostudio.com/analytics.txt` devuelve HTTP 200. Se puede enviar el formulario de recuperación de administrador. |

## Regla para el Daily

No marcar como resuelta una fuente por tener una clave local. Debe existir una
prueba de lectura reciente. Las credenciales sociales permiten publicar, pero no
obligan a publicar: primero se comprueba duplicación, calidad y límites diarios.
Los archivos de `pending-publish/` son cola histórica; no se publican en bloque.
