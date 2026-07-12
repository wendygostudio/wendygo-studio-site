# Decode JWT Token Online (No Server Upload, No Third-Party)

JWT (JSON Web Token) is the standard for stateless authentication. Every time you log into an app, your browser holds a JWT. But reading one requires decoding — and most online JWT decoders send your token to a third-party server.

TextForge decodes JWT locally, right in your browser, with zero upload to any server.

## What is a JWT and Why Decode It?

A JWT is a compact three-part string:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

The header, payload, and signature are each Base64-encoded. The payload contains user claims — `user_id`, `email`, `roles`, `exp` (expiration time). Debugging auth issues, checking token expiration, or verifying claims requires decoding that payload.

Most online JWT decoders run on a remote server, which means your token (potentially containing sensitive data) leaves your browser. If the token is a real authentication cookie, this is a security risk.

## Decode JWT with TextForge

TextForge decodes JWT locally:

1. Copy your JWT from DevTools, an API response, or your auth header
2. Paste it into TextForge
3. Select **Decode Base64** on the payload part
4. The decoded JSON appears instantly in your browser, never sent anywhere

TextForge also includes **Forge Magic** — when you paste a JWT, it auto-detects the Base64 payload and offers to decode it directly, skipping the manual step-by-step.

The token never leaves your device. All decoding runs in your browser tab.

## Alternative: Browser DevTools Console

If you do not want to install an extension, you can decode a JWT in the browser console in seconds:

```javascript
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";
const [header, payload, sig] = jwt.split('.');
console.log(JSON.parse(atob(payload)));
```

This prints the decoded payload directly. Zero external requests, zero setup time.

## When NOT to Decode a JWT Online

- **Never use a public online JWT decoder** (jwt.io, jwtdebugger.com, etc.) with production tokens that contain real user data, API keys, or role information. The token transits to their server.
- If your JWT includes sensitive claims, decode it locally (DevTools or TextForge) only.
- If your JWT is signed with a secret, decoding shows the claims but does NOT verify the signature. Only the issuing server can verify a signed JWT is real.

## Related Guides

See also [Best CyberChef Alternatives for Text Manipulation](/blog/cyberchef-alternatives/) — for JWT decoding, Base64 operations, and other text tasks without uploading to a third party.

And [Base64 Encode and Decode Online](/blog/base64-encode-decode-online-tool/) — because JWT payloads are Base64-encoded.

## FAQ

**Can I decrypt a JWT?**  
No. Decoding is not the same as decrypting. A JWT is not encrypted — it is Base64-encoded. Anyone can read the payload by decoding it. If you need the payload to be secret, you would use JWE (JSON Web Encryption), not JWT.

**Does decoding a JWT verify it is real?**  
No. Decoding shows you what claims are inside, but it does not verify the signature. Only the server that issued the token can verify it is authentic. You can decode a fake JWT just as easily as a real one.

**Is it safe to decode a JWT in the browser console?**  
Yes. The console is part of your browser; nothing is sent externally. This is one of the safest ways to decode a JWT for debugging.
