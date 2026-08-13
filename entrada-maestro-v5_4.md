# WendyGo Studio — documento maestro de web y extensiones

**Versión:** 5.4  
**Fecha de consolidación original:** 23 de julio de 2026  
**Actualización consolidada:** 26 de julio de 2026  
**Última actualización:** 7 de agosto de 2026 — ScrubForge, dos sesiones de desarrollo consolidadas de una vez: la del 31 de julio de 2026 (verificación BYOK, diccionario en Free, rediseño del editor completo) y la de esta conversación del 7 de agosto de 2026 (sistema de revelado cifrado extremo a extremo, redacción visual de imagen, reparto Free/PRO reconstruido de raíz, corrección del gating de vendors, versión 1.15.0). Ver §3.4, §8 P-011/P-012 y §9 D-047 a D-058  
**Ámbito:** web pública `wendygo-site`, familia de seis extensiones y reglas conocidas del agente SEO  
**Estado del documento:** fuente de verdad consolidada  
**Documento anterior:** `entrada-maestro-v5_3 - copia.md` (historial cronológico consolidado aquí)

> **Nota de esta consolidación (v5.4):** en el entorno de trabajo existían varios borradores fechados el 31 de julio de 2026 (`entrada-maestro-v5_4-draft*.md`, `entrada-maestro-v5_4 (ScrubForge).md`) que documentaban una sesión de desarrollo de ScrubForge distinta y anterior a la que dio origen al resto de esta consolidación (7 de agosto de 2026). Esos borradores nunca se habían fusionado a la versión 5.3 que sirvió de base a esta actualización. Sus afirmaciones se reverificaron contra el código actual en esta sesión (ver P-012, resuelto) y, al coincidir con el estado real del repositorio, se incorporan aquí como D-047 a D-053, fechadas correctamente el 31 de julio — **no** como parte de la conversación del 7 de agosto. Los cambios propios de esta conversación quedan en D-054 a D-058.

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
- La validación de licencias se está trasladando a un proxy propio de WendyGo; la clave de Creem no debe viajar a las extensiones.
- Algunas compras antiguas de TextForge y FrameForge se realizaron mediante Lemon Squeezy; es información de legado.
- Existe un trial PRO de cinco días sin tarjeta.
- El trial se gestiona localmente y su finalización no borra los datos del usuario.
- La web utiliza Cloudflare Pages.
- La web utiliza Cloudflare Web Analytics: analítica agregada, sin cookies.
- La web pública y las superficies de herramientas/blog están disponibles en seis idiomas cuando existe la traducción: EN, ES, DE, FR, IT y PT.
- Las extensiones se distribuyen mediante Chrome Web Store.
- Microsoft Edge permite instalar extensiones desde Chrome Web Store. Esto no significa que las extensiones estén publicadas en Microsoft Edge Add-ons.
- El proxy de licencias es un Worker independiente (`wendygo-license-proxy`) y no sustituye el despliegue principal de la web.

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
| FrameForge | Procesamiento y adaptación de imágenes | 3 IA locales (ver §3.2 y P-009) | 6 | Publicada; ID no documentado aquí | Sí / Sí | Sí |
| ConvertForge | Conversión local de imágenes, audio, documentos y datos; incluye OCR | No documentada | No documentado | Publicada | Sí / Sí | Sí |
| ScrubForge | Detección y limpieza local de datos sensibles | BYOK; otros detalles no documentados | 6 | Publicada; ID no documentado aquí | Sí / Sí | Sí |
| ClaimForge | Asistencia para reclamaciones de consumo en seis países de la UE | IA local | 6 | Publicada; ID no documentado aquí | Sí / Sí | Sí |
| SlimeForge | Pomodoro con mascota de concentración y progresión | Gemini Nano on-device | 6 | Publicada | Sí / Sí | Sí |

> **Nota:** “Publicada” para TextForge, FrameForge, ScrubForge y ClaimForge se deduce de que la web ya utilizaba botones reales de Chrome Web Store. Sus IDs y URLs exactos no estaban incluidos en el documento maestro recibido y deben incorporarse cuando se verifiquen.
>
> **Nota (v5.2):** la fila de FrameForge pasa de “2 IA locales” a “3 IA locales” tras confirmarse en código el modelo de inpainting (MI-GAN) compartido por Quitar objetos, Expandir lienzo y Detectar defectos. El copy comercial público sigue diciendo “2 local AIs” — ver P-009 antes de igualar esta tabla con la comunicación externa.
>
> **Nota (v5.4):** ScrubForge añade un sistema de revelado cifrado extremo a extremo (imagen y texto) y redacción visual de imagen, ambos PRO salvo el revelado en sí, que es libre para cualquier tier; el motor de detección (deep scan incluido) es ahora Free en su totalidad. No cambia la columna “IA local” porque el cifrado no es una capacidad de IA. Ver §3.4 y D-055/D-056.

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
- **Diferenciadores confirmados (revisados contra código el 28 de julio de 2026):** procesamiento 100 % local; sin subida; seis idiomas; suite de edición local completa (formas, capas, plantillas, historial visual, recorte manual con tirador, cuentagotas, guías de alineación) disponible tanto en la extensión normal como en el editor completo; banco de 8 herramientas creativas sin IA (Lupa, Remolino, Sello clonador, Ondas, Empujar, Espejo, Caleidoscopio, Enfoque radial); panel de módulos (⚙) para activar/desactivar visualmente funciones en la extensión normal.
- **Claim histórico retirado:** “Zero permissions”.
- **Aviso sobre el claim “2 local AIs” — ver P-009:** el código confirma un tercer modelo de IA local (MI-GAN, inpainting) además de los dos ya reflejados en marketing. No se ha decidido si el copy comercial debe actualizarse a “3 local AIs”.
- **Nuevo (29 de julio de 2026) — sistema de progresión “Mi taller”:** panel opcional, solo en vista normal (no en el editor completo), que registra el uso real de herramientas y desbloquea 5 niveles de prestigio, 6 skins de color y 14 logros. Ver subsección “Progresión y personalización” más abajo y D-039.

### Distribución

- **Landing EN:** `https://wendygostudio.com/frameforge/`
- **Landing ES:** `https://wendygostudio.com/es/frameforge/`
- **Chrome Web Store:** publicada; URL e ID no documentados en esta versión.
- **Edge:** instalable desde Chrome Web Store; no hay ficha propia de Edge Add-ons documentada.
- **Versión de código revisada (29 de julio de 2026):** `manifest.json` sigue en `2.0.0`. Damián confirmó que esta versión **aún no está publicada** en Chrome Web Store, por lo que no se subió el número tras los cambios de esta sesión. **No documentado** si todos los cambios descritos en D-031 a D-045 ya están en la ficha pública en el momento en que se lea este documento.
- **Paquete de distribución generado (29 de julio de 2026):** `.zip` de la versión 2.0.0 preparado para subir al dashboard, excluyendo `node_modules` (residuo de validaciones de desarrollo) y el documento maestro interno. Ver D-044. **No documentado** si Damián ya completó la subida real.
- **Bug crítico corregido (29 de julio de 2026):** el flujo de clic derecho “Abrir en FrameForge” podía abrir la imagen incorrecta (la primera de la sesión) al cerrar la ventana entre usos. Ver D-045.

### IA, privacidad y permisos

- **Tres modelos de IA local confirmados en código (28 de julio de 2026), no dos:**
  1. U²-Net-p (`models/u2netp.onnx`, vía ONNX Runtime Web) — quitar fondo.
  2. Modelo de superresolución vía TensorFlow.js/WebGL, con reserva automática a CPU si WebGL falla — ampliar 2×/4×.
  3. MI-GAN (`models/inpaint/migan_pipeline_v2.onnx`, vía ONNX Runtime Web) — relleno generativo compartido por Quitar objetos, Expandir lienzo (outpainting) y Detectar defectos (heurística local + relleno). Este tercer modelo no estaba reflejado en el copy comercial anterior — ver P-009.
- Procesamiento 100 % local y sin subida de archivos en los tres casos.
- **Permisos confirmados en `manifest.json` (v2.0.0):** `contextMenus`, `storage`, `offscreen`, `downloads`, `notifications`. Permisos de host opcionales: `https://api.creem.io/*` (activación/licencia), `http://*/*` y `https://*/*` (cargar imágenes remotas por clic derecho).
- CSP declarada: `script-src 'self' 'wasm-unsafe-eval'; object-src 'self'` — necesaria para ejecutar los tres modelos locales vía WebAssembly.
- **Hallazgo de seguridad (28 de julio de 2026) — ver P-008:** `config.js` contiene una clave de API de Creem embebida en texto plano en código cliente (el valor se omite aquí), con `licenseProxyUrl` vacío — la ruta insegura que envía esa clave directamente desde el cliente está activa, no es solo un comentario. **Es el mismo valor de clave ya señalado como expuesto en SlimeForge (P-006)**, lo que sugiere una clave compartida a nivel de cuenta/estudio y no una clave por producto.
- **Justificación de permisos en el dashboard (29 de julio de 2026) — ver P-007:** confirmado que `downloads`, `notifications` y `offscreen` sirven exclusivamente a un único flujo (la acción rápida de clic derecho “Quitar fondo y descargar”, que corre en un documento offscreen porque el service worker de MV3 no tiene DOM/canvas). Textos de justificación redactados y entregados a Damián; pendiente de que los pegue en el dashboard real.

