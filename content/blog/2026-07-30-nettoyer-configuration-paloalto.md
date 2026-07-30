---
schemaVersion: 1
title: "Comment Nettoyer une Configuration Palo Alto PAN-OS Avant de la Partager"
description: "Un export 'show config running' ou au format set de PAN-OS contient des hashs de mot de passe admin, des clés pré-partagées IKE et des secrets de bind RADIUS/LDAP. Voici ce qu'il faut retirer avant de le coller dans un chat IA ou un ticket de support."
date: 2026-07-30
slug: nettoyer-configuration-paloalto
locale: fr
translationKey: sanitize-paloalto-config
product: scrubforge
contentType: how-to
primaryKeyword: "nettoyer configuration palo alto pan-os"
relatedPages: /scrubforge/
---

Exporter la configuration d'un pare-feu Palo Alto pour un ticket de support ou une session de dépannage assistée par IA récupère d'un coup tout ce qui se trouve dans la configuration candidate ou active — structure des zones, règles de sécurité, NAT, et chaque secret que PAN-OS stocke à côté. Avant que cela ne quitte l'équipement, mieux vaut savoir exactement ce qu'il contient.

## Ce que contient réellement une config PAN-OS

- `phash` — le hash du mot de passe administrateur local sous `mgt-config users`
- Les valeurs `pre-shared-key` de l'IKE Gateway pour chaque tunnel VPN
- Les chaînes `snmp-setting` de communauté SNMP (v1/v2c) ou les mots de passe d'authentification/confidentialité v3
- Les secrets `server-profile` et mots de passe de bind RADIUS, LDAP et Kerberos utilisés pour l'authentification admin/GlobalProtect
- Les secrets pré-partagés du portail et de la gateway GlobalProtect ainsi que les phrases de passe des certificats
- Les clés API intégrées dans des scripts d'automatisation collés à côté de la config

## Avant et après

La même clé pré-partagée ou le même mot de passe de bind est toujours mappé au même token dans toute la sortie nettoyée, donc les relations entre tunnels VPN, zones et profils d'authentification restent lisibles — seul le secret littéral est remplacé.

## Étapes

1. Installez ScrubForge depuis le Chrome Web Store (gratuit)
2. Exportez avec `show config running` (ou l'équivalent au format `set`) depuis la CLI PAN-OS ou Panorama
3. Collez la sortie dans ScrubForge
4. Vérifiez le résultat nettoyé — hashs de mot de passe, clés pré-partagées et secrets de bind sont tokenisés, la structure reste intacte
5. Copiez et partagez, ou continuez dans le chat IA intégré de ScrubForge

## Pourquoi le traitement local compte

Une clé pré-partagée IKE ou un hash de mot de passe admin collé dans un ticket de support ou un journal de chat IA partagé y reste indéfiniment, hors de votre contrôle. ScrubForge nettoie entièrement à l'intérieur de l'onglet du navigateur — rien n'est envoyé avant que vous décidiez de le partager.

## À lire aussi

- [Nettoyer une configuration réseau avant de la partager](/fr/blog/nettoyer-configuration-reseau/)
- [ScrubForge](/fr/scrubforge/)
