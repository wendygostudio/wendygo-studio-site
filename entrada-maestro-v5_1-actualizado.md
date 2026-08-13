# WendyGo Studio — documento maestro de web y extensiones

**Versión:** 5.1  
**Fecha de consolidación original:** 23 de julio de 2026  
**Actualización consolidada:** 26 de julio de 2026  
**Ámbito:** web pública `wendygo-site`, familia de seis extensiones y reglas conocidas del agente SEO  
**Estado del documento:** fuente de verdad consolidada  
**Documento anterior:** `entrada-maestro-v5_0.md` (historial cronológico consolidado aquí)

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
- **Versión de referencia documentada:** 1.8.0 (commercial/legal/CWS) · **1.9.13** (código técnico, ver nota de consolidación).
- **Enfoque de producto vigente:** foco primero, juego progresivo después; la interfaz se desbloquea por uso para no saturar al usuario nuevo.

> **Nota de esta consolidación (v5.1):** el código técnico revisado en la sesión de desarrollo de esta consolidación llega hasta la versión **1.9.13** del `manifest.json`. Los cambios funcionales confirmados entre 1.8.0 y 1.9.13 se listan más abajo y en el registro de decisiones (D-021 en adelante). Los cambios comerciales, de precios o de estado de publicación en Chrome Web Store para ese rango de versiones **no están documentados** en esta consolidación — no deben inferirse a partir de la ficha 1.8.0. Ver también P-006 (reverificado, sigue sin resolver en 1.9.13) y P-007 (nuevo).

### Funciones confirmadas

- Temporizador Pomodoro completo con duraciones 15, 25, 45, 60 minutos y duración personalizada.
- Objetivo por sesión, proyectos y rituales de foco.
- Escudo de Foco con avisos suaves o bloqueo firme de sitios distractores.
- El primer huevo eclosiona al completar la primera sesión de foco.
- 16 especies de slimes animales y cuatro rarezas.
- Progresión por etapas vitales: huevo, chispa, joven, adulto y colosal.
- Desbloqueo progresivo de funciones para que el primer uso sea más claro.
- Mascota opcional en página, con mesa de trabajo y animaciones de acompañamiento.
- Cuidados, hambre, higiene, ánimo, educación, vínculo y crecimiento.
- Misiones diarias, racha amable, minijuegos y huerto.
- Establo, reserva, adopción de nuevas criaturas y modo Manada.
- Vestidor, cosméticos, accesorios y Forja.
- Expediciones con rutas, afinidad de especies, progreso por foco, materiales, recuerdos y reliquias.
- Relicario con nueve reliquias, tres por ruta.
- Hitos de 3, 6 y 9 reliquias únicas que añaden Farol, Arco Resonante y Estanque Lunar al diorama.
- Diorama/escenario como reflejo visual del progreso.
- Gemini Nano on-device como mejora opcional y best-effort.
- Seis idiomas: inglés, español, alemán, francés, italiano y portugués.
- Gacha ético: el dinero real nunca compra azar ni huevos.
- Trial PRO de cinco días activos de foco, sin tarjeta.
- **PRO:** ×1.5 Brasas, Escudo avanzado, listas por ritual, hasta 12 proyectos, métricas de distracción, informe semanal inteligente, manada de tres, modo Manada, reserva ampliada, cosméticos PRO, expediciones completas, accesorios PRO y tres Forjas completas al mes.
- **(1.9.6+)** Pestaña de Preguntas Frecuentes dentro del popup, con contenido en los seis idiomas soportados y nota de que algunas funciones se desbloquean progresivamente jugando.
- **(1.9.8+)** Escalado progresivo por etapa de crecimiento (Chispa a Colosal) para orejas, cuernos y cola de la especie real, en vez de aparecer a tamaño completo desde el primer estadio o no aparecer en absoluto en Chispa.
- **(1.9.9+)** Personalidad de animación en reposo propia por especie, reacción visual de ojos/orejas a la expresión del bicho, cola reactiva a su ánimo, y sistema de rareza de tres niveles (raro / épico / LEGENDARIO) en el Bestiario con tratamiento propio de borde y brillo por nivel.
- **(1.9.11+)** Rediseño visual de las especies míticas para hacerlas más reconocibles y sentirse "especiales de verdad": dragón, hada, fénix, kraken, kitsune y unicornio recibieron rasgos anatómicos propios (alas, tentáculos, melena, pico, orejas) y ambientación (fx) donde antes faltaba.
- **(1.9.12–1.9.13)** Ajustes de diseño en especies no míticas: color de branquias del ajolote y forma de la cola del zorro.