### Progresión y personalización (nuevo, 29 de julio de 2026)

- **“Mi taller”:** panel accesible desde un icono junto al interruptor de tema (solo vista normal — deliberadamente ausente del editor completo). Tres pestañas: Recorrido (progreso/XP), Logros (14) y Apariencia (skins).
- **Progreso:** XP ponderado por tipo de acción real (exportar, quitar fondo, ampliar, quitar objetos, expandir lienzo, detectar defectos, exportación por lotes, guardar preset/receta, recorte manual). Tope diario por tipo de acción para desincentivar el farming (acciones repetidas del mismo tipo rinden cada vez menos XP en el mismo día).
- **Prestigios:** 5 niveles (aprendiz → artesano → especialista → maestro → forjador), cada uno exige más XP y variedad de herramientas usadas, no solo repetición.
- **Skins:** 6 paletas de color, todas basadas en el tema oscuro. 5 se desbloquean al subir de prestigio; la sexta (“Bosque”) se desbloquea aparte, por un logro de variedad (usar cada herramienta principal al menos una vez).
- **Privacidad:** todo el progreso se guarda solo en `localStorage`, nunca sale del dispositivo. El panel completo (incluidas las celebraciones) puede desactivarse desde el panel de módulos (⚙), y el progreso puede resetearse desde ahí.
- **FAQ:** las 19 preguntas existentes (D-036) se reorganizaron en 4 categorías y se añadieron 4 preguntas sobre este sistema — 23 en total, traducidas a los 6 idiomas. Ver D-041.

### Comercial

- Trial PRO de cinco días sin tarjeta.
- **Precios confirmados en código (`config.js` / `popup.html`, 28 de julio de 2026), no reverificados contra el dashboard de Creem:** mensual 4,99 €; anual 29,99 €; lifetime 59,99 €.
- Merchant of Record actual: Creem.
- Legado: pueden existir compras antiguas procesadas por Lemon Squeezy.
- **Modelo de marca de agua confirmado en código:** quitar fondo, ampliar, quitar objetos, expandir lienzo y detectar defectos funcionan gratis a plena calidad en pantalla; solo la exportación de un resultado generado por estas cinco funciones añade una marca de agua diagonal si no hay licencia PRO activa (ni trial activo). El resto de exportaciones (solo recorte, texto, efectos, etc.) nunca llevan marca de agua.

### Reparto Free/PRO vigente (confirmado en código, 28 de julio de 2026)

- **Free:** tamaño/encuadre, recorte manual con tirador, quitar fondo, ampliar 2×/4×, quitar objetos, expandir lienzo, detectar defectos (estas cinco funciones de IA local llevan marca de agua en FREE, no bloqueo de uso), cuentagotas, formas, capas, plantillas, historial visual, guías de alineación, filtros básicos del desplegable “Efecto”, deshacer/rehacer/comparar con el original, exportación simple (formato + calidad).
- **PRO:** ajustes de color (brillo/contraste/saturación), texto sobre la imagen con tipografía real (fuente, negrita, cursiva, contorno, sombra), logo/imagen superpuesta, exportación avanzada (comprimir bajo un tamaño objetivo / exportar a varios tamaños a la vez), las 8 herramientas creativas, varios filtros adicionales del desplegable “Efecto”, redimensionado por lotes (.zip), y el editor completo (lupa) como ventana ampliada organizada en pestañas.
- **Panel de módulos (nuevo, 28 de julio de 2026):** un icono ⚙ en la cabecera abre un panel con interruptores para ocultar visualmente los módulos que un usuario no use, pensado para quien solo quiere FrameForge para una función concreta. Se guarda en `localStorage`. Deliberadamente **no afecta al editor completo** — ahí siempre se ve todo.

### Marketing

- **Imagen OG:** `/images/og/frameforge-og.png`
- Copy verificado para la imagen OG (histórico — ver P-009 antes de reutilizarlo sin revisar): “2 local AIs” · “100% local” · “No upload” · “6 languages”.

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
- **Diferenciadores confirmados:** más de 120 patrones; procesamiento 100 % local; BYOK con verificación de clave y selección de modelo; seis idiomas; deep scan (entropía + contexto) disponible en Free desde el 7 de agosto de 2026; redacción visual de imagen y sistema de revelado cifrado extremo a extremo (nuevo desde esa misma fecha, ver más abajo).
- **Versión de referencia documentada:** `manifest.json` en **1.15.0** a fecha de esta consolidación (7 de agosto de 2026). Versión anterior confirmada en ambas sesiones revisadas: 1.13.2 (ya estaba en ese número el 31 de julio; no hubo subida de versión en esa sesión). **No documentado** si la ficha pública de Chrome Web Store ya refleja 1.15.0 en el momento en que se lea este documento.
- **Dos sesiones de desarrollo consolidadas en esta versión del documento (v5.4), en orden cronológico:**
  1. **31 de julio de 2026:** BYOK con verificación de proveedor y selección de modelo, diccionario personalizado disponible en Free, simplificación del editor completo (paleta de comandos retirada, activación de licencia integrada en el modal de planes), corrección de un botón de FAQ roto por CSP, cross-promo de SlimeForge, ajustes de maquetación y corrección de colores de categoría, y auditoría de idioma en los seis locales. Ver D-047 a D-053.
  2. **7 de agosto de 2026 (esta conversación):** sistema de progresión “Mi progreso”, sistema de revelado cifrado extremo a extremo para imágenes y texto, redacción visual de imagen, reparto Free/PRO reconstruido de raíz (deep scan a Free, corrección del gating de vendors) y subida de versión a 1.15.0. Ver D-054 a D-058.
- **Nuevo (7 de agosto de 2026) — sistema de revelado cifrado extremo a extremo:** las imágenes redactadas visualmente y el texto sanitizado pueden exportarse como archivo `.sfvault`, cifrado con una clave derivada por par emisor-receptor (ECDH P-256 + AES-256-GCM vía Web Crypto API nativa del navegador — sin criptografía propia). Solo el contacto emparejado elegido puede revelar el contenido original con su propia copia de ScrubForge; ni WendyGo ni un tercero pueden hacerlo. Ver subsección “Revelado cifrado” más abajo y D-055.

### BYOK, editor completo y diccionario (sesión del 31 de julio de 2026)

- **Verificación de proveedor:** botón “Verificar” en el panel BYOK que hace una llamada ligera de solo lectura (listado de modelos, sin coste de tokens) para confirmar tanto que la clave es válida como que el modelo elegido está disponible en esa cuenta.
- **Selección manual de modelo:** por proveedor, con una lista de sugerencias construida a partir de los modelos reales devueltos por “Verificar”; la elección se guarda en `chrome.storage.local` y es la que usa realmente el chat.
- **Autodetección de proveedor** por el prefijo de la clave pegada (`sk-ant-` → Claude, `AIza` → Gemini, `gsk_` → Groq, `sk-` → OpenAI).
- **Diccionario personalizado disponible también en Free**, con un límite de 5 entradas (antes exclusivo de PRO); PRO mantiene entradas ilimitadas. Importar/exportar el diccionario en JSON sigue restringido a PRO — en Free esos botones quedan atenuados y abren el modal de precios en vez de ejecutar la acción.
- **Paleta de comandos (⌘K) retirada de la interfaz:** sus accesos (estado de tier, activar licencia, diccionario) ya tenían entrada propia en la interfaz. El componente sigue definido en el código pero ya no se monta en ningún sitio — código muerto, ver P-011.
- **Activación de licencia integrada directamente en el modal “Elige tu plan”**, eliminando un panel de ajustes independiente que hacía lo mismo; es el único punto del código donde aparece el campo de clave de licencia.
- **Corrección de un bug de CSP:** el botón de FAQ no respondía en modo ventana separada porque dependía de un `<script>` inline en `app.html`, bloqueado por la política de seguridad de la extensión; se movió a un archivo externo (`app-faq.js`).
- **Cross-promo de SlimeForge** añadida al panel “más apps de Wendygo Studio” del editor completo y del popup, junto a ConvertForge y el resto.
- **Ajustes de maquetación:** los paneles de entrada/salida pasaron a dividirse 50/50 (antes 58/42) y usan la altura completa disponible cuando el panel de chat está cerrado (antes topaban en una altura fija incluso sin chat abierto).
- **Corrección de un error de colores** en las píldoras de categoría del panel de salida: antes usaban un color fijo de un conjunto reducido de opciones en vez del mapa de colores por categoría ya existente en el motor, así que varias categorías compartían color pese a tener uno propio asignado.
- **Auditoría de idioma en los seis locales**, incluida la corrección de una corrupción real: una sustitución de texto demasiado amplia había convertido la clave `noResponse` del idioma inglés en una llamada a función inválida en vez de un texto literal, lo que rompía la carga de la extensión (`Uncaught TypeError: S is not a function`). Verificado el 7 de agosto de 2026 que la clave es hoy un texto literal normal en los seis idiomas — la corrección sigue vigente.

### Planes y precios confirmados

