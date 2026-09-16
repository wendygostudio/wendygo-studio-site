---
schemaVersion: 1
title: "Come sanificare i log GitHub prima di condividerli"
description: "Una checklist pratica per rimuovere token, URL dei repository e contesto privato dai log GitHub prima di condividerli con il supporto o uno strumento IA."
date: 2026-09-16
slug: sanificare-log-github-prima-condivisione
locale: it
translationKey: sanitize-github-logs-before-sharing
product: scrubforge
contentType: how-to
primaryKeyword: "sanificare log GitHub"
relatedPages: /it/scrubforge/,/it/blog/sanificare-configurazione-paloalto/,/it/blog/permessi-estensioni-chrome-checklist/
sourceUrls: https://docs.github.com/en/code-security/tutorials/remediate-leaked-secrets/remediating-a-leaked-secret,https://docs.github.com/en/actions/reference/security/secrets,https://docs.github.com/en/actions/reference/security/secure-use,https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
faqs:
  - question: "È sufficiente eliminare un token da un log GitHub?"
    answer: "No. Considera compromesso un segreto attivo esposto, revocalo o ruotalo con il provider, poi rimuovi o oscura la copia che vuoi condividere."
  - question: "GitHub oscura ogni segreto nei log di Actions?"
    answer: "No. GitHub documenta l’oscuramento automatico dei valori supportati, ma i valori trasformati o strutturati possono restare visibili; controlla i log e maschera i valori sensibili generati."
  - question: "Cosa devo rimuovere prima di condividere un log GitHub?"
    answer: "Rimuovi token, header di autorizzazione, URL di repository privati, host interni, dati personali e payload non necessari per riprodurre il problema."
  - question: "Posso sanificare i log GitHub in locale?"
    answer: "Sì. Un flusso locale per testo e configurazioni riduce l’esposizione durante l’invio, ma il risultato va controllato manualmente e i segreti attivi vanno gestiti separatamente."
---

# Come sanificare i log GitHub prima di condividerli

I log di GitHub Actions sono prove utili quando una build fallisce, ma possono contenere più contesto del necessario per il supporto o un assistente IA: URL del repository, branch, host interno, percorso locale, titolo della pull request, indirizzi email, header di autorizzazione o token stampati da un comando.

Lavora su una copia, rimuovi il contesto privato non necessario, controlla il risultato e condividilo solo dopo. È una riduzione della divulgazione, non una risposta agli incidenti: se compare un segreto attivo, revocalo o ruotalo prima presso il provider.

## Cosa controllare

Cerca nella copia:

- token, chiavi API, JWT, chiavi private e header `Authorization`;
- URL di repository privati, host interni, ID di account cloud e percorsi locali;
- nomi di deployment, cluster, database e variabili d’ambiente;
- email, nomi utente, testo dei ticket o payload con dati personali;
- report e corpi delle richieste non necessari per riprodurre l’errore.

Conserva l’errore, il codice di uscita, le versioni rilevanti e l’input minimo. Sostituisci i valori con segnaposto stabili come `<GITHUB_TOKEN>` o `<HOST_INTERNO>` per mantenere la forma del problema senza rivelare il valore reale.

## Procedura locale

1. Copia il log in un file locale temporaneo e conserva l’originale nell’ambiente sicuro.
2. Cerca `token`, `secret`, `password`, `Authorization`, `BEGIN PRIVATE KEY`, URL, host ed email. Controlla anche le stringhe opache molto lunghe.
3. Sostituisci i valori sensibili con segnaposto tipizzati, usando lo stesso segnaposto per valori ripetuti.
4. Elimina i passaggi non pertinenti, i corpi delle richieste e i dump dell’ambiente.
5. Leggi interamente il file finale, compresi blocchi di codice, righe vicine e allegati.
6. Condividi la copia sanificata nel canale approvato e annota i tipi di valore rimossi.

ScrubForge può aiutare nella pulizia locale di una copia di log o configurazione. La bozza resta nella scheda del browser finché non decidi di copiarla. Controlla comunque l’output: nessun sanificatore conosce automaticamente le regole di divulgazione della tua organizzazione.

## Cosa non garantisce il masking di GitHub

La [documentazione GitHub sui Secrets](https://docs.github.com/en/actions/reference/security/secrets) descrive l’oscuramento automatico dei valori segreti supportati nei log dei workflow, ma non è una revisione completa. Valori trasformati, codificati, divisi o strutturati possono non essere riconosciuti. GitHub raccomanda anche di mascherare i valori sensibili non salvati come GitHub Secrets e di evitare comandi che stampano segreti.

Se un workflow deve usare un segreto esterno per una diagnosi, mascheralo prima che un comando possa stamparlo. Controlla comunque il log prima di esportarlo: può rivelare nomi di repository, topologia, dati degli utenti o un valore ricostruito.

## Se un segreto è già stato esposto

Revocalo o ruotalo seguendo la procedura del provider, individua dove è stato conservato il log e controlla gli accessi. Cancellare una riga dalla vista corrente non elimina le copie negli artefatti, nelle cache, nei ticket, negli export delle chat o nella cronologia del repository. Se il segreto è entrato nella cronologia Git, segui dopo la revoca i passaggi di coordinamento e riscrittura indicati da GitHub.

## Checklist finale

1. Tutti i valori simili a credenziali sono stati rimossi o sostituiti?
2. I segreti attivi esposti sono stati revocati o ruotati?
3. URL, host interni e dati personali sono davvero necessari?
4. Hai controllato allegati, screenshot e comandi incollati?
5. Il log conserva errore, versioni e contesto di riproduzione?

Leggi anche [come sanificare una configurazione Palo Alto PAN-OS prima di condividerla](/it/blog/sanificare-configurazione-paloalto/) e [ScrubForge](/it/scrubforge/).

## Domande frequenti

### È sufficiente eliminare un token da un log GitHub?

No. Considera compromesso il segreto attivo, revocalo o ruotalo, poi pulisci la copia da condividere.

### GitHub oscura ogni segreto nei log di Actions?

No. I valori supportati possono essere mascherati, ma quelli trasformati o strutturati possono sfuggire. Controlla i log e maschera esplicitamente i valori generati.

### Cosa devo rimuovere prima di condividere un log?

Token, header di autorizzazione, URL private, host interni, dati personali e payload non necessari.

### Posso sanificare i log in locale?

Sì, ma controlla manualmente il risultato e gestisci separatamente i segreti attivi.
