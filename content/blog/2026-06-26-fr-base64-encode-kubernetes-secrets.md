---
schemaVersion: 1
title: Base64 encode les secrets Kubernetes localement (pas d'outil Web)
description: >-
  Les manifestes secrets Kubernetes nécessitent des valeurs codées en base64.
  Voici comment encoder vos secrets bruts localement dans votre navigateur – pas
  de terminal, pas de site tiers.
date: 2026-06-26T00:00:00.000Z
slug: base64-encode-kubernetes-secrets
locale: fr
translationKey: base64-encode-kubernetes-secrets
product: textforge
contentType: how-to
primaryKeyword: comment encoder en base64 les secrets de Kubernetes sans outil Web
relatedPages: /textforge/
---

# Comment encoder en Base64 les secrets Kubernetes sans outil Web

Kubernetes stocke les valeurs sensibles dans les manifestes secrets. Contrairement aux ConfigMaps, qui acceptent le texte brut, les champs de « données » secrets nécessitent des valeurs codées en Base64. De nombreux développeurs collent des mots de passe bruts et des clés API dans des outils Base64 en ligne, qui envoient ces informations d'identification à un serveur tiers.

Il existe une option plus sûre : encodez directement dans votre navigateur à l'aide d'une extension Chrome qui ne transmet jamais vos données.

## Pourquoi Kubernetes utilise Base64

Les manifestes secrets Kubernetes ressemblent à ceci :

```yaml
Version api : v1
genre : Secret
métadonnées :
nom : informations d'identification de base de données
type: Opaque
données:
mot de passe : c3VwZXJzZWNyZXQ=
Clé API : c2tfdGVzdF84YzhiNDU2MA==
```

Les valeurs sous « data : » sont codées en Base64. Les valeurs brutes (`supersecret`, `sk_test_8c8b4560`) ne sont jamais stockées directement dans le manifeste.

**Important :** Base64 n'est pas un chiffrement. Toute personne ayant accès au manifeste secret peut décoder les valeurs instantanément. Les secrets Kubernetes assurent le contrôle d'accès au niveau du cluster : le codage Base64 est purement une exigence de format de l'API, et non une mesure de sécurité.

## Encodage de valeurs secrètes avec TextForge

TextForge est une extension Chrome avec plus de 50 utilitaires de texte. L'encodage Base64 est disponible dans la version gratuite et s'exécute entièrement localement.

1. **Ouvrez TextForge** — cliquez sur l'icône d'extension dans la barre d'outils de votre navigateur.
2. **Collez la valeur secrète brute** : votre mot de passe, votre clé API, votre chaîne de connexion ou toute valeur devant figurer dans le manifeste.
3. **Appliquer l'encodage Base64** — la chaîne codée apparaît immédiatement.
4. **Copiez le résultat** et collez-le dans le bloc `data:` de votre YAML Kubernetes.

Aucun terminal, aucun outil web, aucune donnée ne sortant de votre machine.

## Utiliser `stringData` à la place

Kubernetes accepte également un champ « stringData » qui prend des valeurs en texte brut — l'API les code automatiquement :

```yaml
chaîneDonnées :
mot de passe : supersecret
```

`stringData` convient aux valeurs que vous créez à nouveau. Mais si vous lisez un manifeste secret existant, les valeurs stockées seront toujours sous « data : » sous forme Base64 — c'est à ce moment-là que vous devrez les décoder pour inspection.

## Décodage à vérifier

Pour vérifier une valeur codée existante dans un manifeste, collez-la dans TextForge et appliquez le décodage Base64. Vous obtenez la valeur brute immédiatement, sans exécuter :

```bash
kubectl obtient les informations d'identification secrètes de la base de données -o jsonpath='{.data.password}' | base64 --décoder
```

## Foire aux questions

**L'encodage Base64 est-il requis pour tous les secrets Kubernetes ?**
Uniquement pour le champ `data:`. Si vous utilisez `stringData:`, Kubernetes gère l'encodage. La plupart des outils et didacticiels utilisent « data : » dans les exemples, d'où la nécessité d'encoder manuellement.

**Puis-je encoder des valeurs multilignes telles que des certificats TLS ?**
Oui. Collez le certificat complet (y compris l'en-tête et le pied de page `-----BEGIN CERTIFICATE-----`) dans TextForge et encodez-le. La chaîne résultante va dans le champ `data:`.

**Cette fonction est-elle gratuite dans TextForge ?**
Oui. L'encodage et le décodage Base64 sont dans la version gratuite – aucun compte ni abonnement requis.

---

[Install TextForge from the Chrome Web Store →](https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba)
