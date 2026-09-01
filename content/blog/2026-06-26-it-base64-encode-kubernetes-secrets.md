---
schemaVersion: 1
title: Base64 Codifica i segreti Kubernetes localmente (nessuno strumento Web)
description: >-
  I manifest segreti Kubernetes richiedono valori con codifica Base64. Ecco come
  codificare i tuoi segreti grezzi localmente nel tuo browser: senza terminale,
  senza sito di terze parti.
date: 2026-06-26T00:00:00.000Z
slug: base64-encode-kubernetes-secrets
locale: it
translationKey: base64-encode-kubernetes-secrets
product: textforge
contentType: how-to
primaryKeyword: come codificare base64 i segreti di Kubernetes senza uno strumento Web
relatedPages: /it/textforge/,/it/blog/secret-kubernetes-data-vs-stringdata/
---

# Come codificare Base64 i segreti Kubernetes senza uno strumento Web

Kubernetes archivia i valori sensibili nei manifest segreti. A differenza dei ConfigMap, che accettano testo semplice, i campi "dati" segreti richiedono valori con codifica Base64. Molti sviluppatori incollano password grezze e chiavi API negli strumenti Base64 online, che inviano tali credenziali a un server di terze parti.

C'è un'opzione più sicura: codifica direttamente nel tuo browser utilizzando un'estensione di Chrome che non trasmette mai i tuoi dati.

Se devi scegliere tra `data` e `stringData`, consulta prima la [guida a data e stringData](/it/blog/secret-kubernetes-data-vs-stringdata/) prima di codificare manualmente un valore.

## Perché Kubernetes utilizza Base64

I manifest Kubernetes Secret hanno il seguente aspetto:

```yaml
APIVersione: v1
gentile: Segreto
metadati:
nome: credenziali db
tipologia: Opaco
dati:
password: c3VwZXJzZWNyZXQ=
chiave API: c2tfdGVzdF84YzhiNDU2MA==
```

I valori in "data:" sono codificati Base64. I valori grezzi (`supersecret`, `sk_test_8c8b4560`) non vengono mai archiviati direttamente nel manifest.

**Importante:** Base64 non è crittografia. Chiunque abbia accesso al manifest segreto può decodificare i valori immediatamente. I segreti Kubernetes forniscono il controllo dell'accesso a livello di cluster: la codifica Base64 è puramente un requisito di formato dell'API, non una misura di sicurezza.

## Codifica dei valori segreti con TextForge

TextForge è un'estensione di Chrome con oltre 50 utilità di testo. La codifica Base64 è disponibile nella versione gratuita e viene eseguita interamente in locale.

1. **Apri TextForge**: fai clic sull'icona dell'estensione nella barra degli strumenti del browser.
2. **Incolla il valore segreto non elaborato**: la tua password, chiave API, stringa di connessione o qualsiasi valore che deve essere inserito nel manifest.
3. **Applica codifica Base64**: la stringa codificata viene visualizzata immediatamente.
4. **Copia l'output** e incollalo nel blocco `data:` del tuo YAML Kubernetes.

Nessun terminale, nessuno strumento web, nessun dato lascia la tua macchina.

## Usando invece `stringData`

Kubernetes accetta anche un campo "stringData" che accetta valori di testo semplice: l'API li codifica automaticamente:

```yaml
stringData:
parola d'ordine: supersegreta
```

`stringData` va bene per i valori che stai creando di recente. Ma se stai leggendo un manifest segreto esistente, i valori memorizzati saranno sempre in "data:" nel formato Base64, ovvero quando dovrai decodificarli per l'ispezione.

## Decodifica per verificare

Per verificare un valore codificato esistente in un manifest, incollalo in TextForge e applica Base64 Decode. Ottieni immediatamente il valore grezzo, senza eseguire:

```bash
kubectl ottieni credenziali db segrete -o jsonpath='{.data.password}' | base64 --decodifica
```

## Domande frequenti

**È richiesta la codifica Base64 per tutti i segreti Kubernetes?**
Solo per il campo "dati:". Se utilizzi `stringData:`, Kubernetes gestisce la codifica. La maggior parte degli strumenti e dei tutorial utilizzano "data:" negli esempi, da qui la necessità di codificare manualmente.

**Posso codificare valori su più righe come i certificati TLS?**
SÌ. Incolla il certificato completo (inclusi l'intestazione e il piè di pagina `-----BEGIN CERTIFICATE-----`) in TextForge e codificalo. La stringa risultante va nel campo "data:".

**Questa funzione è gratuita in TextForge?**
SÌ. La codifica e decodifica Base64 sono disponibili nella versione gratuita: non è richiesto alcun account o abbonamento.

---

[Install TextForge from the Chrome Web Store →](https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba)
