---
schemaVersion: 1
title: Cómo compartir la configuración de red con tickets de soporte de forma segura
description: >-
  Cuando su enrutador Cisco deja de funcionar o su firewall FortiGate comienza a
  perder tráfico, la primera llamada es al soporte del proveedor. Te pedirán
  tu...
date: 2026-07-01T00:00:00.000Z
slug: share-network-config-support-ticket-safely
locale: es
translationKey: share-network-config-support-ticket
product: scrubforge
contentType: how-to
primaryKeyword: compartir ticket de soporte de configuración de red
relatedPages: '/es/scrubforge/,/es/blog/scrubforge-chatgpt-network-troubleshooting/'
---

Cuando su enrutador Cisco deja de funcionar o su firewall FortiGate comienza a perder tráfico, la primera llamada es al soporte del proveedor. Le pedirán su configuración en ejecución. Es la forma más rápida de diagnosticar el problema. El problema: su configuración contiene credenciales activas que no deberían abandonar su red.

ScrubForge resuelve exactamente esto: desinfecta localmente y luego adjunta la versión limpia a tu ticket de soporte.

## Por qué las configuraciones sin formato en los tickets de soporte son un riesgo

Cuando envía un archivo de configuración por correo electrónico o lo adjunta a un caso de Cisco TAC, un ticket de Jira o un portal de soporte de proveedores, ese archivo ingresa a un sistema que no controla por completo. Según las prácticas de seguridad del proveedor, sus credenciales pueden ser:

- Iniciar sesión en las bases de datos del sistema de soporte
- Accesible para el personal de apoyo.
- Retenido más tiempo del esperado
- Compartido entre equipos internos para depuración

Nada de esto es inusual. La mayoría de los sistemas de soporte empresarial son razonablemente seguros. Pero una configuración de firewall de producción que contiene claves VPN activas y contraseñas de administrador no necesita estar en una base de datos de soporte en absoluto. El proveedor no necesita sus credenciales para solucionar problemas de configuración: necesita la estructura.

## El flujo de trabajo de tickets de soporte de ScrubForge +

1. **Exporte su configuración** — En Cisco IOS: `show running-config`. En FortiGate: Sistema > Configuración > Descargar.
2. **Abre ScrubForge**: haz clic en el icono de la barra de herramientas de Chrome.
3. **Pegar y desinfectar**: pegue la configuración sin formato. ScrubForge reemplaza contraseñas, claves, tokens y cadenas SNMP con marcadores de posición consistentes como `[PSK_1]` o `[ADMIN_PASS_1]`.
4. **Revisar**: escanee el resultado en busca de cualquier cosa que parezca credenciales activas. Una verificación de 30 segundos es una buena práctica.
5. **Adjuntar al ticket**: copie el resultado desinfectado en su ticket de soporte o correo electrónico, o guárdelo como un archivo `.txt` y cárguelo.

## Qué incluir en su ticket de soporte

Al adjuntar una configuración desinfectada, agregue una nota de una línea:

> "Configuración adjunta. Las credenciales han sido desinfectadas (reemplazadas con tokens de marcador de posición consistentes; la estructura y la lógica están intactas)".

Esto le indica al ingeniero de soporte lo que está viendo y por qué no verá los valores activos.

La mayoría de los ingenieros de soporte lo entenderán de inmediato. Saben que la estructura es lo que importa para la resolución de problemas: protocolos de enrutamiento, IP de pares VPN, políticas de firewall, configuraciones de interfaz. Ninguna de esas son credenciales.

## Antes y después

```
--- ANTES (crudo) ---
clave cripto isakmp T@nn3lS3cr3t dirección 198.51.100.10
nombre de usuario contraseña de administrador cisco123
RO público de la comunidad del servidor SNMP

--- DESPUÉS (desinfectado) ---
clave isakmp criptográfica [PSK_1] dirección 198.51.100.10
nombre de usuario contraseña de administrador [ADMIN_PASS_1]
comunidad de servidor snmp [SNMP_RO_1] RO
```

La IP del par, los nombres de las interfaces y las políticas permanecen. Las credenciales no.

## Esto funciona con cualquier proveedor

Ya sea Cisco, FortiGate, Palo Alto, Juniper o pfSense, el principio es el mismo: desinfectar las configuraciones basadas en texto antes de compartirlas. ScrubForge detecta patrones de credenciales comunes en cualquier formato basado en texto.

---

### Preguntas frecuentes

**P: ¿El ingeniero de soporte aún puede solucionar el problema si se reemplazan las credenciales?**
R: Sí. Los ingenieros de soporte solucionan problemas de lógica de configuración: enrutamiento, configuración de VPN, políticas de firewall. Nada de eso depende de ver el valor real de la credencial. La configuración desinfectada les brinda todo lo que necesitan.

**P: ¿Qué pasa si el sistema de tickets de soporte almacena archivos indefinidamente?**
R: El beneficio de desinfectar antes de cargar es que incluso si el ticket nunca se elimina o se accede a él más tarde, no contiene credenciales activas. Has roto el vínculo entre tu red en ejecución y la base de datos de soporte.

**P: ¿ScrufoForge afecta las direcciones IP de la red?**
R: No. De forma predeterminada, ScrubForge reemplaza los patrones de credenciales (contraseñas, claves, tokens, cadenas SNMP), no las direcciones IP. La topología de su red, las IP de sus pares y las subredes permanecen intactas, que es exactamente lo que los ingenieros de soporte necesitan ver.

---

### Instalar ScrubForge

Desinfección local gratuita para cualquier configuración basada en texto. Pegue, elimine las credenciales y luego compártalas de forma segura con el soporte del proveedor, foros o cualquier sistema externo: sin cuenta, sin carga, sin servidores de terceros.

<a href="https://chromewebstore.google.com/detail/pjaohhipefhjfopoaepjbmiienagaffe">Install ScrubForge on Chrome →</a>

**Relacionado:** [Cómo utilizar ScrubForge con ChatGPT para solucionar problemas de red](/blog/scrubforge-chatgpt-network-troubleshooting/)
