---
schemaVersion: 1
title: "Cómo Sanitizar una Configuración Arista EOS Antes de Compartirla"
description: "La salida de 'show running-config' en Arista EOS lleva enable secrets, comunidades SNMP, contraseñas de vecino BGP y secretos compartidos de MLAG. Esto es lo que hay que quitar antes de pegarla en un chat de IA o un caso de soporte."
date: 2026-07-30
slug: sanitizar-configuracion-arista
locale: es
translationKey: sanitize-arista-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitizar configuración arista eos"
relatedPages: /scrubforge/,/blog/sanitize-network-config-before-sharing/
---

`show running-config` en un switch Arista EOS produce el mismo tipo de volcado de todo a la vez que la CLI de cualquier otro fabricante: VLANs, port-channels, peering BGP, y cada credencial que el switch guarda quedan en un solo paste. Antes de meter eso en un ticket TAC o en un chat de IA preguntando por un vecino MLAG que da problemas, conviene saber exactamente qué hay ahí.

## Qué contiene realmente una config Arista EOS

- `username admin secret` — una contraseña de usuario local con hash tipo 5 (o más fuerte)
- Cadenas `snmp-server community`, a veces con alcance read-write
- Valores `neighbor ... password` de BGP (basados en MD5, reversibles con las herramientas adecuadas en cifrados antiguos)
- Secretos compartidos `tacacs-server key` y `radius-server host ... key`
- Configuración `peer-address` y `local-interface` de MLAG, a veces junto con un secreto compartido en la configuración de peering
- `enable secret` para acceso EXEC privilegiado

## Antes y después

La misma clave TACACS+ o contraseña de vecino BGP se mapea siempre al mismo token en toda la salida sanitizada, así que las relaciones entre vecinos, VLANs y port-channels se mantienen legibles — solo se reemplaza la credencial literal.

## Pasos

1. Instala ScrubForge desde la Chrome Web Store (gratis)
2. Ejecuta `show running-config` en tu switch Arista
3. Pega la salida en ScrubForge
4. Revisa el resultado sanitizado — secretos, comunidades y contraseñas de vecino quedan tokenizados, la estructura queda intacta
5. Copia y comparte, o continúa en el chat de IA integrado de ScrubForge

## Por qué importa el procesamiento local

Un secreto compartido de MLAG o una clave TACACS+ pegados en un ticket de soporte o en un log de chat compartido se quedan ahí indefinidamente. ScrubForge sanitiza íntegramente dentro de la pestaña del navegador — nada se sube antes de que decidas compartirlo.

## Relacionado

- [Sanitizar una config de red antes de compartirla](/blog/sanitize-network-config-before-sharing/)
- [ScrubForge](/es/scrubforge/)