- Modelo actual de **dos tiers**: Free y PRO. Confirmado de nuevo el 7 de agosto de 2026: se evaluó explícitamente revivir el SKU muerto “Expert” como un tercer tier (“Team”) para alojar las funciones de cifrado, y se descartó — el reparto sigue siendo estrictamente Free/PRO. Ver D-056.
- El tier Expert ya no existe como producto vendible y no debe mencionarse; en código sigue existiendo como alias interno idéntico a PRO (mismas features, mismo precio, checkout de Creem heredado activo por compatibilidad), pero el modal de precios de la extensión solo ofrece los tres SKUs de PRO (mensual/anual/lifetime) — Expert no aparece nunca como opción de compra.
- **PRO mensual:** 5,99 €.
- **PRO anual:** 34,99 €.
- **PRO lifetime:** 69,99 €.
- Los tokens sensibles al formato están incluidos en Free.
- Precios confirmados por Damián contra el dashboard de Creem el 15 de julio de 2026; no se modificaron en esta sesión.

### Reparto Free/PRO vigente (reconstruido, 7 de agosto de 2026)

- **Free:** saneo ilimitado, más de 120 patrones, **deep scan** (entropía + contexto, movido desde PRO en esta sesión — ver D-049), diccionario personalizado (máximo 5 entradas), tokens sensibles al formato, detección de un subconjunto de **7 vendors core** (Cisco IOS, Cisco NX-OS, Dell OS10, Fortinet, Juniper, Palo Alto, Linux), extracción de texto por OCR desde una imagen, y **revelado/descifrado de archivos `.sfvault`** (cualquiera puede recibir y abrir contenido cifrado que le envíe un contacto PRO — el revelado nunca está gateado por tier).
- **PRO:** todo lo anterior más chat con IA integrado (BYOK, multi-turno, ofuscación de preguntas), perfiles de contexto, diccionario ilimitado, modo auditoría, los 12 vendors completos, **redacción visual de imagen** (dibujar/ajustar cajas sobre una captura y exportar el PNG redactado), **exportación cifrada `.sfvault`** (de imagen redactada o de texto sanitizado) y gestión de contactos emparejados, y acceso a la CLI (`--batch`, `--check`, CI/CD).
- **Corrección de bug (7 de agosto de 2026):** antes de esta sesión, el flag `allVendors` estaba en `true` tanto en Free como en PRO — la restricción de vendors nunca funcionó realmente y Free detectaba los 12 fabricantes igual que PRO. Corregido: Free ahora queda genuinamente limitado a los 7 vendors core listados arriba.
- La redacción visual de imagen y la exportación `.sfvault` están gateadas a nivel de punto de entrada (el botón que abre cada flujo comprueba el tier) y también internamente en las funciones de exportación, como comprobación redundante.

### Revelado cifrado — detalle técnico (nuevo, 7 de agosto de 2026)

- **Identidad por instalación:** cada instalación de ScrubForge genera un único par de claves ECDH P-256 al primer uso, guardado como JWK en `chrome.storage.local`.
- **Secreto derivado por pareja:** `crypto.subtle.deriveKey` combina la clave privada propia y la pública del contacto para producir una clave AES-256-GCM única por cada par emisor-receptor; nadie más (ni siquiera ScrubForge) puede reproducirla sin una de las dos claves privadas.
- **Emparejamiento por código corto:** la clave pública se codifica como una cadena corta tipo `SF1-...` (~90 caracteres) para copiar/pegar entre dos personas; no se implementó compresión de curva elíptica manual, deliberadamente, para evitar un bug sutil de aritmética hecha a mano.
- **Contenedor genérico `.sfvault`:** formato JSON `{v, app, from, iv, ct}` agnóstico del contenido — el payload cifrado dentro puede ser recortes de imagen (`crops`) o pares token/valor de texto sanitizado (`tokens`). Un único panel de revelado (icono 🔓) detecta automáticamente cuál de los dos es, sin flujos separados.
- **Validado con ejecución real en Node.js** (emparejamiento, cifrado/descifrado, restauración exacta de texto, rechazo de un tercero no emparejado, rechazo de archivo `.sfvault` malformado) — no solo revisión de código. **No verificado en un navegador real** en esta sesión (sin Chrome ni `canvas` nativo disponibles en el entorno de desarrollo); la transformación de coordenadas de recorte/superposición de imagen se verificó por separado con matemática pura en vez de con renderizado real.
- El revelado (descifrado) es libre para cualquier usuario, con cualquier tier; solo cifrar/exportar está gateado a PRO.

### Distribución

- **Landing EN:** `https://wendygostudio.com/scrubforge/`
- **Landing ES:** `https://wendygostudio.com/es/scrubforge/`
- **Chrome Web Store:** publicada; URL e ID no documentados en esta versión.
- **Edge:** instalable desde Chrome Web Store; no hay ficha propia de Edge Add-ons documentada.
- **No documentado:** si la versión 1.15.0 generada en esta sesión ya se subió al dashboard de Chrome Web Store.

### Privacidad y permisos (corregido y reverificado contra `manifest.json`, 7 de agosto de 2026)

- Procesamiento 100 % local.
- **Permisos confirmados en `manifest.json`:** `storage`, `contextMenus`, `offscreen` (este último para procesar OCR/imagen sin ventana visible). Permiso de host opcional: únicamente `https://wendygostudio.com/*`.
- **Corrección respecto a versiones anteriores de esta ficha:** ScrubForge **ya no** declara el permiso opcional `api.creem.io`, contra lo que decía la versión 5.3 de este documento. La activación de licencia usa el proxy propio (`wendygostudio.com/api/license/activate` y `/validate`, mismo Worker de D-046/§5.1), migración que ya estaba hecha a fecha del 31 de julio de 2026 y sigue así el 7 de agosto. No se encontró ninguna clave de Creem embebida en el código de ScrubForge.
- El sistema de revelado cifrado (7 de agosto de 2026) no añade permisos nuevos: usa exclusivamente la Web Crypto API nativa del navegador y `chrome.storage.local`; no hay servidor propio ni de terceros involucrado en el cifrado, emparejamiento o revelado.

### Comercial

- Trial PRO de cinco días sin tarjeta.
- Merchant of Record actual: Creem.

### Marketing

- **Imagen OG:** `/images/og/scrubforge-og.png`
- Copy verificado (histórico — no refleja aún deep scan gratuito ni las funciones nuevas de imagen/cifrado; ver P-011): “120+ patterns” · “100% local” · “BYOK” · “6 languages”.
- Corrección de marketing (7 de agosto de 2026): se retiró de las listas de funciones PRO (modal de precios de la extensión y ficha de Chrome Web Store) la mención fantasma “Batch processing” — el procesamiento por lotes real vive en la CLI, no en la extensión, y no existía como tal en el producto. Sustituido por “Acceso a la CLI (línea de comandos, CI/CD)”, y se añadieron dos líneas nuevas: “Redacción visual de imagen” y “Uso compartido cifrado (.sfvault)”. Corregido en los seis idiomas.

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
- **Pendiente:** regenerar las seis piezas con la tipografía original en Figma o Canva y conservar el copy corregido. Para FrameForge, resolver primero P-009 (si el copy pasa a “3 local AIs”) antes de regenerar esa pieza en concreto.

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
- **Nota (v5.2):** el artículo `linkedin-carousel-image-size` describe FrameForge usando el conjunto de funciones anterior a esta sesión de desarrollo (28 de julio). No es incorrecto, pero queda incompleto frente al alcance actual del producto (§3.2); no requiere corrección urgente, pero conviene tenerlo en cuenta si se amplía o se referencia en contenido nuevo.

---

## 5. Privacidad, licencias y términos

### 5.1 Merchant of Record y activación

- Creem es el único Merchant of Record actual.
- El cliente debe solicitar activación y validación a `https://wendygostudio.com/api/license/validate` y `https://wendygostudio.com/api/license/activate`.
- Esas rutas pertenecen al Worker independiente `wendygo-license-proxy`, que reenvía la petición a Creem usando el secreto cifrado `CREEM_API_KEY` del dashboard de Cloudflare.
- El endpoint público canónico es el dominio propio; `workers.dev` no es la ruta que deben usar las extensiones.
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

### 5.6 Claves de API en código cliente (actualizado, v5.4)

- **Regla general a partir de esta consolidación:** ninguna extensión distribuida debe llevar una clave de API de Creem (ni de ningún otro proveedor con capacidad de facturar o validar licencias) embebida en texto plano en código que se distribuye al cliente. El patrón correcto es un `licenseProxyUrl` propio de WendyGo que reenvíe las peticiones a Creem sin exponer la clave.
- **Estado confirmado antes de la migración:** SlimeForge (P-006) y FrameForge (P-008) tenían ambos la misma clave de Creem embebida —el valor se omite deliberadamente en este documento— y con la ruta insegura activa (`licenseProxyUrl` vacío).
- **ScrubForge: migración confirmada completa (verificado el 7 de agosto de 2026, ver §3.4).** `manifest.json` no declara el permiso `api.creem.io`, solo el host opcional `https://wendygostudio.com/*`; no se encontró ninguna clave de Creem embebida en el código. ScrubForge queda fuera del alcance pendiente de P-010.
- **No verificado:** si TextForge, ConvertForge o ClaimForge comparten la exposición de SlimeForge/FrameForge. No se auditó su código en esta sesión.
- **Infraestructura ya desplegada (29 de julio de 2026):** `worker-license-proxy` está publicado mediante Cloudflare Builds, con la ruta `wendygostudio.com/api/license/*` y `CREEM_API_KEY` como secreto cifrado. Una petición con una clave de prueba devolvió correctamente el error de Creem `License key not found`, confirmando que el proxy llega al proveedor.
- La migración del código de las seis extensiones todavía no está cerrada para SlimeForge, FrameForge, TextForge, ConvertForge y ClaimForge: hay que sustituir las llamadas directas, retirar las claves embebidas, probar una licencia real y rotar la clave antigua en Creem. Hasta completar esos pasos, P-006/P-008 siguen siendo pendientes críticos.

