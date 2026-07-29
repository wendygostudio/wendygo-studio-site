# Auditoría SEO/GEO integral — 2026-07-29

## Resultado

La validación local queda en **0 errores**: 465 HTML, 462 URLs canónicas, 6 idiomas, 42 hubs de recursos, 453 selectores de idioma, 0 errores de hreflang, legal, precios, gobernanza o enlaces internos. Las 7 pruebas automáticas pasan.

## Seis frentes abordados

1. **ODR y contenido legal**: el artículo principal y sus traducciones actuales explican el cierre de la plataforma ODR y dirigen a ECC-Net/ADR. El resultado antiguo que aún aparece en algunos rastreos de Google conserva texto anterior; se debe esperar al siguiente rastreo para confirmar la sustitución.
2. **Sitemap**: `public/sitemap.xml` regenerado con 462 URLs. Search Console aún tiene registrada la versión anterior de 427 URLs; el token disponible es de solo lectura, por lo que el reenvío debe hacerse en la interfaz de Search Console.
3. **CTR y artículos con impresiones**: se ajustaron títulos de Base64 Kubernetes, CyberChef, Pinterest y TikTok para hacer más explícita la intención de búsqueda y mantenerlos en una longitud útil.
4. **WCAG básica**: 102 imágenes tienen `alt`, todas las páginas tienen `lang`, y las comprobaciones estructurales no detectan formularios sin etiqueta ni enlaces rotos. Pendiente: navegación manual completa con teclado/lector de pantalla.
5. **Rendimiento**: el análisis estático muestra homes de 50–53 KB y una media HTML de 22 KB. No se pudo obtener una medición pública fresca de Core Web Vitals desde este entorno; queda pendiente PageSpeed móvil externo.
6. **Autoridad externa**: la arquitectura de entidad, perfiles, `llms.txt`, fuentes oficiales y drafts de Dev.to/Bluesky están preparados. No se ejecutan campañas masivas ni follows artificiales; la autoridad debe crecer con publicaciones puntuales y relevantes.

## Acción manual inmediata

En Search Console: **Sitemaps → Añadir un sitemap nuevo → `sitemap.xml` → Enviar**. Después revisar el contador de URLs enviadas/indexadas en 7–14 días.
