---
schemaVersion: 1
title: >-
  So ändern Sie die Größe eines Bildes für X-Beiträge (Twitter) in Chrome (1200
  × 675)
description: >-
  Veröffentlichen Sie Bilder mit der korrekten Auflösung von 1200 x 675 Pixeln,
  ohne dass etwas im X-Feed beschnitten wird. FrameForge passt die Größe in
  Ihrem Browser an – kein Upload, kein Photoshop.
date: 2026-06-27T00:00:00.000Z
slug: resize-image-for-x-twitter-post
locale: de
translationKey: resize-image-for-x-twitter-post
product: frameforge
contentType: how-to
primaryKeyword: So ändern Sie die Bildgröße für x Twitter-Beitrag
relatedPages: /de/frameforge/
---X rendert Tweet-Bilder in der Feed-Vorschau mit einem 2:1-Zuschnitt. Bei quadratischen Fotos wird die untere Hälfte abgeschnitten. Porträtaufnahmen werden in einen unangenehmen Mittelausschnitt gequetscht. Die Lösung ist einfach: Posten Sie mit 1200 x 675 Pixel (16:9) und weder in der Feed-Vorschau noch in der erweiterten Vollbildansicht wird etwas abgeschnitten.

FrameForge ist eine Chrome-Erweiterung, die die Größe von Bildern vollständig in Ihrem Browser ändert. Kein Upload, kein Konto, kein Warten darauf, dass ein Remote-Server Ihre Datei verarbeitet.

## X (Twitter) Anforderungen an die Bildgröße

| Format | Dimensions | Aspect ratio |
|--------|------------|--------------|
| Standard post image | 1200×675 px | 16:9 |
| Feed preview crop | ~2:1 center | — |
| Max file size | 5 MB (JPG/PNG) | — |
| Accepted formats | JPG, PNG, WebP, GIF | — |

1200 x 675 ist der Sweet Spot: Es füllt den 2:1-Vorschauausschnitt exakt aus und das vollständige Bild wird ohne Letterboxing oder Pillarboxing angezeigt, wenn der Betrachter es erweitert.

## Warum quadratische und Porträtbilder beschnitten werden

X wendet einen zentrierten Zuschnitt an, wenn Inline-Bilder im Feed angezeigt werden. Aus einem quadratischen 1:1-Bild wird ein 2:1-Slice: Das obere Viertel und das untere Viertel verschwinden. Porträtbilder (9:16) werden noch stärker zugeschnitten – Sie verlieren etwa 80 % der Bildhöhe in der Feed-Vorschau.

Durch die Dimensionierung auf 1200 x 675 wird die Diskrepanz beseitigt. Das Bild ist bereits im Format 16:9, daher zeigt die 2:1-Feed-Vorschau nur die volle Breite in normaler Höhe – kein unerwarteter Zuschnitt.

## Schritt-für-Schritt: Größe für X mit FrameForge ändern

1. **Installieren Sie FrameForge** – installieren Sie es aus dem Chrome Web Store und heften Sie es an Ihre Symbolleiste.
2. **Öffnen Sie Ihr Bild** – klicken Sie auf das FrameForge-Symbol und öffnen Sie dann Ihre Datei oder ziehen Sie sie auf die Leinwand.
3. **Wählen Sie die Voreinstellung „X (Twitter) Post“ aus** – wählen Sie im Dropdown-Menü „Plattform“ die Option „X Post“ aus. Die Leinwand ist auf 1200 x 675 Pixel festgelegt.
4. **Passen Sie den Zuschnitt an** – Ziehen Sie die Zuschneideüberlagerung, um Ihr Motiv im 16:9-Rahmen zu zentrieren.
5. **Exportieren** – Klicken Sie auf Exportieren. FrameForge speichert das in der Größe geänderte Bild in Ihrem Download-Ordner.

## Umgang mit Porträtquellbildern

Porträtfotos (9:16, Standardeinstellung der Telefonkamera) müssen am meisten angepasst werden, um in ein 16:9-Bildformat zu passen:

- **Zuschneiden, um es auszufüllen (empfohlen):** Der 16:9-Rahmen wird vollständig ausgefüllt. Überschüsse von oben und unten werden abgeschnitten. Ziehen Sie die Zuschneideüberlagerung, um das Schlüsselelement im Rahmen zu halten.
- **Passform mit Polsterung:** Das vollständige Porträt ist sichtbar, mit schwarzen oder farbigen Balken links und rechts. Eine absichtliche Polsterung kann gewollt wirken, bloße Stege sehen jedoch meist wie ein Fehler aus.
- **Zum Füllen strecken:** Verzerrt das Bild horizontal. Vermeiden Sie es, es sei denn, Verzerrungen sind eine bewusste stilistische Entscheidung.

Bei Quellbildern im Querformat, die breiter als 16:9 sind (Kinoausschnitt, Panoramen), wird der Überschuss links und rechts abgeschnitten. Dieselbe Logik: Ziehen Sie die Überlagerung, um das Motiv zu zentrieren.

## Der Workflow zur Größenänderung sozialer Plattformen

Wenn Sie denselben Inhalt am selben Tag auf mehreren Plattformen veröffentlichen, deckt FrameForge alle davon mit einer Erweiterung ab:

| Platform | Target size | Preset |
|----------|-------------|--------|
| X (Twitter) | 1200×675 px | X Post |
| YouTube | 1280×720 px | YouTube Thumbnail |
| Instagram (square) | 1080×1080 px | Instagram Post |
| Twitch panels | 320×160 px | Twitch Panel |

Ändern Sie die Größe einmal pro Plattform und exportieren Sie jede Version mit wenigen Klicks – ohne das Tool zu wechseln oder auf separate Dienste hochzuladen.

## Häufig gestellte Fragen

**Was ist die beste Bildgröße für einen X-Beitrag (Twitter)?**
1200×675 Pixel bei 16:9. Dadurch wird die Feed-Vorschau ohne Zuschneiden gefüllt und beim Erweitern in voller Größe angezeigt. Halten Sie die Datei für JPG/PNG unter 5 MB.

**Schneidet X Bilder im Feed zu?**
Ja. X wendet einen Mittelzuschnitt auf Inline-Bilder im Tweet-Feed an und rendert sie so im Verhältnis 2:1. Bilder, die mit 1200 x 675 Pixel (16:9) gepostet werden, entsprechen den Proportionen der Feed-Vorschau und werden ohne unerwartete Beschnitte angezeigt.

**Ladet FrameForge Bilder auf einen Server hoch?**
Nein. FrameForge ist eine Chrome-Erweiterung, die Bilder vollständig in Ihrem Browser verarbeitet. Es wird nichts an einen Server gesendet. Es ist kein Konto erforderlich.

**Kann ich dasselbe Bild für X und YouTube verwenden?**
YouTube-Miniaturansichten haben eine Größe von 1280 x 720 Pixel und X-Beiträge haben eine Größe von 1200 x 675 Pixel – beide sind im Format 16:9, die Zusammensetzung ist also identisch. FrameForge verfügt über Voreinstellungen für beide, sodass Sie zwei Versionen desselben Quellbilds exportieren können, ohne es erneut zuzuschneiden.

**Ist FrameForge kostenlos?**
Ja. FrameForge kann kostenlos im Chrome Web Store installiert werden. Die kostenlose Version umfasst Plattformvoreinstellungen und die Größenänderung des Kerns. Pro fügt Textüberlagerung und Stapelverarbeitung hinzu.
