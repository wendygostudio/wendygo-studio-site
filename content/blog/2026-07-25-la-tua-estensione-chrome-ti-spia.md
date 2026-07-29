---
schemaVersion: 1
title: "La Tua Estensione Chrome Ti Spia? Checklist 2026"
description: "Google e Microsoft hanno rimosso un'estensione fidata con 1,6M installazioni per raccolta dati nascosta. Come verificare se le tue sono sicure."
date: 2026-07-25
slug: la-tua-estensione-chrome-ti-spia
locale: it
translationKey: is-your-chrome-extension-spying-on-you
product: slimeforge
contentType: how-to
primaryKeyword: "la mia estensione Chrome mi spia"
relatedPages: /slimeforge/
---

Se usi un'estensione Chrome o Edge per gestire la tua concentrazione, le tue intestazioni HTTP, le tue password o altro, la rimozione di ModHeader merita cinque minuti del tuo tempo. Non perché ModHeader fosse uno strumento marginale — aveva 1,6 milioni di installazioni e un decennio di fiducia — ma per il modo esatto in cui nascondeva ciò che faceva.

> **Cosa è successo realmente**
> Il 3 luglio 2026, Microsoft ha rimosso ModHeader dallo store di componenti aggiuntivi di Edge. Il 10 luglio, Google ha fatto lo stesso rimuovendola dal Chrome Web Store. La società di sicurezza [Stripe OLT](https://thehackernews.com/2026/07/google-and-microsoft-pull-modheader.html) ha scoperto che l'estensione ufficiale, firmata crittograficamente, conteneva un raccoglitore completo di cronologia di navigazione: generava un'impronta del dispositivo, cifrava il dominio di ogni pagina visitata, ed era progettata per caricare l'elenco quotidianamente su un server esterno. Il raccoglitore non era attivo — una lista di autorizzazione interna vuota lo teneva disattivato — ma attivarla avrebbe richiesto solo un aggiornamento di routine, senza nuovi permessi, senza alcun clic da parte dell'utente.

## Perché questo conta anche se non usi ModHeader

ModHeader è uno strumento per sviluppatori per modificare le intestazioni HTTP, non un'estensione di produttività. Ma lo schema che ha rivelato si applica direttamente a timer di concentrazione, gestori di schede, e qualsiasi altra estensione che richieda accesso ampio:

<div class="key-points">
  <h3>Perché le scansioni automatizzate non l'hanno rilevato</h3>
  <ul>
    <li><strong>La cifratura nascondeva il payload</strong> — uno scanner vede testo cifrato, non un elenco di domini, quindi nulla di leggibile ha mai lasciato il dispositivo durante i test.</li>
    <li><strong>Una lista di autorizzazione vuota bloccava l'upload</strong> — il codice di raccolta veniva eseguito, ma la chiamata di rete che alimentava semplicemente non si attivava mai, quindi i sandbox non vedevano traffico in uscita.</li>
    <li><strong>Il codice dannoso era minificato in una funzionalità legittima e funzionante</strong> — l'estensione continuava a fare esattamente ciò che dichiarava, cosa che la maggior parte delle revisioni manuali controlla.</li>
  </ul>
</div>

I verificatori di rischio automatizzati hanno classificato l'estensione a basso rischio, alcuni fino a 95 su 100. Una scheda firmata con anni di buone recensioni segnalava agli utenti che era affidabile. Nessuno dei due segnali l'ha rilevato.

## Una checklist pratica prima di fidarti di un'estensione

<div class="step-card">
  <span class="step-label">Procedura</span>
  <strong>Cinque controlli che richiedono meno di due minuti</strong>
  <p>Apri <code>chrome://extensions</code>, clicca su "Dettagli" per tutto ciò che usi quotidianamente, e verifica: chiede di "leggere e modificare tutti i tuoi dati su tutti i siti web" quando la sua funzione dichiarata non lo richiede? Ha cambiato proprietario di recente, o è passata da gratuita a "supportata da pubblicità", uno schema che i ricercatori di sicurezza segnalano ripetutamente dal 2021? Lo sviluppatore pubblica una politica sulla privacy che corrisponde davvero a ciò che il codice deve fare? Ha ricevuto un aggiornamento nelle ultime settimane senza changelog? E, se possibile, l'estensione funziona con la connessione di rete disattivata? Uno strumento genuinamente locale continuerà a funzionare; uno che telefona a casa, no.</p>
</div>

| Segno di un'estensione a rischio minore | Segno che merita indagine |
|---|---|
| Richiede solo i permessi necessari alla sua funzione dichiarata | Richiede ampio accesso agli host "per sicurezza" |
| Stesso proprietario e changelog chiaro nel tempo | Ha cambiato proprietario di recente o è diventata supportata da pubblicità |
| Funziona completamente offline se la sua funzione non richiede rete | Effettua chiamate di rete che una funzione puramente locale non dovrebbe richiedere |
| Trasparente sul non raccogliere dati di navigazione | Politica sulla privacy vaga o assente |

La [politica del Chrome Web Store](https://developer.chrome.com/docs/webstore/program-policies/policies) di Google chiede già agli sviluppatori di richiedere i permessi più ristretti necessari a una funzione, e vieta di raccogliere attività di navigazione al di fuori di uno scopo dichiarato e visibile all'utente. Dal 1° agosto 2026, entra in vigore l'[applicazione di regole più severe sulla raccolta dati](https://developer.chrome.com/blog/cws-policy-updates-2026) in tutto lo store — ma è una base minima, non una garanzia. Limita solo ciò che un'estensione conforme è *autorizzata* a fare, e ModHeader non dichiarava nemmeno ciò che aveva costruito.

## Cosa ti offre davvero "solo locale"

Il nucleo di [SlimeForge](/it/slimeforge/) — timer, progresso dell'animale e dati di sessione — funziona sul dispositivo senza richiedere un account. Il manifest dichiara `storage`, `alarms`, `scripting` e `activeTab` per il timer e le funzioni facoltative nelle pagine. L'attivazione della licenza può contattare Creem; le funzioni Gemini Nano facoltative vengono eseguite localmente quando supportate. È più preciso che affermare che l'estensione non effettua mai richieste di rete.

## Domande frequenti

### Come ha superato ModHeader le scansioni di sicurezza di Chrome per anni?

Il raccoglitore era cifrato e bloccato dietro una lista di autorizzazione interna pubblicata vuota, quindi il passaggio di upload non veniva mai eseguito durante le scansioni. Uno scanner vede testo cifrato e nessun traffico in uscita, esattamente come appare un'estensione pulita. I ricercatori di Stripe OLT lo hanno trovato solo leggendo direttamente il codice minificato.

### Di quali permessi ha davvero bisogno un'estensione di concentrazione o produttività?

Un'estensione per la concentrazione dovrebbe richiedere solo i permessi necessari alle funzioni dichiarate. SlimeForge dichiara `storage`, `alarms`, `scripting` e `activeTab`; l'accesso facoltativo ai siti viene richiesto solo quando l'utente attiva funzioni all'interno delle pagine.

### Un'estensione popolare e ben valutata è automaticamente sicura?

No. ModHeader aveva 1,6 milioni di installazioni, una lunga reputazione, e punteggi di rischio automatizzati fino a 95 su 100 che la classificavano a basso rischio — e includeva comunque un raccoglitore di dati funzionante. Il numero di installazioni e la valutazione misurano la popolarità, non ciò che fa il codice dopo un aggiornamento.

### Disinstallare un'estensione dannosa rimuove i dati già raccolti?

Disinstallarla la rimuove dal browser e cancella il suo storage locale, ma non annulla nulla di già inviato ai server dello sviluppatore. Se hai mai incollato chiavi API, token o password nei campi di un'estensione, ruotale indipendentemente dal fatto che quell'estensione risulti compromessa o meno.
