---
schemaVersion: 1
title: Cómo decodificar una carga útil de token JWT en su navegador
description: >-
  Inspeccione los reclamos de JWT (ID de usuario, vencimiento, roles)
  directamente en su navegador sin pegar tokens en jwt.io o una herramienta web.
  TextForge decodifica Base64url localmente.
date: 2026-06-26T00:00:00.000Z
slug: decode-jwt-token-browser
locale: es
translationKey: decode-jwt-token-browser
product: textforge
contentType: how-to
primaryKeyword: cómo decodificar una carga útil de token jwt en su navegador
relatedPages: /es/textforge/
---

# Cómo decodificar una carga útil de token JWT en su navegador

JWT (JSON Web Tokens) se utilizan para la autenticación en casi todas las API modernas. Parecen ruido aleatorio (tres secciones codificadas en Base64url unidas por puntos), pero la sección de carga útil contiene JSON legible: ID de usuario, vencimiento, roles, alcances. Sólo necesitas decodificarlo.

Cuando depura un flujo de autenticación, verifica por qué una solicitud recibe 401 o verifica qué reclamaciones envía un servicio, necesita ver esa carga útil. Esta es la forma más rápida de hacerlo en su navegador sin tener que pegar tokens en un sitio de terceros.

## ¿Qué hay dentro de un JWT?

Un JWT tiene tres secciones separadas por puntos:

```
ENCABEZADO.CARGA.FIRMA
```

- **Encabezado**: tipo de token y algoritmo de firma (por ejemplo, RS256, HS256)
- **Carga útil**: los reclamos como JSON, codificados en Base64url
- **Firma**: verifica que el token no haya sido manipulado

La carga útil es la sección que deseas. No está cifrado, sólo codificado. No necesitas la clave secreta para leerlo; sólo necesitas la clave para verificar su autenticidad.

## Cómo decodificar la carga útil con TextForge

TextForge es una extensión de Chrome con más de 50 funciones de utilidad de texto. La decodificación Base64 está incluida en la versión gratuita y se ejecuta completamente en su máquina.

1. **Copie el JWT**: desde DevTools (pestaña Red → encabezado de Autorización), su cliente API o una variable de entorno.
2. **Identifique la sección de carga útil**: es el segundo fragmento, entre el primer y segundo punto.
3. **Abre TextForge**: haz clic en el icono de extensión en la barra de herramientas de tu navegador.
4. **Pegue la sección de carga útil** en el área de entrada.
5. **Aplicar Base64 Decode**: las afirmaciones JSON aparecen inmediatamente.

## Lo que verás

Después de decodificar, obtendrás JSON como:

```json
{"sub":"user_123","email":"user@example.com","role":"admin","exp":1762000000,"iat":1750000000}
```

Reclamaciones comunes que debe buscar:
- `sub` — asunto (normalmente un ID de usuario o nombre de usuario)
- `exp` — caducidad como marca de tiempo de Unix (segundos desde la época)
- `iat` - emitido en la marca de tiempo
- `aud` — audiencia (a qué servicio está destinado el token)
- `roles` / `scope` — permisos otorgados al token

## ¿Por qué no utilizar jwt.io?

jwt.io es la herramienta estándar y es conveniente. Pero envía tu JWT a un servidor. Para los tokens que contienen datos de usuario reales, ID de usuario internos o reclamos de alcance, pegarlos en una herramienta de terceros es un hábito que vale la pena evitar, especialmente en la depuración de producción.

TextForge decodifica localmente. El token nunca sale de su navegador.

## Preguntas frecuentes

**¿Puedo decodificar la firma JWT de esta manera?**
La sección de firma también está codificada en Base64url, pero al decodificarla se obtiene un binario sin formato, no JSON legible por humanos. Lo que realmente desea es la carga útil (segunda sección), no la firma (tercera).

**¿TextForge verifica la firma JWT?**
No. TextForge decodifica la carga útil para su inspección. La verificación de la firma requiere la clave secreta y se realiza en el lado del servidor. Para fines de inspección, todo lo que necesita es decodificar la carga útil.

**¿Esto funciona sin conexión?**
Sí. La decodificación Base64 se ejecuta localmente en la extensión sin necesidad de red.

---

[Install TextForge from the Chrome Web Store →](https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba)
