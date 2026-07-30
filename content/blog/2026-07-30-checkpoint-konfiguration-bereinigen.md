---
schemaVersion: 1
title: "Check-Point-Konfiguration vor dem Teilen bereinigen"
description: "Ein Check-Point-Gaia-/SmartConsole-Config-Export enthält Admin-Passwort-Hashes, SIC-Aktivierungsschlüssel, VPN-Pre-Shared-Secrets und RADIUS-/TACACS-Shared-Secrets. Das muss vor dem Einfügen in einen KI-Chat oder einen TAC-Fall entfernt werden."
date: 2026-07-30
slug: checkpoint-konfiguration-bereinigen
locale: de
translationKey: sanitize-checkpoint-config
product: scrubforge
contentType: how-to
primaryKeyword: "check point konfiguration bereinigen"
relatedPages: /scrubforge/
---

Ein Check-Point-Config-Export — ob ein Gaia-`show configuration`-Dump, eine `cpconfig`-Ausgabe, oder eine aus SmartConsole exportierte Policy — mischt Netzwerkobjekte, Sicherheitsregeln und jede Anmeldedaten, die das Gateway oder der Management-Server speichert, in einer Datei. Bevor das in einen TAC-Fall oder einen KI-Chat mit der Frage, warum ein VPN-Tunnel nicht hochkommt, geht, lohnt es sich zu wissen, was genau drinsteckt.

## Was eine Check-Point-Konfiguration tatsächlich enthält

- Gaia-Admin-`password-hash`-Werte für lokale Konten
- SIC-(Secure Internal Communication)-Einmalpasswörter und Aktivierungsschlüssel zum Koppeln von Gateways mit dem Management-Server
- `pre-shared-secret`-Werte der VPN-Community für Site-to-Site- und Remote-Access-Tunnel
- SNMP-Community-Strings unter `set snmp community`
- RADIUS- und TACACS+-Shared-Secrets, konfiguriert für Admin- oder Benutzerauthentifizierung
- API-Schlüssel und Tokens, die von SmartConsole- oder R8x-Management-API-Skripten neben der Konfiguration eingefügt werden

## Vorher und nachher

Dasselbe Pre-Shared-Secret oder derselbe SIC-Schlüssel wird immer auf denselben Token in der gesamten bereinigten Ausgabe abgebildet, sodass Beziehungen zwischen Gateways, VPN-Communities und Objekten lesbar bleiben — nur die eigentliche Anmeldedaten wird ersetzt.

## Schritte

1. ScrubForge aus dem Chrome Web Store installieren (kostenlos)
2. Konfiguration per Gaia-CLI, `cpconfig` oder SmartConsole-Policy-Export exportieren
3. Die Ausgabe in ScrubForge einfügen
4. Das bereinigte Ergebnis prüfen — Passwort-Hashes, SIC-Schlüssel und Pre-Shared-Secrets werden tokenisiert, die Struktur bleibt unangetastet
5. Kopieren und teilen, oder im integrierten KI-Chat von ScrubForge weitermachen

## Warum lokale Verarbeitung wichtig ist

Ein SIC-Aktivierungsschlüssel oder ein VPN-Pre-Shared-Secret, der in einen TAC-Fall oder ein geteiltes Chat-Protokoll eingefügt wird, bleibt dort unbegrenzt liegen, außerhalb der eigenen Kontrolle. ScrubForge bereinigt vollständig innerhalb des Browser-Tabs — nichts wird hochgeladen, bevor man sich zum Teilen entscheidet.

## Verwandte Artikel

- [Netzwerkkonfiguration vor dem Teilen bereinigen](/de/blog/netzwerkkonfiguration-bereinigen/)
- [ScrubForge](/de/scrubforge/)
