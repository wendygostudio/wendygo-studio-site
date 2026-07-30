---
schemaVersion: 1
title: "Cómo Sanitizar una Configuración Check Point Antes de Compartirla"
description: "Un export de config Check Point Gaia/SmartConsole lleva hashes de contraseña de admin, claves de activación SIC, secretos precompartidos de VPN y secretos compartidos RADIUS/TACACS. Esto es lo que hay que quitar antes de pegarlo en un chat de IA o un caso TAC."
date: 2026-07-30
slug: sanitizar-configuracion-checkpoint
locale: es
translationKey: sanitize-checkpoint-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitizar configuración check point"
relatedPages: /scrubforge/,/blog/sanitize-network-config-before-sharing/
---

Un export de configuración Check Point — ya sea un volcado de `show configuration` en Gaia, una salida de `cpconfig`, o una política exportada desde SmartConsole — mezcla objetos de red, reglas de seguridad, y cada credencial que el gateway o el servidor de gestión guardan en un solo archivo. Antes de meter eso en un caso TAC o en un chat de IA preguntando por qué un túnel VPN no levanta, conviene saber exactamente qué hay ahí.

## Qué contiene realmente una config Check Point

- Valores `password-hash` de admin de Gaia para cuentas locales
- Contraseñas de un solo uso y claves de activación SIC (Secure Internal Communication) usadas para emparejar gateways con el servidor de gestión
- Valores `pre-shared-secret` de comunidad VPN para túneles site-to-site y de acceso remoto
- Cadenas de comunidad SNMP bajo `set snmp community`
- Secretos compartidos de RADIUS y TACACS+ configurados para autenticación de admin o usuario
- Claves API y tokens usados por scripts de SmartConsole o de la Management API R8x pegados junto a la config

## Antes y después

El mismo secreto precompartido o clave SIC se mapea siempre al mismo token en toda la salida sanitizada, así que las relaciones entre gateways, comunidades VPN y objetos siguen siendo legibles — solo se reemplaza la credencial literal.

## Pasos

1. Instala ScrubForge desde la Chrome Web Store (gratis)
2. Exporta tu config vía la CLI de Gaia, `cpconfig`, o un export de política desde SmartConsole
3. Pega la salida en ScrubForge
4. Revisa el resultado sanitizado — hashes de contraseña, claves SIC y secretos precompartidos quedan tokenizados, la estructura queda intacta
5. Copia y comparte, o continúa en el chat de IA integrado de ScrubForge

## Por qué importa el procesamiento local

Una clave de activación SIC o un secreto precompartido de VPN pegados en un caso TAC o en un log de chat compartido se quedan ahí indefinidamente, fuera de tu control. ScrubForge sanitiza íntegramente dentro de la pestaña del navegador — nada se sube antes de que decidas compartirlo.

## Relacionado

- [Sanitizar una config de red antes de compartirla](/blog/sanitize-network-config-before-sharing/)
- [ScrubForge](/es/scrubforge/)
