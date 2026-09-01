---
schemaVersion: 1
title: "Spioniert Deine Chrome-Erweiterung Dich Aus? Checkliste 2026"
description: "Google und Microsoft entfernten eine Erweiterung mit 1,6 Mio. Installationen wegen versteckter Datensammlung. So prüfst du deine eigenen."
date: 2026-07-25
slug: spioniert-deine-chrome-erweiterung-dich-aus
locale: de
translationKey: is-your-chrome-extension-spying-on-you
product: slimeforge
contentType: how-to
primaryKeyword: "spioniert meine Chrome-Erweiterung mich aus"
relatedPages: /slimeforge/
sourceUrls: https://support.google.com/chrome_webstore/answer/186213?hl=en,https://developer.chrome.com/docs/extensions/develop/security-privacy/user-privacy?hl=en
---

Wenn du eine Chrome- oder Edge-Erweiterung für deinen Fokus, deine Header, deine Passwörter oder irgendetwas anderes nutzt, lohnt sich die ModHeader-Entfernung fünf Minuten deiner Zeit. Nicht weil ModHeader ein Nischentool war — es hatte 1,6 Millionen Installationen und ein Jahrzehnt Vertrauen —, sondern wegen der Art, wie es versteckte, was es tat. Für die Prüfung vor der Installation hilft zusätzlich die neue [Checkliste zu Berechtigungen von Chrome-Erweiterungen](/blog/chrome-extension-permissions-checklist/).

