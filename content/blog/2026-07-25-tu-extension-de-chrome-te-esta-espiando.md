---
schemaVersion: 1
title: "¿Tu Extensión de Chrome Te Está Espiando? Checklist 2026"
description: "Google y Microsoft retiraron una extensión con 1.6M instalaciones por recopilar datos ocultos. Cómo comprobar si tus extensiones son seguras."
date: 2026-07-25
slug: tu-extension-de-chrome-te-esta-espiando
locale: es
translationKey: is-your-chrome-extension-spying-on-you
product: slimeforge
contentType: how-to
primaryKeyword: "mi extensión de chrome me espía"
relatedPages: /slimeforge/
sourceUrls: https://support.google.com/chrome_webstore/answer/186213?hl=en,https://developer.chrome.com/docs/extensions/develop/security-privacy/user-privacy?hl=en
---

Si usas una extensión de Chrome o Edge para gestionar tu enfoque, tus cabeceras HTTP, tus contraseñas o cualquier otra cosa, la retirada de ModHeader merece cinco minutos de tu tiempo. No porque ModHeader fuera una herramienta marginal, tenía 1.6 millones de instalaciones y una década de confianza, sino por cómo exactamente ocultaba lo que hacía. Para revisar una instalación antes de conceder acceso, consulta también la nueva [checklist de permisos de extensiones de Chrome](/blog/chrome-extension-permissions-checklist/).

