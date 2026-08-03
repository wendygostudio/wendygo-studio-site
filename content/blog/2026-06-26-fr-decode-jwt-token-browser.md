---
schemaVersion: 1
title: Comment décoder une charge utile de jeton JWT dans votre navigateur
description: >-
  Inspectez les revendications JWT (ID utilisateur, expiration, rôles)
  directement dans votre navigateur sans coller de jetons dans jwt.io ou dans un
  outil Web. TextForge décode Base64url localement.
date: 2026-06-26T00:00:00.000Z
slug: decode-jwt-token-browser
locale: fr
translationKey: decode-jwt-token-browser
product: textforge
contentType: how-to
primaryKeyword: comment décoder une charge utile de jeton jwt dans votre navigateur
relatedPages: /fr/textforge/
---

# Comment décoder une charge utile de jeton JWT dans votre navigateur

Les JWT (JSON Web Tokens) sont utilisés pour l'authentification dans presque toutes les API modernes. Ils ressemblent à du bruit aléatoire – trois sections codées en Base64url reliées par des points – mais la section de charge utile contient du JSON lisible : ID utilisateur, expiration, rôles, étendues. Il vous suffit de le décoder.

Lorsque vous déboguez un flux d'authentification, vérifiez pourquoi une requête reçoit des 401 ou vérifiez quelles revendications un service envoie, vous devez voir cette charge utile. Voici le moyen le plus rapide de le faire dans votre navigateur sans coller de jetons dans un site tiers.

## Qu'y a-t-il à l'intérieur d'un JWT

Un JWT comporte trois sections séparées par des points :

```
HEADER.PAYLOAD.SIGNATURE
```

- **En-tête** — type de jeton et algorithme de signature (par exemple RS256, HS256)
- **Charge utile** — les revendications au format JSON, codées en Base64url
- **Signature** — vérifie que le jeton n'a pas été falsifié

La charge utile est la section souhaitée. Ce n’est pas crypté – juste codé. Vous n'avez pas besoin de la clé secrète pour le lire ; vous n'avez besoin que de la clé pour vérifier son authenticité.

## Comment décoder la charge utile avec TextForge

TextForge est une extension Chrome avec plus de 50 fonctions utilitaires de texte. Le décodage Base64 est inclus dans la version gratuite et fonctionne entièrement sur votre machine.

1. **Copiez le JWT** — depuis DevTools (onglet Réseau → en-tête Autorisation), votre client API ou une variable d'environnement.
2. **Identifiez la section de charge utile** : il s'agit du deuxième morceau, entre le premier et le deuxième points.
3. **Ouvrez TextForge** — cliquez sur l'icône d'extension dans la barre d'outils de votre navigateur.
4. **Collez la section de charge utile** dans la zone de saisie.
5. **Appliquer le décodage Base64** : les revendications JSON apparaissent immédiatement.

## Ce que vous verrez

Après décodage, vous obtiendrez du JSON comme :

```json
{"sub": "user_123", "email": "user@example.com", "role": "admin", "exp": 1762000000, "iat": 1750000000}
```

Allégations courantes à rechercher :
- `sub` — sujet (généralement un identifiant ou un nom d'utilisateur)
- `exp` — expiration sous forme d'horodatage Unix (secondes depuis l'époque)
- `iat` — horodatage d'émission à
- `aud` — public (à quel service le jeton est destiné)
- `roles` / `scope` — autorisations accordées au jeton

## Pourquoi ne pas utiliser jwt.io ?

jwt.io est l'outil standard et il est pratique. Mais il envoie votre JWT à un serveur. Pour les jetons contenant des données utilisateur réelles, des ID utilisateur internes ou des revendications de portée, les coller dans un outil tiers est une habitude à éviter, en particulier lors du débogage en production.

TextForge décode localement. Le jeton ne quitte jamais votre navigateur.

## Foire aux questions

**Puis-je décoder la signature JWT de cette façon ?**
La section de signature est également codée en Base64url, mais son décodage vous donne du binaire brut – et non du JSON lisible par l'homme. Ce que vous voulez réellement, c'est la charge utile (deuxième section), pas la signature (troisième).

**TextForge vérifie-t-il la signature JWT ?**
Non. TextForge décode la charge utile pour inspection. La vérification de la signature nécessite la clé secrète et est effectuée côté serveur. À des fins d’inspection, il suffit de décoder la charge utile.

**Est-ce que cela fonctionne hors ligne ?**
Oui. Le décodage Base64 s'exécute localement dans l'extension sans qu'aucun réseau ne soit requis.

---

[Install TextForge from the Chrome Web Store →](https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba)