---

## 6. Reglas del agente SEO

> El repositorio actual revisado contiene `wendygo-site`, pero no contiene `wendygo-agent/prompts/`. Las reglas de esta sección proceden del documento anterior y deben verificarse contra el repositorio del agente cuando esté disponible.

### 6.1 Conocimiento obligatorio

- Debe conocer las seis extensiones.
- Debe utilizar las landings y URLs reales.
- Nunca debe mencionar el tier Expert de ScrubForge, ni un tier “Team”/equipo: se evaluó explícitamente y se descartó el 7 de agosto de 2026 (ver §9 D-056). ScrubForge tiene exactamente dos tiers, Free y PRO.
- Debe describir correctamente el gacha ético de SlimeForge.
- Debe usar Cloudflare Pages, no Netlify.
- Debe usar las URLs legales limpias sin `.html`.
- El footer canónico incluye X/Twitter, Bluesky y Dev.to.
- Para contenido monotema puede usar `/images/og/{producto}-og.png`.
- Debe considerar las seis versiones lingüísticas de cualquier artículo nuevo: EN, ES, DE, FR, IT y PT. Publicar solo EN o EN/ES no completa el flujo.
- Los artículos y sus enlaces internos deben mantener la lengua de lectura cuando exista una página equivalente; el inglés queda como fallback explícito y válido.
- Hasta que se resuelva P-009, el agente no debe afirmar por iniciativa propia que FrameForge tiene “3 local AIs”; debe seguir usando el copy vigente (“2 local AIs”) salvo instrucción explícita de Damián.

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
- **(nuevo, v5.2)** Para código de extensión: `node --check` en cada `.js` modificado, balance de etiquetas del HTML de la extensión, ausencia de ids duplicados, y comprobación de que ninguna clave de API queda embebida en texto plano en archivos que se empaquetan con la extensión (ver §5.6).

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
- **Nota (v5.2):** para FrameForge en concreto, resolver P-009 antes de regenerar la pieza, para no repetir el mismo copy si se decide pasar a “3 local AIs”.

### P-003 — Programar dos ejecuciones SEO diarias

- **Estado:** pendiente de automatización; el flujo manual ya fue validado.
- Ajustar el orquestador o cron para un entorno donde el ejecutable del agente esté realmente disponible.
- Las ejecuciones deben ser secuenciales y no solaparse.
- Verificar bloqueo o mecanismo equivalente antes de activar producción. La ejecución heredada no debe darse por operativa hasta pasar una prueba de extremo a extremo que cree, renderice y valide contenido.

### P-004 — Completar datos no documentados de las seis extensiones

- **Estado:** pendiente de inventario (parcialmente resuelto para FrameForge el 28 de julio de 2026, ver §3.2).
- Incorporar IDs y URLs de Chrome Web Store de TextForge, FrameForge, ScrubForge y ClaimForge. **FrameForge sigue sin ID/URL de Chrome Web Store documentado** — no se pudo verificar desde el código de la extensión.
- Incorporar precios vigentes de TextForge, FrameForge, ConvertForge y ClaimForge. **FrameForge: resuelto desde código** (mensual 4,99 €, anual 29,99 €, lifetime 59,99 €), pendiente de reverificar contra el dashboard de Creem como se hizo con ScrubForge y SlimeForge. TextForge, ConvertForge y ClaimForge siguen pendientes.
- Incorporar listas completas de permisos por extensión. **FrameForge: resuelto desde `manifest.json`** (ver §3.2). Resto de productos pendiente.
- Incorporar desglose Free/PRO y límites de cada producto. **FrameForge: resuelto desde código** (ver §3.2). Resto de productos pendiente.
- Verificar la función exacta de cada IA local y su disponibilidad por navegador. **FrameForge: resuelto — tres modelos confirmados** (U²-Net-p, superresolución vía TensorFlow.js/WebGL, MI-GAN), los tres locales vía WebAssembly/WebGL estándar. Resto de productos pendiente.

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
- **Verificación en esta consolidación (v5.1), 23 de julio de 2026:** se revisó `common/license.js` en el código de la sesión de desarrollo, ya en la versión **1.9.13** del manifest, y la constante `API_KEY` de Creem sigue embebida en texto plano en el archivo, pese al comentario del propio código que dice “se inyecta en el paso de build, nunca al repo”. **El problema no está resuelto** y afecta también a todos los paquetes 1.9.x (`.zip`) generados y entregados durante esa sesión, no solo a la revisión 1.8.0 original. Rotar la clave en Creem si ya se ha distribuido alguno de esos paquetes fuera de un entorno controlado.
- **Actualización (v5.2, 28 de julio de 2026):** la auditoría de FrameForge encontró la **misma clave literal** embebida en su `config.js` (ver P-008). Esto refuerza la hipótesis de que es una clave de cuenta compartida entre productos, no un descuido aislado de un solo producto — al rotarla, considerar que puede afectar a más de una extensión distribuida.

### P-007 — Justificación de permisos en Chrome Web Store (activeTab, alarms, notifications, scripting)

- **Estado:** pendiente.
- Detectado el 23 de julio de 2026: el Developer Dashboard de Chrome Web Store exige rellenar una justificación de texto por cada permiso sensible declarado en el manifest (`activeTab`, `alarms`, `notifications`, `scripting`) en la pestaña Privacy practices, y bloquea la publicación de actualizaciones hasta que estén completos.
- El campo de justificación existe en el dashboard desde 2019, pero la aplicación estricta (bloquear la publicación si falta) coincide con el endurecimiento de las políticas de privacidad de Chrome Web Store que entra en vigor el **1 de agosto de 2026** (propósito único, divulgación obligatoria, aviso ante cambios de prácticas de datos).
- Implementación pendiente: rellenar los cuatro campos de justificación en el dashboard antes de subir cualquier próxima actualización. Textos ya redactados en la sesión de desarrollo del 23 de julio de 2026 (conversación sobre permisos de SlimeForge), pendientes de pegar en el dashboard real.
- Relacionado con P-006: cualquier actualización que se suba para resolver P-006 tendrá que pasar también por este requisito.
- **A tener en cuenta (v5.2):** FrameForge declara permisos distintos (`contextMenus`, `storage`, `offscreen`, `downloads`, `notifications`) — ninguno de los cuatro sensibles que exige justificación en SlimeForge coincide exactamente salvo `notifications`. No se ha verificado si `notifications` en FrameForge requiere el mismo trámite de justificación antes de su próxima actualización; revisar el dashboard de FrameForge en Creem/Chrome Web Store cuando se publique el código de esta sesión.
- **Actualización (29 de julio de 2026):** confirmado — el dashboard de FrameForge exige justificación para `downloads`, `notifications` **y** `offscreen`, no solo para `notifications`. Por inspección de código se confirmó que los tres sirven exclusivamente a un único flujo (la acción rápida de clic derecho “Quitar fondo y descargar”: `offscreen` ejecuta el modelo local sin ventana visible, `downloads` guarda el resultado directamente, `notifications` avisa solo si ese flujo falla). Se redactaron y entregaron a Damián los tres textos de justificación en inglés. **No verificado si ya están pegados en el dashboard real** — sigue pendiente ese paso manual.

### P-008 — Clave de API de Creem embebida en código cliente de FrameForge (nuevo, v5.2)

- **Estado:** pendiente crítico, mismo patrón que P-006.
- Detectado el 28 de julio de 2026 al auditar el código de FrameForge: `config.js` contiene una clave de API de Creem en texto plano, con `licenseProxyUrl` vacío — la ruta que envía esa clave directamente desde el cliente (cabecera `x-api-key` a `api.creem.io`) está activa, no es solo un comentario o código muerto.
- **Es el mismo valor de clave ya señalado como expuesto en SlimeForge (P-006)** — indica que se trata de una clave de API compartida a nivel de cuenta/estudio, no una clave por producto.
- Implementación recomendada: la misma que P-006 — mover la verificación de licencia a un backend/proxy propio de WendyGo (`licenseProxyUrl` ya existe como campo preparado para esto en ambos productos) y rotar la clave compartida en Creem una sola vez para todos los productos afectados.
- Antes de rotar, confirmar en el dashboard de Creem si la clave expuesta era una única clave de cuenta usada por varios productos; no se pudo verificar eso desde el código de un solo producto.
- **No se auditó en esta sesión el código de TextForge, ConvertForge ni ClaimForge** — no se puede descartar que la misma clave esté también embebida ahí. Recomendado: repetir esta comprobación puntual (`grep` de `apiKey` en cada `config.js`) en los tres productos restantes antes de dar por cerrado el alcance del problema. **ScrubForge se auditó el 7 de agosto de 2026 y quedó descartado: no tiene clave de Creem embebida y ya usa el proxy propio (ver §5.6).**

