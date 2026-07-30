---
schemaVersion: 1
title: "Comment Nettoyer une Configuration Huawei VRP Avant de la Partager"
description: "La sortie de 'display current-configuration' sous Huawei VRP contient des hashs de mot de passe irreversible-cipher, des communautés SNMP et des clés d'authentification MD5 OSPF/BGP. Voici ce qu'il faut retirer avant de la coller dans un chat IA ou un ticket de support."
date: 2026-07-30
slug: nettoyer-configuration-huawei
locale: fr
translationKey: sanitize-huawei-config
product: scrubforge
contentType: how-to
primaryKeyword: "nettoyer configuration huawei vrp"
relatedPages: /scrubforge/
---

`display current-configuration` sur un équipement Huawei VRP (routeurs et switches de la même famille d'OS) affiche interfaces, protocoles de routage, et chaque identifiant stocké dans un seul bloc continu. Avant d'envoyer ça dans un ticket de support ou un chat IA à propos d'un voisin OSPF bloqué en EXSTART, mieux vaut savoir exactement ce qu'il y a dedans.

## Ce que contient réellement une config Huawei VRP

- `local-user ... password irreversible-cipher` — mots de passe de compte local hashés
- `super password` — le mot de passe du mode privilégié, stocké comme une chaîne chiffrée
- Des chaînes `snmp-agent community`, en lecture seule ou lecture-écriture
- Les clés `authentication-mode md5` d'OSPF et BGP, ainsi que les mots de passe d'authentification IS-IS
- Les valeurs `radius-server shared-key` et `hwtacacs-server shared-key`
- Les chaînes `pre-shared-key` IPsec/IKE pour les tunnels site-à-site

## Avant et après

La même clé partagée ou la même communauté SNMP est toujours mappée au même token dans toute la sortie nettoyée, donc les relations entre voisins, VLANs et profils d'authentification restent lisibles — seul l'identifiant littéral est remplacé.

## Étapes

1. Installez ScrubForge depuis le Chrome Web Store (gratuit)
2. Exécutez `display current-configuration` sur votre équipement Huawei
3. Collez la sortie dans ScrubForge
4. Vérifiez le résultat nettoyé — mots de passe chiffrés, communautés et clés d'authentification sont tokenisés, la structure reste intacte
5. Copiez et partagez, ou continuez dans le chat IA intégré de ScrubForge

## Pourquoi le traitement local compte

Un hash `irreversible-cipher` ou une clé MD5 OSPF collé dans un ticket de support ou un journal de chat partagé y reste indéfiniment. ScrubForge nettoie entièrement à l'intérieur de l'onglet du navigateur — rien n'est envoyé avant que vous décidiez de le partager.

## À lire aussi

- [Nettoyer une configuration réseau avant de la partager](/fr/blog/nettoyer-configuration-reseau/)
- [ScrubForge](/fr/scrubforge/)
