# Memoria del Proyecto — Wendygo Studio

## Monthly 2026-09-01

- GSC exacto 28d: 249 impresiones/1 clic/CTR 0,4016 %/posición 59,67 frente a 3.844/17/0,4422 %/42,97. La ruptura empieza el 02-08; es una regresión crítica sin causa probada.
- No hay bloqueo global: las seis homes, Forest y PDF pasan URL Inspection; robots, fetch y canonicals correctos. Producción tiene 798 URLs y local 816; quedan 18 URLs (tres grupos × seis idiomas) sin exposición.
- Puerta técnica: 882 HTML, 816 canónicas, seis locales, tests 7/7 y validadores independientes 0; global bloqueada por 9 hubs, 12 páginas de producto y 636/843 switchers desincronizados. Encoding: 26 fuentes/199 `U+FFFD`, 30 HTML/234.
- GA4 403 + `invalid_grant`; CWS sin exports; Plausible realmente no configurada (clave y site ID vacíos); PageSpeed 429. No afirmar instalaciones, activación, sesiones o CWV actual.
- Catálogo: ScrubForge público 1.15.0 vs local 1.13.1; claims de FrameForge/ScrubForge y “GA4 actual” de SlimeForge necesitan paridad. Precios no cambian.
- Ciclo 02-09→01-10: recuperación, medición y catálogo antes de nuevas URLs. Informe: `journal/monthly-2026-09-01.md`.

## Weekly 2026-09-01

- GSC final 2026-08-23–29 frente a 2026-08-16–22: 45 vs 53 impresiones (−15,1 %), 0 clics en ambos, CTR 0 % y posición 63,47 vs 70,45. Reclamación UE subió 9→16; PDF francés 9→0; Forest 7→4; Instagram perfil debutó con 3 impresiones. Sin consulta multipágina visible.
- GA4 continúa en 403 + `invalid_grant`; Plausible volvió a 401 y CWS no tiene exports. No afirmar sesiones, conversiones, instalaciones ni activación.
- Superficie final tras una entrega Daily concurrente: 882 HTML/0 incidencias, 816 canónicas/6 locales/0 errores, enlaces internos rotos 0 y tests 7/7. La puerta global está bloqueada por 9 hubs; check directo: 636 switchers desincronizados. Encoding bloquea por 22 HTML. Las seis páginas concurrentes del 1 de septiembre no pertenecen a la Weekly.
- CWS público: cinco versiones coinciden; ScrubForge 1.15.0/6 idiomas sigue frente a catálogo 1.13.1. SlimeForge público 1.9.13; ZIP local 2.2.0 no publicado y paridad 746/746 en seis locales.
- Experimentos siguientes: recuperar baseline GA4/Plausible/CWS; restaurar puerta de entrega; reconciliar ScrubForge. Forest se observa sin cambios hasta 2026-09-07. Outreach PomoPals revalidado y no enviado. Informe: `journal/weekly-2026-09-01.md`.

## Weekly 2026-08-24

- GSC final 2026-08-15–21 frente a 2026-08-08–14: 58 vs 94 impresiones, 0 vs 1 clic, CTR 0 % vs 1,06 % y posición 69,57 vs 60,81. Forest fue la mayor caída visible (28→7 impresiones); imagen subió 13→17 en filas por página. No hay canibalización semanal concluyente.
- Ventana GSC de 28 días hasta el 21-08: Forest 233 impresiones/posición 25,3, Pomodoro 54/24,3, garantía UE 42/16,2, desistimiento 22/29, X 17/14,9 e Instagram 12/17. No apilar cambios sobre contenido reciente; la guía Forest del 23-08 aún está fuera del periodo final.
- GA4 continúa en 403 + `invalid_grant`; CWS no tiene exports; Plausible respondió HTTP 401. No afirmar instalaciones, activación, conversiones ni sesiones.
- Superficie final observada: 852 HTML, 786 canónicas, seis locales, validadores independientes en 0, tests 7/7 y enlaces internos rotos 0. `npm run validate` quedó bloqueado porque los seis índices de blog no se regeneraron tras una entrega concurrente del 24-08; excluir esa entrega de la autoría de la Weekly.
- Deuda histórica de encoding: 26 fuentes/199 `U+FFFD`, 30 HTML/234; lint bloquea por 23 archivos. Último Lighthouse es del 11-08 y ya no es actual porque la home cambió el 19-08.
- Catálogo CWS: cinco productos coinciden; ScrubForge público 1.15.0/6 idiomas frente a catálogo local 1.13.1. SlimeForge público sigue 1.9.13 y el artefacto local 2.2.0 no se trata como publicado; paridad local 746/746 por seis locales.
- Experimentos: recuperar baseline GA4/Plausible/CWS; reconciliar ScrubForge 1.15.0; medir separación de intención Forest tras 14 días finales. Outreach PomoPals actualizado, no enviado. Informe: `journal/weekly-2026-08-24.md`.