### P-009 — Decidir si el claim “2 local AIs” de FrameForge debe pasar a “3 local AIs” (nuevo, v5.2)

- **Estado:** pendiente de decisión de producto/marketing, no técnica.
- El código de FrameForge confirma un tercer modelo de IA local (MI-GAN, inpainting) además de los dos ya reflejados en el copy comercial (quitar fondo, ampliar). Este tercer modelo da servicio a tres funciones ya existentes o mejoradas en esta sesión (Quitar objetos, Expandir lienzo, Detectar defectos), las tres ahora en el mismo régimen gratis + marca de agua (ver D-032).
- Decisión pendiente: si el copy de marketing (imagen OG, landing EN/ES) debe actualizarse a “3 local AIs”, o si se prefiere mantener “2 local AIs” por simplicidad de mensaje, sin destacar el inpainting como motor de IA aparte. Ambas opciones son defendibles; requiere decisión de Damián.
- Si se decide actualizar el claim, afecta a: imagen OG `frameforge-og.png` (ver P-002), landing EN/ES de FrameForge, matriz de productos (§2) y cualquier snippet del agente SEO que reutilice el claim actual.

### P-010 — Migrar las extensiones pendientes al proxy de licencias y rotar la clave Creem (nuevo, v5.3; alcance reducido en v5.4)

- **Estado:** infraestructura desplegada; migración de producto pendiente para cinco de las seis extensiones.
- El Worker `wendygo-license-proxy` ya está publicado desde `worker-license-proxy/`, con `npx wrangler deploy`, ruta `wendygostudio.com/api/license/*` y secreto de producción `CREEM_API_KEY` configurado en Cloudflare.
- **ScrubForge queda fuera del alcance de este pendiente desde el 7 de agosto de 2026:** verificado que ya usa únicamente `/api/license/validate` y `/api/license/activate`, sin `apiKey` embebida ni permiso opcional directo a `api.creem.io` (ver §5.6 y §3.4). Quedan pendientes de migrar: SlimeForge, FrameForge, TextForge, ConvertForge y ClaimForge.
- Para los cinco productos restantes: sustituir las llamadas directas, retirar cualquier `apiKey` literal y eliminar el permiso opcional directo a `api.creem.io` cuando ya no sea necesario.
- Después de migrar los cinco restantes, comprobar una activación real, rellenar `ALLOWED_ORIGINS` con los orígenes `chrome-extension://...` necesarios, publicar nuevas versiones y revocar/rotar la clave antigua en Creem.
- No marcar este pendiente como cerrado solo porque el endpoint responda: la prueba con `licencia-de-prueba` confirmó el enrutamiento y el acceso a Creem, no una licencia válida.

### P-011 — Limpieza de código muerto y actualización de marketing tras el cifrado (ScrubForge, nuevo v5.4)

- **Estado:** pendiente, prioridad baja (sin impacto funcional).
- **Código muerto detectado el 7 de agosto de 2026:** las claves de idioma `disclaimer_en`/`disclaimer_es` en el diccionario embebido de `App.jsx` no se usan en ningún punto del código (`S(...)` nunca las llama); faltan por completo en el bloque `es`, y en fr/de/it/pt ambas claves contienen el mismo texto duplicado por error, en vez de ser variantes distintas. No afecta al funcionamiento porque están muertas, pero es basura de i18n heredada de una sesión anterior a esta consolidación.
- **Archivo huérfano detectado el 7 de agosto de 2026:** `src/i18n.js` (un diccionario de 6 idiomas completo, ~245 claves) no está importado desde ningún sitio — `App.jsx` usa su propio diccionario embebido (`_e`), duplicado del anterior mucho tiempo atrás. `src/i18n.js` quedó desincronizado (todavía decía “ScrubForge v1.13.1” antes de esta sesión, y no tenía las claves de vault/revelado) y no afecta al build real, pero puede confundir a quien edite el repositorio pensando que es la fuente activa.
- **Segundo hallazgo de código muerto, confirmado el 7 de agosto de 2026 al reverificar P-012:** el componente de la paleta de comandos (⌘K), retirado de la interfaz en la sesión del 31 de julio (ver D-049), sigue definido en `App.jsx` pero ya no se monta en ningún sitio; su clave de idioma `cmdPalette` tampoco se usa. Mismo patrón que los otros dos hallazgos: no rompe nada, pero es peso muerto en el código fuente.
- Implementación pendiente: decidir si se elimina `src/i18n.js` (si de verdad no lo usa ninguna otra herramienta del repo, como el CLI) o si se retoma como fuente única y se elimina la duplicación embebida en `App.jsx`; eliminar el componente de la paleta de comandos y su clave `cmdPalette`; y limpiar `disclaimer_en`/`disclaimer_es` de los seis locales.
- **Marketing pendiente de actualizar más allá del modal de precios (ya corregido en esta sesión, ver §3.4):** la imagen OG de ScrubForge y cualquier snippet del agente SEO que reutilice el copy “120+ patterns · 100% local · BYOK · 6 languages” no reflejan aún deep scan gratuito, redacción de imagen ni el sistema de revelado cifrado. Mismo patrón que P-002/P-009 para FrameForge: no regenerar la pieza hasta decidir el copy definitivo.

### P-012 — Fusionar o descartar los borradores de ScrubForge del 31 de julio de 2026 (nuevo v5.4, resuelto en la misma consolidación)

- **Estado:** resuelto el 7 de agosto de 2026 — reverificado contra el código y fusionado a este documento como D-047 a D-053.
- Existían varios archivos de trabajo fechados el 31 de julio de 2026 (`entrada-maestro-v5_4-draft.md`, `-draft2.md`, `-draft3.md`, `-draft4.md`, `entrada-maestro-v5_4 (ScrubForge).md`) que documentaban una sesión de desarrollo de ScrubForge **distinta** de la que dio lugar al resto de esta consolidación (7 de agosto de 2026): verificación de proveedores BYOK con botón “Verificar”, selección manual de modelo por proveedor, autodetección de proveedor por prefijo de clave, diccionario personalizado disponible en Free (5 entradas) con import/export restringido a PRO, eliminación de la paleta de comandos (⌘K), activación de licencia integrada en el modal de planes, corrección de un botón de FAQ roto por CSP, cross-promo de SlimeForge, ajustes de maquetación del editor completo (paneles 50/50, colores de categoría) y una auditoría de paridad de idioma en los seis locales (incluida la corrección de una corrupción real en la clave `noResponse`).
- Esos cambios no estaban reflejados en `entrada-maestro-v5_3 - copia.md` (la base que se usó para esta consolidación), lo que confirma que ese trabajo del 31 de julio nunca se fusionó al documento maestro de referencia — era un pendiente de documentación anterior a la sesión del 7 de agosto, no generado por ella.
- **Verificación punto por punto contra el código actual, 7 de agosto de 2026:** las once afirmaciones anteriores se comprobaron una por una contra `src/App.jsx`, `manifest.json` y `app.html` — botón “Verificar” (`byokCheck`/`byokChecking`/`byokValid`), selección de modelo (`modelOverride`/`byokModelList`/`modelDropOpen`), autodetección por prefijo (`sk-ant-`/`gsk_`/`AIza`), diccionario en Free con import/export gateado (`isFinite(M.dictMax)`), paleta de comandos definida pero no montada, campo de licencia solo dentro del modal de planes, `app-faq.js` como script externo, cross-promo de SlimeForge en la lista de apps, panel de salida a `width:50%` con altura completa si el chat está cerrado, mapa de color por categoría (función `ve()`) y `noResponse` como texto literal en los seis idiomas — **todas coinciden con el estado real del código**. Ver D-047 a D-053 para el detalle fusionado y §5.6/§3.4 para la corrección adicional de permisos descubierta al reverificar (ScrubForge ya no declara `api.creem.io`).

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

### D-031 — Banco de herramientas creativas y ampliación de filtros de un clic (FrameForge)

- **Decisión:** completada, sesión de desarrollo del 28 de julio de 2026.
- Se añadió un banco de 8 herramientas de retoque local sin IA (Lupa, Remolino, Sello clonador, Ondas, Empujar, Espejo, Caleidoscopio, Enfoque radial) más 4 nuevos filtros de un clic en el desplegable “Efecto” (Glitch, Cómic, Pixelado 8-bit, Térmico). Las 8 herramientas y los 4 filtros nuevos son PRO.

### D-032 — Expandir lienzo y Detectar defectos pasan a gratis con marca de agua (FrameForge)

- **Decisión:** completada, 28 de julio de 2026.
- Ambas funciones ya tenían implementado el patrón “gratis, marca de agua en la exportación” (igual que Quitar objetos), pero un bloqueo duro (`hasProAccess()` + modal de desbloqueo) impedía que los usuarios FREE llegaran siquiera a probarlas — el código de aviso “gratis” existía pero era inalcanzable. Se retiró ese bloqueo; las cinco funciones de IA local de FrameForge (quitar fondo, quitar objetos, expandir lienzo, detectar defectos, ampliar) comparten ahora el mismo modelo comercial.
- Decisión tomada tras comparar el patrón de mercado (PhotoRoom, Fotor, Picsart dejan usar sus herramientas de IA gratis con límite o marca de agua; solo Canva bloquea del todo sus herramientas Magic).

