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

Así la web seguirá en el Worker actual y solo `/api/license/validate` y
`/api/license/activate` pasarán al proxy nuevo.

## Prueba

Antes de cambiar ScrubForge, verifica que una petición llega al Worker:

```bash
curl -X POST https://wendygostudio.com/api/license/validate \
  -H "Content-Type: application/json" \
  -d '{"key":"licencia-de-prueba"}'
```

Una respuesta `proxy_misconfigured` significa que la ruta funciona pero falta
el secreto. Un `404` significa que la route todavía no está conectada.

Cuando las seis extensiones estén migradas, rellena `ALLOWED_ORIGINS` con sus
seis orígenes `chrome-extension://...` y rota la clave antigua de Creem.
