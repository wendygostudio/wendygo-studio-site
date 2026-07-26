---
schemaVersion: 1
locale: fr
translationKey: decode-jwt-online
xDefaultPath: /blog/decode-jwt-online/
title: "Décoder un JWT localement et lire ses claims"
description: "Lisez l'en-tête et les claims d'un JWT dans le navigateur, sans téléverser le jeton."
date: 2026-07-26
slug: decoder-jwt-localement
product: TextForge
contentType: how-to
primaryKeyword: "décoder JWT localement"
relatedPages: "/fr/textforge/,/blog/decode-jwt-online/"
heading: "Décoder un JWT localement"
intro: "Lisez les parties visibles d'un JWT sans l'envoyer à un décodeur en ligne."
faqs:
  - question: "Le décodage vérifie-t-il la signature JWT ?"
    answer: "Non. Lire l'en-tête et la charge utile ne vérifie ni la signature ni la fiabilité."
---

Un JSON Web Token comporte généralement un en-tête, une charge utile et une signature. L'en-tête et la charge utile sont encodés, non chiffrés : vous pouvez lire localement une expiration (`exp`) ou des claims.

Collez le jeton dans [TextForge](/fr/textforge/) et consultez les champs décodés. Ne partagez pas un jeton sans nécessité : il peut contenir des données personnelles ou des informations d'accès.

Un décodage réussi ne signifie pas que le jeton est authentique, valide ou autorisé. L'application doit vérifier la signature, l'émetteur, l'audience et la durée selon ses règles de sécurité.
