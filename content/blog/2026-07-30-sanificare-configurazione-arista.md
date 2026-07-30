---
schemaVersion: 1
title: "Come Sanificare una Configurazione Arista EOS Prima di Condividerla"
description: "L'output di 'show running-config' su Arista EOS contiene enable secret, community SNMP, password di vicino BGP e segreti condivisi MLAG. Ecco cosa rimuovere prima di incollarla in una chat IA o in un caso di supporto."
date: 2026-07-30
slug: sanificare-configurazione-arista
locale: it
translationKey: sanitize-arista-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanificare configurazione arista eos"
relatedPages: /scrubforge/
---

`show running-config` su uno switch Arista EOS produce lo stesso tipo di dump tutto-in-uno della CLI di qualsiasi altro vendor: VLAN, port-channel, peering BGP, e ogni credenziale conservata dallo switch finiscono nello stesso paste. Prima di incollarlo in un ticket TAC o in una chat IA a proposito di un vicino MLAG instabile, conviene sapere esattamente cosa c'è dentro.

## Cosa contiene davvero una config Arista EOS

- `username admin secret` — una password utente locale con hash di tipo 5 (o più forte)
- Stringhe `snmp-server community`, a volte con permessi read-write
- Valori `neighbor ... password` di BGP (basati su MD5, reversibili con gli strumenti giusti per le cifrature più vecchie)
- Segreti condivisi `tacacs-server key` e `radius-server host ... key`
- Configurazione `peer-address` e `local-interface` di MLAG, a volte abbinata a un segreto condiviso nella configurazione di peering
- `enable secret` per l'accesso EXEC privilegiato

## Prima e dopo

La stessa chiave TACACS+ o password di vicino BGP viene sempre mappata allo stesso token in tutto l'output sanificato, quindi le relazioni tra vicini, VLAN e port-channel restano leggibili — viene sostituita solo la credenziale letterale.

## Passaggi

1. Installa ScrubForge dal Chrome Web Store (gratis)
2. Esegui `show running-config` sul tuo switch Arista
3. Incolla l'output in ScrubForge
4. Controlla il risultato sanificato — segreti, community e password di vicino vengono tokenizzati, la struttura resta intatta
5. Copia e condividi, oppure continua nella chat IA integrata di ScrubForge

## Perché conta l'elaborazione locale

Un segreto condiviso MLAG o una chiave TACACS+ incollati in un ticket di supporto o in un log di chat condiviso restano lì indefinitamente. ScrubForge sanifica interamente dentro la scheda del browser — nulla viene caricato prima che tu decida di condividerlo.

## Correlati

- [Sanificare una config di rete prima di condividerla](/it/blog/sanificare-configurazione-rete/)
- [ScrubForge](/it/scrubforge/)
