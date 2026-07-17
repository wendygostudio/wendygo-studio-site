# WendyGo Studio — documento maestro de web y extensiones

**Versión:** 5.0  
**Fecha de consolidación:** 16 de julio de 2026  
**Ámbito:** web pública `wendygo-site`, familia de seis extensiones y reglas conocidas del agente SEO  
**Estado del documento:** fuente de verdad consolidada  
**Documento anterior:** `entrada-maestro-v4_6.md` (historial cronológico consolidado aquí)

---

## 0. Cómo debe usar una IA este documento

### 0.1 Prioridad de la información

1. El **estado actual** y las **fichas de producto** tienen prioridad sobre el historial.
2. Las **reglas obligatorias** deben respetarse al generar o modificar contenido.
3. Los datos marcados como **pendientes** no deben presentarse públicamente como realizados.
4. Los campos marcados como **no documentados** no se deben completar por inferencia.
5. El **registro de decisiones** explica por qué existe el estado actual, pero no sustituye las fichas vigentes.

### 0.2 Estados utilizados

- **Confirmado:** comprobado en el repositorio, en el dashboard correspondiente o por Damián.
- **Pendiente:** decidido o identificado, pero todavía no implementado o cerrado.
- **Histórico:** fue cierto durante una fase anterior, pero ya no representa el estado actual.
- **No documentado:** el documento disponible no contiene el dato; una IA no debe inventarlo.

### 0.3 Regla contra datos volátiles

No fijar como datos maestros cifras que cambian con frecuencia, por ejemplo:

- Número total de URLs del sitemap.
- Número de artículos publicados por producto.
- Número de archivos modificados en una sesión.
- Posición o ranking en tiendas y buscadores.

Cuando se necesiten esas cifras, deben calcularse contra el repositorio o la fuente viva en el momento de la tarea.

---

## 1. Resumen del ecosistema

WendyGo Studio mantiene una familia de **seis extensiones de navegador centradas en privacidad**:

1. TextForge
2. FrameForge
3. ConvertForge
4. ScrubForge
5. ClaimForge
6. SlimeForge

### 1.1 Principios comunes confirmados

- La comunicación pública debe hablar de **permisos mínimos**, no de “cero permisos”.
- El procesamiento se presenta como local cuando así está confirmado en la ficha correspondiente.
- Creem es el **Merchant of Record actual**.
- Algunas compras antiguas de TextForge y FrameForge se realizaron mediante Lemon Squeezy; es información de legado.
- Existe un trial PRO de cinco días sin tarjeta.
- El trial se gestiona localmente y su finalización no borra los datos del usuario.
- La web utiliza Cloudflare Pages.
- La web utiliza Cloudflare Web Analytics: analítica agregada, sin cookies.
- La web está disponible en inglés y español.
- Las extensiones se distribuyen mediante Chrome Web Store.
- Microsoft Edge permite instalar extensiones desde Chrome Web Store. Esto no significa que las extensiones estén publicadas en Microsoft Edge Add-ons.

### 1.2 Claims globales permitidos

- “Six privacy-first Chrome extensions”.
- “Minimal permissions” / “Permisos mínimos”.
- Compatibilidad con Chrome.
- Compatibilidad con Edge **mediante instalación desde Chrome Web Store**.

### 1.3 Claims globales prohibidos u obsoletos

- “Zero permissions” / “Cero permisos”.
- “Three tools” / “Tres herramientas”.
- “No analytics on this website”.
- “No trial period”.
- Presentar Lemon Squeezy como Merchant of Record actual.
- Afirmar que una extensión está disponible en Edge Add-ons sin una ficha real verificada.
- Enlazar a la portada genérica de Edge Add-ons como si fuera una ficha de producto.

---

## 2. Matriz de productos