### Planes y precios confirmados

- Free: 0 €.
- Mensual: 1,99 €.
- Anual: 9,99 €.
- Lifetime: 19,99 €.
- Precios confirmados por Damián contra el dashboard de Creem el 15 de julio de 2026.
- **No documentado:** si estos precios siguen vigentes a fecha de la versión 1.9.13; no reverificado en esta consolidación.

### Distribución

- **Landing EN:** `https://wendygostudio.com/slimeforge/`
- **Landing ES:** `https://wendygostudio.com/es/slimeforge/`
- **Estado:** publicada en Chrome Web Store el 15 de julio de 2026.
- **Chrome Web Store ID:** `dobhabpmcmpfdihchnhbickecelihhbc`
- **URL interna de instalación:** `/slimeforge/install`
- **Redirección:** 301 a `https://chromewebstore.google.com/detail/dobhabpmcmpfdihchnhbickecelihhbc`
- **Edge:** instalable desde Chrome Web Store; no hay ficha propia de Edge Add-ons documentada.
- **No documentado:** si alguna de las versiones 1.9.x generadas en la sesión de desarrollo llegó a subirse a esta ficha, o si la ficha pública sigue en 1.8.0 o anterior.

### IA, privacidad y permisos

- Gemini Nano on-device; funcionamiento best-effort.
- La ausencia o indisponibilidad de Nano no se considera un defecto del producto.
- La interfaz debe avisar cuando sea necesario descargar o habilitar Nano para conversaciones avanzadas o análisis inteligente.
- La comprobación de disponibilidad de Nano en 1.8 no debe quedarse indefinidamente en “Comprobando disponibilidad”; consulta el service worker como respaldo.
- Permisos declarados: `storage`, `alarms`, `scripting`, `activeTab`, `notifications` y acceso opcional a sitios (`<all_urls>`, `https://api.creem.io/*`).
- **(nuevo, ver P-007)** Chrome Web Store exige desde julio de 2026 una justificación de texto por cada uno de los permisos `activeTab`, `alarms`, `notifications` y `scripting` en la pestaña Privacy practices del dashboard, obligatoria antes de publicar cualquier actualización.
- La mascota en página es opcional y se activa mediante el permiso opcional de host `<all_urls>` (Modo Manada / Paseo), inyectando `content.js` mediante `chrome.scripting`.
- Un content script puede leer localmente el título de la página para proporcionar contexto.
- El título leído no se transmite.
- Metas, sesiones, actividad de navegación y conversaciones se presentan como datos locales del dispositivo.
- La validación de licencia requiere comunicación con Creem o con el sistema de licencias vigente; no debe describirse como una extensión sin ninguna comunicación externa.

### Economía virtual y datos

- Las Brasas no tienen valor monetario.
- El dinero real nunca compra resultados aleatorios.
- Los huevos nunca se venden por dinero real.
- Las Brasas se ganan con foco y se usan para progreso, cuidado y adopción dentro del juego.
- PRO aumenta la ganancia de Brasas con multiplicador ×1.5, pero no compra azar.
- Las expediciones PRO garantizan al menos un descubrimiento nuevo de su ruta hasta completarla.
- Las reliquias repetidas aumentan su nivel y se muestran como duplicados.
- La partida se guarda localmente.
- Existe exportación e importación del guardado.
- El balance de la economía o progresión puede ajustarse.

### Reparto Free/PRO vigente

