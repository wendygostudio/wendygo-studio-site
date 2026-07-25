---
schemaVersion: 1
title: "Nettoyer une Config Routeur MikroTik Avant de la Partager"
description: "MikroTik masque les mots de passe dans les exports RouterOS. Topologie et adresses serveur restent visibles. Voici quoi vérifier avant."
date: 2026-07-25
slug: nettoyer-configuration-routeur-mikrotik
locale: fr
translationKey: sanitize-mikrotik-router-config
product: scrubforge
contentType: how-to
primaryKeyword: "nettoyer une config routeur MikroTik avant de la partager"
relatedPages: /fr/scrubforge/,/fr/blog/ce-que-la-faille-sonicwall-enseigne/,/fr/ressources/
sourceUrls: https://help.mikrotik.com/docs/spaces/ROS/pages/380076066/List+of+menus+with+sensitive+parameters,https://help.mikrotik.com/docs/spaces/ROS/pages/328155/Configuration+Management,https://mikrotik.com/download/changelogs
heading: "Nettoyer une Config Routeur MikroTik Avant de la Partager"
shortTitle: "Nettoyer une config MikroTik"
intro: "RouterOS masque les mots de passe dans /export par défaut. Il reste quand même la topologie, les commentaires et les adresses serveur dans le fichier que tu colles dans un forum, un ticket ou un chat IA."
faqs:
  - question: "show-sensitive remplace-t-il le besoin de nettoyer une config MikroTik ?"
    answer: "Non. show-sensitive contrôle seulement si RouterOS affiche sa propre liste prédéfinie de champs sensibles — mots de passe, clés, secrets. Tout le reste dans l'export, y compris les adresses IP, les commentaires et les adresses serveur, reste visible de toute façon. C'est justement le rôle de ScrubForge."
  - question: "Le nettoyage va-t-il casser la config si je dois la réimporter ?"
    answer: "Ne nettoie qu'une copie destinée à la discussion, un message de forum ou un ticket de support — pas le fichier que tu prévois de réimporter. Une réimportation nécessite les vraies valeurs d'identifiants, donc garde ton export de travail séparé de la version nettoyée que tu partages publiquement."
  - question: "ScrubForge reconnaît-il spécifiquement la syntaxe RouterOS ?"
    answer: "Oui. RouterOS fait partie des douze syntaxes de configuration d'appareils couvertes par la bibliothèque de modèles de ScrubForge, aux côtés de Cisco, FortiGate, Juniper et Palo Alto, entre autres."
  - question: "Que faire si j'ai déjà posté une config MikroTik non nettoyée ?"
    answer: "Modifie ou supprime le message si la plateforme le permet, puis fais tourner tout identifiant exposé — mots de passe, clés pré-partagées, secrets RADIUS. Remplacer les valeurs après coup n'annule pas ce qui était visible pendant que le message était en ligne."
---

Poster un export de config routeur dans un fil de forum ou un ticket de support fait partie du travail courant d'admin, et les admins MikroTik en ont fait beaucoup ce mois-ci : RouterOS 7.21.5 (long terme) et 6.49.20 sont sortis le 6 juillet 2026, et une mise à niveau signifie généralement extraire un `/export` frais pour comparer avant/après.

> **Ce que show-sensitive masque réellement**
> Par défaut, `/export` masque mots de passe, clés et secrets dans une liste documentée de menus — clés WireGuard, secrets RADIUS, mots de passe PPP, mots de passe communautaires SNMP, et une quarantaine d'autres champs. Cela ne touche pas les adresses IP, les commentaires, ni rien en dehors de cette liste.

## Ce que RouterOS masque déjà pour toi

