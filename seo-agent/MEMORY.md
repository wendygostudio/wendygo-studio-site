# Memoria del Proyecto — Wendygo Studio

Este archivo es la memoria persistente del agente de crecimiento de Wendygo Studio.
No es un journal diario (eso ya vive en `journal/YYYY-MM-DD.md`) — es continuidad
estratégica entre ejecuciones. Léelo COMPLETO al empezar cualquier tarea
(`daily-seo`, `weekly-review` o cualquier tarea futura) y actualízalo antes de
terminar.

Dos secciones: **memoria de negocio** (decisiones que no deben reinterpretarse
sin más) y **memoria SEO** (qué se hizo, qué se esperaba, qué ocurrió).

---

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
  status: pending
  result: ""
```

---

## 3. Historial de ejecuciones recientes (rolling log)

Una línea por ejecución, más reciente arriba. Mantén máximo 15 líneas — al
añadir una nueva, elimina la más antigua si ya hay 15.

- **2026-07-28 (daily)**: enlazado interno hacia `credit-card-chargeback-eu` (pos 15.4, solo 2 enlaces reales) añadiendo 4 links naturales (2 EN + 2 ES) desde artículos ClaimForge que ya mencionaban "chargeback" en texto de escalada. Publicado artículo SlimeForge sobre "gamified pomodoro timer" (gap no cubierto, 700+ palabras, 3 schemas, 3 internal links, validación OK). `ensure-language-switchers.mjs` requiere ejecución manual antes de `validate` — situación pre-existente al día.
- **2026-07-27 (weekly)**: auditoría técnica completa (0 errores en toda la cadena de validación + 7/7 tests). Hallazgo crítico: 25 artículos de ClaimForge (GDPR/garantía/reparación, sobre todo DE/FR/IT/PT) sin aviso legal por un bug de casing (`ClaimForge` vs `claimforge`) en `render-blog.mjs`, agravado porque `validate-governance.mjs` solo comprobaba en/es. Ambos corregidos y verificados. Observación de contenido: 0 artículos de tipo `comparison` (existe como categoría distinta de `alternatives` mas no se usa). Sin gap competitivo nuevo ni outreach preparado esta semana — no es la palanca de mayor retorno todavía. Informe completo en `journal/weekly-2026-07-27.md`.
- **2026-07-27 (daily)**: primera ejecución con el prompt Growth Engineer. Corregida codificación rota de `analytics-data.json` (5 bytes Latin-1 sueltos). `analytics-fetch.py` no puede correr desde este sandbox (deps + ruta Windows hardcodeada) — pendiente de refrescar datos desde la máquina real. Detectado hueco real de enlazado interno en `resize-image-for-pinterest-pin` (0 enlaces entrantes) vs. otras páginas en posición 8-20 ya bien enlazadas; añadidos 6 enlaces (3 EN + 3 ES). Experimento `id: 1` registrado, medir 2026-08-26. No se publicó artículo nuevo — sin justificación de mayor impacto que el enlazado.
