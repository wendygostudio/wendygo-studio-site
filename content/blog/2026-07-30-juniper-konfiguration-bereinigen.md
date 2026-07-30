---
schemaVersion: 1
title: "Juniper-JunOS-Konfiguration vor dem Teilen bereinigen"
description: "Die Ausgabe von 'show configuration' in JunOS enthält root-authentication-Hashes, SNMP-Communities und BGP/OSPF-Authentifizierungsschlüssel. Das muss vor dem Einfügen in einen KI-Chat oder ein Ticket entfernt werden."
date: 2026-07-30
slug: juniper-konfiguration-bereinigen
locale: de
translationKey: sanitize-juniper-config
product: scrubforge
contentType: how-to
primaryKeyword: "juniper junos konfiguration bereinigen"
relatedPages: /scrubforge/
---

`show configuration` auf einem Juniper-Gerät ist ein einziger flacher Dump der gesamten Box: Interfaces, Routing-Policy, Firewall-Filter und jede Anmeldedaten, die das Gerät speichert, alles im selben Paste. Bevor das in ein TAC-Ticket oder einen KI-Chat mit der Frage "warum hängt diese OSPF-Adjazenz" geht, lohnt es sich zu wissen, was genau darin steckt.

## Was eine JunOS-Konfiguration tatsächlich enthält

- `root-authentication encrypted-password` — ein Juniper-Hash mit `$9$`-Präfix für das Root-Konto
- `snmp community`-Strings, oft mit `authorization read-write`
- BGP-`authentication-key` und OSPF-/IS-IS-`authentication-key` (MD5, in älteren Konfigurationen manchmal im Klartext)
- IPsec-`ike proposal`-Pre-Shared-Keys unter `security ike policy ... pre-shared-key`
- RADIUS- und TACACS+-`secret`-Werte unter `system radius-server` / `system tacplus-server`
- Lokale Benutzer-`authentication encrypted-password`-Hashes für jedes konfigurierte Konto

## Vorher und nachher

Dieselbe SNMP-Community oder derselbe geteilte Secret wird immer auf denselben Token in der gesamten bereinigten Ausgabe abgebildet, sodass Beziehungen zwischen Interfaces, Policies und Nachbarn intakt bleiben — nur die eigentliche Anmeldedaten wird ersetzt.

## Schritte

1. ScrubForge aus dem Chrome Web Store installieren (kostenlos)
2. `show configuration | display set` oder die einfache hierarchische Form auf dem Juniper-Gerät ausführen
3. Die Ausgabe in ScrubForge einfügen
4. Das bereinigte Ergebnis prüfen — Hashes, Schlüssel und Community-Strings werden tokenisiert, die Struktur bleibt unangetastet
5. Kopieren und teilen, oder im integrierten KI-Chat von ScrubForge weitermachen

## Warum lokale Verarbeitung wichtig ist

Ein `$9$`-Root-Hash oder ein BGP-MD5-Schlüssel, der in ein TAC-Ticket oder ein geteiltes Chat-Protokoll eingefügt wird, bleibt dort unbegrenzt liegen. ScrubForge bereinigt vollständig innerhalb des Browser-Tabs — nichts wird hochgeladen, bevor man sich zum Teilen entscheidet.

## Verwandte Artikel

- [Netzwerkkonfiguration vor dem Teilen bereinigen](/de/blog/netzwerkkonfiguration-bereinigen/)
- [ScrubForge](/de/scrubforge/)
