# Auditoría SEO y GEO — 2026-07-31

## Estado técnico

- 518 HTML revisados; 0 errores de contenido, legal, precios, gobernanza o i18n.
- 516 páginas canónicas en sitemap.
- 0 canonical duplicadas.
- 0 páginas indexables sin Open Graph.
- 0 imágenes sin `alt` y 0 botones sin nombre accesible.
- 7/7 tests automáticos superados.

## Cambios aplicados

- El reparador de `hreflang` descarta rutas que no existen físicamente.
- Las páginas de recursos incluyen Open Graph y Twitter Cards.
- Los artículos incluyen `inLanguage`, `image`, `mainEntityOfPage` y `wordCount`.
- `llms.txt` y `llms-full.txt` incluyen un mapa de fuentes editoriales recientes.
- Se añadió `scripts/audit-static-quality.mjs` al comando `npm run validate`.
- El traductor diario rechaza metadatos inválidos del proveedor externo.

## Comprobaciones externas

- Search Console actualizado el 2026-07-31 para el periodo 2026-06-30 →
  2026-07-28. Las homes EN, ES, DE, FR, IT y PT-PT devuelven `PASS`, están
  enviadas/indexadas y tienen robots permitido.
- Search Console todavía tiene registrado el sitemap enviado el 22 de julio:
  427 URLs enviadas, 0 indexadas, sin errores. El sitemap publicado actual
  contiene 516 URLs; hay que reenviarlo desde Search Console porque el token
  disponible es de solo lectura.
- Cloudflare responde `200` para `robots.txt`, `sitemap.xml` y `llms.txt`, con
  cabecera `server: cloudflare`. La ruta de licencia responde `400` con
  `missing_key`, que confirma que el Worker está activo y valida el contrato.
- PageSpeed Insights no devolvió una medición nueva: la API respondió `429`
  por cuota diaria agotada. No se inventan métricas de Core Web Vitals; queda
  pendiente repetir la medición cuando se renueve la cuota.

## Deuda editorial

La deuda de traducción está contabilizada en el flujo Daily SEO y debe resolverse
por tandas con revisión humana. No se deben crear traducciones si el proveedor
devuelve títulos o descripciones corruptos.
