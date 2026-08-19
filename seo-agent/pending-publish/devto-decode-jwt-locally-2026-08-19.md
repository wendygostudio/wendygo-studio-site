---
published: true
---

JWTs are designed to be readable by the client. That is useful for debugging, but it also means a real token can contain user IDs, email addresses, roles, scopes and expiry data that should not be pasted into a random online decoder.

The practical distinction is simple: decoding a JWT is not decrypting it, and decoding it is not verifying its signature.

## Read the three sections first

A compact JWT normally looks like this:

```text
HEADER.PAYLOAD.SIGNATURE
```

The header tells you the token type and signing algorithm. The payload contains JSON claims. The signature is evidence that the issuer signed the other two sections; it is not the part you usually need to inspect.

The header and payload use Base64url encoding. They are encoded, not encrypted. Anyone who has the token can decode those sections, so treat a token copied from production as sensitive even when you do not have the signing secret.

## A local browser-console check

For a quick inspection, split the token and decode the first two parts in DevTools. Base64url uses `-` and `_` instead of `+` and `/`, so normalize those characters and restore padding:

```js
const decodePart = (part) => {
  const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return JSON.parse(atob(padded));
};

const [encodedHeader, encodedPayload] = token.split('.');
console.log({
  header: decodePart(encodedHeader),
  payload: decodePart(encodedPayload),
});
```

This runs in your browser and does not need an external request. Use a redacted fixture when possible; the console is local, but screenshots and copied logs can still leak the claims.

## Claims worth checking

- `exp`: whether the token has expired;
- `iat`: when it was issued;
- `aud`: which service it is intended for;
- `iss`: which issuer claims to have created it;
- `sub`: the subject identifier;
- `scope` or `roles`: what the token may authorize.

Seeing an `admin` role in a payload does not prove that the token is valid or that the server will accept it. It only tells you what the token claims. Signature validation, issuer configuration, audience checks and server-side authorization still matter.

## When a local tool is easier

The console is great for a one-off check. If you inspect tokens repeatedly, a local browser tool can make the workflow more repeatable: paste the payload section, decode it, copy the JSON, then clear the input. TextForge's JWT and Base64 workflow keeps the transformation in the browser rather than sending the token to a third-party decoder.

The rule is the same in either workflow: decode only what you need, do not confuse readability with authenticity, and never paste production credentials into a public form just because the page says it is convenient.

Original guide: https://wendygostudio.com/blog/decode-jwt-online/
