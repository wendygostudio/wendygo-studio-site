---
schemaVersion: 1
title: "Comment Nettoyer une Configuration Check Point Avant de la Partager"
description: "Un export de config Check Point Gaia/SmartConsole contient des hashs de mot de passe admin, des clés d'activation SIC, des secrets pré-partagés VPN et des secrets partagés RADIUS/TACACS. Voici ce qu'il faut retirer avant de le coller dans un chat IA ou un ticket TAC."
date: 2026-07-30
slug: nettoyer-configuration-checkpoint
locale: fr
translationKey: sanitize-checkpoint-config
product: scrubforge
contentType: how-to
primaryKeyword: "nettoyer configuration check point"
relatedPages: /scrubforge/
---

Un export de configuration Check Point — que ce soit un dump `show configuration` sous Gaia, une sortie `cpconfig`, ou une politique exportée depuis SmartConsole — mélange objets réseau, règles de sécurité, et chaque identifiant que la gateway ou le serveur de management détient, dans un seul fichier. Avant d'envoyer ça dans un ticket TAC ou un chat IA en demandant pourquoi un tunnel VPN ne monte pas, mieux vaut savoir exactement ce qu'il y a dedans.

## Ce que contient réellement une config Check Point

- Les valeurs `password-hash` admin de Gaia pour les comptes locaux
- Les mots de passe à usage unique et clés d'activation SIC (Secure Internal Communication) utilisés pour associer les gateways au serveur de management
- Les valeurs `pre-shared-secret` de communauté VPN pour les tunnels site-à-site et d'accès distant
- Les chaînes de communauté SNMP sous `set snmp community`
- Les secrets partagés RADIUS et TACACS+ configurés pour l'authentification admin ou utilisateur
- Les clés API et tokens utilisés par les scripts SmartConsole ou de la Management API R8x collés à côté de la config

## Avant et après

Le même secret pré-partagé ou la même clé SIC est toujours mappé au même token dans toute la sortie nettoyée, donc les relations entre gateways, communautés VPN et objets restent lisibles — seul l'identifiant littéral est remplacé.

## Étapes

1. Installez ScrubForge depuis le Chrome Web Store (gratuit)
2. Exportez votre config via la CLI Gaia, `cpconfig`, ou un export de politique depuis SmartConsole
3. Collez la sortie dans ScrubForge
4. Vérifiez le résultat nettoyé — hashs de mot de passe, clés SIC et secrets pré-partagés sont tokenisés, la structure reste intacte
5. Copiez et partagez, ou continuez dans le chat IA intégré de ScrubForge

## Pourquoi le traitement local compte

Une clé d'activation SIC ou un secret pré-partagé VPN collé dans un ticket TAC ou un journal de chat partagé y reste indéfiniment, hors de votre contrôle. ScrubForge nettoie entièrement à l'intérieur de l'onglet du navigateur — rien n'est envoyé avant que vous décidiez de le partager.

## À lire aussi

- [Nettoyer une configuration réseau avant de la partager](/fr/blog/nettoyer-configuration-reseau/)
- [ScrubForge](/fr/scrubforge/)