| Producto | Función principal conocida | IA local | Idiomas | Estado CWS | Landing EN/ES | OG propia |
|---|---|---:|---:|---|---|---|
| TextForge | Herramientas de transformación de texto | Gemini Nano | 6 | Publicada; ID no documentado aquí | Sí / Sí | Sí |
| FrameForge | Procesamiento y adaptación de imágenes | 2 IA locales | 6 | Publicada; ID no documentado aquí | Sí / Sí | Sí |
| ConvertForge | Conversión local de imágenes, audio, documentos y datos; incluye OCR | No documentada | No documentado | Publicada | Sí / Sí | Sí |
| ScrubForge | Detección y limpieza local de datos sensibles | BYOK; otros detalles no documentados | 6 | Publicada; ID no documentado aquí | Sí / Sí | Sí |
| ClaimForge | Asistencia para reclamaciones de consumo en seis países de la UE | IA local | 6 | Publicada; ID no documentado aquí | Sí / Sí | Sí |
| SlimeForge | Pomodoro con mascota de concentración y progresión | Gemini Nano on-device | 6 | Publicada | Sí / Sí | Sí |

> **Nota:** “Publicada” para TextForge, FrameForge, ScrubForge y ClaimForge se deduce de que la web ya utilizaba botones reales de Chrome Web Store. Sus IDs y URLs exactos no estaban incluidos en el documento maestro recibido y deben incorporarse cuando se verifiquen.

---

## 3. Fichas de producto

## 3.1 TextForge

### Identidad y posicionamiento

- **Categoría:** productividad y transformación de texto.
- **Diferenciadores confirmados:** 58 funciones; IA local con Gemini Nano; procesamiento 100 % local; seis idiomas.
- **Claims históricos retirados:** “Zero permissions” y “EN+ES”. El primero era falso y el segundo quedó desactualizado al pasar a seis idiomas.

### Distribución

- **Landing EN:** `https://wendygostudio.com/textforge/`
- **Landing ES:** `https://wendygostudio.com/es/textforge/`
- **Chrome Web Store:** publicada; URL e ID no documentados en esta versión.
- **Edge:** instalable desde Chrome Web Store; no hay ficha propia de Edge Add-ons documentada.

### IA, privacidad y permisos

- Gemini Nano on-device.
- Procesamiento 100 % local.
- Declara el permiso opcional de `api.creem.io` para activación/licencia.
- Los detalles completos de permisos obligatorios no están documentados aquí.

### Comercial

- Trial PRO de cinco días sin tarjeta.
- Precios actuales: no documentados en el archivo recibido.
- Merchant of Record actual: Creem.
- Legado: pueden existir compras antiguas procesadas por Lemon Squeezy.

### Marketing

- **Imagen OG:** `/images/og/textforge-og.png`
- Copy verificado para la imagen OG: “58 functions” · “Local AI · Gemini Nano” · “100% local” · “6 languages”.

## 3.2 FrameForge

### Identidad y posicionamiento

- **Categoría:** procesamiento y adaptación local de imágenes.
- **Diferenciadores confirmados:** dos IA locales; procesamiento 100 % local; sin subida; seis idiomas.
- **Claim histórico retirado:** “Zero permissions”.

### Distribución

- **Landing EN:** `https://wendygostudio.com/frameforge/`
- **Landing ES:** `https://wendygostudio.com/es/frameforge/`
- **Chrome Web Store:** publicada; URL e ID no documentados en esta versión.
- **Edge:** instalable desde Chrome Web Store; no hay ficha propia de Edge Add-ons documentada.

### IA, privacidad y permisos

- Dos IA locales; modelos o funciones concretas no documentados aquí.
- Procesamiento 100 % local y sin subida de archivos.
- Declara el permiso opcional de `api.creem.io` para activación/licencia.
- Los detalles completos de permisos obligatorios no están documentados aquí.

### Comercial

- Trial PRO de cinco días sin tarjeta.
- Precios actuales: no documentados en el archivo recibido.
- Merchant of Record actual: Creem.
- Legado: pueden existir compras antiguas procesadas por Lemon Squeezy.

### Marketing

