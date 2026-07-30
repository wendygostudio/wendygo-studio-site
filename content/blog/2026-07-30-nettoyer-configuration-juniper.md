---
schemaVersion: 1
title: "Comment Nettoyer une Configuration Juniper JunOS Avant de la Partager"
description: "La sortie de 'show configuration' sous JunOS contient des hashs root-authentication, des communautés SNMP et des clés d'authentification BGP/OSPF. Voici ce qu'il faut retirer avant de la coller dans un chat IA ou un ticket."
date: 2026-07-30
slug: nettoyer-configuration-juniper
locale: fr
translationKey: sanitize-juniper-config
product: scrubforge
contentType: how-to
primaryKeyword: "nettoyer configuration juniper junos"
relatedPages: /scrubforge/
---

`show configuration` sur un équipement Juniper produit un dump plat de toute la machine : interfaces, politique de routage, filtres pare-feu, et chaque identifiant que l'appareil détient, le tout dans le même paste. Avant d'envoyer ça dans un ticket TAC ou un chat IA en demandant "pourquoi cette adjacence OSPF est bloquée", mieux vaut savoir exactement ce qu'il y a dedans.

## Ce que contient réellement une config JunOS

- `root-authentication encrypted-password` — un hash Juniper préfixé `$9$` pour le compte root
- Des chaînes `snmp community`, souvent avec `authorization read-write`
- Les `authentication-key` BGP et OSPF/IS-IS (MD5, parfois en clair dans les anciennes configs)
- Les clés pré-partagées IPsec `ike proposal` sous `security ike policy ... pre-shared-key`
- Les valeurs `secret` RADIUS et TACACS+ sous `system radius-server` / `system tacplus-server`
- Les hashs `authentication encrypted-password` des utilisateurs locaux pour chaque compte configuré

## Avant et après

La même communauté SNMP ou le même secret partagé est toujours mappé au même token dans toute la sortie nettoyée, donc les relations entre interfaces, politiques et voisins restent intactes — seul l'identifiant littéral est remplacé.

## Étapes

1. Installez ScrubForge depuis le Chrome Web Store (gratuit)
2. Exécutez `show configuration | display set` ou la forme hiérarchique classique sur votre équipement Juniper
3. Collez la sortie dans ScrubForge
4. Vérifiez le résultat nettoyé — hashs, clés et communautés sont tokenisés, la structure reste intacte
5. Copiez et partagez, ou continuez dans le chat IA intégré de ScrubForge

## Pourquoi le traitement local compte

Un hash root `$9$` ou une clé MD5 BGP collé dans un ticket TAC ou un journal de chat partagé y reste indéfiniment. ScrubForge nettoie entièrement à l'intérieur de l'onglet du navigateur — rien n'est envoyé avant que vous décidiez de le partager.

## À lire aussi

- [Nettoyer une configuration réseau avant de la partager](/fr/blog/nettoyer-configuration-reseau/)
- [ScrubForge](/fr/scrubforge/)
