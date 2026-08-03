# Auditoría de tracción de extensiones — 2026-08-03

## Cobertura y limitaciones

- GA4 actualizado el 2026-08-03, con cuatro semanas completas: 2026-07-04 → 2026-07-31.
- Comparación principal: 2026-07-18 → 2026-07-24 frente a 2026-07-25 → 2026-07-31.
- Search Console no se pudo refrescar: `invalid_grant` (refresh token caducado o revocado). No se mezclan impresiones/clics con GA4.
- Las cifras son señales de baja muestra y no equivalen a instalaciones de Chrome Web Store.

## Resultado por extensión

| Extensión | Semana anterior | Última semana | Lectura |
|---|---:|---:|---|
| ConvertForge | 2 usuarios / 2 sesiones / 0 installs | 4 / 5 / 0 | Recuperación pequeña, sin señal de instalación. |
| SlimeForge | 21 usuarios / 27 sesiones / 6 installs | 15 / 18 / 1 | Caída de usuarios/sesiones y fuerte caída de `install`; requiere seguimiento. |
| FrameForge | 9 / 11 / 2 | 5 / 7 / 1 | Descenso aproximado del 44% en usuarios y 36% en sesiones. |
| TextForge | 2 / 3 / 1 | 1 / 2 / 0 | Volumen demasiado pequeño para concluir pérdida estructural. |
| ScrubForge | 5 / 6 / 1 | 5 / 7 / 1 | Estable, con ligera mejora de sesiones. |
| ClaimForge | 9 / 11 / 1 | 4 / 5 / 0 | Descenso relevante, pero muestra reducida y sin GSC para confirmar demanda. |

## Decisiones

1. **No cambiar precios ni reescribir landings automáticamente.** Solo SlimeForge tiene una señal repetida suficiente para abrir investigación, y debe confirmarse otra semana.
2. Revisar primero SlimeForge: ficha de Chrome Web Store, onboarding, evento `install` y fuentes de tráfico. La caída puede ser de adquisición o de instrumentación.
3. Revisar FrameForge y ClaimForge como seguimiento secundario; no publicar páginas nuevas por estas cifras aisladas.
4. ConvertForge y ScrubForge no requieren intervención inmediata.
5. TextForge queda en observación por volumen insuficiente.
6. Reactivar Search Console antes de la próxima comparación para separar demanda orgánica de activación del producto.

## Instrumentación

Los eventos `install`, `first_visit`, `session_start` y `page_view` existen de forma desigual entre propiedades. Un cero de `install` no demuestra cero instalaciones si el evento no está instrumentado; hay que contrastarlo con Chrome Web Store.
