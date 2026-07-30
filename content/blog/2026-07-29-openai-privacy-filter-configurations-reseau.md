---
schemaVersion: 1
title: "Le Privacy Filter d'OpenAI Ne Sait Pas Ce Qu'est un Mot de Passe BGP"
description: "OpenAI a publié en open source un modèle qui caviarde les PII avant qu'elles n'atteignent une IA. Voici exactement ce qu'il détecte, ce qu'il n'a jamais été conçu pour détecter, et pourquoi les configs réseau ont toujours besoin d'un outil dédié."
date: 2026-07-29
slug: openai-privacy-filter-configurations-reseau
locale: fr
translationKey: openai-privacy-filter-network-configs
product: scrubforge
contentType: use-case
primaryKeyword: "openai privacy filter configuration réseau"
relatedPages: /scrubforge/
---

OpenAI a récemment publié en open source Privacy Filter, un petit modèle conçu pour détecter et caviarder les informations personnelles identifiables dans du texte, qui s'exécute en local, sur un ordinateur portable ou directement dans le navigateur, et affiche un score F1 de 96-97 % en détection de PII. C'est une publication réellement utile. Ce n'est pas non plus conçu pour protéger ce que la plupart des ingénieurs réseau collent réellement dans un chat IA : une configuration de routeur ou de pare-feu.

## À quoi sert vraiment Privacy Filter

<div class="key-points">
  <h3>Ce que cible le modèle</h3>
  <ul>
    <li>Noms, emails, numéros de téléphone, adresses — des PII classiques, du type qui apparaît dans les emails, les tickets de support et les documents juridiques.</li>
    <li>Détection consciente du contexte sur des documents longs, jusqu'à 128 000 tokens en une seule passe, une véritable prouesse d'ingénierie pour ce cas d'usage.</li>
    <li>S'exécute sur l'appareil, poids ouverts, licence Apache 2.0 — aucune donnée ne quitte la machine pour être caviardée, le bon modèle de confidentialité.</li>
  </ul>
</div>

C'est un outil solide pour ce pour quoi il a été conçu : documents juridiques, fils d'emails, dossiers clients. C'est un modèle de PII généraliste, entraîné sur le type de données personnelles qui apparaît dans tous les secteurs.

## Ce qu'il n'a jamais été entraîné à reconnaître

Un fichier de configuration réseau ne ressemble pas à un document juridique ou à un dossier client. Il ressemble à ceci :

```
enable secret 5 $1$mERr$hx5rVt7rPNoS4wqbXKX7m0
snmp-server community publicRW RW
router bgp 65001
 neighbor 203.0.113.1 remote-as 65002
 neighbor 203.0.113.1 password 7 08351A5D0713
```

<div class="step-card">
  <span class="step-label">Vérification de la réalité</span>
  <strong>Rien de tout cela n'est une PII, et tout cela est un identifiant</strong>
  <p>Une chaîne de communauté SNMP, un mot de passe de voisin BGP, une clé d'authentification OSPF, une clé de serveur TACACS+, une clé pré-partagée WPA — rien de tout cela ne correspond à la distribution d'entraînement d'un modèle de PII généraliste, parce que ce ne sont pas des noms, des emails ou des numéros de téléphone. Ce sont des secrets spécifiques à un domaine qui n'ont de sens que dans le contexte de la syntaxe de configuration réseau, et un modèle entraîné sur des données juridiques et clients n'a jamais eu de raison d'en voir un.</p>
</div>

Il existe un second écart tout aussi important : **la robustesse des identifiants**. `enable secret 5` est un hash MD5. `password 7` est un chiffrement Cisco type 7, trivialement réversible avec des outils qui existent depuis plus d'une décennie. Un modèle de caviardage de PII n'a aucune notion de "ce hash est faible" ou "cet encodage est réversible" — il reconnaît un motif comme PII ou il ne le reconnaît pas. Distinguer un hash bcrypt robuste d'un mot de passe Cisco type 7 réversible nécessite de connaître les schémas d'encodage du fournisseur, pas seulement de reconnaître un texte à l'allure sensible.

## Tester l'écart

