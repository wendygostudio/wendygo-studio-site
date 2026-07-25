---
schemaVersion: 1
title: "Sanificare una Config Router MikroTik Prima di Condividerla"
description: "MikroTik nasconde le password negli export RouterOS di default. Topologia, commenti e indirizzi server restano visibili. Ecco cosa controllare prima."
date: 2026-07-25
slug: sanificare-configurazione-router-mikrotik
locale: it
translationKey: sanitize-mikrotik-router-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanificare una config router MikroTik prima di condividerla"
relatedPages: /it/scrubforge/,/it/blog/cosa-insegna-la-violazione-sonicwall/,/it/risorse/
sourceUrls: https://help.mikrotik.com/docs/spaces/ROS/pages/380076066/List+of+menus+with+sensitive+parameters,https://help.mikrotik.com/docs/spaces/ROS/pages/328155/Configuration+Management,https://mikrotik.com/download/changelogs
heading: "Sanificare una Config Router MikroTik Prima di Condividerla"
shortTitle: "Sanificare una config MikroTik"
intro: "RouterOS nasconde le password in /export per impostazione predefinita. Restano comunque topologia, commenti e indirizzi server nel file che incolli in un forum, un ticket o una chat IA."
faqs:
  - question: "show-sensitive sostituisce la necessità di sanificare una config MikroTik?"
    answer: "No. show-sensitive controlla solo se RouterOS stampa il suo elenco predefinito di campi sensibili — password, chiavi, secret. Tutto il resto nell'export, inclusi indirizzi IP, commenti e indirizzi server, resta comunque visibile. È esattamente a questo che serve ScrubForge."
  - question: "La sanificazione romperà la config se devo reimportarla?"
    answer: "Sanifica solo una copia destinata alla discussione, a un post sul forum o a un ticket di supporto — non il file che intendi reimportare. Reimportare uno script richiede i valori reali delle credenziali, quindi tieni il tuo export di lavoro separato dalla versione sanificata che condividi pubblicamente."
  - question: "ScrubForge riconosce specificamente la sintassi RouterOS?"
    answer: "Sì. RouterOS è una delle dodici sintassi di configurazione dispositivi coperte dalla libreria di pattern di ScrubForge, insieme a Cisco, FortiGate, Juniper e Palo Alto, tra le altre."
  - question: "Cosa fare se ho già pubblicato una config MikroTik non sanificata?"
    answer: "Modifica o elimina il post se la piattaforma lo consente, poi ruota qualsiasi credenziale esposta — password, chiavi pre-condivise, secret RADIUS. Cambiare i valori dopo il fatto non annulla ciò che era visibile mentre il post era attivo."
---

Pubblicare un export di configurazione router in un thread del forum o in un ticket di supporto è lavoro di routine per un amministratore, e gli admin MikroTik ne hanno fatto molto questo mese: RouterOS 7.21.5 (long-term) e 6.49.20 sono usciti entrambi il 6 luglio 2026, e un aggiornamento di solito significa estrarre un `/export` fresco per confrontare prima e dopo.

> **Cosa nasconde davvero show-sensitive**
> Per impostazione predefinita, `/export` maschera password, chiavi e secret in un elenco documentato di menu — chiavi WireGuard, secret RADIUS, password PPP, password community SNMP e altri quaranta campi circa. Non tocca indirizzi IP, commenti o qualsiasi cosa fuori da quell'elenco.

## Cosa nasconde già RouterOS per te

La documentazione di MikroTik è precisa su questo: il comando `export` "non esporta le password utente di sistema, i certificati installati, le chiavi SSH, né il database Dude o User-manager", e tutto il resto considerato sensibile viene mascherato a meno che tu non aggiunga `show-sensitive` al comando. Esiste una tabella di riferimento ufficiale che elenca esattamente quale menu e quale campo viene nascosto: l'[elenco dei menu con parametri sensibili](https://help.mikrotik.com/docs/spaces/ROS/pages/380076066/List+of+menus+with+sensitive+parameters) copre `private-key` e `preshared-key` di WireGuard, `secret` RADIUS, `authentication-password` SNMP, `secret` PPP, chiavi IPsec, `password` VRRP e altro ancora.

È un comportamento predefinito genuinamente utile. Ma è anche facile leggerlo come "l'export è sicuro da incollare ovunque", il che non è del tutto vero.

## Cosa contiene ancora un export "pulito"

Mascherare un elenco fisso di nomi di parametri non tocca il testo libero né nulla fuori da quell'elenco. Un `/export` predefinito include ancora:

