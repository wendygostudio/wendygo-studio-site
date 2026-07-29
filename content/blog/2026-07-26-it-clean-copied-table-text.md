---
schemaVersion: 1
title: "Pulire localmente il testo di una tabella"
description: ">-"
date: 2026-07-26
slug: clean-copied-table-text
locale: it
translationKey: clean-copied-table-text
product: textforge
contentType: workflow
primaryKeyword: "pulire il testo della tabella copiato"
relatedPages: /textforge/,/blog/extract-emails-from-text/,/blog/clean-text-online/
---

La copia di una tabella da un PDF, da una dashboard o da un portale di supporto spesso produce un testo che sembra quasi corretto. Le colonne si allontanano, una singola cella diventa tre righe e le intestazioni compaiono di nuovo a metà dell'incollaggio. La parte pericolosa è che il risultato può ancora sembrare abbastanza plausibile da poter essere riutilizzato senza controllarlo.

> **Considera il layout copiato come formattazione non attendibile.** Mantieni i valori, ma verifica quali spazi e interruzioni di riga hanno un significato prima di trasformarli.

## Separa i record dal rumore del layout

Inizia con un breve campione, non con l'intera esportazione. Identifica ciò che separa i record effettivi: forse una riga per riga, forse una scheda, forse un'etichetta ripetuta. Quindi cercare il rumore introdotto dalla sorgente.

| Symptom | Likely cause | Safer action |
|---|---|---|
| Random extra spaces | Visual column alignment | Normalize spaces |
| A value split across lines | Narrow PDF column | Join only that field after checking it |
| Repeated heading | Page break | Remove the repeated heading |

<div class="step-card">
  <span class="step-label">Step 1</span>
  <strong>Keep an untouched copy</strong>
  <p>Paste the original into a temporary note first. A reversible workflow makes it easy to compare the cleaned result against the source.</p>
</div>

## Utilizzare un flusso di lavoro di trasformazione locale

[TextForge](/textforge/) is designed for short text transformations in the browser. Paste the sample, apply one cleanup at a time, and inspect the result after each step. Cleaning spaces is different from joining lines; use the first when columns were padded visually, and the second only when a record was broken by layout.

Questa distinzione è importante per elenchi di contatti, etichette di inventario, URL o valori di configurazione. Una trasformazione ampia può creare un output dall'aspetto pulito unendo automaticamente due record separati. Se la fonte contiene indirizzi o valori simili a quelli email, confronta il risultato con un [flusso di lavoro di estrazione email](/blog/extract-emails-from-text/) prima di incollarlo in un altro sistema.

<div class="key-points">
  <h3>Three checks before you copy the result</h3>
  <ul>
    <li>Count a few records in the source and the cleaned output.</li>
    <li>Search for one value that was split across a line break.</li>
    <li>Confirm that repeated headers did not become data rows.</li>
  </ul>
</div>

## Rendi prevedibile il prossimo incollaggio

Una volta che il testo è pulito, scegli deliberatamente il bersaglio. Un foglio di calcolo potrebbe richiedere tabulazioni o virgole; un documento potrebbe richiedere un record per riga; un campo di ricerca potrebbe richiedere solo i valori. Salva la trasformazione come ricetta ripetibile quando esegui regolarmente la stessa pulizia.

Per la pulizia generale del testo incollato, consulta la [guida alla pulizia del testo locale](/blog/clean-text-online/). L'abitudine importante non è un pulsante specifico: preservare l'originale, modificare una regola di formattazione alla volta e convalidare alcune righe prima di trattare l'output come dati.

## Domande frequenti

### Perché il testo della tabella copiata appare rotto?

I PDF e le tabelle Web memorizzano il layout in modo diverso. La copia può trasformare la spaziatura visiva in spazi letterali e interruzioni di riga.

### Posso pulire i dati copiati senza caricarli?

SÌ. Un flusso di lavoro del browser locale mantiene il testo sul tuo dispositivo mentre lo controlli e lo trasformi.

### Devo rimuovere ogni interruzione di riga?

No. Mantieni le interruzioni di riga che separano i record reali; rimuovere solo le interruzioni che sono chiaramente artefatti del layout.