- **Imagen OG:** `/images/og/frameforge-og.png`
- Copy verificado para la imagen OG: “2 local AIs” · “100% local” · “No upload” · “6 languages”.

## 3.3 ConvertForge

### Identidad y posicionamiento

- **Categoría:** conversión local de archivos.
- **Funciones confirmadas:** convierte imágenes, audio, documentos y datos; incluye OCR.
- El copy antiguo “images & data” quedó incompleto y no debe reutilizarse como descripción total del producto.

### Distribución

- **Landing EN:** `https://wendygostudio.com/convertforge/`
- **Landing ES:** `https://wendygostudio.com/es/convertforge/`
- **Estado:** publicada en Chrome Web Store el 15 de julio de 2026.
- **Chrome Web Store ID:** `mjmamnnhophdhccknmgnppcdkojkpagj`
- **URL interna de instalación:** `/convertforge/install`
- **Redirección:** 301 a `https://chromewebstore.google.com/detail/mjmamnnhophdhccknmgnppcdkojkpagj`
- **Edge:** instalable desde Chrome Web Store; no hay ficha propia de Edge Add-ons documentada.

### IA, privacidad y permisos

- Gemini Nano on-device está indicado en la política global para TextForge, ConvertForge y SlimeForge.
- Los detalles funcionales de Nano y la lista completa de permisos no están documentados aquí.

### Comercial

- Trial PRO de cinco días sin tarjeta.
- Precios actuales: no documentados en el archivo recibido.
- Merchant of Record actual: Creem.

### Marketing

- **Imagen OG:** `/images/og/convertforge-og.png`
- Copy verificado: “images, audio, documents & data. OCR included”.
- Ya no debe presentarse como “coming soon”.
- Ya no es la única prioridad del agente SEO: participa en la rotación normal de los seis productos.

## 3.4 ScrubForge

### Identidad y posicionamiento

- **Categoría:** detección, anonimización y limpieza de información sensible.
- **Diferenciadores confirmados:** más de 120 patrones; procesamiento 100 % local; BYOK; seis idiomas.

### Planes y precios confirmados

- Modelo actual de **dos tiers**: Free y PRO.
- El tier Expert ya no existe y no debe mencionarse.
- **PRO mensual:** 5,99 €.
- **PRO anual:** 34,99 €.
- **PRO lifetime:** 69,99 €.
- Los tokens sensibles al formato están incluidos en Free.
- Precios confirmados por Damián contra el dashboard de Creem el 15 de julio de 2026.

### Distribución

- **Landing EN:** `https://wendygostudio.com/scrubforge/`
- **Landing ES:** `https://wendygostudio.com/es/scrubforge/`
- **Chrome Web Store:** publicada; URL e ID no documentados en esta versión.
- **Edge:** instalable desde Chrome Web Store; no hay ficha propia de Edge Add-ons documentada.

### Privacidad y permisos

- Procesamiento 100 % local.
- Usa `storage`.
- Declara el permiso opcional de `api.creem.io` para activación/licencia.
- Otros permisos: no documentados aquí.

### Comercial

- Trial PRO de cinco días sin tarjeta.
- Merchant of Record actual: Creem.

### Marketing

- **Imagen OG:** `/images/og/scrubforge-og.png`
- Copy verificado: “120+ patterns” · “100% local” · “BYOK” · “6 languages”.

## 3.5 ClaimForge

### Identidad y posicionamiento

- **Categoría:** asistencia para reclamaciones y derechos de consumo europeos.
- **Diferenciadores confirmados:** cobertura de seis países de la UE; procesamiento 100 % local; IA local; seis idiomas.
- **Advertencia obligatoria:** ClaimForge no constituye asesoramiento legal.

### Distribución

- **Landing EN:** `https://wendygostudio.com/claimforge/`
- **Landing ES:** `https://wendygostudio.com/es/claimforge/`
- **Chrome Web Store:** publicada; URL e ID no documentados en esta versión.
- **Edge:** instalable desde Chrome Web Store; no hay ficha propia de Edge Add-ons documentada.

