---
schemaVersion: 1
title: "Lo Que Enseña la Brecha de SonicWall al Compartir Configs"
description: "Los backups en la nube de SonicWall filtraron datos de config de todos sus clientes. Si ese backup no era seguro, tampoco lo es un ticket."
date: 2026-07-25
slug: lo-que-ensena-la-brecha-de-backups-sonicwall-sobre-compartir-configs
locale: es
translationKey: what-the-sonicwall-backup-breach-teaches-about-config-sharing
product: scrubforge
contentType: use-case
primaryKeyword: "es seguro compartir un backup de configuración de firewall"
relatedPages: /scrubforge/
---

El backup de un fabricante se supone que es el lugar seguro para tu configuración. En septiembre de 2025, SonicWall confirmó que eso no era cierto para sus clientes de backup en la nube, y los detalles merecen leerse aunque no uses un firewall SonicWall.

> **Lo que confirmó SonicWall**
> Un atacante lanzó ataques de fuerza bruta contra el portal de clientes MySonicWall.com y obtuvo acceso a archivos de backup de configuración de firewall. El [aviso propio de SonicWall](https://www.sonicwall.com/support/knowledge-base/mysonicwall-cloud-backup-file-incident/250915160910330), realizado junto con la firma de respuesta a incidentes Mandiant, primero estimó que menos del 5% de los clientes con backup en la nube estaban afectados, y en su actualización final confirmó que **todos** los clientes que habían usado la función de backup en la nube resultaron afectados. [CISA emitió su propio aviso](https://www.cisa.gov/news-events/alerts/2025/09/22/sonicwall-releases-advisory-customers-after-security-incident) instando a todos los clientes de SonicWall a revisar su cuenta.

## Qué contenían realmente los archivos expuestos

Esta es la parte que importa más allá de los clientes concretos de SonicWall. Un export de configuración de firewall (un archivo `.EXP`) es una instantánea completa del dispositivo: no solo contraseñas, también topología, rangos de IP, reglas y detalles de integración.

<div class="key-points">
  <h3>Qué está protegido y qué no</h3>
  <ul>
    <li><strong>Las credenciales y secretos</strong> están cifrados individualmente, AES-256 en firewalls Gen 7 o superior, el más antiguo 3DES en Gen 6.</li>
    <li><strong>El resto del archivo</strong>, distribución de red, conjuntos de reglas, direccionamiento, solo está codificado, no cifrado, así que es legible tras una simple decodificación.</li>
    <li><strong>El propósito completo del archivo</strong> es restaurar un dispositivo a su estado exacto capturado, precisamente por lo que es peligroso fuera de un canal de confianza: está diseñado para contener todo lo necesario para reconstruir tu configuración.</li>
  </ul>
</div>

El aviso de SonicWall es explícito: incluso con las credenciales cifradas, "la posesión de estos archivos podría aumentar el riesgo de ataques dirigidos" por todo lo demás que el archivo revela sobre cómo está construida la red.

## Por qué esto aplica a más de un fabricante

<div class="step-card">
  <span class="step-label">Caso de uso</span>
  <strong>El archivo de backup y el ticket de soporte tienen el mismo problema</strong>
  <p>Ya sea que una config salga de tu control por un portal del fabricante vulnerado, una publicación pegada en un foro, una ventana de chat de IA o un adjunto de correo a soporte, el riesgo es el mismo: el archivo se construyó para contener todo lo necesario para describir o reconstruir tu red, y la mayor parte de ese detalle nunca debió exponerse fuera de un canal de confianza. El incidente de SonicWall recuerda que incluso el canal "oficial", avalado por el fabricante, puede fallar. Un ticket de soporte o un chat de IA no tienen ni el cifrado que un backup en la nube al menos intenta aplicar.</p>
</div>

| Qué contiene un export de configuración sin tratar | Qué se necesita realmente para depurar o restaurar |
|---|---|
| Todas las reglas del firewall, completas | Una o dos reglas relevantes para el problema |
| Rangos de IP internos y topología completos | Suficiente estructura para explicar el problema, no el mapa entero |
| Hostnames, direcciones de servidor, endpoints de integración | Marcadores redactados que preservan la lógica |
| Cualquier credencial o clave incrustada, aunque esté cifrada | Nada, las credenciales nunca deben ir en un archivo compartido |

## Antes de compartir una config en cualquier sitio

Si vas a [compartir una config de red con un equipo de soporte](/es/blog/compartir-config-red-ticket-soporte/), el incidente de SonicWall es un buen argumento para [sanitizarla primero](/es/blog/sanitizar-configuracion-red-antes-compartir/), sin importar el portal del fabricante, el asistente de IA o el foro donde la publiques. [ScrubForge](/es/scrubforge/) elimina exactamente el detalle que filtra un archivo de backup: credenciales, rangos de IP, hostnames y topología, manteniendo la estructura de la config lo bastante intacta como para obtener ayuda de verdad.

Si usas la función de backup en la nube de MySonicWall, revisa tu cuenta directamente en lugar de confiar solo en este artículo: el aviso de SonicWall tiene los pasos exactos, y el apartado Product Management > Issue List de tu cuenta MySonicWall mostrará si alguno de tus números de serie fue marcado.

## Preguntas frecuentes

### ¿Qué pasó exactamente en el incidente de backups de SonicWall?

Un atacante usó técnicas de fuerza bruta contra el portal de clientes MySonicWall.com y accedió a archivos de backup de configuración (.EXP). La investigación de SonicWall, realizada con Mandiant, primero estimó que menos del 5% de los clientes con backup en la nube estaban afectados, y en su actualización final confirmó que todos los clientes que habían usado la función de backup en la nube resultaron afectados.

### ¿Estaban cifrados los archivos de backup expuestos?

Parcialmente. Las credenciales y secretos dentro del archivo .EXP están cifrados individualmente, AES-256 en firewalls Gen 7 y posteriores, 3DES en Gen 6, pero el resto de la configuración solo está codificado, no cifrado, así que la topología, reglas, rangos de IP y otros detalles son legibles tras decodificarlos. La propia SonicWall recomienda tratar cualquier archivo expuesto como motivo para resetear credenciales.

### ¿Significa esto que los backups en la nube del fabricante no son seguros?

No, el aviso de SonicWall trata sobre un portal vulnerado por fuerza bruta, no un fallo en el concepto de backup. La lección es más concreta: un export de configuración contiene más detalle utilizable del que la mayoría asume, así que dondequiera que ese archivo o su contenido viaje, un backup en la nube del fabricante, un ticket de soporte, un chat de IA, merece el mismo escrutinio.

### ¿Qué debería revisar en mi propio firewall tras leer esto?

Si usas la función de backup en la nube de MySonicWall, inicia sesión y revisa Product Management > Issue List para ver números de serie afectados, y sigue la guía de reseteo esencial de credenciales de SonicWall. Por separado, sanitiza cualquier archivo de configuración antes de pegarlo en cualquier otro sitio, un ticket de soporte, un foro o un asistente de IA.
