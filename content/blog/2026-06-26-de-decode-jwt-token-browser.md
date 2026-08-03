---
schemaVersion: 1
title: So dekodieren Sie eine JWT-Token-Nutzlast in Ihrem Browser
description: >-
  Überprüfen Sie JWT-Ansprüche – Benutzer-ID, Ablauf, Rollen – direkt in Ihrem
  Browser, ohne Token in jwt.io oder ein Web-Tool einzufügen. TextForge
  dekodiert Base64url lokal.
date: 2026-06-26T00:00:00.000Z
slug: decode-jwt-token-browser
locale: de
translationKey: decode-jwt-token-browser
product: textforge
contentType: how-to
primaryKeyword: So dekodieren Sie eine JWT-Token-Nutzlast in Ihrem Browser
relatedPages: /de/textforge/
---

# So dekodieren Sie eine JWT-Token-Nutzlast in Ihrem Browser

JWT (JSON Web Tokens) werden in fast jeder modernen API zur Authentifizierung verwendet. Sie sehen aus wie zufälliges Rauschen – drei Base64url-codierte Abschnitte, die durch Punkte verbunden sind –, aber der Payload-Abschnitt enthält lesbares JSON: Benutzer-ID, Ablauf, Rollen, Bereiche. Sie müssen es nur entschlüsseln.

Wenn Sie einen Authentifizierungsfluss debuggen, überprüfen, warum eine Anfrage 401-Fehler erhält, oder überprüfen, welche Ansprüche ein Dienst sendet, müssen Sie diese Nutzlast sehen. Dies ist der schnellste Weg, dies in Ihrem Browser zu tun, ohne Token in eine Website eines Drittanbieters einzufügen.

## Was ist in einem JWT enthalten?

Ein JWT besteht aus drei durch Punkte getrennten Abschnitten:

```
HEADER.NACHLAST.SIGNATUR
```

- **Header** – Tokentyp und Signaturalgorithmus (z. B. RS256, HS256)
- **Payload** – die Ansprüche als JSON, Base64url-kodiert
- **Signatur** – stellt sicher, dass das Token nicht manipuliert wurde

Die Nutzlast ist der gewünschte Abschnitt. Es ist nicht verschlüsselt – nur verschlüsselt. Sie benötigen zum Lesen keinen geheimen Schlüssel; Sie benötigen den Schlüssel lediglich zur Überprüfung seiner Echtheit.

## So dekodieren Sie die Nutzlast mit TextForge

TextForge ist eine Chrome-Erweiterung mit über 50 Textdienstprogrammfunktionen. Die Base64-Dekodierung ist in der kostenlosen Version enthalten und läuft vollständig auf Ihrem Computer.

1. **Kopieren Sie das JWT** – aus DevTools (Registerkarte „Netzwerk“ → Autorisierungsheader), Ihrem API-Client oder einer Umgebungsvariablen.
2. **Identifizieren Sie den Nutzlastabschnitt** – es ist der zweite Teil zwischen dem ersten und zweiten Punkt.
3. **Öffnen Sie TextForge** – klicken Sie auf das Erweiterungssymbol in der Symbolleiste Ihres Browsers.
4. **Fügen Sie den Payload-Abschnitt** in den Eingabebereich ein.
5. **Base64-Dekodierung anwenden** – die JSON-Ansprüche werden sofort angezeigt.

## Was Sie sehen werden

Nach der Dekodierung erhalten Sie JSON wie:

```json
{"sub": "user_123", "email": "user@example.com", "role": "admin", "exp": 1762000000, "iat": 1750000000}
```

Häufige Behauptungen, auf die Sie achten sollten:
- „sub“ – Betreff (normalerweise eine Benutzer-ID oder ein Benutzername)
- „exp“ – Ablauf als Unix-Zeitstempel (Sekunden seit der Epoche)
- „iat“ – Zeitstempel des ausgestellten Datums
- „aud“ – Zielgruppe (für welchen Dienst das Token gedacht ist)
- „roles“ / „scope“ – Berechtigungen, die dem Token gewährt werden

## Warum nicht jwt.io verwenden?

jwt.io ist das Standardtool und praktisch. Aber es sendet Ihr JWT an einen Server. Bei Token, die echte Benutzerdaten, interne Benutzer-IDs oder Bereichsansprüche enthalten, ist das Einfügen in ein Drittanbieter-Tool eine Angewohnheit, die es zu vermeiden gilt – insbesondere beim Debuggen in der Produktion.

TextForge dekodiert lokal. Der Token verlässt niemals Ihren Browser.

## Häufig gestellte Fragen

**Kann ich die JWT-Signatur auf diese Weise entschlüsseln?**
Der Signaturabschnitt ist ebenfalls Base64-URL-codiert, aber wenn Sie ihn dekodieren, erhalten Sie rohes Binärformat – kein für Menschen lesbares JSON. Was Sie eigentlich wollen, ist die Nutzlast (zweiter Abschnitt), nicht die Signatur (dritter).

**Überprüft TextForge die JWT-Signatur?**
Nein. TextForge dekodiert die Nutzlast zur Überprüfung. Die Signaturüberprüfung erfordert den geheimen Schlüssel und erfolgt serverseitig. Zu Inspektionszwecken genügt die Dekodierung der Nutzlast.

**Funktioniert das offline?**
Ja. Die Base64-Dekodierung wird lokal in der Erweiterung ausgeführt, ohne dass ein Netzwerk erforderlich ist.

---

[Install TextForge from the Chrome Web Store →](https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba)