## Daily 2026-08-20

- GSC final 2026-07-21–17: 50 consultas, 50 páginas y 250 pares. Oportunidad seleccionada: CloudConvert (68 impresiones, posición 43,5); se creó comparación CloudConvert vs conversor local en seis idiomas y se actualizaron las seis guías existentes con límites oficiales actuales.
- Validación: 834 HTML, 768 canónicas, 6 locales, 0 errores, tests 7/7, auditoría estática 0. GA4/CWS/Plausible bloqueados; DEV.to bloqueado por SSL; Bluesky publicó una nota útil en `3mtjgp6yxee24`. Encoding lint: 23 archivos históricos con deuda.

## Baseline Weekly 2026-08-18

- GSC final 2026-08-09–15 frente a 2026-08-02–08: 98 vs 53 impresiones, 1 vs 0 clics, CTR 1,02 % vs 0 % y posición media 61,26 vs 42,72. El aumento procede en gran parte de descubrimiento en posiciones bajas; no declararlo como mejora general de ranking.
- Foco/productividad es el clúster más consistente: 22→28 impresiones y posición ponderada 39,55→35,79. Consumo UE y conversión crecieron en posiciones 66–99.
- GA4 sigue bloqueado (403 + OAuth `invalid_grant`), CWS no tiene exports y Plausible no está configurado. La línea base GA4 manual hasta el 12-08 es histórica y sus CSV ya no están en el workspace.
- Deuda oculta de codificación: 26 fuentes con 199 `U+FFFD`; 30 HTML públicos con 234. Los validadores actuales no la detectan.
- Experimentos siguientes: recuperar baseline GA4/CWS; alinear intención de `how-to-file-consumer-complaint-eu`; outreach individual a PomoPals solo con aprobación.

## LÃ­nea base GA4 manual (2026-08-13)

- Seis exportaciones `Informe_panorÃ¡mico*.csv` cubren 2026-05-15â€“2026-08-12.
- Tendencia semanal: SlimeForge 11â†’21â†’14â†’13â†’7; FrameForge 10â†’6â†’5â†’4â†’1; ClaimForge 5â†’8â†’5â†’2â†’2; ScrubForge 2â†’4â†’6â†’2â†’3; ConvertForge 3â†’2â†’4â†’4â†’1; TextForge 3â†’2â†’1â†’3â†’3.
- SlimeForge tiene la mejor seÃ±al de Organic Search (17 usuarios nuevos); FrameForge registra 1. Es una lÃ­nea base comparativa, no usuarios Ãºnicos acumulados.

## Estado operativo vigente (2026-08-11)

- Search Console ya está operativo mediante la cuenta de servicio `wendygo-seo-reader@project-d87fed0e-c2d8-4b88-9ae.iam.gserviceaccount.com`: la última extracción devolvió 50 páginas y 50 consultas.
- GA4 sigue pendiente de permisos de propiedad; no tomar decisiones de rendimiento de extensiones con datos GA4 hasta resolverlo.
- La deuda de traducción está cerrada: no quedan grupos pendientes y las validaciones locales pasan sin errores.
- No repetir diagnósticos antiguos que indiquen Search Console vacío, `invalid_grant` de GSC o nueve grupos de traducción pendientes; quedan como histórico, no como estado actual.

## FrameForge 2.0.0 (2026-07-29)

FrameForge se ha actualizado como editor local de imágenes, no solo redimensionador: presets sociales, recorte manual, capas, plantillas, historial visual, cuentagotas y guías de alineación. Sus herramientas de IA local cubren eliminar fondos, ampliar 2×/4×, quitar objetos, ampliar lienzo y detectar defectos; las exportaciones IA gratuitas llevan marca de agua. Incluye ocho herramientas creativas y el sistema local “Mi taller” (5 prestigios, 6 skins y 14 logros) en la vista normal. Pro añade color, tipografía, overlays, exportación multiformato, ZIP por lotes y editor completo. No es un editor vectorial ni una herramienta de capturas. Evita afirmar un número de modelos de IA hasta cerrar la decisión P-009; usa “herramientas de IA local”.

