---
schemaVersion: 1
locale: fr
translationKey: sanitize-network-config-before-sharing
xDefaultPath: /blog/sanitize-network-config-before-sharing/
title: "Nettoyer une configuration réseau avant de la partager"
description: "Retirez localement les secrets d'une configuration Cisco, FortiGate ou cloud avant de l'envoyer au support ou à une IA."
date: 2026-07-26
slug: nettoyer-configuration-reseau
product: ScrubForge
contentType: how-to
primaryKeyword: "nettoyer configuration réseau"
relatedPages: "/fr/scrubforge/,/blog/sanitize-network-config-before-sharing/"
heading: "Nettoyer une configuration réseau avant de la partager"
intro: "Masquez les valeurs sensibles localement sans perdre la structure utile au diagnostic."
faqs:
  - question: "ScrubForge détecte-t-il tous les secrets ?"
    answer: "Il détecte les formats courants ; relisez toujours le résultat pour les valeurs personnalisées ou inhabituelles."
---

Une configuration réseau ne contient pas que des réglages. Mots de passe, jetons API, chaînes SNMP, noms d'hôtes internes et adresses peuvent révéler vos accès et votre architecture. Nettoyez l'extrait avant de le transmettre à un support, un forum ou un assistant IA.

[ScrubForge](/fr/scrubforge/) traite le texte collé localement dans le navigateur. Une même valeur reçoit le même marqueur, par exemple `[IP_1]` ou `[SECRET_1]`. Les relations entre routes, ACL et règles restent donc compréhensibles, sans copier les valeurs réelles.

1. Copiez seulement la partie nécessaire de la configuration.
2. Collez-la dans ScrubForge et choisissez le profil adapté.
3. Contrôlez l'aperçu : identifiants, clés, noms internes et éléments de topologie.
4. Partagez uniquement la version nettoyée.

Les marqueurs cohérents aident le destinataire à suivre une adresse répétée ou une dépendance entre objets. L'original reste sur votre poste. Cette étape ne remplace pas une relecture : retirez aussi les commentaires, noms de clients et secrets au format maison, et ne divulguez que le contexte indispensable.
