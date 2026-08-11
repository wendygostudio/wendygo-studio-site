# Medición de instalaciones y activación

## GA4 (solo lectura)

1. En Google Cloud habilita **Google Analytics Data API** en el mismo proyecto del cliente OAuth.
2. En cada propiedad GA4 de Chrome Web Store añade la cuenta OAuth como **Viewer/Lector**.
3. Copia `config/agent.env.example` a `config/agent.env` sin subirlo al repositorio.
4. Mantén `GA4_PROPERTY_IDS` con los seis IDs separados por comas.
5. Ejecuta `python scripts/analytics-fetch.py`. La primera vez abrirá OAuth y guardará `config/ga4-token.json` localmente.

El informe guarda eventos y usuarios por propiedad. La cuenta no puede modificar datos. Para que la medición sea útil, las extensiones deben enviar de forma consistente `install`, `first_open`, `activation`, `feature_use`, `trial_start`, `store_click`, `pro_purchase` y `return_session`.

## Chrome Web Store

GA4 no sustituye la fuente oficial de instalaciones. Para cada extensión exporta desde Chrome Web Store Developer Dashboard el informe de instalaciones/usuarios del mismo periodo y guárdalo fuera de `public/` (por ejemplo en `.integration/measurement/cws/`). El export debe conservar: extensión, periodo, instalaciones, desinstalaciones, usuarios activos y país/idioma cuando esté disponible.

## Regla de interpretación

- No cambiar precios o CTAs con muestras inferiores a 30 usuarios o 10 conversiones.
- Separar clics de instalación, instalación, primer uso y activación.
- Comparar siempre periodos equivalentes y anotar la zona horaria.
- Si GA4 o CWS no están disponibles, el daily SEO debe marcar la métrica como bloqueada, no estimarla.
