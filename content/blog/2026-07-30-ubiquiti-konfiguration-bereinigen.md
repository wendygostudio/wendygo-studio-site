---
schemaVersion: 1
title: "Ubiquiti-UniFi-/EdgeOS-Konfiguration vor dem Teilen bereinigen"
description: "Ein UniFi-Controller-Backup oder ein EdgeOS-'show configuration'-Export enthält WLAN-Pre-Shared-Keys, Admin-Passwörter, RADIUS-Secrets und Site-to-Site-VPN-Schlüssel. Das muss vor dem Einfügen in einen KI-Chat oder einen Forenbeitrag entfernt werden."
date: 2026-07-30
slug: ubiquiti-konfiguration-bereinigen
locale: de
translationKey: sanitize-ubiquiti-config
product: scrubforge
contentType: how-to
primaryKeyword: "ubiquiti unifi konfiguration bereinigen"
relatedPages: /scrubforge/
---

Ein Ubiquiti-Setup bedeutet meist Fehlersuche über zwei sich überschneidende Systeme hinweg: das exportierte Site-Backup des UniFi-Controllers oder die `config.gateway.json`, und `show configuration` von EdgeOS auf EdgeRouter-Hardware. Beide geben Netzwerktopologie, WLAN-Einstellungen und Anmeldedaten in einer Datei aus. Bevor das in einen Community-Forenbeitrag oder einen KI-Chat mit der Frage, warum ein VLAN nicht routet, geht, lohnt es sich zu wissen, was genau drinsteckt.

## Was eine UniFi-/EdgeOS-Konfiguration tatsächlich enthält

- `x_passphrase` des WLAN-Netzwerks — der WPA2-/WPA3-Pre-Shared-Key, in UniFi-Site-Backups im Klartext gespeichert
- Lokale Admin-Kontopasswörter (in der Controller-Datenbank gehasht, in Support-Export-Paketen manchmal im Klartext vorhanden)
- `radius profile`-Shared-Secrets für 802.1X- oder Hotspot-Authentifizierung
- Site-to-Site- und Remote-User-VPN-`pre-shared-key`-Werte unter `vpn ipsec` (EdgeOS) oder der UniFi-VPN-Konfiguration
- SNMP-Community-Strings unter `snmp community`
- Gästeportal- und Hotspot-Voucher-Secrets sowie in Integrationen eingebettete API-Schlüssel Dritter

## Vorher und nachher

Dasselbe WLAN-Passwort oder derselbe VPN-Pre-Shared-Key wird immer auf denselben Token in der gesamten bereinigten Ausgabe abgebildet, sodass Beziehungen zwischen Sites, VLANs und Tunneln lesbar bleiben — nur die eigentliche Anmeldedaten wird ersetzt.

## Schritte

1. ScrubForge aus dem Chrome Web Store installieren (kostenlos)
2. Ein UniFi-Site-Backup exportieren oder `show configuration` auf dem EdgeRouter ausführen
3. Den relevanten Abschnitt in ScrubForge einfügen
4. Das bereinigte Ergebnis prüfen — Passphrasen, Admin-Passwörter und Shared Secrets werden tokenisiert, die Struktur bleibt unangetastet
5. Kopieren und teilen, oder im integrierten KI-Chat von ScrubForge weitermachen

## Warum lokale Verarbeitung wichtig ist

Ein WLAN-Pre-Shared-Key oder ein VPN-Secret, der in einen öffentlichen Forenthread oder ein geteiltes KI-Chat-Protokoll eingefügt wird, ist in dem Moment, in dem er gepostet wird, faktisch öffentlich. ScrubForge bereinigt vollständig innerhalb des Browser-Tabs — nichts wird hochgeladen, bevor man sich zum Teilen entscheidet.

## Verwandte Artikel

- [Netzwerkkonfiguration vor dem Teilen bereinigen](/de/blog/netzwerkkonfiguration-bereinigen/)
- [ScrubForge](/de/scrubforge/)
