# Modelo operativo Growth 120K

## Principio único

Codex es el único motor de ejecución. No se debe lanzar Claude Code, Anthropic API, `orchestrator.sh`, cron ni un segundo agente. Los scripts existentes solo sirven para obtener datos o validar; la decisión, edición y publicación ocurren dentro de la tarea de Codex.

## Cadencias

### Daily — adquisición y conversión

Presupuesto máximo: **120.000 tokens**. Se consume de forma adaptativa y puede terminar antes si no quedan acciones con evidencia.

1. Leer memoria, el último journal, datos disponibles y estado de Git.
2. Hacer un diagnóstico técnico rápido: HTML, canonicals, hreflang, schema, enlaces, accesibilidad estática y errores de codificación.
3. Cruzar GSC/GA4/CWS/Plausible cuando haya datos. GSC ya dispone de lectura,
   pero debe refrescarse y verificarse; GA4 sigue pendiente de permisos y CWS
   necesita su exportación oficial. Si una fuente no está autorizada, registrarlo
   como bloqueo y no inventar métricas.
4. Elegir una oportunidad con impacto medible: consulta/página con impresiones y posición 10–30, conversión débil, o una extensión con demanda clara.
5. Publicar **un artículo nuevo** localizado en los seis idiomas, con fuente inglesa estructurada, enlaces internos recíprocos, schema y sitemap.
6. Mejorar entre una y tres piezas existentes con evidencia. No reescribir por gusto.
7. Revisar consistencia de las seis traducciones y eliminar textos corruptos o asociaciones de producto incorrectas.
8. Realizar una acción de calidad en cada red cuando su API y credencial sean válidas: como máximo una adaptación útil y no duplicada en DEV.to y una interacción o publicación prudente en Bluesky. El tema puede ser adyacente al artículo del día si aporta valor; nunca automatizar spam. Si la red está bloqueada o la credencial no funciona, registrar el bloqueo sin simular actividad.
9. Ejecutar validaciones, escribir journal y resumir cambios, métricas, bloqueos y siguiente experimento.
10. Si las validaciones pasan, hacer automáticamente commit y push de los cambios propios de esta ejecución a `origin/main`. Excluir archivos ajenos, índices temporales, secretos y cambios preexistentes no relacionados; registrar el hash y el resultado en el journal.

### Weekly — optimización de sistema

Presupuesto máximo: **180.000 tokens**. Agrega los siete últimos días y compara contra el periodo anterior. Revisa clusters, CTR, posiciones, conversiones, instalaciones, activación, enlaces y rendimiento técnico. Selecciona hasta tres experimentos para la semana siguiente, prepara outreach de calidad (sin envío masivo) y crea como máximo una herramienta interactiva solo si existe una oportunidad demostrada.

### Monthly — estrategia y control

Presupuesto máximo: **240.000 tokens**. Auditoría completa de 28–90 días: indexación por idioma, Core Web Vitals/Lighthouse disponible, GA4/GSC/CWS, embudo de instalación/activación, arquitectura, GEO, accesibilidad, backlinks y calidad de traducciones. Revisa catálogo, precios y posicionamiento; archiva experimentos sin efecto y define prioridades del siguiente mes. No publica automáticamente por obligación.

## Puertas de calidad

- No afirmar datos que no aparezcan en una exportación o medición real.
- Mantener exactamente los seis locales (`en`, `es`, `de`, `fr`, `it`, `pt`) para cada artículo nuevo.
- No crear URLs localizadas heredadas con hreflang incorrecto.
- Verificar una sola etiqueta `h1`, canonical, alternates, JSON-LD, enlaces internos y sitemap.
- Mantener privacidad: procesamiento local por defecto y medición técnica mínima.
- El Daily tiene autorización explícita para commit y push automáticos después de validaciones correctas, limitada a sus propios cambios y con hash registrado en el journal.

## Artefactos

Cada ejecución deja `journal/YYYY-MM-DD.md` o el informe de cadencia correspondiente, con fuentes consultadas, decisiones, archivos tocados, validaciones, publicaciones externas, bloqueos y siguiente acción. Los informes históricos no se borran.

El plan activo de este ciclo está en [`30-DAY-GROWTH-SPRINT.md`](30-DAY-GROWTH-SPRINT.md). Si una instrucción diaria contradice ese plan o este modelo operativo, prevalecen estos dos documentos.
