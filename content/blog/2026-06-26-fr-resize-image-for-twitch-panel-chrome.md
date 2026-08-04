---
schemaVersion: 1
title: >-
  Comment redimensionner une image pour les panneaux Twitch dans Chrome (320 ×
  160) – Pas de téléchargement, pas de tracas
description: >-
  Les panneaux Twitch se trouvent sous la biographie de votre chaîne : de
  petites boîtes rectangulaires dans lesquelles les streamers déposent des
  vignettes, des appels à l'action et des liens rapides. Ils sont...
date: 2026-06-26T00:00:00.000Z
slug: resize-image-for-twitch-panel-chrome
locale: fr
translationKey: resize-image-for-twitch-panel-chrome
product: frameforge
contentType: how-to
primaryKeyword: >-
  comment redimensionner une image pour les panneaux Twitch en chrome (320×160)
  — pas de téléchargement, pas de tracas
relatedPages: /fr/frameforge/
---

Les panneaux Twitch se trouvent sous la biographie de votre chaîne : de petites boîtes rectangulaires dans lesquelles les streamers déposent des vignettes, des appels à l'action et des liens rapides. Ils mesurent 320 × 160 px, ce qui est l'un des formats d'image les plus difficiles à utiliser. La plupart des éditeurs d'images adoptent des formats carrés ou larges. Une photo source qui semble correcte au format 16:9 est mutilée lorsque vous essayez de la compresser dans un rectangle ultra-large de 2:1.

Ce guide montre comment redimensionner les images des panneaux Twitch à l'aide de **FrameForge**, une extension Chrome qui gère les calculs pour vous et conserve vos images locales (pas de téléchargement sur un serveur).

## Dimensions du panneau Twitch

| Property | Value |
|----------|-------|
| **Panel size** | 320×160 px |
| **Aspect ratio** | 2:1 (ultra-wide) |
| **Max file size** | 10 MB |
| **Formats** | JPG, PNG, GIF, WebP |
| **Number of panels** | Up to 3 rows (unlimited, but only 3 visible per row) |

Les panneaux sont souvent négligés dans la conception des chaînes, mais ils sont la première chose qu'un visiteur voit après votre image d'en-tête. Un panneau mal recadré semble inachevé.

## Le défi des cultures

Un rectangle 2:1 coupe beaucoup verticalement. Si vous avez une photo portrait (9:16) ou même une photo au format 3:4, le cadre du panneau n'affichera qu'une fine tranche horizontale. Les paysages (16:9) sont plus proches mais nécessitent tout de même un recadrage spécifique pour éviter de laisser des espaces morts.

**FrameForge inclut un préréglage de panneau Twitch**, vous n'avez donc pas besoin de calculer manuellement les dimensions ni d'expérimenter les ratios de recadrage. Chargez votre image, sélectionnez le préréglage et ajustez la superposition de recadrage.

## Étape par étape : redimensionner les panneaux Twitch avec FrameForge

1. **Installez FrameForge** à partir du Chrome Web Store. Épinglez l'icône à votre barre d'outils.

2. **Ouvrez votre image.** Cliquez sur l'icône FrameForge, puis cliquez sur **Ouvrir l'image** ou faites glisser votre fichier sur le canevas.

3. **Sélectionnez le panneau Twitch dans la liste déroulante Plateforme.** Le canevas se verrouille immédiatement à 320 × 160 px.

4. **Ajustez le recadrage.** Faites glisser la superposition pour encadrer la partie de votre image qui compte le plus : votre visage, votre logo ou l'élément visuel clé. FrameForge vous permet de voir le recadrage en direct.

5. **Exporter.** Cliquez sur **Exporter**. FrameForge enregistre l'image redimensionnée dans votre dossier Téléchargements, prête à être téléchargée dans les paramètres de votre chaîne Twitch.

## Pourquoi les panneaux sont importants sur Twitch

Les panneaux sont des boîtes personnalisables dans lesquelles vous pouvez créer un lien vers :
- Votre serveur Discord
- Ko-fi ou Patreon
- Calendrier de diffusion ou réseaux sociaux
- Un portfolio ou Linktree

Chaque panneau est petit, mais collectivement, ils remplissent l'espace situé sous l'en-tête de votre chaîne. Les visiteurs les voient avant de voir grand chose d'autre. Une image de panneau nette et bien recadrée semble professionnelle. Un recadrage étiré ou décentré semble être une réflexion après coup.

Étant donné que les panneaux sont si étroits, vous devrez souvent recadrer plus serré que prévu. Une photo qui semble équilibrée au format 16:9 peut nécessiter des bords considérablement coupés pour fonctionner au format 2:1.

## Utilisations courantes du panneau Twitch

- **Logo ou icône de chaîne** – 320 × 160 fonctionne bien pour une version légèrement en forme de boîte aux lettres de votre logo
- **Liens sociaux** — Texte + icône (Discord, Twitter, Instagram)
- **Parrainage ou produit** — Couverture du jeu, interface du logiciel, photo de marchandise
- **Planification ou compte à rebours** — Superposition de texte sur un arrière-plan uni (bien que FrameForge n'ajoute pas de texte ; vous le feriez dans un autre outil)

## FrameForge est-il gratuit ?

Oui. FrameForge peut être installé gratuitement à partir du Chrome Web Store. La version gratuite comprend le préréglage du panneau Twitch et tous les outils de redimensionnement de base. Une version Pro ajoute la superposition de texte et le traitement par lots, mais pour le redimensionnement d'une seule image, la version gratuite est tout ce dont vous avez besoin.

**FrameForge traite tout dans votre navigateur.** Votre image ne touche jamais un serveur. Aucun compte requis. Aucune collecte de données.

Installez FrameForge maintenant : https://chromewebstore.google.com/detail/abdmadomfnijoiklnaklmplifmljgchj

---

## En rapport

- [How to Resize an Image for Instagram Posts in Chrome (1080×1080)](https://wendygostudio.com/blog/resize-image-for-instagram-chrome/) — FrameForge, same extension, different preset
- [How to Resize an Image for YouTube Thumbnails](https://wendygostudio.com/blog/resize-image-youtube-thumbnail-chrome/) — 1280×720, a more forgiving 16:9 ratio
