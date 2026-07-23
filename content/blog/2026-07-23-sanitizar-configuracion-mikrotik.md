---
schemaVersion: 1
title: "Sanitiza una config MikroTik RouterOS antes de compartir"
description: "RouterOS oculta contraseñas al exportar, pero topología, comentarios e IPs quedan visibles. Esto es lo que revisar antes de compartir."
date: 2026-07-23
slug: sanitizar-configuracion-mikrotik
locale: es
translationKey: sanitize-mikrotik-router-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanitizar configuración MikroTik antes de compartir"
relatedPages: /es/scrubforge/,/es/blog/compartir-config-red-ticket-soporte/,/es/blog/sanitizar-config-fortigate/
sourceUrls: https://help.mikrotik.com/docs/spaces/ROS/pages/380076066/List+of+menus+with+sensitive+parameters,https://help.mikrotik.com/docs/spaces/ROS/pages/328155/Configuration+Management,https://mikrotik.com/download/changelogs
alternateUrl: https://wendygostudio.com/blog/sanitize-mikrotik-router-config/
heading: "Sanitiza una configuración de MikroTik RouterOS antes de compartirla"
shortTitle: "Sanitizar config MikroTik"
intro: "RouterOS oculta las contraseñas en /export por defecto. Eso deja fuera la topología, los comentarios y las direcciones de servidor que sí quedan en el archivo que pegas en un foro, un ticket o un chat de IA."
faqs:
  - question: "¿show-sensitive sustituye la necesidad de sanitizar una config de MikroTik?"
    answer: "No. show-sensitive solo controla si RouterOS muestra su propia lista predefinida de campos sensibles: contraseñas, claves, secretos. Todo lo demás en la exportación, incluidas las IPs, los comentarios y las direcciones de servidor, sigue visible en cualquier caso. Para eso está ScrubForge."
  - question: "¿Sanitizar rompe la config si necesito reimportarla?"
    answer: "Sanitiza solo la copia destinada a un foro, un ticket de soporte o una discusión pública, no el archivo que planeas reimportar. Reimportar un script necesita los valores reales de las credenciales, así que mantén tu exportación de trabajo separada de la que compartes."
  - question: "¿ScrubForge reconoce específicamente la sintaxis de RouterOS?"
    answer: "Sí. RouterOS es una de las doce sintaxis de configuración de red que cubre la librería de patrones de ScrubForge, junto a Cisco, FortiGate, Juniper y Palo Alto, entre otros."
  - question: "¿Qué hago si ya publiqué una config de MikroTik sin sanitizar?"
    answer: "Edita o borra la publicación si la plataforma lo permite, y después rota cualquier credencial expuesta: contraseñas, claves precompartidas, secretos RADIUS. Sustituir los valores después no deshace lo que ya estuvo visible mientras la publicación estaba activa."
---

Publicar una config de router en un foro o en un ticket de soporte es trabajo habitual para cualquier sysadmin, y los administradores de MikroTik lo hicieron mucho este mes: RouterOS 7.21.5 (long-term) y 6.49.20 se publicaron el 6 de julio de 2026, y actualizar suele implicar sacar un `/export` nuevo para comparar con la configuración anterior.

> **Lo que show-sensitive oculta realmente**
> Por defecto, `/export` enmascara contraseñas, claves y secretos en una lista documentada de menús: claves WireGuard, secretos RADIUS, contraseñas PPP, contraseñas de comunidad SNMP y unos cuarenta campos más. No toca direcciones IP, comentarios, ni nada fuera de esa lista.

## Lo que RouterOS ya oculta por ti

