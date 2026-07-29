---
schemaVersion: 1
title: "JWT lokal dekodieren und Claims prüfen"
description: "JWT-Header und Claims lokal im Browser lesen, ohne den Token hochzuladen."
date: 2026-07-26
slug: jwt-lokal-dekodieren
locale: de
translationKey: decode-jwt-online
product: textforge
contentType: how-to
primaryKeyword: "JWT lokal dekodieren"
relatedPages: /textforge/
---

Ein JSON Web Token besteht meist aus Header, Payload und Signatur. Header und Payload sind kodiert, nicht verschlüsselt; sie lassen sich lokal lesen, um etwa Ablaufzeit (`exp`) oder Claims zu prüfen.

Füge den Token in [TextForge](/de/textforge/) ein und lies die dekodierten Felder. Teile Tokens nicht unnötig: Auch wenn die Daten lesbar sind, können sie personenbezogene Angaben oder Zugangsinformationen enthalten.

Eine erfolgreiche Dekodierung bedeutet nicht, dass ein Token echt, gültig oder für eine Anwendung autorisiert ist. Dafür muss die Anwendung die Signatur, Aussteller, Zielgruppe und Laufzeit nach ihren Sicherheitsregeln prüfen.
