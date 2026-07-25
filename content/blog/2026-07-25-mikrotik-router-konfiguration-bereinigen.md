---
schemaVersion: 1
title: "MikroTik-RouterOS-Konfiguration Vor Dem Teilen Bereinigen"
description: "MikroTik versteckt Passwörter in RouterOS-Exporten standardmäßig. Topologie und Serveradressen bleiben sichtbar. Das solltest du prüfen."
date: 2026-07-25
slug: mikrotik-router-konfiguration-bereinigen
locale: de
translationKey: sanitize-mikrotik-router-config
product: scrubforge
contentType: how-to
primaryKeyword: "MikroTik-Router-Konfiguration vor dem Teilen bereinigen"
relatedPages: /de/scrubforge/,/de/blog/was-die-sonicwall-panne-lehrt/,/de/ressourcen/
sourceUrls: https://help.mikrotik.com/docs/spaces/ROS/pages/380076066/List+of+menus+with+sensitive+parameters,https://help.mikrotik.com/docs/spaces/ROS/pages/328155/Configuration+Management,https://mikrotik.com/download/changelogs
heading: "MikroTik-RouterOS-Konfiguration Vor Dem Teilen Bereinigen"
shortTitle: "MikroTik-Konfiguration bereinigen"
intro: "RouterOS versteckt Passwörter in /export standardmäßig. Topologie, Kommentare und Serveradressen bleiben trotzdem in der Datei, die du in einem Forum, einem Ticket oder einem KI-Chat einfügst."
faqs:
  - question: "Ersetzt show-sensitive die Notwendigkeit, eine MikroTik-Konfiguration zu bereinigen?"
    answer: "Nein. show-sensitive steuert nur, ob RouterOS seine eigene, vordefinierte Liste sensibler Felder ausgibt — Passwörter, Schlüssel, Secrets. Alles andere im Export, einschließlich IP-Adressen, Kommentare und Serveradressen, bleibt so oder so sichtbar. Dafür ist ScrubForge da."
  - question: "Bricht das Bereinigen die Konfiguration, wenn ich sie wieder importieren muss?"
    answer: "Bereinige nur eine Kopie für die Diskussion, einen Forenbeitrag oder ein Support-Ticket — nicht die Datei, die du reimportieren willst. Ein Reimport braucht die echten Zugangsdaten, halte deinen Arbeitsexport also getrennt von der bereinigten Version, die du öffentlich teilst."
  - question: "Erkennt ScrubForge speziell RouterOS-Syntax?"
    answer: "Ja. RouterOS ist eine von zwölf Gerätesyntaxen, die von ScrubForges Musterbibliothek abgedeckt werden, neben Cisco, FortiGate, Juniper und Palo Alto."
  - question: "Was, wenn ich bereits eine unbereinigte MikroTik-Konfiguration gepostet habe?"
    answer: "Bearbeite oder lösche den Beitrag, wenn die Plattform das erlaubt, und rotiere danach jede offengelegte Zugangsdaten — Passwörter, Pre-Shared Keys, RADIUS-Secrets. Werte im Nachhinein zu ändern macht nicht ungeschehen, was sichtbar war, solange der Beitrag live war."
---

Einen Router-Konfigurationsexport in einem Forenthread oder einem Support-Ticket zu posten, ist Routinearbeit für Admins, und MikroTik-Admins haben diesen Monat viel davon getan: RouterOS 7.21.5 (Long-Term) und 6.49.20 erschienen beide am 6. Juli 2026, und ein Upgrade bedeutet meist, einen frischen `/export` zu ziehen, um vorher und nachher zu vergleichen.

> **Was show-sensitive tatsächlich versteckt**
> Standardmäßig maskiert `/export` Passwörter, Schlüssel und Secrets in einer dokumentierten Liste von Menüs — WireGuard-Schlüssel, RADIUS-Secrets, PPP-Passwörter, SNMP-Community-Passwörter und rund vierzig weitere Felder. IP-Adressen, Kommentare oder alles außerhalb dieser Liste bleiben unberührt.

## Was RouterOS bereits für dich versteckt

