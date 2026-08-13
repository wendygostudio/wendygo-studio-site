# Proxy Creem como Worker independiente

El proyecto actual de Cloudflare sirve la web como **Worker** y despliega con
`npx wrangler deploy`. Por eso no se usa `functions/` de Pages. El proxy vive
en `worker-license-proxy/` y no modifica el Worker principal de la web.

## Crear el Worker

En Cloudflare Dashboard:

1. **Workers & Pages → Create application → Worker → Connect to Git**.
2. Selecciona `wendygostudio/wendygo-studio-site`.
3. Configura la ruta del proyecto como `worker-license-proxy`.
4. Build command: vacío.
5. Deploy command: `npx wrangler deploy`.
6. Production branch: `main`.

El repositorio ya contiene `worker-license-proxy/wrangler.toml`, por lo que
Cloudflare usará `worker-license-proxy/src/index.js` como entrada.

## Secreto

En el nuevo Worker: **Settings → Variables and Secrets → Add secret**.

- Name: `CREEM_API_KEY`
- Value: clave real de Creem
- Environment: Production
- Type: encrypted secret

No guardes la clave en Git ni en `wrangler.toml`.

## Ruta del dominio

En el Worker nuevo, añade una route:

```text
wendygostudio.com/api/license/*
```

Así la web seguirá en el Worker actual y `/api/license/validate`,
`/api/license/activate` y `/api/license/deactivate` pasarán al proxy nuevo.

## Registro de trials (legado, actualmente sin uso)

Las extensiones actuales usan un trial local y no llaman a este endpoint. Esta
ruta se conserva únicamente por compatibilidad con despliegues anteriores.

El Worker también expone `POST /api/trial/register`. Recibe únicamente un UUID
v4 generado por la extensión y guarda su primera fecha de uso en el namespace
KV `TRIAL_IDS`. El UUID no contiene información del dispositivo, hardware, IP
ni correo electrónico.

El binding KV está declarado en `worker-license-proxy/wrangler.toml`. El
namespace de producción es `TRIAL_IDS` y su ID está configurado allí; el ID no
es un secreto.

Prueba de registro:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "https://wendygostudio.com/api/trial/register" `
  -ContentType "application/json" `
  -Body '{"id":"00000000-0000-4000-8000-000000000001"}'
```

La primera petición devuelve `used: false`; repetirla con el mismo UUID debe
devolver `used: true`. La extensión debe conservar el UUID en
`chrome.storage.sync` y aplicar los 5 días normales más un máximo de 2 días de
gracia si el Worker no responde.

## Prueba

Antes de cambiar ScrubForge, verifica que una petición llega al Worker:

```bash
curl -X POST https://wendygostudio.com/api/license/validate \
  -H "Content-Type: application/json" \
  -d '{"key":"licencia-de-prueba"}'
```

## Cierre de la migración Creem

IDs confirmados para restringir CORS cuando las seis extensiones usen el proxy:

```text
chrome-extension://cnmlojgahikinilbefkkfadkfamchlba  # TextForge
chrome-extension://abdmadomfnijoiklnaklmplifmljgchj  # FrameForge
chrome-extension://mjmamnnhophdhccknmgnppcdkojkpagj  # ConvertForge
chrome-extension://pjaohhipefhjfopoaepjbmiienagaffe  # ScrubForge
chrome-extension://mlnjadkolgplpgbheklkdjcglojfakcg  # ClaimForge
chrome-extension://dobhabpmcmpfdihchnhbickecelihhbc  # SlimeForge
```

Estado comprobado el 13 de agosto de 2026: `CREEM_API_KEY`, las rutas
`/api/license/*` y `/api/trial/*`, y el KV `TRIAL_IDS` están configurados. La
lista `ALLOWED_ORIGINS` sigue vacía temporalmente, por lo que el CORS está en
modo abierto para facilitar la migración; no es el estado final seguro.

Para cerrar ConvertForge faltan: confirmar que el paquete no contiene una
clave Creem y usa `https://wendygostudio.com/api/license`; probar `/validate`
desde la extensión empaquetada con una licencia de prueba válida; y probar
`/activate` con un `instance_id` nuevo. Después debe rotarse cualquier clave
antigua que haya sido distribuida.

Una respuesta `proxy_misconfigured` significa que la ruta funciona pero falta
el secreto. Un `404` significa que la route todavía no está conectada.

Cuando las seis extensiones estén migradas, rellena `ALLOWED_ORIGINS` con sus
seis orígenes `chrome-extension://...` y rota la clave antigua de Creem.