Faites passer un vrai export Cisco, FortiGate ou MikroTik dans un détecteur de PII généraliste, et le schéma est constant : il attrape quelque chose s'il y a une adresse email ou un nom d'hôte qui ressemble à un domaine, et il passe complètement à côté de l'`enable secret`, de la communauté SNMP, du mot de passe de voisin BGP et de la clé pré-partagée. Ce n'est pas un défaut du modèle. C'est simplement en dehors de ce pour quoi il a été entraîné à chercher, de la même façon qu'un correcteur orthographique n'est pas cassé parce qu'il ne détecte pas une erreur de calcul.

## Ce que cela signifie si vous collez des configs dans des outils IA

La bonne lecture de la publication d'OpenAI n'est pas "le caviardage est désormais un problème résolu". C'est l'inverse : le caviardage de PII généraliste tend vers la gratuité et la banalisation, ce qui est réellement une bonne chose pour quiconque traite des noms, des emails et des données clients. Mais cela affine précisément où se situe l'écart restant : les secrets spécifiques à un domaine dans des formats techniques structurés, les configs réseau étant l'un des exemples les plus clairs.

<table>
<tr><th>Couvert par les modèles de PII généralistes</th><th>Non couvert, nécessite une détection consciente du fournisseur</th></tr>
<tr><td>Noms, emails, numéros de téléphone</td><td>Chaînes de communauté SNMP</td></tr>
<tr><td>Adresses physiques</td><td>Clés d'authentification BGP / OSPF / HSRP</td></tr>
<tr><td>Numéros de carte de crédit</td><td>Clés de serveur TACACS+ / RADIUS</td></tr>
<tr><td>Formats génériques de clés API</td><td>Encodages de mot de passe spécifiques au fournisseur (ex. Cisco type 7)</td></tr>
<tr><td>—</td><td>Classification de la robustesse des hash/chiffrements</td></tr>
</table>

Si vous collez une configuration dans ChatGPT, Claude ou Gemini pour déboguer un problème de routage, un filtre PII généraliste qui tourne en arrière-plan ne capturera pas la partie qui compte réellement. [ScrubForge](/fr/scrubforge/) est conçu spécifiquement pour cet écart : 12 profils fournisseurs, détection de secrets au niveau protocole (BGP, OSPF, HSRP, TACACS+, RADIUS, SNMP), et classification de la robustesse des hash, s'exécutant entièrement en local, avec un chat BYOK optionnel qui ne voit jamais que la version tokenisée de votre config.

## Questions fréquentes

### Le Privacy Filter d'OpenAI protège-t-il les mots de passe dans une configuration de routeur ou de pare-feu ?

Pas de façon fiable. Il est entraîné à détecter des PII générales, noms, emails, numéros de téléphone, pas des identifiants réseau spécifiques à un fournisseur comme les chaînes de communauté SNMP ou les mots de passe de voisin BGP, qui suivent une syntaxe entièrement différente et n'ont pas fait partie de son périmètre d'entraînement.

### Si ChatGPT ajoute un jour un caviardage de PII intégré, les configs réseau resteront-elles à risque ?

Oui, pour la même raison. Un caviardage intégré visant la conformité PII générale ne sera pas calibré pour reconnaître la syntaxe de configuration de routeur ou de pare-feu, sauf si un fournisseur s'entraîne spécifiquement pour cela, ce qui est un cas d'usage étroit et à faible volume comparé aux motifs de PII qui apparaissent dans tout autre type de document.

### Quelle est la différence pratique entre le caviardage de PII et la sanitisation de configuration ?

Le caviardage de PII protège les données personnelles, des informations qui identifient une personne. La sanitisation de configuration protège les secrets d'infrastructure, les identifiants et la topologie qui identifient et donnent accès à un réseau. Ils se recoupent dans presque aucun cas, et un outil conçu pour l'un couvre rarement bien l'autre.

### Est-il toujours nécessaire de sanitiser les configs manuellement si je fais confiance au fournisseur IA ?

Sanitiser avant de coller vous protège indépendamment de ce que promet un fournisseur sur le traitement des données, et protège contre le risque plus simple qu'un collègue, un écran partagé, ou un journal de chat copié-collé transporte un identifiant actif là où il ne devrait pas aller.
