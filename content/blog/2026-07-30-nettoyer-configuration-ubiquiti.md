---
schemaVersion: 1
title: "Comment Nettoyer une Configuration Ubiquiti UniFi / EdgeOS Avant de la Partager"
description: "Une sauvegarde de contrôleur UniFi ou un export 'show configuration' d'EdgeOS contient des clés pré-partagées WiFi, des mots de passe admin, des secrets RADIUS et des clés VPN site-à-site. Voici ce qu'il faut retirer avant de le coller dans un chat IA ou un post de forum."
date: 2026-07-30
slug: nettoyer-configuration-ubiquiti
locale: fr
translationKey: sanitize-ubiquiti-config
product: scrubforge
contentType: how-to
primaryKeyword: "nettoyer configuration ubiquiti unifi"
relatedPages: /scrubforge/
---

Une installation Ubiquiti implique généralement un dépannage sur deux systèmes qui se chevauchent : la sauvegarde de site exportée du contrôleur UniFi ou le `config.gateway.json`, et le `show configuration` d'EdgeOS sur du matériel EdgeRouter. Les deux affichent topologie réseau, paramètres WiFi et identifiants dans un seul fichier. Avant d'envoyer ça dans un post de forum communautaire ou un chat IA demandant pourquoi un VLAN ne route pas, mieux vaut savoir exactement ce qu'il y a dedans.

## Ce que contient réellement une config UniFi / EdgeOS

- `x_passphrase` du réseau WiFi — la clé pré-partagée WPA2/WPA3, stockée en clair dans les sauvegardes de site UniFi
- Les mots de passe des comptes admin locaux (hashés dans la base de données du contrôleur, parfois présents en clair dans les paquets d'export de support)
- Les secrets partagés `radius profile` utilisés pour l'authentification 802.1X ou hotspot
- Les valeurs `pre-shared-key` VPN site-à-site et utilisateur distant sous `vpn ipsec` (EdgeOS) ou la configuration VPN d'UniFi
- Les chaînes de communauté SNMP sous `snmp community`
- Les secrets de portail invité et de bons hotspot, ainsi que toute clé API tierce intégrée dans des intégrations

## Avant et après

La même phrase de passe WiFi ou la même clé pré-partagée VPN est toujours mappée au même token dans toute la sortie nettoyée, donc les relations entre sites, VLANs et tunnels restent lisibles — seul l'identifiant littéral est remplacé.

## Étapes

1. Installez ScrubForge depuis le Chrome Web Store (gratuit)
2. Exportez une sauvegarde de site UniFi ou exécutez `show configuration` sur votre EdgeRouter
3. Collez la section pertinente dans ScrubForge
4. Vérifiez le résultat nettoyé — phrases de passe, mots de passe admin et secrets partagés sont tokenisés, la structure reste intacte
5. Copiez et partagez, ou continuez dans le chat IA intégré de ScrubForge

## Pourquoi le traitement local compte

Une clé pré-partagée WiFi ou un secret VPN collé dans un fil de forum public ou un journal de chat IA partagé devient effectivement public au moment où il est publié. ScrubForge nettoie entièrement à l'intérieur de l'onglet du navigateur — rien n'est envoyé avant que vous décidiez de le partager.

## À lire aussi

- [Nettoyer une configuration réseau avant de la partager](/fr/blog/nettoyer-configuration-reseau/)
- [ScrubForge](/fr/scrubforge/)
