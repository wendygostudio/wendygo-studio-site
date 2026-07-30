---
schemaVersion: 1
title: "Come Sanificare una Configurazione Palo Alto PAN-OS Prima di Condividerla"
description: "Un export 'show config running' o in formato set di PAN-OS contiene hash della password admin, chiavi precondivise IKE e segreti di bind RADIUS/LDAP. Ecco cosa rimuovere prima di incollarlo in una chat IA o in un caso di supporto."
date: 2026-07-30
slug: sanificare-configurazione-paloalto
locale: it
translationKey: sanitize-paloalto-config
product: scrubforge
contentType: how-to
primaryKeyword: "sanificare configurazione palo alto pan-os"
relatedPages: /scrubforge/
---

Esportare la configurazione di un firewall Palo Alto per un caso di supporto o una sessione di troubleshooting assistita da IA porta con sé tutto ciò che si trova nella config candidata o in esecuzione — struttura delle zone, regole di sicurezza, NAT, e ogni segreto che PAN-OS conserva accanto ad esse. Prima che questo esca dal dispositivo, conviene sapere esattamente cosa contiene.

## Cosa contiene davvero una config PAN-OS

- `phash` — l'hash della password dell'amministratore locale sotto `mgt-config users`
- Valori `pre-shared-key` dell'IKE Gateway per ogni tunnel VPN
- Stringhe `snmp-setting` di community SNMP (v1/v2c) o password di autenticazione/privacy v3
- Segreti `server-profile` e password di bind di RADIUS, LDAP e Kerberos usati per l'autenticazione admin/GlobalProtect
- Segreti precondivisi del portale e del gateway GlobalProtect e passphrase dei certificati
- Chiavi API incorporate in script di automazione incollati insieme alla config

## Prima e dopo

La stessa chiave precondivisa o password di bind viene sempre mappata allo stesso token in tutto l'output sanificato, quindi le relazioni tra tunnel VPN, zone e profili di autenticazione restano leggibili — viene sostituito solo il segreto letterale.

## Passaggi

1. Installa ScrubForge dal Chrome Web Store (gratis)
2. Esporta con `show config running` (o l'equivalente in formato `set`) dalla CLI di PAN-OS o Panorama
3. Incolla l'output in ScrubForge
4. Controlla il risultato sanificato — hash delle password, chiavi precondivise e segreti di bind vengono tokenizzati, la struttura resta intatta
5. Copia e condividi, oppure continua nella chat IA integrata di ScrubForge

## Perché conta l'elaborazione locale

Una chiave precondivisa IKE o un hash della password admin incollati in un ticket di supporto o in un log di chat IA condiviso restano lì indefinitamente, fuori dal tuo controllo. ScrubForge sanifica interamente dentro la scheda del browser — nulla viene caricato prima che tu decida di condividerlo.

## Correlati

- [Sanificare una config di rete prima di condividerla](/it/blog/sanificare-configurazione-rete/)
- [ScrubForge](/it/scrubforge/)
