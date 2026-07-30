---
schemaVersion: 1
title: "Palo-Alto-PAN-OS-Konfiguration vor dem Teilen bereinigen"
description: "Ein PAN-OS-Export per 'show config running' oder im Set-Format enthält Admin-Passwort-Hashes, IKE-Pre-Shared-Keys und RADIUS-/LDAP-Bind-Secrets. Das muss vor dem Einfügen in einen KI-Chat oder einen Support-Fall entfernt werden."
date: 2026-07-30
slug: paloalto-konfiguration-bereinigen
locale: de
translationKey: sanitize-paloalto-config
product: scrubforge
contentType: how-to
primaryKeyword: "palo alto pan-os konfiguration bereinigen"
relatedPages: /scrubforge/
---

Der Export einer Palo-Alto-Firewall-Konfiguration für einen Support-Fall oder eine KI-gestützte Fehlersuche zieht alles aus der Kandidaten- oder laufenden Konfiguration auf einmal: Zonenstruktur, Sicherheitsregeln, NAT und jedes Secret, das PAN-OS daneben speichert. Bevor das die Box verlässt, lohnt es sich zu wissen, was genau drin ist.

## Was eine PAN-OS-Konfiguration tatsächlich enthält

- `phash` — der Passwort-Hash des lokalen Administrators unter `mgt-config users`
- IKE-Gateway-`pre-shared-key`-Werte für jeden VPN-Tunnel
- `snmp-setting`-Community-Strings (v1/v2c) oder v3-Auth-/Privacy-Passwörter
- RADIUS-, LDAP- und Kerberos-`server-profile`-Secrets und Bind-Passwörter für Admin-/GlobalProtect-Authentifizierung
- GlobalProtect-Portal- und Gateway-Pre-Shared-Secrets sowie Zertifikats-Passphrasen
- API-Schlüssel, die in neben der Konfiguration eingefügten Automatisierungsskripten stecken

## Vorher und nachher

Derselbe Pre-Shared-Key oder dasselbe Bind-Passwort wird immer auf denselben Token in der gesamten bereinigten Ausgabe abgebildet, sodass Beziehungen zwischen VPN-Tunneln, Zonen und Authentifizierungsprofilen lesbar bleiben — nur das eigentliche Secret wird ersetzt.

## Schritte

1. ScrubForge aus dem Chrome Web Store installieren (kostenlos)
2. Export per `show config running` (oder dem Äquivalent im `set`-Format) aus der PAN-OS-CLI oder Panorama
3. Die Ausgabe in ScrubForge einfügen
4. Das bereinigte Ergebnis prüfen — Passwort-Hashes, Pre-Shared-Keys und Bind-Secrets werden tokenisiert, die Struktur bleibt unangetastet
5. Kopieren und teilen, oder im integrierten KI-Chat von ScrubForge weitermachen

## Warum lokale Verarbeitung wichtig ist

Ein IKE-Pre-Shared-Key oder ein Admin-Passwort-Hash, der in ein Support-Ticket oder ein geteiltes KI-Chat-Protokoll eingefügt wird, bleibt dort unbegrenzt liegen, außerhalb der eigenen Kontrolle. ScrubForge bereinigt vollständig innerhalb des Browser-Tabs — nichts wird hochgeladen, bevor man sich zum Teilen entscheidet.

## Verwandte Artikel

- [Netzwerkkonfiguration vor dem Teilen bereinigen](/de/blog/netzwerkkonfiguration-bereinigen/)
- [ScrubForge](/de/scrubforge/)
