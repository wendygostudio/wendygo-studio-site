# Auditoría integral SEO, GEO y estrategia — 2026-08-11

## Resumen ejecutivo

La capa técnica local no presenta fallos: `npm run validate` termina con 0 errores sobre 780 URLs canónicas y 782 HTML; `npm test` pasa 7/7. El problema real no es una etiqueta rota, sino la falta de medición externa reciente y algunos huecos de cobertura editorial/traducción.

Durante esta auditoría se corrigió un defecto GEO: `llms.txt` estaba tomando el `<title>` limitado para SERP y truncaba titulares editoriales. El generador ahora usa el `headline` completo del JSON-LD, con `<h1>` como respaldo.

## Matriz de auditoría

| Área | Evidencia actual | Estado | Próxima acción |
|---|---|---|---|
| Rastreo, canonicals, enlaces y sitemap | Validadores locales, 780 URLs canónicas | OK | Repetir en cada Daily SEO |
| Hreflang e idiomas | 6 locales, reciprocidad validada | OK | Mantener la puerta de traducción |
| Metadatos y snippets | Títulos/descripciones normalizados | OK | Medir CTR cuando vuelva Search Console |
| Schema y accesibilidad estática | JSON-LD, alt, legal y precios validados | OK | Añadir pruebas específicas si cambia la plantilla |
| GEO/LLM | `llms.txt`, `llms-full.txt`, mapa de fuentes y claims | CORREGIDO | Revisar titulares completos y claims cada semana |
| Contenido y hubs | 256 estructurados + 338 legacy | VIGILAR | Convertir excepciones legacy en fuentes estructuradas |
| Traducciones | Copias localizadas antiguas retiradas; grupos estructurados completos | CERRADO | Mantener puerta de traducción |
| Search Console | `analytics-data.json` sin datos GSC | BLOQUEADO | Reautorizar token y refrescar consultas/CTR/indexación |
| GA4 de extensiones | Exportación detenida el 31-07; `install` incompleto en ConvertForge | BLOQUEADO | Refrescar GA4 y homogeneizar eventos |
| Chrome Web Store | No hay export oficial de impresiones/instalaciones en el agente | BLOQUEADO | Exportar semanalmente CWS por extensión |
| Core Web Vitals | Lighthouse local: 98 mobile / 100 desktop; CLS 0, TBT 0 | MEDIDO | Conectar CrUX para datos reales de usuarios |
| Autoridad externa | Dev.to comprobado; Bluesky con engagement prudente | EN MARCHA | Mantener 0–1 pieza y 1–3 interacciones relevantes |
| Seguridad/legal | Validadores legales y de gobernanza sin errores | OK | Revisar claims legales al actualizar normativa |

## Cómo auditar la estrategia completa

1. **Técnica diaria:** `npm run validate`, `npm test`, sitemap, canonicals, hreflang, enlaces, schema y GEO.
2. **Contenido semanal:** inventario por producto/locale, intención cubierta, canibalización, profundidad, enlaces entrantes y deuda de traducción.
3. **Search Console semanal:** clics, impresiones, CTR y posición por consulta/página/idioma; separar EN/ES/DE/FR/IT/PT.
4. **Producto semanal:** GA4 por extensión con semanas completas y eventos `install`, `activation`, `feature_use`, `trial_start`, `store_click`, `pro_purchase` y `return_session`.
5. **Chrome Web Store semanal:** impresiones de ficha, instalaciones, desinstalaciones, conversión por idioma, cambios de ficha y versión publicada.
6. **Rendimiento mensual:** CrUX/PageSpeed/Cloudflare para LCP, INP, CLS, peso, caché y errores HTTP.
7. **GEO mensual:** comprobar que `llms.txt`, JSON-LD, FAQs, fuentes primarias y claims coinciden con las landings; revisar titulares completos, no snippets truncados.
8. **Distribución semanal:** Dev.to (estado de borradores/publicados y canónica) y Bluesky (publicación o interacción contextual, sin automatización masiva).
9. **Competencia trimestral:** comparar intención, cobertura, snippets, propuestas y autoridad, sin copiar claims ni crear páginas duplicadas.

## Limitaciones que no deben interpretarse como fallos

- No se puede afirmar una caída orgánica sin Search Console actualizado.
- Un `install: 0` en GA4 no equivale a cero instalaciones si la propiedad no envía el evento.
- GA4 no sustituye a las instalaciones oficiales de Chrome Web Store.
- La validación local no demuestra indexación real ni Core Web Vitals.

## Prioridad siguiente

1. Reautorizar Search Console y GA4: ambos refresh tokens devuelven `invalid_grant`; el nuevo refrescador Node ya está preparado y no sobrescribe exportaciones cuando falla.
2. Exportar CWS y GA4 de las seis extensiones con el mismo intervalo semanal.
3. Instrumentar `install` en ConvertForge y revisar identidad de producto/eventos.
4. Medir el experimento de enlazado de Pinterest el 26-08-2026.

La medición Lighthouse completa está en `seo-agent/reports/lighthouse-summary-2026-08-11.md`.
