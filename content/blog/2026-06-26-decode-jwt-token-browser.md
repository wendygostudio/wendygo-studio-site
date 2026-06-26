---
title: "How to Decode a JWT Token Payload in Your Browser"
description: "Inspect JWT claims — user ID, expiry, roles — directly in your browser without pasting tokens into jwt.io or a web tool. TextForge decodes Base64url locally."
date: 2026-06-26
keywords:
  - decode jwt token online
  - decode jwt payload browser
  - jwt decoder chrome extension
  - inspect jwt claims
  - base64url decode
type: how-to
---

# How to Decode a JWT Token Payload in Your Browser

JWT (JSON Web Tokens) are used for authentication in almost every modern API. They look like random noise — three Base64url-encoded sections joined by dots — but the payload section contains readable JSON: user ID, expiry, roles, scopes. You just need to decode it.

When you're debugging an auth flow, checking why a request is getting 401s, or verifying what claims a service is sending, you need to see that payload. Here's the fastest way to do it in your browser without pasting tokens into a third-party site.

## What's Inside a JWT

A JWT has three sections separated by dots:

```
HEADER.PAYLOAD.SIGNATURE
```

- **Header** — token type and signing algorithm (e.g. RS256, HS256)
- **Payload** — the claims as JSON, Base64url-encoded
- **Signature** — verifies the token hasn't been tampered with

The payload is the section you want. It's not encrypted — just encoded. You don't need the secret key to read it; you only need the key to verify its authenticity.

## How to Decode the Payload with TextForge

TextForge is a Chrome extension with 50+ text utility functions. Base64 decode is included in the free version and runs entirely on your machine.

1. **Copy the JWT** — from DevTools (Network tab → Authorization header), your API client, or an environment variable.
2. **Identify the payload section** — it's the second chunk, between the first and second dots.
3. **Open TextForge** — click the extension icon in your browser toolbar.
4. **Paste the payload section** into the input area.
5. **Apply Base64 Decode** — the JSON claims appear immediately.

## What You'll See

After decoding, you'll get JSON like:

```json
{"sub":"user_123","email":"user@example.com","role":"admin","exp":1762000000,"iat":1750000000}
```

Common claims to look for:
- `sub` — subject (usually a user ID or username)
- `exp` — expiry as a Unix timestamp (seconds since epoch)
- `iat` — issued-at timestamp
- `aud` — audience (which service the token is intended for)
- `roles` / `scope` — permissions granted to the token

## Why Not Use jwt.io?

jwt.io is the standard tool and it's convenient. But it sends your JWT to a server. For tokens that contain real user data, internal user IDs, or scope claims, pasting them into a third-party tool is a habit worth avoiding — especially in production debugging.

TextForge decodes locally. The token never leaves your browser.

## Frequently Asked Questions

**Can I decode the JWT signature this way?**
The signature section is also Base64url-encoded, but decoding it gives you raw binary — not human-readable JSON. What you actually want is the payload (second section), not the signature (third).

**Does TextForge verify the JWT signature?**
No. TextForge decodes the payload for inspection. Signature verification requires the secret key and is done server-side. For inspection purposes, decoding the payload is all you need.

**Does this work offline?**
Yes. Base64 decode runs locally in the extension with no network required.

---

[Install TextForge from the Chrome Web Store →](https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba)
