# Search Console: cobertura de indexación por idioma

Fecha de consulta: 2026-07-29  
Propiedad: `https://wendygostudio.com/`  
Método: inspección de URL de Search Console sobre la home canónica de cada locale.

| Locale | URL inspeccionada | Estado | Indexación | Último rastreo |
|---|---|---|---|---|
| EN | `/` | PASS — Submitted and indexed | INDEXING_ALLOWED | 2026-07-28 |
| ES | `/es/` | PASS — Submitted and indexed | INDEXING_ALLOWED | 2026-07-27 |
| DE | `/de/` | PASS — Submitted and indexed | INDEXING_ALLOWED | 2026-07-27 |
| FR | `/fr/` | PASS — Submitted and indexed | INDEXING_ALLOWED | 2026-07-27 |
| IT | `/it/` | PASS — Submitted and indexed | INDEXING_ALLOWED | 2026-07-24 |
| PT | `/pt/` | PASS — Submitted and indexed | INDEXING_ALLOWED | 2026-07-27 |

## Lectura

Las seis entradas principales están indexadas y no presentan bloqueo de rastreo. La muestra confirma cobertura inicial completa por idioma; no significa que todas las páginas de cada locale estén ya indexadas.

El sitemap registrado en Search Console necesita actualización: fue enviado el 22 de julio, descargado el 26 de julio, sin errores, pero todavía declara 427 URLs enviadas y 0 indexadas. El repositorio actual contiene más URLs. Después del push conviene volver a enviar manualmente `https://wendygostudio.com/sitemap.xml` desde Search Console y revisar el contador tras el siguiente rastreo.

En rendimiento orgánico reciente (28 días), Search Console muestra impresiones y clics principalmente en EN y ES. La ausencia de otros idiomas en las primeras 50 páginas no demuestra que estén desindexados; indica que todavía no tienen suficiente volumen para aparecer en esa muestra.

## Próximo control

Repetir esta inspección en 7–14 días y ampliar la muestra a URLs de producto, blog y recursos de cada locale. Comparar también el informe **Páginas** con el sitemap para localizar URLs descubiertas pero no indexadas.
