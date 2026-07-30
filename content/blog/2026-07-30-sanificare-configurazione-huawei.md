---
schemaVersion: 1
title: "Come Sanificare una Configurazione Huawei VRP Prima di Condividerla"
description: "L'output di 'display current-configuration' su Huawei VRP contiene hash di password irreversible-cipher, community SNMP e chiavi di autenticazione MD5 OSPF/BGP. Ecco cosa rimuovere prima di incollarla in una chat IA o in un caso di supporto."
date: 2026-07-30
slug: sanificare-configurazione-huawei
locale: it
translationKey: sanitize-huawei-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanificare configurazione huawei vrp"
relatedPages: /scrubforge/
---

`display current-configuration` su un dispositivo Huawei VRP (router e switch della stessa famiglia di OS) restituisce interfacce, protocolli di routing e ogni credenziale memorizzata in un unico blocco continuo. Prima di incollarlo in un caso di supporto o in una chat IA a proposito di un vicino OSPF bloccato in EXSTART, conviene sapere esattamente cosa c'è dentro.

## Cosa contiene davvero una config Huawei VRP

- `local-user ... password irreversible-cipher` — password degli account locali con hash
- `super password` — la password della modalità privilegiata, memorizzata come stringa cifrata
- Stringhe `snmp-agent community`, in sola lettura o lettura-scrittura
- Chiavi `authentication-mode md5` di OSPF e BGP, oltre alle password di autenticazione IS-IS
- Valori `radius-server shared-key` e `hwtacacs-server shared-key`
- Stringhe `pre-shared-key` IPsec/IKE per i tunnel site-to-site

## Prima e dopo

La stessa chiave condivisa o community SNMP viene sempre mappata allo stesso token in tutto l'output sanificato, quindi le relazioni tra vicini, VLAN e profili di autenticazione restano leggibili — viene sostituita solo la credenziale letterale.

## Passaggi

1. Installa ScrubForge dal Chrome Web Store (gratis)
2. Esegui `display current-configuration` sul tuo dispositivo Huawei
3. Incolla l'output in ScrubForge
4. Controlla il risultato sanificato — password cifrate, community e chiavi di autenticazione vengono tokenizzate, la struttura resta intatta
5. Copia e condividi, oppure continua nella chat IA integrata di ScrubForge

## Perché conta l'elaborazione locale

Un hash `irreversible-cipher` o una chiave MD5 OSPF incollati in un ticket di supporto o in un log di chat condiviso restano lì indefinitamente. ScrubForge sanifica interamente dentro la scheda del browser — nulla viene caricato prima che tu decida di condividerlo.

## Correlati

- [Sanificare una config di rete prima di condividerla](/it/blog/sanificare-configurazione-rete/)
- [ScrubForge](/it/scrubforge/)
