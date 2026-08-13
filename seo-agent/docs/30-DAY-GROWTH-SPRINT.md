# Sprint de crecimiento de 30 días

Inicio: 2026-08-13  
Motor: Codex  
Objetivo: aumentar descubrimiento orgánico, instalaciones y activación sin
crear deuda técnica, lingüística o de medición.

## Presupuesto y cadencia

| Cadencia | Máximo | Función |
|---|---:|---|
| Daily | 120.000 tokens | Una pieza nueva, mejoras basadas en datos y distribución prudente |
| Weekly | 180.000 tokens | Análisis agregado y selección de experimentos |
| Monthly | 240.000 tokens | Auditoría estratégica y decisión del siguiente ciclo |

Los máximos son adaptativos. El agente debe detenerse cuando no queden acciones
con evidencia suficiente; consumir más tokens no es un objetivo por sí mismo.

## Fase 0 — Medición (días 1–3)

### Acciones

- Reactivar acceso de solo lectura a GA4.
- Refrescar y comprobar Search Console; el acceso de lectura ya está operativo,
  pero hay que confirmar que el token sigue válido y registrar cobertura de los
  seis idiomas.
- Obtener la exportación oficial de Chrome Web Store, que es una fuente de
  instalaciones de producto separada de GA4.
- Generar baseline por extensión: impresiones, clics, CTR, posición,
  instalaciones, activación, páginas de entrada, país e idioma.
- Registrar cada fuente ausente como bloqueo, nunca como cero.

### Puerta de salida

Existe una tabla fechada con fuente, periodo, extensión y métrica. Si GA4 o CWS
siguen bloqueados, el Daily continúa con SEO, pero no cambia precios ni CTAs por
suposiciones.

## Fase 1 — Salud técnica (días 4–10)

- Corregir dobles `h1`.
- Resolver `hreflang` heredados incorrectos.
- Revisar los caracteres `�`, `Ã` y fuentes no UTF-8.
- Comprobar asociación extensión–recurso–artículo.
- Validar canonical, sitemap, JSON-LD, enlaces internos y páginas huérfanas.
- Ejecutar validación local, Lighthouse y capturas visuales.

### Puerta de salida

Validación sin errores críticos, una sola etiqueta `h1` por página y paridad de
los seis idiomas en todo contenido nuevo.

## Fase 2 — Captación SEO (días 11–17)

Cada Daily debe:

1. elegir una consulta/página con evidencia, preferentemente impresiones altas y
   posición 10–30;
2. crear un artículo no canibalizante en seis idiomas;
3. mejorar entre una y tres piezas existentes;
4. añadir enlaces internos recíprocos y schema;
5. registrar hipótesis y métrica de éxito en el journal.

No se publican artículos genéricos solo para llenar cuota.

## Fase 3 — Extensiones y distribución (días 18–23)

- Comparar visualización de ficha, instalación y activación por extensión.
- Priorizar la extensión con mayor demanda y peor conversión.
- Ajustar ficha, primer pantallazo, descripción y CTA con evidencia.
- Publicar como máximo una adaptación útil en DEV.to por ejecución apropiada.
- Mantener Bluesky con una publicación o interacción relevante, sin spam.
- Preparar outreach selectivo y documentar backlinks verificables.

## Fase 4 — Experimentos (días 24–30)

- Elegir los tres experimentos de mayor impacto potencial.
- Comparar contra el baseline de la fase 0.
- Mantener cambios con mejora observable y revertir los que no la tengan.
- Elaborar el informe Monthly y el siguiente backlog priorizado.

## Indicadores de éxito

Son objetivos de control, no garantías:

- +30–50 % de impresiones orgánicas.
- +25–40 % de clics.
- Mejora del CTR de las páginas priorizadas.
- 10–20 consultas que avancen desde posiciones 10–30 hacia la primera página.
- Cero errores técnicos críticos.
- Seis idiomas completos para cada contenido nuevo.
- Datos recientes de instalaciones y activación para las extensiones principales.

## Regla de ampliación

No subir el Daily por encima de 120.000 tokens durante la primera semana. Solo
se podrá usar un modo profundo de hasta 160.000 tokens en días concretos si:

- GA4/Search Console/CWS ya tienen datos válidos;
- queda una investigación competitiva o técnica de alto impacto pendiente;
- el journal explica qué decisión adicional se obtendrá.

La subida no es permanente y debe revisarse en el Weekly.

## Checklist de cada ejecución

- [ ] Datos y periodo registrados.
- [ ] Hipótesis elegida antes de editar.
- [ ] Artículo nuevo en seis idiomas.
- [ ] Una a tres mejoras existentes.
- [ ] Validación técnica ejecutada.
- [ ] DEV.to y Bluesky revisados.
- [ ] Journal actualizado con resultados y bloqueos.
- [ ] Commit/push solo si el usuario lo solicita.
