---
schemaVersion: 1
title: "Cómo Sanitizar una Configuración Ubiquiti UniFi / EdgeOS Antes de Compartirla"
description: "Un backup del controlador UniFi o un export de 'show configuration' de EdgeOS lleva claves precompartidas de WiFi, contraseñas de admin, secretos RADIUS y claves de VPN site-to-site. Esto es lo que hay que quitar antes de pegarlo en un chat de IA o un foro."
date: 2026-07-30
slug: sanitizar-configuracion-ubiquiti
locale: es
translationKey: sanitize-ubiquiti-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitizar configuración ubiquiti unifi"
relatedPages: /scrubforge/,/blog/sanitize-network-config-before-sharing/
---

Un despliegue Ubiquiti normalmente implica depurar entre dos sistemas que se solapan: el backup del site exportado desde el controlador UniFi o el `config.gateway.json`, y el `show configuration` de EdgeOS en hardware EdgeRouter. Ambos vuelcan topología de red, ajustes de WiFi y credenciales en un solo archivo. Antes de meter eso en un post de foro comunitario o en un chat de IA preguntando por qué una VLAN no enruta, conviene saber exactamente qué hay ahí.

## Qué contiene realmente una config UniFi / EdgeOS

- `x_passphrase` de la red WiFi — la clave precompartida WPA2/WPA3, almacenada en texto plano en los backups de site de UniFi
- Contraseñas de cuenta de admin local (con hash en la base de datos del controlador, a veces presentes en texto plano en paquetes de export de soporte)
- Secretos compartidos `radius profile` usados para autenticación 802.1X o de hotspot
- Valores `pre-shared-key` de VPN site-to-site y de usuario remoto bajo `vpn ipsec` (EdgeOS) o la configuración de VPN de UniFi
- Cadenas de comunidad SNMP bajo `snmp community`
- Secretos de portal de invitados y vales de hotspot, y cualquier clave API de terceros incrustada en integraciones

## Antes y después

La misma frase de paso WiFi o clave precompartida de VPN se mapea siempre al mismo token en toda la salida sanitizada, así que las relaciones entre sites, VLANs y túneles siguen siendo legibles — solo se reemplaza la credencial literal.

## Pasos

1. Instala ScrubForge desde la Chrome Web Store (gratis)
2. Exporta un backup de site UniFi o ejecuta `show configuration` en tu EdgeRouter
3. Pega la sección relevante en ScrubForge
4. Revisa el resultado sanitizado — frases de paso, contraseñas de admin y secretos compartidos quedan tokenizados, la estructura queda intacta
5. Copia y comparte, o continúa en el chat de IA integrado de ScrubForge

## Por qué importa el procesamiento local

Una clave precompartida de WiFi o un secreto de VPN pegados en un hilo de foro público o en un log de chat de IA compartido son efectivamente públicos en el momento en que se publican. ScrubForge sanitiza íntegramente dentro de la pestaña del navegador — nada se sube antes de que decidas compartirlo.

## Relacionado

- [Sanitizar una config de red antes de compartirla](/blog/sanitize-network-config-before-sharing/)
- [ScrubForge](/es/scrubforge/)
