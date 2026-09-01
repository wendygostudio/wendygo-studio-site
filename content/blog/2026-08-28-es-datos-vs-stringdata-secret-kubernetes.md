---
schemaVersion: 1
title: "data frente a stringData en un Secret de Kubernetes: cuándo se necesita Base64"
description: "Aprende cuándo un Secret de Kubernetes necesita Base64 en data, cuándo stringData es más sencillo y cómo trabajar localmente sin confundir codificación con cifrado."
date: 2026-08-28
slug: datos-vs-stringdata-secret-kubernetes
locale: es
translationKey: kubernetes-secret-data-vs-stringdata
product: textforge
contentType: how-to
primaryKeyword: "data frente a stringData Secret Kubernetes"
relatedPages: /es/textforge/,/es/scrubforge/,/es/blog/base64-encode-kubernetes-secrets/,/es/blog/eliminar-secretos-config-kubernetes/
sourceUrls: https://kubernetes.io/docs/concepts/configuration/secret/,https://kubernetes.io/docs/concepts/security/secrets-good-practices/
faqs:
  - question: "¿Los valores de data de un Secret de Kubernetes necesitan Base64?"
    answer: "Sí. Los valores de data se serializan como cadenas Base64. stringData acepta texto normal y el servidor de la API lo codifica al crear o actualizar el Secret."
  - question: "¿Debo usar data o stringData en un manifiesto?"
    answer: "Usa stringData al escribir un Secret desde texto literal si tu flujo de despliegue lo admite. Usa data cuando necesites la representación serializada o tu herramienta requiera valores ya codificados."
  - question: "¿Base64 protege un Secret de Kubernetes?"
    answer: "No. Base64 es codificación reversible, no cifrado. Protege el manifiesto y el acceso al clúster, y sigue las recomendaciones de Kubernetes."
---

# data frente a stringData en un Secret de Kubernetes: cuándo se necesita Base64

Los campos `data` y `stringData` de un Secret de Kubernetes representan los mismos valores lógicos, pero son interfaces de escritura distintas. `data` espera cadenas codificadas en Base64. `stringData` acepta texto normal y deja que el servidor de la API de Kubernetes lo codifique.

La diferencia importa al escribir un manifiesto, revisar uno existente o decidir si necesitas una herramienta local de Base64. Ninguno de los dos campos es un límite de seguridad: Base64 es codificación, no cifrado.

## La diferencia práctica

Usa `data` cuando el valor ya esté serializado para la API de Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: credenciales-app
type: Opaque
data:
  username: YWRtaW4=
  password: c2FtcGxlLXBhc3M=
```

Usa `stringData` al escribir valores literales y dejar que Kubernetes codifique el contenido durante la operación con la API:

```yaml
stringData:
  username: admin
  password: sample-pass
```

La [documentación de Secrets de Kubernetes](https://kubernetes.io/docs/concepts/configuration/secret/) describe `stringData` como una forma cómoda de proporcionar valores sin codificar. También advierte que `stringData` no funciona bien con server-side apply, así que comprueba tu método de despliegue antes de adoptarlo.

## Qué campo elegir

`stringData` suele ser la opción más legible para un manifiesto escrito a mano y aplicado por un flujo compatible. Mantiene el origen comprensible y evita copiar manualmente el resultado codificado.

`data` resulta útil cuando:

- otro sistema ya genera la forma serializada del Secret;
- inspeccionas o editas un manifiesto existente que usa `data`;
- tus herramientas esperan valores codificados;
- necesitas conservar bytes en lugar de asumir una representación textual.

No guardes credenciales reales en un repositorio solo porque estén bajo `data`. Cualquiera que pueda leer el manifiesto puede decodificarlas. Kubernetes trata el acceso y la distribución del Secret como asuntos de seguridad separados de su representación YAML.

## Codificar o decodificar localmente

Si un manifiesto contiene un valor bajo `data`, puedes decodificar una copia local para saber qué representa. Si necesitas crear un valor para `data`, codifica localmente el valor original y pega solo el resultado en el manifiesto de trabajo.

TextForge puede codificar o decodificar texto en el navegador sin enviarlo a un servidor de Wendygo. Usa una copia de trabajo, revisa el resultado y conserva la credencial original en su entorno seguro. Si vas a compartir el manifiesto, [ScrubForge](https://wendygostudio.com/es/scrubforge/) es más adecuado: sanea primero la copia, en lugar de limitarte a codificar el secreto.

## Lista breve de decisión

1. ¿Escribes un Secret nuevo desde texto literal? Considera `stringData` después de comprobar tu método de aplicación.
2. ¿Editas un campo `data` existente? Decodifica solo una copia local cuando haga falta inspeccionarlo.
3. ¿Tu pipeline exige `data`? Codifica localmente y valida el YAML resultante.
4. ¿El manifiesto saldrá de tu entorno seguro? Elimina o sustituye las credenciales antes de compartirlo.
5. ¿Una credencial ya pudo quedar expuesta? Rótala; codificar o sanear no deshace la exposición.

Consulta la [guía de seguridad de Secrets de Kubernetes](https://kubernetes.io/docs/concepts/security/secrets-good-practices/) junto con la política de acceso y gestión de secretos de tu clúster.

## Preguntas frecuentes

### ¿Los valores de `data` necesitan Base64?

Sí. Los valores de `data` se serializan como cadenas Base64. `stringData` acepta texto normal y Kubernetes lo codifica al crear o actualizar.

### ¿Debo usar `data` o `stringData`?

Usa `stringData` para texto literal cuando tu flujo lo admita. Usa `data` cuando tus herramientas requieran la representación serializada o trabajes con un manifiesto codificado existente.

### ¿Base64 protege un Secret?

No. Es codificación reversible, no cifrado. Protege el manifiesto, el acceso al clúster y el repositorio.