### D-033 — Herramientas de edición avanzada dejan de ser exclusivas del editor completo (FrameForge)

- **Decisión:** completada, 28 de julio de 2026.
- Formas, capas, plantillas, historial visual, recorte manual con tirador, cuentagotas y guías de alineación —antes solo disponibles dentro de la lupa (editor completo, acceso PRO)— se montan ahora también en la extensión normal (popup pequeño y detach). Ninguna de ellas tenía candado PRO propio; solo estaban indirectamente bloqueadas por requerir entrar primero al editor completo.
- Efecto secundario: el editor completo deja de ser la única vía de acceso a estas herramientas; su valor diferencial pasa a ser el tamaño de ventana y la organización en pestañas, no la exclusividad de funciones. El copy del teaser “Editor completo” se actualizó para reflejarlo.

### D-034 — Vista normal reorganizada en acordeón (FrameForge)

- **Decisión:** completada, 28 de julio de 2026.
- Ante el aumento de opciones visibles en la extensión normal (D-033), se agrupó el contenido en secciones plegables (Tamaño, IA local, Efectos y ajustes, Formas/plantillas/historial, Exportar, y un bloque único para el resto de edición avanzada PRO) para evitar una columna interminable. El bloque PRO se pliega entero, sin desmontar el contenedor que lleva su candado interno.

### D-035 — Panel de módulos y opciones activables/desactivables (FrameForge)

- **Decisión:** completada, 28 de julio de 2026.
- Nuevo icono ⚙ en la cabecera abre un panel con 17 interruptores para ocultar módulos no usados, pensado para usuarios que solo quieren FrameForge para una función concreta. Persistencia en `localStorage`.
- Deliberadamente **no afecta al editor completo**: ahí siempre se ve todo, a petición explícita de Damián tras detectar que el interruptor maestro de “edición avanzada PRO” no tenía forma de revertirse desde dentro de la lupa (el contenido de esa sección se reparte físicamente al carril lateral en el editor completo, así que ocultarlo ahí no tenía una vía clara de deshacerse).

### D-036 — FAQ ampliado para cubrir todas las funciones nuevas (FrameForge)

- **Decisión:** completada, 28 de julio de 2026.
- Se añadieron 6 preguntas nuevas (herramientas creativas, formas/capas/plantillas/historial, recorte manual y cuentagotas, bloque de edición avanzada PRO, panel de módulos, filtros del desplegable “Efecto”) y se corrigieron 3 preguntas existentes que describían el editor completo y las plantillas como exclusivos de la lupa, ya no cierto tras D-033. Las 19 preguntas del FAQ están traducidas a los seis idiomas.

### D-037 — Preset “Tamaño original” (FrameForge)

- **Decisión:** completada, 28 de julio de 2026.
- Antes, una imagen recién cargada se redimensionaba por defecto a 1280×720 (el relleno del preset “Personalizado”) sin que el usuario lo pidiera. Se añadió un preset “Tamaño original” que conserva el tamaño real de la imagen (respetando giro y recorte) y pasó a ser el valor por defecto, tanto en el editor individual como en el redimensionado por lotes.
- El preset se añadió al final de la lista interna (no al principio) para no desplazar los índices numéricos que usan las “recetas” ya guardadas por usuarios.

### D-038 — Auditoría completa de FrameForge (FrameForge)

- **Decisión:** completada, 28 de julio de 2026.
- Revisión sistemática de sintaxis, balance de HTML, integridad de referencias (ids/funciones), consistencia del gating free/PRO y manejo de errores en todo el código de la extensión.
- Se corrigieron dos fallos reales preexistentes, no introducidos en esta sesión: (1) claves i18n duplicadas dentro del mismo objeto de idioma en ES y EN (`unlock_choose`, `plan_lifetime`, `one_time`), que dejaban texto muerto e inalcanzable por sobrescritura silenciosa de JavaScript; (2) dos bloques `catch` sin `console.error` en los flujos de Quitar fondo y Ampliar, que impedían diagnosticar fallos reales de esas dos funciones (uno de ellos, el de Ampliar, ya se había detectado en una sesión anterior sin llegar a corregirse).
- La auditoría detectó además la exposición de clave de API descrita en P-008, que se documenta como pendiente crítico en vez de resolverse automáticamente por tratarse de una decisión de infraestructura (proxy propio) fuera del alcance de una sesión de código de producto.

### D-039 — Sistema de progresión “Mi taller” (FrameForge)

- **Decisión:** completada, 29 de julio de 2026.
- Nuevo sistema de gamificación opcional: XP ponderado por acción real, con tope diario por tipo de acción para desincentivar el farming; 5 niveles de prestigio que desbloquean 4 de las 5 skins de color no-por-defecto; una sexta skin (“Bosque”) desbloqueada aparte por un logro de variedad; 14 logros en total; celebraciones discretas al desbloquear algo.
- Todo el progreso vive en `localStorage`, nunca sale del dispositivo. El panel completo puede desactivarse (y el progreso reiniciarse) desde el panel de módulos (⚙). Solo visible en la vista normal, no en el editor completo.
- Decisión de diseño explícita de Damián: las skins debían basarse todas en el tema oscuro (no claras), y evitar una estética genérica de IA — se cuidó especialmente el diseño de iconos y paletas.

### D-040 — Acabado visual consistente en toda la extensión (FrameForge)

- **Decisión:** completada, 29 de julio de 2026.
- Se aplicó un lenguaje visual único inspirado en Linear/Arc/Raycast: cristal (blur + transparencia) reservado a los 4 modales flotantes de la app, con un fondo ambiental (`#ffAmbient`, muestra desenfocada de la imagen en edición, o un degradado de dos tonos de la skin activa si no hay imagen cargada) que le da al blur algo real que desenfocar — sin eso, un `backdrop-filter` sobre fondo plano no se distingue de un color sólido.
- Las tarjetas siempre visibles (panel IA local, panel PRO, carril/panel del editor completo) **no** usan cristal: pruebas reales confirmaron por inspección directa en DevTools que la transparencia se aplicaba correctamente pero resultaba imperceptible contra un fondo casi uniforme. Se sustituyó por el mismo lenguaje que ya funcionaba en la tarjeta de planes PRO (`.buy-btn`): color sólido de un escalón más claro (`--panel-2`) más borde, sin depender del blur.
- Se añadió un motivo de marca discreto (esquinas de visor en las cuatro esquinas del viewport, teñidas del color de la skin activa) en vez de un efecto de brillo genérico.
- Corregido de paso un bug preexistente no relacionado con esta sesión: el modal genérico (`.modal`) no tenía `max-height`/`overflow-y` propios (solo el modal de FAQ lo tenía), así que contenido largo —como el modal de desbloqueo PRO— desbordaba la ventana sin scroll interno.

### D-041 — FAQ agrupado por categorías + 4 preguntas sobre “Mi taller” (FrameForge)

- **Decisión:** completada, 29 de julio de 2026.
- Las 19 preguntas del FAQ (D-036) se agruparon en 4 categorías (Lo esencial, IA local, Edición y herramientas, Mi taller) para no dejar un listado interminable, y se añadieron 4 preguntas sobre el sistema de progresión (qué es, cómo se gana progreso, cómo se desbloquean las skins, si guarda o envía datos). Total: 23 preguntas, traducidas a los 6 idiomas — paridad de claves verificada (257 claves idénticas en los 6 locales de `i18n.js`).

### D-042 — Corrección de precio desactualizado en la descripción pública de la tienda (FrameForge)

- **Decisión:** completada, 29 de julio de 2026.
- La descripción de la ficha de Chrome Web Store que Damián tenía publicada decía “pago único de 9,99 €”. El modelo comercial real, confirmado en código (ver §3.2 y §8 P-004), es mensual 4,99 €, anual 29,99 € o lifetime 59,99 €. Corregido en el texto entregado a Damián.

### D-043 — Descripción de tienda reescrita en 6 idiomas, evitando estilo genérico de IA (FrameForge)

- **Decisión:** completada, 29 de julio de 2026.
- A petición explícita de Damián de evitar que el texto “pareciera hecho por IA”, se reescribió la descripción completa de la ficha (antes solo en inglés) recortando repetición de frases de refuerzo, bullets con estructura uniforme y relleno de marketing genérico, y se tradujo a los 6 idiomas que soporta la extensión — la ficha anterior solo mencionaba disponibilidad en inglés y español, desactualizado desde que se añadieron FR/DE/IT/PT. Entregado como `store-description.txt`, pendiente de que Damián lo pegue en el dashboard.

### D-044 — Empaquetado 2.0.0 para Chrome Web Store (FrameForge)

