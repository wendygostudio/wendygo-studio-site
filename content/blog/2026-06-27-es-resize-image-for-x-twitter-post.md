---
schemaVersion: 1
title: >-
  Cómo cambiar el tamaño de una imagen para publicaciones X (Twitter) en Chrome
  (1200×675)
description: >-
  Publique imágenes con la resolución correcta de 1200 × 675 px sin que nada se
  recorte en el feed X. FrameForge cambia de tamaño en su navegador: sin carga,
  sin Photoshop.
date: 2026-06-27T00:00:00.000Z
slug: resize-image-for-x-twitter-post
locale: es
translationKey: resize-image-for-x-twitter-post
product: frameforge
contentType: how-to
primaryKeyword: cómo cambiar el tamaño de la imagen para x publicación de Twitter
relatedPages: /es/frameforge/,/es/blog/tamano-foto-perfil-encabezado-x-twitter/
---
La ayuda actual de X indica que una foto individual con una proporción estándar entre 2:1 y 3:4 puede mostrarse completa. Una exportación de 1200 × 675 px (16:9) sigue siendo un objetivo práctico y repetible para una publicación ancha, pero no es un requisito universal ni garantiza el mismo resultado en todos los clientes.

FrameForge es una extensión de Chrome que cambia el tamaño de las imágenes por completo en su navegador. Sin carga, sin cuenta, sin esperar a que un servidor remoto procese su archivo.

## Requisitos de tamaño de imagen de X (Twitter)

| Format | Dimensions | Aspect ratio |
|--------|------------|--------------|
| Standard post image | 1200×675 px | 16:9 |
| Proporción admitida para una foto individual | Entre 2:1 y 3:4 | X indica que puede mostrarse completa |
| Max file size | 5 MB (JPG/PNG) | — |
| Formatos admitidos | JPEG, PNG, GIF | — |

1200 × 675 es un ajuste práctico de 16:9 cuando quieres una composición ancha constante. Usa la vista previa de recorte para colocar el sujeto y no supongas que X aplicará un recorte fijo 2:1 en todos los dispositivos.

## Por qué se recortan las imágenes cuadradas y verticales

La ayuda de X indica que una foto individual con una proporción estándar entre 2:1 y 3:4 puede mostrarse completa. La presentación exacta puede variar según el cliente y el diseño, así que mantén el sujeto lejos de los extremos y revisa la vista previa antes de publicar.

El tamaño 1200×675 ofrece una composición 16:9 predecible y un buen punto de partida para gráficos anchos. No sustituye la comprobación del compositor actual, sobre todo con fuentes verticales o varias imágenes.

## Paso a paso: cambiar el tamaño de X con FrameForge

1. **Instala FrameForge**: instálalo desde Chrome Web Store y fíjalo a tu barra de herramientas.
2. **Abre tu imagen**: haz clic en el ícono de FrameForge, luego abre tu archivo o arrástralo al lienzo.
3. **Seleccione el ajuste preestablecido de publicación X (Twitter)**; en el menú desplegable Plataforma, seleccione Publicación X. El lienzo se bloquea en 1200×675 px.
4. **Ajusta el recorte**: arrastra la superposición de recorte para centrar al sujeto en el marco de 16:9.
5. **Exportar**: haga clic en Exportar. FrameForge guarda la imagen redimensionada en su carpeta de Descargas.

## Manejo de imágenes fuente de retratos

Las fotografías de retrato (9:16, cámara del teléfono predeterminada) necesitan el mayor ajuste para adaptarse a un marco de 16:9:

- **Recortar para rellenar (recomendado):** El fotograma 16:9 se rellena por completo. Se recorta el exceso de la parte superior e inferior. Arrastre la superposición de recorte para mantener el elemento clave en el marco.
- **Ajustar con relleno:** El retrato completo es visible, con barras negras o de colores a la izquierda y a la derecha. El relleno intencional puede parecer deliberado, pero las barras desnudas suelen parecer un error.
- **Estirar para rellenar:** Distorsiona la imagen horizontalmente. Evítelo a menos que la distorsión sea una elección estilística deliberada.

Para imágenes de origen horizontal con una resolución superior a 16:9 (recorte cinematográfico, panorámicas), el exceso se recorta desde la izquierda y la derecha. Misma lógica: arrastre la superposición para centrar el sujeto.

## El flujo de trabajo de cambio de tamaño de la plataforma social

Si publica el mismo contenido en varias plataformas el mismo día, FrameForge los cubre todos desde una sola extensión:

| Platform | Target size | Preset |
|----------|-------------|--------|
| X (Twitter) | 1200×675 px | X Post |
| YouTube | 1280×720 px | YouTube Thumbnail |
| Instagram (square) | 1080×1080 px | Instagram Post |
| Twitch panels | 320×160 px | Twitch Panel |

Cambie el tamaño una vez por plataforma, exporte cada versión con unos pocos clics, sin cambiar de herramienta ni cargar servicios separados.

## Preguntas frecuentes

**¿Cuál es el mejor tamaño de imagen para una publicación X (Twitter)?**
1200×675 píxeles a 16:9. Esto llena la vista previa del feed sin recortar y se muestra en dimensiones completas cuando se expande. Mantenga el archivo por debajo de 5 MB para JPG/PNG.

**¿X recorta imágenes en el feed?**
Depende de la proporción de la imagen y del cliente. X dice que una foto individual con una proporción estándar entre 2:1 y 3:4 puede mostrarse completa; comprueba el compositor en lugar de suponer un recorte fijo 2:1. 1200×675 px es una opción práctica de 16:9 para publicaciones anchas.

**¿FrameForge carga imágenes a un servidor?**
No. FrameForge es una extensión de Chrome que procesa imágenes completamente en su navegador. No se envía nada a ningún servidor. No se requiere cuenta.

**¿Puedo usar la misma imagen para X y YouTube?**
Las miniaturas de YouTube son de 1280×720 px y las publicaciones X son de 1200×675 px; ambas son 16:9, por lo que la composición es idéntica. FrameForge tiene ajustes preestablecidos para ambos, por lo que puede exportar dos versiones de la misma imagen de origen sin volver a recortarla.

**¿FrameForge es gratuito?**
Sí. FrameForge se puede instalar gratis desde Chrome Web Store. La versión gratuita incluye ajustes preestablecidos de plataforma y cambio de tamaño del núcleo. Pro agrega superposición de texto y procesamiento por lotes.