> **Qué pasó realmente**
> El 3 de julio de 2026, Microsoft retiró ModHeader de la tienda de complementos de Edge. El 10 de julio, Google hizo lo mismo y la retiró de la Chrome Web Store. La firma de seguridad [Stripe OLT](https://thehackernews.com/2026/07/google-and-microsoft-pull-modheader.html) descubrió que la extensión oficial, firmada criptográficamente, contenía un recolector completo de historial de navegación: generaba una huella del dispositivo, cifraba el dominio de cada página visitada, y estaba preparado para subir la lista diariamente a un servidor externo. El recolector no estaba activo, una lista de permitidos interna vacía lo mantenía apagado, pero activarla solo requería una actualización rutinaria, sin nuevos permisos, sin ninguna acción del usuario.

## Por qué esto importa aunque no uses ModHeader

ModHeader es una herramienta para desarrolladores que edita cabeceras HTTP, no una extensión de productividad. Pero el patrón que reveló aplica directamente a temporizadores de enfoque, gestores de pestañas y cualquier otra extensión que pida acceso amplio:

<div class="key-points">
  <h3>Por qué los escaneos automáticos no lo detectaron</h3>
  <ul>
    <li><strong>El cifrado ocultó la carga útil</strong> — un escáner ve texto cifrado, no una lista de dominios, así que nada legible salió nunca del dispositivo durante las pruebas.</li>
    <li><strong>Una lista de permitidos vacía bloqueaba la subida</strong> — el código de recolección se ejecutaba, pero la llamada de red que alimentaba simplemente nunca se disparaba, así que los sandboxes no veían tráfico saliente.</li>
    <li><strong>El código malicioso estaba minificado dentro de una función legítima y funcional</strong> — la extensión seguía haciendo exactamente lo que anunciaba, que es lo que la mayoría de revisiones manuales comprueban.</li>
  </ul>
</div>

Los verificadores de riesgo automáticos calificaron la extensión de bajo riesgo, algunos con hasta 95 sobre 100. Un listado firmado con años de buenas reseñas indicaba a los usuarios que era de confianza. Ninguna de las dos señales lo detectó.

## Un checklist práctico antes de confiar en una extensión

<div class="step-card">
  <span class="step-label">Cómo hacerlo</span>
  <strong>Cinco comprobaciones que llevan menos de dos minutos</strong>
  <p>Abre <code>chrome://extensions</code>, pulsa "Detalles" en lo que uses a diario, y comprueba: ¿pide "leer y cambiar todos tus datos en todos los sitios web" cuando su función declarada no lo necesita? ¿Ha cambiado de propietario o pasó de gratuita a "con publicidad" recientemente, un patrón que los investigadores de seguridad llevan señalando desde 2021? ¿El desarrollador publica una política de privacidad que realmente coincide con lo que el código necesita hacer? ¿Ha publicado una actualización en las últimas semanas sin registro de cambios? Y, si puedes, ¿funciona la extensión con la conexión de red desactivada? Una herramienta genuinamente local seguirá funcionando; una que llama a casa, no.</p>
</div>

| Señal de una extensión de menor riesgo | Señal que merece investigarse |
|---|---|
| Solo pide los permisos que necesita su función declarada | Pide acceso amplio a hosts "por si acaso" |
| Misma propiedad y registro de cambios claro en el tiempo | Cambió de propietario recientemente o pasó a tener publicidad |
| Funciona completamente sin conexión si su función no necesita red | Hace llamadas de red que una función puramente local no debería necesitar |
| Transparente sobre no recopilar datos de navegación | Política de privacidad vaga o inexistente |

La propia [política de la Chrome Web Store](https://developer.chrome.com/docs/webstore/program-policies/policies) de Google ya pide a los desarrolladores solicitar los permisos más estrechos que necesita una función y prohíbe recopilar actividad de navegación fuera de un propósito declarado y visible para el usuario. A partir del 1 de agosto de 2026, entra en vigor la [aplicación de reglas más estrictas de recopilación de datos](https://developer.chrome.com/blog/cws-policy-updates-2026) en toda la tienda, pero eso es un mínimo, no una garantía. Solo limita lo que una extensión que cumple las reglas puede hacer, y ModHeader tampoco declaraba lo que había construido.

## Qué te da realmente "solo local"

El núcleo de [SlimeForge](/es/slimeforge/) —temporizador, progreso de la mascota y datos de sesión— se ejecuta en el dispositivo sin requerir una cuenta. Su manifiesto declara `storage`, `alarms`, `scripting` y `activeTab` para el temporizador y las funciones opcionales dentro de páginas. La activación de licencia puede contactar con Creem; las funciones opcionales de Gemini Nano se ejecutan localmente cuando son compatibles. Esto es más preciso que afirmar que la extensión nunca realiza una petición de red.

Si estás evaluando cualquier [extensión de pomodoro o enfoque](/es/blog/extension-pomodoro-chrome/), incluida una [que funcione sin conexión](/es/blog/temporizador-pomodoro-offline-chrome/), la pestaña de permisos y la prueba de "¿sigue funcionando sin internet?" te dicen más en dos minutos que cualquier valoración por estrellas.

## Preguntas frecuentes

### ¿Cómo superó ModHeader los escáneres de seguridad de Chrome durante años?

El recolector estaba cifrado y bloqueado tras una lista de permitidos interna que se publicó vacía, así que el paso de subida nunca se ejecutaba durante los escaneos. Un escáner ve texto cifrado y ningún tráfico saliente, que es exactamente el aspecto de una extensión limpia. Los investigadores de Stripe OLT solo lo encontraron leyendo directamente el código minificado.

### ¿Qué permisos necesita realmente una extensión de enfoque o productividad?

Una extensión de concentración debe solicitar solo los permisos necesarios para sus funciones declaradas. SlimeForge declara `storage`, `alarms`, `scripting` y `activeTab`; el acceso opcional a sitios solo se solicita cuando el usuario activa funciones dentro de la página.

### ¿Una extensión popular y bien valorada es automáticamente segura?

No. ModHeader tenía 1.6 millones de instalaciones, un largo historial, y puntuaciones de riesgo automáticas de hasta 95 sobre 100 calificándola de bajo riesgo, y aun así incluía un recolector de datos funcional. El número de instalaciones y la valoración miden popularidad, no lo que hace el código tras una actualización.

### ¿Desinstalar una extensión maliciosa elimina los datos ya recopilados?

Desinstalarla la elimina de tu navegador y borra su almacenamiento local, pero no deshace nada ya enviado a los servidores del desarrollador. Si alguna vez pegaste claves de API, tokens o contraseñas en los campos de una extensión, rótalas independientemente de si esa extensión resulta o no estar comprometida.
