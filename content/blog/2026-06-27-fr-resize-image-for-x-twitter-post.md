---
schemaVersion: 1
title: >-
  Comment redimensionner une image pour les publications X (Twitter) dans Chrome
  (1200 × 675)
description: "Publiez des images à la bonne résolution de 1 200 × 675 px sans que rien ne soit recadré dans le flux X. FrameForge se redimensionne dans votre navigateur\_: pas de téléchargement, pas de Photoshop."
date: 2026-06-27T00:00:00.000Z
slug: resize-image-for-x-twitter-post
locale: fr
translationKey: resize-image-for-x-twitter-post
product: frameforge
contentType: how-to
primaryKeyword: comment redimensionner l'image pour x post Twitter
relatedPages: /fr/frameforge/
---

X restitue les images des tweets avec un recadrage 2:1 dans l'aperçu du flux. Les photos carrées ont la moitié inférieure coupée. Les portraits sont regroupés dans une tranche centrale peu pratique. La solution est simple : publiez à 1 200 × 675 px (16:9) et rien n’est recadré ni dans l’aperçu du flux, ni dans la vue développée en taille réelle.

FrameForge est une extension Chrome qui redimensionne entièrement les images dans votre navigateur. Pas de téléchargement, pas de compte, pas d'attente qu'un serveur distant traite votre fichier.

## Exigences de taille d'image X (Twitter)

| Format | Dimensions | Aspect ratio |
|--------|------------|--------------|
| Standard post image | 1200×675 px | 16:9 |
| Feed preview crop | ~2:1 center | — |
| Max file size | 5 MB (JPG/PNG) | — |
| Accepted formats | JPG, PNG, WebP, GIF | — |

1200 × 675 est le point idéal : il remplit exactement le recadrage de l'aperçu 2: 1, et l'image complète est affichée sans letter-boxing ni pillar-boxing lorsque le spectateur l'agrandit.

## Pourquoi les images carrées et portraits sont recadrées

X applique un recadrage central lors de l'affichage d'images en ligne dans le flux. Une image carrée 1:1 devient une tranche 2:1 : le quart supérieur et le quart inférieur disparaissent. Les images de portrait (9:16) sont encore plus recadrées : vous perdez environ 80 % de la hauteur de l'image dans l'aperçu du flux.

Le dimensionnement à 1200×675 élimine l’inadéquation. L'image est déjà au format 16:9, donc l'aperçu du flux 2:1 affiche simplement toute la largeur à la hauteur normale — pas de recadrage inattendu.

## Étape par étape : redimensionner pour X avec FrameForge

1. **Installez FrameForge** : installez-le à partir du Chrome Web Store et épinglez-le à votre barre d'outils.
2. **Ouvrez votre image** — cliquez sur l'icône FrameForge, puis ouvrez votre fichier ou faites-le glisser sur le canevas.
3. **Sélectionnez le préréglage X (Twitter) Post** — dans la liste déroulante Plateforme, sélectionnez X Post. La toile se verrouille à 1200 × 675 px.
4. **Ajustez le recadrage** : faites glisser la superposition de recadrage pour centrer votre sujet dans le cadre 16:9.
5. **Exporter** : cliquez sur Exporter. FrameForge enregistre l'image redimensionnée dans votre dossier Téléchargements.

## Gestion des images sources en mode portrait

Les photos de portrait (9:16, appareil photo du téléphone par défaut) nécessitent le plus d'ajustements pour s'adapter à un cadre 16:9 :

- **Recadrer pour remplir (recommandé) :** Le cadre 16:9 est complètement rempli. L'excédent du haut et du bas est coupé. Faites glisser la superposition de recadrage pour conserver l'élément clé dans le cadre.
- **Ajustement avec rembourrage :** Le portrait complet est visible, avec des barres noires ou colorées à gauche et à droite. Un remplissage intentionnel peut sembler délibéré, mais les barres nues ressemblent généralement à une erreur.
- **Étirer pour remplir :** Déforme l'image horizontalement. À éviter, sauf si la distorsion est un choix stylistique délibéré.

Pour les images source de paysage plus larges que 16:9 (recadrage cinéma, panoramas), l'excédent est rogné à gauche et à droite. Même logique : faites glisser la superposition pour centrer le sujet.

## Le flux de travail de redimensionnement de la plateforme sociale

Si vous publiez le même contenu sur plusieurs plateformes le même jour, FrameForge les couvre tous à partir d'une seule extension :

| Platform | Target size | Preset |
|----------|-------------|--------|
| X (Twitter) | 1200×675 px | X Post |
| YouTube | 1280×720 px | YouTube Thumbnail |
| Instagram (square) | 1080×1080 px | Instagram Post |
| Twitch panels | 320×160 px | Twitch Panel |

Redimensionnez une fois par plateforme, exportez chaque version en quelques clics, sans changer d'outil ni télécharger vers des services distincts.

## Foire aux questions

**Quelle est la meilleure taille d'image pour une publication X (Twitter) ?**
1200×675 px à 16:9. Cela remplit l'aperçu du flux sans recadrage et s'affiche en pleine dimension une fois développé. Conservez le fichier sous 5 Mo pour JPG/PNG.

**Est-ce que X recadre les images dans le flux ?**
Oui. X applique un recadrage central aux images en ligne dans le flux tweet, les rendant à environ 2:1. Les images publiées à 1 200 × 675 px (16:9) correspondent aux proportions de l’aperçu du flux et apparaissent sans recadrage inattendu.

**FrameForge télécharge-t-il des images sur un serveur ?**
Non. FrameForge est une extension Chrome qui traite entièrement les images dans votre navigateur. Rien n'est envoyé à un serveur. Aucun compte n'est requis.

**Puis-je utiliser la même image pour X et YouTube ?**
Les miniatures YouTube font 1 280 × 720 px et les publications X font 1 200 × 675 px — les deux sont au format 16:9, la composition est donc identique. FrameForge propose des préréglages pour les deux, vous pouvez donc exporter deux versions de la même image source sans recadrer.

**FrameForge est-il gratuit ?**
Oui. FrameForge peut être installé gratuitement à partir du Chrome Web Store. La version gratuite comprend des préréglages de plate-forme et un redimensionnement principal. Pro ajoute la superposition de texte et le traitement par lots.
