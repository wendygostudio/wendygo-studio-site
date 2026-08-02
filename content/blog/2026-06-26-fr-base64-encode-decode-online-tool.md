---
schemaVersion: 1
title: >-
  Encodage et décodage Base64 en ligne – Pas de téléchargement, pas de ligne de
  commande
description: >-
  Encodez et décodez Base64 dans votre navigateur sans rien télécharger.
  TextForge est une extension Chrome gratuite avec une conversion instantanée
  Base64 ainsi que plus de 50 autres utilitaires de texte.
date: 2026-06-26T00:00:00.000Z
slug: base64-encode-decode-online-tool
locale: fr
translationKey: base64-encode-decode-online-tool
product: textforge
contentType: how-to
primaryKeyword: '>-'
relatedPages: /textforge/
---

# Encodage et décodage Base64 directement dans votre navigateur

Base64 apparaît partout dans le développement : jetons JWT, clés API dans les fichiers de configuration, URI de données d'image en CSS, en-têtes HTTP Basic Auth, pièces jointes MIME de courrier électronique. Le problème n’est pas de comprendre ce qu’est Base64 – c’est la friction liée à l’encodage ou au décodage d’une chaîne lorsque vous en avez besoin.

Les deux solutions de contournement les plus courantes sont une commande de terminal (« echo -n "text" | base64`) ou un outil Web aléatoire. Les commandes de terminal conviennent si vous êtes sur une machine Unix avec un terminal ouvert, mais elles sont maladroites sous Windows et nécessitent un changement de contexte. Les outils Web aléatoires fonctionnent, mais vous envoyez vos données (souvent des clés API, des jetons ou des valeurs de configuration) à un serveur inconnu.

Il existe une option plus propre : une extension de navigateur qui effectue la conversion localement, sans téléchargement, sans quitter votre navigateur.

## Qu’est-ce que Base64 ?

Base64 est un système de codage binaire en texte. Il convertit des données arbitraires en une chaîne composée de 64 caractères ASCII imprimables (A–Z, a–z, 0–9, `+`, `/`), avec `=` utilisé comme remplissage. La sortie codée est environ 33 % plus grande que l’entrée.

Le but n’est pas la compression ou la sécurité. Il s'agit de transmettre des données en toute sécurité via des systèmes qui gèrent uniquement du texte ou d'intégrer des données binaires dans des formats qui attendent des chaînes (comme JSON, XML ou CSS). Toute personne possédant la chaîne codée peut la décoder.

## Quand vous avez réellement besoin de Base64

**Jetons JWT :** Un jeton Web JSON comporte trois sections codées en Base64url reliées par des points. L'en-tête et la charge utile ne sont pas chiffrés : le décodage de la section centrale révèle les revendications JSON brutes : expiration, ID utilisateur, rôles, étendues.

**HTTP Basic Auth :** L'en-tête `Authorization: Basic <value>` contient une chaîne `username:password` codée en Base64. Le décoder est un moyen rapide de vérifier les informations d’identification qu’une requête envoie réellement.

**URI de données :** Les petites images et les SVG peuvent être intégrés directement dans CSS ou HTML en tant qu'URI `data:image/png;base64,…`. Vous devez encoder en Base64 le contenu du fichier pour produire la chaîne d'intégration.

**Fichiers de configuration :** Les secrets Kubernetes, les variables d'environnement CI et de nombreux autres outils stockent des valeurs sensibles sous forme de chaînes codées en base64 dans YAML ou JSON. Vous encodez la valeur brute avant de la coller dans la configuration.

**E-mail MIME :** Les pièces jointes des e-mails sont codées en Base64 dans le corps brut du message. Lors du débogage de la livraison d'e-mails ou de l'analyse des messages MIME bruts, vous devrez décoder la charge utile des pièces jointes.

## Pourquoi ne pas simplement utiliser le terminal ou un outil Web ?

| Method | The friction |
|--------|-------------|
| `echo -n "…" \| base64` | Only works on macOS/Linux. Requires a terminal and the exact syntax (`-n` is critical — without it you encode a trailing newline). |
| `certutil -encode` (Windows) | Adds a header/footer you have to strip. Writes to a file, not stdout. Awkward for quick one-offs. |
| Online web tools | Your data goes to a remote server. Fine for generic text; bad habit for tokens, credentials, or keys. |
| Python one-liner | Requires Python installed and a terminal — more steps than it should be for something this common. |

Une extension de navigateur résout tout cela : toujours disponible, aucun terminal requis, fonctionne entièrement sur votre machine.

## Comment encoder et décoder Base64 avec TextForge

TextForge est une extension Chrome avec plus de 50 fonctions utilitaires de texte. L'encodage et le décodage Base64 sont tous deux inclus. Aucune donnée ne quitte votre machine : tout s'exécute dans le contexte local de l'extension.

### Encodage : Texte → Base64

1. **Installez TextForge** depuis le Chrome Web Store. Épinglez l'icône à votre barre d'outils pour qu'elle soit toujours à portée de clic.
2. **Ouvrez l'extension** en cliquant sur l'icône TextForge dans la barre d'outils de votre navigateur.
3. **Collez votre texte** : la chaîne que vous souhaitez encoder. Il peut s'agir de texte brut, d'une URL, de JSON ou de toute chaîne dont vous avez besoin sous forme Base64.
4. **Appliquer l'encodage Base64** : sélectionnez la fonction dans le menu Outils. La sortie codée apparaît immédiatement.
5. **Copiez le résultat** dans votre presse-papiers. Terminé – pas de chargement de page, pas d’aller-retour sur le serveur.

### Décodage : Base64 → Texte

Le processus est identique à l'envers : collez la chaîne Base64, sélectionnez Base64 Decode et copiez le texte original.

## Exemples pratiques

**Inspection d'une charge utile JWT.** Divisez n'importe quel JWT en points. La deuxième section est la charge utile – JSON codé en Base64url. Collez-le dans TextForge, décodez-le et vous voyez les revendications brutes. (Base64url utilise `-` au lieu de `+` et `_` au lieu de `/`, mais pour l'inspection de la charge utile, il décode correctement.)

**Création d'un secret Kubernetes.** Kubernetes stocke les valeurs secrètes sous forme de chaînes codées en base64 dans le manifeste. Encodez votre mot de passe brut ou votre clé API avec TextForge et collez le résultat directement dans le bloc `data:` de votre YAML secret.

**Vérification d'un en-tête Basic Auth.** Capturez l'en-tête `Authorization` de DevTools, supprimez le préfixe `Basic` principal, collez le reste dans TextForge, décodez-le et confirmez que la paire `username:password` est correcte.

## Autres utilitaires de texte dans TextForge

Base64 est l'une des plus de 50 fonctions de TextForge. Si vous travaillez avec du texte dans le navigateur, vous trouverez également une utilisation fréquente pour : nettoyer les espaces, convertir la casse, trier les lignes, extraire des e-mails ou des URL à partir d'un bloc de texte, générer des UUID et créer des slugs à partir de titres. Il s'agit d'une boîte à outils de texte à usage général qui reste utile bien au-delà de Base64.

---

TextForge est gratuit à installer. L'encodage et le décodage Base64 sont disponibles dans la version gratuite — aucun compte ni abonnement requis.

[Install TextForge from the Chrome Web Store →](https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba)
