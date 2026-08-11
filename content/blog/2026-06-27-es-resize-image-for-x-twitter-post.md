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
relatedPages: /es/frameforge/
---X representa imágenes de tweets con un recorte 2:1 en la vista previa del feed. A las fotografías cuadradas se les corta la mitad inferior. Los retratos quedan comprimidos en un incómodo corte central. La solución es simple: publique a 1200 × 675 px (16:9) y no se recortará nada ni en la vista previa del feed ni en la vista ampliada de tamaño completo.

FrameForge es una extensión de Chrome que cambia el tamaño de las imágenes por completo en su navegador. Sin carga, sin cuenta, sin esperar a que un servidor remoto procese su archivo.

## Requisitos de tamaño de imagen de X (Twitter)

| Format | Dimensions | Aspect ratio |
|--------|------------|--------------|
| Standard post image | 1200×675 px | 16:9 |
| Feed preview crop | ~2:1 center | — |
| Max file size | 5 MB (JPG/PNG) | — |
| Accepted formats | JPG, PNG, WebP, GIF | — |

1200 × 675 es el punto ideal: llena exactamente el recorte de vista previa 2:1 y la imagen completa se muestra sin formato tipo letterboxing o pillar-boxing cuando el espectador la expande.

## Por qué se recortan las imágenes cuadradas y verticales

X aplica un recorte central cuando se muestran imágenes en línea en el feed. Una imagen cuadrada 1:1 se convierte en un corte 2:1: el cuarto superior y el cuarto inferior desaparecen. Las imágenes de retrato (9:16) se recortan aún más: se pierde aproximadamente el 80% de la altura de la imagen en la vista previa del feed.

El tamaño de 1200×675 elimina la discrepancia. La imagen ya es 16:9, por lo que la vista previa del feed 2:1 solo muestra el ancho completo a la altura normal, sin recortes inesperados.

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
Sí. X aplica un recorte central a las imágenes en línea en el feed de tweets, renderizándolas aproximadamente en 2:1. Las imágenes publicadas a 1200×675 px (16:9) coinciden con las proporciones de la vista previa del feed y aparecen sin recortes inesperados.

**¿FrameForge carga imágenes a un servidor?**
No. FrameForge es una extensión de Chrome que procesa imágenes completamente en su navegador. No se envía nada a ningún servidor. No se requiere cuenta.

**¿Puedo usar la misma imagen para X y YouTube?**
Las miniaturas de YouTube son de 1280×720 px y las publicaciones X son de 1200×675 px; ambas son 16:9, por lo que la composición es idéntica. FrameForge tiene ajustes preestablecidos para ambos, por lo que puede exportar dos versiones de la misma imagen de origen sin volver a recortarla.

**¿FrameForge es gratuito?**
Sí. FrameForge se puede instalar gratis desde Chrome Web Store. La versión gratuita incluye ajustes preestablecidos de plataforma y cambio de tamaño del núcleo. Pro agrega superposición de texto y procesamiento por lotes.