### IA, privacidad y permisos

- IA local.
- Procesamiento 100 % local.
- Declara el permiso opcional de `api.creem.io` para activación/licencia.
- Los modelos y permisos completos no están documentados aquí.

### Comercial

- Trial PRO de cinco días sin tarjeta.
- Precios actuales: no documentados en el archivo recibido.
- Merchant of Record actual: Creem.

### Marketing

- **Imagen OG:** `/images/og/claimforge-og.png`
- Copy verificado: “6 EU countries” · “100% local” · “Local AI” · “6 languages”.
- El texto del botón de instalación debe seguir la convención común “↗ Chrome Web Store”; no usar la variante histórica “Add to Chrome”.

## 3.6 SlimeForge

### Identidad y posicionamiento

- **Categoría:** productividad; temporizador Pomodoro y mascota de concentración.
- **Propuesta de valor:** “Your focus, made visible”.
- **Tagline EN:** “focus · hatch · bond”.
- **Tagline ES:** “enfoca · eclosiona · crea vínculo”.
- **Hero EN:** “Focus. Hatch. Watch it grow.”

### Funciones confirmadas

- Pomodoro completo.
- El primer huevo eclosiona al completar la primera sesión.
- 16 especies.
- Cuatro rarezas.
- Gemini Nano on-device.
- Seis idiomas.
- Gacha ético: el dinero real nunca compra azar.
- Trial PRO de cinco días.
- **PRO:** manada de tres; Forja tres veces al mes; cosméticos; multiplicador ×1.5 de Brasas; Reserva con capacidad 25.

### Planes y precios confirmados

- Free: 0 €.
- Mensual: 1,99 €.
- Anual: 9,99 €.
- Lifetime: 19,99 €.
- Precios confirmados por Damián contra el dashboard de Creem el 15 de julio de 2026.

### Distribución

- **Landing EN:** `https://wendygostudio.com/slimeforge/`
- **Landing ES:** `https://wendygostudio.com/es/slimeforge/`
- **Estado:** publicada en Chrome Web Store el 15 de julio de 2026.
- **Chrome Web Store ID:** `dobhabpmcmpfdihchnhbickecelihhbc`
- **URL interna de instalación:** `/slimeforge/install`
- **Redirección:** 301 a `https://chromewebstore.google.com/detail/dobhabpmcmpfdihchnhbickecelihhbc`
- **Edge:** instalable desde Chrome Web Store; no hay ficha propia de Edge Add-ons documentada.

### IA, privacidad y permisos

- Gemini Nano on-device; funcionamiento best-effort.
- La ausencia o indisponibilidad de Nano no se considera un defecto del producto.
- Permisos declarados: `storage`, `alarms`, `scripting`, `activeTab` y acceso opcional a sitios.
- La mascota en página es opcional.
- Un content script puede leer localmente el título de la página para proporcionar contexto.
- El título leído no se transmite.

### Economía virtual y datos

- Las Brasas no tienen valor monetario.
- El dinero real nunca compra resultados aleatorios.
- La partida se guarda localmente.
- Existe exportación e importación del guardado.
- El balance de la economía o progresión puede ajustarse.

### Marketing

- **Imagen OG:** `/images/og/slimeforge-og.png`
- La imagen se reencuadró desde el promo original a 1200 × 630.
- Ya no debe presentarse como “coming soon”.

---

## 4. Web pública

### 4.1 Stack y analítica

- Hosting confirmado: Cloudflare Pages.
- “Netlify” era un residuo de una migración anterior y no debe reaparecer.
- Analítica: Cloudflare Web Analytics.
- Características comunicadas: agregada y sin cookies.

### 4.2 Home EN y ES

