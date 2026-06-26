---
title: "How to Base64 Encode Kubernetes Secrets Without a Web Tool"
description: "Kubernetes Secret manifests require Base64-encoded values. Here's how to encode your raw secrets locally in your browser — no terminal, no third-party site."
date: 2026-06-26
keywords:
  - base64 encode kubernetes secrets
  - kubernetes secret base64
  - encode kubernetes secret value
  - kubernetes secret data field
  - base64 encode chrome extension
type: how-to
---

# How to Base64 Encode Kubernetes Secrets Without a Web Tool

Kubernetes stores sensitive values in Secret manifests. Unlike ConfigMaps, which accept plain text, Secret `data` fields require Base64-encoded values. Many developers paste raw passwords and API keys into online Base64 tools — which sends those credentials to a third-party server.

There's a safer option: encode directly in your browser using a Chrome extension that never transmits your data.

## Why Kubernetes Uses Base64

Kubernetes Secret manifests look like this:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  password: c3VwZXJzZWNyZXQ=
  api-key: c2tfdGVzdF84YzhiNDU2MA==
```

The values under `data:` are Base64-encoded. The raw values (`supersecret`, `sk_test_8c8b4560`) are never stored directly in the manifest.

**Important:** Base64 is not encryption. Anyone with access to the secret manifest can decode the values instantly. Kubernetes secrets provide access control at the cluster level — the Base64 encoding is purely a format requirement of the API, not a security measure.

## Encoding Secret Values with TextForge

TextForge is a Chrome extension with 50+ text utilities. Base64 encode is available in the free version and runs entirely locally.

1. **Open TextForge** — click the extension icon in your browser toolbar.
2. **Paste the raw secret value** — your password, API key, connection string, or any value that needs to go into the manifest.
3. **Apply Base64 Encode** — the encoded string appears immediately.
4. **Copy the output** and paste it into the `data:` block of your Kubernetes YAML.

No terminal, no web tool, no data leaving your machine.

## Using `stringData` Instead

Kubernetes also accepts a `stringData` field that takes plain text values — the API encodes them automatically:

```yaml
stringData:
  password: supersecret
```

`stringData` is fine for values you're creating fresh. But if you're reading an existing secret manifest, the stored values will always be under `data:` in Base64 form — which is when you need to decode them for inspection.

## Decoding to Verify

To verify an existing encoded value in a manifest, paste it into TextForge and apply Base64 Decode. You get the raw value immediately, without running:

```bash
kubectl get secret db-credentials -o jsonpath='{.data.password}' | base64 --decode
```

## Frequently Asked Questions

**Is Base64 encoding required for all Kubernetes secrets?**
Only for the `data:` field. If you use `stringData:`, Kubernetes handles the encoding. Most tools and tutorials use `data:` in examples, which is where the need to encode manually comes from.

**Can I encode multi-line values like TLS certificates?**
Yes. Paste the full certificate (including the `-----BEGIN CERTIFICATE-----` header and footer) into TextForge and encode it. The resulting string goes into the `data:` field.

**Is this function free in TextForge?**
Yes. Base64 encode and decode are in the free version — no account or subscription required.

---

[Install TextForge from the Chrome Web Store →](https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba)
