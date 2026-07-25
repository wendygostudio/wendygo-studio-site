---
schemaVersion: 1
title: "Ce Que la Faille SonicWall Enseigne sur le Partage de Config"
description: "Les sauvegardes cloud de SonicWall ont exposé les données de config de tous ses clients. Si cette sauvegarde n'était pas sûre, un ticket ne l'est pas non plus."
date: 2026-07-25
slug: ce-que-la-faille-sonicwall-enseigne
locale: fr
translationKey: what-the-sonicwall-backup-breach-teaches-about-config-sharing
product: scrubforge
contentType: use-case
primaryKeyword: "ma sauvegarde de config de pare-feu est-elle sûre à partager"
relatedPages: /fr/scrubforge/,/fr/blog/nettoyer-configuration-routeur-mikrotik/,/fr/ressources/
sourceUrls: https://www.sonicwall.com/support/notices/mysonicwall-cloud-backup-file-incident/kA1VN0000000RoD0AU,https://www.cisa.gov/news-events/alerts/2025/09/22/sonicwall-releases-advisory-customers-after-security-incident
heading: "Ce Que la Faille SonicWall Enseigne sur le Partage de Config"
shortTitle: "La leçon de la faille SonicWall"
intro: "SonicWall a confirmé qu'une attaque par force brute contre son portail MySonicWall.com a exposé des fichiers de sauvegarde de configuration de pare-feu pour chaque client ayant utilisé ce service cloud — pas un sous-ensemble, tous. Les fichiers provenaient directement de la fonction de sauvegarde officielle du fabricant."
faqs:
  - question: "Que s'est-il réellement passé lors de l'incident de sauvegarde SonicWall ?"
    answer: "Un attaquant a utilisé des techniques de force brute contre le portail client MySonicWall.com et a accédé à des fichiers de sauvegarde de configuration (.EXP). L'enquête de SonicWall, menée avec Mandiant, a d'abord estimé que moins de 5 % des clients utilisant la sauvegarde cloud étaient concernés, puis a confirmé dans sa mise à jour finale que tous les clients ayant utilisé la fonction de sauvegarde cloud étaient touchés."
  - question: "Les fichiers de sauvegarde exposés étaient-ils chiffrés ?"
    answer: "Partiellement. Les identifiants et secrets dans le fichier .EXP sont chiffrés individuellement (AES-256 sur les pare-feu Gen 7 et plus récents, le plus ancien 3DES sur Gen 6), mais le reste de la configuration est seulement encodé, pas chiffré — topologie, règles, plages IP et autres détails sont lisibles une fois décodés. SonicWall recommande lui-même de traiter tout fichier exposé comme un déclencheur de réinitialisation des identifiants."
  - question: "Cela signifie-t-il que les sauvegardes cloud des fabricants ne sont pas sûres ?"
    answer: "Non, l'avis de SonicWall concerne un portail compromis par force brute, pas une faille dans le concept de sauvegarde. La leçon est plus précise : un export de configuration contient plus de détails exploitables que la plupart des gens ne le supposent, donc partout où ce fichier ou son contenu voyage — une sauvegarde cloud du fabricant, un ticket de support, un chat IA — mérite le même examen."
  - question: "Que dois-je vérifier sur mon propre pare-feu après avoir lu ceci ?"
    answer: "Si tu utilises la fonction de sauvegarde cloud de MySonicWall, connecte-toi et vérifie la liste des problèmes dans Product Management > Issue List pour repérer les numéros de série concernés, puis suis les recommandations de réinitialisation essentielle des identifiants de SonicWall. Séparément, nettoie tout fichier de configuration avant de le coller n'importe où — un ticket de support, un message de forum ou un assistant IA."
---

La sauvegarde d'un fabricant est censée être l'endroit sûr pour ta configuration. En septembre 2025, SonicWall a confirmé que ce n'était pas vrai pour ses clients de sauvegarde cloud, et les détails méritent d'être lus même si tu n'utilises pas de pare-feu SonicWall.

