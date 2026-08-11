---
schemaVersion: 1
title: >-
  Come condividere in sicurezza la configurazione di rete con i ticket di
  supporto
description: >-
  Quando il tuo router Cisco si guasta o il firewall FortiGate inizia a
  interrompere il traffico, la prima chiamata è al supporto del fornitore. Ti
  chiederanno il tuo...
date: 2026-07-01T00:00:00.000Z
slug: share-network-config-support-ticket-safely
locale: it
translationKey: share-network-config-support-ticket
product: scrubforge
contentType: how-to
primaryKeyword: condividi il ticket di supporto della configurazione di rete
relatedPages: '/it/scrubforge/,/it/blog/scrubforge-chatgpt-network-troubleshooting/'
---

Quando il tuo router Cisco si guasta o il firewall FortiGate inizia a interrompere il traffico, la prima chiamata è al supporto del fornitore. Ti chiederanno la configurazione di esecuzione. È il modo più veloce per diagnosticare il problema. Il problema: la tua configurazione contiene credenziali attive che non dovrebbero lasciare la tua rete.

ScrubForge risolve esattamente questo: disinfetta localmente, quindi allega la versione pulita al tuo ticket di supporto.

## Perché le configurazioni non elaborate nei ticket di supporto rappresentano un rischio

Quando invii un file di configurazione via email o lo alleghi a un caso Cisco TAC, a un ticket Jira o a un portale di supporto del fornitore, quel file viene inserito in un sistema che non controlli completamente. A seconda delle pratiche di sicurezza del fornitore, le tue credenziali potrebbero essere:

- Accesso ai database del sistema di supporto
- Accessibile al personale di supporto
- Conservato più a lungo del previsto
- Condiviso tra i team interni per il debug

Niente di tutto ciò è insolito. La maggior parte dei sistemi di supporto aziendale sono ragionevolmente sicuri. Ma non è necessario che una configurazione del firewall di produzione contenente chiavi VPN live e password di amministratore si trovi in ​​un database di supporto. Il fornitore non ha bisogno delle tue credenziali per risolvere i problemi della tua configurazione: ha bisogno della struttura.

## Il flusso di lavoro ScrubForge + Ticket di supporto

1. **Esporta la tua configurazione** — Su Cisco IOS: `mostra running-config`. Su FortiGate: Sistema > Configurazione > Scarica.
2. **Apri ScrubForge**: fai clic sull'icona nella barra degli strumenti di Chrome.
3. **Incolla e disinfetta**: incolla la configurazione grezza. ScrubForge sostituisce password, chiavi, token e stringhe SNMP con segnaposto coerenti come "[PSK_1]" o "[ADMIN_PASS_1]".
4. **Revisione**: scansiona l'output per qualsiasi cosa che assomigli a credenziali attive. Un controllo di 30 secondi è una buona pratica.
5. **Allega al ticket**: copia l'output ripulito nel ticket di supporto o nell'e-mail oppure salvalo come file ".txt" e caricalo.

## Cosa includere nel ticket di supporto

Quando alleghi una configurazione ripulita, aggiungi una nota di una riga:

> "Configurazione allegata. Le credenziali sono state disinfettate (sostituite con token segnaposto coerenti; struttura e logica sono intatte)."

Questo indica al tecnico dell'assistenza cosa sta guardando e perché non vedrà i valori in tempo reale.

La maggior parte dei tecnici dell'assistenza capirà immediatamente. Sanno che la struttura è ciò che conta per la risoluzione dei problemi: protocolli di routing, IP peer VPN, policy firewall, configurazioni dell'interfaccia. Nessuna di queste è una credenziale.

## Prima e dopo

```
--- PRIMA (grezzo) ---
chiave crittografica isakmp T@nn3lS3cr3t indirizzo 198.51.100.10
nome utente password amministratore cisco123
RO pubblico della comunità SNMP-server

--- DOPO (igienizzato) ---
chiave crittografica isakmp [PSK_1] indirizzo 198.51.100.10
nome utente password amministratore [ADMIN_PASS_1]
comunità del server SNMP [SNMP_RO_1] RO
```

L'IP peer, i nomi delle interfacce e le policy rimangono. Le credenziali no.

## Funziona con qualsiasi fornitore

Che si tratti di Cisco, FortiGate, Palo Alto, Juniper o pfSense, il principio è lo stesso: disinfettare le configurazioni basate su testo prima di condividerle. ScrubForge rileva modelli di credenziali comuni in qualsiasi formato basato su testo.

---

### Domande frequenti

**D: Il tecnico dell'assistenza può comunque risolvere il problema se le credenziali vengono sostituite?**
R: Sì. I tecnici dell'assistenza risolvono i problemi relativi alla logica di configurazione: routing, impostazioni VPN, policy firewall. Niente di tutto ciò dipende dalla visione del valore effettivo delle credenziali. La configurazione disinfettata fornisce loro tutto ciò di cui hanno bisogno.

**D: Cosa succede se il sistema di ticket di supporto archivia i file a tempo indeterminato?**
R: Il vantaggio della disinfezione prima del caricamento è che, anche se il ticket non viene mai eliminato o vi si accede in un secondo momento, non sono presenti credenziali attive al suo interno. Hai interrotto il collegamento tra la tua rete attiva e il database di supporto.

**D: ScrubForge influisce sugli indirizzi IP di rete?**
R: No. Per impostazione predefinita, ScrubForge sostituisce i modelli di credenziali (password, chiavi, token, stringhe SNMP) e non gli indirizzi IP. La topologia della tua rete, gli IP peer e le sottoreti rimangono intatti, che è esattamente ciò che i tecnici dell'assistenza devono vedere.

---

### Installa ScrubForge

Sanificazione locale gratuita per qualsiasi configurazione basata su testo. Incolla, rimuovi le credenziali, quindi condividi in tutta sicurezza con il supporto del fornitore, i forum o qualsiasi sistema esterno: senza account, senza caricamento, senza server di terze parti.

<a href="https://chromewebstore.google.com/detail/pjaohhipefhjfopoaepjbmiienagaffe">Install ScrubForge on Chrome →</a>

**Correlato:** [Come utilizzare ScrubForge con ChatGPT per la risoluzione dei problemi di rete](/blog/scrubforge-chatgpt-network-troubleshooting/)
