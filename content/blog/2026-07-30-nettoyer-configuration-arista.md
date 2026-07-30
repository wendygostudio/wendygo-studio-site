---
schemaVersion: 1
title: "Comment Nettoyer une Configuration Arista EOS Avant de la Partager"
description: "La sortie de 'show running-config' sous Arista EOS contient des enable secrets, des communautés SNMP, des mots de passe de voisin BGP et des secrets partagés MLAG. Voici ce qu'il faut retirer avant de la coller dans un chat IA ou un ticket de support."
date: 2026-07-30
slug: nettoyer-configuration-arista
locale: fr
translationKey: sanitize-arista-config
product: scrubforge
contentType: how-to
primaryKeyword: "nettoyer configuration arista eos"
relatedPages: /scrubforge/
---

`show running-config` sur un switch Arista EOS produit le même type de dump tout-en-un que la CLI de n'importe quel autre fournisseur : VLANs, port-channels, peering BGP, et chaque identifiant que le switch détient se retrouvent dans le même paste. Avant d'envoyer ça dans un ticket TAC ou un chat IA à propos d'un voisin MLAG instable, mieux vaut savoir exactement ce qu'il y a dedans.

## Ce que contient réellement une config Arista EOS

- `username admin secret` — un mot de passe utilisateur local hashé de type 5 (ou plus fort)
- Des chaînes `snmp-server community`, parfois avec un accès en lecture-écriture
- Les valeurs `neighbor ... password` BGP (basées sur MD5, réversibles avec les bons outils pour les chiffrements plus anciens)
- Les secrets partagés `tacacs-server key` et `radius-server host ... key`
- La configuration `peer-address` et `local-interface` du MLAG, parfois associée à un secret partagé dans la configuration de peering
- `enable secret` pour l'accès EXEC privilégié

## Avant et après

La même clé TACACS+ ou le même mot de passe de voisin BGP est toujours mappé au même token dans toute la sortie nettoyée, donc les relations entre voisins, VLANs et port-channels restent lisibles — seul l'identifiant littéral est remplacé.

## Étapes

1. Installez ScrubForge depuis le Chrome Web Store (gratuit)
2. Exécutez `show running-config` sur votre switch Arista
3. Collez la sortie dans ScrubForge
4. Vérifiez le résultat nettoyé — secrets, communautés et mots de passe de voisin sont tokenisés, la structure reste intacte
5. Copiez et partagez, ou continuez dans le chat IA intégré de ScrubForge

## Pourquoi le traitement local compte

Un secret partagé MLAG ou une clé TACACS+ collé dans un ticket de support ou un journal de chat partagé y reste indéfiniment. ScrubForge nettoie entièrement à l'intérieur de l'onglet du navigateur — rien n'est envoyé avant que vous décidiez de le partager.

## À lire aussi

- [Nettoyer une configuration réseau avant de la partager](/fr/blog/nettoyer-configuration-reseau/)
- [ScrubForge](/fr/scrubforge/)