> **Was tatsächlich passierte**
> Am 3. Juli 2026 entfernte Microsoft ModHeader aus dem Edge-Add-ons-Store. Am 10. Juli folgte Google und entfernte es aus dem Chrome Web Store. Die Sicherheitsfirma [Stripe OLT](https://thehackernews.com/2026/07/google-and-microsoft-pull-modheader.html) fand heraus, dass die offizielle, kryptografisch signierte Erweiterung einen kompletten Browserverlauf-Sammler enthielt: Er erstellte einen Geräte-Fingerprint, verschlüsselte die Domain jeder besuchten Seite und war darauf ausgelegt, die Liste täglich an einen externen Server zu senden. Der Sammler war nicht aktiv — eine leere interne Positivliste hielt ihn ausgeschaltet —, aber das Befüllen dieser Liste hätte nur ein routinemäßiges Update gebraucht, keine neuen Berechtigungen, keinen Klick des Nutzers.

## Warum das auch gilt, wenn du ModHeader nicht nutzt

ModHeader ist ein Entwicklertool zum Bearbeiten von HTTP-Headern, keine Produktivitätserweiterung. Aber das Muster, das es offenlegte, gilt direkt für Fokus-Timer, Tab-Manager und jede andere Erweiterung, die weitreichenden Zugriff verlangt:

<div class="key-points">
  <h3>Warum automatisierte Scans es übersahen</h3>
  <ul>
    <li><strong>Verschlüsselung versteckte die Nutzlast</strong> — ein Scanner sieht Chiffretext, keine Domain-Liste, also verließ nichts Lesbares das Gerät während der Tests.</li>
    <li><strong>Eine leere Positivliste blockierte den Upload</strong> — der Sammelcode lief, aber der Netzwerkaufruf, den er speiste, feuerte einfach nie, sodass Sandboxes keinen ausgehenden Datenverkehr sahen.</li>
    <li><strong>Der schädliche Code war in eine legitime, funktionierende Funktion minifiziert</strong> — die Erweiterung tat weiterhin genau das, was sie beworben hatte, was die meisten manuellen Prüfungen kontrollieren.</li>
  </ul>
</div>

Automatisierte Risikoprüfer bewerteten die Erweiterung als geringes Risiko, manche mit bis zu 95 von 100. Ein signierter Eintrag mit jahrelangen guten Bewertungen signalisierte Nutzern Vertrauenswürdigkeit. Keines der beiden Signale erkannte es.

## Eine praktische Checkliste, bevor du einer Erweiterung vertraust

<div class="step-card">
  <span class="step-label">Anleitung</span>
  <strong>Fünf Prüfungen, die unter zwei Minuten dauern</strong>
  <p>Öffne <code>chrome://extensions</code>, klicke bei allem, was du täglich nutzt, auf „Details“, und prüfe: Verlangt es „Alle deine Daten auf allen Websites lesen und ändern“, obwohl die angegebene Funktion das nicht braucht? Hat es kürzlich den Besitzer gewechselt oder ist von kostenlos auf „werbefinanziert“ umgestiegen — ein Muster, das Sicherheitsforscher seit 2021 immer wieder beobachten? Veröffentlicht der Entwickler eine Datenschutzerklärung, die tatsächlich zu dem passt, was der Code braucht? Gab es in den letzten Wochen ein Update ohne Changelog? Und, wenn möglich: Funktioniert die Erweiterung bei ausgeschalteter Netzwerkverbindung? Ein echt lokales Tool läuft weiter; eines, das nach Hause telefoniert, nicht.</p>
</div>

| Zeichen für geringeres Risiko | Zeichen, das eine Prüfung wert ist |
|---|---|
| Verlangt nur die Berechtigungen, die die angegebene Funktion braucht | Verlangt weitreichenden Host-Zugriff „zur Sicherheit“ |
| Gleicher Besitzer und klares Änderungsprotokoll über die Zeit | Kürzlich den Besitzer gewechselt oder werbefinanziert geworden |
| Funktioniert vollständig offline, wenn die Funktion kein Netzwerk braucht | Führt Netzwerkaufrufe aus, die eine rein lokale Funktion nicht brauchen sollte |
| Offen darüber, keine Browserdaten zu sammeln | Vage oder fehlende Datenschutzerklärung |

Googles eigene [Chrome-Web-Store-Richtlinie](https://developer.chrome.com/docs/webstore/program-policies/policies) verlangt bereits von Entwicklern, die engsten Berechtigungen für eine Funktion anzufordern, und verbietet das Sammeln von Browsing-Aktivität außerhalb eines offengelegten, nutzerseitigen Zwecks. Ab dem 1. August 2026 tritt die [Durchsetzung strengerer Datensammelregeln](https://developer.chrome.com/blog/cws-policy-updates-2026) im gesamten Store in Kraft — aber das ist ein Mindeststandard, keine Garantie. Er begrenzt nur, was eine regelkonforme Erweiterung tun *darf*, und ModHeader legte ebenfalls nicht offen, was es eingebaut hatte.

## Was „nur lokal" tatsächlich bringt

Der Kern von [SlimeForge](/de/slimeforge/) — Fokus-Timer, Haustierfortschritt und Sitzungsdaten — läuft ohne Konto auf deinem Gerät. Das Manifest deklariert `storage`, `alarms`, `scripting` und `activeTab` für den Timer und optionale Seitenfunktionen. Die Lizenzaktivierung kann Creem kontaktieren; optionale Gemini-Nano-Funktionen laufen auf unterstützten Geräten lokal. Das ist genauer als die Behauptung, die Erweiterung stelle niemals eine Netzwerkverbindung her.

## Häufig gestellte Fragen

### Wie hat ModHeader jahrelang Chromes Sicherheitsscans bestanden?

Der Sammler war verschlüsselt und hinter einer intern leeren Positivliste versteckt, sodass der Upload-Schritt beim Scannen nie ausgeführt wurde. Ein Scanner sieht Chiffretext und keinen ausgehenden Datenverkehr — genau das Bild einer sauberen Erweiterung. Forscher von Stripe OLT fanden es nur, indem sie den minifizierten Code direkt lasen.

### Welche Berechtigungen braucht eine Fokus- oder Produktivitätserweiterung wirklich?

Eine Fokus-Erweiterung sollte nur die Berechtigungen anfordern, die ihre offengelegten Funktionen benötigen. SlimeForge deklariert `storage`, `alarms`, `scripting` und `activeTab`; optionaler Website-Zugriff wird erst für aktivierte Seitenfunktionen angefordert.

### Ist eine beliebte, gut bewertete Erweiterung automatisch sicher?

Nein. ModHeader hatte 1,6 Millionen Installationen, eine lange Erfolgsgeschichte und automatisierte Risikobewertungen von bis zu 95 von 100 als niedriges Risiko — und lieferte trotzdem einen funktionierenden Datensammler. Installationszahl und Sternebewertung messen Beliebtheit, nicht das, was der Code nach einem Update tut.

### Entfernt das Deinstallieren einer schädlichen Erweiterung bereits gesammelte Daten?

Das Deinstallieren entfernt sie aus deinem Browser und löscht ihren lokalen Speicher, macht aber nichts rückgängig, was bereits an die Server des Entwicklers gesendet wurde. Wenn du jemals API-Schlüssel, Tokens oder Passwörter in die Felder einer Erweiterung eingegeben hast, rotiere sie unabhängig davon, ob sich diese Erweiterung als kompromittiert herausstellt.
