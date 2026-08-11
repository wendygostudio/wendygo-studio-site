# Auditoría de codificación — 11 de agosto de 2026

Se revisaron las fuentes Markdown y los HTML generados con lectura UTF-8 real (no con la representación de PowerShell).

- 42 fuentes pudieron recuperarse desde una versión histórica válida o mediante reparación reversible de mojibake.
- Se corrigieron 34 fuentes con sustituciones lingüísticas seguras; quedan 27 fuentes con 212 caracteres `U+FFFD` (�) sin evidencia suficiente para reconstruir automáticamente el carácter original.
- El backup previo está en `.integration/backups/encoding-audit-20260811/`.
- Las validaciones SEO/i18n siguen pasando: 792 HTML, 0 errores; tests 7/7.

Los casos restantes requieren recuperar una copia original UTF-8 o una revisión lingüística completa. No se ha hecho una sustitución global por espacios o letras inventadas, porque alteraría títulos, textos legales y datos técnicos.
