---
schemaVersion: 1
title: "Arista-EOS-Konfiguration vor dem Teilen bereinigen"
description: "Die Ausgabe von 'show running-config' auf Arista EOS enthält Enable Secrets, SNMP-Communities, BGP-Nachbar-Passwörter und geteilte MLAG-Secrets. Das muss vor dem Einfügen in einen KI-Chat oder einen Support-Fall entfernt werden."
date: 2026-07-30
slug: arista-konfiguration-bereinigen
locale: de
translationKey: sanitize-arista-config
product: scrubforge
contentType: how-to
primaryKeyword: "arista eos konfiguration bereinigen"
relatedPages: /scrubforge/
---

`show running-config` auf einem Arista-EOS-Switch erzeugt denselben Alles-auf-einmal-Dump wie die CLI jedes anderen Herstellers: VLANs, Port-Channels, BGP-Peering und jede Anmeldedaten, die der Switch speichert, stehen in einem Paste. Bevor das in ein TAC-Ticket oder einen KI-Chat zu einem instabilen MLAG-Peer geht, lohnt es sich zu wissen, was genau drinsteckt.

## Was eine Arista-EOS-Konfiguration tatsächlich enthält

- `username admin secret` — ein lokal gehashtes Benutzerpasswort vom Typ 5 (oder stärker)
- `snmp-server community`-Strings, teils mit Read-Write-Berechtigung
- BGP-`neighbor ... password`-Werte (MD5-basiert, bei älteren Chiffren mit den richtigen Tools umkehrbar)
- Geteilte Secrets `tacacs-server key` und `radius-server host ... key`
- MLAG-`peer-address`- und `local-interface`-Konfiguration, gelegentlich mit einem geteilten Secret im Peering-Setup gepaart
- `enable secret` für privilegierten EXEC-Zugriff

## Vorher und nachher

Derselbe TACACS+-Schlüssel oder dasselbe BGP-Nachbar-Passwort wird immer auf denselben Token in der gesamten bereinigten Ausgabe abgebildet, sodass Beziehungen zwischen Nachbarn, VLANs und Port-Channels lesbar bleiben — nur die eigentliche Anmeldedaten wird ersetzt.

## Schritte

1. ScrubForge aus dem Chrome Web Store installieren (kostenlos)
2. `show running-config` auf dem Arista-Switch ausführen
3. Die Ausgabe in ScrubForge einfügen
4. Das bereinigte Ergebnis prüfen — Secrets, Community-Strings und Nachbar-Passwörter werden tokenisiert, die Struktur bleibt unangetastet
5. Kopieren und teilen, oder im integrierten KI-Chat von ScrubForge weitermachen

## Warum lokale Verarbeitung wichtig ist

Ein geteiltes MLAG-Secret oder ein TACACS+-Schlüssel, der in ein Support-Ticket oder ein geteiltes Chat-Protokoll eingefügt wird, bleibt dort unbegrenzt liegen. ScrubForge bereinigt vollständig innerhalb des Browser-Tabs — nichts wird hochgeladen, bevor man sich zum Teilen entscheidet.

## Verwandte Artikel

- [Netzwerkkonfiguration vor dem Teilen bereinigen](/de/blog/netzwerkkonfiguration-bereinigen/)
- [ScrubForge](/de/scrubforge/)