Este archivo es la memoria persistente del agente de crecimiento de Wendygo Studio.
No es un journal diario (eso ya vive en `journal/YYYY-MM-DD.md`) — es continuidad
estratégica entre ejecuciones. Léelo COMPLETO al empezar cualquier tarea
(`daily-seo`, `weekly-review` o cualquier tarea futura) y actualízalo antes de
terminar.

Dos secciones: **memoria de negocio** (decisiones que no deben reinterpretarse
sin más) y **memoria SEO** (qué se hizo, qué se esperaba, qué ocurrió).

---

- **2026-08-03 (daily SEO)**: ejecutada tanda de traducción de cuatro grupos (JWT, reclamaciones de pequeña cuantía, contracargo y recorte de imágenes), corregidas cuatro rutas ES duplicadas como alias `noindex`, actualizados metadatos de SlimeForge 1.9.13 y reparada la idempotencia de los regeneradores de superficies/índices. DEV.to y Bluesky ya se publicaron en la tanda anterior del mismo día; no se repitió actividad social.

- **2026-08-01 (daily 2)**: mejorado el snippet de `resize-image-for-pinterest-pin`
  (54 impresiones, posición 16,9, CTR 1,85 %) y completadas las traducciones ES
  de cuatro grupos técnicos: UUID, limpieza de texto, JWT y redimensionado por
  lotes. Validación: 0 errores; tests 7/7; 518 HTML sin problemas.
- **2026-08-01 (daily 3)**: GA4 refrescado para las seis extensiones; no hay
  caída general en las dos semanas completas y SlimeForge mantiene la mejor
  señal. ConvertForge no registra `install`, por lo que se marcó como deuda de
  instrumentación. Añadidas traducciones ES de garantía UE, FortiGate y
  desistimiento UE; la cuarta quedó pendiente por timeout del proveedor.

 - **2026-08-03 (auditoría semanal)**: GA4 actualizado hasta el 31 de julio.
   SlimeForge cae de 6 a 1 `install` y de 27 a 18 sesiones entre las dos últimas
   semanas completas; investigar ficha, onboarding e instrumentación antes de
   cambiar precios. FrameForge y ClaimForge también bajan, con muestras pequeñas.
   Search Console queda bloqueado por `invalid_grant` del refresh token y no se
   deben combinar señales orgánicas hasta reautorizarlo.

## 1. Memoria de negocio (decisiones estratégicas)

Reglas vigentes. Si una ejecución cree que alguna ya no aplica, NO la rompas en
silencio: documenta el conflicto en el journal del día y deja la decisión
intacta aquí hasta que Damián la cambie explícitamente.

- **[2026-07-27] Mentalidad del proyecto: Growth Engineer, no Copywriter.**
  El objetivo ya no es "un artículo al día". Es la acción de mayor impacto ese
  día — que puede ser enlazado interno, actualización de contenido existente,
  autoridad externa, o (solo si nada de lo anterior aporta más) un artículo
  nuevo. Ver jerarquía de prioridades en `prompts/daily-seo.md`.

- **[2026-07-27] El ecosistema Forge es una entidad, no seis productos
  aislados.** TextForge, FrameForge, ScrubForge, ClaimForge, ConvertForge y
  SlimeForge se refuerzan mutuamente. Cuando encaje de forma natural, enlaza y
  menciona "Forge Ecosystem" como conjunto además del producto individual —
  no fuerces la mención si no aporta al lector.

- **[2026-07-27] Fase actual: autoridad e impresiones, no conversión.**
  Con el tráfico actual (~14 clics/mes en la última lectura de Search
  Console), no toques diseño, botones, CTAs, colores ni CRO buscando mejorar
  conversión — no es el cuello de botella todavía. Revisar este punto cuando
  el tráfico orgánico sostenido supere ~500 clics/mes.

- **[2026-07-27] LLMO/GEO: objetivo reformulado.** No existe una técnica
  demostrada para "hacer que ChatGPT/Gemini/Claude te recomienden". No
  optimices persiguiendo esa métrica no verificable. El objetivo real y
  medible es: ser una fuente clara, estructurada, actualizada y bien enlazada
  que un LLM PUEDA usar si decide citar algo. Prioriza contenido citable
  (definiciones, FAQs profundas, datos propios) como efecto secundario de
  hacer buen contenido, no como objetivo separado con su propio roadmap.

