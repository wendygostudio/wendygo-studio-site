---
schemaVersion: 1
title: 'Base64-Kodierung und -Dekodierung online – kein Upload, keine Befehlszeile'
description: >-
  Kodieren und dekodieren Sie Base64 in Ihrem Browser, ohne etwas hochzuladen.
  TextForge ist eine kostenlose Chrome-Erweiterung mit sofortiger
  Base64-Konvertierung sowie über 50 weiteren Textdienstprogrammen.
date: 2026-06-26T00:00:00.000Z
slug: base64-encode-decode-online-tool
locale: de
translationKey: base64-encode-decode-online-tool
product: textforge
contentType: how-to
primaryKeyword: 'Base64-Kodierung und -Dekodierung online – kein Upload, keine Befehlszeile'
relatedPages: /textforge/
---

# Base64-Kodierung und -Dekodierung direkt in Ihrem Browser

Base64 taucht überall in der Entwicklung auf: JWT-Tokens, API-Schlüssel in Konfigurationsdateien, Bilddaten-URIs in CSS, HTTP Basic Auth-Header, E-Mail-MIME-Anhänge. Das Problem besteht nicht darin, zu verstehen, was Base64 ist, sondern in der Schwierigkeit, einen String bei Bedarf tatsächlich zu kodieren oder zu dekodieren.

Die beiden häufigsten Problemumgehungen sind ein Terminalbefehl („echo -n „text“ | base64“) oder ein beliebiges Webtool. Terminalbefehle sind in Ordnung, wenn Sie auf einem Unix-Rechner mit geöffnetem Terminal arbeiten, aber unter Windows sind sie umständlich und erfordern einen Kontextwechsel. Zufällige Webtools funktionieren, aber Sie senden Ihre Daten – häufig API-Schlüssel, Token oder Konfigurationswerte – an einen unbekannten Server.

Es gibt eine sauberere Option: eine Browsererweiterung, die die Konvertierung lokal durchführt, ohne Uploads, ohne Ihren Browser zu verlassen.

## Was ist Base64?

Base64 ist ein Binär-zu-Text-Codierungsschema. Es wandelt beliebige Daten in eine Zeichenfolge aus 64 druckbaren ASCII-Zeichen (A–Z, a–z, 0–9, „+“, „/“) um, wobei „=“ als Auffüllung verwendet wird. Die codierte Ausgabe ist etwa 33 % größer als die Eingabe.

Der Zweck ist nicht Komprimierung oder Sicherheit. Es geht darum, Daten sicher über Systeme zu übertragen, die nur Text verarbeiten, oder Binärdaten in Formate einzubetten, die Zeichenfolgen erwarten (wie JSON, XML oder CSS). Jeder, der über die codierte Zeichenfolge verfügt, kann sie entschlüsseln.

## Wenn Sie Base64 tatsächlich benötigen

**JWT-Tokens:** Ein JSON-Web-Token besteht aus drei Base64-URL-codierten Abschnitten, die durch Punkte verbunden sind. Der Header und die Nutzlast sind nicht verschlüsselt – die Dekodierung des mittleren Abschnitts enthüllt die rohen JSON-Ansprüche: Ablauf, Benutzer-ID, Rollen, Bereiche.

**HTTP Basic Auth:** Der Header „Authorization: Basic <value>“ enthält eine Base64-codierte Zeichenfolge „username:password“. Durch die Dekodierung können Sie schnell überprüfen, welche Anmeldeinformationen eine Anfrage tatsächlich sendet.

**Daten-URIs:** Kleine Bilder und SVGs können als „data:image/png;base64,…“-URIs direkt in CSS oder HTML eingebettet werden. Sie müssen den Dateiinhalt Base64-kodieren, um die Einbettungszeichenfolge zu erstellen.

**Konfigurationsdateien:** Kubernetes-Geheimnisse, CI-Umgebungsvariablen und viele andere Tools speichern vertrauliche Werte als Base64-codierte Zeichenfolgen in YAML oder JSON. Sie kodieren den Rohwert, bevor Sie ihn in die Konfiguration einfügen.

**E-Mail-MIME:** E-Mail-Anhänge sind im Rohnachrichtentext Base64-codiert. Beim Debuggen der E-Mail-Zustellung oder beim Parsen von MIME-Rohnachrichten müssen Sie die Nutzlast des Anhangs dekodieren.

