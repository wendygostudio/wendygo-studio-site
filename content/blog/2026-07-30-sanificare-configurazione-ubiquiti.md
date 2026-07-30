---
schemaVersion: 1
title: "Come Sanificare una Configurazione Ubiquiti UniFi / EdgeOS Prima di Condividerla"
description: "Un backup del controller UniFi o un export 'show configuration' di EdgeOS contiene chiavi precondivise WiFi, password admin, segreti RADIUS e chiavi VPN site-to-site. Ecco cosa rimuovere prima di incollarlo in una chat IA o in un post del forum."
date: 2026-07-30
slug: sanificare-configurazione-ubiquiti
locale: it
translationKey: sanitize-ubiquiti-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanificare configurazione ubiquiti unifi"
relatedPages: /scrubforge/
---

Un'installazione Ubiquiti di solito significa fare troubleshooting su due sistemi che si sovrappongono: il backup del sito esportato dal controller UniFi o il `config.gateway.json`, e `show configuration` di EdgeOS su hardware EdgeRouter. Entrambi restituiscono topologia di rete, impostazioni WiFi e credenziali in un unico file. Prima di incollarlo in un post di un forum della community o in una chat IA chiedendo perché una VLAN non instrada, conviene sapere esattamente cosa c'è dentro.

## Cosa contiene davvero una config UniFi / EdgeOS

- `x_passphrase` della rete WiFi — la chiave precondivisa WPA2/WPA3, memorizzata in chiaro nei backup di sito UniFi
- Password degli account admin locali (con hash nel database del controller, a volte presenti in chiaro nei pacchetti di export per il supporto)
- Segreti condivisi `radius profile` usati per l'autenticazione 802.1X o hotspot
- Valori `pre-shared-key` VPN site-to-site e utente remoto sotto `vpn ipsec` (EdgeOS) o la configurazione VPN di UniFi
- Stringhe di community SNMP sotto `snmp community`
- Segreti del portale ospiti e dei voucher hotspot, e qualsiasi chiave API di terze parti incorporata in integrazioni

## Prima e dopo

La stessa passphrase WiFi o chiave precondivisa VPN viene sempre mappata allo stesso token in tutto l'output sanificato, quindi le relazioni tra siti, VLAN e tunnel restano leggibili — viene sostituita solo la credenziale letterale.

## Passaggi

1. Installa ScrubForge dal Chrome Web Store (gratis)
2. Esporta un backup di sito UniFi o esegui `show configuration` sul tuo EdgeRouter
3. Incolla la sezione rilevante in ScrubForge
4. Controlla il risultato sanificato — passphrase, password admin e segreti condivisi vengono tokenizzati, la struttura resta intatta
5. Copia e condividi, oppure continua nella chat IA integrata di ScrubForge

## Perché conta l'elaborazione locale

Una chiave precondivisa WiFi o un segreto VPN incollati in un thread di forum pubblico o in un log di chat IA condiviso diventano di fatto pubblici nel momento in cui vengono pubblicati. ScrubForge sanifica interamente dentro la scheda del browser — nulla viene caricato prima che tu decida di condividerlo.

## Correlati

- [Sanificare una config di rete prima di condividerla](/it/blog/sanificare-configurazione-rete/)
- [ScrubForge](/it/scrubforge/)