- Archivos: `public/index.html` y `public/es/index.html`.
- La home presenta las seis extensiones.
- Título, meta description, Open Graph, Twitter y `Organization.description` deben reflejar una familia de seis extensiones.
- Las meta descriptions se mantuvieron en un máximo de 150 caracteres durante la revisión de referencia.
- En atributos `content`, `&` debe escaparse como `&amp;`.
- El badge global correcto es “Minimal permissions” / “Permisos mínimos”.
- El encabezado de familia correcto es “Six extensions” / “Seis extensiones”.
- El precio de entrada global conocido es “from €1.99/mo”.
- El bloque de funcionamiento debe explicar el trial PRO de cinco días sin tarjeta y que no se borran datos al finalizar.
- La cuadrícula de privacidad debe explicar que Creem solicita su permiso opcional únicamente cuando el usuario pulsa Activar.
- El footer incluye X/Twitter, Bluesky y Dev.to.
- Los seis botones de las cards usan el formato común “↗ Chrome Web Store”.
- No debe haber botones de Edge Add-ons mientras no exista una ficha real individual.
- Es válido mencionar Edge si se aclara o se entiende que la instalación se realiza desde Chrome Web Store.

### 4.3 Landings de producto

- Existen 12 landings: seis EN y seis ES.
- Cada pareja debe tener canonical y `hreflang` EN/ES cruzados.
- Cada landing utiliza `BreadcrumbList` y `SoftwareApplication` cuando corresponde.
- Cada landing apunta a su imagen OG específica.
- Convención de imagen: `/images/og/{producto}-og.png`.
- Las landings de SlimeForge incluyen `applicationCategory: Productivity`.
- La cross-promo documentada en SlimeForge enlaza TextForge, FrameForge, ConvertForge y ClaimForge.

### 4.4 Imágenes Open Graph

- Formato objetivo: 1200 × 630 px.
- Existen seis imágenes específicas en `public/images/og/`.
- Las 12 landings de producto usan su imagen correspondiente en `og:image` y `twitter:image`.
- Home, blog, herramientas y páginas legales mantienen la imagen genérica `https://wendygostudio.com/og-image.png` porque representa al estudio.
- Las imágenes actuales reutilizan el arte original de cada extensión; no se redibujaron los iconos.
- Se utilizó Liberation Sans como aproximación a la fuente original.
- **Pendiente:** regenerar las seis piezas con la tipografía original en Figma o Canva y conservar el copy corregido.

### 4.5 URLs legales

- URLs canónicas vigentes:
  - `https://wendygostudio.com/privacy`
  - `https://wendygostudio.com/terms`
  - `https://wendygostudio.com/es/privacy`
  - `https://wendygostudio.com/es/terms`
- Nunca generar enlaces públicos a `/privacy.html`, `/terms.html`, `/es/privacy.html` o `/es/terms.html`.
- Cloudflare Pages redirige automáticamente las variantes `.html` mediante 307; usar directamente la URL limpia evita el salto y mantiene alineados canonical, Open Graph y hreflang.
- El antiguo enlace relativo `goodbye/privacy.html` estaba roto; debe utilizarse una URL absoluta o desde raíz.

### 4.6 Sitemap

- Debe incluir las versiones EN y ES de las seis landings y las cuatro URLs legales limpias.
- Debe mantener los pares `hreflang` correctos.
- Debe validarse como XML después de cualquier modificación.
- No conservar un recuento fijo de URLs como dato maestro; calcularlo cuando se necesite.

---

## 5. Privacidad, licencias y términos

### 5.1 Merchant of Record y activación

- Creem es el único Merchant of Record actual.
- El host opcional `api.creem.io` se solicita al pulsar Activar.
- Las compras antiguas de TextForge y FrameForge mediante Lemon Squeezy se conservan como legado.

### 5.2 Trial

- Duración: cinco días de PRO.
- No requiere tarjeta.
- Estado gestionado localmente.
- El final del trial no borra datos del usuario.

### 5.3 Gemini Nano

- Productos documentados con Nano on-device: TextForge, ConvertForge y SlimeForge.
- Se describe como una capacidad best-effort.
- Su indisponibilidad no constituye por sí sola un defecto del producto.

### 5.4 Content scripts