- **[2026-07-27] SlimeForge — gacha ético, no negociable.** SlimeForge es la
  única extensión con mecánica de gamificación/gacha (mascota slime). El
  dinero real JAMÁS compra azar — esta afirmación no se relaja ni se
  suaviza en ningún artículo, landing o comparativa.

- **[2026-07-27] Complejidad de la infraestructura del propio agente:
  mantenla mínima.** No construyas múltiples agentes especializados, grafos
  de conocimiento ni pipelines paralelos para el propio Daily SEO. Un solo
  flujo (leer memoria y Search Console → priorizar → actuar → guardar
  memoria) es suficiente para el volumen de tráfico actual. Revisar esta
  decisión solo si el propio proceso de priorización se vuelve el cuello de
  botella (no antes).

- **[2026-07-27] El aviso legal de ClaimForge se valida en los 6 locales,
  no solo en/es.** `validate-governance.mjs` comprobaba `data-legal-review`
  únicamente en `public/blog` y `public/es/blog`, lo que dejó pasar 25
  artículos de ClaimForge en DE/FR/IT/PT sin el aviso obligatorio (bug de
  casing en `render-blog.mjs`, corregido el mismo día). No reduzcas ese
  chequeo de vuelta a solo en/es — el contenido legal de ClaimForge está
  traducido a los 6 idiomas y el requisito de aviso legal aplica a todos.

---

## 2. Memoria SEO — experimentos

Cada cambio con hipótesis verificable se registra aquí como experimento.
Cosas rutinarias (un enlace interno suelto, una corrección de encoding) van
al journal diario, no aquí — esto es para decisiones que queremos poder
evaluar con datos en el futuro.

Formato:

```yaml
- id: <número correlativo>
  date: YYYY-MM-DD
  hypothesis: "qué creemos que va a pasar y por qué"
  action: "qué se hizo exactamente (URLs, artículos, enlaces)"
  expected: "cambio esperado, con número si es posible"
  measurement_date: YYYY-MM-DD  # normalmente +30 días
  status: pending | success | failure | inconclusive
  result: "qué pasó realmente (rellenar en measurement_date)"
```

```yaml
- id: 1
  date: 2026-07-27
  hypothesis: "resize-image-for-pinterest-pin (pos 17.0, 36 impresiones, 0
    enlaces internos entrantes) subirá de posición y/o impresiones al
    recibir enlazado interno real desde su cluster temático (guías de
    resize/crop de FrameForge), igual que sus vecinas SÍ enlazadas."
  action: "Añadidos 6 enlaces internos hacia la guía de Pinterest (3 EN:
    batch-resize-images-chrome-extension, crop-images-social-media-chrome,
    free-thumbnail-tool-no-login; 3 ES equivalentes), pasando de 0 a 6
    enlaces entrantes. No se tocó eu-warranty-rights-explained (9 enlaces
    ya existentes) ni cyberchef-alternatives (3 ya existentes) — sin hueco
    real que justificara la acción."
  expected: "Mejora de posición media y/o aumento de impresiones en
    resize-image-for-pinterest-pin / redimensionar-imagen-pinterest en la
    siguiente lectura de Search Console."
  measurement_date: 2026-08-26
  status: inconclusive
  result: "Sin lift observado en la fecha prevista: lectura final hasta 2026-08-24 = 21 impresiones y posición 22,3 frente al baseline 36/17,0. La página recibió cambios adicionales el 2026-08-27, por lo que no existe una ventana limpia posterior para atribuir el resultado al enlazado del 27 de julio."
- id: 2
  date: 2026-08-14
  hypothesis: "Una comparación Forest vs Pomodoro con intención propia y enlaces recíprocos puede ampliar el cluster de foco sin canibalizar las guías existentes. El baseline observado es 337 impresiones/posición 23,2 para forest-app-alternatives-chrome y 59 impresiones/posición 23,5 para pomodoro-timer-chrome-extension."
  action: "Publicadas localmente seis URLs de forest-app-vs-pomodoro-timer, con FAQ schema y enlaces localizados; añadidos enlaces recíprocos desde las guías Forest y Pomodoro en seis idiomas. Sin publicación externa."
  expected: "Primeras impresiones para la URL nueva y mejora de impresiones o posición en al menos una de las dos páginas soporte, sin caída simultánea atribuible a canibalización."
  measurement_date: 2026-09-11
  status: pending
  result: "Primera señal observada: 2 impresiones y posición 54 para la URL EN en la ventana final hasta 2026-08-29. Sigue pendiente hasta 2026-09-11; no apilar cambios."
- id: 3
  date: 2026-08-28
  hypothesis: "Una guía separada sobre Kubernetes Secret data frente a stringData puede captar la intención de elección de manifiesto alrededor de la página Base64 existente sin canibalizar la codificación ni el saneamiento."
  action: "Publicadas localmente seis URLs de kubernetes-secret-data-vs-stringdata con fuentes oficiales, FAQ schema y enlaces recíprocos desde las seis guías Base64."
  expected: "Primeras impresiones para las seis URLs nuevas y mejora o mejor reparto de consultas del cluster Base64, sin enlaces rotos ni caída atribuible en las guías soporte."
  measurement_date: 2026-09-11
  status: pending
  result: "Sin exposición externa al 2026-09-01: la URL EN devuelve 404 y el grupo no está en el sitemap live. Mantener pendiente; medir 14 días después de una publicación aprobada."
- id: 4
  date: 2026-09-01
  hypothesis: "Una guía de Pomodoro centrada en programación asistida por IA puede captar una intención adyacente de control y revisión, respaldada por una discusión reciente de desarrolladores, sin duplicar la guía general para desarrolladores."
  action: "Publicadas localmente seis URLs de ai-assisted-coding-pomodoro-workflow con fuentes de la Técnica Pomodoro y la discusión de Hacker News; añadidos enlaces recíprocos desde las seis versiones de pomodoro-timer-for-developers."
  expected: "Primeras impresiones para las seis URLs nuevas y mejor distribución del cluster Pomodoro/desarrolladores, sin canibalización ni enlaces internos rotos."
  measurement_date: 2026-09-15
  status: pending
  result: "Sin exposición externa al 2026-09-01: el grupo está solo en local. Mantener pendiente; medir 14 días después de una publicación aprobada."
```

