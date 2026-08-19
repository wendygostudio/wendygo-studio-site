# Política Daily SEO

La política canónica está en [`OPERATING-MODEL.md`](OPERATING-MODEL.md). Cada Daily usa Codex, puede consumir hasta 120.000 tokens y debe:

- crear un artículo nuevo en inglés y sus cinco traducciones;
- mejorar una a tres piezas existentes con evidencia;
- corregir enlaces, hreflang, schema, accesibilidad estática y codificación que afecten al alcance;
- ejecutar una segunda pasada profunda después del entregable principal: contrastar oportunidades, revisar el cluster afectado y aplicar mejoras técnicas, lingüísticas o de enlazado que sigan respaldadas por evidencia; no cerrar por haber cumplido solo el mínimo;
- comprobar GSC/GA4/CWS/Plausible cuando estén disponibles;
- realizar una acción útil en DEV.to y una acción útil en Bluesky cuando las APIs estén disponibles; puede ser de un tema adyacente, con un máximo de una por red y sin spam;
- validar y documentar antes de hacer el commit/push automático autorizado para los cambios propios del Daily.
- registrar la cobertura real de cada fase y `telemetría de tokens: no expuesta` cuando el runtime no proporcione consumo; nunca estimar ni afirmar que se usaron 120.000 tokens.

No existe una ruta alternativa basada en Claude, Anthropic, cron u `orchestrator.sh`.
