---
schemaVersion: 1
title: "Come Sanificare una Configurazione Check Point Prima di Condividerla"
description: "Un export di config Check Point Gaia/SmartConsole contiene hash della password admin, chiavi di attivazione SIC, segreti precondivisi VPN e segreti condivisi RADIUS/TACACS. Ecco cosa rimuovere prima di incollarlo in una chat IA o in un caso TAC."
date: 2026-07-30
slug: sanificare-configurazione-checkpoint
locale: it
translationKey: sanitize-checkpoint-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanificare configurazione check point"
relatedPages: /scrubforge/
---

Un export di configurazione Check Point — che sia un dump `show configuration` di Gaia, un output di `cpconfig`, o una policy esportata da SmartConsole — mescola oggetti di rete, regole di sicurezza, e ogni credenziale che il gateway o il server di gestione conservano in un unico file. Prima di incollarlo in un caso TAC o in una chat IA chiedendo perché un tunnel VPN non si alza, conviene sapere esattamente cosa c'è dentro.

## Cosa contiene davvero una config Check Point

- Valori `password-hash` admin di Gaia per gli account locali
- Password monouso e chiavi di attivazione SIC (Secure Internal Communication) usate per associare i gateway al server di gestione
- Valori `pre-shared-secret` della community VPN per i tunnel site-to-site e ad accesso remoto
- Stringhe di community SNMP sotto `set snmp community`
- Segreti condivisi RADIUS e TACACS+ configurati per l'autenticazione admin o utente
- Chiavi API e token usati da script SmartConsole o della Management API R8x incollati insieme alla config

## Prima e dopo

Lo stesso segreto precondiviso o la stessa chiave SIC vengono sempre mappati allo stesso token in tutto l'output sanificato, quindi le relazioni tra gateway, community VPN e oggetti restano leggibili — viene sostituita solo la credenziale letterale.

## Passaggi

1. Installa ScrubForge dal Chrome Web Store (gratis)
2. Esporta la tua config via CLI di Gaia, `cpconfig`, o un export di policy da SmartConsole
3. Incolla l'output in ScrubForge
4. Controlla il risultato sanificato — hash delle password, chiavi SIC e segreti precondivisi vengono tokenizzati, la struttura resta intatta
5. Copia e condividi, oppure continua nella chat IA integrata di ScrubForge

## Perché conta l'elaborazione locale

Una chiave di attivazione SIC o un segreto precondiviso VPN incollati in un caso TAC o in un log di chat condiviso restano lì indefinitamente, fuori dal tuo controllo. ScrubForge sanifica interamente dentro la scheda del browser — nulla viene caricato prima che tu decida di condividerlo.

## Correlati

- [Sanificare una config di rete prima di condividerla](/it/blog/sanificare-configurazione-rete/)
- [ScrubForge](/it/scrubforge/)
