---
schemaVersion: 1
locale: fr
translationKey: sanitize-fortigate-config
xDefaultPath: /blog/sanitize-fortigate-config/
title: "Nettoyer une configuration FortiGate avant partage"
description: "Vérifiez localement les extraits FortiGate pour secrets et informations sensibles."
date: 2026-07-26
slug: nettoyer-configuration-fortigate
product: ScrubForge
contentType: how-to
primaryKeyword: "nettoyer configuration FortiGate"
relatedPages: "/fr/scrubforge/,/blog/sanitize-fortigate-config/"
heading: "Partager une configuration FortiGate en sécurité"
intro: "Préparez une copie nettoyée pour le support sans publier l'original."
faqs:
  - question: "Le nettoyage remplace-t-il une relecture ?"
    answer: "Non. Vérifiez toujours noms, commentaires et formats de secrets inhabituels."
---

Un export FortiGate peut contenir clés VPN, mots de passe, jetons, noms internes et routage. Copiez seulement l'extrait utile dans [ScrubForge](/fr/scrubforge/), remplacez localement les valeurs sensibles puis vérifiez le résultat. Les marqueurs cohérents conservent les liens entre objets et règles. Retirez aussi commentaires et données inutiles.
