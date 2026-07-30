---
schemaVersion: 1
title: "Cómo Sanitizar una Configuración Juniper JunOS Antes de Compartirla"
description: "La salida de 'show configuration' en JunOS lleva hashes de root-authentication, comunidades SNMP y claves de autenticación BGP/OSPF. Esto es lo que hay que quitar antes de pegarla en un chat de IA o un ticket."
date: 2026-07-30
slug: sanitizar-configuracion-juniper
locale: es
translationKey: sanitize-juniper-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitizar configuración juniper junos"
relatedPages: /scrubforge/,/blog/sanitize-network-config-before-sharing/
---

`show configuration` en un equipo Juniper es un volcado plano de todo el dispositivo: interfaces, política de enrutamiento, filtros de firewall, y cada credencial que el equipo guarda, todo en el mismo paste. Antes de meter eso en un ticket TAC o en un chat de IA preguntando "por qué esta adyacencia OSPF está atascada", conviene saber exactamente qué hay ahí dentro.

## Qué contiene realmente una config JunOS

- `root-authentication encrypted-password` — un hash Juniper con prefijo `$9$` para la cuenta root
- Cadenas `snmp community`, a menudo con `authorization read-write`
- `authentication-key` de BGP y OSPF/IS-IS (MD5, a veces en texto plano en configs antiguas)
- Claves precompartidas de IPsec `ike proposal` bajo `security ike policy ... pre-shared-key`
- Valores `secret` de RADIUS y TACACS+ bajo `system radius-server` / `system tacplus-server`
- Hashes `authentication encrypted-password` de usuario local para cada cuenta configurada

## Antes y después

La misma comunidad SNMP o secreto compartido se mapea siempre al mismo token en toda la salida sanitizada, así que las relaciones entre interfaces, políticas y vecinos se mantienen intactas — solo se reemplaza la credencial literal.

## Pasos

1. Instala ScrubForge desde la Chrome Web Store (gratis)
2. Ejecuta `show configuration | display set` o la forma jerárquica plana en tu equipo Juniper
3. Pega la salida en ScrubForge
4. Revisa el resultado sanitizado — hashes, claves y comunidades quedan tokenizados, la estructura queda intacta
5. Copia y comparte, o continúa en el chat de IA integrado de ScrubForge

## Por qué importa el procesamiento local

Un hash root `$9$` o una clave MD5 de BGP pegados en un ticket TAC o en un log de chat compartido se quedan ahí indefinidamente. ScrubForge sanitiza íntegramente dentro de la pestaña del navegador — nada se sube antes de que decidas compartirlo.

## Relacionado

- [Sanitizar una config de red antes de compartirla](/blog/sanitize-network-config-before-sharing/)
- [ScrubForge](/es/scrubforge/)
