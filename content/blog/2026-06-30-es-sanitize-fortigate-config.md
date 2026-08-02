---
schemaVersion: 1
title: Cómo compartir de forma segura una configuración de firewall FortiGate
description: >-
  Una configuración en ejecución de FortiGate contiene mucho más que reglas de
  firewall. Contiene túneles VPN, bloques de IP de interfaz, credenciales de
  administrador, inspección HTTPS...
date: 2026-06-30T00:00:00.000Z
slug: sanitize-fortigate-config
locale: es
translationKey: sanitize-fortigate-config
product: scrubforge
contentType: how-to
primaryKeyword: cómo compartir de forma segura una configuración de firewall fortigate
relatedPages: '/scrubforge/,/blog/remove-SENSITIVE-Data-cisco-config/'
---

# Cómo compartir de forma segura una configuración de firewall FortiGate

Una configuración en ejecución de FortiGate contiene mucho más que reglas de firewall. Contiene túneles VPN, bloques de IP de interfaz, credenciales de administrador, certificados de inspección HTTPS y tokens API, todo ello en riesgo cuando la configuración se comparte sin formato con el soporte.

## Lo que realmente contiene una configuración de FortiGate

Cuando ejecuta `show` o exporta una configuración completa desde FortiGate, obtiene:

- **Contraseñas de administrador y usuario**: datos cifrados, pero aún confidenciales en el archivo
- **Claves y certificados precompartidos del túnel VPN**: credenciales activas
- **Tokens API**: utilizados para automatización e integraciones de terceros
- **Certificados de inspección HTTPS**: claves privadas que descifran el tráfico
- **Zonas de reenvío de DNS** y credenciales de DNS dinámicas
- **Cadenas de autenticación de alertas y correo electrónico**

Compartir toda la configuración, incluso con el soporte de Fortinet o un asistente de IA, los expone todos simultáneamente.

## Antes y después: desinfección FortiGate

Así es como se ve una pequeña sección:

**Crudo:**
```
configurar vpn ipsec fase1
editar "sitio a sitio principal"
establezca psk "Túnel@KeySecure#2026"
establecer par "203.0.113.5"
próximo
fin

administrador del sistema de configuración
editar "administrador de copia de seguridad"
establecer contraseña "F@rtinet2026"
próximo
fin
```

**Desinfectado:**
```
configurar vpn ipsec fase1
editar "sitio a sitio principal"
establecer psk "[VPNKEY_1]"
establecer par "203.0.113.5"
próximo
fin

administrador del sistema de configuración
editar "administrador de copia de seguridad"
establecer contraseña "[ADMIN_PASS_1]"
próximo
fin
```

El nombre del túnel y la IP del par permanecen visibles para la resolución de problemas: los secretos se reemplazan con tokens consistentes. Los ingenieros de soporte ven la estructura; nunca ven las credenciales reales.

## Cómo desinfectar las configuraciones de FortiGate con ScrubForge

1. **Exporta tu configuración**: inicia sesión en FortiGate > Configuración del sistema > Configuración > Descargar. Guarde el archivo de configuración completo localmente.
2. **Abre ScrubForge**: haz clic en la extensión en la barra de herramientas de tu navegador.
3. **Pegar y limpiar**: copie el contenido de la configuración y péguelo en ScrubForge. Reemplaza patrones sensibles al instante, en tu navegador.
4. **Revise el resultado**: busque cualquier valor expuesto restante: FortiGate utiliza muchos formatos secretos personalizados. Revisa siempre antes de compartir.
5. **Comparte de forma segura**: copia el texto desinfectado en tu ticket o correo electrónico de Fortinet TAC. No quedan credenciales atrás.

## Por qué esto importa

Los casos de soporte de Fortinet se almacenan indefinidamente en sus sistemas. Las configuraciones pegadas en ChatGPT o Claude se registran y pueden usarse para el entrenamiento del modelo. Una versión desinfectada brinda soporte exactamente lo que necesitan (la estructura y la lógica de configuración) sin las credenciales activas.

## Cuando desinfectar

- Antes de abrir un caso TAC con soporte de Fortinet
- Antes de pegar en los asistentes de IA para depurar la configuración
- Antes de compartir con proveedores o contratistas
- Antes de almacenar configuraciones en repositorios compartidos o sistemas de documentación

ScrubForge es gratuito y funciona con cualquier texto: FortiGate, Cisco, Palo Alto, Juniper o configuraciones en la nube. Todo el procesamiento ocurre en su navegador. Sin carga. Sin cuenta.

**[Instalar ScrubForge — Gratis](https://chromewebstore.google.com/detail/pjaohhipefhjfopoaepjbmiienagaffe)**

Aprenda también: [Cómo eliminar datos confidenciales de una configuración de Cisco IOS](/blog/remove-SENSITIVE-Data-cisco-config/)
