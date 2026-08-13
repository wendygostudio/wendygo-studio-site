# Estado de accesos e integraciones

Última comprobación: 2026-08-13.

| Fuente | Estado | Evidencia / siguiente acción |
|---|---|---|
| Search Console | **Operativa** | `node seo-agent/scripts/fetch-analytics.mjs` obtuvo 50 páginas y 50 consultas. |
| GA4 Data API | **Bloqueada por permisos** | La API está habilitada, pero la primera propiedad (`545660427`) devuelve HTTP 403. El fallback OAuth también devuelve `invalid_grant`; añadir la cuenta de servicio como Viewer en las seis propiedades o reautorizar el OAuth de solo lectura. |
| Chrome Web Store | **Pendiente de exportación** | No existe todavía `.integration/measurement/cws/`; exportar el informe oficial por extensión y periodo. |
| DEV.to | **Credencial configurada** | `DEVTO_API_KEY` está presente y `devto-post.js` se conserva activo. Antes de publicar, deduplicar contra los artículos ya publicados y los borradores pendientes. |
| Bluesky | **Credencial configurada** | `BLUESKY_HANDLE` y `BLUESKY_APP_PASSWORD` están presentes; `bluesky-tools.js` conserva post, likes y follows prudentes. Registrar URI y acciones en el journal. |
| Plausible | **Configurado localmente** | Las variables existen en `agent.env`; no se considera fuente principal mientras GA4/GSC/CWS no estén normalizados. |
| Verificación de propiedad GA | **Publicada** | `https://wendygostudio.com/analytics.txt` devuelve HTTP 200. Se puede enviar el formulario de recuperación de administrador. |

## Regla para el Daily

No marcar como resuelta una fuente por tener una clave local. Debe existir una
prueba de lectura reciente. Las credenciales sociales permiten publicar, pero no
obligan a publicar: primero se comprueba duplicación, calidad y límites diarios.
Los archivos de `pending-publish/` son cola histórica; no se publican en bloque.
