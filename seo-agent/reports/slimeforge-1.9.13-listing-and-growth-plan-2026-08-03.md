# SlimeForge 1.9.13 — ficha, SEO y activación

Fecha: 2026-08-03

## Dictamen de título y descripción corta

**Título actual:** `SlimeForge — Pomodoro Timer & Focus Pet`

Es una buena elección: combina la intención de búsqueda principal (Pomodoro Timer) con el diferenciador de producto (Focus Pet), mantiene la marca al principio y evita promesas difíciles de verificar. No conviene cambiarlo en esta versión salvo que Chrome Web Store muestre una restricción de longitud en el formulario.

**Descripción corta actual:** `A pomodoro timer with a tiny pet that grows with your focus. It works at its desk while you work — and catches you slacking.`

La primera frase es clara y memorable. La segunda crea personalidad, pero “catches you slacking” puede sonar punitivo y reducir la conversión. Recomendación para una prueba A/B editorial (sin cambiar título):

> `A Pomodoro timer with a tiny focus pet that grows with every session — and gently keeps distractions away.`

La ficha larga entregada para 1.9.13 está bien estructurada. Sus puntos más fuertes son: historia desde la primera sesión, Focus Shield, procesamiento local, ausencia de cuenta/tracking y la separación Free/PRO. Conviene mantener esos beneficios en los primeros dos párrafos y dejar expediciones, IA y detalles PRO después.

## Cambios aplicados al sitio

- Actualizada la versión pública de SlimeForge de 1.8.0 a 1.9.13 en la ficha canónica y sus cinco locales.
- Actualizado `data/products.json` para que el catálogo, los metadatos y las auditorías usen 1.9.13.
- Alineadas la meta description y la descripción de `SoftwareApplication` con “Pomodoro focus timer” + compañero animal-slime + local-first.
- Confirmado que los artículos existentes de Pomodoro, Forest, TDAH y gamificación ya incluyen `relatedPages: /slimeforge/`; no se creó contenido duplicado.

## Distribución controlada

### Bluesky (un post, sin campaña agresiva)

`SlimeForge 1.9.13 turns each Pomodoro into visible progress: a tiny companion grows with your sessions, while Focus Shield keeps distractions gentle and local. No account, no tracking.`

No repetir follows/likes en la misma tanda. Interactuar solo con una conversación relevante sobre Pomodoro, focus pets o privacidad local.

### DEV.to

Publicar solo si se quiere una pieza sustancial: reutilizar el artículo “Gamified Pomodoro Timer: Make Your Focus Sessions Stick”, enlazar `/slimeforge/` y añadir una nota breve de 1.9.13. No crear un segundo artículo canibalizador.

## Medición que debe quedar activa

En cada propiedad GA4 de Chrome Web Store, marcar `install` como evento clave y revisar semanalmente `activeUsers`, `newUsers`, `install` y `session_start`. Añadir después un evento de activación de producto (por ejemplo `first_focus_session`) si la extensión ya lo emite. Actualmente la caída de SlimeForge está confirmada en usuarios y eventos, pero no hay todavía un evento de sesión completada para distinguir instalación de activación.

## Acciones manuales pendientes

1. Publicar la nueva ficha en Chrome Web Store y comprobar que el título/idiomas se guardan correctamente.
2. Reautorizar Search Console cuando se quiera recuperar cobertura de indexación; el refresh actual devuelve `invalid_grant`.
3. Marcar `install` como evento clave en las seis propiedades GA4 y validar DebugView con una instalación de prueba.