La documentation de MikroTik est précise sur ce point : la commande `export` "n'exporte pas les mots de passe utilisateur système, les certificats installés, les clés SSH, ni les bases de données Dude ou User-manager", et tout ce qui est considéré comme sensible est masqué sauf si tu ajoutes `show-sensitive` à la commande. Il existe un tableau de référence officiel listant exactement quel menu et quel champ est masqué : la [liste des menus avec paramètres sensibles](https://help.mikrotik.com/docs/spaces/ROS/pages/380076066/List+of+menus+with+sensitive+parameters) couvre `private-key` et `preshared-key` WireGuard, `secret` RADIUS, `authentication-password` SNMP, `secret` PPP, les clés IPsec, `password` VRRP, et plus encore.

C'est un comportement par défaut vraiment utile. Mais on peut facilement en conclure que « l'export est sans risque à coller n'importe où », ce qui n'est pas tout à fait vrai.

## Ce qu'un export « propre » contient encore

Masquer une liste fixe de noms de paramètres ne touche ni le texte libre ni rien en dehors de cette liste. Un `/export` par défaut inclut toujours :

<div class="key-points">
  <h3>Toujours entièrement visible après masquage show-sensitive</h3>
  <ul>
    <li>chaque adresse IP configurée, sous-réseau et point de terminaison de pair WAN ;</li>
    <li>les commentaires d'interface et de VLAN, qui nomment souvent des systèmes ou clients internes ;</li>
    <li>les adresses de serveurs RADIUS, NTP, DNS et SNMP — l'adresse, pas seulement le secret ;</li>
    <li>les noms de communauté SNMP, quand ce sont des chaînes descriptives plutôt que des mots de passe ;</li>
    <li>l'identité système, les pairs de routage et les listes d'adresses du pare-feu.</li>
  </ul>
</div>

Rien de tout cela n'est un bug. Le [guide de gestion de configuration de MikroTik](https://help.mikrotik.com/docs/spaces/ROS/pages/328155/Configuration+Management) montre lui-même des sous-réseaux internes d'apparence réelle dans ses propres exemples d'export, parce que la topologie est exactement ce dont une importation a besoin. C'est juste quelque chose que tu ne veux pas forcément montrer à un inconnu sur un forum, ou à une file de support externe, associé à ton IP publique.

## Nettoyer avant même que show-sensitive n'entre en jeu

<div class="step-card">
  <span class="step-label">Méthode</span>
  <strong>Exporter, coller, vérifier, partager</strong>
  <p>Lance <code>/export file=config</code> comme d'habitude — omets <code>show-sensitive</code>, tu n'en as pas besoin pour une demande de support ou un message de forum. Ouvre [ScrubForge](/fr/scrubforge/), colle le résultat, et il repère les chaînes ressemblant à des identifiants correspondant à la syntaxe RouterOS, remplaçant chaque valeur unique par un jeton cohérent comme <code>[RADIUS_SECRET_1]</code>. Tout s'exécute localement dans l'onglet du navigateur ; rien n'est envoyé nulle part.</p>
</div>

| Avant (export brut) | Après (nettoyé) |
|---|---|
| `set 0 password=Adm1nR0S!` | `set 0 password=[PASSWORD_1]` |
| `secret="Sup3rShared" address=10.20.0.1` | `secret=[RADIUS_SECRET_1] address=10.20.0.1` |
| `private-key="wG9K...=="` | `private-key=[WG_KEY_1]` |

Remarque que l'adresse du pair reste en place. C'est ce dont un lecteur de forum ou un technicien de support a réellement besoin pour t'aider — pas le secret juste à côté.

## La même habitude fonctionne pour chaque fabricant

Nous avons déjà couvert cette méthode pour les configs Cisco et FortiGate. MikroTik est l'une des douze syntaxes de fabricants que reconnaît ScrubForge, aux côtés de Juniper et Palo Alto — même principe, noms de champs différents à chaque fois. Si tu colles dans un ticket de support plutôt que dans un forum public, la même habitude de nettoyer d'abord s'applique avant que le fichier ne quitte ta machine.

## Avant de publier

Une courte note à côté de l'export nettoyé aide : « identifiants remplacés par des jetons ; la structure est intacte ». Cela indique à quiconque lit le fil qu'aucun mot de passe actif ne s'y trouve, et cela prend dix secondes à ajouter.

## Questions fréquentes

### show-sensitive remplace-t-il le besoin de nettoyer une config MikroTik ?

Non. show-sensitive contrôle seulement si RouterOS affiche sa propre liste prédéfinie de champs sensibles — mots de passe, clés, secrets. Tout le reste dans l'export, y compris les adresses IP, les commentaires et les adresses serveur, reste visible de toute façon. C'est justement le rôle de ScrubForge.

### Le nettoyage va-t-il casser la config si je dois la réimporter ?

Ne nettoie qu'une copie destinée à la discussion, un message de forum ou un ticket de support — pas le fichier que tu prévois de réimporter. Une réimportation nécessite les vraies valeurs d'identifiants, donc garde ton export de travail séparé de la version nettoyée que tu partages publiquement.

### ScrubForge reconnaît-il spécifiquement la syntaxe RouterOS ?

Oui. RouterOS fait partie des douze syntaxes de configuration d'appareils couvertes par la bibliothèque de modèles de ScrubForge, aux côtés de Cisco, FortiGate, Juniper et Palo Alto, entre autres.

### Que faire si j'ai déjà posté une config MikroTik non nettoyée ?

Modifie ou supprime le message si la plateforme le permet, puis fais tourner tout identifiant exposé — mots de passe, clés pré-partagées, secrets RADIUS. Remplacer les valeurs après coup n'annule pas ce qui était visible pendant que le message était en ligne.
