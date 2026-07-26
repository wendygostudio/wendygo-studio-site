---
schemaVersion: 1
locale: it
translationKey: sanitize-fortigate-config
xDefaultPath: /blog/sanitize-fortigate-config/
title: "Sanificare una configurazione FortiGate"
description: "Controlla localmente estratti FortiGate per segreti e dettagli sensibili."
date: 2026-07-26
slug: sanificare-configurazione-fortigate
product: ScrubForge
contentType: how-to
primaryKeyword: "sanificare configurazione FortiGate"
relatedPages: "/it/scrubforge/,/blog/sanitize-fortigate-config/"
heading: "Condividere una configurazione FortiGate in sicurezza"
intro: "Prepara una copia sanificata per supporto senza pubblicare l'originale."
faqs:
  - question: "La sanificazione sostituisce una revisione?"
    answer: "No. Controlla sempre nomi, commenti e formati di segreto non comuni."
---

Un export FortiGate può contenere chiavi VPN, password, token, nomi interni e routing. Copia solo l'estratto utile in [ScrubForge](/it/scrubforge/), sostituisci localmente valori sensibili e verifica l'output. Segnaposto coerenti mantengono relazioni tra oggetti e regole. Rimuovi anche commenti e dati inutili.
