# SlimeForge 1.1.0 — revisión de robustez y experiencia

## Guardado y seguridad

- Añade un esquema de guardado versionado y migración defensiva.
- Valida especies, ADN, etapas, recursos, textos, arrays y temporizadores.
- Limita la importación a 1 MB y conserva una copia local de la partida anterior.
- La licencia no se importa desde archivos y el trial nunca rejuvenece.
- Los códigos de visita se validan antes de construir sus SVG.
- Los nombres y alias se escapan antes de insertarlos en plantillas HTML.

## Consistencia del estado

- Serializa las mutaciones del service worker.
- El popup envía parches en lugar de sobrescribir la partida completa.
- Usa fusión a tres bandas para conservar recompensas concurrentes.
- Incorpora una revisión monotónica del estado.

## Interfaz y accesibilidad

- Agrupa Nano, No molestar, guardado y enlaces en un panel avanzado.
- Añade foco visible para teclado y cierre de modales con Escape.
- Restaura el foco al cerrar un modal y permite cerrarlo desde el fondo.
- Actualiza dinámicamente el idioma del documento.
- Evita el destello inicial en español mientras se resuelve el idioma guardado o el del navegador.
- Normaliza `pt-PT` y utiliza inglés cuando el idioma del sistema no está soportado.
- Mejora el contraste del tema claro y el tamaño de textos pequeños.

## Animaciones

- Añade clases de especie a las criaturas SVG.
- Diferencia la locomoción de pingüino, conejo, criaturas acuáticas, panda, zorros y criaturas flotantes.
- Añade microgestos propios para búho, conejo, pingüino, criaturas acuáticas y voladoras.
- Mantiene compatibilidad con `prefers-reduced-motion`.

## Pruebas

- Añade pruebas con `node:test` para importación, trial, foco, visitas, concurrencia y las cuatro rarezas.
- Comandos: `npm.cmd test` y `npm.cmd run check` en Windows.