- **Free:** temporizador completo, objetivos, Escudo de Foco básico, tres proyectos, un ritual, misiones diarias, racha amable, cuidados, minijuegos, resumen semanal y una expedición gratuita al Bosque cada semana.
- **PRO:** Escudo y proyectos avanzados, horarios, listas por ritual, hasta 12 proyectos, métricas de distracción, informe semanal inteligente, ×1.5 Brasas, experiencia completa de Manada con hasta tres criaturas, reserva ampliada, cosméticos exclusivos, accesorios PRO, expediciones completas con afinidades y reliquias, y tres Forjas completas al mes.
- Las funciones PRO deben mostrarse con aviso o bloqueo claro cuando el usuario no está en trial activo ni tiene licencia.
- Las funciones con versión Free y mejora PRO deben explicar la diferencia dentro de la propia tarjeta o modal.

### QA y preparación 1.8

- El modo de velocidad ×10 era solo una herramienta de prueba y no debe aparecer en compilaciones públicas.
- Los atajos QA, controles de simulación y desbloqueos internos PRO de pruebas fueron retirados de la versión pública.
- Las partidas creadas con versiones de prueba vuelven automáticamente a tiempos reales.
- El paquete de revisión preparado es `slimeforge-v1_8_0-review.zip`.
- Validación local documentada: tests unitarios, comprobación de sintaxis y paridad de idiomas.
- La prueba visual automatizada sobre `chrome-extension://` no quedó disponible desde el controlador de navegador por restricciones de seguridad de la herramienta; debe hacerse manualmente en Chrome cargando la extensión.

### Marketing

- **Imagen OG:** `/images/og/slimeforge-og.png`
- La imagen se reencuadró desde el promo original a 1200 × 630.
- Ya no debe presentarse como “coming soon”.
- La descripción de Chrome Web Store 1.8 está redactada en seis idiomas.
- La comunicación pública debe destacar: foco con mascota, slimes animales, desbloqueo progresivo, Escudo de Foco, proyectos/rituales, expediciones, reliquias, diorama, IA local opcional, privacidad local-first, Free completo y PRO sin venta de huevos por dinero real.
- Evitar el claim “faster growth” para PRO si induce a pensar en crecimiento directo de criaturas; lo correcto es “×1.5 Brasas” o “más Brasas al completar foco”.

---

## 4. Web pública

### 4.0 Idiomas y selector único

- La web pública se mantiene en seis idiomas: inglés (`/`), español (`/es/`), alemán (`/de/`), francés (`/fr/`), italiano (`/it/`) y portugués (`/pt/`).
- El idioma se elige mediante un único selector accesible situado en el encabezado. No deben coexistir el selector del header, enlaces abreviados como `EN 🌐`/`ES 🌐` ni un selector fijo al pie de la pantalla.
- El selector solo debe mostrar destinos que existan y debe construirse a partir de los `hreflang` de la página. Si una página tiene al menos dos versiones locales, debe contener exactamente un selector dentro de la navegación.
- El header debe conservar la legibilidad en anchos intermedios: marca y selector no se encogen ni se solapan; los enlaces de navegación pueden compactar su separación.
- Script de mantenimiento: `scripts/ensure-language-switchers.mjs`. Además de insertar y actualizar el componente, elimina los enlaces heredados de idioma de los artículos antiguos.

### 4.1 Stack y analítica

- Hosting confirmado: Cloudflare Pages.
- “Netlify” era un residuo de una migración anterior y no debe reaparecer.
- Analítica: Cloudflare Web Analytics.
- Características comunicadas: agregada y sin cookies.

### 4.2 Home y superficies locales

- Páginas principales: `public/index.html`, `public/es/index.html`, `public/de/index.html`, `public/fr/index.html`, `public/it/index.html` y `public/pt/index.html`.
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

- Cada una de las seis extensiones dispone de landing en los seis idiomas.
- Cada grupo localizado debe tener canonical propio y los seis `hreflang` cruzados, con `x-default` hacia inglés.
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
- Las superficies DE, FR, IT y PT deben enlazar a sus rutas legales localizadas reales (`datenschutz`/`nutzungsbedingungen`, `confidentialite`/`conditions`, `privacy`/`termini`, `privacidade`/`termos`), nunca a una ruta inglesa por aproximación.

### 4.6 Herramientas localizadas