## Warum nicht einfach das Terminal oder ein Webtool verwenden?

| Method | The friction |
|--------|-------------|
| `echo -n "…" \| base64` | Only works on macOS/Linux. Requires a terminal and the exact syntax (`-n` is critical — without it you encode a trailing newline). |
| `certutil -encode` (Windows) | Adds a header/footer you have to strip. Writes to a file, not stdout. Awkward for quick one-offs. |
| Online web tools | Your data goes to a remote server. Fine for generic text; bad habit for tokens, credentials, or keys. |
| Python one-liner | Requires Python installed and a terminal — more steps than it should be for something this common. |

Eine Browsererweiterung löst all diese Probleme: Immer verfügbar, kein Terminal erforderlich, läuft vollständig auf Ihrem Computer.

## So kodieren und dekodieren Sie Base64 mit TextForge

TextForge ist eine Chrome-Erweiterung mit über 50 Textdienstprogrammfunktionen. Base64-Kodierung und -Dekodierung sind beide enthalten. Keine Daten verlassen Ihren Computer – alles läuft im lokalen Kontext der Erweiterung.

### Kodierung: Text → Base64

1. **Installieren Sie TextForge** aus dem Chrome Web Store. Hängen Sie das Symbol an Ihre Symbolleiste an, damit Sie es immer nur einen Klick entfernt haben.
2. **Öffnen Sie die Erweiterung**, indem Sie auf das TextForge-Symbol in der Symbolleiste Ihres Browsers klicken.
3. **Fügen Sie Ihren Text ein** – die Zeichenfolge, die Sie kodieren möchten. Es kann sich um einfachen Text, eine URL, JSON oder eine beliebige Zeichenfolge handeln, die Sie im Base64-Format benötigen.
4. **Base64-Kodierung anwenden** – wählen Sie die Funktion aus dem Menü „Extras“ aus. Die codierte Ausgabe erscheint sofort.
5. **Kopieren Sie das Ergebnis** in Ihre Zwischenablage. Fertig – kein Laden der Seite, kein Server-Roundtrip.

### Dekodierung: Base64 → Text

Der Vorgang ist umgekehrt identisch: Fügen Sie die Base64-Zeichenfolge ein, wählen Sie „Base64-Dekodierung“ und kopieren Sie den Originaltext.

## Praxisbeispiele

**Inspizieren einer JWT-Nutzlast.** Teilen Sie jedes JWT an den Punkten auf. Der zweite Abschnitt ist die Nutzlast – Base64url-codiertes JSON. Fügen Sie es in TextForge ein, dekodieren Sie es und Sie sehen die Rohansprüche. (Base64url verwendet „-“ anstelle von „+“ und „_“ anstelle von „/“, aber für die Nutzlastprüfung wird es einwandfrei dekodiert.)

**Erstellen eines Kubernetes-Geheimnisses.** Kubernetes speichert geheime Werte als Base64-codierte Zeichenfolgen im Manifest. Verschlüsseln Sie Ihr Rohpasswort oder Ihren API-Schlüssel mit TextForge und fügen Sie das Ergebnis direkt in den „data:“-Block Ihres geheimen YAML ein.

**Überprüfen eines Basic Auth-Headers.** Erfassen Sie den „Authorization“-Header von DevTools, entfernen Sie das führende „Basic“-Präfix, fügen Sie den Rest in TextForge ein, dekodieren Sie ihn und bestätigen Sie, dass das „Benutzername:Passwort“-Paar korrekt ist.

## Andere Textdienstprogramme in TextForge

Base64 ist eine von über 50 Funktionen in TextForge. Wenn Sie im Browser mit Text arbeiten, werden Sie häufig auch zum Bereinigen von Leerzeichen, zum Umwandeln von Groß- und Kleinschreibung, zum Sortieren von Zeilen, zum Extrahieren von E-Mails oder URLs aus einem Textblock, zum Generieren von UUIDs und zum Erstellen von Slugs aus Titeln verwendet. Es handelt sich um ein Allzweck-Text-Toolkit, das weit über Base64 hinaus nützlich bleibt.

---

Die Installation von TextForge ist kostenlos. Base64-Kodierung und -Dekodierung sind in der kostenlosen Version verfügbar – kein Konto oder Abonnement erforderlich.

[Install TextForge from the Chrome Web Store →](https://chromewebstore.google.com/detail/cnmlojgahikinilbefkkfadkfamchlba)
