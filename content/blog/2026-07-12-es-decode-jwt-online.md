---
schemaVersion: 1
title: "Decodificar token JWT en línea (sin carga de servidor, sin terceros)"
description: "Decodifica el payload de un token JWT localmente en el navegador, sin subir el token a servidores ni servicios de terceros."
date: 2026-07-12
slug: decode-jwt-online
locale: es
translationKey: decode-jwt-online
product: textforge
contentType: how-to
primaryKeyword: "decodificar el token jwt en línea (sin carga del servidor, sin terceros)"
relatedPages: /textforge/,/blog/cyberchef-alternatives/,/blog/base64-encode-decode-online-tool/
---# Decodificar token JWT en línea (sin carga de servidor, sin terceros)

JWT (JSON Web Token) es el estándar para la autenticación sin estado. Cada vez que inicia sesión en una aplicación, su navegador contiene un JWT. Pero leer uno requiere decodificarlo, y la mayoría de los decodificadores JWT en línea envían su token a un servidor de terceros.

TextForge decodifica JWT localmente, directamente en su navegador, sin carga en ningún servidor.

## ¿Qué es un JWT y por qué decodificarlo?

Un JWT es una cadena compacta de tres partes:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

El encabezado, la carga útil y la firma están codificados en Base64. La carga útil contiene reclamos de usuario: `user_id`, `email`, `roles`, `exp` (tiempo de vencimiento). Depurar problemas de autenticación, comprobar la caducidad del token o verificar reclamaciones requiere decodificar esa carga útil.

La mayoría de los decodificadores JWT en línea se ejecutan en un servidor remoto, lo que significa que su token (que potencialmente contiene datos confidenciales) abandona su navegador. Si el token es una cookie de autenticación real, esto supone un riesgo para la seguridad.

## Decodificar JWT con TextForge

TextForge decodifica JWT localmente:

1. Copie su JWT de DevTools, una respuesta API o su encabezado de autenticación
2. Pégalo en TextForge
3. Seleccione **Decodificar Base64** en la parte de carga útil
4. El JSON decodificado aparece instantáneamente en su navegador y nunca se envía a ninguna parte.

TextForge también incluye **Forge Magic**: cuando pegas un JWT, detecta automáticamente la carga útil Base64 y ofrece decodificarla directamente, omitiendo el manual paso a paso.

El token nunca sale de su dispositivo. Toda la decodificación se ejecuta en la pestaña de su navegador.

## Alternativa: Consola de DevTools del navegador

Si no desea instalar una extensión, puede decodificar un JWT en la consola del navegador en segundos:

```javascript
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";
const [encabezado, carga útil, firma] = jwt.split('.');
console.log(JSON.parse(atob(carga útil)));
```

Esto imprime la carga útil decodificada directamente. Cero solicitudes externas, cero tiempo de configuración.

## Cuándo NO decodificar un JWT en línea

- **Nunca utilice un decodificador JWT público en línea** (jwt.io, jwtdebugger.com, etc.) con tokens de producción que contengan datos de usuario reales, claves API o información de roles. El token transita a su servidor.
- Si su JWT incluye reclamos confidenciales, decodifíquelo localmente (DevTools o TextForge) únicamente.
- Si su JWT está firmado con un secreto, la decodificación muestra los reclamos pero NO verifica la firma. Solo el servidor emisor puede verificar que un JWT firmado sea real.

## Guías relacionadas

Consulte también [Las mejores alternativas de CyberChef para la manipulación de texto](/blog/cyberchef-alternatives/): para decodificación JWT, operaciones Base64 y otras tareas de texto sin cargarlas a un tercero.

Y [Codificación y decodificación Base64 en línea](/blog/base64-encode-decode-online-tool/), porque las cargas útiles JWT están codificadas en Base64.

## Preguntas frecuentes

**¿Puedo descifrar un JWT?**
No. Decodificar no es lo mismo que descifrar. Un JWT no está cifrado, está codificado en Base64. Cualquiera puede leer la carga útil decodificandola. Si necesita que la carga útil sea secreta, deberá utilizar JWE (JSON Web Encryption), no JWT.

**¿La decodificación de un JWT verifica que sea real?**
No. La decodificación le muestra qué afirmaciones hay dentro, pero no verifica la firma. Sólo el servidor que emitió el token puede verificar su autenticidad. Puedes decodificar un JWT falso con la misma facilidad que uno real.

**¿Es seguro decodificar un JWT en la consola del navegador?**
Sí. La consola es parte de su navegador; No se envía nada externamente. Esta es una de las formas más seguras de decodificar un JWT para su depuración.
