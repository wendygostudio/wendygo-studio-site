---
schemaVersion: 1
title: Base64 codifica secretos de Kubernetes localmente (sin herramienta web)
description: >-
  Los manifiestos secretos de Kubernetes requieren valores codificados en
  Base64. Aquí le mostramos cómo codificar sus secretos sin procesar localmente
  en su navegador: sin terminal ni sitio de terceros.
date: 2026-06-26T00:00:00.000Z
slug: base64-encode-kubernetes-secrets
locale: es
translationKey: base64-encode-kubernetes-secrets
product: textforge
contentType: how-to
primaryKeyword: cómo codificar en base64 secretos de Kubernetes sin una herramienta web
relatedPages: /es/textforge/,/es/blog/datos-vs-stringdata-secret-kubernetes/
---

# Cómo codificar en Base64 secretos de Kubernetes sin una herramienta web

Kubernetes almacena valores confidenciales en manifiestos secretos. A diferencia de ConfigMaps, que aceptan texto sin formato, los campos de "datos" secretos requieren valores codificados en Base64. Muchos desarrolladores pegan contraseñas sin formato y claves API en herramientas Base64 en línea, lo que envía esas credenciales a un servidor de terceros.

Existe una opción más segura: codificar directamente en su navegador usando una extensión de Chrome que nunca transmite sus datos.

Si estás decidiendo entre `data` y `stringData`, consulta primero la [guía sobre data y stringData](/es/blog/datos-vs-stringdata-secret-kubernetes/) antes de codificar un valor manualmente.

## Por qué Kubernetes usa Base64

Los manifiestos secretos de Kubernetes tienen este aspecto:

```yaml
Versión api: v1
tipo: secreto
metadatos:
nombre: credenciales-db
tipo: opaco
datos:
contraseña: c3VwZXJzZWNyZXQ=
clave de API: c2tfdGVzdF84YzhiNDU2MA==
```

Los valores bajo `datos:` están codificados en Base64. Los valores sin procesar (`supersecret`, `sk_test_8c8b4560`) nunca se almacenan directamente en el manifiesto.

**Importante:** Base64 no es cifrado. Cualquiera que tenga acceso al manifiesto secreto puede decodificar los valores al instante. Los secretos de Kubernetes brindan control de acceso a nivel de clúster: la codificación Base64 es puramente un requisito de formato de la API, no una medida de seguridad.

## Codificación de valores secretos con TextForge

TextForge es una extensión de Chrome con más de 50 utilidades de texto. La codificación Base64 está disponible en la versión gratuita y se ejecuta completamente localmente.

1. **Abre TextForge**: haz clic en el icono de extensión en la barra de herramientas de tu navegador.
2. **Pegue el valor secreto sin formato**: su contraseña, clave API, cadena de conexión o cualquier valor que deba incluirse en el manifiesto.
3. **Aplicar codificación Base64**: la cadena codificada aparece inmediatamente.
4. **Copie el resultado** y péguelo en el bloque `data:` de su YAML de Kubernetes.

Sin terminal, sin herramienta web, ni datos saliendo de su máquina.

## Usando `stringData` en su lugar

Kubernetes también acepta un campo `stringData` que toma valores de texto sin formato; la API los codifica automáticamente:

```yaml
datos de cadena:
contraseña: supersecreta
```

`stringData` está bien para valores que estás creando nuevos. Pero si estás leyendo un manifiesto secreto existente, los valores almacenados siempre estarán en "datos:" en formato Base64, que es cuando necesitas decodificarlos para su inspección.

## Decodificación para verificar

Para verificar un valor codificado existente en un manifiesto, péguelo en TextForge y aplique Base64 Decode. Obtienes el valor bruto inmediatamente, sin ejecutar:

```bash
kubectl obtiene credenciales db secretas -o jsonpath='{.data.password}' | base64 --decodificar
```

## Preguntas frecuentes

**¿Se requiere codificación Base64 para todos los secretos de Kubernetes?**
Solo para el campo `datos:`. Si usa `stringData:`, Kubernetes maneja la codificación. La mayoría de las herramientas y tutoriales utilizan "datos:" en los ejemplos, de ahí surge la necesidad de codificar manualmente.

**¿Puedo codificar valores de varias líneas como certificados TLS?**
Sí. Pegue el certificado completo (incluido el encabezado y pie de página `-----BEGIN CERTIFICATE-----`) en TextForge y codifíquelo. La cadena resultante va al campo `datos:`.

**¿Esta función es gratuita en TextForge?**
Sí. La codificación y decodificación Base64 están en la versión gratuita: no se requiere cuenta ni suscripción.

---

[Install TextForge from the Chrome Web Store →](https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba)
