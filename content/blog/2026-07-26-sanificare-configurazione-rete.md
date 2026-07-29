---
schemaVersion: 1
title: "Sanificare una configurazione di rete prima di condividerla"
description: "Rimuovi localmente segreti da configurazioni Cisco, FortiGate e cloud prima di inviarle al supporto o a un assistente IA."
date: 2026-07-26
slug: sanificare-configurazione-rete
locale: it
translationKey: sanitize-network-config-before-sharing
product: scrubforge
contentType: how-to
primaryKeyword: "sanificare configurazione di rete"
relatedPages: /scrubforge/
---

Una configurazione di rete contiene molto più di semplici impostazioni: password, token API, stringhe SNMP, host interni e indirizzi possono esporre accessi e topologia. Prima di mandare un estratto al supporto, a un forum o a un assistente IA, conviene sanificarlo.

[ScrubForge](/it/scrubforge/) elabora il testo incollato localmente nel browser. Lo stesso valore riceve lo stesso segnaposto, come `[IP_1]` o `[SECRET_1]`. In questo modo le relazioni tra route, ACL e policy restano leggibili, ma i dati reali non vengono copiati.

1. Copia soltanto la sezione indispensabile della configurazione.
2. Incollala in ScrubForge e seleziona il profilo adatto.
3. Esamina l'anteprima per credenziali, chiavi, nomi interni e dettagli della topologia.
4. Condividi esclusivamente la versione sanificata.

Segnaposto coerenti aiutano chi riceve il testo a seguire un indirizzo ripetuto o un collegamento tra oggetti. L'originale resta sul tuo dispositivo. La sanificazione non elimina la necessità di una revisione: rimuovi commenti, nomi di clienti e formati di segreto insoliti e condividi solo il contesto minimo.