MikroTiks eigene Dokumentation ist hier eindeutig: Der `export`-Befehl "exportiert keine System-Benutzerpasswörter, installierten Zertifikate, SSH-Schlüssel, Dude- oder User-Manager-Datenbank", und alles andere, was als sensibel gilt, wird maskiert, sofern du nicht `show-sensitive` zum Befehl hinzufügst. Es gibt eine offizielle Referenztabelle, die genau auflistet, welches Menü und welches Feld versteckt wird: die [Liste der Menüs mit sensiblen Parametern](https://help.mikrotik.com/docs/spaces/ROS/pages/380076066/List+of+menus+with+sensitive+parameters) deckt WireGuard `private-key` und `preshared-key`, RADIUS `secret`, SNMP `authentication-password`, PPP `secret`, IPsec-Schlüssel, VRRP `password` und mehr ab.

Das ist ein wirklich nützliches Standardverhalten. Es lässt sich aber leicht so lesen, als sei "der Export überall gefahrlos einfügbar" — und das stimmt nicht ganz.

## Was ein "sauberer" Export trotzdem enthält

Eine feste Liste von Parameternamen zu maskieren, betrifft keinen Freitext oder irgendetwas außerhalb dieser Liste. Ein Standard-`/export` enthält weiterhin:

<div class="key-points">
  <h3>Nach show-sensitive-Maskierung weiterhin vollständig sichtbar</h3>
  <ul>
    <li>jede konfigurierte IP-Adresse, jedes Subnetz und jeder WAN-Peer-Endpunkt;</li>
    <li>Interface- und VLAN-Kommentare, die oft interne Systeme oder Kunden benennen;</li>
    <li>RADIUS-, NTP-, DNS- und SNMP-Serveradressen — die Adresse, nicht nur das Secret;</li>
    <li>SNMP-Community-Namen, wenn sie beschreibende Strings statt Passwörter sind;</li>
    <li>Systemidentität, Routing-Peers und Firewall-Adresslisten.</li>
  </ul>
</div>

Nichts davon ist ein Fehler. [MikroTiks eigener Leitfaden zum Konfigurationsmanagement](https://help.mikrotik.com/docs/spaces/ROS/pages/328155/Configuration+Management) zeigt in seinen eigenen Export-Beispielen realistisch wirkende interne Subnetze, weil genau diese Topologie für einen Import gebraucht wird. Nur möchtest du das nicht unbedingt einem Fremden im Forum oder einer externen Support-Warteschlange zusammen mit deiner öffentlichen IP zeigen.

## Bereinigen, bevor show-sensitive überhaupt eine Rolle spielt

<div class="step-card">
  <span class="step-label">Vorgehen</span>
  <strong>Exportieren, einfügen, prüfen, teilen</strong>
  <p>Führe wie gewohnt <code>/export file=config</code> aus — lass <code>show-sensitive</code> weg, du brauchst es für eine Support-Anfrage oder einen Forenbeitrag nicht. Öffne [ScrubForge](/de/scrubforge/), füge die Ausgabe ein, und es markiert zugangsdatenähnliche Strings passend zur RouterOS-Syntax und ersetzt jeden eindeutigen Wert durch ein konsistentes Token wie <code>[RADIUS_SECRET_1]</code>. Alles läuft lokal im Browser-Tab; nichts wird hochgeladen.</p>
</div>

| Vorher (roher Export) | Nachher (bereinigt) |
|---|---|
| `set 0 password=Adm1nR0S!` | `set 0 password=[PASSWORD_1]` |
| `secret="Sup3rShared" address=10.20.0.1` | `secret=[RADIUS_SECRET_1] address=10.20.0.1` |
| `private-key="wG9K...=="` | `private-key=[WG_KEY_1]` |

Die Peer-Adresse bleibt erhalten. Das ist es, was ein Foren-Leser oder ein Support-Mitarbeiter tatsächlich braucht, um zu helfen — nicht das Secret daneben.

## Dieselbe Gewohnheit funktioniert bei jedem Hersteller

Diesen Ablauf haben wir schon für Cisco- und FortiGate-Konfigurationen beschrieben. MikroTik ist eine von zwölf Herstellersyntaxen, die ScrubForge erkennt, neben Juniper und Palo Alto — gleiches Prinzip, jedes Mal andere Feldnamen. Wenn du in ein Support-Ticket statt in ein öffentliches Forum einfügst, gilt dieselbe Bereinigen-zuerst-Gewohnheit, bevor die Datei überhaupt deinen Rechner verlässt.

## Bevor du postest

Eine kurze Notiz neben dem bereinigten Export hilft: "Zugangsdaten durch Platzhalter-Token ersetzt; Struktur ist intakt." Das zeigt jedem, der den Thread liest, dass kein aktives Passwort darin steckt, und dauert zehn Sekunden.

## Häufig gestellte Fragen

### Ersetzt show-sensitive die Notwendigkeit, eine MikroTik-Konfiguration zu bereinigen?

Nein. show-sensitive steuert nur, ob RouterOS seine eigene, vordefinierte Liste sensibler Felder ausgibt — Passwörter, Schlüssel, Secrets. Alles andere im Export, einschließlich IP-Adressen, Kommentare und Serveradressen, bleibt so oder so sichtbar. Dafür ist ScrubForge da.

### Bricht das Bereinigen die Konfiguration, wenn ich sie wieder importieren muss?

Bereinige nur eine Kopie für die Diskussion, einen Forenbeitrag oder ein Support-Ticket — nicht die Datei, die du reimportieren willst. Ein Reimport braucht die echten Zugangsdaten, halte deinen Arbeitsexport also getrennt von der bereinigten Version, die du öffentlich teilst.

### Erkennt ScrubForge speziell RouterOS-Syntax?

Ja. RouterOS ist eine von zwölf Gerätesyntaxen, die von ScrubForges Musterbibliothek abgedeckt werden, neben Cisco, FortiGate, Juniper und Palo Alto.

### Was, wenn ich bereits eine unbereinigte MikroTik-Konfiguration gepostet habe?

Bearbeite oder lösche den Beitrag, wenn die Plattform das erlaubt, und rotiere danach jede offengelegte Zugangsdaten — Passwörter, Pre-Shared Keys, RADIUS-Secrets. Werte im Nachhinein zu ändern macht nicht ungeschehen, was sichtbar war, solange der Beitrag live war.
