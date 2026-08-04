---
schemaVersion: 1
title: Supprimer les secrets des fichiers de configuration Kubernetes
description: >-
  Désinfectez Kubernetes YAML avant de le partager avec le support ou les
  assistants IA. Supprimez les clés API, les informations d'identification et
  les jetons localement avec ScrubForge.
date: 2026-07-31T00:00:00.000Z
slug: remove-secrets-kubernetes-config
locale: fr
translationKey: remove-secrets-kubernetes-config
product: scrubforge
contentType: use-case
primaryKeyword: supprimer les secrets de la configuration Kubernetes
relatedPages: /fr/scrubforge/
---

# Supprimer les secrets des fichiers de configuration Kubernetes

Kubernetes YAML mélange souvent la structure de déploiement avec des informations qui doivent rester à l'intérieur du cluster : jetons de service, clés API, mots de passe codés en base64 et informations d'identification de registre privé. Avant de coller un manifeste dans un ticket de support ou un assistant IA, supprimez ces valeurs sans détruire le contexte technique.

> **Important :** base64 est un codage, pas un chiffrement. Une valeur sous « data : » peut toujours être un identifiant récupérable.

## Que réviser

- Champs `Secret` et `stringData` contenant des mots de passe ou des jetons.
- Variables d'environnement telles que `AWS_SECRET_ACCESS_KEY`, `GITHUB_TOKEN` ou clés internes.
- URL avec noms d'utilisateur et mots de passe intégrés.
- ConfigMaps contenant des points de terminaison privés ou du matériel d'authentification.

L'objectif est de garder les noms, les relations et l'indentation lisibles tout en remplaçant les littéraux sensibles. La suppression de blocs entiers peut sembler propre, mais elle peut masquer la cause du problème que vous essayez de diagnostiquer.

## Désinfecter avant de partager

1. Exportez une copie de travail du manifeste, jamais le fichier utilisé par le cluster.
2. Collez la copie dans [ScrubForge](/scrubforge/).
3. Consultez l'aperçu : les clés et les jetons doivent devenir des espaces réservés cohérents.
4. Confirmez que les noms de ressources, les espaces de noms, les ports et les références restent visibles.
5. Partagez uniquement le résultat nettoyé et conservez l'original dans votre environnement sécurisé.

ScrubForge traite le texte localement dans le navigateur. Il détecte les modèles courants de secret de service et conserve le même jeton pour la même correspondance, afin qu'un réviseur puisse comprendre les relations sans en voir la valeur réelle.

<div class="key-points">
<h3>Before sharing the result</h3>
<ul>
<li><strong>Check comments:</strong> credentials can hide outside YAML values.</li>
<li><strong>Review base64:</strong> encoding does not make a secret safe to share.</li>
<li><strong>Read the output:</strong> ensure the YAML still explains the problem.</li>
</ul>
</div>

## Quand la désinfection ne suffit pas

Si un véritable identifiant a déjà été publié, considérez-le comme compromis : révoquez-le et émettez-en un de remplacement. La désinfection empêche une nouvelle exposition, mais elle ne remplace pas la rotation ou la révision des autorisations du cluster.

## Questions fréquemment posées

### ScrubForge décode-t-il tous les secrets de Kubernetes ?

Il détecte les modèles sensibles et les formats courants, mais vous devez toujours examiner manuellement les champs spécifiques à l'organisation.

### Le partage en base64 est-il sécurisé ?

Non. Base64 est un codage réversible, pas une protection.

### Le manifeste est-il téléchargé ?

ScrubForge le désinfecte localement. Vous devez toujours revoir le texte final avant de l’envoyer à un tiers.