- La sección `/tools/` y las ocho herramientas (`ip-extractor`, `json-formatter`, `password-generator`, `regex-tester`, `slug-generator`, `subnet-calculator`, `uuid-generator` y `youtube-thumbnail-checker`) existen en los seis idiomas.
- La generación de esta superficie se centraliza en `scripts/localize-tools.mjs`, con textos revisables en `data/tools-translations.json`.
- La navegación de herramientas, los enlaces a blog y las recomendaciones relacionadas deben llevar al equivalente de la misma lengua cuando exista; si no existe, se permite enlazar deliberadamente al original inglés válido, nunca a una URL localizada inexistente.
- Las rutas de recursos estáticos deben conservar su raíz (`/images/...`, favicon, CSS y JS) durante la localización.

### 4.7 Sitemap

- Debe incluir todas las superficies localizadas publicadas y las URLs legales limpias.
- Debe mantener los grupos completos de `hreflang` y `x-default` cuando existan las seis versiones.
- Debe validarse como XML después de cualquier modificación.
- No conservar un recuento fijo de URLs como dato maestro; calcularlo cuando se necesite.

### 4.8 Blog multilingüe y Daily SEO reciente

- El blog mantiene artículos localizados en las seis lenguas. La traducción no se limita al texto: debe propagar título, descripción, URL, enlaces internos, canonical, `hreflang`, índice y sitemap.
- Los artículos traducidos existentes y las nuevas publicaciones deben conservar una presentación editorial escaneable (bloques destacados, listas, pasos y FAQ cuando aporte valor), evitando el formato de texto plano continuo.
- Publicaciones Daily SEO del 26 de julio de 2026, disponibles en los seis idiomas:
  - `linkedin-carousel-image-size` — guía práctica de lienzo, recorte y flujo local con FrameForge para carruseles de LinkedIn.
  - `clean-copied-table-text` — normalización local de tablas copiadas antes de pegarlas, con TextForge.
- Estas publicaciones se eligieron tras medir cobertura viva; ese orden fue correcto para la fecha indicada, pero no debe convertirse en un orden fijo para futuras ejecuciones.

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
- Debe considerar las seis versiones lingüísticas de cualquier artículo nuevo: EN, ES, DE, FR, IT y PT. Publicar solo EN o EN/ES no completa el flujo.
- Los artículos y sus enlaces internos deben mantener la lengua de lectura cuando exista una página equivalente; el inglés queda como fallback explícito y válido.

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
  - artículo útil con estructura editorial, respuestas directas, enlaces internos, FAQ y metadatos;
  - traducción y revisión de las seis variantes antes de considerarlo publicado;
  - tres schemas obligatorios;
  - actualización de sitemap;
  - actualización del índice del blog;
  - actualización del journal.
- No recortar pasos en la segunda ejecución.

### 6.4 Orquestación pendiente

- El prompt quedó preparado para dos ejecuciones diarias y se han ejecutado manualmente ciclos completos desde el repositorio.
- La ejecución heredada `seo-agent/scripts/orchestrator.sh daily` no es actualmente un mecanismo fiable: en la sesión del 26 de julio de 2026 no pudo invocar el binario `claude` desde su entorno Bash y no generó contenido.
- Mientras no se repare y pruebe ese entorno, el proceso operativo es directo en el repositorio: crear fuentes EN y ES, generar/revisar DE/FR/IT/PT, renderizar blog e índices, regenerar selectores y sitemap, y ejecutar la validación completa.
- `scripts/translate-daily-articles.mjs` es un auxiliar de la tanda del 26 de julio, con slugs fechados en el propio script; no debe reutilizarse como automatización genérica sin parametrizarlo.
- **Pendiente:** programar dos llamadas diarias secuenciales contra un ejecutable disponible, con bloqueo para que no se solapen.

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
- Validar que cada página con dos o más `hreflang` contenga un único selector de idioma dentro del header y ningún selector heredado.
- Revisar que los enlaces internos del ecosistema, blog y herramientas no crucen a inglés cuando exista el destino en el idioma actual.
- Tras cambios de contenido, ejecutar la secuencia de renderizado pertinente y `npm run validate`; no publicar por copia manual de HTML incompleto.

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

- **Estado:** pendiente de automatización; el flujo manual ya fue validado.
- Ajustar el orquestador o cron para un entorno donde el ejecutable del agente esté realmente disponible.
- Las ejecuciones deben ser secuenciales y no solaparse.
- Verificar bloqueo o mecanismo equivalente antes de activar producción. La ejecución heredada no debe darse por operativa hasta pasar una prueba de extremo a extremo que cree, renderice y valide contenido.

