---
schemaVersion: 1
title: "Cómo Sanitizar una Configuración Huawei VRP Antes de Compartirla"
description: "La salida de 'display current-configuration' en Huawei VRP lleva hashes de contraseña irreversible-cipher, comunidades SNMP y claves de autenticación MD5 de OSPF/BGP. Esto es lo que hay que quitar antes de pegarla en un chat de IA o un caso de soporte."
date: 2026-07-30
slug: sanitizar-configuracion-huawei
locale: es
translationKey: sanitize-huawei-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitizar configuración huawei vrp"
relatedPages: /scrubforge/,/blog/sanitize-network-config-before-sharing/
---

`display current-configuration` en un equipo Huawei VRP (routers y switches que corren la misma familia de OS) vuelca interfaces, protocolos de enrutamiento, y cada credencial guardada en un único bloque continuo. Antes de meter eso en un caso de soporte o en un chat de IA preguntando por un vecino OSPF atascado en EXSTART, conviene saber exactamente qué hay ahí.

## Qué contiene realmente una config Huawei VRP

- `local-user ... password irreversible-cipher` — contraseñas de cuenta local con hash
- `super password` — la contraseña de modo privilegiado, almacenada como cadena cifrada
- Cadenas `snmp-agent community`, de lectura o lectura-escritura
- Claves `authentication-mode md5` de OSPF y BGP, además de contraseñas de autenticación IS-IS
- Valores `radius-server shared-key` y `hwtacacs-server shared-key`
- Cadenas `pre-shared-key` de IPsec/IKE para túneles site-to-site

## Antes y después

La misma clave compartida o comunidad SNMP se mapea siempre al mismo token en toda la salida sanitizada, así que las relaciones entre vecinos, VLANs y perfiles de autenticación siguen siendo legibles — solo se reemplaza la credencial literal.

## Pasos

1. Instala ScrubForge desde la Chrome Web Store (gratis)
2. Ejecuta `display current-configuration` en tu equipo Huawei
3. Pega la salida en ScrubForge
4. Revisa el resultado sanitizado — contraseñas cifradas, comunidades y claves de autenticación quedan tokenizadas, la estructura queda intacta
5. Copia y comparte, o continúa en el chat de IA integrado de ScrubForge

## Por qué importa el procesamiento local

Un hash `irreversible-cipher` o una clave MD5 de OSPF pegados en un ticket de soporte o en un log de chat compartido se quedan ahí indefinidamente. ScrubForge sanitiza íntegramente dentro de la pestaña del navegador — nada se sube antes de que decidas compartirlo.

## Relacionado

- [Sanitizar una config de red antes de compartirla](/blog/sanitize-network-config-before-sharing/)
- [ScrubForge](/es/scrubforge/)
