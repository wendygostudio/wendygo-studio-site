---
schemaVersion: 1
title: "Il Privacy Filter di OpenAI Non Sa Cosa Sia una Password BGP"
description: "OpenAI ha rilasciato come open source un modello che redige le PII prima che raggiungano un'IA. Ecco esattamente cosa rileva, cosa non è mai stato costruito per rilevare, e perché le config di rete hanno ancora bisogno di uno strumento dedicato."
date: 2026-07-29
slug: openai-privacy-filter-configurazioni-rete
locale: it
translationKey: openai-privacy-filter-network-configs
product: scrubforge
contentType: use-case
primaryKeyword: "openai privacy filter configurazione di rete"
relatedPages: /scrubforge/
---

OpenAI ha recentemente rilasciato come open source Privacy Filter, un piccolo modello costruito per rilevare e redigere informazioni personali identificabili nel testo, che gira in locale, su un portatile o direttamente nel browser, e riporta un punteggio F1 del 96-97% nel rilevamento di PII. È un rilascio genuinamente utile. Non è però costruito per proteggere ciò che la maggior parte degli ingegneri di rete incolla davvero in una chat IA: una configurazione di router o firewall.

## A cosa serve davvero Privacy Filter

<div class="key-points">
  <h3>Cosa punta il modello</h3>
  <ul>
    <li>Nomi, email, numeri di telefono, indirizzi — PII classiche, del tipo che compare in email, ticket di supporto e documenti legali.</li>
    <li>Rilevamento consapevole del contesto su documenti lunghi, fino a 128.000 token in un unico passaggio, un vero traguardo ingegneristico per quel caso d'uso.</li>
    <li>Gira sul dispositivo, pesi aperti, licenza Apache 2.0 — nessun dato lascia la macchina per essere redatto, il modello di privacy corretto.</li>
  </ul>
</div>

È uno strumento solido per ciò per cui è stato costruito: documenti legali, thread email, registri clienti. È un modello di PII generico, addestrato sul tipo di dati personali che compare in ogni settore.

## Ciò che non è mai stato addestrato a riconoscere

Un file di configurazione di rete non assomiglia a un documento legale o a un registro cliente. Assomiglia a questo:

```
enable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0
snmp-server community publicRW RW
router bgp 65001
 neighbor 203.0.113.1 remote-as 65002
 neighbor 203.0.113.1 password 7 08351A5D0713
```

<div class="step-card">
  <span class="step-label">Verifica della realtà</span>
  <strong>Niente di tutto ciò è PII, e tutto ciò è una credenziale</strong>
  <p>Una community string SNMP, una password di vicino BGP, una chiave di autenticazione OSPF, una chiave server TACACS+, una chiave precondivisa WPA — niente di tutto ciò corrisponde alla distribuzione di addestramento di un modello PII generico, perché non sono nomi, email o numeri di telefono. Sono segreti specifici di dominio che hanno senso solo nel contesto della sintassi di configurazione di rete, e un modello addestrato su dati legali e clienti non ha mai avuto motivo di averne visto uno.</p>
</div>

C'è un secondo divario altrettanto importante: **la robustezza delle credenziali**. `enable secret 5` è un hash MD5. `password 7` è una cifratura Cisco tipo 7, banalmente reversibile con strumenti che esistono da oltre un decennio. Un modello di redazione PII non ha alcun concetto di "questo hash è debole" o "questa codifica è reversibile" — o riconosce un pattern come PII oppure no. Distinguere un hash bcrypt robusto da una password Cisco tipo 7 reversibile richiede di conoscere gli schemi di codifica del vendor, non solo riconoscere testo dall'aspetto sensibile.

## Testare il divario

Fai passare un export reale Cisco, FortiGate o MikroTik attraverso un rilevatore PII generico e il pattern è costante: cattura qualcosa se c'è un indirizzo email o un hostname che sembra un dominio, e ignora completamente l'`enable secret`, la community SNMP, la password di vicino BGP e la chiave precondivisa. Non è un difetto del modello. È semplicemente fuori da ciò per cui è stato addestrato a cercare, allo stesso modo in cui un correttore ortografico non è rotto perché non rileva un errore matematico.

## Cosa significa questo se incolli config in strumenti IA

La lettura corretta del rilascio di OpenAI non è "la redazione ora è un problema risolto". È l'opposto: la redazione PII generica sta tendendo verso il gratuito e la commoditizzazione, il che è genuinamente positivo per chiunque tratti nomi, email e dati clienti. Ma rende ancora più netto dove si trova il divario rimanente: segreti specifici di dominio in formati tecnici strutturati, di cui le config di rete sono uno degli esempi più chiari.

<table>
<tr><th>Coperto dai modelli PII generici</th><th>Non coperto, richiede rilevamento consapevole del vendor</th></tr>
<tr><td>Nomi, email, numeri di telefono</td><td>Community string SNMP</td></tr>
<tr><td>Indirizzi fisici</td><td>Chiavi di autenticazione BGP / OSPF / HSRP</td></tr>
<tr><td>Numeri di carta di credito</td><td>Chiavi server TACACS+ / RADIUS</td></tr>
<tr><td>Formati generici di chiavi API</td><td>Codifiche password specifiche del vendor (es. Cisco tipo 7)</td></tr>
<tr><td>—</td><td>Classificazione della robustezza di hash/cifratura</td></tr>
</table>

Se stai incollando una config in ChatGPT, Claude o Gemini per risolvere un problema di routing, un filtro PII generico in esecuzione in background non catturerà la parte che conta davvero. [ScrubForge](/it/scrubforge/) è costruito specificamente per questo divario: 12 profili vendor, rilevamento di segreti a livello di protocollo (BGP, OSPF, HSRP, TACACS+, RADIUS, SNMP), e classificazione della robustezza degli hash, in esecuzione interamente in locale, con una chat BYOK opzionale che vede solo la versione tokenizzata della tua config.

## Domande frequenti

### Il Privacy Filter di OpenAI protegge le password in una config di router o firewall?

Non in modo affidabile. È addestrato a rilevare PII generiche, nomi, email, numeri di telefono, non credenziali di rete specifiche del vendor come community string SNMP o password di vicino BGP, che seguono una sintassi completamente diversa e non hanno fatto parte del suo focus di addestramento.

### Se ChatGPT alla fine aggiungesse la redazione PII integrata, le config di rete sarebbero ancora a rischio?

Sì, per lo stesso motivo. Una redazione integrata mirata alla conformità PII generale non sarà calibrata per riconoscere la sintassi di configurazione di router o firewall a meno che un fornitore non si addestri specificamente per questo, un caso d'uso ristretto e a basso volume rispetto ai pattern PII che compaiono in qualsiasi altro tipo di documento.

### Qual è la differenza pratica tra redazione PII e sanificazione delle config?

La redazione PII protegge i dati personali, informazioni che identificano una persona. La sanificazione delle config protegge i segreti dell'infrastruttura, credenziali e topologia che identificano e concedono accesso a una rete. Si sovrappongono in quasi nessun caso, e uno strumento costruito per l'uno raramente copre bene l'altro.

### È ancora necessario sanificare le config manualmente se mi fido del fornitore IA?

Sanificare prima di incollare ti protegge indipendentemente da ciò che qualsiasi fornitore promette sulla gestione dei dati, e protegge dal rischio più semplice che un collega, uno schermo condiviso, o un log di chat copiato e incollato porti una credenziale attiva in un posto dove non dovrebbe andare.