### P-004 — Completar datos no documentados de las seis extensiones

- **Estado:** pendiente de inventario.
- Incorporar IDs y URLs de Chrome Web Store de TextForge, FrameForge, ScrubForge y ClaimForge.
- Incorporar precios vigentes de TextForge, FrameForge, ConvertForge y ClaimForge.
- Incorporar listas completas de permisos por extensión.
- Incorporar desglose Free/PRO y límites de cada producto.
- Verificar la función exacta de cada IA local y su disponibilidad por navegador.

### P-005 — Verificar repositorio del agente

- **Estado:** pendiente de reparación del entorno heredado.
- Contrastar esta sección con `wendygo-agent/prompts/system-prompt.md` y `daily-seo.md`.
- Confirmar ubicación, dependencias y funcionamiento del orquestador; el intento del 26 de julio confirmó que el script no encuentra `claude` desde Bash en su configuración actual.

### P-006 — Publicación segura de SlimeForge 1.8

- **Estado:** pendiente crítico antes de publicar. **Sigue sin resolver.**
- Revisar `slimeforge-v1.1.0-review/common/license.js` antes de subir el ZIP público.
- La clave privada de Creem no debe estar embebida en código cliente ni en una extensión distribuida.
- Implementación recomendada: mover la verificación de licencia a un backend/proxy propio de WendyGo y rotar la clave actual en Creem.
- No publicar `slimeforge-v1_8_0-review.zip` hasta cerrar este punto.
- **Verificación en esta consolidación (v5.1), 23 de julio de 2026:** se revisó `common/license.js` en el código de la sesión de desarrollo, ya en la versión **1.9.13** del manifest, y la constante `API_KEY` de Creem (`creem_xm01yTmXgiqXmZIJbGtLv`) sigue embebida en texto plano en el archivo, pese al comentario del propio código que dice “se inyecta en el paso de build, nunca al repo”. **El problema no está resuelto** y afecta también a todos los paquetes 1.9.x (`.zip`) generados y entregados durante esa sesión, no solo a la revisión 1.8.0 original. Rotar la clave en Creem si ya se ha distribuido alguno de esos paquetes fuera de un entorno controlado.

### P-007 — Justificación de permisos en Chrome Web Store (activeTab, alarms, notifications, scripting)

- **Estado:** pendiente.
- Detectado el 23 de julio de 2026: el Developer Dashboard de Chrome Web Store exige rellenar una justificación de texto por cada permiso sensible declarado en el manifest (`activeTab`, `alarms`, `notifications`, `scripting`) en la pestaña Privacy practices, y bloquea la publicación de actualizaciones hasta que estén completos.
- El campo de justificación existe en el dashboard desde 2019, pero la aplicación estricta (bloquear la publicación si falta) coincide con el endurecimiento de las políticas de privacidad de Chrome Web Store que entra en vigor el **1 de agosto de 2026** (propósito único, divulgación obligatoria, aviso ante cambios de prácticas de datos).
- Implementación pendiente: rellenar los cuatro campos de justificación en el dashboard antes de subir cualquier próxima actualización. Textos ya redactados en la sesión de desarrollo del 23 de julio de 2026 (conversación sobre permisos de SlimeForge), pendientes de pegar en el dashboard real.
- Relacionado con P-006: cualquier actualización que se suba para resolver P-006 tendrá que pasar también por este requisito.

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

### D-017 — SlimeForge 1.8 reorganiza la experiencia inicial

- **Decisión:** completada en la rama de revisión local.
- Se prioriza el foco como primera experiencia y se deja que juego, colección y funciones avanzadas aparezcan de forma progresiva.
- El primer huevo sigue eclosionando con la primera sesión completada.
- El Escudo de Foco se mantiene como capacidad temprana; no debe quedar escondido detrás de desbloqueos tardíos.
- El onboarding permite elegir punto de partida: foco limpio, compañero equilibrado, experiencia completa o protección estricta.

### D-018 — SlimeForge 1.8 formaliza expediciones, reliquias y diorama

