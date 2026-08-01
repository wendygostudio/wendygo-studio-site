# Auditoria de traccion de extensiones — 2026-08-01

## Fuente y alcance

Consulta GA4 Data API sobre las seis propiedades de Chrome Web Store, periodo
2026-07-02 a 2026-07-29. La lectura devuelve eventos por fecha y una
agregacion semanal. La ultima semana (27–29 de julio) solo tiene tres dias y
no es comparable directamente con las semanas completas.

## Hallazgos

- No aparece una caida general confirmada en las dos semanas completas.
- SlimeForge es la extension con mas senal: 10 eventos `install`, 38 usuarios
  activos en el periodo y 52 sesiones.
- Entre 2026-07-13/19 y 2026-07-20/26, SlimeForge paso de 4 a 6 instalaciones,
  de 4 a 5 usuarios activos y de 5 a 6 sesiones.
- FrameForge registro 3 instalaciones; dos fueron en la semana del 20 de julio
  y una en la semana parcial del 27.
- TextForge, ScrubForge y ClaimForge registran una instalacion cada una.
- ConvertForge no registra ningun evento `install`, aunque si tiene sesiones y
  usuarios. No debe interpretarse como cero instalaciones hasta corregir su
  instrumentacion.

## Problema de medicion

Las propiedades no envian un conjunto homogeneo de eventos de producto. La
mayoria solo envia `first_visit`, `session_start` y `page_view`; el evento
`install` falta en ConvertForge y no hay eventos comparables de activacion,
funcion usada, trial, conversion Pro o retencion D7/D30.

## Conclusion provisional

Los datos disponibles no respaldan la hipotesis de que todas las extensiones
hayan perdido traccion esta semana. La muestra es pequena, la ultima semana
esta incompleta y la instrumentacion es desigual. La senal mas clara es que
SlimeForge mantiene el mejor rendimiento relativo. El siguiente cuello de
botella es medir instalaciones y activacion de forma consistente, no cambiar
SEO a ciegas.

## Siguiente medicion

Instrumentar en las seis extensiones, con el mismo esquema:

`install`, `first_open`, `activation`, `feature_use`, `trial_start`,
`store_click`, `pro_purchase` y `return_session`.

Comparar semanas completas y cohortes D7/D30 antes de decidir cambios de ficha,
precio u onboarding.
