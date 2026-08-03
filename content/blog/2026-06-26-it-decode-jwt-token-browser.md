---
schemaVersion: 1
title: Come decodificare un payload token JWT nel tuo browser
description: >-
  Controlla le attestazioni JWT (ID utente, scadenza, ruoli) direttamente nel
  tuo browser senza incollare token in jwt.io o in uno strumento web. TextForge
  decodifica Base64url localmente.
date: 2026-06-26T00:00:00.000Z
slug: decode-jwt-token-browser
locale: it
translationKey: decode-jwt-token-browser
product: textforge
contentType: how-to
primaryKeyword: come decodificare un payload token jwt nel tuo browser
relatedPages: /it/textforge/
---

# Come decodificare un payload token JWT nel tuo browser

JWT (JSON Web Token) vengono utilizzati per l'autenticazione in quasi tutte le API moderne. Sembrano rumori casuali - tre sezioni con codifica Base64url unite da punti - ma la sezione del payload contiene JSON leggibile: ID utente, scadenza, ruoli, ambiti. Devi solo decodificarlo.

Quando esegui il debug di un flusso di autenticazione, controlli il motivo per cui una richiesta riceve 401 o verifichi quali attestazioni sta inviando un servizio, devi vedere quel payload. Ecco il modo più veloce per farlo nel tuo browser senza incollare token in un sito di terze parti.

## Cosa c'è dentro un JWT

Un JWT ha tre sezioni separate da punti:

```
INTESTAZIONE.CARICO.FIRMA
```

- **Intestazione**: tipo di token e algoritmo di firma (ad esempio RS256, HS256)
- **Payload**: le affermazioni sono JSON, con codifica Base64url
- **Firma**: verifica che il token non sia stato manomesso

Il payload è la sezione che desideri. Non è crittografato, solo codificato. Non hai bisogno della chiave segreta per leggerlo; ti serve solo la chiave per verificarne l'autenticità.

## Come decodificare il carico utile con TextForge

TextForge è un'estensione di Chrome con oltre 50 funzioni di utilità di testo. La decodifica Base64 è inclusa nella versione gratuita e funziona interamente sul tuo computer.

1. **Copia il JWT**: da DevTools (scheda Rete → Intestazione autorizzazione), dal tuo client API o da una variabile di ambiente.
2. **Identifica la sezione del carico utile**: è il secondo pezzo, tra il primo e il secondo punto.
3. **Apri TextForge**: fai clic sull'icona dell'estensione nella barra degli strumenti del browser.
4. **Incolla la sezione del payload** nell'area di input.
5. **Applica decodifica Base64**: le attestazioni JSON vengono visualizzate immediatamente.

## Quello che vedrai

Dopo la decodifica, otterrai JSON come:

```json
{"sub":"user_123","email":"user@example.com","role":"admin","exp":1762000000,"iat":1750000000}
```

Affermazioni comuni da cercare:
- "sub" — oggetto (solitamente un ID utente o un nome utente)
- `exp`: scadenza come timestamp Unix (secondi dall'epoca)
- "iat" — timestamp emesso al momento
- "aud" — audience (a quale servizio è destinato il token)
- `ruoli`/`ambito`: autorizzazioni concesse al token

## Perché non utilizzare jwt.io?

jwt.io è lo strumento standard ed è conveniente. Ma invia il tuo JWT a un server. Per i token che contengono dati utente reali, ID utente interni o attestazioni di ambito, incollarli in uno strumento di terze parti è un'abitudine che vale la pena evitare, soprattutto nel debugging della produzione.

TextForge decodifica localmente. Il token non lascia mai il tuo browser.

## Domande frequenti

**Posso decodificare la firma JWT in questo modo?**
Anche la sezione della firma è codificata Base64url, ma decodificandola si ottiene un codice binario non elaborato, non un JSON leggibile dall'uomo. Ciò che realmente desideri è il payload (seconda sezione), non la firma (terza).

**TextForge verifica la firma JWT?**
No. TextForge decodifica il carico utile per l'ispezione. La verifica della firma richiede la chiave segreta e viene eseguita lato server. A fini di ispezione, decodificare il carico utile è tutto ciò che serve.

**Funziona offline?**
SÌ. La decodifica Base64 viene eseguita localmente nell'interno senza necessità di rete.

---

[Install TextForge from the Chrome Web Store →](https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba)
