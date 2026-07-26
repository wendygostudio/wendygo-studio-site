---
schemaVersion: 1
locale: de
translationKey: sanitize-fortigate-config
xDefaultPath: /blog/sanitize-fortigate-config/
title: "FortiGate-Konfiguration vor dem Teilen bereinigen"
description: "FortiGate-Auszüge lokal auf Zugangsdaten und sensible Infrastrukturangaben prüfen."
date: 2026-07-26
slug: fortigate-konfiguration-bereinigen
product: ScrubForge
contentType: how-to
primaryKeyword: "FortiGate Konfiguration bereinigen"
relatedPages: "/de/scrubforge/,/blog/sanitize-fortigate-config/"
heading: "FortiGate-Konfiguration sicher teilen"
intro: "Bereinigte Kopie für Support erstellen, ohne das Original zu veröffentlichen."
faqs:
  - question: "Ersetzt Bereinigung die Prüfung?"
    answer: "Nein. Prüfe die Ausgabe immer auf eigene Namen, Kommentare und ungewöhnliche Geheimnisse."
---

Ein FortiGate-Export kann VPN-Schlüssel, Kennwörter, Token, interne Namen und Routing-Details enthalten. Kopiere nur den relevanten Abschnitt nach [ScrubForge](/de/scrubforge/), ersetze häufige sensible Werte lokal und prüfe die Ausgabe. Konsistente Platzhalter bewahren Beziehungen zwischen Objekten und Regeln. Entferne zusätzlich Kommentare und Daten, die für die Frage nicht nötig sind.
