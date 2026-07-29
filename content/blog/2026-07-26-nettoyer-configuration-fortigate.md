---
schemaVersion: 1
title: "Nettoyer une configuration FortiGate avant partage"
description: "Vérifiez localement les extraits FortiGate pour secrets et informations sensibles."
date: 2026-07-26
slug: nettoyer-configuration-fortigate
locale: fr
translationKey: sanitize-fortigate-config
product: scrubforge
contentType: how-to
primaryKeyword: "nettoyer configuration FortiGate"
relatedPages: /scrubforge/
---

Un export FortiGate peut contenir clés VPN, mots de passe, jetons, noms internes et routage. Copiez seulement l'extrait utile dans [ScrubForge](/fr/scrubforge/), remplacez localement les valeurs sensibles puis vérifiez le résultat. Les marqueurs cohérents conservent les liens entre objets et règles. Retirez aussi commentaires et données inutiles.
