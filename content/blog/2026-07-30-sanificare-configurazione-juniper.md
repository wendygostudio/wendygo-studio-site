---
schemaVersion: 1
title: "Come Sanificare una Configurazione Juniper JunOS Prima di Condividerla"
description: "L'output di 'show configuration' su JunOS contiene hash di root-authentication, community SNMP e chiavi di autenticazione BGP/OSPF. Ecco cosa rimuovere prima di incollarla in una chat IA o in un ticket."
date: 2026-07-30
slug: sanificare-configurazione-juniper
locale: it
translationKey: sanitize-juniper-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanificare configurazione juniper junos"
relatedPages: /scrubforge/
---

`show configuration` su un apparato Juniper produce un dump piatto dell'intero dispositivo: interfacce, politica di routing, filtri firewall, e ogni credenziale che il dispositivo conserva, tutto nello stesso paste. Prima di incollarlo in un ticket TAC o in una chat IA chiedendo "perché questa adiacenza OSPF è bloccata", conviene sapere esattamente cosa c'è dentro.

## Cosa contiene davvero una config JunOS

- `root-authentication encrypted-password` — un hash Juniper con prefisso `$9$` per l'account root
- Stringhe `snmp community`, spesso con `authorization read-write`
- `authentication-key` di BGP e OSPF/IS-IS (MD5, a volte in chiaro nelle config più vecchie)
- Chiavi precondivise IPsec `ike proposal` sotto `security ike policy ... pre-shared-key`
- Valori `secret` di RADIUS e TACACS+ sotto `system radius-server` / `system tacplus-server`
- Hash `authentication encrypted-password` degli utenti locali per ogni account configurato

## Prima e dopo

La stessa community SNMP o lo stesso secret condiviso viene sempre mappato allo stesso token in tutto l'output sanificato, quindi le relazioni tra interfacce, policy e vicini restano intatte — viene sostituita solo la credenziale letterale.

## Passaggi

1. Installa ScrubForge dal Chrome Web Store (gratis)
2. Esegui `show configuration | display set` o la forma gerarchica semplice sul tuo apparato Juniper
3. Incolla l'output in ScrubForge
4. Controlla il risultato sanificato — hash, chiavi e community vengono tokenizzati, la struttura resta intatta
5. Copia e condividi, oppure continua nella chat IA integrata di ScrubForge

## Perché conta l'elaborazione locale

Un hash root `$9$` o una chiave MD5 di BGP incollati in un ticket TAC o in un log di chat condiviso restano lì indefinitamente. ScrubForge sanifica interamente dentro la scheda del browser — nulla viene caricato prima che tu decida di condividerlo.

## Correlati

- [Sanificare una config di rete prima di condividerla](/it/blog/sanificare-configurazione-rete/)
- [ScrubForge](/it/scrubforge/)