- **Decisión:** completada en la rama de revisión local.
- El Relicario contiene nueve reliquias, tres por ruta: Bosque de Ascuas, Ruinas Resonantes y Laguna Lunar.
- Cada expedición PRO garantiza al menos un hallazgo nuevo de su ruta hasta completarla.
- Las reliquias repetidas suben de nivel y se muestran como duplicados.
- Los hitos de 3, 6 y 9 reliquias únicas desbloquean elementos permanentes del escenario.

### D-019 — SlimeForge 1.8 limpia herramientas internas de prueba

- **Decisión:** completada en la rama de revisión local.
- Se retiraron el modo ×10, atajos QA, controles de simulación y desbloqueos PRO internos.
- Las partidas con marcas heredadas de prueba vuelven automáticamente a tiempos reales.
- Esta decisión evita que herramientas de test aparezcan a usuarios finales.

### D-020 — SlimeForge 1.8 actualiza el mensaje comercial Free/PRO

- **Decisión:** completada en textos de extensión y descripción de tienda.
- Free debe presentarse como una versión completa de foco, cuidado básico y juego suficiente.
- PRO debe presentarse como profundidad, personalización, productividad avanzada y mundo ampliado.
- El claim de PRO no debe formularse como compra de huevos ni como compra de azar.
- La descripción de tienda 1.8 existe en inglés, español, alemán, francés, italiano y portugués.

### D-021 — Escalado progresivo de orejas, cuernos y cola por etapa de crecimiento

- **Decisión:** completada (versión 1.9.8 del código).
- Antes: los apéndices de la especie real no aparecían en Chispa y salían a tamaño adulto completo desde Cría. Ahora escalan proporcionalmente por etapa (`FEAT_SCALE`), y los cosméticos de cabeza se reajustaron para seguir encajando.

### D-022 — Mejora general de animación y trato especial para especies raras/épicas/legendarias

- **Decisión:** completada (versión 1.9.9 del código).
- Se añadió reacción de ojos y orejas a la expresión, cola reactiva al ánimo, personalidad de animación en reposo por especie, fx ambientales para especies que no los tenían (kitsune, fantasma), brillo legendario exclusivo de unicornio/kitsune, y un sistema de rareza de tres niveles en el Bestiario (antes todas las rarezas se veían igual).
- Se corrigió que `content.js` (Modo Manada/Paseo) no aplicaba la clase de especie al bicho, dejando sin efecto 6 animaciones de personalidad al caminar.

### D-023 — Pestaña de Preguntas Frecuentes en el popup

- **Decisión:** completada (versión 1.9.6 del código, ampliada después).
- 27 entradas en 4 categorías, traducidas a los seis idiomas soportados, con nota de que algunas funciones avanzadas se desbloquean progresivamente jugando.

### D-024 — Rediseño visual de las especies míticas y ajustes en zorro/ajolote

- **Decisión:** completada (versión 1.9.11 del código, con ajustes menores en 1.9.12 y 1.9.13).
- Dragón, hada, fénix, kraken, kitsune y unicornio recibieron rasgos anatómicos propios y más reconocibles: alas rediseñadas, pico de fénix, 8 tentáculos animados en el kraken, melena de unicornio, orejas y hocico propios en el kitsune.
- Zorro: cola rediseñada como silueta sólida en “C”. Ajolote: branquias en rojo vivo y rayos en la aleta caudal.
- Motivación explícita del cambio: que las especies especiales “se sientan especiales de verdad”, no solo distintas por nombre.

### D-025 — Un único selector de idioma por página

- **Decisión:** completada el 26 de julio de 2026.
- Se reemplazaron los selectores duplicados y enlaces abreviados heredados por un único dropdown de idioma en el header.
- El selector se deriva de los `hreflang` disponibles, por lo que admite tanto grupos completos de seis idiomas como traducciones parciales sin ofrecer destinos rotos.
- Se corrigió además el solapamiento del header en escritorio y se eliminaron los enlaces de idioma obsoletos de artículos anteriores.

### D-026 — Las herramientas son una superficie de seis idiomas