> **Ce que SonicWall a confirmé**
> Un attaquant a mené des attaques par force brute contre le portail client MySonicWall.com et a obtenu l'accès à des fichiers de sauvegarde de configuration de pare-feu. L'[avis d'incident de SonicWall](https://www.sonicwall.com/support/notices/mysonicwall-cloud-backup-file-incident/kA1VN0000000RoD0AU), mené conjointement avec la société de réponse aux incidents Mandiant, a d'abord estimé que moins de 5 % des clients de sauvegarde cloud étaient concernés, puis a confirmé dans sa mise à jour finale que **tous** les clients ayant utilisé la fonction de sauvegarde cloud étaient touchés. [La CISA a publié son propre avis](https://www.cisa.gov/news-events/alerts/2025/09/22/sonicwall-releases-advisory-customers-after-security-incident) exhortant tous les clients SonicWall à vérifier leur compte.

## Ce que contenaient réellement les fichiers exposés

C'est la partie qui compte au-delà des clients spécifiques de SonicWall. Un export de configuration de pare-feu (un fichier `.EXP`) est un instantané complet de l'appareil : pas seulement des mots de passe, mais aussi la topologie, les plages IP, les règles et les détails d'intégration.

<div class="key-points">
  <h3>Ce qui est protégé, et ce qui ne l'est pas</h3>
  <ul>
    <li><strong>Les identifiants et secrets</strong> sont chiffrés individuellement — AES-256 sur les pare-feu Gen 7 et plus récents, le plus ancien 3DES sur Gen 6.</li>
    <li><strong>Tout le reste du fichier</strong> — topologie réseau, jeux de règles, adressage — est seulement encodé, pas chiffré, donc lisible après un simple décodage.</li>
    <li><strong>Le but même du fichier</strong> est de restaurer un appareil dans son état exact capturé, ce qui explique précisément pourquoi il est dangereux en dehors d'un canal de confiance : il est conçu pour contenir tout ce qui est nécessaire pour reconstruire ta configuration.</li>
  </ul>
</div>

L'avis de SonicWall est explicite sur ce point : même avec des identifiants chiffrés, « la possession de ces fichiers pourrait augmenter le risque d'attaques ciblées » en raison de tout ce que le fichier révèle par ailleurs sur la construction du réseau.

## Pourquoi cela s'applique à plus d'un fabricant

<div class="step-card">
  <span class="step-label">Cas d'usage</span>
  <strong>Le fichier de sauvegarde et le ticket de support ont le même problème</strong>
  <p>Que la configuration quitte ton contrôle via un portail de fabricant compromis, un message collé dans un forum, une fenêtre de chat IA ou une pièce jointe envoyée au support, le risque est le même : le fichier a été conçu pour contenir tout ce qui est nécessaire pour décrire ou reconstruire ton réseau, et la plupart de ces détails n'ont jamais été destinés à être exposés en dehors d'un canal de confiance. L'incident SonicWall rappelle que même le canal « officiel », validé par le fabricant, peut échouer. Un ticket de support ou un chat IA n'ont même pas le chiffrement qu'une sauvegarde cloud tente au moins d'appliquer.</p>
</div>

| Ce que contient un export de config brut | Ce qui est réellement nécessaire pour dépanner ou restaurer |
|---|---|
| Chaque règle de pare-feu, en entier | La ou les deux règles pertinentes pour le problème |
| Plages IP internes et topologie complètes | Assez de structure pour expliquer le problème, pas la carte entière |
| Noms d'hôtes, adresses de serveurs, points de terminaison d'intégration | Des marqueurs anonymisés qui préservent la logique |
| Tout identifiant ou clé intégré, même chiffré | Rien — les identifiants n'ont jamais leur place dans un fichier partagé |

## Avant de partager une config quelque part

Si tu [partages une config réseau avec une équipe de support](/fr/blog/nettoyer-configuration-routeur-mikrotik/), l'incident SonicWall est un bon argument pour la nettoyer d'abord, quel que soit le portail du fabricant, l'assistant IA ou le forum où tu publies. [ScrubForge](/fr/scrubforge/) supprime exactement les détails que révèle un fichier de sauvegarde : identifiants, plages IP, noms d'hôtes et topologie, tout en gardant la structure de la config suffisamment intacte pour réellement obtenir de l'aide.

Si tu utilises la fonction de sauvegarde cloud de MySonicWall, vérifie directement ton compte plutôt que de te fier uniquement à cet article : l'avis de SonicWall contient les étapes exactes, et la section Product Management > Issue List de ton compte MySonicWall indiquera si l'un de tes numéros de série a été signalé.

## Questions fréquentes

### Que s'est-il réellement passé lors de l'incident de sauvegarde SonicWall ?

Un attaquant a utilisé des techniques de force brute contre le portail client MySonicWall.com et a accédé à des fichiers de sauvegarde de configuration (.EXP). L'enquête de SonicWall, menée avec Mandiant, a d'abord estimé que moins de 5 % des clients utilisant la sauvegarde cloud étaient concernés, puis a confirmé dans sa mise à jour finale que tous les clients ayant utilisé la fonction de sauvegarde cloud étaient touchés.

### Les fichiers de sauvegarde exposés étaient-ils chiffrés ?

Partiellement. Les identifiants et secrets dans le fichier .EXP sont chiffrés individuellement (AES-256 sur les pare-feu Gen 7 et plus récents, le plus ancien 3DES sur Gen 6), mais le reste de la configuration est seulement encodé, pas chiffré — topologie, règles, plages IP et autres détails sont lisibles une fois décodés. SonicWall recommande lui-même de traiter tout fichier exposé comme un déclencheur de réinitialisation des identifiants.

### Cela signifie-t-il que les sauvegardes cloud des fabricants ne sont pas sûres ?

Non, l'avis de SonicWall concerne un portail compromis par force brute, pas une faille dans le concept de sauvegarde. La leçon est plus précise : un export de configuration contient plus de détails exploitables que la plupart des gens ne le supposent, donc partout où ce fichier ou son contenu voyage — une sauvegarde cloud du fabricant, un ticket de support, un chat IA — mérite le même examen.

### Que dois-je vérifier sur mon propre pare-feu après avoir lu ceci ?

Si tu utilises la fonction de sauvegarde cloud de MySonicWall, connecte-toi et vérifie la liste des problèmes dans Product Management > Issue List pour repérer les numéros de série concernés, puis suis les recommandations de réinitialisation essentielle des identifiants de SonicWall. Séparément, nettoie tout fichier de configuration avant de le coller n'importe où — un ticket de support, un message de forum ou un assistant IA.
</content>
