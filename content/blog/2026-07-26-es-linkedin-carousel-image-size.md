---
schemaVersion: 1
title: "Medidas del carrusel de LinkedIn: guía local"
description: "Prepara un carrusel de LinkedIn con páginas consistentes, texto legible y un PDF final, sin subir las imágenes originales a un editor web."
date: 2026-07-26
updated: 2026-08-14
slug: linkedin-carousel-image-size
locale: es
translationKey: linkedin-carousel-image-size
product: frameforge
contentType: tutorial
primaryKeyword: "medidas carrusel LinkedIn"
relatedPages: /es/frameforge/,/es/blog/batch-resize-images-chrome-extension/,/es/blog/resize-image-for-linkedin-post/
faqs:
  - question: "¿Qué medidas debe tener un carrusel de LinkedIn?"
    answer: "LinkedIn no fija una única medida en píxeles para las publicaciones de documentos. Usa el mismo tamaño y proporción en todas las páginas; 1080 × 1080 y 1080 × 1350 son lienzos de trabajo habituales, no requisitos oficiales."
  - question: "¿El carrusel de LinkedIn se sube como imágenes o como PDF?"
    answer: "La ayuda oficial lo trata como una publicación de documento y recomienda convertir el archivo a PDF cuando sea posible."
  - question: "¿Puedo preparar las diapositivas de forma local?"
    answer: "Sí. Puedes recortar y exportar cada imagen con el mismo lienzo en FrameForge y montar después esas páginas en el documento final."
---

Las medidas de un carrusel de LinkedIn no se reducen a un número obligatorio. En una publicación orgánica, LinkedIn muestra el carrusel como un **documento con varias páginas**. Lo importante es que todas compartan tamaño, proporción y márgenes, y que el texto siga siendo legible en el feed.

> **Respuesta corta:** usa un lienzo cuadrado de **1080 × 1080 px** o uno vertical de **1080 × 1350 px** como decisión de diseño, mantén esa medida en todas las páginas y genera un PDF final. Esas cifras son lienzos prácticos, no requisitos oficiales de LinkedIn.

## Requisitos oficiales y decisiones de diseño

La [ayuda oficial para compartir documentos en LinkedIn](https://www.linkedin.com/help/linkedin/answer/a518909/upload-and-share-documents-on-linkedin?lang=es) admite PDF, PPT, PPTX, DOC y DOCX, recomienda convertir el archivo a PDF y exige que las páginas de tamaños distintos se ajusten a un mismo tamaño. También indica un máximo de 100 MB y 300 páginas.

| Elemento | Qué debes hacer |
| --- | --- |
| Formato final | Preferiblemente PDF |
| Tamaño de página | El mismo en toda la secuencia |
| Límite oficial | 100 MB y 300 páginas |
| Lienzo cuadrado práctico | 1080 × 1080 px |
| Lienzo vertical práctico | 1080 × 1350 px |

Los dos lienzos en píxeles son puntos de partida para preparar imágenes rasterizadas. LinkedIn no los presenta como una obligación. Si tu herramienta trabaja con páginas físicas o diapositivas, conserva una sola proporción desde la portada hasta el cierre.

## Elige la proporción antes de diseñar

Un carrusel cuadrado deja un sistema sencillo de reutilizar. El formato vertical ofrece más altura para titulares, capturas o diagramas, pero exige revisar con cuidado los márgenes y el tamaño de letra en una pantalla pequeña.

<div class="key-points">
<h3>Comprobación antes de crear las páginas</h3>
<ul>
<li>Elige una sola proporción para todo el documento.</li>
<li>Reserva un margen estable alrededor de títulos y elementos de interfaz.</li>
<li>Limita cada página a una idea principal.</li>
<li>Decide el orden antes de invertir tiempo en recortes.</li>
</ul>
</div>

## Prepara las imágenes localmente con FrameForge

[FrameForge](/es/frameforge/) sirve para preparar las imágenes de cada página sin subir los archivos originales a un editor web. Es útil cuando el carrusel contiene capturas de un producto, materiales internos o trabajo de un cliente.

<ol class="steps">
<li><strong>Crea el lienzo maestro.</strong> Elige 1080 × 1080 o 1080 × 1350 y no cambies de proporción a mitad de la secuencia.</li>
<li><strong>Recorta cada fuente.</strong> Protege el sujeto de una foto y usa ajuste, no estiramiento, para capturas con texto.</li>
<li><strong>Mantén márgenes constantes.</strong> Coloca titulares, números de página y llamadas finales dentro de la misma zona segura.</li>
<li><strong>Exporta en orden.</strong> Usa nombres como <code>01-portada</code>, <code>02-problema</code> y <code>03-proceso</code>.</li>
<li><strong>Monta el documento.</strong> Inserta las páginas en una herramienta que genere PDF y comprueba que todas conserven el mismo tamaño.</li>
</ol>

Si tienes muchas imágenes con el mismo tratamiento, compara este proceso con el [flujo de redimensionado por lotes en Chrome](/es/blog/batch-resize-images-chrome-extension/). El lote ahorra tiempo cuando el encuadre puede repetirse; el ajuste individual sigue siendo mejor cuando cada captura tiene un punto de interés distinto.

## No confundas una imagen de LinkedIn con un carrusel

Una publicación con una sola imagen y una publicación de documento no son el mismo formato. La [guía para redimensionar una imagen de LinkedIn](/es/blog/resize-image-for-linkedin-post/) ayuda con gráficos individuales. Para un carrusel necesitas además continuidad entre páginas, un orden claro y un PDF coherente.

Antes de publicar, abre el PDF en un teléfono y en un portátil. Si un título requiere zoom, reduce el texto o aumenta su tamaño. Si una captura no se entiende sin contexto, añade una anotación breve en lugar de encoger una explicación completa dentro de la página.

## Preguntas frecuentes

### ¿Qué medidas debe tener un carrusel de LinkedIn?

LinkedIn no fija una única medida en píxeles para las publicaciones de documentos. Usa el mismo tamaño en todas las páginas. Como lienzos de trabajo, 1080 × 1080 y 1080 × 1350 son opciones prácticas, no requisitos oficiales.

### ¿El carrusel se sube como imágenes o como PDF?

LinkedIn lo trata como una publicación de documento y recomienda PDF cuando sea posible. Prepara las imágenes, ordénalas y genera el documento antes de subirlo.

### ¿Puedo preparar las diapositivas de forma local?

Sí. FrameForge puede recortar y exportar cada imagen localmente. Después necesitas una herramienta que reúna las páginas en el PDF final.