- La política explica que algunas funciones opcionales pueden ejecutarse dentro de una página.
- En SlimeForge, la mascota opcional puede leer localmente el título de la página para contexto.
- Esa información no se transmite.

### 5.5 Términos específicos

- SlimeForge: reglas sobre Brasas, azar, guardado local, exportación/importación y ajustes de balance.
- ClaimForge: no es asesoramiento legal.
- Los términos incluyen una salvaguarda de los derechos imperativos aplicables en la UE y España.

---

## 6. Reglas del agente SEO

> El repositorio actual revisado contiene `wendygo-site`, pero no contiene `wendygo-agent/prompts/`. Las reglas de esta sección proceden del documento anterior y deben verificarse contra el repositorio del agente cuando esté disponible.

### 6.1 Conocimiento obligatorio

- Debe conocer las seis extensiones.
- Debe utilizar las landings y URLs reales.
- Nunca debe mencionar el tier Expert de ScrubForge.
- Debe describir correctamente el gacha ético de SlimeForge.
- Debe usar Cloudflare Pages, no Netlify.
- Debe usar las URLs legales limpias sin `.html`.
- El footer canónico incluye X/Twitter, Bluesky y Dev.to.
- Para contenido monotema puede usar `/images/og/{producto}-og.png`.

### 6.2 Selección de producto por cobertura

- Antes de elegir el tipo de artículo, el agente debe calcular en vivo la cobertura de cada producto en `public/blog/` y `public/es/blog/`.
- Debe priorizar el producto con menor cobertura.
- En caso de empate, prioriza el producto lanzado más recientemente.
- No conservar en este documento los recuentos obtenidos en una ejecución anterior.

### 6.3 Dos artículos al día

- Se consiguen mediante dos ejecuciones completas.
- Las ejecuciones deben ser secuenciales, nunca paralelas.
- La segunda ejecución debe leer el repositorio después de que la primera haya publicado su artículo.
- Ejecutarlas en paralelo podría repetir producto y provocar condiciones de carrera en `public/sitemap.xml` y `public/blog/index.html`.
- Máximo: un artículo por ejecución.
- Cada ejecución debe completar todo el pipeline:
  - investigación de keywords;
  - artículo de 600–900 palabras;
  - tres schemas obligatorios;
  - actualización de sitemap;
  - actualización del índice del blog;
  - actualización del journal.
- No recortar pasos en la segunda ejecución.

### 6.4 Orquestación pendiente

- El prompt quedó preparado para dos ejecuciones diarias.
- La programación real depende de `orchestrator.sh` o del cron correspondiente.
- El orquestador no estaba incluido en el material revisado.
- **Pendiente:** configurar dos llamadas diarias secuenciales y verificar que no puedan solaparse.

---

## 7. Convenciones y verificaciones obligatorias

### 7.1 Triple propagación

Cuando cambie un dato de producto, revisar como mínimo:

1. Web: home, landing, legal, sitemap, redirects e imágenes si aplica.
2. Agente: `system-prompt.md`, `daily-seo.md` y prompts especializados si no heredan el dato.
3. Distribución/comercial: Chrome Web Store, Creem y cualquier ficha externa afectada.

La expresión “triple propagación §12” aparecía en el documento anterior sin una definición autónoma. Esta sección formaliza la regla según los cambios registrados.

### 7.2 Checklist técnico

- Validar balance de etiquetas de los HTML modificados.
- Validar `sitemap.xml` con un parser XML.
- Verificar canonical, `hreflang`, `og:url`, `og:image` y `twitter:image`.
- Contar meta descriptions cuando exista una restricción editorial.
- Escapar `&` como `&amp;` dentro de atributos HTML.
- Buscar claims obsoletos globalmente.
- Comprobar que las URLs de tienda apuntan a fichas reales o a redirects internos válidos.
- Comprobar que no existan enlaces legales con `.html`.

---

## 8. Pendientes activos

### P-001 — Slug público de SlimeForge en Chrome Web Store

