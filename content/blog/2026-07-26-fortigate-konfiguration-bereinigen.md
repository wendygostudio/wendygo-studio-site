---
schemaVersion: 1
title: "FortiGate-Konfiguration vor dem Teilen bereinigen"
description: "FortiGate-Auszüge lokal auf Zugangsdaten und sensible Infrastrukturangaben prüfen."
date: 2026-07-26
slug: fortigate-konfiguration-bereinigen
locale: de
translationKey: sanitize-fortigate-config
product: scrubforge
contentType: how-to
primaryKeyword: "FortiGate Konfiguration bereinigen"
relatedPages: /scrubforge/
---

Ein FortiGate-Export kann VPN-Schlüssel, Kennwörter, Token, interne Namen und Routing-Details enthalten. Kopiere nur den relevanten Abschnitt nach [ScrubForge](/de/scrubforge/), ersetze häufige sensible Werte lokal und prüfe die Ausgabe. Konsistente Platzhalter bewahren Beziehungen zwischen Objekten und Regeln. Entferne zusätzlich Kommentare und Daten, die für die Frage nicht nötig sind.
