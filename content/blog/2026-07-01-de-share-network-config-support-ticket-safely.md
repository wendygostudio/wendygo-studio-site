---
schemaVersion: 1
title: So teilen Sie die Netzwerkkonfiguration sicher mit Support-Tickets
description: >-
  Wenn Ihr Cisco-Router ausfällt oder Ihre FortiGate-Firewall anfängt,
  Datenverkehr zu verlieren, wenden Sie sich zunächst an den Support des
  Anbieters. Sie werden nach Ihrem... fragen.
date: 2026-07-01T00:00:00.000Z
slug: share-network-config-support-ticket-safely
locale: de
translationKey: share-network-config-support-ticket
product: scrubforge
contentType: how-to
primaryKeyword: Teilen Sie das Support-Ticket für die Netzwerkkonfiguration
relatedPages: '/de/scrubforge/,/de/blog/scrubforge-chatgpt-network-troubleshooting/'
---

Wenn Ihr Cisco-Router ausfällt oder Ihre FortiGate-Firewall anfängt, Datenverkehr zu verlieren, wenden Sie sich zunächst an den Support des Anbieters. Sie werden nach Ihrer laufenden Konfiguration fragen. Dies ist der schnellste Weg, das Problem zu diagnostizieren. Der Haken: Ihre Konfiguration enthält aktive Anmeldeinformationen, die Ihr Netzwerk nicht verlassen sollten.

ScrubForge löst genau dieses Problem: Lokal desinfizieren und dann die saubere Version an Ihr Support-Ticket anhängen.

## Warum Rohkonfigurationen in Support-Tickets ein Risiko darstellen

Wenn Sie eine Konfigurationsdatei per E-Mail senden oder sie an einen Cisco TAC-Fall, ein Jira-Ticket oder ein Anbieter-Supportportal anhängen, gelangt diese Datei in ein System, das Sie nicht vollständig kontrollieren können. Abhängig von den Sicherheitspraktiken des Anbieters können Ihre Anmeldeinformationen wie folgt lauten:

- Angemeldete Support-Systemdatenbanken
- Für Support-Mitarbeiter zugänglich
- Länger als erwartet gespeichert
- Wird zum Debuggen von internen Teams geteilt

Nichts davon ist ungewöhnlich. Die meisten Enterprise-Supportsysteme sind einigermaßen sicher. Eine Produktions-Firewall-Konfiguration mit Live-VPN-Schlüsseln und Administratorkennwörtern muss jedoch überhaupt nicht in einer Support-Datenbank vorhanden sein. Der Anbieter benötigt nicht Ihre Anmeldeinformationen, um Fehler in Ihrer Konfiguration zu beheben – er benötigt die Struktur.

## Der ScrubForge + Support-Ticket-Workflow

1. **Exportieren Sie Ihre Konfiguration** – Auf Cisco IOS: „show running-config“. Auf FortiGate: System > Konfiguration > Herunterladen.
2. **ScrubForge öffnen** – Klicken Sie auf das Symbol in Ihrer Chrome-Symbolleiste.
3. **Einfügen und bereinigen** – Rohkonfiguration einfügen. ScrubForge ersetzt Passwörter, Schlüssel, Token und SNMP-Strings durch konsistente Platzhalter wie „[PSK_1]“ oder „[ADMIN_PASS_1]“.
4. **Überprüfung** – Scannen Sie die Ausgabe auf alles, was wie Live-Anmeldeinformationen aussieht. Eine 30-Sekunden-Kontrolle ist eine gute Praxis.
5. **An Ticket anhängen** – Kopieren Sie die bereinigte Ausgabe in Ihr Support-Ticket oder Ihre E-Mail oder speichern Sie sie als „.txt“-Datei und laden Sie sie hoch.

## Was Sie in Ihr Support-Ticket aufnehmen sollten

Fügen Sie beim Anhängen einer bereinigten Konfiguration eine einzeilige Notiz hinzu:

> „Konfiguration angehängt. Anmeldeinformationen wurden bereinigt (durch konsistente Platzhaltertokens ersetzt; Struktur und Logik sind intakt).“

Dadurch wird dem Supporttechniker mitgeteilt, was er sieht und warum er keine Live-Werte sieht.

Die meisten Support-Techniker werden es sofort verstehen. Sie wissen, dass die Struktur für die Fehlerbehebung entscheidend ist – Routing-Protokolle, VPN-Peer-IPs, Firewall-Richtlinien, Schnittstellenkonfigurationen. Keines davon sind Zeugnisse.

## Vorher und Nachher

```
--- VORHER (roh) ---
Krypto-Isakmp-Schlüssel T@nn3lS3cr3t Adresse 198.51.100.10
Benutzername Admin-Passwort Cisco123
Öffentliches RO der SNMP-Server-Community

--- NACH (desinfiziert) ---
Krypto-Isakmp-Schlüssel [PSK_1] Adresse 198.51.100.10
Benutzername Admin-Passwort [ADMIN_PASS_1]
SNMP-Server-Community [SNMP_RO_1] RO
```

Die Peer-IP, Schnittstellennamen und Richtlinien bleiben erhalten. Die Anmeldeinformationen nicht.

## Dies funktioniert mit jedem Anbieter

Ob Cisco, FortiGate, Palo Alto, Juniper oder pfSense, das Prinzip ist dasselbe: Bereinigen Sie textbasierte Konfigurationen vor dem Teilen. ScrubForge erkennt gängige Anmeldeinformationsmuster in jedem textbasierten Format.

---

### Häufig gestellte Fragen

**F: Kann der Supporttechniker weiterhin Fehler beheben, wenn Anmeldeinformationen ersetzt werden?**
A: Ja. Supporttechniker beheben Fehler in der Konfigurationslogik – Routing, VPN-Einstellungen, Firewall-Richtlinien. Nichts davon hängt davon ab, den tatsächlichen Wert der Anmeldeinformationen zu sehen. Die bereinigte Konfiguration bietet ihnen alles, was sie brauchen.

**F: Was passiert, wenn das Support-Ticket-System Dateien auf unbestimmte Zeit speichert?**
A: Der Vorteil der Bereinigung vor dem Hochladen besteht darin, dass das Ticket keine Live-Anmeldeinformationen enthält, selbst wenn es nie gelöscht wird oder später darauf zugegriffen wird. Sie haben die Verbindung zwischen Ihrem laufenden Netzwerk und der Support-Datenbank unterbrochen.

**F: Beeinflusst ScrubForge Netzwerk-IP-Adressen?**
A: Nein. Standardmäßig ersetzt ScrubForge Anmeldeinformationsmuster – Passwörter, Schlüssel, Token, SNMP-Strings – nicht IP-Adressen. Ihre Netzwerktopologie, Peer-IPs und Subnetze bleiben intakt, und das ist genau das, was Supporttechniker sehen müssen.

---

### Installieren Sie ScrubForge

Kostenlose, lokale Bereinigung für jede textbasierte Konfiguration. Fügen Sie Anmeldeinformationen ein, entfernen Sie sie und geben Sie sie dann sicher an den Support des Anbieters, in Foren oder an ein externes System weiter – kein Konto, kein Upload, keine Server von Drittanbietern.

<a href="https://chromewebstore.google.com/detail/pjaohhipefhjfopoaepjbmiienagaffe">Install ScrubForge on Chrome →</a>

**Verwandt:** [So verwenden Sie ScrubForge mit ChatGPT zur Netzwerk-Fehlerbehebung](/blog/scrubforge-chatgpt-network-troubleshooting/)
