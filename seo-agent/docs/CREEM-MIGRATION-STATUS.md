# Estado de migración Creem — 2026-08-13

## Worker confirmado

- Worker: `worker-license-proxy` / `wendygo-license-proxy`.
- Secreto cifrado: `CREEM_API_KEY` en Cloudflare Production.
- Rutas: `/api/license/validate`, `/api/license/activate`, `/api/license/deactivate` y `/api/trial/register`.
- KV: binding `TRIAL_IDS` configurado.
- `ALLOWED_ORIGINS`: vacío temporalmente, por lo que CORS está abierto durante la migración. Debe restringirse antes de considerar cerrado el trabajo.

## IDs de extensiones

```text
TextForge   cnmlojgahikinilbefkkfadkfamchlba
FrameForge  abdmadomfnijoiklnaklmplifmljgchj
ConvertForge mjmamnnhophdhccknmgnppcdkojkpagj
ScrubForge  pjaohhipefhjfopoaepjbmiienagaffe
ClaimForge  mlnjadkolgplpgbheklkdjcglojfakcg
SlimeForge  dobhabpmcmpfdihchnhbickecelihhbc
```

## Pendiente para ConvertForge

1. **Bloqueo confirmado (13-08-2026):** `C:\Users\Damian\Downloads\ConvertForge-v1_5_0-trial_1.zip` no está migrado. `assets/license.js` llama directamente a `https://api.creem.io/v1/licenses/{activate,validate,deactivate}`, contiene una clave `creem_...` embebida y `manifest.json` declara `https://api.creem.io/*`. Ese paquete no usa el Worker y debe retirarse.
2. Generar/recibir un paquete corregido: sin clave Creem embebida, con `licenseProxyUrl` apuntando a `https://wendygostudio.com/api/license` y las llamadas `activate`, `validate` y `deactivate` pasando por el proxy.
3. Ejecutar `/validate` desde la extensión empaquetada con una licencia Creem válida.
4. Ejecutar `/activate` desde la extensión con un `instance_id` nuevo.
5. Confirmar que las respuestas incluyen CORS para `chrome-extension://mjmamnnhophdhccknmgnppcdkojkpagj`.
6. Tras migrar las seis extensiones, rellenar `ALLOWED_ORIGINS` con los seis orígenes y rotar la clave Creem expuesta en ese ZIP.

Una prueba PowerShell contra el Worker solo confirma el proxy; no sustituye la prueba desde el contexto real de Chrome.
