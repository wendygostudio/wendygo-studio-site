# Lighthouse / Core Web Vitals — 2026-08-11

Medición sobre `https://wendygostudio.com/` con Lighthouse local. No depende de Search Console ni de una clave de PageSpeed.

| Perfil | Performance | FCP | LCP | CLS | TBT | TTFB |
|---|---:|---:|---:|---:|---:|---:|
| Mobile | 98 | 1.4 s | 2.2 s | 0 | 0 ms | 90 ms |
| Desktop | 100 | 0.4 s | 0.7 s | 0 | 0 ms | 70 ms |

## Lectura

- LCP mobile está dentro del umbral “bueno” de 2.5 s, aunque queda cerca del límite y merece vigilancia tras cambios visuales.
- CLS 0 y TBT 0 ms indican que no hay desplazamientos ni bloqueo relevante en esta captura.
- PageSpeed Insights externo respondió 429 sin clave; Lighthouse local cubre ahora la medición puntual, pero no sustituye la distribución CrUX de usuarios reales.
- Repetir mensualmente y tras cambios importantes de la home, CSS o imágenes.
