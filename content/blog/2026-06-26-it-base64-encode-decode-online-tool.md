---
schemaVersion: 1
title: >-
  Codifica e decodifica Base64 online: nessun caricamento, nessuna riga di
  comando
description: >-
  Codifica e decodifica Base64 nel tuo browser senza caricare nulla. TextForge è
  un'estensione gratuita di Chrome con conversione Base64 istantanea e oltre 50
  altre utilità di testo.
date: 2026-06-26T00:00:00.000Z
slug: base64-encode-decode-online-tool
locale: it
translationKey: base64-encode-decode-online-tool
product: textforge
contentType: how-to
primaryKeyword: '>-'
relatedPages: /textforge/
---

# Codifica e decodifica Base64 direttamente nel tuo browser

Base64 viene visualizzato ovunque in fase di sviluppo: token JWT, chiavi API nei file di configurazione, URI di dati di immagine in CSS, intestazioni HTTP Basic Auth, allegati MIME di posta elettronica. Il problema non è capire cosa sia Base64: è l'attrito di codificare o decodificare effettivamente una stringa quando è necessario.

Le due soluzioni alternative più comuni sono un comando da terminale ("echo -n "text" | base64`) o uno strumento web casuale. I comandi del terminale vanno bene se sei su una macchina Unix con un terminale aperto, ma sono goffi su Windows e richiedono il cambio di contesto. Gli strumenti web casuali funzionano ma stai inviando i tuoi dati, spesso chiavi API, token o valori di configurazione, a un server sconosciuto.

C'è un'opzione più pulita: un'estensione del browser che esegue la conversione localmente, senza caricamenti, senza uscire dal browser.

## Cos'è Base64?

Base64 è uno schema di codifica da binario a testo. Converte dati arbitrari in una stringa composta da 64 caratteri ASCII stampabili (A–Z, a–z, 0–9, `+`, `/`), con `=` utilizzato come riempimento. L'output codificato è circa il 33% più grande dell'input.

Lo scopo non è la compressione o la sicurezza. Serve per trasmettere in modo sicuro i dati attraverso sistemi che gestiscono solo testo o per incorporare dati binari in formati che prevedono stringhe (come JSON, XML o CSS). Chiunque abbia la stringa codificata può decodificarla.

## Quando hai effettivamente bisogno di Base64

**Token JWT:** un token Web JSON ha tre sezioni con codifica Base64url unite da punti. L'intestazione e il payload non sono crittografati: la decodifica della sezione centrale rivela le attestazioni JSON grezze: scadenza, ID utente, ruoli, ambiti.

**Autenticazione HTTP di base:** l'intestazione "Autorizzazione: Basic <valore>" contiene una stringa "nome utente:password" con codifica Base64. Decodificarlo è un modo rapido per verificare quali credenziali una richiesta sta effettivamente inviando.

**URI di dati:** piccole immagini e SVG possono essere incorporati direttamente in CSS o HTML come URI `data:image/png;base64,…`. È necessario codificare Base64 il contenuto del file per produrre la stringa di incorporamento.

**File di configurazione:** i segreti Kubernetes, le variabili di ambiente CI e molti altri strumenti memorizzano valori sensibili come stringhe con codifica Base64 in YAML o JSON. Codifichi il valore grezzo prima di incollarlo nel file config.

**MIME email:** gli allegati email sono codificati Base64 nel corpo del messaggio non elaborato. Durante il debug del recapito della posta elettronica o l'analisi dei messaggi MIME non elaborati, dovrai decodificare il payload dell'allegato.

## Perché non utilizzare semplicemente il terminale o uno strumento Web?

| Method | The friction |
|--------|-------------|
| `echo -n "…" \| base64` | Only works on macOS/Linux. Requires a terminal and the exact syntax (`-n` is critical — without it you encode a trailing newline). |
| `certutil -encode` (Windows) | Adds a header/footer you have to strip. Writes to a file, not stdout. Awkward for quick one-offs. |
| Online web tools | Your data goes to a remote server. Fine for generic text; bad habit for tokens, credentials, or keys. |
| Python one-liner | Requires Python installed and a terminal — more steps than it should be for something this common. |

Un'estensione del browser risolve tutti questi problemi: sempre disponibile, non è necessario alcun terminale, funziona interamente sul tuo computer.

## Come codificare e decodificare Base64 con TextForge

TextForge è un'estensione di Chrome con oltre 50 funzioni di utilità di testo. Sono incluse sia la codifica che la decodifica Base64. Nessun dato lascia il tuo computer: tutto viene eseguito nel contesto locale dell'estensione.

### Codifica: Testo → Base64

1. **Installa TextForge** dal Chrome Web Store. Blocca l'icona sulla barra degli strumenti in modo che sia sempre a portata di clic.
2. **Apri l'estensione** facendo clic sull'icona TextForge nella barra degli strumenti del browser.
3. **Incolla il tuo testo**: la stringa che desideri codificare. Può essere testo semplice, un URL, JSON o qualsiasi stringa necessaria nel formato Base64.
4. **Applica codifica Base64**: seleziona la funzione dal menu Strumenti. L'output codificato viene visualizzato immediatamente.
5. **Copia il risultato** negli appunti. Fatto: nessun caricamento della pagina, nessun viaggio di andata e ritorno sul server.

### Decodifica: Base64 → Testo

Il processo è identico al contrario: incolla la stringa Base64, seleziona Base64 Decode e copia il testo originale.

## Esempi pratici

**Ispezione di un carico utile JWT.** Dividi qualsiasi JWT in corrispondenza dei punti. La seconda sezione è il payload: JSON con codifica Base64url. Incollalo in TextForge, decodificalo e vedrai le affermazioni grezze. (Base64url utilizza `-` invece di `+` e `_` invece di `/`, ma per l'ispezione del carico utile decodifica correttamente.)

**Creazione di un segreto Kubernetes.** Kubernetes archivia i valori segreti come stringhe con codifica Base64 nel manifest. Codifica la tua password grezza o chiave API con TextForge e incolla il risultato direttamente nel blocco "data:" del tuo YAML segreto.

**Verifica di un'intestazione di autenticazione di base.** Cattura l'intestazione "Authorization" da DevTools, rimuovi il prefisso "Basic" iniziale, incolla il resto in TextForge, decodificalo e verifica che la coppia "nome utente:password" sia corretta.

## Altre utilità di testo in TextForge

Base64 è una delle oltre 50 funzioni in TextForge. Se lavori con il testo nel browser, troverai anche un uso frequente per: pulire gli spazi bianchi, convertire maiuscole e minuscole, ordinare righe, estrarre email o URL da un blocco di testo, generare UUID e creare slug dai titoli. È un toolkit di testo generico che rimane utile ben oltre Base64.

---

TextForge è installabile gratuitamente. La codifica e decodifica Base64 sono disponibili nella versione gratuita: non è richiesto alcun account o abbonamento.

[Install TextForge from the Chrome Web Store →](https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba)
