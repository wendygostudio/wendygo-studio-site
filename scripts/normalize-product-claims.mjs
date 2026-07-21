import fs from 'node:fs';

const jobs = [
  {
    file: 'public/blog/convert-pdf-to-text-free/index.html',
    replacements: [
      [/How to Convert PDF to Text Free — Local OCR, No Upload/g, 'How to Convert Scanned PDF to Text Locally — No Upload'],
      [/How to Convert PDF to Text Free — Local OCR/g, 'Convert Scanned PDF to Text Locally'],
      [/Is PDF to text conversion free in ConvertForge\?/g, 'Is scanned-PDF OCR free in ConvertForge?'],
      [/Yes\. The OCR conversion feature is available in the free version of ConvertForge\. No account or subscription required\./g, 'No. OCR for scanned PDFs is a Pro feature. OCR for JPG and PNG images is available in the free version. Both run locally with Tesseract.']
    ]
  },
  {
    file: 'public/es/blog/convertir-pdf-a-texto-gratis/index.html',
    replacements: [
      [/Convertir PDF a Texto Gratis — OCR Local \| Wendygo Studio/g, 'Convertir PDF Escaneado a Texto Local | Wendygo Studio'],
      [/Cómo Convertir PDF a Texto Gratis/g, 'Cómo Convertir PDF Escaneado a Texto Localmente'],
      [/Cómo convertir PDF a texto gratis/g, 'Cómo convertir PDF escaneado a texto localmente'],
      [/¿Es gratis la conversión de PDF a texto en ConvertForge\?/g, '¿Es gratis el OCR de PDF escaneados en ConvertForge?'],
      [/Sí\. La función de conversión OCR está disponible en la versión gratuita de ConvertForge\. No se requiere cuenta ni suscripción\./g, 'No. El OCR de PDF escaneados es una función Pro. El OCR de imágenes JPG y PNG está disponible en la versión gratuita. Ambos se ejecutan localmente con Tesseract.'],
      [/Yes\. The OCR conversion feature is available in the free version of ConvertForge\. No account or subscription required\./g, 'No. Scanned-PDF OCR is a Pro feature. JPG and PNG image OCR is available in the free version. Both run locally with Tesseract.']
    ]
  },
  {
    file: 'public/blog/extract-text-from-image-free/index.html',
    replacements: [[/Yes\. The OCR conversion feature is available in the free version of ConvertForge\. No account or subscription required\./g, 'Yes. OCR for JPG and PNG images is available in the free version. OCR for scanned PDFs is a separate Pro feature. Both run locally with Tesseract.']]
  },
  {
    file: 'public/es/blog/extraer-texto-de-imagen-gratis/index.html',
    replacements: [
      [/Sí\. La función de conversión OCR está disponible en la versión gratuita de ConvertForge\. No requiere cuenta ni suscripción\./g, 'Sí. El OCR de imágenes JPG y PNG está disponible en la versión gratuita. El OCR de PDF escaneados es una función Pro independiente. Ambos se ejecutan localmente con Tesseract.'],
      [/Yes\. The OCR conversion feature is available in the free version of ConvertForge\. No account or subscription required\./g, 'Yes. JPG and PNG image OCR is available in the free version. Scanned-PDF OCR is a separate Pro feature. Both run locally with Tesseract.']
    ]
  }
];

let changed = 0;
for (const {file, replacements} of jobs) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  for (const [pattern, replacement] of replacements) after = after.replace(pattern, replacement);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed++;
  }
}
console.log(`Normalized product claims in ${changed} legacy pages`);