- **Decisión:** completada, 29 de julio de 2026.
- Se generó el `.zip` de distribución de la versión 2.0.0, excluyendo `node_modules` (residuo de validaciones de desarrollo de esta sesión, sin uso en tiempo de ejecución de la extensión) y el documento maestro interno. El número de versión se mantuvo en 2.0.0 porque Damián confirmó que esa versión aún no está publicada en Chrome Web Store.
- **No documentado si Damián ya completó la subida real** — este documento registra que el paquete se generó y se entregó, no que la ficha pública ya esté actualizada con los cambios de D-039 a D-045.

### D-045 — Corrección de bug crítico: el clic derecho abría siempre la primera imagen de la sesión (FrameForge)

- **Decisión:** completada, 29 de julio de 2026.
- Bug reportado por Damián: usar “Abrir en FrameForge” varias veces seguidas sobre imágenes distintas, cerrando la ventana entre cada uso, hacía que la ventana nueva mostrara siempre la primera imagen abierta en la sesión, no la recién seleccionada. Si el usuario dejaba las ventanas abiertas en vez de cerrarlas, el problema no aparecía — pista que resultó clave para el diagnóstico.
- **Causa raíz confirmada por inspección en vivo** (consola del service worker, con trazas de depuración temporales): dos mecanismos de traspaso de imagen por `chrome.storage.session` competían entre sí sin saberlo. (1) El traspaso por clic derecho usaba originalmente una clave fija (`ff_img`), vulnerable a colisión entre aperturas — se corrigió primero con un token único por apertura, pero el bug persistía. (2) La causa real: un `beforeunload` sin ninguna condición guardaba la imagen actual en `ff_resume` al cerrar **cualquier** ventana `?win=1` (pensado solo para el flujo, no relacionado, de “reanudar en el editor completo”), y `receiveResumeState()` restauraba ese `ff_resume` en **cualquier** ventana nueva sin comprobar si esa ventana ya traía imagen propia — si esa restauración terminaba después del traspaso correcto, lo sobrescribía con la imagen antigua.
- **Corrección:** `receiveResumeState()` ahora se salta por completo si la URL de la ventana ya trae `img=` o `imgretry=` (traspaso de imagen propio). El flujo de “abrir en ventana grande” (`resume=1`) no se ve afectado, al usar un parámetro distinto y no solaparse nunca con los otros dos.
- Confirma el mismo patrón de diagnóstico ya usado en D-040 para el acabado visual: verificación en vivo por DevTools en vez de dar por buena una hipótesis basada solo en lectura de código.

### D-046 — Proxy independiente de licencias Creem desplegado en Cloudflare Workers

- **Decisión:** completada en infraestructura, 29 de julio de 2026; la migración de clientes queda registrada como P-010.
- Se descartó añadir `functions/` al despliegue principal de la web porque ese proyecto no es Pages Functions. Se creó el Worker independiente `wendygo-license-proxy` en `worker-license-proxy/`.
- El Worker acepta solo `POST` para `validate` y `activate`, mantiene la clave exclusivamente en el secreto cifrado `CREEM_API_KEY` y publica la ruta `https://wendygostudio.com/api/license/*`.
- La prueba contra el dominio propio con una clave ficticia devolvió el error esperado de Creem (`License key not found`), lo que verificó ruta, Worker, secreto y comunicación con la API upstream.
- `workers.dev` queda desactivado como ruta de producto; el dominio propio es la única URL canónica para las extensiones.

### D-047 — Verificación de proveedor BYOK y selección manual de modelo (ScrubForge)

- **Decisión:** completada, sesión de desarrollo del 31 de julio de 2026; reverificada contra el código el 7 de agosto de 2026 (ver P-012, resuelto).
- Botón “Verificar” que hace una llamada ligera de solo lectura (listado de modelos, sin coste de tokens) para confirmar que la clave BYOK es válida y que el modelo elegido está disponible en esa cuenta — antes solo se descubría un fallo de acceso al modelo al intentar chatear.
- Selección manual de modelo por proveedor, con lista de sugerencias construida a partir de los modelos reales devueltos por “Verificar”; la elección se guarda por proveedor en `chrome.storage.local` y es la que usa realmente el chat.
- Autodetección de proveedor por el prefijo de la clave pegada (`sk-ant-` → Claude, `AIza` → Gemini, `gsk_` → Groq, `sk-` → OpenAI).

### D-048 — Diccionario personalizado disponible en Free con límite de 5 entradas (ScrubForge)

- **Decisión:** completada, 31 de julio de 2026; reverificada el 7 de agosto de 2026.
- El diccionario personalizado pasó de ser exclusivo de PRO a estar disponible también en Free, con un límite de 5 entradas; PRO mantiene entradas ilimitadas. Importar/exportar el diccionario en JSON sigue restringido a PRO — en Free esos botones quedan atenuados y abren el modal de precios en vez de ejecutar la acción.

### D-049 — Simplificación del editor completo: paleta de comandos retirada y activación de licencia integrada en el modal de planes (ScrubForge)

- **Decisión:** completada, 31 de julio de 2026; reverificada el 7 de agosto de 2026.
- Se retiró de la interfaz la paleta de comandos (⌘K): sus accesos (estado de tier, activar licencia, diccionario personalizado) ya tenían entrada directa propia, dejándola redundante. El componente sigue definido en el código pero ya no se monta — código muerto, ver P-011.
- La activación de licencia se integró directamente en el modal “Elige tu plan”, eliminando un panel de ajustes independiente que hacía lo mismo; verificado el 7 de agosto de 2026 que sigue siendo el único punto del código donde aparece el campo de clave de licencia.

### D-050 — Corrección de un botón de FAQ bloqueado por CSP (ScrubForge)

- **Decisión:** completada, 31 de julio de 2026; reverificada el 7 de agosto de 2026.
- El botón de FAQ no respondía en modo ventana separada porque dependía de un `<script>` inline en `app.html`, bloqueado por la política de seguridad (CSP) de la extensión. Se movió a un archivo externo, `app-faq.js`, confirmado presente y cargado en `app.html`.

### D-051 — Cross-promo de SlimeForge en el editor completo y el popup (ScrubForge)

- **Decisión:** completada, 31 de julio de 2026; reverificada el 7 de agosto de 2026.
- SlimeForge se añadió al panel “más apps de Wendygo Studio”, junto a ConvertForge y el resto, reutilizando el mismo patrón de icono/texto/URL ya existente para las demás extensiones.

### D-052 — Ajustes de maquetación y corrección de colores de categoría en el editor completo (ScrubForge)

- **Decisión:** completada, 31 de julio de 2026; reverificada el 7 de agosto de 2026.
- Los paneles de entrada/salida pasaron de una división 58/42 a 50/50, y usan la altura completa disponible cuando el panel de chat está cerrado (antes topaban en una altura fija incluso sin chat abierto). Confirmado en código: el panel de salida usa `width:50%` y el límite de altura solo se aplica si el chat está abierto.
- Se corrigió un error de colores en las píldoras de categoría del panel de salida: usaban un color fijo de un conjunto reducido en vez del mapa de colores por categoría ya existente en el motor de detección, así que varias categorías compartían color pese a tener uno propio asignado. Confirmado en código que hoy existe una función de mapeo de color por categoría con ramas específicas por tipo de hallazgo.

### D-053 — Auditoría de idioma en los seis locales y corrección de una corrupción real (ScrubForge)

- **Decisión:** completada, 31 de julio de 2026; reverificada el 7 de agosto de 2026.
- Auditoría completa de paridad de idioma sobre el editor completo: cabeceras, pestañas, etiquetas, botones, placeholders, avisos y el modal de precios completo, en los seis idiomas.
- **Incidente corregido en la misma sesión:** una sustitución de texto demasiado amplia durante la auditoría corrompió la propia definición del diccionario de idiomas (la clave `noResponse` del inglés pasó de ser un texto literal a una llamada a función inválida), lo que impedía cargar la extensión (`Uncaught TypeError: S is not a function`). Verificado el 7 de agosto de 2026 que `noResponse` es hoy un texto literal normal en los seis idiomas — la corrección sigue vigente y no ha vuelto a corromperse.

### D-054 — Sistema de progresión “Mi progreso” en ScrubForge (ScrubForge)

- **Decisión:** completada, 7 de agosto de 2026 (esta conversación) — carryover de una fase de trabajo previa dentro de la misma sesión, cerrado al inicio de esta conversación.
- Motor de gamificación local (`progression.js`), con logros, niveles de prestigio y color de acento desbloqueable aplicado vía variables CSS, siguiendo el mismo patrón ya usado en FrameForge (D-039). Todo el progreso vive en `chrome.storage.local`, con textos en los seis idiomas.
- No documentado con más detalle por no ser el foco central de esta conversación; se registra aquí solo para dejar constancia de que existe, distinto de la sesión del 31 de julio documentada en D-047 a D-053.

### D-055 — Sistema de revelado cifrado extremo a extremo para imágenes y texto (ScrubForge)

- **Decisión:** completada, 7 de agosto de 2026, en esta conversación.
- Se implementó un motor de cifrado (`src/engine/imageVault.js`) basado en ECDH P-256 + AES-256-GCM vía Web Crypto API nativa — decisión deliberada de no implementar criptografía propia, solo el formato del contenedor (`.sfvault`) es específico de ScrubForge.
- Cubre tanto imágenes redactadas visualmente como texto sanitizado, con un único panel de revelado que detecta automáticamente el tipo de contenido. Ver §3.4 para el detalle técnico completo.
- Verificado mediante una batería de pruebas reales en Node.js (emparejamiento, cifrado/descifrado, casos adversos). No verificado en un navegador real por limitaciones del entorno de desarrollo de esta sesión (ver §3.4).

