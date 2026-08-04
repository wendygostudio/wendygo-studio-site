---
schemaVersion: 1
title: 'Come estrarre URL dal testo online: nessuna regex, nessun terminale'
description: 'Parola chiave: estrai URL dal testo, estrai collegamenti dal testo online'
date: 2026-06-26T00:00:00.000Z
slug: extract-urls-from-text
locale: it
translationKey: extract-urls-from-text
product: textforge
contentType: how-to
primaryKeyword: 'come estrarre URL dal testo online: nessuna regex, nessun terminale'
relatedPages: >-
  /it/textforge/,/it/blog/extract-emails-from-text/,/it/blog/base64-encode-decode-online-tool/
---

# Come estrarre URL dal testo online: nessuna regex, nessun terminale

**Parola chiave:** estrae URL dal testo, estrae collegamenti dal testo online

**Prodotto:** TextForge (estensione Chrome)

**Tipo:** Guida pratica · Variazione

---

Hai un muro di log API, un dump di file di configurazione o un documento pieno di collegamenti mescolati con il corpo del testo. Estrarre ogni URL a mano è noioso. L'esecuzione di un'espressione regolare richiede di ricordare lo schema. Caricare su uno strumento online significa inserire URL potenzialmente sensibili (endpoint API interni, dashboard private) sul server di qualcun altro.

TextForge è un'estensione di Chrome con una funzione di estrazione URL che viene eseguita interamente nel tuo browser. Incolla il testo, estrai, copia l'elenco. Niente lascia la tua macchina.

## Quando è necessario estrarre gli URL

**Log API e tracce delle richieste**
Le risposte API, i log delle richieste e gli output dei test spesso contengono URL incorporati insieme a codici di stato, timestamp e payload. Quando è necessario isolare gli URL dell'endpoint per il debug o il test, l'estrazione è più rapida della ricerca manuale.

**File di configurazione ed esportazioni**
I manifest Kubernetes, i file Docker Compose, le esportazioni env e i file .env a volte contengono URL combinati con chiavi, percorsi e commenti. Estrai gli URL per controllare gli endpoint con cui comunica il tuo servizio senza toccare il resto della configurazione.

**HTML raschiato o copiato**
Quando copi l'HTML da una pagina web in un editor di testo, ottieni un muro di collegamenti sepolti nel markup e nel corpo del testo. Estrai gli URL href per creare un elenco di tutte le destinazioni su una pagina, utile per il controllo dei collegamenti o il rilevamento dei collegamenti interrotti.

**Documentazione e runbook**
La documentazione interna, i runbook e i report sugli incidenti accumulano collegamenti nel corpo del testo, nelle tabelle e nelle note a piè di pagina. Estrai il set completo per visualizzare tutte le risorse a cui si fa riferimento nel documento senza eseguire la scansione riga per riga.

## Perché le alternative manuali non sono sufficienti

| Method | The friction |
|---|---|
| Scan by eye | Slow for anything over a page; easy to miss one or mistype a URL. |
| Regex in VS Code | Requires knowing the URL pattern and switching into find-and-replace mode. |
| Python re.findall | Requires a terminal, Python installed, and writing a pattern for http/https/ftp variations. |
| Online URL extractor | Your internal APIs, dev URLs, and config endpoints are sent to a third-party server. |

Un'estensione del browser rimuove ogni attrito: un clic, nessun terminale, tutta l'elaborazione locale.

## Come estrarre gli URL con TextForge

1. **Installa TextForge** dal Chrome Web Store e aggiungilo alla barra degli strumenti.
2. **Fai clic sull'icona TextForge** nella barra degli strumenti del browser.
3. **Incolla il tuo testo**: log, configurazioni, HTML copiato, qualsiasi cosa con URL incorporati.
4. **Seleziona Estrai URL** dal menu Strumenti. TextForge esegue la scansione dell'intero input e restituisce ogni URL che trova, uno per riga.
5. **Copia il risultato** istantaneamente negli appunti.

## Esempio pratico

Input (registro misto e testo):
```
Errore alle 12:34:05: richiesta a https://api.internal.example.com/v1/users non riuscita.
Vedere il runbook all'indirizzo https://wiki.company.net/incidents/api-failures
Endpoint di fallback: https://api-backup.example.com/v1/users (non testato)
Contatto: admin@example.com
```

Dopo l'estrazione degli URL:
```
https://api.internal.example.com/v1/users
https://wiki.company.net/incidents/api-failures
https://api-backup.example.com/v1/users
```

Tre URL estratti da testo misto contenente un'e-mail, timestamp e linguaggio naturale: tutti i formati estratti, senza bisogno di regex.

## Altre funzioni di estrazione in TextForge

TextForge può anche estrarre **e-mail** e **indirizzi IP** dal testo: utile quando i registri mescolano più tipi di dati ed è necessario isolarne uno. La versione gratuita include tutte e tre le funzioni di estrazione.

## Domande frequenti

**TextForge estrae gli URL dai tag HTML?**
SÌ. Gli URL all'interno di `href=`, `src=` e altri attributi HTML vengono abbinati, così come gli URL semplici nel testo.

**TextForge può gestire URL con parametri di query?**
SÌ. L'intero URL incluso il percorso, la stringa di query e il frammento (#) viene estratto come un'unica unità.

**Estrai URL è gratuito in TextForge?**
SÌ. Tutte le funzioni di estrazione (e-mail, URL, indirizzi IP) sono incluse nella versione gratuita. Nessun account richiesto.

**Cosa succede ai miei URL quando utilizzo TextForge?**
Niente lascia il tuo browser. TextForge è un'estensione di Chrome che elabora il testo localmente sul tuo computer. Nessun dato viene inviato da nessuna parte.

**Posso estrarre gli URL da una pagina web attiva che sto visualizzando?**
TextForge funziona sul testo che incolli nella sua area di input. Per estrarre collegamenti da una pagina, seleziona tutto il testo (Ctrl+A), copialo e incollalo in TextForge. L'estensione quindi estrae ogni URL in quel testo.

---

**L'installazione di TextForge è gratuita.** Estrai URL, Estrai email ed Estrai IP sono tutti inclusi nella versione gratuita: non è richiesto alcun account o abbonamento.

**[Installa TextForge — gratuitamente](https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba)**

---

## Guide correlate

- [How to Extract Emails from Text Online — No Manual Hunting](/blog/extract-emails-from-text/)
- [How to Base64 Encode and Decode Online — No Upload, No Command Line](/blog/base64-encode-decode-online-tool/)
