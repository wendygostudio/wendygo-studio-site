---
schemaVersion: 1
title: "Cómo Sanitizar una Configuración Palo Alto PAN-OS Antes de Compartirla"
description: "Un export de 'show config running' o en formato set de PAN-OS lleva hashes de contraseña de admin, claves precompartidas IKE y secretos de bind RADIUS/LDAP. Esto es lo que hay que quitar antes de pegarlo en un chat de IA o un caso de soporte."
date: 2026-07-30
slug: sanitizar-configuracion-paloalto
locale: es
translationKey: sanitize-paloalto-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitizar configuración palo alto pan-os"
relatedPages: /scrubforge/,/blog/sanitize-network-config-before-sharing/
---

Exportar la config de un firewall Palo Alto para un caso de soporte o una sesión de troubleshooting asistida por IA saca de golpe todo lo que hay en la config candidata o en ejecución — estructura de zonas, reglas de seguridad, NAT, y cada secreto que PAN-OS guarda junto a ellas. Antes de que eso salga del equipo, conviene saber exactamente qué contiene.

## Qué contiene realmente una config PAN-OS

- `phash` — el hash de contraseña del administrador local bajo `mgt-config users`
- Valores `pre-shared-key` del IKE Gateway para cada túnel VPN
- Cadenas `snmp-setting` de comunidad SNMP (v1/v2c) o contraseñas de autenticación/privacidad v3
- Secretos de `server-profile` y contraseñas de bind de RADIUS, LDAP y Kerberos usados para autenticación de admin/GlobalProtect
- Secretos precompartidos del portal y gateway GlobalProtect y frases de paso de certificados
- Claves API incrustadas en scripts de automatización pegados junto a la config

## Antes y después

La misma clave precompartida o contraseña de bind se mapea siempre al mismo token en toda la salida sanitizada, así que las relaciones entre túneles VPN, zonas y perfiles de autenticación siguen siendo legibles — solo se reemplaza el secreto literal.

## Pasos

1. Instala ScrubForge desde la Chrome Web Store (gratis)
2. Exporta con `show config running` (o el equivalente en formato `set`) desde la CLI de PAN-OS o Panorama
3. Pega la salida en ScrubForge
4. Revisa el resultado sanitizado — hashes de contraseña, claves precompartidas y secretos de bind quedan tokenizados, la estructura queda intacta
5. Copia y comparte, o continúa en el chat de IA integrado de ScrubForge

## Por qué importa el procesamiento local

Una clave precompartida IKE o un hash de contraseña de admin pegados en un ticket de soporte o en un log de chat de IA compartido se quedan ahí indefinidamente, fuera de tu control. ScrubForge sanitiza íntegramente dentro de la pestaña del navegador — nada se sube antes de que decidas compartirlo.

## Relacionado

- [Sanitizar una config de red antes de compartirla](/blog/sanitize-network-config-before-sharing/)
- [ScrubForge](/es/scrubforge/)