---

## 3. Historial de ejecuciones recientes (rolling log)

Una línea por ejecución, más reciente arriba. Mantén máximo 15 líneas; al
añadir una nueva, elimina la más antigua si ya hay 15.

- **2026-09-01 (weekly)**: GSC final 45 impresiones/0 clics/posición 63,47 vs 53/0/70,45. GA4/Plausible/CWS siguen bloqueados. Validación final tras una entrega Daily concurrente: 882 HTML, 816 canónicas, seis locales, 0 errores, tests 7/7 y enlaces rotos 0; puerta global bloqueada por 9 hubs y 636 switchers desincronizados. ScrubForge público 1.15.0 frente a catálogo 1.13.1. Tres prioridades: medición, puerta técnica y reconciliación ScrubForge. Sin commit, push ni publicaciones; informe `journal/weekly-2026-09-01.md`.

- **2026-09-01 (daily)**: GSC refrescado para 2026-08-02→2026-08-29 (50 páginas, 50 consultas, 55 pares; 45 impresiones/0 clics/posición 63,47; semana final 45/0/63,47 frente a 53/0/70,45). Oportunidad basada en pain scan reciente de desarrolladores y el cluster Pomodoro: nueva guía de programación asistida por IA en seis idiomas, con enlaces recíprocos desde `pomodoro-timer-for-developers`. Tests 7/7, 882 HTML/816 canónicas, validadores independientes 0; `npm run validate` bloqueado por 9 hubs históricos y encoding por 22 HTML. DEV.to bloqueado por TLS; Bluesky revisado sin conversación accionable y sin publicación. Sin commit/push por la puerta global; journal en `seo-agent/journal/2026-09-01.md`.

- **2026-08-28 (daily)**: GSC final 2026-07-29→2026-08-25 (50 consultas, 50 páginas, 185 pares; 40 impresiones/0 clics/posición 73,70 frente a 80/1/71,51). Oportunidad Base64/Kubernetes (12 impresiones, posición 31,9): nueva guía `data` vs `stringData` en seis idiomas y enlaces recíprocos desde las seis guías Base64. Tests 7/7, 876 HTML/810 canónicas y validadores independientes 0; `npm run validate` bloqueado por 9 hubs históricos y encoding por 22 HTML. DEV.to bloqueado por TLS y sin duplicado público; Bluesky recibió un único like relevante. Sin commit/push por la puerta global; journal en `seo-agent/journal/2026-08-28.md`.

