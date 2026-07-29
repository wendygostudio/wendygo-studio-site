---
schemaVersion: 1
title: "Décoder un JWT localement et lire ses claims"
description: "Lisez l'en-tête et les claims d'un JWT dans le navigateur, sans téléverser le jeton."
date: 2026-07-26
slug: decoder-jwt-localement
locale: fr
translationKey: decode-jwt-online
product: textforge
contentType: how-to
primaryKeyword: "décoder JWT localement"
relatedPages: /textforge/
---

Un JSON Web Token comporte généralement un en-tête, une charge utile et une signature. L'en-tête et la charge utile sont encodés, non chiffrés : vous pouvez lire localement une expiration (`exp`) ou des claims.

Collez le jeton dans [TextForge](/fr/textforge/) et consultez les champs décodés. Ne partagez pas un jeton sans nécessité : il peut contenir des données personnelles ou des informations d'accès.

Un décodage réussi ne signifie pas que le jeton est authentique, valide ou autorisé. L'application doit vérifier la signature, l'émetteur, l'audience et la durée selon ses règles de sécurité.
