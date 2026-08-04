---
schemaVersion: 1
title: Eliminar secretos de los archivos de configuración de Kubernetes
description: >-
  Desinfecte Kubernetes YAML antes de compartirlo con soporte o asistentes de
  IA. Elimine claves API, credenciales y tokens localmente con ScrubForge.
date: 2026-07-31T00:00:00.000Z
slug: remove-secrets-kubernetes-config
locale: es
translationKey: remove-secrets-kubernetes-config
product: scrubforge
contentType: use-case
primaryKeyword: eliminar secretos de la configuración de Kubernetes
relatedPages: /es/scrubforge/
---

# Eliminar secretos de los archivos de configuración de Kubernetes

Kubernetes YAML a menudo combina la estructura de implementación con información que debe permanecer dentro del clúster: tokens de servicio, claves API, contraseñas codificadas en base64 y credenciales de registro privado. Antes de pegar un manifiesto en un ticket de soporte o en un asistente de IA, elimine esos valores sin destruir el contexto técnico.

> **Importante:** base64 es codificación, no encriptación. Un valor en "datos:" aún puede ser una credencial recuperable.

## Que revisar

- Campos `Secret` y `stringData` que contienen contraseñas o tokens.
- Variables de entorno como `AWS_SECRET_ACCESS_KEY`, `GITHUB_TOKEN` o claves internas.
- URL con nombres de usuario y contraseñas integrados.
- ConfigMaps que contienen puntos finales privados o material de autenticación.

El objetivo es mantener legibles los nombres, las relaciones y la sangría mientras se reemplazan los literales confidenciales. Eliminar bloques enteros puede parecer limpio, pero puede ocultar la causa del problema que estás intentando diagnosticar.

## Desinfectar antes de compartir

1. Exporte una copia de trabajo del manifiesto, nunca el archivo utilizado por el clúster.
2. Pegue la copia en [ScrubForge](/scrubforge/).
3. Revise la vista previa: las claves y los tokens deben convertirse en marcadores de posición coherentes.
4. Confirme que los nombres de recursos, espacios de nombres, puertos y referencias permanezcan visibles.
5. Comparta solo el resultado desinfectado y guarde el original dentro de su entorno seguro.

ScrubForge procesa el texto localmente en el navegador. Detecta patrones comunes de secretos de servicio y mantiene el mismo token para la misma coincidencia, de modo que un revisor pueda comprender las relaciones sin ver el valor real.

<div class="key-points">
<h3>Before sharing the result</h3>
<ul>
<li><strong>Check comments:</strong> credentials can hide outside YAML values.</li>
<li><strong>Review base64:</strong> encoding does not make a secret safe to share.</li>
<li><strong>Read the output:</strong> ensure the YAML still explains the problem.</li>
</ul>
</div>

## Cuando desinfectar no es suficiente

Si ya se ha publicado una credencial real, trátela como comprometida: revoquela y emita una sustituta. La desinfección previene una nueva exposición, pero no reemplaza la rotación ni la revisión de los permisos del clúster.

## Preguntas frecuentes

### ¿ScrufoForge decodifica todos los secretos de Kubernetes?

Detecta patrones confidenciales y formatos comunes, pero aún así debes revisar manualmente los campos específicos de la organización.

### ¿Es seguro compartir base64?

No. Base64 es codificación reversible, no protección.

### ¿Está subido el manifiesto?

ScrubForge lo desinfecta localmente. Aún así debes revisar el texto final antes de enviarlo a un tercero.
