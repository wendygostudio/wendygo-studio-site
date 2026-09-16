---
schemaVersion: 1
title: "Cómo sanitizar logs de GitHub antes de compartirlos"
description: "Checklist práctico para quitar tokens, URLs de repositorios y contexto privado de los logs de GitHub antes de compartirlos con soporte o una herramienta de IA."
date: 2026-09-16
slug: sanitizar-logs-github-antes-compartir
locale: es
translationKey: sanitize-github-logs-before-sharing
product: scrubforge
contentType: how-to
primaryKeyword: "sanitizar logs de GitHub"
relatedPages: /es/scrubforge/,/es/blog/sanitizar-configuracion-paloalto/,/es/blog/permisos-extensiones-chrome-checklist/
sourceUrls: https://docs.github.com/en/code-security/tutorials/remediate-leaked-secrets/remediating-a-leaked-secret,https://docs.github.com/en/actions/reference/security/secrets,https://docs.github.com/en/actions/reference/security/secure-use,https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
faqs:
  - question: "¿Basta con borrar un token de un log de GitHub?"
    answer: "No. Trata un secreto activo expuesto como comprometido, revócalo o rótalo con el proveedor y después elimina o redacta la copia que vas a compartir."
  - question: "¿GitHub redacta todos los secretos en los logs de Actions?"
    answer: "No. GitHub documenta el enmascaramiento automático de valores compatibles, pero los valores transformados o estructurados pueden no ocultarse; revisa los logs y registra los valores sensibles generados."
  - question: "¿Qué debo quitar antes de compartir un log de GitHub?"
    answer: "Quita tokens, cabeceras de autorización, URLs de repositorios privados, nombres internos, datos personales y payloads que no sean necesarios para reproducir el fallo."
  - question: "¿Puedo sanitizar los logs de GitHub en local?"
    answer: "Sí. Un flujo local de texto y configuración reduce la exposición al subirlos, pero debes revisar el resultado manualmente y tratar los secretos activos por separado."
---

# Cómo sanitizar logs de GitHub antes de compartirlos

Los logs de GitHub Actions son una evidencia útil cuando falla una compilación, pero también pueden contener mucho más contexto del que necesita soporte o un asistente de IA. Pueden mostrar la URL de un repositorio, una rama, un host interno, una ruta de archivo, el título de una pull request, un correo, una cabecera de autorización o un token impreso por un comando.

El flujo más seguro es crear una copia, quitar el contexto privado innecesario, revisar el resultado y compartir solo entonces. Esto reduce la información divulgada, pero no sustituye la respuesta a un incidente: si aparece un secreto activo, rótalo o revócalo primero con su proveedor.

## Qué revisar

Busca en la copia:

- tokens, claves API, JWT, claves privadas y cabeceras `Authorization`;
- URLs de repositorios privados, hosts internos, IDs de cuentas cloud y rutas locales;
- nombres de despliegues, clústeres, bases de datos y variables de entorno;
- correos, nombres de usuario, texto de incidencias o payloads con datos personales;
- informes y cuerpos de petición que no hagan falta para reproducir el fallo.

Conserva el error, el código de salida, las versiones relevantes y la entrada mínima necesaria. Sustituye los valores por marcadores estables como `<GITHUB_TOKEN>` o `<HOST_INTERNO>`; así mantienes la forma del fallo sin revelar el valor literal.

## Flujo local paso a paso

1. Copia el log a un archivo temporal local. Guarda el original en el entorno seguro donde se generó.
2. Busca `token`, `secret`, `password`, `Authorization`, `BEGIN PRIVATE KEY`, URLs, hosts y correos. Revisa también cadenas opacas largas.
3. Sustituye los valores sensibles por marcadores. Repite el mismo marcador cuando el valor se repita para conservar la secuencia.
4. Elimina pasos no relacionados, cuerpos de petición y volcados de entorno.
5. Lee el archivo final completo, incluidos los bloques de código, las líneas cercanas y los artefactos adjuntos.
6. Comparte la copia saneada por el canal aprobado y anota qué valores eliminaste.

ScrubForge puede ayudar en la pasada local de limpieza de un log o configuración copiados. El borrador permanece en la pestaña del navegador hasta que decides copiarlo. Revisa siempre el resultado: ningún sanitizador puede saber qué identificador interno es divulgable en tu organización.

## Qué garantiza el enmascaramiento de GitHub

La [referencia de secretos de GitHub](https://docs.github.com/en/actions/reference/security/secrets) documenta el enmascaramiento automático de valores compatibles en los logs, pero no es una revisión completa. Los valores transformados, codificados, divididos o estructurados pueden no reconocerse. GitHub también recomienda ocultar los valores sensibles que no estén guardados como secretos de GitHub y evitar comandos que impriman secretos.

Si un workflow necesita usar un secreto externo en un diagnóstico, enmascáralo antes de que cualquier comando pueda imprimirlo. Aun así, revisa el log antes de exportarlo: puede revelar nombres de repositorios, topología, datos de usuarios o un valor reconstruido mediante una transformación.

## Si ya expusiste un secreto

Revócalo o rótalo siguiendo el procedimiento del proveedor, determina dónde se guardó el log y revisa quién pudo acceder. Borrar una línea de la vista actual no elimina copias en artefactos, cachés, tickets, exportaciones de chat o historial del repositorio. Si entró en el historial Git, aplica además la guía de GitHub para coordinar y reescribir el historial después de revocarlo.

## Checklist final

1. ¿Quitaste o sustituiste todos los valores que parecen credenciales?
2. ¿Revocaste o rotaste cualquier credencial activa expuesta?
3. ¿Son necesarios para el diagnóstico los hosts, URLs internas y datos personales?
4. ¿Revisaste artefactos, capturas y comandos pegados?
5. ¿El log conserva el error, las versiones y el contexto de reproducción?

Consulta también [cómo sanitizar una configuración Palo Alto PAN-OS antes de compartirla](/es/blog/sanitizar-configuracion-paloalto/) y el flujo de navegador de [ScrubForge](/es/scrubforge/).

## Preguntas frecuentes

### ¿Basta con borrar un token de un log de GitHub?

No. Trata el secreto activo como comprometido, rótalo o revócalo con el proveedor y después elimina o redacta la copia que vas a compartir.

### ¿GitHub redacta todos los secretos en los logs de Actions?

No. Los valores compatibles pueden ocultarse, pero los transformados o estructurados pueden escapar al enmascaramiento automático. Revisa los logs y enmascara de forma explícita los valores sensibles generados.

### ¿Qué debo quitar antes de compartir un log?

Tokens, cabeceras de autorización, URLs privadas, nombres internos, datos personales y payloads innecesarios para reproducir el fallo.

### ¿Puedo sanitizar logs en local?

Sí. Reduce la exposición al subirlos, pero revisa manualmente el resultado y trata los secretos activos por separado.