- **2026-08-18 (weekly)**: GSC semanal final 98 impresiones/1 clic vs 53/0; foco mejora modestamente, el crecimiento restante es descubrimiento en posiciones bajas. Baseline 816 HTML/750 canónicas; validación final con cambios concurrentes ajenos 822/756, 0 errores, tests 7/7. GA4/CWS/Plausible bloqueados; 26 fuentes mantienen 199 caracteres de sustitución. Tres experimentos definidos; sin publicación, commit ni push.

- **2026-08-14 (daily)**: GSC refrescado (2026-07-15→2026-08-11); creada la comparación Forest vs Pomodoro en seis idiomas y mejoradas las guías Forest, Pomodoro FR y carrusel LinkedIn ES. Validación 804 HTML/738 canónicas, 0 errores, tests 7/7. GA4/CWS/Plausible siguen bloqueados; detectada deuda de codificación en 32 fuentes. DEV.to y Bluesky solo lectura, sin publicación.
- **2026-08-11 (resolución de bloqueos)**: retiradas y archivadas 28 fuentes localizadas duplicadas del 26-07; la deuda de traducción queda cerrada y la validación pasa con 790 URLs canónicas/792 HTML. Añadido `analytics:refresh` en Node; Search Console y GA4 devuelven `invalid_grant`, y PageSpeed público respondió 429.
- **2026-08-11 (rendimiento)**: Lighthouse local de la home: 98 mobile (LCP 2,2 s, CLS 0, TBT 0 ms) y 100 desktop (LCP 0,7 s, CLS 0, TBT 0 ms); falta CrUX para sustituir la captura por datos reales de usuarios.

- **2026-08-11 (auditoría integral)**: matriz SEO/GEO/medición/autoridad/producto ejecutada; corregido el truncado de titulares en `llms.txt` usando el `headline` completo del JSON-LD. La técnica local sigue en 0 errores; Search Console, CWS, Core Web Vitals y GA4 reciente siguen siendo las limitaciones externas.

- **2026-08-11 (daily)**: completadas tres tandas estructuradas de traducción de Pomodoro/foco a los seis idiomas; Search Console sigue vacío y GA4 detenido en el 31 de julio, por lo que no se tomó una decisión de rendimiento. Dev.to comprobado sin duplicar publicación y Bluesky registró 2 likes; quedan 9 grupos de traducción pendientes, varios sin fuente EN estructurada.

- **2026-08-10 (weekly)**: auditoría profunda con 761 URLs canónicas/763 HTML, 0 errores en todas las validaciones y 7/7 tests; corregidos cuatro títulos duplicados mediante overrides durables, auditada la herramienta local `regex-tester` en seis idiomas, añadido el informe competitivo y actualizado el plan de medición. GA4 sigue detenido en el 31 de julio y Search Console/Cloudflare Web Analytics siguen sin acceso.

- **2026-08-04 (daily 2)**: traducidos tres grupos adicionales a los cinco locales, integrada la herramienta `social-media-image-sizes` en seis idiomas y corregidos los enlaces/aliases que rompían el pipeline; resultado 614 URLs canónicas, 616 HTML y validación 0 errores con tests 7/7.

- **2026-08-04 (weekly)**: revisión semanal ejecutada sin el wrapper heredado de Claude. Se cerraron cuatro grupos de traducción, se eliminaron rutas ES duplicadas, se verificaron 580 URLs canónicas/582 HTML sin errores y se mantuvo SlimeForge como primera investigación de rendimiento; GA4 sigue siendo la última fuente completa disponible mientras Search Console continúa con `invalid_grant`.

- **2026-08-01 (daily)**: mejorado el snippet de `resize-image-for-tiktok-profile-picture` (149 impresiones, posición 15,1, CTR 0,67 %) y completadas las traducciones ES de cuatro grupos con deuda de una sola lengua. Se eliminaron duplicados ES, se repararon enlaces/hreflang y se regeneraron sitemap/GEO. Validación 0 errores y tests 7/7.

- **2026-07-31 (daily)**: mejorado el snippet de `cyberchef-alternatives` (53 impresiones, posición 13,2, CTR 1,89 %) con un título y una meta description orientados a herramientas de texto de uso diario; corregida además una colisión de slug en la traducción ES de `free-config-sanitizer-alternatives`. Validación completa: 0 errores y 7/7 tests.
- **2026-07-31 (daily 2)**: mejorado el snippet de `forest-app-alternatives-chrome` (163 impresiones, posición 21,4, CTR 0 %) con un título y una descripción completos orientados a alternativas de Forest para Chrome. En la misma ejecución se completaron las traducciones ES estructuradas de Forest y CyberChef; no se creó URL nueva de producto.
