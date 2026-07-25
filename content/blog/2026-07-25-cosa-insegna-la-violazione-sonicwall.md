---
schemaVersion: 1
title: "Cosa Insegna la Violazione SonicWall Sul Condividere Config"
description: "I backup cloud di SonicWall hanno esposto i dati di config di tutti i clienti. Se quel backup non era sicuro, non lo è nemmeno un ticket di supporto."
date: 2026-07-25
slug: cosa-insegna-la-violazione-sonicwall
locale: it
translationKey: what-the-sonicwall-backup-breach-teaches-about-config-sharing
product: scrubforge
contentType: use-case
primaryKeyword: "è sicuro condividere un backup di configurazione firewall"
relatedPages: /it/scrubforge/,/it/blog/sanificare-configurazione-router-mikrotik/,/it/risorse/
sourceUrls: https://www.sonicwall.com/support/notices/mysonicwall-cloud-backup-file-incident/kA1VN0000000RoD0AU,https://www.cisa.gov/news-events/alerts/2025/09/22/sonicwall-releases-advisory-customers-after-security-incident
heading: "Cosa Insegna la Violazione SonicWall Sul Condividere Config"
shortTitle: "La lezione della violazione SonicWall"
intro: "SonicWall ha confermato che un attacco di forza bruta contro il suo portale MySonicWall.com ha esposto file di backup della configurazione firewall per ogni cliente che aveva usato il servizio di backup cloud — non un sottoinsieme, tutti. I file provenivano direttamente dalla funzione di backup ufficiale del fornitore."
faqs:
  - question: "Cosa è successo esattamente nell'incidente dei backup SonicWall?"
    answer: "Un attaccante ha usato tecniche di forza bruta contro il portale clienti MySonicWall.com e ha avuto accesso a file di backup della configurazione (.EXP). L'indagine di SonicWall, condotta con Mandiant, ha stimato inizialmente che meno del 5% dei clienti con backup cloud fosse coinvolto, poi ha confermato nell'aggiornamento finale che tutti i clienti che avevano usato la funzione di backup cloud erano stati colpiti."
  - question: "I file di backup esposti erano cifrati?"
    answer: "Parzialmente. Le credenziali e i secret nel file .EXP sono cifrati singolarmente (AES-256 sui firewall Gen 7 e successivi, il più vecchio 3DES su Gen 6), ma il resto della configurazione è solo codificato, non cifrato — topologia, regole, intervalli IP e altri dettagli sono leggibili una volta decodificati. La stessa SonicWall raccomanda di trattare ogni file esposto come motivo per reimpostare le credenziali."
  - question: "Significa che i backup cloud dei fornitori non sono sicuri?"
    answer: "No, l'avviso di SonicWall riguarda un portale violato tramite forza bruta, non un difetto nel concetto di backup. La lezione è più specifica: un export di configurazione contiene più dettagli utilizzabili di quanto la maggior parte presuma, quindi ovunque quel file o il suo contenuto viaggi — un backup cloud del fornitore, un ticket di supporto, una chat IA — merita lo stesso livello di attenzione."
  - question: "Cosa dovrei controllare sul mio firewall dopo aver letto questo?"
    answer: "Se usi la funzione di backup cloud di MySonicWall, accedi e controlla Product Management > Issue List per i numeri di serie interessati, poi segui le indicazioni di SonicWall per il reset essenziale delle credenziali. Separatamente, sanifica qualsiasi file di configurazione prima di incollarlo ovunque — un ticket di supporto, un post sul forum o un assistente IA."
---

Il backup di un fornitore dovrebbe essere il luogo sicuro per la tua configurazione. Nel settembre 2025, SonicWall ha confermato che non era così per i suoi clienti con backup cloud, e i dettagli meritano di essere letti anche se non usi un firewall SonicWall.