<div class="key-points">
  <h3>Ancora completamente visibile dopo il mascheramento show-sensitive</h3>
  <ul>
    <li>ogni indirizzo IP configurato, subnet ed endpoint peer WAN;</li>
    <li>commenti di interfacce e VLAN, che spesso nominano sistemi interni o clienti;</li>
    <li>indirizzi dei server RADIUS, NTP, DNS e SNMP — l'indirizzo, non solo il secret;</li>
    <li>nomi di community SNMP, quando sono stringhe descrittive anziché password;</li>
    <li>identità di sistema, peer di routing e liste di indirizzi del firewall.</li>
  </ul>
</div>

Niente di tutto ciò è un bug. La [guida alla gestione della configurazione di MikroTik](https://help.mikrotik.com/docs/spaces/ROS/pages/328155/Configuration+Management) mostra essa stessa subnet interne dall'aspetto reale nei propri esempi di export, perché la topologia è esattamente ciò di cui un'importazione ha bisogno. Semplicemente non è qualcosa che vuoi mostrare a uno sconosciuto su un forum, o a una coda di supporto esterna, insieme al tuo IP pubblico.

## Sanificare prima ancora che show-sensitive conti qualcosa

<div class="step-card">
  <span class="step-label">Procedura</span>
  <strong>Esportare, incollare, controllare, condividere</strong>
  <p>Esegui <code>/export file=config</code> come al solito — ometti <code>show-sensitive</code>, non ti serve per una richiesta di supporto o un post sul forum. Apri [ScrubForge](/it/scrubforge/), incolla l'output, e segnala le stringhe simili a credenziali corrispondenti alla sintassi RouterOS, sostituendo ogni valore univoco con un token coerente come <code>[RADIUS_SECRET_1]</code>. Tutto viene eseguito localmente nella scheda del browser; nulla viene caricato altrove.</p>
</div>

| Prima (export grezzo) | Dopo (sanificato) |
|---|---|
| `set 0 password=Adm1nR0S!` | `set 0 password=[PASSWORD_1]` |
| `secret="Sup3rShared" address=10.20.0.1` | `secret=[RADIUS_SECRET_1] address=10.20.0.1` |
| `private-key="wG9K...=="` | `private-key=[WG_KEY_1]` |

Nota che l'indirizzo del peer resta invariato. È esattamente ciò di cui un lettore del forum o un tecnico di supporto ha bisogno per aiutarti — non il secret accanto.

## La stessa abitudine funziona per ogni fornitore

Abbiamo già trattato questo procedimento per le config Cisco e FortiGate. MikroTik è una delle dodici sintassi di fornitori che ScrubForge riconosce, insieme a Juniper e Palo Alto — stessa idea, nomi di campo diversi ogni volta. Se stai incollando in un ticket di supporto anziché in un forum pubblico, vale la stessa abitudine di sanificare prima che il file lasci la tua macchina.

## Prima di pubblicare

Una breve nota accanto all'export sanificato aiuta: "credenziali sostituite con token segnaposto; la struttura è intatta." Dice a chiunque legga il thread che non c'è una password attiva al suo interno, e richiede dieci secondi da aggiungere.

## Domande frequenti

### show-sensitive sostituisce la necessità di sanificare una config MikroTik?

No. show-sensitive controlla solo se RouterOS stampa il suo elenco predefinito di campi sensibili — password, chiavi, secret. Tutto il resto nell'export, inclusi indirizzi IP, commenti e indirizzi server, resta comunque visibile. È esattamente a questo che serve ScrubForge.

### La sanificazione romperà la config se devo reimportarla?

Sanifica solo una copia destinata alla discussione, a un post sul forum o a un ticket di supporto — non il file che intendi reimportare. Reimportare uno script richiede i valori reali delle credenziali, quindi tieni il tuo export di lavoro separato dalla versione sanificata che condividi pubblicamente.

### ScrubForge riconosce specificamente la sintassi RouterOS?

Sì. RouterOS è una delle dodici sintassi di configurazione dispositivi coperte dalla libreria di pattern di ScrubForge, insieme a Cisco, FortiGate, Juniper e Palo Alto, tra le altre.

### Cosa fare se ho già pubblicato una config MikroTik non sanificata?

Modifica o elimina il post se la piattaforma lo consente, poi ruota qualsiasi credenziale esposta — password, chiavi pre-condivise, secret RADIUS. Cambiare i valori dopo il fatto non annulla ciò che era visibile mentre il post era attivo.
