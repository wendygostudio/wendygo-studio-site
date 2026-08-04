---
schemaVersion: 1
title: Rimuovi i segreti dai file di configurazione Kubernetes
description: >-
  Pulisci Kubernetes YAML prima di condividerlo con il supporto o gli assistenti
  AI. Rimuovi chiavi API, credenziali e token localmente con ScrubForge.
date: 2026-07-31T00:00:00.000Z
slug: remove-secrets-kubernetes-config
locale: it
translationKey: remove-secrets-kubernetes-config
product: scrubforge
contentType: use-case
primaryKeyword: rimuovere i segreti dalla configurazione Kubernetes
relatedPages: /it/scrubforge/
---

# Rimuovi i segreti dai file di configurazione Kubernetes

Kubernetes YAML spesso mescola la struttura di distribuzione con informazioni che dovrebbero rimanere all'interno del cluster: token di servizio, chiavi API, password con codifica base64 e credenziali di registro private. Prima di incollare un manifest in un ticket di supporto o in un assistente AI, rimuovi tali valori senza distruggere il contesto tecnico.

> **Importante:** base64 è codifica, non crittografia. Un valore in "data:" potrebbe comunque essere una credenziale recuperabile.

## Cosa recensire

- Campi "Secret" e "stringData" contenenti password o token.
- Variabili di ambiente come "AWS_SECRET_ACCESS_KEY", "GITHUB_TOKEN" o chiavi interne.
- URL con nomi utente e password incorporati.
- ConfigMap che contengono endpoint privati ​​o materiale di autenticazione.

L'obiettivo è mantenere leggibili nomi, relazioni e rientri sostituendo i valori letterali sensibili. L'eliminazione di interi blocchi può sembrare pulita, ma può nascondere la causa del problema che stai tentando di diagnosticare.

## Igienizzare prima della condivisione

1. Esporta una copia funzionante del manifest, mai il file utilizzato dal cluster.
2. Incolla la copia in [ScrubForge](/scrubforge/).
3. Esamina l'anteprima: chiavi e token dovrebbero diventare segnaposto coerenti.
4. Conferma che i nomi delle risorse, gli spazi dei nomi, le porte e i riferimenti rimangono visibili.
5. Condividi solo il risultato disinfettato e conserva l'originale nel tuo ambiente sicuro.

ScrubForge elabora il testo localmente nel browser. Rileva modelli comuni di segreti di servizio e mantiene lo stesso token per la stessa corrispondenza, in modo che un revisore possa comprendere le relazioni senza vederne il valore reale.

<div class="key-points">
<h3>Before sharing the result</h3>
<ul>
<li><strong>Check comments:</strong> credentials can hide outside YAML values.</li>
<li><strong>Review base64:</strong> encoding does not make a secret safe to share.</li>
<li><strong>Read the output:</strong> ensure the YAML still explains the problem.</li>
</ul>
</div>

## Quando igienizzare non basta

Se una credenziale reale è già stata pubblicata, trattala come compromessa: revocala ed emettine una sostitutiva. La sanificazione impedisce una nuova esposizione, ma non sostituisce la rotazione o la revisione delle autorizzazioni del cluster.

## Domande frequenti

### ScrubForge decodifica ogni segreto di Kubernetes?

Rileva modelli sensibili e formati comuni, ma dovresti comunque rivedere manualmente i campi specifici dell'organizzazione.

### Base64 è sicuro da condividere?

No. Base64 è una codifica reversibile, non una protezione.

### Il manifest è stato caricato?

ScrubForge lo disinfetta localmente. Dovresti comunque rivedere il testo finale prima di inviarlo a terzi.
