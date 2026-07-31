---
schemaVersion: 1
title: "Cómo eliminar secretos de archivos de configuración de Kubernetes"
description: "Sanea archivos YAML de Kubernetes antes de compartirlos con soporte o asistentes de IA. Elimina claves y tokens localmente con ScrubForge."
date: 2026-07-31
slug: eliminar-secretos-config-kubernetes
locale: es
translationKey: remove-secrets-kubernetes-config
product: scrubforge
contentType: use-case
primaryKeyword: "eliminar secretos de configuración Kubernetes"
relatedPages: /scrubforge/
---

# Cómo eliminar secretos de archivos de configuración de Kubernetes

Los manifiestos YAML de Kubernetes suelen mezclar la estructura del despliegue con información que no debería salir del clúster: tokens de servicio, claves de API, contraseñas codificadas en base64 y credenciales de registros privados. Antes de pegar un archivo en un ticket o en un asistente de IA, elimina esos valores sin destruir el contexto técnico.

> **Importante:** base64 no es cifrado. Un valor en `data:` puede seguir siendo una credencial recuperable.

## Qué revisar en un YAML

- `Secret` y campos `stringData` con contraseñas o tokens.
- Variables de entorno como `AWS_SECRET_ACCESS_KEY`, `GITHUB_TOKEN` o claves internas.
- URLs con usuario y contraseña incrustados.
- ConfigMaps que incluyan endpoints privados o material de autenticación.

La dificultad es mantener nombres, relaciones y sangría para que el equipo pueda diagnosticar el problema. Borrar bloques completos produce un archivo limpio, pero también puede ocultar la causa del fallo.

## Sanea antes de compartir

1. Exporta una copia de trabajo del manifiesto, nunca el archivo que usa el clúster.
2. Pega la copia en [ScrubForge](/es/scrubforge/).
3. Revisa la vista previa: las claves y tokens deben convertirse en marcadores consistentes.
4. Comprueba que los nombres de recursos, namespaces, puertos y referencias siguen visibles.
5. Comparte solo el resultado saneado y conserva el original dentro de tu entorno seguro.

ScrubForge procesa el texto localmente en el navegador. Detecta patrones de secretos de servicios y mantiene el mismo token para una misma coincidencia, de modo que puedes explicar una relación sin revelar el valor real.

<div class="key-points">
<h3>Antes de pegar el resultado</h3>
<ul>
<li>Confirma que no queda ningún token válido en comentarios.</li>
<li>Revisa valores codificados en base64 y URLs con credenciales.</li>
<li>Comprueba que el YAML sigue siendo legible para quien lo recibirá.</li>
</ul>
</div>

## Cuándo no basta con sanear

Si una credencial real ya fue publicada, considera que está comprometida: revócala y genera otra. El saneado evita una nueva exposición, pero no sustituye la rotación ni la revisión de permisos del clúster.

## Preguntas frecuentes

### ¿ScrubForge decodifica todos los secretos de Kubernetes?

Detecta patrones sensibles y formatos habituales, pero debes revisar manualmente los campos propios de tu organización.

### ¿Puedo compartir el YAML original si solo contiene base64?

No. Base64 es una codificación reversible y no debe tratarse como protección.

### ¿Se sube el archivo a un servidor?

ScrubForge realiza el saneado localmente. Aun así, revisa el resultado antes de enviarlo a cualquier tercero.
