# Diagnóstico ConvertForge — 2026-08-13

El ZIP `ConvertForge-v1_5_0-trial_1.zip` probado por el usuario devuelve un 404 porque todavía usa la integración antigua directa con Creem. `assets/license.js` contiene endpoints `api.creem.io/v1/licenses/*` y una clave Creem embebida; `manifest.json` solicita `https://api.creem.io/*`. La petición no llega al Worker `wendygostudio.com/api/license/*`.

Acción requerida: no distribuir ese ZIP; generar una versión migrada al proxy, retirar la clave expuesta y rotarla en Creem. Después probar validate/activate desde el contexto real de la extensión.