- **Estado:** pendiente.
- El slug generado por Google contenía un em dash codificado por provenir del título “SlimeForge — Pomodoro Timer…”.
- La ficha se resuelve por ID, por lo que el slug es decorativo y no afecta al identificador.
- Puede verse extraño en previews si se comparte la URL larga.
- Posible implementación: cambiar el título de la ficha a “SlimeForge: Pomodoro Timer & Focus Pet” o una variante sin em dash.
- Antes de cambiarlo, comprobar el comportamiento actual de Chrome Web Store y conservar siempre el ID `dobhabpmcmpfdihchnhbickecelihhbc`.

### P-002 — Regenerar las seis imágenes OG con la tipografía original

- **Estado:** pendiente.
- Las imágenes actuales son funcionales y contienen copy corregido.
- Se utilizó Liberation Sans como aproximación.
- Implementación deseada: recrearlas en Figma o Canva con la fuente original, manteniendo 1200 × 630 y los claims vigentes de cada ficha.

### P-003 — Programar dos ejecuciones SEO diarias

- **Estado:** pendiente.
- Ajustar `orchestrator.sh` o cron.
- Las ejecuciones deben ser secuenciales y no solaparse.
- Verificar bloqueo o mecanismo equivalente antes de activar producción.

### P-004 — Completar datos no documentados de las seis extensiones

- **Estado:** pendiente de inventario.
- Incorporar IDs y URLs de Chrome Web Store de TextForge, FrameForge, ScrubForge y ClaimForge.
- Incorporar precios vigentes de TextForge, FrameForge, ConvertForge y ClaimForge.
- Incorporar listas completas de permisos por extensión.
- Incorporar desglose Free/PRO y límites de cada producto.
- Verificar la función exacta de cada IA local y su disponibilidad por navegador.

### P-005 — Verificar repositorio del agente

- **Estado:** pendiente.
- Contrastar esta sección con `wendygo-agent/prompts/system-prompt.md` y `daily-seo.md`.
- Confirmar ubicación y funcionamiento del orquestador.

---

## 9. Registro de decisiones importantes

### D-001 — Sustituir “cero permisos” por “permisos mínimos”

- **Decisión:** completada.
- **Motivo:** el claim anterior era falso; ScrubForge y SlimeForge usan permisos como `storage`, y las extensiones pueden solicitar acceso opcional a Creem.

### D-002 — Presentar una familia de seis extensiones

- **Decisión:** completada.
- Se actualizaron home, metadatos, datos estructurados y mensajes del agente.

### D-003 — ScrubForge pasa a dos tiers

- **Decisión:** completada.
- Se eliminó Expert y se confirmaron los precios PRO 5,99/34,99/69,99 €.

### D-004 — Trial PRO de cinco días

- **Decisión:** completada.
- Sustituye al mensaje histórico “No trial period”.

### D-005 — Corregir la declaración de analítica

- **Decisión:** completada.
- La web sí usa Cloudflare Web Analytics; la política debe decirlo de forma transparente.

### D-006 — Creem como Merchant of Record actual

- **Decisión:** completada.
- Lemon Squeezy queda únicamente como legado para compras antiguas de TextForge y FrameForge.

### D-007 — Publicación de SlimeForge

- **Decisión:** completada el 15 de julio de 2026.
- Se sustituyeron CTAs provisionales y reglas que prohibían enlazar a la tienda.

### D-008 — Páginas legales completas en español

- **Decisión:** completada.
- Se crearon traducciones íntegras y se corrigieron enlaces y selectores de idioma.

### D-009 — Cloudflare Pages como hosting real

- **Decisión:** completada.
- Se eliminó la referencia residual a Netlify.

### D-010 — Imágenes OG específicas por producto

- **Decisión:** completada funcionalmente.
- Se generaron seis imágenes 1200 × 630 y se corrigieron claims antiguos.
- La mejora tipográfica permanece como P-002.

### D-011 — URLs legales limpias