- **Decisión:** completada el 26 de julio de 2026.
- `/tools/` y sus ocho herramientas se publican en EN, ES, DE, FR, IT y PT; las rutas, canonical, `hreflang`, navegación y sitemap se generan de forma coherente.
- No se debe volver a enlazar una herramienta localizada a una variante inexistente. La preferencia es siempre el equivalente local; el fallback inglés debe ser intencional y válido.

### D-027 — Localizar también la navegación y los enlaces relacionados

- **Decisión:** completada el 26 de julio de 2026.
- Las superficies de Ecosystem en DE/FR/IT/PT, el blog y las recomendaciones de herramientas deben conservar el idioma del visitante cuando exista la página correspondiente.
- Se corrigieron enlaces a blog, legales, favicon/activos y contenido relacionado que habían quedado con rutas inglesas o transformadas incorrectamente.

### D-028 — Daily SEO completo y multilingüe

- **Decisión:** confirmada y aplicada el 26 de julio de 2026.
- Cada artículo nuevo se completa en los seis idiomas antes de cerrar la ejecución, incluyendo metadatos, canonical, `hreflang`, índice, sitemap y validación.
- La selección sigue la cobertura viva por producto. En los dos ciclos ejecutados, FrameForge fue el producto menos cubierto y TextForge el siguiente; se publicaron los temas `linkedin-carousel-image-size` y `clean-copied-table-text` en sus seis variantes.
- No se publicó contenido en Dev.to ni Bluesky como parte de estos dos ciclos: la petición cubría el Daily SEO de la web.

### D-029 — Proceso directo mientras el orquestador no sea fiable

- **Decisión:** vigente hasta reparar el orquestador heredado.
- El flujo de publicación diaria se ejecuta directamente en el repositorio y se valida de extremo a extremo. No se debe simular una ejecución del agente si su entorno no puede invocar sus dependencias.
- La automatización solo se considerará cerrada cuando reproduzca el mismo resultado completo, de forma secuencial y verificable.

### D-030 — Validación global antes de publicar

- **Decisión:** completada y permanente.
- Tras las mejoras de idiomas, herramientas y los dos Daily SEO se validaron todas las páginas HTML generadas sin errores y se regeneró el sitemap. El recuento concreto es deliberadamente volátil y debe calcularse en cada ejecución.

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
- Entre la ficha 1.8.0 documentada en `entrada-maestro-v5_0.md` y la versión 1.9.13 revisada en `v5.1`, el código de SlimeForge tuvo al menos las versiones intermedias 1.9.6 a 1.9.13; los cambios exactos de 1.8.1 a 1.9.5 no están documentados y no deben inferirse.

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
- `scripts/ensure-language-switchers.mjs`
- `scripts/localize-tools.mjs`
- `data/tools-translations.json`
- `scripts/render-blog.mjs`
- `scripts/translate-daily-articles.mjs` (auxiliar puntual; requiere parametrización antes de reutilizarlo)
- `content/blog/2026-07-26-linkedin-carousel-image-size.md`
- `content/blog/2026-07-26-clean-copied-table-text.md`
- `slimeforge-v1.1.0-review/CHANGELOG-1.8.0.md`
- `slimeforge-v1.1.0-review/STORE-DESCRIPTIONS-1.8.md`
- `slimeforge-v1_8_0-review.zip`
- `slimeforge/manifest.json` (versión 1.9.13 a fecha de esta consolidación)
- `slimeforge/common/license.js` (reverificado en esta consolidación, ver P-006)

### 11.2 Fuentes externas

- Dashboard de Creem para precios, productos y licencias.
- Chrome Web Store para publicación, ID, URL, título y slug.
- Documentación oficial de Microsoft Edge para instalación desde Chrome Web Store.
- Repositorio `wendygo-agent` para prompts, rotación y orquestación.
- Chrome for Developers — Program Policies y "Fill out the privacy fields", para el requisito de justificación de permisos (P-007).

### 11.3 Regla de actualización

Cuando una fuente externa contradiga este documento:

1. Verificar que se trata del mismo producto y entorno.
2. Actualizar primero la ficha de estado actual.
3. Registrar la decisión o corrección en el apartado 9.
4. Añadir o cerrar el pendiente correspondiente en el apartado 8.
5. Propagar el cambio según la sección 7.1.
