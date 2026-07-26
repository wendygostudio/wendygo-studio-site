---
schemaVersion: 1
locale: it
translationKey: decode-jwt-online
xDefaultPath: /blog/decode-jwt-online/
title: "Decodificare un JWT localmente e leggere i claim"
description: "Leggi header e claim di un JWT nel browser senza caricare il token."
date: 2026-07-26
slug: decodificare-jwt-locale
product: TextForge
contentType: how-to
primaryKeyword: "decodificare JWT localmente"
relatedPages: "/it/textforge/,/blog/decode-jwt-online/"
heading: "Decodificare un JWT localmente"
intro: "Leggi le parti visibili di un JWT senza inviarlo a un decoder online."
faqs:
  - question: "La decodifica verifica la firma JWT?"
    answer: "No. Leggere header e payload non verifica né la firma né l'affidabilità."
---

Un JSON Web Token contiene normalmente header, payload e firma. Header e payload sono codificati, non cifrati: puoi leggere localmente la scadenza (`exp`) o i claim.

Incolla il token in [TextForge](/it/textforge/) e consulta i campi decodificati. Non condividere token senza necessità: possono contenere dati personali o informazioni di accesso.

Una decodifica riuscita non dimostra che il token sia autentico, valido o autorizzato. L'applicazione deve verificare firma, emittente, pubblico e durata secondo le proprie regole di sicurezza.