- **Decisión:** completada.
- Canonical, Open Graph, hreflang, sitemap y enlaces internos usan rutas sin `.html`.

### D-012 — Eliminar botones genéricos de Edge Add-ons

- **Decisión:** completada.
- Los botones apuntaban a la portada de la tienda, no a fichas reales.
- Se conserva la compatibilidad declarada con Edge porque este permite instalar desde Chrome Web Store.

### D-013 — Publicación de ConvertForge

- **Decisión:** completada el 15 de julio de 2026.
- Se sustituyeron mensajes “coming soon” y entró en la rotación SEO normal.

### D-014 — Unificar CTAs de Chrome Web Store

- **Decisión:** completada.
- Formato común: “↗ Chrome Web Store”.

### D-015 — Rotación SEO por producto menos cubierto

- **Decisión:** completada en el prompt.
- El recuento se calcula en vivo antes de elegir el tipo de artículo.

### D-016 — Preparar dos artículos diarios sin reducir calidad

- **Decisión:** completada en el prompt; despliegue del orquestador pendiente.
- Dos ejecuciones completas, secuenciales y de un solo artículo cada una.

---

## 10. Antecedentes históricos preservados

Esta sección conserva hechos que explican decisiones actuales, pero que no deben utilizarse como estado vigente:

- SlimeForge y ConvertForge utilizaron inicialmente CTAs provisionales antes de publicarse.
- SlimeForge enlazaba temporalmente a `/#products` siguiendo el patrón previo de ConvertForge.
- El sitemap pasó por recuentos de 102 y 104 URLs durante las primeras sesiones; esos números ya no son canónicos.
- Las seis landings, la home y las páginas legales compartían originalmente una única `og-image.png`.
- Los promos originales de TextForge, FrameForge, ScrubForge y ClaimForge contenían “Zero permissions”.
- TextForge mostraba “EN+ES” antes de documentarse seis idiomas.
- ConvertForge se describía solo como conversor de “images & data”.
- ClaimForge utilizó una variante de CTA “Add to Chrome” / “Añadir a Chrome”.
- TextForge y FrameForge mostraban botones de Edge Add-ons que enlazaban a la portada genérica.
- Las páginas legales utilizaban URLs `.html` que Cloudflare redirigía mediante 307.
- `goodbye/index.html` contenía un enlace relativo roto a `privacy.html`.
- El agente SEO alternaba tipos de artículo, pero no productos, antes de añadirse el recuento por cobertura.
- El primer artículo tras el lanzamiento de SlimeForge no fue sobre SlimeForge; este incidente originó la regla de cobertura.
- En la fotografía de ese momento, SlimeForge tenía 0 menciones en títulos frente a una cobertura superior de los otros productos. Esos recuentos no deben reutilizarse.
- Los ZIP y comandos de copia citados en sesiones anteriores fueron mecanismos de entrega puntuales y no forman parte de la arquitectura canónica.

---

## 11. Fuentes de verificación

### 11.1 Repositorio local

- `public/index.html`
- `public/es/index.html`
- `public/{producto}/index.html`
- `public/es/{producto}/index.html`
- `public/privacy.html`
- `public/terms.html`
- `public/es/privacy.html`
- `public/es/terms.html`
- `public/sitemap.xml`
- `public/_redirects`
- `public/images/og/`

### 11.2 Fuentes externas

- Dashboard de Creem para precios, productos y licencias.
- Chrome Web Store para publicación, ID, URL, título y slug.
- Documentación oficial de Microsoft Edge para instalación desde Chrome Web Store.
- Repositorio `wendygo-agent` para prompts, rotación y orquestación.

### 11.3 Regla de actualización

Cuando una fuente externa contradiga este documento:

1. Verificar que se trata del mismo producto y entorno.
2. Actualizar primero la ficha de estado actual.
3. Registrar la decisión o corrección en el apartado 9.
4. Añadir o cerrar el pendiente correspondiente en el apartado 8.
5. Propagar el cambio según la sección 7.1.