> **Cosa ha confermato SonicWall**
> Un attaccante ha condotto attacchi di forza bruta contro il portale clienti MySonicWall.com e ha ottenuto accesso a file di backup della configurazione firewall. L'[avviso di incidente di SonicWall](https://www.sonicwall.com/support/notices/mysonicwall-cloud-backup-file-incident/kA1VN0000000RoD0AU), condotto insieme alla società di risposta agli incidenti Mandiant, ha stimato inizialmente che meno del 5% dei clienti con backup cloud fosse coinvolto, poi ha confermato nell'aggiornamento finale che **tutti** i clienti che avevano usato la funzione di backup cloud erano stati colpiti. [CISA ha pubblicato un proprio avviso](https://www.cisa.gov/news-events/alerts/2025/09/22/sonicwall-releases-advisory-customers-after-security-incident) esortando tutti i clienti SonicWall a controllare il proprio account.

## Cosa contenevano davvero i file esposti

Questa è la parte che conta oltre i clienti specifici di SonicWall. Un export di configurazione firewall (un file `.EXP`) è un'istantanea completa del dispositivo: non solo password, ma anche topologia, intervalli IP, regole e dettagli di integrazione.

<div class="key-points">
  <h3>Cosa è protetto, e cosa no</h3>
  <ul>
    <li><strong>Credenziali e secret</strong> sono cifrati singolarmente — AES-256 sui firewall Gen 7 e successivi, il più vecchio 3DES su Gen 6.</li>
    <li><strong>Tutto il resto nel file</strong> — layout di rete, set di regole, indirizzamento — è solo codificato, non cifrato, quindi leggibile dopo una semplice decodifica.</li>
    <li><strong>Lo scopo stesso del file</strong> è ripristinare un dispositivo al suo esatto stato catturato, ed è esattamente per questo che è pericoloso fuori da un canale fidato: è progettato per contenere tutto ciò che serve per ricostruire la tua configurazione.</li>
  </ul>
</div>

L'avviso di SonicWall è esplicito su questo: anche con le credenziali cifrate, "il possesso di questi file potrebbe aumentare il rischio di attacchi mirati" per tutto il resto che il file rivela su come è costruita la rete.

## Perché questo vale per più di un fornitore

<div class="step-card">
  <span class="step-label">Caso d'uso</span>
  <strong>Il file di backup e l'estratto del ticket di supporto hanno lo stesso problema</strong>
  <p>Che una configurazione esca dal tuo controllo tramite un portale del fornitore violato, un post incollato su un forum, una finestra di chat IA o un allegato email al supporto, il rischio è lo stesso: il file è stato costruito per contenere tutto ciò che serve a descrivere o ricostruire la tua rete, e la maggior parte di quel dettaglio non era mai destinata a essere esposta fuori da un canale fidato. L'incidente SonicWall ricorda che anche il canale "ufficiale", avallato dal fornitore, può fallire. Un ticket di supporto o una chat IA non hanno nemmeno la cifratura che un backup cloud almeno tenta di applicare.</p>
</div>

| Cosa contiene un export di config grezzo | Cosa serve davvero per risolvere o ripristinare |
|---|---|
| Ogni regola del firewall, per intero | Una o due regole rilevanti per il problema |
| Intervalli IP interni e topologia completi | Struttura sufficiente a spiegare il problema, non l'intera mappa |
| Hostname, indirizzi server, endpoint di integrazione | Segnaposto oscurati che preservano la logica |
| Qualsiasi credenziale o chiave incorporata, anche cifrata | Niente — le credenziali non appartengono mai a un file condiviso |

## Prima di condividere una config da qualche parte

Se stai [condividendo una config di rete con un team di supporto](/it/blog/sanificare-configurazione-router-mikrotik/), l'incidente SonicWall è un buon motivo per sanificarla prima, indipendentemente dal portale del fornitore, dall'assistente IA o dal forum su cui la pubblichi. [ScrubForge](/it/scrubforge/) rimuove esattamente i dettagli che un file di backup espone: credenziali, intervalli IP, hostname e topologia, mantenendo la struttura della config abbastanza intatta da ottenere davvero aiuto.

Se usi la funzione di backup cloud di MySonicWall, controlla direttamente il tuo account invece di affidarti solo a questo articolo: l'avviso di SonicWall contiene i passaggi esatti, e la sezione Product Management > Issue List nel tuo account MySonicWall mostrerà se uno dei tuoi numeri di serie è stato segnalato.

## Domande frequenti

### Cosa è successo esattamente nell'incidente dei backup SonicWall?

Un attaccante ha usato tecniche di forza bruta contro il portale clienti MySonicWall.com e ha avuto accesso a file di backup della configurazione (.EXP). L'indagine di SonicWall, condotta con Mandiant, ha stimato inizialmente che meno del 5% dei clienti con backup cloud fosse coinvolto, poi ha confermato nell'aggiornamento finale che tutti i clienti che avevano usato la funzione di backup cloud erano stati colpiti.

### I file di backup esposti erano cifrati?

Parzialmente. Le credenziali e i secret nel file .EXP sono cifrati singolarmente (AES-256 sui firewall Gen 7 e successivi, il più vecchio 3DES su Gen 6), ma il resto della configurazione è solo codificato, non cifrato — topologia, regole, intervalli IP e altri dettagli sono leggibili una volta decodificati. La stessa SonicWall raccomanda di trattare ogni file esposto come motivo per reimpostare le credenziali.

### Significa che i backup cloud dei fornitori non sono sicuri?

No, l'avviso di SonicWall riguarda un portale violato tramite forza bruta, non un difetto nel concetto di backup. La lezione è più specifica: un export di configurazione contiene più dettagli utilizzabili di quanto la maggior parte presuma, quindi ovunque quel file o il suo contenuto viaggi — un backup cloud del fornitore, un ticket di supporto, una chat IA — merita lo stesso livello di attenzione.

### Cosa dovrei controllare sul mio firewall dopo aver letto questo?

Se usi la funzione di backup cloud di MySonicWall, accedi e controlla Product Management > Issue List per i numeri di serie interessati, poi segui le indicazioni di SonicWall per il reset essenziale delle credenziali. Separatamente, sanifica qualsiasi file di configurazione prima di incollarlo ovunque — un ticket di supporto, un post sul forum o un assistente IA.
</content>