La propia documentación de MikroTik es concreta al respecto: el comando `export` "no exporta contraseñas de usuarios del sistema, certificados instalados, claves SSH, Dude ni la base de datos de User-manager", y todo lo demás considerado sensible se enmascara salvo que añadas `show-sensitive` al comando. Existe una tabla de referencia oficial que indica exactamente qué menú y qué campo se oculta: la [lista de menús con parámetros sensibles](https://help.mikrotik.com/docs/spaces/ROS/pages/380076066/List+of+menus+with+sensitive+parameters) incluye `private-key` y `preshared-key` de WireGuard, `secret` de RADIUS, `authentication-password` de SNMP, `secret` de PPP, claves IPsec, `password` de VRRP y más.

Es un comportamiento por defecto genuinamente útil. También es fácil interpretarlo como "la exportación ya se puede pegar en cualquier sitio", lo cual no es del todo cierto.

## Lo que sigue en una exportación "limpia"

Enmascarar una lista fija de nombres de parámetro no toca el texto libre ni nada fuera de esa lista. Un `/export` por defecto sigue incluyendo:

<div class="key-points">
  <h3>Sigue totalmente visible después del enmascarado de show-sensitive</h3>
  <ul>
    <li>cada dirección IP configurada, subred y extremo de peer WAN;</li>
    <li>comentarios de interfaces y VLAN, que a menudo nombran sistemas internos o clientes;</li>
    <li>direcciones de servidor RADIUS, NTP, DNS y SNMP —la dirección, no solo el secreto—;</li>
    <li>nombres de comunidad SNMP, cuando son cadenas descriptivas y no contraseñas;</li>
    <li>identidad del sistema, peers de enrutamiento y listas de direcciones del firewall.</li>
  </ul>
</div>

Nada de esto es un fallo. La propia [guía de gestión de configuración de MikroTik](https://help.mikrotik.com/docs/spaces/ROS/pages/328155/Configuration+Management) muestra subredes internas con aspecto real en sus propios ejemplos de exportación, porque la topología es exactamente lo que necesita una importación para funcionar. Simplemente no es algo que quieras que vea un desconocido en un foro, o una cola de soporte externa, junto a tu IP pública.

## Sanitiza antes de que show-sensitive importe

<div class="step-card">
  <span class="step-label">Flujo de trabajo</span>
  <strong>Exportar, pegar, revisar, compartir</strong>
  <p>Ejecuta <code>/export file=config</code> como siempre —sin <code>show-sensitive</code>, no lo necesitas para un ticket de soporte o una publicación en un foro—. Abre [ScrubForge](/es/scrubforge/), pega la salida, y detecta cadenas con forma de credencial que coinciden con la sintaxis de RouterOS, sustituyendo cada valor único por un token consistente como <code>[RADIUS_SECRET_1]</code>. Todo ocurre localmente en la pestaña del navegador; nada se sube a ningún sitio.</p>
</div>

| Antes (exportación en bruto) | Después (sanitizado) |
|---|---|
| `set 0 password=Adm1nR0S!` | `set 0 password=[PASSWORD_1]` |
| `secret="Sup3rShared" address=10.20.0.1` | `secret=[RADIUS_SECRET_1] address=10.20.0.1` |
| `private-key="wG9K...=="` | `private-key=[WG_KEY_1]` |

Fíjate en que la dirección del peer permanece. Eso es lo que un lector del foro o un ingeniero de soporte realmente necesita para ayudarte, no el secreto que está justo al lado.

## La misma costumbre funciona con cualquier fabricante

Ya hemos cubierto este flujo antes para [configs de Cisco y FortiGate](/es/blog/sanitizar-config-fortigate/). MikroTik es una de las doce sintaxis de fabricante que reconoce ScrubForge, junto a Juniper y Palo Alto: la misma idea, con nombres de campo distintos cada vez. Si vas a pegar en un [ticket de soporte](/es/blog/compartir-config-red-ticket-soporte/) en lugar de un foro público, aplica la misma costumbre de sanitizar primero antes de que el archivo salga de tu máquina.

## Antes de publicar

Una nota de una línea junto a la exportación sanitizada ayuda: "credenciales sustituidas por tokens; la estructura está intacta". Le dice a quien lea el hilo que no hay una contraseña viva ahí dentro, y añadirla lleva diez segundos.

## Preguntas frecuentes

### ¿show-sensitive sustituye la necesidad de sanitizar una config de MikroTik?

No. show-sensitive solo controla si RouterOS muestra su propia lista predefinida de campos sensibles: contraseñas, claves, secretos. Todo lo demás en la exportación, incluidas las IPs, los comentarios y las direcciones de servidor, sigue visible en cualquier caso. Para eso está ScrubForge.

### ¿Sanitizar rompe la config si necesito reimportarla?

Sanitiza solo la copia destinada a un foro, un ticket de soporte o una discusión pública, no el archivo que planeas reimportar. Reimportar un script necesita los valores reales de las credenciales, así que mantén tu exportación de trabajo separada de la que compartes.

### ¿ScrubForge reconoce específicamente la sintaxis de RouterOS?

Sí. RouterOS es una de las doce sintaxis de configuración de red que cubre la librería de patrones de ScrubForge, junto a Cisco, FortiGate, Juniper y Palo Alto, entre otros.

### ¿Qué hago si ya publiqué una config de MikroTik sin sanitizar?

Edita o borra la publicación si la plataforma lo permite, y después rota cualquier credencial expuesta: contraseñas, claves precompartidas, secretos RADIUS. Sustituir los valores después no deshace lo que ya estuvo visible mientras la publicación estaba activa.