### D-056 — Reparto Free/PRO definitivo de ScrubForge: deep scan a Free, redacción de imagen y vault a PRO, corrección de allVendors (ScrubForge)

- **Decisión:** completada, 7 de agosto de 2026, en esta conversación.
- Punto de partida: se decidió qué hacer con todas las funciones nuevas construidas hasta ese momento en la conversación (redacción de imagen, revelado cifrado, deep scan). Primera propuesta de reparto rechazada explícitamente por Damián con instrucción de repensar el valor de PRO frente a la competencia en vez de mantener continuidad con el código existente.
- Se consideró revivir el SKU muerto “Expert” como un tercer tier “Team” para alojar el cifrado (justificado por el hueco de mercado frente al competidor PrivacyScrubber, que cobra 99 $/mes por su tier TEAMS) — **rechazado explícitamente por Damián**: “Solo hay 2 opciones, pro y free, no te lies”. El reparto final respeta estrictamente dos tiers.
- **Deep scan movido de PRO a Free**, decisión motivada por Damián con el razonamiento de que es el motor de detección central del producto: “si eso cojea en Free, mal” — gatear la calidad de detección (a diferencia de gatear flujo de trabajo como auditoría o CLI) se consideró contrario a la promesa central de una herramienta de seguridad.
- **Corrección de bug real, no solo reparto de producto:** el flag `allVendors` estaba en `true` tanto en Free como en PRO desde antes de esta conversación — la restricción de vendors nunca funcionó. Corregido para que Free detecte 7 vendors core y PRO los 12 completos.
- Redacción visual de imagen y exportación `.sfvault` (imagen y texto) quedan como PRO; el revelado/descifrado se mantiene libre para cualquier tier, por decisión explícita para no limitar quién puede recibir contenido cifrado de un contacto PRO.

### D-057 — Corrección de marketing: eliminación del claim fantasma “Batch processing” y nuevas líneas de PRO (ScrubForge)

- **Decisión:** completada, 7 de agosto de 2026, en esta conversación.
- Se detectó que las listas de funciones PRO (modal de precios de la extensión y ficha de Chrome Web Store) incluían “Batch processing” como ventaja PRO pese a que el procesamiento por lotes real vive únicamente en la CLI de ScrubForge, no en la extensión — un claim de marketing sin función real detrás.
- Sustituido por “Acceso a la CLI (línea de comandos, CI/CD)”, y se añadieron dos líneas nuevas reflejando las funciones construidas en esta sesión: “Redacción visual de imagen” y “Uso compartido cifrado (.sfvault)”. Aplicado en los seis idiomas, tanto en `App.jsx` como en `popup-i18n.js`.

### D-058 — Subida de versión de ScrubForge a 1.15.0

- **Decisión:** completada, 7 de agosto de 2026, en esta conversación.
- `manifest.json` pasó de 1.13.2 a 1.15.0 (incremento menor, sin cambios que rompan datos o configuración de usuarios existentes). Se descartó explícitamente un salto a versión mayor (2.0.0): no hay cambios incompatibles, y el sistema de cifrado se consideró una función de nicho más que un cambio de propuesta de valor central del producto — decisión de Damián tras planteárselo como opción.
- Se corrigieron además los 7 literales `v1.13.1` (desactualizados desde antes de esta conversación) embebidos en el pie de página de la extensión, en los seis idiomas más el texto estático de la cabecera.

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
- Antes del 28 de julio de 2026, "Expandir lienzo" y "Detectar defectos" (FrameForge) estaban bloqueadas del todo para usuarios FREE con un modal de desbloqueo PRO, pese a que su propio código interno ya tenía preparado el mensaje de exportación "gratis con marca de agua" — una inconsistencia de diseño nunca resuelta hasta D-032, y que dejó ese texto de aviso inalcanzable durante todo ese tiempo.
- Antes del 28 de julio de 2026, formas, capas, plantillas, historial visual, recorte manual con tirador, cuentagotas y guías de alineación de FrameForge solo existían dentro del editor completo (lupa); ver D-033 para el cambio a la extensión normal.
- Antes del 7 de agosto de 2026, deep scan era una función exclusiva de PRO en ScrubForge; ver D-056 para el cambio a Free.
- Antes del 7 de agosto de 2026, el flag `allVendors` de ScrubForge estaba activo (`true`) tanto en Free como en PRO en el código — la restricción de detección de vendors por tier nunca funcionó realmente hasta la corrección de D-056. No se sabe desde cuándo estaba así ni si llegó a afectar a una versión publicada en Chrome Web Store.
- Durante la sesión de desarrollo del 7 de agosto de 2026, se consideró y se descartó explícitamente resucitar el SKU muerto “Expert” de ScrubForge como un tercer tier “Team”; ver D-056. El modelo de dos tiers (Free/PRO) sigue siendo la única estructura vigente.

---

## 11. Fuentes de verificación

### 11.1 Repositorio local — web (`wendygo-site`)

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

### 11.2 Repositorio local — extensión FrameForge (nuevo, v5.2)

- `manifest.json` (versión `2.0.0` a fecha de esta consolidación)
- `popup.html`, `popup.js`, `popup.css`
- `i18n.js` (245 claves × 6 idiomas, verificado sin huecos ni duplicados el 28 de julio de 2026)
- `config.js` (contiene el hallazgo de P-008)
- `license.js`
- `bgremove.js`, `upscale.js`, `upscale-worker.js`, `inpaint.js` (los tres modelos de IA local)
- `frameforge-19.js` a `frameforge-28.js` y sus `.css` correspondientes (capas aditivas de funciones: historial/deshacer, acabado y efectos, carril de la lupa, formas/capas/tipografía/cuentagotas/recorte, quitar objetos, expandir lienzo, detectar defectos, herramientas creativas, acordeón de la vista normal, panel de módulos)
- `background.js`, `offscreen.js`, `offscreen.html`, `mask-editor.html`, `mask-editor.js`
- `_locales/{de,en,es,fr,it,pt_PT}/messages.json`

### 11.3 Repositorio local — extensión ScrubForge (nuevo, v5.4)

- `manifest.json` (versión `1.15.0` a fecha de esta consolidación; `1.13.2` antes de esta sesión)
- `src/App.jsx` (componente principal; contiene el objeto de tiers `D`, los componentes `SfImageRedactor`/`SfTextVaultExport`/`SfVaultContacts`, y el diccionario de idioma embebido `_e`)
- `src/engine/imageVault.js` (motor de cifrado: identidad ECDH, códigos de emparejamiento, cifrado/descifrado del contenedor `.sfvault`)
- `src/engine/vendors.js`, `src/engine/obfuscator.js` (detección de vendors y motor de saneo/deep scan)
- `app-reveal-ui.js` (panel de revelado cifrado, fuera de React, sin dependencia de tier)
- `app-faq.js` (script externo del botón de FAQ del editor completo; movido fuera de `app.html` el 31 de julio de 2026 por bloqueo de CSP en modo ventana separada, ver D-050)
- `popup-i18n.js` (diccionario de idioma del popup y del FAQ, seis idiomas)
- `app.html`, `vite.config.js` (markup del overlay de revelado y registro de `app-reveal-ui.js`/`app-faq.js` como assets copiados en el build)
- `src/i18n.js` (diccionario huérfano no importado por ningún módulo; ver P-011)
- Carpeta de build en vivo: `build-reconciliado-2026-07-31/` — destino de sincronización tras cada `vite build` verificado de esta sesión.

### 11.4 Infraestructura de licencias (nuevo, v5.3)

- `worker-license-proxy/src/index.js`
- `worker-license-proxy/wrangler.toml`
- `CREEM-WORKER-DEPLOY.md`
- Dashboard de Cloudflare: Worker `wendygo-license-proxy`, build desde `main`, raíz `worker-license-proxy`, secreto cifrado `CREEM_API_KEY` y route `wendygostudio.com/api/license/*`.

### 11.5 Fuentes externas

- Dashboard de Creem para precios, productos y licencias.
- Chrome Web Store para publicación, ID, URL, título y slug.
- Documentación oficial de Microsoft Edge para instalación desde Chrome Web Store.
- Repositorio `wendygo-agent` para prompts, rotación y orquestación.
- Chrome for Developers — Program Policies y "Fill out the privacy fields", para el requisito de justificación de permisos (P-007).
- Búsqueda comparativa de mercado (PhotoRoom, Fotor, Canva, Picsart) usada como referencia para la decisión D-032 sobre el modelo gratis/PRO de FrameForge — no es una fuente de datos de WendyGo Studio, solo contexto de producto.

### 11.6 Regla de actualización

Cuando una fuente externa contradiga este documento:

1. Verificar que se trata del mismo producto y entorno.
2. Actualizar primero la ficha de estado actual.
3. Registrar la decisión o corrección en el apartado 9.
4. Añadir o cerrar el pendiente correspondiente en el apartado 8.
5. Propagar el cambio según la sección 7.1.
