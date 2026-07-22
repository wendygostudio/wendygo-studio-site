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
  },
  {
    file: 'public/blog/free-config-sanitizer-alternatives/index.html',
    replacements: [
      [/Standard CyberChef \(bake\.gchq\.github\.io\) runs in the browser, but the site is served by GCHQ infrastructure\. Most security professionals treat web-based tools the same as any third-party server\. If you self-host CyberChef on your own infrastructure, it becomes a local tool\. Otherwise, for sensitive production configs, a local-only approach is safer\./g, 'CyberChef is entirely client-side: its official documentation says input and recipes are not sent to its web server. For especially sensitive production configurations, you can also download or self-host CyberChef to control how the application itself is delivered.'],
      [/The public CyberChef instance \(bake\.gchq\.github\.io\) serves the app from external infrastructure\. Your config data passes through that server when the page loads\. For production credentials, treat any web-based tool the same as emailing the config &mdash; only use it if you run a self-hosted instance on your own network\./g, 'The official CyberChef instance is entirely client-side: input and recipes are not sent to its web server. For especially sensitive production configurations, downloading or self-hosting CyberChef also lets you control how the application itself is delivered.']
    ]
  },
  {
    file: 'public/es/blog/alternativas-sanitizador-config-gratis/index.html',
    replacements: [
      [/CyberChef estándar \(bake\.gchq\.github\.io\) se ejecuta en el navegador, pero el sitio es servido por infraestructura de GCHQ\. La mayoría de profesionales de seguridad tratan las herramientas basadas en web igual que cualquier servidor de terceros\. Si ejecutas CyberChef en tu propia infraestructura, se convierte en una herramienta local\. De lo contrario, para configuraciones de producción sensibles, un enfoque solo local es más seguro\./g, 'CyberChef funciona íntegramente en el cliente: su documentación oficial indica que las entradas y recetas no se envían a su servidor. Para configuraciones de producción especialmente sensibles, también puedes descargarlo o autoalojarlo y controlar cómo se sirve la propia aplicación.'],
      [/La instancia pública de CyberChef \(bake\.gchq\.github\.io\) sirve la app desde infraestructura externa\. Tus datos de configuración pasan por ese servidor cuando la página carga\. Para credenciales de producción, trata cualquier herramienta basada en web igual que enviar por correo electrónico la configuración — úsala solo si ejecutas una instancia auto-alojada en tu propia red\./g, 'La instancia oficial de CyberChef funciona íntegramente en el cliente: las entradas y recetas no se envían a su servidor. Para configuraciones de producción especialmente sensibles, descargarla o autoalojarla también permite controlar cómo se sirve la propia aplicación.']
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
