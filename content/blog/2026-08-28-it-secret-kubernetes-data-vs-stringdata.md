---
schemaVersion: 1
title: "Secret Kubernetes: data o stringData e quando serve Base64"
description: "Scopri quando un Secret Kubernetes richiede Base64 in data, quando stringData è più semplice e perché la codifica non sostituisce la crittografia."
date: 2026-08-28
slug: secret-kubernetes-data-vs-stringdata
locale: it
translationKey: kubernetes-secret-data-vs-stringdata
product: textforge
contentType: how-to
primaryKeyword: "Secret Kubernetes data o stringData"
relatedPages: /it/textforge/,/it/scrubforge/,/it/blog/base64-encode-kubernetes-secrets/,/it/blog/remove-secrets-kubernetes-config/
sourceUrls: https://kubernetes.io/docs/concepts/configuration/secret/,https://kubernetes.io/docs/concepts/security/secrets-good-practices/
faqs:
  - question: "I valori di data di un Secret Kubernetes richiedono Base64?"
    answer: "Sì. I valori nel campo data vengono serializzati come stringhe Base64. stringData accetta testo normale e il server API lo codifica quando crea o aggiorna il Secret."
  - question: "Devo usare data o stringData in un manifest?"
    answer: "Usa stringData per testo letterale se il tuo flusso di deploy lo supporta. Usa data quando ti serve la rappresentazione serializzata o il tuo strumento richiede valori già codificati."
  - question: "Base64 protegge un Secret Kubernetes?"
    answer: "No. Base64 è una codifica reversibile, non una crittografia. Proteggi manifest e accesso al cluster seguendo le indicazioni di Kubernetes."
---

# Secret Kubernetes: data o stringData e quando serve Base64

I campi `data` e `stringData` di un Secret Kubernetes rappresentano gli stessi valori logici, ma sono interfacce di inserimento diverse. `data` richiede stringhe codificate in Base64. `stringData` accetta testo normale e lascia al server API di Kubernetes il compito di codificarlo.

La differenza conta quando scrivi, controlli o modifichi un manifest. Nessuno dei due campi è però un confine di sicurezza: Base64 è codifica, non crittografia.

## La differenza pratica

Usa `data` quando il valore è già serializzato per l'API dei Secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: credenziali-app
type: Opaque
data:
  username: YWRtaW4=
  password: c2FtcGxlLXBhc3M=
```

Usa `stringData` quando vuoi scrivere valori letterali:

```yaml
stringData:
  username: admin
  password: sample-pass
```

La [documentazione Kubernetes sui Secret](https://kubernetes.io/docs/concepts/configuration/secret/) descrive `stringData` come un modo pratico per fornire valori non codificati. Avverte anche che `stringData` non funziona bene con server-side apply: verifica quindi il metodo di deploy.

## Quale campo scegliere?

`stringData` è spesso più leggibile per un nuovo manifest scritto a mano, se il tuo flusso lo supporta. `data` è utile quando un altro sistema genera già la forma serializzata, quando modifichi un manifest esistente o quando gli strumenti richiedono valori codificati.

Non inserire credenziali reali in un repository solo perché si trovano sotto `data`. Chiunque possa leggere il manifest può decodificarle. Kubernetes separa la sicurezza dell'accesso e della distribuzione del Secret dalla sua rappresentazione YAML.

## Codificare o decodificare localmente

Se un manifest contiene un valore in `data`, decodifica quando serve una copia locale per ispezionarlo. Per creare un valore `data`, codifica localmente il valore originale e copia solo il risultato nel manifest di lavoro.

TextForge può codificare e decodificare testo nel browser senza inviare il valore a un server Wendygo. Usa una copia e conserva l'originale nell'ambiente sicuro. Per condividere un manifest, [ScrubForge](https://wendygostudio.com/it/scrubforge/) è più adatto: pulisci prima la copia, invece di limitarti a codificare il Secret.

## Lista di controllo

1. Stai scrivendo un Secret nuovo da testo letterale? Valuta `stringData` dopo aver verificato il metodo di applicazione.
2. Stai modificando un campo `data` esistente? Decodifica solo una copia locale quando serve controllarlo.
3. La pipeline richiede `data`? Codifica localmente e valida il YAML.
4. Il manifest uscirà dall'ambiente sicuro? Rimuovi o sostituisci le credenziali prima di condividerlo.
5. Una credenziale potrebbe essere stata esposta? Ruotala; codifica o pulizia non annullano l'esposizione.

Consulta le [buone pratiche Kubernetes per i Secret](https://kubernetes.io/docs/concepts/security/secrets-good-practices/) insieme alla politica di accesso al tuo cluster.

## Domande frequenti

### I valori di `data` devono essere in Base64?

Sì. `data` viene serializzato come stringhe Base64. `stringData` accetta testo normale e Kubernetes lo codifica durante la creazione o l'aggiornamento.

### Devo usare `data` o `stringData`?

Usa `stringData` per testo letterale se il flusso lo supporta. Usa `data` se gli strumenti richiedono la forma serializzata.

### Base64 protegge un Secret?

No. È una codifica reversibile, non crittografia. Proteggi manifest, cluster e repository.
