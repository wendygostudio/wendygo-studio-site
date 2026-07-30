---
schemaVersion: 1
title: "Huawei-VRP-Konfiguration vor dem Teilen bereinigen"
description: "Die Ausgabe von 'display current-configuration' auf Huawei VRP enthält irreversible-cipher-Passwort-Hashes, SNMP-Communities und OSPF-/BGP-MD5-Authentifizierungsschlüssel. Das muss vor dem Einfügen in einen KI-Chat oder einen Support-Fall entfernt werden."
date: 2026-07-30
slug: huawei-konfiguration-bereinigen
locale: de
translationKey: sanitize-huawei-config
product: scrubforge
contentType: how-to
primaryKeyword: "huawei vrp konfiguration bereinigen"
relatedPages: /scrubforge/
---

`display current-configuration` auf einem Huawei-VRP-Gerät (Router und Switches derselben Betriebssystemfamilie) gibt Interfaces, Routing-Protokolle und jede gespeicherte Anmeldedaten in einem durchgehenden Block aus. Bevor das in einen Support-Fall oder einen KI-Chat zu einem in EXSTART hängenden OSPF-Nachbarn geht, lohnt es sich zu wissen, was genau drinsteckt.

## Was eine Huawei-VRP-Konfiguration tatsächlich enthält

- `local-user ... password irreversible-cipher` — gehashte lokale Kontopasswörter
- `super password` — das Passwort für den privilegierten Modus, gespeichert als Cipher-String
- `snmp-agent community`-Strings, mit Lese- oder Lese-Schreib-Rechten
- OSPF- und BGP-`authentication-mode md5`-Schlüssel sowie IS-IS-Authentifizierungspasswörter
- Werte für `radius-server shared-key` und `hwtacacs-server shared-key`
- IPsec-/IKE-`pre-shared-key`-Strings für Site-to-Site-Tunnel

## Vorher und nachher

Derselbe Shared Key oder dieselbe SNMP-Community wird immer auf denselben Token in der gesamten bereinigten Ausgabe abgebildet, sodass Beziehungen zwischen Nachbarn, VLANs und Authentifizierungsprofilen lesbar bleiben — nur die eigentliche Anmeldedaten wird ersetzt.

## Schritte

1. ScrubForge aus dem Chrome Web Store installieren (kostenlos)
2. `display current-configuration` auf dem Huawei-Gerät ausführen
3. Die Ausgabe in ScrubForge einfügen
4. Das bereinigte Ergebnis prüfen — Cipher-Passwörter, Community-Strings und Authentifizierungsschlüssel werden tokenisiert, die Struktur bleibt unangetastet
5. Kopieren und teilen, oder im integrierten KI-Chat von ScrubForge weitermachen

## Warum lokale Verarbeitung wichtig ist

Ein `irreversible-cipher`-Hash oder ein OSPF-MD5-Schlüssel, der in ein Support-Ticket oder ein geteiltes Chat-Protokoll eingefügt wird, bleibt dort unbegrenzt liegen. ScrubForge bereinigt vollständig innerhalb des Browser-Tabs — nichts wird hochgeladen, bevor man sich zum Teilen entscheidet.

## Verwandte Artikel

- [Netzwerkkonfiguration vor dem Teilen bereinigen](/de/blog/netzwerkkonfiguration-bereinigen/)
- [ScrubForge](/de/scrubforge/)
