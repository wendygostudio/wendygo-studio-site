# Estado de accesos e integraciones

Última comprobación de medición y catálogo: 2026-09-01.

| Fuente | Estado | Evidencia / siguiente acción |
|---|---|---|
| Search Console | **Operativa** | Refresco del 2026-09-01: 50 páginas, 50 consultas y 55 pares consulta–página visibles para 2026-08-02 → 2026-08-29. Comparación semanal exacta 2026-08-23–29 frente a 2026-08-16–22 guardada en `reports/weekly-gsc-2026-09-01.json`. |
| GA4 Data API | **Bloqueada por permisos** | Comprobación del 2026-09-01: la primera propiedad devuelve HTTP 403. El fallback OAuth también devuelve `invalid_grant`; añadir la cuenta de servicio como Viewer en las seis propiedades o reautorizar el OAuth de solo lectura. |
| Chrome Web Store | **Pendiente de exportación** | `measurement/cws/` solo contiene README. Las seis fichas públicas respondieron HTTP 200 el 2026-09-01; ScrubForge sigue en 1.15.0 frente a 1.13.1 local. Las fichas no sustituyen instalaciones/activación por periodo. |
| DEV.to | **Credencial configurada** | `DEVTO_API_KEY` está presente y `devto-post.js` se conserva activo. Antes de publicar, deduplicar contra los artículos ya publicados y los borradores pendientes. |
| Bluesky | **Credencial configurada** | `BLUESKY_HANDLE` y `BLUESKY_APP_PASSWORD` están presentes; `bluesky-tools.js` conserva post, likes y follows prudentes. Registrar URI y acciones en el journal. |
| Plausible | **No configurada** | `PLAUSIBLE_API_KEY` y `PLAUSIBLE_SITE_ID` están vacíos. La respuesta HTTP 401 del 2026-09-01 procede de una petición sin credencial válida; configurar ambos valores antes de registrar sesiones. |
| PageSpeed/CWV | **Bloqueada por cuota** | PageSpeed Insights devolvió HTTP 429 el 2026-09-01. El Lighthouse del 11-08 es histórico porque la home cambió después; repetir lab y obtener campo cuando haya cuota. |
| Verificación de propiedad GA | **Publicada** | `https://wendygostudio.com/analytics.txt` devuelve HTTP 200. Se puede enviar el formulario de recuperación de administrador. |

## Regla para el Daily

No marcar como resuelta una fuente por tener una clave local. Debe existir una
prueba de lectura reciente. Las credenciales sociales permiten publicar, pero no
obligan a publicar: primero se comprueba duplicación, calidad y límites diarios.
Los archivos de `pending-publish/` son cola histórica; no se publican en bloque.
