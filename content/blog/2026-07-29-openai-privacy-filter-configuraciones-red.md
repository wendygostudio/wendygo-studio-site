---
schemaVersion: 1
title: "El Privacy Filter de OpenAI No Sabe Qué Es una Contraseña BGP"
description: "OpenAI liberó como código abierto un modelo que redacta PII antes de que llegue a una IA. Esto es exactamente lo que detecta, lo que nunca fue diseñado para detectar, y por qué las configs de red siguen necesitando una herramienta dedicada."
date: 2026-07-29
slug: openai-privacy-filter-configuraciones-red
locale: es
translationKey: openai-privacy-filter-network-configs
product: scrubforge
contentType: use-case
primaryKeyword: "openai privacy filter configuración de red"
relatedPages: /scrubforge/
---

OpenAI liberó recientemente Privacy Filter como código abierto, un modelo pequeño construido para detectar y redactar información personal identificable en texto, que corre en local, en un portátil o directamente en el navegador, y reporta un F1 del 96-97% en detección de PII. Es un lanzamiento genuinamente útil. También es algo que no está construido para proteger lo que la mayoría de los ingenieros de red pegan realmente en un chat de IA: una configuración de router o firewall.

## Para qué sirve realmente Privacy Filter

<div class="key-points">
  <h3>Qué apunta el modelo</h3>
  <ul>
    <li>Nombres, emails, números de teléfono, direcciones — PII clásica, del tipo que aparece en emails, tickets de soporte y documentos legales.</li>
    <li>Detección consciente del contexto sobre documentos largos, hasta 128.000 tokens en una sola pasada, un logro de ingeniería real para ese caso de uso.</li>
    <li>Corre en el dispositivo, pesos abiertos, licencia Apache 2.0 — ningún dato sale de la máquina para redactarlo, que es el modelo de privacidad correcto.</li>
  </ul>
</div>

Es una herramienta sólida para lo que fue construida: documentos legales, hilos de email, registros de clientes. Es un modelo de PII de propósito general, entrenado con el tipo de datos personales que aparecen en cualquier industria.

## Lo que nunca fue entrenado para reconocer

Un archivo de configuración de red no se parece a un documento legal ni a un registro de cliente. Se parece a esto:

```
enable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0
snmp-server community publicRW RW
router bgp 65001
 neighbor 203.0.113.1 remote-as 65002
 neighbor 203.0.113.1 password 7 08351A5D0713
```

<div class="step-card">
  <span class="step-label">Verificación de realidad</span>
  <strong>Nada de esto es PII, y todo esto es una credencial</strong>
  <p>Una cadena de comunidad SNMP, una contraseña de vecino BGP, una clave de autenticación OSPF, una clave de servidor TACACS+, una clave precompartida WPA — ninguna coincide con la distribución de entrenamiento de un modelo de PII general, porque no son nombres, emails ni teléfonos. Son secretos específicos de dominio que solo tienen sentido en el contexto de la sintaxis de configuración de red, y un modelo entrenado con datos legales y de clientes no tiene ningún motivo para haber visto uno.</p>
</div>

Hay una segunda brecha igual de importante: **la fortaleza de la credencial**. `enable secret 5` es un hash MD5. `password 7` es un cifrado Cisco tipo 7, trivialmente reversible con herramientas que existen desde hace más de una década. Un modelo de redacción de PII no tiene ningún concepto de "este hash es débil" o "esta codificación es reversible" — o reconoce un patrón como PII o no lo reconoce. Distinguir un hash bcrypt fuerte de una contraseña Cisco tipo 7 reversible requiere conocer los esquemas de codificación del fabricante, no solo reconocer texto con pinta de sensible.

## Poniendo a prueba la brecha

Pasa un export real de Cisco, FortiGate o MikroTik por un detector de PII genérico y el patrón es consistente: captura algo si hay una dirección de email o un nombre de host que parece un dominio, y pasa de largo sobre el `enable secret`, la comunidad SNMP, la contraseña de vecino BGP y la clave precompartida. No es un defecto del modelo. Simplemente está fuera de lo que fue entrenado para buscar, del mismo modo que un corrector ortográfico no está roto por no detectar un error matemático.

## Qué significa esto si pegas configs en herramientas de IA

La lectura correcta del lanzamiento de OpenAI no es "la redacción ya es un problema resuelto". Es lo contrario: la redacción de PII de propósito general va camino de ser gratuita y estar comoditizada, lo cual es genuinamente bueno para cualquiera que trate con nombres, emails y datos de clientes. Pero afila exactamente dónde está la brecha que queda: secretos específicos de dominio en formatos técnicos estructurados, siendo las configs de red uno de los ejemplos más claros.

<table>
<tr><th>Cubierto por modelos de PII generales</th><th>No cubierto, necesita detección consciente del fabricante</th></tr>
<tr><td>Nombres, emails, teléfonos</td><td>Cadenas de comunidad SNMP</td></tr>
<tr><td>Direcciones físicas</td><td>Claves de autenticación BGP / OSPF / HSRP</td></tr>
<tr><td>Números de tarjeta de crédito</td><td>Claves de servidor TACACS+ / RADIUS</td></tr>
<tr><td>Formatos genéricos de claves API</td><td>Codificaciones de contraseña específicas de fabricante (p. ej. Cisco tipo 7)</td></tr>
<tr><td>—</td><td>Clasificación de fortaleza de hash/cifrado</td></tr>
</table>

Si estás pegando una config en ChatGPT, Claude o Gemini para depurar un problema de enrutamiento, un filtro de PII general corriendo de fondo no va a capturar la parte que realmente importa. [ScrubForge](/es/scrubforge/) está construido específicamente para esa brecha: 12 perfiles de fabricante, detección de secretos a nivel de protocolo (BGP, OSPF, HSRP, TACACS+, RADIUS, SNMP), y clasificación de fortaleza de hash, corriendo íntegramente en local, con un chat BYOK opcional que solo ve la versión tokenizada de tu config.

## Preguntas frecuentes

### ¿El Privacy Filter de OpenAI protege las contraseñas en una config de router o firewall?

No de forma fiable. Está entrenado para detectar PII general, nombres, emails, teléfonos, no credenciales de red específicas de fabricante como cadenas de comunidad SNMP o contraseñas de vecino BGP, que siguen una sintaxis completamente distinta y no formaron parte de su enfoque de entrenamiento.

### Si ChatGPT eventualmente añade redacción de PII integrada, ¿seguirán en riesgo las configs de red?

Sí, por el mismo motivo. Una redacción integrada orientada al cumplimiento general de PII no estará ajustada para reconocer la sintaxis de configuración de router o firewall a menos que un proveedor entrene específicamente para ello, lo cual es un caso de uso estrecho y de bajo volumen comparado con los patrones de PII que aparecen en cualquier otro tipo de documento.

### ¿Cuál es la diferencia práctica entre redacción de PII y sanitización de configs?

La redacción de PII protege datos personales, información que identifica a una persona. La sanitización de configs protege secretos de infraestructura, credenciales y topología que identifican y dan acceso a una red. Se solapan en casi ningún caso, y una herramienta construida para una rara vez cubre bien la otra.

### ¿Sigue siendo necesario sanitizar configs manualmente si confío en el proveedor de IA?

Sanitizar antes de pegar te protege independientemente de lo que cualquier proveedor prometa sobre el manejo de datos, y protege contra el riesgo más simple de que un compañero, una pantalla compartida, o un log de chat copiado y pegado lleve una credencial viva a algún sitio donde no debería estar.
